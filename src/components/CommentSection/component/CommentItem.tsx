import { useState, memo } from "react";
import type { Comment } from "@/types/comment";
import type { UserInfo } from "@/api/auth/auth";
import CommentForm from "./CommentForm";
import EditForm from "./EditForm";
import DeletePasswordForm from "./DeletePasswordForm";
import DeleteModal from "./DeleteModal";
import { getInitials, getAvatarColor } from "@/utils/getInitials";

export interface CommentItemProps {
  comment: Comment;
  allComments: Comment[];
  depth: number;
  replyTo: string | null;
  highlightCommentId: string | null;
  isOwner: boolean;
  user: UserInfo | null;
  onReplyTo: (id: string | null) => void;
  onAddComment: (
    author: string,
    password: string,
    content: string,
    parentId: string | null,
  ) => void;
  onDeleteComment: (id: string, password?: string) => Promise<boolean>;
  onEditComment: (
    id: string,
    password: string,
    newContent: string,
  ) => Promise<boolean>;
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
  const [activeAction, setActiveAction] = useState<"edit" | null>(null);
  const [deleteStep, setDeleteStep] = useState<"password" | "confirm" | null>(
    null,
  );
  const [pendingDeletePassword, setPendingDeletePassword] = useState("");

  const children = allComments.filter((c) => c.parentId === comment.id);
  const isReplyOpen = replyTo === comment.id;
  const canEdit = !isOwner || comment.isOwnerComment;
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
      setPendingDeletePassword("");
      return;
    }
    setActiveAction(null);
    setDeleteStep(isOwner ? "confirm" : "password");
  };

  const handlePasswordSubmit = async (password: string): Promise<boolean> => {
    const ok = await onCheckDeletePassword(comment.id, password);
    if (ok) {
      setPendingDeletePassword(password);
      setDeleteStep("confirm");
    }
    return ok;
  };

  const handleDeleteConfirm = async () => {
    await onDeleteComment(
      comment.id,
      isOwner ? undefined : pendingDeletePassword,
    );
    setDeleteStep(null);
    setPendingDeletePassword("");
  };

  const handleDeleteCancel = () => {
    setDeleteStep(null);
    setPendingDeletePassword("");
  };

  return (
    <div id={`comment-${comment.id}`} className="comment-item">
      {deleteStep === "confirm" && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      <div
        className={`comment-box${highlightCommentId === comment.id ? " comment-box--highlight" : ""}`}
      >
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
            {comment.isEdited && (
              <span className="comment-edited">(수정됨)</span>
            )}
          </div>
          <div className="comment-action-buttons">
            <button
              className={`comment-reply-btn${isReplyOpen ? " active" : ""}`}
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
            {canEdit && (
              <button
                className={`comment-edit-btn${activeAction === "edit" ? " active" : ""}`}
                onClick={() => {
                  setDeleteStep(null);
                  setActiveAction((prev) => (prev === "edit" ? null : "edit"));
                }}
              >
                수정
              </button>
            )}
            <button
              className={`comment-delete-btn${deleteStep !== null ? " active" : ""}`}
              onClick={handleDeleteButtonClick}
            >
              삭제
            </button>
          </div>
        </div>

        {activeAction !== "edit" && (
          <p className="comment-content">
            {parentAuthor && (
              <span className="comment-mention">@{parentAuthor}</span>
            )}
            {comment.content}
          </p>
        )}

        {activeAction === "edit" && (
          <EditForm
            initialContent={comment.content}
            isOwner={isOwner}
            onSubmit={(password, newContent) =>
              onEditComment(comment.id, password, newContent)
            }
            onCancel={() => setActiveAction(null)}
          />
        )}

        {deleteStep === "password" && (
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

function buildSubtreeIds(
  commentId: string,
  allComments: Comment[],
): Set<string> {
  const childrenMap = new Map<string, string[]>();
  for (const c of allComments) {
    if (c.parentId) {
      if (!childrenMap.has(c.parentId)) childrenMap.set(c.parentId, []);
      childrenMap.get(c.parentId)!.push(c.id);
    }
  }

  const ids = new Set<string>();
  const queue = childrenMap.get(commentId) ?? [];
  for (const id of queue) ids.add(id);
  let i = 0;
  while (i < queue.length) {
    const children = childrenMap.get(queue[i]) ?? [];
    for (const id of children) {
      ids.add(id);
      queue.push(id);
    }
    i++;
  }
  return ids;
}

function areEqual(prev: CommentItemProps, next: CommentItemProps): boolean {
  if (prev.comment !== next.comment) return false;
  if (prev.depth !== next.depth) return false;
  if (prev.highlightCommentId !== next.highlightCommentId) return false;
  if (prev.isOwner !== next.isOwner) return false;
  if (prev.user !== next.user) return false;
  if (prev.onReplyTo !== next.onReplyTo) return false;
  if (prev.onAddComment !== next.onAddComment) return false;
  if (prev.onDeleteComment !== next.onDeleteComment) return false;
  if (prev.onEditComment !== next.onEditComment) return false;
  if (prev.onCheckDeletePassword !== next.onCheckDeletePassword) return false;

  if (prev.allComments !== next.allComments) {
    const commentId = next.comment.id;
    const prevSubtreeIds = buildSubtreeIds(commentId, prev.allComments);
    const nextSubtreeIds = buildSubtreeIds(commentId, next.allComments);

    if (prevSubtreeIds.size !== nextSubtreeIds.size) return false;

    const prevDescMap = new Map(
      prev.allComments
        .filter((c) => prevSubtreeIds.has(c.id))
        .map((c) => [c.id, c]),
    );
    for (const c of next.allComments) {
      if (nextSubtreeIds.has(c.id) && prevDescMap.get(c.id) !== c) return false;
    }
  }

  if (prev.replyTo !== next.replyTo) {
    const commentId = next.comment.id;
    const subtreeIds = buildSubtreeIds(commentId, next.allComments);
    const relevantIds = new Set([commentId, ...subtreeIds]);

    const prevRelevant = prev.replyTo !== null && relevantIds.has(prev.replyTo);
    const nextRelevant = next.replyTo !== null && relevantIds.has(next.replyTo);

    if (prevRelevant || nextRelevant) return false;
  }

  return true;
}

export default memo(CommentItem, areEqual);
