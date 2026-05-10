const players = [
  { name: 'Player 1', score: 1250, avatar: 'M' },
  { name: 'Player 2', score: 950, avatar: 'N' },
  { name: 'Player 3', score: 750, avatar: 'U' },
  { name: 'Player 4', score: 600, avatar: 'A' }
];

const state = {
  currentPlayer: 0,
  currentQuestion: null,
  challengeMode: false,
  questionCursor: 0,
  usedQuestionIds: new Set(),
  history: [],
  timer: null,
  timeLimit: 30,
  timeLeft: 30,
  soundOn: true,
  studyIndex: 0,
  showingAnswer: false
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const screens = {
  home: $('#homeScreen'),
  game: $('#gameScreen'),
  study: $('#studyScreen')
};

const currentPlayerName = $('#currentPlayerName');
const currentPlayerScore = $('#currentPlayerScore');
const timerText = $('#timerText');
const timerBar = $('#timerBar');
const playerList = $('#playerList');
const tileType = $('#tileType');
const mainText = $('#mainText');
const tileInput = $('#tileInput');
const tileKind = $('#tileKind');
const answerInput = $('#answerInput');
const answerPanel = $('#answerPanel');
const rewardPanel = $('#rewardPanel');
const resultBanner = $('#resultBanner');
const aiMessage = $('#aiMessage');
const turnStatus = $('#turnStatus');
const questionProgress = $('#questionProgress');
const usedQuestionCount = $('#usedQuestionCount');
const historyDialog = $('#historyDialog');
const historyList = $('#historyList');
const studyScore = $('#studyScore');
const studyCount = $('#studyCount');
const studyQuestion = $('#studyQuestion');
const studyAnswer = $('#studyAnswer');
const studyPercent = $('#studyPercent');
const learnedCount = $('#learnedCount');
const leftCount = $('#leftCount');

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

function formatScore(value) {
  return value.toLocaleString('vi-VN');
}

function showScreen(name) {
  Object.entries(screens).forEach(([key, screen]) => {
    screen.classList.toggle('is-active', key === name);
  });

  if (name === 'game') {
    renderPlayers();
    resetTimer();
  }

  if (name === 'study') {
    renderStudyCard();
  }
}

function renderPlayers() {
  playerList.innerHTML = players.map((player, index) => `
    <article class="player-row ${index === state.currentPlayer ? 'is-active' : ''}">
      <div class="mini-avatar">${['R', 'B', 'T', 'K'][index]}</div>
      <div>
        <strong>${player.name.toUpperCase()}</strong>
        <span>${formatScore(player.score)} 🟡</span>
      </div>
    </article>
  `).join('');

  const player = players[state.currentPlayer];
  currentPlayerName.textContent = player.name.toUpperCase();
  currentPlayerScore.textContent = `${formatScore(player.score)} 🟡`;
  studyScore.textContent = formatScore(players[0].score);
}

function updateQuestionStats() {
  questionProgress.textContent = `Câu hỏi: ${Math.min(state.questionCursor + 1, QUESTION_BANK.length)} / ${QUESTION_BANK.length}`;
  usedQuestionCount.textContent = `Đã dùng: ${state.usedQuestionIds.size}`;
}

function setStage(type, text, message, result = '⏱ Còn 00:30 giây', resultClass = '') {
  tileType.textContent = type;
  mainText.textContent = text;
  aiMessage.textContent = message;
  resultBanner.textContent = result;
  resultBanner.className = resultClass;
}

function setAnswerMode(enabled) {
  answerPanel.style.display = enabled ? 'grid' : 'none';
  answerInput.disabled = !enabled;
  if (enabled) answerInput.focus();
}

function setRewardMode(enabled) {
  rewardPanel.classList.toggle('is-visible', enabled);
}

function resetTimer() {
  clearInterval(state.timer);
  state.timer = null;
  state.timeLeft = state.timeLimit;
  updateTimer();
}

function startTimer() {
  resetTimer();
  state.timer = setInterval(() => {
    state.timeLeft -= 1;
    updateTimer();

    if (state.timeLeft === 10) {
      aiMessage.textContent = 'Sắp hết giờ rồi, quyết nhanh nhé!';
    }

    if (state.timeLeft <= 0) {
      clearInterval(state.timer);
      markAnswer(false, 'Hết giờ');
    }
  }, 1000);
}

function updateTimer() {
  const safeTime = Math.max(state.timeLeft, 0);
  const percent = state.timeLimit ? (safeTime / state.timeLimit) * 100 : 0;
  timerText.textContent = `00:${String(safeTime).padStart(2, '0')}`;
  timerBar.style.width = `${percent}%`;
  resultBanner.textContent = `⏱ Còn 00:${String(safeTime).padStart(2, '0')} giây`;
}

function nextUnusedQuestion() {
  if (state.usedQuestionIds.size >= QUESTION_BANK.length) {
    state.usedQuestionIds.clear();
    state.questionCursor = 0;
  }

  let question = QUESTION_BANK[state.questionCursor % QUESTION_BANK.length];
  while (state.usedQuestionIds.has(question.id)) {
    state.questionCursor += 1;
    question = QUESTION_BANK[state.questionCursor % QUESTION_BANK.length];
  }

  state.currentQuestion = question;
  state.usedQuestionIds.add(question.id);
  state.questionCursor += 1;
  updateQuestionStats();
  return question;
}

function activateTile() {
  const tileNumber = tileInput.value || '?';
  const kind = tileKind.value;
  setRewardMode(false);
  resetTimer();

  if (kind === 'question') {
    const question = nextUnusedQuestion();
    state.challengeMode = false;
    setAnswerMode(true);
    setStage(
      `Ô CÂU HỎI #${tileNumber}`,
      'BẮT ĐẦU',
      question.question,
      '⏱ Còn 00:30 giây'
    );
    answerInput.value = '';
    turnStatus.textContent = 'Nghe câu hỏi và nhập đáp án.';
    startTimer();
    return;
  }

  if (kind === 'trap') {
    applyScore(-100);
    setAnswerMode(false);
    setStage(
      `Ô BẪY #${tileNumber}`,
      'DÍNH BẪY',
      'Người chơi bị trừ 100 điểm. Lượt sau phải tỉnh táo hơn.',
      '-100 điểm',
      'trap'
    );
    addHistory('Bẫy', `Ô ${tileNumber}: trừ 100 điểm`, false);
    return;
  }

  setAnswerMode(false);
  setRewardMode(true);
  setStage(
    `Ô THƯỞNG #${tileNumber}`,
    'CHỌN THƯỞNG',
    'Nhận thưởng an toàn hoặc thử thách để lấy điểm cao hơn.',
    'Chờ chọn thưởng',
    'reward'
  );
}

function scoreAnswer(answer, question) {
  const cleanAnswer = normalizeText(answer);
  const cleanExpected = normalizeText(question.answer);
  const hasKeyword = question.keywords.some((keyword) => cleanAnswer.includes(normalizeText(keyword)));
  return cleanAnswer.length > 0 && (cleanExpected.includes(cleanAnswer) || hasKeyword);
}

function submitAnswer() {
  if (!state.currentQuestion) {
    setStage('CHƯA CÓ CÂU HỎI', 'BẮT ĐẦU', 'Hãy bấm BẮT ĐẦU để kích hoạt ô câu hỏi trước.', 'Thiếu câu hỏi');
    return;
  }

  if (!answerInput.value.trim()) {
    aiMessage.textContent = 'Chưa nhập đáp án. Đừng nộp giấy trắng nhé.';
    answerInput.focus();
    return;
  }

  markAnswer(scoreAnswer(answerInput.value, state.currentQuestion), answerInput.value);
}

function markAnswer(isCorrect, submittedAnswer) {
  clearInterval(state.timer);

  if (!state.currentQuestion) return;

  const question = state.currentQuestion;
  const delta = state.challengeMode
    ? (isCorrect ? 180 : -80)
    : (isCorrect ? 100 : -50);
  applyScore(delta);

  setStage(
    isCorrect ? 'ĐÚNG' : 'SAI',
    isCorrect ? 'TRẢ LỜI ĐÚNG' : 'TRẢ LỜI SAI',
    isCorrect ? `+${delta} điểm. Câu trả lời hợp lệ.` : `${delta} điểm. Gợi ý đúng: ${question.answer}`,
    isCorrect ? `+${delta} điểm` : `${delta} điểm`,
    isCorrect ? 'correct' : 'wrong'
  );

  addHistory('Câu hỏi', `${question.question} | Trả lời: ${submittedAnswer}`, isCorrect);
  setAnswerMode(false);
  state.currentQuestion = null;
  state.challengeMode = false;
}

function applyScore(delta) {
  const player = players[state.currentPlayer];
  player.score = Math.max(0, player.score + delta);
  renderPlayers();
}

function addHistory(type, content, correct) {
  state.history.unshift({
    player: players[state.currentPlayer].name,
    type,
    content,
    correct,
    time: new Date().toLocaleTimeString('vi-VN')
  });
}

function nextTurn() {
  clearInterval(state.timer);
  state.currentPlayer = (state.currentPlayer + 1) % players.length;
  state.currentQuestion = null;
  state.challengeMode = false;
  setAnswerMode(false);
  setRewardMode(false);
  resetTimer();
  renderPlayers();
  setStage(
    'Xin chào!',
    'BẮT ĐẦU',
    'Chọn loại ô rồi bấm BẮT ĐẦU để hiện câu hỏi tự luận.',
    '⏱ Còn 00:30 giây'
  );
  turnStatus.textContent = 'Bấm BẮT ĐẦU để nhận câu hỏi.';
}

function showHistory() {
  historyList.innerHTML = state.history.length
    ? state.history.map((item) => `
        <li>
          <strong>${item.time} - ${item.player}</strong><br />
          ${item.type}: ${item.content}<br />
          Kết quả: ${item.correct ? 'Đúng / Có lợi' : 'Sai / Bất lợi'}
        </li>
      `).join('')
    : '<li>Chưa có lịch sử.</li>';
  historyDialog.showModal();
}

function renderStudyCard() {
  const total = QUESTION_BANK.length;
  const question = QUESTION_BANK[state.studyIndex];
  const learned = state.studyIndex + 1;
  const percent = Math.round((learned / total) * 100);

  state.showingAnswer = false;
  studyCount.textContent = `${learned} / ${total}`;
  studyQuestion.textContent = question.question;
  studyAnswer.textContent = '';
  studyPercent.textContent = `${percent}%`;
  learnedCount.textContent = learned;
  leftCount.textContent = Math.max(total - learned, 0);
  studyScore.textContent = formatScore(players[0].score);
}

function showStudyAnswer() {
  const question = QUESTION_BANK[state.studyIndex];
  state.showingAnswer = true;
  studyAnswer.textContent = question.answer;
}

function moveStudyCard(direction) {
  const total = QUESTION_BANK.length;
  state.studyIndex = (state.studyIndex + direction + total) % total;
  renderStudyCard();
}

function bindEvents() {
  $('#startBtn').addEventListener('click', () => showScreen('game'));

  $$('[data-screen]').forEach((button) => {
    button.addEventListener('click', () => showScreen(button.dataset.screen));
  });

  $('#homeHistoryBtn').addEventListener('click', showHistory);
  $('#homeSettingsBtn').addEventListener('click', () => {
    alert('Cài đặt hiện tại nằm trong màn hình câu hỏi.');
  });

  $('#activateTileBtn').addEventListener('click', activateTile);
  $('#submitAnswerBtn').addEventListener('click', submitAnswer);
  answerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.ctrlKey) submitAnswer();
  });

  $('#safeRewardBtn').addEventListener('click', () => {
    applyScore(80);
    setRewardMode(false);
    setStage('NHẬN THƯỞNG', '+80 ĐIỂM', 'Chắc chắn đôi khi là lựa chọn thông minh.', '+80 điểm', 'reward');
    addHistory('Thưởng', 'Nhận thưởng an toàn +80 điểm', true);
  });

  $('#challengeRewardBtn').addEventListener('click', () => {
    const question = nextUnusedQuestion();
    state.currentQuestion = question;
    state.challengeMode = true;
    setRewardMode(false);
    setAnswerMode(true);
    setStage('THỬ THÁCH', 'BẮT ĐẦU', question.question, 'Thử thách');
    startTimer();
  });

  $('#nextTurnBtn').addEventListener('click', nextTurn);
  $('#skipQuestionBtn').addEventListener('click', () => {
    clearInterval(state.timer);
    state.currentQuestion = null;
    state.challengeMode = false;
    setAnswerMode(false);
    setStage('BỎ QUA', 'BỎ QUA', 'Câu hỏi đã được bỏ qua.', 'Đã bỏ qua');
    addHistory('Override', 'Bỏ qua câu hỏi', true);
  });

  $('#historyBtn').addEventListener('click', showHistory);
  $('#closeHistoryBtn').addEventListener('click', () => historyDialog.close());
  $('#soundBtn').addEventListener('click', (event) => {
    state.soundOn = !state.soundOn;
    event.currentTarget.textContent = state.soundOn ? '⚙ CÀI ĐẶT' : '⚙ CÀI ĐẶT';
    aiMessage.textContent = 'Câu hỏi đang ở chế độ tự luận.';
  });

  $('#showAnswerBtn').addEventListener('click', showStudyAnswer);
  $('#flashCard').addEventListener('click', showStudyAnswer);
  $('#prevCardBtn').addEventListener('click', () => moveStudyCard(-1));
  $('#nextCardBtn').addEventListener('click', () => moveStudyCard(1));
}

function init() {
  renderPlayers();
  updateQuestionStats();
  renderStudyCard();
  setAnswerMode(false);
  setRewardMode(false);
  resetTimer();
  bindEvents();
}

init();

