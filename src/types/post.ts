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
