import React, { useState } from 'react';
import { TeacherSettings, HighScoreRecord } from '../types';
import { MrSaifGuide } from './MrSaifGuide';
import { soundEffects, speakText } from '../utils/audio';
import { CheckCircle2, RotateCcw, ArrowRight, Grid, Award, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Module4ArrayQuizProps {
  settings: TeacherSettings;
  record: HighScoreRecord;
  onUpdateRecord: (updated: HighScoreRecord) => void;
  onNavigateToMastery: () => void;
}

interface ArrayChallenge {
  rows: number;
  cols: number;
  emoji: string;
  itemName: string;
}

const SAMPLE_CHALLENGES: ArrayChallenge[] = [
  { rows: 4, cols: 5, emoji: '⭐', itemName: 'stars' },
  { rows: 3, cols: 4, emoji: '🍎', itemName: 'apples' },
  { rows: 5, cols: 3, emoji: '🦆', itemName: 'ducks' },
  { rows: 2, cols: 6, emoji: '🍪', itemName: 'cookies' },
  { rows: 3, cols: 6, emoji: '🌸', itemName: 'flowers' },
  { rows: 4, cols: 4, emoji: '🎈', itemName: 'balloons' },
];

export const Module4ArrayQuiz: React.FC<Module4ArrayQuizProps> = ({
  settings,
  record,
  onUpdateRecord,
  onNavigateToMastery,
}) => {
  const [challengeIndex, setChallengeIndex] = useState<number>(0);
  const current = SAMPLE_CHALLENGES[challengeIndex % SAMPLE_CHALLENGES.length];

  // Hovered row for visual counting assistance
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Student inputs for the 4 questions
  const [ansRows, setAnsRows] = useState<string>('');
  const [ansCols, setAnsCols] = useState<string>('');
  const [ansAddition, setAnsAddition] = useState<string>('');
  const [ansMultLeft, setAnsMultLeft] = useState<string>('');
  const [ansMultRight, setAnsMultRight] = useState<string>('');
  const [ansMultTotal, setAnsMultTotal] = useState<string>('');

  // Status & Feedback
  const [stepFeedback, setStepFeedback] = useState<{
    q1: 'idle' | 'correct' | 'wrong';
    q2: 'idle' | 'correct' | 'wrong';
    q3: 'idle' | 'correct' | 'wrong';
    q4: 'idle' | 'correct' | 'wrong';
  }>({
    q1: 'idle',
    q2: 'idle',
    q3: 'idle',
    q4: 'idle',
  });

  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const total = current.rows * current.cols;
  const expectedAddition = Array(current.rows).fill(current.cols).join(' + ');

  const handleCheckAll = () => {
    const rNum = parseInt(ansRows.trim(), 10);
    const cNum = parseInt(ansCols.trim(), 10);
    const mLeft = parseInt(ansMultLeft.trim(), 10);
    const mRight = parseInt(ansMultRight.trim(), 10);
    const mTotal = parseInt(ansMultTotal.trim(), 10);

    // Clean addition input string (remove spaces)
    const cleanAddition = ansAddition.replace(/\s+/g, '');
    const expectedClean1 = expectedAddition.replace(/\s+/g, '');
    const expectedClean2 = Array(current.cols).fill(current.rows).join('+'); // Also accept columns repeated

    const q1Ok = rNum === current.rows;
    const q2Ok = cNum === current.cols;
    const q3Ok = cleanAddition === expectedClean1 || cleanAddition === expectedClean2;
    const q4Ok =
      ((mLeft === current.rows && mRight === current.cols) ||
        (mLeft === current.cols && mRight === current.rows)) &&
      mTotal === total;

    const newFeedback = {
      q1: q1Ok ? 'correct' as const : 'wrong' as const,
      q2: q2Ok ? 'correct' as const : 'wrong' as const,
      q3: q3Ok ? 'correct' as const : 'wrong' as const,
      q4: q4Ok ? 'correct' as const : 'wrong' as const,
    };

    setStepFeedback(newFeedback);

    if (q1Ok && q2Ok && q3Ok && q4Ok) {
      soundEffects.correct();
      setIsCompleted(true);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });

      let updatedBadges = [...record.badges];
      if (!updatedBadges.includes('array_wizard')) {
        updatedBadges.push('array_wizard');
      }

      onUpdateRecord({
        ...record,
        stars: record.stars + 4,
        badges: updatedBadges,
      });
    } else {
      soundEffects.wrong();
    }
  };

  const handleNextChallenge = () => {
    soundEffects.pop();
    setChallengeIndex(prev => prev + 1);
    setAnsRows('');
    setAnsCols('');
    setAnsAddition('');
    setAnsMultLeft('');
    setAnsMultRight('');
    setAnsMultTotal('');
    setStepFeedback({ q1: 'idle', q2: 'idle', q3: 'idle', q4: 'idle' });
    setIsCompleted(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-fadeIn">
      {/* Title Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500 p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
            Module 4 • Visual Arrays & Addition
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-fun font-black">
            Repeated Addition & Array Quiz
          </h1>
          <p className="text-purple-100 text-sm md:text-base font-medium max-w-2xl mt-1">
            An array is a neat grid of rows and columns. Examine the array, count the rows,
            write the repeated addition sentence, and discover the multiplication equation!
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 text-7xl opacity-20 select-none">
          🧩
        </div>
      </div>

      {/* Teacher Mr. Saif's Array Tip */}
      <MrSaifGuide
        message={`Remember: Rows go across (left-to-right ➡️) and Columns go up-and-down (vertical ⬇️). Hover or tap on any row in the grid to highlight it!`}
        hint={`If you have ${current.rows} rows of ${current.cols}, you write ${expectedAddition} = ${total}!`}
        soundEnabled={settings.soundEnabled}
        speechEnabled={settings.speechEnabled}
      />

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Array Grid */}
        <div className="lg:col-span-6 rounded-3xl bg-white border-3 border-purple-300 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <h3 className="font-fun font-black text-lg text-purple-900 flex items-center gap-2">
              <Grid className="w-5 h-5 text-purple-600" />
              <span>Visual Array Grid</span>
            </h3>
            <span className="text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 font-bold">
              Challenge #{challengeIndex + 1}
            </span>
          </div>

          <div className="text-xs text-slate-500 text-center">
            Tap or hover a row to count its {current.itemName}!
          </div>

          {/* Render the Array */}
          <div className="p-6 rounded-3xl bg-purple-50/50 border-2 border-dashed border-purple-200 flex flex-col items-center justify-center space-y-3">
            {Array.from({ length: current.rows }).map((_, r) => {
              const isHovered = hoveredRow === r;
              return (
                <div
                  key={r}
                  onMouseEnter={() => setHoveredRow(r)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`flex items-center gap-2 sm:gap-3 p-2 rounded-2xl transition-all cursor-pointer ${
                    isHovered
                      ? 'bg-purple-200/90 ring-2 ring-purple-400 scale-102 shadow-xs'
                      : 'bg-white/90 hover:bg-purple-100/70'
                  }`}
                >
                  <span className="w-16 text-right font-fun font-bold text-xs sm:text-sm text-purple-800">
                    Row {r + 1}:
                  </span>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: current.cols }).map((_, c) => (
                      <div
                        key={c}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border-2 border-purple-200 flex items-center justify-center text-2xl sm:text-3xl shadow-2xs transform hover:scale-110 transition-transform"
                      >
                        {current.emoji}
                      </div>
                    ))}
                  </div>

                  <span className="text-xs font-bold text-purple-700 ml-1">
                    ({current.cols})
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium text-center">
            💡 <strong>Quick helper:</strong> Count the rows first, then how many {current.itemName} in each row!
          </div>
        </div>

        {/* Right Column: 4 Progressive Array Questions */}
        <div className="lg:col-span-6 rounded-3xl bg-white border-3 border-amber-300 p-6 shadow-sm space-y-5">
          <div className="border-b border-amber-100 pb-3">
            <h3 className="font-fun font-black text-lg text-amber-900">
              Answer the 4 Array Questions:
            </h3>
            <p className="text-xs text-slate-500">
              Fill in each blank using the visual array on the left
            </p>
          </div>

          <div className="space-y-4">
            {/* Question 1: Rows */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black text-slate-800 font-fun">
                  1. How many rows are there?
                </label>
                {stepFeedback.q1 === 'correct' && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct ({current.rows})
                  </span>
                )}
                {stepFeedback.q1 === 'wrong' && (
                  <span className="text-xs font-bold text-rose-600">Count lines top to bottom!</span>
                )}
              </div>
              <input
                type="number"
                value={ansRows}
                onChange={e => setAnsRows(e.target.value)}
                placeholder="Number of rows"
                className="w-full px-4 py-2 rounded-xl border-2 border-slate-300 bg-white font-fun font-bold text-base focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            {/* Question 2: Items per row */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black text-slate-800 font-fun">
                  2. How many {current.itemName} in EACH row?
                </label>
                {stepFeedback.q2 === 'correct' && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct ({current.cols})
                  </span>
                )}
                {stepFeedback.q2 === 'wrong' && (
                  <span className="text-xs font-bold text-rose-600">Count items across one row!</span>
                )}
              </div>
              <input
                type="number"
                value={ansCols}
                onChange={e => setAnsCols(e.target.value)}
                placeholder={`Number of ${current.itemName} in a row`}
                className="w-full px-4 py-2 rounded-xl border-2 border-slate-300 bg-white font-fun font-bold text-base focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            {/* Question 3: Repeated Addition Sentence */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black text-slate-800 font-fun">
                  3. Write the repeated addition sentence:
                </label>
                {stepFeedback.q3 === 'correct' && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct!
                  </span>
                )}
                {stepFeedback.q3 === 'wrong' && (
                  <span className="text-xs font-bold text-rose-600">e.g. {expectedAddition}</span>
                )}
              </div>
              <input
                type="text"
                value={ansAddition}
                onChange={e => setAnsAddition(e.target.value)}
                placeholder={`e.g. ${expectedAddition}`}
                className="w-full px-4 py-2 rounded-xl border-2 border-slate-300 bg-white font-fun font-bold text-base focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            {/* Question 4: Multiplication Equation */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-black text-slate-800 font-fun">
                  4. Write the multiplication equation:
                </label>
                {stepFeedback.q4 === 'correct' && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Correct ({current.rows} × {current.cols} = {total})!
                  </span>
                )}
                {stepFeedback.q4 === 'wrong' && (
                  <span className="text-xs font-bold text-rose-600">Rows × Cols = Total</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={ansMultLeft}
                  onChange={e => setAnsMultLeft(e.target.value)}
                  placeholder="Rows"
                  className="w-20 px-3 py-2 text-center rounded-xl border-2 border-slate-300 bg-white font-fun font-bold text-base focus:border-amber-400 focus:outline-hidden"
                />
                <span className="text-xl font-bold text-slate-600">×</span>
                <input
                  type="number"
                  value={ansMultRight}
                  onChange={e => setAnsMultRight(e.target.value)}
                  placeholder="Items"
                  className="w-20 px-3 py-2 text-center rounded-xl border-2 border-slate-300 bg-white font-fun font-bold text-base focus:border-amber-400 focus:outline-hidden"
                />
                <span className="text-xl font-bold text-slate-600">=</span>
                <input
                  type="number"
                  value={ansMultTotal}
                  onChange={e => setAnsMultTotal(e.target.value)}
                  placeholder="Total"
                  className="w-24 px-3 py-2 text-center rounded-xl border-2 border-amber-400 bg-white font-fun font-bold text-base focus:border-amber-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={handleCheckAll}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-fun font-bold text-base shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Check Answers
            </button>

            {isCompleted ? (
              <button
                onClick={handleNextChallenge}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-fun font-bold text-base shadow-md flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Next Array Challenge</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  soundEffects.pop();
                  onNavigateToMastery();
                }}
                className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
              >
                <span>Jump to Final Mastery Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
