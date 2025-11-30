/**
 * スキルセクション関連の機能（tooltip, skillNote）
 */

(function () {
  // スキル評価基準の表示/非表示制御
  document.addEventListener("DOMContentLoaded", function () {
    const skillNote = document.getElementById("skillNote");
    const skillSection = document.getElementById("skill");

    if (!skillNote || !skillSection) return;

    function toggleSkillNote() {
      const rect = skillSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      skillNote.style.display = isVisible ? "block" : "none";
    }

    toggleSkillNote(); // 初期表示のため
    window.addEventListener("scroll", toggleSkillNote);
  });

  // ツールチップの表示制御
  const descriptions = {
    5: '実務レベル（何度も実装して自信あり）',
    4: '応用レベル（一通り使いこなせる）',
    3: '基礎レベル（簡単な実装ならできる）',
    2: '初級レベル（基本的な学習は終えた）',
    1: '入門レベル（初歩的な学習を行った段階）',
  };
  const tooltip = document.getElementById('tooltip');
  const starGroups = document.querySelectorAll('.skill-card__stars');

  if (!tooltip) return;

  starGroups.forEach(group => {
    const level = group.dataset.level;

    group.addEventListener('mouseenter', e => {
      tooltip.textContent = descriptions[level];
      tooltip.classList.add('show');
    });

    group.addEventListener('mousemove', (e) => {
      const pad = 10;
      const tipW = tooltip.offsetWidth || 200;
      const maxLeft = window.scrollX + window.innerWidth - tipW - pad;

      let left = e.pageX + pad;
      if (left > maxLeft) left = maxLeft;

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${e.pageY + pad}px`;
    });

    group.addEventListener('mouseleave', () => {
      tooltip.classList.remove('show');
    });
  });
})();

