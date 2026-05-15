export const cardEffects = {
  opportunity: {
    1: {
      title: 'Tham gia tuyên truyền phòng chống mua bán người tại địa phương.',
      type: 'delta',
      points: 1,
    },
    2: {
      title: 'Nắm rõ Điều 150 Bộ luật Hình sự năm 2015 và giải thích cho gia đình.',
      type: 'delta',
      points: 1,
    },
    3: {
      title: 'Thuộc lòng số Tổng đài 111 và 113.',
      type: 'delta',
      points: 1,
    },
    4: {
      title: 'Hỗ trợ nạn nhân bị mua bán trở về tái hòa nhập cộng đồng.',
      type: 'delta',
      points: 1,
    },
    5: {
      title: 'Phát hiện em bé đi cùng người lạ có biểu hiện nghi vấn và báo an ninh sân bay.',
      type: 'delta',
      points: 2,
    },
    6: {
      title: 'Chia sẻ bài cảnh báo thủ đoạn "việc nhẹ lương cao" lên Facebook cá nhân.',
      type: 'delta',
      points: 1,
    },
    7: {
      title: 'Giải thích nguy cơ của kết hôn giả với người nước ngoài cho người thân.',
      type: 'delta',
      points: 1,
    },
    8: {
      title: 'Lưu số liên hệ khẩn cấp của Đại sứ quán Việt Nam tại Anh trước khi du học.',
      type: 'delta',
      points: 2,
    },
    9: {
      title: 'Bạn được tặng 1 Khiên.',
      type: 'shield',
    },
    10: {
      title: 'Kiên quyết không đưa hộ chiếu gốc.',
      type: 'note',
      note: 'An toàn, không mất lượt.',
    },
    11: {
      title: 'Từ chối ký hợp đồng thiếu bảo hiểm, nghỉ ngơi.',
      type: 'note',
      note: 'Không bị trừ điểm.',
    },
    12: {
      title: 'Báo cáo nhóm Facebook chuyên tuyển người sang Campuchia làm game cờ bạc.',
      type: 'delta',
      points: 1,
    },
    13: {
      title: 'Không đăng ảnh vé máy bay hay hộ chiếu lên mạng xã hội.',
      type: 'delta',
      points: 1,
    },
    14: {
      title: 'Lưu số Tổng đài bảo hộ công dân +844.62.844.844 trong danh bạ.',
      type: 'delta',
      points: 2,
    },
    15: {
      title: 'Nhận ra ảnh văn phòng sang chảnh là ảnh photoshop lấy từ mạng.',
      type: 'delta',
      points: 2,
    },
    16: {
      title: 'Phát hiện địa chỉ công ty tuyển dụng trên Google Maps là bãi đất trống.',
      type: 'delta',
      points: 1,
    },
  },
  risk: {
    1: {
      title: 'Nghe lời người yêu qua mạng đi du lịch gần biên giới và bị bán sang Campuchia.',
      type: 'delta',
      points: -5,
    },
    2: {
      title: 'Ký hợp đồng toàn tiếng nước ngoài mà không hiểu nội dung.',
      type: 'note',
      note: 'Lùi 5 bước ngoài bàn chơi.',
    },
    3: {
      title: 'Bị ép làm việc 18 tiếng/ngày và bị chích điện nếu không đạt chỉ tiêu.',
      type: 'delta',
      points: -10,
      note: 'Lùi 3 bước ngoài bàn chơi.',
    },
    4: {
      title: 'Lừa thêm một người bạn khác sang Campuchia để thế thân.',
      type: 'delta',
      points: -15,
      note: 'Lùi 3 bước ngoài bàn chơi.',
    },
    5: {
      title: 'Kẻ buôn người gọi điện về nhà đòi 200 triệu tiền chuộc.',
      type: 'half',
      note: 'Trừ 50% tổng số điểm.',
    },
    6: {
      title: 'Tin người xe ôm lạ ở bến xe biên giới.',
      type: 'note',
      note: 'Đi thẳng đến ô "Hang ổ buôn người" ngoài bàn chơi.',
    },
    7: {
      title: 'Vay nóng để đóng phí môi giới cho công ty lừa đảo.',
      type: 'delta',
      points: -7,
    },
    8: {
      title: 'Bị lừa sang Trung Quốc bán thận chui.',
      type: 'set-zero',
      note: 'Mất hết số điểm.',
    },
    9: {
      title: 'Tin quảng cáo sang Ấn Độ làm việc văn phòng lương 1000$ mà không kiểm tra.',
      type: 'delta',
      points: -7,
    },
    10: {
      title: 'Đăng ký thực tập hưởng lương ở nước ngoài rồi bị thu hộ chiếu.',
      type: 'delta',
      points: -10,
      note: 'Lùi 3 bước ngoài bàn chơi.',
    },
    11: {
      title: 'Bị thao túng tâm lý, tin rằng gia đình đã bỏ rơi mình.',
      type: 'skip',
      turns: 2,
      note: 'Mất 2 lượt.',
    },
    12: {
      title: 'Tin tưởng công việc tiếp thị trực tuyến trên Threads.',
      type: 'half',
      note: 'Mất 50% điểm.',
    },
    13: {
      title: 'Bị lừa đi khám sức khỏe để xét nghiệm tương thích hiến thận.',
      type: 'note',
      note: 'Quay lại ô Bắt đầu ngoài bàn chơi.',
    },
    14: {
      title: 'Người yêu nhờ cầm hộ quà về Việt Nam, hải quan phát hiện là ma túy.',
      type: 'eliminate',
      note: 'Dừng cuộc chơi.',
    },
    15: {
      title: 'Chủ sử dụng lao động thu giữ hộ chiếu với lý do làm thủ tục cư trú.',
      type: 'skip',
      turns: 1,
      note: 'Mất 1 lượt.',
    },
    16: {
      title: 'Vừa trốn khỏi công ty lừa đảo nhưng gặp taxi đưa ngược về nơi nguy hiểm.',
      type: 'note',
      note: 'Đi đến ô "Hang ổ buôn người" ngoài bàn chơi.',
    },
  },
};

export const getCardEffect = (cardKind, cardNumber) => (
  cardEffects[cardKind]?.[Number(cardNumber)] ?? null
);
