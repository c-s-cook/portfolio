"use client"

import Link from "next/link";
import "./PreviewCard.css";
import { ReactElement, useEffect, useRef, useState, Suspense } from "react";
import animationEase from "../../../lib/animationEase";
import { ThumbnailsCarousel } from "./ThumbnailsCarousel";
import { ThumbnailsCarouselFallback } from "./ThumbnailsCarouselFallback";

import type { Project, Certification, PreviewCardProps, ImageURL } from "../../../lib/types"



// Creating a default Project prop for dev purposes
const defaultProject: Project = {
    type: 'PROJ',
    id: 1,
    title: "This is a Demo Title",
    repoUrl: "/",
    slug: 'demo-proj',
    thumbnails: [
        {
            url: "/img/csc-cook-dev-sample-01.jpg",
            alt: "Demo image number the first"
        },
        {
            url: "/img/csc-cook-dev-sample-02.jpg",
            alt: "Demo image number the second"
        },
        {
            url: "/img/csc-cook-dev-sample-03.jpg",
            alt: "Demo image number the third"
        },
        {
            url: "/img/csc-cook-dev-sample-04.jpg",
            alt: "Demo image number the fourth"
        },
    ],
    body: "",
    snippet: "This is a snippet of text that should get cut off if there is too much and too lengthy a run of words here. Hopefully I can use a cut-off item for a read more element.",
    tags: ["React", "MongoDB", "Kubernetes", "Node.js"]
}

/**
 * 
 * @param   {number}                cardID      Unique. Acts as a key for distinguishing each card in a collection of cards.
 * @param   {Project | Credential}  project     All the necessary info for the compontent, as defined by the interface (..do I need to write this?)
 * @param   {number}                slideinterval    Optional. In seconds, how quickly the thumbnails should rotate. DEFAULT: 2.5
 * @returns {ReactNode}
 */


const PreviewCard = ({ cardID, project, slideinterval = 2.5, observerOptions }: PreviewCardProps): ReactElement => {

    const ref = useRef(null);
    // const [isActive, setIsActive] = useState<string>('');
    // const [isObserved, setIsObserved] = useState<string>('');

    if (observerOptions) { var { updateObserved, observerClasses } = observerOptions; }
    else var observerClasses = 'active';


    const shuffleThumbs = (card: HTMLBodyElement) => {



        let thumbs: Element = card.getElementsByClassName("thumbnails")[0];

        if (!thumbs || thumbs.children.length < 2 || !thumbs.firstChild || !thumbs.lastChild || !(thumbs.firstChild as HTMLImageElement).style.left) return;

        console.log('shuffling thumbs for card ', cardID, new Date().toLocaleDateString());

        // Attempting Re-ordering...
        if ((thumbs.firstChild as HTMLImageElement).style.left != "0%") {
            let reordered = (thumbs.firstChild as HTMLImageElement);
            reordered.style.zIndex = "-1";
            thumbs.removeChild(thumbs.firstChild);
            thumbs.appendChild(reordered);
            (thumbs.lastChild as HTMLImageElement).style.left = `${(thumbs.children.length - 1) * 100}%`;
        }

        // Sliding the thumbnails over...
        for (let i = 0; i < thumbs.children.length; i++) {
            (thumbs.children[i] as HTMLImageElement).style.zIndex = `${i * -1}`;
            (thumbs.children[i] as HTMLImageElement).style.left = `${(i - 1) * 100}%`;
        }
    }


    useEffect(() => {

        let shuffleInterval;

        const startShuffle = (e: UIEvent) => {
            e.preventDefault();
            shuffleThumbs(e.target as HTMLBodyElement);

            if (!shuffleInterval) {
                shuffleInterval = setInterval(shuffleThumbs, slideinterval * 1000, e.target);
            }
        }

        const stopShuffle = (e: UIEvent) => {
            e.preventDefault();

            clearInterval(shuffleInterval);
            console.log('stopped shuffle for card ', cardID, new Date().toLocaleDateString());
            shuffleInterval = null;
        }

        
        const card = ref.current;

        if (project.thumbnails.length > 1) {
            ref.current && console.log(ref.current.id, new Date().toLocaleString());
            ref.current?.addEventListener('mouseenter', startShuffle);
            ref.current?.addEventListener('mouseleave', stopShuffle, false);
        }
        



        // 
        // IntersectionObserver for mobile / responsive layout
        // 

        if (!observerOptions) return;

        const toggleActiveCard = (entries) => {
            if (typeof updateObserved === 'function') updateObserved(cardID, entries[0].isIntersecting);
        }

        let cardObserverOptions = {
            root: null,
            rootMargin: "-25% 0% -15% 0%",
            threshold: .5,
        };

        const observer = new IntersectionObserver(toggleActiveCard, cardObserverOptions);
        let mobileObservation = (screenWidth) => {

            if (screenWidth.matches) ref.current &&observer.observe(ref.current);
            else ref.current && observer.unobserve(ref.current);
        }

        let screenWidth = window.matchMedia("(max-width: 768px)");
        mobileObservation(screenWidth);
        const checkMobile = () => mobileObservation(screenWidth);

        // Attach listener function on state changes
        screenWidth.addEventListener("change", checkMobile);


        // Cleanup function
        return () => {
            console.log('cleaning up observers & Intervals for card ', cardID, new Date());
            clearInterval(shuffleInterval);
            ref.current?.removeEventListener('mouseenter', startShuffle);
            ref.current?.removeEventListener('mouseleave', stopShuffle, false);
            screenWidth.removeEventListener("change", checkMobile);
            observer.disconnect();
        }
    }, [])



    project = !project ? defaultProject : project;
    let type = project.type == 'PROJ' ? 'projects' : 'certifications';
    // Strip HTML tags and return plain text
    const stripHTML = (html: string = ""): string =>
        html
            .replace(/<\/?[^>]+(>|$)/g, "")
            .replace(/[\r\n]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();




    return (
        <>
            <Link href={`/${type}/${project.slug}`} key={"preview-card-link-" + cardID}>
                <div ref={ref} className={`preview-card with-background ${observerClasses}`} id={"preview-card-" + cardID} key={`preview-card-${cardID}`} style={{ animationDelay: `${animationEase(cardID)}s` }}>
                    <Suspense fallback={<ThumbnailsCarouselFallback />}>
                        <ThumbnailsCarousel thumbnails={project.thumbnails} project={project} />
                    </Suspense>

                    <h3>{project.title}</h3>
                    <div className="preview-snippet">
                        {project.snippet && (<p>{project.snippet}</p>)}
                        {!project.snippet && project.body && (<p>{stripHTML(project.body.slice(0, 200))}</p>)}
                        {/* <p >{project.snippet}</p> */}
                    </div>
                    <div className="tags">
                        <ul>
                            {project.tags.map((tag, index) => {
                                return <li key={index}>{tag}</li>
                            })}

                        </ul>
                    </div>
                    <button>READ MORE</button>

                </div>
            </Link>
        </>
    );
}

export default PreviewCard;