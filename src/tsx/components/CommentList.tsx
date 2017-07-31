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
    const commentParts = this.cleanSplit(comments, /(?:<dt |<\/dd>)/i);
    for (let c in commentParts) {
      const title = this.cleanSplit(commentParts[c], /id="[^>]*>|<\/dt>.*/i)[0];
      const content = this.cleanSplit(commentParts[c], /.*<p .*?>|<\/p.*/i)[0];
      const commentRef = this.cleanSplit(commentParts[c], /.*href="|">↑.*/i)[0];
      const anchorId = this.cleanSplit(commentParts[c], /id="|">.*$/i)[0];
      let id = anchorId.split("-")[1];
      let comment = document.querySelector(`mark[data-comment-id=\"${id}\"]`) as HTMLElement;
      let offsetTop = 0;
      if (comment) { offsetTop = comment.offsetTop; }
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

  cleanSplit(str: string, regex: RegExp): string[] {
    return this.filterEmpty(str.split(regex));
  }

  filterEmpty(array: string[]): string[] {
    return array.filter(s => s !== "");
  }

  render() {
    const { commentsHtml } = this.props;

    return <div id="comments-wrapper">
      {this.renderCards()}
    </div>;
  }
}