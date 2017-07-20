import * as React from "react";
import * as Docx from "docx4js";
const doc = require("base64-loader!./test.docx");

export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class Hello extends React.Component<HelloProps, {}> {
  /*componentDidMount() {
    //console.log(doc);
    const blob: Blob = this.b64toBlob(doc, "application/zip");
    //console.log(blob);
    (blob as any).name = "text.docx";
    Docx.load(blob).then(docx => {
      let preview = document.getElementById("document-preview");
      if (preview !== null) {
        console.log(docx.render());
        preview.innerHTML = docx.render();
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
  }*/
  render() {
    return <iframe src="http://docs.google.com/viewer?url=https://calibre-ebook.com/downloads/demos/demo.docx&embedded=true"></iframe>;
  }
}