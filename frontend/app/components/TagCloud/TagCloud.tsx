"use client"

import { useEffect, useState } from 'react';
import { UniqueTag, Portfolio } from '@lib/types';
import './TagCloud.css';
import '../AddItems/TagsInput.css';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import getPortfolio from '@lib/getPortfolio';

interface TagCloudProps {
    portfolio?: Portfolio,
    projTagResults?: boolean,
    certTagResults?: boolean,
}


export const TagCloud: React.FC<TagCloudProps> = ({ portfolio = null, projTagResults = false, certTagResults = false }: TagCloudProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [uniqueTags, setUniqueTags] = useState<UniqueTag[]>([]);


    const handleTagClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        const clickedTag = decodeURIComponent(e.currentTarget.getAttribute('data-tag') || '');
        const safeClickedTag = encodeURIComponent(clickedTag);

        const currentTags = decodeURIComponent(searchParams.get('tags') || '');

        // if there are already tags in the URL, we need to check if we're adding or removing the clicked tag...
        if (currentTags) {
            let tagsArray = currentTags.split(',').map(tag => tag.trim());

            // check if we're clearing the tag...
            if (tagsArray.includes(clickedTag!)) tagsArray = tagsArray.filter(tag => tag != clickedTag);
            // otherwise we must be adding a new tag...
            else tagsArray.push(clickedTag!);

            let newTags = tagsArray.join(',');

            // if we got'em, add'em...
            if (newTags) router.replace(`${pathname}?tags=${encodeURIComponent(newTags)}`, { scroll: false });

            // otherwise, just clear 'tags' from URL...
            else router.replace(pathname, { scroll: false });
        }

        // if there are no tags in the URL, we can just add the clicked tag...
        else router.replace(`${pathname}?tags=${safeClickedTag}`, { scroll: false });

    }



    useEffect(() => {
        const sortUniqueTags = (tags: UniqueTag[]) => {
            return tags.sort((a, b) => b.count - a.count);
        }

        const fetchUniqueTags = async () => {
            if (!portfolio) portfolio = await getPortfolio();

            setUniqueTags(sortUniqueTags(portfolio.uniqueTags));
        }
        fetchUniqueTags();
    }, []);


    if (uniqueTags.length > 0) {
        return (
            <>
                <div className='tag-cloud'>
                    {uniqueTags.map((uniqueTag) => (
                        <span
                            key={uniqueTag.tag}
                            data-tag={encodeURIComponent(uniqueTag.tag)}
                            className={`tag-box ${decodeURIComponent(searchParams.get('tags') || '').includes(uniqueTag.tag) ? 'active' : ''}`}
                            onClick={(e) => handleTagClick(e)}
                        >
                            {uniqueTag.tag}
                        </span>
                    ))}

                </div>
                <div className="tag-cloud-links">
                    <a href="#projects" className={projTagResults ? 'active' : ''}>
                        <button>
                            🠋 See Matching Projects
                        </button>

                    </a>
                    <a href="#certifications" className={certTagResults ? 'active' : ''}>
                        <button>
                            🠋 See Matching Certifications
                        </button>

                    </a>
                </div>
            </>
        );
    }
}

export default TagCloud;