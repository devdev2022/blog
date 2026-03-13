import type { RefObject } from "react";
import type { UserInfo } from "@/api/auth/auth";

interface HeaderViewProps {
  user: UserInfo | null;
  isLoading: boolean;
  dropdownOpen: boolean;
  dropdownRef: RefObject<HTMLDivElement | null>;
  logoutConfirmOpen: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onLogoutConfirm: () => void;
  onLogoutCancel: () => void;
  onProfileClick: () => void;
  onBellClick: () => void;
  onWriteClick: () => void;
  onAdminClick: () => void;
}

const NAV_ITEMS = [
  { label: "홈", href: "/" },
  { label: "포스트", href: "/posts" },
  { label: "소개", href: "/about" },
];

const BLOG_NAME = "KHS.dev";

function HeaderView({
  user,
  isLoading,
  dropdownOpen,
  dropdownRef,
  logoutConfirmOpen,
  onLoginClick,
  onLogoutClick,
  onLogoutConfirm,
  onLogoutCancel,
  onProfileClick,
  onBellClick,
  onWriteClick,
  onAdminClick,
}: HeaderViewProps) {
  return (
    <>
      <header className="header">
        <div className="header-inner">
          <a href="/" className="header-logo">
            KHS.dev
          </a>
          <nav>
            <ul className="header-nav">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="header-nav-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {isLoading ? (
            <div className="header-spinner" />
          ) : user ? (
            <div className="header-user-area">
              <button
                className="header-icon-btn"
                onClick={onBellClick}
                aria-label="알림"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </button>

              <div className="header-user" ref={dropdownRef}>
                <button
                  className="header-avatar-btn"
                  onClick={onProfileClick}
                  aria-label="사용자 메뉴"
                >
                  <img
                    className="header-avatar-img"
                    src={user.avatar_url}
                    alt={user.username}
                  />
                </button>

                {dropdownOpen && (
                  <div className="header-dropdown">
                    <div className="header-dropdown-arrow" />
                    <div className="header-dropdown-profile">
                      <span className="header-dropdown-username">
                        {user.username}
                      </span>
                      <button className="header-dropdown-account-btn">
                        계정관리
                      </button>
                    </div>

                    <div className="header-dropdown-divider" />

                    <div className="header-dropdown-blog-section">
                      <span className="header-dropdown-blog-label">
                        운영중인 블로그
                      </span>
                      <div className="header-dropdown-blog-row">
                        <span className="header-dropdown-blog-name">
                          {BLOG_NAME}
                        </span>
                        <div className="header-dropdown-blog-actions">
                          <button
                            className="header-dropdown-blog-action-btn"
                            onClick={onWriteClick}
                            aria-label="글 작성"
                            title="글 작성"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className="header-dropdown-blog-action-btn"
                            onClick={onAdminClick}
                            aria-label="블로그 설정"
                            title="블로그 설정"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="3" />
                              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="header-dropdown-divider" />

                    <button
                      className="header-dropdown-logout-btn"
                      onClick={onLogoutClick}
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button className="header-login-btn" onClick={onLoginClick}>
              LOGIN
            </button>
          )}
        </div>
      </header>

      {logoutConfirmOpen && (
        <div className="logout-confirm-overlay" onClick={onLogoutCancel}>
          <div className="logout-confirm" onClick={(e) => e.stopPropagation()}>
            <p className="logout-confirm-message">로그아웃 하시겠습니까?</p>
            <div className="logout-confirm-actions">
              <button
                className="logout-confirm-btn logout-confirm-btn--ok"
                onClick={onLogoutConfirm}
              >
                네
              </button>
              <button
                className="logout-confirm-btn logout-confirm-btn--cancel"
                onClick={onLogoutCancel}
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HeaderView;
