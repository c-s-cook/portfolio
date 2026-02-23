"use client"

import { forwardRef, useEffect, useRef, Dispatch, SetStateAction } from 'react';

import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // for snow theme
import './QuillRichText.css';


// Additional Font menu options, here
import { Lobster, Quicksand } from 'next/font/google';

const lobster = Lobster({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-lobster',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})





/** Quill Rich Text Editor Component
 * 
 * @component
 * 
 * @param {React.Dispatch<React.Ref<HTMLDivElement>>} quillRef - a React useRef() instance for the quill <div>
 * @param {React.Dispatch<React.SetStateAction<string>>} setRichTextContent - state setter for a <string> of HTML (which is not passed to component, but declared & used by a parent)
 * 
 * @example
 * import { useState, useRef, useEffect } from "react";
 * import QuillRichText from "../components/Quill/QuillRichText";
 * 
 * const ExampleParentComponent = () => {
 * 
 *    const [richTextContent, setRichTextContent] = useState('');
 * 
 *    const quillRef = useRef();
 * 
 *    useEffect(() => {
*        if(quillRef.current) setRichTextContent(quillRef.current.root.innerHTML);
 *    });
 * 
 *    return (
 *      <>
 *          <QuillRichText
 *              ref={quillRef}
 *              setRichTextContent={setRichTextContent}
 *          />
 *      </>
 *    )
 * }
 * 
 * 
 * 
 * @todo
 *  - make extraFonts[] as passed param and programatically add the className to the quill <div> wrapper
 *  - add responsive styling
 * 
 */
interface QuillRichTextProps {
  setRichTextContent: Dispatch<SetStateAction<string>>;
}

const QuillRichText = forwardRef<any, QuillRichTextProps>(
  ({ setRichTextContent }, quillref: any) => {

    const containerRef = useRef<HTMLDivElement | null>(null);


    let extraFonts = [
      false,
      'Lobster',
      'Quicksand',
    ]

    const toolbarOptions = [
      [{ 'font': extraFonts }],        // custom fonts & toggled buttons
      ['bold', 'italic', 'underline'],
      [ 'align' , { 'align': 'center'}, { 'align': 'right'}],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      ['blockquote', 'code-block'],
      ['link'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'More': 'More' }],
      //[{ 'break': '' }],                             // 

      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }, 'strike'],          // dropdown with defaults from theme


      ['clean']                                         // remove formatting button
    ];

    // enable custom font list
    const FontAttributor = Quill.import('attributors/class/font');
    // @ts-ignore -- it's a Quill-specific thing
    FontAttributor.whitelist = extraFonts;
    // @ts-ignore
    Quill.register(FontAttributor, true);


    useEffect(() => {
      let moreBtn = document.querySelector('.ql-toolbar span.ql-formats:has(button.ql-More)') as HTMLElement;

      if (moreBtn) {
        moreBtn.style.color = "orange";
        console.log('found moreBtn...');
        moreBtn.addEventListener('click', (e) => {
          console.log('add Active');
          moreBtn.classList.add('active');
        })
      }

    }, [])


    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );
      const quill = new Quill(editorContainer, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions
        }
      });

      quillref.current = quill;

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        if (quillref.current) setRichTextContent(quillref.current!.root.innerHTML);
      });


      // Handle click for "More" button to display 2nd row of toolbar...
      let moreBtn = document.querySelector('.ql-toolbar span.ql-formats:has( button.ql-More )') as HTMLElement;
      
      if (moreBtn) moreBtn.addEventListener('click', () => moreBtn.classList.toggle('active'));

      return () => {
        quillref.current = null;
        container.innerHTML = '';
      };
    }, [quillref]);







    return (
      <>
        <div className={
          // add (inject) Next's font css variables by listing them in this parent container DIV
          //  TO-DO:
          //    - make this a for loop for each item in 
          `${lobster.variable}
           ${quicksand.variable}
        `}>
          <div ref={containerRef}></div>
        </div>

      </>
    );
  },
);

QuillRichText.displayName = 'Editor';

export default QuillRichText;