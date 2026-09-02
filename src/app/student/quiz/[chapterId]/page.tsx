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
  const studentName = "Simon"; // TODO: from auth context

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, unknown>>(new Map());
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gradingResult, setGradingResult] = useState<ReturnType<
    typeof gradeQuiz
  > | null>(null);
  const [direction, setDirection] = useState(0); // -1 = prev, 1 = next

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

  const handleSubmit = () => {
    const studentAnswers: StudentAnswer[] = questions.map((q) => ({
      questionId: q.id,
      answer: answers.get(q.id) ?? null,
    }));
    const result = gradeQuiz(questions, studentAnswers);
    setGradingResult(result);
    setIsSubmitted(true);
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
            disabled={answeredCount < questions.length}
            className="rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-700 disabled:opacity-50 active:scale-[0.98]"
          >
            ✅ 提交
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
