"use client"




// import Editor from './Editor'

import { useEffect, useRef, useState } from 'react';
import '../AddItems.css'
import TagsInput from '../../components/AddItems/TagsInput';
import QuillRichText from '../../components/Quill/QuillRichText';

import PhotoUpload from '../../components/AddItems/PhotoUpload';
import type { PhotoUploadProps, ImageURL } from '../../components/AddItems/PhotoUpload';







export default function AddProject() {

  const [title, setTitle] = useState('');       // project title
  const [content, setContent] = useState('');   // Quill content
  const [tags, setTags] = useState([]);         // array of #tags


  const [imageFiles, setImageFiles] = useState([]);
  const [imageURLs, setImageURLs] = useState<ImageURL[]>([]);

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
        renameTo: 'test-07-23-25',
        maxRetries: 3,
        delay: 60,
      }
    }
  }


  //  Test img for styling
  let testImg = "D:/Photos/70TH4521.JPG"


  // Use a ref to access the quill instance directly
  const quillRef = useRef();


  // Run ONCE at DOM load
  useEffect(() => {

  }, [])


  // Run for EVERY change in the DOM
  useEffect(() => {
    setContent(quillRef.current.root.innerHTML); // This is how to get the HTML formatted
  });


  const logContent = (e) => {
    e.preventDefault();
    setContent(quillRef.current!.root.innerHTML)
    console.log(content)
  }

  const submitForm = () => {

  }


  return (
    <>
      <section>
        <div className="content with-background bg-grad add-item extra-long">

          <h1>Add New Portfolio Project</h1>

          <form id="add-item-form">

            <div className="item-title">
              <label htmlFor="title">Title</label>
              <input
                type='text'
                id='title'
                value={title}
                placeholder='Title'
                onChange={(e) => setTitle(e.target.value)}
              />

            </div>

            <h3>Body:</h3>
            <QuillRichText ref={quillRef} setRichTextContent={setContent} />

            <TagsInput tags={tags} setTags={setTags} />

            <PhotoUpload {...photoUploadProps} />

            <button onClick={(e) => logContent(e)}>Log Content</button>
          </form>


        </div>

      </section>
    </>
  )
}
