import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModalView from './LoginModalView';

interface LoginModalProps {
  onClose: () => void;
}

function LoginModal({ onClose }: LoginModalProps) {
  const { login } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return <LoginModalView onClose={onClose} onGitHubLogin={login} />;
}

export default LoginModal;
