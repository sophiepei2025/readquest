"use client";

import React from "react";
import { LeaderboardMemberItem } from "@/types";

interface LeaderboardListProps {
  runners: LeaderboardMemberItem[];
}

export function LeaderboardList({ runners }: LeaderboardListProps) {
  if (!runners || runners.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {runners.map((item) => {
        const isUser = item.studentName.includes("你");
        return (
          <div
            key={item.studentId}
            className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all hover:translate-x-1 ${
              isUser
                ? "bg-blue-50/80 border-blue-300 shadow-[0_3px_0_#93c5fd]"
                : item.isFastestProgress
                ? "bg-amber-50/80 border-amber-300 shadow-[0_3px_0_#fde68a]"
                : "bg-slate-50 border-slate-200 hover:border-blue-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="font-black text-sm text-slate-400 w-6">
                {String(item.rank).padStart(2, "0")}
              </span>
              <span className={`font-extrabold text-sm sm:text-base ${isUser ? "text-blue-900" : "text-slate-800"}`}>
                {item.studentName}
              </span>

              {/* Duolingo Motivation Badges */}
              {item.isFastestProgress ? (
                <span className="text-xs font-black bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <span>🔥</span> 本周进步之星
                </span>
              ) : item.deltaVsLastWeek > 0 ? (
                <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <span>📈</span> 较上周 +{item.deltaVsLastWeek}
                </span>
              ) : item.deltaVsLastWeek < 0 ? (
                <span className="text-xs font-bold text-slate-400">
                  较上周 {item.deltaVsLastWeek}
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-400">持平</span>
              )}
            </div>

            <div className="font-black text-base text-blue-600">
              {item.weeklyPoints} <span className="text-xs text-slate-400 font-bold">pts</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
