"use client"

import { useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // for snow theme

export default function QuillEditor() {
    useEffect(() => {
        const editor = new Quill('#editor', {
            theme: 'snow',
            modules: {
              toolbar: [['bold', 'italic'], ['link', 'image']]
            }
          });
    }, []);
  
    return <div id="editor"></div>;
  };