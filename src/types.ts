export type ScreenId =
  | 'welcome'
  | 'lesson1_1'
  | 'lesson1_2'
  | 'module1'
  | 'module2'
  | 'module3'
  | 'module4'
  | 'module5';

export type ContainerTheme = 'apples' | 'stars' | 'ducks' | 'cookies' | 'aliens';

export interface ThemeOption {
  id: ContainerTheme;
  name: string;
  containerName: string;
  itemName: string;
  itemPlural: string;
  itemEmoji: string;
  containerEmoji: string;
  bgClass: string;
  borderClass: string;
}

export interface TeacherSettings {
  studentName: string;
  activeTables: number[]; // e.g. [1, 2, 3, 4, 5, 6, 7, 8, 9]
  maxMultiplier: 10 | 12;
  timeLimitEnabled: boolean;
  timePerQuestion: number; // in seconds, default 15
  soundEnabled: boolean;
  speechEnabled: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  color: string;
}

export interface QuizQuestion {
  id: string;
  type: 'repeated-to-mult' | 'mult-to-repeated' | 'missing-factor' | 'array-model' | 'word-problem';
  question: string;
  groups?: number;
  itemsPerGroup?: number;
  repeatedText?: string;
  multText?: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  visualRows?: number;
  visualCols?: number;
  visualEmoji?: string;
}

export interface HighScoreRecord {
  stars: number;
  gamesPlayed: number;
  quizzesCompleted: number;
  badges: string[];
  bestStreak: number;
}
