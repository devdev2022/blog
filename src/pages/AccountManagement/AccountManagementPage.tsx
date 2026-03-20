import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AccountManagementPageView from "@pages/AccountManagement/AccountManagementPageView";
import {
  getMyProfile,
  checkBlogNickname,
  updateMyProfile,
  deleteMyAccount,
} from "@/api/users/users";

type BlogNicknameStatus = "idle" | "checking" | "available" | "taken";

function AccountManagementPage() {
  const { user, accessToken, logout } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(user?.username ?? "");
  const [blogNickname, setBlogNickname] = useState(user?.blog_nickname ?? "");
  const [blogNicknameStatus, setBlogNicknameStatus] =
    useState<BlogNicknameStatus>("idle");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.profile_avatar ?? null
  );
  const [originalBlogNickname, setOriginalBlogNickname] = useState("");
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveAlertOpen, setSaveAlertOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!accessToken) return;
    getMyProfile(accessToken).then((profile) => {
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
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  const handleBlogNicknameChange = (value: string) => {
    setBlogNickname(value);
    setBlogNicknameStatus("idle");
  };

  const handleCheckBlogNickname = async () => {
    if (!accessToken || !blogNickname) return;
    setBlogNicknameStatus("checking");
    try {
      const { available } = await checkBlogNickname(blogNickname, accessToken);
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
    if (blogNickname && blogNicknameStatus !== "available" && blogNickname !== originalBlogNickname) {
      return;
    }
    setIsSaving(true);
    try {
      await updateMyProfile(
        {
          nickname,
          blog_nickname: blogNickname || null,
          bio: bio || null,
          profile_avatar: avatarPreview,
        },
        accessToken
      );
      setBlogNicknameStatus("idle");
      setSaveAlertOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleWithdrawalConfirm = async () => {
    if (!accessToken) return;
    await deleteMyAccount(accessToken);
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
      onSaveAlertClose={() => { setSaveAlertOpen(false); navigate("/"); }}
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
