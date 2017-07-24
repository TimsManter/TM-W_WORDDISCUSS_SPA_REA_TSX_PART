import * as React from "react";
import * as MammothJS from "mammoth";
const doc = require("base64-loader!./demo.docx");

export interface P { }
interface S {
  docHtml: string;
}

export default class Mammoth extends React.Component<P, S> {
  constructor(props: P) {
    super();
    this.state = {
      docHtml: ""
    };

    const docBuffer = new Buffer(doc, "base64");
    MammothJS.convertToHtml({ arrayBuffer: docBuffer })
      .then(result => {
        this.setState({ docHtml: result.value });
      }).done();
  }

  render() {
    const { docHtml } = this.state;

    return <div
      dangerouslySetInnerHTML={{__html: docHtml}}
      id="mammoth-preview" />;
  }
}