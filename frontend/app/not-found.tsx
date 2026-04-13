"use cache"

import type { Metadata } from 'next';

import PreviewDeck from "@components/PreviewDeck/PreviewDeck";

import { Satisfy } from 'next/font/google'
const satisfy = Satisfy({ subsets: ['latin'], weight: ['400'] })


export const metadata: Metadata = {
    title: 'Not Found',
    description: 'The page you are looking for does not exist.',
};


const RandomPithyReason = () => {

    let r = Math.round(Math.random() * 10);

    switch (r) {
        case 0:
            return (<><p>
                The page you are looking for <b>DOES</b> exist, but you have been deemed unworthy.
            </p>
            </>);
        case 1:
            return (<>  <p>
                The page you are looking for was eaten by AI. (<i>I suspect Grok.</i>)
            </p></>);
        case 2:
            return (<><p>
                The page you are trying to reach has been disconnected or moved to another dimension. Please check your interdimensional router settings and try again.
            </p></>);
        case 3:
            return (<><p>
                The page you are trying to reach has actually been trying to reach <i>you</i> for several weeks now, but you have been ignoring its calls. It's feeling very hurt, and needs a bit of distance. It will let you know when it's ready to connect. Until then, please respect its boundaries and stop trying to access it.
            </p></>);
        case 4:
            return (<><p>
                Sorry. Don't know what you're looking for, but it sure isn't here.
            </p></>);
        case 5:
            return (<><p>
                Sorry. Don't know what you're looking for, but it sure isn't here.
            </p></>);
        case 6:
            return (<><p>
                "Sorry." Page not bound by your society constructs, <i>man</i>. Like, what even is a "page" anyway? Pff. Whatever, man.
            </p></>);
        default:
            return (<><p>
                Page not found.
            </p></>);
        // Add more cases as needed
    }

        return (
        <>
            <p>
                The page you are looking for <b>DOES</b> exist, but you have been deemed unworthy.
            </p>
        </>
    )
}



export default async function NotFound() {
    return (
        <section className="full">
            <div className="content centered">
                <div className='four-oh-four'>
                    <h1 className={satisfy.className}>404</h1>
                    {/* <p className="four-oh-four-title">Page Not Found</p> */}
                    <RandomPithyReason />

                    <p>
                        Might I suggest trying one of these?
                    </p>
                </div>

                <div className="content">
                    <h2 className={satisfy.className}>Projects</h2>
                    <PreviewDeck type="project" limit={3} />
                </div>

                <div className="content">
                    <h2 className={satisfy.className}>Certifications</h2>
                    <PreviewDeck type="certification" limit={3} />
                </div>
            </div>



        </section>

    );
}
