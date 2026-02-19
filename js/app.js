/**
 * アプリケーションの初期化処理
 * ヘッダー、アンカーリンク、カード高さ統一、スキルセクションの機能を統合
 */

(function () {

  /* =====================================
   *  ヘッダー（ハンバーガーメニュー）
   * ===================================== */
  const btn = document.querySelector('.site-header__nav-toggle'); // 開閉ボタン
  const nav = document.getElementById('globalNav');               // ドロワーメニュー本体
  const overlay = document.querySelector('[data-nav-overlay]');   // オーバーレイ
  
  // ボタン・メニュー・オーバーレイが存在する場合のみ動作させる
  if (btn && nav && overlay) {

    const TRANS_MS = 250;  // CSS transition と揃える（開閉アニメの時間）

    /**
     * メニューの開閉処理をまとめた関数
     * open = true なら開く / false なら閉じる
     */
    function setOpen(open) {
      // メニューの開閉状態を示すクラスを付け外し
      document.body.classList.toggle('nav-open', open);

      // バックグラウンドスクロール禁止
      document.body.classList.toggle('no-scroll', open);

      // A11y: ボタンの状態をスクリーンリーダーに伝える
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');

      // A11y: メニュー本体の可視性を伝える
      nav.setAttribute('aria-hidden', open ? 'false' : 'true');
    }

    // ボタンクリック → 開閉トグル
    btn.addEventListener('click', () => {
      setOpen(!document.body.classList.contains('nav-open'));
    });

    // オーバーレイクリック → 閉じる
    overlay.addEventListener('click', () => {
      setOpen(false);
    });

    // メニュー内のアンカーリンク（#〜へ移動）
    nav.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();  // 外側のアンカー処理が反応しないように

        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;

        setOpen(false); // まずメニューを閉じる

        // モバイル時だけヘッダーが高いので余白を変える
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        const scrollMargin = isMobile ? 70 : 40;

        // メニュー閉じアニメーションが終わってからスクロール発火
        setTimeout(() => {
          // 念のため no-scroll を確実に解除
          document.body.classList.remove('no-scroll');

          // utils.js のスムーズスクロール
          smoothScrollToEl(target, 1000, scrollMargin);
        }, TRANS_MS + 20);
      });
    });
  }

  /* =====================================
   *  通常アンカーリンクのスムーズスクロール
   * ===================================== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    // ハンバーガーメニューのリンクはすでに上で処理しているので除外
    if (a.closest('.site-header__nav')) return;

    a.addEventListener('click', (e) => {
      e.preventDefault();
      
      const el = document.querySelector(a.getAttribute('href'));
      if (el) {
        // PC時の標準のヘッダーぶんオフセット
        const scrollMargin = 40;
        smoothScrollToEl(el, 1000, scrollMargin);
      }
    });
  });

  /* =====================================
   *  プロジェクトカードとスキルカードの高さ統一
   * ===================================== */
  function initEqualHeight() {
    setEqualHeight();            // プロジェクトカード
    setEqualSkillCardHeight();   // スキルカード
  }

  // 読み込み完了時 & 画面サイズ変更時に再実行
  window.addEventListener('load', initEqualHeight);
  window.addEventListener('resize', initEqualHeight);

  /* =====================================
   *  スキルセクション関連の機能（tooltip, skillNote）
   * ===================================== */
  
  // スキル評価基準の表示/非表示制御
  document.addEventListener("DOMContentLoaded", function () {
    const skillNote = document.getElementById("skillNote"); // 「★評価の基準」説明枠
    const skillSection = document.getElementById("skill");  // スキルエリア

    if (!skillNote || !skillSection) return;

    /**
     * スキルエリアが画面に入ったら skillNote を表示する
     * （画面外の時は非表示）
     */
    function toggleSkillNote() {
      const rect = skillSection.getBoundingClientRect();

      // 画面内に一部でも表示されているか判定
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      skillNote.style.display = isVisible ? "block" : "none";
    }

    toggleSkillNote();  // 初期表示
    window.addEventListener("scroll", toggleSkillNote); // スクロールごとに判定
  });

  /* =====================================
   *  ツールチップの表示制御
   * ===================================== */
  
  // ツールチップの表示内容
  const descriptions = {
    5: '実務で設計〜実装を主体的に担当し、技術選定や改善提案も可能',
    4: '実務で継続的に使用し、単独で実装・利用が可能',
    3: '実務またはチーム開発で一部実装・利用経験あり',
    2: '個人開発で実装・利用経験あり',
    1: '簡易的な実装・利用経験あり',
  };
  const tooltip = document.getElementById('tooltip');                 // 表示する吹き出し
  const starGroups = document.querySelectorAll('.skill-card__stars'); // ★の集合

  if (tooltip) {
    starGroups.forEach(group => {
      const level = group.dataset.level;

      // ★にカーソルが乗ったとき
      group.addEventListener('mouseenter', e => {
        tooltip.textContent = descriptions[level]; // 説明文セット
        tooltip.classList.add('show');             // 表示
      });

      // ★上でカーソル移動中 → tooltip をマウスに追従
      group.addEventListener('mousemove', (e) => {
        const pad = 10;
        const tipW = tooltip.offsetWidth || 200;
        const maxLeft = window.scrollX + window.innerWidth - tipW - pad;

        let left = e.pageX + pad;
        if (left > maxLeft) left = maxLeft;

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${e.pageY + pad}px`;
      });

      // ★からカーソル離れたら非表示
      group.addEventListener('mouseleave', () => {
        tooltip.classList.remove('show');
      });
    });
  }
})();

