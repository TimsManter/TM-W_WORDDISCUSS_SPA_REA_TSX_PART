import * as React from "react";
import { Fabric } from "office-ui-fabric-react/lib/Fabric";
import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";
import { IContextualMenuItem } from "office-ui-fabric-react/lib/ContextualMenu";
import * as MammothJS from "mammoth";
const doc = require("base64-loader!./demo.docx");

import GViewRender from "./GViewRender";
import Mammoth from "./Mammoth";
import CommentList from "./CommentList";
import CommentsParser from "./../helpers/CommentsParser";
import IComments from "./../model/IComment";

export interface P { }
interface S {
  currentRenderer: string;
  document: Document | null;
  comments: IComments[];
}

export default class Viewer extends React.Component<P, S> {
  constructor(props: P) {
    super();
    this.state = {
      currentRenderer: "mammoth",
      document: null,
      comments: []
    };
    this.renderDocToHtml();
  }

  renderDocToHtml() {
    const docBuffer = new Buffer(doc, "base64");
    MammothJS.convertToHtml({ arrayBuffer: docBuffer }, {
      paragraphId: true,
      styleMap: [
        "comment-reference => sup.comment-reference",
        "comment-range => span",
        "p[style-name='Title'] => h1.ms-font-title.doc-title"
      ]
    }).then(result => {
      const parser = new DOMParser();
      const document = parser.parseFromString(result.value, "text/html");
      this.setState({
        document: document,
        comments: this.cutCommentsFromDocHtml(document)
      });
    }).done();
    
  }

  cutCommentsFromDocHtml(doc: Document): IComments[] {
    if (!doc) { return []; }
    const dlNodes = doc ? doc.querySelectorAll("dl") : null;
    if (!dlNodes) { return []; }
    const dl = dlNodes[dlNodes.length - 1];
    const parser = new CommentsParser(dl, doc);
    const comments = parser.Comments;
    dlNodes[dlNodes.length - 1].remove();
    return comments;
  }

  changeRenderer(ev: React.MouseEvent<HTMLElement>, item: IContextualMenuItem) {
    this.setState({
      currentRenderer: item.key
    });
  }

  returnRenderer(key: string): JSX.Element | null {
    switch (key) {
      case "gview":
        return <GViewRender
          url="https://calibre-ebook.com/downloads/demos/demo.docx" />;
      case "mammoth":
        return <Mammoth document={this.state.document} />;
      default:
        return null;
    }
  }

  rendererName(key: string) {
    switch (key) {
      case "gview":
        return "Google Viewer";
      case "mammoth":
        return "Mammoth";
      default:
        return "";
    }
  }

  render() {
    const { currentRenderer, comments } = this.state;

    return <div id="viewer-wrapper">
      <CommandBar items={[
        {
          key: "renderer",
          name: `Renderer: ${this.rendererName(currentRenderer)}`,
          subMenuProps: {
            items: [
              {
                key: "gview",
                name: this.rendererName("gview"),
                checked: currentRenderer === "gview",
                onClick: this.changeRenderer.bind(this)
              },
              {
                key: "mammoth",
                name: this.rendererName("mammoth"),
                checked: currentRenderer === "mammoth",
                onClick: this.changeRenderer.bind(this)
              }
            ]
          }
        }
      ]} />
      <div id="document-wrapper">
        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md8">
              {this.returnRenderer(currentRenderer)}
            </div>
            <div className="ms-Grid-col ms-u-sm12 ms-u-md4">
              <CommentList comments={comments} />
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}