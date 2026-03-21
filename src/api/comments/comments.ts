import api from "../axiosInstance";
import type { Comment } from "@/types/comment";

function toComment(item: any): Comment {
  return {
    id: item.id,
    parentId: item.parentId ?? null,
    author: item.nickname,
    avatarUrl: item.avatarUrl ?? null,
    content: item.content,
    date: item.createdAt.toString().slice(0, 10),
    isEdited: !!item.editedAt,
    isOwnerComment: !!item.isOwnerComment,
  };
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  const res = await api.get<any[]>(`/comments/${postId}`);
  return res.data.map(toComment);
}

export async function createComment(data: {
  postId: string;
  parentId: string | null;
  nickname: string;
  password: string;
  content: string;
  avatarUrl?: string | null;
}): Promise<Comment> {
  const { postId, ...body } = data;
  const res = await api.post<any>(`/comments/${postId}`, body);
  return toComment(res.data);
}

export async function verifyCommentPassword(
  id: string,
  password: string,
): Promise<boolean> {
  const res = await api.post<{ ok: boolean }>(`/comments/${id}/verify-password`, { password });
  return res.data.ok;
}

export async function editComment(
  id: string,
  content: string,
  password?: string,
): Promise<void> {
  await api.patch(`/comments/${id}`, { password, content });
}

export async function deleteComment(
  id: string,
  password?: string,
): Promise<void> {
  await api.delete(`/comments/${id}`, { data: { password } });
}
