import { ReactElement } from 'react';
import './PreviewCard.css';

export const PreviewCardSkeleton = (): ReactElement => {
    return (
        <div className="preview-card skeleton with-background">
            <div className="thumbnails suspense-loading-animation"></div>
            <h3 className='suspense-loading-animation'></h3>
             <div className="preview-snippet suspense-loading-animation">Qui quo molestiae non. Sit voluptatem sit rerum ut. Quo et vel et est. Alias excepturi non aut id rerum nulla mollitia.</div>
             <div className="tags">
                <ul>
                    <li className="suspense-loading-animation"></li>
                    <li className="suspense-loading-animation"></li>
                    <li className="suspense-loading-animation"></li>
                </ul>
             </div>
             <button>READ MORE</button>
        </div>
    );
}