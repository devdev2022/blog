import { useState } from 'react';
import type { Comment } from '@/types/comment';
import type { UserInfo } from '@/api/auth/auth';
import CommentForm from './CommentForm';
import EditForm from './EditForm';
import DeletePasswordForm from './DeletePasswordForm';
import DeleteModal from './DeleteModal';
import { getInitials } from '@/utils/getInitials';

const AVATAR_COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
function getAvatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

export interface CommentItemProps {
  comment: Comment;
  allComments: Comment[];
  depth: number;
  replyTo: string | null;
  highlightCommentId: string | null;
  isOwner: boolean;
  user: UserInfo | null;
  onReplyTo: (id: string | null) => void;
  onAddComment: (author: string, password: string, content: string, parentId: string | null) => void;
  onDeleteComment: (id: string, password?: string) => Promise<boolean>;
  onEditComment: (id: string, password: string, newContent: string) => Promise<boolean>;
  onCheckDeletePassword: (id: string, password: string) => Promise<boolean>;
}

function CommentItem({
  comment,
  allComments,
  depth,
  replyTo,
  highlightCommentId,
  isOwner,
  user,
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
  const parentAuthor = comment.parentId
    ? (allComments.find((c) => c.id === comment.parentId)?.author ?? null)
    : null;

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

  const handlePasswordSubmit = async (password: string): Promise<boolean> => {
    const ok = await onCheckDeletePassword(comment.id, password);
    if (ok) {
      setPendingDeletePassword(password);
      setDeleteStep('confirm');
    }
    return ok;
  };

  const handleDeleteConfirm = async () => {
    await onDeleteComment(comment.id, isOwner ? undefined : pendingDeletePassword);
    setDeleteStep(null);
    setPendingDeletePassword('');
  };

  const handleDeleteCancel = () => {
    setDeleteStep(null);
    setPendingDeletePassword('');
  };

  return (
    <div id={`comment-${comment.id}`} className="comment-item">

      {deleteStep === 'confirm' && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      <div className={`comment-box${highlightCommentId === comment.id ? ' comment-box--highlight' : ''}`}>
        <div className="comment-header">
          {comment.avatarUrl ? (
            <img
              className="comment-avatar comment-avatar--image"
              src={comment.avatarUrl}
              alt={comment.author}
            />
          ) : (
            <div
              className="comment-avatar"
              style={{ backgroundColor: getAvatarColor(comment.author) }}
            >
              {getInitials(comment.author)}
            </div>
          )}
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
          <p className="comment-content">
            {parentAuthor && (
              <span className="comment-mention">@{parentAuthor}</span>
            )}
            {comment.content}
          </p>
        )}

        {activeAction === 'edit' && (
          <EditForm
            initialContent={comment.content}
            isOwner={isOwner}
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
            user={user}
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
              user={user}
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
