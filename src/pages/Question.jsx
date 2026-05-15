import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Question({ activePlayer, onAddScore, onNextPlayer, onResolveChallenge, pendingChallenge }) {
  const [answerText, setAnswerText] = useState('');
  const [error, setError] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [evaluationStage, setEvaluationStage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [questionId, setQuestionId] = useState('');
  const navigate = useNavigate();

  const evaluateAnswer = async () => {
    if (hasSubmitted) {
      return;
    }

    if (!questionId.trim()) {
      setError('Hãy nhập mã câu hỏi đã rút trước.');
      return;
    }

    if (!answerText.trim()) {
      setError('Hãy nhập câu trả lời trước khi chấm.');
      return;
    }

    setError('');
    setEvaluation(null);
    setHasSubmitted(true);
    setIsEvaluating(true);
    setEvaluationStage('Đang gửi câu trả lời để AI chấm...');

    try {
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: questionId.trim(),
          answer: answerText.trim(),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setHasSubmitted(false);
        throw new Error(data.error || 'Không chấm được câu trả lời.');
      }

      setEvaluation(data);
      setEvaluationStage('AI đã chấm xong.');
    } catch (requestError) {
      setError(requestError.message);
      setEvaluationStage('');
    } finally {
      setIsEvaluating(false);
    }
  };

  const applyAiResult = () => {
    if (!evaluation) {
      return;
    }

    const isCorrect = evaluation.verdict.result === 'correct';

    if (pendingChallenge) {
      const points = isCorrect
        ? pendingChallenge.points
        : pendingChallenge.points * 2;

      onResolveChallenge(points);
      navigate('/dice');
      return;
    }

    if (isCorrect) {
      onAddScore(1);
    }

    onNextPlayer();
    navigate('/dice');
  };

  const verdictLabels = {
    correct: 'Đúng',
    incorrect: 'Sai',
    not_applicable: 'Không hợp lệ',
  };
  const isCorrect = evaluation?.verdict.result === 'correct';
  const resultMessage = isCorrect
    ? 'Câu trả lời được tính là đúng.'
    : 'Câu trả lời chưa đúng. Lượt này sẽ kết thúc.';

  return (
    <main className="question-page">
      <section className="question-panel">
        <p className="eyebrow">Câu hỏi</p>
        <h1>Câu trả lời của {activePlayer.name}</h1>
        {pendingChallenge && (
          <p className="challenge-penalty">
            Điểm phạt thử thách: <strong>{pendingChallenge.points}</strong> điểm.
            Trả lời sai sẽ bị <strong>{pendingChallenge.points * 2}</strong> điểm.
          </p>
        )}

        <div className="answer-workflow">
          <label htmlFor="question-id">Mã câu hỏi đã rút</label>
          <input
            id="question-id"
            min="1"
            type="number"
            value={questionId}
            disabled={hasSubmitted}
            onChange={(event) => setQuestionId(event.target.value)}
            placeholder="Ví dụ: 7"
          />

          <p className="ai-status" aria-live="polite">
            {evaluationStage || 'Mỗi người chỉ được gửi câu trả lời một lần.'}
          </p>

          <label htmlFor="answer-text">Câu trả lời</label>
          <textarea
            id="answer-text"
            value={answerText}
            disabled={hasSubmitted}
            onChange={(event) => setAnswerText(event.target.value)}
            placeholder="Nhập câu trả lời của người chơi tại đây."
            rows={6}
          />

          <button
            className="primary-button"
            type="button"
            disabled={hasSubmitted || isEvaluating || !answerText.trim()}
            onClick={evaluateAnswer}
          >
            {isEvaluating ? 'Đang chấm...' : 'Gửi câu trả lời'}
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}
      </section>

      {evaluation && (
        <div className="modal-backdrop" role="presentation">
          <section
            aria-labelledby="answer-result-title"
            aria-modal="true"
            className={isCorrect ? 'confirm-modal answer-result-modal success' : 'confirm-modal answer-result-modal blocked'}
            role="dialog"
          >
            <p className="eyebrow">Kết quả</p>
            <h2 id="answer-result-title">
              {verdictLabels[evaluation.verdict.result] ?? evaluation.verdict.result}
            </h2>
            <p>{resultMessage}</p>
            <button className="primary-button" type="button" onClick={applyAiResult}>
              Đã hiểu
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

export default Question;
