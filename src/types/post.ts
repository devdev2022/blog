export interface Post {
  id: number;
  title: string;
  excerpt: string;
  tag: string;
  tags: string[];
  date: string;
  readingTime: number;
  slug: string;
}

export interface TechItem {
  name: string;
}

export interface TechCategory {
  category: string;
  items: TechItem[];
}
