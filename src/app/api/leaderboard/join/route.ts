import { NextRequest, NextResponse } from "next/server";
import { getRoomByIdOrPin, buildLeaderboard, getCurrentPeriodId } from "@/lib/leaderboard/calculator";

/**
 * POST /api/leaderboard/join
 * Body: { pinCode: string, studentName?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pinCode = body.pinCode?.toString().trim();

    if (!pinCode) {
      return NextResponse.json(
        { error: "PIN code required", message: "请输入 6 位挑战房间 PIN 码" },
        { status: 400 }
      );
    }

    const room = getRoomByIdOrPin(pinCode);
    if (!room) {
      return NextResponse.json(
        { 
          error: "Invalid PIN", 
          message: `无效的房间 PIN 码 [${pinCode}]，请向老师或家长索取有效房间代码（例如体验码：849203 或 792401）。` 
        },
        { status: 404 }
      );
    }

    const studentName = body.studentName?.trim() || "Simon (体验者)";
    
    // Check if student already in room
    let member = room.members.find(m => m.studentName.includes(studentName));
    if (!member) {
      member = {
        studentId: `s-${Date.now().toString().slice(-4)}`,
        studentName,
        weeklyPoints: 0,
        lastWeekPoints: 0,
      };
      room.members.push(member);
    }

    const leaderboard = buildLeaderboard(room, getCurrentPeriodId());

    return NextResponse.json({
      success: true,
      message: `已成功加入房间【${room.name}】！`,
      roomId: room.id,
      roomName: room.name,
      pinCode: room.pinCode,
      currentMember: member,
      leaderboard,
    });
  } catch {
    return NextResponse.json(
      { error: "Bad Request", message: "请求格式错误" },
      { status: 400 }
    );
  }
}
