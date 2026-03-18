import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchComments,
  createComment,
  verifyCommentPassword,
  editComment,
  deleteComment,
} from "@/api/comments/comments";

export const useComments = (postId: string) =>
  useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    staleTime: 1000 * 60,
    enabled: !!postId,
  });

export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });
};

export const useEditComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content, password, accessToken }: { id: string; content: string; password?: string; accessToken?: string }) =>
      editComment(id, content, password, accessToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });
};

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, password, accessToken }: { id: string; password?: string; accessToken?: string }) =>
      deleteComment(id, password, accessToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });
};

export { verifyCommentPassword };
