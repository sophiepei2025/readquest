"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** Parent Dashboard — with functional PDF export & report preview modal */
export default function ParentDashboard() {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const studentName = "Simon";
  const bookTitle = "Everything You Need to Ace Science";

  // Mock progress data
  const progress = {
    completedChapters: 5,
    totalChapters: 49,
    percentage: 10.2,
  };

  const quizStats = {
    totalAttempts: 5,
    avgScore: 82,
    recentScores: [78, 85, 80, 92, 75],
  };

  const weakTags = [
    { tag: "Scientific Method (假设与变量)", errorRate: 40, count: 4 },
    { tag: "SI Units (公制单位换算)", errorRate: 35, count: 3 },
    { tag: "Lab Safety (实验安全规范)", errorRate: 25, count: 2 },
  ];

  const recentActivity = [
    { date: "2026-09-01", action: "Completed Quiz: Ch 5 - Lab Safety", score: 75 },
    { date: "2026-08-31", action: "Completed Quiz: Ch 4 - SI Units", score: 92 },
    { date: "2026-08-30", action: "Completed Quiz: Ch 3 - Lab Reports", score: 80 },
    { date: "2026-08-28", action: "Completed Quiz: Ch 2 - Experiments", score: 85 },
    { date: "2026-08-27", action: "Completed Quiz: Ch 1 - Thinking Like a Scientist", score: 78 },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `【ReadQuest 学情周报】\n学生：${studentName}\n教材：《${bookTitle}》\n本周进度：已完成 ${progress.completedChapters}/${progress.totalChapters} 章节 (${progress.percentage.toFixed(1)}%)\n平均正确率：${quizStats.avgScore}%\n薄弱知识点：${weakTags.map(t => t.tag).join("、")}\n下周建议：重点巩固第4-5章概念。`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">📊 学习报告与家长看板</h1>
          <p className="mt-1 text-slate-500">
            {studentName} · {bookTitle}
          </p>
        </div>
        <button
          onClick={() => setShowPdfModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-purple-700 active:scale-95"
        >
          <span>📄</span>
          <span>导出 PDF 周报</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "阅读进度",
            value: `${progress.completedChapters}/${progress.totalChapters}`,
            sub: `${progress.percentage.toFixed(1)}% 完成`,
            color: "blue",
            icon: "📖",
          },
          {
            label: "平均正确率",
            value: `${quizStats.avgScore}%`,
            sub: `共 ${quizStats.totalAttempts} 次测验`,
            color: "green",
            icon: "✅",
          },
          {
            label: "本周完成",
            value: "3",
            sub: "chapters this week",
            color: "purple",
            icon: "🔥",
          },
          {
            label: "连续学习",
            value: "5 天",
            sub: "Keep it up!",
            color: "amber",
            icon: "⭐",
          },
        ].map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="text-2xl">{kpi.icon}</div>
            <div className="mt-2 text-2xl font-bold">{kpi.value}</div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {kpi.label}
            </div>
            <div className="mt-0.5 text-xs text-slate-400">{kpi.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Two-Column Layout */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Score Trend */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold">📈 正确率趋势</h3>
          <div className="mt-4 flex items-end gap-3 h-48">
            {quizStats.recentScores.map((score, idx) => (
              <motion.div
                key={idx}
                className="flex flex-1 flex-col items-center justify-end gap-1 h-full"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: idx * 0.1, type: "spring" }}
                style={{ transformOrigin: "bottom" }}
              >
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{score}%</span>
                <div
                  className={`w-full rounded-xl transition-all ${
                    score >= 80
                      ? "bg-green-500 dark:bg-green-600"
                      : score >= 60
                        ? "bg-amber-500 dark:bg-amber-600"
                        : "bg-red-500 dark:bg-red-600"
                  }`}
                  style={{ height: `${(score / 100) * 130}px` }}
                />
                <span className="text-xs text-slate-400 mt-1">Ch {idx + 1}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weak Areas */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold">⚠️ 薄弱知识点</h3>
          <div className="mt-4 space-y-3">
            {weakTags.map((item) => (
              <div key={item.tag}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-xs truncate max-w-[180px]">{item.tag}</span>
                  <span className="text-red-500 text-xs font-semibold">{item.errorRate}% 错误率</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-red-400 dark:bg-red-600"
                    style={{ width: `${item.errorRate}%` }}
                  />
                </div>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {item.count} 道错题待巩固
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-semibold">🕐 最近活动</h3>
        <div className="mt-4 space-y-3">
          {recentActivity.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800"
            >
              <div>
                <div className="text-sm font-medium">{item.action}</div>
                <div className="text-xs text-slate-400">{item.date}</div>
              </div>
              <div
                className={`rounded-xl px-3 py-1 text-sm font-semibold ${
                  item.score >= 80
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : item.score >= 60
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {item.score}%
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Weekly Report CTA Card */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span>📬</span>
              <span>周报预览</span>
            </h3>
            <p className="mt-1 text-sm text-purple-100 max-w-2xl leading-relaxed">
              Simon 本周完成了 3 个章节的学习，平均正确率 82%。
              在 &quot;SI Units&quot; 和 &quot;Lab Safety&quot; 上有进步空间。
              建议下周重点复习第 4-5 章的相关概念。
            </p>
          </div>
          <button
            onClick={() => setShowPdfModal(true)}
            className="flex-shrink-0 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-purple-700 shadow-md transition-all hover:bg-purple-50 active:scale-95"
          >
            导出 PDF 报告
          </button>
        </div>
      </div>

      {/* PDF Export / Diagnostic Report Modal */}
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
                  <span>第 36 周</span>
                </div>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {studentName} 的科学学习与检测报告
                </h2>
                <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>教材：《{bookTitle}》</span>
                  <span>生成时间：{new Date().toISOString().split("T")[0]}</span>
                  <span>学情评级：<strong className="text-green-600">A- (良好)</strong></span>
                </div>
              </div>

              {/* Report Body */}
              <div className="mt-6 space-y-6 text-sm">
                {/* 1. Progress Summary */}
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">📊 核心学情数据</h4>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white p-3 rounded-xl dark:bg-slate-800">
                      <div className="text-xl font-bold text-blue-600">{progress.completedChapters}/49</div>
                      <div className="text-xs text-slate-400">已读章节</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl dark:bg-slate-800">
                      <div className="text-xl font-bold text-green-600">{quizStats.avgScore}%</div>
                      <div className="text-xs text-slate-400">平均正确率</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl dark:bg-slate-800">
                      <div className="text-xl font-bold text-purple-600">5 次</div>
                      <div className="text-xs text-slate-400">完成测验数</div>
                    </div>
                  </div>
                </div>

                {/* 2. Knowledge Weak Points */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">⚠️ 薄弱考点诊断</h4>
                  <ul className="space-y-2">
                    {weakTags.map((tag, idx) => (
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
                    1. 请引导 Simon 重新翻阅实体书<strong>第 37–46 页（SI Units）</strong>，重点练习米制与英制单位换算。<br />
                    2. 复习<strong>第 47–54 页（Lab Safety）</strong>的警示标志与实验器材使用规范。<br />
                    3. 下周将开启 Unit 2（物质与化学反应）的综合测试，建议提前预习第 55–72 页。
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handlePrint}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 py-3 text-sm font-bold text-white shadow-md hover:bg-purple-700 active:scale-95"
                >
                  <span>🖨️</span>
                  <span>打印 / 另存为 PDF</span>
                </button>
                <button
                  onClick={handleCopySummary}
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
    </div>
  );
}
