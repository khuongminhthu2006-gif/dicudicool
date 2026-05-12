import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScoreBoard from './ScoreBoard';

function GameLayout({ activePlayerId, children, onEndGame, players }) {
  const [isEndGameOpen, setIsEndGameOpen] = useState(false);
  const navigate = useNavigate();
  const highestScore = Math.max(...players.map((player) => player.score));
  const leadingPlayers = players.filter((player) => player.score === highestScore);
  const winner = leadingPlayers.length === 1 ? leadingPlayers[0] : null;
  const tiedNames = leadingPlayers.map((player) => player.name).join(', ');

  const confirmEndGame = () => {
    if (!winner) {
      return;
    }

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
            {winner ? (
              <p className="end-game-result success">
                Người chiến thắng là <strong>{winner.name}</strong> với <strong>{winner.score}</strong> điểm.
              </p>
            ) : (
              <p className="end-game-result blocked">
                Không thể kết thúc vì đang có nhiều người hòa điểm cao nhất: <strong>{tiedNames}</strong> ({highestScore} điểm).
              </p>
            )}
            <div className="modal-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => setIsEndGameOpen(false)}
              >
                Hủy
              </button>
              <button className="danger-button" type="button" onClick={confirmEndGame} disabled={!winner}>
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
