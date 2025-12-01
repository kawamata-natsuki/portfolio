/**
 * メインの初期化処理（アンカーリンクのスムーススクロール、プロジェクトカードとスキルカードの高さ統一）
 */

(function () {
  // アンカーリンクのスムーススクロール
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    // ハンバーガーメニュー内のリンクはここでは処理しない
    if (a.closest('.site-header__nav')) return;

    a.addEventListener('click', (e) => {
      e.preventDefault();
      const el = document.querySelector(a.getAttribute('href'));
      if (el) {
        const scrollMargin = 40; // ヘッダー分
        smoothScrollToEl(el, 1000, scrollMargin);
      }
    });
  });

  // プロジェクトカードとスキルカードの高さ統一
  function initEqualHeight() {
    setEqualHeight();
    setEqualSkillCardHeight();
  }

  window.addEventListener('load', initEqualHeight);
  window.addEventListener('resize', initEqualHeight);
})();

