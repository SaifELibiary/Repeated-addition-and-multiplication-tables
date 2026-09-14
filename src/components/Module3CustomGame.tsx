import React, { useState, useEffect, useRef } from 'react';
import { TeacherSettings, HighScoreRecord } from '../types';
import { MrSaifGuide } from './MrSaifGuide';
import { soundEffects, speakText } from '../utils/audio';
import { Trophy, Clock, Zap, CheckCircle2, XCircle, RotateCcw, Sparkles, Star, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Module3CustomGameProps {
  settings: TeacherSettings;
  record: HighScoreRecord;
  onUpdateRecord: (updated: HighScoreRecord) => void;
  preselectedTable?: number;
}

type GameMode = 'addition-match' | 'missing-number' | 'speed-cards';

interface GameQuestion {
  questionText: string;
  subText?: string;
  options: string[];
  correctAnswer: string;
  hint: string;
}

export const Module3CustomGame: React.FC<Module3CustomGameProps> = ({
  settings,
  record,
  onUpdateRecord,
  preselectedTable,
}) => {
  // Target Tables to Practice (student/teacher choice)
  const [selectedTables, setSelectedTables] = useState<number[]>(
    preselectedTable ? [preselectedTable] : [3, 4, 5]
  );
  const [activeMode, setActiveMode] = useState<GameMode>('addition-match');

  // Game state
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(settings.timePerQuestion || 15);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle table selection
  const toggleTable = (num: number) => {
    soundEffects.pop();
    setSelectedTables(prev => {
      if (prev.includes(num)) {
        if (prev.length <= 1) return prev; // keep at least 1
        return prev.filter(t => t !== num);
      } else {
        return [...prev, num].sort((a, b) => a - b);
      }
    });
  };

  const selectAllTables = () => {
    soundEffects.pop();
    setSelectedTables([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  };

  const selectSingleTable = (num: number) => {
    soundEffects.pop();
    setSelectedTables([num]);
  };

  // Generate question based on mode & selected tables
  const generateQuestion = (): GameQuestion => {
    const tablePool = selectedTables.length > 0 ? selectedTables : [3, 4, 5];
    const table = tablePool[Math.floor(Math.random() * tablePool.length)];
    const multiplier = Math.floor(Math.random() * (settings.maxMultiplier || 10)) + 1;
    const product = table * multiplier;

    if (activeMode === 'addition-match') {
      // "Which multiplication sentence equals 6 + 6 + 6?"
      // Mode A
      const repeated = Array(multiplier).fill(table).join(' + ');
      const correct = `${multiplier} × ${table}`;
      
      // Distractors
      const dist1 = `${table} × ${table}`;
      const dist2 = `${multiplier + 1} × ${table}`;
      const dist3 = `${multiplier} × ${Math.max(1, table - 1)}`;

      const options = Array.from(new Set([correct, dist1, dist2, dist3])).slice(0, 3);
      if (!options.includes(correct)) options[0] = correct;
      options.sort(() => Math.random() - 0.5);

      return {
        questionText: `Which multiplication sentence equals:`,
        subText: `${repeated} ?`,
        options,
        correctAnswer: correct,
        hint: `Count how many times ${table} is repeated! There are ${multiplier} groups of ${table}.`,
      };
    } else if (activeMode === 'missing-number') {
      // Mode B: Missing Number Challenge
      const variant = Math.random() > 0.5 ? 'factor' : 'addition-term';
      if (variant === 'factor') {
        // e.g. "7 × [__] = 35"
        const correct = `${multiplier}`;
        const distractors = [
          `${multiplier + 1}`,
          `${Math.max(1, multiplier - 1)}`,
          `${multiplier + 2}`,
        ];
        const options = Array.from(new Set([correct, ...distractors])).slice(0, 3).sort(() => Math.random() - 0.5);

        return {
          questionText: `Find the missing factor:`,
          subText: `${table} × [ ? ] = ${product}`,
          options,
          correctAnswer: correct,
          hint: `How many groups of ${table} make ${product}? Count by ${table}s!`,
        };
      } else {
        // e.g. "[__] + 8 + 8 = 3 × 8"
        const correct = `${table}`;
        const distractors = [
          `${table + 1}`,
          `${Math.max(1, table - 1)}`,
          `${product}`,
        ];
        const options = Array.from(new Set([correct, ...distractors])).slice(0, 3).sort(() => Math.random() - 0.5);

        const repeatedParts = Array(multiplier).fill(table);
        repeatedParts[0] = '[ ? ]';

        return {
          questionText: `Complete the repeated addition sentence:`,
          subText: `${repeatedParts.join(' + ')} = ${multiplier} × ${table}`,
          options,
          correctAnswer: correct,
          hint: `All groups must be equal to ${table}!`,
        };
      }
    } else {
      // Mode C: Speed Math Flashcards
      const correct = `${product}`;
      const distractors = [
        `${product + table}`,
        `${Math.max(1, product - table)}`,
        `${product + 2}`,
      ];
      const options = Array.from(new Set([correct, ...distractors])).slice(0, 3).sort(() => Math.random() - 0.5);

      return {
        questionText: `Flashcard Speed Challenge:`,
        subText: `${table} × ${multiplier} = ?`,
        options,
        correctAnswer: correct,
        hint: `Think: ${multiplier} groups of ${table}!`,
      };
    }
  };

  // Start / Next Question
  const nextQuestion = () => {
    const q = generateQuestion();
    setCurrentQuestion(q);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setTimeLeft(settings.timePerQuestion || 15);
  };

  // Timer Effect
  useEffect(() => {
    nextQuestion();
  }, [activeMode, selectedTables]);

  useEffect(() => {
    if (!settings.timeLimitEnabled || isAnswered || !currentQuestion) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestion, isAnswered, settings.timeLimitEnabled]);

  const handleTimeOut = () => {
    if (isAnswered) return;
    soundEffects.wrong();
    setIsAnswered(true);
    setIsCorrect(false);
    setStreak(0);
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswered || !currentQuestion) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(opt);
    setIsAnswered(true);

    if (opt === currentQuestion.correctAnswer) {
      soundEffects.correct();
      setIsCorrect(true);
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);

      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });

      // Badges check
      let newBadges = [...record.badges];
      if (!newBadges.includes('table_master')) newBadges.push('table_master');
      if (newStreak >= 5 && !newBadges.includes('speed_calculator')) {
        newBadges.push('speed_calculator');
      }

      onUpdateRecord({
        ...record,
        stars: record.stars + (newStreak >= 3 ? 2 : 1),
        gamesPlayed: record.gamesPlayed + 1,
        bestStreak: Math.max(record.bestStreak, newStreak),
        badges: newBadges,
      });
    } else {
      soundEffects.wrong();
      setIsCorrect(false);
      setStreak(0);
      onUpdateRecord({
        ...record,
        gamesPlayed: record.gamesPlayed + 1,
      });
    }
    setQuestionCount(prev => prev + 1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-fadeIn">
      {/* Module Title Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
            Module 3 • Custom Table Practice Game
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-fun font-black">
            Multiplication Games & Challenges!
          </h1>
          <p className="text-amber-50 text-sm md:text-base font-medium max-w-2xl mt-1">
            Pick your favorite times table(s), select a game mode, and beat your streak record!
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 text-7xl opacity-20 select-none">
          🎮
        </div>
      </div>

      {/* Target Selector Screen (Pick WHICH specific tables to practice) */}
      <div className="rounded-3xl bg-white border-3 border-amber-300 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-fun font-black text-lg text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Target Table Selector: Practice Specific Tables</span>
            </h3>
            <p className="text-xs text-slate-500">
              Pick one or multiple tables (e.g., &ldquo;Practice Table 7 Only&rdquo; or &ldquo;Tables 3, 4, 5&rdquo;):
            </p>
          </div>

          <button
            onClick={selectAllTables}
            className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold self-start transition-colors"
          >
            Select All (1–9)
          </button>
        </div>

        {/* 1-9 Grid Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
            const isSelected = selectedTables.includes(num);
            return (
              <div key={num} className="relative group">
                <button
                  onClick={() => toggleTable(num)}
                  className={`w-full py-3 rounded-2xl font-fun font-black text-lg transition-all flex flex-col items-center justify-center border-2 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm scale-102 ring-2 ring-amber-200'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-amber-300 hover:bg-amber-50/50'
                  }`}
                >
                  <span>Table {num}</span>
                  <span className="text-[10px] font-sans font-bold opacity-85">
                    {isSelected ? '✓ Selected' : 'Off'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Quick single-table shortcuts */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs text-slate-500 font-medium">
          <span className="font-bold text-slate-700">Quick Picks:</span>
          {[2, 5, 7, 9].map(t => (
            <button
              key={t}
              onClick={() => selectSingleTable(t)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 transition-colors font-bold"
            >
              Practice Table {t} Only
            </button>
          ))}
        </div>
      </div>

      {/* 3 Game Mode Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Mode A */}
        <button
          onClick={() => {
            soundEffects.pop();
            setActiveMode('addition-match');
          }}
          className={`p-4 rounded-3xl border-3 text-left transition-all cursor-pointer ${
            activeMode === 'addition-match'
              ? 'bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-200'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-2xl mb-1">🔗</div>
          <div className="font-fun font-black text-base text-slate-800">
            Mode A: Repeated Addition Match
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Match addition sentences like 6 + 6 + 6 to 3 × 6!
          </div>
        </button>

        {/* Mode B */}
        <button
          onClick={() => {
            soundEffects.pop();
            setActiveMode('missing-number');
          }}
          className={`p-4 rounded-3xl border-3 text-left transition-all cursor-pointer ${
            activeMode === 'missing-number'
              ? 'bg-sky-50 border-sky-400 shadow-md ring-2 ring-sky-200'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-2xl mb-1">❓</div>
          <div className="font-fun font-black text-base text-slate-800">
            Mode B: Missing Number Challenge
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Fill the blank: 7 × [ ? ] = 35 or [ ? ] + 8 + 8 = 3 × 8!
          </div>
        </button>

        {/* Mode C */}
        <button
          onClick={() => {
            soundEffects.pop();
            setActiveMode('speed-cards');
          }}
          className={`p-4 rounded-3xl border-3 text-left transition-all cursor-pointer ${
            activeMode === 'speed-cards'
              ? 'bg-purple-50 border-purple-400 shadow-md ring-2 ring-purple-200'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-2xl mb-1">⚡</div>
          <div className="font-fun font-black text-base text-slate-800">
            Mode C: Speed Math Flashcards
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Rapid multiplication flashcards for selected tables!
          </div>
        </button>
      </div>

      {/* Game Playing Area Card */}
      {currentQuestion && (
        <div className="rounded-3xl bg-white border-3 border-amber-300 p-6 md:p-8 shadow-sm space-y-6">
          {/* Game Stats Bar: Score, Streak, Timer */}
          <div className="flex items-center justify-between border-b border-amber-100 pb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-fun font-bold text-slate-700">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                <span>Score: {score}</span>
              </div>
              <div className="flex items-center gap-1.5 font-fun font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>Streak: {streak} 🔥</span>
              </div>
            </div>

            {settings.timeLimitEnabled && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs">
                <Clock className="w-4 h-4 text-rose-500 animate-spin-slow" />
                <span>{timeLeft}s left</span>
              </div>
            )}
          </div>

          {/* Mr. Saif Hint */}
          <MrSaifGuide
            message={`You're practicing Tables: [${selectedTables.join(', ')}]. ${currentQuestion.hint}`}
            compact
            soundEnabled={settings.soundEnabled}
            speechEnabled={settings.speechEnabled}
          />

          {/* Question Box */}
          <div className="text-center py-6 px-4 rounded-3xl bg-amber-50/50 border-2 border-dashed border-amber-200 space-y-3">
            <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              {currentQuestion.questionText}
            </div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-fun font-black text-amber-950">
              {currentQuestion.subText}
            </div>
          </div>

          {/* 3 Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {currentQuestion.options.map((opt, i) => {
              const isChosen = selectedOption === opt;
              const isThisCorrect = opt === currentQuestion.correctAnswer;

              let btnStyle = 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-800';

              if (isAnswered) {
                if (isThisCorrect) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                } else if (isChosen && !isThisCorrect) {
                  btnStyle = 'bg-rose-500 text-white border-rose-600';
                } else {
                  btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-5 rounded-2xl border-3 font-fun font-black text-xl sm:text-2xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isThisCorrect && <CheckCircle2 className="w-6 h-6" />}
                  {isAnswered && isChosen && !isThisCorrect && <XCircle className="w-6 h-6" />}
                </button>
              );
            })}
          </div>

          {/* Next Button after answering */}
          {isAnswered && (
            <div className="pt-4 flex items-center justify-between border-t border-slate-100 animate-fadeIn">
              <div className="text-sm font-bold">
                {isCorrect ? (
                  <span className="text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Terrific! Teacher Mr. Saif is proud of you!</span>
                  </span>
                ) : (
                  <span className="text-rose-600">
                    Nice try! The correct answer is <strong>{currentQuestion.correctAnswer}</strong>.
                  </span>
                )}
              </div>

              <button
                onClick={nextQuestion}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-fun font-bold text-base shadow-md flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
