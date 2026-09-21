import React, { useState, useRef } from 'react';
import { TeacherSettings, HighScoreRecord } from '../types';
import { MrSaifGuide, MrSaifAvatar } from './MrSaifGuide';
import { soundEffects, speakText } from '../utils/audio';
import { Chapter1ProgressBar } from './Chapter1ProgressBar';
import { Chapter1QuizModal } from './Chapter1QuizModal';
import { Chapter1Lesson1ExpandedPractice } from './Chapter1Lesson1ExpandedPractice';
import { getCh1CompletedQuestions } from '../utils/storage';
import {
  BookOpen,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Repeat,
  Lightbulb,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Chapter1Lesson1Props {
  settings: TeacherSettings;
  record: HighScoreRecord;
  onUpdateRecord: (updated: HighScoreRecord) => void;
  onNavigateToLesson2: () => void;
}

export const Chapter1Lesson1: React.FC<Chapter1Lesson1Props> = ({
  settings,
  record,
  onUpdateRecord,
  onNavigateToLesson2,
}) => {
  // Navigation tabs inside Lesson 1-1
  const [activeTab, setActiveTab] = useState<'demo' | 'warmup' | 'practice' | 'exercises' | 'expanded'>('demo');
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [ch1CompletedList, setCh1CompletedList] = useState<string[]>(() => getCh1CompletedQuestions());

  // DEMO 1: 7x Table Stepper State
  const [demoMultiplier, setDemoMultiplier] = useState<number>(3);
  // DEMO 2: Commutative Flip state
  const [isCommutativeFlipped, setIsCommutativeFlipped] = useState<boolean>(false);

  // WARM UP: Step-by-step revealed states
  const [revealedWarmup, setRevealedWarmup] = useState<{ [key: string]: boolean }>({});

  // PRACTICE: Student inputs (Q1 to Q6)
  const [practiceInputs, setPracticeInputs] = useState<{ [key: string]: string }>({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
  });
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);

  // EXERCISES: 12 Questions
  const [exerciseInputs, setExerciseInputs] = useState<{ [key: string]: string }>({
    e1: '',
    e2: '',
    e3: '',
    e4: '',
    e5: '',
    e6: '',
    e7: '',
    e8: '',
    e9: '',
    e10: '',
    e11: '',
    e12: '',
  });
  const [exerciseChecked, setExerciseChecked] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [activeHintId, setActiveHintId] = useState<string | null>(null);

  // Refs for auto-focusing
  const pRef2 = useRef<HTMLInputElement>(null);
  const pRef3 = useRef<HTMLInputElement>(null);
  const pRef4 = useRef<HTMLInputElement>(null);
  const pRef5 = useRef<HTMLInputElement>(null);
  const pRef6 = useRef<HTMLInputElement>(null);

  const eRefs: { [key: string]: React.RefObject<HTMLInputElement | null> } = {
    e1: useRef<HTMLInputElement>(null),
    e2: useRef<HTMLInputElement>(null),
    e3: useRef<HTMLInputElement>(null),
    e4: useRef<HTMLInputElement>(null),
    e5: useRef<HTMLInputElement>(null),
    e6: useRef<HTMLInputElement>(null),
    e7: useRef<HTMLInputElement>(null),
    e8: useRef<HTMLInputElement>(null),
    e9: useRef<HTMLInputElement>(null),
    e10: useRef<HTMLInputElement>(null),
    e11: useRef<HTMLInputElement>(null),
    e12: useRef<HTMLInputElement>(null),
  };

  // Practice Answers Key
  const practiceAnswers: { [key: string]: { expected: number; hint: string } } = {
    q1: { expected: 2, hint: 'Multiplicand is 2. Since 5 is 1 more than 4, it is 2 more!' },
    q2: { expected: 5, hint: 'Multiplicand is 5. Since 3 is 1 less than 4, it is 5 less!' },
    q3: { expected: 6, hint: 'Multiplier went from 8 to 9 (+1), so add the multiplicand 6!' },
    q4: { expected: 9, hint: 'Multiplier went from 8 to 7 (-1), so subtract the multiplicand 9!' },
    q5: { expected: 8, hint: 'Switching order: 4 × 8 = 8 × 4!' },
    q6: { expected: 3, hint: 'Switching order: 3 × 9 = 9 × 3!' },
  };

  // Exercise Answers Key
  const exerciseData = [
    { id: 'e1', q: '1 × 4 is', expected: 1, suffix: 'more than 1 × 3.', hint: 'Multiplicand is 1!' },
    { id: 'e2', q: '5 × 5 is', expected: 5, suffix: 'more than 5 × 4.', hint: 'Multiplicand is 5!' },
    { id: 'e3', q: '3 × 3 is', expected: 3, suffix: 'less than 3 × 4.', hint: 'Multiplicand is 3, 1 less in multiplier!' },
    { id: 'e4', q: '4 × 7 is', expected: 4, suffix: 'less than 4 × 8.', hint: 'Multiplicand is 4, 1 less in multiplier!' },
    { id: 'e5', q: '7 × 2 = 7 × 1 +', expected: 7, suffix: '', hint: 'Adding 1 to multiplier means adding 7!' },
    { id: 'e6', q: '9 × 8 = 9 × 7 +', expected: 9, suffix: '', hint: 'Adding 1 to multiplier means adding 9!' },
    { id: 'e7', q: '9 × 5 = 9 × 6 -', expected: 9, suffix: '', hint: 'Taking 1 away from multiplier means taking 9 away!' },
    { id: 'e8', q: '8 × 8 = 8 × 9 -', expected: 8, suffix: '', hint: 'Taking 1 away from multiplier means taking 8 away!' },
    { id: 'e9', q: '7 × 8 =', expected: 8, suffix: '× 7', hint: 'Commutative property: switch the numbers!' },
    { id: 'e10', q: '4 × 9 = 9 ×', expected: 4, suffix: '', hint: 'Switching order: 4 × 9 = 9 × 4!' },
    { id: 'e11', q: '3 × 6 =', expected: 6, suffix: '× 3', hint: 'Switching order: 3 × 6 = 6 × 3!' },
    { id: 'e12', q: '7 × 2 = 2 ×', expected: 7, suffix: '', hint: 'Switching order: 7 × 2 = 2 × 7!' },
  ];

  const handlePracticeChange = (qKey: string, val: string, nextRef?: React.RefObject<HTMLInputElement | null>) => {
    setPracticeInputs(prev => ({ ...prev, [qKey]: val }));
    const num = parseInt(val.trim(), 10);
    if (num === practiceAnswers[qKey].expected) {
      soundEffects.pop();
      if (nextRef?.current) {
        nextRef.current.focus();
      }
    }
  };

  const handleCheckPractice = () => {
    setPracticeChecked(true);
    let allOk = true;
    for (const key of Object.keys(practiceAnswers)) {
      if (parseInt((practiceInputs[key] || '').trim(), 10) !== practiceAnswers[key].expected) {
        allOk = false;
      }
    }

    if (allOk) {
      soundEffects.correct();
      setPracticeCompleted(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onUpdateRecord({ ...record, stars: record.stars + 2 });
    } else {
      soundEffects.wrong();
    }
  };

  const handleExerciseChange = (id: string, val: string, nextId?: string) => {
    setExerciseInputs(prev => ({ ...prev, [id]: val }));
    const item = exerciseData.find(e => e.id === id);
    if (item && parseInt(val.trim(), 10) === item.expected) {
      soundEffects.pop();
      if (nextId && eRefs[nextId]?.current) {
        eRefs[nextId].current.focus();
      }
    }
  };

  const handleCheckExercises = () => {
    setExerciseChecked(true);
    let correctCount = 0;
    exerciseData.forEach(item => {
      if (parseInt((exerciseInputs[item.id] || '').trim(), 10) === item.expected) {
        correctCount++;
      }
    });

    if (correctCount === exerciseData.length) {
      soundEffects.fanfare();
      setExerciseCompleted(true);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });

      const newBadges = [...record.badges];
      if (!newBadges.includes('properties_master')) {
        newBadges.push('properties_master');
      }

      onUpdateRecord({
        ...record,
        stars: record.stars + 6,
        badges: newBadges,
      });
    } else {
      soundEffects.wrong();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-fadeIn">
      {/* Chapter 1 Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Chapter 1 • Rules of Multiplication
            </span>
            <span className="bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full">
              Grade 3 Math
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-fun font-black tracking-tight">
            Lesson 1-1: Properties of Multiplication (Part 1)
          </h1>

          <p className="text-blue-100 text-sm md:text-base font-medium max-w-3xl">
            Learn the two foundational multiplication rules: how answers change when the multiplier increases or decreases,
            and why switching the order gives the exact same product (Commutative Property)!
          </p>
        </div>

        <div className="absolute -right-6 -bottom-6 text-8xl opacity-15 select-none pointer-events-none">
          📘
        </div>
      </div>

      {/* Mr. Saif Teacher Guide Tip */}
      <MrSaifGuide
        message="Welcome to Chapter 1, Grade 3 mathematicians! Multiplication has secret patterns. Look at the multiplicand (the group size) and the multiplier (how many groups) to predict the answer with ease!"
        hint="Rule 1: +1 to multiplier adds the multiplicand. Rule 2: Order doesn't matter (7 × 3 = 3 × 7)!"
        soundEnabled={settings.soundEnabled}
        speechEnabled={settings.speechEnabled}
      />

      {/* Chapter 1 Progress Bar & Mastery Quiz Trigger */}
      <Chapter1ProgressBar
        completedCount={ch1CompletedList.length}
        totalCount={35}
        record={record}
        onOpenQuiz={() => setIsQuizModalOpen(true)}
        accentColor="blue"
      />

      {/* In-Lesson Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-blue-200/80 pb-3">
        <button
          onClick={() => {
            soundEffects.pop();
            setActiveTab('demo');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-fun font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'demo'
              ? 'bg-blue-600 text-white shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>1. Interactive Rules Demo</span>
        </button>

        <button
          onClick={() => {
            soundEffects.pop();
            setActiveTab('warmup');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-fun font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'warmup'
              ? 'bg-blue-600 text-white shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. Warm Up & How to Solve</span>
        </button>

        <button
          onClick={() => {
            soundEffects.pop();
            setActiveTab('practice');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-fun font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'practice'
              ? 'bg-blue-600 text-white shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>3. Try It Yourself (Q1–Q6)</span>
        </button>

        <button
          onClick={() => {
            soundEffects.pop();
            setActiveTab('exercises');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-fun font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'exercises'
              ? 'bg-blue-600 text-white shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>4. Exercises (12 Drills)</span>
        </button>

        <button
          onClick={() => {
            soundEffects.pop();
            setActiveTab('expanded');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-fun font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'expanded'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-102 ring-2 ring-blue-300'
              : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>5. 📚 Expanded Sets (A, B, C)</span>
          <span className="text-2xs font-black uppercase bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-full">
            22 Qs
          </span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE EXPLANATION & DEMO */}
      {activeTab === 'demo' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Rule 1: Increasing / Decreasing Multiplier */}
          <div className="rounded-3xl bg-white border-3 border-blue-300 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-fun font-black text-xl">
                1
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Concept Box 1
                </span>
                <h2 className="text-xl sm:text-2xl font-fun font-black text-slate-900">
                  Rule 1: Increasing & Decreasing Multipliers
                </h2>
              </div>
            </div>

            {/* Point Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-800 font-fun font-black text-base">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>Adding 1 to Multiplier:</span>
                </div>
                <p className="text-sm font-medium text-emerald-950 leading-relaxed">
                  &ldquo;When you <strong>add 1 to the Multiplier</strong>, the answer gets bigger by the{' '}
                  <strong className="text-emerald-700 underline decoration-2">Multiplicand</strong>.&rdquo;
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-800 font-fun font-black text-base">
                  <TrendingDown className="w-5 h-5 text-rose-600" />
                  <span>Taking Away 1 from Multiplier:</span>
                </div>
                <p className="text-sm font-medium text-rose-950 leading-relaxed">
                  &ldquo;When you <strong>take away 1 from the Multiplier</strong>, the answer gets smaller by the{' '}
                  <strong className="text-rose-700 underline decoration-2">Multiplicand</strong>.&rdquo;
                </p>
              </div>
            </div>

            {/* Visual Interactive Example: 7 x Table */}
            <div className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <h3 className="font-fun font-bold text-base text-slate-800 flex items-center gap-2">
                  <span>Visual Interactive Example: The 7 × Table</span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold">
                    Multiplicand is 7
                  </span>
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    disabled={demoMultiplier <= 1}
                    onClick={() => {
                      soundEffects.pop();
                      setDemoMultiplier(prev => Math.max(1, prev - 1));
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-bold hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  >
                    -1 Multiplier
                  </button>
                  <span className="text-sm font-black font-fun px-2 text-slate-800">
                    Multiplier: {demoMultiplier}
                  </span>
                  <button
                    disabled={demoMultiplier >= 6}
                    onClick={() => {
                      soundEffects.pop();
                      setDemoMultiplier(prev => Math.min(6, prev + 1));
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-40 cursor-pointer shadow-2xs"
                  >
                    +1 Multiplier
                  </button>
                </div>
              </div>

              {/* 3 Step Progression Display: 7x2, 7x3, 7x4 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[2, 3, 4].map(m => {
                  const isCurrent = demoMultiplier === m;
                  const prod = 7 * m;
                  return (
                    <div
                      key={m}
                      onClick={() => setDemoMultiplier(m)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-50 border-blue-400 shadow-md ring-2 ring-blue-300 scale-102'
                          : 'bg-white border-slate-200 hover:border-blue-200'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-500 mb-1">
                        {m === 2 ? 'Base Fact' : `Goes up by 1 in multiplier:`}
                      </div>

                      <div className="text-2xl font-fun font-black text-slate-900 flex items-center justify-between">
                        <span>7 × {m} = {prod}</span>
                        {m > 2 && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            + 7
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 mt-2">
                        {m === 2
                          ? '2 groups of 7 = 14'
                          : `${m} groups of 7. That is 7 more than 7 × ${m - 1}!`}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live equation breakdown of the active multiplier */}
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-fun font-black text-indigo-900">
                    7 × {demoMultiplier} = {7 * demoMultiplier}
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200">
                    7 is repeated {demoMultiplier} times
                  </span>
                </div>

                <div className="text-xs font-bold text-indigo-800">
                  Notice: Every time the multiplier goes up by 1, the total adds another 7!
                </div>
              </div>
            </div>
          </div>

          {/* Rule 2: Commutative Property (Order Doesn't Matter) */}
          <div className="rounded-3xl bg-white border-3 border-sky-300 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-fun font-black text-xl">
                2
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  Concept Box 2
                </span>
                <h2 className="text-xl sm:text-2xl font-fun font-black text-slate-900">
                  Rule 2: Commutative Property (Order Doesn&apos;t Matter!)
                </h2>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200">
              <p className="text-base font-bold text-sky-950">
                &ldquo;You can <strong>switch the order</strong> of the numbers, and the answer will be the{' '}
                <span className="underline decoration-sky-500 decoration-3">exact same</span>!&rdquo;
              </p>
            </div>

            {/* Visual Example: 7 x 3 = 21 AND 3 x 7 = 21 */}
            <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <span className="font-fun font-bold text-slate-800 text-base">
                  Interactive Commutative Flipper:
                </span>

                <button
                  onClick={() => {
                    soundEffects.pop();
                    setIsCommutativeFlipped(!isCommutativeFlipped);
                  }}
                  className="px-4 py-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-fun font-bold text-sm shadow-xs flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Repeat className="w-4 h-4" />
                  <span>{isCommutativeFlipped ? 'Flip back: 7 × 3' : '🔄 Swap Order: 3 × 7!'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual Dot Array */}
                <div className="p-5 rounded-2xl bg-white border-2 border-sky-200 flex flex-col items-center justify-center space-y-2">
                  <div className="text-xs font-bold text-slate-500 mb-1">
                    {isCommutativeFlipped
                      ? '3 rows of 7 stars (3 × 7)'
                      : '7 rows of 3 stars (7 × 3)'}
                  </div>

                  <div className="space-y-1.5">
                    {Array.from({ length: isCommutativeFlipped ? 3 : 7 }).map((_, r) => (
                      <div key={r} className="flex items-center gap-1.5">
                        {Array.from({ length: isCommutativeFlipped ? 7 : 3 }).map((_, c) => (
                          <div
                            key={c}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-sm sm:text-base shadow-2xs transform hover:scale-110 transition-transform"
                          >
                            ⭐
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="text-xs font-bold text-sky-800 pt-2">
                    Total stars: 21
                  </div>
                </div>

                {/* Equation Comparison Card */}
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      !isCommutativeFlipped
                        ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-500">Way 1:</div>
                    <div className="text-2xl font-fun font-black text-sky-900">
                      7 × 3 = 21
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      7 groups of 3 = 21
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      isCommutativeFlipped
                        ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-500">Way 2 (Switched):</div>
                    <div className="text-2xl font-fun font-black text-sky-900">
                      3 × 7 = 21
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      3 groups of 7 = 21
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900 text-center">
                    ✨ Both equations equal 21! Switching factor order never changes the product.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tip Box */}
          <div className="rounded-3xl bg-gradient-to-r from-amber-400 to-orange-400 p-6 text-white shadow-md flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 text-3xl">
              💡
            </div>
            <div>
              <div className="font-fun font-black text-lg">Teacher Mr. Saif&apos;s Golden Tip:</div>
              <p className="text-amber-50 font-medium text-sm md:text-base leading-relaxed">
                &ldquo;If you forget a multiplication fact, you can still use the rules to figure it out!
                For example, if you forget <strong>7 × 8</strong>, just think: 7 × 7 is 49, so add 7 more to get 56!&rdquo;
              </p>
            </div>
          </div>

          {/* Proceed Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                soundEffects.pop();
                setActiveTab('warmup');
              }}
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-fun font-black text-base shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <span>Next: Warm Up & How to Solve</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: WARM UP & HOW TO SOLVE */}
      {activeTab === 'warmup' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-3xl bg-white border-3 border-blue-300 p-6 md:p-8 shadow-sm space-y-6">
            <div className="border-b border-blue-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Step-by-Step Guided Walkthrough
              </span>
              <h2 className="text-2xl font-fun font-black text-slate-900">
                Warm Up: How to Solve for the Missing Boxes
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Teacher Mr. Saif shows exactly how to reason through each type of question. Tap each card to reveal the secret!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Guided Example 1 */}
              <div className="p-5 rounded-3xl bg-blue-50/60 border-2 border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-200 text-blue-800 text-xs font-black font-fun">
                    Example 1: Multiplier + 1
                  </span>
                </div>

                <div className="text-lg font-fun font-black text-slate-900 p-3 bg-white rounded-2xl border border-blue-200">
                  &ldquo;5 × 8 is <span className="text-emerald-600 underline font-black">[ 5 ]</span> more than 5 × 7.&rdquo;
                </div>

                <button
                  onClick={() => {
                    soundEffects.pop();
                    setRevealedWarmup(prev => ({ ...prev, ex1: !prev.ex1 }));
                  }}
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className={`w-4 h-4 transition-transform ${revealedWarmup.ex1 ? 'rotate-90' : ''}`} />
                  <span>{revealedWarmup.ex1 ? 'Hide explanation' : 'Why is the box 5?'}</span>
                </button>

                {revealedWarmup.ex1 && (
                  <div className="p-3 bg-white rounded-xl border border-blue-200 text-xs text-slate-700 leading-relaxed space-y-1 animate-fadeIn">
                    <p>
                      <strong>Explanation:</strong> The Multiplicand is <strong>5</strong>. The multiplier goes from 7 to 8 (which is 1 more).
                    </p>
                    <p className="text-emerald-700 font-bold">
                      Adding 1 to the multiplier adds another group of 5!
                    </p>
                  </div>
                )}
              </div>

              {/* Guided Example 2 */}
              <div className="p-5 rounded-3xl bg-rose-50/60 border-2 border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-rose-200 text-rose-800 text-xs font-black font-fun">
                    Example 2: Multiplier - 1
                  </span>
                </div>

                <div className="text-lg font-fun font-black text-slate-900 p-3 bg-white rounded-2xl border border-rose-200">
                  &ldquo;4 × 5 = 4 × 6 - <span className="text-rose-600 underline font-black">[ 4 ]</span>&rdquo;
                </div>

                <button
                  onClick={() => {
                    soundEffects.pop();
                    setRevealedWarmup(prev => ({ ...prev, ex2: !prev.ex2 }));
                  }}
                  className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className={`w-4 h-4 transition-transform ${revealedWarmup.ex2 ? 'rotate-90' : ''}`} />
                  <span>{revealedWarmup.ex2 ? 'Hide explanation' : 'Why is the box 4?'}</span>
                </button>

                {revealedWarmup.ex2 && (
                  <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs text-slate-700 leading-relaxed space-y-1 animate-fadeIn">
                    <p>
                      <strong>Explanation:</strong> In 4 × 6, there are 6 groups of 4. In 4 × 5, there are 5 groups of 4.
                    </p>
                    <p className="text-rose-700 font-bold">
                      Subtracting 1 from the multiplier means taking away 1 group of 4!
                    </p>
                  </div>
                )}
              </div>

              {/* Guided Example 3 */}
              <div className="p-5 rounded-3xl bg-amber-50/60 border-2 border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-200 text-amber-800 text-xs font-black font-fun">
                    Example 3: Switching Order
                  </span>
                </div>

                <div className="text-lg font-fun font-black text-slate-900 p-3 bg-white rounded-2xl border border-amber-200">
                  &ldquo;6 × 3 = <span className="text-amber-600 underline font-black">[ 3 ]</span> × 6&rdquo;
                </div>

                <button
                  onClick={() => {
                    soundEffects.pop();
                    setRevealedWarmup(prev => ({ ...prev, ex3: !prev.ex3 }));
                  }}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className={`w-4 h-4 transition-transform ${revealedWarmup.ex3 ? 'rotate-90' : ''}`} />
                  <span>{revealedWarmup.ex3 ? 'Hide explanation' : 'Why is the box 3?'}</span>
                </button>

                {revealedWarmup.ex3 && (
                  <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs text-slate-700 leading-relaxed space-y-1 animate-fadeIn">
                    <p>
                      <strong>Explanation:</strong> This is the <strong>Commutative Property</strong>!
                    </p>
                    <p className="text-amber-800 font-bold">
                      6 × 3 = 18 and 3 × 6 = 18. Both have the same numbers switched!
                    </p>
                  </div>
                )}
              </div>

              {/* Guided Example 4 */}
              <div className="p-5 rounded-3xl bg-purple-50/60 border-2 border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-200 text-purple-800 text-xs font-black font-fun">
                    Example 4: Switching Order
                  </span>
                </div>

                <div className="text-lg font-fun font-black text-slate-900 p-3 bg-white rounded-2xl border border-purple-200">
                  &ldquo;9 × 5 = 5 × <span className="text-purple-600 underline font-black">[ 9 ]</span>&rdquo;
                </div>

                <button
                  onClick={() => {
                    soundEffects.pop();
                    setRevealedWarmup(prev => ({ ...prev, ex4: !prev.ex4 }));
                  }}
                  className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className={`w-4 h-4 transition-transform ${revealedWarmup.ex4 ? 'rotate-90' : ''}`} />
                  <span>{revealedWarmup.ex4 ? 'Hide explanation' : 'Why is the box 9?'}</span>
                </button>

                {revealedWarmup.ex4 && (
                  <div className="p-3 bg-white rounded-xl border border-purple-200 text-xs text-slate-700 leading-relaxed space-y-1 animate-fadeIn">
                    <p>
                      <strong>Explanation:</strong> 9 was first on the left side (9 × 5). On the right side, 5 is first, so 9 goes second!
                    </p>
                    <p className="text-purple-800 font-bold">
                      9 × 5 = 5 × 9 = 45!
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('demo')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                ← Back to Rules Demo
              </button>

              <button
                onClick={() => {
                  soundEffects.pop();
                  setActiveTab('practice');
                }}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-fun font-black text-sm shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <span>Ready for Practice (Try It Yourself)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRY IT YOURSELF (INTERACTIVE INPUT PRACTICE) */}
      {activeTab === 'practice' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-3xl bg-white border-3 border-blue-300 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Interactive Practice
                </span>
                <h2 className="text-2xl font-fun font-black text-slate-900">
                  3. Try It Yourself: Fill In the Missing Boxes
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Type your answer in each box. The box will pulse green when you get it right!
                </p>
              </div>

              {practiceCompleted && (
                <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-fun font-bold text-sm flex items-center gap-1.5 shadow-xs">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Practice Complete (+2 Stars!)</span>
                </span>
              )}
            </div>

            {/* 6 Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Q1 */}
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-base sm:text-lg font-fun font-black text-slate-800">
                  <span>Q1: 2 × 5 is</span>
                  <input
                    type="number"
                    value={practiceInputs.q1}
                    onChange={e => handlePracticeChange('q1', e.target.value, pRef2)}
                    placeholder="?"
                    className={`w-14 h-11 text-center font-fun font-black text-xl rounded-xl border-2 outline-hidden transition-all ${
                      parseInt(practiceInputs.q1, 10) === 2
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300 animate-pulse'
                        : practiceChecked
                        ? 'bg-rose-50 border-rose-400 text-rose-900'
                        : 'bg-white border-slate-300 focus:border-blue-500'
                    }`}
                  />
                  <span>more than 2 × 4.</span>
                </div>
                {parseInt(practiceInputs.q1, 10) === 2 && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
              </div>

              {/* Q2 */}
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-base sm:text-lg font-fun font-black text-slate-800">
                  <span>Q2: 5 × 3 is</span>
                  <input
                    ref={pRef2}
                    type="number"
                    value={practiceInputs.q2}
                    onChange={e => handlePracticeChange('q2', e.target.value, pRef3)}
                    placeholder="?"
                    className={`w-14 h-11 text-center font-fun font-black text-xl rounded-xl border-2 outline-hidden transition-all ${
                      parseInt(practiceInputs.q2, 10) === 5
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300 animate-pulse'
                        : practiceChecked
                        ? 'bg-rose-50 border-rose-400 text-rose-900'
                        : 'bg-white border-slate-300 focus:border-blue-500'
                    }`}
                  />
                  <span>less than 5 × 4.</span>
                </div>
                {parseInt(practiceInputs.q2, 10) === 5 && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
              </div>

              {/* Q3 */}
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-base sm:text-lg font-fun font-black text-slate-800">
                  <span>Q3: 6 × 9 = 6 × 8 +</span>
                  <input
                    ref={pRef3}
                    type="number"
                    value={practiceInputs.q3}
                    onChange={e => handlePracticeChange('q3', e.target.value, pRef4)}
                    placeholder="?"
                    className={`w-14 h-11 text-center font-fun font-black text-xl rounded-xl border-2 outline-hidden transition-all ${
                      parseInt(practiceInputs.q3, 10) === 6
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300 animate-pulse'
                        : practiceChecked
                        ? 'bg-rose-50 border-rose-400 text-rose-900'
                        : 'bg-white border-slate-300 focus:border-blue-500'
                    }`}
                  />
                </div>
                {parseInt(practiceInputs.q3, 10) === 6 && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
              </div>

              {/* Q4 */}
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-base sm:text-lg font-fun font-black text-slate-800">
                  <span>Q4: 9 × 7 = 9 × 8 -</span>
                  <input
                    ref={pRef4}
                    type="number"
                    value={practiceInputs.q4}
                    onChange={e => handlePracticeChange('q4', e.target.value, pRef5)}
                    placeholder="?"
                    className={`w-14 h-11 text-center font-fun font-black text-xl rounded-xl border-2 outline-hidden transition-all ${
                      parseInt(practiceInputs.q4, 10) === 9
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300 animate-pulse'
                        : practiceChecked
                        ? 'bg-rose-50 border-rose-400 text-rose-900'
                        : 'bg-white border-slate-300 focus:border-blue-500'
                    }`}
                  />
                </div>
                {parseInt(practiceInputs.q4, 10) === 9 && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
              </div>

              {/* Q5 */}
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-base sm:text-lg font-fun font-black text-slate-800">
                  <span>Q5: 4 × 8 =</span>
                  <input
                    ref={pRef5}
                    type="number"
                    value={practiceInputs.q5}
                    onChange={e => handlePracticeChange('q5', e.target.value, pRef6)}
                    placeholder="?"
                    className={`w-14 h-11 text-center font-fun font-black text-xl rounded-xl border-2 outline-hidden transition-all ${
                      parseInt(practiceInputs.q5, 10) === 8
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300 animate-pulse'
                        : practiceChecked
                        ? 'bg-rose-50 border-rose-400 text-rose-900'
                        : 'bg-white border-slate-300 focus:border-blue-500'
                    }`}
                  />
                  <span>× 4</span>
                </div>
                {parseInt(practiceInputs.q5, 10) === 8 && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
              </div>

              {/* Q6 */}
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-base sm:text-lg font-fun font-black text-slate-800">
                  <span>Q6: 3 × 9 = 9 ×</span>
                  <input
                    ref={pRef6}
                    type="number"
                    value={practiceInputs.q6}
                    onChange={e => handlePracticeChange('q6', e.target.value)}
                    placeholder="?"
                    className={`w-14 h-11 text-center font-fun font-black text-xl rounded-xl border-2 outline-hidden transition-all ${
                      parseInt(practiceInputs.q6, 10) === 3
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300 animate-pulse'
                        : practiceChecked
                        ? 'bg-rose-50 border-rose-400 text-rose-900'
                        : 'bg-white border-slate-300 focus:border-blue-500'
                    }`}
                  />
                </div>
                {parseInt(practiceInputs.q6, 10) === 3 && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleCheckPractice}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-fun font-black text-base shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                Check My Practice Answers
              </button>

              <button
                onClick={() => {
                  soundEffects.pop();
                  setActiveTab('exercises');
                }}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-fun font-black text-base shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <span>Jump to 12 Exercises</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXERCISES (12 INTERACTIVE DRILLS) */}
      {activeTab === 'exercises' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-3xl bg-white border-3 border-blue-300 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Comprehensive Drills
                </span>
                <h2 className="text-2xl font-fun font-black text-slate-900">
                  4. Lesson 1-1 Exercises (12 Practice Drills)
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Complete all 12 items to earn Teacher Mr. Saif&apos;s <strong>Rules of Multiplication Master 📘</strong> badge!
                </p>
              </div>

              {exerciseCompleted && (
                <div className="px-4 py-2 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-900 font-fun font-black text-sm flex items-center gap-2 animate-bounce-slow">
                  <span>🏆 Badge Unlocked: Rules Master!</span>
                </div>
              )}
            </div>

            {/* 12 Exercise Cards in 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {exerciseData.map((item, idx) => {
                const currentVal = exerciseInputs[item.id] || '';
                const isCorrect = parseInt(currentVal, 10) === item.expected;
                const nextId = idx + 1 < exerciseData.length ? exerciseData[idx + 1].id : undefined;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-2 ${
                      isCorrect
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                        : exerciseChecked
                        ? 'bg-rose-50/70 border-rose-300'
                        : 'bg-slate-50 border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-wrap font-fun font-bold text-base sm:text-lg text-slate-800">
                      <span className="text-xs text-slate-500 font-mono w-6">
                        ({idx + 1})
                      </span>
                      <span>{item.q}</span>

                      <input
                        ref={eRefs[item.id]}
                        type="number"
                        value={currentVal}
                        onChange={e => handleExerciseChange(item.id, e.target.value, nextId)}
                        placeholder="?"
                        className={`w-14 h-10 text-center font-fun font-black text-xl rounded-xl border-2 outline-hidden transition-all ${
                          isCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300 animate-pulse'
                            : exerciseChecked && currentVal !== ''
                            ? 'bg-rose-100 border-rose-500 text-rose-900'
                            : 'bg-white border-slate-300 focus:border-blue-500'
                        }`}
                      />

                      {item.suffix && <span>{item.suffix}</span>}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setActiveHintId(activeHintId === item.id ? null : item.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                        title="Show Hint"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>

                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hint Popup if opened */}
            {activeHintId && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs text-amber-900 font-medium">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Hint:</strong> {exerciseData.find(e => e.id === activeHintId)?.hint}
                  </span>
                </div>
                <button
                  onClick={() => setActiveHintId(null)}
                  className="font-bold underline text-amber-800 ml-2"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Check & Submit Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <button
                onClick={handleCheckExercises}
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-fun font-black text-base shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                Check All 12 Exercises
              </button>

              <button
                onClick={() => {
                  soundEffects.pop();
                  onNavigateToLesson2();
                }}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-black text-base shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <span>Continue to Lesson 1-2 (Breaking Up Numbers)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EXPANDED PRACTICE SETS (A, B, C) */}
      {activeTab === 'expanded' && (
        <Chapter1Lesson1ExpandedPractice
          settings={settings}
          record={record}
          onUpdateRecord={onUpdateRecord}
          onQuestionSolved={qid => {
            setCh1CompletedList(prev => (prev.includes(qid) ? prev : [...prev, qid]));
          }}
        />
      )}

      {/* Chapter 1 Mastery Quiz Modal */}
      <Chapter1QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        settings={settings}
        record={record}
        onUpdateRecord={onUpdateRecord}
      />
    </div>
  );
};
