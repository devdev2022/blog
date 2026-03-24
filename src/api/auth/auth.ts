import api from "../axiosInstance";

export interface UserInfo {
  github_id: number;
  username: string;
  profile_avatar: string;
  blog_nickname: string | null;
  is_owner: boolean;
}

export interface RefreshResult {
  accessToken: string;
  user: UserInfo;
}

export async function refreshAccessToken(): Promise<RefreshResult> {
  const res = await api.post<RefreshResult>("/auth/token/refresh");
  return res.data;
}

export async function serverLogout(): Promise<void> {
  await api.delete("/auth/logout");
}
