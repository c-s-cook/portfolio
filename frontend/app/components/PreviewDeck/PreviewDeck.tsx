'use client';

import React, { useEffect, useState } from 'react';
import getPortfolio from '../../../lib/getPortfolio';
import type { Project, Certification } from '../../../lib/types';
import PreviewCard from '../PreviewCard/PreviewCard';
import './PreviewDeck.css';

type Props = {
  type: 'project' | 'certification';
  slideInterval?: number;
};


const SearchIcon = () => {
  return (
    <div className='search-icon'>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" /></svg>
    </div>
  )
}


export default function PreviewDeck({ type, slideInterval = 5000 }: Props) {
  const [items, setItems] = useState<Project[] | Certification[] | null>(null);
  const [allItems, setAllItems] = useState<Project[] | Certification[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getPortfolio()
      .then((portfolio) => {
        if (!mounted) return;
        if (!portfolio) {
          setError('No portfolio data returned');
          return;
        }

        if (type === 'project') {
          const list = portfolio.projects || [];
          console.log('testing list length: ', list.length);
          // setAllItems(list);
          // setItems(list);

          // testing larger group...
          const testList = list.concat([...list]).concat([...list]);
          console.log('testList length = ', testList.length);
          setAllItems(testList);
          setItems(testList);

        } else {
          const list = portfolio.certifications || [];
          setAllItems(list);
          setItems(list);
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setError(String(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [type]);

  // Apply tag filtering when query or allItems changes
  useEffect(() => {
    if (!allItems) return;
    // const q = query.trim().toLowerCase();
    const q = query.split(',');
    if (!q) {
      setItems(allItems);
      return;
    }


    let toBeFiltered = [...allItems];
    for (let i = 0; i < q.length; i++) {
      toBeFiltered = toBeFiltered.filter((item) => {
        const tags = (item as any).tags || [];
        return tags.some((t: string) => t.toLowerCase().includes(q[i].trim().toLowerCase()));
      })
    }
    setItems(toBeFiltered);





  }, [query, allItems]);

  if (loading) return <div className="preview-deck loading">Loading...</div>;
  if (error) return <div className="preview-deck error">Error: {error}</div>;

  return (
    <>
      <div className="preview-search">
        <input
          aria-label="Filter by tag"
          placeholder="Filter by tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          // onClick={(e) => e.target.placeholder='Separate by commas.'}
          onFocus={(e) => e.target.placeholder = 'Separate by commas...'}
          onBlur={(e) => e.target.placeholder = 'Filter by tags...'}
        />
        <SearchIcon />
      </div>
      <div className="body preview-deck">
        {!items || items.length === 0 && (
          <p>No {type} matches found.</p>
        )}
        {items.map((item, i) => (
            <PreviewCard
              cardID={i}
              project={item as Project & Certification}
              slideinterval={slideInterval}
            />

        ))}
      </div>
    </>
  );
}
