import { useState } from 'react';

interface EditFormProps {
  initialContent: string;
  onSubmit: (password: string, newContent: string) => boolean;
  onCancel: () => void;
}

function EditForm({ initialContent, onSubmit, onCancel }: EditFormProps) {
  const [password, setPassword] = useState('');
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || !content.trim()) return;
    const success = onSubmit(password.trim(), content.trim());
    if (success) {
      onCancel();
    } else {
      setError('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <form className="comment-edit-form" onSubmit={handleSubmit}>
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
      <textarea
        className="comment-input-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />
      <div className="comment-form-actions">
        <button type="button" className="comment-btn-cancel" onClick={onCancel}>
          취소
        </button>
        <button
          type="submit"
          className="comment-btn-submit"
          disabled={!password.trim() || !content.trim()}
        >
          수정 완료
        </button>
      </div>
    </form>
  );
}

export default EditForm;
