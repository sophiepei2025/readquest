import { tursoClient } from './client';

let isInitialized = false;

/**
 * Initialize all database tables in Turso / SQLite and seed demo data
 */
export async function ensureDbInitialized() {
  if (isInitialized) return;

  try {
    // 1. Create tables
    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS families (
        id TEXT PRIMARY KEY,
        parent_name TEXT NOT NULL,
        parent_email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL DEFAULT '123456',
        plan TEXT NOT NULL DEFAULT 'starter',
        stripe_customer_id TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        grade TEXT DEFAULT 'Grade 7',
        student_code TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL DEFAULT '123456',
        avatar_url TEXT DEFAULT 'S',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS attempts (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        book_id TEXT NOT NULL,
        unit_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        total_marks INTEGER NOT NULL,
        percentage INTEGER NOT NULL,
        wrong_question_ids TEXT DEFAULT '[]',
        feedback_summary TEXT,
        completed_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS challenges (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        book_id TEXT,
        invite_code TEXT NOT NULL UNIQUE,
        created_by TEXT,
        start_date TEXT,
        end_date TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await tursoClient.execute(`
      CREATE TABLE IF NOT EXISTS challenge_members (
        id TEXT PRIMARY KEY,
        challenge_id TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
        student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        joined_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Seed initial Demo Family if not exists
    const familyCheck = await tursoClient.execute({
      sql: 'SELECT id FROM families WHERE parent_email = ?',
      args: ['parent@readquest.app'],
    });

    if (familyCheck.rows.length === 0) {
      await tursoClient.execute({
        sql: `INSERT INTO families (id, parent_name, parent_email, password_hash, plan) 
              VALUES (?, ?, ?, ?, ?)`,
        args: ['fam-simon', "Simon's Parent", 'parent@readquest.app', '123456', 'unlimited_stem'],
      });
    }

    // 3. Seed initial Demo Students (Simon + Peer Students)
    const studentCheck = await tursoClient.execute({
      sql: 'SELECT id FROM students WHERE student_code = ?',
      args: ['SIMON2026'],
    });

    if (studentCheck.rows.length === 0) {
      await tursoClient.execute({
        sql: `INSERT INTO students (id, family_id, name, grade, student_code, password_hash, avatar_url)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: ['stu-simon', 'fam-simon', 'Simon', 'Grade 7A', 'SIMON2026', '123456', 'S'],
      });

      // Peer students for realistic challenge squad
      const peers = [
        ['stu-leo', 'fam-simon', 'Leo M.', 'Grade 7A', 'LEO2026', '123456', 'L'],
        ['stu-emma', 'fam-simon', 'Emma W.', 'Grade 7A', 'EMMA2026', '123456', 'E'],
        ['stu-lucas', 'fam-simon', 'Lucas K.', 'Grade 7B', 'LUCAS2026', '123456', 'K'],
        ['stu-sophia', 'fam-simon', 'Sophia T.', 'Grade 7A', 'SOPHIA2026', '123456', 'T'],
      ];

      for (const p of peers) {
        await tursoClient.execute({
          sql: `INSERT OR IGNORE INTO students (id, family_id, name, grade, student_code, password_hash, avatar_url)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: p,
        });
      }
    }

    // 4. Seed initial Challenge Room: "Big Fat Challenge — 7th Grade Science Squad"
    const challengeCheck = await tursoClient.execute({
      sql: 'SELECT id FROM challenges WHERE invite_code = ?',
      args: ['SCIENCE7'],
    });

    if (challengeCheck.rows.length === 0) {
      await tursoClient.execute({
        sql: `INSERT INTO challenges (id, name, book_id, invite_code, created_by)
              VALUES (?, ?, ?, ?, ?)`,
        args: [
          'challenge-science-7a',
          'Big Fat Challenge — 7th Grade Science Squad 🏆',
          'book-science-ace',
          'SCIENCE7',
          'stu-simon',
        ],
      });

      // Join members to challenge
      const memberIds = ['stu-simon', 'stu-leo', 'stu-emma', 'stu-lucas', 'stu-sophia'];
      for (const mId of memberIds) {
        await tursoClient.execute({
          sql: `INSERT OR IGNORE INTO challenge_members (id, challenge_id, student_id)
                VALUES (?, ?, ?)`,
          args: [`cm-${mId}`, 'challenge-science-7a', mId],
        });
      }

      // Seed peer benchmark attempts
      const peerAttempts = [
        ['att-leo-1', 'stu-leo', 'book-science-ace', 'ch-1', 48, 50, 96],
        ['att-emma-1', 'stu-emma', 'book-science-ace', 'ch-1', 46, 50, 92],
        ['att-simon-1', 'stu-simon', 'book-science-ace', 'ch-1', 44, 50, 88],
        ['att-sophia-1', 'stu-sophia', 'book-science-ace', 'ch-1', 42, 50, 84],
        ['att-lucas-1', 'stu-lucas', 'book-science-ace', 'ch-1', 38, 50, 76],
      ];

      for (const a of peerAttempts) {
        await tursoClient.execute({
          sql: `INSERT OR IGNORE INTO attempts (id, student_id, book_id, unit_id, score, total_marks, percentage, wrong_question_ids)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [a[0], a[1], a[2], a[3], a[4], a[5], a[6], '[]'],
        });
      }
    }

    isInitialized = true;
  } catch (err) {
    console.error('Failed to initialize database tables:', err);
  }
}
