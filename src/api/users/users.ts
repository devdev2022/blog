import api from "../axiosInstance";
import type { UserProfile, UpdateProfilePayload, BlogNicknameCheckResult } from "@/types/user";

export async function getMyProfile(accessToken: string): Promise<UserProfile> {
  const res = await api.get<UserProfile>("/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
}

export async function checkBlogNickname(
  value: string,
  accessToken: string
): Promise<BlogNicknameCheckResult> {
  const res = await api.get<BlogNicknameCheckResult>(
    "/users/blog-nickname/check",
    {
      params: { value },
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return res.data;
}

export async function updateMyProfile(
  payload: UpdateProfilePayload,
  accessToken: string
): Promise<void> {
  await api.patch("/users/me", payload, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function deleteMyAccount(accessToken: string): Promise<void> {
  await api.delete("/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
