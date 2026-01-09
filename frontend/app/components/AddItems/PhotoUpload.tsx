"use client"

import { useState, useEffect } from "react";
import findKey from "../../../lib/findKey"

import './PhotoUpload.css'



export interface ImageURL {
    name: string;
    url: string | null;
    data?: JSON | null;
    ogName?: string;
    caption?: string;
    starred?: boolean;
}

export interface UploadFile extends File {
    status: null | "uploading" | "success" | "error" | "removed";
    tries: null | number;
    starred?: boolean;
    caption?: string;
    isBlob?: boolean;
}

export interface PhotoUploadProps {
    imageFiles: UploadFile[];
    setImageFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
    options?: {
        addCaptions?: boolean;  // Defaults to false
        addStar?: boolean;      // Defaults to false
        autoUpload?: {
            uploadAPI: string;
            imageURLs: ImageURL[];
            setImageURLs: React.Dispatch<React.SetStateAction<ImageURL[]>>;
            startUpload: boolean;
            resImageURLKey?: string; // Defaults to look for ['URL'] key in the API's response
            renameTo?: string;
            delay?: number;         // Delay before auto-uploading, in seconds. Default to 60.
            maxRetries?: number;    // Defaults to 3
        }

    }
}




/** PhotoUpload component for handling image file uploads with optional auto-upload functionality.
 *
 * This component allows users to select and preview image files (JPEG or PNG), remove selected images,
 * and optionally auto-upload them to a specified API endpoint. It manages upload status, retry logic,
 * and error handling, and supports customizable options such as API endpoint, response key, renaming,
 * upload delay, and maximum retries.
 *
 * @component
 * @param {PhotoUploadProps} props - The props for the PhotoUpload component.
 * 
 * @param {UploadFile[]} props.imageFiles - Array of image files to be managed and uploaded.
 * @param {React.Dispatch<React.SetStateAction<UploadFile[]>>} props.setImageFiles - State setter for imageFiles.
 * @param {Object} [props.options] - Optional configurations.
 * 
 * @param {boolean} props.options.addCaptions - Option to enable Add Captions feature to all images. Defaults to false.
 * @param {boolean} props.options.addStar - Option to enable Add Star feature to a single (banner) image. Defaults to false.
 * @param {boolean} props.options.autoUpload - Optional configuration for auto-uploading.
 * 
 * @param {string} props.options.autoUpload.uploadAPI - API endpoint for uploading images.
 * @param {ImageURL[]} props.options.autoUpload.imageURLs - Array of URL results from uploaded images.
 * @param {React.Dispatch<React.SetStateAction<ImageURL[]>>} props.options.autoUpload.setImageURLs - State setter for imageURLs.
 * @param {boolean} props.options.autoUpload.startUpload - A stateful boolean that, when updated to True, will initiate an upload, if the delay timer yet kicked it off.
 * @param {string} [props.options.autoUpload.resImageURLKey] - Optional key to extract image URL from API response. Defaults to look for a top-level 'URL' key.
 * @param {string} [props.options.autoUpload.renameTo] - Optional base name for renaming uploaded files.
 * @param {number} [props.options.autoUpload.delay=60] - Optional delay (in seconds) before auto-uploading. Defaults to 60.
 * @param {number} [props.options.autoUpload.maxRetries=3] - Optional maximum number of upload retries per file. Defaults to 3.
 *
 * @returns {JSX.Element} The rendered PhotoUpload component.
 *
 * @todo
 *  - Update .starred? on imageURLs[] if star change happens & images have already been uploaded...
 *  - [Future] - add Drag-n-Drop
 */

const PhotoUpload = ({ imageFiles, setImageFiles, options }: PhotoUploadProps) => {

    // State variables...
    const [tempImageFiles, setTempImageFiles] = useState(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [addingCaption, setAddingCaption] = useState<number | null>(null);
    const [photoCaption, setPhotoCaption] = useState<string>('');

    // State variables for (optional) auto-uploading functions...
    const [isCurrentlyUploading, setIsCurrentlyUploading] = useState<boolean>(false);
    const [imageCue, setImageCue] = useState<number[]>([]);
    const [isTimerDone, setIsTimerDone] = useState<boolean>(false);
    const [isRetryTimer, setIsRetryTimer] = useState<boolean>(false);
    const [currentUpload, setCurrentUpload] = useState<number | null>();

    // Destructure {options} param...
    if (options) {
        var { addCaptions, addStar, autoUpload } = options;
        if (autoUpload) var { uploadAPI, imageURLs, setImageURLs, startUpload, resImageURLKey, renameTo, delay, maxRetries } = autoUpload;
        maxRetries = maxRetries ? maxRetries : 3;
    }



    /****************************
     *                          *
     *      CORE FUNCTIONS      *
     *                          *
     ***************************/

    /**
     *  Handle faux 'Add Images' button click...
     */
    const addImages = () => document.getElementById("filefield").click();


    /**
     *  Handle 'Star Photo' icon click...
     * 
     *  @param index - of the file in imageFiles[] to star
     */
    const starImage = async (index) => {
        console.log('star cliked on image ', index);

        setImageFiles((prevImageFiles) => {
            let updatedImageFiles = [...prevImageFiles];

            if (updatedImageFiles[index].starred) {
                console.log('unstarring image file ', index)
                updatedImageFiles[index].starred = false;
            } else {
                for (let f = 0; f < updatedImageFiles.length; f++) updatedImageFiles[f].starred = (f == index) ? true : false;
            }

            return [...updatedImageFiles];
        })

        if (imageURLs.length == 0) return;

        setImageURLs((prevImageURLs) => {
            let updatedImageURLs = [...prevImageURLs];

            if (updatedImageURLs[index].starred) {
                console.log('unstarring image url ', index)
                updatedImageURLs[index].starred = false;
            } else {
                for (let u = 0; u < updatedImageURLs.length; u++) updatedImageURLs[u].starred = (u == index) ? true : false;
            }

            return [...updatedImageURLs];
        })

    }


    /**
     *  Handle 'Add Caption' button click...
     * 
     *  @param index - of the file in imageFiles[] to add caption
     */
    const attachCaption = async () => {

        const specialCharRegex = /[^a-zA-Z0-9\s'.#?!]/g;
        let tempPhotoCaption = photoCaption.trim().replace(specialCharRegex, '');

        console.log('Attaching caption to image ', addingCaption, ' : ', tempPhotoCaption);

        setImageFiles((prevImageFiles) => {
            let updatedImageFiles = [...prevImageFiles];

            if (tempPhotoCaption === '') {
                delete (updatedImageFiles[addingCaption].caption);
            } else {
                updatedImageFiles[addingCaption].caption = tempPhotoCaption;
            }

            // if this image has already been uploaded, add the caption to imageURLs[] as well...
            if (updatedImageFiles[addingCaption].status == 'success') {
                if (updatedImageFiles[addingCaption].name == imageURLs[addingCaption].name || updatedImageFiles[addingCaption].name == imageURLs[addingCaption].ogName) {
                    setImageURLs((prevImageURLs) => {
                        let newImageURLs = [...prevImageURLs];

                        if (tempPhotoCaption === '') {
                            delete (newImageURLs[addingCaption].caption);
                        } else {
                            newImageURLs[addingCaption].caption = tempPhotoCaption;
                        }

                        return [...newImageURLs];
                    });
                }
            }

            return [...updatedImageFiles];
        })

        // null out the value of addingCaption (hide it)
        setAddingCaption(null);

        // clear the caption field...
        let captionInput = document.getElementById('photo-caption') as HTMLTextAreaElement;
        captionInput.value = '';
    }




    /**
     *  Handle 'Remove Photo' icon (x) click...
     * 
     *  @param index - of the file in imageFiles[] to remove
     */
    const removeImage = async (index) => {
        let newImageFiles = [...imageFiles];

        // handle removal of files that have already been uploaded...
        if (uploadAPI && newImageFiles[index].status == 'success') {
            newImageFiles[index].status = 'removed';
            for (let u = 0; u < imageURLs.length; u++) {
                if (imageURLs[u].name == newImageFiles[index].name || imageURLs[u].ogName == newImageFiles[index].name) {
                    setImageURLs((prevImageURLs) => {
                        let newImageURLs = [...prevImageURLs];
                        newImageURLs.splice(u, 1);
                        return [...newImageURLs];
                    });
                    break;
                }
            }
        }

        newImageFiles.splice(index, 1);
        setImageFiles([...newImageFiles]);
    }


    /**
     *  timer for error msg fade-out
     */
    var errorFadeTimer;
    const errorFadeCountdown = async () => {
        errorFadeTimer = setTimeout(() => {
            document.getElementById('image-file-errors').classList.remove('fade-in');
            document.getElementById('image-file-errors').classList.add('fade-out');
        }, 500)
    }






    /**
     *  applies Error Message fade-in and fade-out
     */
    useEffect(() => {
        if (errorMessage !== '') {

            document.getElementById('image-file-errors').classList.remove('fade-out');
            document.getElementById('image-file-errors').classList.add('fade-in');
            errorFadeCountdown();

        }
    }, [errorMessage])



    /**
     *  Adds new images to imageFiles[]
     * 
     *      - run when user selects new images (which updates the state of tempImageFiles[])
     * 
     * @fires setImageFiles()
     */
    useEffect(() => {
        const handleTempImageFiles = async () => {
            if (tempImageFiles) {

                // display the image preview area
                document.getElementById("image-preview-area").style.display = "flex";

                // const imageFileErrors = document.getElementById("image-file-errors");

                let tempArray = [...imageFiles];

                for (let f = 0; f < tempImageFiles.length; f++) {

                    // check against duplicate file uploads...
                    let nameMatches = tempArray.filter((file) => file.name == tempImageFiles[f].name)
                    var isDuplicate = false;
                    if (nameMatches.length > 0) {
                        console.log('duplicate name: ', tempImageFiles[f].name);

                        for (let m = 0; m < nameMatches.length; m++) {
                            if (nameMatches[m].size === tempImageFiles[f].size) isDuplicate = true;
                        }
                    }

                    if (isDuplicate) {

                        setErrorMessage(`${tempImageFiles[f].name} was previously added.`);
                    }
                    else if (tempImageFiles[f].type !== 'image/jpeg' && tempImageFiles[f].type !== 'image/png') {

                        setErrorMessage(`Only .jpg or .png files allows. ${tempImageFiles[f].name} not added.`);
                    }
                    else {

                        tempArray.push(tempImageFiles[f]);
                    }
                }
                setImageFiles(() => {
                    return [...tempArray]
                });
            }
        };

        handleTempImageFiles();
    }, [tempImageFiles])


    useEffect(() => {

        // check if image already has a caption
        if (imageFiles.length > 0 && addingCaption !== null) {

            if (imageFiles[addingCaption].caption || (imageURLs.length > 0 && imageURLs[addingCaption].caption)) {

                let tempCaption = imageFiles[addingCaption].caption || imageURLs[addingCaption].caption;
                setPhotoCaption(tempCaption);
            } else {
                setPhotoCaption('');
            }
        }

    }, [addingCaption])








    /**************************************
     *                                    *
     *       AUTO-UPLOAD FUNCTIONS        *
     *    - if {options} are passed -     *
     *                                    *
     *************************************/

    /**
     *  Creates a cue of imageFiles[] indices that are to be auto-uploaded
     * 
     *      - called from useEffect([isTimerDone])
     * 
     * @fires   setImageFiles()     updates imageFiles[], triggering useEffect([imageFiles])
     * @fires   setImageCue()       updates imageCue[], triggering useEffect([imageCue])
     * 
     */
    const cueImagesForUpload = async () => {

        setIsTimerDone(false);
        // safetey checks (shouldn't even get here if either are true)...
        if (isCurrentlyUploading || imageFiles.length < 1) {
            console.log('cueImagesForUpload() -- Failed safety check...');
            return;
        }


        // get the most recent state to check on each file status, then setState()...
        setImageFiles((prevImageFiles) => {
            let updatedImageFiles = [...prevImageFiles]

            for (let f = 0; f < updatedImageFiles.length; f++) {

                // create a 'tries' property if not already there...
                updatedImageFiles[f].tries = updatedImageFiles[f].tries || 0;


                // create 'status' property on if not already there...
                updatedImageFiles[f].status = updatedImageFiles[f].status ? updatedImageFiles[f].status : undefined;


                // check if we've exceeded retries number...
                if (updatedImageFiles[f].tries >= maxRetries) {
                    console.log(`\n\nFile ${f} already tried ${updatedImageFiles[f].tries} times. Not adding it to the cue.`)
                }
                //  check if it's already uploaded... (or already uploading, just in case of a loop...)
                else if (updatedImageFiles[f].status == 'success' || updatedImageFiles[f].status == 'removed' || updatedImageFiles[f].status == 'uploading') {
                }
                // check to make sure the index isn't already in there...
                else if (imageCue.includes(f)) {

                }

                else {
                    // was having some issues with 'tries' property, so this is a safety set...
                    if (updatedImageFiles[f].tries == undefined || Number.isNaN(updatedImageFiles[f].tries)) updatedImageFiles[f].tries = 0;

                    // add the index into imageCue[]...
                    setImageCue((prevCue) => {
                        return [...prevCue, f];
                    })

                }
            }

            // return array to the setImageFiles() that this is all within...
            return [...updatedImageFiles]
        })
    }

    /**
     *  Sends a file to the provided API end-point, 
     *  then adds the received URL to imageURLs[]
     * 
     *      - called from useEffect([imageCue[]])
     * 
     * @param f - The index of the file within imageFiles[] to upload.
     * 
     * @fires   setIsCurrentlyUploading() - toggles isCurrentlyUploading boolean
     * @fires   setImageURLs()  - on successful API call, adds URL results to imageURLs[]
     * @fires   setImageFiles()  -  updates .status of the file within imageFiles[]
     * @fires   setImageCue()  -  removes the passed index from imageCue[]
     *  
     */
    const uploadImage = async (f: number) => {

        let imageFile: UploadFile = imageFiles[f];
        let imageURL: ImageURL = {
            name: '',
            url: '',
            data: null
        }
        if (imageFile.starred) imageURL.starred = true;
        if (imageFile.caption) imageURL.caption = imageFile.caption;

        setIsCurrentlyUploading(true);

        // create payload container
        const formData = new FormData();

        // a regex for replacing ' - ' with '_'...




        // clean spaces out of the filename...
        var cleanedName = imageFile.name.replace(/[\s-]+/g, '_');
        console.log('ogName: ', imageFile.name, ' || cleanedName: ', cleanedName);

        // handle optional file renaming
        if (renameTo) {

            // base filename from options
            var newFileName = renameTo;

            // append the index number (+1), padded to 3 digits
            newFileName += `-${String((f + 1)).padStart(3, '0')}`;

            // append the file extension ....nah. Just gonna put the whole ogFileName on the end to reduce the chance of duplicate-name errors
            // newFileName += `.${imageFile.name.split('.').pop().toLowerCase()}`;  // split by . and take the last element (instead of [1]/second) just in case their were extra periods in the name

            // append the og filename...
            newFileName += `-${cleanedName}`;

            formData.append('imageFile', imageFile, newFileName);
            imageURL.name = newFileName;
        } else {
            formData.append('imageFile', imageFile, cleanedName);
            imageURL.name = cleanedName;
        }
        imageURL.ogName = imageFile.name;


        // send to API end-point...
        try {

            console.log(`\nAttempting to auto-upload #${f}. Previous attempts on ${f}: ${imageFile.tries}. Status: ${imageFile.status}.`);
            imageFile.tries++;

            const response = await fetch(uploadAPI, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                let data = await response.json();

                // handle optional response key specification...
                if (resImageURLKey && data.resImageURLKey) {
                    imageURL.url = data.resImageURLKey;
                } else if (resImageURLKey) {
                    let results = await findKey(data, resImageURLKey);
                    if (results) {
                        imageURL.url = results[resImageURLKey];
                    } else {
                        console.warn(`Coudn't find specified ${resImageURLKey} key within API response for file #${f}. Placing full API response into imageURLs[${f}].data...`);
                        imageURL.url = null;
                        imageURL.data = data;
                    }
                } else if (data.URL) {
                    // check for 'blob' flag to use local blob
                    if (data.URL == 'blob') {

                        imageURL.url = URL.createObjectURL(imageFile);
                        console.log(`Using local blob URL for file #${f}:`, imageURL.url);
                        imageFile.isBlob = true;
                    } else {
                        imageURL.url = data.URL;
                    }
                } else {

                    console.warn(`Coudn't find obvious 'URL' key within API response for file #${f}. Placing full API response into imageURLs[${f}].data...`);
                    imageURL.url = null;
                    imageURL.data = data;
                }

                setImageURLs((prevImageURLs) => {
                    let updatedImageURLs = [...prevImageURLs];
                    updatedImageURLs[f] = imageURL;
                    return [...updatedImageURLs]
                })

                console.log(`File ${f} uploaded successfully to --> ${imageURL.url}`);


                imageFile.status = 'success';


            } else {
                imageFile.status = 'error';
                throw new Error(`Failed to upload file ${f}.`);
            }

        } catch (error) {
            setErrorMessage(`Error during file ${f} upload.`)
            console.error(`Error during file ${f} upload:`, error);
            imageFile.status = 'error';

        }

        setIsCurrentlyUploading(false);

        // update the status & thereby the DOM icons...
        setImageFiles((prevImageFiles) => {
            let updatedImageFiles = [...prevImageFiles]
            updatedImageFiles[f] = imageFile;
            return [...updatedImageFiles]
        });

        // remove index from imageCue[].../should/ be the first item...
        if (f === imageCue[0]) setImageCue(imageCue.slice(1));
        else setImageCue(imageCue.filter((index) => index !== f));

    }

    /**
     *  Countdown timer for auto-uploading
     */
    var uploadTimer;
    const uploadCountdown = async () => {

        // don't start the timer if we're alreadying uploading...
        if (isCurrentlyUploading) return;

        let time: number = delay || 60;
        if (isRetryTimer) time = 5; // make it a shorter timer if we're retrying...

        uploadTimer = setTimeout(() => { setIsTimerDone(true) }, time * 1000);
    }



    // -----------  useEffect() calls for auto-uploads ---------------- //



    /***** []  (single run on first load)
     * 
     *  Triggers auto-upload countdown if the input-field looses focus
     */
    useEffect(() => {

        if (uploadAPI) {

            // listen for Input field focus-loss
            document.getElementById('filefield').addEventListener('focusout', () => {
                console.log('input lost focus...starting countdown...')
                clearTimeout(uploadTimer);
                uploadCountdown;
            });
        }

        /**
        *  check to see if imageUrls is longer than imageFiles (like from a loaded Auto-Save)...
        */ 
        if (imageURLs.length > imageFiles.length) {

            // display the image preview area
            document.getElementById("image-preview-area").style.display = "flex";

            for (let i = 0; i < imageURLs.length; i++) {
                let filename = imageURLs[i].ogName || imageURLs[i].name;

                if (!imageFiles[i]) {
                    const tempFile = new File(["lie...but we shouldn't ever access this"], filename, {
                        type: "text/plain",
                    });
                    tempFile.status = 'success';
                    tempFile.tries = 1;
                    imageFiles[i] = tempFile;
                }
                else if (filename !== imageFiles[i].name) {
                    console.log(`Possible mismatch: imageURLs[${i}]: ${filename}  |  imageFiles[${i}]: ${imageFiles[i].name}`)

                }

            }

        }

    }, [])



    /******* startUpload
     * 
     */
    useEffect(() => {

        if (startUpload) cueImagesForUpload();

    }, [startUpload])


    /*****  imageFiles[]
     * 
     *  Sends a file with 'uploading' status to be uploaded,
     *  or starts a countdown timer if there are uproccessed files.
     * 
     *  Triggered by updates in:
     *      - useEffect([tempImageFiles])
     *      - useEffect([imageCue])
     *      - cueImagesForUpload()
     *      - uploadImage()
     */
    useEffect(() => {

        if (uploadAPI && imageFiles.length > 0) {

            let isSentToUpload = false;

            for (let f = 0; f < imageFiles.length; f++) {
                // there should only be one file at a time marked as 'uploading'...
                if (imageFiles[f].status == 'uploading' && !isCurrentlyUploading) {

                    isSentToUpload = true;
                    console.log(`Sending index ${f} to upload...`)
                    uploadImage(f);
                    f = imageFiles.length;
                }
            }
            if (!isCurrentlyUploading && !isTimerDone && !isSentToUpload && (imageCue.length == 0)) {
                // have all of the files successfully uploaded? or been tried too many times?
                let successOrMaxedOutCheck = (imageFiles.filter((file) => (file.status == 'success' || file.tries >= maxRetries)).length >= imageFiles.length);

                if (!successOrMaxedOutCheck) {
                    clearTimeout(uploadTimer);
                    console.log('*************** Starting Upload Timer ***************');
                    uploadCountdown();
                }
            }
        }

    }, [imageFiles])


    /***** imageCue[]
     * 
     *  Sets the .status of a file to 'uploading'
     * 
     *  Triggered by updates in:
     *      - cueImagesForUpload()
     *      - uploadImage()
    */
    useEffect(() => {

        // set the first-in-cue file to 'uploading'
        if (imageCue.length > 0) {
            setImageFiles((prevImageFiles) => {
                let updatedImageFiles = [...prevImageFiles];
                let f = imageCue[0];

                updatedImageFiles[f].status = 'uploading';

                return [...updatedImageFiles];
            })
        }


    }, [imageCue])



    /**
     *  when timer finishes, triggers cueImagesForUpload()  
     */
    useEffect(() => {
        if (uploadAPI && imageFiles.length > 0) {

            if (!isRetryTimer) setIsRetryTimer(true);

            cueImagesForUpload();
        }

    }, [isTimerDone])




    /**************************
     * 
     *     React Node Return
     * 
     **************************/

    return (
        <>
            <div id="image-files">
                <button id="add-file-button" type="button" onClick={() => addImages()}>Add Images:</button>
                <span id="image-file-errors" className="fade-in">{errorMessage}</span>
                <input
                    type="file"
                    name="filefield"
                    id="filefield"
                    onChange={(e) => setTempImageFiles(e.target.files)}
                    title="Add Images"
                    multiple
                    accept="image/png, image/jpeg"
                    hidden
                />


                <div id="image-preview-area" style={{ display: 'none' }}>


                    {(addingCaption !== null) && <div id="add-photo-caption">
                        <label htmlFor="photo-caption">Photo Caption:</label>
                        <textarea
                            // type="textarea" 
                            name="photo-caption"
                            id="photo-caption"
                            value={photoCaption}
                            onChange={(e) => setPhotoCaption(e.target.value)}
                            placeholder="Add caption here"
                        />
                        <button onClick={attachCaption}>Set Caption</button>
                    </div>}

                    {imageFiles.map((file, index) => {

                        let imgSrc, status, starred, captioned;

                        // check if the file has been uploaded...
                        if (file.status === 'success') {
                            imgSrc = imageURLs[index].url;

                            status = 'success';
                            starred = imageURLs[index].starred ? 'is-starred' : '';
                            captioned = imageURLs[index].caption ? 'is-captioned' : '';
                        }

                        // validate that the file variable is of type Blob
                        else if ((file instanceof Blob) && file.type !== 'text/plain') {
                            imgSrc = URL.createObjectURL(file);

                            status = file.status ? file.status : 'remove';
                            starred = file.starred ? 'is-starred' : '';
                            captioned = file.caption ? 'is-captioned' : '';
                        }
                        else {
                            console.error(`File at index ${index} is not a valid Blob. Skipping rendering.`);
                            return null;
                        }



                        return (
                            <div className={`img-container ${file.isBlob ? 'is-blob' : ''}`} key={"img-container-" + index}>
                                <img
                                    src={imgSrc}
                                    key={"img" + index}
                                    alt="preview"
                                    className="img-preview"
                                />
                                {addStar && <div className={`icon star ${starred}`} key={`star-${index}`} onClick={() => starImage(index)}></div>}
                                <div className={`icon img-${status}`} key={`remove-${index}`} onClick={() => removeImage(index)}></div>
                                {addCaptions && <div className={`icon caption ${captioned}`} key={`caption-${index}`} onClick={() => setAddingCaption(index)}></div>}
                                {(addCaptions || addStar) && <div className="overlay" key={`overlay-${index}`}></div>}

                            </div>
                        );
                    })}
                </div>

            </div>
        </>
    );
}

export default PhotoUpload;