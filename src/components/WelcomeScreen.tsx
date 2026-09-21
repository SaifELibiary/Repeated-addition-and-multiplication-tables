import React, { useState } from 'react';
import { ScreenId, TeacherSettings, HighScoreRecord } from '../types';
import { MrSaifAvatar, MrSaifGuide } from './MrSaifGuide';
import { soundEffects, speakText } from '../utils/audio';
import { Chapter1ProgressBar } from './Chapter1ProgressBar';
import { Chapter1QuizModal } from './Chapter1QuizModal';
import { getCh1CompletedQuestions } from '../utils/storage';
import { Sparkles, ArrowRight, Play, BookOpen, Trophy, Award, Star, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WelcomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  settings: TeacherSettings;
  record: HighScoreRecord;
  onUpdateRecord: (updated: HighScoreRecord) => void;
  onOpenTeacherSettings: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onNavigate,
  settings,
  record,
  onUpdateRecord,
  onOpenTeacherSettings,
}) => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [ch1CompletedList] = useState<string[]>(() => getCh1CompletedQuestions());

  const triggerGreetingConfetti = () => {
    soundEffects.star();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#38BDF8', '#A855F7', '#10B981'],
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-8 animate-fadeIn">
      {/* Hero Welcome Card */}
      <div className="relative rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 border-4 border-amber-300 p-6 md:p-10 shadow-lg overflow-hidden">
        {/* Floating animated Math Symbols */}
        <div className="absolute top-4 right-6 text-3xl md:text-5xl opacity-30 select-none animate-bounce-slow">
          ✖️
        </div>
        <div className="absolute bottom-6 right-20 text-3xl md:text-4xl opacity-25 select-none animate-wiggle">
          ➕
        </div>
        <div className="absolute top-1/2 right-4 text-3xl md:text-5xl opacity-20 select-none">
          🟰
        </div>
        <div className="absolute top-6 left-1/3 text-2xl md:text-4xl opacity-20 select-none animate-bounce-slow">
          ⭐
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          {/* Mr. Saif Greeting Presentation */}
          <div className="flex flex-col items-center text-center shrink-0">
            <div
              className="cursor-pointer transform hover:scale-105 transition-transform"
              onClick={triggerGreetingConfetti}
              title="Click Mr. Saif for magical stars!"
            >
              <MrSaifAvatar size="lg" />
            </div>
            <div className="mt-2 bg-amber-500 text-white font-fun font-bold text-sm px-3 py-1 rounded-full shadow-xs">
              Teacher Mr. Saif
            </div>
            <span className="text-[11px] text-amber-800 font-semibold mt-0.5">
              Grade 3 Math Specialist
            </span>
          </div>

          {/* Main Title & Description */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-amber-300 text-amber-800 text-xs md:text-sm font-bold shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Grade 3 Interactive Math Adventure</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-fun font-black text-amber-900 tracking-tight leading-tight">
              ✖️ Multiplication World: Grade 3 Math!
            </h1>

            <p className="text-base md:text-lg text-slate-700 font-medium max-w-2xl leading-relaxed">
              Discover the magic of <strong className="text-amber-700 font-bold">repeated addition</strong>,
              build fun visual groups, and master your <strong className="text-sky-700 font-bold">times tables from 1 to 9</strong> with Teacher Mr. Saif!
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4">
              <button
                id="start-learning-hero-btn"
                onClick={() => {
                  soundEffects.pop();
                  onNavigate('module1');
                }}
                className="px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-fun font-black text-lg sm:text-xl shadow-md flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>🚀 Start Learning!</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="practice-game-hero-btn"
                onClick={() => {
                  soundEffects.pop();
                  onNavigate('module3');
                }}
                className="px-6 py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-fun font-black text-base sm:text-lg shadow-md flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>🎮 Practice Game (Custom Table)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Mr. Saif's Welcome Message */}
      <MrSaifGuide
        message={`Welcome ${settings.studentName}! Did you know that multiplication is just a super-fast way of adding equal groups together? For example, 3 boxes with 4 apples each is 4 + 4 + 4 = 12, or 3 × 4 = 12! Let's explore together!`}
        hint="Start with Module 1 to build your own visual baskets and arrays, then test your skills in the games!"
        soundEnabled={settings.soundEnabled}
        speechEnabled={settings.speechEnabled}
      />

      {/* CHAPTER 1: RULES OF MULTIPLICATION (GRADE 3 DEDICATED MODULES) */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-amber-500/10 border-3 border-blue-300/80 p-5 sm:p-7 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-blue-600 text-white rounded-2xl text-xl shadow-xs">
              📘
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                Featured Grade 3 Chapter
              </span>
              <h2 className="text-xl sm:text-2xl font-fun font-black text-slate-900">
                Chapter 1: Rules of Multiplication
              </h2>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
            2 Interactive Lessons with Guided Trees & Drills
          </span>
        </div>

        {/* Chapter 1 Progress Bar & Mastery Quiz Trigger */}
        <Chapter1ProgressBar
          completedCount={ch1CompletedList.length}
          totalCount={35}
          record={record}
          onOpenQuiz={() => setIsQuizOpen(true)}
          accentColor="blue"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card: Lesson 1-1 */}
          <div
            onClick={() => {
              soundEffects.pop();
              onNavigate('lesson1_1');
            }}
            className="group cursor-pointer rounded-3xl bg-white border-2 border-blue-200 hover:border-blue-500 p-5 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl p-2.5 rounded-2xl bg-blue-100">📘</span>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Lesson 1-1
              </span>
            </div>
            <h3 className="text-lg font-fun font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
              Properties of Multiplication (Part 1)
            </h3>
            <p className="text-sm text-slate-600 mt-1 mb-4 leading-relaxed">
              Increasing & decreasing multipliers (7× table live demo), switching order (Commutative Property), 4 guided warm-ups, and 12 interactive drills!
            </p>
            <div className="flex items-center text-xs font-bold text-blue-600 gap-1">
              <span>Start Lesson 1-1</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Lesson 1-2 */}
          <div
            onClick={() => {
              soundEffects.pop();
              onNavigate('lesson1_2');
            }}
            className="group cursor-pointer rounded-3xl bg-white border-2 border-amber-200 hover:border-amber-500 p-5 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl p-2.5 rounded-2xl bg-amber-100">🧩</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Lesson 1-2
              </span>
            </div>
            <h3 className="text-lg font-fun font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
              Properties of Multiplication (Part 2)
            </h3>
            <p className="text-sm text-slate-600 mt-1 mb-4 leading-relaxed">
              The Distributive Property! Break up multiplicands or multipliers using dynamic branching tree diagrams, auto-focusing inputs, and 6 drills!
            </p>
            <div className="flex items-center text-xs font-bold text-amber-600 gap-1">
              <span>Start Lesson 1-2</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 5 Learning Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-fun font-black text-slate-800 flex items-center gap-2">
            <span>📚 Choose a Learning Adventure</span>
          </h2>
          <span className="text-xs md:text-sm font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            Grade 3 Curriculum Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div
            onClick={() => {
              soundEffects.pop();
              onNavigate('module1');
            }}
            className="group cursor-pointer rounded-3xl bg-white border-3 border-emerald-200 hover:border-emerald-400 p-5 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl p-2.5 rounded-2xl bg-emerald-100">🧺</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Module 1
              </span>
            </div>
            <h3 className="text-lg font-fun font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
              What is Multiplication?
            </h3>
            <p className="text-sm text-slate-600 mt-1 mb-4 leading-relaxed">
              Interactive Visual Builder! Choose baskets and items (🍎, ⭐, 🦆) to see repeated addition turn into multiplication.
            </p>
            <div className="flex items-center text-xs font-bold text-emerald-600 gap-1">
              <span>Open Visual Builder</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => {
              soundEffects.pop();
              onNavigate('module2');
            }}
            className="group cursor-pointer rounded-3xl bg-white border-3 border-sky-200 hover:border-sky-400 p-5 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl p-2.5 rounded-2xl bg-sky-100">📖</span>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                Module 2
              </span>
            </div>
            <h3 className="text-lg font-fun font-bold text-slate-800 group-hover:text-sky-700 transition-colors">
              Times Tables Explorer (1 to 9)
            </h3>
            <p className="text-sm text-slate-600 mt-1 mb-4 leading-relaxed">
              Explore each table 1 to 9 individually! Interactive skip-counting track, audio pronunciation, and visual formulas.
            </p>
            <div className="flex items-center text-xs font-bold text-sky-600 gap-1">
              <span>Explore Tables 1–9</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => {
              soundEffects.pop();
              onNavigate('module3');
            }}
            className="group cursor-pointer rounded-3xl bg-white border-3 border-amber-200 hover:border-amber-400 p-5 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl p-2.5 rounded-2xl bg-amber-100">🎮</span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Module 3
              </span>
            </div>
            <h3 className="text-lg font-fun font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
              Custom Table Practice Games
            </h3>
            <p className="text-sm text-slate-600 mt-1 mb-4 leading-relaxed">
              Pick your target table(s) and play 3 modes: Repeated Addition Match, Missing Number, and Speed Flashcards!
            </p>
            <div className="flex items-center text-xs font-bold text-amber-600 gap-1">
              <span>Play Practice Games</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => {
              soundEffects.pop();
              onNavigate('module4');
            }}
            className="group cursor-pointer rounded-3xl bg-white border-3 border-purple-200 hover:border-purple-400 p-5 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl p-2.5 rounded-2xl bg-purple-100">🧩</span>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                Module 4
              </span>
            </div>
            <h3 className="text-lg font-fun font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
              Repeated Addition & Array Quiz
            </h3>
            <p className="text-sm text-slate-600 mt-1 mb-4 leading-relaxed">
              Step-by-step array breakdown: count rows, count items per row, write addition sentence, and write multiplication equation!
            </p>
            <div className="flex items-center text-xs font-bold text-purple-600 gap-1">
              <span>Solve Array Challenges</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5 */}
          <div
            onClick={() => {
              soundEffects.pop();
              onNavigate('module5');
            }}
            className="group cursor-pointer rounded-3xl bg-white border-3 border-rose-200 hover:border-rose-400 p-5 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl p-2.5 rounded-2xl bg-rose-100">🏆</span>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Module 5
              </span>
            </div>
            <h3 className="text-lg font-fun font-bold text-slate-800 group-hover:text-rose-700 transition-colors">
              Final Mastery Challenge
            </h3>
            <p className="text-sm text-slate-600 mt-1 mb-4 leading-relaxed">
              10 mixed Grade 3 challenge questions! Earn star badges, instant hints, and your official Certificate from Mr. Saif.
            </p>
            <div className="flex items-center text-xs font-bold text-rose-600 gap-1">
              <span>Take Final Challenge</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Teacher Settings Card */}
          <div
            onClick={() => {
              soundEffects.pop();
              onOpenTeacherSettings();
            }}
            className="group cursor-pointer rounded-3xl bg-amber-50/70 border-3 border-dashed border-amber-300 hover:border-amber-400 p-5 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl p-2.5 rounded-2xl bg-white shadow-xs">⚙️</span>
                <span className="text-xs font-bold text-amber-800 bg-amber-200/80 px-2.5 py-1 rounded-full">
                  Settings
                </span>
              </div>
              <h3 className="text-lg font-fun font-bold text-slate-800 group-hover:text-amber-800 transition-colors">
                Teacher & Parent Panel
              </h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Filter active tables (1 to 9), set student name, toggle time limits, or adjust maximum multiplier (10 or 12).
              </p>
            </div>
            <div className="pt-3 flex items-center text-xs font-bold text-amber-700 gap-1">
              <span>Configure Settings</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Student Badges & Progress Showcase */}
      <div className="rounded-3xl bg-white border-2 border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-fun font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Badges & Achievements</span>
            </h3>
            <p className="text-xs text-slate-500">
              Collect all 6 badges on your multiplication journey!
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 self-start">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{record.stars} Total Stars</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'first_step', title: 'Explorer', icon: '🌱', desc: 'Used Visual Builder' },
            { id: 'array_wizard', title: 'Array Wizard', icon: '🧙‍♂️', desc: 'Array Quiz Champ' },
            { id: 'table_master', title: 'Table Master', icon: '🏆', desc: 'Custom Game Ace' },
            { id: 'speed_calculator', title: 'Speed Calc', icon: '⚡', desc: 'Fast Responses' },
            { id: 'repeated_hero', title: 'Addition Hero', icon: '🦸‍♀️', desc: 'Equation Master' },
            { id: 'mr_saif_star', title: 'Saif Genius', icon: '🌟', desc: '10/10 Final Score' },
          ].map(badge => {
            const isUnlocked = record.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border-2 text-center transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/80 border-amber-400 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="text-3xl mb-1">{isUnlocked ? badge.icon : '🔒'}</div>
                <div className="font-fun font-bold text-xs text-slate-800 truncate">
                  {badge.title}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {isUnlocked ? 'Unlocked!' : badge.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chapter 1 Mastery Quiz Modal */}
      <Chapter1QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        settings={settings}
        record={record}
        onUpdateRecord={onUpdateRecord}
      />
    </div>
  );
};
