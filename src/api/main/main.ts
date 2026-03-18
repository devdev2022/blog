import api from "../axiosInstance";
import type { PostListItem } from "../posts/posts";
import type { TechStackItem } from "../about/about";

export async function fetchMainRecentPosts(): Promise<PostListItem[]> {
  const res = await api.get<PostListItem[]>("/main/recent-posts");
  return res.data;
}

export async function fetchMainTechStacks(): Promise<TechStackItem[]> {
  const res = await api.get<TechStackItem[]>("/main/tech-stacks");
  return res.data;
}
