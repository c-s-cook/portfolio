"use client"


// import Image from 'next/image'
// import Link from 'next/link'

import { useEffect, useState } from 'react'




import { Satisfy } from 'next/font/google'
import Logo from './components/Logo/Logo'
import PreviewCard from './components/PreviewCard/PreviewCard'
import PreviewDeck from './components/PreviewDeck/PreviewDeck'
import TagCloud from './components/TagCloud/TagCloud'
const satisfy = Satisfy({ subsets: ['latin'], weight: ['400'] })


export default function Home() {

  const [projTagResults, setProjTagResults] = useState<boolean>(false);
  const [certTagResults, setCertTagResults] = useState<boolean>(false);

  function setTagResults (type: 'PROJ' | 'CERT', hasResults: boolean):void {
    if (type === 'PROJ') setProjTagResults(hasResults);
    else setCertTagResults(hasResults);
    console.log(`Tag results updated: ${type} has results? ${hasResults} | projTagResults: ${projTagResults} | certTagResults: ${certTagResults}`);
  };


  let prvi = 1;

  // Adding IntersectionObservers for any <section> with .content.extra-long
  // which would otherwise overflow the vertical height of the window. So
  // the observer toggles scrollsnap
  useEffect(() => {
    // canceled that out...
    return;

    let scrollnapContainer = document.querySelector('.scrollsnap-container');
    let sections = document.querySelectorAll('section:has(>.content.extra-long)');
    if (scrollnapContainer && sections.length > 0) {

      let numSteps = 20;
      let buildThresholdsList = () => {
        const thresholds = [];

        for (let i = 1.0; i <= numSteps; i++) {
          const ratio = i / numSteps;
          thresholds.push(ratio);
        }

        thresholds.push(0);
        return thresholds;
      }

      // console.log('found scrollsnapContainer & these sections:', sections);

      let prevRatio = 0.0;
      let isSnapping = true;

      let scrollsnapToggle = (entries) => {
        entries.forEach((entry) => {

          if (entry.intersectionRatio < prevRatio && entry.intersectionRatio <= 0.45) {
            isSnapping = true;
            scrollnapContainer.style.scrollSnapType = "y mandatory";
          }
          else if (entry.intersectionRatio < prevRatio && isSnapping) {
            isSnapping = false;
            scrollnapContainer.style.scrollSnapType = "none";
          }

          prevRatio = entry.intersectionRatio;
        })
      }

      let observerToggleOptions = {
        root: null,
        rootMargin: "-10% 0% -10% 0%",
        threshold: buildThresholdsList(),
      }


      let observerToggle = new IntersectionObserver(scrollsnapToggle, observerToggleOptions);

      for (let section of sections) {
        observerToggle.observe(section);
      }
    }



  }, [])



  return (
    <>
      {/* <main className='scrollsnap'> */}





      <section className='scrollsnap'>
        <div className="content no-background">
          <Logo />
          <TagCloud projTagResults={projTagResults} certTagResults={certTagResults} />
        </div>
      </section>

      <section className='scrollsnap'>
        <div className="content with-background">

          <h2 className={satisfy.className}>About me...</h2>


          <div className="body">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pellentesque dignissim enim sit amet venenatis urna. In fermentum et sollicitudin ac orci phasellus egestas tellus. Cras semper auctor neque vitae. Tincidunt vitae semper quis lectus nulla at volutpat diam. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus. Vel pharetra vel turpis nunc eget lorem. Sodales ut eu sem integer vitae justo eget magna. Egestas erat imperdiet sed euismod nisi porta lorem. Dui accumsan sit amet nulla facilisi. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Turpis in eu mi bibendum neque egestas congue. Suspendisse interdum consectetur libero id faucibus nisl tincidunt.
            </p>
          </div>
        </div>
      </section>

      <section className='scrollsnap' id='projects'>
        <div className="content extra-long">

          <h2 className={satisfy.className}>Projects</h2>


          {/* <div className="body preview-deck">

            <PreviewCard cardID={1} />
            <PreviewCard cardID={2} />
            <PreviewCard cardID={3} />
            <PreviewCard cardID={4} />
            <PreviewCard cardID={5} />
            <PreviewCard cardID={6} />

          </div> */}

          <PreviewDeck type={'project'}  setTagResults={setTagResults}/>

        </div>
      </section>

      <section className='scrollsnap' id='certifications'>
        <div className="content extra-long">

          <h2 className={satisfy.className}>Certifications</h2>

          <PreviewDeck type={'certification'}  setTagResults={setTagResults}/>

        </div>
      </section>

      <section className='scrollsnap'>
        <div className="content">

          <h2 className={satisfy.className}>About me 3...</h2>

          <div className="body">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pellentesque dignissim enim sit amet venenatis urna. In fermentum et sollicitudin ac orci phasellus egestas tellus. Cras semper auctor neque vitae. Tincidunt vitae semper quis lectus nulla at volutpat diam. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus. Vel pharetra vel turpis nunc eget lorem. Sodales ut eu sem integer vitae justo eget magna. Egestas erat imperdiet sed euismod nisi porta lorem. Dui accumsan sit amet nulla facilisi. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Turpis in eu mi bibendum neque egestas congue. Suspendisse interdum consectetur libero id faucibus nisl tincidunt.
            </p>
          </div>

        </div>
      </section>

      <section className='scrollsnap'>
        <div className="content">

          <h2 className={satisfy.className}>About me 4...</h2>

          <div className="body">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pellentesque dignissim enim sit amet venenatis urna. In fermentum et sollicitudin ac orci phasellus egestas tellus. Cras semper auctor neque vitae. Tincidunt vitae semper quis lectus nulla at volutpat diam. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus. Vel pharetra vel turpis nunc eget lorem. Sodales ut eu sem integer vitae justo eget magna. Egestas erat imperdiet sed euismod nisi porta lorem. Dui accumsan sit amet nulla facilisi. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Turpis in eu mi bibendum neque egestas congue. Suspendisse interdum consectetur libero id faucibus nisl tincidunt.
            </p>
          </div>

        </div>
      </section>

      {/* </main> */}


    </>
  )
}
