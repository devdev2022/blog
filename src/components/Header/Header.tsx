import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import { openLoginModal } from "@/store/modalSlice";
import { useAuth } from "@/contexts/AuthContext";
import HeaderView from "./HeaderView";

//resources
import { dummyComments } from "@/dummydata/dummyComments";

export interface NotificationItem {
  id: number;
  type: "댓글" | "답글";
  author: string;
  content: string;
  date: string;
  postSlug: string;
  commentId: number;
}

function Header() {
  const dispatch = useAppDispatch();
  const { user, isLoading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const ownerName = user?.username ?? "KHS";

  const notifications = useMemo<NotificationItem[]>(() => {
    return Object.entries(dummyComments)
      .flatMap(([slug, comments]) =>
        comments
          .filter((c) => c.author !== ownerName)
          .map((c) => ({
            id: c.id,
            type: (c.parentId === null ? "댓글" : "답글") as "댓글" | "답글",
            author: c.author,
            content: c.content,
            date: c.date,
            postSlug: slug,
            commentId: c.id,
          })),
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [ownerName]);

  const notificationCount = notifications.length;
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
      bellRef={bellRef}
      onLoginClick={() => dispatch(openLoginModal())}
      onLogoutClick={handleLogoutClick}
      onLogoutConfirm={handleLogoutConfirm}
      onLogoutCancel={() => setLogoutConfirmOpen(false)}
      onProfileClick={() => setDropdownOpen((prev) => !prev)}
      onBellClick={() => setNotificationOpen((prev) => !prev)}
      onNotificationClick={(slug: string, commentId: number) => {
        setNotificationOpen(false);
        navigate(`/posts/${slug}#comment-${commentId}`);
      }}
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
