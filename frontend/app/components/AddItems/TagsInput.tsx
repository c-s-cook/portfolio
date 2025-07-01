"use client"

import { useState, useEffect } from "react";

import "./TagsInput.css"

interface TagsInputProps {
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

/**
 * A faux text-input field component for inputting tags. Tags are separated by a comma (,) or
 * by pressing Enter, which then adds each string to tags[] and creates a boxed div
 * for said new tag.
 * 
 * For the tags, all special characters are filtered out except for the single-quote (')
 * 
 * @param {Object} TagsInputProps - a tags[<string>] variable and a setTags() function
 *                          
 * @returns {ReactNode}
 * 
 * @todo
 * Add a drop-down of suggestions with past tags that match the first few characters
 */

const TagsInput = ({ tags, setTags }: TagsInputProps) => {

    // State variables...
    const [newTag, setNewTag] = useState<string>('');



    // Tag box remove...
    const removeTagBox = (tag: string) => setTags(tags.filter((t) => t != tag));

    // and Tag box add...
    const addTagBox = (tag: string) => {
        return (
            <div className="tag-box" key={tag} data-tag={tag}>
                {tag}
                <div className="remove-tag" data-tag={tag} onClick={() => removeTagBox(tag)}>
                    <div></div>
                    <div></div>
                </div>
            </div>
        );
    }

    // highlight exisitng tag error...
    const highlightTagBox = (tag: string) => {
        document.querySelector(`.tag-box[data-tag="${tag}"]`).classList.add("error");

        setTimeout(() => {
            document.querySelector(`.tag-box[data-tag="${tag}"]`).classList.remove("error");
        }, 3000);
    }


    // Run only when the newTag value changes...
    useEffect(() => {

        // Add a new tag to the tags[], DOM will update upon change...
        const addTag = (tag: string): void => {

            const sanitizedTag = tag.trim().replace(/[^a-zA-Z0-9 ']/g, '');

            if (sanitizedTag) {
                console.log("stanitized! -> ", sanitizedTag);

                // Check if the tag already exists in the tags[]. If so, exit...
                if (tags.includes(sanitizedTag)) {
                    console.log(sanitizedTag, " is already in there: ", tags);
                    highlightTagBox(sanitizedTag);
                    setNewTag(sanitizedTag);
                    return;
                } else {
                    // Add the tag to tags[] and clear the input field...
                    setTags([...tags, sanitizedTag]);
                    setNewTag('');

                    // on the first run, clear the placeholder so that the faux-label doesn't keep popping in & out
                    if (tags.length === 0) {
                        const inputField = document.querySelector('input.tag-input-field') as HTMLInputElement;
                        if (inputField) {
                            inputField.removeAttribute("placeholder");
                        }
                    }

                }


            }
        }

        // handler for Enter keypress...
        const pressedEnter = (e) => {

            // remove the eventListener immediately or else it gets a bit loopy...
            document.getElementById('item-tags').removeEventListener("keydown", pressedEnter)

            if (e.key == "Enter") addTag(newTag);
        }

        // Add the tag if the user hits "Enter" within the #tag-itmes input field...
        document.getElementById('item-tags').addEventListener("keydown", pressedEnter)

        // Add the tag if the user adds a comma...
        if (newTag.endsWith(',')) addTag(newTag.slice(0, -1));  // slice the comma off the end

    }, [newTag])




    return (
        <>
            <div className="item-tags">
                <h3>Tags:</h3>
                <div id="tag-input">
                    <span id="set-tags">
                        {tags.map((tag) => addTagBox(tag))}
                    </span>
                    <input
                        type='text'
                        id='item-tags'
                        className='tag-input-field'
                        value={newTag}
                        placeholder='Tags'
                        onChange={(e) => setNewTag(e.target.value)}
                    />
                </div>

            </div>
        </>
    );
}

export default TagsInput;