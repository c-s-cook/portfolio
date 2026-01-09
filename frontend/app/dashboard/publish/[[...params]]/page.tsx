/**
 * PublishPortfolioItem Component
 * 
 * A Next.js page component for creating and editing portfolio items (projects and certifications).
 * Handles form validation, auto-saving to sessionStorage, image uploads, and publishing to the database.
 * 
 * @component
 * @returns {JSX.Element} The rendered portfolio item publishing form
 * 
 * @remarks
 * - Uses catch-all route parameters: `/dashboard/publish/[itemType]/[action]`
 * - Supports two item types: 'project' and 'certification'
 * - Supports two actions: 'add' (default) and 'edit'
 * - Auto-saves form data to sessionStorage every 2-4.5 seconds
 * - Validates form fields with warning and error-level checks
 * - Uploads images via PhotoUpload component before publishing
 * 
 * @example
 * // Create new project
 * // Navigate to: /dashboard/publish/project
 * 
 * @example
 * // Edit existing certification with id 123
 * // Navigate to: /dashboard/publish/certification/edit?cert=123
 * 
 * @dependencies
 * - React hooks: useState, useEffect, useReducer, useRef
 * - Next.js navigation: useRouter, useParams, useSearchParams
 * - Custom components: TagsInput, QuillRichText, PhotoUpload
 * - Custom utilities: getPortfolio
 * - Custom types: Certification, Project, PublishingError, PublishingErrors, PhotoUploadProps, ImageURL, UploadFile
 */
"use client"





import { useEffect, useRef, useState, useReducer } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import '../../AddItems.css'

import TagsInput from '@components/AddItems/TagsInput';
import QuillRichText from '@components/Quill/QuillRichText';
import PhotoUpload from '@components/AddItems/PhotoUpload';
import type { PhotoUploadProps, ImageURL, UploadFile } from '@components/AddItems/PhotoUpload';

import getPortfolio from '@lib/getPortfolio';
import type { Certification, Project, PublishingErrors } from '@lib/types';
// import { Certificate } from 'crypto';
// import { set } from 'mongoose';





export default function PublishPortfolioItem() {




  /****************************
   *                          *
   *     VARIOUS VARIABLES    *
   *                          *
   ***************************/

  const router = useRouter();

  // push any received route params into array. If none, will be undefined...
  const params = useParams()?.params;
  const searchParams = useSearchParams();


  /**
   *    STATE VARIABLES
   */

  // loading and error states
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [errorText, setErrorText] = useState('');

  // routing & search params
  const [itemType, setItemType] = params && params[0] ? useState<string | undefined>(params[0]) : useState<string | undefined>(undefined);
  let actionType: string | undefined = 'add';
  let itemId: number | undefined = undefined;

  // portfolio item data states
  const [title, setTitle] = useState('');       // project title
  const [slug, setSlug] = useState('');         // slug for URL
  const [content, setContent] = useState('');   // Quill content
  const [tags, setTags] = useState([]);         // array of #tags
  const [repoUrl, setRepoUrl] = useState('');
  const [certUrl, setCertUrl] = useState('');
  const [certDate, setCertDate] = useState<string | Date>('');
  const [liveUrl, setLiveUrl] = useState('');

  // portfolio items error msg state
  const [pubErrors, setPubErrors] = useState<PublishingErrors>({});

  // image upload states
  const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);
  const [imageURLs, setImageURLs] = useState<ImageURL[]>([]);
  const [startUpload, setStartUpload] = useState<boolean>(false);


  /**
   *    REF VARIABLES
   */

  let itemTypeCount = useRef<number>(0);
  let portfolio = useRef<any | null>(null);
  let itemTypeSlugs = useRef<string[]>([]);

  // Use a ref to access the quill instance directly
  const quillRef = useRef<any>(null);

  // use a ref for publishing status
  const isPublishingRef = useRef(false);

  // use a ref for auto-save limiter
  const canAutoSave = useRef(true);

  // use a ref for publishing checks
  const publishingChecks = useRef({
    title: null,
    slug: null,
    body: null,
    tags: null,
    images: null,
    certDate: null,
    certUrl: null,
    repoUrl: null,
    liveUrl: null
  });



  // get today's date string for image renaming
  let dateString = String(new Date().getFullYear()) + "-" + String(new Date().getMonth() + 1) + "-" + String(new Date().getDate());



  let photoUploadProps: PhotoUploadProps = {
    imageFiles: imageFiles,
    setImageFiles: setImageFiles,
    options: {
      addStar: true,
      addCaptions: true,
      autoUpload: {
        uploadAPI: '../../api/img',
        imageURLs: imageURLs,
        setImageURLs: setImageURLs,
        startUpload: startUpload,
        renameTo: itemTypeCount.current ? `${String(itemTypeCount.current).padStart(2, '0')}_${dateString}` : dateString,
        maxRetries: 3,
        delay: 60,
      }
    }
  }

  let newPortfolioItem: Project | Certification = {
    type: null,
    id: itemTypeCount.current || 0,
    title: title,
    slug: slug,
    body: content,
    tags: tags,
    thumbnails: imageURLs,
    repoUrl: repoUrl,
    liveUrl: liveUrl,
    certUrl: certUrl,
    date: certDate,
  }








  /****************************
   *                          *
   *     SOME FUNCTIONS       *
   *                          *
   ***************************/


  const loadPortfolio = async () => {
    portfolio.current = await getPortfolio();
  }

  const getProjectCount = async () => {
    // portfolio.current = await getPortfolio();

    if (portfolio.current && !portfolio.current.error && itemType) {
      // set the itemTypeCount & project ID...
      itemTypeCount.current = itemType === 'project'
        ? portfolio.current.projects!.length
        : portfolio.current.certifications!.length;

      newPortfolioItem.id = itemTypeCount.current || 0;

      // load existing project URL slugs for safetfy checking...
      itemTypeSlugs.current = itemType === 'project'
        ? portfolio.current.projects.map(proj => proj.slug).filter(slug => slug !== undefined)
        : portfolio.current.certifications.map(cert => cert.slug).filter(slug => slug !== undefined)
      console.log('itemTypeSlugs.current: ', itemTypeSlugs.current);

      console.log(`aquired portfolio. setting new .renameTo...${String(itemTypeCount.current).padStart(2, '0')}_${dateString}`);

    }
    else {
      console.log(`
        ERROR in getPRojectCount():
        portfolio.current? --------> ${(portfolio.current)}
        portfolio.current.error? --> ${portfolio.current.error}
        itemType ? params[0]? -----------------> ${itemType} ${params[0]}
        ???????????????????????????????????????
        `)
    }
  }






  /****************************
   *                          *
   *     ALL THESE DANG       *
   *      useEffect(s)        *
   *                          *
   ***************************/


  /***** []  (single run on first load)
 * 
 *  checks for + sets itemType
 *  loads portfolio data;
 *  checks for existing item to edit;
 *  checks for auto-saved item;
 */
  useEffect(() => {

    // check for route params
    if (params && params.length > 0) {
      if (params[0] == 'project' || params[0] == 'certification') {
        setItemType(params[0]);
        if (newPortfolioItem) newPortfolioItem.type = params[0] === 'project' ? 'PROJ' : 'CERT';

        // if an edit params + itemId gets passed...
        if (params[1] && params[1] == 'edit') {
          itemId = parseInt(searchParams.get(params[0] == 'project' ? 'proj' : 'cert'));
          if (isNaN(itemId)) itemId = undefined;
          actionType = params[1];
        };
      }
    }

    (async () => {
      await loadPortfolio();

      if (!portfolio.current) console.log('Issue getting portfolio...');
      else console.log('got portfolio!');

      // Check if we are editing an existing item...
      if (typeof itemId === 'number' && actionType === 'edit') {
        let itemData = params[0] === 'project'
          ? portfolio.current.projects.find((p: Project) => p.id === itemId)
          : portfolio.current.certifications.find((c: Certification) => c.id === itemId);
        if (itemData) {
          setTitle(itemData.title);
          setSlug(itemData.slug);
          if (quillRef.current && (quillRef.current as any).root) {
            (quillRef.current as any).root.innerHTML = itemData.body;
          }
          setTags(itemData.tags);
          setImageURLs(itemData.thumbnails);
          setRepoUrl(itemData.repoUrl);
          if (params[0] === 'project') {
            setLiveUrl(itemData.liveUrl);
          } else if (params[0] === 'certification') {
            setCertUrl(itemData.certUrl);
            setCertDate(itemData.date);
          }
        }
        setLoading(false);
      }
      else {

      }
    })();

  }, [])


  /****** Run for EVERY change in the DOM
   *  
   *  sets the content / body state for the Qill rich text editor
   */
  useEffect(() => {
    if (quillRef.current) setContent(quillRef.current.root.innerHTML); // This is how to get the HTML formatted
  });



  /****** [itemType]
   * 
   * Checks if the itemType is valid and if we are editing instead of adding...
   */
  useEffect(() => {

    if (itemType === 'project' || itemType === 'certification') {
      (async () => {
        if (!portfolio.current) await loadPortfolio();

        console.log('trying for count...');
        await getProjectCount();

        // check for auto-saved item...
        let localItem: string | null = sessionStorage.getItem(`autoSaved${itemType.toUpperCase()}`)
        if (localItem) {
          console.log('found auto-save...');
          canAutoSave.current = false;

          const loadAutoSave = async () => {
            let autoSavedItem: Project = await JSON.parse(localItem);

            setTimeout(() => {

              setTitle(autoSavedItem.title);
              setSlug(autoSavedItem.slug);
              if (quillRef.current && (quillRef.current as any).root) {
                (quillRef.current as any).root.innerHTML = autoSavedItem.body;
              }
              setTags(autoSavedItem.tags);
              // ensure each thumbnail has the required 'name' property for the PhotoUpload ImageURL type
              setImageURLs((autoSavedItem.thumbnails ?? []).map((t: any) => ({ ...t, name: t.name ?? 'image' })) as ImageURL[]);
              setRepoUrl(autoSavedItem.repoUrl);
              setLiveUrl(autoSavedItem.liveUrl);


              setTimeout(() => { canAutoSave.current = true }, 1000);
              console.log('LOADED auto-save...');

            }, 750)

          }
          await loadAutoSave();

        }
      })();
    }

    setLoading(false);

    if (!loading && !params) router.push(`/dashboard/publish/${itemType}`)

  }, [itemType])


  /*******  [title]
   * 
   *  set the slug based on the title
   *  display error msg if slug already exists
   * 
   */
  useEffect(() => {
    let tempSlug = `${title}`;

    // turn string to lower-case, replace spaces with hyphens, strip out any punctuation or special characters, strip off any hyphens at the end of the string
    tempSlug = tempSlug.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '-').replace(/-+$/, '').replace(/--+/g, '-');

    setSlug(tempSlug);

    if (itemTypeSlugs.current && itemTypeSlugs.current.includes(tempSlug)) {
      setPubErrors((prevErr) => {
        let newErr = { ...prevErr };
        newErr.title = {
          text: 'This title/slug already exists!',
          warn: 'warn'
        }
        return newErr
      })
    }
    else {
      setPubErrors((prevErr) => {
        let newErr = { ...prevErr };
        newErr.title = null;
        return newErr
      })
    }

    console.log(itemTypeSlugs.current);
    console.log(tempSlug);

  }, [title])



  /*******  [imageFiles]
   * 
   *  checks if publishing is in progress
   *  if so, checks if all images have finished uploading
   *  if so, fires validateForm() to send the JSON data to the DB
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
   * Auto-Save to sessionStorage...
   * @param e 
   */

  let delayedSave = useRef();

  useEffect(() => {

    if (canAutoSave.current && typeof (Storage) !== "undefined") {

      // don't auto-save an empty form...
      if (newPortfolioItem.title
        || (newPortfolioItem.body && newPortfolioItem.body !== '<p><br></p>')
        || newPortfolioItem.tags.length > 0
        || newPortfolioItem.thumbnails.length > 0
        || newPortfolioItem.repoUrl
        || newPortfolioItem.liveUrl
        || newPortfolioItem.certUrl
        || newPortfolioItem.date
      ) {
        canAutoSave.current = false;
        clearTimeout(delayedSave.current);

        setTimeout(() => {
          sessionStorage.setItem(`autoSaved${itemType.toUpperCase()}`, JSON.stringify(newPortfolioItem));
          console.log('auto-saving...');
          canAutoSave.current = true;
        }, 2000);

        delayedSave.current = setTimeout(() => {
          console.log('delayed auto-saving...');
          sessionStorage.setItem(`autoSaved${itemType.toUpperCase()}`, JSON.stringify(newPortfolioItem));
        }, 4500);
      }
    }

  }, [title, content, tags, imageURLs, imageFiles, repoUrl, liveUrl, certUrl, certDate]);









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
      // send the newPortfolioItem object to the 'api/portfolio' api with a POST call in a try/catch block
      console.log('Posting project:', newPortfolioItem);
      try {
        const response = await fetch('../../api/portfolio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Action-Type': actionType
          },
          body: JSON.stringify(newPortfolioItem),
        });

        const data = await response.json();
        console.log('API response:', data);

        if (data.error && data.error === 'Unauthorized') {
          // user is logged in, but not an admin
          // flag the portfolio item as a demo
          newPortfolioItem.isDemo = true;
          console.log('Flagging project as demo:', newPortfolioItem);
        }
        else if (!response.ok) {
          throw new Error(`${data}`);
        }



        // And there was much rejoicing...
        console.log('Success:', data);
        pubBtn.innerText = 'Success!';
        isPublishingRef.current = false;

        // update the portfolio...
        if (actionType === 'add') portfolio.current.projects.push(newPortfolioItem);
        else if (actionType === 'edit') {
          const index = portfolio.current.projects.findIndex((proj) => proj.id === newPortfolioItem.id);
          if (index !== -1) {
            portfolio.current.projects[index] = newPortfolioItem;
          }
        }
        await localStorage.setItem('portfolio', JSON.stringify(portfolio.current));

        // clear the auto-save data...
        await sessionStorage.removeItem(`autoSaved${itemType.toUpperCase()}`);
        console.log('Auto-save data cleared.');


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



    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    /**
     * 
     *                      VALIDATION 
     * 
     */
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////

    let tempErrors: PublishingErrors = { ...pubErrors };
    for (const key of Object.keys(tempErrors)) tempErrors[key] = null;
    setPubErrors(tempErrors);

    /**
     *  CHECK TITLE
     */

    //  check for empty title...
    if (!title) {
      let msg = 'Missing a title.';
      tempErrors.title = { text: msg, warn: '' };

      isPublishingRef.current = false;
    }
    //  check for too-short title...
    else if (title.length < 5 && publishingChecks.current.title !== 'proceed') {
      let msg = 'Is that title long enough?';
      tempErrors.title = { text: msg, warn: 'warn' };

      publishingChecks.current['title'] = 'flagged';
      isPublishingRef.current = false;
    }
    //  check for duplicate title/slug...
    else if (itemTypeSlugs.current && itemTypeSlugs.current.includes(slug)) {
      let msg = 'Title or slug already exists.'
      tempErrors.title = { text: msg, warn: '' };

      isPublishingRef.current = false;
    }
    //  title is clear for publishing!
    else tempErrors.title = null;


    /**
     *  CHECK BODY / CONTENT
     */

    //  check for empty body...
    if (content == '<p><br></p>') {
      let msg = 'Missing body content.';
      tempErrors.content = { text: msg, warn: '' };

      isPublishingRef.current = false;
    }
    // check for too-short body content...
    else if (content.length < 100 && publishingChecks.current.body !== 'proceed') {
      let msg = 'The body content might be too short.';
      tempErrors.content = { text: msg, warn: 'warn' };

      publishingChecks.current['body'] = 'flagged';
      isPublishingRef.current = false;
    }
    //  body content is clear for publishing!
    else tempErrors.content = null;


    /**
     *  CHECK TAGS
     */

    //  check for empty tags...
    if (tags.length === 0) {
      let msg = 'Missing project tags.';
      tempErrors.tags = { text: msg, warn: '' };

      isPublishingRef.current = false;
    }
    //  check for too-few tags...
    else if (tags.length < 3 && publishingChecks.current.tags !== 'proceed') {
      let msg = 'How about some more tags?';
      tempErrors.tags = { text: msg, warn: 'warn' };

      publishingChecks.current['tags'] = 'flagged';
      isPublishingRef.current = false;
    }
    //  tags cleared for publishing!
    else tempErrors.tags = null;


    /**
     *  CHECK THUMBNAILS...
     */

    // are there even any images selected? No?
    if (imageFiles.length < 1) {
      let msg = 'Missing thumbnail images.';
      tempErrors.thumbnails = { text: msg, warn: '' };

      isPublishingRef.current = false;
    }

    // have the selected images been successfully uploaded and the URLs logged into imageURLs[]? Then we're good!
    else if (imageFiles.length == imageURLs.length && imageFiles.length == imageFiles.filter((file) => file.status == 'success').length) {

      tempErrors.thumbnails = null;
      publishingChecks.current.images = null;
    }

    // are they still unprocessed? Haven't even attempted an upload? Get it rollin!
    else if (imageFiles.length == imageFiles.filter((file) => file.status === undefined).length) {
      setStartUpload(true);
      publishingChecks.current['images'] = 'uploading';
    }

    // have we been here before and they're choosing to proceed? Okie-dokie!
    else if (publishingChecks.current.images == 'proceed')  tempErrors.thumbnails = null;

    else {
      let filesWithErrors = imageFiles.filter((file) => file.status == 'error');
      let msg = `${filesWithErrors.length} images failed to upload. Proceed anyways?`;
      tempErrors.thumbnails = { text: msg, warn: 'warn' };

      isPublishingRef.current = false;
    }


    /**
     *  CHECK REPO URL
     */

    //  check Repo URL ...
    if (!repoUrl && publishingChecks.current.repoUrl !== 'proceed') {
      let msg = 'Should there be a link for a repo?';
      tempErrors.repoUrl = { text: msg, warn: 'warn' };

      publishingChecks.current['repoUrl'] = 'flagged';
      isPublishingRef.current = false;
    }
    //  cleared for publishing!
    else {
      tempErrors.repoUrl = null;
      publishingChecks.current['repoUrl'] = '';
    }

    
    // if we're publishing a 'PROJ'...
    /**
     *  CHECK LIVE SITE URL
     */
    
    if (itemType === 'project') {
      //  check live site URL...
      if (!liveUrl && publishingChecks.current.liveUrl !== 'proceed') {
        let msg = 'Should there be a link to a live site?';
        tempErrors.liveUrl = { text: msg, warn: 'warn' };

        publishingChecks.current['liveUrl'] = 'flagged';
        isPublishingRef.current = false;
      }
      //  cleared for publishing!
      else {
        tempErrors.liveUrl = null;
        publishingChecks.current['liveUrl'] = '';
      }
    }

    // if we're publishing a 'CERT'...
    if (itemType === 'certification') {

      /**
       *  CHECK CERTIFICATION DATE
       */
      if (!certDate) {
        let msg = 'Need to set date for when this certification was earned.';
        tempErrors.certDate = { text: msg, warn: '' };

        isPublishingRef.current = false;
      }
      //  cleared for publishing
      else tempErrors.certDate = null;

      /**
       *  CHECK CERTIFICATION URL
       */
      if (!certUrl) {
        let msg = 'URL to an online certificate is required.';
        tempErrors.certUrl = { text: msg, warn: '' };

        isPublishingRef.current = false;
      }
      // cleared for publishing!
      else tempErrors.certUrl = null;
    }

    // update errors state...
    setPubErrors(tempErrors);




    if (!isPublishingRef.current && Object.values(publishingChecks.current).includes('flagged')) {
      setErrorText('Some items have been flagged. Please review before proceeding.');
      pubBtn.disabled = false;
      pubBtn.innerText = 'Proceed';
    }
    else if (!isPublishingRef.current) {
      pubBtn.disabled = false;
      pubBtn.innerText = 'Publish';
    }
    else if (publishingChecks.current.images !== 'uploading') {
      console.log('All checks passed, posting project...');
      postNewProject();
    }

  }


  return (
    <>
      <section>


        {/* LOADING MSG */}
        {loading && (
          <div className="content with-background bg-grad">
            <p className="loading-text">Loading project…</p>
          </div>
        )}

        {/* PICK ITEM TYPE */}
        {!loading && !itemType && (
          <div className="content with-background">
            <p>Please select an item type to publish.</p>
            <select value={itemType} onChange={(e) => setItemType(e.target.value)}>
              <option value="">Select item type</option>
              <option value="project">Portfolio Project</option>
              <option value="certification">Certification</option>
            </select>
          </div>
        )}

        {/* DISPLAY EDITOR */}
        {!loading && itemType && (

          <div className="content with-background add-item">

            <h1>{actionType == 'edit' ? 'Edit' : 'Add New'} {itemType == 'project' ? 'Portfolio Project' : 'Certification'}</h1>

            <form id="add-item-form">

              {/* <!-- This hidden button prevents implicit submission --> */}
              <button type="submit" disabled style={{ display: "none" }} aria-hidden="true"></button>

              <div className="item-title">
                <label htmlFor="title">Title:
                  {pubErrors.title && <span className={`error-msg ${pubErrors.title.warn}`}> {pubErrors.title.text}</span>}
                </label>
                <input
                  type='text'
                  id='title'
                  value={title}
                  placeholder='Title'
                  onChange={(e) => setTitle(e.target.value)}
                />

              </div>

              <h3 className={'item-body ' + `${(content != '<p><br></p>' && content.length > 15) && 'show'}`}>Body:
                {pubErrors.content && <span className={`error-msg ${pubErrors.content.warn}`}> {pubErrors.content.text}</span>}
              </h3>
              <QuillRichText ref={quillRef} setRichTextContent={setContent} />

              <h3 className={'item-tags ' + `${(tags.length > 0) && 'show' }`}>Tags:
                {pubErrors.tags && <span className={`error-msg ${pubErrors.tags.warn}`}> {pubErrors.tags.text}</span>}
              </h3>
              <TagsInput tags={tags} setTags={setTags} />

              <h3 className={'item-images ' + `${(imageFiles.length > 0) && 'show'}`}>Images:
                {pubErrors.thumbnails && <span className={`error-msg ${pubErrors.thumbnails.warn}`}> {pubErrors.thumbnails.text}</span>}
              </h3>
              <PhotoUpload {...photoUploadProps} />

              {itemType === 'certification' && (
                <>

                  < div className="item-date">
                    <label htmlFor="date">Date:
                      {pubErrors.certDate && <span className={`error-msg ${pubErrors.certDate.warn}`}> {pubErrors.certDate.text}</span>}
                    </label>
                    <input
                      type='date'
                      id='date'
                      placeholder='Date Achieved'
                      value={certDate.toString() || dateString}
                      onChange={(e) => setCertDate(e.target.value)}
                    />
                  </div>

                  <div className="item-certUrl">
                    <label htmlFor="certUrl">Link to Certification:
                      {pubErrors.certUrl && <span className={`error-msg ${pubErrors.certUrl.warn}`}> {pubErrors.certUrl.text}</span>}
                    </label>
                    <input
                      type='text'
                      id='certUrl'
                      value={certUrl}
                      placeholder='Link to Certification'
                      onChange={(e) => setCertUrl(e.target.value)}
                    />
                  </div>
                </>
              )}


              <div className="item-repoUrl">
                <label htmlFor="repoUrl">GitHub URL:
                  {pubErrors.repoUrl && <span className={`error-msg ${pubErrors.repoUrl.warn}`}> {pubErrors.repoUrl.text}</span>}
                </label>
                <input
                  type='text'
                  id='repoUrl'
                  value={repoUrl}
                  placeholder='Repo URL'
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
              </div>

              {itemType === 'project' && (
                <div className="item-liveUrl">
                  <label htmlFor="liveUrl">Live Site URL:
                    {pubErrors.liveUrl && <span className={`error-msg ${pubErrors.liveUrl.warn}`}> {pubErrors.liveUrl.text}</span>}
                  </label>
                  <input
                    type='text'
                    id='liveUrl'
                    value={liveUrl}
                    placeholder='Link to Live Site'
                    onChange={(e) => setLiveUrl(e.target.value)}
                  />
                </div>
              )}

              <div className="submit-btn">

                <button id='publish' onClick={(e) => validateForm(e)}>{actionType == 'edit' ? 'Update' : 'Publish'}</button>
                <p className="errorMsg">{errorText}</p>
              </div>
            </form>


          </div >
        )
        }
      </section >
    </>
  )
}
