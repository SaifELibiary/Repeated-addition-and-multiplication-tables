import React, { useState, useRef } from 'react';
import { TeacherSettings, HighScoreRecord } from '../types';
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
  Award,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Chapter1Lesson1ExpandedPracticeProps {
  settings: TeacherSettings;
  record: HighScoreRecord;
  onUpdateRecord: (updated: HighScoreRecord) => void;
  onQuestionSolved: (qid: string) => void;
}

export const Chapter1Lesson1ExpandedPractice: React.FC<Chapter1Lesson1ExpandedPracticeProps> = ({
  settings,
  record,
  onUpdateRecord,
  onQuestionSolved,
}) => {
  const [activeSet, setActiveSet] = useState<'setA' | 'setB' | 'setC'>('setA');

  // =================== SET A: Fill-in-the-Blank (10 Questions) ===================
  const setAQuestions = [
    { id: 'setA_1', prefix: '3 × 6 is', expected: 3, suffix: 'more than 3 × 5.', hint: 'Multiplicand is 3. Since 6 is 1 more than 5, it is 3 more!' },
    { id: 'setA_2', prefix: '6 × 8 is', expected: 6, suffix: 'less than 6 × 9.', hint: 'Multiplicand is 6. Since 8 is 1 less than 9, it is 6 less!' },
    { id: 'setA_3', prefix: '8 × 4 = 8 × 5 -', expected: 8, suffix: '', hint: 'Multiplier went down from 5 to 4 (-1), so subtract 8!' },
    { id: 'setA_4', prefix: '7 × 6 = 7 × 5 +', expected: 7, suffix: '', hint: 'Multiplier went up from 5 to 6 (+1), so add 7!' },
    { id: 'setA_5', prefix: '9 × 4 = 9 × 3 +', expected: 9, suffix: '', hint: 'Multiplier went up from 3 to 4 (+1), so add 9!' },
    { id: 'setA_6', prefix: '5 × 7 = 5 × 8 -', expected: 5, suffix: '', hint: 'Multiplier went down from 8 to 7 (-1), so subtract 5!' },
    { id: 'setA_7', prefix: '4 × 9 is', expected: 4, suffix: 'more than 4 × 8.', hint: 'Multiplicand is 4. Since 9 is 1 more than 8, it is 4 more!' },
    { id: 'setA_8', prefix: '10 × 5 is', expected: 10, suffix: 'less than 10 × 6.', hint: 'Multiplicand is 10. Since 5 is 1 less than 6, it is 10 less!' },
    { id: 'setA_9', prefix: '2 × 9 = 2 × 10 -', expected: 2, suffix: '', hint: 'Multiplier went down from 10 to 9 (-1), so subtract 2!' },
    { id: 'setA_10', prefix: '8 × 7 = 8 × 6 +', expected: 8, suffix: '', hint: 'Multiplier went up from 6 to 7 (+1), so add 8!' },
  ];

  const [setAInputs, setSetAInputs] = useState<{ [key: string]: string }>({});
  const [setAChecked, setSetAChecked] = useState(false);
  const [setAHints, setSetAHints] = useState<{ [key: string]: boolean }>({});

  const setARefs: { [key: string]: React.RefObject<HTMLInputElement | null> } = {
    setA_1: useRef<HTMLInputElement>(null),
    setA_2: useRef<HTMLInputElement>(null),
    setA_3: useRef<HTMLInputElement>(null),
    setA_4: useRef<HTMLInputElement>(null),
    setA_5: useRef<HTMLInputElement>(null),
    setA_6: useRef<HTMLInputElement>(null),
    setA_7: useRef<HTMLInputElement>(null),
    setA_8: useRef<HTMLInputElement>(null),
    setA_9: useRef<HTMLInputElement>(null),
    setA_10: useRef<HTMLInputElement>(null),
  };

  // =================== SET B: Commutative Property (8 Questions) ===================
  // 1. 8 x 3 = [ 3 ] x 8
  // 2. 5 x 9 = 9 x [ 5 ]
  // 3. 7 x 4 = [ 4 ] x 7
  // 4. 6 x 2 = 2 x [ 6 ]
  // 5. 10 x 8 = [ 8 ] x 10
  // 6. [ 9 ] x 6 = 6 x 9
  // 7. 4 x [ 5 ] = 5 x 4
  // 8. [ 7 ] x 3 = 3 x 7
  const setBQuestions = [
    { id: 'setB_1', lead: '8 × 3 =', blankFirst: true, mid: '× 8', expected: 3, hint: 'Order switched: 8 × 3 = 3 × 8!' },
    { id: 'setB_2', lead: '5 × 9 = 9 ×', blankFirst: false, mid: '', expected: 5, hint: 'Order switched: 5 × 9 = 9 × 5!' },
    { id: 'setB_3', lead: '7 × 4 =', blankFirst: true, mid: '× 7', expected: 4, hint: 'Order switched: 7 × 4 = 4 × 7!' },
    { id: 'setB_4', lead: '6 × 2 = 2 ×', blankFirst: false, mid: '', expected: 6, hint: 'Order switched: 6 × 2 = 2 × 6!' },
    { id: 'setB_5', lead: '10 × 8 =', blankFirst: true, mid: '× 10', expected: 8, hint: 'Order switched: 10 × 8 = 8 × 10!' },
    { id: 'setB_6', lead: '', blankFirst: true, mid: '× 6 = 6 × 9', expected: 9, hint: 'Order switched: 9 × 6 = 6 × 9!' },
    { id: 'setB_7', lead: '4 ×', blankFirst: true, mid: '= 5 × 4', expected: 5, hint: 'Order switched: 4 × 5 = 5 × 4!' },
    { id: 'setB_8', lead: '', blankFirst: true, mid: '× 3 = 3 × 7', expected: 7, hint: 'Order switched: 7 × 3 = 3 × 7!' },
  ];

  const [setBInputs, setSetBInputs] = useState<{ [key: string]: string }>({});
  const [setBChecked, setSetBChecked] = useState(false);
  const [setBHints, setSetBHints] = useState<{ [key: string]: boolean }>({});

  const setBRefs: { [key: string]: React.RefObject<HTMLInputElement | null> } = {
    setB_1: useRef<HTMLInputElement>(null),
    setB_2: useRef<HTMLInputElement>(null),
    setB_3: useRef<HTMLInputElement>(null),
    setB_4: useRef<HTMLInputElement>(null),
    setB_5: useRef<HTMLInputElement>(null),
    setB_6: useRef<HTMLInputElement>(null),
    setB_7: useRef<HTMLInputElement>(null),
    setB_8: useRef<HTMLInputElement>(null),
  };

  // =================== SET C: Multiple Choice Questions (4 Questions) ===================
  const setCQuestions = [
    {
      id: 'setC_1',
      question: 'Which expression is equal to 6 × 7?',
      options: ['6 × 6 + 1', '6 × 6 + 6', '6 × 8 + 6', '7 × 7'],
      correct: '6 × 6 + 6',
      hint: '6 × 7 is one more group of 6 than 6 × 6!',
      explanation: '6 × 7 means 7 groups of 6. Since 6 × 6 is 6 groups of 6, adding 6 gives 7 groups of 6 (42)!',
    },
    {
      id: 'setC_2',
      question: 'If 5 × 6 = 30, then 5 × 7 is:',
      options: ['30 + 5', '30 + 6', '30 - 5', '30 × 7'],
      correct: '30 + 5',
      hint: 'The multiplier went up by 1, so add one more 5!',
      explanation: '5 × 7 has one more group of 5 than 5 × 6. So 30 + 5 = 35.',
    },
    {
      id: 'setC_3',
      question: 'Which equation shows the Commutative Property?',
      options: ['4 × 5 = 20', '4 × 5 = 5 × 4', '4 × 5 = 4 × 4 + 4'],
      correct: '4 × 5 = 5 × 4',
      hint: 'Commutative property means swapping the order of the two factors!',
      explanation: '4 × 5 = 5 × 4 states that switching factor order does not change the product.',
    },
    {
      id: 'setC_4',
      question: '7 × 9 is ____ less than 7 × 10.',
      options: ['1', '9', '7', '10'],
      correct: '7',
      hint: 'The multiplier decreased by 1, so the answer is 1 group of 7 less!',
      explanation: '7 × 10 = 70 and 7 × 9 = 63. 70 - 63 = 7 (the multiplicand).',
    },
  ];

  const [setCChoices, setSetCChoices] = useState<{ [key: string]: string }>({});
  const [setCChecked, setSetCChecked] = useState(false);
  const [setCHints, setSetCHints] = useState<{ [key: string]: boolean }>({});

  // Handlers for Set A
  const handleSetAChange = (id: string, val: string, nextId?: string) => {
    setSetAInputs(prev => ({ ...prev, [id]: val }));
    const item = setAQuestions.find(q => q.id === id);
    if (item && parseInt(val.trim(), 10) === item.expected) {
      soundEffects.pop();
      saveCh1CompletedQuestion(id);
      onQuestionSolved(id);
      if (nextId && setARefs[nextId]?.current) {
        setTimeout(() => setARefs[nextId].current?.focus(), 150);
      }
    }
  };

  const checkSetA = () => {
    setSetAChecked(true);
    const allCorrect = setAQuestions.every(
      q => parseInt((setAInputs[q.id] || '').trim(), 10) === q.expected
    );
    if (allCorrect) {
      soundEffects.fanfare();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onUpdateRecord({ ...record, stars: record.stars + 5 });
    } else {
      soundEffects.wrong();
    }
  };

  // Handlers for Set B
  const handleSetBChange = (id: string, val: string, nextId?: string) => {
    setSetBInputs(prev => ({ ...prev, [id]: val }));
    const item = setBQuestions.find(q => q.id === id);
    if (item && parseInt(val.trim(), 10) === item.expected) {
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

  // Handlers for Set C
  const handleSetCChoice = (id: string, opt: string) => {
    soundEffects.pop();
    setSetCChoices(prev => ({ ...prev, [id]: opt }));
    const item = setCQuestions.find(q => q.id === id);
    if (item && opt === item.correct) {
      saveCh1CompletedQuestion(id);
      onQuestionSolved(id);
    }
  };

  const checkSetC = () => {
    setSetCChecked(true);
    const allCorrect = setCQuestions.every(q => setCChoices[q.id] === q.correct);
    if (allCorrect) {
      soundEffects.fanfare();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onUpdateRecord({ ...record, stars: record.stars + 3 });
    } else {
      soundEffects.wrong();
    }
  };

  return (
    <div className="space-y-6">
      {/* Set Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border-2 border-blue-200">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              soundEffects.pop();
              setActiveSet('setA');
            }}
            className={`px-4 py-2 rounded-xl font-fun font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSet === 'setA'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            <span>SET A: Missing Numbers (10)</span>
          </button>

          <button
            onClick={() => {
              soundEffects.pop();
              setActiveSet('setB');
            }}
            className={`px-4 py-2 rounded-xl font-fun font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSet === 'setB'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            <span>SET B: Commutative Order (8)</span>
          </button>

          <button
            onClick={() => {
              soundEffects.pop();
              setActiveSet('setC');
            }}
            className={`px-4 py-2 rounded-xl font-fun font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSet === 'setC'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            <span>SET C: Multiple Choice (4)</span>
          </button>
        </div>

        <span className="text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
          Strict Textbook Grade 3 Format
        </span>
      </div>

      {/* ===================== SET A ===================== */}
      {activeSet === 'setA' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
            <div>
              <h3 className="font-fun font-bold text-base sm:text-lg text-blue-950">
                SET A: Fill in the Missing Numbers (Increasing / Decreasing Rules)
              </h3>
              <p className="text-xs text-blue-800">
                Determine how much more or less the product is, or what number was added/subtracted to adjust the nearby fact!
              </p>
            </div>
            <span className="text-xs font-bold bg-blue-600 text-white px-2.5 py-1 rounded-full">
              10 Questions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {setAQuestions.map((q, idx) => {
              const typed = setAInputs[q.id] || '';
              const isCorrect = parseInt(typed.trim(), 10) === q.expected;
              const nextId = idx + 1 < setAQuestions.length ? setAQuestions[idx + 1].id : undefined;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    isCorrect
                      ? 'bg-emerald-50/70 border-emerald-300'
                      : setAChecked
                      ? 'bg-rose-50/60 border-rose-300'
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      #{idx + 1}
                    </span>
                    <button
                      onClick={() => setSetAHints(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{setAHints[q.id] ? 'Hide' : 'Hint'}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 font-fun font-bold text-base sm:text-lg text-slate-900">
                    <span>{q.prefix}</span>
                    <input
                      ref={setARefs[q.id]}
                      type="number"
                      value={typed}
                      onChange={e => handleSetAChange(q.id, e.target.value, nextId)}
                      placeholder="?"
                      className={`w-14 h-11 text-center font-fun font-black text-xl rounded-xl border-2 transition-all outline-hidden ${
                        isCorrect
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-800 ring-2 ring-emerald-300'
                          : setAChecked && !isCorrect
                          ? 'bg-rose-50 border-rose-400 text-rose-800'
                          : 'bg-white border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200'
                      }`}
                    />
                    {q.suffix && <span>{q.suffix}</span>}
                  </div>

                  {setAHints[q.id] && (
                    <div className="mt-2 text-xs font-medium text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 animate-fadeIn">
                      💡 {q.hint}
                    </div>
                  )}

                  {setAChecked && !isCorrect && (
                    <div className="mt-2 text-2xs font-bold text-rose-700 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                      Correct Answer: [{q.expected}] — {q.hint}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setSetAInputs({});
                setSetAChecked(false);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Set A</span>
            </button>

            <button
              onClick={checkSetA}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-fun font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>Check Set A (10 Questions)</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================== SET B ===================== */}
      {activeSet === 'setB' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between">
            <div>
              <h3 className="font-fun font-bold text-base sm:text-lg text-indigo-950">
                SET B: Commutative Property (Switching Order)
              </h3>
              <p className="text-xs text-indigo-800">
                Fill in the box so both sides of the equation balance using the rule: factor A × factor B = factor B × factor A!
              </p>
            </div>
            <span className="text-xs font-bold bg-indigo-600 text-white px-2.5 py-1 rounded-full">
              8 Questions
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
                      : 'bg-white border-slate-200 hover:border-indigo-300'
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
                    {q.lead && <span>{q.lead}</span>}
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
                          : 'bg-white border-indigo-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200'
                      }`}
                    />
                    {q.mid && <span>{q.mid}</span>}
                  </div>

                  {setBHints[q.id] && (
                    <div className="mt-2 text-xs font-medium text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 animate-fadeIn">
                      💡 {q.hint}
                    </div>
                  )}

                  {setBChecked && !isCorrect && (
                    <div className="mt-2 text-2xs font-bold text-rose-700 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                      Correct Answer: [{q.expected}] — {q.hint}
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-fun font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>Check Set B (8 Questions)</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================== SET C ===================== */}
      {activeSet === 'setC' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 flex items-center justify-between">
            <div>
              <h3 className="font-fun font-bold text-base sm:text-lg text-sky-950">
                SET C: Multiple Choice Questions (Textbook Review Style)
              </h3>
              <p className="text-xs text-sky-800">
                Choose the best answer demonstrating properties of multiplication and mathematical reasoning!
              </p>
            </div>
            <span className="text-xs font-bold bg-sky-600 text-white px-2.5 py-1 rounded-full">
              4 Questions
            </span>
          </div>

          <div className="space-y-4">
            {setCQuestions.map((q, idx) => {
              const chosen = setCChoices[q.id];
              const isCorrect = chosen === q.correct;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-3xl border-2 transition-all ${
                    isCorrect
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : setCChecked && chosen
                      ? 'bg-rose-50/60 border-rose-300'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                      Question #{idx + 1}
                    </span>
                    <button
                      onClick={() => setSetCHints(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{setCHints[q.id] ? 'Hide' : 'Hint'}</span>
                    </button>
                  </div>

                  <h4 className="font-fun font-bold text-base sm:text-lg text-slate-900 mb-3">
                    "{q.question}"
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = chosen === opt;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSetCChoice(q.id, opt)}
                          className={`p-3.5 rounded-2xl font-fun font-bold text-sm text-left border-2 transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-700 shadow-xs scale-101'
                              : 'bg-slate-50/80 text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-blue-50/40'
                          }`}
                        >
                          <span>{opt}</span>
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                            isSelected ? 'bg-white text-blue-700 border-white' : 'border-slate-300 text-slate-500'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {setCHints[q.id] && (
                    <div className="mt-3 text-xs font-medium text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 animate-fadeIn">
                      💡 {q.hint}
                    </div>
                  )}

                  {setCChecked && (
                    <div className={`mt-3 p-2.5 rounded-xl text-xs font-medium ${
                      isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                    }`}>
                      {isCorrect ? '✅ Correct! ' : `❌ Correct answer was: ${q.correct}. `}
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setSetCChoices({});
                setSetCChecked(false);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Set C</span>
            </button>

            <button
              onClick={checkSetC}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-fun font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <span>Check Set C (4 Questions)</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
