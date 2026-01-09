
// 
//  for Auth processes APIs

import { SetStateAction } from "react";

// 
export type AuthType = "SIGN-UP" | 'LOG-IN' | 'LOG-OFF' | 'VERIFY' | 'RE-VERIFY' | 'REQUEST-RESET' | 'RESET' | 'AUTH-CHECK';



// 
//  for Project & Certifications
// 
export interface PortfolioItem {
    type: 'PROJ' | 'CERT',
    id: number,
    title: string,
    slug: string,
    tags: Array<string>,
    body: string,
    snippet?: string,
    // thumbnails: Array<object>,
    thumbnails: ImageURL[],
    repoUrl?: string,
    isDemo?: boolean
}

export interface ImageURL {
    name?: string;
    url: string | null;
    alt?: string;
    data?: JSON | null;
    ogName?: string;
    caption?: string;
    starred?: boolean;
}

export interface Project extends PortfolioItem {
    liveUrl?: string,
};

export interface Certification extends Project {
    certUrl: string,
    date: Date | string,
}

export interface PreviewCardProps {
    key: string,
    cardID: number,
    project: Project | Certification,
    slideinterval: number,
    observerOptions?: {
        updateObserved: Function,
        observerClasses: string
    }
    // addedClasses?: string,
    // updateObserved?: Function,
    // activeCards?: string[],
    // setActiveCards?: React.Dispatch<SetStateAction<string[]>>,
    // observedCards?: string[],
    // setObservedCards?: React.Dispatch<SetStateAction<string[]>>,
}

export interface UniqueTag {
    tag: string,
    count: number
}

export interface Portfolio {
    projects: Array<Project>,
    certifications: Array<Certification>,
    uniqueTags: Array<UniqueTag>
}

export interface PublishingError {
    text: string | null,
    warn: '' | 'warn'
}

export interface PublishingErrors {
    title?: PublishingError | null,
    content?: PublishingError | null,
    tags?: PublishingError | null,
    certDate?: PublishingError | null,
    certUrl?: PublishingError | null,
    repoUrl?: PublishingError | null,
    liveUrl?: PublishingError | null,
    thumbnails?: PublishingError | null
}