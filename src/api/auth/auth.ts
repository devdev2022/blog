import api from "../axiosInstance";

export interface UserInfo {
  github_id: number;
  username: string;
  avatar_url: string;
}

export interface RefreshResult {
  accessToken: string;
  user: UserInfo;
}

export async function refreshAccessToken(): Promise<RefreshResult> {
  const res = await api.post<RefreshResult>("/auth/token/refresh");
  return res.data;
}

export async function serverLogout(accessToken: string): Promise<void> {
  await api.delete("/auth/logout", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
