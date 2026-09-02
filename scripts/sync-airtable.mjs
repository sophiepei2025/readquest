import fs from 'fs';
import path from 'path';

const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!API_KEY || !BASE_ID) {
  console.log('\n' + '='.repeat(60));
  console.log('⚠️  未检测到 Airtable 凭证配置！');
  console.log('='.repeat(60));
  console.log('请在 .env.local 中配置以下两项:');
  console.log('  AIRTABLE_API_KEY=patXXXXXXXXXXXXXX (Airtable Personal Access Token)');
  console.log('  AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX (Base ID 从网页 URL 获取)');
  console.log('\n💡 提示：');
  console.log('  1. 登录 https://airtable.com/create/tokens 创建 Token，权限勾选 data.records:read');
  console.log('  2. 打开你的 Base，URL 格式为: https://airtable.com/appXXXXXXXXXXXXXX/tbl...');
  console.log('     其中 appXXXXXXXXXXXXXX 即为 BASE_ID');
  console.log('='.repeat(60) + '\n');
  process.exit(1);
}

const OUT_FILE = path.join(process.cwd(), 'src/data/remote-quiz-cache.json');

async function fetchTable(tableName) {
  console.log(`⏳ 正在拉取表 [${tableName}]...`);
  const records = [];
  let offset = null;

  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(tableName)}`);
    if (offset) url.searchParams.set('offset', offset);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`拉取 [${tableName}] 失败 (${res.status}): ${err}`);
    }

    const data = await res.json();
    records.push(...data.records.map((r) => ({ id: r.id, ...r.fields })));
    offset = data.offset;
  } while (offset);

  console.log(`✅ 成功获取 [${tableName}] 共 ${records.length} 条记录`);
  return records;
}

async function main() {
  try {
    console.log('\n🔄 开始从 Airtable 同步题库数据...\n');
    
    // 拉取题目和章节
    const questions = await fetchTable('Questions');
    let chapters = [];
    try {
      chapters = await fetchTable('Chapters');
    } catch {
      console.log('ℹ️  未找到 Chapters 表或无需同步，使用默认章节');
    }

    const cacheData = {
      updatedAt: new Date().toISOString(),
      questionCount: questions.length,
      chapterCount: chapters.length,
      chapters,
      questions,
    };

    fs.writeFileSync(OUT_FILE, JSON.stringify(cacheData, null, 2), 'utf-8');
    console.log(`\n🎉 同步完成！数据已缓存至: src/data/remote-quiz-cache.json`);
    console.log(`📊 本次同步题量: ${questions.length} 题`);
  } catch (err) {
    console.error('❌ 同步中断:', err.message);
    process.exit(1);
  }
}

main();
