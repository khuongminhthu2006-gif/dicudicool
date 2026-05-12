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
        setEvaluationStage('Recording saved. Replay it, then submit when ready.');
      });

      mediaRecorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((currentSeconds) => currentSeconds + 1);
      }, 1000);
    } catch {
      setError('Microphone access failed. Allow microphone permission and try again.');
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
      setError('Enter the pulled question ID first.');
      return;
    }

    if (!recording) {
      setError('Record an answer before evaluating.');
      return;
    }

    setError('');
    setIsEvaluating(true);
    setEvaluationStage('Sending recording to the AI server...');

    try {
      const formData = new FormData();
      formData.append('questionId', questionId.trim());
      formData.append('audio', recording, 'answer.webm');

      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        body: formData,
      });
      setEvaluationStage('Waiting for OpenAI transcription and answer judging...');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to evaluate answer.');
      }

      setEvaluation(data);
      setEvaluationStage('AI evaluation complete.');
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

  return (
    <main className="question-page">
      <section className="question-panel">
        <p className="eyebrow">Question</p>
        <h1>{activePlayer.name}&apos;s answer</h1>
        {pendingChallenge && (
          <p className="challenge-penalty">
            Challenge penalty: <strong>{pendingChallenge.points}</strong> point
            {Math.abs(pendingChallenge.points) === 1 ? '' : 's'}.
            Wrong answer applies <strong>{pendingChallenge.points * 2}</strong> points.
          </p>
        )}

        <div className="answer-workflow">
          <label htmlFor="question-id">Pulled question ID</label>
          <input
            id="question-id"
            min="1"
            type="number"
            value={questionId}
            onChange={(event) => setQuestionId(event.target.value)}
            placeholder="Example: 7"
          />

          <div className="recording-control">
            <button
              className={isRecording ? 'danger-button' : 'primary-button'}
              type="button"
              disabled={isEvaluating}
              onClick={toggleRecording}
            >
              {isRecording ? 'Stop Recording' : 'Record Answer'}
            </button>
            <span className={isRecording ? 'recording-timer active' : 'recording-timer'}>
              {formatRecordingTime(recordingSeconds)}
            </span>
          </div>

          <p className="ai-status" aria-live="polite">
            {evaluationStage || 'Record an answer, replay it, then submit for AI evaluation.'}
          </p>

          <div className={audioUrl ? 'recording-playback' : 'recording-playback empty'}>
            <span>Recorded answer</span>
            {audioUrl ? (
              <audio controls src={audioUrl}>
                <track kind="captions" />
              </audio>
            ) : (
              <div className="empty-recording">No recording yet</div>
            )}
          </div>

          <button
            className="primary-button"
            type="button"
            disabled={isRecording || isEvaluating || !audioBlob}
            onClick={() => evaluateAnswer()}
          >
            {isEvaluating ? 'Submitting...' : 'Submit Answer'}
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}

        {evaluation && (
          <section className="ai-result" aria-live="polite">
            <h2>{evaluation.verdict.result.replace('_', ' ')}</h2>
            <button className="primary-button" type="button" onClick={applyAiResult}>
              Apply AI Result
            </button>
          </section>
        )}
      </section>
    </main>
  );
}

export default Question;
