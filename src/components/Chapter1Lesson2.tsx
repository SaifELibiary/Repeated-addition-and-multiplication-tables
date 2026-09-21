import React, { useState } from 'react';
import { TeacherSettings, HighScoreRecord } from '../types';
import { MrSaifGuide } from './MrSaifGuide';
import { BranchingTreeDiagram, BranchProblem } from './BranchingTreeDiagram';
import { soundEffects } from '../utils/audio';
import { Chapter1ProgressBar } from './Chapter1ProgressBar';
import { Chapter1QuizModal } from './Chapter1QuizModal';
import { Chapter1Lesson2ExpandedPractice } from './Chapter1Lesson2ExpandedPractice';
import { getCh1CompletedQuestions } from '../utils/storage';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Award,
  BookOpen,
  Lightbulb,
  Split,
  Trophy,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Chapter1Lesson2Props {
  settings: TeacherSettings;
  record: HighScoreRecord;
  onUpdateRecord: (updated: HighScoreRecord) => void;
  onNavigateToModule1: () => void;
  onNavigateToLesson1: () => void;
}

export const Chapter1Lesson2: React.FC<Chapter1Lesson2Props> = ({
  settings,
  record,
  onUpdateRecord,
  onNavigateToModule1,
  onNavigateToLesson1,
}) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'warmup' | 'practice' | 'exercises' | 'expanded'>('demo');
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [ch1CompletedList, setCh1CompletedList] = useState<string[]>(() => getCh1CompletedQuestions());

  // Interactive Demo 1: Splitting 9 into parts for 9 x 3
  const [split9Option, setSplit9Option] = useState<{ partA: number; partB: number }>({ partA: 4, partB: 5 });

  // WARM UP STATE (2 problems)
  const warmupProblems: BranchProblem[] = [
    {
      id: 'w1',
      original: {
        factorA: 8,
        factorB: 4,
        splitTarget: 'factorA',
        splitVal1: 5,
        splitVal2: 3,
      },
      topBranch: { num1: 5, num2: 4, product: 20 },
      bottomBranch: { num1: 3, num2: 4, product: 12 },
      total: 32,
      blanks: {
        botPart: true,
        topProd: true,
        botProd: true,
        total: true,
      },
      hint: '8 is split into 5 and 3. Top branch: 5 × 4. Bottom branch: 3 × 4!',
    },
    {
      id: 'w2',
      original: {
        factorA: 6,
        factorB: 7,
        splitTarget: 'factorB',
        splitVal1: 5,
        splitVal2: 2,
      },
      topBranch: { num1: 6, num2: 5, product: 30 },
      bottomBranch: { num1: 6, num2: 2, product: 12 },
      total: 42,
      blanks: {
        botPart: true,
        topProd: true,
        botProd: true,
        total: true,
      },
      hint: '7 is split into 5 and 2. Top branch: 6 × 5. Bottom branch: 6 × 2!',
    },
  ];

  const [warmupValues, setWarmupValues] = useState<{ [probId: string]: { [field: string]: string } }>({
    w1: { botPart: '', topProd: '', botProd: '', total: '' },
    w2: { botPart: '', topProd: '', botProd: '', total: '' },
  });
  const [warmupChecked, setWarmupChecked] = useState(false);
  const [showWarmupSolutions, setShowWarmupSolutions] = useState(false);

  // TRY IT YOURSELF: 4 Diagrams
  const practiceProblems: BranchProblem[] = [
    {
      id: 'p1',
      original: { factorA: 7, factorB: 9, splitTarget: 'factorA', splitVal1: 4, splitVal2: 3 },
      topBranch: { num1: 4, num2: 9, product: 36 },
      bottomBranch: { num1: 3, num2: 9, product: 27 },
      total: 63,
      blanks: { topProd: true, botPart: true, botProd: true, total: true },
      hint: '7 is broken into 4 and 3. 4 × 9 = 36 and 3 × 9 = 27.',
    },
    {
      id: 'p2',
      original: { factorA: 8, factorB: 5, splitTarget: 'factorA', splitVal1: 2, splitVal2: 6 },
      topBranch: { num1: 2, num2: 5, product: 10 },
      bottomBranch: { num1: 6, num2: 5, product: 30 },
      total: 40,
      blanks: { topProd: true, botPart: true, botProd: true, total: true },
      hint: '8 is broken into 2 and 6. 2 × 5 = 10 and 6 × 5 = 30.',
    },
    {
      id: 'p3',
      original: { factorA: 9, factorB: 5, splitTarget: 'factorB', splitVal1: 2, splitVal2: 3 },
      topBranch: { num1: 9, num2: 2, product: 18 },
      bottomBranch: { num1: 9, num2: 3, product: 27 },
      total: 45,
      blanks: { topProd: true, botPart: true, botProd: true, total: true },
      hint: '5 is broken into 2 and 3. 9 × 2 = 18 and 9 × 3 = 27.',
    },
    {
      id: 'p4',
      original: { factorA: 6, factorB: 8, splitTarget: 'factorB', splitVal1: 5, splitVal2: 3 },
      topBranch: { num1: 6, num2: 5, product: 30 },
      bottomBranch: { num1: 6, num2: 3, product: 18 },
      total: 48,
      blanks: { topPart: true, topProd: true, botProd: true, total: true },
      hint: '8 is broken into 5 and 3. 6 × 5 = 30 and 6 × 3 = 18.',
    },
  ];

  const [practiceValues, setPracticeValues] = useState<{ [probId: string]: { [field: string]: string } }>({
    p1: {},
    p2: {},
    p3: {},
    p4: {},
  });
  const [practiceChecked, setPracticeChecked] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);

  // EXERCISES: 6 Diagrams
  const exerciseProblems: BranchProblem[] = [
    {
      id: 'ex1',
      original: { factorA: 9, factorB: 8, splitTarget: 'factorA', splitVal1: 4, splitVal2: 5 },
      topBranch: { num1: 4, num2: 8, product: 32 },
      bottomBranch: { num1: 5, num2: 8, product: 40 },
      total: 72,
      blanks: { topProd: true, botPart: true, botProd: true, total: true },
      hint: '9 breaks into 4 and 5. (4 × 8) + (5 × 8) = 32 + 40 = 72!',
    },
    {
      id: 'ex2',
      original: { factorA: 8, factorB: 7, splitTarget: 'factorA', splitVal1: 6, splitVal2: 2 },
      topBranch: { num1: 6, num2: 7, product: 42 },
      bottomBranch: { num1: 2, num2: 7, product: 14 },
      total: 56,
      blanks: { topPart: true, topProd: true, botProd: true, total: true },
      hint: '8 breaks into 6 and 2. (6 × 7) + (2 × 7) = 42 + 14 = 56!',
    },
    {
      id: 'ex3',
      original: { factorA: 6, factorB: 6, splitTarget: 'factorB', splitVal1: 1, splitVal2: 5 },
      topBranch: { num1: 6, num2: 1, product: 6 },
      bottomBranch: { num1: 6, num2: 5, product: 30 },
      total: 36,
      blanks: { topProd: true, botPart: true, botProd: true, total: true },
      hint: '6 breaks into 1 and 5. (6 × 1) + (6 × 5) = 6 + 30 = 36!',
    },
    {
      id: 'ex4',
      original: { factorA: 7, factorB: 7, splitTarget: 'factorB', splitVal1: 5, splitVal2: 2 },
      topBranch: { num1: 7, num2: 5, product: 35 },
      bottomBranch: { num1: 7, num2: 2, product: 14 },
      total: 49,
      blanks: { topPart: true, topProd: true, botProd: true, total: true },
      hint: '7 breaks into 5 and 2. (7 × 5) + (7 × 2) = 35 + 14 = 49!',
    },
    {
      id: 'ex5',
      original: { factorA: 8, factorB: 8, splitTarget: 'factorB', splitVal1: 2, splitVal2: 6 },
      topBranch: { num1: 8, num2: 2, product: 16 },
      bottomBranch: { num1: 8, num2: 6, product: 48 },
      total: 64,
      blanks: { topProd: true, botPart: true, botProd: true, total: true },
      hint: '8 breaks into 2 and 6. (8 × 2) + (8 × 6) = 16 + 48 = 64!',
    },
    {
      id: 'ex6',
      original: { factorA: 6, factorB: 9, splitTarget: 'factorB', splitVal1: 5, splitVal2: 4 },
      topBranch: { num1: 6, num2: 5, product: 30 },
      bottomBranch: { num1: 6, num2: 4, product: 24 },
      total: 54,
      blanks: { topPart: true, topProd: true, botProd: true, total: true },
      hint: '9 breaks into 5 and 4. (6 × 5) + (6 × 4) = 30 + 24 = 54!',
    },
  ];

  const [exerciseValues, setExerciseValues] = useState<{ [probId: string]: { [field: string]: string } }>({
    ex1: {},
    ex2: {},
    ex3: {},
    ex4: {},
    ex5: {},
    ex6: {},
  });
  const [exerciseChecked, setExerciseChecked] = useState(false);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  const handleWarmupChange = (probId: string, field: string, val: string) => {
    setWarmupValues(prev => ({
      ...prev,
      [probId]: { ...(prev[probId] || {}), [field]: val },
    }));
  };

  const handlePracticeChange = (probId: string, field: string, val: string) => {
    setPracticeValues(prev => ({
      ...prev,
      [probId]: { ...(prev[probId] || {}), [field]: val },
    }));
  };

  const handleExerciseChange = (probId: string, field: string, val: string) => {
    setExerciseValues(prev => ({
      ...prev,
      [probId]: { ...(prev[probId] || {}), [field]: val },
    }));
  };

  const handleCheckPractice = () => {
    setPracticeChecked(true);
    let allOk = true;

    practiceProblems.forEach(p => {
      const v = practiceValues[p.id] || {};
      if (p.blanks.topPart) {
        const expected = p.original.splitTarget === 'factorA' ? p.topBranch.num1 : p.topBranch.num2;
        if (parseInt((v.topPart || '').trim(), 10) !== expected) allOk = false;
      }
      if (p.blanks.topProd) {
        if (parseInt((v.topProd || '').trim(), 10) !== p.topBranch.product) allOk = false;
      }
      if (p.blanks.botPart) {
        const expected = p.original.splitTarget === 'factorA' ? p.bottomBranch.num1 : p.bottomBranch.num2;
        if (parseInt((v.botPart || '').trim(), 10) !== expected) allOk = false;
      }
      if (p.blanks.botProd) {
        if (parseInt((v.botProd || '').trim(), 10) !== p.bottomBranch.product) allOk = false;
      }
      if (p.blanks.total) {
        if (parseInt((v.total || '').trim(), 10) !== p.total) allOk = false;
      }
    });

    if (allOk) {
      soundEffects.correct();
      setPracticeCompleted(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onUpdateRecord({ ...record, stars: record.stars + 3 });
    } else {
      soundEffects.wrong();
    }
  };

  const handleCheckExercises = () => {
    setExerciseChecked(true);
    let allOk = true;

    exerciseProblems.forEach(p => {
      const v = exerciseValues[p.id] || {};
      if (p.blanks.topPart) {
        const expected = p.original.splitTarget === 'factorA' ? p.topBranch.num1 : p.topBranch.num2;
        if (parseInt((v.topPart || '').trim(), 10) !== expected) allOk = false;
      }
      if (p.blanks.topProd) {
        if (parseInt((v.topProd || '').trim(), 10) !== p.topBranch.product) allOk = false;
      }
      if (p.blanks.botPart) {
        const expected = p.original.splitTarget === 'factorA' ? p.bottomBranch.num1 : p.bottomBranch.num2;
        if (parseInt((v.botPart || '').trim(), 10) !== expected) allOk = false;
      }
      if (p.blanks.botProd) {
        if (parseInt((v.botProd || '').trim(), 10) !== p.bottomBranch.product) allOk = false;
      }
      if (p.blanks.total) {
        if (parseInt((v.total || '').trim(), 10) !== p.total) allOk = false;
      }
    });

    if (allOk) {
      soundEffects.fanfare();
      setExerciseCompleted(true);
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });

      const newBadges = [...record.badges];
      if (!newBadges.includes('breaking_up_expert')) {
        newBadges.push('breaking_up_expert');
      }

      onUpdateRecord({
        ...record,
        stars: record.stars + 8,
        badges: newBadges,
      });
    } else {
      soundEffects.wrong();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-fadeIn">
      {/* Chapter 1 Lesson 2 Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              Chapter 1 • Rules of Multiplication
            </span>
            <span className="bg-indigo-900 text-indigo-100 text-xs font-black px-2.5 py-0.5 rounded-full">
              Grade 3 Math
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-fun font-black tracking-tight">
            Lesson 1-2: Properties of Multiplication (Part 2)
          </h1>

          <p className="text-amber-100 text-sm md:text-base font-medium max-w-3xl">
            Learn the <strong>Distributive Property</strong> by breaking up numbers!
            When a multiplication fact is too big, split one of the numbers into two easier parts, multiply both, and add them together!
          </p>
        </div>

        <div className="absolute -right-6 -bottom-6 text-8xl opacity-20 select-none pointer-events-none">
          🧩
        </div>
      </div>

      {/* Mr. Saif Teacher Guide Tip */}
      <MrSaifGuide
        message="Did you know you can break up big numbers into your favorite easy numbers (like 5 and 2, or 4 and 4)? The answer will always be the same! That's the superpower of the Distributive Property!"
        hint="Example: 8 × 4 is just (5 × 4 = 20) + (3 × 4 = 12). 20 + 12 = 32!"
        soundEnabled={settings.soundEnabled}
        speechEnabled={settings.speechEnabled}
      />

      {/* Chapter 1 Progress Bar & Mastery Quiz Trigger */}
      <Chapter1ProgressBar
        completedCount={ch1CompletedList.length}
        totalCount={35}
        record={record}
        onOpenQuiz={() => setIsQuizModalOpen(true)}
        accentColor="amber"
      />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-amber-200/80 pb-3">
        <button
          onClick={() => {
            soundEffects.pop();
            setActiveTab('demo');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-fun font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'demo'
              ? 'bg-orange-500 text-white shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-orange-50 border border-slate-200'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>1. Breaking Up Concept & Demo</span>
        </button>

        <button
          onClick={() => {
            soundEffects.pop();
            setActiveTab('warmup');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-fun font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'warmup'
              ? 'bg-orange-500 text-white shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-orange-50 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. Warm Up & Decomposition Trees</span>
        </button>

        <button
          onClick={() => {
            soundEffects.pop();
            setActiveTab('practice');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-fun font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'practice'
              ? 'bg-orange-500 text-white shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-orange-50 border border-slate-200'
          }`}
        >
          <Split className="w-4 h-4" />
          <span>3. Try It Yourself (4 Trees)</span>
        </button>

        <button
          onClick={() => {
            soundEffects.pop();
            setActiveTab('exercises');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-fun font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'exercises'
              ? 'bg-orange-500 text-white shadow-md scale-102'
              : 'bg-white text-slate-700 hover:bg-orange-50 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>4. Exercises (6 Tree Drills)</span>
        </button>

        <button
          onClick={() => {
            soundEffects.pop();
            setActiveTab('expanded');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-fun font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'expanded'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md scale-102 ring-2 ring-amber-300'
              : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>5. 🧩 Expanded Sets (A, B, C)</span>
          <span className="text-2xs font-black uppercase bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
            13 Qs
          </span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE EXPLANATION & DEMO */}
      {activeTab === 'demo' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Concept Box 1: Breaking up the Multiplicand */}
          <div className="rounded-3xl bg-white border-3 border-orange-300 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-fun font-black text-xl">
                1
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Concept Box 1
                </span>
                <h2 className="text-xl sm:text-2xl font-fun font-black text-slate-900">
                  Breaking Up the Multiplicand
                </h2>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-200 text-orange-950 font-medium">
              &ldquo;You can <strong>break up the Multiplicand</strong> to multiply, and the answer will be the{' '}
              <span className="underline decoration-orange-500 decoration-3 font-bold">same</span>.&rdquo;
            </div>

            {/* Mascot Tip */}
            <div className="p-4 rounded-2xl bg-amber-100/70 border border-amber-300 flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <p className="text-xs sm:text-sm font-bold text-amber-950">
                Mascot Tip: &ldquo;You can break up the number 9 any way you want, and the answer will still be the same!&rdquo;
              </p>
            </div>

            {/* Visual Interactive Example: 9 x 3 = 27 */}
            <div className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <span className="font-fun font-bold text-slate-800 text-base">
                  Interactive Experiment with 9 × 3 = 27:
                </span>
                <span className="text-xs font-bold text-orange-800 bg-orange-100 px-3 py-1 rounded-full">
                  Choose how to break up 9:
                </span>
              </div>

              {/* Selector Buttons for breaking 9 */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { partA: 4, partB: 5, label: '4 and 5' },
                  { partA: 7, partB: 2, label: '7 and 2' },
                  { partA: 6, partB: 3, label: '6 and 3' },
                  { partA: 8, partB: 1, label: '8 and 1' },
                ].map((opt, i) => {
                  const isSelected = split9Option.partA === opt.partA && split9Option.partB === opt.partB;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        soundEffects.pop();
                        setSplit9Option(opt);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl font-fun font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-500 text-white shadow-xs scale-105'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-orange-50'
                      }`}
                    >
                      Break into {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* Calculated Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 text-center">
                  <div className="text-xs font-bold text-sky-800">Branch 1:</div>
                  <div className="text-xl sm:text-2xl font-fun font-black text-sky-950 mt-1">
                    {split9Option.partA} × 3 = {split9Option.partA * 3}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-center">
                  <div className="text-xs font-bold text-indigo-800">Branch 2:</div>
                  <div className="text-xl sm:text-2xl font-fun font-black text-indigo-950 mt-1">
                    {split9Option.partB} × 3 = {split9Option.partB * 3}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-100 border-2 border-amber-300 text-center flex flex-col justify-center">
                  <div className="text-xs font-bold text-amber-900">Total Sum:</div>
                  <div className="text-2xl font-fun font-black text-amber-950 mt-0.5">
                    {split9Option.partA * 3} + {split9Option.partB * 3} = 27
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Concept Box 2: Breaking up the Multiplier */}
          <div className="rounded-3xl bg-white border-3 border-amber-300 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-fun font-black text-xl">
                2
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Concept Box 2
                </span>
                <h2 className="text-xl sm:text-2xl font-fun font-black text-slate-900">
                  Breaking Up the Multiplier
                </h2>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-950 font-medium">
              &ldquo;You can also <strong>break up the Multiplier</strong> to multiply, and the answer will be the{' '}
              <span className="underline decoration-amber-500 decoration-3 font-bold">same</span>.&rdquo;
            </div>

            {/* Visual Example (9 x 3 = 27): Break 3 into 1 and 2 */}
            <div className="p-5 rounded-3xl bg-slate-50 border-2 border-slate-200 space-y-4">
              <div className="font-fun font-bold text-slate-800 text-base">
                Visual Example for 9 × 3 = 27: Break the Multiplier 3 into 1 and 2
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border-2 border-sky-200 space-y-2">
                  <div className="text-xs font-bold text-sky-800 bg-sky-100 inline-block px-2.5 py-0.5 rounded-md">
                    Top Part:
                  </div>
                  <div className="text-2xl font-fun font-black text-sky-950">
                    9 × 1 = 9
                  </div>
                  <p className="text-xs text-slate-600">
                    1 group of 9
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border-2 border-indigo-200 space-y-2">
                  <div className="text-xs font-bold text-indigo-800 bg-indigo-100 inline-block px-2.5 py-0.5 rounded-md">
                    Bottom Part:
                  </div>
                  <div className="text-2xl font-fun font-black text-indigo-950">
                    9 × 2 = 18
                  </div>
                  <p className="text-xs text-slate-600">
                    2 groups of 9
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between">
                <span className="font-fun font-black text-lg text-emerald-950">
                  (9 × 1 = 9) + (9 × 2 = 18)
                </span>
                <span className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-fun font-black text-xl shadow-xs">
                  Total = 27
                </span>
              </div>
            </div>
          </div>

          {/* Proceed Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                soundEffects.pop();
                setActiveTab('warmup');
              }}
              className="px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-fun font-black text-base shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <span>Next: Warm Up (Interactive Tree Diagrams)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: WARM UP & HOW TO SOLVE */}
      {activeTab === 'warmup' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-3xl bg-white border-3 border-orange-300 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Interactive Decomposition Diagrams
                </span>
                <h2 className="text-2xl font-fun font-black text-slate-900">
                  2. Warm Up & How to Solve
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Examine the branching trees below. Split the number, multiply each branch, and add for the total!
                </p>
              </div>

              <button
                onClick={() => setShowWarmupSolutions(!showWarmupSolutions)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs cursor-pointer"
              >
                {showWarmupSolutions ? 'Hide Solutions' : 'Show Walkthrough Solutions'}
              </button>
            </div>

            {/* Render 2 Warm Up Problems */}
            <div className="space-y-6">
              {warmupProblems.map((prob, idx) => (
                <div key={prob.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-900 font-fun font-black text-xs">
                      Warm Up #{idx + 1}
                    </span>
                  </div>

                  <BranchingTreeDiagram
                    problem={prob}
                    values={warmupValues[prob.id] || {}}
                    onChange={(field, val) => handleWarmupChange(prob.id, field, val)}
                    isCheckAttempted={warmupChecked}
                    showSolution={showWarmupSolutions}
                    onCorrectField={() => soundEffects.pop()}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveTab('demo')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                ← Back to Concept Demo
              </button>

              <button
                onClick={() => {
                  soundEffects.pop();
                  setActiveTab('practice');
                }}
                className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-fun font-black text-sm shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <span>Ready for Practice (Try It Yourself)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRY IT YOURSELF (4 DIAGRAMS) */}
      {activeTab === 'practice' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-3xl bg-white border-3 border-orange-300 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Interactive Decomposition Tree Practice
                </span>
                <h2 className="text-2xl font-fun font-black text-slate-900">
                  3. Try It Yourself (4 Decomposition Trees)
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Type the missing numbers into each branch. The input turns green when correct!
                </p>
              </div>

              {practiceCompleted && (
                <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-fun font-bold text-sm flex items-center gap-1.5 shadow-xs">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Practice Complete (+3 Stars!)</span>
                </span>
              )}
            </div>

            {/* 4 Practice Problems */}
            <div className="grid grid-cols-1 gap-6">
              {practiceProblems.map((prob, idx) => (
                <div key={prob.id} className="space-y-1.5">
                  <div className="font-fun font-bold text-sm text-slate-700">
                    Diagram {idx + 1}: Breaking up {prob.original.factorA} × {prob.original.factorB}
                  </div>
                  <BranchingTreeDiagram
                    problem={prob}
                    values={practiceValues[prob.id] || {}}
                    onChange={(field, val) => handlePracticeChange(prob.id, field, val)}
                    isCheckAttempted={practiceChecked}
                    onCorrectField={() => soundEffects.pop()}
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleCheckPractice}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-fun font-black text-base shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                Check All 4 Diagrams
              </button>

              <button
                onClick={() => {
                  soundEffects.pop();
                  setActiveTab('exercises');
                }}
                className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-fun font-black text-base shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <span>Jump to 6 Tree Exercises</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXERCISES (6 INTERACTIVE DECOMPOSITION DRILLS) */}
      {activeTab === 'exercises' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-3xl bg-white border-3 border-orange-300 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-orange-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Comprehensive Tree Drills
                </span>
                <h2 className="text-2xl font-fun font-black text-slate-900">
                  4. Lesson 1-2 Exercises (6 Branching Trees)
                </h2>
                <p className="text-slate-600 text-sm mt-1">
                  Solve all 6 decomposition problems to unlock Teacher Mr. Saif&apos;s special Mascot Badge!
                </p>
              </div>

              {exerciseCompleted && (
                <div className="px-4 py-2 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-900 font-fun font-black text-sm flex items-center gap-2 animate-bounce-slow">
                  <Trophy className="w-5 h-5 text-emerald-600" />
                  <span>Mascot Badge Unlocked!</span>
                </div>
              )}
            </div>

            {/* Mascot Badge Spotlight */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 border-2 border-amber-300 flex items-center gap-3">
              <span className="text-3xl">🧩</span>
              <div>
                <span className="font-fun font-black text-amber-900 text-sm block">
                  Teacher Mr. Saif Mascot Badge:
                </span>
                <p className="text-xs sm:text-sm font-bold text-amber-800">
                  &ldquo;You have many choices for how to break it up!&rdquo;
                </p>
              </div>
            </div>

            {/* 6 Exercise Problems */}
            <div className="grid grid-cols-1 gap-6">
              {exerciseProblems.map((prob, idx) => (
                <div key={prob.id} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white font-fun font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-fun font-bold text-sm text-slate-800">
                      Problem ({idx + 1}): {prob.original.factorA} × {prob.original.factorB}
                    </span>
                  </div>

                  <BranchingTreeDiagram
                    problem={prob}
                    values={exerciseValues[prob.id] || {}}
                    onChange={(field, val) => handleExerciseChange(prob.id, field, val)}
                    isCheckAttempted={exerciseChecked}
                    onCorrectField={() => soundEffects.pop()}
                  />
                </div>
              ))}
            </div>

            {/* Check Exercises & Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <button
                onClick={handleCheckExercises}
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-fun font-black text-base shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                Check All 6 Tree Exercises
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    soundEffects.pop();
                    onNavigateToLesson1();
                  }}
                  className="text-xs font-bold text-blue-700 hover:underline"
                >
                  ← Review Lesson 1-1
                </button>

                <button
                  onClick={() => {
                    soundEffects.pop();
                    onNavigateToModule1();
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-black text-base shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                >
                  <span>Go to Visual Builder & Tables</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EXPANDED PRACTICE SETS (A, B, C) */}
      {activeTab === 'expanded' && (
        <Chapter1Lesson2ExpandedPractice
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
