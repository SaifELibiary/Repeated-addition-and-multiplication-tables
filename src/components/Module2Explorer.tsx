import React, { useState } from 'react';
import { TeacherSettings, HighScoreRecord } from '../types';
import { MrSaifGuide } from './MrSaifGuide';
import { soundEffects, speakText } from '../utils/audio';
import { Volume2, Play, ChevronDown, ChevronUp, Sparkles, ArrowRight, Check, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Module2ExplorerProps {
  settings: TeacherSettings;
  record: HighScoreRecord;
  onUpdateRecord: (updated: HighScoreRecord) => void;
  onNavigateToGame: (tableNum?: number) => void;
}

// Teacher tips for each table (1 to 9) by Mr. Saif
const TABLE_TIPS: Record<number, { title: string; tip: string; icon: string }> = {
  1: {
    title: 'The Mirror Rule 🪞',
    tip: 'Multiplying by 1 never changes a number! Any number times 1 is just itself. 1 × 8 = 8!',
    icon: '🪞',
  },
  2: {
    title: 'Double Trouble! ✌️',
    tip: 'Multiplying by 2 is the same as doubling! For 2 × 7, just think 7 + 7 = 14!',
    icon: '✌️',
  },
  3: {
    title: 'Triplets & Rhymes 🎵',
    tip: 'Count in threes: 3, 6, 9, 12, 15! Adding the digits of any multiple of 3 always equals 3, 6, or 9!',
    icon: '🎵',
  },
  4: {
    title: 'Double the Double! 🎯',
    tip: 'To multiply by 4, double the number once, then double it again! For 4 × 6: double 6 is 12, double 12 is 24!',
    icon: '🎯',
  },
  5: {
    title: 'High Five Clock Magic 🖐️',
    tip: 'Every answer in the 5 times table ends in either 5 or 0! Just like reading minutes on a clock!',
    icon: '🖐️',
  },
  6: {
    title: 'Double the 3s! 🎲',
    tip: 'Multiply by 3 first, then double your answer! Or notice that multiplying an even number by 6 always ends with that same number: 6 × 4 = 24!',
    icon: '🎲',
  },
  7: {
    title: 'Lucky Sevens Magic 🍀',
    tip: '7 days in a week! 2 weeks = 14 days, 3 weeks = 21 days! Practicing skip-counting 7, 14, 21, 28 makes it easy!',
    icon: '🍀',
  },
  8: {
    title: 'Double, Double, Double! 🐙',
    tip: 'An octopus has 8 arms! Multiplying by 8 is just doubling 3 times: 8 × 5 -> double 5 is 10, double is 20, double is 40!',
    icon: '🐙',
  },
  9: {
    title: 'The Magic Nine Sum 🧙‍♂️',
    tip: 'Mr. Saif’s favorite magic: The digits of the answers always add up to 9! 9 × 2 = 18 (1+8=9), 9 × 5 = 45 (4+5=9)!',
    icon: '🧙‍♂️',
  },
};

export const Module2Explorer: React.FC<Module2ExplorerProps> = ({
  settings,
  record,
  onUpdateRecord,
  onNavigateToGame,
}) => {
  const [selectedTable, setSelectedTable] = useState<number>(4);
  const [expandedFact, setExpandedFact] = useState<number | null>(3); // 4 × 3 default expanded
  const [activeHopIndex, setActiveHopIndex] = useState<number | null>(null);

  const maxMultiplier = settings.maxMultiplier || 10;
  const tableData = TABLE_TIPS[selectedTable] || TABLE_TIPS[1];

  // Skip counting track numbers: [selectedTable * 1, selectedTable * 2, ..., selectedTable * maxMultiplier]
  const skipCountTrack = Array.from({ length: maxMultiplier }, (_, i) => selectedTable * (i + 1));

  // Audio pronunciation
  const pronounceFact = (multiplier: number) => {
    const product = selectedTable * multiplier;
    soundEffects.pop();
    const text = `${selectedTable} times ${multiplier} equals ${product}!`;
    speakText(text, settings.speechEnabled);
  };

  // Skip counting step animation
  const handleSkipHop = (index: number) => {
    setActiveHopIndex(index);
    soundEffects.hop(index);
    const value = skipCountTrack[index];
    speakText(`${value}`, settings.speechEnabled);
  };

  // Play entire skip counting sequence
  const playEntireSkipTrack = () => {
    soundEffects.pop();
    skipCountTrack.forEach((val, idx) => {
      setTimeout(() => {
        setActiveHopIndex(idx);
        soundEffects.hop(idx);
      }, idx * 450);
    });

    setTimeout(() => {
      setActiveHopIndex(null);
      soundEffects.correct();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    }, maxMultiplier * 450);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-fadeIn">
      {/* Module Title Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
            Module 2 • Grade 3 Interactive Tables
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-fun font-black">
            Times Tables Explorer (1 to 9)
          </h1>
          <p className="text-sky-100 text-sm md:text-base font-medium max-w-2xl mt-1">
            Pick any multiplication table from 1 to 9. Click any fact to see the groups,
            hear the pronunciation, and jump along the skip-counting track!
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 text-7xl opacity-20 select-none">
          📖
        </div>
      </div>

      {/* Interactive Navigation Bar / Tabs (Table 1 to Table 9) */}
      <div className="rounded-3xl bg-white border-3 border-sky-300 p-4 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center sm:text-left">
          Select a Times Table to Explore:
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
            const isSelected = selectedTable === num;
            return (
              <button
                key={num}
                onClick={() => {
                  soundEffects.pop();
                  setSelectedTable(num);
                  setExpandedFact(3); // Reset to 3
                  setActiveHopIndex(null);
                }}
                className={`py-3 px-2 rounded-2xl font-fun font-black text-lg sm:text-xl transition-all flex flex-col items-center justify-center border-2 cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-105'
                    : 'bg-sky-50/70 text-sky-900 border-sky-200 hover:bg-sky-100 hover:scale-102'
                }`}
              >
                <span>Table {num}</span>
                <span className="text-[11px] font-sans font-bold opacity-80">
                  ×{num}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Teacher Mr. Saif's Secret Table Trick Card */}
      <MrSaifGuide
        message={`Table ${selectedTable} Tip: ${tableData.tip}`}
        hint={`Click on any equation row below to expand the repeated addition formula and hearing aid!`}
        soundEnabled={settings.soundEnabled}
        speechEnabled={settings.speechEnabled}
      />

      {/* Skip-Counting Kangaroo / Frog Track */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-3 border-emerald-300 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-fun font-black text-emerald-900 flex items-center gap-2">
              <span>🦘 Table {selectedTable} Skip-Counting Track</span>
            </h3>
            <p className="text-xs text-slate-600">
              Jump step-by-step: add {selectedTable} each hop!
            </p>
          </div>

          <button
            onClick={playEntireSkipTrack}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-fun font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer self-start"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Play Kangaroo Jump!</span>
          </button>
        </div>

        {/* The Track Line */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-4 px-2 no-scrollbar">
          {skipCountTrack.map((val, idx) => {
            const isHopActive = activeHopIndex === idx;
            return (
              <div
                key={val}
                onClick={() => handleSkipHop(idx)}
                className={`flex-1 min-w-[54px] sm:min-w-[62px] p-2.5 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all transform duration-200 ${
                  isHopActive
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md -translate-y-2 scale-110 ring-4 ring-emerald-300'
                    : 'bg-white text-slate-700 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/60'
                }`}
              >
                {/* Kangaroo Icon above active hop */}
                <div className="h-5 text-sm flex items-center justify-center">
                  {isHopActive ? '🦘' : <span className="text-[10px] text-slate-400">hop {idx + 1}</span>}
                </div>
                <div className="text-lg sm:text-xl font-fun font-black">
                  {val}
                </div>
                <div className="text-[10px] font-bold opacity-75">
                  +{selectedTable}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Table Chart & Breakdown View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Table Chart (Rows 1 to 10 or 12) */}
        <div className="lg:col-span-5 rounded-3xl bg-white border-3 border-amber-300 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <h3 className="font-fun font-black text-lg text-amber-900">
              ✖️ Table {selectedTable} Chart
            </h3>
            <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Click any line to expand
            </span>
          </div>

          <div className="space-y-1.5">
            {Array.from({ length: maxMultiplier }).map((_, i) => {
              const multiplier = i + 1;
              const product = selectedTable * multiplier;
              const isExpanded = expandedFact === multiplier;

              return (
                <div
                  key={multiplier}
                  onClick={() => {
                    soundEffects.pop();
                    setExpandedFact(isExpanded ? null : multiplier);
                  }}
                  className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                    isExpanded
                      ? 'bg-amber-100/90 border-amber-400 shadow-xs scale-102'
                      : 'bg-slate-50/80 border-slate-200 hover:bg-amber-50 hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-white border border-amber-300 text-amber-900 font-fun font-bold text-xs flex items-center justify-center">
                      #{multiplier}
                    </span>
                    <span className="text-base sm:text-lg font-fun font-black text-slate-800">
                      {selectedTable} × {multiplier} = {product}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        pronounceFact(multiplier);
                      }}
                      className="p-1.5 hover:text-sky-600 hover:bg-white rounded-full transition-colors"
                      title="Hear pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-amber-700" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual Breakdown for the Expanded Fact */}
        <div className="lg:col-span-7 space-y-6">
          {expandedFact !== null ? (
            <div className="rounded-3xl bg-white border-3 border-sky-300 p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-sky-100 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                    Visual Breakdown
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-fun font-black text-sky-900">
                    {selectedTable} × {expandedFact} = {selectedTable * expandedFact}
                  </h3>
                </div>

                {/* Pronunciation button */}
                <button
                  onClick={() => pronounceFact(expandedFact)}
                  className="px-4 py-2 rounded-2xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-xs sm:text-sm flex items-center gap-2 border border-sky-300 transition-transform hover:scale-105 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-sky-600" />
                  <span>Hear Pronunciation</span>
                </button>
              </div>

              {/* 1. Visual Groups Display */}
              <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Visual Model: {selectedTable} groups of {expandedFact} stars
                </div>

                {/* Render selectedTable containers */}
                <div className="flex flex-wrap gap-3 items-center justify-center">
                  {Array.from({ length: selectedTable }).map((_, gIdx) => (
                    <div
                      key={gIdx}
                      className="p-3 rounded-2xl bg-white border-2 border-sky-300 shadow-2xs text-center min-w-[85px] sm:min-w-[100px]"
                    >
                      <div className="text-[10px] font-bold text-sky-700 mb-1">
                        Group {gIdx + 1}
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-1 max-w-[90px]">
                        {Array.from({ length: expandedFact }).map((_, iIdx) => (
                          <span key={iIdx} className="text-lg sm:text-xl animate-bounce-slow">
                            ⭐
                          </span>
                        ))}
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 mt-1">
                        {expandedFact} stars
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Repeated Addition Formula */}
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-center sm:text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Repeated Addition Formula:
                </div>
                <div className="text-lg sm:text-xl font-fun font-black text-emerald-900">
                  {Array(selectedTable).fill(expandedFact).join(' + ')} = {selectedTable * expandedFact}
                </div>
                <p className="text-xs text-emerald-700">
                  Adding {expandedFact} together {selectedTable} times gives {selectedTable * expandedFact}.
                </p>
              </div>

              {/* Practice This Table Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Mastered Table {selectedTable}? Let&apos;s play a game!
                </span>
                <button
                  onClick={() => {
                    soundEffects.pop();
                    onNavigateToGame(selectedTable);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-fun font-bold text-sm shadow-xs flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                >
                  <span>Practice Table {selectedTable}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] rounded-3xl bg-white border-3 border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center text-slate-400">
              <span className="text-4xl mb-2">👆</span>
              <p className="text-base font-fun font-bold">
                Click any multiplication fact on the left to see its visual breakdown!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
