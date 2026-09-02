'use client';

import { useState, useEffect } from 'react';
import type { WordBankQuestion as WBType } from '@/types';

interface Props {
  question: WBType;
  currentAnswer?: Record<string, string>;
  onAnswer: (answer: Record<string, string>) => void;
  graded?: boolean;
}

export default function WordBankQuestion({
  question,
  currentAnswer,
  onAnswer,
  graded = false,
}: Props) {
  const [filledBlanks, setFilledBlanks] = useState<Record<string, string>>(
    currentAnswer ?? {}
  );
  const [activeBlankIndex, setActiveBlankIndex] = useState<number | null>(0);

  // 当题目切换或外部答案更新时，同步内部状态
  useEffect(() => {
    setFilledBlanks(currentAnswer ?? {});
    setActiveBlankIndex(0);
  }, [question.id, currentAnswer]);

  // 分割带有 [blank] 的题干
  const parts = question.stem.split(/\[blank\]/i);
  const usedWords = new Set(Object.values(filledBlanks));

  const handleWordSelect = (word: string) => {
    if (graded) return;

    let targetIndex = activeBlankIndex;
    if (targetIndex === null || targetIndex >= question.blanks.length) {
      // 找到第一个未填的空白
      const firstEmpty = question.blanks.findIndex(
        (_, i) => !filledBlanks[String(i)]
      );
      targetIndex = firstEmpty !== -1 ? firstEmpty : 0;
    }

    const next = { ...filledBlanks, [String(targetIndex)]: word };
    setFilledBlanks(next);
    onAnswer(next);

    // 自动寻找下一个未填写的空白激活
    const nextEmpty = question.blanks.findIndex(
      (_, i) => i > targetIndex && !next[String(i)]
    );
    if (nextEmpty !== -1) {
      setActiveBlankIndex(nextEmpty);
    } else {
      setActiveBlankIndex(null);
    }
  };

  const handleBlankClick = (index: number) => {
    if (graded) return;
    if (filledBlanks[String(index)]) {
      // 如果点击已填写的空，清空该项并激活它
      const next = { ...filledBlanks };
      delete next[String(index)];
      setFilledBlanks(next);
      setActiveBlankIndex(index);
      onAnswer(next);
    } else {
      setActiveBlankIndex(index);
    }
  };

  const handleReset = () => {
    setFilledBlanks({});
    setActiveBlankIndex(0);
    onAnswer({});
  };

  return (
    <div className="flex flex-col space-y-6 w-full select-none">
      {/* 带有挖空按钮的句子 */}
      <div className="text-lg md:text-xl leading-relaxed text-slate-800 dark:text-slate-200">
        {parts.map((part, idx) => (
          <span key={idx}>
            {part}
            {idx < parts.length - 1 && (
              <button
                type="button"
                onClick={() => handleBlankClick(idx)}
                className={`inline-flex min-w-[130px] items-center justify-center mx-1.5 px-3 py-1.5 rounded-xl border-2 transition-all font-medium text-base md:text-lg cursor-pointer active:scale-95 ${
                  activeBlankIndex === idx
                    ? 'border-blue-500 bg-blue-100/60 ring-2 ring-blue-400/30 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'
                    : filledBlanks[String(idx)]
                      ? graded
                        ? filledBlanks[String(idx)]?.toLowerCase().trim() ===
                          question.blanks[idx]?.toLowerCase().trim()
                          ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : 'border-blue-400 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800/60'
                }`}
              >
                {filledBlanks[String(idx)] ? (
                  <span>{filledBlanks[String(idx)]}</span>
                ) : (
                  <span className="text-sm text-slate-400">点击填词 ✏️</span>
                )}
              </button>
            )}
          </span>
        ))}
      </div>

      {/* 词汇库 (Word Bank) */}
      {!graded && (
        <div className="pt-2">
          <div className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
            <span>📦 点击下方词汇填入空位：</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {question.wordBank.map((word) => {
              const isUsed = usedWords.has(word);
              return (
                <button
                  type="button"
                  key={word}
                  onClick={() => handleWordSelect(word)}
                  disabled={isUsed}
                  className={`px-4 py-2.5 rounded-xl border-2 text-base font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                    isUsed
                      ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed dark:border-slate-800 dark:bg-slate-800'
                      : 'border-blue-200 bg-white text-blue-700 shadow-sm hover:border-blue-500 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-300'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
          {Object.keys(filledBlanks).length > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="mt-4 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline block"
            >
              🔄 重置所有填空
            </button>
          )}
        </div>
      )}

      {/* 提交后正确答案反馈 */}
      {graded && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1 text-sm">
            📝 标准答案：
          </h4>
          <p className="text-blue-900 dark:text-blue-200 text-base font-medium">
            {question.blanks.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
