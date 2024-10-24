"use client"

import Image from "next/image";
import Link from "next/link";
import "./PreviewCard.css";
import { ReactElement, useEffect, useRef } from "react";

export interface Project {
    title: string,
    url: string,
    thumbnails: Array<object>,
    snippet: string,
    tags: Array<string>,
};

export interface Certification extends Project {
    date: Date,
}

export interface PreviewCardProps {
    cardID: number,
    project: Project | Certification,
    interval: number
}


// Creating a default Project prop for dev purposes
const defaultProject: Project = {
    title: "This is a Demo Title",
    url: "/",
    thumbnails: [
        {
            src: "/img/IMG-20210110-WA0000.jpg",
            alt: "Picture of the author & child at play"
        },
        {
            src: "/img/IMG-20210110-WA0001.jpg",
            alt: "2nd pic of the author & child at play"
        },
        {
            src: "/img/IMG-20210110-WA0002.jpg",
            alt: "3rd photo of the author & child at play"
        },
    ],
    snippet: "This is a snippet of text that should get cut off if there is too much and too lengthing a run of words here. Hopefully I can use a cut-off item for a read more element.",
    tags: [ "React", "MongoDB", "Kubernetes", "Node.js" ]
}

/**
 * 
 * @param   {number}                cardID      Unique. Acts as a key for distinguishing each card in a collection of cards.
 * @param   {Project | Credential}  project     All the necessary info for the compontent, as defined by the interface (..do I need to write this?)
 * @param   {number}                interval    Optional. In seconds, how quickly the thumbnails should rotate. DEFAULT: 2.5
 * @returns {ReactNode}
 */


const PreviewCard = ({ cardID, project, interval = 2.5 }: PreviewCardProps): ReactElement => {

    const ref = useRef(null);
    

    const shuffleThumbs = (card: HTMLBodyElement) => {
        

        let thumbs:Element = card.getElementsByClassName("thumbnails")[0];

        // Attempting Re-ordering...
        if (thumbs.firstChild.style.left != "0%"){
            let reordered = thumbs.firstChild;
            reordered.style.zIndex = "-1";
            thumbs.removeChild(thumbs.firstChild);
            thumbs.appendChild(reordered);
            thumbs.lastChild.style.left = `${(thumbs.children.length - 1) * 100}%`;            
        }

        // Sliding the thumbnails over...
        for(let i=0; i < thumbs.children.length; i++){
            thumbs.children[i].style.zIndex = "0";
            thumbs.children[i].style.left = `${(i-1) * 100}%`;
        }
    }


    useEffect(() => {

        let shuffleInterval;

        const startShuffle = (e: UIEvent) => {
            e.preventDefault();  
            shuffleThumbs(e.target);
            
            if(!shuffleInterval){ 
                shuffleInterval = setInterval(shuffleThumbs, interval*1000, e.target); 
            }
        }
    
        const stopShuffle = (e: UIEvent) => {
            e.preventDefault();
            
            clearInterval(shuffleInterval);
            shuffleInterval = null;    
        }

        const card = ref.current;

        card.addEventListener('mouseenter', startShuffle);
        card.addEventListener('mouseleave', stopShuffle, false);

        // IntersectionObserver for Phone /responsive layout

        const toggleActiveCard = (entries) => {
            if(entries[0].isIntersecting){
                card.classList.add("active");
            } else {
                card.classList.remove("active");
            }
        }

        let cardObserverOptions = {
            root: null,
            rootMargin: "-30% 0% -30% 0%",
            threshold: 0,
        };

        const observer = new IntersectionObserver(toggleActiveCard, cardObserverOptions);
        observer.observe(card);


    }, [])
    
    project = !project ? defaultProject : project;
    
    return ( 
        <>
        <Link href="/">
        <div ref={ref} className="preview-card with-background" id={"preview-card-" + cardID}>
        <div className="thumbnails">
                { project.thumbnails.map((img, index) => {
                    return (
                        <Image
                            src={img.src}
                            width={500}
                            height={500}
                            alt={img.alt}
                            key={index}
                            style={{
                                zIndex: `${(index*-1)}`,
                                left: `${index*100}%`
                            }}
                        />
                    )

                })}

            </div>
            
            <h3>{project.title}</h3>
            <div className="preview-snippet">
                <p >{project.snippet}</p>
            </div>
            <div className="tags">
                <ul>
                    { project.tags.map((tag, index) => {
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