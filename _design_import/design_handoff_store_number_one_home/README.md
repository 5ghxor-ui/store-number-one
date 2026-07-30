# Handoff: Store Number One — 홈 화면 (Editorial Magazine)

## Overview
스토어 넘버원(Store Number One)은 **온라인 결제가 없는 상품 요청 플랫폼**입니다. 사용자는 상품을 둘러보고 Google 로그인 후 장바구니에 담고, 장바구니에서 "주문 요청"을 보냅니다. 요청은 관리자 페이지로 전달되고, 관리자가 확인 후 직접 연락합니다. **결제창(PG/체크아웃)은 존재하지 않습니다.**

이 핸드오프는 **홈 화면 한 개**를 다룹니다 (데스크톱 1440 + 모바일 390). 상품 상세, 장바구니, 주문 요청 완료, 관리자 페이지는 아직 디자인되지 않았습니다.

취급 카테고리: 뷰티 / 의류 / 식품 / 생활 도구 (각 대분류에 하위 드롭다운). 가격대 1만~5만원. 타깃은 안목 있는 개인 고객(10~50대), 20대 후반 첫 좋은 물건 구매층, 사업자·도매 문의 고객(B2B), 해외 고객 일부 — 그래서 화면은 **한글·영문 병기**입니다.

## About the Design Files
`design/` 안의 파일은 **HTML로 만든 디자인 레퍼런스**입니다 — 의도한 외형과 동작을 보여주는 프로토타입이며, 그대로 복사해 배포할 프로덕션 코드가 아닙니다. 해야 할 일은 **이 HTML 디자인을 대상 코드베이스의 기존 환경(React / Next.js / Vue / SwiftUI 등)에서 그 환경의 관례와 라이브러리로 다시 구현**하는 것입니다. 아직 환경이 없다면 프로젝트에 가장 적합한 프레임워크를 골라 구현하세요.

파일 구조 참고: `store-number-one-home.dc.html`은 `<x-dc>` 템플릿 + `class Component extends DCLogic` 로직으로 된 프로토타입 전용 포맷입니다. 이 포맷 자체를 이식하지 마세요. **템플릿의 마크업 구조와 인라인 스타일 값, 로직 클래스의 데이터 배열만 참고**하고, 대상 프레임워크의 컴포넌트로 재작성하세요.

이 파일 하나에 여러 탐색 안이 `<section class="dv-turn">` 단위로 들어 있습니다. **구현 대상은 `id="t4"` 섹션 안의 `#4a`(데스크톱)와 `#4b`(모바일)** 뿐입니다. `t3`(스타일 견본 15종), `t1`/`t2`(초기 3안), `t0`(디자인 노트)는 채택되지 않은 탐색이므로 구현하지 않습니다. `.dv-*` 래퍼 클래스는 옵션 전시용 껍데기이므로 이식 대상이 아닙니다.

## Fidelity
**High-fidelity.** 색·타이포·간격·상태가 모두 확정값입니다. 아래 Design Tokens와 Screens 섹션의 수치를 그대로 재현하세요. 단, 애니메이션은 의도적으로 제외했습니다(정적 UI 확정 단계). 이미지는 모두 플레이스홀더이므로 실제 사진으로 대체해야 합니다.

## 확정된 디자인 값 (프로토타입의 Tweak 기본값)
프로토타입은 검토를 위해 22개의 조정값을 노출하지만, **구현 시에는 아래 확정 조합 하나만 하드코딩**하면 됩니다. 다른 값들은 구현 대상이 아닙니다.

| 항목 | 확정값 |
|---|---|
| 종이 톤 | 그레이 |
| 액센트 | `#8A6B3A` (brass) |
| 제목 서체 | Source Serif 4 (+ Noto Serif KR) |
| 타입 스케일 | 1.2× |
| Hero 레이아웃 | 풀블리드 커버 |
| 밀도 | 압축 (density factor 0.62) |
| 상품 카드 | 패널 (배경 채운 카드) |
| CTA 버튼 | 채움 (solid) |
| 품절 표기 | 이미지 오버레이 |
| 영문 병기 / 메타 대문자 / 드롭캡 / 괘선 / 섹션 번호 | 모두 ON |
| 그리드 열 수 | 4 |
| 상품 이미지 비율 | 4:5 |
| 공지 · 대량구매 · 최근 본 상품 · 모바일 | 모두 표시 |

## Design Tokens

### Colors
| 토큰 | 값 | 용도 |
|---|---|---|
| `paper` | `#F1F0ED` | 페이지 배경 |
| `panel` | `#E7E6E2` | 상품 카드 배경, 유틸바, 공지, 푸터 |
| `line` | `#DCDBD6` | 괘선, 테두리, 칩 보더 |
| `img2` | `#E5E4E0` | 이미지 플레이스홀더 스트라이프 |
| `ink` | `#1A1A18` | 본문/제목 텍스트, solid 버튼 배경 |
| `sub` | `#5C5850` | 보조 본문 |
| `muted` | `#918C82` | 메타, 캡션, 취소선 가격, 랭킹 숫자 |
| `accent` | `#8A6B3A` | 섹션 번호, 스텝 번호, 대량구매 블록 배경, 드롭캡 |
| overlay | `rgba(26,26,24,.35)` + `#fff` 텍스트 | 품절 이미지 오버레이 |
| 그림자(드롭다운) | `0 14px 34px rgba(26,26,24,.09)` | 카테고리 드롭다운만 |

border-radius는 **모든 요소 0px**입니다. 그림자는 드롭다운 외에는 사용하지 않습니다.

### Typography
- 제목/디스플레이: `'Source Serif 4', 'Noto Serif KR', serif`
- 본문(세리프): `'Source Serif 4', 'Noto Serif KR', serif`
- 메타/UI/영문 라벨: `Archivo, 'Noto Sans KR', sans-serif`
- 상품명·메뉴·버튼 등 한글 UI: `'Noto Sans KR', sans-serif`
- 코드/플레이스홀더 캡션: `ui-monospace, Menlo, monospace`

스케일(1.2× 적용된 최종값):

| 역할 | 스타일 |
|---|---|
| H1 (Hero) | 400 70px / 1.1, letter-spacing -.02em, ink |
| H2 (섹션) | 400 36px / 1.22, letter-spacing -.01em, ink |
| H3 (카테고리명, 스텝 제목) | 400 26px / 1.35, ink |
| Lead (Hero 본문) | 300 20px / 1.9, sub |
| Body | 300 16px / 1.9, sub |
| 상품명 | 400 19px / 1.4, Noto Sans KR, ink |
| 가격 | 400 18px / 1, serif, ink |
| 정가(취소선) | 400 12px / 1, serif, muted, line-through |
| Kicker (영문 소제목) | 400 10px / 1, Archivo, letter-spacing .22em, uppercase, muted |
| Meta (영문 병기) | 400 10.5px / 1, Archivo, letter-spacing .12em, uppercase, muted |
| 섹션 번호 | 400 13px / 1, Archivo, letter-spacing .16em, accent |
| 스텝 번호 | 400 38px / 1, serif, accent |
| 랭킹 번호 | 400 26px / 1, serif, muted |
| 워드마크 | 400 23px / 1, serif, letter-spacing .2em, ink |
| 워드마크 서브(스토어 넘버원) | 300 10px / 1, Noto Sans KR, letter-spacing .24em, muted |
| 유틸/링크 | 400 12px / 1, Noto Sans KR, sub |
| 버튼 | 400 12px / 1 (카드), 400 13px / 1 (Hero), letter-spacing .04–.05em |
| SOLD OUT 라벨 | 500 9px / 1, Archivo, letter-spacing .14em, muted |
| 드롭캡 | 400 65px / .82, serif, accent, float:left, padding 4px 10px 0 0 |

### Spacing (density = 압축)
- 페이지 좌우 패딩: **74px** (모바일 22px)
- 섹션 상단 간격: **74px**
- 그리드 간격: 세로 **39px** / 가로 **27px**
- 섹션 헤더 하단 패딩: 31px, 아래에 `1px solid ink` 괘선
- 그리드 상단 패딩(섹션 헤더 → 카드): 32px
- 카드 내부(패널 스타일): 이미지 영역 `padding:18px 20px 0`, 텍스트 영역 `padding:18px 20px 22px`, 요소 간 `gap:9px`
- 유틸바 높이 34px, 마스트헤드 `padding: 24px 74px 17px`
- 공지 스트립 `padding:16px 74px`, 위 마진 29px
- 대량구매 블록 `padding: 57px 74px`
- 푸터 `padding: 54px 74px 34px`, 4열 grid `gap:44px`, 하단 바 `padding:20px 74px 34px` + `1px solid line` top

## Screens / Views

### 1. 홈 — 데스크톱 (1440px 고정 폭 기준, 좌우 패딩 74px)

위에서 아래로:

**1) 유틸리티 바** — 높이 34px, 배경 panel, 3분할 space-between, 11px Archivo, sub.
좌: `ISSUE 01 · 2026 SUMMER` / 중앙: `결제 없음 · 주문 요청 후 담당자가 직접 연락드립니다` / 우: `카카오톡 상담`, `02-1000-0001` (gap 18px).

**2) 마스트헤드** — `grid-template-columns: 1fr auto 1fr`, align center.
좌: `검색 Search`, `공지` (gap 20px) / 중앙: 워드마크 `STORE NUMBER ONE` + 서브 `스토어 넘버원` (세로, gap 6px, 중앙정렬) / 우: `Google로 계속하기`, `장바구니 (2)` (gap 18px, 우측정렬).
검색은 별도 인풋이 아니라 텍스트 링크입니다(클릭 시 검색 오버레이 — 미디자인).

**3) 카테고리 내비게이션** — 중앙 정렬 flex, gap 27px, 하단 `1px solid line`, `padding: 0 74px 15px`.
각 항목: 한글 라벨(14px Noto Sans KR, ink) 위/아래로 영문(9px Archivo, .16em, uppercase, muted) 세로 배치.
**hover 시 드롭다운**: 항목 아래 `position:absolute; top:100%; left:50%; translateX(-50%)`, `min-width:190px`, 배경 paper, `1px solid line`, `padding:13px 0`, 그림자 `0 14px 34px rgba(26,26,24,.09)`, z-index 30. 항목은 `padding:8px 22px`, 13px serif, sub, `white-space:nowrap`. hover 시 배경 panel.

드롭다운 데이터(그대로 사용):
- 뷰티 / Beauty: 스킨케어, 클렌징, 메이크업, 헤어 · 바디, 향 · 퍼퓸, 선케어
- 의류 / Clothing: 상의, 하의, 한 벌 옷, 아우터, 모자, 벨트, 신발
- 식품 / Food: 차 · 커피, 오일 · 소스, 건과 · 곡물, 잼 · 스프레드, 선물 세트
- 생활 도구 / Tools: 주방 도구, 청소 도구, 문구, 수납, 리넨 · 패브릭

**4) Hero (풀블리드 커버)**
- 상단: 전체 폭 이미지, `aspect-ratio: 16/6.5`. 좌하단에 플레이스홀더 캡션(9.5px monospace, muted): `cover image — 리넨 위 정물, 상품 3점, 자연광`.
- 하단: `grid-template-columns: 1.25fr 1fr; gap:64px; padding:64px 74px 0`.
  - 좌: kicker `Cover story — 오래 쓸 물건` + H1 `파는 대신 / 골라 두었습니다` (2줄 강제 개행).
  - 우: 드롭캡(`스`, accent, float left) 문단 —
    "스토어 넘버원에는 결제창이 없습니다. 뷰티 · 의류 · 식품 · 생활 도구 네 갈래에서 오래 두고 쓸 만한 것만 골라 소개하고, 마음에 드는 물건을 장바구니에 담아 주문 요청을 보내면 담당자가 재고와 배송을 확인해 직접 연락드립니다."
  - CTA 2개: `전체 상품 보기`(solid: 배경 ink, 글자 paper, `padding:15px 30px`) / `이용 방법`(ghost: `1px solid line`, 글자 ink, 동일 패딩).

**5) 공지 스트립** — 배경 panel, 중앙 정렬 flex gap 14px. `NOTICE`(섹션번호 스타일, accent) + `8/12–8/14 여름 휴무 · 이 기간 주문 요청은 8/17부터 순차 연락드립니다.` + `공지 전체` 링크.

**6) 추천 상품 (섹션 01)** — 섹션 헤더: `01`(accent) + H2 `추천 상품` + kicker `Featured — 이달의 선택`, 우측 `전체 보기 →`. 하단 `1px solid ink`.
**3열 그리드**(추천만 3열), 카드는 패널 스타일 + 에디토리얼 정보:
카테고리 kicker → 상품명 + (품절 시 라벨) → 영문·스펙 메타 → 설명 문단(16px serif) → 가격(한 줄: 판매가 + 취소선 정가) → CTA.

**7) 인기 상품 (섹션 02)** — 리스트형 행.
`grid-template-columns: 56px 124px 1fr 180px 170px; gap:26px; align-items:center; padding:20px 0; border-bottom:1px solid line`.
열 순서: 랭킹 번호(26px serif muted) / 정사각 이미지 / [카테고리 kicker + 상품명(+품절 라벨) + 영문] / 가격 + 취소선 / CTA 버튼.

**8) 최신 상품 (섹션 03)** — 4열 그리드, 패널 카드(설명 문단 없음): 이미지 → 상품명(+품절 라벨) → 영문 메타 → 가격 → CTA.

**9) 카테고리 (섹션 04)** — 4개 행.
`grid-template-columns: 70px 1fr 1.25fr 200px; gap:30px; padding:28px 0; border-bottom:1px solid line`.
열: 번호(01–04, accent) / [대분류명 H3 + 영문 메타 + 설명] / 하위 카테고리 칩 랩(칩: `padding:7px 13px`, `1px solid line`, 배경 panel, 12px serif, sub) / 16:9 이미지 플레이스홀더.

**10) 대량구매 · 견적 문의 배너** — 배경 **accent(#8A6B3A)**, `padding:57px 74px`, 좌우 space-between(gap 56px).
좌: `For business` kicker(흰색 60%) + H3 30px serif 흰색 `대량구매 · 도매 견적 문의` + 설명(15px serif, 흰색 78%) "10개 이상 동일 상품, 사업자 납품, 기업 선물 건은 별도 단가로 안내드립니다. 요청서를 남기시면 담당자가 확인 후 연락드립니다."
우: `견적 문의하기`(배경 paper, 글자 ink) / `카카오톡 상담`(`1px solid rgba(255,255,255,.45)`, 흰 글자), 각 `padding:15px 32px`, 세로 gap 10px.

**11) 스토어 이용 방법 (섹션 05)** — 4열, 각 칸 `padding:34px 30px 38px 0; border-right:1px solid line`.
번호(38px serif accent) → 제목(H3) → 설명(16px serif sub).
1. 둘러보기 — 로그인 없이 모든 상품과 가격을 볼 수 있습니다.
2. Google 로그인 — 장바구니에 담을 때 Google 계정으로 한 번만 로그인합니다.
3. 주문 요청 보내기 — 장바구니에서 요청을 보내면 결제 없이 접수됩니다.
4. 담당자 연락 — 재고와 배송, 결제 방법을 확인해 평일 4시간 내 연락드립니다.

**12) 최근 본 상품** — 6열 그리드 gap 20px, 정사각 이미지 + 상품명(16px serif). 섹션 상단 패딩 52px.

**13) 푸터** — 배경 panel, `grid-template-columns: 1.5fr 1fr 1fr 1fr; gap:44px`.
1열: 워드마크 + 소개문("오래 쓸 물건을 골라 두는 편집 스토어. 결제 없이 주문을 요청하고, 담당자와 확인 후 받습니다.") + `INSTAGRAM / KAKAO / NAVER`(메타 스타일).
2–5열: 영문 라벨 + 한글 제목 + 링크 목록
- Shop / 쇼핑: 뷰티, 의류, 식품, 생활 도구, 전체 상품
- Guide / 이용 안내: 주문 요청 방법, 배송 · 반품, 재입고 알림, 자주 묻는 질문
- Contact / 문의: 카카오톡 상담, 02-1000-0001, 대량구매 · 견적, hello@store-no1.kr
- About / 스토어: 브랜드 소개, 공지사항, 개인정보 처리방침, 이용약관
하단 바: `1px solid line` top, 좌 `스토어 넘버원 · 사업자등록번호 000-00-00000 · 서울시 성동구 000로 00 · 대표 000`, 우 `© 2026 Store Number One`.

### 2. 홈 — 모바일 (390px)
순서: 유틸 스트립(배경 panel, 9.5px, accent, 중앙, `결제 없음 · 요청 후 담당자 연락`) → 헤더(좌 햄버거 = 18×12px 상하 1.2px 선 두 개, 중앙 `STORE Nº1` + `스토어 넘버원`, 우 `담기 (2)`) → 카테고리 4개 가로 나열(하단 hairline) → 4:5 커버 이미지 → Hero 텍스트(H1 40px, 드롭캡 문단, solid CTA 전폭) → 추천 상품 2열 그리드(패널 카드) → 인기 상품 리스트(랭킹 + 62×62 썸네일 + 이름/가격) → 카테고리 아코디언식 목록(번호 + 대분류명 + 하위 칩 랩) → 이용 방법 4단(번호/제목/설명, 각 항목 하단 hairline) → 푸터(배경 panel, 워드마크 + 소개 + 링크 랩 + 카피라이트).
좌우 패딩 22px. 터치 타깃은 모두 44px 이상으로 올려 구현하세요(프로토타입 카드 버튼은 `padding:13px 0`이므로 실제 구현에서 높이 44px 보장).

## 상품 카드 스펙 (확정: 패널 + solid CTA + 이미지 오버레이 품절)
```
wrapper  background: #E7E6E2; display:flex; flex-direction:column; border-radius:0
image    padding:18px 20px 0 → 내부 div aspect-ratio:4/5
         배경: repeating-linear-gradient(135deg,#E5E4E0 0 6px,#F1F0ED 6px 12px)  (실사진으로 대체)
         position:relative (품절 오버레이 기준)
body     padding:18px 20px 22px; display:flex; flex-direction:column; gap:9px
name     400 19px/1.4 'Noto Sans KR'; color:#1A1A18
meta     400 10.5px/1 Archivo; .12em; uppercase; #918C82   (영문명 · 스펙)
price    400 18px/1 serif #1A1A18   +   400 12px/1 serif #918C82 line-through (gap 9px)
CTA      margin-top:6px; padding:13px 0; background:#1A1A18; color:#F1F0ED;
         400 12px/1 'Noto Sans KR'; .04em; border:none; 텍스트 "장바구니 담기"
품절     이미지 위 오버레이: position:absolute; inset:0;
         background:rgba(26,26,24,.35); color:#fff; 500 11px/1 Archivo; .2em; 중앙 "SOLD OUT"
         CTA → "재입고 알림 요청", 스타일: background:transparent; border:1px dashed #DCDBD6; color:#918C82
```
카드에는 별점·리뷰 수·찜 아이콘·할인율 뱃지를 **넣지 않습니다**(결제 없는 요청 플랫폼의 톤 유지). 가격은 판매가 + 취소선 정가만.

## Interactions & Behavior
- **카테고리 드롭다운**: 데스크톱 hover(`mouseenter`/`mouseleave`)로 열림. 한 번에 하나만 열림. 키보드 접근성은 구현 시 추가 필요(focus-within + Esc 닫기 권장). 모바일은 아코디언 또는 전체 화면 메뉴로 대체.
- **장바구니 담기(비로그인)**: **Google 로그인 유도 모달**을 띄웁니다. 로그인 성공 후 원래 담으려던 상품을 자동으로 장바구니에 추가. (모달 자체는 아직 미디자인 — 같은 토큰으로 제작 필요.)
- **장바구니 담기(로그인)**: 담기 → 헤더 `장바구니 (n)` 카운트 증가. 토스트/확인 UI 미디자인.
- **재입고 알림 요청**: 품절 상품에서만. 이메일 등록 or 로그인 사용자 기준으로 알림 신청.
- **주문 요청**: 장바구니 화면의 액션(홈에 없음). 결제 API 호출 없음 — 요청 레코드 생성 + 관리자 알림.
- **애니메이션**: 이번 단계에서는 없음. hover는 색/배경 전환만(예: solid 버튼 hover 시 배경 accent, ghost 버튼 hover 시 border ink). transition은 구현자 재량으로 120–180ms ease 권장.
- **반응형**: 1440 데스크톱 / 390 모바일 두 지점만 확정. 중간 구간은 그리드 열 수를 4 → 3 → 2로 줄이고 좌우 패딩 74 → 40 → 22px으로 축소하는 방향을 권장.

## State Management
홈 화면이 필요로 하는 상태:
- `openCategory: string | null` — 열린 드롭다운 (hover)
- `authUser: {id, email, name} | null` — Google 로그인 세션
- `cartCount: number` / `cartItems: [{productId, qty}]` — 헤더 카운트 및 담기
- `loginModalOpen: boolean` + `pendingProductId: string | null` — 비로그인 담기 플로우
- `recentlyViewed: productId[]` — 로컬 저장(로그인 시 서버 동기화 여부는 제품 결정 필요)
- `restockRequests: productId[]` — 재입고 알림 신청 상태(버튼 문구 "신청됨" 전환 필요)

데이터 페칭: 홈은 `featured / popular / newest / categories / notice` 5개 컬렉션을 읽습니다. 상품 필드: `ko, en, category, price, listPrice(nullable), soldOut, images[], spec, note`. 가격은 서버에서 정수로 받고 클라이언트에서 `toLocaleString('ko-KR')` 포맷 + `원` 접미. 재고(soldOut)는 관리자 수동 관리 가정.

## Assets
- **모든 이미지는 플레이스홀더**입니다: `repeating-linear-gradient(135deg, #E5E4E0 0 6px, #F1F0ED 6px 12px)` 위에 monospace 캡션으로 무엇이 들어갈지 적어 두었습니다. 실제 사진으로 교체하세요. 필요한 컷: 커버 1장(16:6.5 풀블리드), 상품 이미지 각 1장(4:5), 카테고리 이미지 4장(16:9), 최근 본 상품 썸네일(1:1).
- **아이콘 없음.** 검색·장바구니·로그인 모두 텍스트 링크입니다(에디토리얼 톤 유지 의도). 모바일 햄버거만 CSS 선 두 개로 그려져 있습니다. 아이콘 세트를 도입하려면 1px 스트로크 라인 아이콘으로 제한하세요.
- 폰트: Google Fonts — `Source Serif 4`(300/400/500), `Noto Serif KR`(300/400/500), `Noto Sans KR`(300/400/500/700), `Archivo`(400/500/600). 한글 웹폰트 용량이 크므로 `Pretendard`/`subset` 최적화를 고려하세요.
- 로고: 워드마크 텍스트만(`STORE NUMBER ONE` / 축약형 `STORE Nº1`). 이미지 로고 없음.

## Copy (그대로 사용 가능한 확정 문안)
- 유틸: `결제 없음 · 주문 요청 후 담당자가 직접 연락드립니다`
- Hero H1: `파는 대신 / 골라 두었습니다`
- Hero 본문: 위 4) 항목 참조
- 공지: `8/12–8/14 여름 휴무 · 이 기간 주문 요청은 8/17부터 순차 연락드립니다.`
- 섹션 제목: `추천 상품 / Featured — 이달의 선택`, `인기 상품 / Most requested — 요청 순`, `최신 상품 / Just arrived — 이번 주 입고`, `카테고리 / Index — 대분류 4 · 하위 22`, `스토어 이용 방법 / How it works — 결제 단계 없음`, `최근 본 상품 / Recently viewed`
- 버튼: `전체 상품 보기`, `이용 방법`, `장바구니 담기`, `재입고 알림 요청`, `견적 문의하기`, `카카오톡 상담`, `Google로 계속하기`
- 샘플 상품(더미 데이터로 사용 가능): 밀랍 립밤 / Beeswax Lip Balm 14,400원(정가 18,000), 리넨 오버셔츠 / Linen Over Shirt 48,000원(56,000), 황동 계량 스푼 / Brass Measuring Spoon 22,000원(품절), 참깨 볶음 오일 / Roasted Sesame Oil 19,000원(품절), 무향 고체 비누 12,000원(15,000), 워싱 코튼 티셔츠 32,000원, 스테인리스 집게 17,000원(21,000), 현미 볶음차 13,500원, 린넨 앞치마 39,000원(45,000, 품절), 코튼 워시 타월 11,000원, 올리브 비누 접시 16,000원(19,000), 울 니트 비니 29,000원, 무화과 잼 15,000원(품절)

## Files
- `design/store-number-one-home.dc.html` — 디자인 원본. 구현 대상은 `<section id="t4">` 안의 `#4a`(데스크톱), `#4b`(모바일). 스타일 값은 로직 클래스의 `theme()` 메서드에서 계산되어 인라인으로 주입됩니다 — 정확한 수치는 `theme()`을 읽으면 모두 나옵니다(단, Tweak 분기 코드는 무시하고 위 확정값 기준으로 읽으세요).
- `design/support.js` — 프로토타입 런타임. **이식 대상이 아닙니다.** 브라우저에서 원본 HTML을 열어보기 위해서만 필요합니다.

## 구현 시 유의사항
1. **결제 관련 UI를 절대 추가하지 마세요.** 체크아웃 버튼, 결제 수단 아이콘, "구매하기", 배송비 계산기 등은 이 제품에 존재하지 않습니다.
2. 홈의 모든 CTA는 최종적으로 "요청"으로 수렴합니다. 문안에서 "구매/결제" 어휘를 쓰지 마세요.
3. 한글·영문 병기는 "한글(본문 크기) + 영문(작게, 자간 넓게, muted)" 2단 규칙으로 일관되게 유지합니다.
4. border-radius 0, 그림자 최소, 색 5개 이내 — 이 절제가 디자인의 핵심입니다. 새 색이나 라운드를 추가하지 마세요.
5. 미디자인 화면(로그인 모달, 장바구니, 주문 요청 완료, 상품 상세, 관리자)은 임의 구현 전에 디자인 요청을 권합니다.
