import * as React from "react";
import { List } from "office-ui-fabric-react/lib/List";
import {
  FocusZone, FocusZoneDirection
} from "office-ui-fabric-react/lib/FocusZone";
import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";
import CommentsParser from "./../helpers/CommentsParser";
import IComment from "./../model/IComment";

export interface P {
  comments: IComment[];
}

export default class CommentList extends React.Component<P> {

  renderCards(): JSX.Element {
    const { comments } = this.props;

    return <FocusZone direction={FocusZoneDirection.vertical}>
      <List items={comments} onRenderCell={(comment: IComment, i) => (
        <div key={i} className="comment-box neutralLight" data-is-focusable={true}>
          <h5 className="comment-author">{comment.author}</h5>
          <p className="comment-content">{comment.content}</p>
          <ul>
            {!comment.responses ? [] : comment.responses.map((r, j) => (
              <li key={j}>{r.content}</li>
            ))}
          </ul>
        </div>
      )} />
    </FocusZone>;
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