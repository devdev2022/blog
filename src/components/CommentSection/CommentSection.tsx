import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CommentSectionView from "./CommentSectionView";
import {
  useComments,
  useCreateComment,
  useEditComment,
  useDeleteComment,
  verifyCommentPassword,
} from "@/query/comments";

interface CommentSectionProps {
  postSlug: string;
}

function CommentSection({ postSlug }: CommentSectionProps) {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const { hash } = useLocation();
  const { user } = useAuth();

  const isOwner = Boolean(user?.is_owner);

  const { data: comments = [] } = useComments(postSlug);
  const { mutateAsync: addComment } = useCreateComment(postSlug);
  const { mutateAsync: editCommentMutation } = useEditComment(postSlug);
  const { mutateAsync: deleteCommentMutation } = useDeleteComment(postSlug);

  const highlightCommentId = hash.startsWith("#comment-")
    ? hash.replace("#comment-", "")
    : null;

  const handleAddComment = async (
    author: string,
    password: string,
    content: string,
    parentId: string | null,
  ) => {
    const avatarUrl = isOwner ? (user?.profile_avatar ?? null) : null;
    await addComment({ postId: postSlug, parentId, nickname: author, password, content, avatarUrl });
    setReplyTo(null);
  };

  const handleSetReplyTo = (id: string | null) => {
    setReplyTo((prev) => (prev === id ? null : id));
  };

  const handleDeleteComment = async (id: string, password?: string): Promise<boolean> => {
    try {
      await deleteCommentMutation({ id, password: isOwner ? undefined : password });
      return true;
    } catch {
      return false;
    }
  };

  const handleEditComment = async (
    id: string,
    password: string,
    newContent: string,
  ): Promise<boolean> => {
    try {
      await editCommentMutation({ id, content: newContent, password: isOwner ? undefined : password });
      return true;
    } catch {
      return false;
    }
  };

  const handleCheckDeletePassword = async (id: string, password: string): Promise<boolean> => {
    return verifyCommentPassword(id, password);
  };

  return (
    <CommentSectionView
      comments={comments}
      replyTo={replyTo}
      highlightCommentId={highlightCommentId}
      isOwner={isOwner}
      user={user}
      onReplyTo={handleSetReplyTo}
      onAddComment={handleAddComment}
      onDeleteComment={handleDeleteComment}
      onEditComment={handleEditComment}
      onCheckDeletePassword={handleCheckDeletePassword}
    />
  );
}

export default CommentSection;
