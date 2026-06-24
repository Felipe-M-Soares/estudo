import type { Exercise } from '../../data/types';
import { MCQExerciseCard } from './exercises/MCQExerciseCard';
import { CodeFillExerciseCard } from './exercises/CodeFillExerciseCard';
import { OrderExerciseCard } from './exercises/OrderExerciseCard';
import { MatchExerciseCard } from './exercises/MatchExerciseCard';
import { TrueFalseExerciseCard } from './exercises/TrueFalseExerciseCard';

interface ExerciseRouterProps {
  exercise: Exercise;
  onResult: (correct: boolean) => void;
}

export function ExerciseRouter({ exercise, onResult }: ExerciseRouterProps) {
  switch (exercise.type) {
    case 'mcq':
      return <MCQExerciseCard exercise={exercise} onResult={onResult} />;
    case 'code-fill':
      return <CodeFillExerciseCard exercise={exercise} onResult={onResult} />;
    case 'order':
      return <OrderExerciseCard exercise={exercise} onResult={onResult} />;
    case 'match':
      return <MatchExerciseCard exercise={exercise} onResult={onResult} />;
    case 'truefalse':
      return <TrueFalseExerciseCard exercise={exercise} onResult={onResult} />;
    default:
      return null;
  }
}
