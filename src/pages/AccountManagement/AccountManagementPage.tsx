import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile, MY_PROFILE_QUERY_KEY } from "@/query/users";
import AccountManagementPageView from "@pages/AccountManagement/AccountManagementPageView";
import {
  checkBlogNickname,
  updateMyProfile,
  uploadMyAvatar,
  deleteMyAccount,
} from "@/api/users/users";

type BlogNicknameStatus = "idle" | "checking" | "available" | "taken";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

function AccountManagementPage() {
  const { user, accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile } = useMyProfile(!!accessToken);

  const [nickname, setNickname] = useState(user?.username ?? "");
  const [blogNickname, setBlogNickname] = useState(user?.blog_nickname ?? "");
  const [blogNicknameStatus, setBlogNicknameStatus] =
    useState<BlogNicknameStatus>("idle");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.profile_avatar ?? null,
  );
  const [originalBlogNickname, setOriginalBlogNickname] = useState("");
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveAlertOpen, setSaveAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  // 선택한 아바타 파일은 제출 전까지 보관만 한다. (게시글 이미지 삽입과 동일 패턴)
  const avatarFileRef = useRef<File | null>(null);

  // 프로필 단일 소스(useMyProfile)가 로드되면 편집용 로컬 상태에 시딩한다.
  useEffect(() => {
    if (!profile) return;
    setNickname(profile.nickname);
    setBlogNickname(profile.blog_nickname ?? "");
    setOriginalBlogNickname(profile.blog_nickname ?? "");
    setBio(profile.bio ?? "");
    setAvatarPreview(profile.profile_avatar);
  }, [profile]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // 같은 파일 재선택 허용
    if (!file) return;
    if (file.size > MAX_AVATAR_SIZE) {
      setAlertMessage("파일 크기가 5MB를 초과합니다.");
      return;
    }
    // 업로드는 제출 시점에만 한다. 여기서는 파일을 ref에 보관하고 프리뷰만 표시.
    avatarFileRef.current = file;
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleBlogNicknameChange = (value: string) => {
    setBlogNickname(value);
    setBlogNicknameStatus("idle");
  };

  const handleCheckBlogNickname = async () => {
    if (!accessToken || !blogNickname) return;
    setBlogNicknameStatus("checking");
    try {
      const { available } = await checkBlogNickname(blogNickname);
      setBlogNicknameStatus(available ? "available" : "taken");
    } catch {
      setBlogNicknameStatus("idle");
    }
  };

  const NICKNAME_REGEX = /^[a-zA-Z0-9]{5,30}$/;

  const handleSubmit = async () => {
    if (!accessToken) return;
    if (!NICKNAME_REGEX.test(nickname)) return;
    if (blogNickname && !NICKNAME_REGEX.test(blogNickname)) return;
    if (
      blogNickname &&
      blogNicknameStatus !== "available" &&
      blogNickname !== originalBlogNickname
    ) {
      return;
    }
    setIsSaving(true);
    try {
      let avatarUrl = avatarPreview;
      if (avatarFileRef.current) {
        const uploaded = await uploadMyAvatar(avatarFileRef.current);
        avatarUrl = uploaded.profile_avatar;
        avatarFileRef.current = null;
      }
      await updateMyProfile({
        nickname,
        blog_nickname: blogNickname || null,
        bio: bio || null,
        profile_avatar: avatarUrl,
      });
      // 프로필 단일 소스를 무효화 → Header·댓글 등 소비처가 자동으로 최신 값 refetch.
      // (기존의 refreshAccessToken 토큰 회전 없이 프로필만 갱신)
      await queryClient.invalidateQueries({ queryKey: MY_PROFILE_QUERY_KEY });
      setBlogNicknameStatus("idle");
      setSaveAlertOpen(true);
    } catch {
      setAlertMessage(
        "프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleWithdrawalConfirm = async () => {
    if (!accessToken) return;
    await deleteMyAccount();
    logout();
    navigate("/");
  };

  return (
    <AccountManagementPageView
      nickname={nickname}
      blogNickname={blogNickname}
      blogNicknameStatus={blogNicknameStatus}
      bio={bio}
      avatarPreview={avatarPreview}
      fileInputRef={fileInputRef}
      withdrawalModalOpen={withdrawalModalOpen}
      saveAlertOpen={saveAlertOpen}
      isSaving={isSaving}
      onSaveAlertClose={() => {
        setSaveAlertOpen(false);
        navigate("/");
      }}
      alertMessage={alertMessage}
      onAlertClose={() => setAlertMessage(null)}
      onNicknameChange={setNickname}
      onBlogNicknameChange={handleBlogNicknameChange}
      onCheckBlogNickname={handleCheckBlogNickname}
      onBioChange={setBio}
      onAvatarClick={handleAvatarClick}
      onAvatarChange={handleAvatarChange}
      onSubmit={handleSubmit}
      onWithdrawalClick={() => setWithdrawalModalOpen(true)}
      onWithdrawalConfirm={handleWithdrawalConfirm}
      onWithdrawalCancel={() => setWithdrawalModalOpen(false)}
    />
  );
}

export default AccountManagementPage;
