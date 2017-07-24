import * as React from "react";
import { DocumentCard, DocumentCardTitle } from "office-ui-fabric-react";

export interface P {
  commentsHtml: string;
}

export default class CommentList extends React.Component<P> {

  renderCards(): JSX.Element[] {
    const comments = this.props.commentsHtml;
    let cards: JSX.Element[] = [];
    const commentParts = comments.split(/<\/?d(t|d)[^<]*>/ig);
    for (let c = 0; c < commentParts.length; c += 2) {
      cards.push(<DocumentCard key={c}>
        <DocumentCardTitle title={commentParts[c]} />
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