# 리팩토링 문서

## 📋 개요
이 문서는 AI Caffeine Advisor Mockup 프로젝트의 리팩토링 내역을 설명합니다.

## 🎯 리팩토링 목표
1. **CSS 분리**: 인라인 스타일을 CSS 모듈로 분리
2. **타입 안전성**: TypeScript 타입 정의 강화
3. **코드 재사용성**: 공통 컴포넌트 및 유틸리티 생성
4. **폴더 구조 개선**: 기능별 명확한 분리

## 🔧 주요 변경사항

### 1. 폴더 구조 재정리
```
src/
├── components/
│   ├── common/          # 공통 컴포넌트
│   │   ├── BottomNavigation.tsx
│   │   └── StatusCard.tsx (NEW)
│   ├── ui/              # shadcn/ui 컴포넌트
│   └── figma/           # Figma 관련
├── features/            # 기능별 컴포넌트
│   ├── caffeine/
│   ├── ai-chatbot/
│   ├── tracking/
│   ├── social/
│   ├── challenge/
│   └── profile/
├── screens/             # 화면 컴포넌트
│   ├── OnboardingScreen.tsx
│   └── DashboardScreen.tsx
├── contexts/            # React Context
├── types/               # 타입 정의 (NEW)
│   └── index.ts
├── styles/              # 스타일 파일 (NEW)
│   └── screens.module.css
└── scripts/             # 유틸리티 스크립트 (NEW)
    ├── fix-imports.ts
    └── convert-to-alias.ts
```

### 2. 타입 시스템 개선

#### 중앙 집중식 타입 정의
**파일**: `src/types/index.ts`

```typescript
// 공통 타입
export type StatusType = "safe" | "caution" | "high";

// 인터페이스
export interface CaffeineEntry { ... }
export interface Friend { ... }
export interface Challenge { ... }
export interface Message { ... }
export interface UserProfile { ... }

// Props 타입
export interface ScreenProps { ... }
export interface DashboardScreenProps { ... }
export interface ChatScreenProps { ... }

// 유틸리티 타입
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
```

#### 타입 중복 제거
- `Friend` 인터페이스: FriendsScreen에서 중복 정의 제거
- `CaffeineEntry`: CaffeineContext에서 중복 정의 제거
- 모든 컴포넌트에서 `@/types`에서 import

### 3. CSS 모듈 분리

#### 공통 스타일 클래스
**파일**: `src/styles/screens.module.css`

```css
/* 레이아웃 */
.screenContainer { ... }
.stickyHeader { ... }

/* 카드 스타일 */
.statusCard { ... }
.statusCardSafe { ... }
.statusCardCaution { ... }
.statusCardHigh { ... }

/* 버튼 스타일 */
.actionButton { ... }
.iconButton { ... }

/* 텍스트 스타일 */
.sectionTitle { ... }
.labelText { ... }
.valueText { ... }

/* 유틸리티 */
.flexBetween { ... }
.gridContainer { ... }
.spacing4 { ... }
```

### 4. 공통 컴포넌트 생성

#### StatusCard 컴포넌트
**파일**: `src/components/common/StatusCard.tsx`

```typescript
interface StatusCardProps {
  status: StatusType;
  icon: LucideIcon;
  label: string;
  children: ReactNode;
  className?: string;
}

export function StatusCard({ ... }) { ... }
```

**사용 예시**:
```typescript
<StatusCard 
  status="safe" 
  icon={Shield} 
  label="안전"
>
  <p>현재 카페인 섭취량: {currentIntake}mg</p>
</StatusCard>
```

### 5. Import 경로 개선

#### 상대 경로 → @ Alias
**변경 전**:
```typescript
import { Card } from "../../../components/ui/card";
import { useCaffeine } from "../../contexts/CaffeineContext";
```

**변경 후**:
```typescript
import { Card } from "@/components/ui/card";
import { useCaffeine } from "@/contexts/CaffeineContext";
```

#### 자동 변환 스크립트
```bash
npm run convert-alias
```

### 6. TypeScript 설정 강화

#### 추가된 패키지
```json
{
  "devDependencies": {
    "@types/react": "^18.x.x",
    "@types/react-dom": "^18.x.x",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3"
  }
}
```

#### tsconfig.json 개선
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📝 코드 품질 개선

### 1. 타입 안전성
- ✅ 모든 Props에 명시적 타입 정의
- ✅ Context API 타입 안전성 강화
- ✅ 중복 타입 정의 제거
- ✅ 유틸리티 타입 추가 (Nullable, Optional)

### 2. 코드 재사용성
- ✅ 공통 컴포넌트 생성 (StatusCard)
- ✅ CSS 모듈로 스타일 재사용
- ✅ 유틸리티 함수 분리

### 3. 유지보수성
- ✅ 명확한 폴더 구조
- ✅ 일관된 네이밍 컨벤션
- ✅ 문서화 강화

### 4. 개발 경험
- ✅ @ alias로 import 간소화
- ✅ 자동화 스크립트 제공
- ✅ 타입 자동완성 개선

## 🚀 사용 가능한 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# Import 경로 수정
npm run fix-imports

# 상대 경로를 @ alias로 변환
npm run convert-alias
```

## 📊 개선 효과

### Before
- 🔴 중복된 타입 정의 (3곳)
- 🔴 상대 경로 import (복잡함)
- 🔴 인라인 스타일 (재사용 어려움)
- 🔴 타입 에러 다수

### After
- ✅ 중앙 집중식 타입 관리
- ✅ @ alias 사용 (간결함)
- ✅ CSS 모듈 분리 (재사용 용이)
- ✅ 타입 안전성 강화

## 🔍 남은 작업

### 우선순위 높음
- [ ] 모든 화면 컴포넌트에 CSS 모듈 적용
- [ ] 공통 훅 생성 (useDebounce, useLocalStorage 등)
- [ ] 에러 바운더리 추가

### 우선순위 중간
- [ ] Storybook 설정
- [ ] 단위 테스트 작성
- [ ] 성능 최적화 (React.memo, useMemo)

### 우선순위 낮음
- [ ] 다국어 지원 (i18n)
- [ ] 테마 시스템 개선
- [ ] 애니메이션 라이브러리 통합

## 📚 참고 자료

- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [CSS Modules 가이드](https://github.com/css-modules/css-modules)
- [Tailwind CSS 문서](https://tailwindcss.com/)

## 👥 기여자
- 리팩토링 작업: 2025년 11월 7일

---

**마지막 업데이트**: 2025년 11월 7일
