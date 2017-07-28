import * as React from "react";

export interface P {
  docHtml: string;
}
interface S {
  docHtml: string;
}

export default class Mammoth extends React.Component<P, S> {
  constructor(props: P) {
    super();
    this.state = {
      docHtml: ""
    };
  }

  componentWillReceiveProps(props: P) {
    let html = props.docHtml;
    if (html === "") { return; }
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, "text/html");
    let commentStarts = doc.querySelectorAll("span[data-comment-edge=\"start\"]");
    for (let s in commentStarts) {
      if (isNaN(Number(s))) { continue; }
      let id = commentStarts[s].getAttribute("data-comment-id");
      commentStarts[s].innerHTML = "<mark>";
      console.log(commentStarts[s]);
      let commentEnd = doc.querySelector(`span[data-comment-edge=\"end\"][data-comment-edge=\"${id}\"]`);
      if (commentEnd) { commentEnd.innerHTML = "</mark>"; }
    }
    this.setState({ docHtml: doc.documentElement.outerHTML });
  }

  render() {
    const { docHtml } = this.state;

    return <div
      dangerouslySetInnerHTML={{__html: docHtml}}
      id="mammoth-preview" />;
  }
}