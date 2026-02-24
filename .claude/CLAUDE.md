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

## CSS Styles

- 스타일은 PC버전 및 모바일 버전으로 나눈다.
- 태그의 스타일 적용 방식은 다음과 같이 className으로 적용한다. <div className="social-link">
- CSS은 반응형으로 설계하며, 모바일은 767px이하, 태블릿은 768px ~ 1023px, 데스크톱은 1024px을 기준으로 한다.
- css import는 main.tsx에서 import.meta.glob("./styles/\*_/_.css", { eager: true });를 사용하여 모든 css를 들고온다.

## Project Structure

```
src/
├── api/           # React Query문 모음
├── components/    # 공통 컴포넌트(Header, Footer)
├── pages/         # 페이지
├── contexts/      # 전역 컨텍스트
├── styles/
│   ├── mobile/    # 모바일 전용 스타일
│   └── pc/        # PC 전용 스타일
├── data/          # 페이지 라우트 데이터
├── dummydata/     # 디자인 구현용 더미용 데이터
├── constants/     # 에러코드 또는 에러 메세지 모음
├── types/         # 타입스크립트 정의
└── utils/         # 유틸리티 함수
```

## Reference (Project Structure 추가설명)

- App.tsx의 구조는 reference 폴더의 App.tsx의 코드를 참고한다.
- 페이지 라우트 데이터 폴더에 들어갈 코드는 reference 폴더의 PageRoutes.tsx의 코드를 참고한다.
- createChildRoutes 함수는 reference 폴더의 createChildRoutes.tsx의 코드를 참고한다.
