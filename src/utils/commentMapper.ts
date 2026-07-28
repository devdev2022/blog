import type { Comment, CommentResponse } from "@/types/comment";

export function toComment(item: CommentResponse): Comment {
  return {
    id: item.id,
    parentId: item.parentId ?? null,
    author: item.nickname,
    avatarUrl: item.avatarUrl ?? null,
    content: item.content,
    date: item.createdAt.slice(0, 10),
    isEdited: !!item.editedAt,
    isOwnerComment: !!item.isOwnerComment,
  };
}
