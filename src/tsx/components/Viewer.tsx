import * as React from "react";
import { CommandBar, IContextualMenuItem } from "office-ui-fabric-react";
const doc = require("base64-loader!./demo.docx");

import GViewRender from "./GViewRender";
import Mammoth from "./Mammoth";

export interface P { }
interface S {
  currentRenderer: string;
}

export default class Viewer extends React.Component<P, S> {
  constructor(props: P) {
    super();
    this.state = {
      currentRenderer: "mammoth"
    };
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
        return <Mammoth doc={doc} />;
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
    const { currentRenderer } = this.state;

    return <div id="preview-wrapper">
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
      {this.returnRenderer(currentRenderer)}
    </div>;
  }
}