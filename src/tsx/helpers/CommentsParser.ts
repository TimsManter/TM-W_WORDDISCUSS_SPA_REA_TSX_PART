import IComment from "./../model/IComment";

export default class CommentsParser {
  private _htmlDocument: Document;
  private _comments: IComment[] = [];

  public get Comments() {
    return this._comments;
  }

  constructor(dl: HTMLDListElement, html: Document) {
    this._htmlDocument = html;

    this.extractComments(dl);
    this.addChildrens(html.body);
  }

  private extractComments(dl: HTMLDListElement) {
    const dtNodes = dl.querySelectorAll("dt");
    for (let d in dtNodes) { if (!dtNodes[d].tagName) { continue; }
      const dt: HTMLElement = dtNodes[d];
      const anchorId = dt.attributes["id"].value;
      const id = anchorId.split("-")[1];
      const dd = dt.nextElementSibling; if (!dd) { continue; }
      const title = dt.innerText.trim();
      const ddPara = dd.firstChild; if (!ddPara) { continue; }
      const ddText = ddPara.firstChild; if (!ddText) { continue; }
      const content = ddText.textContent ? ddText.textContent.trim() : "";
      const ddLink = ddPara.lastChild; if (!ddLink) { continue; }
      const commentRef = ddLink.attributes["href"].value;
      this._comments.push({ id, anchorId, title, content, commentRef });
    }
  }

  private addChildrens(html: HTMLElement) {
    const comments = this._comments;
    const commentStarts = html.querySelectorAll("span[data-comment-edge=\"start\"]");
    for (let s = 0; s < commentStarts.length; s++) {
      const start = commentStarts[s];
      const nextStart = commentStarts[s + 1];
      if (start.nextElementSibling === nextStart) {
        const parentId = start.attributes["data-comment-id"].value;
        const childId = nextStart.attributes["data-comment-id"].value;
        if (!parentId || !childId) { continue; }
        let parent = comments.find(c => c.id === parentId);
        if (!parent) { parent = this.findParent(parentId); }
        const childIndex = comments.findIndex(c => c.id === childId);
        if (!parent || childIndex === -1) { continue; }
        if (!parent.responses) { parent.responses = []; }
        parent.responses.push(comments.splice(childIndex, 1)[0]);
      }
    }
  }

  private findParent(id: number): IComment | undefined {
    const comments = this._comments;
    for (let c in comments) {
      const responses = comments[c].responses; if (!responses) { continue; }
      const foundChild = responses.find(c => c.id === id);
      if (foundChild) { return comments[c]; }
    }
  }
}