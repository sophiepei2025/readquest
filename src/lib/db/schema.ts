import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ─── Books ──────────────────────────────────────────────────────────────────
export const books = sqliteTable('books', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  series: text('series'),
  publisher: text('publisher'),
  coverImageUrl: text('cover_image_url'),
  totalPages: integer('total_pages'),
  gradeRange: text('grade_range'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// ─── Units ──────────────────────────────────────────────────────────────────
export const units = sqliteTable('units', {
  id: text('id').primaryKey(),
  bookId: text('book_id').notNull().references(() => books.id, { onDelete: 'cascade' }),
  orderIndex: integer('order_index').notNull(),
  title: text('title').notNull(),
  pageStart: integer('page_start'),
  pageEnd: integer('page_end'),
});

// ─── Chapters ───────────────────────────────────────────────────────────────
export const chapters = sqliteTable('chapters', {
  id: text('id').primaryKey(),
  unitId: text('unit_id').notNull().references(() => units.id, { onDelete: 'cascade' }),
  orderIndex: integer('order_index').notNull(),
  title: text('title').notNull(),
  pageStart: integer('page_start'),
  pageEnd: integer('page_end'),
  estimatedMinutes: integer('estimated_minutes').default(15),
});

// ─── Knowledge Tags ─────────────────────────────────────────────────────────
export const knowledgeTags = sqliteTable('knowledge_tags', {
  id: text('id').primaryKey(), // e.g. 'SCI-METHOD-HYPOTHESIS'
  name: text('name').notNull(),
  subjectArea: text('subject_area').notNull(),
  difficulty: text('difficulty').notNull().default('medium'),
  parentTagId: text('parent_tag_id'),
});

// ─── Quizzes ────────────────────────────────────────────────────────────────
export const quizzes = sqliteTable('quizzes', {
  id: text('id').primaryKey(),
  chapterId: text('chapter_id').notNull().references(() => chapters.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  totalMarks: integer('total_marks').notNull().default(50),
  suggestedMinutes: integer('suggested_minutes').default(30),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// ─── Questions ──────────────────────────────────────────────────────────────
export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  quizId: text('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  partLabel: text('part_label').notNull(), // 'A', 'B', 'C', 'D'
  orderIndex: integer('order_index').notNull(),
  type: text('type').notNull(), // 'word_bank', 'matching', 'true_false', etc.
  content: text('content', { mode: 'json' }).notNull(),
  correctAnswer: text('correct_answer', { mode: 'json' }).notNull(),
  marks: integer('marks').notNull().default(2),
  explanation: text('explanation'),
  scenarioTemplate: text('scenario_template'), // contains {{student_name}}
});

// ─── Families (Parent Purchasing Account) ───────────────────────────────────
export const families = sqliteTable('families', {
  id: text('id').primaryKey(),
  parentName: text('parent_name').notNull(),
  parentEmail: text('parent_email').notNull().unique(),
  passwordHash: text('password_hash').notNull().default('123456'),
  plan: text('plan').notNull().default('starter'), // 'free_trial', 'starter', 'unlimited'
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// Backward compatibility alias
export const parents = families;

// ─── Students (Kids under a Family) ─────────────────────────────────────────
export const students = sqliteTable('students', {
  id: text('id').primaryKey(),
  familyId: text('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  grade: text('grade').default('Grade 7'),
  studentCode: text('student_code').notNull().unique(), // e.g. 'SIMON2026'
  passwordHash: text('password_hash').notNull().default('123456'),
  avatarUrl: text('avatar_url').default('S'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// ─── Attempts (Quiz Submission Logs) ────────────────────────────────────────
export const attempts = sqliteTable('attempts', {
  id: text('id').primaryKey(),
  studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  bookId: text('book_id').notNull(),
  unitId: text('unit_id').notNull(),
  score: integer('score').notNull(),
  totalMarks: integer('total_marks').notNull(),
  percentage: integer('percentage').notNull(),
  // Array of string question IDs that the student got wrong
  // Note: NEVER exposed to public leaderboard API
  wrongQuestionIds: text('wrong_question_ids', { mode: 'json' }).$type<string[]>().default([]),
  feedbackSummary: text('feedback_summary', { mode: 'json' }),
  completedAt: text('completed_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// Backward compatibility alias
export const quizAttempts = attempts;

export const answers = sqliteTable('answers', {
  id: text('id').primaryKey(),
  attemptId: text('attempt_id').notNull().references(() => attempts.id, { onDelete: 'cascade' }),
  questionId: text('question_id').notNull().references(() => questions.id),
  studentAnswer: text('student_answer', { mode: 'json' }),
  isCorrect: integer('is_correct', { mode: 'boolean' }).notNull(),
  score: integer('score').notNull(),
  maxScore: integer('max_score').notNull(),
  feedback: text('feedback'),
});

// ─── Big Fat Challenge (Rooms & Leaderboard) ────────────────────────────────
export const challenges = sqliteTable('challenges', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  bookId: text('book_id'), // Optional: limit to a specific book, or null for all
  inviteCode: text('invite_code').notNull().unique(), // e.g. 'SCIENCE7'
  createdBy: text('created_by'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// Backward compatibility alias
export const challengeRooms = challenges;

export const challengeMembers = sqliteTable('challenge_members', {
  id: text('id').primaryKey(),
  challengeId: text('challenge_id').notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  joinedAt: text('joined_at').default(sql`(CURRENT_TIMESTAMP)`),
});
