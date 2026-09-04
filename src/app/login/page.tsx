"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "parent">("student");
  const [studentCode, setStudentCode] = useState("SIMON2026");
  const [parentEmail, setParentEmail] = useState("parent@readquest.app");
  const [password, setPassword] = useState("123456");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Save demo session
    if (typeof window !== "undefined") {
      localStorage.setItem("readquest_role", role);
      localStorage.setItem("readquest_user", role === "student" ? "Simon" : "家长 (Parent)");
    }

    setTimeout(() => {
      if (role === "student") {
        router.push("/?tab=quiz");
      } else {
        router.push("/parent/dashboard");
      }
    }, 600);
  };

  const handleQuickDemo = (demoRole: "student" | "parent") => {
    setRole(demoRole);
    if (demoRole === "student") {
      setStudentCode("SIMON2026");
    } else {
      setParentEmail("parent@readquest.app");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-3xl font-bold text-white shadow-xl shadow-blue-500/20 mb-4">
            📖
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-blue-600">Read</span>Quest
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            实体教辅配套习题 · 智能学情诊断与反馈
          </p>
        </div>

        {/* Card Container */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          {/* Role Switcher Tab */}
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 mb-6 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => handleQuickDemo("student")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
                role === "student"
                  ? "bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              <span>🎒</span>
              <span>学生登录</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("parent")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-all ${
                role === "parent"
                  ? "bg-white text-purple-600 shadow-sm dark:bg-slate-900 dark:text-purple-400"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              <span>👨‍👩‍👧</span>
              <span>家长登录</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {role === "student" ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  学生学号 / 口令 (Student Code)
                </label>
                <input
                  type="text"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="例如：SIMON2026"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  家长注册邮箱 / 手机号
                </label>
                <input
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="parent@example.com"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-purple-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                密码 (Password)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                role === "student"
                  ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25"
                  : "bg-purple-600 hover:bg-purple-700 shadow-purple-500/25"
              } disabled:opacity-50`}
            >
              {isLoading ? "正在进入系统..." : role === "student" ? "🎒 立即进入做题空间" : "👨‍👩‍👧 进入家长学情看板"}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="text-xs font-semibold text-slate-400 mb-2">💡 体验 Demo 测试账号（点击一键填入）</div>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => handleQuickDemo("student")}
                className="rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 transition-colors"
              >
                学生：Simon
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("parent")}
                className="rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300 transition-colors"
              >
                家长：Simon 家长
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <Link href="/" className="hover:text-blue-600 underline">
            直接以游客身份体验主页 ➔
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
