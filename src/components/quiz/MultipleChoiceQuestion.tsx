'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { MultipleChoiceQuestion as MCQType } from '@/types';
import { personalize } from '@/lib/personalization';

interface Props {
  question: MCQType;
  currentAnswer?: string;
  onAnswer: (answer: string) => void;
  graded?: boolean;
  studentName?: string;
}

export default function MultipleChoiceQuestion({
  question,
  currentAnswer,
  onAnswer,
  graded = false,
  studentName = 'Student',
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(currentAnswer ?? null);

  useEffect(() => {
    setSelectedId(currentAnswer ?? null);
  }, [question.id, currentAnswer]);

  const scenarioText = personalize(question.scenario, { student_name: studentName });

  const handleSelect = (id: string) => {
    if (graded) return;
    setSelectedId(id);
    onAnswer(id);
  };

  return (
    <div className="flex flex-col space-y-6 w-full select-none">
      {/* Scenario / Question Text */}
      <div className="text-lg md:text-xl text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
        {scenarioText}
      </div>

      {/* Options */}
      <div className="flex flex-col space-y-3 w-full">
        {question.options.map((option, idx) => {
          const isSelected = selectedId === option.id;
          const isCorrectOption = question.correctOptionId === option.id;
          const letter = String.fromCharCode(65 + idx); // A, B, C, D

          let stateClass =
            'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500';
          let icon = null;

          if (graded) {
            if (isCorrectOption) {
              stateClass =
                'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-500';
              icon = <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />;
            } else if (isSelected && !isCorrectOption) {
              stateClass =
                'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-500';
              icon = <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />;
            } else {
              stateClass =
                'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-50';
            }
          } else if (isSelected) {
            stateClass =
              'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20';
          }

          return (
            <button
              type="button"
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all min-h-[64px] w-full cursor-pointer active:scale-[0.98] ${stateClass}`}
              aria-label={`Option ${letter}: ${option.text}`}
            >
              <span
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                }`}
              >
                {letter}
              </span>
              <span className="text-base md:text-lg flex-grow text-slate-700 dark:text-slate-200">
                {option.text}
              </span>
              {icon && <div className="ml-2">{icon}</div>}
            </button>
          );
        })}
      </div>

      {/* Explanation (shown after grading) */}
      {graded && question.explanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800"
        >
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">
            💡 Explanation
          </h4>
          <p className="text-blue-900 dark:text-blue-200 text-base leading-relaxed">
            {question.explanation}
          </p>
        </motion.div>
      )}
    </div>
  );
}
