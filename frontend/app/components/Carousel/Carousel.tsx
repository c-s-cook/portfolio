"use client"

import React, { useEffect, useRef, useState } from "react";
import type { ImageURL } from "../../../lib/types";
import NextImage from "next/image";
import "./Carousel.css";
import { createPortal } from "react-dom";

type Props = {
    images: ImageURL[];
    interval?: number; // ms
    autoPlay?: boolean;
    holdOnFeatured?: number; // multiplier for interval, defaults to 2
};

export default function Carousel({ images, interval = 3000, autoPlay = true, holdOnFeatured = 2 }: Props) {
    const count = images?.length ?? 0;
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [reversed, setReversed] = useState<boolean>(false);
    const lastTouchRef = useRef<{ x: number; t: number } | null>(null);
    const lastTapRef = useRef<number>(0);
    const autoplayRef = useRef<number | null>(null);
    const unpauseRef = useRef<any>(null);

    const isMobile = typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)").matches : false;


    // replace S3 img urls with CloudFront URLS
    // images = images.map((img: ImageURL) => {
    //     if (img.url?.includes(process.env.IMG_BUCKET_CDN)) return img;
    //     if (img.url?.includes(process.env.S3_IMG_BUCKET)) {
    //         console.log("Replacing S3 URL with CDN URL for image:", img.url);
    //         return {
    //             ...img,
    //             url: img.url?.replace(process.env.S3_IMG_BUCKET, `${process.env.IMG_BUCKET_CDN}/`) || null
    //         };
    //     }
    // });

    /**
     *  SORT IMAGES[]
     *      - in case it has a featured/starred image that is not already at index 0
     */
    const sortFeaturedImages = (tempImages: ImageURL[]) => {

        if (tempImages.find((i) => i.starred)) {
            tempImages.reverse().sort((a, b) => {
                if (a.starred && !b.starred) return -1;
                else if (a.starred && b.starred) return 0;
                else return 1;
            });
        }
        return [...tempImages];
    }

    images = sortFeaturedImages(images);


    /**
     *  MAIN AUTOPLAY FUNCTIONS
     */
    useEffect(() => {

        // clear autoplay when paused or when lightbox is opened
        if (autoplayRef.current && (paused || lightboxOpen)) {
            window.clearTimeout(autoplayRef.current);
            autoplayRef.current = null;
        }
        // otherwise, cue carousel to advance...
        else if (autoPlay && !paused && !lightboxOpen && count > 1) {

            // if images[] has a featured/starred image, hold on it for twice as long...
            let linger: number = images[index].starred ? holdOnFeatured : 1;

            // set a timeout to update index, setting up a recursive loop
            window.clearTimeout(autoplayRef.current);
            autoplayRef.current = window.setTimeout(() => {
                if (!reversed) setIndex((i) => (i + 1) % count);
                else setIndex((i) => ((((count - i) % count) * -1) - 1) + count);
            }, interval * linger);
        }

        return () => { };
    }, [index, paused, lightboxOpen, autoPlay, interval, count]);


    /**
     *  keyboard navigation for lightbox
     */
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (!lightboxOpen) return;
            if (e.key === "Escape") setLightboxOpen(false);
            if (e.key === "ArrowRight") setLightboxIndex((s) => (s + 1) % count);
            if (e.key === "ArrowLeft") setLightboxIndex((s) => (s - 1 + count) % count);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [lightboxOpen, count]);

    useEffect(() => {
        // lock body scroll while lightbox is open
        if (typeof document === "undefined") return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = lightboxOpen ? "hidden" : prev;
        return () => {
            document.body.style.overflow = prev;
        };
    }, [lightboxOpen]);

    function go(to: number) {
        setIndex(((to % count) + count) % count);
        pauseForInteraction();
    }
    function next() {
        setIndex((s) => (s + 1) % count);
        setReversed(false);
        pauseForInteraction();
    }
    function prev() {
        setIndex((s) => (s - 1 + count) % count);
        setReversed(true);
        pauseForInteraction();
    }

    function pauseForInteraction() {
        console.log("pausing for interaction...?");
        if (paused) clearTimeout(unpauseRef.current);
        setPaused(true);
        unpauseRef.current = setTimeout(() => {
            setPaused(false);
            console.log('Unpausing Interval has ticked...');
            unpauseRef.current = null;
        }, 10000);
    }

    function openLightboxAt(i: number) {
        setLightboxIndex(i);
        setLightboxOpen(true);
        setPaused(true);
    }

    // mouse handlers (desktop)
    function onMouseEnter() {
        if (!isMobile) setPaused(true);
    }
    function onMouseLeave() {
        if (!isMobile && !unpauseRef.current) setPaused(false);
    }

    // touch handlers (mobile)
    function onTouchStart(e: React.TouchEvent) {
        const t = Date.now();
        const x = e.touches[0]?.clientX ?? 0;
        // detect double-tap
        const dt = t - (lastTapRef.current || 0);
        if (dt > 0 && dt < 300) {
            // double-tap -> open lightbox
            openLightboxAt(index);
            lastTapRef.current = 0;
            return;
        }
        lastTapRef.current = t;
        lastTouchRef.current = { x, t };
    }

    function onTouchMove(e: React.TouchEvent) {
        // prevent default only when swiping horizontally to avoid scroll hijack? keep basic implementation.
    }

    function onTouchEnd(e: React.TouchEvent) {
        const touchEndX = e.changedTouches[0]?.clientX ?? 0;
        const last = lastTouchRef.current;
        if (!last) return;
        const dx = touchEndX - last.x;
        const dt = Date.now() - last.t;
        const threshold = 40; // px
        const timeThreshold = 500; // ms
        if (Math.abs(dx) > threshold && dt < timeThreshold) {
            if (dx < 0) {
                next();
            } else {
                prev();
            }
        } else {
            // treat as single tap -> toggle pause
            //   setPaused((p) => !p);
            pauseForInteraction();
        }
        lastTouchRef.current = null;
    }

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div
            className="carousel"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className="carousel-viewport" role="region" aria-roledescription="carousel" aria-label="Image carousel">
                <div className="carousel-slides">
                    {images.map((img, i) => {
                        if (!img.url) return null;

                        // are we still checking for S3 URLs that need to be replaced with CDN URLs? if so, do it here. Otherwise, just use the img.url as is.
                        const src = process.env.NEXT_PUBLIC_S3_IMG_BUCKET
                            ? (img.url as string).replace(process.env.NEXT_PUBLIC_S3_IMG_BUCKET, `${process.env.NEXT_PUBLIC_IMG_BUCKET_CDN}/`)
                            : img.url;

                        const proxySrc = `../../api/image-proxy?url=${encodeURIComponent(src)}`;
                        const active = i === index; // boolean - does this match the autoplay index?
                        return (
                            <div
                                key={i}
                                className={`carousel-slide${active ? " active" : ""}`}
                                aria-hidden={!active}
                                onClick={() => {
                                    // on desktop click opens lightbox; on mobile double-tap handled separately
                                    if (!isMobile) openLightboxAt(i);
                                }}
                            >
                                <img
                                    // src={src} 
                                    src={proxySrc}
                                    alt={img.caption ?? img.name ?? `Image ${i + 1}`}
                                    className="carousel-image"
                                    width={600}
                                    height={600}
                                    sizes="(max-width: 768px) 300px, 600px"
                                />
                            </div>
                        );
                    })}
                </div>

                {/* arrows */}
                {count > 1 && (
                    <>
                        <button className="carousel-arrow left" aria-label="Previous image" onClick={prev}>&#10094;</button>
                        <button className="carousel-arrow right" aria-label="Next image" onClick={next}>&#10095;</button>
                    </>
                )}

                {/* dots: moved inside the viewport so they overlay the images at the bottom center */}
                {count > 1 && (
                    <div className="carousel-dots" role="tablist" aria-label="Slides">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                className={`carousel-dot${i === index ? " active" : ""}`}
                                aria-label={`Go to slide ${i + 1}`}
                                aria-current={i === index}
                                onClick={() => {
                                    go(i);
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* caption area: stacked caption items fade in/out with slides */}
            <div className="carousel-caption-wrap" aria-hidden={false}>
                <div className="carousel-caption">
                    {images.map((img, i) => (
                        <div key={i} className={`carousel-caption-item${i === index ? " active" : ""}`}>
                            {img.caption ?? ""}
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox - render as a portal into document.body so it covers the full viewport */}
            {lightboxOpen && typeof document !== "undefined" &&
                createPortal(
                    <div className="carousel-lightbox" role="dialog" aria-modal="true" aria-label="Image lightbox" onClick={() => setLightboxOpen(false)}>
                        <div className="carousel-lightbox-content" onClick={(e) => e.stopPropagation()}>
                            <button className="lightbox-close" aria-label="Close" onClick={() => setLightboxOpen(false)}>&times;</button>
                            <button className="lightbox-arrow left" aria-label="Previous" onClick={() => setLightboxIndex((s) => (s - 1 + count) % count)}>&#10094;</button>
                            <div className="lightbox-image-wrap">
                                <NextImage
                                    src={images[lightboxIndex]?.url ?? ""}
                                    alt={images[lightboxIndex]?.caption ?? images[lightboxIndex]?.name ?? ""}
                                    className="lightbox-image"
                                    width={900}
                                    height={900}
                                    sizes="(max-width: 768px) 300px, 900px"
                                />
                            </div>
                            <button className="lightbox-arrow right" aria-label="Next" onClick={() => setLightboxIndex((s) => (s + 1) % count)}>&#10095;</button>

                            {/* lightbox caption */}
                            <div className="lightbox-caption">
                                {images[lightboxIndex]?.caption ?? ""}
                            </div>

                            <div className="lightbox-thumbs">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        className={`lightbox-thumb${i === lightboxIndex ? " active" : ""}`}
                                        onClick={() => setLightboxIndex(i)}
                                        aria-label={`Open image ${i + 1}`}
                                    >
                                        <NextImage
                                            src={img.url ?? ""}
                                            alt={img.name ?? ""}
                                            width={100}
                                            height={100}
                                            sizes="(max-width: 768px) 100px, 200px"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
        </div>
    );
}
