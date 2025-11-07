# AI Caffeine Advisor Mockup - 프로젝트 문서

## 프로젝트 개요

**프로젝트명**: AI Caffeine Advisor Mockup  
**버전**: 0.1.0  
**설명**: AI 기반 카페인 섭취 관리 및 추천 시스템 목업  
**원본 디자인**: https://www.figma.com/design/9GJUuR2VPpldSuEcWdBxGK/AI-Caffeine-Advisor-Mockup

---

## 프로젝트 구조

```
AI Caffeine Advisor Mockup/
├── .git/                           # Git 저장소
├── .gitignore                      # Git 무시 파일 설정
├── node_modules/                   # npm 패키지 의존성
├── src/                            # 소스 코드
│   ├── components/                 # React 컴포넌트
│   │   ├── ui/                     # shadcn/ui 기반 UI 컴포넌트 (48개)
│   │   ├── figma/                  # Figma 관련 컴포넌트
│   │   ├── AIChatbotScreen.tsx     # AI 챗봇 화면
│   │   ├── BottomNavigation.tsx    # 하단 네비게이션
│   │   ├── CaffeineAlert.tsx       # 카페인 알림
│   │   ├── CaffeineHalfLifeCurve.tsx # 카페인 반감기 그래프
│   │   ├── CaffeineStatusBar.tsx   # 카페인 상태 바
│   │   ├── ChallengeScreen.tsx     # 챌린지 화면
│   │   ├── ChatScreen.tsx          # 채팅 화면
│   │   ├── DashboardScreen.tsx     # 대시보드 화면
│   │   ├── FriendsScreen.tsx       # 친구 목록 화면
│   │   ├── OnboardingScreen.tsx    # 온보딩 화면
│   │   ├── ProfileScreen.tsx       # 프로필 화면
│   │   ├── RecommendationScreen.tsx # 추천 화면
│   │   └── TrackingScreen.tsx      # 트래킹 화면
│   ├── contexts/                   # React Context
│   │   └── CaffeineContext.tsx     # 카페인 데이터 관리 Context
│   ├── guidelines/                 # 개발 가이드라인
│   │   └── Guidelines.md           # 시스템 가이드라인
│   ├── styles/                     # 스타일 파일
│   │   └── globals.css             # 전역 CSS
│   ├── App.tsx                     # 메인 앱 컴포넌트
│   ├── main.tsx                    # 앱 진입점
│   ├── index.css                   # 메인 CSS
│   └── Attributions.md             # 라이선스 및 출처
├── index.html                      # HTML 엔트리 파일
├── package.json                    # npm 패키지 설정
├── package-lock.json               # npm 의존성 잠금 파일
├── vite.config.ts                  # Vite 설정
├── server.js                       # 서버 파일 (개발 중)
├── README.md                       # 프로젝트 README
└── AIconfierm.md                   # 이 문서

```

---

## 기술 스택

### 프레임워크 & 라이브러리
- **React 18.3.1**: UI 프레임워크
- **TypeScript**: 타입 안전성
- **Vite 6.3.5**: 빌드 도구 및 개발 서버
- **TailwindCSS**: 유틸리티 기반 CSS 프레임워크

### UI 컴포넌트
- **shadcn/ui**: Radix UI 기반 컴포넌트 라이브러리
- **Radix UI**: 접근성 높은 UI 프리미티브
  - Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu
  - Hover Card, Label, Menubar, Navigation Menu, Popover, Progress
  - Radio Group, Scroll Area, Select, Separator, Slider, Switch
  - Tabs, Toggle, Tooltip 등
- **Lucide React 0.487.0**: 아이콘 라이브러리
- **Recharts 2.15.2**: 차트 라이브러리
- **Framer Motion (motion)**: 애니메이션 라이브러리

### 상태 관리 & 폼
- **React Context API**: 전역 상태 관리
- **React Hook Form 7.55.0**: 폼 관리
- **Sonner 2.0.3**: 토스트 알림

### 기타 라이브러리
- **next-themes 0.4.6**: 다크 모드 지원
- **react-day-picker 8.10.1**: 날짜 선택기
- **embla-carousel-react 8.6.0**: 캐러셀
- **cmdk 1.1.1**: 커맨드 메뉴
- **input-otp 1.4.2**: OTP 입력
- **vaul 1.1.2**: 드로어 컴포넌트
- **class-variance-authority**: CSS 클래스 관리
- **tailwind-merge**: Tailwind 클래스 병합
- **clsx**: 조건부 클래스 이름

---

## 주요 기능

### 1. 온보딩 시스템
- 사용자 첫 방문 시 온보딩 화면 표시
- 앱 소개 및 시작하기 기능

### 2. 카페인 트래킹
- 실시간 카페인 섭취량 추적
- 일일 권장량(400mg) 기준 모니터링
- 카페인 상태: Safe (0-100mg), Caution (100-300mg), High (300mg+)
- 자동 자정 리셋 기능
- LocalStorage 기반 데이터 저장

### 3. AI 챗봇
- 카페인 관련 질문 응답
- 개인화된 추천 제공

### 4. 대시보드
- 현재 카페인 섭취 상태 시각화
- 카페인 반감기 곡선 표시
- 빠른 액세스 기능

### 5. 소셜 기능
- 친구 목록 관리
- 1:1 채팅
- 카페인 챌린지

### 6. 프로필 관리
- 사용자 정보 관리
- 로그아웃 기능

### 7. 알림 시스템
- 카페인 섭취량 경고 (300mg 도달 시)
- 일일 권장량 초과 알림 (400mg 초과 시)
- 성공 토스트 (음료 추가 시)

---

## 화면 구성

### 1. OnboardingScreen
- 앱 소개 및 시작 화면
- "시작하기" 버튼으로 메인 앱 진입

### 2. DashboardScreen (Home)
- 카페인 상태 바
- 카페인 반감기 곡선
- 빠른 액세스 카드
- AI 챗봇, 트래킹, 친구, 챌린지 접근

### 3. AIChatbotScreen
- AI 기반 대화형 인터페이스
- 카페인 관련 질문 및 추천

### 4. TrackingScreen
- 카페인 섭취 기록
- 음료 추가 기능
- 섭취 이력 조회

### 5. FriendsScreen
- 친구 목록
- 친구 클릭 시 채팅 화면 이동

### 6. ChatScreen
- 1:1 채팅 인터페이스
- 친구와의 메시지 교환

### 7. ChallengeScreen
- 카페인 관련 챌린지
- 목표 설정 및 달성 추적

### 8. ProfileScreen
- 사용자 정보
- 설정
- 로그아웃

---

## Context API 구조

### CaffeineContext
**위치**: `src/contexts/CaffeineContext.tsx`

**제공 데이터**:
- `currentIntake`: 현재 카페인 섭취량 (mg)
- `dailyLimit`: 일일 권장량 (400mg)
- `entries`: 카페인 섭취 기록 배열
- `remainingCaffeine`: 남은 카페인 섭취 가능량
- `hasShownHighAlert`: 고카페인 알림 표시 여부

**제공 함수**:
- `addCaffeine(entry)`: 카페인 섭취 추가
- `getCaffeineStatus()`: 현재 카페인 상태 반환 (safe/caution/high)

**주요 로직**:
- LocalStorage 기반 데이터 영속성
- 자정 자동 리셋
- 카페인 레벨별 알림 트리거
- 일일 데이터 관리

---

## 네비게이션 구조

### BottomNavigation
**탭 구성**:
1. **Home** (홈): DashboardScreen
2. **AI Chat** (AI 챗봇): AIChatbotScreen
3. **Tracking** (트래킹): TrackingScreen
4. **Friends** (친구): FriendsScreen
5. **Profile** (프로필): ProfileScreen

**화면 전환**:
- `activeScreen` state로 현재 화면 관리
- `onNavigate` 함수로 화면 전환
- 조건부 렌더링으로 단일 페이지 앱 구현

---

## 개발 환경 설정

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```
- 포트: 3000
- 자동 브라우저 열기 활성화

### 빌드
```bash
npm run build
```
- 출력 디렉토리: `build/`
- 타겟: esnext

---

## Vite 설정

### 주요 설정 (vite.config.ts)
- **플러그인**: React SWC (빠른 빌드)
- **별칭**: `@` → `./src`
- **포트**: 3000
- **자동 브라우저 열기**: 활성화
- **패키지 별칭**: 버전별 패키지 매핑

---

## 스타일링

### TailwindCSS 설정
- 유틸리티 우선 CSS
- 커스텀 테마 (globals.css)
- 다크 모드 지원 (next-themes)
- shadcn/ui 컴포넌트 스타일

### CSS 파일
- `src/index.css`: 메인 CSS (74KB)
- `src/styles/globals.css`: 전역 스타일

---

## 데이터 모델

### CaffeineEntry
```typescript
interface CaffeineEntry {
  id: string;           // 고유 ID
  brand: string;        // 브랜드명
  drink: string;        // 음료명
  caffeine: number;     // 카페인 함량 (mg)
  timestamp: Date;      // 섭취 시간
}
```

### Friend
```typescript
interface Friend {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  // ... 기타 필드
}
```

---

## LocalStorage 키

- `caffeine_tracker_data`: 카페인 섭취 데이터
  ```json
  {
    "date": "날짜",
    "currentIntake": 0,
    "entries": []
  }
  ```
- `caffeine_alert_shown`: 알림 표시 여부
  ```json
  {
    "date": "날짜",
    "shown": false
  }
  ```

---

## 알림 시스템

### Toast 알림 (Sonner)
1. **성공 알림**: 음료 추가 시
   - 제목: "{음료명} 추가됨"
   - 설명: "+{카페인}mg 카페인"

2. **경고 알림**: 300mg 도달 시 (1회만)
   - 제목: "카페인 섭취 주의"
   - 설명: "일일 권장량에 근접했습니다."
   - 지속 시간: 5초

3. **오류 알림**: 400mg 초과 시
   - 제목: "일일 권장량 초과"
   - 설명: "카페인 일일 권장량(400mg)을 초과했습니다."
   - 지속 시간: 5초

---

## UI 컴포넌트 목록

### shadcn/ui 컴포넌트 (48개)
1. accordion.tsx
2. alert-dialog.tsx
3. alert.tsx
4. aspect-ratio.tsx
5. avatar.tsx
6. badge.tsx
7. breadcrumb.tsx
8. button.tsx
9. calendar.tsx
10. card.tsx
11. carousel.tsx
12. chart.tsx
13. checkbox.tsx
14. collapsible.tsx
15. command.tsx
16. context-menu.tsx
17. dialog.tsx
18. drawer.tsx
19. dropdown-menu.tsx
20. form.tsx
21. hover-card.tsx
22. input-otp.tsx
23. input.tsx
24. label.tsx
25. menubar.tsx
26. navigation-menu.tsx
27. pagination.tsx
28. popover.tsx
29. progress.tsx
30. radio-group.tsx
31. resizable.tsx
32. scroll-area.tsx
33. select.tsx
34. separator.tsx
35. sheet.tsx
36. sidebar.tsx
37. skeleton.tsx
38. slider.tsx
39. sonner.tsx
40. switch.tsx
41. table.tsx
42. tabs.tsx
43. textarea.tsx
44. toggle-group.tsx
45. toggle.tsx
46. tooltip.tsx
47. use-mobile.ts
48. utils.ts

### 커스텀 컴포넌트
- CaffeineAlert.tsx: 카페인 알림 컴포넌트
- CaffeineHalfLifeCurve.tsx: 반감기 곡선 차트
- CaffeineStatusBar.tsx: 카페인 상태 표시 바
- ImageWithFallback.tsx: 이미지 폴백 처리

---

## 라이선스 및 출처

### shadcn/ui
- 라이선스: MIT
- 출처: https://ui.shadcn.com/
- GitHub: https://github.com/shadcn-ui/ui

### Unsplash
- 라이선스: Unsplash License
- 출처: https://unsplash.com
- 라이선스 링크: https://unsplash.com/license

---

## Git 브랜치 구조

### 브랜치
- `main`: 메인 브랜치 (목업 코드)
- `sql`: SQL/데이터베이스 개발 브랜치

### 커밋 이력
- 초기 커밋: "11/07 목업" (모든 목업 파일)
- SQL 브랜치: "test" (서버 파일 추가)

---

## 개발 가이드라인

### 코드 스타일
- TypeScript 사용
- React Hooks 기반
- 함수형 컴포넌트
- Context API로 상태 관리

### 파일 구조
- 컴포넌트는 `src/components/`에 위치
- UI 컴포넌트는 `src/components/ui/`에 위치
- Context는 `src/contexts/`에 위치
- 스타일은 `src/styles/`에 위치

### 네이밍 컨벤션
- 컴포넌트: PascalCase (예: `DashboardScreen.tsx`)
- 함수: camelCase (예: `addCaffeine`)
- 상수: UPPER_SNAKE_CASE (예: `DAILY_LIMIT`)

---

## 향후 개발 계획

### 백엔드 통합
- `server.js` 개발 진행 중
- 데이터베이스 연동 (SQL 브랜치)
- API 엔드포인트 구현

### 추가 기능
- 실제 AI 챗봇 통합
- 음료 데이터베이스 확장
- 사용자 인증 시스템
- 친구 기능 실제 구현
- 챌린지 시스템 완성

---

## 문제 해결

### 일반적인 이슈
1. **카페인 데이터가 리셋되지 않음**
   - LocalStorage 확인
   - 브라우저 캐시 삭제

2. **알림이 표시되지 않음**
   - Toaster 컴포넌트 렌더링 확인
   - `hasShownHighAlert` 상태 확인

3. **화면 전환이 안됨**
   - `activeScreen` state 확인
   - 네비게이션 함수 호출 확인

---

## 연락처 및 기여

### Git 설정
- 사용자: ektlakwhgdk
- 이메일: ektlakwhgdk@gmmail.com

### 저장소
- 로컬 저장소: `c:\Users\ektla\Downloads\AI Caffeine Advisor Mockup`

---

## 참고 자료

- Figma 디자인: https://www.figma.com/design/9GJUuR2VPpldSuEcWdBxGK/AI-Caffeine-Advisor-Mockup
- shadcn/ui 문서: https://ui.shadcn.com/
- React 문서: https://react.dev/
- Vite 문서: https://vitejs.dev/
- TailwindCSS 문서: https://tailwindcss.com/

---

**마지막 업데이트**: 2025년 11월 7일  
**문서 버전**: 1.0.0
