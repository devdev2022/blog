export interface Comment {
  id: string;
  parentId: string | null;
  author: string;
  avatarUrl?: string | null;
  content: string;
  date: string;
  isEdited?: boolean;
  isOwnerComment?: boolean;
}
