'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComprehensiveQuestion as CompType, Question } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import WordBankQuestion from './WordBankQuestion';
import MatchingQuestion from './MatchingQuestion';
import ClassificationQuestion from './ClassificationQuestion';
import ShortAnswerQuestion from './ShortAnswerQuestion';

interface Props {
  question: CompType;
  currentAnswer?: Record<string, unknown>;
  onAnswer: (answer: Record<string, unknown>) => void;
  graded?: boolean;
  studentName?: string;
}

export default function ComprehensiveQuestion({
  question,
  currentAnswer = {},
  onAnswer,
  graded = false,
  studentName = 'Student',
}: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(
    question.subQuestions[0]?.id || null
  );

  const handleSubAnswer = (subId: string, answer: unknown) => {
    const newAnswers = { ...currentAnswer, [subId]: answer };
    onAnswer(newAnswers);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderSubQuestion = (subQ: Question) => {
    const props = {
      studentName,
      graded,
      currentAnswer: currentAnswer[subQ.id] as any,
      onAnswer: (ans: unknown) => handleSubAnswer(subQ.id, ans),
    };

    switch (subQ.type) {
      case 'multiple_choice':
        return <MultipleChoiceQuestion question={subQ} {...props} />;
      case 'true_false':
        return <TrueFalseQuestion question={subQ} {...props} />;
      case 'word_bank':
        return <WordBankQuestion question={subQ} {...props} />;
      case 'matching':
        return <MatchingQuestion question={subQ} {...props} />;
      case 'classification':
        return <ClassificationQuestion question={subQ} {...props} />;
      case 'short_answer':
        return <ShortAnswerQuestion question={subQ} {...props} />;
      default:
        return <div>Unknown question type</div>;
    }
  };

  const passageText = question.stem?.replace(/{{student_name}}/g, studentName);

  return (
    <div className="flex flex-col space-y-8 w-full">
      {/* Passage Area */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 w-full">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">
          Read the following passage:
        </h3>
        <div className="text-lg md:text-xl leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
          {passageText}
        </div>
      </div>

      {/* Sub-questions accordion */}
      <div className="flex flex-col space-y-4 w-full">
        {question.subQuestions.map((subQ, index) => {
          const isExpanded = expandedId === subQ.id;
          const isAnswered = currentAnswer[subQ.id] !== undefined;

          return (
            <div
              key={subQ.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleExpand(subQ.id)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                      isAnswered && !graded
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                    Question {index + 1}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-6 h-6 text-slate-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-400" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-100 dark:border-slate-800"
                  >
                    <div className="p-6 md:p-8">{renderSubQuestion(subQ)}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
