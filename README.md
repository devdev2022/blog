# 개인 블로그
https://devnote.blog

## 설명
글, 이미지, 동영상, 코드 블록을 자유롭게 작성할 수 있는 개인 블로그 입니다. 

## 제작 목적
CRUD, 미디어 업로드, 인증, 실시간 알림 등 웹 서비스의 핵심 기능을 직접 설계하고, 배포·파이프라인까지 
<br/> 직접 구현하며 프론트엔드 전반의 기술을 다지기 위해 만든 프로젝트입니다.    

## 주요기능

 | 기능 | 설명 |
  |------|------|
  | **리치 에디터** | Tiptap 기반 — 이미지/동영상 업로드, 코드 블록(구문 강조), 표, 폰트 크기·색상·정렬 등 커스텀 Extension 포함 |
  | **소셜 로그인** | OAuth 기반 로그인 |
  | **실시간 알림** | 댓글 알림 실시간으로 확인 |
  | **태그 & 피드** | 태그별 포스트 필터링, 피드 페이지 |
  | **GitHub 잔디** | react-github-calendar를 활용한 GitHub 활동 시각화 |

## 업데이트 내역

<details>
 <summary> ⚙️Version 업데이트 내역 보기</summary>

### v1.0.2 Release [latest] [26.05.04]
- virturalized List를 이용한 댓글 알림 리스트 렌더링 최적화 https://github.com/devdev2022/blog/issues/17

### v1.0.1 Release [26.05.01]
- CommentSection 컴포넌트 useCallback/memo 적용으로 답글 클릭 시 리렌더 최소화 https://github.com/devdev2022/blog/issues/13

---

</details>

<br/>

## 기술스택

Language: ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?&style=flat&logo=JavaScript&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg?&style=flat&logo=TypeScript&logoColor=white)
<br>
Frontend: 
![React](https://img.shields.io/badge/React-61DAFB.svg?&style=flat&logo=React&logoColor=white)
![React Query](https://img.shields.io/badge/React%20Query-FF4154.svg?&style=flat&logo=React%20query&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC.svg?&style=flat&logo=redux&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-9135FF?&style=flat&logo=vite&logoColor=white)
<br>
Backend:
![Node.js](https://img.shields.io/badge/Node.js-339933.svg?&style=flat&logo=Node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000.svg?&style=flat&logo=Express&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat&logo=Nginx&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Postgre%20SQL-4169E1.svg?&style=flat&logo=PostgreSQL&logoColor=white)
<br>
IaaS:
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=Supabase&logoColor=white)
![Cloudflare R2](https://img.shields.io/badge/cloudflare%20R2-F38020?style=flat&logo=cloudflare%20workers&logoColor=white)
![Vultr](https://img.shields.io/badge/vultr-007BFC?style=flat&logo=vultr&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
<br>
Devops:
![Docker](https://img.shields.io/badge/docker-2496ED.svg?style=flat&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-2088FF.svg?style=flat&logo=githubactions&logoColor=white)

<br/>

### 아키텍처
클라이언트는 Vercel CDN을 통해 React SPA를 서빙받고, API 요청은 Vultr VPS의 Express 서버로 전달됩니다.                                    
이미지·동영상은 Cloudflare R2에 저장되며, 데이터는 Supabase(PostgreSQL)에서 관리합니다. <br/><br/>
<img width="1173" height="1037" alt="Image" src="https://github.com/user-attachments/assets/21d07649-f019-4a9b-9886-798ad1c01a25" />
<br/><br/><br/>

### 시퀀스 다이어그램 (포스트 저장)
포스트 작성 시 동영상 또는 이미지 첨부를 할 경우, 업로드부터 DB반영까지 처리되는 과정입니다. 

<img width="987" height="2389" alt="Image" src="https://github.com/user-attachments/assets/8e01083d-9caf-4108-9df4-8a07a19ac0a2" />

<br/><br/><br/>

### CICD 파이프라인 (Blue-Green 무중단 배포)
GitHub Actions를 통해 브랜치별로 자동 배포됩니다.                                    
프로덕션 환경은 **Blue-Green**(두 컨테이너를 교대 운영하여 다운타임 없이 전환)으로 무중단 배포를 수행합니다.    
  
<img width="1221" height="1121" alt="Image" src="https://github.com/user-attachments/assets/d8f97722-d2bb-4161-95e3-68c1023da68a" />
