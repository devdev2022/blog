import api from "../axiosInstance";
import type {
  CategoryListResponse,
  SaveDraftBody,
  DraftSaveResponse,
  CreatePostBody,
  CreatePostResponse,
  PostListResponse,
  PostListParams,
  UpdatePostBody,
  PostDetailResponse,
} from "../../types/post";

export async function fetchPostById(id: string): Promise<PostDetailResponse> {
  const res = await api.get<PostDetailResponse>(`/posts/${id}`);
  return res.data;
}

export async function fetchPosts(
  params: PostListParams = {},
): Promise<PostListResponse> {
  const res = await api.get<PostListResponse>("/posts", { params });
  return res.data;
}

export async function fetchCategories(): Promise<CategoryListResponse> {
  const res = await api.get<CategoryListResponse>("/posts/categories");
  return res.data;
}

export async function fetchTags(): Promise<string[]> {
  const res = await api.get<string[]>("/posts/tags");
  return res.data;
}

export async function updatePost(id: string, body: UpdatePostBody): Promise<void> {
  await api.put(`/posts/${id}`, body);
}

export async function deletePost(id: string): Promise<void> {
  await api.delete(`/posts/${id}`);
}

export async function createPost(body: CreatePostBody): Promise<CreatePostResponse> {
  const res = await api.post<CreatePostResponse>("/posts", body);
  return res.data;
}

export async function saveDraft(body: SaveDraftBody): Promise<DraftSaveResponse> {
  const res = await api.post<DraftSaveResponse>("/posts/drafts", body);
  return res.data;
}

export async function updateDraft(id: string, body: SaveDraftBody): Promise<void> {
  await api.put(`/posts/drafts/${id}`, body);
}
