# Project: [BLOG]

## Language Rules

- 모든 결과값과 설명은 반드시 한글로 작성한다.

## Overview

동영상, 사진, 글작성 업로드가 가능한 개발 블로그

## Tech Stack

- Language: [TypeScript, javascript]
- Framework: [React]
- Database: [MySQL]

## Architecture

- Presentational/Container 패턴으로 기능/화면으로 관심사 분리 (단, 폴더에 index.ts 배럴 파일을 만들지 않는다. 컴포넌트는 파일 경로로 직접 import한다)
- 화면(View) 컴포넌트는 useState/useEffect를 직접 사용하지 않는다. (단, 드롭다운 열림/닫힘처럼 순수 UI 상태는 해당 컴포넌트가 직접 관리한다.)
- 페이지 View의 복잡도가 올라가 하위 컴포넌트가 필요할 경우, 해당 페이지 경로에 component/ 폴더를 만들어 관리한다.

## CSS Styles

- 태그의 스타일 적용 방식은 다음과 같이 className으로 적용한다. <div className="social-link">
- CSS는 mobile-first 반응형으로 설계한다. 기본 스타일은 모바일 기준으로 작성하고, 미디어 쿼리로 상위 breakpoint를 재정의한다.
  - 모바일: 기본 스타일 (미디어 쿼리 없음)
  - 태블릿: @media (min-width: 768px)
  - 데스크톱: @media (min-width: 1024px)
- css는 컴포넌트/페이지 단위로 styles/ 폴더에 단일 파일로 관리한다 (pc/mobile 분리 없음).
- css import는 main.tsx에서 import.meta.glob("./styles/\*.css", { eager: true });를 사용하여 모든 css를 들고온다.

## Project Structure

```
src/
├── api/           # React Query문 모음
├── components/    # 공통 컴포넌트(Header, Footer)
├── pages/         # 페이지
├── contexts/      # 전역 컨텍스트
├── styles/        # 컴포넌트/페이지별 CSS (mobile-first, 단일 파일)
├── data/          # 페이지 라우트 데이터
├── dummydata/     # 디자인 구현용 더미용 데이터
├── constants/     # 에러코드 또는 에러 메세지 모음
├── types/         # 타입스크립트 정의
└── utils/         # 유틸리티 함수 (범용 함수 및 도메인별 변환 함수(mapper) 포함)
```

## Utils 규칙

- 여러 페이지에서 공통으로 쓰이는 데이터 변환 로직은
  페이지마다 중복 정의하지 않고 `src/utils/`에 추출한다.
- 도메인에 종속된 변환 함수는 `postMapper.ts`처럼
  `{도메인}Mapper.ts` 네이밍으로 관리한다.

## 더미 데이터 관리 규칙

- `src/dummydata/`의 더미 데이터는 디자인/UI 구현 단계에서만 사용하는 임시 데이터다.
- API가 완성되어 프론트엔드에서 React Query로 실제 데이터를 연동하면, 해당 기능에 쓰인 더미 데이터는 즉시 삭제한다.
- 더미 데이터를 API 데이터로 교체할 때 더미 import도 함께 제거한다. 더미 데이터와 실제 API 호출이 동시에 공존하는 상태를 남겨두지 않는다.

## TypeScript 규칙

- 타입은 반드시 `src/types/`에서 정의하고 관리한다. API 함수 파일(`src/api/`)에 타입을 정의하지 않는다.
- 타입을 이동하거나 경로를 변경할 때, 기존 import를 유지하기 위한 re-export(`export type { Foo }`)를 사용하지 않는다. 참조하는 모든 파일의 import 경로를 직접 수정한다.
- 서버 응답 엔티티 타입(API 응답 형태 그대로인 타입)도 `src/types/`에서 정의한다. API 함수 파일(`src/api/`)에 정의하지 않는다.

## Utils 규칙

- 여러 페이지에서 공통으로 쓰이는 데이터 변환 로직은 페이지마다 중복 정의하지 않고 `src/utils/`에 추출한다.
- 도메인에 종속된 변환 함수는 `postMapper.ts`처럼 `{도메인}Mapper.ts` 네이밍으로 관리한다.

## Reference (Project Structure 추가설명)

- App.tsx의 구조는 reference 폴더의 App.tsx의 코드를 참고한다.
- 페이지 라우트 데이터 폴더에 들어갈 코드는 reference 폴더의 PageRoutes.tsx의 코드를 참고한다.
- createChildRoutes 함수는 reference 폴더의 createChildRoutes.tsx의 코드를 참고한다.
