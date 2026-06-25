import { useEffect, useRef } from 'react';
import { useInterviewMode } from '../hooks/useInterviewMode';
import { InterviewSetup } from '../components/interview/InterviewSetup';
import { InterviewTheoryStage } from '../components/interview/InterviewTheoryStage';
import { InterviewPracticalStage } from '../components/interview/InterviewPracticalStage';
import { InterviewBehavioralStage } from '../components/interview/InterviewBehavioralStage';
import { InterviewResultStage } from '../components/interview/InterviewResultStage';
import type { InterviewHistoryEntry } from '../data/types';

interface InterviewModePageProps {
  interviewHistory: InterviewHistoryEntry[];
  onSaveResult: (entry: Omit<InterviewHistoryEntry, 'id'>) => void;
}

export function InterviewModePage({ interviewHistory, onSaveResult }: InterviewModePageProps) {
  const interview = useInterviewMode();
  const savedRef = useRef(false);

  useEffect(() => {
    if (interview.stage === 'result' && !savedRef.current) {
      savedRef.current = true;
      onSaveResult({
        trackLabel: interview.result.trackLabel,
        levelLabel: interview.result.levelLabel,
        overallScore: interview.result.overallScore,
        theoryScore: interview.result.theoryScore,
        practicalScore: interview.result.practicalScore,
        behavioralAnswered: interview.result.behavioralAnswered,
        behavioralTotal: interview.result.behavioralTotal,
        completedAt: interview.result.completedAt,
      });
    }
    if (interview.stage !== 'result') {
      savedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview.stage]);

  if (interview.stage === 'setup') {
    return <InterviewSetup onStart={interview.startInterview} interviewHistory={interviewHistory} />;
  }

  if (interview.stage === 'theory') {
    return (
      <InterviewTheoryStage
        questions={interview.sessionTheory}
        currentIdx={interview.theoryIdx}
        onAnswer={interview.answerTheory}
        onNext={interview.nextTheory}
      />
    );
  }

  if (interview.stage === 'practical') {
    return (
      <InterviewPracticalStage
        challenges={interview.sessionPractical}
        currentIdx={interview.practicalIdx}
        onMark={interview.markPractical}
        onNext={interview.nextPractical}
      />
    );
  }

  if (interview.stage === 'behavioral') {
    return (
      <InterviewBehavioralStage
        questions={interview.sessionBehavioral}
        currentIdx={interview.behavioralIdx}
        answers={interview.behavioralAnswers}
        onAnswer={interview.answerBehavioral}
        onNext={interview.nextBehavioral}
      />
    );
  }

  return <InterviewResultStage result={interview.result} onRestart={interview.restart} />;
}
