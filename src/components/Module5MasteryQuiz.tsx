import React, { useState } from 'react';
import { TeacherSettings, HighScoreRecord, QuizQuestion } from '../types';
import { MrSaifGuide, MrSaifAvatar } from './MrSaifGuide';
import { soundEffects, speakText } from '../utils/audio';
import { Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, Star, Trophy, Sparkles, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Module5MasteryQuizProps {
  settings: TeacherSettings;
  record: HighScoreRecord;
  onUpdateRecord: (updated: HighScoreRecord) => void;
  onOpenCertificate: (score: number, total: number) => void;
  onRestartQuiz: () => void;
}

export const Module5MasteryQuiz: React.FC<Module5MasteryQuizProps> = ({
  settings,
  record,
  onUpdateRecord,
  onOpenCertificate,
  onRestartQuiz,
}) => {
  // Generate 10 mixed Grade 3 questions based on active tables
  const [questions] = useState<QuizQuestion[]>(() => {
    const tables: number[] = settings.activeTables.length > 0 ? settings.activeTables : [2, 3, 4, 5, 6, 7, 8, 9];
    const generated: QuizQuestion[] = [];

    for (let i = 0; i < 10; i++) {
      const table: number = tables[Math.floor(Math.random() * tables.length)];
      const mult: number = Math.floor(Math.random() * (settings.maxMultiplier || 10)) + 1;
      const product: number = table * mult;

      // Question types cycle
      const typeIndex = i % 4;

      if (typeIndex === 0) {
        // Repeated addition to multiplication
        const repeated = Array(mult).fill(table).join(' + ');
        const correct = `${mult} × ${table} = ${product}`;
        const dist1 = `${mult} + ${table} = ${mult + table}`;
        const dist2 = `${table} × ${table} = ${table * table}`;
        const dist3 = `${mult + 1} × ${table} = ${(mult + 1) * table}`;
        const options = Array.from(new Set([correct, dist1, dist2, dist3])).slice(0, 3).sort(() => Math.random() - 0.5);

        generated.push({
          id: `q-${i}`,
          type: 'repeated-to-mult',
          question: `Which multiplication equation represents this repeated addition:`,
          repeatedText: `${repeated} ?`,
          options,
          correctAnswer: correct,
          hint: `Count how many times ${table} is added. There are ${mult} equal groups of ${table}!`,
        });
      } else if (typeIndex === 1) {
        // Missing factor
        const correct = `${mult}`;
        const dist1 = `${mult + 1}`;
        const dist2 = `${Math.max(1, mult - 1)}`;
        const dist3 = `${mult + 2}`;
        const options = Array.from(new Set([correct, dist1, dist2, dist3])).slice(0, 3).sort(() => Math.random() - 0.5);

        generated.push({
          id: `q-${i}`,
          type: 'missing-factor',
          question: `Fill in the missing number:`,
          multText: `${table} × [ ? ] = ${product}`,
          options,
          correctAnswer: correct,
          hint: `How many times do you need to add ${table} to reach ${product}?`,
        });
      } else if (typeIndex === 2) {
        // Multiplication equation to repeated addition
        const correct = Array(mult).fill(table).join(' + ');
        const dist1 = Array(mult).fill(mult).join(' + ');
        const dist2 = Array(Math.max(2, mult - 1)).fill(table).join(' + ');
        const options = Array.from(new Set([correct, dist1, dist2])).slice(0, 3).sort(() => Math.random() - 0.5);

        generated.push({
          id: `q-${i}`,
          type: 'mult-to-repeated',
          question: `How do you write ${mult} × ${table} as repeated addition?`,
          options,
          correctAnswer: correct,
          hint: `${mult} groups of ${table} means adding the number ${table} a total of ${mult} times!`,
        });
      } else {
        // Word Problem Grade 3 style
        const items = ['apples 🍎', 'stickers ⭐', 'pencils ✏️', 'balloons 🎈', 'cookies 🍪'];
        const item = items[Math.floor(Math.random() * items.length)];
        const correct = `${product}`;
        const dist1 = `${product + table}`;
        const dist2 = `${Math.max(1, product - table)}`;
        const options = Array.from(new Set([correct, dist1, dist2])).slice(0, 3).sort(() => Math.random() - 0.5);

        generated.push({
          id: `q-${i}`,
          type: 'word-problem',
          question: `Teacher Mr. Saif has ${mult} pencil boxes. Each box has ${table} ${item}. How many ${item} are there in all?`,
          options,
          correctAnswer: correct,
          hint: `Think: ${mult} boxes × ${table} items in each box = ?`,
        });
      }
    }

    return generated;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedAnswer(opt);
    setIsAnswered(true);

    const isCorrect = opt === currentQ.correctAnswer;
    const nextAnswers = [...userAnswers, isCorrect];
    setUserAnswers(nextAnswers);

    if (isCorrect) {
      soundEffects.correct();
      setScore(prev => prev + 1);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      onUpdateRecord({ ...record, stars: record.stars + 1 });
    } else {
      soundEffects.wrong();
    }
  };

  const handleNext = () => {
    soundEffects.pop();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Finished Quiz!
      setIsFinished(true);
      soundEffects.fanfare();
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });

      // Unlock badges
      const newBadges = [...record.badges];
      if (!newBadges.includes('table_master')) newBadges.push('table_master');
      if (score + (selectedAnswer === currentQ.correctAnswer ? 1 : 0) >= 8) {
        if (!newBadges.includes('mr_saif_star')) newBadges.push('mr_saif_star');
      }

      onUpdateRecord({
        ...record,
        quizzesCompleted: record.quizzesCompleted + 1,
        badges: newBadges,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-8 animate-fadeIn">
      {/* Title Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-500 p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
            Module 5 • Final Mastery Challenge
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-fun font-black">
            10-Question Multiplication Mastery Quiz
          </h1>
          <p className="text-rose-50 text-sm md:text-base font-medium max-w-2xl mt-1">
            Test your skills across repeated addition, arrays, and multiplication tables.
            Score 8 or more to earn Teacher Mr. Saif&apos;s Star Math Genius badge!
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 text-7xl opacity-20 select-none">
          🏆
        </div>
      </div>

      {!isFinished ? (
        /* Active Quiz Screen */
        <div className="rounded-3xl bg-white border-3 border-amber-300 p-6 md:p-8 shadow-sm space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-amber-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="font-fun font-black text-amber-900 text-lg">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Score Tracker */}
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-fun font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>Score: {score}</span>
            </div>
          </div>

          {/* Question Progress Dots */}
          <div className="flex items-center gap-1.5">
            {questions.map((_, idx) => {
              let dotColor = 'bg-slate-200';
              if (idx < userAnswers.length) {
                dotColor = userAnswers[idx] ? 'bg-emerald-500' : 'bg-rose-500';
              } else if (idx === currentIndex) {
                dotColor = 'bg-amber-400 ring-2 ring-amber-200';
              }
              return (
                <div
                  key={idx}
                  className={`flex-1 h-2.5 rounded-full transition-all ${dotColor}`}
                />
              );
            })}
          </div>

          {/* Mr. Saif Hint Guide */}
          <MrSaifGuide
            message={currentQ.question}
            hint={currentQ.hint}
            soundEnabled={settings.soundEnabled}
            speechEnabled={settings.speechEnabled}
          />

          {/* Question Content */}
          <div className="text-center py-6 px-4 rounded-3xl bg-amber-50/60 border-2 border-dashed border-amber-200 space-y-3">
            {currentQ.repeatedText && (
              <div className="text-3xl sm:text-4xl font-fun font-black text-amber-950">
                {currentQ.repeatedText}
              </div>
            )}
            {currentQ.multText && (
              <div className="text-3xl sm:text-4xl font-fun font-black text-sky-950">
                {currentQ.multText}
              </div>
            )}
            {!currentQ.repeatedText && !currentQ.multText && (
              <div className="text-xl sm:text-2xl font-fun font-bold text-slate-800">
                {currentQ.question}
              </div>
            )}
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let btnStyle = 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/60 text-slate-800';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                } else if (isSelected && !isCorrect) {
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
                  className={`p-5 rounded-2xl border-3 font-fun font-black text-lg sm:text-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5" />}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {isAnswered && (
            <div className="pt-4 flex items-center justify-between border-t border-slate-100 animate-fadeIn">
              <div>
                {selectedAnswer === currentQ.correctAnswer ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1.5 text-sm sm:text-base">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Fantastic! That is 100% correct!</span>
                  </span>
                ) : (
                  <span className="text-rose-600 font-bold text-xs sm:text-sm">
                    Keep going! Correct answer: <strong>{currentQ.correctAnswer}</strong>.
                  </span>
                )}
              </div>

              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-fun font-bold text-base shadow-md flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{currentIndex + 1 === questions.length ? 'See Final Results 🏆' : 'Next Question'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results & Celebration Screen */
        <div className="rounded-3xl bg-white border-4 border-amber-300 p-8 md:p-12 shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 text-4xl flex items-center justify-center mx-auto shadow-xs animate-bounce-slow">
            🏆
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-fun font-black text-amber-900">
              Quiz Completed, {settings.studentName}!
            </h2>
            <p className="text-slate-600 text-base md:text-lg max-w-lg mx-auto">
              Teacher Mr. Saif has reviewed your answers. Here is your final report:
            </p>
          </div>

          {/* Final Score Circle */}
          <div className="inline-block p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-3 border-amber-300 shadow-sm">
            <div className="text-sm font-bold uppercase tracking-wider text-amber-700">
              Final Mastery Score
            </div>
            <div className="text-5xl md:text-6xl font-fun font-black text-amber-600 my-1">
              {score} / {questions.length}
            </div>
            <div className="text-sm font-bold text-slate-600">
              {score >= 8
                ? '🌟 Outstanding! Grade 3 Math Genius!'
                : score >= 5
                ? '👍 Good job! Keep practicing your tables!'
                : '💪 Nice effort! Review Module 1 and try again!'}
            </div>
          </div>

          {/* Mr. Saif Personal Congratulations */}
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 flex items-center gap-4 text-left">
            <div className="shrink-0">
              <MrSaifAvatar size="md" />
            </div>
            <div>
              <div className="font-fun font-bold text-sky-900 text-sm">
                Teacher Mr. Saif:
              </div>
              <p className="text-xs sm:text-sm text-sky-800 leading-relaxed">
                &ldquo;You did a wonderful job with repeated addition and multiplication!
                Your official Certificate of Achievement is ready to view and print.&rdquo;
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenCertificate(score, questions.length)}
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-fun font-black text-base shadow-md flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
            >
              <Award className="w-5 h-5" />
              <span>View Official Certificate 📜</span>
            </button>

            <button
              onClick={onRestartQuiz}
              className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-fun font-bold text-base shadow-md flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Try New Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
