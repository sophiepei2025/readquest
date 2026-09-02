'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import type { TrueFalseQuestion as TFType } from '@/types';

interface Props {
  question: TFType;
  currentAnswer?: { choice: boolean; correction?: string };
  onAnswer: (answer: { choice: boolean; correction?: string }) => void;
  graded?: boolean;
}

export default function TrueFalseQuestion({
  question,
  currentAnswer,
  onAnswer,
  graded = false,
}: Props) {
  const [choice, setChoice] = useState<boolean | null>(currentAnswer?.choice ?? null);
  const [correction, setCorrection] = useState(currentAnswer?.correction ?? '');

  useEffect(() => {
    setChoice(currentAnswer?.choice ?? null);
    setCorrection(currentAnswer?.correction ?? '');
  }, [question.id, currentAnswer]);

  const handleChoice = (val: boolean) => {
    if (graded) return;
    setChoice(val);
    onAnswer({ choice: val, correction: val === false ? correction : undefined });
  };

  const handleCorrectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCorrection(val);
    onAnswer({ choice: false, correction: val });
  };

  const isCorrect = choice === question.isTrue;

  return (
    <div className="flex flex-col space-y-6 w-full">
      {/* Statement */}
      <div className="text-lg md:text-xl font-medium text-slate-800 dark:text-slate-100 text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
        &ldquo;{question.statement}&rdquo;
      </div>

      {/* TRUE / FALSE Buttons */}
      <div className="flex gap-4 justify-center w-full">
        {[true, false].map((val) => {
          const isSelected = choice === val;
          let btnClass =
            'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-400';

          if (isSelected && !graded) {
            btnClass =
              'bg-blue-500 text-white border-blue-600 shadow-md';
          }
          if (graded && isSelected) {
            btnClass = isCorrect
              ? 'bg-green-500 border-green-600 text-white shadow-md'
              : 'bg-red-500 border-red-600 text-white shadow-md';
          }

          return (
            <button
              type="button"
              key={String(val)}
              onClick={() => handleChoice(val)}
              className={`flex-1 max-w-[180px] py-5 rounded-2xl border-2 text-xl font-bold transition-all cursor-pointer active:scale-95 select-none ${btnClass}`}
              aria-label={val ? 'True' : 'False'}
            >
              {val ? 'TRUE' : 'FALSE'}
            </button>
          );
        })}
      </div>

      {/* Correction input (when FALSE selected) */}
      {choice === false && !graded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="w-full"
        >
          <label className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-2">
            ✏️ Correct the statement:
          </label>
          <input
            type="text"
            value={correction}
            onChange={handleCorrectionChange}
            placeholder="Type your correction here..."
            className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:border-blue-500 focus:ring-0 transition-colors"
          />
        </motion.div>
      )}

      {/* Grading Feedback */}
      {graded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl border-2 w-full ${
            isCorrect
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <X className="w-5 h-5 text-red-600 dark:text-red-400" />
            )}
            <h4
              className={`text-base font-bold ${
                isCorrect
                  ? 'text-green-800 dark:text-green-300'
                  : 'text-red-800 dark:text-red-300'
              }`}
            >
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </h4>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-base">
            The correct answer is{' '}
            <strong>{question.isTrue ? 'TRUE' : 'FALSE'}</strong>.
          </p>
          {!question.isTrue && question.correctionText && (
            <p className="text-slate-700 dark:text-slate-300 text-base mt-1">
              <span className="font-semibold">Correction:</span>{' '}
              {question.correctionText}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
