'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClassificationQuestion as ClassType } from '@/types';

interface Props {
  question: ClassType;
  currentAnswer?: Record<string, string>;
  onAnswer: (answer: Record<string, string>) => void;
  graded?: boolean;
}

export default function ClassificationQuestion({
  question,
  currentAnswer = {},
  onAnswer,
  graded = false,
}: Props) {
  const [selectedItemText, setSelectedItemText] = useState<string | null>(null);

  const unassignedItems = question.items.filter(
    (item) => !currentAnswer[item.text]
  );

  const handleItemTap = (itemText: string) => {
    if (graded) return;
    setSelectedItemText(selectedItemText === itemText ? null : itemText);
  };

  const handleCategoryTap = (category: string) => {
    if (graded) return;
    if (selectedItemText) {
      const newAnswers = { ...currentAnswer, [selectedItemText]: category };
      setSelectedItemText(null);
      onAnswer(newAnswers);
    }
  };

  const handleRemoveFromCategory = (itemText: string) => {
    if (graded) return;
    const newAnswers = { ...currentAnswer };
    delete newAnswers[itemText];
    onAnswer(newAnswers);
  };

  return (
    <div className="flex flex-col space-y-8 w-full">
      {/* Unassigned Items Pool */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 min-h-[120px] w-full">
        <h4 className="text-slate-500 dark:text-slate-400 font-medium mb-4 text-lg">
          Items to Classify:
        </h4>
        <div className="flex flex-wrap gap-4">
          <AnimatePresence>
            {unassignedItems.map((item) => (
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={item.text}
                onClick={() => handleItemTap(item.text)}
                className={`px-6 py-4 rounded-xl text-lg font-medium shadow-sm transition-all border-2 ${
                  selectedItemText === item.text
                    ? 'bg-blue-500 text-white border-blue-600 ring-2 ring-blue-300'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:border-blue-400'
                }`}
              >
                {item.text}
              </motion.button>
            ))}
            {unassignedItems.length === 0 && (
              <div className="text-slate-400 dark:text-slate-500 italic py-4 text-lg">
                All items classified!
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {question.categories.map((category) => {
          const categoryItems = question.items.filter(
            (item) => currentAnswer[item.text] === category
          );

          return (
            <div
              key={category}
              onClick={() => handleCategoryTap(category)}
              className={`flex flex-col bg-white dark:bg-slate-900 rounded-3xl border-2 transition-all min-h-[250px] p-6 ${
                selectedItemText
                  ? 'border-blue-300 border-dashed bg-blue-50/50 dark:bg-blue-900/10 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 shadow-sm'
              }`}
            >
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800 text-center">
                {category}
              </h3>

              <div className="flex flex-col gap-3 flex-grow">
                <AnimatePresence>
                  {categoryItems.map((item) => {
                    let itemClass =
                      'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200';
                    if (graded) {
                      const isCorrect =
                        item.correctCategory === category;
                      itemClass = isCorrect
                        ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30'
                        : 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30';
                    }

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={item.text}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromCategory(item.text);
                        }}
                        className={`p-4 rounded-xl border text-lg font-medium ${itemClass} ${
                          !graded
                            ? 'cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700'
                            : ''
                        }`}
                      >
                        {item.text}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {categoryItems.length === 0 && !selectedItemText && (
                  <div className="flex-grow flex items-center justify-center text-slate-400 dark:text-slate-600 italic text-lg">
                    Tap an item above, then tap here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
