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
            <p className="eyebrow">Lobby</p>
            <h1>Set up players</h1>
            <p className="player-count">{players.length} players</p>
          </div>
          <button className="secondary-button compact" type="button" onClick={() => navigate('/')}>
            Home
          </button>
        </div>

        <div className="player-count-controls" aria-label="Player count controls">
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
                  <h2>Player {slot}</h2>
                  <p>Available slot</p>
                </div>
              );
            }

            return (
              <div className="player-setup" key={player.id}>
                <h2>Player {player.id}</h2>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={player.name}
                  onChange={(event) => onUpdatePlayer(player.id, { name: event.target.value })}
                />
                <label htmlFor={`character-${player.id}`}>Choose your character:</label>
                <select
                  id={`character-${player.id}`}
                  value={player.character}
                  onChange={(event) => onUpdatePlayer(player.id, { character: event.target.value })}
                >
                  <option value="Character 1">Character 1</option>
                  <option value="Character 2">Character 2</option>
                  <option value="Character 3">Character 3</option>
                  <option value="Character 4">Character 4</option>
                </select>
              </div>
            );
          })}
        </div>

        <div className="lobby-actions">
          <button className="primary-button" type="button" onClick={handleStartGame}>
            Start Game
          </button>
        </div>
      </section>
    </main>
  );
};

export default Lobby;
