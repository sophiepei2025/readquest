import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      {/* Hero */}
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          📚 配套习题订阅工具
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          <span className="text-blue-600">Read</span>Quest
        </h1>

        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          孩子读哪本书、读到哪一页，我们就能给到匹配的检测题和反馈
          <br />
          <span className="text-slate-500">—— 不用家长自己出题，也不用孩子瞎读</span>
        </p>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
            <div className="text-2xl font-bold text-blue-600">11</div>
            <div className="text-sm text-slate-500">Units</div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
            <div className="text-2xl font-bold text-blue-600">49</div>
            <div className="text-sm text-slate-500">Chapters</div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
            <div className="text-2xl font-bold text-blue-600">544</div>
            <div className="text-sm text-slate-500">Pages</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/student/dashboard"
          className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl active:scale-[0.98]"
        >
          🎒 学生入口
        </Link>
        <Link
          href="/parent/dashboard"
          className="inline-flex items-center justify-center rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:shadow-md active:scale-[0.98] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          👨‍👩‍👧 家长入口
        </Link>
      </div>

      {/* Book Preview */}
      <div className="mt-16 w-full max-w-lg">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 text-2xl font-bold text-white shadow-md">
              📗
            </div>
            <div className="flex-1">
              <h3 className="font-semibold leading-tight">
                Everything You Need to Ace Science
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Big Fat Notebook Series · Grades 6-8
              </p>
              <div className="mt-2 flex gap-2">
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Biology
                </span>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Chemistry
                </span>
                <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  Physics
                </span>
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  Earth Sci
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 text-center text-sm text-slate-400">
        ReadQuest MVP · Built for families who believe in purposeful reading
      </footer>
    </main>
  );
}
