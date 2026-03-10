export interface Comment {
  id: number;
  parentId: number | null;
  author: string;
  content: string;
  date: string;
}
