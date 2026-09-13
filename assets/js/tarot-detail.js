/**
 * Quản lý trang chi tiết và danh mục lá bài (tarot.html)
 */
const TarotDetailApp = {
  cards: [],
  currentCard: null,

  async init() {
    const data = await TarotDataLoader.loadAll();
    if (!data.success) {
      console.error(data.error);
      return;
    }
    this.cards = data.cards;

    const urlParams = new URLSearchParams(window.location.search);
    const cardSlug = urlParams.get('card');

    if (cardSlug) {
      this.renderDetailPage(cardSlug);
    } else {
      this.renderListPage();
    }

    this.bindFilterEvents();
  },

  renderDetailPage(slug) {
    const card = this.cards.find(c => c.slug === slug);
    const detailView = document.getElementById('card-detail-view');
    const listView = document.getElementById('card-list-view');

    if (!card) {
      if (detailView) {
        detailView.innerHTML = `
          <div class="text-center py-20">
            <h2 class="font-mystic text-2xl text-amber-400 mb-4">Không tìm thấy lá bài</h2>
            <p class="text-slate-400 mb-6">Lá bài bạn tìm kiếm không tồn tại hoặc đường dẫn không chính xác.</p>
            <a href="tarot.html" class="gold-shimmer-btn px-6 py-2.5 rounded-xl font-medium inline-block">Xem tất cả 78 lá bài</a>
          </div>
        `;
        detailView.classList.remove('hidden');
        if (listView) listView.classList.add('hidden');
      }
      return;
    }

    // Set SEO title & meta
    document.title = `${card.name} – ${card.nameVi} | Ý Nghĩa Tarot Chi Tiết`;

    if (listView) listView.classList.add('hidden');
    if (detailView) {
      detailView.classList.remove('hidden');
      detailView.innerHTML = `
        <!-- Breadcrumb -->
        <nav class="flex items-center space-x-2 text-xs md:text-sm text-slate-400 mb-8 font-medium" aria-label="Breadcrumb">
          <a href="index.html" class="hover:text-amber-400 transition-colors">Trang chủ</a>
          <span>✦</span>
          <a href="tarot.html" class="hover:text-amber-400 transition-colors">Các lá bài</a>
          <span>✦</span>
          <span class="text-amber-300 font-semibold">${card.name} (${card.nameVi})</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <!-- Cột hiển thị hình ảnh lá bài -->
          <div class="lg:col-span-5 flex flex-col items-center">
            <div class="w-full max-w-sm aspect-[2/3.3] rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/40 p-1 bg-gradient-to-b from-amber-500/20 to-purple-900/30 group">
              <img src="${card.image}" alt="${card.name} - ${card.nameVi}" class="w-full h-full object-contain rounded-xl transform group-hover:scale-105 transition-transform duration-500">
            </div>
            
            <div class="mt-6 flex flex-wrap gap-3 justify-center">
              <span class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-950/80 border border-purple-500/40 text-purple-200">
                ${card.arcana}
              </span>
              ${card.suit !== 'Major' ? `<span class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-950/80 border border-amber-500/40 text-amber-200">Bộ: ${card.suitVi || card.suit}</span>` : ''}
              <span class="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300">
                Số: ${card.number}
              </span>
            </div>

            <div class="mt-8 w-full">
              <a href="index.html" class="w-full py-3 rounded-xl gold-shimmer-btn font-bold text-center block tracking-wide">
                ✦ Bắt Đầu Bóc Bài Ngay
              </a>
            </div>
          </div>

          <!-- Cột thông tin chi tiết giải nghĩa -->
          <div class="lg:col-span-7 space-y-6">
            <div class="border-b border-amber-500/20 pb-6">
              <span class="text-xs uppercase tracking-widest text-amber-400 font-semibold font-mystic">✦ Ý NGHĨA LÁ BÀI</span>
              <h1 class="font-mystic text-3xl md:text-4xl font-black text-white mt-1 mb-2">${card.name}</h1>
              <h2 class="text-xl md:text-2xl text-amber-300 font-serif-sub italic">${card.nameVi}</h2>
            </div>

            <!-- Ý nghĩa tổng quan -->
            <div class="glass-panel p-6 rounded-2xl">
              <h3 class="font-mystic text-lg font-bold text-amber-300 flex items-center space-x-2 mb-3">
                <span>✦</span>
                <span>Ý Nghĩa Tổng Quan</span>
              </h3>
              <p class="text-slate-200 leading-relaxed text-sm md:text-base">
                ${card.overview}
              </p>
            </div>

            <!-- Xuôi & Ngược -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="glass-panel p-5 rounded-2xl border-l-4 border-l-emerald-500">
                <h4 class="font-semibold text-emerald-400 text-sm md:text-base flex items-center space-x-2 mb-2">
                  <span>▲</span>
                  <span>Ý Nghĩa Khi Xuôi (Upright)</span>
                </h4>
                <p class="text-slate-300 text-xs md:text-sm leading-relaxed">${card.upright}</p>
              </div>

              <div class="glass-panel p-5 rounded-2xl border-l-4 border-l-rose-500">
                <h4 class="font-semibold text-rose-400 text-sm md:text-base flex items-center space-x-2 mb-2">
                  <span>▼</span>
                  <span>Ý Nghĩa Khi Ngược (Reversed)</span>
                </h4>
                <p class="text-slate-300 text-xs md:text-sm leading-relaxed">${card.reversed}</p>
              </div>
            </div>

            <!-- Tình Yêu / Công Việc / Tài Chính -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="glass-panel p-4 rounded-xl">
                <div class="text-rose-400 font-bold text-sm mb-1.5 flex items-center space-x-1.5">
                  <span>♥</span>
                  <span>Tình Cảm</span>
                </div>
                <p class="text-slate-300 text-xs leading-relaxed">${card.love}</p>
              </div>

              <div class="glass-panel p-4 rounded-xl">
                <div class="text-amber-400 font-bold text-sm mb-1.5 flex items-center space-x-1.5">
                  <span>⚡</span>
                  <span>Công Việc</span>
                </div>
                <p class="text-slate-300 text-xs leading-relaxed">${card.career}</p>
              </div>

              <div class="glass-panel p-4 rounded-xl">
                <div class="text-emerald-400 font-bold text-sm mb-1.5 flex items-center space-x-1.5">
                  <span>🪙</span>
                  <span>Tài Chính</span>
                </div>
                <p class="text-slate-300 text-xs leading-relaxed">${card.finance}</p>
              </div>
            </div>

            <!-- Lời khuyên -->
            <div class="glass-panel-glow p-6 rounded-2xl border border-amber-500/40">
              <h3 class="font-mystic text-base md:text-lg font-bold text-amber-200 flex items-center space-x-2 mb-2">
                <span>🔮</span>
                <span>Lời Khuyên Vũ Trụ</span>
              </h3>
              <p class="text-amber-100/90 text-sm md:text-base italic font-serif-sub leading-relaxed">
                "${card.advice}"
              </p>
            </div>

            <!-- Quay lại -->
            <div class="pt-4 flex items-center justify-between">
              <a href="tarot.html" class="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-amber-300 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>Xem danh sách 78 lá</span>
              </a>
            </div>
          </div>
        </div>
      `;
    }
  },

  renderListPage(filter = 'all') {
    const listView = document.getElementById('card-list-view');
    const detailView = document.getElementById('card-detail-view');
    const gridEl = document.getElementById('all-cards-grid');

    if (detailView) detailView.classList.add('hidden');
    if (listView) listView.classList.remove('hidden');

    if (!gridEl) return;

    let filteredCards = this.cards;
    if (filter === 'major') {
      filteredCards = this.cards.filter(c => c.arcana === 'Major Arcana');
    } else if (filter !== 'all') {
      filteredCards = this.cards.filter(c => c.suit && c.suit.toLowerCase() === filter.toLowerCase());
    }

    gridEl.innerHTML = '';
    filteredCards.forEach(card => {
      const item = document.createElement('a');
      item.href = card.link;
      item.className = 'glass-panel rounded-xl p-3 flex flex-col items-center hover:border-amber-500/60 transition-all duration-300 transform hover:-translate-y-1.5 group';

      item.innerHTML = `
        <div class="w-full aspect-[2/3.3] rounded-lg overflow-hidden bg-slate-950 mb-2.5 relative border border-amber-500/20 group-hover:border-amber-500/50">
          <img src="${card.image}" alt="${card.name}" class="w-full h-full object-contain p-1">
        </div>
        <div class="text-center w-full">
          <h4 class="font-mystic text-xs font-bold text-white truncate group-hover:text-amber-300 transition-colors">${card.name}</h4>
          <p class="text-[11px] text-amber-400 truncate">${card.nameVi}</p>
        </div>
      `;
      gridEl.appendChild(item);
    });
  },

  bindFilterEvents() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => {
          b.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
          b.classList.add('bg-slate-900', 'text-slate-300');
        });

        const target = e.currentTarget;
        target.classList.remove('bg-slate-900', 'text-slate-300');
        target.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');

        const filter = target.getAttribute('data-filter');
        this.renderListPage(filter);
      });
    });
  }
};
