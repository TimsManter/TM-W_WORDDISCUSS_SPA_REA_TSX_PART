import * as React from "react";
const docx2Html = require("docx2html");
const doc = require("base64-loader!./test.docx");

export interface P { }

export default class Mammoth extends React.Component<P> {

  render() {
    return <div id="document-preview"></div>;
  }
}