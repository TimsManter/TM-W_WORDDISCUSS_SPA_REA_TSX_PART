import * as React from "react";

export interface P { }

export default class GViewRender extends React.Component<P> {
  render() {
    return <iframe id="document-preview" src="http://docs.google.com/viewer?url=https://calibre-ebook.com/downloads/demos/demo.docx&embedded=true" frameBorder="0"></iframe>;
  }
}