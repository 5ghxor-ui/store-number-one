# 스토어 넘버원 — 배포 로드맵 (실서비스 전환)

> 목표: 데이터를 실제로 저장하고, 도메인을 사서, 웹사이트를 인터넷에 공개한다.
> 작성일 2026-07-30. 이 문서를 기준으로 단계별로 진행한다.
>
> ⚠️ **독립 프로젝트**: 스토어 넘버원은 스테이크피디아 · 하이퍼KR 과 **완전히 별개**입니다.
> GitHub 저장소 · Supabase 프로젝트 · Vercel 프로젝트 · 도메인 모두 **새로 따로** 만듭니다. (기존 것과 절대 섞지 않음)

---

## 1. 전체 그림 (스택)

| 역할 | 서비스 | 하는 일 |
|---|---|---|
| 코드 저장소 | **GitHub** | 코드 보관, Vercel과 연결(푸시하면 자동 배포) |
| 데이터베이스 + 로그인 | **Supabase** | 상품·장바구니·주문요청 저장, Google 로그인, 보안(RLS), 관리자 권한 |
| 웹 호스팅 | **Vercel** | 웹사이트를 인터넷에 띄움 (GitHub 연결) |
| 도메인 + DNS | **Cloudflare** | 도메인 구매, 주소를 Vercel로 연결 |

흐름: **GitHub(코드) → Vercel(호스팅) → Cloudflare(도메인 주소) → 사용자**, 데이터는 **Supabase**에 저장.

---

## 2. 현실 체크 — 지금 상태 vs 실서비스

- **지금(프로토타입):** HTML/CSS/JS 정적 사이트. 데이터가 **브라우저(localStorage)에만** 저장 → 기기·사람 간 공유 안 됨, 진짜 로그인·관리자 보안 없음.
- **실서비스로 가려면:** Supabase에 **진짜 데이터베이스**를 만들고, **Google 로그인**을 붙이고, 앱이 브라우저 저장 대신 **Supabase와 통신**하도록 바꿔야 함. → 이 "백엔드 연결"이 가장 큰 작업.

그래서 두 갈래로 나눠 진행하는 것을 권장:

- **A안 (빠른 공개):** 지금 프로토타입을 도메인에 먼저 올려 인터넷에서 보이게 함. (데이터는 아직 브라우저 저장) — 1~2단계면 됨, 보여주기용.
- **B안 (완전판):** Supabase 연결까지 끝내 진짜 데이터 저장·로그인·관리자 보안을 갖춤. — 시간이 더 걸림, 실제 운영용.

> 권장: **A안으로 먼저 공개 → B안으로 실제 기능 완성** (한 번에 다 하지 않고 단계적으로).

---

## 3. 전체 순서 (담당: 🤖=Claude가 함 / 🙋=사용자가 함 / 🤝=함께)

### 1단계. GitHub 저장소 만들기
- 🤖 git 초기화, .gitignore, 첫 커밋 (로컬) — **완료 예정**
- 🙋 GitHub에서 새 저장소(repo) 생성 (예: `store-number-one`), 또는 로그인 정보 제공
- 🤝 원격 연결 후 푸시 (gh CLI 설치 또는 토큰 필요)

### 2단계. Supabase 프로젝트 + 데이터베이스
- 🙋 supabase.com 로그인 → 새 프로젝트 생성 (지역: Seoul/Tokyo 권장), DB 비밀번호 설정
- 🤖 DB 스키마 SQL 작성 → `db/schema.sql` (**완료 예정**: 상품·카테고리·장바구니·주문요청·상태이력·관리자메모 + 보안 정책 RLS)
- 🙋 Supabase 대시보드 → SQL Editor 에 붙여넣고 실행 (내가 안내)
- 🙋 프로젝트 URL / anon key / service key 를 나에게 전달 (또는 Vercel 환경변수에 입력)

### 3단계. Google 로그인(OAuth) 자격증명
- 🙋 Google Cloud Console → OAuth 클라이언트 ID 생성 (내가 클릭 순서 안내)
- 🙋 리디렉트 URL 에 Supabase 콜백 주소 등록
- 🙋 Client ID / Secret 을 Supabase Auth 설정에 입력
- 🤖 앱의 로그인 버튼을 실제 Google 로그인과 연결

### 4단계. 앱을 Supabase에 연결 (가장 큰 작업)
- 🤖 브라우저 저장(localStorage) → **Supabase 통신**으로 교체
  - 상품 목록을 DB에서 읽기
  - 장바구니를 사용자 계정별로 DB에 저장
  - 주문 요청을 DB에 기록 → 관리자 페이지에서 조회
  - 관리자 권한을 **서버에서 검증**(RLS)
- 🤖 필요한 경우 프레임워크(예: Next.js) 로 재구성 여부 결정 → 함께 상의

### 5단계. Vercel 배포
- 🙋 vercel.com 로그인 → GitHub 저장소 연결 (또는 이 PC의 Vercel CLI로 배포 — 내가 실행)
- 🤖 배포 설정(vercel.json 등) 준비
- 🤝 환경변수(Supabase URL/키 등) 입력 → 배포

### 6단계. Cloudflare 도메인 구매 + 연결
- 🙋 Cloudflare 대시보드 → 원하는 도메인 검색 후 **구매(결제 필요)**
- 🤝 Vercel에 도메인 추가 → Cloudflare DNS에 레코드 등록 (내가 정확한 값 안내)
- 🤝 SSL(https) 자동 적용 확인

### 7단계. 마무리 설정 · 공개
- 🙋 관리자 이메일 지정 (환경변수/DB) → 나에게 알려주면 반영
- 🤝 전체 흐름 테스트(로그인 → 담기 → 주문요청 → 관리자 접수)
- ✅ 공개

---

## 4. 요약 — 내가 할 일 / 당신이 할 일

**🤖 내가 할 수 있는 것**
- git 저장소 준비, DB 스키마 SQL 작성, 환경변수 템플릿, 배포 설정
- 앱 코드를 Supabase/Google 로그인에 연결
- Vercel CLI 로 배포 실행, DNS 값 정확히 안내
- 모든 단계 클릭 순서를 하나하나 안내

**🙋 당신만 할 수 있는 것 (계정·결제·보안키)**
- GitHub / Supabase / Vercel / Cloudflare **로그인**
- Supabase 프로젝트 생성, SQL 실행(붙여넣기)
- Google Cloud OAuth 자격증명 생성
- **도메인 구매(결제)**
- 비밀키를 안전한 곳(Vercel 환경변수)에 입력

> 비밀키(service key, OAuth secret)는 **채팅에 그대로 붙여넣지 말고** Vercel/Supabase 설정창에 직접 입력하는 것을 권장. (필요 시 내가 위치를 정확히 안내)

---

## 5. 필요한 환경변수 (미리보기)

```
NEXT_PUBLIC_SUPABASE_URL=          # Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # 공개용 키 (브라우저)
SUPABASE_SERVICE_ROLE_KEY=         # 서버 전용 비밀키 (절대 노출 금지)
GOOGLE_OAUTH_CLIENT_ID=            # Google 로그인
GOOGLE_OAUTH_CLIENT_SECRET=        # (Supabase Auth에 입력)
ADMIN_EMAILS=                      # 관리자 Google 이메일 (쉼표로 여러 개)
```

---

## 6. 예상 비용 (대략)

- GitHub: 무료
- Supabase: 무료 플랜으로 시작 가능 (트래픽 늘면 유료)
- Vercel: 무료(Hobby) 플랜으로 시작 가능
- Cloudflare 도메인: **연 $10~15 수준** (도메인에 따라 다름, 원가 제공)

> 시작은 대부분 무료, **실제 지출은 도메인 구매 하나**부터.
