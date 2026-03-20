import type { RefObject } from "react";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import WithdrawalModal from "@pages/AccountManagement/component/WithdrawalModal";
import AlertModal from "@components/AlertModal/AlertModal";

type BlogNicknameStatus = "idle" | "checking" | "available" | "taken";

const NICKNAME_REGEX = /^[a-zA-Z0-9]{5,30}$/;

interface AccountManagementPageViewProps {
  nickname: string;
  blogNickname: string;
  blogNicknameStatus: BlogNicknameStatus;
  bio: string;
  avatarPreview: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  withdrawalModalOpen: boolean;
  saveAlertOpen: boolean;
  isSaving: boolean;
  onSaveAlertClose: () => void;
  onNicknameChange: (value: string) => void;
  onBlogNicknameChange: (value: string) => void;
  onCheckBlogNickname: () => void;
  onBioChange: (value: string) => void;
  onAvatarClick: () => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onWithdrawalClick: () => void;
  onWithdrawalConfirm: () => void;
  onWithdrawalCancel: () => void;
}

const BLOG_NICKNAME_STATUS_TEXT: Record<BlogNicknameStatus, string> = {
  idle: "",
  checking: "확인 중...",
  available: "사용 가능한 닉네임입니다.",
  taken: "이미 사용 중인 닉네임입니다.",
};

function AccountManagementPageView({
  nickname,
  blogNickname,
  blogNicknameStatus,
  bio,
  avatarPreview,
  fileInputRef,
  withdrawalModalOpen,
  isSaving,
  onNicknameChange,
  onBlogNicknameChange,
  onCheckBlogNickname,
  onBioChange,
  onAvatarClick,
  onAvatarChange,
  onSubmit,
  onWithdrawalClick,
  onWithdrawalConfirm,
  onWithdrawalCancel,
  saveAlertOpen,
  onSaveAlertClose,
}: AccountManagementPageViewProps) {
  const isNicknameInvalid = nickname.length > 0 && !NICKNAME_REGEX.test(nickname);
  const isFormatInvalid = blogNickname.length > 0 && !NICKNAME_REGEX.test(blogNickname);

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
            {isNicknameInvalid ? (
              <p className="account-field-hint account-nickname-status account-nickname-status--taken">
                영문, 숫자만 사용할 수 있으며 5~30자여야 합니다.
              </p>
            ) : (
              <p className="account-field-hint">
                영문, 숫자만 사용할 수 있으며 5~30자여야 합니다.
              </p>
            )}
          </div>

          {/* 블로그 닉네임 */}
          <div className="account-field">
            <label className="account-field-label" htmlFor="blog-nickname">
              블로그 닉네임
            </label>
            <div className="account-nickname-row">
              <div className="account-username-input-wrap">
                <span className="account-username-at">@</span>
                <input
                  id="blog-nickname"
                  type="text"
                  className="account-field-input account-field-input--username"
                  value={blogNickname}
                  onChange={(e) => onBlogNicknameChange(e.target.value)}
                  placeholder="blog-nickname"
                  autoComplete="username"
                />
              </div>
              <button
                type="button"
                className="account-nickname-check-btn"
                onClick={onCheckBlogNickname}
                disabled={!blogNickname || isFormatInvalid || blogNicknameStatus === "checking"}
              >
                중복 확인
              </button>
            </div>
            {isFormatInvalid ? (
              <p className="account-field-hint account-nickname-status account-nickname-status--taken">
                영문, 숫자만 사용할 수 있으며 5~30자여야 합니다.
              </p>
            ) : blogNicknameStatus !== "idle" ? (
              <p
                className={`account-field-hint account-nickname-status account-nickname-status--${blogNicknameStatus}`}
              >
                {BLOG_NICKNAME_STATUS_TEXT[blogNicknameStatus]}
              </p>
            ) : (
              <p className="account-field-hint">
                블로그 주소로 사용됩니다. 영문, 숫자만 사용 가능합니다.
              </p>
            )}
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
            <button
              className="account-submit-btn"
              onClick={onSubmit}
              disabled={isSaving}
            >
              {isSaving ? "저장 중..." : "저장하기"}
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

      {saveAlertOpen && (
        <AlertModal
          message="프로필이 수정되었습니다."
          onClose={onSaveAlertClose}
        />
      )}

      <Footer />
    </>
  );
}

export default AccountManagementPageView;
