# AI Caffeine Advisor - 설치 및 실행 가이드

## 전체 시스템 구성

이 프로젝트는 3개의 주요 컴포넌트로 구성됩니다:

1. **Frontend** - React + Vite + TypeScript
2. **Backend** - Express.js + TypeScript
3. **Database** - MySQL 8.0

## 사전 요구사항

다음 소프트웨어가 설치되어 있어야 합니다:

- **Node.js** 18.0 이상
- **MySQL** 8.0 이상
- **npm** 또는 **yarn**

## 설치 단계

### 1단계: 데이터베이스 설정

#### MySQL 설치 및 실행
MySQL이 설치되어 있지 않다면 [MySQL 공식 사이트](https://dev.mysql.com/downloads/mysql/)에서 다운로드하세요.

#### 데이터베이스 생성 및 데이터 Import

**Windows (PowerShell):**
```powershell
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

또는 각 파일을 개별적으로 import:
```powershell
mysql -u root -p caffeine_app < Dump20251107/caffeine_app_brand.sql
mysql -u root -p caffeine_app < Dump20251107/caffeine_app_menu.sql
mysql -u root -p caffeine_app < Dump20251107/caffeine_app_members.sql
mysql -u root -p caffeine_app < Dump20251107/caffeine_app_members_caffeine.sql
mysql -u root -p caffeine_app < Dump20251107/caffeine_app_caffeine_history.sql
```

### 2단계: 백엔드 서버 설정

#### 패키지 설치
```powershell
cd server
npm install
```

#### 환경 변수 설정
`server` 폴더에 `.env` 파일을 생성하고 다음 내용을 입력:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=caffeine_app

JWT_SECRET=your_secret_key_change_this_in_production
PORT=3001
```

**중요:** 
- `DB_PASSWORD`를 실제 MySQL root 비밀번호로 변경하세요
- `JWT_SECRET`을 안전한 랜덤 문자열로 변경하세요

#### 서버 실행
```powershell
npm run dev
```

서버가 성공적으로 실행되면 다음 메시지가 표시됩니다:
```
🚀 Server is running on http://localhost:3001
📊 API endpoint: http://localhost:3001/api
```

### 3단계: 프론트엔드 설정

새 터미널 창을 열고:

#### 패키지 설치
```powershell
# 프로젝트 루트로 이동
cd ..
npm install
```

#### 환경 변수 설정
프로젝트 루트에 `.env` 파일 생성:

```env
VITE_API_URL=http://localhost:3001/api
```

#### 프론트엔드 실행
```powershell
npm run dev
```

브라우저에서 `http://localhost:5173` (또는 표시된 URL)을 열면 앱이 실행됩니다.

## 실행 확인

### 백엔드 헬스 체크
브라우저나 curl로 다음 URL 접속:
```
http://localhost:3001/health
```

응답:
```json
{
  "status": "ok",
  "message": "Caffeine Advisor API is running"
}
```

### 프론트엔드 확인
브라우저에서 `http://localhost:5173` 접속 후:
1. 회원가입 버튼 클릭
2. 정보 입력 후 가입
3. 대시보드 확인

## 테스트 계정

데이터베이스에 이미 등록된 테스트 계정들:

| 아이디 | 비밀번호 | 이름 |
|--------|----------|------|
| t1 | (암호화됨) | t1 |
| t2 | (암호화됨) | t2 |
| t3 | (암호화됨) | t3 |

**참고:** 비밀번호가 암호화되어 있으므로 새로 회원가입하는 것을 권장합니다.

## 주요 기능 테스트

### 1. 회원가입
1. 온보딩 화면에서 "회원가입" 클릭
2. 정보 입력:
   - 아이디: 4자 이상
   - 비밀번호: 6자 이상
   - 이름, 생년월일, 성별
3. "가입하기" 클릭
4. 자동으로 로그인되어 대시보드로 이동

### 2. 음료 추가
1. 대시보드에서 "음료 추가" 버튼 클릭
2. 브랜드 선택 (메가, 스타벅스, 컴포즈)
3. 음료 선택 (DB에서 실제 메뉴 로드)
4. 카페인 양 자동 입력 확인
5. "오늘의 섭취량에 추가" 클릭
6. 대시보드에서 업데이트된 카페인 섭취량 확인

### 3. 프로필 확인
1. 하단 네비게이션에서 "Profile" 클릭
2. DB에서 로드된 사용자 정보 확인:
   - 이름, 아이디
   - 체중, 성별, 나이
   - 일일 카페인 제한량

## 폴더 구조

```
AI Caffeine Advisor Mockup/
├── src/                      # 프론트엔드 소스
│   ├── lib/
│   │   └── api.ts           # API 통신 레이어
│   ├── contexts/
│   │   └── CaffeineContext.tsx  # 카페인 상태 관리
│   ├── features/
│   │   ├── profile/         # 프로필 화면
│   │   └── tracking/        # 음료 추가 화면
│   └── screens/
│       └── OnboardingScreen.tsx  # 회원가입 화면
├── server/                   # 백엔드 소스
│   ├── src/
│   │   ├── config/          # DB 설정
│   │   ├── controllers/     # API 컨트롤러
│   │   ├── middleware/      # 인증 미들웨어
│   │   ├── routes/          # API 라우트
│   │   └── types/           # TypeScript 타입
│   ├── package.json
│   └── .env                 # 환경 변수 (생성 필요)
├── Dump20251107/            # MySQL 덤프 파일
├── package.json
└── .env                     # 환경 변수 (생성 필요)
```

## 트러블슈팅

### MySQL 연결 오류
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**해결방법:**
1. MySQL 서비스가 실행 중인지 확인
   ```powershell
   # Windows
   Get-Service MySQL*
   ```
2. `.env` 파일의 DB 설정 확인
3. MySQL 포트 확인 (기본 3306)

### 포트 충돌
```
Error: listen EADDRINUSE: address already in use :::3001
```
**해결방법:**
1. 다른 프로세스가 3001 포트를 사용 중인지 확인
2. `.env`에서 다른 포트로 변경

### CORS 오류
```
Access to fetch has been blocked by CORS policy
```
**해결방법:**
1. 백엔드 서버가 실행 중인지 확인
2. 프론트엔드 `.env`의 `VITE_API_URL` 확인
3. 브라우저 캐시 삭제 후 재시도

### 패키지 설치 오류
```
npm ERR! code ERESOLVE
```
**해결방법:**
```powershell
npm install --legacy-peer-deps
```

## 개발 모드 vs 프로덕션

### 개발 모드 (현재)
- 백엔드: `npm run dev` (tsx watch로 자동 재시작)
- 프론트엔드: `npm run dev` (Vite 개발 서버)
- Hot reload 지원

### 프로덕션 빌드
```powershell
# 백엔드
cd server
npm run build
npm start

# 프론트엔드
cd ..
npm run build
# dist 폴더를 웹 서버에 배포
```

## 다음 단계

이제 DB와 연동된 앱을 사용할 수 있습니다:

✅ 회원가입 시 DB에 저장
✅ 로그인 후 JWT 토큰으로 인증
✅ 프로필에서 DB 데이터 표시
✅ 음료 추가 시 DB의 실제 메뉴 사용
✅ 카페인 섭취 이력 DB에 저장

더 자세한 정보는 다음 문서를 참고하세요:
- `DB_INTEGRATION.md` - DB 연동 상세 가이드
- `server/README.md` - 백엔드 API 문서
