import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const pipPositions = {
  1: ['center'],
  2: ['top-left', 'bottom-right'],
  3: ['top-left', 'center', 'bottom-right'],
  4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
  5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
  6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
};

const diceOptions = [
  { label: '+1 point', points: 1 },
  { label: '+2 points', points: 2 },
  { label: '+3 points', points: 3 },
  { label: '-1 point and draw a challenge card', points: -1, requiresChallenge: true },
  { label: '-2 points and draw a challenge card', points: -2, requiresChallenge: true },
  { label: '-3 points and draw a challenge card', points: -3, requiresChallenge: true },
  { label: 'Draw a challenge or an opportunity card', points: 0 },
  { label: 'Lose turn', points: 0 },
];

function Dice({ activePlayer, onChallengeRequired, onNextPlayer, onUpdateScore }) {
  const [result, setResult] = useState(1);
  const [hasRolled, setHasRolled] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
  const selectedOutcome = diceOptions.find((option) => option.label === selectedOption);
  const canGoNext = hasRolled && selectedOption;

  const rollDice = () => {
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

    onUpdateScore(selectedOutcome.points);
    onNextPlayer();
  };

  return (
    <main className="dice-page">
      <section className="dice-panel">
        <div className="dice-header">
          <h1>Roll the dice</h1>
          <p className="active-player-label">{activePlayer.name}&apos;s turn</p>
        </div>

        <div className="dice-result" aria-live="polite">
          <div className="die" aria-label={hasRolled ? `Dice result is ${result}` : 'Dice is not rolled yet'}>
            {hasRolled && pipPositions[result].map((position) => (
              <span className={`pip ${position}`} key={position} />
            ))}
          </div>
          <div>
            <span className="result-label">Result</span>
            <strong>{hasRolled ? result : '-'}</strong>
          </div>
        </div>

        <button className="primary-button" type="button" onClick={rollDice}>
          Roll
        </button>

        <section className="dice-options" aria-label="Dice result options">
          <h2>Result Box</h2>
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
          Next player
        </button>
      </section>
    </main>
  );
};

export default Dice;
