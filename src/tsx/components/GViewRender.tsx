import * as React from "react";

export interface P {
  url: string;
}

export default class GViewRender extends React.Component<P> {
  render() {
    const { url } = this.props;

    return <iframe id="document-preview"
      src={`http://docs.google.com/viewer?url=${url}&embedded=true`}
      frameBorder="0">
    </iframe>;
  }
}