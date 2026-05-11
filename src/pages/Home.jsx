import { useNavigate } from 'react-router-dom';

function Home({ hasActiveGame, onStartNewGame }) {
  const navigate = useNavigate();

  const handleStartGame = () => {
    onStartNewGame();
    navigate('/lobby');
  };

  return (
    <main className="home-page">
      <section className="home-panel">
        <div className="home-copy">
          <p className="eyebrow">Board Game Companion</p>
          <h1>Thoatbay</h1>
          <p>
            Set up players, track scores, roll the dice, and move through game
            rounds from one shared screen.
          </p>
        </div>

        <div className="home-actions">
          <button className="primary-button" type="button" onClick={handleStartGame}>
            Start Game
          </button>
          {hasActiveGame ? (
            <button className="secondary-button" type="button" onClick={() => navigate('/dice')}>
              Continue Game
            </button>
          ) : (
            <button className="secondary-button vague" type="button" disabled>
              No Active Game
            </button>
          )}
        </div>

        <section className="home-menu" aria-label="Game sections">
          <button type="button" onClick={() => navigate('/summary')}>Summary</button>
          <button type="button" onClick={() => navigate('/history')}>History</button>
          <button type="button" onClick={() => navigate('/settings')}>Settings</button>
        </section>
      </section>
    </main>
  );
};

export default Home;
