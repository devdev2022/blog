import { matchPath } from "react-router-dom";
import { PageRouters } from "@/data/PageRoutes";

// 이미 prefetch한 라우트는 다시 호출하지 않기 위한 가드
const prefetched = new Set<string>();

// hover/focus 같은 '사용자 의도' 신호에서 호출해 클릭 시점의 청크 다운로드 1홉을 제거
export function prefetchPath(to: string): void {
  const route = PageRouters.find((r) => matchPath(r.path, to));
  if (!route?.load || prefetched.has(route.path)) return;
  prefetched.add(route.path);
  // 네트워크 실패 등은 다음 기회에 재시도할 수 있도록 가드에서 제거
  Promise.resolve(route.load()).catch(() => prefetched.delete(route.path));
}
