export interface Post {
  id: number;
  title: string;
  excerpt: string;
  tag: string;
  tags: string[];
  date: string;
  readingTime: number;
  slug: string;
  thumbnail?: string;
  category?: string;
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
