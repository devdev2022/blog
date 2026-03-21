import api from "../axiosInstance";
import type { UserProfile, UpdateProfilePayload, BlogNicknameCheckResult } from "@/types/user";

export async function getMyProfile(): Promise<UserProfile> {
  const res = await api.get<UserProfile>("/users/me");
  return res.data;
}

export async function checkBlogNickname(value: string): Promise<BlogNicknameCheckResult> {
  const res = await api.get<BlogNicknameCheckResult>("/users/blog-nickname/check", {
    params: { value },
  });
  return res.data;
}

export async function updateMyProfile(payload: UpdateProfilePayload): Promise<void> {
  await api.patch("/users/me", payload);
}

export async function deleteMyAccount(): Promise<void> {
  await api.delete("/users/me");
}
