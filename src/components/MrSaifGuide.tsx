import React from 'react';
import { Volume2, Sparkles, Lightbulb } from 'lucide-react';
import { speakText, soundEffects } from '../utils/audio';

interface MrSaifGuideProps {
  message: string;
  hint?: string;
  mood?: 'happy' | 'explaining' | 'celebrating' | 'thinking';
  speechEnabled?: boolean;
  soundEnabled?: boolean;
  compact?: boolean;
}

export const MrSaifAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; mood?: string }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  return (
    <div className={`relative ${sizeClasses[size]} shrink-0 select-none`}>
      {/* Glow / Ring */}
      <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-300 via-sky-300 to-indigo-300 opacity-80 blur-xs animate-pulse" />
      
      {/* Avatar Container */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-b from-sky-100 to-blue-200 border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
        {/* SVG Illustration of Mr. Saif: friendly teacher with glasses, smile, and teacher tie */}
        <svg viewBox="0 0 100 100" className="w-full h-full" aria-label="Mr. Saif">
          {/* Background subtle radial */}
          <circle cx="50" cy="50" r="48" fill="#E0F2FE" />
          
          {/* Hair (neat styled brown hair) */}
          <path d="M26 44 C24 24 38 14 50 14 C62 14 76 24 74 44 C72 38 68 26 50 26 C32 26 28 38 26 44 Z" fill="#451A03" />
          <path d="M28 36 C34 22 66 22 72 36 C64 26 36 26 28 36 Z" fill="#78350F" />

          {/* Ears */}
          <circle cx="27" cy="52" r="7" fill="#FBCFE8" stroke="#F472B6" strokeWidth="0.5" />
          <circle cx="73" cy="52" r="7" fill="#FBCFE8" stroke="#F472B6" strokeWidth="0.5" />

          {/* Face */}
          <ellipse cx="50" cy="54" rx="23" ry="24" fill="#FDE68A" />
          <ellipse cx="50" cy="54" rx="21" ry="22" fill="#FEF08A" />

          {/* Cheerful rosy cheeks */}
          <circle cx="36" cy="60" r="4.5" fill="#FCA5A5" opacity="0.65" />
          <circle cx="64" cy="60" r="4.5" fill="#FCA5A5" opacity="0.65" />

          {/* Eyebrows */}
          <path d="M34 40 Q40 37 45 40" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M55 40 Q60 37 66 40" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Glasses Frame (friendly round teacher glasses) */}
          <rect x="30" y="43" width="16" height="13" rx="5" fill="#FFFFFF" fillOpacity="0.4" stroke="#1E3A8A" strokeWidth="2.2" />
          <rect x="54" y="43" width="16" height="13" rx="5" fill="#FFFFFF" fillOpacity="0.4" stroke="#1E3A8A" strokeWidth="2.2" />
          <line x1="46" y1="49" x2="54" y2="49" stroke="#1E3A8A" strokeWidth="2.2" />

          {/* Eyes (happy twinkles) */}
          <circle cx="38" cy="49" r="2.8" fill="#1E293B" />
          <circle cx="39" cy="48" r="1" fill="#FFFFFF" />
          <circle cx="62" cy="49" r="2.8" fill="#1E293B" />
          <circle cx="63" cy="48" r="1" fill="#FFFFFF" />

          {/* Nose */}
          <path d="M48 54 Q50 58 52 54" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Friendly Smile */}
          <path d="M42 63 Q50 71 58 63" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" fill="#DC2626" />
          <path d="M44 63 Q50 67 56 63" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="#FFFFFF" />

          {/* Body/Shirt collar & blue tie */}
          <path d="M22 88 C24 74 38 72 50 72 C62 72 76 74 78 88 Z" fill="#0284C7" />
          {/* White collar */}
          <polygon points="43,72 50,81 40,82" fill="#FFFFFF" />
          <polygon points="57,72 50,81 60,82" fill="#FFFFFF" />
          {/* Red/Amber tie */}
          <polygon points="48,80 52,80 54,95 50,98 46,95" fill="#F59E0B" />
        </svg>

        {/* Small floating badge */}
        <span className="absolute bottom-0 right-0 text-[10px] leading-none bg-amber-400 text-amber-950 font-bold px-1 rounded-full border border-white">
          ★
        </span>
      </div>
    </div>
  );
};

export const MrSaifGuide: React.FC<MrSaifGuideProps> = ({
  message,
  hint,
  speechEnabled = true,
  soundEnabled = true,
  compact = false,
}) => {
  const [showHint, setShowHint] = React.useState(false);

  const handleSpeak = () => {
    if (soundEnabled) soundEffects.pop();
    const textToSpeak = showHint && hint ? `${message}. Remember: ${hint}` : message;
    speakText(textToSpeak, speechEnabled);
  };

  return (
    <div
      id="mr-saif-guide-card"
      className={`relative rounded-3xl border-2 border-amber-200/90 bg-gradient-to-r from-amber-50/95 via-yellow-50/90 to-orange-50/95 shadow-sm transition-all duration-200 ${
        compact ? 'p-3' : 'p-4 md:p-5'
      }`}
    >
      <div className="flex items-start gap-3 md:gap-4">
        {/* Animated Avatar */}
        <div className="relative group cursor-pointer" onClick={handleSpeak} title="Click Mr. Saif to speak!">
          <div className="animate-wiggle">
            <MrSaifAvatar size={compact ? 'sm' : 'md'} />
          </div>
          <div className="text-center mt-1">
            <span className="inline-block bg-sky-600 text-white font-bold text-[10px] md:text-xs px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
              Mr. Saif
            </span>
          </div>
        </div>

        {/* Speech Bubble Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Teacher Mr. Saif Says:</span>
            </div>

            <div className="flex items-center gap-1">
              {hint && (
                <button
                  id="mr-saif-hint-btn"
                  onClick={() => {
                    if (soundEnabled) soundEffects.pop();
                    setShowHint(prev => !prev);
                  }}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1 transition-all ${
                    showHint
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
                </button>
              )}

              <button
                id="mr-saif-speak-btn"
                onClick={handleSpeak}
                className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-colors"
                title="Hear Mr. Saif read this"
                aria-label="Hear pronunciation"
              >
                <Volume2 className="w-4 h-4 text-sky-600" />
              </button>
            </div>
          </div>

          <p className="text-sm md:text-base font-medium text-slate-800 leading-relaxed">
            {message}
          </p>

          {showHint && hint && (
            <div className="mt-2.5 p-2.5 rounded-2xl bg-amber-100/90 border border-amber-300/80 text-xs md:text-sm text-amber-900 flex items-start gap-2 animate-fadeIn">
              <span className="text-base">💡</span>
              <div>
                <strong className="font-bold">Mr. Saif&apos;s Clue: </strong>
                <span>{hint}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
