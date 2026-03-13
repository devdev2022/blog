import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import HeaderView from './HeaderView';

function Header() {
  const { user, isLoading, openLoginModal, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      onLoginClick={openLoginModal}
      onLogoutClick={handleLogoutClick}
      onLogoutConfirm={handleLogoutConfirm}
      onLogoutCancel={() => setLogoutConfirmOpen(false)}
      onProfileClick={() => setDropdownOpen((prev) => !prev)}
      onBellClick={() => {}}
      onWriteClick={() => {
        setDropdownOpen(false);
        navigate('/write');
      }}
      onAdminClick={() => {
        setDropdownOpen(false);
        navigate('/admin');
      }}
    />
  );
}

export default Header;
