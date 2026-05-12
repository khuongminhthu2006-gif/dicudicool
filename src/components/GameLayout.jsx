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
            Trang chủ
          </button>
          <button className="danger-button" type="button" onClick={() => setIsEndGameOpen(true)}>
            Kết thúc
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
            <p className="eyebrow">Kết thúc</p>
            <h2 id="end-game-title">Đặt lại ván chơi?</h2>
            <p>
              Thao tác này sẽ xóa toàn bộ điểm và quay về trang chủ.
            </p>
            <div className="modal-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setIsEndGameOpen(false)}
              >
                Hủy
              </button>
              <button className="danger-button" type="button" onClick={confirmEndGame}>
                Kết thúc
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default GameLayout;
