import * as React from "react";
import {
  DocumentCard,
  DocumentCardTitle,
  DocumentCardLocation
} from "office-ui-fabric-react";

export interface P {
  commentsHtml: string;
}

export default class CommentList extends React.Component<P> {

  renderCards(): JSX.Element[] {
    const comments = this.props.commentsHtml;
    let cards: JSX.Element[] = [];
    const commentParts =
      comments.split(/(?:<dt |<\/dd>)/i).filter(s => s !== "");
    for (let c in commentParts) {
      const title = commentParts[c]
        .split(/id="[^>]*>|<\/dt>.*/i)
        .filter(s => s !== "")[0];
      const content = commentParts[c]
        .split(/.*<p .*?>|<\/p.*/i)
        .filter(s => s !== "")[0];
      const commentRef = commentParts[c]
        .split(/.*href="|">↑.*/i)
        .filter(s => s !== "")[0];
      const anchorId = commentParts[c]
        .split(/id="|">.*$/i)
        .filter(s => s !== "")[0];
      let id = anchorId.split("-")[1];
      cards.push(<div key={c}
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
    const { commentsHtml } = this.props;

    return <div id="comments-wrapper">
      {this.renderCards()}
    </div>;
  }
}