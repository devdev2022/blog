import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

const RELOAD_TS_KEY = "chunk-reload-ts";
const RELOAD_COOLDOWN_MS = 10_000;

// 동적 import 실패(=배포로 사라진 stale chunk) 판별. 브라우저별 메시지가 달라 모두 매칭.
function isChunkLoadError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|ChunkLoadError/i.test(
    msg,
  );
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    if (!isChunkLoadError(error)) return;
    const last = Number(sessionStorage.getItem(RELOAD_TS_KEY) ?? 0);
    if (Date.now() - last > RELOAD_COOLDOWN_MS) {
      sessionStorage.setItem(RELOAD_TS_KEY, String(Date.now()));
      window.location.reload();
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="route-error-boundary">
          <p className="route-error-title">페이지를 불러오지 못했습니다</p>
          <p className="route-error-desc">
            새 버전이 배포되었거나 일시적인 네트워크 문제일 수 있습니다.
          </p>
          <button className="route-error-retry" onClick={this.handleReload}>
            새로고침
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default RouteErrorBoundary;
