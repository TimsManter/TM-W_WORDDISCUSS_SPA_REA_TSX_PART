import * as React from "react";
const docx2Html = require("docx2html");
const doc = require("base64-loader!./test.docx");

export interface P { }

export default class Docx4JsRender extends React.Component<P> {
  componentDidMount() {
    let preview = document.getElementById("document-preview");
    const blob: Blob = this.b64toBlob(doc, "application/zip");
    (blob as any).name = "text.docx";
    docx2Html(blob, { container: preview }).then(html => html.toString());
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