function ScoreBoard({ activePlayerId, players }) {
  const avatars = ['M', 'G', 'O', 'A', 'B', 'C'];

  return (
    <aside className="scoreboard" aria-label="Scoreboard">
      <h2>Bảng điểm</h2>
      <div className="scoreboard-list">
        {players.map((player, index) => (
          <div
            className={player.id === activePlayerId ? 'score-row active' : 'score-row'}
            data-avatar={avatars[index] ?? player.id}
            key={player.id}
          >
            <span className="score-character">{player.character}</span>
            <span className="score-name">{player.name}</span>
            <strong>{player.score}</strong>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ScoreBoard;
