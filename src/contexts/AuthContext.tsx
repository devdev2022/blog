import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { UserInfo, RefreshResult } from "@/api/auth/auth";
import {
  useRefreshAccessToken,
  useLogout,
  authSessionQueryOptions,
} from "@/query/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface AuthContextType {
  user: UserInfo | null;
  accessToken: string | null;
  sessionData: RefreshResult | undefined;
  isLoading: boolean;
  loginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: () => void;
  logout: () => void;
  setAuth: (user: UserInfo, accessToken: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  // undefined = sessionData에서 파생, null = 명시적 로그아웃, UserInfo = 로그인 후 직접 세팅
  const [explicitUser, setExplicitUser] = useState<UserInfo | null | undefined>(
    undefined,
  );
  const [explicitToken, setExplicitToken] = useState<string | null | undefined>(
    undefined,
  );
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // 앱 초기화 시 refreshToken 쿠키로 세션 복원
  const { data: sessionData, isLoading } = useRefreshAccessToken();
  const { mutateAsync: logoutMutate } = useLogout();

  // useEffect 없이 동기적으로 파생 → isLoading=false 직후 flash 없음
  const user =
    explicitUser !== undefined ? explicitUser : (sessionData?.user ?? null);
  const accessToken =
    explicitToken !== undefined
      ? explicitToken
      : (sessionData?.accessToken ?? null);

  const login = useCallback(() => {
    setLoginModalOpen(false);

    const width = 600;
    const height = 700;
    const left = Math.round(window.screenX + (window.outerWidth - width) / 2);
    const top = Math.round(window.screenY + (window.outerHeight - height) / 2);

    const popup = window.open(
      `${API_BASE}/auth/github`,
      "github-login",
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "AUTH_SUCCESS") {
        setExplicitUser(event.data.user);
        setExplicitToken(event.data.accessToken);
        window.removeEventListener("message", handleMessage);
        popup?.close();
      } else if (event.data?.type === "AUTH_ERROR") {
        window.removeEventListener("message", handleMessage);
        popup?.close();
      }
    };

    window.addEventListener("message", handleMessage);

    const popupCheckInterval = setInterval(() => {
      if (popup?.closed) {
        clearInterval(popupCheckInterval);
        window.removeEventListener("message", handleMessage);
      }
    }, 500);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutMutate(accessToken!);
    } catch {
      // 서버 로그아웃 실패 시 쿠키는 남지만, 토큰 만료 후 자동 무효화됨
    } finally {
      setExplicitUser(null);
      setExplicitToken(null);
    }
  }, [accessToken, logoutMutate]);

  // accessToken 만료 1분 전 silent refresh, 만료 시점에 재시도 후 실패 시 로그아웃
  useEffect(() => {
    if (!accessToken) return;

    let exp: number;
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      exp = payload.exp as number;
    } catch {
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    // 만료 1분 전 silent refresh
    const msUntilRefresh = exp * 1000 - Date.now() - 60 * 1000;
    if (msUntilRefresh > 0) {
      timers.push(
        setTimeout(() => {
          queryClient
            .fetchQuery(authSessionQueryOptions)
            .then(({ accessToken: newToken, user: newUser }) => {
              setExplicitToken(newToken);
              setExplicitUser(newUser);
            })
            .catch(() => {}); // 아직 유효하므로 무시
        }, msUntilRefresh),
      );
    }

    // 만료 시점에 재시도 → 실패 시 로그아웃
    const msUntilExpiry = exp * 1000 - Date.now();
    if (msUntilExpiry > 0) {
      timers.push(
        setTimeout(() => {
          queryClient
            .fetchQuery(authSessionQueryOptions)
            .then(({ accessToken: newToken, user: newUser }) => {
              setExplicitToken(newToken);
              setExplicitUser(newUser);
            })
            .catch(() => {
              setExplicitUser(null);
              setExplicitToken(null);
            });
        }, msUntilExpiry),
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [accessToken]);

  const setAuth = useCallback((userInfo: UserInfo, token: string) => {
    setExplicitUser(userInfo);
    setExplicitToken(token);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        sessionData,
        isLoading,
        loginModalOpen,
        openLoginModal: () => setLoginModalOpen(true),
        closeLoginModal: () => setLoginModalOpen(false),
        login,
        logout,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
