import React, { useState, useEffect, useRef } from 'react';
import { TeacherSettings, HighScoreRecord } from '../types';
import { soundEffects, speakText } from '../utils/audio';
import {
  X,
  Trophy,
  Sparkles,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  ArrowRight,
  Flame,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  id: string;
  source: 'lesson1_1' | 'lesson1_2';
  title: string;
  prompt: string;
  type: 'fill-blank' | 'multiple-choice';
  options?: string[];
  expected: string;
  hint: string;
  explanation: string;
}

const QUESTION_BANK: QuizQuestion[] = [
  // LESSON 1-1: Multiplier Rules & Commutative Property
  {
    id: 'q1',
    source: 'lesson1_1',
    title: 'Increasing Multipliers',
    prompt: '3 × 6 is [ ? ] more than 3 × 5.',
    type: 'fill-blank',
    expected: '3',
    hint: 'Look at the multiplicand: the group size is 3!',
    explanation: 'Since 6 is 1 more than 5, 3 × 6 has one extra group of 3.',
  },
  {
    id: 'q2',
    source: 'lesson1_1',
    title: 'Decreasing Multipliers',
    prompt: '6 × 8 is [ ? ] less than 6 × 9.',
    type: 'fill-blank',
    expected: '6',
    hint: 'Look at the multiplicand: the group size is 6!',
    explanation: 'Since 8 is 1 less than 9, 6 × 8 has 1 fewer group of 6.',
  },
  {
    id: 'q3',
    source: 'lesson1_1',
    title: 'Subtraction Adjustment',
    prompt: '8 × 4 = 8 × 5 - [ ? ]',
    type: 'fill-blank',
    expected: '8',
    hint: 'Taking 1 away from the multiplier means subtracting 8!',
    explanation: '8 × 4 = 32, and 8 × 5 = 40. 40 - 8 = 32.',
  },
  {
    id: 'q4',
    source: 'lesson1_1',
    title: 'Addition Adjustment',
    prompt: '7 × 6 = 7 × 5 + [ ? ]',
    type: 'fill-blank',
    expected: '7',
    hint: 'Adding 1 to the multiplier means adding 7!',
    explanation: '7 × 6 = 42, and 7 × 5 = 35. 35 + 7 = 42.',
  },
  {
    id: 'q5',
    source: 'lesson1_1',
    title: 'Commutative Order Switch',
    prompt: '8 × 3 = [ ? ] × 8',
    type: 'fill-blank',
    expected: '3',
    hint: 'Commutative property: swap the order of the numbers!',
    explanation: '8 × 3 = 24 and 3 × 8 = 24. Switching order gives the same product!',
  },
  {
    id: 'q6',
    source: 'lesson1_1',
    title: 'Commutative Order Switch',
    prompt: '5 × 9 = 9 × [ ? ]',
    type: 'fill-blank',
    expected: '5',
    hint: 'Switch the factors: 5 × 9 = 9 × 5.',
    explanation: 'Both equal 45!',
  },
  {
    id: 'q7',
    source: 'lesson1_1',
    title: 'Textbook Review MCQ',
    prompt: 'Which expression is equal to 6 × 7?',
    type: 'multiple-choice',
    options: ['6 × 6 + 1', '6 × 6 + 6', '6 × 8 + 6', '7 × 7'],
    expected: '6 × 6 + 6',
    hint: '6 × 7 has one more group of 6 than 6 × 6.',
    explanation: '6 × 6 = 36. Add 6 to get 42, which is 6 × 7!',
  },
  {
    id: 'q8',
    source: 'lesson1_1',
    title: 'Textbook Review MCQ',
    prompt: 'If 5 × 6 = 30, then 5 × 7 is:',
    type: 'multiple-choice',
    options: ['30 + 5', '30 + 6', '30 - 5', '30 × 7'],
    expected: '30 + 5',
    hint: 'The multiplier increased by 1, so add the multiplicand 5.',
    explanation: '5 × 7 is one more 5 than 5 × 6 = 30 + 5 = 35.',
  },
  {
    id: 'q9',
    source: 'lesson1_1',
    title: 'Commutative Equation Test',
    prompt: 'Which equation shows the Commutative Property?',
    type: 'multiple-choice',
    options: ['4 × 5 = 20', '4 × 5 = 5 × 4', '4 × 5 = 4 × 4 + 4'],
    expected: '4 × 5 = 5 × 4',
    hint: 'Commutative means switching the order of the two factors.',
    explanation: '4 × 5 = 5 × 4 demonstrates the commutative property of multiplication.',
  },
  {
    id: 'q10',
    source: 'lesson1_1',
    title: 'Comparative Reasoning',
    prompt: '7 × 9 is ____ less than 7 × 10.',
    type: 'multiple-choice',
    options: ['1', '9', '7', '10'],
    expected: '7',
    hint: 'The multiplier went down by 1, so the total decreases by 7.',
    explanation: '7 × 9 = 63 and 7 × 10 = 70. The difference is 7.',
  },

  // LESSON 1-2: Distributive Property & Decompositions
  {
    id: 'q11',
    source: 'lesson1_2',
    title: 'Distributive Equation',
    prompt: '(4 × 3) + (4 × 5) = 4 × [ ? ]',
    type: 'fill-blank',
    expected: '8',
    hint: 'Add the broken multiplier parts together: 3 + 5 = ?',
    explanation: '3 + 5 = 8, so (4 × 3) + (4 × 5) = 4 × 8 = 32.',
  },
  {
    id: 'q12',
    source: 'lesson1_2',
    title: 'Distributive Equation',
    prompt: '(6 × 5) + (6 × 2) = 6 × [ ? ]',
    type: 'fill-blank',
    expected: '7',
    hint: 'Add the split pieces: 5 + 2 = ?',
    explanation: '5 + 2 = 7, so (6 × 5) + (6 × 2) = 6 × 7 = 42.',
  },
  {
    id: 'q13',
    source: 'lesson1_2',
    title: 'Distributive Equation',
    prompt: '(8 × 4) + (8 × 4) = 8 × [ ? ]',
    type: 'fill-blank',
    expected: '8',
    hint: 'Add 4 + 4 = ?',
    explanation: '4 + 4 = 8, so (8 × 4) + (8 × 4) = 8 × 8 = 64.',
  },
  {
    id: 'q14',
    source: 'lesson1_2',
    title: 'Distributive Decomposition',
    prompt: '5 × 9 = (5 × 4) + (5 × [ ? ])',
    type: 'fill-blank',
    expected: '5',
    hint: '9 is split into 4 and what number? 9 - 4 = ?',
    explanation: '9 - 4 = 5, so 5 × 9 = (5 × 4) + (5 × 5).',
  },
  {
    id: 'q15',
    source: 'lesson1_2',
    title: 'Distributive Decomposition',
    prompt: '7 × 6 = (7 × [ ? ]) + (7 × 3)',
    type: 'fill-blank',
    expected: '3',
    hint: '6 is broken into ? and 3. 6 - 3 = ?',
    explanation: '6 - 3 = 3, so 7 × 6 = (7 × 3) + (7 × 3).',
  },
  {
    id: 'q16',
    source: 'lesson1_2',
    title: 'Branching Tree Calculation',
    prompt: 'In breaking 8 into 5 + 3 for 7 × 8, what is the top branch (7 × 5)?',
    type: 'fill-blank',
    expected: '35',
    hint: 'Calculate 7 × 5 = ?',
    explanation: '7 × 5 = 35. Combined with bottom branch 7 × 3 = 21, total is 56!',
  },
  {
    id: 'q17',
    source: 'lesson1_2',
    title: 'Branching Tree Sum',
    prompt: 'If 9 × 6 is split into branches of 30 and 24, the total is [ ? ].',
    type: 'fill-blank',
    expected: '54',
    hint: 'Add 30 + 24 = ?',
    explanation: '30 + 24 = 54, so 9 × 6 = 54!',
  },
  {
    id: 'q18',
    source: 'lesson1_2',
    title: 'Branching Tree Calculation',
    prompt: 'In breaking 7 into 5 + 2 for 6 × 7, what is the bottom branch (6 × 2)?',
    type: 'fill-blank',
    expected: '12',
    hint: 'Calculate 6 × 2 = ?',
    explanation: '6 × 2 = 12. Top branch is 30, so 30 + 12 = 42!',
  },
];

interface Chapter1QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TeacherSettings;
  record: HighScoreRecord;
  onUpdateRecord: (updated: HighScoreRecord) => void;
}

export const Chapter1QuizModal: React.FC<Chapter1QuizModalProps> = ({
  isOpen,
  onClose,
  settings,
  record,
  onUpdateRecord,
}) => {
  const [isTimed, setIsTimed] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize 10 random questions from bank
  const startQuiz = () => {
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
    setQuizQuestions(shuffled.slice(0, 10));
    setCurrentIndex(0);
    setUserAnswer('');
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(false);
    setScore(0);
    setIsFinished(false);
    setShowHint(false);
    setTimeLeft(20);
  };

  useEffect(() => {
    if (isOpen) {
      startQuiz();
    }
  }, [isOpen]);

  // Focus input on question change
  useEffect(() => {
    if (!isChecked && quizQuestions[currentIndex]?.type === 'fill-blank') {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
    setTimeLeft(20);
    setShowHint(false);
  }, [currentIndex, isChecked, quizQuestions]);

  // Timer effect
  useEffect(() => {
    if (!isOpen || isFinished || isChecked || !isTimed) return;

    if (timeLeft <= 0) {
      handleCheck(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isFinished, isChecked, isTimed, timeLeft]);

  if (!isOpen) return null;

  const currentQ = quizQuestions[currentIndex];

  const handleCheck = (timeExpired = false) => {
    if (isChecked || !currentQ) return;

    let correct = false;
    if (currentQ.type === 'fill-blank') {
      correct = !timeExpired && userAnswer.trim().toLowerCase() === currentQ.expected.trim().toLowerCase();
    } else {
      correct = !timeExpired && selectedOption === currentQ.expected;
    }

    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      soundEffects.correct();
      setScore(prev => prev + 1);
    } else {
      soundEffects.wrong();
    }
  };

  const handleNext = () => {
    soundEffects.pop();
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(false);
    } else {
      // Quiz finished
      const finalScore = score + (isCorrect ? 0 : 0);
      setIsFinished(true);

      const perfect = score === 10;
      if (perfect) {
        soundEffects.fanfare();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } else if (score >= 7) {
        soundEffects.correct();
      }

      // Award stars and Chapter 1 Grandmaster badge if passed
      const newBadges = [...record.badges];
      if (score >= 8 && !newBadges.includes('chapter1_grandmaster')) {
        newBadges.push('chapter1_grandmaster');
      }

      onUpdateRecord({
        ...record,
        stars: record.stars + Math.max(2, score),
        quizzesCompleted: record.quizzesCompleted + 1,
        badges: newBadges,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-blue-400 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-white/20 text-2xl">🎯</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-fun font-black text-lg sm:text-xl">
                  Chapter 1 End-of-Lesson Mastery Quiz
                </h2>
                <span className="text-2xs font-black uppercase bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full">
                  10 Questions
                </span>
              </div>
              <p className="text-xs text-blue-100 font-medium">
                Combining Lesson 1-1 (Rules) & Lesson 1-2 (Distributive Tree)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/25 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Controls & Progress */}
        <div className="bg-blue-50/80 px-4 py-2.5 border-b border-blue-100 flex flex-wrap items-center justify-between gap-2">
          {/* Progress Indicators */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">
              Question {currentIndex + 1} of {quizQuestions.length || 10}
            </span>
            <div className="w-24 bg-blue-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / (quizQuestions.length || 10)) * 100}%` }}
              />
            </div>
          </div>

          {/* Mode Switcher (Timed vs Untimed) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.pop();
                setIsTimed(!isTimed);
              }}
              className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-xl transition-all cursor-pointer border ${
                isTimed
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isTimed ? `Timed (${timeLeft}s)` : 'Untimed Mode'}</span>
            </button>

            <span className="text-xs font-bold bg-white text-blue-800 border border-blue-200 px-2.5 py-1 rounded-xl">
              ⭐ Score: {score}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!isFinished && currentQ ? (
            <div className="space-y-5 animate-fadeIn">
              {/* Question Badge & Title */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {currentQ.source === 'lesson1_1' ? '📘 Lesson 1-1 Rule' : '🧩 Lesson 1-2 Distributive'} • {currentQ.title}
                </span>

                {isTimed && !isChecked && (
                  <div className={`flex items-center gap-1 font-mono font-black text-sm px-2.5 py-0.5 rounded-lg ${
                    timeLeft <= 5 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-amber-100 text-amber-800'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{timeLeft}s</span>
                  </div>
                )}
              </div>

              {/* Prompt Box */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-transparent border-2 border-blue-200">
                <h3 className="font-fun font-bold text-xl sm:text-2xl text-slate-900 text-center leading-relaxed">
                  {currentQ.prompt}
                </h3>
              </div>

              {/* Answer Input Area */}
              {currentQ.type === 'fill-blank' ? (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-fun font-bold text-slate-700 text-base">Your Answer:</span>
                    <input
                      ref={inputRef}
                      type="number"
                      disabled={isChecked}
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (isChecked) handleNext();
                          else if (userAnswer.trim()) handleCheck();
                        }
                      }}
                      placeholder="?"
                      className="w-24 h-14 text-center font-fun font-black text-2xl rounded-2xl border-3 border-blue-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-200 outline-hidden bg-white shadow-xs"
                    />
                  </div>
                  <span className="text-xs text-slate-500">Type the missing number and click Check Answer</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options?.map((opt, idx) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <button
                        key={idx}
                        disabled={isChecked}
                        onClick={() => {
                          soundEffects.pop();
                          setSelectedOption(opt);
                        }}
                        className={`p-4 rounded-2xl font-fun font-bold text-base text-left border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-102'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                        }`}
                      >
                        <span>{opt}</span>
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                          isSelected ? 'border-white bg-white text-blue-600' : 'border-slate-300'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Feedback Alert if Checked */}
              {isChecked && (
                <div
                  className={`p-4 rounded-2xl border-2 animate-fadeIn ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="font-fun font-bold text-sm sm:text-base">
                        {isCorrect ? '🌟 Brilliant! You got it right!' : `Not quite. Correct answer is: ${currentQ.expected}`}
                      </p>
                      <p className="text-xs sm:text-sm font-medium leading-relaxed">
                        {currentQ.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Hint Accordion */}
              {!isChecked && (
                <div className="text-center">
                  <button
                    onClick={() => {
                      soundEffects.pop();
                      setShowHint(!showHint);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
                  </button>

                  {showHint && (
                    <div className="mt-2 text-xs font-medium text-amber-900 bg-amber-100/60 p-2.5 rounded-xl border border-amber-200 max-w-md mx-auto animate-fadeIn">
                      💡 {currentQ.hint}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : isFinished ? (
            /* Quiz Completed View */
            <div className="text-center space-y-6 py-4 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center text-4xl mx-auto shadow-lg">
                {score >= 8 ? '👑' : '⭐'}
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl font-fun font-black text-slate-900">
                  {score === 10
                    ? '🎉 Perfect 10/10 Mastery!'
                    : score >= 8
                    ? '🌟 Great Job, Math Champion!'
                    : 'Good Effort! Keep Practicing!'}
                </h3>
                <p className="text-sm text-slate-600 font-medium">
                  You scored {score} out of 10 on the Chapter 1 End-of-Lesson Quiz!
                </p>
              </div>

              {/* Badge Unlock Announcement */}
              {score >= 8 && (
                <div className="p-4 rounded-3xl bg-purple-50 border-2 border-purple-300 text-purple-900 max-w-md mx-auto flex items-center gap-3 text-left">
                  <span className="text-4xl">👑</span>
                  <div>
                    <h4 className="font-fun font-bold text-sm text-purple-950">
                      Badge Unlocked: Chapter 1 Grandmaster!
                    </h4>
                    <p className="text-xs text-purple-700">
                      You conquered the rules of multiplication and distributive trees!
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={startQuiz}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-fun font-bold text-sm shadow-md cursor-pointer transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again with New Questions</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-fun font-bold text-sm cursor-pointer transition-colors"
                >
                  Back to Lesson
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        {!isFinished && (
          <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Exit Quiz
            </button>

            {!isChecked ? (
              <button
                disabled={currentQ?.type === 'fill-blank' ? !userAnswer.trim() : !selectedOption}
                onClick={() => handleCheck(false)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-fun font-bold text-sm shadow-md cursor-pointer transition-all"
              >
                <span>Check Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-sm shadow-md cursor-pointer transition-all"
              >
                <span>{currentIndex + 1 < quizQuestions.length ? 'Next Question' : 'Finish Quiz'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
