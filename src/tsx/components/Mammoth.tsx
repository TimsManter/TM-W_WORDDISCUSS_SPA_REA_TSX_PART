import * as React from "react";
import MammothJS from "mammoth";
const doc = require("base64-loader!./test.docx");

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

    MammothJS.convertToHtml({ buffer: new Buffer(doc, "base64") })
      .then(result => {
        this.setState({ docHtml: result.value });
      }).done();
  }

  render() {
    const { docHtml } = this.state;

    return <div id="document-preview">
      {docHtml}
    </div>;
  }
}