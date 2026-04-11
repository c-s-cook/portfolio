"use client"


// import Image from 'next/image';
// import Link from 'next/link';

import { useEffect, useState, Suspense } from 'react';
import { Satisfy } from 'next/font/google';
const satisfy = Satisfy({ subsets: ['latin'], weight: ['400'] });


import Logo from './components/Logo/Logo';
import PreviewCard from './components/PreviewCard/PreviewCard';
import PreviewDeck from './components/PreviewDeck/PreviewDeck';
import TagCloud from './components/TagCloud/TagCloud';

import getPortfolio from '@lib/getPortfolio';
import { UniqueTag, Portfolio } from '@lib/types';
import LoadingHome from './loading';




export default function Home() {

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  // const [uniqueTags, setUniqueTags] = useState<UniqueTag[]>([]);
  const [projTagResults, setProjTagResults] = useState<boolean>(false);
  const [certTagResults, setCertTagResults] = useState<boolean>(false);


  // attempting to dynamically add an "extra-long" class so that the scrollsnap can still work...
  const toggleExtraLong = () => {
    const contentDivs = document.querySelectorAll('section.scrollsnap > .content');
    const windowHeight = window.innerHeight;

    contentDivs.forEach((div: HTMLElement) => {
      
      if (div.offsetHeight > windowHeight*.9) div.classList.add('extra-long'); 
      else  div.classList.remove('extra-long');

    });
  }


  useEffect(() => {

    const fetchPortfolio = async () => {
      const portfolio: Portfolio = await getPortfolio();

      if (portfolio) setPortfolio(portfolio);
    }
    fetchPortfolio();

  }, []);


  useEffect(() => {

    if (portfolio) {
      var checkExtraLong = setTimeout(toggleExtraLong, 250)
      
      window.addEventListener('resize', toggleExtraLong);
    }

    return () => {
      window.removeEventListener('resize', toggleExtraLong);
      clearTimeout(checkExtraLong);
    }
  }, [portfolio]);

  function setTagResults(type: 'PROJ' | 'CERT', hasResults: boolean): void {
    if (type === 'PROJ') setProjTagResults(hasResults);
    else setCertTagResults(hasResults);
    // console.log(`Tag results updated: ${type} has results? ${hasResults} | projTagResults: ${projTagResults} | certTagResults: ${certTagResults}`);
  };




  return (
    <>
      {/* <main className='scrollsnap'> */}




      {!portfolio && <LoadingHome />}

      {portfolio &&
        <>
          <section className='scrollsnap'>
            <div className="content no-background">
              <Logo />
              <TagCloud portfolio={portfolio} projTagResults={projTagResults} certTagResults={certTagResults} />
            </div>
          </section>




          <section className='scrollsnap'>
            <div className="content with-background">

              <h2 className={satisfy.className}>About me...</h2>


              <div className="body">
                <p>
                  A mild-mannered A/V geek by day. But when kids' melatonine pills finally kick in, I transform into a coding geek. ...so really, not much of a shift there.
                </p>
              </div>
            </div>
          </section>


          <section className='scrollsnap' id='projects'>
            <div className="content">

              <h2 className={satisfy.className}>Projects</h2>

              <PreviewDeck type={'project'} portfolio={portfolio} setTagResults={setTagResults} />

            </div>
          </section>

          <section className='scrollsnap' id='certifications'>
            <div className="content">

              <h2 className={satisfy.className}>Certifications</h2>

              <PreviewDeck type={'certification'} setTagResults={setTagResults} />

            </div>
          </section>

          <section className='scrollsnap'>
            <div className="content">

              <h2 className={satisfy.className}>What AI Thinks I should say about myself...</h2>

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

        </>
      }

      {/* </main> */}


    </>
  )
}
