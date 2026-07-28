import api from "../axiosInstance";
import type { Comment, CommentResponse } from "@/types/comment";
import { toComment } from "@/utils/commentMapper";

export async function fetchComments(postId: string): Promise<Comment[]> {
  const res = await api.get<CommentResponse[]>(`/comments/${postId}`);
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
  const res = await api.post<CommentResponse>(`/comments/${postId}`, body);
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
