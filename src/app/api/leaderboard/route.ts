import { NextRequest, NextResponse } from "next/server";
import { 
  getRoomByIdOrPin, 
  getAllRooms, 
  buildLeaderboard, 
  getCurrentPeriodId,
  resetWeeklyLeaderboard 
} from "@/lib/leaderboard/calculator";

/**
 * GET /api/leaderboard?roomId=...&pinCode=...
 * Returns weekly leaderboard data including podium, runners, deltaVsLastWeek, etc.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get("roomId");
  const pinCode = searchParams.get("pinCode");

  const queryKey = pinCode || roomId || "room-class-8b";
  const room = getRoomByIdOrPin(queryKey);

  if (!room) {
    return NextResponse.json(
      { 
        error: "Room not found", 
        message: `未找到挑战房间 [${queryKey}]，请检查 6 位 PIN 码是否正确。`,
        availableRooms: getAllRooms().map(r => ({ id: r.id, name: r.name, pinCode: r.pinCode }))
      },
      { status: 404 }
    );
  }

  const periodId = searchParams.get("periodId") || getCurrentPeriodId();
  const leaderboardData = buildLeaderboard(room, periodId);

  return NextResponse.json({
    success: true,
    data: leaderboardData,
    roomMeta: {
      targetBook: room.targetBook,
      createdBy: room.createdBy,
      pinCode: room.pinCode,
    },
    ruleInfo: {
      period: "Weekly (重置周期: 每周日 24:00)",
      formula: "本周积分 = Σ(测验正确率 × 题量权重)",
      duolingoMotivation: "前3名展示领奖台，第4名起展示较上周增量及进步标签",
    }
  });
}

/**
 * POST /api/leaderboard
 * Can be used by weekly cron job or admin reset:
 * Body: { action: "reset", roomId?: string, secret?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.action === "reset") {
      const result = resetWeeklyLeaderboard(body.roomId);
      return NextResponse.json({
        success: true,
        message: "周积分已成功归档并清零，新赛季周期开启！",
        ...result,
      });
    }

    return NextResponse.json(
      { error: "Invalid action", message: "Supported actions: 'reset'" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: "Bad Request", message: "Failed to parse request JSON" },
      { status: 400 }
    );
  }
}
