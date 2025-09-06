
import Image from 'next/image'
import Link from 'next/link'




import { Satisfy } from 'next/font/google'
import Logo from './components/Logo/Logo'
import PreviewCard from './components/PreviewCard/PreviewCard'
const satisfy = Satisfy({ subsets: ['latin'], weight: ['400'] })


export default function Home() {


  let prvi=1;



  return (
    <>
      {/* <main className='scrollsnap'> */}

      
      
        
        
        <section>
          <div className="content no-background">
            <Logo />
          </div>
        </section>

        <section>
          <div className="content with-background">
        
            <h2 className={satisfy.className}>About me...</h2>
      
            
            <div className="body">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pellentesque dignissim enim sit amet venenatis urna. In fermentum et sollicitudin ac orci phasellus egestas tellus. Cras semper auctor neque vitae. Tincidunt vitae semper quis lectus nulla at volutpat diam. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus. Vel pharetra vel turpis nunc eget lorem. Sodales ut eu sem integer vitae justo eget magna. Egestas erat imperdiet sed euismod nisi porta lorem. Dui accumsan sit amet nulla facilisi. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Turpis in eu mi bibendum neque egestas congue. Suspendisse interdum consectetur libero id faucibus nisl tincidunt.
            </p>
            </div>
          </div>
        </section>

        <section>
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

        <section>
          <div className="content">
            
            <h2 className={satisfy.className}>About me 3...</h2>
            
            <div className="body">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pellentesque dignissim enim sit amet venenatis urna. In fermentum et sollicitudin ac orci phasellus egestas tellus. Cras semper auctor neque vitae. Tincidunt vitae semper quis lectus nulla at volutpat diam. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus. Vel pharetra vel turpis nunc eget lorem. Sodales ut eu sem integer vitae justo eget magna. Egestas erat imperdiet sed euismod nisi porta lorem. Dui accumsan sit amet nulla facilisi. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan. Turpis in eu mi bibendum neque egestas congue. Suspendisse interdum consectetur libero id faucibus nisl tincidunt.
            </p>
            </div>

          </div>
        </section>

        <section>
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
