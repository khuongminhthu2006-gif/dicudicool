import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScoreBoard from './ScoreBoard';

function GameLayout({ activePlayerId, children, onEndGame, players }) {
  const [isEndGameOpen, setIsEndGameOpen] = useState(false);
  const navigate = useNavigate();

  const confirmEndGame = () => {
    onEndGame();
    setIsEndGameOpen(false);
    navigate('/');
  };

  return (
    <div className="game-layout">
      <div className="game-sidebar">
        <ScoreBoard
          activePlayerId={activePlayerId}
          players={players}
        />
        <div className="sidebar-actions">
          <button className="secondary-button" type="button" onClick={() => navigate('/')}>
            Home
          </button>
          <button className="danger-button" type="button" onClick={() => setIsEndGameOpen(true)}>
            End Game
          </button>
        </div>
      </div>
      <div className="game-content">{children}</div>

      {isEndGameOpen && (
        <div className="modal-backdrop" role="presentation">
          <section
            aria-labelledby="end-game-title"
            aria-modal="true"
            className="confirm-modal"
            role="dialog"
          >
            <p className="eyebrow">End Game</p>
            <h2 id="end-game-title">Reset this game?</h2>
            <p>
              This will clear all player scores and return to the home screen.
            </p>
            <div className="modal-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setIsEndGameOpen(false)}
              >
                Cancel
              </button>
              <button className="danger-button" type="button" onClick={confirmEndGame}>
                End Game
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default GameLayout;
