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

export async function uploadMyAvatar(file: File): Promise<{ profile_avatar: string }> {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await api.patch<{ profile_avatar: string }>("/users/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteMyAccount(): Promise<void> {
  await api.delete("/users/me");
}
