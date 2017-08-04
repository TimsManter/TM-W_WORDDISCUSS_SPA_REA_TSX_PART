export default interface IComment {
  id: number;
  title: string;
  content: string;
  author?: string;
  responses?: IComment[];
}