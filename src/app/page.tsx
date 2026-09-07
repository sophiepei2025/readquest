"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { allBooks, getBookById } from "@/data/all-books-data";
import { allQuizzes, getQuizByChapterOrUnitId } from "@/data/all-quizzes";

interface BookMeta {
  id: string;
  icon: string;
  name: string;
  subject: string;
  badgeColor: string;
  defaultQuizId: string;
}

const bookOptions: BookMeta[] = [
  { id: "book-science-ace", icon: "📗", name: "Science", subject: "科学综合 (Physics, Chem, Bio)", badgeColor: "bg-blue-100 text-blue-700", defaultQuizId: "ch-1" },
  { id: "book-biology-ace", icon: "🧬", name: "Biology", subject: "生物学 (Cells, Genetics & Body)", badgeColor: "bg-emerald-100 text-emerald-700", defaultQuizId: "bio-ch-9" },
  { id: "book-chemistry-ace", icon: "🧪", name: "Chemistry", subject: "化学 (Atoms, Moles & Reactions)", badgeColor: "bg-amber-100 text-amber-800", defaultQuizId: "chem-ch-8" },
  { id: "book-math-ace", icon: "📐", name: "Math", subject: "初中数学 (Numbers, Ratios & Geo)", badgeColor: "bg-indigo-100 text-indigo-700", defaultQuizId: "math-ch-15" },
  { id: "book-algebra-ace", icon: "🔢", name: "Algebra 1", subject: "代数 (Equations, Slope & Functions)", badgeColor: "bg-rose-100 text-rose-700", defaultQuizId: "alg-ch-25" },
];

export default function HomePage() {
  const [selectedBookId, setSelectedBookId] = useState<string>("book-science-ace");
  const [activeTab, setActiveTab] = useState<"quiz" | "book" | "review" | "parent">("quiz");
  const [selectedUnitId, setSelectedUnitId] = useState<string>("ch-1");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const studentName = "Simon";
  const activeBook = getBookById(selectedBookId);
  const activeBookMeta = bookOptions.find((b) => b.id === selectedBookId) || bookOptions[0];

  // Digitized Quizzes mapped per book
  const bookQuizzesMap: Record<string, Array<{ id: string; unit: string; title: string; pages: string; marks: number; badge: string }>> = {
    "book-science-ace": [
      { id: "ch-1", unit: "Unit 1", title: "Unit 1: Thinking Like a Scientist", pages: "p.1-54", marks: 50, badge: "科学探究" },
      { id: "ch-6", unit: "Unit 2", title: "Unit 2: Matter & Chemical Reactions", pages: "p.55-100", marks: 50, badge: "物质化学" },
      { id: "ch-9", unit: "Unit 3", title: "Unit 3: Motion, Forces & Work", pages: "p.101-148", marks: 50, badge: "运动力学" },
      { id: "ch-13", unit: "Unit 4", title: "Unit 4: Energy — Heat & Waves", pages: "p.149-208", marks: 40, badge: "能量转化" },
      { id: "ch-32", unit: "Unit 8", title: "Unit 8: Plants and Animals", pages: "p.379-440", marks: 40, badge: "动植物学" },
    ],
    "book-biology-ace": [
      { id: "bio-ch-9", unit: "Unit 3", title: "Unit 3: Cell Theory, Organelles & ATP Energy", pages: "p.83-140", marks: 50, badge: "细胞与能量" },
      { id: "bio-ch-1", unit: "Unit 1", title: "Unit 1: Basics of Biology & Life Cycles", pages: "p.1-42", marks: 50, badge: "生命特征" },
    ],
    "book-chemistry-ace": [
      { id: "chem-ch-8", unit: "Unit 2 & 4", title: "Unit 2 & 4: Atoms, Periodic Trends & Reactions", pages: "p.73-178", marks: 50, badge: "原子与周期律" },
      { id: "chem-ch-1", unit: "Unit 1", title: "Unit 1: Chemistry Lab & SI Measurement", pages: "p.1-72", marks: 50, badge: "化学基础" },
    ],
    "book-math-ace": [
      { id: "math-ch-15", unit: "Unit 1 & 2", title: "Unit 1 & 2: Integers, Fractions, Percent & Geo", pages: "p.1-164", marks: 50, badge: "数系与百分数" },
      { id: "math-ch-1", unit: "Unit 1", title: "Unit 1: Number Line & Absolute Values", pages: "p.1-84", marks: 50, badge: "有理数基础" },
    ],
    "book-algebra-ace": [
      { id: "alg-ch-25", unit: "Unit 5 & 6", title: "Unit 5 & 6: Linear Equations, Slope & Systems", pages: "p.175-324", marks: 50, badge: "方程与斜率" },
      { id: "alg-ch-1", unit: "Unit 1", title: "Unit 1: PEMDAS & Arithmetic Properties", pages: "p.1-22", marks: 50, badge: "代数运算律" },
    ],
  };

  const currentAvailableQuizzes = bookQuizzesMap[selectedBookId] || bookQuizzesMap["book-science-ace"];

  // Mock Parent Data per subject
  const parentMetricsMap: Record<string, { completedChapters: number; totalChapters: number; avgScore: number; recentScores: Array<{ unit: string; score: number }>; weakTags: Array<{ tag: string; errorRate: number; count: number }> }> = {
    "book-science-ace": {
      completedChapters: 5, totalChapters: 49, avgScore: 82,
      recentScores: [{ unit: "U1", score: 78 }, { unit: "U2", score: 85 }, { unit: "U3", score: 80 }, { unit: "U4", score: 92 }, { unit: "U8", score: 75 }],
      weakTags: [{ tag: "Scientific Method (假设变量)", errorRate: 40, count: 4 }, { tag: "Newton's Laws (受力平衡)", errorRate: 35, count: 3 }, { tag: "Thermal Energy (热传导)", errorRate: 25, count: 2 }],
    },
    "book-biology-ace": {
      completedChapters: 4, totalChapters: 50, avgScore: 86,
      recentScores: [{ unit: "U1", score: 88 }, { unit: "U2", score: 84 }, { unit: "U3", score: 90 }, { unit: "U4", score: 82 }],
      weakTags: [{ tag: "Cell Respiration vs Photosynthesis", errorRate: 30, count: 3 }, { tag: "Mitosis vs Meiosis Phases", errorRate: 25, count: 2 }],
    },
    "book-chemistry-ace": {
      completedChapters: 3, totalChapters: 36, avgScore: 80,
      recentScores: [{ unit: "U1", score: 82 }, { unit: "U2", score: 76 }, { unit: "U4", score: 82 }],
      weakTags: [{ tag: "Valence Electrons & Ionic Bonds", errorRate: 38, count: 4 }, { tag: "Molar Mass Calculation", errorRate: 32, count: 3 }],
    },
    "book-math-ace": {
      completedChapters: 6, totalChapters: 63, avgScore: 88,
      recentScores: [{ unit: "U1", score: 92 }, { unit: "U2", score: 85 }, { unit: "U3", score: 88 }, { unit: "U4", score: 87 }],
      weakTags: [{ tag: "Fraction Division & Reciprocals", errorRate: 28, count: 3 }, { tag: "Pythagorean Word Problems", errorRate: 22, count: 2 }],
    },
    "book-algebra-ace": {
      completedChapters: 4, totalChapters: 51, avgScore: 84,
      recentScores: [{ unit: "U1", score: 90 }, { unit: "U4", score: 82 }, { unit: "U5", score: 80 }, { unit: "U6", score: 84 }],
      weakTags: [{ tag: "Slope Formula ((y2-y1)/(x2-x1))", errorRate: 35, count: 4 }, { tag: "Systems by Elimination", errorRate: 30, count: 3 }],
    },
  };

  const currentParentMetrics = parentMetricsMap[selectedBookId] || parentMetricsMap["book-science-ace"];

  // Mock Mistakes per subject
  const mistakesMap: Record<string, Array<{ id: string; unit: string; stem: string; studentAns: string; correctAns: string; explanation: string; tag: string }>> = {
    "book-science-ace": [
      { id: "m-sci-1", unit: "Unit 1: Scientific Method", stem: "An educated guess that can be tested is a [blank].", studentAns: "theory", correctAns: "hypothesis", explanation: "A hypothesis is a testable prediction; a theory is a well-tested explanation.", tag: "SCI-METHOD" },
      { id: "m-sci-2", unit: "Unit 3: Motion & Forces", stem: "Team A pulls left 220 N, Team B pulls right 180 N. Net force is?", studentAns: "400 N left", correctAns: "40 N left", explanation: "Opposite forces subtract: 220 - 180 = 40 N left.", tag: "SCI-FORCES" },
    ],
    "book-biology-ace": [
      { id: "m-bio-1", unit: "Unit 3: Cell Energy", stem: "The chemical energy currency produced by mitochondria is [blank].", studentAns: "glucose", correctAns: "ATP", explanation: "Mitochondria convert glucose into cellular ATP currency.", tag: "BIO-ATP" },
      { id: "m-bio-2", unit: "Unit 3: Cell Transport", stem: "Potato slices become limp in salt water due to [blank].", studentAns: "active transport", correctAns: "osmosis", explanation: "Water leaves cells toward higher solute concentration via osmosis.", tag: "BIO-OSMOSIS" },
    ],
    "book-chemistry-ace": [
      { id: "m-chem-1", unit: "Unit 2: Atomic Structure", stem: "Negatively charged subatomic particle orbiting nucleus is [blank].", studentAns: "proton", correctAns: "electron", explanation: "Electrons are negative (-1); protons are positive (+1).", tag: "CHEM-ATOMS" },
      { id: "m-chem-2", unit: "Unit 6: Molar Mass", stem: "Molar mass of water (H2O) is [blank] g/mol.", studentAns: "17", correctAns: "18", explanation: "2 * 1 (H) + 16 (O) = 18 g/mol.", tag: "CHEM-MOLE" },
    ],
    "book-math-ace": [
      { id: "m-math-1", unit: "Unit 2: Discounts", stem: "$80 toolkit with 25% discount costs how much?", studentAns: "$20", correctAns: "$60", explanation: "Discount is $20; sale price is $80 - $20 = $60.", tag: "MATH-PERCENT" },
      { id: "m-math-2", unit: "Unit 4: Geometry", stem: "Right triangle with legs 6 and 8 has hypotenuse of?", studentAns: "14", correctAns: "10", explanation: "6^2 + 8^2 = 36 + 64 = 100; sqrt(100) = 10.", tag: "MATH-PYTHAGOREAN" },
    ],
    "book-algebra-ace": [
      { id: "m-alg-1", unit: "Unit 6: Slope", stem: "Slope of line through (2, 3) and (6, 11) is [blank].", studentAns: "4", correctAns: "2", explanation: "(11 - 3) / (6 - 2) = 8 / 4 = 2.", tag: "ALG-SLOPE" },
      { id: "m-alg-2", unit: "Unit 4: Exponents", stem: "Simplify (x^3) * (x^5).", studentAns: "x^15", correctAns: "x^8", explanation: "Product rule: add exponents 3 + 5 = 8.", tag: "ALG-EXPONENTS" },
    ],
  };

  const currentMistakes = mistakesMap[selectedBookId] || mistakesMap["book-science-ace"];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      {/* Universal Top Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo & Product Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xl font-bold text-white shadow-md">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-blue-600">Read</span>Quest
                </span>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                  Big Fat STEM 系列
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                实体教辅配套习题 · 智能学情诊断与反馈系统
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <nav className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                activeTab === "quiz"
                  ? "bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              <span>🎒</span>
              <span>今日做题</span>
            </button>
            <button
              onClick={() => setActiveTab("book")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                activeTab === "book"
                  ? "bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              <span>📚</span>
              <span>章节题库</span>
            </button>
            <button
              onClick={() => setActiveTab("review")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                activeTab === "review"
                  ? "bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              <span>📝</span>
              <span>错题本</span>
            </button>
            <button
              onClick={() => setActiveTab("parent")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                activeTab === "parent"
                  ? "bg-white text-purple-600 shadow-sm dark:bg-slate-900 dark:text-purple-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              <span>👨‍👩‍👧</span>
              <span>家长学情</span>
            </button>
          </nav>

          {/* User Profile Pill & Login */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              🔐 登录 / 切换
            </Link>
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                S
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Simon</div>
                <div className="text-[10px] text-slate-400">7th Grade STEM</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Book & Subject Selector Ribbon */}
      <section className="border-b border-slate-200 bg-white/70 backdrop-blur-md px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 flex-shrink-0">
            <span>📖 当前学习教材：</span>
          </div>
          <div className="flex items-center gap-2 flex-nowrap">
            {bookOptions.map((book) => {
              const isActive = selectedBookId === book.id;
              return (
                <button
                  key={book.id}
                  onClick={() => {
                    setSelectedBookId(book.id);
                    setSelectedUnitId(book.defaultQuizId);
                  }}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-bold transition-all flex-shrink-0 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-[1.02]"
                      : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  <span className="text-base">{book.icon}</span>
                  <span>{book.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          {/* TAB 1: 今日做题 & 测验入口 */}
          {activeTab === "quiz" && (
            <motion.div
              key={`tab-quiz-${selectedBookId}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Hero Banner / Today Task */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-xl">
                <div className="relative z-10 max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-medium backdrop-blur-md">
                    <span>{activeBookMeta.icon} {activeBook.title}</span>
                    <span>·</span>
                    <span>{activeBookMeta.subject}</span>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Hey {studentName}! 准备好今日《{activeBookMeta.name}》挑战了吗？
                  </h1>
                  <p className="text-base text-blue-100 leading-relaxed">
                    打开你的实体书，阅读指定章节后，在下方直接开始答题，体验与纸质书 100% 精确对齐的词汇、情境与计算题库。
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <Link
                      href={`/student/quiz/${selectedUnitId}`}
                      className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-base font-bold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl active:scale-[0.98]"
                    >
                      <span>✏️ 立即进入答题模式</span>
                      <span>➔</span>
                    </Link>
                    <button
                      onClick={() => setActiveTab("book")}
                      className="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/30 active:scale-[0.98]"
                    >
                      <span>📑 查看全书 {activeBook.units.length} 个单元目录</span>
                    </button>
                  </div>
                </div>

                {/* Decorative background element */}
                <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              </div>

              {/* Real Digitized Units Selector */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <span>🎯</span>
                      <span>《{activeBook.title}》已收录真题集</span>
                    </h2>
                    <p className="text-sm text-slate-500">点击任意试卷卡片即可设为当前测验或直接开始</p>
                  </div>
                  <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {currentAvailableQuizzes.length} 套试卷 · 满分 50 分制
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {currentAvailableQuizzes.map((quiz) => {
                    const isSelected = selectedUnitId === quiz.id;
                    return (
                      <div
                        key={quiz.id}
                        className={`group relative rounded-3xl border p-6 transition-all cursor-pointer ${
                          isSelected
                            ? "border-blue-500 bg-blue-50/70 shadow-md ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-950/40"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
                        }`}
                        onClick={() => setSelectedUnitId(quiz.id)}
                      >
                        <div className="flex items-start justify-between">
                          <span className="rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {quiz.unit}
                          </span>
                          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            {quiz.badge}
                          </span>
                        </div>

                        <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600">
                          {quiz.title}
                        </h3>

                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                          <span>📖 书本页码: {quiz.pages}</span>
                          <span>🏆 满分: {quiz.marks} 分</span>
                        </div>

                        <div className="mt-5 flex gap-2">
                          <Link
                            href={`/student/quiz/${quiz.id}`}
                            className="w-full inline-flex items-center justify-center rounded-2xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
                          >
                            开始本章测验 ➔
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Subject Badges */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
                  📚 ReadQuest 5 本 STEM 经典教辅书目全景
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {bookOptions.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => {
                        setSelectedBookId(b.id);
                        setSelectedUnitId(b.defaultQuizId);
                      }}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        selectedBookId === b.id
                          ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/40"
                          : "border-slate-100 hover:border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <div className="text-2xl mb-1">{b.icon}</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{b.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{b.subject}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: 全书章节题库与目录 */}
          {activeTab === "book" && (
            <motion.div
              key={`tab-book-${selectedBookId}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span>{activeBookMeta.icon}</span>
                    <span>{activeBook.title}</span>
                  </h2>
                  <p className="text-sm text-slate-500">
                    全书共 {activeBook.units.length} 个单元 · {activeBook.totalPages} 页 · 精确对应纸质书知识脉络
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-xl bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
                    ✓ 包含 {currentAvailableQuizzes.length} 套精选强化题库
                  </span>
                </div>
              </div>

              {/* Units List */}
              <div className="space-y-4">
                {activeBook.units.map((unit) => {
                  const hasQuiz = currentAvailableQuizzes.some((q) => q.unit.toLowerCase() === `unit ${unit.orderIndex}` || q.id.includes(`unit-${unit.orderIndex}`));
                  return (
                    <div
                      key={unit.id}
                      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">
                            {unit.orderIndex}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold">{unit.title}</h3>
                              {hasQuiz && (
                                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                  强化卷已就绪
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-slate-400">
                              包含 {unit.chapters.length} 个章节 · 书本第 {unit.pageStart}-{unit.pageEnd} 页
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/student/quiz/${unit.chapters[0]?.id || unit.id}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
                        >
                          <span>开始本单元测验</span>
                          <span>➔</span>
                        </Link>
                      </div>

                      {/* Chapters Sub-list */}
                      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        {unit.chapters.map((ch) => (
                          <Link
                            key={ch.id}
                            href={`/student/quiz/${ch.id}`}
                            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-3 text-xs transition-all hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
                          >
                            <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                              Ch {ch.orderIndex}. {ch.title}
                            </span>
                            <span className="text-slate-400 flex-shrink-0 ml-2">
                              {ch.estimatedMinutes} min
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 3: 智能错题本 */}
          {activeTab === "review" && (
            <motion.div
              key={`tab-review-${selectedBookId}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span>📝</span>
                    <span>《{activeBookMeta.name}》错题强化复盘</span>
                  </h2>
                  <p className="text-sm text-slate-500">
                    针对日常答题中的薄弱概念，提供标准答案对照与 AI 关键提示
                  </p>
                </div>
                <Link
                  href="/student/review"
                  className="inline-flex items-center gap-1 rounded-2xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  打开完整错题本 ➔
                </Link>
              </div>

              <div className="space-y-4">
                {currentMistakes.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {m.unit}
                      </span>
                      <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                        {m.tag}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-semibold">{m.stem}</h3>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-red-200 bg-red-50/70 p-3.5 dark:border-red-900/50 dark:bg-red-950/30">
                        <div className="text-xs font-bold text-red-600 dark:text-red-400">❌ 你的错误答案</div>
                        <div className="mt-1 text-sm font-medium text-red-900 dark:text-red-200">{m.studentAns}</div>
                      </div>
                      <div className="rounded-2xl border border-green-200 bg-green-50/70 p-3.5 dark:border-green-900/50 dark:bg-green-950/30">
                        <div className="text-xs font-bold text-green-600 dark:text-green-400">✅ 标准正确答案</div>
                        <div className="mt-1 text-sm font-medium text-green-900 dark:text-green-200">{m.correctAns}</div>
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                      <span className="font-bold text-blue-600 dark:text-blue-400">💡 考点提示：</span> {m.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 4: 家长学情总览与周报 */}
          {activeTab === "parent" && (
            <motion.div
              key={`tab-parent-${selectedBookId}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span>👨‍👩‍👧</span>
                    <span>《{activeBookMeta.name}》家长学情看板</span>
                  </h2>
                  <p className="text-sm text-slate-500">
                    学生：{studentName} · 正在学习《{activeBook.title}》
                  </p>
                </div>
                <Link
                  href="/parent/dashboard"
                  className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-purple-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  进入家长独立控制台 ➔
                </Link>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-2xl">📖</div>
                  <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {currentParentMetrics.completedChapters}/{currentParentMetrics.totalChapters}
                  </div>
                  <div className="text-xs font-medium text-slate-500">已读章节进度</div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-2xl">🎯</div>
                  <div className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                    {currentParentMetrics.avgScore}%
                  </div>
                  <div className="text-xs font-medium text-slate-500">平均测验正确率</div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-2xl">🔥</div>
                  <div className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
                    5 天
                  </div>
                  <div className="text-xs font-medium text-slate-500">连续打卡学习</div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-2xl">⭐</div>
                  <div className="mt-2 text-2xl font-bold text-amber-500">
                    A
                  </div>
                  <div className="text-xs font-medium text-slate-500">综合学情评级</div>
                </div>
              </div>

              {/* Charts & Weak Areas */}
              <div className="grid gap-6 lg:grid-cols-5">
                {/* Score Trend */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3 dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="font-bold">📈 各单元测验得分趋势</h3>
                  <div className="mt-6 flex items-end gap-3 h-44">
                    {currentParentMetrics.recentScores.map((item, idx) => (
                      <div key={idx} className="flex flex-1 flex-col items-center gap-1 h-full justify-end">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.score}%</span>
                        <div
                          className={`w-full rounded-2xl transition-all ${
                            item.score >= 80 ? "bg-green-500" : item.score >= 70 ? "bg-blue-500" : "bg-amber-500"
                          }`}
                          style={{ height: `${(item.score / 100) * 120}px` }}
                        />
                        <span className="text-[11px] font-medium text-slate-500 mt-1">{item.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weak Knowledge Tags */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="font-bold">⚠️ 需要重点关注的薄弱考点</h3>
                  <div className="mt-4 space-y-3">
                    {currentParentMetrics.weakTags.map((item) => (
                      <div key={item.tag}>
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="truncate pr-2">{item.tag}</span>
                          <span className="text-red-500 flex-shrink-0">{item.errorRate}% 错误</span>
                        </div>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-red-400 dark:bg-red-600"
                            style={{ width: `${item.errorRate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weekly Report CTA */}
              <div className="rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-700 p-8 text-white shadow-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">📬 生成《{activeBookMeta.name}》本周学情诊断 PDF 报告</h3>
                    <p className="text-sm text-purple-100">
                      包含 Simon 在《{activeBook.title}》的做题数据、薄弱知识点雷达与下周实体书阅读建议。
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPdfModal(true)}
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-purple-700 shadow-md transition-all hover:bg-purple-50 active:scale-95"
                  >
                    📄 立即导出报告
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PDF Export Modal */}
        <AnimatePresence>
          {showPdfModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 md:p-8 shadow-2xl dark:bg-slate-900 dark:border dark:border-slate-800"
              >
                {/* Close button */}
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="absolute top-5 right-5 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                >
                  ✕
                </button>

                {/* Report Header */}
                <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                    <span>📖 ReadQuest 学情诊断周报</span>
                    <span>·</span>
                    <span>{activeBookMeta.name}</span>
                  </div>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {studentName} 的《{activeBook.title}》学习诊断报告
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span>科目：{activeBookMeta.subject}</span>
                    <span>生成时间：{new Date().toISOString().split("T")[0]}</span>
                    <span>学情评级：<strong className="text-green-600">A (优秀)</strong></span>
                  </div>
                </div>

                {/* Report Body */}
                <div className="mt-6 space-y-6 text-sm">
                  {/* 1. Progress Summary */}
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">📊 核心学情数据</h4>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-white p-3 rounded-xl dark:bg-slate-800">
                        <div className="text-xl font-bold text-blue-600">{currentParentMetrics.completedChapters}/{currentParentMetrics.totalChapters}</div>
                        <div className="text-xs text-slate-400">已读章节</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl dark:bg-slate-800">
                        <div className="text-xl font-bold text-green-600">{currentParentMetrics.avgScore}%</div>
                        <div className="text-xs text-slate-400">平均正确率</div>
                      </div>
                      <div className="bg-white p-3 rounded-xl dark:bg-slate-800">
                        <div className="text-xl font-bold text-purple-600">{currentParentMetrics.recentScores.length} 次</div>
                        <div className="text-xs text-slate-400">完成测验数</div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Knowledge Weak Points */}
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">⚠️ 薄弱考点诊断</h4>
                    <ul className="space-y-2">
                      {currentParentMetrics.weakTags.map((tag, idx) => (
                        <li key={idx} className="flex items-center justify-between rounded-xl border border-slate-100 p-2.5 text-xs dark:border-slate-800">
                          <span className="font-medium text-slate-700 dark:text-slate-300">{tag.tag}</span>
                          <span className="text-red-500 font-bold">错误率 {tag.errorRate}%（{tag.count} 道错题）</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 3. AI Learning Advice */}
                  <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/50 dark:bg-purple-950/30">
                    <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-1">💡 下周实体书针对性复习建议</h4>
                    <p className="text-xs text-purple-800 dark:text-purple-300 leading-relaxed">
                      1. 请引导 Simon 重新翻阅《{activeBook.title}》的重点错题对应章节进行精读。<br />
                      2. 配合 ReadQuest 错题本，重新演练词库填空与生活情境计算题。<br />
                      3. 巩固核心概念，下周将开启下一单元的进阶挑战测试。
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 py-3 text-sm font-bold text-white shadow-md hover:bg-purple-700 active:scale-95"
                  >
                    <span>🖨️</span>
                    <span>打印 / 另存为 PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      const text = `【ReadQuest 学情周报】\n学生：${studentName}\n教材：《${activeBook.title}》\n进度：已完成 ${currentParentMetrics.completedChapters}/${currentParentMetrics.totalChapters} 章节\n平均正确率：${currentParentMetrics.avgScore}%\n薄弱知识点：${currentParentMetrics.weakTags.map(t => t.tag).join("、")}`;
                      navigator.clipboard.writeText(text);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <span>{copied ? "✓ 已复制" : "📋 复制文本摘要"}</span>
                  </button>
                  <button
                    onClick={() => setShowPdfModal(false)}
                    className="rounded-2xl px-5 py-3 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    关闭
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 py-8 text-center text-xs text-slate-400 dark:border-slate-800">
        <p>ReadQuest MVP · 让实体书阅读有目标，让学情反馈有依据 · 覆盖 Science, Biology, Chemistry, Math & Algebra</p>
      </footer>
    </div>
  );
}
