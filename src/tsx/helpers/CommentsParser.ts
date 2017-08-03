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
    this.addAuthors(html.body);
    this.addChildren(html.body);
    this.markComments(html.body);
  }

  private extractComments(dl: HTMLDListElement) {
    const dtNodes = dl.querySelectorAll("dt");
    for (let d in dtNodes) { if (!dtNodes[d].tagName) { continue; }
      const dt: HTMLElement = dtNodes[d];
      const anchorId = dt.attributes["id"].value;
      const id = Number(anchorId.split("-")[1]);
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

  private markComments(html: HTMLElement) {
    const comments = this._comments;
    const commentStarts = html.querySelectorAll("span[data-comment-edge=\"start\"]");
    for (let s = 0; s < commentStarts.length; s++) {
      const id = Number(commentStarts[s].getAttribute("data-comment-id"));
      let markBag: HTMLElement[] = [];
      let currentSibling = commentStarts[s].nextSibling as HTMLElement;
      if (!currentSibling) { return; }
      while (currentSibling && !this.isEndTag(currentSibling, id)) {
        if (currentSibling) { markBag.push(currentSibling); }
        currentSibling = currentSibling.nextSibling as HTMLElement;
      }
      const mark = document.createElement("mark");
      mark.setAttribute("data-comment-id", String(id));
      markBag.forEach(e => mark.appendChild(e));
      const parent = commentStarts[s].parentElement;
      if (parent) { parent.insertBefore(mark, commentStarts[s].nextSibling); }
    }
  }

  private addAuthors(html: HTMLElement) {
    const comments = this._comments;
    for (let c in comments) {
      const commentId = comments[c].id;
      const sup = html.querySelector(`sup>a[data-comment-id="${commentId}"]`);
      if (sup) {
        const author = sup.getAttribute("data-comment-author");
        if (author) { comments[c].author = author; }
      }
    }
  }

  private addChildren(html: HTMLElement) {
    const comments = this._comments;
    const commentStarts = html.querySelectorAll("span[data-comment-edge=\"start\"]");
    for (let s = 0; s < commentStarts.length; s++) {
      const start = commentStarts[s];
      const nextStart = commentStarts[s + 1];
      if (start.nextElementSibling === nextStart) {
        const parentId = Number(start.getAttribute("data-comment-id"));
        const childId = Number(nextStart.getAttribute("data-comment-id"));
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

  private isEndTag(el: HTMLElement, id: number): boolean {
    if (!el || !(el instanceof HTMLElement)) { return false; }
    if (el.getAttribute("data-comment-edge") !== "end") { return false; }
    if (Number(el.getAttribute("data-comment-id")) !== id) { return false; }
    return true;
  }
}