import * as React from "react";
import { Fabric } from "office-ui-fabric-react/lib/Fabric";
import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";
import { IContextualMenuItem } from "office-ui-fabric-react/lib/ContextualMenu";
import {
  MessageBar, MessageBarType
} from "office-ui-fabric-react/lib/MessageBar";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
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
  promptMessage: boolean;
  statusMessage: boolean;
}

export default class Viewer extends React.Component<P, S> {
  constructor(props: P) {
    super();
    this.displayMessageBar = this.displayMessageBar.bind(this);
    this.state = {
      currentRenderer: "mammoth",
      document: null,
      comments: [],
      promptMessage: false,
      statusMessage: false
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
        return <Mammoth
          document={this.state.document}
          displayMessageBar={this.displayMessageBar} />;
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

  displayMessageBar() {
    this.setState({ statusMessage: true });
  }

  render() {
    const {
      currentRenderer,
      comments,
      promptMessage,
      statusMessage
    } = this.state;

    return <div id="viewer-wrapper">
      {promptMessage && <MessageBar
        actions={
          <div>
            <DefaultButton>Yes</DefaultButton>
            <DefaultButton>No</DefaultButton>
          </div>
        }
        messageBarType={MessageBarType.success}
        isMultiline={false}>
        Success
      </MessageBar>}
      {statusMessage && <MessageBar
        messageBarType={MessageBarType.success}
        isMultiline={false}
        onDismiss={() => { this.setState({ statusMessage: false }); }}>
        Change added!
      </MessageBar>}
      
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
        {this.returnRenderer(currentRenderer)}
        <CommentList comments={comments} />
      </div>
    </div>;
  }
}