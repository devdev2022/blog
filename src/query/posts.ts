import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPosts,
  fetchCategories,
  fetchTags,
  fetchPostById,
  updatePost,
  type PostListParams,
  type UpdatePostBody,
} from "@/api/posts/posts";

export const usePostList = (params: PostListParams = {}) =>
  useQuery({
    queryKey: ["posts", params],
    queryFn: () => fetchPosts(params),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });

export const usePostCategories = () =>
  useQuery({
    queryKey: ["posts", "categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
  });

export const usePostTags = () =>
  useQuery({
    queryKey: ["posts", "tags"],
    queryFn: fetchTags,
    staleTime: 1000 * 60 * 10,
  });

export const usePostDetail = (id: string) =>
  useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchPostById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });

export const useUpdatePost = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { body: UpdatePostBody; token: string }) =>
      updatePost(id, data.body, data.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
