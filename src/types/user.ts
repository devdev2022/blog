export interface UserProfile {
  nickname: string;
  blog_nickname: string | null;
  bio: string | null;
  profile_avatar: string | null;
}

export interface UpdateProfilePayload {
  nickname: string;
  blog_nickname: string | null;
  bio: string | null;
  profile_avatar: string | null;
}

export interface BlogNicknameCheckResult {
  available: boolean;
}
