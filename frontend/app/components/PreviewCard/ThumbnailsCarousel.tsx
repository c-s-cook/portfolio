"use client"

import NextImage from "next/image";
import { ReactElement } from "react";
import type { Project, ImageURL } from "../../../lib/types";

interface ThumbnailsCarouselProps {
    thumbnails: ImageURL[];
    project: Project;
}

/**
 * Renders the carousel of thumbnail images for a preview card.
 * Handles S3 to CDN URL replacement and image lazy loading.
 */
export const ThumbnailsCarousel = ({ thumbnails, project }: ThumbnailsCarouselProps): ReactElement => {
    return (
        <div className="thumbnails">
            {thumbnails.map((img, index) => {
                if (!img.url) return null;

                // Replace S3 URLs with CDN URLs if needed
                const src = process.env.NEXT_PUBLIC_S3_IMG_BUCKET
                    ? (img.url as string).replace(process.env.NEXT_PUBLIC_S3_IMG_BUCKET, `${process.env.NEXT_PUBLIC_IMG_BUCKET_CDN}/`)
                    : img.url;

                // Generate caption if not provided
                const caption = img.caption || `An image ${index + 1} for ${project.title} showing Christopher Cook's work as a Full Stack application developer.`;

                return (
                    <NextImage
                        src={src}
                        width={200}
                        height={200}
                        alt={caption}
                        key={index}
                        style={{
                            zIndex: `${index * -1}`,
                            left: `${index * 100}%`
                        }}
                        sizes="500px"
                    />
                );
            })}
        </div>
    );
};
