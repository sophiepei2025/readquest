"use client";

import { useState, useMemo, useCallback, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getQuizByChapterOrUnitId } from "@/data/all-quizzes";
import { gradeQuiz } from "@/lib/grading/auto-grade";
import { personalize } from "@/lib/personalization";
import MultipleChoiceQuestion from "@/components/quiz/MultipleChoiceQuestion";
import TrueFalseQuestion from "@/components/quiz/TrueFalseQuestion";
import WordBankQuestion from "@/components/quiz/WordBankQuestion";
import ShortAnswerQuestion from "@/components/quiz/ShortAnswerQuestion";
import ClassificationQuestion from "@/components/quiz/ClassificationQuestion";
import type { Question } from "@/types";

interface QuizPageProps {
  params: Promise<{ chapterId: string }>;
}

type StudentAnswer = {
  questionId: string;
  answer: unknown;
};

export default function QuizPage({ params }: QuizPageProps) {
  const { chapterId } = use(params);
  const quiz = getQuizByChapterOrUnitId(chapterId);
  const [studentName, setStudentName] = useState("Simon");
  const [studentId, setStudentId] = useState("stu-simon");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, unknown>>(new Map());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gradingResult, setGradingResult] = useState<ReturnType<
    typeof gradeQuiz
  > | null>(null);
  const [direction, setDirection] = useState(0); // -1 = prev, 1 = next
  const [leaderboard, setLeaderboard] = useState<Array<{ rank: number; studentName: string; score: number; totalMarks: number; avatarUrl?: string }>>([]);
  const [challengeInfo, setChallengeInfo] = useState<{ name: string; inviteCode: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Load user session if available
  useMemo(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("readquest_user");
      const storedId = localStorage.getItem("readquest_user_id");
      if (storedName) setStudentName(storedName);
      if (storedId) setStudentId(storedId);
    }
  }, []);

  const questions = quiz.questions;
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // Personalize scenario templates
  const personalizedQuestion = useMemo(() => {
    if (!currentQuestion) return currentQuestion;
    const q = { ...currentQuestion } as any;
    
    if (q.type === 'multiple_choice' && q.scenario) {
      q.scenario = personalize(q.scenario, { student_name: studentName });
    } else if ('stem' in q && typeof q.stem === 'string') {
      q.stem = personalize(q.stem, { student_name: studentName });
    }
    
    return q;
  }, [currentQuestion, studentName]);

  const handleAnswer = useCallback(
    (questionId: string, answer: unknown) => {
      setAnswers((prev) => {
        const next = new Map(prev);
        next.set(questionId, answer);
        return next;
      });
    },
    []
  );

  const handleSubmit = async () => {
    const studentAnswers: StudentAnswer[] = questions.map((q) => ({
      questionId: q.id,
      answer: answers.get(q.id) ?? null,
    }));
    const result = gradeQuiz(questions, studentAnswers);
    setGradingResult(result);
    setIsSubmitted(true);

    // Filter wrong question IDs for secure personal storage
    const wrongIds = result.answerGrades.filter((g) => !g.isCorrect).map((g) => g.questionId);

    // Record attempt in Turso database
    try {
      await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          bookId: quiz.chapterId.startsWith('bio-') ? 'book-biology-ace' : quiz.chapterId.startsWith('chem-') ? 'book-chemistry-ace' : quiz.chapterId.startsWith('math-') ? 'book-math-ace' : quiz.chapterId.startsWith('alg-') ? 'book-algebra-ace' : 'book-science-ace',
          unitId: quiz.chapterId,
          score: result.totalScore,
          totalMarks: result.totalMarks,
          percentage: result.percentage,
          wrongQuestionIds: wrongIds,
          feedbackSummary: {
            parts: result.parts,
            weakTags: result.weakKnowledgeTags,
          },
        }),
      });

      // Load Big Fat Challenge Leaderboard
      const lbRes = await fetch('/api/challenge/challenge-science-7a/leaderboard');
      const lbData = await lbRes.json();
      if (lbData.success) {
        setLeaderboard(lbData.leaderboard);
        setChallengeInfo(lbData.challenge);
      }
    } catch (err) {
      console.error('Failed to sync quiz attempt:', err);
    }
  };

  const goTo = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const answeredCount = answers.size;

  // Slide animation variants
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  // Render results page
  if (isSubmitted && gradingResult) {
    return (
      <div className="space-y-6">
        {/* Score Header */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-center text-white shadow-xl"
        >
          <div className="text-6xl font-bold">{gradingResult.percentage}%</div>
          <div className="mt-2 text-lg text-blue-100">
            {gradingResult.totalScore} / {gradingResult.totalMarks} marks
          </div>
          <div className="mt-1 text-sm text-blue-200">
            {gradingResult.percentage >= 80
              ? "🎉 Excellent work!"
              : gradingResult.percentage >= 60
                ? "👍 Good effort! Keep it up!"
                : "💪 Keep practicing, you'll get there!"}
          </div>
        </motion.div>

        {/* Part-by-Part Results */}
        <div className="space-y-3">
          <h3 className="font-semibold">📋 分项成绩</h3>
          {gradingResult.parts.map((part, idx) => (
            <motion.div
              key={part.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{part.label}</span>
                <span
                  className={`text-sm font-semibold ${
                    part.score / part.marks >= 0.8
                      ? "text-green-600"
                      : part.score / part.marks >= 0.6
                        ? "text-amber-600"
                        : "text-red-600"
                  }`}
                >
                  {part.score}/{part.marks}
                </span>
              </div>
              {part.feedback && (
                <p className="mt-1 text-sm text-slate-500">{part.feedback}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Weak Areas */}
        {gradingResult.weakKnowledgeTags.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">
              ⚠️ 需要加强的知识点
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {gradingResult.weakKnowledgeTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-amber-200 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-800 dark:text-amber-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        {gradingResult.recommendation && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">
              💡 建议
            </h3>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              {gradingResult.recommendation}
            </p>
          </div>
        )}

        {/* Big Fat Challenge Leaderboard Card */}
        <div className="rounded-3xl border border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-6 dark:border-amber-800 dark:bg-slate-900 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-amber-200/60 pb-4 dark:border-amber-900/40">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🏆</span>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                  Big Fat Challenge · 班级答题挑战榜
                </h3>
                <p className="text-xs text-amber-900/70 dark:text-amber-300">
                  当前房间：{challengeInfo?.name || "7th Grade Science Squad 🏆"}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const code = challengeInfo?.inviteCode || "SCIENCE7";
                navigator.clipboard.writeText(code);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100/60 dark:border-amber-700 dark:bg-slate-800 dark:text-amber-200 transition-all active:scale-95"
            >
              <span>🔑 邀请码: {challengeInfo?.inviteCode || "SCIENCE7"}</span>
              <span>{copiedCode ? "✓ 已复制" : "📋 复制"}</span>
            </button>
          </div>

          {/* Rankings list */}
          <div className="mt-4 space-y-2">
            {(leaderboard.length > 0 ? leaderboard : [
              { rank: 1, studentName: "Leo M.", score: 48, totalMarks: 50, avatarUrl: "L" },
              { rank: 2, studentName: studentName, score: gradingResult.totalScore, totalMarks: gradingResult.totalMarks, avatarUrl: "S" },
              { rank: 3, studentName: "Emma W.", score: 46, totalMarks: 50, avatarUrl: "E" },
              { rank: 4, studentName: "Sophia T.", score: 42, totalMarks: 50, avatarUrl: "T" },
              { rank: 5, studentName: "Lucas K.", score: 38, totalMarks: 50, avatarUrl: "K" },
            ]).slice(0, 5).map((item, idx) => {
              const isCurrent = item.studentName.includes(studentName) || item.studentName === studentName;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                    isCurrent
                      ? "border-2 border-blue-500 bg-blue-50/80 shadow-sm dark:bg-blue-950/40"
                      : "border border-amber-200/40 bg-white/80 dark:border-slate-800 dark:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center font-extrabold text-sm ${
                      item.rank === 1 ? "text-amber-500 text-lg" : item.rank === 2 ? "text-slate-400 text-base" : item.rank === 3 ? "text-amber-700 text-base" : "text-slate-400"
                    }`}>
                      {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : item.rank === 3 ? "🥉" : `#${item.rank}`}
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                      {item.avatarUrl || item.studentName[0]}
                    </span>
                    <span className={`text-sm font-bold ${isCurrent ? "text-blue-700 dark:text-blue-300" : "text-slate-800 dark:text-slate-200"}`}>
                      {item.studentName} {isCurrent && <span className="text-[10px] bg-blue-100 px-1.5 py-0.5 rounded text-blue-700 font-semibold ml-1">你</span>}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {item.score}
                    </span>
                    <span className="text-xs text-slate-400 font-medium"> / {item.totalMarks} 分</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Privacy Reassurance Note */}
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-amber-900/80 dark:text-amber-300/80 bg-amber-100/50 dark:bg-amber-950/30 p-2.5 rounded-xl">
            <span>🔒</span>
            <span>隐私守护：排行榜接口仅对受邀成员展示总分与名次，你的错题与解析细节仅自己与家长可见。</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setIsSubmitted(false);
              setGradingResult(null);
              setCurrentIndex(0);
            }}
            className="flex-1 rounded-2xl bg-blue-600 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            📝 查看逐题解析
          </button>
          <a
            href="/student/dashboard"
            className="flex-1 rounded-2xl border-2 border-slate-200 bg-white py-3 text-center font-semibold text-slate-700 transition-all hover:border-blue-300 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            🏠 返回首页
          </a>
        </div>
      </div>
    );
  }

  // Render quiz taking interface
  return (
    <div className="space-y-4">
      {/* Quiz Header */}
      <div>
        <h1 className="text-xl font-bold">{quiz.title}</h1>
        <p className="text-sm text-slate-500">
          {quiz.totalMarks} marks · {quiz.suggestedMinutes} minutes suggested
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Question {currentIndex + 1} / {questions.length}
          </span>
          <span>{answeredCount} answered</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <motion.div
            className="h-full rounded-full bg-blue-500"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Part Label */}
      {currentQuestion && (
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            Part {currentQuestion.partLabel}
          </span>
          <span className="text-xs text-slate-400">
            {currentQuestion.marks} mark{currentQuestion.marks > 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Question Card Container — Always visible and rock-solid on iPad */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 min-h-[280px] transition-all">
        {currentQuestion ? (
          renderQuestion(personalizedQuestion || currentQuestion, answers, handleAnswer, isSubmitted)
        ) : (
          <div className="flex h-40 items-center justify-center text-slate-400">
            正在加载题目...
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => goTo(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-30 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          ← 上一题
        </button>

        {/* Question dots */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => goTo(idx)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                idx === currentIndex
                  ? "scale-125 bg-blue-600"
                  : answers.has(q.id)
                    ? "bg-blue-300 dark:bg-blue-700"
                    : "bg-slate-200 dark:bg-slate-700"
              }`}
              aria-label={`Question ${idx + 1}`}
            />
          ))}
        </div>

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-700 active:scale-[0.98]"
          >
            {answeredCount < questions.length ? `✅ 提交答卷 (${answeredCount}/${questions.length})` : "✅ 提交答卷"}
          </button>
        ) : (
          <button
            onClick={() => goTo(Math.min(questions.length - 1, currentIndex + 1))}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
          >
            下一题 →
          </button>
        )}
      </div>
    </div>
  );
}

/** Render the appropriate question component based on type */
function renderQuestion(
  question: Question,
  answers: Map<string, unknown>,
  onAnswer: (questionId: string, answer: unknown) => void,
  graded: boolean
) {
  const currentAnswer = answers.get(question.id);

  switch (question.type) {
    case "multiple_choice":
      return (
        <MultipleChoiceQuestion
          question={question}
          currentAnswer={currentAnswer as string | undefined}
          onAnswer={(answer) => onAnswer(question.id, answer)}
          graded={graded}
        />
      );
    case "true_false":
      return (
        <TrueFalseQuestion
          question={question}
          currentAnswer={currentAnswer as { choice: boolean; correction?: string } | undefined}
          onAnswer={(answer) => onAnswer(question.id, answer)}
          graded={graded}
        />
      );
    case "word_bank":
      return (
        <WordBankQuestion
          question={question}
          currentAnswer={currentAnswer as Record<string, string> | undefined}
          onAnswer={(answer) => onAnswer(question.id, answer)}
          graded={graded}
        />
      );
    case "short_answer":
      return (
        <ShortAnswerQuestion
          question={question}
          currentAnswer={currentAnswer as string | undefined}
          onAnswer={(answer) => onAnswer(question.id, answer)}
          graded={graded}
        />
      );
    case "classification":
      return (
        <ClassificationQuestion
          question={question}
          currentAnswer={currentAnswer as Record<string, string> | undefined}
          onAnswer={(answer) => onAnswer(question.id, answer)}
          graded={graded}
        />
      );
    default:
      return (
        <div className="py-8 text-center text-slate-500">
          <p className="text-lg">🚧 This question type is coming soon</p>
          <p className="mt-1 text-sm">Type: {question.type}</p>
        </div>
      );
  }
}
