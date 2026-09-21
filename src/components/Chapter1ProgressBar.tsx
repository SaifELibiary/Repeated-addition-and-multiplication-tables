import React from 'react';
import { Award, Trophy, Sparkles, CheckCircle2, Target } from 'lucide-react';
import { HighScoreRecord } from '../types';

interface Chapter1ProgressBarProps {
  completedCount: number;
  totalCount: number;
  record: HighScoreRecord;
  onOpenQuiz: () => void;
  accentColor?: 'blue' | 'amber';
}

export const Chapter1ProgressBar: React.FC<Chapter1ProgressBarProps> = ({
  completedCount,
  totalCount,
  record,
  onOpenQuiz,
  accentColor = 'blue',
}) => {
  const percentage = Math.min(100, Math.round((completedCount / Math.max(1, totalCount)) * 100));
  const isMaster = percentage === 100 || record.badges.includes('chapter1_grandmaster');

  const bgGrad = accentColor === 'amber'
    ? 'from-amber-500/10 via-orange-500/10 to-amber-500/5 border-amber-300'
    : 'from-blue-500/10 via-indigo-500/10 to-sky-500/5 border-blue-300';

  const barColor = accentColor === 'amber'
    ? 'from-amber-500 to-orange-500'
    : 'from-blue-600 to-indigo-600';

  return (
    <div className={`rounded-3xl bg-gradient-to-r ${bgGrad} border-2 p-4 sm:p-5 shadow-xs transition-all`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-2xl bg-white shadow-xs text-xl">
            {isMaster ? '👑' : '⭐'}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-fun font-bold text-slate-900 text-sm sm:text-base">
                Chapter 1 Mastery Progress
              </h3>
              {isMaster && (
                <span className="text-2xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-3 h-3" /> Master Level
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {completedCount} of {totalCount} practice exercises completed ({percentage}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-fun font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Target className="w-4 h-4" />
            <span>End-of-Lesson Quiz 🎯</span>
          </button>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="w-full bg-white/80 rounded-full h-3 sm:h-3.5 overflow-hidden border border-slate-200/80 p-0.5">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${Math.max(4, percentage)}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2 text-2xs text-slate-500 font-bold">
        <span>Lesson 1-1 & 1-2 Practice Sets</span>
        <span className="flex items-center gap-1 text-slate-700">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          {percentage}% Complete
        </span>
      </div>
    </div>
  );
};
