export interface Comment {
  id: number;
  parentId: number | null;
  author: string;
  password: string;
  avatarUrl?: string | null;
  content: string;
  date: string;
  isEdited?: boolean;
}
