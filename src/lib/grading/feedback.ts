import type { PartResult } from '@/types';

export function generatePartFeedback(part: PartResult): string {
  const percentage = part.marks > 0 ? (part.score / part.marks) * 100 : 0;
  
  let feedback = `Part ${part.label}: ${part.score}/${part.marks}. `;
  if (percentage >= 80) {
    feedback += 'Excellent understanding of this section.';
  } else if (percentage >= 60) {
    feedback += 'Good effort, but review the material for better understanding.';
  } else {
    feedback += 'Needs review. Please study the related concepts again.';
  }

  return feedback;
}

export function generateOverallFeedback(
  percentage: number,
  weakTags: string[]
): string {
  const topWeakAreas = weakTags.slice(0, 3).join(', ');
  
  let summary = `You scored ${percentage.toFixed(1)}% on this quiz. `;
  
  if (percentage >= 90) {
    summary += 'Outstanding work! You have mastered these concepts.';
  } else if (percentage >= 70) {
    summary += 'Good job! You have a solid grasp of most concepts.';
  } else {
    summary += 'Keep practicing! Reviewing the material will help you improve.';
  }

  if (topWeakAreas.length > 0) {
    summary += `\n\nTop areas for review: ${topWeakAreas}.`;
  }

  return summary;
}
