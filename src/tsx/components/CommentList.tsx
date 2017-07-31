import * as React from "react";
import {
  DocumentCard,
  DocumentCardTitle,
  DocumentCardLocation
} from "office-ui-fabric-react";
import CommentsParser from "./../helpers/CommentsParser";
import IComment from "./../model/IComment";

export interface P {
  comments: IComment[];
}

export default class CommentList extends React.Component<P> {

  renderCards(): JSX.Element[] {
    const { comments } = this.props;
    let cards: JSX.Element[] = [];
    for (let c in comments) {
      const { id, title, content, anchorId, commentRef } = comments[c];
      let mark = document.querySelector(`mark[data-comment-id=\"${id}\"]`) as HTMLElement;
      let offsetTop = 0;
      if (mark) { offsetTop = mark.offsetTop; }
      cards.push(<div key={c} style={{position: "absolute", top: offsetTop}}
        onMouseEnter={() => this.onMouseOver(id)}
        onMouseLeave={() => this.onMouseLeave(id)}>
        <DocumentCard>
        <span id={anchorId} />
        <DocumentCardLocation location={title} locationHref={commentRef} />
        <DocumentCardTitle title={content} />
        </DocumentCard>
      </div>);
    }
    return cards;
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