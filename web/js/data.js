/* =====================================================================
   스토어 넘버원 — 홈 화면 데이터
   - 이 파일은 "데이터"만 담습니다 (화면/동작 로직은 app.js).
   - 상품에 img 가 있으면 실제 사진, 없으면 디자인 플레이스홀더로 표시됩니다.
   - price 가 null 이면 "가격 문의"로 표시됩니다. (구매대행/결제 없는 요청 컨셉)
   - beauty 상품(d'Alba)은 list.xlsx 에서 가져온 테스트 데이터입니다.
     → 되돌리려면 FEATURED / LATEST 의 dalba 항목을 EDITORIAL_* 로 교체하세요.
   ===================================================================== */

/* 상단 카테고리 내비게이션 (hover 드롭다운) */
const MENUS = [
  { label: '뷰티', en: 'Beauty', no: '01', items: ['스킨케어', '클렌징', '메이크업', '헤어 · 바디', '향 · 퍼퓸', '선케어'] },
  { label: '의류', en: 'Clothing', no: '02', items: ['상의', '하의', '한 벌 옷', '아우터', '모자', '벨트', '신발'] },
  { label: '식품', en: 'Food', no: '03', items: ['차 · 커피', '오일 · 소스', '건과 · 곡물', '잼 · 스프레드', '선물 세트'] },
  { label: '생활 도구', en: 'Tools', no: '04', items: ['주방 도구', '청소 도구', '문구', '수납', '리넨 · 패브릭'] }
];

/* ── 추천 상품 (3열, 사진 + 설명 + 스펙) ──────────────────────────
   [TEST] d'Alba 뷰티 제품 3종으로 채웠습니다. */
const FEATURED = [
  {
    ko: '달바 비타 토닝 캡슐 크림', en: 'd\'Alba Vita Toning Capsule Cream',
    cat: '뷰티 Beauty', price: null, was: null, sold: false,
    spec: '55g · 나이아신아마이드 5%',
    note: '나이아신아마이드 5%를 담은 단지형 캡슐 크림. 결 위에 얹은 캡슐이 톤과 탄력을 정돈합니다.',
    img: 'assets/dalba-capsule-cream.png'
  },
  {
    ko: '달바 비타 캡슐 세럼', en: 'd\'Alba Vita Toning Capsule Serum',
    cat: '뷰티 Beauty', price: null, was: null, sold: false,
    spec: '100ml · 기획 세트',
    note: '비타 캡슐이 그대로 보이는 앰플 세럼. 나이아신아마이드 5% 기획 구성으로 제공됩니다.',
    img: 'assets/dalba-capsule-serum.png'
  },
  {
    ko: '달바 화이트 트러플 마스크', en: 'White Truffle Nourishing Mask',
    cat: '뷰티 Beauty', price: null, was: null, sold: false,
    spec: '20매 · 4박스',
    note: '화이트 트러플 성분의 영양 트리트먼트 마스크. 건조한 피부를 집중적으로 보습합니다.',
    img: 'assets/dalba-truffle-mask.png'
  }
];

/* ── 인기 상품 (리스트형, 랭킹) — 에디토리얼 기본 데이터 ────────── */
const POPULAR = [
  { rank: '01', ko: '무향 고체 비누', en: 'Unscented Bar Soap', cat: '뷰티', price: '12,000', was: '15,000', sold: false, ph: '비누 2개 겹침 / stacked soap' },
  { rank: '02', ko: '워싱 코튼 티셔츠', en: 'Washed Cotton Tee', cat: '의류', price: '32,000', was: null, sold: false, ph: '티셔츠 접힌 컷 / folded tee' },
  { rank: '03', ko: '스테인리스 집게', en: 'Steel Tongs', cat: '생활 도구', price: '17,000', was: '21,000', sold: false, ph: '집게 단독 / tongs on linen' },
  { rank: '04', ko: '현미 볶음차', en: 'Roasted Brown Rice Tea', cat: '식품', price: '13,500', was: null, sold: false, ph: '차 봉투 정면 / tea pouch front' },
  { rank: '05', ko: '린넨 앞치마', en: 'Linen Apron', cat: '생활 도구', price: '39,000', was: '45,000', sold: true, ph: '앞치마 걸린 컷 / hanging apron' }
];

/* ── 최신 상품 (4열) ──────────────────────────────────────────
   [TEST] 앞 2칸은 d'Alba 뷰티, 뒤 2칸은 에디토리얼 기본. */
const LATEST = [
  { ko: '달바 비타 토닝 세럼 토너', en: 'd\'Alba Vita Toning Serum Toner', cat: '뷰티', price: null, was: null, sold: false, img: 'assets/dalba-serum-toner.png' },
  { ko: '달바 퍼플 톤업 선크림', en: 'Tone-up Purple Sun Cream', cat: '뷰티', price: null, was: null, sold: false, img: 'assets/dalba-purple-sun.png' },
  { ko: '울 니트 비니', en: 'Wool Knit Beanie', cat: '의류', price: '29,000', was: null, sold: false, ph: '비니 정면 / beanie front' },
  { ko: '무화과 잼', en: 'Fig Preserve', cat: '식품', price: '15,000', was: null, sold: true, ph: '잼 병 / jam jar' }
];

/* ── 원본(에디토리얼) 데이터 — 되돌릴 때 사용 ────────────────────
   시안이 별로면 FEATURED = EDITORIAL_FEATURED, LATEST = EDITORIAL_LATEST 로 교체 */
const EDITORIAL_FEATURED = [
  { ko: '밀랍 립밤', en: 'Beeswax Lip Balm', cat: '뷰티 Beauty', price: '14,400', was: '18,000', sold: false, spec: '9g · 무향', note: '밀랍과 호호바만 넣어 향을 더하지 않았습니다. 겨울에도 굳지 않는 배합.', ph: '립밤 단독 정물, 종이 위 / lip balm on paper' },
  { ko: '리넨 오버셔츠', en: 'Linen Over Shirt', cat: '의류 Clothing', price: '48,000', was: '56,000', sold: false, spec: '3 colours · S–L', note: '두 계절을 넘기며 부드러워지는 유럽산 리넨. 남녀 공용 3사이즈.', ph: '셔츠 행어 컷, 측광 / shirt on hanger' },
  { ko: '황동 계량 스푼', en: 'Brass Measuring Spoon', cat: '생활 도구 Tools', price: '22,000', was: null, sold: true, spec: '3 pcs · 무도장', note: '쓸수록 색이 앉는 무도장 황동. 1/2, 1, 2 큰술 3점 세트.', ph: '스푼 3점 플랫레이 / spoons flat lay' }
];
const EDITORIAL_LATEST = [
  { ko: '코튼 워시 타월', en: 'Cotton Wash Towel', cat: '생활 도구', price: '11,000', was: null, sold: false, ph: '타월 접힘 / folded towel' },
  { ko: '올리브 비누 접시', en: 'Olive Soap Dish', cat: '생활 도구', price: '16,000', was: '19,000', sold: false, ph: '비누 접시 / soap dish' },
  { ko: '울 니트 비니', en: 'Wool Knit Beanie', cat: '의류', price: '29,000', was: null, sold: false, ph: '비니 정면 / beanie front' },
  { ko: '무화과 잼', en: 'Fig Preserve', cat: '식품', price: '15,000', was: null, sold: true, ph: '잼 병 / jam jar' }
];

/* ── 카테고리 (섹션 04) ──────────────────────────────────────── */
const CATEGORIES = [
  { no: '01', label: '뷰티', en: 'Beauty', sub: '스킨케어 · 클렌징 · 메이크업 · 향', ph: '뷰티 카테고리 이미지', items: ['스킨케어', '클렌징', '메이크업', '헤어 · 바디', '향 · 퍼퓸', '선케어'] },
  { no: '02', label: '의류', en: 'Clothing', sub: '상의 · 하의 · 한 벌 옷 · 모자 · 신발', ph: '의류 카테고리 이미지', items: ['상의', '하의', '한 벌 옷', '아우터', '모자', '벨트', '신발'] },
  { no: '03', label: '식품', en: 'Food', sub: '차 · 오일 · 잼 · 선물 세트', ph: '식품 카테고리 이미지', items: ['차 · 커피', '오일 · 소스', '건과 · 곡물', '잼 · 스프레드', '선물 세트'] },
  { no: '04', label: '생활 도구', en: 'Tools', sub: '주방 · 청소 · 문구 · 수납 · 패브릭', ph: '생활 도구 카테고리 이미지', items: ['주방 도구', '청소 도구', '문구', '수납', '리넨 · 패브릭'] }
];

/* ── 이용 방법 (섹션 05) ─────────────────────────────────────── */
const STEPS = [
  { no: '01', ko: '둘러보기', desc: '로그인 없이 모든 상품과 가격을 볼 수 있습니다.' },
  { no: '02', ko: 'Google 로그인', desc: '장바구니에 담을 때 Google 계정으로 한 번만 로그인합니다.' },
  { no: '03', ko: '주문 요청 보내기', desc: '장바구니에서 요청을 보내면 결제 없이 접수됩니다.' },
  { no: '04', ko: '담당자 연락', desc: '재고와 배송, 결제 방법을 확인해 평일 4시간 내 연락드립니다.' }
];

/* ── 최근 본 상품 ────────────────────────────────────────────── */
const RECENT = [
  { ko: '달바 비타 캡슐 크림', img: 'assets/dalba-capsule-cream.png' },
  { ko: '워싱 코튼 티셔츠' },
  { ko: '달바 세럼 토너', img: 'assets/dalba-serum-toner.png' },
  { ko: '현미 볶음차' },
  { ko: '무향 고체 비누' },
  { ko: '리넨 오버셔츠' }
];

/* ── 푸터 링크 ───────────────────────────────────────────────── */
const FOOTER = [
  { ko: '쇼핑', en: 'Shop', items: ['뷰티', '의류', '식품', '생활 도구', '전체 상품'] },
  { ko: '이용 안내', en: 'Guide', items: ['주문 요청 방법', '배송 · 반품', '재입고 알림', '자주 묻는 질문'] },
  { ko: '문의', en: 'Contact', items: ['카카오톡 상담', '02-1000-0001', '대량구매 · 견적', 'hello@store-no1.kr'] },
  { ko: '스토어', en: 'About', items: ['브랜드 소개', '공지사항', '개인정보 처리방침', '이용약관'] }
];

window.SN1_DATA = { MENUS, FEATURED, POPULAR, LATEST, CATEGORIES, STEPS, RECENT, FOOTER, EDITORIAL_FEATURED, EDITORIAL_LATEST };
