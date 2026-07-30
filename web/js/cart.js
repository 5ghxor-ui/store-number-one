/* =====================================================================
   스토어 넘버원 — 장바구니 페이지 동작
   - SN1Cart(cart-store.js)에서 담은 상품을 읽어 화면에 그립니다.
   - 수량 변경 · 삭제 · 주문 요청(결제 없음)을 처리합니다.
   ===================================================================== */
(function () {
  const D = window.SN1_DATA;
  const Cart = window.SN1Cart;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const won = (n) => n.toLocaleString('ko-KR') + '원';

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 1900);
  }

  function updateCount() { const el = $('#cartCount'); if (el) el.textContent = String(Cart.count()); }

  function thumb(i) {
    const inner = i.img ? `<img src="${esc(i.img)}" alt="${esc(i.ko)}">` : '';
    return `<div class="cart-thumb">${inner}</div>`;
  }

  function linePrice(i) {
    if (i.price == null) return `<span class="price-ask">가격 문의</span>`;
    const unit = Cart.parseNum(i.price);
    return `<span class="price">${won(unit * i.qty)}</span>`;
  }

  function rowHtml(i) {
    return `
      <div class="cart-row" data-id="${esc(i.id)}">
        ${thumb(i)}
        <div class="cart-info">
          <span class="kicker">${esc(i.cat)}</span>
          <span class="name">${esc(i.ko)}</span>
          ${i.en ? `<span class="meta">${esc(i.en)}</span>` : ''}
        </div>
        <div class="qty" role="group" aria-label="수량">
          <button type="button" data-act="dec" aria-label="수량 줄이기">−</button>
          <span class="qnum">${i.qty}</span>
          <button type="button" data-act="inc" aria-label="수량 늘리기">+</button>
        </div>
        <div class="cart-line">${linePrice(i)}</div>
        <button class="cart-remove" type="button" data-act="remove" aria-label="삭제">✕</button>
      </div>`;
  }

  function summaryHtml() {
    const items = Cart.read();
    const totalQty = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = Cart.subtotal();
    const ask = Cart.hasAskPrice();
    return `
      <aside class="cart-summary">
        <div class="sum-title">주문 요청 요약</div>
        <div class="sum-row"><span>담은 상품 종류</span><span class="v">${items.length}종</span></div>
        <div class="sum-row"><span>전체 수량</span><span class="v">${totalQty}개</span></div>
        <div class="sum-total">
          <span class="l">예상 금액</span>
          <span class="price">${subtotal > 0 ? won(subtotal) : '—'}</span>
        </div>
        ${ask ? `<p class="sum-note">‘가격 문의’ 상품은 담당자가 확인 후 단가를 안내드립니다. 예상 금액에는 포함되지 않았습니다.</p>` : ''}
        <p class="sum-note">실제 결제는 진행되지 않습니다. 요청을 보내면 담당자가 재고와 배송을 확인해 직접 연락드립니다.</p>
        <button class="btn-request" id="orderBtn">주문 요청하기</button>
        <a class="btn-continue" href="index.html">쇼핑 계속하기</a>
      </aside>`;
  }

  function render() {
    updateCount();
    const items = Cart.read();
    const body = $('#cartBody');
    if (!items.length) {
      body.innerHTML = `
        <div class="cart-empty">
          <span class="h3">장바구니가 비어 있습니다</span>
          <p>마음에 드는 물건을 담고, 결제 없이 주문 요청을 보내보세요.</p>
          <a class="btn-dark" href="index.html">상품 둘러보기</a>
        </div>`;
      return;
    }
    body.innerHTML = `
      <div class="cart-layout">
        <div class="cart-items">${items.map(rowHtml).join('')}</div>
        ${summaryHtml()}
      </div>`;
  }

  /* #cartBody 는 유지되고 내부 innerHTML 만 바뀌므로 위임 바인딩은 1회만 */
  function bindOnce() {
    $('#cartBody').addEventListener('click', (e) => {
      if (e.target.closest('#orderBtn')) { goOrder(); return; }
      const btn = e.target.closest('button[data-act]');
      if (!btn) return;
      const row = btn.closest('.cart-row');
      const id = row.getAttribute('data-id');
      const act = btn.getAttribute('data-act');
      const item = Cart.read().find((i) => i.id === id);
      if (!item) return;
      if (act === 'inc') Cart.setQty(id, item.qty + 1);
      else if (act === 'dec') Cart.setQty(id, item.qty - 1);
      else if (act === 'remove') Cart.remove(id);
      render();
    });
  }

  /* 주문 요청하기 → 입력폼(order.html) 으로 이동 */
  function goOrder() {
    if (!Cart.read().length) return;
    location.href = 'order.html';
  }

  function renderFooter() {
    $('#footCols').innerHTML = D.FOOTER.map((f) => `
      <div class="foot-col">
        <span class="meta">${esc(f.en)}</span>
        <span class="foot-col-ko">${esc(f.ko)}</span>
        ${f.items.map((it) => `<a href="#" class="body">${esc(it)}</a>`).join('')}
      </div>`).join('');
  }

  function init() { bindOnce(); render(); renderFooter(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
