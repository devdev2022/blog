import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AccountManagementPageView from "@pages/AccountManagement/AccountManagementPageView";

function AccountManagementPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(user?.username ?? "");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar_url ?? null,
  );
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  const handleSubmit = () => {
    // TODO: API 연동
    console.log({ nickname, bio, avatarPreview });
  };

  const handleWithdrawalConfirm = () => {
    // TODO: API 연동 (회원 탈퇴 요청)
    logout();
    navigate("/");
  };

  return (
    <AccountManagementPageView
      nickname={nickname}
      bio={bio}
      avatarPreview={avatarPreview}
      fileInputRef={fileInputRef}
      withdrawalModalOpen={withdrawalModalOpen}
      onNicknameChange={setNickname}
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
