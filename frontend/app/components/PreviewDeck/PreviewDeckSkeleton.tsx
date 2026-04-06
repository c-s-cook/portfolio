import { PreviewCardSkeleton } from '@components/PreviewCard/PreviewCardSkeleton';
import './PreviewDeck.css';

export const PreviewDeckSkeleton = () => {
    return (
        <>
        <div className="preview-search skeleton">    </div>
        <div className="body preview-deck skeleton">
            <PreviewCardSkeleton />
            <PreviewCardSkeleton />
            <PreviewCardSkeleton />

        </div>
        </>
        
    );
}