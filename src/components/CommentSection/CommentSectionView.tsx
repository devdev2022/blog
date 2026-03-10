import { useState } from 'react';
import type { Comment } from '@/types/comment';

/* ---- 아바타 색상 (이름 첫 글자 기준 결정) ---- */
const AVATAR_COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
function getAvatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

/* ---- 댓글 작성 폼 ---- */
interface CommentFormProps {
  onSubmit: (author: string, content: string) => void;
  onCancel?: () => void;
  isReply?: boolean;
}

function CommentForm({ onSubmit, onCancel, isReply = false }: CommentFormProps) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;
    onSubmit(author.trim(), content.trim());
    setAuthor('');
    setContent('');
  };

  return (
    <form
      className={`comment-form${isReply ? ' comment-form-reply' : ''}`}
      onSubmit={handleSubmit}
    >
      <input
        className="comment-input-author"
        type="text"
        placeholder="이름"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        maxLength={20}
      />
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
          disabled={!author.trim() || !content.trim()}
        >
          {isReply ? '답글 등록' : '댓글 등록'}
        </button>
      </div>
    </form>
  );
}

/* ---- 개별 댓글 (재귀) ---- */
interface CommentItemProps {
  comment: Comment;
  allComments: Comment[];
  depth: number;
  replyTo: number | null;
  onReplyTo: (id: number | null) => void;
  onAddComment: (author: string, content: string, parentId: number | null) => void;
}

function CommentItem({
  comment,
  allComments,
  depth,
  replyTo,
  onReplyTo,
  onAddComment,
}: CommentItemProps) {
  const children = allComments.filter((c) => c.parentId === comment.id);
  const isReplyOpen = replyTo === comment.id;
  // 시각적 들여쓰기는 최대 3단계 (72px)까지만
  const indentPx = Math.min(depth, 3) * 24;

  return (
    <div className="comment-item" style={{ marginLeft: indentPx }}>
      {depth > 0 && <div className="comment-indent-line" />}

      <div className="comment-box">
        {/* 헤더 */}
        <div className="comment-header">
          <div
            className="comment-avatar"
            style={{ backgroundColor: getAvatarColor(comment.author) }}
          >
            {comment.author.charAt(0)}
          </div>
          <div className="comment-meta">
            <span className="comment-author">{comment.author}</span>
            <span className="comment-date">{comment.date}</span>
          </div>
          <button
            className={`comment-reply-btn${isReplyOpen ? ' active' : ''}`}
            onClick={() => onReplyTo(comment.id)}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M1 4.5H8.5C10.157 4.5 11.5 5.843 11.5 7.5V10M1 4.5L4 1.5M1 4.5L4 7.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            답글
          </button>
        </div>

        {/* 본문 */}
        <p className="comment-content">{comment.content}</p>

        {/* 인라인 답글 폼 */}
        {isReplyOpen && (
          <CommentForm
            isReply
            onSubmit={(author, content) => onAddComment(author, content, comment.id)}
            onCancel={() => onReplyTo(null)}
          />
        )}
      </div>

      {/* 자식 댓글 (재귀) */}
      {children.length > 0 && (
        <div className="comment-children">
          {children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              allComments={allComments}
              depth={depth + 1}
              replyTo={replyTo}
              onReplyTo={onReplyTo}
              onAddComment={onAddComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- 댓글 섹션 뷰 ---- */
interface CommentSectionViewProps {
  comments: Comment[];
  replyTo: number | null;
  onReplyTo: (id: number | null) => void;
  onAddComment: (author: string, content: string, parentId: number | null) => void;
}

function CommentSectionView({
  comments,
  replyTo,
  onReplyTo,
  onAddComment,
}: CommentSectionViewProps) {
  const rootComments = comments.filter((c) => c.parentId === null);
  const totalCount = comments.length;

  return (
    <section className="comment-section">
      <h2 className="comment-section-title">
        댓글
        <span className="comment-count">{totalCount}</span>
      </h2>

      {/* 댓글 목록 */}
      {rootComments.length > 0 ? (
        <div className="comment-list">
          {rootComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              allComments={comments}
              depth={0}
              replyTo={replyTo}
              onReplyTo={onReplyTo}
              onAddComment={onAddComment}
            />
          ))}
        </div>
      ) : (
        <p className="comment-empty">첫 번째 댓글을 남겨보세요.</p>
      )}

      {/* 댓글 작성 폼 */}
      <div className="comment-form-wrapper">
        <p className="comment-form-label">댓글 작성</p>
        <CommentForm onSubmit={(author, content) => onAddComment(author, content, null)} />
      </div>
    </section>
  );
}

export default CommentSectionView;
