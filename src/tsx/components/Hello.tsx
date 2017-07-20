import * as React from "react";
import * as Docx from "docx4js";

export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class Hello extends React.Component<HelloProps, {}> {
  componentDidMount() {
    Docx.load("test.docx").then(docx => {
      let preview = document.getElementById("document-preview");
      if (preview !== null) {
        preview = docx.render();
      }
    });
  }

  render() {
    return <div id="document-preview"></div>;
  }
}