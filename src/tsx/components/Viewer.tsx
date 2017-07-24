import * as React from "react";
import { CommandBar, IContextualMenuItem } from "office-ui-fabric-react";
const doc = require("base64-loader!./test.docx");

import GViewRender from "./GViewRender";

export interface P { }
interface S {
  currentRenderer: string;
}

export default class Viewer extends React.Component<P, S> {
  constructor(props: P) {
    super();
    this.state = {
      currentRenderer: "gview"
    };
  }

  changeRenderer(ev: React.MouseEvent<HTMLElement>, item: IContextualMenuItem) {
    this.setState({
      currentRenderer: item.key
    });
  }

  render() {
    const { currentRenderer } = this.state;

    return <div id="preview-wrapper">
      <CommandBar items={[
        {
          key: "renderer",
          name: "Renderer",
          subMenuProps: {
            items: [
              {
                key: "gview",
                name: "Google Viewer",
                checked: currentRenderer === "gview",
                onClick: this.changeRenderer.bind(this)
              }
            ]
          }
        }
      ]} />
      <GViewRender
        url="https://calibre-ebook.com/downloads/demos/demo.docx"/>
    </div>;
  }
}