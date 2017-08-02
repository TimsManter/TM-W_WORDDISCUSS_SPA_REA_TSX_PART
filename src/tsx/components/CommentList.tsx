import * as React from "react";
import { List } from "office-ui-fabric-react/lib/List";
import {
  FocusZone, FocusZoneDirection
} from "office-ui-fabric-react/lib/FocusZone";
import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";
import { IContextualMenuItem } from "office-ui-fabric-react/lib/ContextualMenu";
import CommentsParser from "./../helpers/CommentsParser";
import IComment from "./../model/IComment";

export interface P {
  comments: IComment[];
}

export default class CommentList extends React.Component<P> {

  componentDidMount() {
    window.addEventListener("resize", this.setCommentsOffset);
  }

  componentDidUpdate() {
    this.setCommentsOffset();
  }

  renderCards(): JSX.Element {
    const { comments } = this.props;

    return <List items={comments} onRenderCell={(comment: IComment, i) => (
      <div key={i} data-comment-id={comment.id} className="comment-box">
          <h5 className="comment-author">{comment.author}</h5>
          <p className="comment-content">{comment.content}</p>
          <ul className="comment-responses">
            {!comment.responses ? [] : comment.responses.map((r, j) => (
            <li key={j}>
              <div>
                <h5 className="comment-author">{r.author}</h5><br />
                <p className="comment-content">{r.content}</p>
              </div>
            </li>
            ))}
          </ul>
          <CommandBar items={[
          {
            key: "addResponse",
            name: "Add response",
            iconProps: { iconName: "Add" }
          }
          ]}/>
        </div>
      )} />;
  }

  setCommentsOffset() {
    const html = document;
    const comments = html.querySelectorAll("div.comment-box");
    for (let c in comments) {
      if (!(comments[c] instanceof HTMLDivElement)) { continue; }
      const comment = comments[c] as HTMLDivElement;
      const id = comment.getAttribute("data-comment-id");
      const mark = html.querySelector(`mark[data-comment-id="${id}"]`);
      if (!mark) { continue; }
      const offset = (mark as HTMLElement).offsetTop;
      const commentHeight = comment.offsetHeight;
      const commentOffset = comment.offsetTop;
      const commentMargin = Number((comment.style.marginTop || "0px").slice(0, -2));
      const commentDiff = offset - commentOffset - commentHeight / 2;
      const commentNewMargin = commentMargin + commentDiff;
      comment.style.marginTop = commentNewMargin < 0 ? "0px" : commentNewMargin + "px";
    }
  }

  onMouseOver(id) {
    let mark = document.querySelector(`mark[data-comment-id=\"${id}\"]`);
    if (mark) { mark.classList.add("active"); }
  }
  onMouseLeave(id) {
    let mark = document.querySelector(`mark[data-comment-id=\"${id}\"]`);
    if (mark) { mark.classList.remove("active"); }
  }

  render() {
    return <div id="comments-wrapper">
      {this.renderCards()}
    </div>;
  }
}