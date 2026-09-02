'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ShortAnswerQuestion as SAType } from '@/types';
import { personalize } from '@/lib/personalization';

interface Props {
  question: SAType;
  currentAnswer?: string;
  onAnswer: (answer: string) => void;
  graded?: boolean;
  studentName?: string;
}

export default function ShortAnswerQuestion({
  question,
  currentAnswer,
  onAnswer,
  graded = false,
  studentName = 'Student',
}: Props) {
  const [text, setText] = useState(currentAnswer ?? '');

  useEffect(() => {
    setText(currentAnswer ?? '');
  }, [question.id, currentAnswer]);

  const stemText = personalize(question.stem, { student_name: studentName });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (graded) return;
    const val = e.target.value;
    setText(val);
    onAnswer(val);
  };

  return (
    <div className="flex flex-col space-y-5 w-full">
      {/* Question Stem */}
      <div className="text-lg md:text-xl text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
        {stemText}
      </div>

      {/* Text Area */}
      <textarea
        value={text}
        onChange={handleChange}
        disabled={graded}
        placeholder="Type your answer here..."
        rows={4}
        className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base focus:border-blue-500 focus:ring-0 transition-colors resize-y min-h-[120px]"
      />

      {/* Character count */}
      <div className="text-xs text-slate-400 text-right">
        {text.length} characters
      </div>

      {/* Graded feedback */}
      {graded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800"
        >
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
            📖 Sample Answer
          </h4>
          <p className="text-blue-900 dark:text-blue-200 text-base leading-relaxed">
            {question.sampleAnswer}
          </p>
          <div className="mt-3">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Key concepts:{' '}
            </span>
            <span className="text-sm text-blue-600 dark:text-blue-300">
              {question.keywords.join(', ')}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
