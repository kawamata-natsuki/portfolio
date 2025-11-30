/**
 * ヘッダー関連の機能（ハンバーガーメニュー）
 */

(function () {
  const btn = document.querySelector('.site-header__nav-toggle');
  const nav = document.getElementById('globalNav');
  const overlay = document.querySelector('[data-nav-overlay]');
  if (!btn || !nav || !overlay) return;

  const TRANS_MS = 250; // CSS の transition と合わせる

  function setOpen(open) {
    document.body.classList.toggle('nav-open', open);
    document.body.classList.toggle('no-scroll', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  // ハンバーガークリック → nav-open を付与/削除
  btn.addEventListener('click', () => {
    setOpen(!document.body.classList.contains('nav-open'));
  });

  // overlay クリック → nav-open を削除
  overlay.addEventListener('click', () => {
    setOpen(false);
  });

  // nav 本体クリック時はイベントをバブリングさせず閉じないようにする
  nav.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // ドロワーメニュー内のリンク
  nav.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation(); // グローバルのハンドラを止める

      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;

      setOpen(false); // 先に閉じる

      // モバイル時のヘッダー高さを考慮（70px）
      const isMobile = window.matchMedia('(max-width: 639px)').matches;
      const scrollMargin = isMobile ? 70 : 40;

      setTimeout(() => {
        // body.no-scroll を確実に解除
        document.body.classList.remove('no-scroll');

        // utils.js の smoothScrollToEl 関数を再利用
        smoothScrollToEl(target, 1000, scrollMargin);
      }, TRANS_MS + 20); // ドロワーが閉じきってからスクロール
    });
  });
})();

