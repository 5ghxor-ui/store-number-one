/* =====================================================================
   스토어 넘버원 — 장바구니 저장 (공용 모듈)
   - 홈(app.js)과 장바구니(cart.js)가 함께 사용합니다.
   - 브라우저 localStorage 에 저장 → 페이지를 이동해도 유지됩니다.
   - 실제 서비스에서는 이 부분을 서버 DB(사용자별 장바구니)로 교체합니다.
   ===================================================================== */
(function () {
  const KEY = 'sn1_cart_v1';

  function parseNum(price) {
    if (price == null) return 0;
    const n = parseInt(String(price).replace(/[^0-9]/g, ''), 10);
    return isNaN(n) ? 0 : n;
  }

  const Cart = {
    read() {
      try { return JSON.parse(localStorage.getItem(KEY)) || []; }
      catch (e) { return []; }
    },
    write(items) {
      localStorage.setItem(KEY, JSON.stringify(items));
      document.dispatchEvent(new CustomEvent('sn1cart:change'));
    },
    /* 담긴 상품 총 수량 */
    count() { return this.read().reduce((n, i) => n + i.qty, 0); },
    /* 상품 담기 (같은 상품이면 수량 +1) */
    add(prod) {
      const items = this.read();
      const found = items.find((i) => i.id === prod.id);
      if (found) found.qty += 1;
      else items.push({ id: prod.id, ko: prod.ko, en: prod.en || '', cat: prod.cat || '', price: prod.price == null ? null : prod.price, img: prod.img || '', qty: 1 });
      this.write(items);
    },
    setQty(id, qty) {
      let items = this.read();
      if (qty <= 0) { items = items.filter((i) => i.id !== id); }
      else { const f = items.find((i) => i.id === id); if (f) f.qty = qty; }
      this.write(items);
    },
    remove(id) { this.write(this.read().filter((i) => i.id !== id)); },
    clear() { this.write([]); },
    /* 예상 금액 (가격이 있는 상품만 합산) */
    subtotal() { return this.read().reduce((s, i) => s + parseNum(i.price) * i.qty, 0); },
    /* '가격 문의' 상품이 하나라도 있나 */
    hasAskPrice() { return this.read().some((i) => i.price == null); },
    parseNum
  };

  window.SN1Cart = Cart;
})();
