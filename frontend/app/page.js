"use client"


// import Image from 'next/image'
// import Link from 'next/link'

import { useEffect } from 'react'




import { Satisfy } from 'next/font/google'
import Logo from './components/Logo/Logo'
import PreviewCard from './components/PreviewCard/PreviewCard'
const satisfy = Satisfy({ subsets: ['latin'], weight: ['400'] })


export default function Home() {


  let prvi = 1;

  useEffect(() => {

    let sections = document.querySelectorAll('section');
    if (sections.length > 0) {


      let scrollsnapOn = (entries) => entries.forEach((entry) => entry.target.classList.add('scrollsnap'));

      let scrollsnapOff = (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.remove('scrollsnap');
        })
      }

      let observerOnOptions = {
        root: null,
        rootMargin: "20px",
        threshold: 0.0,
      }

      let observerOffOptions = {
        root: null,
        rootMargin: "0% 0% 10% 0%",
        threshold: 0.5,
      }

      let observerOn = new IntersectionObserver(scrollsnapOn, observerOnOptions);
      let observerOff = new IntersectionObserver(scrollsnapOff, observerOffOptions);

      for (let section of sections) {
        section.classList.toggle('scrollsnap');
        // observerOn.observe(section);
        // observerOff.observe(section);
      }
    }



  }, [])



  return (
    <>
      {/* <main className='scrollsnap'> */}





      <section className=''>
        <div className="content no-background">
          <Logo />
        </div>
      </section>

      <section className=''>
        <div className="content with-background">

          <h2 className={satisfy.className}>About me...</h2>


          <div className="body">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pellentesque dignissim enim sit amet venenatis urna. In fermentum et sollicitudin ac orci phasellus egestas tellus. Cras semper auctor neque vitae. Tincidunt vitae semper quis lectus nulla at volutpat diam. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus. Vel pharetra vel turpis nunc eget lorem. Sodales ut eu sem integer vitae justo eget magna. Egestas erat imperdiet sed euismod nisi porta lorem. Dui accumsan sit amet nulla facilisi. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Turpis in eu mi bibendum neque egestas congue. Suspendisse interdum consectetur libero id faucibus nisl tincidunt.
            </p>
          </div>
        </div>
      </section>

      <section className=''>
        <div className="content extra-long">

          <h2 className={satisfy.className}>Projects</h2>


          <div className="body preview-deck">





            <PreviewCard cardID={1} />
            <PreviewCard cardID={2} />
            <PreviewCard cardID={3} />
            <PreviewCard cardID={4} />
            <PreviewCard cardID={5} />
            <PreviewCard cardID={6} />



          </div>
        </div>
      </section>

      <section className=''>
        <div className="content">

          <h2 className={satisfy.className}>About me 3...</h2>

          <div className="body">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pellentesque dignissim enim sit amet venenatis urna. In fermentum et sollicitudin ac orci phasellus egestas tellus. Cras semper auctor neque vitae. Tincidunt vitae semper quis lectus nulla at volutpat diam. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus. Vel pharetra vel turpis nunc eget lorem. Sodales ut eu sem integer vitae justo eget magna. Egestas erat imperdiet sed euismod nisi porta lorem. Dui accumsan sit amet nulla facilisi. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Turpis in eu mi bibendum neque egestas congue. Suspendisse interdum consectetur libero id faucibus nisl tincidunt.
            </p>
          </div>

        </div>
      </section>

      <section className=''>
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
