"use client"




import Editor from './Editor'

import { useEffect, useRef, useState } from 'react';
import './AddItem.css'



export default function AddItem() {

  
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [url, setURL] = useState('null');
  const [imageFiles, setImageFiles] = useState(null);
  const [imageFilesValidated, setImageFilesValidated] = useState([])
  const [tages, setTags] = useState('');


  let portfolio: String
  let certificate: String


  // Use a ref to access the quill instance directly
  const quillRef = useRef();


  // Run ONCE at DOM load
  useEffect(()=>{

  }, [])


  // Run for EVERY change in the DOM
  useEffect(()=>{
    setContent(quillRef.current.root.innerHTML); // This is how to get the HTML formatted
  });

  // Run ONLY when new image files are selected
  useEffect(()=>{
    if(imageFiles){
      const imageFileErrors = document.getElementById("image-file-errors");
      imageFileErrors.innerHTML = '<p>Found the Errors Div</p>';
      const imageFileList = document.getElementById("image-file-list");
      imageFileList.innerHTML = '<p>Found the List Div</p>';
      const imagePreview = document.getElementById("image-preview")

      console.log("Before loop...", imageFiles)

      for (let f=0; f < imageFiles.length; f++){
        if(imageFiles[f].type !== 'image/jpeg' && imageFiles[f].type !== 'image/png'){
          imageFileErrors.innerHTML += `<p>Only .jpg or .png files allows. ${imageFiles[f].name} not added.</p>`
        } else {
          console.log('Attempting to update/add this...', imageFiles[f])

          imageFilesValidated.push(imageFiles[f])

        }
      }

      console.log(imageFilesValidated);
      
      imagePreview.innerHTML = '';

      imageFilesValidated.map((file, index) => {
        console.log(file.name, index)
        let imgSrc = URL.createObjectURL(file)
        imagePreview.innerHTML += `<img src="${imgSrc}" id="img-preview-${index}" key="${index}" alt="preview" class="img-preview" />`
      })

      


      // imageFilesValidated.map((file, index) => (
      //   console.log(file.name, index)
      // ))
      
      console.log("After loop...", imageFiles, imageFilesValidated)
    }
 
    
  }, [imageFiles])

  // Run ONLY when item type is selected
  useEffect(()=>{
    console.log(type)

    const imageInput = document.getElementById("image-files")
    const certificateURL = document.getElementById("certificate-url")

    if(type == "certificate"){
      certificateURL.style.display = "block"
      imageInput.style.display = "none"
    } else if(type == "portfolio") {
      certificateURL.style.display = "none"
      imageInput.style.display = "block"
    }

  }, [type])


  const logContent = () => {
    setContent(quillRef.current!.root.innerHTML)
    console.log(content)
  }

  const submitForm = () => {

  }


  return (
    <>
      <section>
        <div className="content">   

          <h1>Add New Item</h1>

          <form id="add-item">

            <h3>Item type:</h3>
            <input type="radio" id="portfolio" name="item-type" value="portfolio" onChange={(e)=>setType(e.target.value)} />
            <label htmlFor="portfolio">Portfolio</label>

            <input type="radio" id="certificate" name="item-type" value="certificate" onChange={(e)=>setType(e.target.value)} />
            <label htmlFor="certificate">Certificate</label>

            
            <label>Title:</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div id="certificate-url">
              <label>Certificate URL:</label>
              <input 
                type="text" 
                value={url}
                onChange={(e) => setURL(e.target.value)}
              />
            </div>

            <div id="image-files">
              <label>Project Images:</label>
              <input 
                type="file" 
                name="filefield" 
                id="filefield"
                onChange={(e) => setImageFiles(e.target.files)} 
                multiple 
                accept="image/png, image/jpeg"
              />
              <div id="image-file-errors"></div>
              <div id="image-file-list"></div>
              <div id="image-preview"></div>

              
            </div>




            <h3>Body:</h3>
            <div className="quill-editor">

              <Editor ref={quillRef} />

            </div>

            <h3>Tags:</h3>
            <input type="text" />

            <button onClick={logContent}>Log Content</button>
          </form>


        </div>

      </section>
    </>
  )
}
