'use client';

import React, { useEffect, useState, useRef } from 'react';
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

  const [activeCards, setActiveCards] = useState<number[]>([]);
  const [observedCards, setObservedCards] = useState<boolean[]>([]);
  const [observerClasses, setObserverClasses] = useState<string[]>([]);
  // const [scrollDirection, setScrollDirection] = useState<string>('DOWN');
  const scrollDirection = useRef('DOWN');

  // function to pass to PreviewCards for updating Observations...
  function updateObserved(id: number, seeIt: boolean) {

    setObservedCards((prevCards) => {
      let newCards = [...prevCards];

      newCards[id] = seeIt;

      // console.log('updated observedCards = ', newCards);

      return [...newCards]
    })
  }

  let activeLimit: number = 2;  // max of how many PreviewCards can be active at once

  // on first-load, set the activeCards to the first few, up to the activeLimit
  // useEffect(() => {
  //   setActiveCards((prevCards) => {
  //     let newCards: number[] = [];
  //     for (let i = 0; i < activeLimit; i++) newCards.push(i)
  //     return [...newCards]
  //   })
  // }, [])

  // Update the record of which PreviewCards are active...
  let lastCardUpdate = useRef(new Date());
  useEffect(() => {

    // create logic to check that the lastCardUpdate was more than 700ms ago. If not, set a 500ms delay
    {
      const now = Date.now();
      const elapsed = now - lastCardUpdate.current.getTime();

      if (elapsed < 700) {
      const delayMs = 500;
      const timer = setTimeout(() => {
        // update the last update timestamp and trigger the effect again by nudging observedCards
        lastCardUpdate.current = new Date();
        setObservedCards(prev => [...prev]);
      }, delayMs);

      // cleanup the timer if the effect re-runs / unmounts
      // return () => clearTimeout(timer);
      clearTimeout(timer);
      } else {
      // mark this as the most recent update time
      lastCardUpdate.current = new Date();
      }
    }

    let tempActiveCards: number[] = [];
    // console.log('activeCards = ', activeCards);

    // if no cards are currently marked active...
    if (activeCards.length == 0 || isNaN(activeCards[0])) {
      for (let i = 0; i < activeLimit; i++) {
        let a = scrollDirection.current === 'DOWN' ? i : observedCards.length - (1 + i);
        if (observedCards[a]) tempActiveCards.push(a);
      }
      tempActiveCards.sort((a, b) => { return a < b ? -1 : 1 })

      setObserverClasses((prevObserverClasses) => {
        let newObserverClasses = new Array(observedCards.length).fill('');

        tempActiveCards.forEach((el) => newObserverClasses[el] = 'active');
        console.log('first load? newObserverClasses: ', newObserverClasses)

        return [...newObserverClasses];
      })

      setActiveCards([...tempActiveCards]);
    }
    // else, check which of the currently active cards are still in observation range...
    else {
      for (let i = 0; i < activeLimit; i++) {
        if ((observedCards[activeCards[i]])) tempActiveCards.push(activeCards[i]);
      }
    }

    

    //  if we aren't maxed out...
    if (tempActiveCards.length !== activeLimit) {
      console.log('Early tempActiveCards = ', tempActiveCards, ' Length: ', tempActiveCards.length);

      let lastActiveIndex: number;

      // but still have some...
      if (tempActiveCards.length > 0) {
        lastActiveIndex = tempActiveCards[tempActiveCards.length - 1];
      }
      // else, if we lost all...
      else {
        // make an array of currently visible cards...
        let observedFilteredCards: number[] = [];
        observedCards.map((el, i) => {
          if (el) observedFilteredCards.push(i);
        })
        console.log('Currently visible cards are: ', observedFilteredCards);

        // THIS LINE IS THE ISSUE. IT ASSUMES LOST - NO LOGIC FOR 'NEVER SET'...
        lastActiveIndex = scrollDirection.current === 'DOWN' ? observedFilteredCards[observedFilteredCards.length - 1] : observedFilteredCards[0];
        console.log('We are scrolling ', scrollDirection.current, ' so the lastActiveIndex is: ', lastActiveIndex);
      }

      // once we know where we left off, add the index of more visible cards..
      while (tempActiveCards.length < activeLimit) {
        // if we're scrolling DOWN, add the next index. Else (UP), add the previous
        lastActiveIndex = scrollDirection.current === 'DOWN' ? lastActiveIndex + 1 : lastActiveIndex - 1;

        // unless is pushes us below 0, or above the length/number of our card deck...
        if (lastActiveIndex < 0 || lastActiveIndex > observedCards.length) break;

        tempActiveCards.push(lastActiveIndex)
      }

      console.log('Late tempActiveCards = ', tempActiveCards);

      // now that we've determined which cards are both in our desired visible range, and should be set active,
      // update the classList array and the activeCards
      setObserverClasses((prevObserverClasses) => {
        let newObserverClasses = new Array(observedCards.length).fill('');

        tempActiveCards.forEach((el) => newObserverClasses[el] = 'active');
        console.log('newObserverClasses: ', newObserverClasses)

        return [...newObserverClasses];
      })

      setActiveCards([...tempActiveCards]);
    }



  }, [observedCards])

  // listener for setting scrollDirection...
  let lastScrollTop = useRef(0);
  useEffect(() => {
    // A variable to store the last known scroll position
    lastScrollTop.current = window.pageYOffset || document.documentElement.scrollTop;

    window.addEventListener('scroll', () => {
      const scrollTopPosition = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTopPosition > lastScrollTop.current) {
        // console.log('Scrolling DOWN');
        if (scrollDirection.current !== 'DOWN') scrollDirection.current = 'DOWN';
      } else if (scrollTopPosition < lastScrollTop.current) {
        // console.log('Scrolling UP');
        if (scrollDirection.current !== 'UP') scrollDirection.current = 'UP';
      }

      // Update the last scroll position
      // Set to 0 to handle going all the way back to the top
      lastScrollTop.current = scrollTopPosition <= 0 ? 0 : scrollTopPosition;
    });
  }, [])

  // const updateObservedRef = useRef(updateObserved);
  // // keep ref in sync with latest prop
  // useEffect(() => {
  //   updateObservedRef.current = updateObserved;

  //   console.log('from Deck bbb: ', typeof updateObserved);
  // }, []);


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


  useEffect(() => {
    if (items && items.length > 0) {
      setObservedCards((prevCards) => {
        let newCards = [...prevCards];

        items.map((item, i) => {
          newCards[i] = false;
        })

        return [...newCards]
      });
      // setActiveCards((prevCards) => {
      //   let newCards = [...prevCards]

      //   items.map((item, i) => {
      //     newCards[i] = '';
      //   })
      //   return [...newCards]
      // })
      // console.log('from Deck: ', typeof updateObserved);
    }
  }, [items])


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
            key={`preview-card-${i}`}
            cardID={i}
            project={item as Project & Certification}
            slideinterval={slideInterval}
            observerOptions={{
              updateObserved: updateObserved,
              observerClasses: observerClasses[i]
            }}
          />

        ))}
      </div>
    </>
  );
}
