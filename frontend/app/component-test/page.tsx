"use client"

import PhotoUpload from "../components/AddItems/PhotoUpload";
import type { PhotoUploadProps } from "../components/AddItems/PhotoUpload";
import type { ImageURL } from "@lib/types";

import TagsInput from "../components/AddItems/TagsInput";

import { useState, useRef, useEffect } from "react";
import QuillRichText from "../components/Quill/QuillRichText";
import Carousel from "../components/Carousel/Carousel";
import PreviewDeck from "../components/PreviewDeck/PreviewDeck";
import { PreviewCardSkeleton } from "@components/PreviewCard/PreviewCardSkeleton";
import PreviewCard from "@components/PreviewCard/PreviewCard";
import { TagCloud } from "@components/TagCloud/TagCloud";
import { PreviewDeckSkeleton } from "@components/PreviewDeck/PreviewDeckSkeleton";




const ComponentTest = () => {

    const [tags, setTags] = useState([])
    const [imageFiles, setImageFiles] = useState([]);
    const [imageURLs, setImageURLs] = useState<ImageURL[]>([]);

    const [content, setContent] = useState('');






    // Use a ref to access the quill instance directly
    const quillRef = useRef<any>(null);




    // Run for EVERY change in the DOM
    useEffect(() => {
        if (quillRef.current) setContent(quillRef.current.root.innerHTML); // This is how to get the HTML formatted
    }, [quillRef.current]);
    // This effect runs whenever the quillRef.current changes -- updated during Next.js v15 upgrade.



    // let imageURLs: ImageURL[] = [];

    let photoUploadProps: PhotoUploadProps = {
        imageFiles: imageFiles,
        setImageFiles: setImageFiles,
        options: {
            addStar: true,
            addCaptions: true,
            autoUpload: {
                uploadAPI: '../api/img',
                imageURLs: imageURLs,
                setImageURLs: setImageURLs,
                startUpload: false,
                renameTo: 'test-11-10-25',
                maxRetries: 3,
                delay: 10,
            }
        }
    }


    return (
        <>
            <section>
                <div className="content extra-long">


                    {/* <TagsInput tags={tags} setTags={setTags} /> */}
                    {/* <PhotoUpload {...photoUploadProps} /> */}

                    {/* <Carousel images={imageURLs} interval={2000} holdOnFeatured={4} /> */}
                    {/* <TagCloud /> */}
                    {/* <PreviewCardSkeleton /> */}
                    {/* <PreviewDeckSkeleton /> */}
                    <br />
                    <br />
                    
                    {/* <PreviewDeck type="project"/> */}
                    
                    <PreviewCard cardID={1} />
                    <PreviewCard cardID={2} />
                    <PreviewCard cardID={3} />
                    <PreviewCard cardID={4} />



                    {/* <QuillRichText ref={quillRef} setRichTextContent={setContent} /> */}
                    <br />
                    {/* <div>{JSON.stringify(imageURLs)}</div> */}
                    <br />
                    <br />


                </div>
            </section>
        </>
    );
}

export default ComponentTest;