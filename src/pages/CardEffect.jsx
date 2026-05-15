import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCardEffect } from '../cardEffects';

function CardEffect({ activePlayer, onApplyCardEffect }) {
  const [cardKind, setCardKind] = useState('opportunity');
  const [cardNumber, setCardNumber] = useState('1');
  const [useShield, setUseShield] = useState(false);
  const navigate = useNavigate();
  const selectedCard = getCardEffect(cardKind, cardNumber);
  const canUseShield = cardKind === 'risk' && activePlayer.shields > 0;

  const effectPreview = useMemo(() => {
    if (!selectedCard) {
      return 'Chọn số thẻ từ 1 đến 16.';
    }

    if (useShield && canUseShield) {
      return 'Dùng 1 Khiên để chặn hiệu ứng rủi ro. Điểm không đổi.';
    }

    if (selectedCard.type === 'shield') {
      return 'Người chơi nhận thêm 1 Khiên.';
    }

    if (selectedCard.type === 'half') {
      return `Điểm sẽ giảm từ ${activePlayer.score} xuống ${Math.floor(activePlayer.score / 2)}.`;
    }

    if (selectedCard.type === 'set-zero') {
      return 'Điểm của người chơi sẽ về 0.';
    }

    if (selectedCard.type === 'delta') {
      const nextScore = activePlayer.score + selectedCard.points;
      const sign = selectedCard.points > 0 ? '+' : '';

      return `${sign}${selectedCard.points} điểm. Điểm sẽ đổi từ ${activePlayer.score} thành ${nextScore}.`;
    }

    if (selectedCard.type === 'skip') {
      return `Người chơi sẽ bị mất ${selectedCard.turns} lượt tiếp theo.`;
    }

    if (selectedCard.type === 'eliminate') {
      return 'Người chơi sẽ bị đánh dấu dừng cuộc chơi. Khi tới lượt chỉ có thể chuyển lượt.';
    }

    return selectedCard.note ?? 'Không đổi điểm trong app.';
  }, [activePlayer.score, canUseShield, selectedCard, useShield]);

  const applyEffect = () => {
    if (!selectedCard) {
      return;
    }

    onApplyCardEffect({
      ...selectedCard,
      cardKind,
      cardNumber: Number(cardNumber),
      useShield: useShield && canUseShield,
    });
    navigate('/dice');
  };

  return (
    <main className="card-effect-page">
      <section className="card-effect-panel">
        <p className="eyebrow">Thẻ ngoài đời thực</p>
        <h1>Áp dụng hiệu ứng thẻ</h1>
        <p className="active-player-label">
          Người chơi: {activePlayer.name} | Điểm hiện tại: {activePlayer.score} | Khiên: {activePlayer.shields}
        </p>

        <div className="card-effect-form">
          <label htmlFor="card-kind">Loại thẻ</label>
          <select
            id="card-kind"
            value={cardKind}
            onChange={(event) => {
              setCardKind(event.target.value);
              setCardNumber('1');
              setUseShield(false);
            }}
          >
            <option value="opportunity">Thẻ cơ hội</option>
            <option value="risk">Thẻ rủi ro</option>
          </select>

          <label htmlFor="card-number">Số thẻ</label>
          <select
            id="card-number"
            value={cardNumber}
            onChange={(event) => {
              setCardNumber(event.target.value);
              setUseShield(false);
            }}
          >
            {Array.from({ length: 16 }, (_, index) => String(index + 1)).map((number) => (
              <option key={number} value={number}>
                Thẻ {number}
              </option>
            ))}
          </select>

          {selectedCard && (
            <section className="selected-card-preview" aria-live="polite">
              <h2>{cardKind === 'opportunity' ? 'Thẻ cơ hội' : 'Thẻ rủi ro'} #{cardNumber}</h2>
              <p>{selectedCard.title}</p>
              {selectedCard.note && <p>{selectedCard.note}</p>}
            </section>
          )}

          {canUseShield && (
            <label className="checkbox-field" htmlFor="use-shield">
              <input
                id="use-shield"
                type="checkbox"
                checked={useShield}
                onChange={(event) => setUseShield(event.target.checked)}
              />
              Dùng 1 Khiên để chặn thẻ rủi ro này
            </label>
          )}

          <p className="effect-preview">{effectPreview}</p>

          <button
            className="primary-button"
            type="button"
            disabled={!selectedCard}
            onClick={applyEffect}
          >
            Áp dụng hiệu ứng
          </button>
        </div>
      </section>
    </main>
  );
}

export default CardEffect;
