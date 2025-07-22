"use client"

import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';

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





// Editor is an uncontrolled React component
const QuillRichText = forwardRef(
  ({ setRichTextContent }, quillref) => {

    const containerRef = useRef(null);


    let extraFonts = [
      false,
      'Lobster',
      'Quicksand',
    ]

    const toolbarOptions = [
      [{ 'font': extraFonts }, 'bold', 'italic', 'underline'],        // custom fonts & toggled buttons
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'More': 'More' }],
      //[{ 'break': '' }],                             // 

      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }, 'strike'],          // dropdown with defaults from theme


      ['clean']                                         // remove formatting button
    ];

    // enable custom font list
    const FontAttributor = Quill.import('attributors/class/font');
    FontAttributor.whitelist = extraFonts;
    Quill.register(FontAttributor, true);


    useEffect(() => {
      let moreBtn = document.querySelector('.ql-toolbar span.ql-formats:has(button.ql-More)') as HTMLElement;
      
      console.log('this was effective...');

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