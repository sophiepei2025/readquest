/**
 * ReadQuest Auto-Grading Engine
 *
 * Grades all question types automatically. For objective questions (word_bank,
 * matching, true_false, classification, multiple_choice), grading is exact.
 * For short_answer, uses keyword matching. For comprehensive, recursively
 * grades sub-questions.
 */

import type {
  Question,
  StudentAnswer,
  AnswerGrade,
  PartResult,
  GradingResult,
} from '@/types';

export function gradeQuiz(
  questions: Question[],
  studentAnswers: StudentAnswer[]
): GradingResult {
  const answerMap = new Map(studentAnswers.map((a) => [a.questionId, a.answer]));
  const answerGrades: AnswerGrade[] = [];
  const partMap = new Map<string, { score: number; marks: number; weakTags: string[] }>();

  for (const question of questions) {
    const studentAnswer = answerMap.get(question.id);
    const grade = gradeQuestion(question, studentAnswer);
    answerGrades.push(grade);

    // Aggregate by part
    const partKey = `Part ${question.partLabel}`;
    const existing = partMap.get(partKey) ?? { score: 0, marks: 0, weakTags: [] };
    existing.score += grade.score;
    existing.marks += grade.maxScore;
    existing.weakTags.push(...grade.weakTags);
    partMap.set(partKey, existing);
  }

  // Build part results
  const parts: PartResult[] = [];
  const partLabels = ['A', 'B', 'C', 'D'];
  const partNames: Record<string, string> = {
    A: 'Vocabulary',
    B: 'True/False',
    C: 'Multiple Choice',
    D: 'Comprehensive',
  };

  for (const label of partLabels) {
    const key = `Part ${label}`;
    const data = partMap.get(key);
    if (!data) continue;

    const pct = data.marks > 0 ? (data.score / data.marks) * 100 : 0;
    const feedback =
      pct >= 90
        ? `Excellent work on ${partNames[label] ?? label}!`
        : pct >= 70
          ? `Good effort on ${partNames[label] ?? label}. Review the marked items.`
          : `Needs more practice on ${partNames[label] ?? label}. Re-read the relevant sections.`;

    parts.push({
      label: `${key} — ${partNames[label] ?? ''}`.trim(),
      score: data.score,
      marks: data.marks,
      feedback,
      weakTags: [...new Set(data.weakTags)],
    });
  }

  // Collect unique weak tags
  const allWeakTags = [...new Set(answerGrades.flatMap((g) => g.weakTags))];

  const totalScore = answerGrades.reduce((sum, g) => sum + g.score, 0);
  const totalMarks = answerGrades.reduce((sum, g) => sum + g.maxScore, 0);
  const percentage = totalMarks > 0 ? Math.round((totalScore / totalMarks) * 100) : 0;

  const recommendation = generateRecommendation(percentage, allWeakTags);

  return {
    totalScore,
    totalMarks,
    percentage,
    parts,
    weakKnowledgeTags: allWeakTags,
    recommendation,
    answerGrades,
  };
}

function gradeQuestion(question: Question, studentAnswer: unknown): AnswerGrade {
  switch (question.type) {
    case 'word_bank':
      return gradeWordBank(question, studentAnswer);
    case 'matching':
      return gradeMatching(question, studentAnswer);
    case 'true_false':
      return gradeTrueFalse(question, studentAnswer);
    case 'classification':
      return gradeClassification(question, studentAnswer);
    case 'multiple_choice':
      return gradeMultipleChoice(question, studentAnswer);
    case 'short_answer':
      return gradeShortAnswer(question, studentAnswer);
    case 'comprehensive':
      return gradeComprehensive(question, studentAnswer);
    default:
      return {
        questionId: (question as Question).id,
        isCorrect: false,
        score: 0,
        maxScore: (question as Question).marks,
        feedback: 'Unknown question type.',
        weakTags: [],
      };
  }
}

// ─── Word Bank ──────────────────────────────────────────────────────────────

function gradeWordBank(
  question: Extract<Question, { type: 'word_bank' }>,
  answer: unknown
): AnswerGrade {
  // Answer format: Record<number, string> (blank index → word)
  const studentBlanks = (answer as Record<string, string>) ?? {};
  let correct = 0;

  for (let i = 0; i < question.blanks.length; i++) {
    const expected = question.blanks[i].toLowerCase().trim();
    const given = (studentBlanks[String(i)] ?? '').toLowerCase().trim();
    if (given === expected) correct++;
  }

  const total = question.blanks.length;
  const marksPerBlank = question.marks / total;
  const score = Math.round(correct * marksPerBlank);

  return {
    questionId: question.id,
    isCorrect: correct === total,
    score,
    maxScore: question.marks,
    feedback:
      correct === total
        ? 'All blanks filled correctly!'
        : `${correct}/${total} correct. Review: ${question.blanks.filter((b, i) => (studentBlanks[String(i)] ?? '').toLowerCase().trim() !== b.toLowerCase()).join(', ')}.`,
    weakTags: correct < total ? question.knowledgeTags : [],
  };
}

// ─── Matching ───────────────────────────────────────────────────────────────

function gradeMatching(
  question: Extract<Question, { type: 'matching' }>,
  answer: unknown
): AnswerGrade {
  // Answer format: Record<string, string> (left → right)
  const matches = (answer as Record<string, string>) ?? {};
  let correct = 0;

  for (const pair of question.pairs) {
    if ((matches[pair.left] ?? '').toLowerCase().trim() === pair.right.toLowerCase().trim()) {
      correct++;
    }
  }

  const total = question.pairs.length;
  const score = Math.round((correct / total) * question.marks);

  return {
    questionId: question.id,
    isCorrect: correct === total,
    score,
    maxScore: question.marks,
    feedback: correct === total ? 'All pairs matched correctly!' : `${correct}/${total} pairs correct.`,
    weakTags: correct < total ? question.knowledgeTags : [],
  };
}

// ─── True/False ─────────────────────────────────────────────────────────────

function gradeTrueFalse(
  question: Extract<Question, { type: 'true_false' }>,
  answer: unknown
): AnswerGrade {
  // Answer format: { choice: boolean; correction?: string }
  const studentAns = answer as { choice: boolean; correction?: string } | null;
  if (!studentAns) {
    return {
      questionId: question.id,
      isCorrect: false,
      score: 0,
      maxScore: question.marks,
      feedback: 'No answer provided.',
      weakTags: question.knowledgeTags,
    };
  }

  const isCorrect = studentAns.choice === question.isTrue;

  return {
    questionId: question.id,
    isCorrect,
    score: isCorrect ? question.marks : 0,
    maxScore: question.marks,
    feedback: isCorrect
      ? 'Correct!'
      : `Incorrect. The answer is ${question.isTrue ? 'TRUE' : 'FALSE'}.${question.correctionText ? ' ' + question.correctionText : ''}`,
    weakTags: isCorrect ? [] : question.knowledgeTags,
  };
}

// ─── Classification ─────────────────────────────────────────────────────────

function gradeClassification(
  question: Extract<Question, { type: 'classification' }>,
  answer: unknown
): AnswerGrade {
  // Answer format: Record<string, string> (item text → category)
  const placements = (answer as Record<string, string>) ?? {};
  let correct = 0;

  for (const item of question.items) {
    if ((placements[item.text] ?? '').toLowerCase().trim() === item.correctCategory.toLowerCase().trim()) {
      correct++;
    }
  }

  const total = question.items.length;
  const score = Math.round((correct / total) * question.marks);

  return {
    questionId: question.id,
    isCorrect: correct === total,
    score,
    maxScore: question.marks,
    feedback: correct === total ? 'All items correctly classified!' : `${correct}/${total} correctly categorized.`,
    weakTags: correct < total ? question.knowledgeTags : [],
  };
}

// ─── Multiple Choice ────────────────────────────────────────────────────────

function gradeMultipleChoice(
  question: Extract<Question, { type: 'multiple_choice' }>,
  answer: unknown
): AnswerGrade {
  // Answer format: string (selected option ID)
  const selectedId = answer as string | null;
  const isCorrect = selectedId === question.correctOptionId;
  const correctOption = question.options.find((o) => o.id === question.correctOptionId);

  return {
    questionId: question.id,
    isCorrect,
    score: isCorrect ? question.marks : 0,
    maxScore: question.marks,
    feedback: isCorrect
      ? 'Correct!'
      : `Incorrect. The correct answer is: "${correctOption?.text ?? ''}".${question.explanation ? ' ' + question.explanation : ''}`,
    weakTags: isCorrect ? [] : question.knowledgeTags,
  };
}

// ─── Short Answer ───────────────────────────────────────────────────────────

function gradeShortAnswer(
  question: Extract<Question, { type: 'short_answer' }>,
  answer: unknown
): AnswerGrade {
  // Answer format: string
  const studentText = ((answer as string) ?? '').toLowerCase().trim();
  if (!studentText) {
    return {
      questionId: question.id,
      isCorrect: false,
      score: 0,
      maxScore: question.marks,
      feedback: 'No answer provided.',
      weakTags: question.knowledgeTags,
    };
  }

  // Keyword matching
  const foundKeywords = question.keywords.filter((kw) =>
    studentText.includes(kw.toLowerCase())
  );
  const ratio = question.keywords.length > 0 ? foundKeywords.length / question.keywords.length : 0;
  const score = Math.round(ratio * question.marks);
  const isCorrect = ratio >= 0.7;

  return {
    questionId: question.id,
    isCorrect,
    score,
    maxScore: question.marks,
    feedback:
      ratio >= 0.7
        ? `Good answer! Keywords found: ${foundKeywords.join(', ')}.`
        : `Needs improvement. Try to include: ${question.keywords.filter((kw) => !foundKeywords.includes(kw)).join(', ')}. Sample answer: "${question.sampleAnswer}"`,
    weakTags: isCorrect ? [] : question.knowledgeTags,
  };
}

// ─── Comprehensive ──────────────────────────────────────────────────────────

function gradeComprehensive(
  question: Extract<Question, { type: 'comprehensive' }>,
  answer: unknown
): AnswerGrade {
  // Answer format: Record<string, unknown> (sub-question ID → answer)
  const subAnswers = (answer as Record<string, unknown>) ?? {};
  let totalScore = 0;
  let totalMax = 0;
  const allWeakTags: string[] = [];
  const subFeedback: string[] = [];

  for (const subQ of question.subQuestions) {
    const subGrade = gradeQuestion(subQ, subAnswers[subQ.id]);
    totalScore += subGrade.score;
    totalMax += subGrade.maxScore;
    allWeakTags.push(...subGrade.weakTags);
    if (!subGrade.isCorrect) {
      subFeedback.push(subGrade.feedback);
    }
  }

  const isCorrect = totalScore === totalMax;

  return {
    questionId: question.id,
    isCorrect,
    score: totalScore,
    maxScore: totalMax,
    feedback: isCorrect
      ? 'Excellent comprehensive answer!'
      : `Score: ${totalScore}/${totalMax}. ${subFeedback.join(' ')}`,
    weakTags: [...new Set(allWeakTags)],
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateRecommendation(percentage: number, weakTags: string[]): string {
  if (percentage >= 90) {
    return 'Outstanding performance! You have a strong grasp of this chapter. Move on to the next one!';
  }
  if (percentage >= 75) {
    return `Good work! Consider reviewing these topics before moving on: ${weakTags.join(', ')}.`;
  }
  if (percentage >= 60) {
    return `Decent effort. Re-read the chapter and pay special attention to: ${weakTags.join(', ')}. Then try the quiz again.`;
  }
  return `This chapter needs more study time. Re-read carefully and focus on: ${weakTags.join(', ')}. Don't hesitate to ask for help!`;
}
