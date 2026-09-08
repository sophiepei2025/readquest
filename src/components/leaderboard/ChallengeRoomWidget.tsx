"use client";

import React, { useState, useEffect } from "react";
import { LeaderboardData } from "@/types";
import { LeaderboardPodium } from "./LeaderboardPodium";
import { LeaderboardList } from "./LeaderboardList";
import { SEED_ROOMS, buildLeaderboard, getCurrentPeriodId } from "@/lib/leaderboard/calculator";

interface ChallengeRoomWidgetProps {
  initialPin?: string;
  onJoinSuccess?: (roomName: string) => void;
}

export function ChallengeRoomWidget({ initialPin = "849203", onJoinSuccess }: ChallengeRoomWidgetProps) {
  const [pinInput, setPinInput] = useState(initialPin);
  const [activeRoomKey, setActiveRoomKey] = useState("room-class-8b");
  const [leaderboard, setLeaderboard] = useState<LeaderboardData>(() => {
    return buildLeaderboard(SEED_ROOMS["room-class-8b"], getCurrentPeriodId());
  });
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const fetchRoomData = async (queryKey: string) => {
    setLoading(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch(`/api/leaderboard?pinCode=${encodeURIComponent(queryKey)}`);
      if (res.ok) {
        const json = await res.json();
        setLeaderboard(json.data);
        setActiveRoomKey(json.data.roomId);
        if (onJoinSuccess) onJoinSuccess(json.data.roomName);
      } else {
        // Fallback to in-memory seed
        const cleanKey = queryKey.replace(/\s+/g, "");
        const local = Object.values(SEED_ROOMS).find((r) => r.pinCode === cleanKey || r.id === cleanKey);
        if (local) {
          const lb = buildLeaderboard(local, getCurrentPeriodId());
          setLeaderboard(lb);
          setActiveRoomKey(local.id);
        } else {
          setFeedbackMsg("未找到该 PIN 码对应的房间，请尝试示例 PIN：849203、792401、123456");
        }
      }
    } catch {
      // Offline fallback
      const cleanKey = queryKey.replace(/\s+/g, "");
      const local = Object.values(SEED_ROOMS).find((r) => r.pinCode === cleanKey || r.id === cleanKey);
      if (local) {
        setLeaderboard(buildLeaderboard(local, getCurrentPeriodId()));
        setActiveRoomKey(local.id);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinByPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;
    fetchRoomData(pinInput.trim());
  };

  const handleSelectPreset = (roomId: string, pin: string) => {
    setPinInput(pin);
    fetchRoomData(roomId);
  };

  return (
    <div className="bg-white border-3 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-[0_12px_0_#e2e8f0]">
      {/* Top Header with Room Selector Chips */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b-2 border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🏆</span>
            <h3 className="font-black text-xl sm:text-2xl text-slate-800">
              {leaderboard.roomName}
            </h3>
          </div>
          <p className="text-xs sm:text-sm font-extrabold text-slate-500">
            周期：<span className="text-blue-600 font-black">{leaderboard.periodId} 本周挑战榜</span> · 每周日 24:00 重置清零
          </p>
        </div>

        {/* Preset demo buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400">切换体验房间：</span>
          <button
            type="button"
            onClick={() => handleSelectPreset("room-class-8b", "849203")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeRoomKey === "room-class-8b"
                ? "bg-blue-600 text-white shadow-[0_3px_0_#1d4ed8]"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            🏫 初二(4)班 (10人)
          </button>
          <button
            type="button"
            onClick={() => handleSelectPreset("room-science-cup", "792401")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeRoomKey === "room-science-cup"
                ? "bg-blue-600 text-white shadow-[0_3px_0_#1d4ed8]"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            ⚡ 全国理科房 (5人)
          </button>
          <button
            type="button"
            onClick={() => handleSelectPreset("room-family-3", "123456")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeRoomKey === "room-family-3"
                ? "bg-blue-600 text-white shadow-[0_3px_0_#1d4ed8]"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            🏡 家庭房 (3人兜底)
          </button>
        </div>
      </div>

      {/* PIN Input Mini Form */}
      <form onSubmit={handleJoinByPin} className="mt-5 mb-8 flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative w-full sm:w-72">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🔑</span>
          <input
            type="text"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="输入 6 位 PIN 码"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-black text-slate-800 text-base tracking-widest focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-500 text-white font-black text-sm uppercase rounded-2xl shadow-[0_4px_0_#2563eb] active:translate-y-1 active:shadow-none hover:bg-blue-600 transition-all cursor-pointer"
        >
          {loading ? "正在验证..." : "🚀 切换/进入房间"}
        </button>
        {feedbackMsg && (
          <span className="text-xs font-bold text-rose-500">{feedbackMsg}</span>
        )}
      </form>

      {/* Leaderboard Layout */}
      {leaderboard.isSmallRoom ? (
        /* Small Room Layout */
        <div>
          <LeaderboardPodium podium={leaderboard.podium} isSmallRoom={true} />
        </div>
      ) : (
        /* Standard 2-Column Podium + Runners */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Podium (Rank 1-3) */}
          <div className="lg:col-span-6 bg-gradient-to-b from-slate-50 to-amber-50/30 rounded-3xl p-6 border-2 border-slate-100">
            <div className="text-center font-black text-sm text-slate-400 uppercase tracking-wider mb-2">
              TOP 3 PODIUM · 前三强领奖台
            </div>
            <LeaderboardPodium podium={leaderboard.podium} isSmallRoom={false} />
            <div className="mt-4 text-center text-xs font-extrabold text-slate-500 bg-white/80 py-2 rounded-xl border border-slate-100">
              ⭐ 积分规则：<code>本周积分 = Σ(测验正确率 × 题量权重)</code>
            </div>
          </div>

          {/* Right Runner List (Rank 4-N) */}
          <div className="lg:col-span-6">
            <div className="flex justify-between items-center mb-3">
              <span className="font-black text-base text-slate-700">
                全员突破榜 (第 4~{leaderboard.totalMembers} 名)
              </span>
              <span className="text-xs font-bold text-slate-400">
                实时计算增量
              </span>
            </div>
            <LeaderboardList runners={leaderboard.runners} />

            <div className="mt-4 p-3.5 bg-emerald-50/80 border-2 border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs font-bold text-emerald-900">
              <span className="text-base">💚</span>
              <div>
                <b>Duolingo 同款正向激励</b>：无论排在第几名，卡片上都会高亮你的个人努力（“较上周 +120分”），让每个孩子都能看到自己的真实进步！
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
