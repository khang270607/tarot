/**
 * Quản lý trạng thái bóc bài (Reading State Machine)
 */
const TarotReadingApp = {
  // State
  cards: [],
  shuffledDeck: [],
  cardBack: null,
  selectedCards: [],
  currentQuestion: '',
  maxPicks: 3,
  
  // Position labels tương ứng với 3 lá
  positions: [
    { id: 1, label: 'Quá khứ / Nền tảng' },
    { id: 2, label: 'Hiện tại / Thử thách' },
    { id: 3, label: 'Tương lai / Hướng đi' }
  ],

  // DOM Elements cache
  elements: {},

  async init() {
    this.cacheElements();
    this.bindEvents();

    // Tải dữ liệu JSON
    const data = await TarotDataLoader.loadAll();
    if (!data.success) {
      this.showError(data.error);
      return;
    }

    this.cards = data.cards;
    this.cardBack = data.cardBack;
    this.hideLoading();
  },

  cacheElements() {
    this.elements = {
      // Sections
      heroSection: document.getElementById('hero-section'),
      readingSection: document.getElementById('reading-section'),
      resultSection: document.getElementById('result-section'),
      loadingState: document.getElementById('loading-state'),
      errorState: document.getElementById('error-state'),

      // Question Form
      questionForm: document.getElementById('question-form'),
      questionInput: document.getElementById('question-input'),
      startBtn: document.getElementById('start-btn'),
      errorMessage: document.getElementById('error-message'),

      // Reading Board
      displayQuestion: document.getElementById('display-question'),
      cardsDeck: document.getElementById('cards-deck'),
      progressText: document.getElementById('progress-text'),
      progressDots: document.getElementById('progress-dots'),
      readingHint: document.getElementById('reading-hint'),

      // Result Board
      resultQuestion: document.getElementById('result-question'),
      resultsGrid: document.getElementById('results-grid'),
      restartBtn: document.getElementById('restart-btn'),
      newQuestionBtn: document.getElementById('new-question-btn'),
      retryBtn: document.getElementById('retry-btn')
    };
  },

  bindEvents() {
    // Form Input Validation & Submit
    if (this.elements.questionInput) {
      this.elements.questionInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        this.elements.startBtn.disabled = val.length === 0;
        if (this.elements.errorMessage) {
          this.elements.errorMessage.classList.add('hidden');
        }
      });

      this.elements.questionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleStartReading();
      });
    }

    // Restart & New Question Buttons
    if (this.elements.restartBtn) {
      this.elements.restartBtn.addEventListener('click', () => {
        this.restartCurrentReading();
      });
    }

    if (this.elements.newQuestionBtn) {
      this.elements.newQuestionBtn.addEventListener('click', () => {
        this.startNewQuestion();
      });
    }

    if (this.elements.retryBtn) {
      this.elements.retryBtn.addEventListener('click', () => {
        location.reload();
      });
    }
  },

  handleStartReading() {
    const question = this.elements.questionInput.value.trim();
    if (!question) {
      if (this.elements.errorMessage) {
        this.elements.errorMessage.classList.remove('hidden');
        this.elements.errorMessage.textContent = 'Vui lòng nhập câu hỏi trước khi bắt đầu.';
      }
      return;
    }

    this.currentQuestion = question;
    this.selectedCards = [];

    // Xáo ngẫu nhiên bộ 78 lá bằng Fisher-Yates
    this.shuffledDeck = shuffleCards(this.cards);

    // Render 78 lá
    this.renderDeck();

    // Cập nhật câu hỏi và UI
    this.elements.displayQuestion.textContent = `"${this.currentQuestion}"`;
    this.updateProgressUI();

    // Chuyển màn hình
    this.elements.heroSection.classList.add('hidden');
    this.elements.resultSection.classList.add('hidden');
    this.elements.readingSection.classList.remove('hidden');
    this.elements.readingSection.scrollIntoView({ behavior: 'smooth' });
  },

  renderDeck() {
    this.elements.cardsDeck.innerHTML = '';
    
    this.shuffledDeck.forEach((card, index) => {
      const cardEl = CardRenderer.renderDeckCard(card, index, this.cardBack);
      
      // Event click để bóc bài
      cardEl.addEventListener('click', () => this.handleCardSelect(card, cardEl, index));
      
      // Accessibility: Phím Enter hoặc Space
      cardEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleCardSelect(card, cardEl, index);
        }
      });

      this.elements.cardsDeck.appendChild(cardEl);
    });
  },

  handleCardSelect(card, cardEl, index) {
    const inner = cardEl.querySelector('.tarot-card-inner');

    // Nếu đã lật rồi hoặc đã chọn đủ 3 lá
    if (inner.classList.contains('is-flipped') || this.selectedCards.length >= this.maxPicks) {
      return;
    }

    // Thêm vào danh sách đã chọn
    this.selectedCards.push({
      ...card,
      deckIndex: index,
      order: this.selectedCards.length + 1
    });

    // 3D Flip animation
    inner.classList.add('is-flipped');
    cardEl.setAttribute('aria-pressed', 'true');

    // Gắn badge số thứ tự (1, 2, 3)
    const badge = document.createElement('div');
    badge.className = 'card-order-badge';
    badge.textContent = this.selectedCards.length;
    cardEl.appendChild(badge);

    // Cập nhật progress UI
    this.updateProgressUI();

    // Nếu đã chọn đủ 3 lá
    if (this.selectedCards.length >= this.maxPicks) {
      this.completeReading();
    }
  },

  updateProgressUI() {
    const count = this.selectedCards.length;
    
    if (count === 0) {
      this.elements.progressText.textContent = 'Hãy chọn lá 1 (Quá khứ)';
    } else if (count === 1) {
      this.elements.progressText.textContent = 'Đã chọn 1 / 3 lá – Tiếp tục chọn lá 2 (Hiện tại)';
    } else if (count === 2) {
      this.elements.progressText.textContent = 'Đã chọn 2 / 3 lá – Tiếp tục chọn lá 3 (Tương lai)';
    } else {
      this.elements.progressText.textContent = 'Đã chọn đủ 3 lá – Đang mở kết quả trải bài';
    }

    // Progress dots
    const dots = this.elements.progressDots.querySelectorAll('.step-dot');
    dots.forEach((dot, idx) => {
      if (idx < count) {
        dot.className = 'step-dot w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-500/50 scale-110 transition-all';
      } else {
        dot.className = 'step-dot w-2.5 h-2.5 rounded-full bg-slate-700 transition-all';
      }
    });
  },

  completeReading() {
    // Disable tất cả các lá chưa chọn trong deck
    const allCards = this.elements.cardsDeck.querySelectorAll('.tarot-card-inner');
    allCards.forEach(inner => {
      if (!inner.classList.contains('is-flipped')) {
        inner.classList.add('disabled');
      }
    });

    if (this.elements.readingHint) {
      this.elements.readingHint.textContent = '✦ Bạn đã hoàn thành lượt bóc bài!';
    }

    // Delay 800ms để người dùng xem lá thứ 3 lật xong trước khi mở kết quả
    setTimeout(() => {
      this.showResults();
    }, 850);
  },

  showResults() {
    this.elements.resultQuestion.textContent = `"${this.currentQuestion}"`;
    this.elements.resultsGrid.innerHTML = '';

    // Render 3 lá theo đúng thứ tự lựa chọn (Giữ nguyên thứ tự 1 -> 2 -> 3)
    this.selectedCards.forEach((card, idx) => {
      const pos = this.positions[idx];
      const resultCardEl = CardRenderer.renderResultCard(card, idx + 1, pos.label);
      this.elements.resultsGrid.appendChild(resultCardEl);
    });

    // Hiển thị Result section
    this.elements.resultSection.classList.remove('hidden');
    this.elements.resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  restartCurrentReading() {
    // Giữ nguyên câu hỏi hiện tại, shuffle lại deck 78 lá và bóc lại
    this.selectedCards = [];
    this.shuffledDeck = shuffleCards(this.cards);
    this.renderDeck();
    this.updateProgressUI();

    this.elements.resultSection.classList.add('hidden');
    this.elements.readingSection.classList.remove('hidden');
    this.elements.readingSection.scrollIntoView({ behavior: 'smooth' });
  },

  startNewQuestion() {
    // Trở về Hero để nhập câu hỏi mới
    this.selectedCards = [];
    this.currentQuestion = '';
    if (this.elements.questionInput) {
      this.elements.questionInput.value = '';
      this.elements.startBtn.disabled = true;
    }
    
    this.elements.resultSection.classList.add('hidden');
    this.elements.readingSection.classList.add('hidden');
    this.elements.heroSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  hideLoading() {
    if (this.elements.loadingState) {
      this.elements.loadingState.classList.add('hidden');
    }
  },

  showError(msg) {
    if (this.elements.loadingState) this.elements.loadingState.classList.add('hidden');
    if (this.elements.errorState) {
      this.elements.errorState.classList.remove('hidden');
      const errTxt = this.elements.errorState.querySelector('.error-text');
      if (errTxt) errTxt.textContent = msg;
    }
  }
};
