import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Question({ activePlayer, onAddScore, onNextPlayer, onResolveChallenge, pendingChallenge }) {
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [evaluationStage, setEvaluationStage] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [questionId, setQuestionId] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => () => {
    clearInterval(timerRef.current);
  }, []);

  const audioUrl = useMemo(() => (
    audioBlob ? URL.createObjectURL(audioBlob) : ''
  ), [audioBlob]);

  useEffect(() => {
    if (!audioUrl) {
      return undefined;
    }

    return () => URL.revokeObjectURL(audioUrl);
  }, [audioUrl]);

  const formatRecordingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');

    return `${minutes}:${remainingSeconds}`;
  };

  const startRecording = async () => {
    try {
      setError('');
      setEvaluation(null);
      setEvaluationStage('');
      setAudioBlob(null);
      setRecordingSeconds(0);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      });

      mediaRecorder.addEventListener('stop', () => {
        const recording = new Blob(chunksRef.current, { type: 'audio/webm' });

        setAudioBlob(recording);
        stream.getTracks().forEach((track) => track.stop());
        setEvaluationStage('Đã lưu bản ghi. Nghe lại rồi gửi khi sẵn sàng.');
      });

      mediaRecorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((currentSeconds) => currentSeconds + 1);
      }, 1000);
    } catch {
      setError('Không truy cập được micro. Hãy cấp quyền micro rồi thử lại.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    startRecording();
  };

  const evaluateAnswer = async (recording = audioBlob) => {
    if (!questionId.trim()) {
      setError('Hãy nhập mã câu hỏi đã rút trước.');
      return;
    }

    if (!recording) {
      setError('Hãy ghi âm câu trả lời trước khi chấm.');
      return;
    }

    setError('');
    setIsEvaluating(true);
    setEvaluationStage('Đang gửi bản ghi đến máy chủ AI...');

    try {
      const formData = new FormData();
      formData.append('questionId', questionId.trim());
      formData.append('audio', recording, 'answer.webm');

      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        body: formData,
      });
      setEvaluationStage('Đang chờ AI chuyển giọng nói thành văn bản và chấm câu trả lời...');
      const data = await response.json();

      if (!response.ok) {
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
            onChange={(event) => setQuestionId(event.target.value)}
            placeholder="Ví dụ: 7"
          />

          <div className="recording-control">
            <button
              className={isRecording ? 'danger-button' : 'primary-button'}
              type="button"
              disabled={isEvaluating}
              onClick={toggleRecording}
            >
              {isRecording ? 'Dừng ghi âm' : 'Ghi câu trả lời'}
            </button>
            <span className={isRecording ? 'recording-timer active' : 'recording-timer'}>
              {formatRecordingTime(recordingSeconds)}
            </span>
          </div>

          <p className="ai-status" aria-live="polite">
            {evaluationStage || 'Ghi câu trả lời, nghe lại, rồi gửi để AI chấm.'}
          </p>

          <div className={audioUrl ? 'recording-playback' : 'recording-playback empty'}>
            <span>Bản ghi</span>
            {audioUrl ? (
              <audio controls src={audioUrl}>
                <track kind="captions" />
              </audio>
            ) : (
              <div className="empty-recording">Chưa có bản ghi</div>
            )}
          </div>

          <button
            className="primary-button"
            type="button"
            disabled={isRecording || isEvaluating || !audioBlob}
            onClick={() => evaluateAnswer()}
          >
            {isEvaluating ? 'Đang gửi...' : 'Gửi câu trả lời'}
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        {evaluation && (
          <section className="ai-result" aria-live="polite">
            <h2>{verdictLabels[evaluation.verdict.result] ?? evaluation.verdict.result}</h2>
            <button className="primary-button" type="button" onClick={applyAiResult}>
              Áp dụng kết quả
            </button>
          </section>
        )}
      </section>
    </main>
  );
}

export default Question;
