import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { Comment } from '@/types/comment';
import { dummyComments } from '@/dummydata/dummyComments';
import { useAuth } from '@/contexts/AuthContext';
import CommentSectionView from './CommentSectionView';

const BLOG_OWNER_GITHUB_ID = Number(import.meta.env.VITE_BLOG_OWNER_GITHUB_ID);

interface CommentSectionProps {
  postSlug: string;
}

function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(
    dummyComments[postSlug] ?? [],
  );
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const { hash } = useLocation();
  const { user } = useAuth();

  const isOwner = Boolean(user && user.github_id === BLOG_OWNER_GITHUB_ID);

  const highlightCommentId = hash.startsWith('#comment-')
    ? Number(hash.replace('#comment-', ''))
    : null;

  const handleAddComment = (
    author: string,
    password: string,
    content: string,
    parentId: number | null,
  ) => {
    const newComment: Comment = {
      id: Date.now(),
      parentId,
      author,
      password,
      content,
      date: new Date().toISOString().split('T')[0],
    };
    setComments((prev) => [...prev, newComment]);
    setReplyTo(null);
  };

  const handleSetReplyTo = (id: number | null) => {
    setReplyTo((prev) => (prev === id ? null : id));
  };

  // 해당 댓글과 모든 하위 댓글 id 목록 반환
  const getDescendantIds = (id: number, allComments: Comment[]): number[] => {
    const children = allComments.filter((c) => c.parentId === id);
    return children.reduce<number[]>(
      (acc, child) => [...acc, child.id, ...getDescendantIds(child.id, allComments)],
      [],
    );
  };

  const handleDeleteComment = (id: number, password?: string): boolean => {
    if (!isOwner) {
      const target = comments.find((c) => c.id === id);
      if (!target || target.password !== password) return false;
    }
    const toDelete = new Set([id, ...getDescendantIds(id, comments)]);
    setComments((prev) => prev.filter((c) => !toDelete.has(c.id)));
    return true;
  };

  const handleEditComment = (id: number, password: string, newContent: string): boolean => {
    const target = comments.find((c) => c.id === id);
    if (!target || target.password !== password) return false;
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, content: newContent, isEdited: true } : c)),
    );
    return true;
  };

  const handleCheckDeletePassword = (id: number, password: string): boolean => {
    const target = comments.find((c) => c.id === id);
    return Boolean(target && target.password === password);
  };

  return (
    <CommentSectionView
      comments={comments}
      replyTo={replyTo}
      highlightCommentId={highlightCommentId}
      isOwner={isOwner}
      onReplyTo={handleSetReplyTo}
      onAddComment={handleAddComment}
      onDeleteComment={handleDeleteComment}
      onEditComment={handleEditComment}
      onCheckDeletePassword={handleCheckDeletePassword}
    />
  );
}

export default CommentSection;
