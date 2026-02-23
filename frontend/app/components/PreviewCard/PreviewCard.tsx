"use client"

import NextImage from "next/image";
import Link from "next/link";
import "./PreviewCard.css";
import { ReactElement, useEffect, useRef, useState } from "react";
import animationEase from "../../../lib/animationEase";

import type { Project, Certification, PreviewCardProps } from "../../../lib/types"



// Creating a default Project prop for dev purposes
const defaultProject: Project = {
    type: 'PROJ',
    id: 1,
    title: "This is a Demo Title",
    repoUrl: "/",
    slug: 'demo-proj',
    thumbnails: [
        {
            url: "/img/IMG-20210110-WA0000.jpg",
            alt: "Picture of the author & child at play"
        },
        {
            url: "/img/IMG-20210110-WA0001.jpg",
            alt: "2nd pic of the author & child at play"
        },
        {
            url: "/img/IMG-20210110-WA0002.jpg",
            alt: "3rd photo of the author & child at play"
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
            (thumbs.children[i] as HTMLImageElement).style.zIndex = "0";
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
            shuffleInterval = null;
        }

        const card = ref.current;

        if (project.thumbnails.length > 1) {
            card.addEventListener('mouseenter', startShuffle);
            card.addEventListener('mouseleave', stopShuffle, false);
        }



        // IntersectionObserver for Phone /responsive layout
        if(!observerOptions) return;

        const toggleActiveCard = (entries) => {


            if (typeof updateObserved === 'function') {

                // if(entries[0].isIntersecting){
                //     card.style.color = 'red';
                // } else {
                //     card.style.color = 'black';
                // }

                updateObserved(cardID, entries[0].isIntersecting);
            }

            // setObservedCards((prevCards) => {
            //     let newCards = [...prevCards];

            //     newCards[cardID] = entries[0].isIntersecting ? 'observed' : ''

            //     return [...newCards]
            // })


            // if (entries[0].isIntersecting) {
            //     // card.classList.add("active");
            //     // card.classList.add("observed");

            //     setIsObserved('observed');
            //     console.log(card.id, ' is observed.');
            //     // let activeCards = document.querySelectorAll('.preview-card.active');
            //     // if(activeCards.length == 0){

            //     // }
            //     // console.log();
            //     // console.log(!(document.querySelector('.preview-card.active')));
            //     // if(!(document.querySelector('.preview-card.active'))) card.classList.add('active');
            // } else {
            //     // card.classList.remove("active");
            //     setIsObserved('');
            //     console.log(card.id, 'is NOT observed');

            //     // card.classList.remove("observed");
            //     // if(card.classList.contains('active')){
            //     //     card.classList.remove('active');
            //     //     let nextCard = document.querySelector('.preview-card.observed');
            //     //     console.log('adding ACTIVE to ', nextCard.id)
            //     //     nextCard.classList.add('active');
            //     // }
            // }


            // let activeCards = document.querySelectorAll('.preview-card.active');
            // activeCards.forEach((card) => {
            //     if (entries[0] !== card) card.classList.remove('active')
            // });
            // console.log(entries[0]);
            // console.log('active cards = ', activeCards.length);
            // console.log('card em = ', parseFloat(getComputedStyle(entries[0].target).fontSize));
            // console.log('parent parent em = ', parseFloat(getComputedStyle(entries[0].target.parentElement.parentElement).fontSize));
            // if (entries.length > 0) entries[0].target.parentElement.parentElement.style.marginBottom = `-${activeCards.length * 9}em`;
            // console.log(entries[0].target.parentElement.parentElement.style.marginBottom);
        }

        let cardObserverOptions = {
            root: null,
            rootMargin: "-25% 0% -15% 0%",
            threshold: .5,
        };



        let mobileObservation = (screenWidth) => {
            if (screenWidth.matches) {
                const observer = new IntersectionObserver(toggleActiveCard, cardObserverOptions);
                observer.observe(card);
            }
        }

        let screenWidth = window.matchMedia("(max-width: 768px)");
        mobileObservation(screenWidth);

        // Attach listener function on state changes
        screenWidth.addEventListener("change", () => mobileObservation(screenWidth));


    }, [])

    // useEffect(() => {
    //     if (isObserved) {
    //         let activeCards = document.querySelectorAll('.preview-card.active');
    //         if (activeCards.length == 0) {
    //             setIsActive('active');
    //         }
    //     } else setIsActive('');

    // }, [isObserved])

    project = !project ? defaultProject : project;
    let type = project.type == 'PROJ' ? 'projects' : 'certifications';
    // Strip HTML tags and return plain text
    const stripHTML = (html: string = ""): string =>
        html
            .replace(/<\/?[^>]+(>|$)/g, "")
            .replace(/[\r\n]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    // const stripHTML = (html: string = ""): string =>
    //     html.replace(/<\/?[^>]+(>|$)/g, "");



    return (
        <>
            <Link href={`/${type}/${project.slug}`} key={"preview-card-link-" + cardID}>
                <div ref={ref} className={`preview-card with-background ${observerClasses}`} id={"preview-card-" + cardID} key={`preview-card-${cardID}`} style={{ animationDelay: `${animationEase(cardID)}s` }}>
                    <div className="thumbnails">
                        {project.thumbnails.map((img, index) => {
                            return (
                                <NextImage
                                    src={img.url}
                                    width={500}
                                    height={500}
                                    alt={img.caption}
                                    key={index}
                                    style={{
                                        zIndex: `${(index * -1)}`,
                                        left: `${index * 100}%`
                                    }}
                                    sizes="500px"
                                />
                            )

                        })}

                    </div>

                    <h3>{cardID} {project.title} {observerClasses}</h3>
                    <div className="preview-snippet">
                        {project.snippet && (<p>{project.snippet}</p>)}
                        {!project.snippet && project.body && (<p>{stripHTML(project.body.slice(0, 100))}</p>)}
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