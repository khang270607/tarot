/**
 * Main script: hiệu ứng Starfield canvas, mobile menu, initialization
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Khởi tạo canvas hiệu ứng vũ trụ sao lấp lánh (Starfield)
  initStarCanvas();

  // 2. Mobile Menu toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
  }

  // 3. Khởi tạo module tùy theo trang
  if (document.getElementById('reading-section')) {
    TarotReadingApp.init();
  }

  if (document.getElementById('tarot-detail-container')) {
    TarotDetailApp.init();
  }
});

function initStarCanvas() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const stars = [];
  const starCount = Math.min(120, Math.floor((width * height) / 12000));

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
      star.alpha += star.speed * star.direction;
      if (star.alpha > 0.9) {
        star.alpha = 0.9;
        star.direction = -1;
      } else if (star.alpha < 0.15) {
        star.alpha = 0.15;
        star.direction = 1;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${star.alpha})`;
      ctx.shadowBlur = star.size * 3;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}
