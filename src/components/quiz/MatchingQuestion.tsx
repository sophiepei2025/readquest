'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MatchingQuestion as MatchingType } from '@/types';
import { RefreshCw } from 'lucide-react';

interface Props {
  question: MatchingType;
  currentAnswer?: Record<string, string>;
  onAnswer: (answer: Record<string, string>) => void;
  graded?: boolean;
}

export default function MatchingQuestion({
  question,
  currentAnswer = {},
  onAnswer,
  graded = false,
}: Props) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const colors = [
    'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-500',
    'bg-purple-100 border-purple-500 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-500',
    'bg-orange-100 border-orange-500 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-500',
    'bg-pink-100 border-pink-500 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200 dark:border-pink-500',
    'bg-cyan-100 border-cyan-500 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200 dark:border-cyan-500',
    'bg-lime-100 border-lime-500 text-lime-800 dark:bg-lime-900/30 dark:text-lime-200 dark:border-lime-500',
  ];

  const getColorForLeft = (leftText: string) => {
    const index = question.pairs.findIndex((p) => p.left === leftText);
    return colors[index % colors.length];
  };

  const handleLeftTap = (leftText: string) => {
    if (graded) return;
    if (selectedLeft === leftText) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(leftText);
    }
  };

  const handleRightTap = (rightText: string) => {
    if (graded) return;
    if (selectedLeft) {
      const newMatches = { ...currentAnswer, [selectedLeft]: rightText };
      setSelectedLeft(null);
      onAnswer(newMatches);
    } else {
      const matchedLeft = Object.keys(currentAnswer).find(
        (k) => currentAnswer[k] === rightText
      );
      if (matchedLeft) {
        const newMatches = { ...currentAnswer };
        delete newMatches[matchedLeft];
        onAnswer(newMatches);
      }
    }
  };

  const reset = () => {
    if (graded) return;
    setSelectedLeft(null);
    onAnswer({});
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <div className="flex justify-between items-center mb-2 px-2">
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Tap an item on the left, then tap its match on the right.
        </p>
        {!graded && (
          <button
            onClick={reset}
            className="flex items-center space-x-2 text-slate-500 hover:text-blue-500 transition-colors bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="font-medium">Reset</span>
          </button>
        )}
      </div>

      <div className="flex flex-row space-x-8 w-full">
        {/* Left Column */}
        <div className="flex-1 flex flex-col space-y-4">
          <h4 className="text-xl font-semibold text-slate-700 dark:text-slate-300 text-center mb-2">
            Column A
          </h4>
          {question.pairs.map((pair) => {
            const isSelected = selectedLeft === pair.left;
            const hasMatch = !!currentAnswer[pair.left];

            let itemClass =
              'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200';

            if (graded) {
              const isCorrect = currentAnswer[pair.left] === pair.right;
              itemClass = isCorrect
                ? 'bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-600'
                : 'bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-600';
            } else if (hasMatch) {
              itemClass = getColorForLeft(pair.left);
            } else if (isSelected) {
              itemClass =
                'bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800 text-blue-800 dark:text-blue-200';
            }

            return (
              <motion.button
                key={pair.left}
                whileTap={!graded ? { scale: 0.95 } : {}}
                onClick={() => handleLeftTap(pair.left)}
                className={`p-6 rounded-2xl border-2 text-lg md:text-xl font-medium shadow-sm transition-all text-left min-h-[80px] ${itemClass}`}
              >
                {pair.left}
              </motion.button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col space-y-4">
          <h4 className="text-xl font-semibold text-slate-700 dark:text-slate-300 text-center mb-2">
            Column B
          </h4>
          {question.shuffledRight.map((rightText) => {
            const matchedLeftText = Object.keys(currentAnswer).find(
              (k) => currentAnswer[k] === rightText
            );

            let itemClass =
              'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200';

            if (graded) {
              const correctPair = question.pairs.find(
                (p) => p.right === rightText
              );
              const isCorrectMatch =
                matchedLeftText === correctPair?.left &&
                matchedLeftText !== undefined;

              if (isCorrectMatch)
                itemClass =
                  'bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-600';
              else if (matchedLeftText)
                itemClass =
                  'bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-600';
            } else if (matchedLeftText) {
              itemClass = getColorForLeft(matchedLeftText);
            } else if (selectedLeft) {
              itemClass =
                'bg-slate-50 dark:bg-slate-800 border-blue-300 border-dashed hover:border-blue-500 cursor-pointer text-slate-600 dark:text-slate-300';
            }

            return (
              <motion.button
                key={rightText}
                whileTap={!graded ? { scale: 0.95 } : {}}
                onClick={() => handleRightTap(rightText)}
                className={`p-6 rounded-2xl border-2 text-lg md:text-xl font-medium shadow-sm transition-all text-left min-h-[80px] ${itemClass}`}
              >
                {rightText}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
