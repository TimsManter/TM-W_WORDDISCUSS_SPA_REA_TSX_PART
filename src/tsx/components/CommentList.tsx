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
    console.log(commentParts);
    for (let c in commentParts) {
      const title = commentParts[c]
        .split(/id="[^>]*>|<\/dt>.*/i)
        .filter(s => s !== "")[0];
      console.log(title);
      const content = commentParts[c]
        .split(/.*<p .*?>|<\/p.*/i)
        .filter(s => s !== "")[0];
      console.log(content);
      const commentRef = commentParts[c]
        .split(/.*href="|">↑.*/i)
        .filter(s => s !== "")[0];
      console.log(commentRef);
      const anchorId = commentParts[c]
        .split(/id="|">.*$/i)
        .filter(s => s !== "")[0];
      console.log(anchorId);
      cards.push(<DocumentCard key={c}>
        <span id={anchorId} />
        <DocumentCardLocation location={title} locationHref={commentRef} />
        <DocumentCardTitle title={content} />
      </DocumentCard>);
    }
    return cards;
  }

  render() {
    const { commentsHtml } = this.props;

    return <div id="comments-wrapper">
      {this.renderCards()}
    </div>;
  }
}