export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Student Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-blue-600">Read</span>Quest
            </span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              学生端
            </span>
          </a>
          <div className="flex items-center gap-1">
            <a
              href="/"
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              🏠 主页大厅
            </a>
            <a
              href="/student/dashboard"
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              📋 今日任务
            </a>
            <a
              href="/student/review"
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              📝 错题本
            </a>
            <a
              href="/parent/dashboard"
              className="rounded-xl px-3 py-2 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950"
            >
              👨‍👩‍👧 家长端
            </a>
            <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              S
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
