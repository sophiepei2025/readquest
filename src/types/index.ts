/**
 * ReadQuest — Unified Type System
 *
 * This is the single source of truth for all question types, quiz structures,
 * and grading interfaces used across the application.
 */

// ─── Knowledge Tags ─────────────────────────────────────────────────────────

export interface KnowledgeTag {
  id: string;
  name: string;
  subjectArea: string;
  difficulty: 'easy' | 'medium' | 'hard';
  parentTagId?: string;
}

// ─── Question Types (flat structure for simplicity) ─────────────────────────

export type QuestionType =
  | 'word_bank'
  | 'matching'
  | 'true_false'
  | 'classification'
  | 'multiple_choice'
  | 'short_answer'
  | 'comprehensive';

/** Base question fields shared by all types */
interface BaseQuestion {
  id: string;
  partLabel: string; // 'A', 'B', 'C', 'D'
  type: QuestionType;
  marks: number;
  knowledgeTags: string[];
  explanation?: string;
}

/** Part A — Word Bank fill-in-the-blank */
export interface WordBankQuestion extends BaseQuestion {
  type: 'word_bank';
  /** The sentence with [blank] markers */
  stem: string;
  /** Correct answers for each blank, in order */
  blanks: string[];
  /** All available words to choose from (includes correct + distractors) */
  wordBank: string[];
}

/** Part A — Matching pairs */
export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  /** Correct pairs */
  pairs: Array<{ left: string; right: string }>;
  /** Right column shuffled for display */
  shuffledRight: string[];
}

/** Part B — True/False with correction */
export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  /** The statement to evaluate */
  statement: string;
  /** Whether the statement is true */
  isTrue: boolean;
  /** If false, the correct version */
  correctionText?: string;
}

/** Part B — Classification/Categorization */
export interface ClassificationQuestion extends BaseQuestion {
  type: 'classification';
  /** Category names (e.g. ['Physical Change', 'Chemical Change']) */
  categories: string[];
  /** Items to categorize */
  items: Array<{ text: string; correctCategory: string }>;
}

/** Part C — Multiple Choice (with optional scenario using {{student_name}}) */
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  /** The question text / scenario (may contain {{student_name}}) */
  scenario: string;
  /** Answer options */
  options: Array<{ id: string; text: string }>;
  /** ID of the correct option */
  correctOptionId: string;
}

/** Part C — Short Answer */
export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short_answer';
  /** The question text (may contain {{student_name}}) */
  stem: string;
  /** Keywords that should appear in a good answer */
  keywords: string[];
  /** A model answer for display after grading */
  sampleAnswer: string;
}

/** Part D — Comprehensive (contains sub-questions) */
export interface ComprehensiveQuestion extends BaseQuestion {
  type: 'comprehensive';
  /** The main passage/prompt */
  stem: string;
  /** Sub-questions (can be any other question type) */
  subQuestions: Question[];
}

/** Union of all question types */
export type Question =
  | WordBankQuestion
  | MatchingQuestion
  | TrueFalseQuestion
  | ClassificationQuestion
  | MultipleChoiceQuestion
  | ShortAnswerQuestion
  | ComprehensiveQuestion;

// ─── Quiz ───────────────────────────────────────────────────────────────────

export interface Quiz {
  id: string;
  chapterId: string;
  title: string;
  totalMarks: number;
  suggestedMinutes: number;
  questions: Question[];
}

// ─── Student Answers ────────────────────────────────────────────────────────

export interface StudentAnswer {
  questionId: string;
  answer: unknown;
}

// ─── Grading Results ────────────────────────────────────────────────────────

export interface AnswerGrade {
  questionId: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
  feedback: string;
  weakTags: string[];
}

export interface PartResult {
  label: string;
  score: number;
  marks: number;
  feedback: string;
  weakTags: string[];
}

export interface GradingResult {
  totalScore: number;
  totalMarks: number;
  percentage: number;
  parts: PartResult[];
  weakKnowledgeTags: string[];
  recommendation: string;
  answerGrades: AnswerGrade[];
}

// ─── Book Structure ─────────────────────────────────────────────────────────

export interface Book {
  id: string;
  title: string;
  series: string;
  publisher: string;
  coverImageUrl?: string;
  totalPages: number;
  gradeRange: string;
}

export interface Unit {
  id: string;
  bookId: string;
  orderIndex: number;
  title: string;
  pageStart: number;
  pageEnd: number;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  unitId: string;
  orderIndex: number;
  title: string;
  pageStart: number;
  pageEnd: number;
  estimatedMinutes: number;
}

export interface BookWithUnits extends Book {
  units: Unit[];
}

// ─── Student & Parent ───────────────────────────────────────────────────────

export interface Student {
  id: string;
  parentId: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  gradeLevel?: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  students: Student[];
}

export interface ReadingPlan {
  id: string;
  studentId: string;
  bookId: string;
  timesPerWeek: number;
  minutesPerSession: number;
  startDate: string;
  endDate?: string;
}

export interface PlanItem {
  id: string;
  planId: string;
  chapterId: string;
  scheduledDate: string;
  status: 'pending' | 'completed' | 'skipped';
  completedAt?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  totalMarks: number;
  percentage: number;
  startedAt: string;
  completedAt?: string;
  gradingResult?: GradingResult;
  periodId?: string; // e.g. "2026-W36"
}

// ─── Challenge Room & Leaderboard ──────────────────────────────────────────

export interface ChallengeRoom {
  id: string;
  name: string;
  pinCode: string; // 6-digit PIN (e.g. "849203")
  createdBy: string;
  targetBookId?: string;
  createdAt: string;
}

export interface ChallengeMember {
  id: string;
  roomId: string;
  studentId: string;
  studentName: string;
  avatarUrl?: string;
  weeklyPoints: number;
  lastWeekPoints: number;
  updatedAt: string;
}

export interface LeaderboardMemberItem {
  studentId: string;
  studentName: string;
  avatarUrl?: string;
  weeklyPoints: number;
  lastWeekPoints: number;
  deltaVsLastWeek: number;
  rank: number;
  isFastestProgress?: boolean;
}

export interface LeaderboardData {
  roomId: string;
  roomName: string;
  periodId: string;
  isSmallRoom: boolean; // < 5 members fallback
  totalMembers: number;
  podium: LeaderboardMemberItem[]; // Rank 1, 2, 3
  runners: LeaderboardMemberItem[]; // Rank 4+
  lastResetAt?: string;
}
