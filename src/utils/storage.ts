import { TeacherSettings, HighScoreRecord, Badge } from '../types';

const SETTINGS_KEY = 'multiplication_world_settings_v1';
const RECORD_KEY = 'multiplication_world_record_v1';

export const DEFAULT_SETTINGS: TeacherSettings = {
  studentName: 'Math Champ',
  activeTables: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  maxMultiplier: 10,
  timeLimitEnabled: false,
  timePerQuestion: 20,
  soundEnabled: true,
  speechEnabled: true,
};

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_step',
    title: 'First Step Explorer',
    description: 'Explored repeated addition with containers!',
    icon: '🌱',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  },
  {
    id: 'array_wizard',
    title: 'Array Wizard 🧙‍♂️',
    description: 'Mastered rows and columns in the Array Quiz!',
    icon: '🧙‍♂️',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
  },
  {
    id: 'table_master',
    title: 'Times Table Champ 🏆',
    description: 'Scored high in the Custom Tables practice game!',
    icon: '🏆',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
  },
  {
    id: 'speed_calculator',
    title: 'Speed Calculator ⚡',
    description: 'Answered rapid questions with blazing speed!',
    icon: '⚡',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  {
    id: 'mr_saif_star',
    title: "Mr. Saif's Star Math Genius 🌟",
    description: 'Completed the 10-Question Final Mastery Quiz!',
    icon: '🌟',
    color: 'bg-rose-100 text-rose-700 border-rose-300',
  },
  {
    id: 'properties_master',
    title: 'Rules of Multiplication Master 📘',
    description: 'Mastered multiplier rules & commutative property in Lesson 1-1!',
    icon: '📘',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
  },
  {
    id: 'breaking_up_expert',
    title: 'Number Breaker Expert 🧩',
    description: 'Mastered the Distributive Property by breaking up numbers in Lesson 1-2!',
    icon: '🧩',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
  },
  {
    id: 'repeated_hero',
    title: 'Repeated Addition Hero 🦸‍♀️',
    description: 'Converted addition sentences to multiplication like a pro!',
    icon: '🦸‍♀️',
    color: 'bg-teal-100 text-teal-700 border-teal-300',
  },
  {
    id: 'chapter1_grandmaster',
    title: 'Chapter 1 Grandmaster 👑',
    description: 'Mastered Chapter 1 rules, distributive decomposition, and the mastery quiz!',
    icon: '👑',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
  },
];

const CH1_PROGRESS_KEY = 'grade3_math_ch1_progress_v1';

export function getCh1CompletedQuestions(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CH1_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCh1CompletedQuestion(questionId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const list = getCh1CompletedQuestions();
    if (!list.includes(questionId)) {
      list.push(questionId);
      localStorage.setItem(CH1_PROGRESS_KEY, JSON.stringify(list));
    }
    return list;
  } catch {
    return [];
  }
}

export function getStoredSettings(): TeacherSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: TeacherSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage quota or privacy mode
  }
}

export function getStoredRecord(): HighScoreRecord {
  if (typeof window === 'undefined') {
    return { stars: 0, gamesPlayed: 0, quizzesCompleted: 0, badges: [], bestStreak: 0 };
  }
  try {
    const raw = localStorage.getItem(RECORD_KEY);
    if (!raw) {
      return { stars: 0, gamesPlayed: 0, quizzesCompleted: 0, badges: [], bestStreak: 0 };
    }
    return JSON.parse(raw);
  } catch {
    return { stars: 0, gamesPlayed: 0, quizzesCompleted: 0, badges: [], bestStreak: 0 };
  }
}

export function saveRecord(record: HighScoreRecord): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RECORD_KEY, JSON.stringify(record));
  } catch {
    // Storage quota
  }
}

export function resetRecord(): HighScoreRecord {
  const fresh: HighScoreRecord = {
    stars: 0,
    gamesPlayed: 0,
    quizzesCompleted: 0,
    badges: [],
    bestStreak: 0,
  };
  saveRecord(fresh);
  return fresh;
}
