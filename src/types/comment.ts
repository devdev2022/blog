export interface Comment {
  id: number;
  parentId: number | null;
  author: string;
  password: string;
  content: string;
  date: string;
  isEdited?: boolean;
}
