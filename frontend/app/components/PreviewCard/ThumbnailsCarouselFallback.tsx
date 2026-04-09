import { ReactElement } from "react";

/**
 * Fallback component displayed while thumbnails carousel is loading.
 * Shows a shimmer animation using the existing suspense-loading-animation CSS class.
 */
export const ThumbnailsCarouselFallback = (): ReactElement => {
    return (
        <div className="thumbnails suspense-loading-animation" />
    );
};
