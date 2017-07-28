import * as React from "react";
import { Callout } from "office-ui-fabric-react/lib/Callout";
import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";

export interface P {
  docHtml: string;
}
interface S {
  docHtml: string;
  calloutPosition: MouseEvent | null;
  selectedText: string;
}

export default class Mammoth extends React.Component<P, S> {
  constructor(props: P) {
    super();
    this.onCalloutDismiss = this.onCalloutDismiss.bind(this);
    this.state = {
      docHtml: "",
      calloutPosition: null,
      selectedText: ""
    };
  }

  componentDidMount() {
    let doc = document.getElementById("mammoth-preview");
    if (doc) {
      doc.onmouseup = (event) => {
        let selection = document.getSelection();
        let selectionText = selection.toString();
        if (selectionText !== "") {
          console.log(selectionText);
          this.setState({
            selectedText: selectionText,
            calloutPosition: event
          });
        } else {
          this.setState({
            selectedText: "",
            calloutPosition: null
          });
        }
      };
    }
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

  onCalloutDismiss(event) {
    this.setState({
      calloutPosition: null,
      selectedText: ""
    });
  }

  render() {
    const { docHtml, calloutPosition, selectedText } = this.state;

    return <div>
      <div
      dangerouslySetInnerHTML={{__html: docHtml}}
        id="mammoth-preview" />
      {calloutPosition && <Callout
        target={ calloutPosition }
        onDismiss={ this.onCalloutDismiss }
        setInitialFocus={true}>
        <div className="callout-content">
          <h2 className="ms-font-xl">Add comment</h2>
          <p>"{selectedText}"</p>
          <textarea></textarea>
        </div>
        <CommandBar items={[
          {
            key: "add",
            name: "Add"
          }
        ]}/>
      </Callout>}
    </div>;
  }
}