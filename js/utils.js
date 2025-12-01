/** ===== UTILS ===== */

/**
 * イージング関数（easeInOutCubic）
 * スクロールの速度変化（加速→減速）に使用
 * 
 * @param {number} p - 進行度（0-1）
 * @returns {number} イージング後の値
 */
function ease(p) {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

/**
 * 要素までスムーズスクロールする関数
 *
 * 仕組み：
 * ・アニメーション開始位置（startY）を記録
 * ・requestAnimationFrame で毎フレーム滑らかに動かす
 * ・イージング関数で速度変化を制御
 * ・毎フレームごとに「最新の要素位置」を計算してるのでレイアウト変化に強い
 * 
 * @param {HTMLElement} el - スクロール先の要素
 * @param {number} duration - アニメーション時間（ミリ秒）
 * @param {number} scrollMargin - 固定ヘッダー分の調整マージン
 */
function smoothScrollToEl(el, duration = 1000, scrollMargin = 40) {
  // アニメーション開始位置（現在のスクロール位置）を記録
  const startY = window.scrollY;
  // アニメーション開始時刻を記録
  let start = null;

  function step(t) {
    if (!start) start = t;
    // アニメーションの進行度（0〜1）
    const p = Math.min((t - start) / duration, 1);

    // --- 目的地の再計算 ---
    // el までの距離を毎フレーム最新の情報で取得
    const targetY = window.scrollY + el.getBoundingClientRect().top - scrollMargin;

    // 最大スクロール位置を超えないように調整
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    const dest = Math.min(targetY, maxY);

    // イージングして滑らかにスクロール位置を決定
    const y = startY + (dest - startY) * ease(p);

    // 実際にスクロール
    window.scrollTo(0, y);

    // まだ完了してない場合は次のフレームで再実行
    if (p < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/**
 * 複数のプロジェクトカードの高さを揃える関数
 *
 * カード一覧で高さがバラバラだと見た目が悪いため
 * ・一度 height を auto に戻す
 * ・最大の高さを測定
 * ・全カードに最大高さを適用する
 */
function setEqualHeight() {
  const cards = document.querySelectorAll('.project-card');
  if (cards.length === 0) return;
  
  let maxHeight = 0;

  // 一旦 height を auto に戻しつつ最大高さを計測
  cards.forEach(card => {
    card.style.height = 'auto';
    if (card.offsetHeight > maxHeight) {
      maxHeight = card.offsetHeight;
    }
  });

  // 全カードに最大高さを適用
  cards.forEach(card => {
    card.style.height = maxHeight + 'px';
  });
}

/**
 * スキルカードの高さをカテゴリごとに揃える関数
 *
 * 各カテゴリ（Language、Framework、Tools）内のカードの高さを統一
 * ・各カテゴリの.skill-list__cardsごとに処理
 * ・一度 height を auto に戻す
 * ・最大の高さを測定
 * ・そのカテゴリ内の全カードに最大高さを適用する
 */
function setEqualSkillCardHeight() {
  const skillCardContainers = document.querySelectorAll('.skill-list__cards');
  
  skillCardContainers.forEach(container => {
    const cards = container.querySelectorAll('.skill-card');
    if (cards.length === 0) return;
    
    let maxHeight = 0;

    // 一旦 height を auto に戻しつつ最大高さを計測
    cards.forEach(card => {
      card.style.height = 'auto';
      if (card.offsetHeight > maxHeight) {
        maxHeight = card.offsetHeight;
      }
    });

    // そのカテゴリ内の全カードに最大高さを適用
    cards.forEach(card => {
      card.style.height = maxHeight + 'px';
    });
  });
}

