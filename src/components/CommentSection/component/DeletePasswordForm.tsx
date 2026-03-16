import { useState } from 'react';

interface DeletePasswordFormProps {
  onSubmit: (password: string) => boolean;
  onCancel: () => void;
}

function DeletePasswordForm({ onSubmit, onCancel }: DeletePasswordFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    const ok = onSubmit(password.trim());
    if (!ok) setError('비밀번호가 일치하지 않습니다.');
  };

  return (
    <form className="comment-delete-password-form" onSubmit={handleSubmit}>
      <input
        className="comment-input-password"
        type="password"
        placeholder="비밀번호 입력"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(''); }}
        maxLength={20}
        autoFocus
      />
      {error && <p className="comment-error-msg">{error}</p>}
      <div className="comment-form-actions">
        <button type="button" className="comment-btn-cancel" onClick={onCancel}>
          취소
        </button>
        <button
          type="submit"
          className="comment-btn-submit"
          disabled={!password.trim()}
        >
          확인
        </button>
      </div>
    </form>
  );
}

export default DeletePasswordForm;
