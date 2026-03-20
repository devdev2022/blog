import api from "../axiosInstance";
import type { CategoryListResponse, SaveDraftBody, DraftSaveResponse, CreatePostBody, CreatePostResponse } from "../../types/post";

// 서버 응답 타입 (백엔드 엔티티 기준)
export interface PostMediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  order: number;
}

export interface PostTagItem {
  id: string;
  name: string;
}

export interface PostSubCategoryItem {
  id: string;
  name: string;
  mainCategory: {
    id: string;
    name: string;
  };
}

export interface PostListItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  editedAt: string | null;
  mainCategory: { id: string; name: string } | null;
  subCategory: PostSubCategoryItem | null;
  tags: PostTagItem[];
  media: PostMediaItem[];
}

export interface PostListResponse {
  posts: PostListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface PostListParams {
  page?: number;
  limit?: number;
  mainCategory?: string;
  subCategory?: string;
  tag?: string;
}
export interface UpdatePostBody {
  title: string;
  content: string;
  categorySlug: string;
  tags: string[];
}

export interface PostDetailResponse {
  post: PostListItem;
  prevPost: PostListItem | null;
  nextPost: PostListItem | null;
  recentPosts: PostListItem[];
}

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

export async function updatePost(
  id: string,
  body: UpdatePostBody,
  token: string,
): Promise<void> {
  await api.put(`/posts/${id}`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createPost(
  body: CreatePostBody,
  token: string,
): Promise<CreatePostResponse> {
  const res = await api.post<CreatePostResponse>("/posts", body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function saveDraft(
  body: SaveDraftBody,
  token: string,
): Promise<DraftSaveResponse> {
  const res = await api.post<DraftSaveResponse>("/posts/drafts", body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateDraft(
  id: string,
  body: SaveDraftBody,
  token: string,
): Promise<void> {
  await api.put(`/posts/drafts/${id}`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
