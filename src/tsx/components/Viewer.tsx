import * as React from "react";
import { Fabric } from "office-ui-fabric-react/lib/Fabric";
import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";
import { IContextualMenuItem } from "office-ui-fabric-react/lib/ContextualMenu";
import * as MammothJS from "mammoth";
const doc = require("base64-loader!./demo.docx");

import GViewRender from "./GViewRender";
import Mammoth from "./Mammoth";
import CommentList from "./CommentList";

export interface P { }
interface S {
  currentRenderer: string;
  docHtml: string;
  docHtmlComments: string;
}

export default class Viewer extends React.Component<P, S> {
  constructor(props: P) {
    super();
    this.state = {
      currentRenderer: "mammoth",
      docHtml: "",
      docHtmlComments: ""
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
      this.setState({
        docHtml: this.cutCommentsFromDocHtml(result.value)
      });
    }).done();
    
  }

  cutCommentsFromDocHtml(docHtml: string): string {
    let commentsStartPos: number, commentsEndPos: number;
    commentsStartPos = docHtml.lastIndexOf("<dl>");
    if (commentsStartPos) {
      commentsEndPos = docHtml.indexOf("</dl>", commentsStartPos);
      if (commentsEndPos) {
        const htmlParts = docHtml.split(/<\/?dl>/);
        if (htmlParts.length === 3) {
          this.setState({
            docHtmlComments: htmlParts.splice(1, 1)[0]
          });
          return htmlParts.join();
        }
      }
    }
    return docHtml;
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
        return <Mammoth docHtml={this.state.docHtml} />;
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
    const { currentRenderer, docHtmlComments } = this.state;

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
              <CommentList commentsHtml={docHtmlComments} />
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}