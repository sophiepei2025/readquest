import { NextResponse } from 'next/server';
import { tursoClient } from '@/lib/db/client';
import { ensureDbInitialized } from '@/lib/db/init';

export async function POST(req: Request) {
  await ensureDbInitialized();

  try {
    const body = await req.json();
    const { inviteCode, studentId = 'stu-simon' } = body;

    if (!inviteCode) {
      return NextResponse.json({ error: '请输入挑战邀请码' }, { status: 400 });
    }

    const code = inviteCode.trim().toUpperCase();

    const challengeRes = await tursoClient.execute({
      sql: 'SELECT id, name, book_id, invite_code FROM challenges WHERE invite_code = ?',
      args: [code],
    });

    if (challengeRes.rows.length === 0) {
      return NextResponse.json({ error: '邀请码不存在，请核对后再试' }, { status: 404 });
    }

    const challenge = challengeRes.rows[0];

    // Join challenge
    await tursoClient.execute({
      sql: `INSERT OR IGNORE INTO challenge_members (id, challenge_id, student_id)
            VALUES (?, ?, ?)`,
      args: [`cm-${challenge.id}-${studentId}`, challenge.id, studentId],
    });

    return NextResponse.json({
      success: true,
      challenge: {
        id: challenge.id,
        name: challenge.name,
        inviteCode: challenge.invite_code,
      },
      message: `成功加入 ${challenge.name}！`,
    });
  } catch (err) {
    console.error('Join challenge error:', err);
    return NextResponse.json({ error: '加入挑战失败' }, { status: 500 });
  }
}
