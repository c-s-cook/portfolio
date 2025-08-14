
// 
//  for Auth processes APIs
// 
export type AuthType = "SIGN-UP" | 'LOG-IN' | 'LOG-OFF' | 'VERIFY' | 'RE-VERIFY';



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
    thumbnails: Array<object>,
    repoUrl?: string,
}

export interface Project extends PortfolioItem {
    liveUrl?: string,
};

export interface Certification extends Project {
    certUrl: string,
    date: Date,
}

export interface PreviewCardProps {
    cardID: number,
    project: Project | Certification,
    slideinterval: number
}