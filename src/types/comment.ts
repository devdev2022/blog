export interface CommentResponse {
  id: string;
  parentId?: string | null;
  nickname: string;
  avatarUrl?: string | null;
  content: string;
  createdAt: string;
  editedAt?: string | null;
  isOwnerComment?: boolean;
}

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
