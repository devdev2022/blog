import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AccountManagementPageView from "@pages/AccountManagement/AccountManagementPageView";
import {
  getMyProfile,
  checkBlogNickname,
  updateMyProfile,
  uploadMyAvatar,
  deleteMyAccount,
} from "@/api/users/users";
import { refreshAccessToken } from "@/api/auth/auth";

type BlogNicknameStatus = "idle" | "checking" | "available" | "taken";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

function AccountManagementPage() {
  const { user, accessToken, logout, setAuth } = useAuth();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!accessToken) return;
    getMyProfile().then((profile) => {
      setNickname(profile.nickname);
      setBlogNickname(profile.blog_nickname ?? "");
      setOriginalBlogNickname(profile.blog_nickname ?? "");
      setBio(profile.bio ?? "");
      setAvatarPreview(profile.profile_avatar);
    });
  }, [accessToken]);

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
      // 저장된 프로필을 서버에서 다시 읽어 auth context를 갱신한다.
      // (Header·댓글 등 캐시된 user를 쓰는 곳의 stale 방지)
      const { accessToken: refreshedToken, user: refreshedUser } =
        await refreshAccessToken();
      setAuth(refreshedUser, refreshedToken);
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
