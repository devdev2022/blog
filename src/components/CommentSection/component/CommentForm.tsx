import { useState } from 'react';
import type { UserInfo } from '@/api/auth/auth';

interface CommentFormProps {
  onSubmit: (author: string, password: string, content: string) => void;
  onCancel?: () => void;
  isReply?: boolean;
  user?: UserInfo | null;
}

function CommentForm({ onSubmit, onCancel, isReply = false, user }: CommentFormProps) {
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');

  const isLoggedIn = !!user;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (isLoggedIn) {
      const internalPassword = crypto.randomUUID();
      onSubmit(user.username, internalPassword, content.trim());
    } else {
      if (!author.trim() || !password.trim()) return;
      onSubmit(author.trim(), password.trim(), content.trim());
    }
    setAuthor('');
    setPassword('');
    setContent('');
  };

  return (
    <form
      className={`comment-form${isReply ? ' comment-form-reply' : ''}`}
      onSubmit={handleSubmit}
    >
      {isLoggedIn ? (
        <div className="comment-form-owner-box">
          <div className="comment-form-owner-header">
            {user.profile_avatar ? (
              <img
                className="comment-avatar comment-avatar--image"
                src={user.profile_avatar}
                alt={user.username}
              />
            ) : (
              <div className="comment-avatar" style={{ backgroundColor: '#0ea5e9' }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="comment-owner-name">{user.username}</span>
          </div>
          <textarea
            className="comment-input-content comment-input-content--owner"
            placeholder={isReply ? '답글을 입력하세요' : '내용을 입력하세요.'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={isReply ? 2 : 3}
          />
        </div>
      ) : (
        <>
          <div className="comment-form-top-row">
            <input
              className="comment-input-author"
              type="text"
              placeholder="이름"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={20}
            />
            <input
              className="comment-input-password"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={20}
            />
          </div>
          <textarea
            className="comment-input-content"
            placeholder={isReply ? '답글을 입력하세요' : '댓글을 입력하세요'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={isReply ? 2 : 3}
          />
        </>
      )}

      <div className="comment-form-actions">
        {onCancel && (
          <button type="button" className="comment-btn-cancel" onClick={onCancel}>
            취소
          </button>
        )}
        <button
          type="submit"
          className="comment-btn-submit"
          disabled={isLoggedIn ? !content.trim() : !author.trim() || !password.trim() || !content.trim()}
        >
          {isReply ? '답글 등록' : '댓글 등록'}
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
