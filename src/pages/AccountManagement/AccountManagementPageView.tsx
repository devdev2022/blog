import type { RefObject } from "react";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import WithdrawalModal from "@pages/AccountManagement/component/WithdrawalModal";

interface AccountManagementPageViewProps {
  nickname: string;
  bio: string;
  avatarPreview: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  withdrawalModalOpen: boolean;
  onNicknameChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onAvatarClick: () => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onWithdrawalClick: () => void;
  onWithdrawalConfirm: () => void;
  onWithdrawalCancel: () => void;
}

function AccountManagementPageView({
  nickname,
  bio,
  avatarPreview,
  fileInputRef,
  withdrawalModalOpen,
  onNicknameChange,
  onBioChange,
  onAvatarClick,
  onAvatarChange,
  onSubmit,
  onWithdrawalClick,
  onWithdrawalConfirm,
  onWithdrawalCancel,
}: AccountManagementPageViewProps) {
  return (
    <>
      <Header />
      <main className="account-main">
        <div className="account-container">
          <h1 className="account-page-title">계정관리</h1>

          {/* 프로필 이미지 */}
          <div className="account-avatar-wrap">
            <button
              className="account-avatar-btn"
              onClick={onAvatarClick}
              type="button"
              aria-label="프로필 사진 변경"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="프로필 사진"
                  className="account-avatar-img"
                />
              ) : (
                <div className="account-avatar-placeholder" />
              )}
              <span className="account-avatar-overlay">
                <svg
                  className="account-avatar-camera-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="account-avatar-file-input"
              onChange={onAvatarChange}
            />
          </div>

          {/* 닉네임 */}
          <div className="account-field">
            <label className="account-field-label" htmlFor="nickname">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              className="account-field-input"
              value={nickname}
              onChange={(e) => onNicknameChange(e.target.value)}
              placeholder="닉네임을 입력해 주세요."
            />
            <p className="account-field-hint">
              한글, 영문, 숫자, 특수문자, 이모티콘을 입력할 수 있습니다.
            </p>
          </div>

          {/* 자기소개 */}
          <div className="account-field">
            <label className="account-field-label" htmlFor="bio">
              자기소개
            </label>
            <textarea
              id="bio"
              className="account-field-textarea"
              value={bio}
              onChange={(e) => onBioChange(e.target.value)}
              placeholder="자기소개를 입력해 주세요."
              rows={5}
            />
          </div>

          {/* 저장 버튼 */}
          <div className="account-submit-wrap">
            <button className="account-submit-btn" onClick={onSubmit}>
              저장하기
            </button>
          </div>

          {/* 탈퇴하기 */}
          <div className="account-withdrawal-wrap">
            <button
              type="button"
              className="account-withdrawal-btn"
              onClick={onWithdrawalClick}
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </main>

      {withdrawalModalOpen && (
        <WithdrawalModal
          onConfirm={onWithdrawalConfirm}
          onCancel={onWithdrawalCancel}
        />
      )}

      <Footer />
    </>
  );
}

export default AccountManagementPageView;
