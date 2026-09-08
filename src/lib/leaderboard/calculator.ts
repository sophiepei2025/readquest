import { LeaderboardData, LeaderboardMemberItem } from "@/types";

/**
 * Generates ISO week string: e.g. "2026-W36"
 */
export function getCurrentPeriodId(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/**
 * MVP Formula:
 * 本周积分 = Σ(每次完成的 quiz 正确率 × 该 quiz 题量权重)
 * @param percentage 0~100 (e.g. 88%)
 * @param questionCountOrMarks total questions or marks (e.g. 50)
 * @param weight default 1.0 (can be higher for major units)
 */
export function calculateAttemptPoints(percentage: number, questionCountOrMarks: number, weight = 1.0): number {
  const rate = Math.max(0, Math.min(100, percentage)) / 100;
  return Math.round(rate * questionCountOrMarks * weight * 10);
}

/**
 * Pre-seeded rooms for demo and development
 */
export interface SeedMember {
  studentId: string;
  studentName: string;
  avatarUrl?: string;
  weeklyPoints: number;
  lastWeekPoints: number;
}

export interface SeedRoom {
  id: string;
  name: string;
  pinCode: string;
  createdBy: string;
  targetBook: string;
  members: SeedMember[];
}

export const SEED_ROOMS: Record<string, SeedRoom> = {
  "room-class-8b": {
    id: "room-class-8b",
    name: "初二 (4) 班 · 科学与数理精读挑战房",
    pinCode: "849203",
    createdBy: "王老师 (班主任)",
    targetBook: "Big Fat Science / Math",
    members: [
      { studentId: "s-1", studentName: "Simon.Z (你)", weeklyPoints: 940, lastWeekPoints: 820 },
      { studentId: "s-2", studentName: "Alex.K", weeklyPoints: 880, lastWeekPoints: 860 },
      { studentId: "s-3", studentName: "Emily.L", weeklyPoints: 810, lastWeekPoints: 790 },
      { studentId: "s-4", studentName: "Leo Huang", weeklyPoints: 760, lastWeekPoints: 620 },
      { studentId: "s-5", studentName: "Jessica M.", weeklyPoints: 710, lastWeekPoints: 530 },
      { studentId: "s-6", studentName: "David Chen", weeklyPoints: 690, lastWeekPoints: 610 },
      { studentId: "s-7", studentName: "Sophie Taylor", weeklyPoints: 650, lastWeekPoints: 605 },
      { studentId: "s-8", studentName: "William Wu", weeklyPoints: 590, lastWeekPoints: 570 },
      { studentId: "s-9", studentName: "Chloe Zhao", weeklyPoints: 540, lastWeekPoints: 530 },
      { studentId: "s-10", studentName: "Lucas Zhang", weeklyPoints: 480, lastWeekPoints: 360 },
    ],
  },
  "room-science-cup": {
    id: "room-science-cup",
    name: "初中理科冲刺联赛 · 全国自习房",
    pinCode: "792401",
    createdBy: "ReadQuest 官方小助手",
    targetBook: "Big Fat Notebook Series",
    members: [
      { studentId: "u-1", studentName: "Ethan.Newton", weeklyPoints: 1020, lastWeekPoints: 910 },
      { studentId: "u-2", studentName: "Harper.Curie", weeklyPoints: 980, lastWeekPoints: 950 },
      { studentId: "u-3", studentName: "Daniel.Darwin", weeklyPoints: 920, lastWeekPoints: 890 },
      { studentId: "u-4", studentName: "Grace.Hopper", weeklyPoints: 840, lastWeekPoints: 660 },
      { studentId: "u-5", studentName: "Ryan.Feynman", weeklyPoints: 780, lastWeekPoints: 740 },
    ],
  },
  "room-family-3": {
    id: "room-family-3",
    name: "Simon 一家的周末读书房 (3人小房间)",
    pinCode: "123456",
    createdBy: "Simon 妈妈",
    targetBook: "Science Unit 1 & 2",
    members: [
      { studentId: "fam-1", studentName: "Simon (儿子)", weeklyPoints: 520, lastWeekPoints: 400 },
      { studentId: "fam-2", studentName: "妈妈", weeklyPoints: 430, lastWeekPoints: 410 },
      { studentId: "fam-3", studentName: "爸爸", weeklyPoints: 380, lastWeekPoints: 350 },
    ],
  },
};

/**
 * In-memory storage for active session updates / resets
 */
const dynamicRooms: Record<string, SeedRoom> = JSON.parse(JSON.stringify(SEED_ROOMS));

export function getRoomByIdOrPin(key: string): SeedRoom | undefined {
  const trimmed = key.replace(/\s+/g, "");
  return Object.values(dynamicRooms).find(
    (r) => r.id === trimmed || r.pinCode === trimmed
  );
}

export function getAllRooms(): SeedRoom[] {
  return Object.values(dynamicRooms);
}

/**
 * Resets the week: archives weeklyPoints to lastWeekPoints and resets weeklyPoints to 0
 */
export function resetWeeklyLeaderboard(roomId?: string): { affectedRooms: number; periodId: string } {
  const roomsToReset = roomId ? [dynamicRooms[roomId]].filter(Boolean) : Object.values(dynamicRooms);
  for (const r of roomsToReset) {
    for (const m of r.members) {
      m.lastWeekPoints = m.weeklyPoints;
      m.weeklyPoints = 0;
    }
  }
  return { affectedRooms: roomsToReset.length, periodId: getCurrentPeriodId() };
}

/**
 * Builds LeaderboardData structure from members
 */
export function buildLeaderboard(room: SeedRoom, periodId: string = getCurrentPeriodId()): LeaderboardData {
  // 1. Sort members descending by weeklyPoints
  const sorted = [...room.members].sort((a, b) => b.weeklyPoints - a.weeklyPoints);

  // 2. Find fastest progress candidate (highest positive deltaVsLastWeek among runners)
  let maxDelta = -Infinity;
  let fastestStudentId = "";
  sorted.forEach((m, idx) => {
    const delta = m.weeklyPoints - m.lastWeekPoints;
    if (idx >= 3 && delta > maxDelta && delta > 0) {
      maxDelta = delta;
      fastestStudentId = m.studentId;
    }
  });

  const memberItems: LeaderboardMemberItem[] = sorted.map((m, index) => {
    const delta = m.weeklyPoints - m.lastWeekPoints;
    return {
      studentId: m.studentId,
      studentName: m.studentName,
      avatarUrl: m.avatarUrl,
      weeklyPoints: m.weeklyPoints,
      lastWeekPoints: m.lastWeekPoints,
      deltaVsLastWeek: delta,
      rank: index + 1,
      isFastestProgress: m.studentId === fastestStudentId,
    };
  });

  const isSmallRoom = memberItems.length < 5;
  const podium = isSmallRoom ? memberItems : memberItems.slice(0, 3);
  const runners = isSmallRoom ? [] : memberItems.slice(3);

  return {
    roomId: room.id,
    roomName: room.name,
    periodId,
    isSmallRoom,
    totalMembers: memberItems.length,
    podium,
    runners,
  };
}
