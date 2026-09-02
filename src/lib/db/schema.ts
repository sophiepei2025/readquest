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

// ─── Parents & Students ─────────────────────────────────────────────────────
export const parents = sqliteTable('parents', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const students = sqliteTable('students', {
  id: text('id').primaryKey(),
  parentId: text('parent_id').notNull().references(() => parents.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  gradeLevel: text('grade_level'),
  avatarUrl: text('avatar_url'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// ─── Quiz Attempts & Answers ────────────────────────────────────────────────
export const quizAttempts = sqliteTable('quiz_attempts', {
  id: text('id').primaryKey(),
  quizId: text('quiz_id').notNull().references(() => quizzes.id),
  studentId: text('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(),
  totalMarks: integer('total_marks').notNull(),
  percentage: integer('percentage').notNull(),
  feedbackSummary: text('feedback_summary', { mode: 'json' }),
  startedAt: text('started_at').default(sql`(CURRENT_TIMESTAMP)`),
  completedAt: text('completed_at'),
});

export const answers = sqliteTable('answers', {
  id: text('id').primaryKey(),
  attemptId: text('attempt_id').notNull().references(() => quizAttempts.id, { onDelete: 'cascade' }),
  questionId: text('question_id').notNull().references(() => questions.id),
  studentAnswer: text('student_answer', { mode: 'json' }),
  isCorrect: integer('is_correct', { mode: 'boolean' }).notNull(),
  score: integer('score').notNull(),
  maxScore: integer('max_score').notNull(),
  feedback: text('feedback'),
});
