import React, { useState, useRef } from 'react';
import { TeacherSettings, HighScoreRecord } from '../types';
import { BranchingTreeDiagram, BranchProblem } from './BranchingTreeDiagram';
import { soundEffects } from '../utils/audio';
import { saveCh1CompletedQuestion } from '../utils/storage';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Lightbulb,
  ArrowRight,
  Split,
  Shuffle,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Chapter1Lesson2ExpandedPracticeProps {
  settings: TeacherSettings;
  record: HighScoreRecord;
  onUpdateRecord: (updated: HighScoreRecord) => void;
  onQuestionSolved: (qid: string) => void;
}

export const Chapter1Lesson2ExpandedPractice: React.FC<Chapter1Lesson2ExpandedPracticeProps> = ({
  settings,
  record,
  onUpdateRecord,
  onQuestionSolved,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'setA' | 'setB' | 'setC'>('setA');

  // ===================== SET A: 6 Branching Diagrams =====================
  // 1. Solve 7 x 8 by breaking 8 into (5 + 3):
  //    Top: 7 x 5 = [35], Bottom: 7 x 3 = [21], Total: 35 + 21 = [56]
  // 2. Solve 9 x 6 by breaking 9 into (5 + 4):
  //    Top: 5 x 6 = [30], Bottom: 4 x 6 = [24], Total: 30 + 24 = [54]
  // 3. Solve 8 x 6 by breaking 6 into (3 + 3):
  //    Top: 8 x 3 = [24], Bottom: 8 x 3 = [24], Total: 24 + 24 = [48]
  // 4. Solve 6 x 7 by breaking 7 into (5 + 2):
  //    Top: 6 x 5 = [30], Bottom: 6 x 2 = [12], Total: 30 + 12 = [42]
  // 5. Solve 9 x 9 by breaking 9 into (5 + 4):
  //    Top: 9 x 5 = [45], Bottom: 9 x 4 = [36], Total: 45 + 36 = [81]
  // 6. Solve 7 x 7 by breaking 7 into (4 + 3):
  //    Top: 7 x 4 = [28], Bottom: 7 x 3 = [21], Total: 28 + 21 = [49]
  const setAProblems: BranchProblem[] = [
    {
      id: 'l2_setA_1',
      original: { factorA: 7, factorB: 8, splitTarget: 'factorB', splitVal1: 5, splitVal2: 3 },
      topBranch: { num1: 7, num2: 5, product: 35 },
      bottomBranch: { num1: 7, num2: 3, product: 21 },
      total: 56,
      blanks: { topProd: true, botProd: true, total: true },
      hint: '8 is broken into 5 and 3. Top: 7 × 5 = 35. Bottom: 7 × 3 = 21. Total: 35 + 21 = 56!',
    },
    {
      id: 'l2_setA_2',
      original: { factorA: 9, factorB: 6, splitTarget: 'factorA', splitVal1: 5, splitVal2: 4 },
      topBranch: { num1: 5, num2: 6, product: 30 },
      bottomBranch: { num1: 4, num2: 6, product: 24 },
      total: 54,
      blanks: { topProd: true, botProd: true, total: true },
      hint: '9 is broken into 5 and 4. Top: 5 × 6 = 30. Bottom: 4 × 6 = 24. Total: 30 + 24 = 54!',
    },
    {
      id: 'l2_setA_3',
      original: { factorA: 8, factorB: 6, splitTarget: 'factorB', splitVal1: 3, splitVal2: 3 },
      topBranch: { num1: 8, num2: 3, product: 24 },
      bottomBranch: { num1: 8, num2: 3, product: 24 },
      total: 48,
      blanks: { topProd: true, botProd: true, total: true },
      hint: '6 is broken into 3 and 3. Top: 8 × 3 = 24. Bottom: 8 × 3 = 24. Total: 24 + 24 = 48!',
    },
    {
      id: 'l2_setA_4',
      original: { factorA: 6, factorB: 7, splitTarget: 'factorB', splitVal1: 5, splitVal2: 2 },
      topBranch: { num1: 6, num2: 5, product: 30 },
      bottomBranch: { num1: 6, num2: 2, product: 12 },
      total: 42,
      blanks: { topProd: true, botProd: true, total: true },
      hint: '7 is broken into 5 and 2. Top: 6 × 5 = 30. Bottom: 6 × 2 = 12. Total: 30 + 12 = 42!',
    },
    {
      id: 'l2_setA_5',
      original: { factorA: 9, factorB: 9, splitTarget: 'factorA', splitVal1: 5, splitVal2: 4 },
      topBranch: { num1: 5, num2: 9, product: 45 },
      bottomBranch: { num1: 4, num2: 9, product: 36 },
      total: 81,
      blanks: { topProd: true, botProd: true, total: true },
      hint: '9 is broken into 5 and 4. Top: 5 × 9 = 45. Bottom: 4 × 9 = 36. Total: 45 + 36 = 81!',
    },
    {
      id: 'l2_setA_6',
      original: { factorA: 7, factorB: 7, splitTarget: 'factorA', splitVal1: 4, splitVal2: 3 },
      topBranch: { num1: 4, num2: 7, product: 28 },
      bottomBranch: { num1: 3, num2: 7, product: 21 },
      total: 49,
      blanks: { topProd: true, botProd: true, total: true },
      hint: '7 is broken into 4 and 3. Top: 4 × 7 = 28. Bottom: 3 × 7 = 21. Total: 28 + 21 = 49!',
    },
  ];

  const [setAValues, setSetAValues] = useState<{ [probId: string]: { [field: string]: string } }>({
    l2_setA_1: {},
    l2_setA_2: {},
    l2_setA_3: {},
    l2_setA_4: {},
    l2_setA_5: {},
    l2_setA_6: {},
  });
  const [setAChecked, setSetAChecked] = useState(false);

  const handleSetAFieldChange = (probId: string, field: string, val: string) => {
    setSetAValues(prev => ({
      ...prev,
      [probId]: {
        ...(prev[probId] || {}),
        [field]: val,
      },
    }));
  };

  const handleSetACorrectField = (probId: string, field: string) => {
    soundEffects.pop();
    const current = setAValues[probId] || {};
    const prob = setAProblems.find(p => p.id === probId);
    if (!prob) return;

    const isTopOk = parseInt((field === 'topProd' ? '' : current.topProd) || '', 10) === prob.topBranch.product || field === 'topProd';
    const isBotOk = parseInt((field === 'botProd' ? '' : current.botProd) || '', 10) === prob.bottomBranch.product || field === 'botProd';
    const isTotOk = parseInt((field === 'total' ? '' : current.total) || '', 10) === prob.total || field === 'total';

    if (isTopOk && isBotOk && isTotOk) {
      saveCh1CompletedQuestion(probId);
      onQuestionSolved(probId);
    }
  };

  const checkSetA = () => {
    setSetAChecked(true);
    let allOk = true;

    setAProblems.forEach(p => {
      const v = setAValues[p.id] || {};
      const topOk = parseInt((v.topProd || '').trim(), 10) === p.topBranch.product;
      const botOk = parseInt((v.botProd || '').trim(), 10) === p.bottomBranch.product;
      const totOk = parseInt((v.total || '').trim(), 10) === p.total;
      if (!topOk || !botOk || !totOk) {
        allOk = false;
      }
    });

    if (allOk) {
      soundEffects.fanfare();
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      onUpdateRecord({ ...record, stars: record.stars + 6 });
    } else {
      soundEffects.wrong();
    }
  };

  // ===================== SET B: Fill-in-the-Blank Distributive Equations (6) =====================
  // 1. (4 x 3) + (4 x 5) = 4 x [ 8 ]
  // 2. (6 x 5) + (6 x 2) = 6 x [ 7 ]
  // 3. (8 x 4) + (8 x 4) = 8 x [ 8 ]
  // 4. (9 x 2) + (9 x 5) = 9 x [ 7 ]
  // 5. 5 x 9 = (5 x 4) + (5 x [ 5 ])
  // 6. 7 x 6 = (7 x [ 3 ]) + (7 x 3)
  const setBQuestions = [
    { id: 'l2_setB_1', lead: '(4 × 3) + (4 × 5) = 4 ×', expected: 8, hint: 'Combine the multipliers: 3 + 5 = 8!' },
    { id: 'l2_setB_2', lead: '(6 × 5) + (6 × 2) = 6 ×', expected: 7, hint: 'Combine the multipliers: 5 + 2 = 7!' },
    { id: 'l2_setB_3', lead: '(8 × 4) + (8 × 4) = 8 ×', expected: 8, hint: 'Combine the multipliers: 4 + 4 = 8!' },
    { id: 'l2_setB_4', lead: '(9 × 2) + (9 × 5) = 9 ×', expected: 7, hint: 'Combine the multipliers: 2 + 5 = 7!' },
    { id: 'l2_setB_5', lead: '5 × 9 = (5 × 4) + (5 ×', expected: 5, suffix: ')', hint: '9 was split into 4 and what number? 9 - 4 = 5!' },
    { id: 'l2_setB_6', lead: '7 × 6 = (7 ×', expected: 3, suffix: ') + (7 × 3)', hint: '6 was split into what number and 3? 6 - 3 = 3!' },
  ];

  const [setBInputs, setSetBInputs] = useState<{ [key: string]: string }>({});
  const [setBChecked, setSetBChecked] = useState(false);
  const [setBHints, setSetBHints] = useState<{ [key: string]: boolean }>({});

  const setBRefs: { [key: string]: React.RefObject<HTMLInputElement | null> } = {
    l2_setB_1: useRef<HTMLInputElement>(null),
    l2_setB_2: useRef<HTMLInputElement>(null),
    l2_setB_3: useRef<HTMLInputElement>(null),
    l2_setB_4: useRef<HTMLInputElement>(null),
    l2_setB_5: useRef<HTMLInputElement>(null),
    l2_setB_6: useRef<HTMLInputElement>(null),
  };

  const handleSetBChange = (id: string, val: string, nextId?: string) => {
    setSetBInputs(prev => ({ ...prev, [id]: val }));
    const q = setBQuestions.find(item => item.id === id);
    if (q && parseInt(val.trim(), 10) === q.expected) {
      soundEffects.pop();
      saveCh1CompletedQuestion(id);
      onQuestionSolved(id);
      if (nextId && setBRefs[nextId]?.current) {
        setTimeout(() => setBRefs[nextId].current?.focus(), 150);
      }
    }
  };

  const checkSetB = () => {
    setSetBChecked(true);
    const allCorrect = setBQuestions.every(
      q => parseInt((setBInputs[q.id] || '').trim(), 10) === q.expected
    );
    if (allCorrect) {
      soundEffects.fanfare();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onUpdateRecord({ ...record, stars: record.stars + 4 });
    } else {
      soundEffects.wrong();
    }
  };

  // ===================== SET C: Custom Breakdown Challenge (Free Choice Mode) =====================
  // Problem: "Solve 8 x 7"
  // Student can pick how to break 7 (e.g. 5+2 or 4+3 or 6+1).
  // Automatically evaluate both sub-multiplications and sum up final product (56).
  const challengeProblems = [
    { factorA: 8, factorB: 7, presets: [{ p1: 5, p2: 2 }, { p1: 4, p2: 3 }, { p1: 6, p2: 1 }] },
    { factorA: 9, factorB: 8, presets: [{ p1: 5, p2: 3 }, { p1: 4, p2: 4 }, { p1: 6, p2: 2 }] },
    { factorA: 6, factorB: 8, presets: [{ p1: 5, p2: 3 }, { p1: 4, p2: 4 }, { p1: 6, p2: 2 }] },
    { factorA: 7, factorB: 6, presets: [{ p1: 5, p2: 1 }, { p1: 3, p2: 3 }, { p1: 4, p2: 2 }] },
  ];

  const [selectedChallengeIdx, setSelectedChallengeIdx] = useState(0);
  const currentChallenge = challengeProblems[selectedChallengeIdx];

  const [customSplit, setCustomSplit] = useState<{ part1: number; part2: number }>({
    part1: currentChallenge.presets[0].p1,
    part2: currentChallenge.presets[0].p2,
  });

  const [customInputs, setCustomInputs] = useState<{ topProd: string; botProd: string; total: string }>({
    topProd: '',
    botProd: '',
    total: '',
  });
  const [customChecked, setCustomChecked] = useState(false);
  const [customSolved, setCustomSolved] = useState(false);

  // When changing challenge, reset inputs
  const handleSelectChallenge = (idx: number) => {
    soundEffects.pop();
    setSelectedChallengeIdx(idx);
    const prob = challengeProblems[idx];
    setCustomSplit({ part1: prob.presets[0].p1, part2: prob.presets[0].p2 });
    setCustomInputs({ topProd: '', botProd: '', total: '' });
    setCustomChecked(false);
    setCustomSolved(false);
  };

  const handleSelectPreset = (p1: number, p2: number) => {
    soundEffects.pop();
    setCustomSplit({ part1: p1, part2: p2 });
    setCustomInputs({ topProd: '', botProd: '', total: '' });
    setCustomChecked(false);
    setCustomSolved(false);
  };

  const expectedTop = currentChallenge.factorA * customSplit.part1;
  const expectedBot = currentChallenge.factorA * customSplit.part2;
  const expectedTotal = currentChallenge.factorA * currentChallenge.factorB;

  const handleCustomCheck = () => {
    setCustomChecked(true);
    const topOk = parseInt(customInputs.topProd.trim(), 10) === expectedTop;
    const botOk = parseInt(customInputs.botProd.trim(), 10) === expectedBot;
    const totOk = parseInt(customInputs.total.trim(), 10) === expectedTotal;

    if (topOk && botOk && totOk) {
      soundEffects.fanfare();
      setCustomSolved(true);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      saveCh1CompletedQuestion(`l2_custom_${currentChallenge.factorA}x${currentChallenge.factorB}`);
      onQuestionSolved(`l2_custom_${currentChallenge.factorA}x${currentChallenge.factorB}`);
      onUpdateRecord({ ...record, stars: record.stars + 3 });
    } else {
      soundEffects.wrong();
    }
  };

  return (
    <div className="space-y-6">
      {/* Set Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border-2 border-amber-200">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              soundEffects.pop();
              setActiveSubTab('setA');
            }}
            className={`px-4 py-2 rounded-xl font-fun font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'setA'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Split className="w-4 h-4" />
            <span>SET A: Branching Trees (6)</span>
          </button>

          <button
            onClick={() => {
              soundEffects.pop();
              setActiveSubTab('setB');
            }}
            className={`px-4 py-2 rounded-xl font-fun font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'setB'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <span>SET B: Distributive Equations (6)</span>
          </button>

          <button
            onClick={() => {
              soundEffects.pop();
              setActiveSubTab('setC');
            }}
            className={`px-4 py-2 rounded-xl font-fun font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'setC'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Shuffle className="w-4 h-4" />
            <span>SET C: Free Choice Breakdown</span>
          </button>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
          Grade 3 Distributive Mastery
        </span>
      </div>

      {/* ===================== SET A ===================== */}
      {activeSubTab === 'setA' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
            <div>
              <h3 className="font-fun font-bold text-base sm:text-lg text-amber-950">
                SET A: Decomposing Multiplier / Multiplicand (Branching Diagrams)
              </h3>
              <p className="text-xs text-amber-800">
                Calculate each branch's sub-multiplication, then add both branches together to find the final product!
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-600 text-white px-2.5 py-1 rounded-full">
              6 Practice Trees
            </span>
          </div>

          <div className="space-y-6">
            {setAProblems.map((prob, idx) => (
              <div key={prob.id} className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <span className="font-fun font-bold text-sm text-slate-700">
                    Tree #{idx + 1}: Solve {prob.original.factorA} × {prob.original.factorB} by breaking {prob.original.splitTarget === 'factorA' ? prob.original.factorA : prob.original.factorB} into ({prob.original.splitVal1} + {prob.original.splitVal2})
                  </span>
                </div>
                <BranchingTreeDiagram
                  problem={prob}
                  values={setAValues[prob.id] || {}}
                  onChange={(field, val) => handleSetAFieldChange(prob.id, field, val)}
                  onCorrectField={field => handleSetACorrectField(prob.id, field)}
                  isCheckAttempted={setAChecked}
                  containerBg="bg-white"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setSetAValues({
                  l2_setA_1: {},
                  l2_setA_2: {},
                  l2_setA_3: {},
                  l2_setA_4: {},
                  l2_setA_5: {},
                  l2_setA_6: {},
                });
                setSetAChecked(false);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All 6 Trees</span>
            </button>

            <button
              onClick={checkSetA}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-fun font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>Check Set A Trees</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================== SET B ===================== */}
      {activeSubTab === 'setB' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
            <div>
              <h3 className="font-fun font-bold text-base sm:text-lg text-amber-950">
                SET B: Fill-in-the-Blank Distributive Equations
              </h3>
              <p className="text-xs text-amber-800">
                Match the combined multiplication sentence with its decomposed parentheses format!
              </p>
            </div>
            <span className="text-xs font-bold bg-amber-600 text-white px-2.5 py-1 rounded-full">
              6 Questions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {setBQuestions.map((q, idx) => {
              const typed = setBInputs[q.id] || '';
              const isCorrect = parseInt(typed.trim(), 10) === q.expected;
              const nextId = idx + 1 < setBQuestions.length ? setBQuestions[idx + 1].id : undefined;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    isCorrect
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : setBChecked
                      ? 'bg-rose-50/60 border-rose-300'
                      : 'bg-white border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      #{idx + 1}
                    </span>
                    <button
                      onClick={() => setSetBHints(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{setBHints[q.id] ? 'Hide' : 'Hint'}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 font-fun font-bold text-base sm:text-lg text-slate-900">
                    <span>{q.lead}</span>
                    <input
                      ref={setBRefs[q.id]}
                      type="number"
                      value={typed}
                      onChange={e => handleSetBChange(q.id, e.target.value, nextId)}
                      placeholder="?"
                      className={`w-14 h-11 text-center font-fun font-black text-xl rounded-xl border-2 transition-all outline-hidden ${
                        isCorrect
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300'
                          : setBChecked && !isCorrect
                          ? 'bg-rose-50 border-rose-400 text-rose-800'
                          : 'bg-white border-amber-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200'
                      }`}
                    />
                    {q.suffix && <span>{q.suffix}</span>}
                  </div>

                  {setBHints[q.id] && (
                    <div className="mt-2 text-xs font-medium text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 animate-fadeIn">
                      💡 {q.hint}
                    </div>
                  )}

                  {setBChecked && !isCorrect && (
                    <div className="mt-2 text-2xs font-bold text-rose-700 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                      Correct: [{q.expected}] — {q.hint}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setSetBInputs({});
                setSetBChecked(false);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Set B</span>
            </button>

            <button
              onClick={checkSetB}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-fun font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>Check Set B (6 Equations)</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================== SET C: Custom Breakdown Challenge (Free Choice Mode) ===================== */}
      {activeSubTab === 'setC' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-amber-500/5 border border-amber-200">
            <h3 className="font-fun font-bold text-base sm:text-lg text-amber-950 flex items-center gap-2">
              <Shuffle className="w-5 h-5 text-amber-600" />
              <span>SET C: Custom Breakdown Challenge (Free Choice Mode)</span>
            </h3>
            <p className="text-xs text-amber-800 mt-1">
              Pick your own way to break up the multiplier! See for yourself that no matter how you split the number,
              adding the two sub-multiplications always yields the exact same total!
            </p>
          </div>

          {/* Problem Selector Bar */}
          <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Problem:
              </span>
              <div className="flex flex-wrap gap-2">
                {challengeProblems.map((prob, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSelectChallenge(pIdx)}
                    className={`px-3 py-1.5 rounded-xl font-fun font-bold text-sm transition-all cursor-pointer ${
                      selectedChallengeIdx === pIdx
                        ? 'bg-amber-500 text-white shadow-xs scale-105'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {prob.factorA} × {prob.factorB}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs font-fun font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
              Solving: {currentChallenge.factorA} × {currentChallenge.factorB}
            </span>
          </div>

          {/* Breakdown Presets & Custom Pick */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-fun font-bold text-xs uppercase tracking-wider text-amber-900">
                Choose how to break {currentChallenge.factorB}:
              </span>
              <span className="text-xs text-slate-500">
                Current Split: ({customSplit.part1} + {customSplit.part2})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {currentChallenge.presets.map((preset, prIdx) => {
                const isSelected = customSplit.part1 === preset.p1 && customSplit.part2 === preset.p2;
                return (
                  <button
                    key={prIdx}
                    onClick={() => handleSelectPreset(preset.p1, preset.p2)}
                    className={`px-4 py-2 rounded-xl font-fun font-bold text-sm transition-all cursor-pointer border-2 ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-700 shadow-md'
                        : 'bg-white text-slate-800 border-amber-200 hover:bg-amber-100/50'
                    }`}
                  >
                    Break into {preset.p1} + {preset.p2}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Live Tree Diagram for Chosen Split */}
          <div className="bg-white p-5 rounded-3xl border-2 border-amber-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧩</span>
                <span className="font-fun font-bold text-slate-800 text-sm sm:text-base">
                  Decomposition Tree: {currentChallenge.factorA} × ({customSplit.part1} + {customSplit.part2})
                </span>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                Free Choice Mode
              </span>
            </div>

            {/* Tree Branches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top Branch */}
              <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 space-y-2">
                <span className="text-xs font-bold uppercase text-sky-800 bg-sky-200 px-2 py-0.5 rounded-md">
                  Branch 1:
                </span>
                <div className="flex items-center gap-2 font-fun font-black text-xl text-sky-950">
                  <span>{currentChallenge.factorA} × {customSplit.part1} =</span>
                  <input
                    type="number"
                    value={customInputs.topProd}
                    onChange={e => setCustomInputs(prev => ({ ...prev, topProd: e.target.value }))}
                    placeholder="?"
                    className={`w-20 h-11 text-center rounded-xl border-2 font-fun font-black text-xl outline-hidden ${
                      parseInt(customInputs.topProd.trim(), 10) === expectedTop
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                        : customChecked
                        ? 'bg-rose-50 border-rose-400 text-rose-800'
                        : 'bg-white border-sky-300 focus:border-sky-500'
                    }`}
                  />
                </div>
                {customChecked && parseInt(customInputs.topProd.trim(), 10) !== expectedTop && (
                  <span className="text-xs font-bold text-rose-600 block">
                    💡 Hint: Check {currentChallenge.factorA} × {customSplit.part1} = ?
                  </span>
                )}
              </div>

              {/* Bottom Branch */}
              <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 space-y-2">
                <span className="text-xs font-bold uppercase text-indigo-800 bg-indigo-200 px-2 py-0.5 rounded-md">
                  Branch 2:
                </span>
                <div className="flex items-center gap-2 font-fun font-black text-xl text-indigo-950">
                  <span>{currentChallenge.factorA} × {customSplit.part2} =</span>
                  <input
                    type="number"
                    value={customInputs.botProd}
                    onChange={e => setCustomInputs(prev => ({ ...prev, botProd: e.target.value }))}
                    placeholder="?"
                    className={`w-20 h-11 text-center rounded-xl border-2 font-fun font-black text-xl outline-hidden ${
                      parseInt(customInputs.botProd.trim(), 10) === expectedBot
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                        : customChecked
                        ? 'bg-rose-50 border-rose-400 text-rose-800'
                        : 'bg-white border-indigo-300 focus:border-indigo-500'
                    }`}
                  />
                </div>
                {customChecked && parseInt(customInputs.botProd.trim(), 10) !== expectedBot && (
                  <span className="text-xs font-bold text-rose-600 block">
                    💡 Hint: Check {currentChallenge.factorA} × {customSplit.part2} = ?
                  </span>
                )}
              </div>
            </div>

            {/* Total Sum Row */}
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-fun font-bold text-sm text-amber-950">
                  Sum both branch products:
                </span>
                <p className="text-xs text-slate-500">
                  ({expectedTop} + {expectedBot}) = Grand Total
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-fun font-black text-lg text-slate-900">Total:</span>
                <input
                  type="number"
                  value={customInputs.total}
                  onChange={e => setCustomInputs(prev => ({ ...prev, total: e.target.value }))}
                  placeholder="Total"
                  className={`w-24 h-12 text-center rounded-xl border-2 font-fun font-black text-2xl outline-hidden ${
                    parseInt(customInputs.total.trim(), 10) === expectedTotal
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300'
                      : customChecked
                      ? 'bg-rose-50 border-rose-400 text-rose-800'
                      : 'bg-white border-amber-400 focus:border-amber-600'
                  }`}
                />
              </div>
            </div>

            {/* Success Celebration Callout */}
            {customSolved && (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 space-y-1 animate-fadeIn">
                <div className="flex items-center gap-2 font-fun font-bold text-base">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>Mastery Proof Unlocked!</span>
                </div>
                <p className="text-xs leading-relaxed">
                  Notice that {currentChallenge.factorA} × {currentChallenge.factorB} is ALWAYS {expectedTotal},
                  even when broken into ({customSplit.part1} + {customSplit.part2})! Try another preset above to confirm!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setCustomInputs({ topProd: '', botProd: '', total: '' });
                  setCustomChecked(false);
                  setCustomSolved(false);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Inputs</span>
              </button>

              <button
                onClick={handleCustomCheck}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-fun font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <span>Evaluate Custom Breakdown</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
