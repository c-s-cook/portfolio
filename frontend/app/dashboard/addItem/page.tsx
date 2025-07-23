"use client"




import Editor from './Editor'

import { useEffect, useRef, useState } from 'react';
import '../AddItems.css'






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


  //  Test img for styling
  let testImg = "D:/Photos/70TH4521.JPG"
  

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

      // console.log("Before loop...", imageFiles)

      let tempArray = [...imageFilesValidated];

      for (let f=0; f < imageFiles.length; f++){
        if(imageFiles[f].type !== 'image/jpeg' && imageFiles[f].type !== 'image/png'){
          imageFileErrors.innerHTML += `<p>Only .jpg or .png files allows. ${imageFiles[f].name} not added.</p>`
        } else {
          console.log('Attempting to update/add this...', imageFiles[f])

          
          tempArray.push(imageFiles[f]);
          
          
        }
      }
      setImageFilesValidated(tempArray);

      // console.log(imageFilesValidated);      
      console.log("After loop...", tempArray)
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


  const removeImage = (index) => {
    console.log("removing image from array at index: ", index);
    let tempArray = [...imageFilesValidated]
    tempArray.splice(index, 1)
    setImageFilesValidated(tempArray)
  }

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
        <div className="content add-item">   

          <h1>Add New Item</h1>

          <form id="add-item-form">

            <h3>Item type:</h3>
            <input type="radio" id="portfolio" name="item-type" value="portfolio" onChange={(e)=>setType(e.target.value)} />
            <label htmlFor="portfolio">Portfolio</label>

            <input type="radio" id="certificate" name="item-type" value="certificate" onChange={(e)=>setType(e.target.value)} />
            <label htmlFor="certificate">Certificate</label>

            <h3>Title:</h3>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div id="certificate-url">
              <h3>Certificate URL:</h3>
              <input 
                type="text" 
                value={url}
                onChange={(e) => setURL(e.target.value)}
              />
            </div>

            <div id="image-files">
              <h3>Project Images:</h3>
              <input 
                type="file" 
                name="filefield" 
                id="filefield"
                onChange={(e) => setImageFiles(e.target.files)} 
                title="Add Images"
                multiple 
                accept="image/png, image/jpeg"
              />
              <div id="image-file-errors"></div>
              <div id="image-file-list"></div>
              <div id="image-preview-area">

                {imageFilesValidated.map((file, index) => {
                  const imgSrc = URL.createObjectURL(file);
                  
                  return (
                    <div className="img-container" key={"img-container-"+index}>
                      <img
                        src={imgSrc}
                        key={"img"+index}
                        alt="preview"
                        className="img-preview"
                      />
                      <div className="img-remove" key={"remove"+index} onClick={() => removeImage(index)}>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
            </div>




            <h3>Body:</h3>
            <div className="quill-editor">

              <Editor ref={quillRef} />

            </div>

            <h3>Tags:</h3>
            <input type="text" />

            <button onClick={(e) => logContent(e)}>Log Content</button>
          </form>


        </div>

      </section>
    </>
  )
}
