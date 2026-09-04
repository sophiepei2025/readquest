"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { sampleBookStructure } from "@/data/sample-book-structure";
import { allQuizzes, getQuizByChapterOrUnitId } from "@/data/all-quizzes";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"quiz" | "book" | "review" | "parent">("quiz");
  const [selectedUnitId, setSelectedUnitId] = useState<string>("ch-1");

  const studentName = "Simon";
  const book = sampleBookStructure;

  // Real digitized quizzes mapping
  const availableQuizzes = [
    {
      id: "ch-1",
      unit: "Unit 1",
      title: "Unit 1: Thinking Like a Scientist",
      pages: "p.1-54",
      marks: 50,
      badge: "科学探究基础",
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: "ch-6",
      unit: "Unit 2",
      title: "Unit 2: Matter, Chemical Reactions & Solutions",
      pages: "p.55-100",
      marks: 50,
      badge: "物质与化学",
      color: "from-emerald-500 to-teal-700",
    },
    {
      id: "ch-9",
      unit: "Unit 3",
      title: "Unit 3: Motion, Forces, and Work",
      pages: "p.101-148",
      marks: 50,
      badge: "运动与力学",
      color: "from-amber-500 to-orange-600",
    },
    {
      id: "ch-13",
      unit: "Unit 4",
      title: "Unit 4: Energy — Heat, Waves & Electricity",
      pages: "p.149-208",
      marks: 40,
      badge: "能量与波",
      color: "from-purple-500 to-violet-700",
    },
    {
      id: "ch-32",
      unit: "Unit 8",
      title: "Unit 8: Plants and Animals",
      pages: "p.379-440",
      marks: 40,
      badge: "动植物生物学",
      color: "from-rose-500 to-pink-600",
    },
  ];

  // Mock Parent Data
  const parentMetrics = {
    completedChapters: 5,
    totalChapters: 49,
    avgScore: 82,
    recentScores: [
      { unit: "Unit 1", score: 78, date: "09/02" },
      { unit: "Unit 2", score: 85, date: "09/01" },
      { unit: "Unit 3", score: 80, date: "08/30" },
      { unit: "Unit 4", score: 92, date: "08/28" },
      { unit: "Unit 8", score: 75, date: "08/27" },
    ],
    weakTags: [
      { tag: "Scientific Method (假设与变量)", errorRate: 40, count: 4 },
      { tag: "Newton's Laws (受力平衡与牛三)", errorRate: 35, count: 3 },
      { tag: "Heat Conduction vs Convection", errorRate: 25, count: 2 },
    ],
  };

  // Mock Mistakes
  const mockMistakes = [
    {
      id: "m-1",
      unit: "Unit 1: Thinking Like a Scientist",
      stem: "An educated guess that can be tested is called a [blank].",
      studentAns: "theory",
      correctAns: "hypothesis",
      explanation: "A hypothesis is a testable prediction. A theory is a well-tested explanation backed by extensive empirical evidence.",
      tag: "SCI-METHOD-HYPOTHESIS",
    },
    {
      id: "m-2",
      unit: "Unit 2: Matter & Chemistry",
      stem: "A negatively charged particle found orbiting the nucleus is an [blank].",
      studentAns: "proton",
      correctAns: "electron",
      explanation: "Electrons are negatively charged (-1) in orbitals; protons are positively charged (+1) inside the nucleus.",
      tag: "SCI-CHEM-PERIODIC-TABLE",
    },
    {
      id: "m-3",
      unit: "Unit 3: Motion & Forces",
      stem: "Team A pulls left with 220 N, Team B pulls right with 180 N. What is the net force?",
      studentAns: "400 N to the left",
      correctAns: "40 N to the left",
      explanation: "Opposite vectors subtract: 220 N - 180 N = 40 N toward the left.",
      tag: "SCI-PHYS-FORCES",
    },
  ];

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
                  MVP 演示版
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Everything You Need to Ace Science · 实体教辅配套习题与学情工具
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

          {/* User Profile Pill */}
          <div className="hidden lg:flex items-center gap-2 border-l border-slate-200 pl-4 dark:border-slate-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              S
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">Simon</div>
              <div className="text-[10px] text-slate-400">7th Grade STEM</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          {/* TAB 1: 今日做题 & 测验入口 */}
          {activeTab === "quiz" && (
            <motion.div
              key="tab-quiz"
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
                    <span>📖 今日指定阅读与检测</span>
                    <span>·</span>
                    <span>Big Fat Science Notebook</span>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Hey {studentName}! 准备好今日挑战了吗？
                  </h1>
                  <p className="text-base text-blue-100 leading-relaxed">
                    打开你的纸质书《Everything You Need to Ace Science》，阅读指定章节后，在下方直接开始答题，获取即时知识点诊断与反馈。
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
                      <span>📑 查看全书目录</span>
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
                    <h2 className="text-xl font-bold">🎯 选择测验章节（已收录真实试卷）</h2>
                    <p className="text-sm text-slate-500">点击任意单元卡片即可设为当前测验或直接开始</p>
                  </div>
                  <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    共收录 5 套试卷 · 190 分题库
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {availableQuizzes.map((quiz) => {
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

              {/* Quick Feature Intro */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-2xl">📱</div>
                  <h4 className="mt-2 text-sm font-bold">iPad 沉浸答题</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    支持填空词库拖选、单选、正误纠错与分类题，触控零延迟，专为学生平板优化。
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-2xl">⚡</div>
                  <h4 className="mt-2 text-sm font-bold">即时 AI 诊断</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    提交试卷秒级出分，精准定位知识点盲区，给出针对性的实体书复习指引。
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-2xl">📊</div>
                  <h4 className="mt-2 text-sm font-bold">家长无感省心</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    无需家长耗时出题判卷，自动生成每周学情雷达图与 PDF 学习报告。
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: 全书章节题库与目录 */}
          {activeTab === "book" && (
            <motion.div
              key="tab-book"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">📚 {book.title}</h2>
                  <p className="text-sm text-slate-500">
                    全书共 11 个单元 · 49 个章节 · 544 页 · 精确对应实体书知识脉络
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-xl bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
                    ✓ 已结构化 5 套完整题库
                  </span>
                </div>
              </div>

              {/* Units Accordion / Grid */}
              <div className="space-y-4">
                {book.units.map((unit) => {
                  const hasQuiz = ["unit-1", "unit-2", "unit-3", "unit-4", "unit-8"].includes(unit.id);
                  return (
                    <div
                      key={unit.id}
                      className={`rounded-3xl border p-6 transition-all ${
                        hasQuiz
                          ? "border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
                          : "border-slate-100 bg-slate-50/60 dark:border-slate-800/50 dark:bg-slate-900/30"
                      }`}
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
                                  真题已就绪
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-slate-400">
                              包含 {unit.chapters.length} 个章节 · 书本第 {unit.pageStart}-{unit.pageEnd} 页
                            </p>
                          </div>
                        </div>

                        {hasQuiz && (
                          <Link
                            href={`/student/quiz/${unit.chapters[0]?.id || unit.id}`}
                            className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
                          >
                            <span>开始本单元测验</span>
                            <span>➔</span>
                          </Link>
                        )}
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
              key="tab-review"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">📝 错题强化复盘</h2>
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
                {mockMistakes.map((m) => (
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
              key="tab-parent"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">👨‍👩‍👧 家长学情看板</h2>
                  <p className="text-sm text-slate-500">
                    学生：{studentName} · 正在学习《Everything You Need to Ace Science》
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
                    {parentMetrics.completedChapters}/{parentMetrics.totalChapters}
                  </div>
                  <div className="text-xs font-medium text-slate-500">全书完成章节数</div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-2xl">🎯</div>
                  <div className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                    {parentMetrics.avgScore}%
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
                    A-
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
                    {parentMetrics.recentScores.map((item, idx) => (
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
                    {parentMetrics.weakTags.map((item) => (
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
                    <h3 className="text-xl font-bold">📬 生成本周学情诊断 PDF 报告</h3>
                    <p className="text-sm text-purple-100">
                      包含 Simon 5 个单元的所有做题数据、薄弱知识点雷达图与下周实体书阅读复习建议。
                    </p>
                  </div>
                  <button
                    onClick={() => alert("报告生成成功！模拟下载 Simon_Science_Week_Report.pdf")}
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-purple-700 shadow-md transition-all hover:bg-purple-50 active:scale-95"
                  >
                    📄 立即导出报告
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 py-8 text-center text-xs text-slate-400 dark:border-slate-800">
        <p>ReadQuest MVP · 让实体书阅读有目标，让学情反馈有依据</p>
      </footer>
    </div>
  );
}
