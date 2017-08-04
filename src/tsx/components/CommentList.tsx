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

export interface S {
  newResponseId: number | null;
}

export default class CommentList extends React.Component<P, S> {

  constructor(props: P) {
    super(props);
    this.state = {
      newResponseId: null
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.setCommentsOffset);
  }

  componentDidUpdate() {
    this.setCommentsOffset();
  }

  renderCards(): JSX.Element {
    const { comments } = this.props;
    const { newResponseId } = this.state;

    return <List items={comments} onRenderCell={(comment: IComment, i) => (
      <div key={i} data-comment-id={comment.id} className="comment-box"
        onMouseOver={e => this.onCommentOver(comment.id)}
        onMouseLeave={e => this.onCommentLeave(comment.id)}>
          <h5 className="comment-author">{comment.author}</h5>
          <p className="comment-content">{comment.content}</p>
          <ul className="comment-responses">
            {!comment.responses ? [] : comment.responses.map((r, j) => (
            <li key={j}>
              <div>
                <h5 className="comment-author">{r.author}</h5>
                <p className="comment-content">{r.content}</p>
              </div>
            </li>
            ))}
          </ul>
          {newResponseId === comment.id ? <CommandBar items={[
          {
            key: "acceptResponse",
            name: "Add",
            iconProps: { iconName: "Add" },
            onClick: () => this.onCommentAnswer()
          },
          {
            key: "cancelResponse",
            name: "cancel",
            iconProps: { iconName: "Cancel" },
            onClick: () => this.onCommentAnswer(true)
          }]} /> : <CommandBar items={[
          {
            key: "addResponse",
            name: "Add response",
            iconProps: { iconName: "Add" },
            onClick: () => this.addAnswerPrototype(comment.id)
          }]}/>}
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
      const markOffset = (mark as HTMLElement).offsetTop;
      const markHeight = (mark as HTMLElement).offsetHeight;
      const markMiddle = markOffset + markHeight / 2;
      const commentHeight = comment.offsetHeight;
      const commentOffset = comment.offsetTop;
      const commentMargin = Number((comment.style.marginTop || "0px").slice(0, -2));
      const commentDiff = markMiddle - commentOffset - commentHeight / 2;
      const commentNewMargin = commentMargin + commentDiff;
      comment.style.marginTop = commentNewMargin < 0 ? "0px" : commentNewMargin + "px";
    }
  }

  onCommentOver(id) {
    const mark = document.querySelector(`mark[data-comment-id=\"${id}\"]`);
    if (!mark) { return; }
    mark.classList.add("active");
    const markChildren = mark.querySelectorAll("mark[data-comment-id]");
    for (let m in markChildren) {
      if (!(markChildren[m] instanceof HTMLElement)) { continue; }
      markChildren[m].classList.add("active");
    }
  }
  onCommentLeave(id) {
    const mark = document.querySelector(`mark[data-comment-id=\"${id}\"]`);
    if (!mark) { return; }
    mark.classList.remove("active");
    const markChildren = mark.querySelectorAll("mark[data-comment-id]");
    for (let m in markChildren) {
      if (!(markChildren[m] instanceof HTMLElement)) { continue; }
      markChildren[m].classList.remove("active");
    }
  }

  addAnswerPrototype(id: number) {
    const com = document.querySelector(`.comment-box[data-comment-id="${id}"]`);
    if (!com) { return; }
    const responses = com.querySelector("ul.comment-responses");
    if (!responses) { return; }
    const prototype = document.createElement("li");
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    prototype.appendChild(input);
    (responses as HTMLUListElement).appendChild(prototype);
    this.setState({ newResponseId: id });
  }

  onCommentAnswer(cancel: boolean = false) {
    if (!cancel && this.state.newResponseId) {
      const li = document.querySelector(`.comment-box[data-comment-id="${this.state.newResponseId}"] ul.comment-responses:last-child`);
      if (li) {
        const input = (li as HTMLLIElement).querySelector("input");
        if (input) {
          (li as HTMLLIElement).remove();
          const newAnswer = document.createElement("div");
          const newAuthor = document.createElement("h5");
          newAuthor.appendChild(document.createTextNode("Anonymous"));
          const newPara = document.createElement("p");
          const text = input.value.trim();
          if (text === "") { return; }
          newPara.appendChild(document.createTextNode(text));
          newAnswer.appendChild(newAuthor);
          newAnswer.appendChild(newPara);
          li.appendChild(newAnswer);
        }
      }
    }
    this.setState({ newResponseId: null });
  }

  render() {
    return <div id="comments-wrapper">
      {this.renderCards()}
    </div>;
  }
}