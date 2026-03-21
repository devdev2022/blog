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
    mutationFn: ({ id, content, password }: { id: string; content: string; password?: string }) =>
      editComment(id, content, password),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });
};

export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password?: string }) =>
      deleteComment(id, password),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });
};

export { verifyCommentPassword };
