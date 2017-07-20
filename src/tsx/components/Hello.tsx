import * as React from "react";
import * as Docx from "docx4js";
const doc = require("./test.docx");

export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class Hello extends React.Component<HelloProps, {}> {
  componentDidMount() {
    const blob: Blob = new Blob([doc], { type: "application/zip" });
    (blob as any).name = "text.docx";
    Docx.load(blob).then(docx => {
      let preview = document.getElementById("document-preview");
      if (preview !== null) {
        preview = docx.render();
      }
    });
  }

  b64toBlob(b64Data, contentType="", sliceSize=512) {
  const byteCharacters: string = atob(b64Data);
  const byteArrays: Uint8Array[] = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    
    byteArrays.push(byteArray);
  }
  
  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

  render() {
    return <div id="document-preview"></div>;
  }
}