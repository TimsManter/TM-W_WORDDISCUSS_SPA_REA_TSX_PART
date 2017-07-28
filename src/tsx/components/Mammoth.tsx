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

  componentDidMount() {
    document.onselectionchange = () => {
      let selection = document.getSelection();
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
      let startTag = commentStarts[s];
      let id = startTag.getAttribute("data-comment-id");
      let parent = startTag.parentNode;
      if (parent) {
        let mark = doc.createElement("mark");
        mark.setAttribute("data-comment-id", String(id));
        if (parent.lastChild === startTag) {
          parent.appendChild(mark);
        } else {
          parent.insertBefore(mark, startTag.nextSibling);
        }
        let commentElements = this.elementsAfter(mark);
        for (let e in commentElements) {
          mark.appendChild(commentElements[e]);
        }
      }
    }
    this.setState({ docHtml: doc.documentElement.outerHTML });
  }

  elementsAfter(elem: Element): Element[] {
    let tmpElem: Element = elem;
    let commentElements: Element[] = [];
    while (tmpElem.nextSibling !== null) {
      let nextElement = tmpElem.nextSibling as Element;
      if (nextElement.getAttribute && nextElement.getAttribute("data-comment-edge")) { break; }
      commentElements.push(nextElement);
      tmpElem = nextElement;
    }
    return commentElements;
  }

  removeElements(elems: Element[]) {
    for (let e in elems) {
      elems[e].remove();
    }
  }

  render() {
    const { docHtml } = this.state;

    return <div
      dangerouslySetInnerHTML={{__html: docHtml}}
      id="mammoth-preview" />;
  }
}