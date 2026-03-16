import { useState } from 'react';
import type { Comment } from '@/types/comment';
import CommentForm from './CommentForm';
import EditForm from './EditForm';
import DeletePasswordForm from './DeletePasswordForm';
import DeleteModal from './DeleteModal';

const AVATAR_COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
function getAvatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

export interface CommentItemProps {
  comment: Comment;
  allComments: Comment[];
  depth: number;
  replyTo: number | null;
  highlightCommentId: number | null;
  isOwner: boolean;
  onReplyTo: (id: number | null) => void;
  onAddComment: (author: string, password: string, content: string, parentId: number | null) => void;
  onDeleteComment: (id: number, password?: string) => boolean;
  onEditComment: (id: number, password: string, newContent: string) => boolean;
  onCheckDeletePassword: (id: number, password: string) => boolean;
}

function CommentItem({
  comment,
  allComments,
  depth,
  replyTo,
  highlightCommentId,
  isOwner,
  onReplyTo,
  onAddComment,
  onDeleteComment,
  onEditComment,
  onCheckDeletePassword,
}: CommentItemProps) {
  const [activeAction, setActiveAction] = useState<'edit' | null>(null);
  const [deleteStep, setDeleteStep] = useState<'password' | 'confirm' | null>(null);
  const [pendingDeletePassword, setPendingDeletePassword] = useState('');

  const children = allComments.filter((c) => c.parentId === comment.id);
  const isReplyOpen = replyTo === comment.id;
  const indentPx = Math.min(depth, 3) * 24;

  const handleReplyClick = () => {
    setActiveAction(null);
    setDeleteStep(null);
    onReplyTo(comment.id);
  };

  const handleDeleteButtonClick = () => {
    if (deleteStep !== null) {
      setDeleteStep(null);
      setPendingDeletePassword('');
      return;
    }
    setActiveAction(null);
    setDeleteStep(isOwner ? 'confirm' : 'password');
  };

  const handlePasswordSubmit = (password: string): boolean => {
    const ok = onCheckDeletePassword(comment.id, password);
    if (ok) {
      setPendingDeletePassword(password);
      setDeleteStep('confirm');
    }
    return ok;
  };

  const handleDeleteConfirm = () => {
    onDeleteComment(comment.id, isOwner ? undefined : pendingDeletePassword);
    setDeleteStep(null);
    setPendingDeletePassword('');
  };

  const handleDeleteCancel = () => {
    setDeleteStep(null);
    setPendingDeletePassword('');
  };

  return (
    <div id={`comment-${comment.id}`} className="comment-item" style={{ marginLeft: indentPx }}>
      {depth > 0 && <div className="comment-indent-line" />}

      {deleteStep === 'confirm' && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      <div className={`comment-box${highlightCommentId === comment.id ? ' comment-box--highlight' : ''}`}>
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
            {comment.isEdited && <span className="comment-edited">(수정됨)</span>}
          </div>
          <div className="comment-action-buttons">
            <button
              className={`comment-reply-btn${isReplyOpen ? ' active' : ''}`}
              onClick={handleReplyClick}
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
            <button
              className={`comment-edit-btn${activeAction === 'edit' ? ' active' : ''}`}
              onClick={() => {
                setDeleteStep(null);
                setActiveAction((prev) => (prev === 'edit' ? null : 'edit'));
              }}
            >
              수정
            </button>
            <button
              className={`comment-delete-btn${deleteStep !== null ? ' active' : ''}`}
              onClick={handleDeleteButtonClick}
            >
              삭제
            </button>
          </div>
        </div>

        {activeAction !== 'edit' && (
          <p className="comment-content">{comment.content}</p>
        )}

        {activeAction === 'edit' && (
          <EditForm
            initialContent={comment.content}
            onSubmit={(password, newContent) =>
              onEditComment(comment.id, password, newContent)
            }
            onCancel={() => setActiveAction(null)}
          />
        )}

        {deleteStep === 'password' && (
          <DeletePasswordForm
            onSubmit={handlePasswordSubmit}
            onCancel={handleDeleteCancel}
          />
        )}

        {isReplyOpen && (
          <CommentForm
            isReply
            onSubmit={(author, password, content) =>
              onAddComment(author, password, content, comment.id)
            }
            onCancel={() => onReplyTo(null)}
          />
        )}
      </div>

      {children.length > 0 && (
        <div className="comment-children">
          {children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              allComments={allComments}
              depth={depth + 1}
              replyTo={replyTo}
              highlightCommentId={highlightCommentId}
              isOwner={isOwner}
              onReplyTo={onReplyTo}
              onAddComment={onAddComment}
              onDeleteComment={onDeleteComment}
              onEditComment={onEditComment}
              onCheckDeletePassword={onCheckDeletePassword}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
