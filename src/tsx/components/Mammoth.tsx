import * as React from "react";
import { Callout } from "office-ui-fabric-react/lib/Callout";
import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";
import { Label } from "office-ui-fabric-react/lib/Label";
import {
  MessageBar, MessageBarType
} from "office-ui-fabric-react/lib/MessageBar";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { Toggle } from "office-ui-fabric-react/lib/Toggle";

export interface P {
  document: Document | null;
  displayMessageBar: () => void;
}
interface S {
  calloutPosition: MouseEvent | null;
  selectedText: string;
  addEmptyMessage: boolean;
  calloutComment: boolean;
  calloutSuggestion: boolean;
}

export default class Mammoth extends React.Component<P, S> {
  constructor(props: P) {
    super();
    this.onCalloutDismiss = this.onCalloutDismiss.bind(this);
    this.state = {
      calloutPosition: null,
      selectedText: "",
      addEmptyMessage: false,
      calloutComment: false,
      calloutSuggestion: false
    };
  }

  componentDidMount() {
    let doc = document.getElementById("mammoth-preview");
    if (doc) {
      doc.onmouseup = (event) => {
        let selection = document.getSelection();
        let selectionText = selection.toString();
        if (selectionText !== "") {
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

  componentDidUpdate() {
    this.addMarkEvents(document.body);
  }

  componentWillReceiveProps(props: P) {
    const doc = props.document;
  }

  onCalloutDismiss(event) {
    this.setState({
      calloutPosition: null,
      selectedText: "",
      calloutComment: false,
      calloutSuggestion: false,
      addEmptyMessage: false
    });
  }

  addMarkEvents(html: HTMLElement) {
    const marks = html.querySelectorAll("mark[data-comment-id]");
    for (let m in marks) {
      if (!(marks[m] instanceof HTMLElement)) { continue; }
      const id = marks[m].getAttribute("data-comment-id");
      marks[m].addEventListener("mouseover", () => {
        const comEl = document.querySelector(`div.comment-box[data-comment-id=\"${id}\"]`);
        if (comEl) { comEl.classList.add("active"); }
      });
      marks[m].addEventListener("mouseleave", () => {
        const comEl = document.querySelector(`div.comment-box[data-comment-id=\"${id}\"]`);
        if (comEl) { comEl.classList.remove("active"); }
      });
    }
  }

  checkEmpty(): boolean {
    const commentTextareas = document.querySelectorAll(".callout-content textarea");
    if (commentTextareas.length === 0) { return true; }
    for (let t in commentTextareas) {
      if (!(commentTextareas[t] instanceof HTMLTextAreaElement)) { continue; }
      if ((commentTextareas[t] as HTMLTextAreaElement).value.trim() === "") {
        return true;
      }
    }
    return false;
  }

  render() {
    const {
      calloutPosition,
      selectedText,
      addEmptyMessage,
      calloutComment,
      calloutSuggestion
    } = this.state;
    const { document, displayMessageBar } = this.props;
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
          <div className="toggle-group">
            <Toggle
              defaultChecked={false}
              onChanged={c => this.setState({calloutComment: c})}
              label="Comment"
              onText="On"
              offText="Off" />
            <Toggle
              defaultChecked={false}
              onChanged={c => this.setState({calloutSuggestion: c})}
              label="Change suggestion"
              onText="On"
              offText="Off" />
          </div>
          {calloutComment && <div>
            <Label>Comment</Label>
            <textarea placeholder="Your comment about the text above" id="callout-comment"></textarea>
          </div>}
          {calloutSuggestion && <div>
            <Label>Suggested change</Label>
            <textarea placeholder="Your new proposition about the text above" id="callout-suggestion"></textarea>
          </div>}
        </div>
        <CommandBar items={[
          {
            key: "add",
            name: "Add",
            iconProps: { iconName: "Add" },
            onClick: e => {
              if (this.checkEmpty()) {
                this.setState({ addEmptyMessage: true });
              } else {
                displayMessageBar();
                this.setState({
                  calloutPosition: null,
                  calloutComment: false,
                  calloutSuggestion: false
                });
              }
            }
          }
        ]} />
        {addEmptyMessage && <MessageBar
        messageBarType={MessageBarType.error}
        isMultiline={false}
        onDismiss={e => { this.setState({ addEmptyMessage: false }); }}>
        Fill at least one field
      </MessageBar>}
      </Callout>}
    </div>;
  }
}