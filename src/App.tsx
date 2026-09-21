import React, { useState, useEffect } from 'react';
import { ScreenId, TeacherSettings, HighScoreRecord } from './types';
import { getStoredSettings, saveSettings, getStoredRecord, saveRecord, resetRecord } from './utils/storage';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Module1Builder } from './components/Module1Builder';
import { Module2Explorer } from './components/Module2Explorer';
import { Module3CustomGame } from './components/Module3CustomGame';
import { Module4ArrayQuiz } from './components/Module4ArrayQuiz';
import { Module5MasteryQuiz } from './components/Module5MasteryQuiz';
import { Chapter1Lesson1 } from './components/Chapter1Lesson1';
import { Chapter1Lesson2 } from './components/Chapter1Lesson2';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';
import { CertificateModal } from './components/CertificateModal';
import { MrSaifAvatar } from './components/MrSaifGuide';
import { soundEffects } from './utils/audio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('welcome');
  const [settings, setSettings] = useState<TeacherSettings>(getStoredSettings);
  const [record, setRecord] = useState<HighScoreRecord>(getStoredRecord);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [certScore, setCertScore] = useState(10);
  const [certTotal, setCertTotal] = useState(10);

  // Preselected table if jumped from Module 2 to Module 3
  const [gameTargetTable, setGameTargetTable] = useState<number | undefined>(undefined);

  // Quiz key to force re-render/fresh question generation on restart
  const [quizKey, setQuizKey] = useState(1);

  // Save settings when modified
  const handleUpdateSettings = (newSettings: TeacherSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Update records
  const handleUpdateRecord = (newRecord: HighScoreRecord) => {
    setRecord(newRecord);
    saveRecord(newRecord);
  };

  const handleResetRecord = () => {
    const fresh = resetRecord();
    setRecord(fresh);
    soundEffects.pop();
  };

  // Navigation handlers
  const handleNavigateToGame = (tableNum?: number) => {
    setGameTargetTable(tableNum);
    setCurrentScreen('module3');
  };

  const handleOpenCertificate = (score: number = 10, total: number = 10) => {
    setCertScore(score);
    setCertTotal(total);
    setIsCertificateOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/50 via-sky-50/30 to-amber-50/40 font-sans text-slate-800">
      {/* Top Navigation */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={s => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setCurrentScreen(s);
        }}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenTeacherSettings={() => setIsSettingsOpen(true)}
        onOpenCertificate={() => handleOpenCertificate(record.stars, 10)}
        record={record}
      />

      {/* Main Screen Content */}
      <main className="flex-1 pb-16">
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            onNavigate={s => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentScreen(s);
            }}
            settings={settings}
            record={record}
            onOpenTeacherSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentScreen === 'lesson1_1' && (
          <Chapter1Lesson1
            settings={settings}
            record={record}
            onUpdateRecord={handleUpdateRecord}
            onNavigateToLesson2={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentScreen('lesson1_2');
            }}
          />
        )}

        {currentScreen === 'lesson1_2' && (
          <Chapter1Lesson2
            settings={settings}
            record={record}
            onUpdateRecord={handleUpdateRecord}
            onNavigateToModule1={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentScreen('module1');
            }}
            onNavigateToLesson1={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentScreen('lesson1_1');
            }}
          />
        )}

        {currentScreen === 'module1' && (
          <Module1Builder
            settings={settings}
            record={record}
            onUpdateRecord={handleUpdateRecord}
            onNavigateToModule2={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentScreen('module2');
            }}
          />
        )}

        {currentScreen === 'module2' && (
          <Module2Explorer
            settings={settings}
            record={record}
            onUpdateRecord={handleUpdateRecord}
            onNavigateToGame={handleNavigateToGame}
          />
        )}

        {currentScreen === 'module3' && (
          <Module3CustomGame
            settings={settings}
            record={record}
            onUpdateRecord={handleUpdateRecord}
            preselectedTable={gameTargetTable}
          />
        )}

        {currentScreen === 'module4' && (
          <Module4ArrayQuiz
            settings={settings}
            record={record}
            onUpdateRecord={handleUpdateRecord}
            onNavigateToMastery={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentScreen('module5');
            }}
          />
        )}

        {currentScreen === 'module5' && (
          <Module5MasteryQuiz
            key={quizKey}
            settings={settings}
            record={record}
            onUpdateRecord={handleUpdateRecord}
            onOpenCertificate={handleOpenCertificate}
            onRestartQuiz={() => setQuizKey(k => k + 1)}
          />
        )}
      </main>

      {/* Playful Footer */}
      <footer className="border-t border-amber-200/80 bg-white/80 backdrop-blur-xs py-6 px-4 text-center print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <MrSaifAvatar size="sm" />
            <div className="text-left">
              <span className="font-fun font-bold text-amber-900 text-sm block">
                Multiplication World • Grade 3 Math
              </span>
              <span className="text-xs text-slate-500">
                Created with Teacher Mr. Saif (مستر سيف)
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Repeated Addition • Visual Arrays • Multiplication Tables (1 to 9)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.pop();
                setIsSettingsOpen(true);
              }}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors"
            >
              ⚙️ Teacher Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Teacher / Parent Settings Modal */}
      <TeacherSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleUpdateSettings}
        record={record}
        onResetRecord={handleResetRecord}
      />

      {/* Certificate of Achievement Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        studentName={settings.studentName}
        score={certScore}
        totalQuestions={certTotal}
      />
    </div>
  );
}
