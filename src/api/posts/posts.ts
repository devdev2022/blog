import api from "../axiosInstance";

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

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  postCount: number;
  subCategories: {
    id: string;
    name: string;
    slug: string;
    postCount: number;
  }[];
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

export async function fetchCategories(): Promise<CategoryItem[]> {
  const res = await api.get<CategoryItem[]>("/posts/categories");
  return res.data;
}

export async function fetchTags(): Promise<string[]> {
  const res = await api.get<string[]>("/posts/tags");
  return res.data;
}
