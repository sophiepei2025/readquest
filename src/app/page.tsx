"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChallengeRoomWidget } from "@/components/leaderboard/ChallengeRoomWidget";

interface BookCardItem {
  id: string;
  title: string;
  subtitle: string;
  chapters: string;
  badge: string;
  image: string;
  defaultQuizId: string;
}

const FEATURED_BOOKS: BookCardItem[] = [
  {
    id: "book-science-ace",
    title: "科学综合 (Science)",
    subtitle: "物理、化学、地球科学、生物 49 单元完整全解",
    chapters: "49 章节 · 380 题",
    badge: "入门必刷",
    image: "/multibook_science.png",
    defaultQuizId: "ch-1",
  },
  {
    id: "book-biology-ace",
    title: "生物学 (Biology)",
    subtitle: "细胞能量转化、遗传密码与人体系统图解探究",
    chapters: "50 章节 · 细胞与遗传学",
    badge: "中考热点",
    image: "/multibook_biology.png",
    defaultQuizId: "bio-ch-9",
  },
  {
    id: "book-chemistry-ace",
    title: "基础化学 (Chemistry)",
    subtitle: "原子周期律、方程式配平与摩尔计算自学测试",
    chapters: "36 章节 · 元素反应",
    badge: "思维跃升",
    image: "/multibook_chemistry.png",
    defaultQuizId: "chem-ch-8",
  },
  {
    id: "book-math-ace",
    title: "初中数学 (Math)",
    subtitle: "数系运算、几何比例与一次方程综合探究",
    chapters: "63 章节 · 数论与几何",
    badge: "思维基石",
    image: "/multibook_math.png",
    defaultQuizId: "math-ch-15",
  },
];

export default function HomePage() {
  const [heroPin, setHeroPin] = useState("849203");
  const [selectedBook, setSelectedBook] = useState<BookCardItem | null>(null);

  const handleHeroJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const target = document.getElementById("leaderboard-zone");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FD] text-[#202738] font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* ─── Sticky Header ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-[#58CC02] rounded-2xl flex items-center justify-center text-white text-2xl shadow-[0_4px_0_#46A302] transition-transform group-hover:scale-105">
              📖
            </div>
            <span className="font-black text-2xl text-slate-800 tracking-tight">
              ReadQuest
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-extrabold text-slate-500">
            <a href="#challenge" className="hover:text-blue-600 transition-colors">
              🎮 挑战大厅
            </a>
            <a href="#parents" className="hover:text-blue-600 transition-colors">
              👨‍👩‍👧 家长学情看板
            </a>
            <a href="#leaderboard-zone" className="hover:text-blue-600 transition-colors">
              🏆 本周领奖台
            </a>
            <a href="#books" className="hover:text-blue-600 transition-colors">
              📚 经典题库
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Duolingo Streak Pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border-2 border-amber-300 text-amber-800 font-black text-xs px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-sm animate-pulse">🔥</span>
              <span>5 天连胜</span>
            </div>

            <Link
              href="/login"
              className="btn-3d btn-3d-green px-4 py-2 text-xs sm:text-sm rounded-xl"
            >
              登录挑战
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero Section (Student Facing) ────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16" id="challenge">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Copy & PIN Card */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-blue-200 mb-5">
              <span>⚡</span> 全网首个游戏化初中生读书竞技平台
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight mb-5">
              加入一场读书挑战，<br />
              <span className="text-[#58CC02]">证明你真的读懂了！</span>
            </h1>

            <p className="text-base sm:text-lg font-bold text-slate-600 leading-relaxed max-w-xl mb-8">
              像刷 Kahoot 一样对决，像冲 Duolingo 天梯一样打卡。每本书独家原创 50+ 概念侦探题，做对多拿分，碾压全场登顶全校领奖台！
            </p>

            {/* Kahoot PIN Entry Box */}
            <div className="bg-white border-3 border-slate-200 rounded-3xl p-6 sm:p-7 shadow-[0_12px_24px_-6px_rgba(19,104,206,0.12),0_4px_0_#cbd5e1] relative">
              {/* Kahoot 4-color Shapes */}
              <div className="absolute -top-3 right-6 flex items-center gap-1.5">
                <span className="w-5 h-5 bg-[#E21B3C] rounded-md inline-block shadow-sm" title="Kahoot Red" />
                <span className="w-5 h-5 bg-[#1368CE] rotate-45 rounded-sm inline-block shadow-sm" title="Kahoot Blue" />
                <span className="w-5 h-5 bg-[#D89E00] rounded-full inline-block shadow-sm" title="Kahoot Yellow" />
                <span className="w-5 h-5 bg-[#26890C] [clip-path:polygon(50%_0%,0%_100%,100%_100%)] inline-block shadow-sm" title="Kahoot Green" />
              </div>

              <div className="text-xs sm:text-sm font-black text-slate-600 uppercase tracking-wide flex items-center gap-2 mb-3">
                <span>🔑 输入挑战房间 PIN 码（班级/家庭对决房）</span>
              </div>

              <form onSubmit={handleHeroJoin} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={heroPin}
                  onChange={(e) => setHeroPin(e.target.value)}
                  placeholder="849 203"
                  maxLength={7}
                  className="flex-1 border-3 border-slate-200 rounded-2xl bg-slate-50 px-5 py-3.5 text-2xl font-black tracking-widest text-slate-800 font-mono outline-none focus:bg-white focus:border-blue-400 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  className="btn-3d btn-3d-blue px-7 py-3.5 text-base rounded-2xl whitespace-nowrap"
                >
                  🚀 开始对决
                </button>
              </form>
              <div className="mt-2.5 flex items-center justify-between text-xs font-bold text-slate-400">
                <span>💡 体验码：849203 (初二4班) 或 792401 (全国赛)</span>
                <a href="#leaderboard-zone" className="text-blue-500 hover:underline">
                  查看当前房间天梯 ↓
                </a>
              </div>
            </div>
          </div>

          {/* Hero Right Mascot & Dialog Stage */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-amber-50 via-sky-50 to-emerald-50 border-3 border-slate-200 rounded-3xl p-8 sm:p-9 shadow-lg text-center relative overflow-hidden">
              {/* Speech Bubble */}
              <div className="relative inline-block bg-white border-3 border-slate-200 rounded-2xl px-5 py-3 text-sm sm:text-base font-black text-slate-800 shadow-[0_4px_0_#cbd5e1] mb-6">
                “Simon，你排第 1 名还差 60 分，再刷一章《生物细胞》就能反超啦！”
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
              </div>

              {/* Floating Booky Mascot */}
              <div className="animate-float my-2 flex justify-center">
                <svg width="200" height="190" viewBox="0 0 200 190" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Shadow */}
                  <ellipse cx="100" cy="180" rx="55" ry="8" fill="#CBD5E1" />
                  {/* Book Outer Cover */}
                  <rect x="35" y="25" width="130" height="145" rx="24" fill="#58CC02" stroke="#46A302" strokeWidth={4} />
                  {/* Book Pages */}
                  <path d="M48 36C48 30 52 28 60 28H140C148 28 152 30 152 36V156C152 160 148 162 140 162H60C52 162 48 160 48 156V36Z" fill="#FFFFFF" />
                  <path d="M100 28V162" stroke="#E2E8F0" strokeWidth={3} strokeDasharray="4 4" />
                  {/* Glasses */}
                  <rect x="58" y="70" width="36" height="36" rx="18" fill="#1CB0F6" stroke="#1899D6" strokeWidth={4} />
                  <rect x="106" y="70" width="36" height="36" rx="18" fill="#1CB0F6" stroke="#1899D6" strokeWidth={4} />
                  <path d="M94 88H106" stroke="#1899D6" strokeWidth={4} />
                  {/* Eyes */}
                  <circle cx="76" cy="88" r="8" fill="#202738" />
                  <circle cx="124" cy="88" r="8" fill="#202738" />
                  <circle cx="79" cy="85" r="3" fill="#FFFFFF" />
                  <circle cx="127" cy="85" r="3" fill="#FFFFFF" />
                  {/* Rosy Cheeks */}
                  <ellipse cx="60" cy="112" rx="7" ry="4" fill="#FF809B" opacity={0.85} />
                  <ellipse cx="140" cy="112" rx="7" ry="4" fill="#FF809B" opacity={0.85} />
                  {/* Smile */}
                  <path d="M92 114C92 122 108 122 108 114" stroke="#202738" strokeWidth={4} strokeLinecap="round" />
                  {/* Trophy */}
                  <g transform="translate(142, 100)">
                    <path d="M12 8H26C26 18 20 22 19 26H19V32H13V26H13C12 22 6 18 6 8H12Z" fill="#FFC800" stroke="#D97706" strokeWidth={2} />
                    <path d="M6 10C2 10 2 16 6 16" stroke="#D97706" strokeWidth={2} />
                    <path d="M26 10C30 10 30 16 26 16" stroke="#D97706" strokeWidth={2} />
                  </g>
                </svg>
              </div>

              {/* Streak Alert Card */}
              <div className="bg-[#FF9600] text-white p-3.5 rounded-2xl shadow-[0_5px_0_#D97706] font-black text-sm flex items-center justify-center gap-2.5">
                <span className="text-xl">🔥</span>
                <span>已连续打卡 5 天 · 保持连胜可获限定金边徽章！</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Second Zone: Parent Value Proposition ─────────────────── */}
      <section className="bg-white border-y-2 border-slate-200 py-16 sm:py-24" id="parents">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="bg-purple-100 text-purple-700 font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-purple-200 inline-block mb-3">
              家长视点 · 告别虚假打卡
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-4">
              每本书都配有原创检测题，<br />
              孩子读完不是打卡就算，而是真正证明学会了。
            </h2>
            <p className="text-base font-bold text-slate-500 leading-relaxed">
              市面上大部分打卡是“拍张照、摘抄两句”。ReadQuest 用高辨析度的思维概念题，自动定位孩子逻辑盲区，生成透明量化的全科看板。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mt-12">
            {/* 3 Core Proof Points */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#F8FAFC] border-3 border-slate-200 rounded-3xl p-6 shadow-[0_6px_0_#CBD5E1]">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white font-black text-lg flex items-center justify-center flex-shrink-0 shadow-[0_3px_0_#1D4ED8]">
                    1
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-slate-800 mb-1">
                      7 大题型全面击穿“假懂”
                    </h4>
                    <p className="text-xs sm:text-sm font-bold text-slate-500 leading-relaxed">
                      涵盖单选、正误辨析、分类归纳、词库填空、配对与综合论述题，绝非死记硬背。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8FAFC] border-3 border-slate-200 rounded-3xl p-6 shadow-[0_6px_0_#CBD5E1]">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white font-black text-lg flex items-center justify-center flex-shrink-0 shadow-[0_3px_0_#059669]">
                    2
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-slate-800 mb-1">
                      错题考点自动诊断
                    </h4>
                    <p className="text-xs sm:text-sm font-bold text-slate-500 leading-relaxed">
                      系统自动标红薄弱知识点（如“受力平衡变量判断”、“周期律价电子”），复习不再盲目。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F8FAFC] border-3 border-slate-200 rounded-3xl p-6 shadow-[0_6px_0_#CBD5E1]">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black text-lg flex items-center justify-center flex-shrink-0 shadow-[0_3px_0_#D97706]">
                    3
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-slate-800 mb-1">
                      随时开启家庭/班级挑战房间
                    </h4>
                    <p className="text-xs sm:text-sm font-bold text-slate-500 leading-relaxed">
                      家长或老师可一键开房，设置本周必读书目，每周自动推送全员正确率与掌握度报告。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Screenshot Preview */}
            <div className="lg:col-span-7">
              <div className="bg-slate-100 border-3 border-slate-300 rounded-3xl overflow-hidden shadow-2xl p-2 group">
                <img
                  src="/mvp_home_tab_parent.png"
                  alt="家长学情看板真实界面"
                  className="w-full h-auto rounded-2xl object-cover transition-transform group-hover:scale-[1.01]"
                />
              </div>
              <div className="mt-3 text-center text-xs font-black text-slate-400">
                ▲ 真实系统学情看板截图 · 实时掌握章节完成度、平均分与错题考点分类
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Third Zone: Challenge Room & Weekly Leaderboard ─────────── */}
      <section className="py-16 sm:py-24" id="leaderboard-zone">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="bg-amber-100 text-amber-800 font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-amber-300 inline-block mb-3">
              每周天梯 · 永不气馁机制
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight mb-3">
              Challenge Room 竞技房
            </h2>
            <p className="text-base font-bold text-slate-600">
              <b>每周日晚 24:00 重置积分！</b> 上周考差了这周还能翻盘，杜绝“差距太大早早弃赛”。
            </p>
          </div>

          {/* Interactive Challenge Room Widget */}
          <ChallengeRoomWidget initialPin={heroPin} />
        </div>
      </section>

      {/* ─── Fourth Zone: Curated Books Shelf ────────────────────────── */}
      <section className="bg-white border-t-2 border-slate-200 py-16 sm:py-24" id="books">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
            <div>
              <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-emerald-300 inline-block mb-3">
                学科与通识精选
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                覆盖全球初中生必读经典书目
              </h2>
            </div>
            <p className="text-sm font-bold text-slate-400 max-w-md">
              从风靡全球的《Big Fat Notebook》系列到代数与几何先导，每一本书都配备完整的自研章节题库。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_BOOKS.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className="bg-white border-3 border-slate-200 rounded-3xl p-4 shadow-[0_8px_0_#CBD5E1] hover:-translate-y-1.5 hover:shadow-[0_12px_0_#94A3B8] hover:border-emerald-400 transition-all cursor-pointer group flex flex-col"
              >
                <div className="relative rounded-2xl overflow-hidden mb-3 border-2 border-slate-100">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-2.5 right-2.5 text-[11px] font-black bg-white/95 text-slate-800 px-2.5 py-0.5 rounded-full shadow">
                    {book.badge}
                  </span>
                </div>

                <h3 className="font-black text-lg text-slate-800 mb-1">
                  {book.title}
                </h3>
                <p className="text-xs font-bold text-slate-500 line-clamp-2 mb-3 flex-1">
                  {book.subtitle}
                </p>

                <div className="pt-2 border-t-2 border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-600">
                    {book.chapters}
                  </span>
                  <span className="text-xs font-black text-slate-400 group-hover:text-emerald-600">
                    立即测试 →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ & Legal Disclaimer ─────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h3 className="text-2xl sm:text-3xl font-black text-center text-slate-800 mb-8">
          常见问题解答 (FAQ)
        </h3>

        <div className="space-y-4">
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
            <h4 className="font-black text-base text-slate-800 mb-1.5">
              Q: 挑战房人数少（比如全家只有 3 个人）怎么显示？
            </h4>
            <p className="text-sm font-bold text-slate-500 leading-relaxed">
              A: 系统内置轻量小房间兜底逻辑！成员少于 5 人时，直接展示清爽的家庭排名列表，不做任何段位或百分位包装，人少也不尴尬。
            </p>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
            <h4 className="font-black text-base text-slate-800 mb-1.5">
              Q: 学生能通过狂点盲猜选项来“刷分”冲榜吗？
            </h4>
            <p className="text-sm font-bold text-slate-500 leading-relaxed">
              A: 绝对不能！本周积分公式为 <code>Σ(正确率 × 题量权重)</code>，盲猜不仅正确率极低，还会严重折损单次总分。每套题还配备综合探究与词库填空，只有真正读懂才能得高分。
            </p>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
            <h4 className="font-black text-base text-slate-800 mb-1.5">
              Q: 排行榜为什么一定要按周重置？历史成绩会丢失吗？
            </h4>
            <p className="text-sm font-bold text-slate-500 leading-relaxed">
              A: 历史做题记录与总成绩会永久归档于学期长线档案中。但主看板坚持每周日 24:00 重置，是为了给学生持续的新鲜感和翻盘机会，让每个人每周都有动力站上领奖台。
            </p>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-10 p-5 bg-rose-50 border-2 border-rose-200 rounded-2xl text-xs sm:text-sm font-extrabold text-rose-800 leading-relaxed">
          ⚖️ <b>版权与法律免责声明：</b> ReadQuest 平台所提供之全部测试题目、解析反馈与考点图谱均为教研团队独立自主原创研发，旨在辅助中学生进行阅读理解与自主检验学习，与原书作者、原出版机构及相关版权权利人无商业附属与代言合作关系。
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-10 text-center text-xs sm:text-sm font-extrabold border-t-2 border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <p className="mb-2 text-white text-base font-black">
            ReadQuest · 真正让初中生自发热爱阅读的竞技乐园
          </p>
          <p className="text-slate-500">
            © 2026 ReadQuest (ReadQuiz). All rights reserved.
          </p>
        </div>
      </footer>

      {/* ─── Book Preview Modal (Optional) ─────────────────────────── */}
      {selectedBook && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="bg-white border-3 border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-black text-2xl text-slate-800">
                {selectedBook.title}
              </h3>
              <button
                onClick={() => setSelectedBook(null)}
                className="text-slate-400 hover:text-slate-700 font-black text-xl p-1"
              >
                ✕
              </button>
            </div>
            <img
              src={selectedBook.image}
              alt={selectedBook.title}
              className="w-full h-48 object-cover rounded-2xl mb-4 border-2 border-slate-100"
            />
            <p className="text-sm font-bold text-slate-600 mb-6">
              {selectedBook.subtitle}
            </p>
            <div className="flex gap-3">
              <Link
                href={`/student/quiz?bookId=${selectedBook.id}&chapterId=${selectedBook.defaultQuizId}`}
                className="btn-3d btn-3d-green flex-1 py-3 text-sm rounded-xl text-center"
              >
                立即开始答题挑战
              </Link>
              <button
                onClick={() => setSelectedBook(null)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm rounded-xl"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
