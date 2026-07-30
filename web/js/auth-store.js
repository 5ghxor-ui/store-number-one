/* =====================================================================
   스토어 넘버원 — 로그인 사용자 저장 (공용, 프로토타입)
   - 실제 서비스에서는 Google OAuth 세션으로 교체합니다.
   - 지금은 "Google로 계속하기" 를 누르면 아래 더미 계정으로 로그인됩니다.
   ===================================================================== */
(function () {
  const KEY = 'sn1_user_v1';
  const Auth = {
    get() { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { return null; } },
    set(user) { localStorage.setItem(KEY, JSON.stringify(user)); document.dispatchEvent(new CustomEvent('sn1auth:change')); },
    logout() { localStorage.removeItem(KEY); document.dispatchEvent(new CustomEvent('sn1auth:change')); },
    isLoggedIn() { return !!this.get(); },
    /* 더미 Google 계정 (프로토타입) */
    demoUser() { return { name: '스토어 회원', email: '5ghxor@gmail.com' }; }
  };
  window.SN1Auth = Auth;
})();
