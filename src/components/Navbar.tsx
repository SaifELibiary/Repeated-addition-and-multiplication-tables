import React from 'react';
import { ScreenId, TeacherSettings, HighScoreRecord } from '../types';
import { Volume2, VolumeX, Settings, Star, Sparkles, Award } from 'lucide-react';
import { soundEffects } from '../utils/audio';
import { MrSaifAvatar } from './MrSaifGuide';

interface NavbarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  settings: TeacherSettings;
  onUpdateSettings: (settings: TeacherSettings) => void;
  onOpenTeacherSettings: () => void;
  onOpenCertificate?: () => void;
  record: HighScoreRecord;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  settings,
  onUpdateSettings,
  onOpenTeacherSettings,
  onOpenCertificate,
  record,
}) => {
  const toggleSound = () => {
    const next = !settings.soundEnabled;
    onUpdateSettings({ ...settings, soundEnabled: next });
    if (next) soundEffects.pop();
  };

  const navItems: { id: ScreenId; label: string; shortLabel: string; icon: string }[] = [
    { id: 'welcome', label: 'Home', shortLabel: 'Home', icon: '🏠' },
    { id: 'module1', label: '1. What is Multiplication?', shortLabel: 'Concept', icon: '🧺' },
    { id: 'module2', label: '2. Times Tables (1–9)', shortLabel: 'Tables', icon: '📖' },
    { id: 'module3', label: '3. Practice Game', shortLabel: 'Game', icon: '🎮' },
    { id: 'module4', label: '4. Array Quiz', shortLabel: 'Arrays', icon: '🧩' },
    { id: 'module5', label: '5. Final Mastery', shortLabel: 'Mastery', icon: '🏆' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Brand Logo & Mr. Saif Avatar */}
          <div
            onClick={() => {
              soundEffects.pop();
              onNavigate('welcome');
            }}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="relative transform group-hover:scale-105 transition-transform">
              <MrSaifAvatar size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-fun font-black text-lg md:text-xl text-amber-600 tracking-tight">
                  ✖️ Multiplication World
                </span>
                <span className="hidden sm:inline-block text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                  Grade 3
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium">
                With Teacher Mr. Saif
              </p>
            </div>
          </div>

          {/* Right Action Icons: Stars, Sound, Teacher Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Stars Counter */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 font-fun font-bold text-sm shadow-xs"
              title="Total Stars Earned"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-500 animate-spin-slow" />
              <span>{record.stars}</span>
            </div>

            {/* Badges Button */}
            {record.badges.length > 0 && onOpenCertificate && (
              <button
                onClick={() => {
                  soundEffects.pop();
                  onOpenCertificate();
                }}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors shadow-xs"
                title="View Certificate of Achievement"
              >
                <Award className="w-4 h-4 text-indigo-600" />
                <span className="hidden md:inline">Certificate</span>
              </button>
            )}

            {/* Sound Toggle */}
            <button
              id="navbar-sound-toggle"
              onClick={toggleSound}
              className={`p-2 rounded-2xl border-2 transition-colors ${
                settings.soundEnabled
                  ? 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
              title={settings.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
              aria-label="Toggle sound"
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Teacher Settings Button */}
            <button
              id="navbar-teacher-settings-btn"
              onClick={() => {
                soundEffects.pop();
                onOpenTeacherSettings();
              }}
              className="px-3 py-1.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-fun font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-transform hover:scale-105 active:scale-95"
              title="Teacher & Parent Settings"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Teacher Settings</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Scrollable on small screens) */}
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 pb-0.5 mt-1 border-t border-amber-100/60">
          {navItems.map(item => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  soundEffects.pop();
                  onNavigate(item.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-xs font-fun scale-102'
                    : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
                <span className="md:hidden">{item.shortLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
