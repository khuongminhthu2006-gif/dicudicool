import { getCharacterOption } from '../characterImages';

function ScoreBoard({ activePlayerId, hideEliminatedPlayers = false, players }) {
  const visiblePlayers = hideEliminatedPlayers
    ? players.filter((player) => !player.isEliminated)
    : players;

  return (
    <aside className="scoreboard" aria-label="Bảng điểm">
      <h2>Bảng điểm</h2>
      <div className="scoreboard-list">
        {visiblePlayers.map((player) => {
          const character = getCharacterOption(player.character, player.id);
          const statusLabels = [
            player.isEliminated ? 'Dừng cuộc chơi' : '',
            player.shields > 0 ? `Khiên: ${player.shields}` : '',
            player.skipTurns > 0 ? `Mất lượt: ${player.skipTurns}` : '',
          ].filter(Boolean);

          return (
            <div
              className={[
                'score-row',
                player.id === activePlayerId ? 'active' : '',
                player.isEliminated ? 'eliminated' : '',
              ].filter(Boolean).join(' ')}
              key={player.id}
            >
              <img className="score-avatar" src={character.image} alt={character.label} />
              <span className="score-character">
                {[character.label, ...statusLabels].join(' | ')}
              </span>
              <span className="score-name">{player.name}</span>
              <strong>{player.score}</strong>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default ScoreBoard;
