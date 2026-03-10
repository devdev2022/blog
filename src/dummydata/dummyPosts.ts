import type { Post, TechCategory, PostCategory } from "@/types/post";

const p1content = `
<h2 id="intro">들어가며</h2>
<p>React Query(TanStack Query)는 서버 상태를 효율적으로 관리하기 위한 라이브러리입니다. 기존의 <code>useEffect</code> + <code>useState</code> 조합으로 API를 호출할 때 발생하는 여러 문제들을 해결해 줍니다.</p>
<p>이 글에서는 React Query의 핵심 개념부터 실전 패턴까지 단계별로 살펴봅니다.</p>

<h2 id="why-react-query">왜 React Query인가?</h2>
<p>클라이언트 상태와 서버 상태는 근본적으로 다릅니다. Redux 같은 클라이언트 상태 관리 도구로 서버 데이터를 관리하면 다음과 같은 문제가 생깁니다:</p>
<ul>
  <li>캐시 관리의 복잡성 증가</li>
  <li>데이터 동기화 처리 어려움</li>
  <li>로딩 / 에러 상태 보일러플레이트 반복</li>
  <li>백그라운드 리패칭 구현 난이도</li>
</ul>
<p>React Query는 이 모든 문제를 선언적으로 해결합니다.</p>

<h2 id="basic-usage">기본 사용법</h2>
<p>React Query의 핵심은 <code>useQuery</code> 훅입니다. 간단한 예제를 살펴봅시다.</p>
<pre><code>import { useQuery } from '@tanstack/react-query';

function Posts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r =&gt; r.json()),
  });

  if (isLoading) return &lt;div&gt;로딩 중...&lt;/div&gt;;
  if (error) return &lt;div&gt;에러 발생!&lt;/div&gt;;

  return (
    &lt;ul&gt;
      {data.map(post =&gt; &lt;li key={post.id}&gt;{post.title}&lt;/li&gt;)}
    &lt;/ul&gt;
  );
}</code></pre>
<p><code>queryKey</code>는 캐시 키 역할을 하며, <code>queryFn</code>은 실제 비동기 데이터 페칭 함수입니다.</p>

<h2 id="caching">캐싱 전략</h2>
<p>React Query는 기본적으로 데이터를 캐시에 저장하고, 재사용합니다. <code>staleTime</code>과 <code>gcTime</code>으로 캐싱 동작을 제어할 수 있습니다.</p>
<pre><code>useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: 1000 * 60 * 5,  // 5분 동안 신선한 상태 유지
  gcTime: 1000 * 60 * 10,    // 10분 후 캐시 삭제
});</code></pre>

<h3 id="stale-time">staleTime</h3>
<p>데이터가 "신선(fresh)"한 상태로 유지되는 시간입니다. 이 시간 내에는 새로운 요청이 발생해도 서버에 재요청하지 않고 캐시된 데이터를 사용합니다. 기본값은 <code>0</code>입니다.</p>

<h3 id="gc-time">gcTime (구 cacheTime)</h3>
<p>캐시가 메모리에서 제거되기까지의 시간입니다. 해당 queryKey를 사용하는 모든 컴포넌트가 unmount된 후 이 시간이 지나면 캐시가 삭제됩니다. 기본값은 <code>5분</code>입니다.</p>

<h2 id="mutation">데이터 변경: useMutation</h2>
<p>서버 데이터를 생성·수정·삭제할 때는 <code>useMutation</code>을 사용합니다. 성공 후 관련 쿼리를 무효화(invalidate)하여 최신 데이터를 다시 가져오도록 합니다.</p>
<pre><code>const mutation = useMutation({
  mutationFn: (newPost) =&gt;
    fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(newPost),
    }),
  onSuccess: () =&gt; {
    // posts 쿼리를 무효화하여 목록 새로고침
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
});

// 사용
mutation.mutate({ title: '새 포스트', content: '...' });</code></pre>

<h2 id="infinite-scroll">무한 스크롤</h2>
<p><code>useInfiniteQuery</code>를 활용하면 복잡한 무한 스크롤을 간결하게 구현할 수 있습니다.</p>
<pre><code>const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam = 1 }) =&gt; fetchPage(pageParam),
  getNextPageParam: (lastPage) =&gt; lastPage.nextPage ?? undefined,
});</code></pre>
<p>각 페이지의 데이터는 <code>data.pages</code> 배열에 순서대로 쌓입니다. <code>hasNextPage</code>로 다음 페이지 존재 여부를 확인하고, <code>fetchNextPage()</code>로 다음 페이지를 로드합니다.</p>

<h2 id="summary">마무리</h2>
<p>React Query는 서버 상태 관리의 복잡성을 크게 줄여주는 강력한 도구입니다. 핵심 개념을 정리하면 다음과 같습니다:</p>
<ul>
  <li><strong>useQuery</strong>: 데이터 조회 및 캐싱</li>
  <li><strong>useMutation</strong>: 데이터 변경</li>
  <li><strong>useInfiniteQuery</strong>: 무한 스크롤</li>
  <li><strong>staleTime / gcTime</strong>: 캐싱 전략 제어</li>
</ul>
<blockquote>
  <p>서버 상태는 React Query로, 클라이언트 UI 상태는 Zustand나 Context로 관리하는 것이 현재 가장 권장되는 패턴입니다.</p>
</blockquote>
`;

const p2content = `
<h2 id="intro">들어가며</h2>
<p>Vite는 네이티브 ES 모듈을 활용한 차세대 프론트엔드 빌드 도구입니다. Webpack 대비 월등히 빠른 개발 서버 구동과 HMR(Hot Module Replacement)을 제공합니다. 이 글에서는 Vite + TypeScript 환경을 처음부터 구성하고, 실무에 바로 적용할 수 있는 ESLint 및 경로 별칭 설정까지 한 번에 다룹니다.</p>

<h2 id="create-project">프로젝트 생성</h2>
<p>다음 명령으로 Vite + TypeScript 템플릿을 생성합니다.</p>
<pre><code>npm create vite@latest my-app -- --template react-ts
cd my-app
npm install</code></pre>
<p>생성된 디렉토리 구조는 다음과 같습니다:</p>
<pre><code>my-app/
├── public/
├── src/
│   ├── assets/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts</code></pre>

<h2 id="tsconfig">TypeScript 설정</h2>
<p><code>tsconfig.json</code>에서 엄격 모드와 경로 별칭을 설정합니다.</p>
<pre><code>{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"]
    }
  },
  "include": ["src"]
}</code></pre>

<h3 id="path-alias-vite">Vite에 경로 별칭 등록</h3>
<p><code>tsconfig.json</code>의 <code>paths</code>는 TypeScript에만 적용됩니다. Vite 번들러에도 동일한 별칭을 등록해야 합니다.</p>
<pre><code>// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
    },
  },
});</code></pre>
<p><code>path</code> 모듈 사용을 위해 타입 패키지도 설치합니다.</p>
<pre><code>npm install -D @types/node</code></pre>

<h2 id="eslint">ESLint 설정</h2>
<p>Vite 기본 템플릿에는 ESLint가 포함되어 있습니다. <code>eslint.config.js</code>를 열어 규칙을 강화합니다.</p>
<pre><code>import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
    },
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);</code></pre>

<h2 id="summary">마무리</h2>
<p>여기까지 Vite + TypeScript 개발 환경의 핵심 설정을 완료했습니다. 정리하면:</p>
<ul>
  <li><strong>tsconfig.json</strong>: strict 모드 + paths 별칭</li>
  <li><strong>vite.config.ts</strong>: resolve.alias로 번들러 경로 매핑</li>
  <li><strong>ESLint</strong>: TypeScript 엄격 규칙 + React Hooks 검사</li>
</ul>
<blockquote>
  <p>경로 별칭은 <code>tsconfig.json</code>과 <code>vite.config.ts</code> 양쪽 모두 등록해야 합니다. 한 쪽만 설정하면 IDE 또는 빌드 중 오류가 발생합니다.</p>
</blockquote>
`;

const p3content = `
<h2 id="intro">들어가며</h2>
<p>MySQL에서 쿼리 성능 문제의 대부분은 인덱스 설계에서 비롯됩니다. <code>EXPLAIN</code>을 실행했을 때 <code>type: ALL</code>(풀 테이블 스캔)이 보인다면 인덱스 최적화가 필요한 신호입니다. 이 글에서는 인덱스의 작동 원리부터 복합 인덱스, 커버링 인덱스까지 실전 예제로 정리합니다.</p>

<h2 id="how-index-works">인덱스 작동 원리</h2>
<p>MySQL InnoDB의 인덱스는 <strong>B-Tree</strong> 자료구조로 구현됩니다. 인덱스 노드를 따라 탐색하면 O(log N) 시간에 원하는 행을 찾을 수 있습니다.</p>
<ul>
  <li><strong>클러스터드 인덱스</strong>: PK 기준으로 실제 데이터가 정렬 저장됨 (테이블당 1개)</li>
  <li><strong>세컨더리 인덱스</strong>: 지정 컬럼 기준 B-Tree, 리프 노드에 PK 값 저장</li>
</ul>

<h2 id="explain">EXPLAIN으로 실행 계획 보기</h2>
<p>쿼리 앞에 <code>EXPLAIN</code>을 붙이면 MySQL이 실행 계획을 반환합니다.</p>
<pre><code>EXPLAIN SELECT * FROM orders WHERE user_id = 42;</code></pre>
<p>주요 컬럼:</p>
<ul>
  <li><code>type</code>: ALL(풀스캔) → index → range → ref → eq_ref → const 순으로 성능 좋음</li>
  <li><code>key</code>: 실제 사용된 인덱스 이름</li>
  <li><code>rows</code>: 예상 검사 행 수 (적을수록 좋음)</li>
  <li><code>Extra</code>: Using index(커버링), Using filesort(정렬 주의) 등</li>
</ul>

<h2 id="composite-index">복합 인덱스</h2>
<p>두 개 이상의 컬럼으로 구성된 인덱스입니다. <strong>왼쪽 접두사 규칙(Leftmost Prefix Rule)</strong>을 반드시 이해해야 합니다.</p>
<pre><code>-- (user_id, created_at) 복합 인덱스 생성
CREATE INDEX idx_user_created ON orders(user_id, created_at);

-- ✅ 인덱스 사용 (왼쪽 컬럼부터 사용)
SELECT * FROM orders WHERE user_id = 42 AND created_at &gt; '2026-01-01';

-- ✅ 인덱스 부분 사용 (user_id만)
SELECT * FROM orders WHERE user_id = 42;

-- ❌ 인덱스 미사용 (첫 번째 컬럼 누락)
SELECT * FROM orders WHERE created_at &gt; '2026-01-01';</code></pre>

<h3 id="cardinality">카디널리티 고려</h3>
<p>복합 인덱스 컬럼 순서는 <strong>카디널리티(중복도)가 높은 컬럼을 앞에</strong> 배치하는 것이 기본 원칙입니다. 단, WHERE 절 사용 빈도도 함께 고려해야 합니다.</p>

<h2 id="covering-index">커버링 인덱스</h2>
<p>쿼리에서 필요한 모든 컬럼이 인덱스에 포함되어 있으면, 실제 데이터 행에 접근하지 않고 인덱스만으로 결과를 반환합니다. <code>EXPLAIN</code>의 <code>Extra</code>에 <code>Using index</code>가 표시됩니다.</p>
<pre><code>-- title, created_at 컬럼만 조회 → 커버링 인덱스 가능
CREATE INDEX idx_covering ON posts(user_id, title, created_at);

SELECT title, created_at FROM posts WHERE user_id = 1;</code></pre>

<h2 id="summary">마무리</h2>
<p>인덱스 최적화의 핵심을 정리합니다:</p>
<ul>
  <li>항상 <code>EXPLAIN</code>으로 실행 계획을 먼저 확인</li>
  <li>복합 인덱스는 왼쪽 접두사 규칙 준수</li>
  <li>카디널리티 높은 컬럼을 앞으로</li>
  <li>자주 조회하는 컬럼 조합은 커버링 인덱스 검토</li>
</ul>
<blockquote>
  <p>인덱스가 많다고 좋은 것이 아닙니다. INSERT/UPDATE/DELETE 시 인덱스도 함께 갱신되므로 쓰기 성능이 저하됩니다. 꼭 필요한 인덱스만 유지하세요.</p>
</blockquote>
`;

const p7content = `
<h2 id="intro">들어가며</h2>
<p>이진 탐색(Binary Search)은 <strong>정렬된 배열</strong>에서 탐색 범위를 절반씩 줄여가며 원하는 값을 찾는 알고리즘입니다. 시간 복잡도는 O(log N)으로, 선형 탐색 O(N)에 비해 데이터가 많을수록 압도적으로 빠릅니다.</p>

<h2 id="basic">기본 구현</h2>
<p>가장 기본적인 형태입니다. 배열에서 <code>target</code>의 인덱스를 반환하고, 없으면 <code>-1</code>을 반환합니다.</p>
<pre><code>function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left &lt;= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] &lt; target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}</code></pre>
<blockquote>
  <p><code>mid = (left + right) / 2</code>는 left, right가 매우 클 때 오버플로우가 발생할 수 있습니다. <code>left + Math.floor((right - left) / 2)</code>로 작성하는 것이 안전합니다.</p>
</blockquote>

<h2 id="lower-upper-bound">Lower Bound / Upper Bound</h2>
<p>실무와 알고리즘 문제에서 더 자주 쓰이는 패턴입니다.</p>

<h3 id="lower-bound">Lower Bound</h3>
<p><code>target</code> 이상인 값이 처음 등장하는 인덱스를 반환합니다.</p>
<pre><code>function lowerBound(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length;

  while (left &lt; right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] &lt; target) left = mid + 1;
    else right = mid;
  }

  return left;
}</code></pre>

<h3 id="upper-bound">Upper Bound</h3>
<p><code>target</code>을 초과하는 값이 처음 등장하는 인덱스를 반환합니다.</p>
<pre><code>function upperBound(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length;

  while (left &lt; right) {
    const mid = left + Math.floor((right - left) / 2);
    if (arr[mid] &lt;= target) left = mid + 1;
    else right = mid;
  }

  return left;
}</code></pre>
<p>두 함수를 조합하면 <code>target</code>의 등장 횟수를 O(log N)에 구할 수 있습니다: <code>upperBound(arr, target) - lowerBound(arr, target)</code></p>

<h2 id="parametric-search">파라메트릭 서치</h2>
<p>이진 탐색의 강력한 응용입니다. <strong>"최솟값 중 조건을 만족하는 최댓값"</strong> 같은 최적화 문제를 이진 탐색으로 풀 수 있습니다.</p>
<p>핵심 아이디어: 답이 될 수 있는 범위에 이진 탐색을 적용하고, <strong>조건 함수(predicate)가 true/false로 단조 증가</strong>하면 적용 가능합니다.</p>
<pre><code>// 예시: 공유기 설치 (최소 거리의 최댓값)
function canInstall(houses: number[], n: number, minDist: number): boolean {
  let count = 1;
  let last = houses[0];

  for (const house of houses) {
    if (house - last &gt;= minDist) {
      count++;
      last = house;
    }
  }

  return count &gt;= n;
}

function solve(houses: number[], n: number): number {
  houses.sort((a, b) =&gt; a - b);
  let left = 1;
  let right = houses[houses.length - 1] - houses[0];
  let answer = 0;

  while (left &lt;= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (canInstall(houses, n, mid)) {
      answer = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return answer;
}</code></pre>

<h2 id="summary">마무리</h2>
<p>이진 탐색 유형 정리:</p>
<ul>
  <li><strong>기본형</strong>: 정렬된 배열에서 값의 인덱스 탐색</li>
  <li><strong>Lower/Upper Bound</strong>: 범위 내 개수, 중복 원소 처리</li>
  <li><strong>파라메트릭 서치</strong>: 최적화 문제를 결정 문제로 변환</li>
</ul>
<blockquote>
  <p>이진 탐색이 적용 가능한지 판단하는 기준은 <strong>"탐색 범위가 단조 증가/감소하는가"</strong>입니다. 이 조건이 성립하면 거의 항상 이진 탐색을 적용할 수 있습니다.</p>
</blockquote>
`;

import { calcReadingTime } from "@/utils/calcReadingTime";

const p1excerpt =
  "React Query를 활용해 복잡한 서버 상태를 간결하게 관리하는 방법을 알아봅니다. 캐싱, 동기화, 무한 스크롤까지 실전 예제로 정리했습니다.";
const p2excerpt =
  "빠른 빌드 도구 Vite로 TypeScript 프로젝트를 처음부터 구성하는 방법을 정리했습니다. ESLint, 경로 별칭 설정까지 한 번에 다룹니다.";
const p3excerpt =
  "쿼리 성능을 극적으로 개선하는 인덱스 설계 원칙과 실전 예제를 다룹니다. 복합 인덱스, 커버링 인덱스 등 핵심 개념을 정리했습니다.";
const p4excerpt =
  "CSS Grid 레이아웃의 모든 속성을 실전 예제와 함께 정리했습니다. 복잡한 레이아웃도 Grid로 간결하게 구현하는 방법을 알아봅니다.";
const p5excerpt =
  "타입스크립트 제네릭의 개념부터 고급 활용법까지 정리했습니다. 재사용 가능한 타입 설계로 더 안전한 코드를 작성하세요.";
const p6excerpt =
  "React Hook Form을 활용해 성능 최적화된 폼을 만드는 방법을 다룹니다. 유효성 검사, 에러 처리, 중첩 폼까지 실전 예제로 정리했습니다.";
const p7excerpt =
  "이진 탐색의 개념부터 변형 문제까지 체계적으로 정리했습니다. Lower/Upper Bound, 파라메트릭 서치 등 고급 기법도 다룹니다.";
const p8excerpt =
  "HTTP 요청/응답 사이클, HTTPS의 TLS 핸드셰이크 과정을 단계별로 설명합니다. 웹 개발자라면 반드시 알아야 할 네트워크 지식을 정리했습니다.";
const p9excerpt =
  "운영체제의 핵심 개념인 프로세스와 스레드의 차이를 깊이 있게 다룹니다. 컨텍스트 스위칭, 동기화 문제까지 정리했습니다.";
const p10excerpt =
  "React 최적화 훅인 useCallback과 useMemo의 올바른 사용 시점을 분석합니다. 남용의 함정과 실제 성능 측정 방법을 함께 다룹니다.";
const p11excerpt =
  "6개월간 Tailwind CSS를 실무에 도입하며 느낀 장단점을 솔직하게 정리했습니다. 컨벤션 설정, 유지보수 경험을 공유합니다.";
const p12excerpt =
  "Node.js의 핵심인 이벤트 루프 동작 방식을 단계별로 해부합니다. libuv, 마이크로태스크, 매크로태스크의 실행 순서를 예제로 정리했습니다.";
const p13excerpt =
  "협업에서 자주 혼동되는 rebase와 merge의 차이를 실제 시나리오로 설명합니다. 각 방식의 장단점과 권장 사용 상황을 정리했습니다.";
const p14excerpt =
  "스택과 큐의 개념부터 실전 알고리즘 문제 적용까지 정리했습니다. 단조 스택, 원형 큐 등 고급 변형도 함께 다룹니다.";
const p15excerpt =
  "TCP/IP 프로토콜 스택을 계층별로 깊이 있게 분석합니다. 각 계층의 역할과 주요 프로토콜, 실제 패킷 흐름을 함께 이해합니다.";
const p16excerpt =
  "Redux, Zustand, Jotai, Recoil을 실제 프로젝트 기준으로 비교 분석했습니다. 각 라이브러리의 철학과 사용 시나리오를 정리했습니다.";
const p17excerpt =
  "CSS 애니메이션에서 발생하는 리페인트와 리플로우를 줄이는 기법을 다룹니다. transform, will-change, GPU 가속을 활용하는 방법을 정리했습니다.";
const p18excerpt =
  "INNER, LEFT, RIGHT, FULL OUTER JOIN의 차이를 명확하게 설명합니다. 실전 쿼리 예제와 성능 비교까지 함께 다룹니다.";
const p19excerpt =
  "실무에서 바로 적용할 수 있는 REST API 설계 원칙을 정리했습니다. 리소스 네이밍, 상태 코드, 버전 관리까지 포괄적으로 다룹니다.";
const p20excerpt =
  "Compound, Render Props, HOC, Custom Hook 등 React에서 자주 쓰이는 컴포넌트 패턴을 예제 코드와 함께 정리했습니다.";

export const dummyPosts: Post[] = [
  {
    id: 1,
    title: "React Query로 서버 상태 관리하기",
    excerpt: p1excerpt,
    tag: "React",
    tags: ["React", "TypeScript", "React Query"],
    date: "2026-02-20",
    readingTime: calcReadingTime(p1excerpt),
    slug: "react-query-server-state",
    category: "frontend/react",
    content: p1content,
  },
  {
    id: 2,
    title: "Vite + TypeScript 개발 환경 세팅",
    excerpt: p2excerpt,
    tag: "DevOps",
    tags: ["Vite", "TypeScript", "환경설정"],
    date: "2026-02-10",
    readingTime: calcReadingTime(p2excerpt),
    slug: "vite-typescript-setup",
    category: "frontend/web",
    content: p2content,
  },
  {
    id: 3,
    title: "MySQL 인덱스 최적화 전략",
    excerpt: p3excerpt,
    tag: "Database",
    tags: ["MySQL", "Database", "최적화"],
    date: "2026-01-28",
    readingTime: calcReadingTime(p3excerpt),
    slug: "mysql-index-optimization",
    category: "database",
    content: p3content,
  },
];

export const allDummyPosts: Post[] = [
  {
    id: 1,
    title: "React Query로 서버 상태 관리하기",
    excerpt: p1excerpt,
    tag: "React",
    tags: ["React", "TypeScript", "React Query"],
    date: "2026-02-20",
    readingTime: calcReadingTime(p1excerpt),
    slug: "react-query-server-state",
    category: "frontend/react",
    content: p1content,
  },
  {
    id: 2,
    title: "Vite + TypeScript 개발 환경 세팅",
    excerpt: p2excerpt,
    tag: "환경설정",
    tags: ["Vite", "TypeScript", "환경설정"],
    date: "2026-02-10",
    readingTime: calcReadingTime(p2excerpt),
    slug: "vite-typescript-setup",
    category: "frontend/web",
    content: p2content,
  },
  {
    id: 3,
    title: "MySQL 인덱스 최적화 전략",
    excerpt: p3excerpt,
    tag: "Database",
    tags: ["MySQL", "Database", "최적화"],
    date: "2026-01-28",
    readingTime: calcReadingTime(p3excerpt),
    slug: "mysql-index-optimization",
    category: "database",
    content: p3content,
  },
  {
    id: 4,
    title: "CSS Grid 완벽 가이드",
    excerpt: p4excerpt,
    tag: "CSS",
    tags: ["CSS", "Grid", "레이아웃"],
    date: "2026-01-20",
    readingTime: calcReadingTime(p4excerpt),
    slug: "css-grid-guide",
    category: "frontend/web",
  },
  {
    id: 5,
    title: "TypeScript 제네릭 완벽 정리",
    excerpt: p5excerpt,
    tag: "TypeScript",
    tags: ["TypeScript", "제네릭", "타입"],
    date: "2026-01-15",
    readingTime: calcReadingTime(p5excerpt),
    slug: "typescript-generics",
    category: "frontend/web",
  },
  {
    id: 6,
    title: "React Hook Form으로 폼 관리하기",
    excerpt: p6excerpt,
    tag: "React",
    tags: ["React", "Form", "유효성 검사"],
    date: "2026-01-10",
    readingTime: calcReadingTime(p6excerpt),
    slug: "react-hook-form",
    category: "frontend/react",
  },
  {
    id: 7,
    title: "이진 탐색 알고리즘 완벽 정리",
    excerpt: p7excerpt,
    tag: "Algorithm",
    tags: ["Algorithm", "이진탐색", "CS"],
    date: "2025-12-28",
    readingTime: calcReadingTime(p7excerpt),
    slug: "binary-search",
    category: "cs",
    content: p7content,
  },
  {
    id: 8,
    title: "HTTP/HTTPS 동작 원리 깊게 이해하기",
    excerpt: p8excerpt,
    tag: "Network",
    tags: ["HTTP", "HTTPS", "Network"],
    date: "2025-12-20",
    readingTime: calcReadingTime(p8excerpt),
    slug: "http-https-deep-dive",
    category: "cs",
  },
  {
    id: 9,
    title: "프로세스 vs 스레드, 완벽 정리",
    excerpt: p9excerpt,
    tag: "OS",
    tags: ["OS", "프로세스", "스레드"],
    date: "2025-12-15",
    readingTime: calcReadingTime(p9excerpt),
    slug: "process-vs-thread",
    category: "cs",
  },
  {
    id: 10,
    title: "useCallback, useMemo 언제 써야 할까",
    excerpt: p10excerpt,
    tag: "React",
    tags: ["React", "최적화", "Hooks"],
    date: "2025-12-10",
    readingTime: calcReadingTime(p10excerpt),
    slug: "usecallback-usememo",
    category: "frontend/react",
  },
  {
    id: 11,
    title: "Tailwind CSS 실무 도입 후기",
    excerpt: p11excerpt,
    tag: "CSS",
    tags: ["Tailwind", "CSS", "실무"],
    date: "2025-12-05",
    readingTime: calcReadingTime(p11excerpt),
    slug: "tailwind-css-review",
    category: "frontend/web",
  },
  {
    id: 12,
    title: "Node.js 이벤트 루프 완벽 이해",
    excerpt: p12excerpt,
    tag: "Node.js",
    tags: ["Node.js", "이벤트루프", "JavaScript"],
    date: "2025-11-28",
    readingTime: calcReadingTime(p12excerpt),
    slug: "nodejs-event-loop",
    category: "cs",
  },
  {
    id: 13,
    title: "Git rebase vs merge, 언제 무엇을 써야 할까",
    excerpt: p13excerpt,
    tag: "Git",
    tags: ["Git", "rebase", "merge"],
    date: "2025-11-20",
    readingTime: calcReadingTime(p13excerpt),
    slug: "git-rebase-vs-merge",
    category: "frontend/web",
  },
  {
    id: 14,
    title: "자료구조: 스택과 큐 활용 패턴",
    excerpt: p14excerpt,
    tag: "Algorithm",
    tags: ["자료구조", "스택", "큐"],
    date: "2025-11-15",
    readingTime: calcReadingTime(p14excerpt),
    slug: "stack-queue-patterns",
    category: "cs",
  },
  {
    id: 15,
    title: "TCP/IP 4계층 모델 완벽 정리",
    excerpt: p15excerpt,
    tag: "Network",
    tags: ["TCP/IP", "Network", "CS"],
    date: "2025-11-08",
    readingTime: calcReadingTime(p15excerpt),
    slug: "tcp-ip-layers",
    category: "cs",
  },
  {
    id: 16,
    title: "React 상태 관리 라이브러리 비교 분석",
    excerpt: p16excerpt,
    tag: "React",
    tags: ["React", "상태관리", "Redux", "Zustand"],
    date: "2025-11-01",
    readingTime: calcReadingTime(p16excerpt),
    slug: "react-state-management",
    category: "frontend/react",
  },
  {
    id: 17,
    title: "CSS 애니메이션 성능 최적화",
    excerpt: p17excerpt,
    tag: "CSS",
    tags: ["CSS", "애니메이션", "성능"],
    date: "2025-10-25",
    readingTime: calcReadingTime(p17excerpt),
    slug: "css-animation-performance",
    category: "frontend/web",
  },
  {
    id: 18,
    title: "MySQL JOIN 종류와 활용법 총정리",
    excerpt: p18excerpt,
    tag: "Database",
    tags: ["MySQL", "JOIN", "SQL"],
    date: "2025-10-18",
    readingTime: calcReadingTime(p18excerpt),
    slug: "mysql-joins",
    category: "database",
  },
  {
    id: 19,
    title: "RESTful API 설계 원칙과 Best Practice",
    excerpt: p19excerpt,
    tag: "Backend",
    tags: ["REST", "API", "Backend"],
    date: "2025-10-10",
    readingTime: calcReadingTime(p19excerpt),
    slug: "restful-api-design",
    category: "database",
  },
  {
    id: 20,
    title: "React 컴포넌트 설계 패턴 모음",
    excerpt: p20excerpt,
    tag: "React",
    tags: ["React", "패턴", "컴포넌트"],
    date: "2025-10-05",
    readingTime: calcReadingTime(p20excerpt),
    slug: "react-component-patterns",
    category: "frontend/react",
  },
];

export const postCategories: PostCategory[] = [
  {
    name: "전체 보기",
    slug: "all",
    count: 20,
  },
  {
    name: "프론트엔드",
    slug: "frontend",
    count: 13,
    children: [
      { name: "웹", slug: "frontend/web", count: 6 },
      { name: "React", slug: "frontend/react", count: 7 },
    ],
  },
  {
    name: "CS지식",
    slug: "cs",
    count: 5,
  },
  {
    name: "데이터베이스",
    slug: "database",
    count: 3,
  },
];

export const techCategories: TechCategory[] = [
  {
    category: "Frontend",
    items: [
      { name: "React" },
      { name: "TypeScript" },
      { name: "Vite" },
      { name: "CSS3" },
    ],
  },
  {
    category: "Backend",
    items: [{ name: "Node.js" }, { name: "Express" }, { name: "MySQL" }],
  },
  {
    category: "Tools",
    items: [{ name: "Git" }, { name: "GitHub" }, { name: "ESLint" }],
  },
];
