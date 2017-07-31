import IComment from "./../model/IComment";

export default class CommentsParser {
  private _htmlRawDocument: string;
  private _comments: IComment[] = [];

  public get Comments() {
    return this._comments;
  }

  constructor(rawHtml: string) {
    this._htmlRawDocument = rawHtml;

    const commentParts = this.cleanSplit(rawHtml, /(?:<dt |<\/dd>)/i);
    for (let c in commentParts) {
      const anchorId = this.cleanSplit(commentParts[c], /id="|">.*$/i)[0];
      let newComment: IComment = {
        title: this.cleanSplit(commentParts[c], /id="[^>]*>|<\/dt>.*/i)[0],
        content: this.cleanSplit(commentParts[c], /.*<p ?.*?>|<a.*/i)[0],
        commentRef: this.cleanSplit(commentParts[c], /.*href="|">↑.*/i)[0],
        id: Number(anchorId.split("-")[1]),
        anchorId: anchorId
      };
      this._comments.push(newComment);
    }
  }
    
  private cleanSplit(str: string, regex: RegExp): string[] {
    return this.filterEmpty(str.split(regex));
  }

  private filterEmpty(array: string[]): string[] {
    return array.filter(s => s !== "");
  }
}