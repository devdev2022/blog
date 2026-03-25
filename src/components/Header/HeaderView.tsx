import type { RefObject } from "react";
import type { UserInfo } from "@/api/auth/auth";
import type { NotificationItem } from "@/types/notification";

interface HeaderViewProps {
  user: UserInfo | null;
  isLoading: boolean;
  dropdownOpen: boolean;
  dropdownRef: RefObject<HTMLDivElement | null>;
  logoutConfirmOpen: boolean;
  notificationOpen: boolean;
  notificationCount: number;
  notifications: NotificationItem[];
  bellRef: RefObject<HTMLDivElement | null>;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onLogoutConfirm: () => void;
  onLogoutCancel: () => void;
  onProfileClick: () => void;
  onBellClick: () => void;
  onNotificationClick: (postId: string, commentId: string) => void;
  onWriteClick: () => void;
  onAccountClick: () => void;
  onAdminClick: () => void;
}

const NAV_ITEMS = [
  { label: "홈", href: "/" },
  { label: "포스트", href: "/posts" },
  { label: "소개", href: "/about" },
];

const BLOG_NAME = "KHS.dev";

function formatDate(dateStr: string) {
  const [_year, month, day] = dateStr.split("-").map(Number);
  return `${month}월 ${day}일`;
}

function HeaderView({
  user,
  isLoading,
  dropdownOpen,
  dropdownRef,
  logoutConfirmOpen,
  notificationOpen,
  notificationCount,
  notifications,
  bellRef,
  onLoginClick,
  onLogoutClick,
  onLogoutConfirm,
  onLogoutCancel,
  onProfileClick,
  onBellClick,
  onNotificationClick,
  onWriteClick,
  onAccountClick,
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

          <div className="header-right">
            {isLoading ? (
              <div className="header-spinner" />
            ) : user ? (
              <div className="header-user-area">
                <div className="header-bell-wrap" ref={bellRef}>
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
                    {notificationCount > 0 && (
                      <span
                        className="header-bell-badge"
                        style={
                          notificationCount > 9 ? { right: "-6px" } : undefined
                        }
                      >
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    )}
                  </button>

                  {notificationOpen && (
                    <div className="notification-popup">
                      <div className="notification-popup-arrow" />
                      <div className="notification-popup-header">
                        <span className="notification-popup-title">알림</span>
                      </div>
                      <div className="notification-popup-list">
                        {notifications.length === 0 ? (
                          <p className="notification-popup-empty">
                            새 알림이 없습니다.
                          </p>
                        ) : (
                          notifications.map((item) => (
                            <div
                              key={item.id}
                              className="notification-item"
                              onClick={() =>
                                onNotificationClick(item.postId, item.commentId)
                              }
                            >
                              <div className="notification-item-avatar">
                                <div className="notification-item-avatar-placeholder">
                                  {item.author.charAt(0)}
                                </div>
                                <span className="notification-item-type-badge">
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                  </svg>
                                </span>
                              </div>
                              <div className="notification-item-body">
                                <span className="notification-item-label">
                                  {item.type}
                                </span>
                                <p className="notification-item-text">
                                  <strong>{item.author}</strong>님이 {item.type}
                                  을 남겼어요
                                </p>
                                <p className="notification-item-preview">
                                  {item.content}
                                </p>
                              </div>
                              <span className="notification-item-date">
                                {formatDate(item.date)}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="header-user" ref={dropdownRef}>
                  <button
                    className="header-avatar-btn"
                    onClick={onProfileClick}
                    aria-label="사용자 메뉴"
                  >
                    <img
                      className="header-avatar-img"
                      src={user.profile_avatar}
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
                        <button
                          className="header-dropdown-account-btn"
                          onClick={onAccountClick}
                        >
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
                            {/* <button
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
                          </button> */}
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
