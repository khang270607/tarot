/**
 * Component CardRenderer phụ trách render cấu trúc HTML cho 78 lá bài và lá kết quả
 */
const CardRenderer = {
  /**
   * Tạo element cho 1 lá bài trong deck 78 lá với hiệu ứng 3D flip
   */
  renderDeckCard(card, index, cardBack) {
    const cardEl = document.createElement('div');
    cardEl.className = 'tarot-card-container aspect-[2/3.3] w-full';
    cardEl.setAttribute('data-card-id', card.id);
    cardEl.setAttribute('data-deck-index', index);
    cardEl.setAttribute('role', 'button');
    cardEl.setAttribute('tabindex', '0');
    cardEl.setAttribute('aria-label', `Lá bài số ${index + 1}`);

    cardEl.innerHTML = `
      <div class="tarot-card-inner">
        <!-- Mặt sau (Hiển thị ban đầu) -->
        <div class="tarot-card-back">
          <img src="${cardBack.image}" alt="${cardBack.alt}" loading="lazy" class="w-full h-full object-cover">
        </div>
        <!-- Mặt trước (Hiện ra sau khi click) -->
        <div class="tarot-card-front">
          <img src="${card.image}" alt="${card.name} - ${card.nameVi}" class="w-full h-full object-contain p-1">
        </div>
      </div>
    `;

    return cardEl;
  },

  /**
   * Tạo element cho 1 lá bài lớn trong khu vực kết quả
   */
  renderResultCard(card, orderIndex, positionLabel) {
    const resultCol = document.createElement('div');
    resultCol.className = 'flex flex-col items-center glass-panel rounded-2xl p-4 md:p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 w-full group';

    resultCol.innerHTML = `
      <!-- Badge vị trí (Quá khứ / Hiện tại / Tương lai) -->
      <div class="flex items-center space-x-2 mb-3">
        <span class="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center border border-amber-500/40">${orderIndex}</span>
        <span class="text-xs md:text-sm font-semibold tracking-wider uppercase text-amber-200">${positionLabel}</span>
      </div>

      <!-- Ảnh lá bài lớn -->
      <div class="w-48 sm:w-56 md:w-64 aspect-[2/3.3] rounded-xl overflow-hidden shadow-2xl border-2 border-amber-500/40 my-2 relative transform group-hover:scale-105 transition-transform duration-500">
        <img src="${card.image}" alt="${card.name} (${card.nameVi})" class="w-full h-full object-contain bg-slate-950">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
          <span class="text-xs text-amber-300 font-medium">Bấm xem giải nghĩa chi tiết</span>
        </div>
      </div>

      <!-- Tên lá bài -->
      <div class="text-center mt-3 mb-4">
        <h3 class="font-mystic text-lg md:text-xl font-bold text-white tracking-wide">${card.name}</h3>
        <p class="text-amber-400 font-medium text-sm md:text-base">${card.nameVi}</p>
        <span class="inline-block mt-1 text-[11px] text-purple-300 bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-500/30">
          ${card.arcana}
        </span>
      </div>

      <!-- Mô tả tóm lược -->
      <p class="text-slate-300 text-xs md:text-sm text-center line-clamp-3 mb-5 px-2 flex-grow">
        ${card.overview}
      </p>

      <!-- Nút xem giải nghĩa -->
      <a href="${card.link}" class="w-full py-2.5 px-4 rounded-xl text-center text-xs md:text-sm font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/40 transition-all duration-300 flex items-center justify-center space-x-2">
        <span>Xem giải nghĩa</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
      </a>
    `;

    return resultCol;
  }
};
