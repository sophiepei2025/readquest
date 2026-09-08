"use client";

import React from "react";
import { LeaderboardMemberItem } from "@/types";

interface LeaderboardPodiumProps {
  podium: LeaderboardMemberItem[];
  isSmallRoom?: boolean;
}

export function LeaderboardPodium({ podium, isSmallRoom }: LeaderboardPodiumProps) {
  if (!podium || podium.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 font-bold bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        本周暂无答题记录，快来抢占第 1 名！
      </div>
    );
  }

  // Fallback for small rooms (< 5 members)
  if (isSmallRoom) {
    return (
      <div className="bg-amber-50/60 border-2 border-amber-200 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="font-extrabold text-amber-900 text-sm flex items-center gap-1.5">
            <span>🏡</span> 小型房间纯净排行 (无段位压力)
          </span>
          <span className="text-xs font-bold text-amber-700 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
            共 {podium.length} 位家庭/好友成员
          </span>
        </div>
        <div className="space-y-2.5">
          {podium.map((m, idx) => (
            <div
              key={m.studentId}
              className="flex items-center justify-between bg-white p-3.5 rounded-2xl border-2 border-amber-100 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="font-black text-base w-6 text-slate-500">#{idx + 1}</span>
                <span className="font-extrabold text-slate-800">{m.studentName}</span>
                {m.deltaVsLastWeek > 0 && (
                  <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    +{m.deltaVsLastWeek} 分
                  </span>
                )}
              </div>
              <span className="font-black text-amber-600 text-base">{m.weeklyPoints} pts</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Standard Podium (Rank 1, 2, 3)
  const first = podium[0];
  const second = podium[1];
  const third = podium[2];

  return (
    <div className="flex items-end justify-center gap-3.5 sm:gap-5 h-72 pb-2 pt-6 select-none">
      {/* 2nd Place */}
      {second && (
        <div className="flex flex-col items-center w-24 sm:w-28 group">
          <div className="w-14 h-14 rounded-full bg-white border-4 border-slate-300 shadow-[0_4px_0_#94a3b8] flex items-center justify-center text-2xl mb-2 relative transition-transform group-hover:-translate-y-1">
            🥈
          </div>
          <div className="font-black text-sm text-slate-800 truncate max-w-full text-center px-1">
            {second.studentName}
          </div>
          <div className="text-xs font-black text-slate-500 mb-2">
            {second.weeklyPoints} 分
          </div>
          <div className="w-full h-36 bg-gradient-to-b from-slate-300 to-slate-400 rounded-t-2xl shadow-[0_8px_0_#64748b] flex items-center justify-center font-black text-3xl text-white">
            2
          </div>
        </div>
      )}

      {/* 1st Place (Center, Tallest) */}
      {first && (
        <div className="flex flex-col items-center w-28 sm:w-32 group">
          <div className="w-18 h-18 rounded-full bg-amber-50 border-4 border-amber-400 shadow-[0_6px_0_#d97706] flex items-center justify-center text-3xl mb-2 relative transition-transform group-hover:-translate-y-1.5">
            <span className="absolute -top-5 text-2xl animate-bounce">👑</span>
            🥇
          </div>
          <div className="font-black text-base text-slate-900 truncate max-w-full text-center px-1">
            {first.studentName}
          </div>
          <div className="text-xs font-black text-amber-600 mb-2">
            {first.weeklyPoints} 分
          </div>
          <div className="w-full h-48 bg-gradient-to-b from-amber-400 to-amber-500 rounded-t-2xl shadow-[0_8px_0_#b45309] flex items-center justify-center font-black text-4xl text-amber-950">
            1
          </div>
        </div>
      )}

      {/* 3rd Place */}
      {third && (
        <div className="flex flex-col items-center w-24 sm:w-28 group">
          <div className="w-14 h-14 rounded-full bg-white border-4 border-orange-300 shadow-[0_4px_0_#c2410c] flex items-center justify-center text-2xl mb-2 relative transition-transform group-hover:-translate-y-1">
            🥉
          </div>
          <div className="font-black text-sm text-slate-800 truncate max-w-full text-center px-1">
            {third.studentName}
          </div>
          <div className="text-xs font-black text-slate-500 mb-2">
            {third.weeklyPoints} 分
          </div>
          <div className="w-full h-24 bg-gradient-to-b from-orange-400 to-orange-500 rounded-t-2xl shadow-[0_8px_0_#9a3412] flex items-center justify-center font-black text-3xl text-white">
            3
          </div>
        </div>
      )}
    </div>
  );
}
