import * as React from "react";
import Axios from "axios";
import FJsonp from "fetch-jsonp";

export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class Hello extends React.Component<HelloProps, {}> {
  componentDidMount() {
    window.addEventListener("message", this.receiveMessage, false);

    let preview = document.getElementById("document-preview");
    if (preview !== null) {
      (preview as HTMLIFrameElement).src = "https://1drv.ms/w/s!Ar9LEnsk58zwoZc28AYjLhOrQyUhqA";
    }
  }

  receiveMessage(window: Window, event: MessageEvent) {
    console.log(event);
  }

  render() {
    return <iframe id="document-preview"></iframe>;
  }
}