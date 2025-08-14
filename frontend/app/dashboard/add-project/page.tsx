"use client"




// import Editor from './Editor'

import { useEffect, useRef, useState } from 'react';
import '../AddItems.css'
import TagsInput from '../../components/AddItems/TagsInput';
import QuillRichText from '../../components/Quill/QuillRichText';

import PhotoUpload from '../../components/AddItems/PhotoUpload';

import getPortfolio from '../../../lib/getPortfolio';

import type { PhotoUploadProps, ImageURL, UploadFile } from '../../components/AddItems/PhotoUpload';
import type { Project } from '../../../lib/types';

import { useRouter } from 'next/navigation';








export default function AddProject() {

  const [title, setTitle] = useState('');       // project title
  const [slug, setSlug] = useState('');         // slug for URL
  const [content, setContent] = useState('');   // Quill content
  const [tags, setTags] = useState([]);         // array of #tags
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [errorText, setErrorText] = useState('');


  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);
  const [imageURLs, setImageURLs] = useState<ImageURL[]>([]);

  const [startUpload, setStartUpload] = useState<boolean>(false);


  // Use a ref to access the quill instance directly
  const quillRef = useRef();

  // use a ref for publishing status
  const isPublishingRef = useRef(false);

  // use a ref for auto-save limiter
  const canAutoSave = useRef(true);

  // use a ref for publishing checks
  const publishingChecks = useRef({
    title: null,
    body: null,
    tags: null,
    images: null,
    repoUrl: null,
    liveUrl: null
  });

  const router = useRouter();


  let date = new Date();
  let dateString = String(date.getFullYear()) + "-" + String(date.getMonth() + 1) + "-" + String(date.getDate());
  let projectCount = useRef(0);
  let portfolio = useRef();
  let projectSlugs = useRef([]);



  const getProjectCount = async () => {
    portfolio.current = await getPortfolio();

    if (portfolio.current && !portfolio.current.error) {
      // set the projectCount & project ID...
      projectCount.current = portfolio.current.projects!.length;
      newProject.id = projectCount.current || 0;

      // load existing project URL slugs for safetfy checking...
      projectSlugs.current = portfolio.current.projects.map(proj => proj.slug).filter(slug => slug !== undefined);
      console.log('projectSlugs.current: ', projectSlugs.current);

      console.log(`aquired portfolio. setting new .renameTo...${String(projectCount.current).padStart(2, '0')}_${dateString}`);

    }
  }

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
        startUpload: startUpload,
        renameTo: projectCount.current ? `${String(projectCount.current).padStart(2, '0')}_${dateString}` : dateString,
        maxRetries: 3,
        delay: 60,
      }
    }
  }

  let newProject: Project = {
    type: 'PROJ',
    id: projectCount.current || 0,
    title: title,
    slug: slug,
    body: content,
    tags: tags,
    thumbnails: imageURLs,
    repoUrl: repoUrl,
    liveUrl: liveUrl
  }







  // Run ONCE at DOM load
  useEffect(() => {

    getProjectCount();

    // check for auto-saved tempProject...
    let tempProject = localStorage.getItem('tempProject')
    if (tempProject) {
      console.log('found auto-save...');
      canAutoSave.current = false;

      const loadAutoSave = async () => {
        tempProject = await JSON.parse(tempProject);

        setTimeout(() => {

          setTitle(tempProject.title);
          setSlug(tempProject.slug);
          quillRef.current.root.innerHTML = tempProject.body;
          setTags(tempProject.tags);
          setImageURLs(tempProject.thumbnails);
          setRepoUrl(tempProject.repoUrl);
          setLiveUrl(tempProject.liveUrl);


          setTimeout(() => { canAutoSave.current = true }, 1000);
          console.log('LOADED auto-save...');

        }, 750)

      }
      loadAutoSave();


    }

  }, [])


  // Run for EVERY change in the DOM
  useEffect(() => {
    setContent(quillRef.current.root.innerHTML); // This is how to get the HTML formatted
  });


  // set the slug
  useEffect(() => {
    let tempSlug = `${title}`;

    // turn string to lower-case, replace spaces with hyphens, strip out any punctuation or special characters, strip off any hyphens at the end of the string

    // a regex for finding any number of '--' double-hypens



    tempSlug = tempSlug.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '-').replace(/-+$/, '').replace(/--+/g, '-');

    setSlug(tempSlug);

    if (projectSlugs.current && projectSlugs.current.includes(tempSlug)) {

    }


  }, [title])



  /*******  imageFiles[]
   * 
   * @param e 
   */
  useEffect(() => {

    if (isPublishingRef.current) {
      //  are any of them marked as 'uploading'?
      let uploading = imageFiles.filter((file) => file.status == 'uploading').length;

      // are any of them still unprocessed / no .status at all?
      let notYetUploaded = imageFiles.filter((file) => file.status === undefined).length;

      if (uploading == 0 && notYetUploaded == 0 && isPublishingRef.current) {
        console.log('firing validateForm() from useEffect(imageFiles[])...');
        validateForm();
      }
    }

  }, [imageFiles])


  /**
   * Auto-Save to localStorage...
   * @param e 
   */

  let delayedSave = useRef();

  useEffect(() => {

    if (canAutoSave.current && typeof (Storage) !== "undefined") {

      canAutoSave.current = false;
      clearTimeout(delayedSave.current);

      setTimeout(() => {
        localStorage.setItem('tempProject', JSON.stringify(newProject));
        canAutoSave.current = true;
      }, 2000);

      delayedSave.current = setTimeout(() => {
        console.log('delayed auto-saving...');
        localStorage.setItem('tempProject', JSON.stringify(newProject));
      }, 4500);



    }

  }, [title, slug, content, tags, imageURLs, repoUrl, liveUrl])









  //  handle the publish / submit button
  const validateForm = async (e?) => {
    if (e) e.preventDefault();

    console.log('validating the form...');

    isPublishingRef.current = true;

    let pubBtn = document.getElementById('publish') as HTMLButtonElement;
    pubBtn.disabled = true;
    pubBtn.innerText = 'Processing...'


    // check to see if we've decided to "Proceed"...
    for (const [key, value] of Object.entries(publishingChecks.current)) {
      if (value == 'flagged') {
        console.log(`Setting ${key} to 'proceed'...`);
        publishingChecks.current[key] = 'proceed';
        console.log(publishingChecks.current[key]);
      }
    }


    const postNewProject = async () => {
      // send the newProject object to the 'api/portfolio' api with a POST call in a try/catch block
      try {
        const response = await fetch('../api/portfolio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProject),
        });

        if (!response.ok) {
          throw new Error(`${response}`);
        }

        const data = await response.json();

        // And there was much rejoicing...
        console.log('Success:', data);
        pubBtn.innerText = 'Success!';
        isPublishingRef.current = false;

        // update the portfolio...
        portfolio.current.projects.push(newProject);
        localStorage.setItem('portfolio', JSON.stringify(portfolio.current));

        // clear the auto-save data...
        localStorage.removeItem('tempProject');


        // All done here. send them on their way...
        setTimeout(() => {

          router.push('../');

        }, 2000);

      } catch (error) {
        console.error('Error:', error);
        pubBtn.innerText = 'Error :S';
        pubBtn.disabled = false;
        isPublishingRef.current = false;
      }
    }



    // validate all the newProject fields / properties...

    //  check title...
    let titleError = document.querySelector('.item-title .error-msg') as HTMLSpanElement;
    if (!title) {
      titleError.innerText = 'Missing a title.';
      titleError.classList.add('show');
      isPublishingRef.current = false;
    }
    else if (title.length < 5 && publishingChecks.current.title !== 'proceed') {
      titleError.innerText = 'Is that title long enough?';
      publishingChecks.current['title'] = 'flagged';
      titleError.classList.add('show');
      titleError.classList.add('warn');
      isPublishingRef.current = false;
    }
    else if (projectSlugs.current && projectSlugs.current.includes(slug)) {
      titleError.innerText = 'Title or slug already exists.';
      titleError.classList.add('show');
      isPublishingRef.current = false;
    }
    else titleError.classList.remove('show');

    //  check body...
    let bodyError = document.querySelector('.item-body .error-msg') as HTMLSpanElement;
    if (content == '<p><br></p>') {
      bodyError.innerText = 'Missing body content.';
      bodyError.classList.add('show');
      isPublishingRef.current = false;
    }
    else if (content.length < 100 && publishingChecks.current.body !== 'proceed') {
      bodyError.innerText = 'The body content might be too short.';
      publishingChecks.current['body'] = 'flagged';
      bodyError.classList.add('show');
      bodyError.classList.add('warn');
      isPublishingRef.current = false;
    }
    else bodyError.classList.remove('show');

    //  check tags...
    let tagsError = document.querySelector('.item-tags .error-msg') as HTMLSpanElement;
    if (tags.length === 0) {
      tagsError.innerText = 'Missing project tags.';
      tagsError.classList.add('show');
      isPublishingRef.current = false;
    }
    else if (tags.length < 3 && publishingChecks.current.tags !== 'proceed') {
      tagsError.innerText = 'How about some more tags?';
      publishingChecks.current['tags'] = 'flagged';
      tagsError.classList.add('show');
      tagsError.classList.add('warn');
      isPublishingRef.current = false;
    }
    else tagsError.classList.remove('show');



    // check images...
    let imagesError = document.querySelector('.item-images .error-msg') as HTMLSpanElement;

    // are there even any images selected? No?
    if (imageFiles.length < 1) {
      imagesError.innerText = 'Missing thumbnail images.';
      imagesError.classList.add('show');
      isPublishingRef.current = false;
    }

    // have the selected images been successfully uploaded and the URLs logged into imageURLs[]? Then we're good!
    else if (imageFiles.length == imageURLs.length && imageFiles.length == imageFiles.filter((file) => file.status == 'success').length) {
      imagesError.classList.remove('show');
      publishingChecks.current.images = null;
    }

    // are they still unprocessed? Haven't even attempted an upload? Get it rollin!
    else if (imageFiles.length == imageFiles.filter((file) => file.status === undefined).length) {
      setStartUpload(true);
      publishingChecks.current['images'] = 'uploading';
    }

    // have we been here before and they're choosing to proceed? Okie-dokie!
    else if (publishingChecks.current.images == 'proceed') imagesError.classList.remove('show');

    else {
      let filesWithErrors = imageFiles.filter((file) => file.status == 'error');
      imagesError.innerText = `${filesWithErrors.length} images failed to upload. Proceed anyways?`;
      imagesError.classList.add('show');
      imagesError.classList.add('warn');
      isPublishingRef.current = false;
    }



    //  check Repo URL ...
    let repoError = document.querySelector('.item-repoUrl .error-msg') as HTMLSpanElement;
    if (!repoUrl && publishingChecks.current.repoUrl !== 'proceed') {
      repoError.innerText = 'Should there be a link for a repo?';
      publishingChecks.current['repoUrl'] = 'flagged';
      repoError.classList.add('show');
      repoError.classList.add('warn');
      isPublishingRef.current = false;
    }
    else repoError.classList.remove('show');

    //  check live site URL...
    let liveSiteError = document.querySelector('.item-liveUrl .error-msg') as HTMLSpanElement;
    if (!liveUrl && publishingChecks.current.liveUrl !== 'proceed') {
      liveSiteError.innerText = 'Should there be a link to a live site?';
      publishingChecks.current['liveUrl'] = 'flagged';
      liveSiteError.classList.add('show');
      liveSiteError.classList.add('warn');
      isPublishingRef.current = false;
    }
    else liveSiteError.classList.remove('show');



    if (!isPublishingRef.current && Object.values(publishingChecks.current).includes('flagged')) {
      pubBtn.disabled = false;
      pubBtn.innerText = 'Proceed';
    }
    else if (!isPublishingRef.current) {
      pubBtn.disabled = false;
      pubBtn.innerText = 'Publish';
    }
    else if (publishingChecks.current.images !== 'uploading') {
      postNewProject();
    }

  }


  return (
    <>
      <section>
        <div className="content with-background add-item extra-long">

          <h1>Add New Portfolio Project</h1>

          <form id="add-item-form">

            {/* <!-- This hidden button prevents implicit submission --> */}
            <button type="submit" disabled style={{ display: "none" }} aria-hidden="true"></button>

            <div className="item-title">
              <label htmlFor="title">Title: <span className="error-msg"></span></label>
              <input
                type='text'
                id='title'
                value={title}
                placeholder='Title'
                onChange={(e) => setTitle(e.target.value)}
              />

            </div>

            <h3 className='item-body'>Body: <span className="error-msg"></span></h3>
            <QuillRichText ref={quillRef} setRichTextContent={setContent} />

            <TagsInput tags={tags} setTags={setTags} />

            <h3 className='item-images'>Images: <span className="error-msg"></span></h3>
            <PhotoUpload {...photoUploadProps} />

            <div className="item-repoUrl">
              <label htmlFor="repoUrl">GitHub URL: <span className="error-msg"></span></label>
              <input
                type='text'
                id='repoUrl'
                value={repoUrl}
                placeholder='Repo URL'
                onChange={(e) => setRepoUrl(e.target.value)}
              />
            </div>

            <div className="item-liveUrl">
              <label htmlFor="liveUrl">Live Site URL: <span className="error-msg"></span></label>
              <input
                type='text'
                id='liveUrl'
                value={liveUrl}
                placeholder='Link to Live Site'
                onChange={(e) => setLiveUrl(e.target.value)}
              />
            </div>

            <div className="submit-btn">

              <button id='publish' onClick={(e) => validateForm(e)}>Publish</button>
              <p className="errorMsg">{errorText}</p>
            </div>
          </form>


        </div>

      </section>
    </>
  )
}
