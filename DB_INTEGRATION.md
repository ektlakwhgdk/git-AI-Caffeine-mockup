# DB 연동 가이드

## 개요

AI Caffeine Advisor 앱을 MySQL 데이터베이스와 연동하여 실제 데이터를 저장하고 조회할 수 있습니다.

## 아키텍처

```
Frontend (React + Vite)
    ↓ HTTP/REST API
Backend (Express.js + TypeScript)
    ↓ MySQL2
Database (MySQL 8.0)
```

## 설정 방법

### 1. 데이터베이스 설정

#### MySQL 설치 및 실행
MySQL 8.0 이상이 설치되어 있어야 합니다.

#### 데이터베이스 생성 및 데이터 Import
```bash
# MySQL 접속
mysql -u root -p

# 데이터베이스 생성
CREATE DATABASE caffeine_app CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE caffeine_app;

# 덤프 파일 import
source Dump20251107/caffeine_app_brand.sql;
source Dump20251107/caffeine_app_menu.sql;
source Dump20251107/caffeine_app_members.sql;
source Dump20251107/caffeine_app_members_caffeine.sql;
source Dump20251107/caffeine_app_caffeine_history.sql;
```

### 2. 백엔드 서버 설정

#### 패키지 설치
```bash
cd server
npm install
```

#### 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 입력:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=caffeine_app

JWT_SECRET=your_secret_key_here_change_this_in_production
PORT=3001
```

#### 서버 실행
```bash
npm run dev
```

서버가 `http://localhost:3001`에서 실행됩니다.

### 3. 프론트엔드 설정

#### 환경 변수 설정
프로젝트 루트에 `.env` 파일 생성:

```env
VITE_API_URL=http://localhost:3001/api
```

#### 프론트엔드 실행
```bash
npm run dev
```

## 주요 기능

### 1. 회원가입 및 로그인

**회원가입 화면** (`src/screens/OnboardingScreen.tsx`)
- 사용자가 입력한 정보를 DB에 저장
- bcrypt로 비밀번호 암호화
- JWT 토큰 발급 및 저장

**API 호출:**
```typescript
const response = await authAPI.signup({
  username: "testuser",
  password: "password123",
  name: "홍길동",
  birthDate: "2000-01-01",
  gender: "남자"
});
```

### 2. 프로필 조회

**프로필 화면** (`src/features/profile/ProfileScreen.tsx`)
- DB에서 사용자 정보 및 카페인 정보 조회
- 실시간으로 업데이트된 데이터 표시

**API 호출:**
```typescript
const profile = await profileAPI.getProfile();
// profile.name, profile.caffeineInfo.max_caffeine 등 사용
```

### 3. 음료 추가

**음료 추가 화면** (`src/features/tracking/TrackingScreen.tsx`)
- DB에서 실제 브랜드 및 메뉴 목록 조회
- 선택한 음료의 카페인 정보를 DB에 저장
- 자동으로 일일 누적량 계산

**API 호출:**
```typescript
// 브랜드 목록 조회
const brands = await menuAPI.getBrands();

// 특정 브랜드의 메뉴 조회
const menus = await menuAPI.getMenusByBrand(brandId);

// 카페인 섭취 기록
await caffeineAPI.addIntake({
  brand_name: "스타벅스",
  menu_name: "아메리카노",
  caffeine_mg: 150
});
```

### 4. 카페인 추적

**CaffeineContext** (`src/contexts/CaffeineContext.tsx`)
- 앱 시작 시 DB에서 오늘의 카페인 정보 로드
- 음료 추가 시 DB에 자동 저장
- 로그인하지 않은 경우 로컬 스토리지 사용

## 데이터 흐름

### 회원가입 플로우
```
1. 사용자 입력 (OnboardingScreen)
   ↓
2. 유효성 검사 (프론트엔드)
   ↓
3. API 호출 (authAPI.signup)
   ↓
4. 백엔드 검증 및 처리
   - 중복 확인
   - 비밀번호 해싱
   - DB 저장 (members, members_caffeine)
   ↓
5. JWT 토큰 발급
   ↓
6. 프론트엔드 토큰 저장
   ↓
7. 로그인 상태로 전환
```

### 음료 추가 플로우
```
1. 브랜드 선택 (TrackingScreen)
   ↓
2. DB에서 해당 브랜드 메뉴 조회
   ↓
3. 사용자가 메뉴 선택
   ↓
4. 카페인 정보 자동 입력
   ↓
5. 추가 버튼 클릭
   ↓
6. API 호출 (caffeineAPI.addIntake)
   ↓
7. 백엔드 처리
   - caffeine_history 테이블에 기록 추가
   - members_caffeine 테이블의 current_caffeine 업데이트
   ↓
8. 프론트엔드 상태 업데이트
   ↓
9. 대시보드에 반영
```

## API 통신 레이어

**파일 위치:** `src/lib/api.ts`

모든 API 호출은 이 파일을 통해 이루어지며, 다음 기능을 제공합니다:

- 자동 JWT 토큰 추가
- 에러 핸들링
- 타입 안전성 (TypeScript)
- 중앙 집중식 API 관리

**사용 예시:**
```typescript
import { authAPI, menuAPI, caffeineAPI, profileAPI } from '@/lib/api';

// 로그인
const { token, user } = await authAPI.login({ username, password });

// 메뉴 조회
const menus = await menuAPI.getAllMenus();

// 카페인 추가
await caffeineAPI.addIntake({ brand_name, menu_name, caffeine_mg });

// 프로필 조회
const profile = await profileAPI.getProfile();
```

## 보안 고려사항

1. **비밀번호 암호화**: bcrypt 사용 (salt rounds: 10)
2. **JWT 인증**: 7일 만료 토큰
3. **SQL Injection 방지**: Prepared Statements 사용
4. **CORS 설정**: 허용된 도메인만 접근 가능
5. **환경 변수**: 민감한 정보는 .env 파일로 관리

## 트러블슈팅

### 데이터베이스 연결 오류
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**해결방법:**
- MySQL 서버가 실행 중인지 확인
- `.env` 파일의 DB 설정 확인
- 방화벽 설정 확인

### JWT 토큰 오류
```
Error: 유효하지 않은 토큰입니다.
```
**해결방법:**
- 로그아웃 후 다시 로그인
- localStorage에서 `auth_token` 삭제
- 백엔드 JWT_SECRET 확인

### CORS 오류
```
Access to fetch at 'http://localhost:3001/api/...' has been blocked by CORS policy
```
**해결방법:**
- 백엔드 서버가 실행 중인지 확인
- CORS 설정 확인 (server/src/index.ts)

## 개발 팁

1. **API 테스트**: Postman이나 Thunder Client 사용 권장
2. **DB 관리**: MySQL Workbench 또는 DBeaver 사용
3. **로그 확인**: 백엔드 콘솔에서 SQL 쿼리 및 에러 확인
4. **타입 안전성**: TypeScript 타입 정의 활용

## 다음 단계

- [ ] 프로필 수정 기능 구현
- [ ] 카페인 섭취 이력 차트 추가
- [ ] 친구 기능 DB 연동
- [ ] 챌린지 시스템 DB 연동
- [ ] 알림 기능 추가
