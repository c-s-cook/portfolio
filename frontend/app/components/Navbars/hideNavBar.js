// Delete this file - moved this code into the
//  useEffect hook of Logo.jsx


const hideNavLogo = () => {

    const observeMainLogo = () => {

        console.log("i'm tryin here");
    
        if (mainLogo){
      
          const hideLogo = (entries) => {
            console.log("Fired Observer!", entries);
          }
      
          let observerOptions = {
            root: null,
            rootMargin: "30px",
            threshold: 1.0,
          }
      
          const observer = new IntersectionObserver(hideLogo, observerOptions);
        }
    }

    window.addEventListener("load", (event) => {
        const mainLogo = document.getElementById('main-logo');
        observeMainLogo();
        },
        false,
    );

    //  InsersectionObserver for Main Page Logo Banner & Navbar Logo

 
    
    // return (  );
}
 
export default hideNavLogo;