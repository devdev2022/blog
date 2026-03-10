import { useState } from 'react';
import type { Comment } from '@/types/comment';
import { dummyComments } from '@/dummydata/dummyComments';
import CommentSectionView from './CommentSectionView';

interface CommentSectionProps {
  postSlug: string;
}

function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(
    dummyComments[postSlug] ?? [],
  );
  const [replyTo, setReplyTo] = useState<number | null>(null);

  const handleAddComment = (
    author: string,
    content: string,
    parentId: number | null,
  ) => {
    const newComment: Comment = {
      id: Date.now(),
      parentId,
      author,
      content,
      date: new Date().toISOString().split('T')[0],
    };
    setComments((prev) => [...prev, newComment]);
    setReplyTo(null);
  };

  const handleSetReplyTo = (id: number | null) => {
    setReplyTo((prev) => (prev === id ? null : id));
  };

  return (
    <CommentSectionView
      comments={comments}
      replyTo={replyTo}
      onReplyTo={handleSetReplyTo}
      onAddComment={handleAddComment}
    />
  );
}

export default CommentSection;
