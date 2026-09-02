"use client";

import { motion } from "framer-motion";

/** Parent Dashboard — mock data for MVP demonstration */
export default function ParentDashboard() {
  // TODO: Replace with real data from Supabase
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
    { tag: "Scientific Method", errorRate: 40, count: 4 },
    { tag: "SI Units", errorRate: 35, count: 3 },
    { tag: "Lab Safety", errorRate: 25, count: 2 },
  ];

  const recentActivity = [
    { date: "2026-09-01", action: "Completed Quiz: Ch 5 - Lab Safety", score: 75 },
    { date: "2026-08-31", action: "Completed Quiz: Ch 4 - SI Units", score: 92 },
    { date: "2026-08-30", action: "Completed Quiz: Ch 3 - Lab Reports", score: 80 },
    { date: "2026-08-28", action: "Completed Quiz: Ch 2 - Experiments", score: 85 },
    { date: "2026-08-27", action: "Completed Quiz: Ch 1 - Thinking Like a Scientist", score: 78 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">📊 学习报告</h1>
        <p className="mt-1 text-slate-500">
          {studentName} · {bookTitle}
        </p>
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
          <div className="mt-4 flex items-end gap-3">
            {quizStats.recentScores.map((score, idx) => (
              <motion.div
                key={idx}
                className="flex flex-1 flex-col items-center gap-1"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: idx * 0.1, type: "spring" }}
                style={{ transformOrigin: "bottom" }}
              >
                <span className="text-xs font-medium text-slate-500">{score}%</span>
                <div
                  className={`w-full rounded-xl ${
                    score >= 80
                      ? "bg-green-400 dark:bg-green-600"
                      : score >= 60
                        ? "bg-amber-400 dark:bg-amber-600"
                        : "bg-red-400 dark:bg-red-600"
                  }`}
                  style={{ height: `${score * 1.5}px` }}
                />
                <span className="text-xs text-slate-400">Ch {idx + 1}</span>
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
                  <span className="font-medium">{item.tag}</span>
                  <span className="text-red-500">{item.errorRate}% 错误率</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-red-400 dark:bg-red-600"
                    style={{ width: `${item.errorRate}%` }}
                  />
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  {item.count} questions answered incorrectly
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

      {/* Weekly Report CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white shadow-lg">
        <h3 className="text-lg font-bold">📬 周报预览</h3>
        <p className="mt-1 text-sm text-purple-100">
          Simon 本周完成了 3 个章节的学习，平均正确率 82%。
          在 &quot;SI Units&quot; 和 &quot;Lab Safety&quot; 上有进步空间。
          建议下周重点复习第 4-5 章的相关概念。
        </p>
        <button className="mt-4 rounded-xl bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur transition-all hover:bg-white/30">
          导出 PDF 报告
        </button>
      </div>
    </div>
  );
}
