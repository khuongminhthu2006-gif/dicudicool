import { useNavigate } from 'react-router-dom';

function Summary() {
  const navigate = useNavigate();

  return (
    <main className="summary-page">
      <section className="summary-panel">
        <div className="summary-header">
          <div>
            <p className="eyebrow">Tổng quan</p>
            <h1>Kịch bản trò chơi</h1>
          </div>
          <button className="secondary-button compact" type="button" onClick={() => navigate('/')}>
            Trang chủ
          </button>
        </div>

        <div className="summary-script">
          <p>
            Người chơi sẽ nhập vai những người trong nhóm xã hội có nguy cơ cao trở thành nạn nhân của mua bán người như sinh viên, lao động phổ thông, lao động tự do, freelancer hoặc người chuẩn bị xuất khẩu lao động, và di chuyển trên bàn cờ theo kết quả tung xúc xắc. Mỗi nhân vật sẽ có lợi thế và khó khăn riêng (Ví dụ vai bạn sinh viên có lợi thế về ngoại ngữ nhưng lại thiếu mạng lưới kết nối việc làm, dễ dính tuyển dụng ảo). Các ô sẽ được chia thành 2 ô chính đó là các ô cơ hội (cộng điểm, rút thẻ kiến thức) và ô rủi ro (trừ điểm, xử lý tình huống), cùng một số ô đặc biệt như mất lượt, “khóa tài khoản” hay “hang ổ buôn người” buộc người chơi phải điều chỉnh chiến lược.
          </p>
          <p>
            Người chơi bắt đầu với 20 điểm, có thể chơi cá nhân hoặc theo nhóm 2vs2, được cộng 5 điểm khi đi qua ô Bắt đầu và phải hoàn thành thử thách, chịu hình phạt theo quy định và hỗ trợ đồng đội mình, qua đó rèn luyện khả năng đánh giá rủi ro, ra quyết định và tự bảo vệ, phù hợp với mục tiêu giáo dục phòng, chống mua bán người dựa trên trải nghiệm.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Summary;
