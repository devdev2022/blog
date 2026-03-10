export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

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
