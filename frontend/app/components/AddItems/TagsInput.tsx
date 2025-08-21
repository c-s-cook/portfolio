"use client"

import { useState, useEffect, useRef } from "react";

import "./TagsInput.css"

import getPortfolio from "../../../lib/getPortfolio";
import type { Portfolio, UniqueTag } from "../../../lib/types";


interface TagsInputProps {
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagsInput = ({ tags, setTags }: TagsInputProps) => {

    // State variables...
    const [newTag, setNewTag] = useState<string>('');
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);


    //  use a ref for portfolio
    const portfolio = useRef<Portfolio>({} as Portfolio);

    // Run on first load of DOM and populate portfolio ref
    useEffect(() => {

        const loadPortfolio = async () => {
            portfolio.current = await getPortfolio();
        }
        loadPortfolio();

    }, [])


    // Tag box remove...
    const removeTagBox = (tag: string) => setTags(tags.filter((t) => t != tag));

    // and Tag box add (render)...
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

    // highlight existing tag error...
    const highlightTagBox = (tag: string) => {
        const el = document.querySelector(`.tag-box[data-tag="${tag}"]`);
        if (el) el.classList.add("error");

        setTimeout(() => {
            const e = document.querySelector(`.tag-box[data-tag="${tag}"]`);
            if (e) e.classList.remove("error");
        }, 3000);
    }

    // reusable addTag logic (sanitizes, checks duplicates, updates tags state)
    const addTag = (raw: string) => {
        const sanitizedTag = raw.trim().replace(/[^a-zA-Z0-9 ./']/g, '');

        if (!sanitizedTag) return;

        // Check if the tag already exists in the tags[]. If so, highlight and set as current input
        if (tags.includes(sanitizedTag)) {
            highlightTagBox(sanitizedTag);
            setNewTag(sanitizedTag);
            return;
        }

        // Add the tag to tags[] and clear the input field...
        setTags([...tags, sanitizedTag]);
        setNewTag('');
        setShowSuggestions(false);

        // on the first run, clear the placeholder so that the faux-label doesn't keep popping in & out
        if (tags.length === 0) {
            const inputField = document.querySelector('input.tag-input-field') as HTMLInputElement;
            if (inputField) {
                inputField.removeAttribute("placeholder");
            }
        }
    }

    // compute suggestion list from portfolio.uniqueTags
    const allUniqueTags: string[] = (portfolio.current && Array.isArray(portfolio.current.uniqueTags))
        ? portfolio.current.uniqueTags.map((u: UniqueTag) => u.tag)
        : [];

    const filteredSuggestions = newTag.trim().length > 0
        ? allUniqueTags
            .filter(t => t.toLowerCase().startsWith(newTag.trim().toLowerCase()))
            .filter(t => !tags.includes(t))
            .slice(0, 10)
        : [];

    // reset selectedIndex when suggestions change
    useEffect(() => {
        setSelectedIndex(filteredSuggestions.length > 0 ? 0 : -1);
    }, [filteredSuggestions.length]);

    // handle selection of suggestion (from click or keyboard)
    const selectSuggestion = (tag: string) => {
        addTag(tag);
        setShowSuggestions(false);
    }

    // keyboard handling on input
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (filteredSuggestions.length === 0) return;
            setSelectedIndex((idx) => Math.min(idx + 1, filteredSuggestions.length - 1));
            setShowSuggestions(true);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (filteredSuggestions.length === 0) return;
            setSelectedIndex((idx) => Math.max(idx - 1, 0));
            setShowSuggestions(true);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            // if a suggestion is selected, add that; otherwise add the current input
            if (showSuggestions && selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
                selectSuggestion(filteredSuggestions[selectedIndex]);
            } else {
                addTag(newTag);
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    }

    // handle input change and comma shortcut
    const handleChange = (value: string) => {
        // if user types a comma at the end, add the tag immediately
        if (value.endsWith(',')) {
            addTag(value.slice(0, -1));
            return;
        }

        setNewTag(value);
        setShowSuggestions(value.trim().length > 0);
    }


    return (
        <>
            <div className="item-tags">
                <h3>Tags: <span className="error-msg"></span></h3>
                <div id="tag-input" className="tag-input-wrapper" style={{ position: 'relative' }}>
                    <span id="set-tags">
                        {tags.map((tag) => addTagBox(tag))}
                    </span>
                    <input
                        type='text'
                        id='item-tags'
                        className='tag-input-field'
                        value={newTag}
                        placeholder='Tags'
                        onChange={(e) => handleChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={() => {
                            // delay hiding to allow click events on suggestions to register
                            setTimeout(() => setShowSuggestions(false), 150);
                        }}
                        onFocus={() => setShowSuggestions(newTag.trim().length > 0)}
                    />

                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <ul className="suggestions-dropdown" style={{ position: 'absolute', top: '100%', left: 0, zIndex: 30 }}>
                            {filteredSuggestions.map((sug, idx) => (
                                <li
                                    key={sug}
                                    className={`suggestion-item ${idx === selectedIndex ? 'active' : ''}`}
                                    onMouseDown={(e) => { e.preventDefault(); selectSuggestion(sug); }}
                                >
                                    {sug}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </>
    );
}

export default TagsInput;