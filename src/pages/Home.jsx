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
          <p className="eyebrow">Trợ lý trò chơi</p>
          <h1>Thoát Bẫy</h1>
        </div>

        <div className="home-actions">
          <button className="primary-button" type="button" onClick={handleStartGame}>
            <span className="play-icon" aria-hidden="true" />
            Bắt đầu
          </button>
          {hasActiveGame ? (
            <button className="secondary-button" type="button" onClick={() => navigate('/dice')}>
              Tiếp tục
            </button>
          ) : (
            <button className="secondary-button vague" type="button" disabled>
              Chưa có lượt
            </button>
          )}
        </div>

        <section className="home-menu" aria-label="Các mục trò chơi">
          <button type="button" onClick={() => navigate('/summary')}>
            <span className="menu-icon bars" aria-hidden="true" />
            Tổng quan
          </button>
          <button type="button" onClick={() => navigate('/practice')}>
            <span className="menu-icon book" aria-hidden="true" />
            Ôn tập
          </button>
          <button type="button" onClick={() => navigate('/history')}>
            <span className="menu-icon clock" aria-hidden="true" />
            Lịch sử
          </button>
          <button type="button" onClick={() => navigate('/settings')}>
            <span className="menu-icon gear" aria-hidden="true" />
            Cài đặt
          </button>
        </section>
      </section>
    </main>
  );
}

export default Home;
