export default interface IComment {
  id: number;
  title: string;
  content: string;
  author?: string;
  anchorId: string;
  commentRef: string;
}