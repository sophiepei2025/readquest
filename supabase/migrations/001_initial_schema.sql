-- Books
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  series TEXT,
  publisher TEXT,
  cover_image_url TEXT,
  total_pages INTEGER,
  grade_range TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Units (belong to a book)
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  page_start INTEGER,
  page_end INTEGER,
  UNIQUE(book_id, order_index)
);

-- Chapters (belong to a unit)
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  title TEXT NOT NULL,
  page_start INTEGER,
  page_end INTEGER,
  estimated_minutes INTEGER DEFAULT 30,
  UNIQUE(unit_id, order_index)
);

-- Knowledge tags (cross-book, unified taxonomy)
CREATE TABLE knowledge_tags (
  id TEXT PRIMARY KEY, -- e.g. 'SCI-PHYS-MOTION-001'
  name TEXT NOT NULL,
  subject_area TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  parent_tag_id TEXT REFERENCES knowledge_tags(id)
);

-- Quizzes (one per chapter)
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  total_marks INTEGER NOT NULL,
  suggested_minutes INTEGER DEFAULT 60,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Questions (belong to a quiz)
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  part_label TEXT, -- 'A', 'B', 'C', 'D'
  order_index INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('word_bank', 'matching', 'true_false', 'classification', 'multiple_choice', 'short_answer', 'comprehensive')),
  content JSONB NOT NULL,
  correct_answer JSONB NOT NULL,
  marks INTEGER NOT NULL DEFAULT 1,
  explanation TEXT,
  scenario_template TEXT, -- contains {{student_name}}
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Question-tag junction
CREATE TABLE question_tags (
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  tag_id TEXT REFERENCES knowledge_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (question_id, tag_id)
);

-- Parents (auth users with parent role)
CREATE TABLE parents (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Students (linked to parent)
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  grade_level TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id),
  status TEXT CHECK (status IN ('trial', 'active', 'expired')) DEFAULT 'trial',
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reading plans
CREATE TABLE reading_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id),
  times_per_week INTEGER DEFAULT 3,
  minutes_per_session INTEGER DEFAULT 20,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Plan items
CREATE TABLE plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES reading_plans(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id),
  scheduled_date DATE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'skipped')) DEFAULT 'pending',
  completed_at TIMESTAMPTZ
);

-- Quiz attempts
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  score INTEGER,
  total_marks INTEGER,
  percentage NUMERIC(5,2),
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  feedback JSONB
);

-- Answers (individual question responses)
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id),
  student_answer JSONB,
  is_correct BOOLEAN,
  marks_awarded INTEGER DEFAULT 0,
  marks INTEGER NOT NULL,
  feedback TEXT
);

-- Indexes for performance
CREATE INDEX idx_units_book ON units(book_id);
CREATE INDEX idx_chapters_unit ON chapters(unit_id);
CREATE INDEX idx_questions_quiz ON questions(quiz_id);
CREATE INDEX idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_answers_attempt ON answers(attempt_id);
CREATE INDEX idx_plan_items_plan ON plan_items(plan_id);
CREATE INDEX idx_students_parent ON students(parent_id);

-- Enable RLS on all tables
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Base tables: readable by all authenticated users
CREATE POLICY "Public read access to books" ON books FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access to units" ON units FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access to chapters" ON chapters FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access to tags" ON knowledge_tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access to quizzes" ON quizzes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access to questions" ON questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read access to question_tags" ON question_tags FOR SELECT TO authenticated USING (true);

-- Parents can read and update their own record
CREATE POLICY "Parents can view their own profile" ON parents FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Parents can update their own profile" ON parents FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Parents can manage their own students
CREATE POLICY "Parents can view their students" ON students FOR SELECT TO authenticated USING (parent_id = auth.uid());
CREATE POLICY "Parents can insert their students" ON students FOR INSERT TO authenticated WITH CHECK (parent_id = auth.uid());
CREATE POLICY "Parents can update their students" ON students FOR UPDATE TO authenticated USING (parent_id = auth.uid());
CREATE POLICY "Parents can delete their students" ON students FOR DELETE TO authenticated USING (parent_id = auth.uid());

-- Subscriptions are tied to parent_id
CREATE POLICY "Parents can view their subscriptions" ON subscriptions FOR SELECT TO authenticated USING (parent_id = auth.uid());

-- Reading plans based on students
CREATE POLICY "Parents can view their students' plans" ON reading_plans FOR SELECT TO authenticated USING (
  student_id IN (SELECT id FROM students WHERE parent_id = auth.uid())
);
CREATE POLICY "Parents can manage their students' plans" ON reading_plans FOR ALL TO authenticated USING (
  student_id IN (SELECT id FROM students WHERE parent_id = auth.uid())
);

-- Plan items
CREATE POLICY "Parents can view their students' plan items" ON plan_items FOR SELECT TO authenticated USING (
  plan_id IN (SELECT id FROM reading_plans WHERE student_id IN (SELECT id FROM students WHERE parent_id = auth.uid()))
);
CREATE POLICY "Parents can manage their students' plan items" ON plan_items FOR ALL TO authenticated USING (
  plan_id IN (SELECT id FROM reading_plans WHERE student_id IN (SELECT id FROM students WHERE parent_id = auth.uid()))
);

-- Quiz attempts
CREATE POLICY "Parents can view their students' quiz attempts" ON quiz_attempts FOR SELECT TO authenticated USING (
  student_id IN (SELECT id FROM students WHERE parent_id = auth.uid())
);
CREATE POLICY "Parents can insert their students' quiz attempts" ON quiz_attempts FOR INSERT TO authenticated WITH CHECK (
  student_id IN (SELECT id FROM students WHERE parent_id = auth.uid())
);
CREATE POLICY "Parents can update their students' quiz attempts" ON quiz_attempts FOR UPDATE TO authenticated USING (
  student_id IN (SELECT id FROM students WHERE parent_id = auth.uid())
);

-- Answers
CREATE POLICY "Parents can view their students' answers" ON answers FOR SELECT TO authenticated USING (
  attempt_id IN (
    SELECT id FROM quiz_attempts WHERE student_id IN (
      SELECT id FROM students WHERE parent_id = auth.uid()
    )
  )
);
CREATE POLICY "Parents can insert their students' answers" ON answers FOR INSERT TO authenticated WITH CHECK (
  attempt_id IN (
    SELECT id FROM quiz_attempts WHERE student_id IN (
      SELECT id FROM students WHERE parent_id = auth.uid()
    )
  )
);
CREATE POLICY "Parents can update their students' answers" ON answers FOR UPDATE TO authenticated USING (
  attempt_id IN (
    SELECT id FROM quiz_attempts WHERE student_id IN (
      SELECT id FROM students WHERE parent_id = auth.uid()
    )
  )
);
