/* =====================================================================
   스토어 넘버원 — 주문 요청 저장 (공용)
   - 사용자가 보낸 주문 요청을 저장하고, 관리자 페이지가 이를 읽습니다.
   - 상품명·가격은 "요청 당시 값"을 그대로 저장(스냅샷)합니다.
   - 실제 서비스에서는 서버 DB + 관리자 권한 검증으로 교체합니다.
   ===================================================================== */
(function () {
  const KEY = 'sn1_orders_v1';
  const STATUSES = ['접수 대기', '확인 완료', '연락 완료', '준비 중', '전달 완료', '취소'];

  function nowISO() { return new Date().toISOString(); }

  const Orders = {
    STATUSES,
    read() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } },
    write(list) { localStorage.setItem(KEY, JSON.stringify(list)); document.dispatchEvent(new CustomEvent('sn1orders:change')); },

    /* 주문 요청 생성 → 요청번호 반환 */
    create(order) {
      const list = this.read();
      const year = new Date().getFullYear();
      const seq = String(list.length + 1).padStart(4, '0');
      const rec = {
        id: 'R' + year + '-' + seq,
        status: '접수 대기',
        createdAt: nowISO(),
        orderer: order.orderer,          // {name, contact, email, method, request}
        account: order.account || null,  // 로그인 Google 계정
        items: order.items,              // 스냅샷 [{ko,en,cat,price,qty,img}]
        estimatedTotal: order.estimatedTotal,
        hasAsk: order.hasAsk,
        memo: '',
        history: [{ status: '접수 대기', at: nowISO() }]
      };
      list.unshift(rec);
      this.write(list);
      return rec;
    },

    get(id) { return this.read().find((o) => o.id === id) || null; },

    setStatus(id, status) {
      const list = this.read();
      const o = list.find((x) => x.id === id);
      if (!o || o.status === status) return;
      o.status = status;
      o.history.push({ status, at: nowISO() });
      this.write(list);
    },

    setMemo(id, memo) {
      const list = this.read();
      const o = list.find((x) => x.id === id);
      if (!o) return;
      o.memo = memo;
      this.write(list);
    },

    /* 대시보드용 집계 */
    stats() {
      const list = this.read();
      const today = new Date().toDateString();
      return {
        total: list.length,
        pending: list.filter((o) => o.status === '접수 대기').length,
        today: list.filter((o) => new Date(o.createdAt).toDateString() === today).length,
        done: list.filter((o) => o.status === '전달 완료').length
      };
    }
  };

  window.SN1Orders = Orders;
})();
