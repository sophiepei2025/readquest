"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface MistakeItem {
  id: string;
  unit: string;
  chapter: string;
  questionStem: string;
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
  knowledgeTag: string;
  date: string;
}

const mockMistakes: MistakeItem[] = [
  {
    id: "m-1",
    unit: "Unit 1: Scientific Investigation",
    chapter: "Ch 1: Thinking Like a Scientist",
    questionStem: "An educated guess that can be tested is called a [blank].",
    studentAnswer: "theory",
    correctAnswer: "hypothesis",
    explanation: "A hypothesis is a testable prediction, whereas a theory is a well-tested explanation supported by a vast body of evidence.",
    knowledgeTag: "SCI-METHOD-HYPOTHESIS",
    date: "2026-09-02",
  },
  {
    id: "m-2",
    unit: "Unit 2: Matter & Chemistry",
    chapter: "Ch 7: Atomic Structure",
    questionStem: "A negatively charged subatomic particle found in electron shells is an [blank].",
    studentAnswer: "proton",
    correctAnswer: "electron",
    explanation: "Electrons carry a negative charge (-1), protons carry a positive charge (+1), and neutrons have no charge (0).",
    knowledgeTag: "SCI-CHEM-PERIODIC-TABLE",
    date: "2026-09-01",
  },
  {
    id: "m-3",
    unit: "Unit 3: Motion & Forces",
    chapter: "Ch 10: Newton's Laws",
    questionStem: "Team A pulls left with 220 N, Team B pulls right with 180 N. What is the net force?",
    studentAnswer: "400 N to the left",
    correctAnswer: "40 N to the left",
    explanation: "Opposing forces in opposite directions are subtracted: 220 N - 180 N = 40 N toward the left (greater force).",
    knowledgeTag: "SCI-PHYS-FORCES",
    date: "2026-08-30",
  },
  {
    id: "m-4",
    unit: "Unit 4: Energy",
    chapter: "Ch 14: Thermal Energy",
    questionStem: "Heat transfer through direct touch/contact of particles is called [blank].",
    studentAnswer: "convection",
    correctAnswer: "conduction",
    explanation: "Conduction occurs via direct physical contact; convection occurs via fluid movement; radiation occurs via electromagnetic waves.",
    knowledgeTag: "SCI-PHYS-THERMAL",
    date: "2026-08-28",
  },
];

export default function StudentReviewPage() {
  const [selectedTag, setSelectedTag] = useState<string>("ALL");
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());

  const tags = ["ALL", ...Array.from(new Set(mockMistakes.map((m) => m.knowledgeTag)))];

  const filtered = mockMistakes.filter(
    (m) => selectedTag === "ALL" || m.knowledgeTag === selectedTag
  );

  const toggleSolved = (id: string) => {
    setSolvedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">📝 智能错题本</h1>
          <p className="mt-1 text-slate-500">
            自动收录日常测验中的错题，针对薄弱知识点精准强化复盘
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/student/quiz/ch-1"
            className="inline-flex items-center gap-1 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
          >
            ⚡ 开始今日测验
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            🏠 返回主页
          </Link>
        </div>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-2xl font-bold text-red-500">{mockMistakes.length}</div>
          <div className="text-xs text-slate-500">总待复习题数</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-2xl font-bold text-green-600">{solvedIds.size}</div>
          <div className="text-xs text-slate-500">已掌握消除</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-2xl font-bold text-blue-600">{tags.length - 1}</div>
          <div className="text-xs text-slate-500">涉及薄弱知识点</div>
        </div>
      </div>

      {/* Tag Filter */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedTag === tag
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {tag === "ALL" ? "全部错题" : tag}
          </button>
        ))}
      </div>

      {/* Mistakes List */}
      <div className="space-y-4">
        {filtered.map((item, idx) => {
          const isSolved = solvedIds.has(item.id);
          return (
            <motion.div
              key={item.id}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-2xl border p-5 transition-all ${
                isSolved
                  ? "border-green-200 bg-green-50/50 opacity-60 dark:border-green-900 dark:bg-green-950/20"
                  : "border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {item.unit}
                    </span>
                    <span className="text-xs text-slate-400">{item.chapter}</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {item.questionStem}
                  </h3>
                </div>
                <button
                  onClick={() => toggleSolved(item.id)}
                  className={`flex-shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    isSolved
                      ? "bg-green-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-green-300 dark:border-slate-700 dark:bg-slate-800"
                  }`}
                >
                  {isSolved ? "✓ 已掌握" : "标为已掌握"}
                </button>
              </div>

              {/* Answers Comparison */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/30">
                  <div className="text-xs font-semibold text-red-600 dark:text-red-400">
                    ❌ 你的错误答案
                  </div>
                  <div className="mt-1 text-sm font-medium text-red-900 dark:text-red-200">
                    {item.studentAnswer}
                  </div>
                </div>
                <div className="rounded-xl border border-green-200 bg-green-50 p-3 dark:border-green-900/50 dark:bg-green-950/30">
                  <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                    ✅ 标准正确答案
                  </div>
                  <div className="mt-1 text-sm font-medium text-green-900 dark:text-green-200">
                    {item.correctAnswer}
                  </div>
                </div>
              </div>

              {/* Explanation & AI Coach */}
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                <span className="font-semibold text-blue-600 dark:text-blue-400">💡 AI 解析提示：</span>{" "}
                {item.explanation}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
