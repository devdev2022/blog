import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { NotificationItem } from "@/types/notification";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

interface SsePayload {
  id: string;
  postId: string;
  parentId: string | null;
  nickname: string;
  content: string;
  createdAt: string;
}

function toNotificationItem(payload: SsePayload): NotificationItem {
  return {
    id: payload.id,
    type: payload.parentId ? "답글" : "댓글",
    author: payload.nickname,
    content: payload.content,
    date: payload.createdAt.slice(0, 10),
    postId: payload.postId,
    commentId: payload.id,
  };
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  hasMore: boolean;
  isFetchingMore: boolean;
  markAsRead: () => Promise<void>;
  fetchMore: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, accessToken } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const nextCursorRef = useRef<string | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);

  const connect = useCallback(
    async (token: string) => {
      if (activeRef.current) return;
      activeRef.current = true;

      try {
        const res = await fetch(`${API_BASE}/notifications/stream`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
          },
        });

        if (!res.ok || !res.body) {
          activeRef.current = false;
          return;
        }

        const reader = res.body.getReader();
        readerRef.current = reader;
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            const eventLine = part.match(/^event:\s*(.+)$/m)?.[1]?.trim();
            const dataLine = part.match(/^data:\s*(.+)$/m)?.[1]?.trim();
            if (!dataLine) continue;

            try {
              const parsed = JSON.parse(dataLine);
              if (eventLine === "init") {
                const { items, hasMore: initHasMore, nextCursor, readAt } =
                  parsed as {
                    items: SsePayload[];
                    hasMore: boolean;
                    nextCursor: string | null;
                    readAt: string | null;
                  };
                const notificationItems = items.map(toNotificationItem);
                setNotifications(notificationItems);
                setHasMore(initHasMore);
                nextCursorRef.current = nextCursor;
                const unread = readAt
                  ? notificationItems.filter(
                      (n) => new Date(n.date) > new Date(readAt.slice(0, 10)),
                    ).length
                  : notificationItems.length;
                setUnreadCount(unread);
              } else if (eventLine === "notification") {
                const item = toNotificationItem(parsed as SsePayload);
                setNotifications((prev) => [item, ...prev]);
                setUnreadCount((prev) => prev + 1);
              }
            } catch {
              // JSON 파싱 실패 시 무시
            }
          }
        }
      } catch {
        // fetch 에러 (네트워크 단절 등)
      }

      activeRef.current = false;

      // 재연결 (3초 후)
      reconnectTimerRef.current = setTimeout(() => {
        if (accessToken) connect(accessToken);
      }, 3000);
    },
    [accessToken],
  );

  useEffect(() => {
    if (!user || !accessToken) {
      setNotifications([]);
      return;
    }

    connect(accessToken);

    return () => {
      activeRef.current = false;
      readerRef.current?.cancel();
      readerRef.current = null;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };
  }, [user, accessToken, connect]);

  const fetchMore = useCallback(async () => {
    if (!accessToken || !hasMore || isFetchingMore || !nextCursorRef.current)
      return;
    setIsFetchingMore(true);
    try {
      const res = await fetch(
        `${API_BASE}/notifications?cursor=${encodeURIComponent(nextCursorRef.current)}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (!res.ok) return;
      const data = (await res.json()) as {
        items: SsePayload[];
        hasMore: boolean;
        nextCursor: string | null;
      };
      setNotifications((prev) => [...prev, ...data.items.map(toNotificationItem)]);
      setHasMore(data.hasMore);
      nextCursorRef.current = data.nextCursor;
    } finally {
      setIsFetchingMore(false);
    }
  }, [accessToken, hasMore, isFetchingMore]);

  const markAsRead = useCallback(async () => {
    if (!accessToken) return;
    try {
      await fetch(`${API_BASE}/notifications/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUnreadCount(0);
    } catch {
      // 실패 시 무시
    }
  }, [accessToken]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, hasMore, isFetchingMore, markAsRead, fetchMore }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}
