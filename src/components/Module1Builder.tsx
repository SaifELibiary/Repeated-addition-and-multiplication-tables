import React, { useState } from 'react';
import { ContainerTheme, ThemeOption, TeacherSettings, HighScoreRecord } from '../types';
import { MrSaifGuide } from './MrSaifGuide';
import { soundEffects, speakText } from '../utils/audio';
import { Sparkles, Grid, Layers, CheckCircle2, RotateCcw, ArrowRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Module1BuilderProps {
  settings: TeacherSettings;
  record: HighScoreRecord;
  onUpdateRecord: (updated: HighScoreRecord) => void;
  onNavigateToModule2: () => void;
}

const THEMES: ThemeOption[] = [
  {
    id: 'apples',
    name: 'Baskets & Apples',
    containerName: 'Basket',
    itemName: 'Apple',
    itemPlural: 'apples',
    itemEmoji: '🍎',
    containerEmoji: '🧺',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-300',
  },
  {
    id: 'stars',
    name: 'Boxes & Stars',
    containerName: 'Box',
    itemName: 'Star',
    itemPlural: 'stars',
    itemEmoji: '⭐',
    containerEmoji: '📦',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-300',
  },
  {
    id: 'ducks',
    name: 'Ponds & Ducks',
    containerName: 'Pond',
    itemName: 'Duck',
    itemPlural: 'ducks',
    itemEmoji: '🦆',
    containerEmoji: '🌊',
    bgClass: 'bg-cyan-50',
    borderClass: 'border-cyan-300',
  },
  {
    id: 'cookies',
    name: 'Plates & Cookies',
    containerName: 'Plate',
    itemName: 'Cookie',
    itemPlural: 'cookies',
    itemEmoji: '🍪',
    containerEmoji: '🍽️',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-300',
  },
  {
    id: 'aliens',
    name: 'Pods & Aliens',
    containerName: 'Pod',
    itemName: 'Alien',
    itemPlural: 'aliens',
    itemEmoji: '👾',
    containerEmoji: '🛸',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
  },
];

export const Module1Builder: React.FC<Module1BuilderProps> = ({
  settings,
  record,
  onUpdateRecord,
  onNavigateToModule2,
}) => {
  // Visual Builder State
  const [numGroups, setNumGroups] = useState<number>(3);
  const [itemsPerGroup, setItemsPerGroup] = useState<number>(4);
  const [selectedThemeId, setSelectedThemeId] = useState<ContainerTheme>('apples');
  const [viewMode, setViewMode] = useState<'containers' | 'array'>('containers');

  // Interactive Practice State
  // Practice 1: Convert repeated addition to multiplication (e.g., 5 + 5 + 5 + 5 = [__] × [__])
  const [p1Num, setP1Num] = useState<number>(5);
  const [p1Count, setP1Count] = useState<number>(4);
  const [p1AnsGroups, setP1AnsGroups] = useState<string>('');
  const [p1AnsItems, setP1AnsItems] = useState<string>('');
  const [p1Feedback, setP1Feedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Practice 2: Convert multiplication to repeated addition (e.g., 4 × 3 = [__] + [__] + [__] + [__])
  const [p2Groups, setP2Groups] = useState<number>(4);
  const [p2Items, setP2Items] = useState<number>(3);
  const [p2Inputs, setP2Inputs] = useState<string[]>(['', '', '', '']);
  const [p2Total, setP2Total] = useState<string>('');
  const [p2Feedback, setP2Feedback] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const activeTheme = THEMES.find(t => t.id === selectedThemeId) || THEMES[0];
  const totalItems = numGroups * itemsPerGroup;

  // Generate repeated addition string: e.g. "4 + 4 + 4"
  const repeatedAdditionStr = Array(numGroups).fill(itemsPerGroup).join(' + ');

  // Unlock 'first_step' badge on first interaction
  const unlockFirstStepBadge = () => {
    if (!record.badges.includes('first_step')) {
      const updatedBadges = [...record.badges, 'first_step'];
      onUpdateRecord({
        ...record,
        stars: record.stars + 5,
        badges: updatedBadges,
      });
      soundEffects.fanfare();
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleGroupChange = (groups: number) => {
    soundEffects.pop();
    setNumGroups(groups);
    unlockFirstStepBadge();
  };

  const handleItemsChange = (items: number) => {
    soundEffects.pop();
    setItemsPerGroup(items);
    unlockFirstStepBadge();
  };

  // Practice 1 Checker
  const checkPractice1 = () => {
    const enteredGroups = parseInt(p1AnsGroups.trim(), 10);
    const enteredItems = parseInt(p1AnsItems.trim(), 10);

    // Correct if 4 groups of 5 (or commutative 5 x 4, but standard teaching is [count] × [item] or [item] × [count])
    if (
      (enteredGroups === p1Count && enteredItems === p1Num) ||
      (enteredGroups === p1Num && enteredItems === p1Count)
    ) {
      soundEffects.correct();
      setP1Feedback('correct');
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
      onUpdateRecord({ ...record, stars: record.stars + 2 });
    } else {
      soundEffects.wrong();
      setP1Feedback('wrong');
    }
  };

  // Reset Practice 1 with a new random problem
  const refreshPractice1 = () => {
    soundEffects.pop();
    const newNum = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const newCount = Math.floor(Math.random() * 4) + 2; // 2 to 5
    setP1Num(newNum);
    setP1Count(newCount);
    setP1AnsGroups('');
    setP1AnsItems('');
    setP1Feedback('idle');
  };

  // Practice 2 Checker
  const checkPractice2 = () => {
    const allItemsCorrect = p2Inputs.every(val => parseInt(val.trim(), 10) === p2Items);
    const totalCorrect = parseInt(p2Total.trim(), 10) === p2Groups * p2Items;

    if (allItemsCorrect && totalCorrect) {
      soundEffects.correct();
      setP2Feedback('correct');
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
      onUpdateRecord({
        ...record,
        stars: record.stars + 2,
        badges: record.badges.includes('repeated_hero') ? record.badges : [...record.badges, 'repeated_hero'],
      });
    } else {
      soundEffects.wrong();
      setP2Feedback('wrong');
    }
  };

  // Reset Practice 2 with new random values
  const refreshPractice2 = () => {
    soundEffects.pop();
    const newG = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const newI = Math.floor(Math.random() * 5) + 2; // 2 to 6
    setP2Groups(newG);
    setP2Items(newI);
    setP2Inputs(Array(newG).fill(''));
    setP2Total('');
    setP2Feedback('idle');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-fadeIn">
      {/* Module Title Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
            Module 1 • Grade 3 Concept
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-fun font-black">
            What is Multiplication?
          </h1>
          <p className="text-emerald-50 text-sm md:text-base font-medium max-w-2xl mt-1">
            Multiplication is simply <strong>repeated addition</strong> of equal groups!
            Use the Visual Builder below to see groups, addition sentences, and arrays in action.
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 text-7xl opacity-20 select-none">
          🧺
        </div>
      </div>

      {/* Teacher Mr. Saif's Guide */}
      <MrSaifGuide
        message={`Look closely! When we have ${numGroups} ${activeTheme.containerName.toLowerCase()}s with ${itemsPerGroup} ${activeTheme.itemPlural} in each, we add ${itemsPerGroup} repeatedly: ${repeatedAdditionStr} = ${totalItems}. That is exactly ${numGroups} × ${itemsPerGroup} = ${totalItems}!`}
        hint={`The first number (${numGroups}) tells how many groups. The second number (${itemsPerGroup}) tells how many items in each group!`}
        soundEnabled={settings.soundEnabled}
        speechEnabled={settings.speechEnabled}
      />

      {/* Interactive Visual Builder Card */}
      <div className="rounded-3xl bg-white border-3 border-amber-300 p-6 md:p-8 shadow-sm space-y-6">
        {/* Controls Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-amber-100">
          {/* Number of Groups (1 to 5) */}
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 font-fun">
              1. Number of Groups: <span className="text-amber-600 text-lg">({numGroups})</span>
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => handleGroupChange(n)}
                  className={`w-11 h-11 rounded-2xl font-fun font-black text-lg transition-all border-2 cursor-pointer ${
                    numGroups === n
                      ? 'bg-amber-500 text-white border-amber-600 scale-105 shadow-xs'
                      : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              How many containers ({activeTheme.containerName.toLowerCase()}s)
            </p>
          </div>

          {/* Items per Group (1 to 6) */}
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 font-fun">
              2. Items per Group: <span className="text-sky-600 text-lg">({itemsPerGroup})</span>
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <button
                  key={n}
                  onClick={() => handleItemsChange(n)}
                  className={`w-11 h-11 rounded-2xl font-fun font-black text-lg transition-all border-2 cursor-pointer ${
                    itemsPerGroup === n
                      ? 'bg-sky-500 text-white border-sky-600 scale-105 shadow-xs'
                      : 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              How many {activeTheme.itemPlural} in EACH container
            </p>
          </div>

          {/* Theme Selector & View Toggle */}
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 font-fun">
              3. Theme & Model View:
            </label>
            {/* Theme dropdown buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => {
                    soundEffects.pop();
                    setSelectedThemeId(theme.id);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
                    selectedThemeId === theme.id
                      ? 'bg-slate-800 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                  title={theme.name}
                >
                  <span>{theme.itemEmoji}</span>
                  <span className="hidden sm:inline">{theme.itemName}</span>
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="pt-1 flex gap-2">
              <button
                onClick={() => {
                  soundEffects.pop();
                  setViewMode('containers');
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  viewMode === 'containers'
                    ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Groups View</span>
              </button>

              <button
                onClick={() => {
                  soundEffects.pop();
                  setViewMode('array');
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  viewMode === 'array'
                    ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Array Grid View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Visual Display Area */}
        <div className="min-h-[220px] rounded-3xl bg-amber-50/40 border-2 border-dashed border-amber-300 p-6 flex flex-col items-center justify-center transition-all">
          {viewMode === 'containers' ? (
            /* Containers View (Baskets / Boxes / Ponds) */
            <div className="w-full">
              <div className="text-center text-xs font-bold uppercase tracking-wider text-amber-800 mb-4">
                Showing {numGroups} equal groups of {itemsPerGroup} {activeTheme.itemPlural}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                {Array.from({ length: numGroups }).map((_, groupIdx) => (
                  <div
                    key={groupIdx}
                    className={`relative rounded-3xl border-3 ${activeTheme.borderClass} ${activeTheme.bgClass} p-4 flex flex-col items-center justify-between min-w-[130px] sm:min-w-[150px] shadow-sm transform transition-all duration-300 hover:scale-105`}
                  >
                    {/* Container Header */}
                    <div className="flex items-center gap-1 text-xs font-black text-slate-700 mb-2">
                      <span className="text-lg">{activeTheme.containerEmoji}</span>
                      <span>
                        Group {groupIdx + 1}
                      </span>
                    </div>

                    {/* Items Grid inside container */}
                    <div className="grid grid-cols-3 gap-1.5 my-2 p-2 bg-white/80 rounded-2xl border border-white/60 min-h-[60px] items-center justify-items-center">
                      {Array.from({ length: itemsPerGroup }).map((_, itemIdx) => (
                        <span
                          key={itemIdx}
                          className="text-2xl sm:text-3xl animate-bounce-slow"
                          style={{ animationDelay: `${(groupIdx * 3 + itemIdx) * 0.08}s` }}
                          title={`${activeTheme.itemName} ${itemIdx + 1}`}
                        >
                          {activeTheme.itemEmoji}
                        </span>
                      ))}
                    </div>

                    {/* Label below container */}
                    <div className="text-xs font-bold text-slate-600 bg-white/90 px-2.5 py-0.5 rounded-full mt-1">
                      {itemsPerGroup} {activeTheme.itemPlural}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Array Model Grid View (Rows × Columns) */
            <div className="w-full text-center">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-800 mb-3">
                Array Model: {numGroups} rows × {itemsPerGroup} columns
              </div>

              <div className="inline-block bg-white rounded-3xl border-3 border-purple-200 p-6 shadow-sm">
                <div className="space-y-2.5">
                  {Array.from({ length: numGroups }).map((_, rowIdx) => (
                    <div key={rowIdx} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-purple-700 w-16 text-right">
                        Row {rowIdx + 1}:
                      </span>
                      <div className="flex items-center gap-2 p-1.5 bg-purple-50 rounded-2xl border border-purple-100">
                        {Array.from({ length: itemsPerGroup }).map((_, colIdx) => (
                          <div
                            key={colIdx}
                            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white border-2 border-purple-200 flex items-center justify-center text-xl sm:text-2xl shadow-2xs transform hover:scale-110 transition-transform"
                          >
                            {activeTheme.itemEmoji}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-400">
                        ({itemsPerGroup})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4 Dynamic Mathematical Explanations (The 4 Views) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Grouping View */}
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-center">
            <span className="text-xs font-black uppercase text-amber-700 tracking-wider">
              1. Grouping View
            </span>
            <div className="text-lg md:text-xl font-fun font-black text-amber-900 mt-1">
              {numGroups} groups of {itemsPerGroup}
            </div>
            <p className="text-xs text-amber-700 mt-1">
              {numGroups} {activeTheme.containerName.toLowerCase()}s with {itemsPerGroup} {activeTheme.itemPlural}
            </p>
          </div>

          {/* 2. Repeated Addition */}
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-center">
            <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">
              2. Repeated Addition
            </span>
            <div className="text-lg md:text-xl font-fun font-black text-emerald-900 mt-1">
              {repeatedAdditionStr} = {totalItems}
            </div>
            <p className="text-xs text-emerald-700 mt-1">
              Add {itemsPerGroup} a total of {numGroups} times
            </p>
          </div>

          {/* 3. Multiplication Sentence */}
          <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 text-center">
            <span className="text-xs font-black uppercase text-sky-700 tracking-wider">
              3. Multiplication Sentence
            </span>
            <div className="text-xl md:text-2xl font-fun font-black text-sky-900 mt-1">
              {numGroups} × {itemsPerGroup} = {totalItems}
            </div>
            <p className="text-xs text-sky-700 mt-1">
              Read: &ldquo;{numGroups} times {itemsPerGroup} equals {totalItems}&rdquo;
            </p>
          </div>

          {/* 4. Total Count & Array */}
          <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 text-center">
            <span className="text-xs font-black uppercase text-purple-700 tracking-wider">
              4. Total Items Count
            </span>
            <div className="text-2xl md:text-3xl font-fun font-black text-purple-900 mt-1 flex items-center justify-center gap-1">
              <span>{totalItems}</span>
              <span className="text-lg">{activeTheme.itemEmoji}</span>
            </div>
            <p className="text-xs text-purple-700 mt-1">
              All {activeTheme.itemPlural} together in all {numGroups} groups
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Practice Questions Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-fun font-black text-slate-800 flex items-center gap-2">
            <span>✏️ Interactive Practice: Convert & Connect!</span>
          </h2>
          <span className="text-xs font-bold text-slate-500">
            Earn 2 Stars per question ⭐
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question 1: Repeated Addition to Multiplication */}
          <div className="rounded-3xl bg-white border-3 border-emerald-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                Practice Question 1
              </span>
              <button
                onClick={refreshPractice1}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                title="New problem"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Problem</span>
              </button>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Convert this <strong>repeated addition</strong> to <strong>multiplication</strong>:
              </p>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 font-fun font-black text-xl text-emerald-900 text-center">
                {Array(p1Count).fill(p1Num).join(' + ')} = {p1Num * p1Count}
              </div>
            </div>

            {/* Answer Inputs */}
            <div className="flex items-center justify-center gap-2 text-lg font-fun font-bold">
              <input
                type="number"
                value={p1AnsGroups}
                onChange={e => setP1AnsGroups(e.target.value)}
                placeholder="?"
                className="w-16 h-12 text-center rounded-2xl border-2 border-emerald-400 bg-white font-black text-xl text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <span className="text-2xl text-slate-600">×</span>
              <input
                type="number"
                value={p1AnsItems}
                onChange={e => setP1AnsItems(e.target.value)}
                placeholder="?"
                className="w-16 h-12 text-center rounded-2xl border-2 border-emerald-400 bg-white font-black text-xl text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <span className="text-2xl text-slate-600">=</span>
              <span className="text-2xl font-black text-emerald-700">{p1Num * p1Count}</span>
            </div>

            {/* Check Button & Feedback */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={checkPractice1}
                className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-fun font-bold text-base shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                Check Answer
              </button>

              {p1Feedback === 'correct' && (
                <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Brilliant! {p1Count} groups of {p1Num}!</span>
                </div>
              )}
              {p1Feedback === 'wrong' && (
                <div className="text-xs font-bold text-rose-600">
                  Hint: Count how many times {p1Num} is added!
                </div>
              )}
            </div>
          </div>

          {/* Question 2: Multiplication to Repeated Addition */}
          <div className="rounded-3xl bg-white border-3 border-sky-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
                Practice Question 2
              </span>
              <button
                onClick={refreshPractice2}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
                title="New problem"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Problem</span>
              </button>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Convert this <strong>multiplication</strong> to <strong>repeated addition</strong>:
              </p>
              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 font-fun font-black text-xl text-sky-900 text-center">
                {p2Groups} × {p2Items} = ?
              </div>
            </div>

            {/* Addition Input Boxes */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap font-fun font-bold">
              {Array.from({ length: p2Groups }).map((_, i) => (
                <React.Fragment key={i}>
                  <input
                    type="number"
                    value={p2Inputs[i] || ''}
                    onChange={e => {
                      const updated = [...p2Inputs];
                      updated[i] = e.target.value;
                      setP2Inputs(updated);
                    }}
                    placeholder="?"
                    className="w-12 h-11 text-center rounded-2xl border-2 border-sky-400 bg-white font-black text-lg text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                  {i < p2Groups - 1 && <span className="text-xl text-slate-500">+</span>}
                </React.Fragment>
              ))}
              <span className="text-xl text-slate-500">=</span>
              <input
                type="number"
                value={p2Total}
                onChange={e => setP2Total(e.target.value)}
                placeholder="Total"
                className="w-16 h-11 text-center rounded-2xl border-2 border-purple-400 bg-white font-black text-lg text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
            </div>

            {/* Check Button & Feedback */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={checkPractice2}
                className="px-6 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-fun font-bold text-base shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                Check Answer
              </button>

              {p2Feedback === 'correct' && (
                <div className="flex items-center gap-1.5 text-sm font-bold text-sky-600">
                  <CheckCircle2 className="w-5 h-5 text-sky-500" />
                  <span>Awesome work! {p2Groups} × {p2Items} = {p2Groups * p2Items}!</span>
                </div>
              )}
              {p2Feedback === 'wrong' && (
                <div className="text-xs font-bold text-rose-600">
                  Hint: Add {p2Items}, {p2Groups} times!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Next Step Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-fun font-black text-lg text-amber-900">
            Ready to explore all times tables from 1 to 9?
          </h3>
          <p className="text-sm text-slate-600">
            Head over to Module 2 to explore each table with interactive skip-counting!
          </p>
        </div>
        <button
          onClick={() => {
            soundEffects.pop();
            onNavigateToModule2();
          }}
          className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-fun font-black text-base shadow-md flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer shrink-0"
        >
          <span>Next: Tables 1 to 9</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
