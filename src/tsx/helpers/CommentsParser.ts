import IComment from "./../model/IComment";

export default class CommentsParser {
  private _htmlDocument: HTMLElement;
  private _comments: IComment[] = [];

  public get Comments() {
    return this._comments;
  }

  constructor(html: HTMLElement) {
    this._htmlDocument = html;

    const dtNodes = html.querySelectorAll("dt");
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
}