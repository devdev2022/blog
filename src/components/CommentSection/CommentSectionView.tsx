import type { Comment } from '@/types/comment';
import type { UserInfo } from '@/api/auth/auth';
import CommentForm from './component/CommentForm';
import CommentItem from './component/CommentItem';

interface CommentSectionViewProps {
  comments: Comment[];
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

function CommentSectionView({
  comments,
  replyTo,
  highlightCommentId,
  isOwner,
  user,
  onReplyTo,
  onAddComment,
  onDeleteComment,
  onEditComment,
  onCheckDeletePassword,
}: CommentSectionViewProps) {
  const rootComments = comments.filter((c) => c.parentId === null);
  const totalCount = comments.length;

  return (
    <section className="comment-section">
      <h2 className="comment-section-title">
        댓글
        <span className="comment-count">{totalCount}</span>
      </h2>

      {rootComments.length > 0 ? (
        <div className="comment-list">
          {rootComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              allComments={comments}
              depth={0}
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
      ) : (
        <p className="comment-empty">첫 번째 댓글을 남겨보세요.</p>
      )}

      <div className="comment-form-wrapper">
        <p className="comment-form-label">댓글 작성</p>
        <CommentForm
          user={user}
          onSubmit={(author, password, content) =>
            onAddComment(author, password, content, null)
          }
        />
      </div>
    </section>
  );
}

export default CommentSectionView;
