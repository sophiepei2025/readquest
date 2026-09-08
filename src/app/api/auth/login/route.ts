import { NextResponse } from 'next/server';
import { tursoClient } from '@/lib/db/client';
import { ensureDbInitialized } from '@/lib/db/init';

export async function POST(req: Request) {
  await ensureDbInitialized();

  try {
    const body = await req.json();
    const { role, studentCode, parentEmail, password } = body;

    if (role === 'student') {
      if (!studentCode || !password) {
        return NextResponse.json({ error: '请输入学生代码和密码' }, { status: 400 });
      }

      const res = await tursoClient.execute({
        sql: 'SELECT id, family_id, name, grade, student_code, avatar_url, password_hash FROM students WHERE student_code = ?',
        args: [studentCode.trim().toUpperCase()],
      });

      if (res.rows.length === 0) {
        return NextResponse.json({ error: '学生代码不存在，请核对或联系家长' }, { status: 404 });
      }

      const student = res.rows[0];
      if (student.password_hash !== password) {
        return NextResponse.json({ error: '密码不正确' }, { status: 401 });
      }

      const response = NextResponse.json({
        success: true,
        user: {
          id: student.id,
          role: 'student',
          name: student.name,
          grade: student.grade,
          studentCode: student.student_code,
          avatarUrl: student.avatar_url,
          familyId: student.family_id,
        },
      });

      // Set cookie for session
      response.cookies.set({
        name: 'readquest_session',
        value: JSON.stringify({ id: student.id, role: 'student', name: student.name }),
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    } else {
      // Parent login
      if (!parentEmail || !password) {
        return NextResponse.json({ error: '请输入家长邮箱和密码' }, { status: 400 });
      }

      const res = await tursoClient.execute({
        sql: 'SELECT id, parent_name, parent_email, plan, password_hash FROM families WHERE parent_email = ?',
        args: [parentEmail.trim().toLowerCase()],
      });

      if (res.rows.length === 0) {
        return NextResponse.json({ error: '该家长邮箱未注册' }, { status: 404 });
      }

      const family = res.rows[0];
      if (family.password_hash !== password) {
        return NextResponse.json({ error: '密码不正确' }, { status: 401 });
      }

      const response = NextResponse.json({
        success: true,
        user: {
          id: family.id,
          role: 'parent',
          name: family.parent_name,
          email: family.parent_email,
          plan: family.plan,
        },
      });

      response.cookies.set({
        name: 'readquest_session',
        value: JSON.stringify({ id: family.id, role: 'parent', name: family.parent_name }),
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: '服务器内部错误，请稍后重试' }, { status: 500 });
  }
}
