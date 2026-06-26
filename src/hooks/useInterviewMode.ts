import { useCallback, useMemo, useState } from 'react';
import type { InterviewLevel, InterviewTrack } from '../data/interviewTypes';
import { theoryQuestions } from '../data/interviewQuestions';
import { practicalChallenges } from '../data/interviewPractical';
import { behavioralQuestions } from '../data/interviewBehavioral';

export type InterviewStage = 'setup' | 'theory' | 'practical' | 'behavioral' | 'result';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const TRACK_LABELS: Record<InterviewTrack, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  fullstack: 'Full Stack',
  security: 'Segurança',
};

const LEVEL_LABELS: Record<InterviewLevel, string> = {
  junior: 'Júnior',
  pleno: 'Pleno',
  senior: 'Sênior',
};

export function useInterviewMode() {
  const [stage, setStage] = useState<InterviewStage>('setup');
  const [track, setTrack] = useState<InterviewTrack>('fullstack');
  const [level, setLevel] = useState<InterviewLevel>('pleno');

  const [theoryIdx, setTheoryIdx] = useState(0);
  const [theoryAnswers, setTheoryAnswers] = useState<Record<string, boolean>>({});

  const [practicalIdx, setPracticalIdx] = useState(0);
  const [practicalPassed, setPracticalPassed] = useState<Record<string, boolean>>({});
  const [practicalAttempted, setPracticalAttempted] = useState<Record<string, boolean>>({});

  const [behavioralIdx, setBehavioralIdx] = useState(0);
  const [behavioralAnswers, setBehavioralAnswers] = useState<Record<string, string>>({});

  const sessionTheory = useMemo(() => {
    const filtered = theoryQuestions.filter((q) => q.track.includes(track) && q.level.includes(level));
    return shuffle(filtered).slice(0, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage === 'setup']);

  const sessionPractical = useMemo(() => {
    const filtered = practicalChallenges.filter((c) => c.track.includes(track) && c.level.includes(level));
    return shuffle(filtered).slice(0, 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage === 'setup']);

  const sessionBehavioral = useMemo(() => {
    const filtered = behavioralQuestions.filter((q) => q.level.includes(level));
    return shuffle(filtered).slice(0, 4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage === 'setup']);

  const startInterview = useCallback((selectedTrack: InterviewTrack, selectedLevel: InterviewLevel) => {
    setTrack(selectedTrack);
    setLevel(selectedLevel);
    setTheoryIdx(0);
    setTheoryAnswers({});
    setPracticalIdx(0);
    setPracticalPassed({});
    setPracticalAttempted({});
    setBehavioralIdx(0);
    setBehavioralAnswers({});
    setStage('theory');
  }, []);

  const answerTheory = useCallback((questionId: string, correct: boolean) => {
    setTheoryAnswers((prev) => ({ ...prev, [questionId]: correct }));
  }, []);

  const nextTheory = useCallback(() => {
    setTheoryIdx((i) => {
      if (i + 1 >= sessionTheory.length) {
        setStage(sessionPractical.length > 0 ? 'practical' : 'behavioral');
        return i;
      }
      return i + 1;
    });
  }, [sessionTheory.length, sessionPractical.length]);

  const markPractical = useCallback((challengeId: string, passed: boolean) => {
    setPracticalAttempted((prev) => ({ ...prev, [challengeId]: true }));
    setPracticalPassed((prev) => ({ ...prev, [challengeId]: passed }));
  }, []);

  const nextPractical = useCallback(() => {
    setPracticalIdx((i) => {
      if (i + 1 >= sessionPractical.length) {
        setStage('behavioral');
        return i;
      }
      return i + 1;
    });
  }, [sessionPractical.length]);

  const answerBehavioral = useCallback((questionId: string, text: string) => {
    setBehavioralAnswers((prev) => ({ ...prev, [questionId]: text }));
  }, []);

  const nextBehavioral = useCallback(() => {
    setBehavioralIdx((i) => {
      if (i + 1 >= sessionBehavioral.length) {
        setStage('result');
        return i;
      }
      return i + 1;
    });
  }, [sessionBehavioral.length]);

  const skipToResult = useCallback(() => setStage('result'), []);

  const restart = useCallback(() => {
    setStage('setup');
  }, []);

  const result = useMemo(() => {
    const theoryTotal = sessionTheory.length;
    const theoryCorrect = Object.values(theoryAnswers).filter(Boolean).length;
    const theoryScore = theoryTotal > 0 ? Math.round((theoryCorrect / theoryTotal) * 100) : 0;

    const practicalAttemptedCount = Object.keys(practicalAttempted).length;
    const practicalPassedCount = Object.values(practicalPassed).filter(Boolean).length;
    const practicalScore = sessionPractical.length > 0 ? Math.round((practicalPassedCount / sessionPractical.length) * 100) : 0;

    const behavioralAnsweredCount = Object.values(behavioralAnswers).filter((v) => v.trim().length > 0).length;
    const behavioralCompleteness = sessionBehavioral.length > 0 ? (behavioralAnsweredCount / sessionBehavioral.length) * 100 : 0;
    const overallScore = Math.round(theoryScore * 0.4 + practicalScore * 0.35 + behavioralCompleteness * 0.25);

    return {
      trackLabel: TRACK_LABELS[track],
      levelLabel: LEVEL_LABELS[level],
      theoryScore,
      theoryTotal,
      theoryCorrect,
      practicalScore,
      practicalAttempted: practicalAttemptedCount,
      practicalPassed: practicalPassedCount,
      behavioralAnswered: behavioralAnsweredCount,
      behavioralTotal: sessionBehavioral.length,
      overallScore,
      completedAt: new Date().toISOString(),
    };
  }, [sessionTheory.length, theoryAnswers, sessionPractical.length, practicalAttempted, practicalPassed, sessionBehavioral.length, behavioralAnswers, track, level]);

  return {
    stage,
    track,
    level,
    sessionTheory,
    sessionPractical,
    sessionBehavioral,
    theoryIdx,
    theoryAnswers,
    practicalIdx,
    practicalPassed,
    practicalAttempted,
    behavioralIdx,
    behavioralAnswers,
    result,
    startInterview,
    answerTheory,
    nextTheory,
    markPractical,
    nextPractical,
    answerBehavioral,
    nextBehavioral,
    skipToResult,
    restart,
  };
}
