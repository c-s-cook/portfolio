import React, { useRef, useState, useEffect } from 'react';
import Editor from './Editor';

const Delta = Quill.import('delta');

const App = () => {
  const [range, setRange] = useState();
  const [lastChange, setLastChange] = useState();
  const [readOnly, setReadOnly] = useState(false);
//   adding a content var
  const [content, setContent] = useState();

  

  // Use a ref to access the quill instance directly
  const quillRef = useRef();


//
//  Key is down below
// 
  useEffect(()=>{
    // setContent(quillRef.current.root.innerHTML); // This is how to get the HTML formatted
    console.log(content);
    // document.getElementById("repeatContent").innerHTML = content;
  });

  return (
    <div>
      <Editor
        ref={quillRef}
        readOnly={readOnly}
        defaultValue={new Delta()
          .insert('Hello')
          .insert('\n', { header: 1 })
          .insert('Some ')
          .insert('initial', { bold: true })
          .insert(' ')
          .insert('content', { underline: true })
          .insert('\n')}
        onSelectionChange={setRange}
        onTextChange={setLastChange}
      />
      <div class="controls">
        <label>
          Read Only:{' '}
          <input
            type="checkbox"
            value={readOnly}
            onChange={(e) => setReadOnly(e.target.checked)}
          />
        </label>
        <button
          className="controls-right"
          type="button"
          onClick={() => {
            alert(quillRef.current?.getLength());
          }}
        >
          Get Content Length
        </button>
      </div>
      <div className="state">
        <div className="state-title">Current Range:</div>
        {range ? JSON.stringify(range) : 'Empty'}
      </div>
      <div className="state">
        <div className="state-title">Last Change:</div>
        {lastChange ? JSON.stringify(lastChange.ops) : 'Empty'}
      </div>
      <div id="repeatContent" style={{border: "1px solid", padding: "1em"}}>
        
      </div>
      
    </div>
  );
};

export default App;