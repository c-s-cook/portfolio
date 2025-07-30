"use client"

import PhotoUpload from "../components/AddItems/PhotoUpload";
import type { PhotoUploadProps, ImageURL } from "../components/AddItems/PhotoUpload";
import TagsInput from "../components/AddItems/TagsInput";

import { useState, useRef, useEffect } from "react";
import QuillRichText from "../components/Quill/QuillRichText";


const ComponentTest = () => {

    const [tags, setTags] = useState([])
    const [imageFiles, setImageFiles] = useState([]);
    const [imageURLs, setImageURLs] = useState<ImageURL[]>([]);

    const [content, setContent] = useState('');
    


    // Use a ref to access the quill instance directly
    const quillRef = useRef();

    // Run for EVERY change in the DOM
    useEffect(() => {
        if(quillRef.current) setContent(quillRef.current.root.innerHTML); // This is how to get the HTML formatted
    });



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
                renameTo: 'test-07-11-25',
                maxRetries: 3,
                delay: 10,
            }
        }
    }


    return (
        <>
            <section>
                <div className="content with-background bg-grad">


                    {/* <TagsInput tags={tags} setTags={setTags}  /> */}
                    <PhotoUpload {...photoUploadProps} />



                    {/* <QuillRichText ref={quillRef} setRichTextContent={setContent} /> */}
                    <br />
                    <br />
                    <br />
                    <div>{JSON.stringify(imageURLs)}</div>
                    <br />
                    <br />
                    {imageURLs.map((imageURL, index) => {

                        return (
                            <div>
                                <img src={imageURL.url} alt="" key={index} style={{width: "250px", height: "auto"}} />
                            </div>
                            
                            
                        )
                    })}

                </div>
            </section>
        </>
    );
}

export default ComponentTest;