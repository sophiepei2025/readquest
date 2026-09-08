import { NextResponse } from 'next/server';
import { tursoClient } from '@/lib/db/client';
import { ensureDbInitialized } from '@/lib/db/init';

export async function POST(req: Request) {
  await ensureDbInitialized();

  try {
    const body = await req.json();
    const {
      studentId = 'stu-simon',
      bookId = 'book-science-ace',
      unitId,
      score,
      totalMarks,
      percentage,
      wrongQuestionIds = [],
      feedbackSummary = null,
    } = body;

    if (!unitId || score === undefined || totalMarks === undefined) {
      return NextResponse.json({ error: '缺少必要的答题数据' }, { status: 400 });
    }

    const attemptId = `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    await tursoClient.execute({
      sql: `INSERT INTO attempts (id, student_id, book_id, unit_id, score, total_marks, percentage, wrong_question_ids, feedback_summary, completed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      args: [
        attemptId,
        studentId,
        bookId,
        unitId,
        Number(score),
        Number(totalMarks),
        Number(percentage),
        JSON.stringify(wrongQuestionIds),
        feedbackSummary ? JSON.stringify(feedbackSummary) : null,
      ],
    });

    return NextResponse.json({
      success: true,
      attemptId,
      message: '成绩已成功记录并同步至 Big Fat Challenge',
    });
  } catch (err) {
    console.error('Record attempt error:', err);
    return NextResponse.json({ error: '记录答题数据失败' }, { status: 500 });
  }
}
