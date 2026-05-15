import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCharacterOption } from '../characterImages';

const pipPositions = {
  1: ['center'],
  2: ['top-left', 'bottom-right'],
  3: ['top-left', 'center', 'bottom-right'],
  4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
  5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
  6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
};

const diceOptions = [
  { label: '+1 điểm', points: 1 },
  { label: '+2 điểm', points: 2 },
  { label: '+3 điểm', points: 3 },
  { label: '-1 điểm và rút thẻ thử thách', points: -1, requiresChallenge: true },
  { label: '-2 điểm và rút thẻ thử thách', points: -2, requiresChallenge: true },
  { label: '-3 điểm và rút thẻ thử thách', points: -3, requiresChallenge: true },
  { label: 'Rút thẻ cơ hội hoặc thẻ rủi ro', points: 0, requiresCardEffect: true },
  { label: 'Mất lượt', points: 0 },
];

function Dice({ activePlayer, onChallengeRequired, onNextPlayer, onPassRestrictedTurn, onUpdateScore }) {
  const [result, setResult] = useState(1);
  const [hasRolled, setHasRolled] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
  const selectedOutcome = diceOptions.find((option) => option.label === selectedOption);
  const isSkippingTurn = activePlayer.skipTurns > 0;
  const isEliminated = activePlayer.isEliminated;
  const isRestrictedTurn = isSkippingTurn || isEliminated;
  const canGoNext = hasRolled && selectedOption;
  const activeCharacter = getCharacterOption(activePlayer.character, activePlayer.id);

  const rollDice = () => {
    if (isRestrictedTurn) {
      return;
    }

    const nextResult = Math.floor(Math.random() * 6) + 1;
    setResult(nextResult);
    setHasRolled(true);
  };

  const resetTurnAndGoNext = () => {
    if (!canGoNext) {
      return;
    }

    setResult(1);
    setHasRolled(false);
    setSelectedOption(null);

    if (selectedOutcome.requiresChallenge) {
      onChallengeRequired({
        label: selectedOutcome.label,
        points: selectedOutcome.points,
      });
      navigate('/question');
      return;
    }

    if (selectedOutcome.requiresCardEffect) {
      navigate('/card-effect');
      return;
    }

    onUpdateScore(selectedOutcome.points);
    onNextPlayer();
  };

  return (
    <main className="dice-page">
      <section className="dice-panel">
        <div className="dice-header">
          <img className="active-player-avatar" src={activeCharacter.image} alt={activeCharacter.label} />
          <div>
            <h1>Lắc xúc xắc</h1>
            <p className="active-player-label">Lượt của {activePlayer.name}</p>
          </div>
        </div>

        {isRestrictedTurn ? (
          <section className="skip-turn-panel" aria-live="polite">
            <h2>{isEliminated ? 'Dừng cuộc chơi' : 'Mất lượt'}</h2>
            <p>
              {isEliminated
                ? `${activePlayer.name} đã dừng cuộc chơi. Bấm chuyển lượt để sang người tiếp theo.`
                : `${activePlayer.name} đang bị mất lượt. Bấm chuyển lượt để bỏ qua lượt này.`}
            </p>
            <button className="primary-button" type="button" onClick={onPassRestrictedTurn}>
              Chuyển lượt
            </button>
          </section>
        ) : (
          <>
            <div className="dice-result" aria-live="polite">
              <div className="die" aria-label={hasRolled ? `Kết quả xúc xắc là ${result}` : 'Chưa lắc xúc xắc'}>
                {hasRolled && pipPositions[result].map((position) => (
                  <span className={`pip ${position}`} key={position} />
                ))}
              </div>
              <div>
                <span className="result-label">Kết quả</span>
                <strong>{hasRolled ? result : '-'}</strong>
              </div>
            </div>

            <button className="primary-button" type="button" onClick={rollDice}>
              Lắc
            </button>

            <section className="dice-options" aria-label="Các ô kết quả xúc xắc">
              <h2>Ô kết quả</h2>
              <div className="option-grid">
                {diceOptions.map((option) => (
                  <button
                    className={selectedOption === option.label ? 'option-button selected' : 'option-button'}
                    key={option.label}
                    type="button"
                    onClick={() => {
                      setSelectedOption(option.label);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>

            <button
              className="secondary-button"
              type="button"
              disabled={!canGoNext}
              onClick={resetTurnAndGoNext}
            >
              Người chơi tiếp theo
            </button>
          </>
        )}
      </section>
    </main>
  );
}

export default Dice;
