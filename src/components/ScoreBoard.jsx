function ScoreBoard({ activePlayerId, players }) {
  return (
    <aside className="scoreboard" aria-label="Scoreboard">
      <h2>Scoreboard</h2>
      <div className="scoreboard-list">
        {players.map((player) => (
          <div
            className={player.id === activePlayerId ? 'score-row active' : 'score-row'}
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
