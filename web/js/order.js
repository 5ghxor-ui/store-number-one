/* =====================================================================
   스토어 넘버원 — 주문 요청 입력폼 동작
   - 장바구니 상품을 요약으로 보여주고, 주문자 정보를 입력받아
     주문 요청(결제 없음)을 생성합니다. → 관리자 페이지로 전달됩니다.
   ===================================================================== */
(function () {
  const D = window.SN1_DATA;
  const Cart = window.SN1Cart;
  const Auth = window.SN1Auth;
  const Orders = window.SN1Orders;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const won = (n) => n.toLocaleString('ko-KR') + '원';

  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 1900);
  }

  function summaryHtml() {
    const items = Cart.read();
    const totalQty = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = Cart.subtotal();
    const ask = Cart.hasAskPrice();
    const rows = items.map((i) => `
      <div class="review-item">
        <span class="r-name">${esc(i.ko)} <span class="r-qty">× ${i.qty}</span></span>
        <span>${i.price == null ? '<span class="price-ask">가격 문의</span>' : won(Cart.parseNum(i.price) * i.qty)}</span>
      </div>`).join('');
    return `
      <aside class="cart-summary">
        <div class="sum-title">요청 상품 확인</div>
        <div class="review-list">${rows}</div>
        <div class="sum-row" style="padding-top:12px"><span>전체 수량</span><span class="v">${totalQty}개</span></div>
        <div class="sum-total"><span class="l">예상 금액</span><span class="price">${subtotal > 0 ? won(subtotal) : '—'}</span></div>
        ${ask ? `<p class="sum-note">‘가격 문의’ 상품은 담당자 확인 후 단가를 안내드립니다.</p>` : ''}
        <p class="sum-note">전송하면 주문 요청이 <strong>접수 대기</strong>로 등록됩니다. 결제는 진행되지 않습니다.</p>
        <button class="btn-request" id="submitBtn">주문 요청 전송</button>
        <a class="btn-continue" href="cart.html">장바구니로 돌아가기</a>
      </aside>`;
  }

  function formHtml(user) {
    const acc = user ? `
      <div class="account-box">
        <span class="meta">Google 계정</span>
        <span class="acc-name">${esc(user.name)}</span>
        <span class="acc-email">${esc(user.email)}</span>
      </div>` : '';
    const val = (v) => v ? ` value="${esc(v)}"` : '';
    return `
      <div class="form-fields">
        ${acc}
        <div class="field" data-k="name">
          <span class="flabel"><span class="ko">주문자 이름 <span class="req">*</span></span><span class="en">Name</span></span>
          <input type="text" id="f_name"${val(user && user.name)} placeholder="받으실 분 성함" />
        </div>
        <div class="field" data-k="contact">
          <span class="flabel"><span class="ko">연락처 <span class="req">*</span></span><span class="en">Contact</span></span>
          <input type="tel" id="f_contact" placeholder="010-0000-0000" />
        </div>
        <div class="field" data-k="email">
          <span class="flabel"><span class="ko">이메일</span><span class="en">Email</span></span>
          <input type="email" id="f_email"${val(user && user.email)} placeholder="example@email.com" />
          <span class="fnote">Google 계정 정보로 자동 입력되었습니다. 필요하면 수정하세요.</span>
        </div>
        <div class="field" data-k="method">
          <span class="flabel"><span class="ko">배송지 또는 수령 방법 <span class="req">*</span></span><span class="en">Delivery</span></span>
          <textarea id="f_method" placeholder="받으실 주소, 또는 방문 수령 · 퀵 등 원하시는 수령 방법을 적어주세요."></textarea>
        </div>
        <div class="field" data-k="request">
          <span class="flabel"><span class="ko">요청사항</span><span class="en">Note</span></span>
          <textarea id="f_request" placeholder="색상·수량·일정 등 담당자에게 전할 내용을 자유롭게 적어주세요. (선택)"></textarea>
        </div>
      </div>`;
  }

  function markInvalid(key, bad) {
    const f = document.querySelector('.field[data-k="' + key + '"]');
    if (f) f.classList.toggle('invalid', !!bad);
  }

  function submit() {
    const name = $('#f_name').value.trim();
    const contact = $('#f_contact').value.trim();
    const email = $('#f_email').value.trim();
    const method = $('#f_method').value.trim();
    const request = $('#f_request').value.trim();

    let ok = true;
    [['name', name], ['contact', contact], ['method', method]].forEach(([k, v]) => {
      const bad = !v; markInvalid(k, bad); if (bad) ok = false;
    });
    if (!ok) { toast('별표(*) 항목을 입력해주세요'); return; }

    const items = Cart.read().map((i) => ({ ko: i.ko, en: i.en, cat: i.cat, price: i.price, qty: i.qty, img: i.img }));
    const rec = Orders.create({
      orderer: { name, contact, email, method, request },
      account: Auth.get(),
      items,
      estimatedTotal: Cart.subtotal(),
      hasAsk: Cart.hasAskPrice()
    });
    Cart.clear();
    showDone(rec, items);
  }

  function showDone(rec, items) {
    const totalQty = items.reduce((n, i) => n + i.qty, 0);
    $('#orderSection').innerHTML = `
      <div class="done-box">
        <span class="secno">REQUEST RECEIVED · ${esc(rec.id)}</span>
        <h2 class="h2">주문 요청이 접수되었습니다</h2>
        <p>요청번호 <strong>${esc(rec.id)}</strong> · 상품 ${items.length}종 · 총 ${totalQty}개가 <strong>접수 대기</strong> 상태로 등록되었습니다. 담당자가 재고와 배송, 결제 방법을 확인해 평일 4시간 내 <strong>${esc(rec.orderer.name)}</strong> 님께 연락드립니다. 결제는 진행되지 않았습니다.</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">
          <a class="btn-dark" href="index.html">쇼핑 계속하기</a>
          <a class="btn-ghost" href="admin.html">관리자 페이지에서 확인</a>
        </div>
      </div>`;
  }

  function renderFooter() {
    $('#footCols').innerHTML = D.FOOTER.map((f) => `
      <div class="foot-col">
        <span class="meta">${esc(f.en)}</span>
        <span class="foot-col-ko">${esc(f.ko)}</span>
        ${f.items.map((it) => `<a href="#" class="body">${esc(it)}</a>`).join('')}
      </div>`).join('');
  }

  function init() {
    renderFooter();
    if (!Cart.read().length) {
      $('#orderBody').innerHTML = `
        <div class="cart-empty">
          <span class="h3">요청할 상품이 없습니다</span>
          <p>장바구니에 상품을 먼저 담아주세요.</p>
          <a class="btn-dark" href="index.html">상품 둘러보기</a>
        </div>`;
      return;
    }
    const user = Auth.get();
    $('#orderBody').innerHTML = `<div class="form-layout">${formHtml(user)}${summaryHtml()}</div>`;
    $('#submitBtn').addEventListener('click', submit);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
