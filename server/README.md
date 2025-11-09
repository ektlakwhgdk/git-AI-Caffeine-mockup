# AI Caffeine Advisor - Backend API

Express.js + MySQL 기반 백엔드 API 서버

## 기술 스택

- **Node.js** + **TypeScript**
- **Express.js** - REST API 프레임워크
- **MySQL** - 데이터베이스
- **bcryptjs** - 비밀번호 암호화
- **jsonwebtoken** - JWT 인증
- **mysql2** - MySQL 드라이버

## 설치 및 실행

### 1. 패키지 설치

```bash
cd server
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 설정을 입력하세요:

```bash
cp .env.example .env
```

`.env` 파일 내용:
```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=caffeine_app

JWT_SECRET=your_jwt_secret_key_here
PORT=3001
```

### 3. 데이터베이스 설정

MySQL에 `caffeine_app` 데이터베이스를 생성하고 덤프 파일을 import하세요:

```bash
mysql -u root -p < ../Dump20251107/caffeine_app_brand.sql
mysql -u root -p < ../Dump20251107/caffeine_app_menu.sql
mysql -u root -p < ../Dump20251107/caffeine_app_members.sql
mysql -u root -p < ../Dump20251107/caffeine_app_members_caffeine.sql
mysql -u root -p < ../Dump20251107/caffeine_app_caffeine_history.sql
```

### 4. 서버 실행

개발 모드:
```bash
npm run dev
```

프로덕션 빌드:
```bash
npm run build
npm start
```

서버는 기본적으로 `http://localhost:3001`에서 실행됩니다.

## API 엔드포인트

### 인증 (Authentication)

#### 회원가입
```
POST /api/auth/signup
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123",
  "name": "홍길동",
  "birthDate": "2000-01-01",
  "gender": "남자",
  "weight_kg": 70
}
```

#### 로그인
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### 메뉴 (Menu)

#### 모든 브랜드 조회
```
GET /api/brands
```

#### 특정 브랜드의 메뉴 조회
```
GET /api/brands/:brandId/menus
```

#### 모든 메뉴 조회
```
GET /api/menus
```

#### 메뉴 검색
```
GET /api/menus/search?query=아메리카노
```

### 카페인 (Caffeine) - 인증 필요

#### 카페인 섭취 기록 추가
```
POST /api/caffeine/intake
Authorization: Bearer {token}
Content-Type: application/json

{
  "menu_id": 1,
  "brand_name": "스타벅스",
  "menu_name": "아메리카노",
  "caffeine_mg": 150
}
```

#### 오늘의 섭취 이력 조회
```
GET /api/caffeine/today
Authorization: Bearer {token}
```

#### 기간별 섭취 이력 조회
```
GET /api/caffeine/history?startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer {token}
```

#### 현재 카페인 정보 조회
```
GET /api/caffeine/info
Authorization: Bearer {token}
```

#### 카페인 정보 업데이트
```
PUT /api/caffeine/info
Authorization: Bearer {token}
Content-Type: application/json

{
  "weight_kg": 75,
  "max_caffeine": 400
}
```

### 프로필 (Profile) - 인증 필요

#### 프로필 조회
```
GET /api/profile
Authorization: Bearer {token}
```

#### 프로필 업데이트
```
PUT /api/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "홍길동",
  "weight_kg": 75,
  "max_caffeine": 400
}
```

## 데이터베이스 스키마

### members (회원)
- `member_id` - 회원 ID (PK)
- `username` - 아이디 (UNIQUE)
- `password` - 비밀번호 (bcrypt 해시)
- `name` - 이름
- `point` - 포인트

### members_caffeine (회원 카페인 정보)
- `member_id` - 회원 ID (PK, FK)
- `age` - 생년월일
- `weight_kg` - 체중
- `gender` - 성별
- `current_caffeine` - 현재 누적 카페인
- `max_caffeine` - 일일 최대 권장량
- `updated_at` - 마지막 업데이트 시각

### brand (브랜드)
- `brand_id` - 브랜드 ID (PK)
- `brand_name` - 브랜드명 (UNIQUE)

### menu (메뉴)
- `menu_id` - 메뉴 ID (PK)
- `brand_id` - 브랜드 ID (FK)
- `menu_name` - 메뉴명
- `category` - 카테고리 (coffee/decaf)
- `size` - 사이즈 (small/regular/large)
- `caffeine_mg` - 카페인 함량

### caffeine_history (섭취 이력)
- `history_id` - 이력 ID (PK)
- `member_id` - 회원 ID (FK)
- `menu_id` - 메뉴 ID (FK, nullable)
- `brand_name` - 브랜드명
- `menu_name` - 메뉴명
- `caffeine_mg` - 카페인 함량
- `drinked_at` - 섭취 시각

## 보안

- 비밀번호는 bcrypt로 해싱되어 저장됩니다
- JWT 토큰을 사용한 인증 시스템
- CORS 설정으로 허용된 도메인만 접근 가능
- SQL Injection 방지를 위한 Prepared Statements 사용
