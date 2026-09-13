/**
 * Fisher-Yates (Knuth) Shuffle Algorithm
 * Tạo bản sao mảng và xáo ngẫu nhiên không thay đổi mảng gốc.
 */
function shuffleCards(cards) {
  if (!Array.isArray(cards)) return [];
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { shuffleCards };
}
