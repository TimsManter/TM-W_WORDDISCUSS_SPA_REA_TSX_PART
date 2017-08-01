import * as React from "react";
import { Callout } from "office-ui-fabric-react/lib/Callout";
import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";

export interface P {
  document: Document | null;
}
interface S {
  calloutPosition: MouseEvent | null;
  selectedText: string;
}

export default class Mammoth extends React.Component<P, S> {
  constructor(props: P) {
    super();
    this.onCalloutDismiss = this.onCalloutDismiss.bind(this);
    this.state = {
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
    const doc = props.document;
    //this.markComments(doc);
  }

  onCalloutDismiss(event) {
    this.setState({
      calloutPosition: null,
      selectedText: ""
    });
  }

  render() {
    const { calloutPosition, selectedText } = this.state;
    const { document } = this.props;
    const docContent = document ? document.body.innerHTML : null;

    return <div>
      <div
      dangerouslySetInnerHTML={{__html: docContent ? docContent : "" }}
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
            name: "Add",
            iconProps: { iconName: "Add" }
          }
        ]}/>
      </Callout>}
    </div>;
  }
}