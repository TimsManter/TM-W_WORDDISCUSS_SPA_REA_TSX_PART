import * as React from "react";
import docx4js from "docx4js";

export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class Hello extends React.Component<HelloProps, {}> {
  componentDidMount() {

  }

  render() {
    return <div id="document-preview"></div>;
  }
}