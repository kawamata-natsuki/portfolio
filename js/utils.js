/**
 * 汎用ユーティリティ関数
 */

/**
 * イージング関数（easeInOutCubic）
 * @param {number} p - 進行度（0-1）
 * @returns {number} イージング後の値
 */
function ease(p) {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

/**
 * 要素までスムーズスクロール
 * @param {HTMLElement} el - スクロール先の要素
 * @param {number} duration - アニメーション時間（ミリ秒）
 * @param {number} scrollMargin - ヘッダー分のマージン（ピクセル）
 */
function smoothScrollToEl(el, duration = 1000, scrollMargin = 40) {
  const startY = window.scrollY;
  let start = null;

  function step(t) {
    if (!start) start = t;
    const p = Math.min((t - start) / duration, 1);

    // 毎フレーム、最新の目的地を再計算（レイアウト変化に強い）
    const targetY = window.scrollY + el.getBoundingClientRect().top - scrollMargin;
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    const dest = Math.min(targetY, maxY);

    const y = startY + (dest - startY) * ease(p);
    window.scrollTo(0, y);

    if (p < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/**
 * プロジェクトカードの高さを統一
 */
function setEqualHeight() {
  const cards = document.querySelectorAll('.project-card');
  let maxHeight = 0;

  cards.forEach(card => {
    card.style.height = 'auto';
    if (card.offsetHeight > maxHeight) {
      maxHeight = card.offsetHeight;
    }
  });

  cards.forEach(card => {
    card.style.height = maxHeight + 'px';
  });
}

