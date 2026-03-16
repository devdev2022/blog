import { useState } from 'react';

interface CommentFormProps {
  onSubmit: (author: string, password: string, content: string) => void;
  onCancel?: () => void;
  isReply?: boolean;
}

function CommentForm({ onSubmit, onCancel, isReply = false }: CommentFormProps) {
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !password.trim() || !content.trim()) return;
    onSubmit(author.trim(), password.trim(), content.trim());
    setAuthor('');
    setPassword('');
    setContent('');
  };

  return (
    <form
      className={`comment-form${isReply ? ' comment-form-reply' : ''}`}
      onSubmit={handleSubmit}
    >
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
      <div className="comment-form-actions">
        {onCancel && (
          <button type="button" className="comment-btn-cancel" onClick={onCancel}>
            취소
          </button>
        )}
        <button
          type="submit"
          className="comment-btn-submit"
          disabled={!author.trim() || !password.trim() || !content.trim()}
        >
          {isReply ? '답글 등록' : '댓글 등록'}
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
