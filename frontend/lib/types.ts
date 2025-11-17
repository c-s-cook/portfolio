
// 
//  for Auth processes APIs
// 
export type AuthType = "SIGN-UP" | 'LOG-IN' | 'LOG-OFF' | 'VERIFY' | 'RE-VERIFY' | 'REQUEST-RESET' | 'RESET';



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
}

export interface ImageURL {
    name: string;
    url: string | null;
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
    cardID: number,
    project: Project | Certification,
    slideinterval: number
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