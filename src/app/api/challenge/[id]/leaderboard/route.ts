import { NextResponse } from 'next/server';
import { tursoClient } from '@/lib/db/client';
import { ensureDbInitialized } from '@/lib/db/init';

interface LeaderboardParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: LeaderboardParams) {
  await ensureDbInitialized();

  try {
    const { id: challengeId } = await params;

    // 1. Check if challenge exists
    const challengeRes = await tursoClient.execute({
      sql: 'SELECT id, name, book_id, invite_code FROM challenges WHERE id = ? OR invite_code = ?',
      args: [challengeId, challengeId.toUpperCase()],
    });

    if (challengeRes.rows.length === 0) {
      return NextResponse.json({ error: '未找到该挑战房间' }, { status: 404 });
    }

    const challenge = challengeRes.rows[0];

    // 2. Fetch challenge members and their highest/latest scores
    // SECURITY GUARANTEE: NEVER select wrong_question_ids in this query!
    const query = `
      SELECT 
        s.id AS student_id,
        s.name AS student_name,
        s.avatar_url AS avatar_url,
        COALESCE(MAX(a.score), 0) AS high_score,
        COALESCE(MAX(a.total_marks), 50) AS total_marks,
        COALESCE(MAX(a.percentage), 0) AS percentage,
        MAX(a.completed_at) AS latest_completed_at
      FROM challenge_members cm
      JOIN students s ON cm.student_id = s.id
      LEFT JOIN attempts a ON s.id = a.student_id
      WHERE cm.challenge_id = ?
      GROUP BY s.id, s.name, s.avatar_url
      ORDER BY high_score DESC, latest_completed_at ASC
    `;

    const leaderboardRes = await tursoClient.execute({
      sql: query,
      args: [challenge.id],
    });

    const rankings = leaderboardRes.rows.map((row, idx) => ({
      rank: idx + 1,
      studentId: row.student_id,
      studentName: row.student_name,
      avatarUrl: row.avatar_url,
      score: Number(row.high_score),
      totalMarks: Number(row.total_marks),
      percentage: Number(row.percentage),
      completedAt: row.latest_completed_at,
    }));

    return NextResponse.json({
      success: true,
      challenge: {
        id: challenge.id,
        name: challenge.name,
        bookId: challenge.book_id,
        inviteCode: challenge.invite_code,
      },
      leaderboard: rankings,
    });
  } catch (err) {
    console.error('Fetch leaderboard error:', err);
    return NextResponse.json({ error: '获取排行榜数据失败' }, { status: 500 });
  }
}
