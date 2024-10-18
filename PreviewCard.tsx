import Image from "next/image";

const PreviewCard = () => {
    return ( 
        <>
        <div className="preview-card with-background">
            <Image
                src="D:\CSC Docs\IMG-20210110-WA0000.jpg"
                width={500}
                height={500}
                alt="Picture of the author & child"
            />
            
            <img src="D:\CSC Docs\IMG-20210110-WA0000.jpg" alt="Testing one 2 three?" className="thumb" />
            <h2>Item Title Here</h2>
            <p className="preview-snippet">This is a snippet of text that should get gut off if there is too much and too lengthing a run of words here. Hopefully I can use a cut-off item for a read more element.</p>
        </div>
        </>
     );
}
 
export default PreviewCard;