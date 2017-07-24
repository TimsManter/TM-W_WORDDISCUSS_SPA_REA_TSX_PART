import * as React from "react";

export interface P {
  docHtml: string;
}
interface S { }

export default class Mammoth extends React.Component<P, S> {
  constructor(props: P) {
    super();
    this.state = {
      docHtml: ""
    };
  }

  render() {
    const { docHtml } = this.props;

    return <div
      dangerouslySetInnerHTML={{__html: docHtml}}
      id="mammoth-preview" />;
  }
}