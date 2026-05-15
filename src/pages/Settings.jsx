import { useNavigate } from 'react-router-dom';

function Settings({ onResetGame, onResetSettings, onUpdateSettings, settings }) {
  const navigate = useNavigate();

  const updateSetting = (key) => (event) => {
    onUpdateSettings({
      ...settings,
      [key]: event.target.checked,
    });
  };

  return (
    <main className="settings-page">
      <section className="settings-panel">
        <div className="settings-header">
          <div>
            <p className="eyebrow">Cài đặt</p>
            <h1>Tùy chỉnh trò chơi</h1>
          </div>
          <button className="secondary-button compact" type="button" onClick={() => navigate('/')}>
            Trang chủ
          </button>
        </div>

        <div className="settings-list">
          <label className="setting-row" htmlFor="large-text">
            <span>
              <strong>Chữ lớn</strong>
              <small>Tăng cỡ chữ trong các màn hình chính.</small>
            </span>
            <input
              id="large-text"
              type="checkbox"
              checked={settings.largeText}
              onChange={updateSetting('largeText')}
            />
          </label>

          <label className="setting-row" htmlFor="compact-scoreboard">
            <span>
              <strong>Bảng điểm gọn</strong>
              <small>Giảm chiều cao từng người chơi để dễ nhìn trên màn hình nhỏ.</small>
            </span>
            <input
              id="compact-scoreboard"
              type="checkbox"
              checked={settings.compactScoreboard}
              onChange={updateSetting('compactScoreboard')}
            />
          </label>

          <label className="setting-row" htmlFor="hide-eliminated">
            <span>
              <strong>Ẩn người đã dừng</strong>
              <small>Không hiển thị người chơi đã dừng cuộc chơi trong bảng điểm.</small>
            </span>
            <input
              id="hide-eliminated"
              type="checkbox"
              checked={settings.hideEliminatedPlayers}
              onChange={updateSetting('hideEliminatedPlayers')}
            />
          </label>
        </div>

        <div className="settings-actions">
          <button className="secondary-button" type="button" onClick={onResetSettings}>
            Khôi phục cài đặt
          </button>
          <button className="danger-button" type="button" onClick={onResetGame}>
            Xóa ván hiện tại
          </button>
        </div>
      </section>
    </main>
  );
}

export default Settings;
