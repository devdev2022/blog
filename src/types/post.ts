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

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  tags: string[];
  date: string;
  readingTime: number;
  thumbnail?: string;
  category?: string;
  content?: string;
}

export interface TechItem {
  name: string;
}

export interface TechCategory {
  category: string;
  items: TechItem[];
}

export interface PostCategory {
  name: string;
  slug: string;
  count?: number;
  children?: PostCategory[];
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

export interface CategoryListResponse {
  total: number;
  categories: CategoryItem[];
}

export interface SaveDraftBody {
  title: string;
  content: string;
  categorySlug: string;
  tags: string[];
}

export interface DraftSaveResponse {
  id: string;
}

export interface CreatePostBody {
  title: string;
  content: string;
  categorySlug: string;
  tags: string[];
}

export interface CreatePostResponse {
  id: string;
}
