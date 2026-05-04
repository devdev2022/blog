import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { openLoginModal } from "@/store/modalSlice";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import HeaderView from "./HeaderView";

function Header() {
  const dispatch = useAppDispatch();
  const { user, isLoading, logout } = useAuth();
  const { notifications, unreadCount, hasMore, isFetchingMore, markAsRead, fetchMore } =
    useNotification();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const notificationCount = unreadCount;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setLogoutConfirmOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutConfirmOpen(false);
    logout();
  };

  return (
    <HeaderView
      user={user}
      isLoading={isLoading}
      dropdownOpen={dropdownOpen}
      dropdownRef={dropdownRef}
      logoutConfirmOpen={logoutConfirmOpen}
      notificationOpen={notificationOpen}
      notificationCount={notificationCount}
      notifications={notifications}
      hasMore={hasMore}
      isFetchingMore={isFetchingMore}
      bellRef={bellRef}
      onLoginClick={() => dispatch(openLoginModal())}
      onLogoutClick={handleLogoutClick}
      onLogoutConfirm={handleLogoutConfirm}
      onLogoutCancel={() => setLogoutConfirmOpen(false)}
      onProfileClick={() => setDropdownOpen((prev) => !prev)}
      onBellClick={async () => {
        setNotificationOpen((prev) => !prev);
        if (unreadCount > 0) await markAsRead();
      }}
      onNotificationClick={(postId: string, commentId: string) => {
        setNotificationOpen(false);
        navigate(`/posts/${postId}#comment-${commentId}`);
      }}
      onLoadMore={fetchMore}
      onWriteClick={() => {
        setDropdownOpen(false);
        navigate("/write");
      }}
      onAccountClick={() => {
        setDropdownOpen(false);
        navigate("/account");
      }}
      onAdminClick={() => {
        setDropdownOpen(false);
        navigate("/admin");
      }}
    />
  );
}

export default Header;
