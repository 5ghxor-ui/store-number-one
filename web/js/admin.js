/* =====================================================================
   스토어 넘버원 — 관리자 페이지 동작
   - 사용자가 보낸 주문 요청(SN1Orders)을 읽어 대시보드/목록으로 보여주고,
     상태 변경과 내부 메모를 처리합니다.
   ===================================================================== */
(function () {
  const Orders = window.SN1Orders;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const won = (n) => n.toLocaleString('ko-KR') + '원';
  const parseNum = (p) => { if (p == null) return 0; const n = parseInt(String(p).replace(/[^0-9]/g, ''), 10); return isNaN(n) ? 0 : n; };

  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 1900);
  }

  function fmtDate(iso) {
    const d = new Date(iso);
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  function renderMetrics() {
    const s = Orders.stats();
    const cards = [
      { n: s.total, l: '전체 주문 요청', accent: false },
      { n: s.today, l: '오늘 접수', accent: false },
      { n: s.pending, l: '처리 대기 (접수 대기)', accent: true },
      { n: s.done, l: '전달 완료', accent: false }
    ];
    $('#metrics').innerHTML = cards.map((c) =>
      `<div class="metric"><span class="n${c.accent ? ' accent' : ''}">${c.n}</span><span class="l">${c.l}</span></div>`).join('');
  }

  function statusSelect(o) {
    const opts = Orders.STATUSES.map((s) => `<option value="${esc(s)}"${s === o.status ? ' selected' : ''}>${esc(s)}</option>`).join('');
    const cls = o.status === '접수 대기' ? ' status-대기' : '';
    return `<select class="status-select${cls}" data-id="${esc(o.id)}">${opts}</select>`;
  }

  function itemsSummary(o) {
    const first = o.items[0] ? o.items[0].ko : '';
    const more = o.items.length > 1 ? ` 외 ${o.items.length - 1}종` : '';
    const qty = o.items.reduce((n, i) => n + i.qty, 0);
    return `${esc(first)}${more} · ${qty}개`;
  }

  function detailHtml(o) {
    const items = o.items.map((i) => `
      <div class="detail-item">
        ${i.img ? `<img class="di-thumb" src="${esc(i.img)}" alt="">` : '<span class="di-thumb"></span>'}
        <div><div class="di-name">${esc(i.ko)}</div><div class="di-meta">${esc(i.en || '')}</div></div>
        <span class="di-meta">× ${i.qty}</span>
        <span>${i.price == null ? '가격 문의' : won(parseNum(i.price) * i.qty)}</span>
      </div>`).join('');
    const od = o.orderer || {};
    const acc = o.account ? `${esc(o.account.email)}` : '비로그인';
    const hist = o.history.map((h) => `${esc(h.status)} · ${fmtDate(h.at)}`).join('<br>');
    return `
      <div class="order-detail">
        <div class="detail-grid">
          <div class="detail-items">${items}
            <div class="detail-row" style="padding-top:12px"><span class="dl">예상 금액</span><span class="dv">${o.estimatedTotal > 0 ? won(o.estimatedTotal) : '—'}</span>${o.hasAsk ? ' <span class="di-meta">(가격 문의 상품 별도)</span>' : ''}</div>
          </div>
          <div class="detail-side">
            <div class="detail-row"><span class="dl">주문자</span><span class="dv">${esc(od.name || '')}</span></div>
            <div class="detail-row"><span class="dl">연락처</span><span class="dv">${esc(od.contact || '')}</span></div>
            <div class="detail-row"><span class="dl">Google 계정</span>${acc}</div>
            <div class="detail-row"><span class="dl">배송지 · 수령 방법</span>${esc(od.method || '')}</div>
            <div class="detail-row"><span class="dl">요청사항</span>${esc(od.request || '') || '<span class="di-meta">없음</span>'}</div>
            <div class="detail-row"><span class="dl">상태 이력</span><span class="history">${hist}</span></div>
            <div class="memo-box">
              <span class="dl" style="font:400 9.5px/1.4 Archivo,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)">내부 메모 (사용자 비공개)</span>
              <textarea data-memo="${esc(o.id)}" placeholder="담당자 확인 메모">${esc(o.memo || '')}</textarea>
              <button class="memo-save" data-memo-save="${esc(o.id)}">메모 저장</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  function render() {
    renderMetrics();
    const list = Orders.read();
    const box = $('#orders');
    if (!list.length) {
      box.innerHTML = `<div class="cart-empty"><span class="h3">아직 접수된 주문 요청이 없습니다</span><p>스토어에서 상품을 담아 주문 요청을 보내면 여기에 표시됩니다.</p><a class="btn-dark" href="index.html">스토어로 가기</a></div>`;
      return;
    }
    box.innerHTML = list.map((o) => `
      <div class="order-card" data-card="${esc(o.id)}">
        <div class="order-head">
          <span class="order-id">${esc(o.id)}</span>
          <div class="order-orderer"><span class="who">${esc(o.orderer.name)}</span><span class="sum">${itemsSummary(o)}</span></div>
          <span class="order-contact">${esc(o.orderer.contact)}</span>
          <span class="order-total">${o.estimatedTotal > 0 ? won(o.estimatedTotal) : '가격 문의'}<br><span class="di-meta">${fmtDate(o.createdAt)}</span></span>
          ${statusSelect(o)}
        </div>
        ${detailHtml(o)}
      </div>`).join('');
  }

  function bind() {
    const box = $('#orders');
    // 카드 펼치기 (상태 select / 메모는 제외)
    box.addEventListener('click', (e) => {
      if (e.target.closest('.status-select') || e.target.closest('.order-detail')) return;
      const head = e.target.closest('.order-head');
      if (!head) return;
      head.parentElement.classList.toggle('open');
    });
    // 상태 변경
    box.addEventListener('change', (e) => {
      const sel = e.target.closest('.status-select');
      if (!sel) return;
      const card = sel.closest('.order-card');
      const open = card && card.classList.contains('open');
      Orders.setStatus(sel.getAttribute('data-id'), sel.value);
      render();
      if (open) { const c = $('.order-card[data-card="' + CSS.escape(sel.getAttribute('data-id')) + '"]'); if (c) c.classList.add('open'); }
      toast('상태를 변경했습니다 → ' + sel.value);
    });
    // 메모 저장
    box.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-memo-save]');
      if (!btn) return;
      const id = btn.getAttribute('data-memo-save');
      const ta = $('textarea[data-memo="' + CSS.escape(id) + '"]');
      Orders.setMemo(id, ta ? ta.value : '');
      toast('메모를 저장했습니다');
    });
    // 다른 탭에서 새 요청이 들어오면 갱신
    window.addEventListener('storage', render);
    document.addEventListener('sn1orders:change', () => renderMetrics());
  }

  function init() { render(); bind(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
