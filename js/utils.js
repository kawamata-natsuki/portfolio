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

function initImageModal() {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.querySelector('.image-modal__close');
  const zoomImages = document.querySelectorAll('[data-zoom]');

  if (!modal || !modalImg) return;

  let scale = 1;
  let startX = 0;
  let startY = 0;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let initialDistance = 0;
  let initialScale = 1;

  function updateTransform() {
    clampPosition();
    modalImg.style.transform =
      `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function resetTransform() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
    updateCursor();
  }

  function updateCursor() {
    if (scale > 1) {
      modalImg.style.cursor = isDragging ? 'grabbing' : 'grab';
    } else {
      modalImg.style.cursor = 'default';
    }
  }

  // 画像の位置をクランプする関数
  function clampPosition() {
    const rect = modalImg.getBoundingClientRect();
  
    const imgWidth = rect.width;
    const imgHeight = rect.height;
  
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
  
    const maxX = Math.max(0, (imgWidth - containerWidth) / 2);
    const maxY = Math.max(0, (imgHeight - containerHeight) / 2);
  
    translateX = Math.min(maxX, Math.max(-maxX, translateX));
    translateY = Math.min(maxY, Math.max(-maxY, translateY));
  }

  // ピンチズームの距離を計算する関数（ピンチズーム用）
  function getDistance(touch1, touch2) {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // ピンチズーム
  modalImg.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      initialDistance = getDistance(e.touches[0], e.touches[1]);
      initialScale = scale;
    }
  });

  // 画像クリックでモーダル開く
  zoomImages.forEach(img => {
    img.addEventListener('click', () => {
      modal.classList.add('show');
      modalImg.src = img.src;
      resetTransform();
    });
  });

  // ダブルクリックでズーム
  modalImg.addEventListener('dblclick', (e) => {

    const rect = modalImg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
  
    const prevScale = scale;
  
    if (scale === 1) {
      scale = 2;
    } else {
      scale = 1;
      translateX = 0;
      translateY = 0;
      updateTransform();
      updateCursor();
      return;
    }
  
    const scaleRatio = scale / prevScale;
  
    translateX -= (mouseX - translateX) * (scaleRatio - 1);
    translateY -= (mouseY - translateY) * (scaleRatio - 1);
  
    updateTransform();
    updateCursor();
  });

  // マウスドラッグ
  modalImg.addEventListener('mousedown', (e) => {
    if (scale <= 1) return;
  
    e.preventDefault();  // ← これ追加（超重要）
  
    isDragging = true;
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
    modalImg.classList.add('dragging');
    updateCursor();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    modalImg.classList.remove('dragging');
    updateCursor();
  });

  // ホイールズーム
  modalImg.addEventListener('wheel', (e) => {
    e.preventDefault();
  
    const rect = modalImg.getBoundingClientRect();
  
    // マウス位置（画像内相対）
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
  
    const prevScale = scale;
  
    // 拡大率計算
    const delta = -e.deltaY * 0.001;
    scale += delta;
    scale = Math.min(Math.max(1, scale), 4);
  
    const scaleRatio = scale / prevScale;
  
    // 位置補正
    translateX -= (mouseX - translateX) * (scaleRatio - 1);
    translateY -= (mouseY - translateY) * (scaleRatio - 1);
  
    updateTransform();
    updateCursor();
  });

  // ピンチズーム
  modalImg.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
  
      const newDistance = getDistance(e.touches[0], e.touches[1]);
      const scaleFactor = newDistance / initialDistance;
  
      scale = Math.min(Math.max(1, initialScale * scaleFactor), 4);
  
      updateTransform();
    }
  });

  // --- 1本指ドラッグ（スマホ） ---
  modalImg.addEventListener('touchstart', (e) => {
    if (scale <= 1) return;
  
    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
      updateCursor();
    }
  });
  
  modalImg.addEventListener('touchmove', (e) => {
    if (!isDragging || scale <= 1 || e.touches.length !== 1) return;
  
    e.preventDefault(); // ← 超重要（スクロール防止）
  
    translateX = e.touches[0].clientX - startX;
    translateY = e.touches[0].clientY - startY;
    updateTransform();
  });
  
  modalImg.addEventListener('touchend', () => {
    isDragging = false;
    updateCursor();
  });

  // 閉じる
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    resetTransform();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      resetTransform();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.classList.remove('show');
      resetTransform();
    }
  });
}

// 年を表示
document.getElementById("year").textContent = new Date().getFullYear();