export interface NotificationItem {
  id: string;
  type: "댓글" | "답글";
  author: string;
  content: string;
  date: string; // YYYY-MM-DD
  postId: string;
  commentId: string;
}
