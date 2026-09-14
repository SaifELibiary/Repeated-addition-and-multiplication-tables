import React from 'react';
import { X, Award, Printer, Download, Sparkles } from 'lucide-react';
import { MrSaifAvatar } from './MrSaifGuide';
import { soundEffects } from '../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  score: number;
  totalQuestions: number;
  badgeTitle?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName,
  score,
  totalQuestions,
  badgeTitle = 'Multiplication Master 🏆',
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    soundEffects.pop();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-8 border-amber-300 p-6 md:p-10 text-center overflow-hidden print:border-4 print:shadow-none print:max-w-none print:w-full">
        {/* Close Button (hidden when printing) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors print:hidden"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Certificate Decorative Border / Ribbon */}
        <div className="absolute -top-12 -left-12 w-28 h-28 bg-gradient-to-br from-amber-400 to-yellow-200 rounded-full opacity-30 blur-md pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-gradient-to-br from-sky-400 to-blue-200 rounded-full opacity-30 blur-md pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-center gap-2 text-amber-600 font-bold uppercase tracking-widest text-xs md:text-sm mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Official Grade 3 Math Honor</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <h1 className="text-3xl md:text-4xl font-fun font-black text-amber-600 mb-1">
          Certificate of Achievement
        </h1>

        <p className="text-xs md:text-sm text-slate-500 mb-6 italic">
          This certifies that our brilliant Grade 3 mathematician:
        </p>

        {/* Student Name */}
        <div className="inline-block border-b-4 border-amber-400 pb-2 px-8 mb-4">
          <span className="text-2xl md:text-4xl font-fun font-black text-indigo-900 tracking-wide">
            {studentName || 'Math Champion'}
          </span>
        </div>

        {/* Achievement Text */}
        <p className="text-sm md:text-base text-slate-700 max-w-lg mx-auto mb-6 leading-relaxed">
          Has demonstrated outstanding mastery of <strong className="text-amber-700">Repeated Addition</strong>,
          visual arrays, and <strong className="text-sky-700">Multiplication Tables (1 to 9)</strong> with an impressive score of:
        </p>

        {/* Score Badge */}
        <div className="inline-flex items-center gap-3 bg-amber-50 border-2 border-amber-300 rounded-2xl px-6 py-2.5 mb-8 shadow-xs">
          <Award className="w-7 h-7 text-amber-500" />
          <div className="text-left">
            <div className="text-xs font-bold text-amber-700 uppercase">Mastery Score</div>
            <div className="text-xl font-fun font-black text-slate-800">
              {score} / {totalQuestions} Correct ({Math.round((score / totalQuestions) * 100)}%)
            </div>
          </div>
          <span className="ml-2 text-2xl font-fun bg-amber-400 text-white px-3 py-1 rounded-xl shadow-xs">
            {badgeTitle}
          </span>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-6 pt-4 border-t-2 border-dashed border-slate-200 text-left items-end">
          <div className="text-center sm:text-left">
            <div className="text-xs text-slate-400 uppercase font-bold mb-1">Date Awarded</div>
            <div className="text-sm font-semibold text-slate-700">{currentDate}</div>
            <div className="text-xs text-slate-400">Multiplication World Academy</div>
          </div>

          <div className="flex items-center justify-end gap-3 text-right">
            <div>
              <div className="text-xs text-amber-600 font-bold uppercase mb-1">Instructor Signature</div>
              <div className="font-fun font-black text-lg text-slate-800 italic underline decoration-amber-400 decoration-2">
                Teacher Mr. Saif
              </div>
              <div className="text-xs text-slate-500">Grade 3 Math Teacher</div>
            </div>
            <div className="scale-90">
              <MrSaifAvatar size="md" />
            </div>
          </div>
        </div>

        {/* Actions (print/close) */}
        <div className="mt-8 pt-4 flex items-center justify-center gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-md transition-transform hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            <span>Print or Save PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
