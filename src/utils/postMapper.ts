import { extractFirstImage } from "@/utils/extractFirstImage";
import type { Post, PostCategory, CategoryListResponse, PostListItem } from "@/types/post";

export function toExcerpt(html: string): string {
  const text = html.replace(/<[^>]+>/g, "").trim();
  return text.length > 120 ? text.slice(0, 120) + "..." : text;
}

export function toReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function toPost(item: PostListItem): Post {
  const mainName =
    item.subCategory?.mainCategory?.name ?? item.mainCategory?.name ?? "";
  const subName = item.subCategory?.name ?? "";
  const category = mainName && subName ? `${mainName}/${subName}` : mainName;
  const tags = item.tags.map((t) => t.name);
  const thumbnail =
    item.media.find((m) => m.type === "image")?.url ??
    extractFirstImage(item.content);

  return {
    id: item.id.replaceAll("-", ""),
    title: item.title,
    excerpt: toExcerpt(item.content),
    tag: tags[0] ?? "",
    tags,
    date: item.createdAt.slice(0, 10),
    readingTime: toReadingTime(item.content),
    thumbnail,
    category,
    content: item.content,
  };
}

export function toPostCategories(data: CategoryListResponse): PostCategory[] {
  const all: PostCategory = {
    name: "전체 보기",
    slug: "all",
    count: data.total,
  };

  const children = data.categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    count: c.postCount + c.subCategories.reduce((s, sc) => s + sc.postCount, 0),
    children: c.subCategories.map((sc) => ({
      name: sc.name,
      slug: sc.slug,
      count: sc.postCount,
    })),
  }));

  return [all, ...children];
}
