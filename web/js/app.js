/* =====================================================================
   스토어 넘버원 — 홈 동작 (렌더링 + 상호작용)
   - 데이터는 data.js(window.SN1_DATA)에서 읽습니다.
   - 결제 로직은 없습니다. 모든 담기/요청은 "주문 요청" 흐름으로만 수렴합니다.
   ===================================================================== */
(function () {
  const D = window.SN1_DATA;
  const $ = (sel, root) => (root || document).querySelector(sel);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* 세션 상태 (프로토타입) */
  const state = { loggedIn: false, pending: null };

  /* 상품 인덱스 (담기 시 상품 정보를 찾기 위함) — 이름(ko)을 키로 사용 */
  const PRODUCTS = {};
  [].concat(D.FEATURED, D.POPULAR, D.LATEST).forEach((p) => {
    PRODUCTS[p.ko] = { id: p.ko, ko: p.ko, en: p.en, cat: p.cat, price: p.price, img: p.img || '' };
  });

  /* ── 공통 조각 ─────────────────────────────────────────── */
  function imgHtml(p, extraClass) {
    const cls = 'imgbox' + (extraClass ? ' ' + extraClass : '');
    const inner = p.img
      ? `<img src="${esc(p.img)}" alt="${esc(p.ko)}" loading="lazy">`
      : `<span class="ph">${esc(p.ph || '제품 이미지 / product shot')}</span>`;
    const overlay = p.sold ? `<span class="overlay">SOLD OUT</span>` : '';
    return `<div class="${cls}">${inner}${overlay}</div>`;
  }

  function priceHtml(p) {
    if (p.price == null) return `<div class="price-row"><span class="price-ask">가격 문의</span></div>`;
    const was = p.was ? `<span class="was">${esc(p.was)}원</span>` : '';
    return `<div class="price-row"><span class="price">${esc(p.price)}원</span>${was}</div>`;
  }

  function ctaHtml(p) {
    return p.sold
      ? `<button class="cta-sold" data-sold="1">재입고 알림 요청</button>`
      : `<button class="cta" data-name="${esc(p.ko)}">장바구니 담기</button>`;
  }

  function soldLabel(p) { return p.sold ? `<span class="sold-label">SOLD OUT</span>` : ''; }

  /* ── 상품 카드 (패널) ──────────────────────────────────── */
  function productCard(p, withNote) {
    const note = withNote && p.note ? `<p class="body">${esc(p.note)}</p>` : '';
    const metaBits = [p.en, p.spec].filter(Boolean).join(' · ');
    const meta = metaBits ? `<span class="meta">${esc(metaBits)}</span>` : '';
    return `
      <article class="card">
        <div class="card-imgpad">${imgHtml(p)}</div>
        <div class="card-body">
          <span class="kicker">${esc(p.cat)}</span>
          <div class="card-namerow"><span class="name">${esc(p.ko)}</span>${soldLabel(p)}</div>
          ${meta}
          ${note}
          ${priceHtml(p)}
          ${ctaHtml(p)}
        </div>
      </article>`;
  }

  /* ── 인기 상품 썸네일 (rankimg 는 자체 배경/비율 사용) ──── */
  function rankImgHtml(p) {
    const inner = p.img ? `<img src="${esc(p.img)}" alt="${esc(p.ko)}" loading="lazy">` : '';
    const overlay = p.sold ? `<span class="overlay">SOLD OUT</span>` : '';
    return `<div class="rankimg">${inner}${overlay}</div>`;
  }

  /* ── 렌더 ──────────────────────────────────────────────── */
  function renderNav() {
    $('#catNav').innerHTML = D.MENUS.map((m) => `
      <div class="navitem" tabindex="0">
        <div class="navlabel"><span class="navko">${esc(m.label)}</span><span class="naven">${esc(m.en)}</span></div>
        <div class="drop">${m.items.map((it) => `<a href="#" class="dropitem">${esc(it)}</a>`).join('')}</div>
      </div>`).join('');
  }

  function renderProducts() {
    $('#featGrid').innerHTML = D.FEATURED.map((p) => productCard(p, true)).join('');
    $('#freshGrid').innerHTML = D.LATEST.map((p) => productCard(p, false)).join('');
    // 인기 상품: rankImg 를 정확히 넣기 위해 직접 조립
    $('#popList').innerHTML = D.POPULAR.map((p) => `
      <div class="rankrow">
        <span class="rankno">${esc(p.rank)}</span>
        ${rankImgHtml(p)}
        <div class="rank-info">
          <span class="kicker">${esc(p.cat)}</span>
          <div class="card-namerow"><span class="name">${esc(p.ko)}</span>${soldLabel(p)}</div>
          <span class="meta">${esc(p.en)}</span>
        </div>
        <div class="rank-price">
          ${p.price == null ? '<span class="price-ask">가격 문의</span>' : `<span class="price">${esc(p.price)}원</span>${p.was ? `<span class="was">${esc(p.was)}원</span>` : ''}`}
        </div>
        ${ctaHtml(p)}
      </div>`).join('');
  }

  function renderCategories() {
    $('#catRows').innerHTML = D.CATEGORIES.map((c) => `
      <div class="catrow">
        <span class="secno">${esc(c.no)}</span>
        <div class="cat-info">
          <span class="h3">${esc(c.label)}</span>
          <span class="meta">${esc(c.en)}</span>
          <span class="body">${esc(c.sub)}</span>
        </div>
        <div class="chips">${c.items.map((it) => `<a href="#" class="chip">${esc(it)}</a>`).join('')}</div>
        <div class="imgbox"><span class="ph">${esc(c.ph)}</span></div>
      </div>`).join('');
  }

  function renderSteps() {
    $('#stepRow').innerHTML = D.STEPS.map((s) => `
      <div class="step">
        <span class="stepno">${esc(s.no)}</span>
        <span class="h3">${esc(s.ko)}</span>
        <span class="body">${esc(s.desc)}</span>
      </div>`).join('');
  }

  function renderRecent() {
    $('#recentGrid').innerHTML = D.RECENT.map((r) => `
      <a href="#" class="recent-item">
        ${r.img ? `<div class="imgbox"><img src="${esc(r.img)}" alt="${esc(r.ko)}" loading="lazy"></div>` : `<div class="imgbox"></div>`}
        <span class="body">${esc(r.ko)}</span>
      </a>`).join('');
  }

  function renderFooter() {
    $('#footCols').innerHTML = D.FOOTER.map((f) => `
      <div class="foot-col">
        <span class="meta">${esc(f.en)}</span>
        <span class="foot-col-ko">${esc(f.ko)}</span>
        ${f.items.map((it) => `<a href="#" class="body">${esc(it)}</a>`).join('')}
      </div>`).join('');
  }

  function renderMobMenu() {
    const box = $('#mobMenu');
    box.innerHTML = '<h4>STORE Nº1</h4>' + D.MENUS.map((m) => `
      <div class="mm-cat">
        <span>${esc(m.label)} · ${esc(m.en)}</span>
        <div class="mm-sub">${m.items.map((it) => `<a href="#">${esc(it)}</a>`).join('')}</div>
      </div>`).join('');
  }

  /* ── 상호작용 ──────────────────────────────────────────── */
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), 1900);
  }

  function updateCart() { $('#cartCount').textContent = String(window.SN1Cart.count()); }

  function reflectAuth() {
    const link = $('.js-login');
    if (!link) return;
    const u = window.SN1Auth.get();
    if (u) { link.textContent = u.name + ' 님'; link.classList.remove('js-login'); }
  }

  function openLogin() { $('#loginModal').classList.add('open'); }
  function closeLogin() { $('#loginModal').classList.remove('open'); }

  function addToCart(name) {
    const prod = PRODUCTS[name];
    if (!prod) return;
    window.SN1Cart.add(prod);
    updateCart();
    toast(`장바구니에 담았습니다 · ${name}`);
  }

  function handleCtaClick(e) {
    const btn = e.target.closest('.cta, .cta-sold');
    if (!btn) return;
    if (btn.classList.contains('cta-sold')) { toast('재입고 알림을 신청했습니다'); return; }
    const name = btn.getAttribute('data-name') || '상품';
    if (!state.loggedIn) { state.pending = name; openLogin(); return; }
    addToCart(name);
  }

  function bind() {
    document.body.addEventListener('click', handleCtaClick);

    // 로그인 모달
    document.querySelectorAll('.js-login').forEach((el) =>
      el.addEventListener('click', (e) => { e.preventDefault(); openLogin(); }));
    $('#closeLogin').addEventListener('click', closeLogin);
    $('#loginModal').addEventListener('click', (e) => { if (e.target.id === 'loginModal') closeLogin(); });
    $('#doLogin').addEventListener('click', () => {
      window.SN1Auth.set(window.SN1Auth.demoUser());
      state.loggedIn = true;
      reflectAuth();
      closeLogin();
      if (state.pending) { addToCart(state.pending); state.pending = null; }
      else toast('로그인되었습니다');
    });

    // 모바일 메뉴
    $('#hamburger').addEventListener('click', () => $('#mobMenuBack').classList.add('open'));
    $('#mobMenuBack').addEventListener('click', (e) => { if (e.target.id === 'mobMenuBack') e.currentTarget.classList.remove('open'); });

    // Esc 로 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { closeLogin(); $('#mobMenuBack').classList.remove('open'); }
    });

    // 다른 탭/페이지에서 장바구니가 바뀌면 카운트 갱신
    document.addEventListener('sn1cart:change', updateCart);
    window.addEventListener('storage', updateCart);
  }

  /* ── 시작 ──────────────────────────────────────────────── */
  function init() {
    state.loggedIn = window.SN1Auth.isLoggedIn();
    renderNav(); renderProducts(); renderCategories();
    renderSteps(); renderRecent(); renderFooter(); renderMobMenu();
    updateCart(); reflectAuth(); bind();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
