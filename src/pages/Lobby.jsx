import { useNavigate } from 'react-router-dom';

const maxPlayers = 4;
const playerSlots = [1, 2, 3, 4];

function Lobby({ onAddPlayer, onRemovePlayer, onUpdatePlayer, players }) {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/dice');
  };

  return (
    <main className="lobby-page">
      <section className="lobby-panel">
        <div className="lobby-header">
          <div>
            <p className="eyebrow">Phòng chờ</p>
            <h1>Thiết lập người chơi</h1>
            <p className="player-count">{players.length} người chơi</p>
          </div>
          <button className="secondary-button compact" type="button" onClick={() => navigate('/')}>
            Trang chủ
          </button>
        </div>

        <div className="player-count-controls" aria-label="Điều chỉnh số người chơi">
          <button
            className="secondary-button compact"
            type="button"
            disabled={players.length <= 2}
            onClick={onRemovePlayer}
          >
            -
          </button>
          <span>{players.length} / {maxPlayers}</span>
          <button
            className="secondary-button compact"
            type="button"
            disabled={players.length >= maxPlayers}
            onClick={onAddPlayer}
          >
            +
          </button>
        </div>

        <div className="player-setup-grid">
          {playerSlots.map((slot) => {
            const player = players.find((currentPlayer) => currentPlayer.id === slot);

            if (!player) {
              return (
                <div className="player-setup empty" key={slot}>
                  <h2>Người chơi {slot}</h2>
                  <p>Ô trống</p>
                </div>
              );
            }

            return (
              <div className="player-setup" key={player.id}>
                <h2>Người chơi {player.id}</h2>
                <input
                  type="text"
                  placeholder="Nhập tên"
                  value={player.name}
                  onChange={(event) => onUpdatePlayer(player.id, { name: event.target.value })}
                />
                <label htmlFor={`character-${player.id}`}>Chọn nhân vật:</label>
                <select
                  id={`character-${player.id}`}
                  value={player.character}
                  onChange={(event) => onUpdatePlayer(player.id, { character: event.target.value })}
                >
                  <option value="Nhân vật 1">Nhân vật 1</option>
                  <option value="Nhân vật 2">Nhân vật 2</option>
                  <option value="Nhân vật 3">Nhân vật 3</option>
                  <option value="Nhân vật 4">Nhân vật 4</option>
                </select>
              </div>
            );
          })}
        </div>

        <div className="lobby-actions">
          <button className="primary-button" type="button" onClick={handleStartGame}>
            Bắt đầu
          </button>
        </div>
      </section>
    </main>
  );
};

export default Lobby;
