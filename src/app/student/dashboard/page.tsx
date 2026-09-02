"use client";

import Link from "next/link";
import { sampleBookStructure } from "@/data/sample-book-structure";

/** Student Dashboard — "今日任务" + 书目进度 */
export default function StudentDashboard() {
  // TODO: Replace with real data from Supabase
  const studentName = "Simon";
  const book = sampleBookStructure;
  const currentUnitIndex = 0; // Unit 1

  const currentUnit = book.units[currentUnitIndex];
  const totalChapters = book.units.reduce(
    (sum, u) => sum + u.chapters.length,
    0
  );
  const completedChapters = 0; // TODO: from quiz_attempts

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">
          Hey {studentName}! 👋
        </h1>
        <p className="mt-1 text-slate-500">准备好今天的阅读任务了吗？</p>
      </div>

      {/* Today's Task Card */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-blue-100">📖 今日阅读任务</div>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
            Unit {currentUnit.orderIndex}
          </span>
        </div>

        <h2 className="mt-3 text-xl font-bold">{currentUnit.chapters[0].title}</h2>
        <p className="mt-1 text-sm text-blue-100">
          翻到第 {currentUnit.chapters[0].pageStart}-{currentUnit.chapters[0].pageEnd} 页
          · 预计 {currentUnit.chapters[0].estimatedMinutes} 分钟
        </p>

        <div className="mt-4 flex gap-3">
          <Link
            href={`/student/quiz/${currentUnit.chapters[0].id}`}
            className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-md transition-all hover:shadow-lg active:scale-[0.97]"
          >
            ✏️ 开始答题
          </Link>
          <button className="inline-flex items-center justify-center rounded-2xl bg-white/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/30 active:scale-[0.97]">
            📸 拍照上传
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">📊 阅读进度</h3>
          <span className="text-sm text-slate-500">
            {completedChapters}/{totalChapters} chapters
          </span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            style={{
              width: `${totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Book Units List */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">📚 {book.title}</h3>
        <div className="space-y-3">
          {book.units.map((unit, idx) => (
            <div
              key={unit.id}
              className={`rounded-2xl border p-4 transition-all ${
                idx === currentUnitIndex
                  ? "border-blue-300 bg-blue-50 shadow-sm dark:border-blue-700 dark:bg-blue-950"
                  : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                        idx === currentUnitIndex
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {unit.orderIndex}
                    </span>
                    <h4 className="font-medium">{unit.title}</h4>
                  </div>
                  <p className="mt-1 pl-9 text-sm text-slate-500">
                    {unit.chapters.length} chapters · p.{unit.pageStart}-{unit.pageEnd}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/student/quiz/${unit.chapters[0]?.id || unit.id}`}
                    className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-95"
                  >
                    开始答题 ➔
                  </Link>
                </div>
              </div>

              {/* Expand chapters */}
              <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
                {unit.chapters.slice(0, 3).map((ch) => (
                  <Link
                    key={ch.id}
                    href={`/student/quiz/${ch.id}`}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-600 transition-all hover:bg-blue-50 hover:text-blue-700 active:scale-[0.99] dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <span>Ch {ch.orderIndex}. {ch.title}</span>
                    <span className="text-xs text-slate-400">{ch.estimatedMinutes} min</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
