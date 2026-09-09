"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

function QuizRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const chapterId = searchParams.get("chapterId") || "ch-1";

  useEffect(() => {
    router.replace(`/student/quiz/${chapterId}`);
  }, [chapterId, router]);

  return (
    <div className="min-h-screen bg-[#F7F9FD] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-black text-lg">正在加载题库...</p>
      </div>
    </div>
  );
}

export default function StudentQuizQueryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F9FD] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#58CC02] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-black text-lg">正在加载题库...</p>
          </div>
        </div>
      }
    >
      <QuizRedirect />
    </Suspense>
  );
}
