import React, { useState } from 'react';
import { X, Volume2, VolumeX, Clock, RotateCcw, Check, Sparkles, User, Settings2 } from 'lucide-react';
import { TeacherSettings, HighScoreRecord } from '../types';
import { soundEffects } from '../utils/audio';

interface TeacherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TeacherSettings;
  onSaveSettings: (settings: TeacherSettings) => void;
  record: HighScoreRecord;
  onResetRecord: () => void;
}

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  record,
  onResetRecord,
}) => {
  const [localSettings, setLocalSettings] = useState<TeacherSettings>({ ...settings });
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const toggleTable = (num: number) => {
    soundEffects.pop();
    setLocalSettings(prev => {
      const exists = prev.activeTables.includes(num);
      let next: number[];
      if (exists) {
        if (prev.activeTables.length <= 1) return prev; // Keep at least one
        next = prev.activeTables.filter(t => t !== num);
      } else {
        next = [...prev.activeTables, num].sort((a, b) => a - b);
      }
      return { ...prev, activeTables: next };
    });
  };

  const selectAllTables = () => {
    soundEffects.pop();
    setLocalSettings(prev => ({ ...prev, activeTables: [1, 2, 3, 4, 5, 6, 7, 8, 9] }));
  };

  const selectTables1To5 = () => {
    soundEffects.pop();
    setLocalSettings(prev => ({ ...prev, activeTables: [1, 2, 3, 4, 5] }));
  };

  const selectTables6To9 = () => {
    soundEffects.pop();
    setLocalSettings(prev => ({ ...prev, activeTables: [6, 7, 8, 9] }));
  };

  const handleSave = () => {
    soundEffects.correct();
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div
        id="teacher-settings-panel"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border-4 border-amber-300 p-6 md:p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl shadow-xs">
              <Settings2 className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 font-fun">
                Teacher & Parent Settings
              </h2>
              <p className="text-xs md:text-sm text-slate-500">
                Customize multiplication tables, speed limits, and student profile
              </p>
            </div>
          </div>
          <button
            id="close-teacher-settings-btn"
            onClick={() => {
              soundEffects.pop();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close settings"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6 text-slate-700">
          {/* Student Profile Name */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <label className="block text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-600" />
              <span>Student Name (for certificates & Mr. Saif&apos;s greetings):</span>
            </label>
            <input
              id="student-name-input"
              type="text"
              value={localSettings.studentName}
              onChange={e => setLocalSettings(prev => ({ ...prev, studentName: e.target.value }))}
              maxLength={25}
              placeholder="e.g., Sarah, Adam, Leo..."
              className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-300 bg-white font-bold text-slate-800 focus:outline-hidden focus:ring-3 focus:ring-amber-400"
            />
          </div>

          {/* Active Tables to Practice */}
          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-sky-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Select Active Tables (1 to 9):</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Choose which tables will appear in the Practice Game and Quizzes
                </p>
              </div>

              {/* Quick Pick Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={selectAllTables}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-sky-200 text-sky-800 hover:bg-sky-300 transition-colors"
                >
                  All (1–9)
                </button>
                <button
                  type="button"
                  onClick={selectTables1To5}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors"
                >
                  Easy (1–5)
                </button>
                <button
                  type="button"
                  onClick={selectTables6To9}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors"
                >
                  Hard (6–9)
                </button>
              </div>
            </div>

            {/* 1-9 Grid Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                const isActive = localSettings.activeTables.includes(num);
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => toggleTable(num)}
                    className={`py-3 rounded-2xl font-fun font-black text-lg transition-all flex flex-col items-center justify-center border-2 ${
                      isActive
                        ? 'bg-sky-500 text-white border-sky-600 shadow-sm scale-105'
                        : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 opacity-60'
                    }`}
                  >
                    <span>×{num}</span>
                    <span className="text-[10px] font-sans font-bold">
                      {isActive ? '✓ Active' : 'Off'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Max Multiplier & Time Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Max Multiplier */}
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
              <label className="block text-sm font-bold text-purple-900 mb-2">
                Max Multiplier:
              </label>
              <div className="flex gap-2">
                {[10, 12].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      soundEffects.pop();
                      setLocalSettings(prev => ({ ...prev, maxMultiplier: val as 10 | 12 }));
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl font-bold text-sm transition-all border-2 ${
                      localSettings.maxMultiplier === val
                        ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                        : 'bg-white text-slate-600 border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    Up to ×{val}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Grade 3 standard is usually up to 10 (or 12 for bonus challenge).
              </p>
            </div>

            {/* Time Limit Toggle */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Time Limit in Games:</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.pop();
                    setLocalSettings(prev => ({ ...prev, timeLimitEnabled: !prev.timeLimitEnabled }));
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    localSettings.timeLimitEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                      localSettings.timeLimitEnabled ? 'left-6.5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {localSettings.timeLimitEnabled ? (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-600 font-bold">Seconds per card:</span>
                  {[10, 15, 20, 30].map(sec => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setLocalSettings(prev => ({ ...prev, timePerQuestion: sec }))}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        localSettings.timePerQuestion === sec
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-emerald-300 text-emerald-800'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-2">
                  Relaxed mode: students can think without time pressure.
                </p>
              )}
            </div>
          </div>

          {/* Sound & Voice Options */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200">
            <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <span>Audio & Pronunciation:</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEffects.pop();
                  setLocalSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
                }}
                className={`p-3 rounded-xl border-2 flex items-center justify-between font-bold text-sm ${
                  localSettings.soundEnabled
                    ? 'bg-white border-indigo-400 text-indigo-900'
                    : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  {localSettings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>Sound Effects</span>
                </div>
                <span>{localSettings.soundEnabled ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.pop();
                  setLocalSettings(prev => ({ ...prev, speechEnabled: !prev.speechEnabled }));
                }}
                className={`p-3 rounded-xl border-2 flex items-center justify-between font-bold text-sm ${
                  localSettings.speechEnabled
                    ? 'bg-white border-indigo-400 text-indigo-900'
                    : 'bg-slate-100 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Mr. Saif Speech Narration</span>
                </div>
                <span>{localSettings.speechEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Student Progress & Reset */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase text-slate-400">Current Progress</div>
              <div className="text-sm font-semibold text-slate-700">
                ⭐ {record.stars} Stars collected • 🎮 {record.gamesPlayed} Games played • 🏆 {record.badges.length} Badges
              </div>
            </div>

            {confirmReset ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-600">Are you sure?</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetRecord();
                    setConfirmReset(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors"
                >
                  Yes, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Student Progress</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            id="cancel-settings-btn"
            type="button"
            onClick={() => {
              soundEffects.pop();
              onClose();
            }}
            className="px-5 py-2.5 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            id="save-settings-btn"
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl font-fun font-bold text-base bg-amber-500 hover:bg-amber-600 text-white shadow-md flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
          >
            <Check className="w-5 h-5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
