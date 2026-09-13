/**
 * Data loader quản lý fetch cards.json và card-back.json
 */
const TarotDataLoader = {
  cards: [],
  cardBack: {
    image: 'assets/tarot/back.png',
    alt: 'Mặt sau lá bài Tarot'
  },
  isLoaded: false,

  async loadAll() {
    try {
      // 1. Tải card-back.json
      try {
        const backRes = await fetch('data/card-back.json');
        if (backRes.ok) {
          const backData = await backRes.json();
          this.cardBack = { ...this.cardBack, ...backData };
        }
      } catch (err) {
        console.warn('Dùng cấu hình mặt sau mặc định:', err);
      }

      // 2. Tải cards.json (78 lá)
      const res = await fetch('data/cards.json');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      this.cards = await res.json();
      this.isLoaded = true;
      return {
        success: true,
        cards: this.cards,
        cardBack: this.cardBack
      };
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu Tarot:', error);
      return {
        success: false,
        error: 'Không thể tải bộ bài Tarot. Vui lòng thử lại.'
      };
    }
  },

  getCardBySlug(slug) {
    return this.cards.find(c => c.slug === slug) || null;
  },

  getCardById(id) {
    return this.cards.find(c => c.id === id) || null;
  }
};
