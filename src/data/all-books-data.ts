import type { BookWithUnits } from '@/types';
import { sampleBookStructure } from './sample-book-structure';

/**
 * Biology: Everything You Need to Ace Biology in One Big Fat Notebook
 * 12 Units, 50 Chapters, 529 pages
 */
export const bookBiology: BookWithUnits = {
  id: 'book-biology-ace',
  title: 'Everything You Need to Ace Biology',
  series: 'Big Fat Notebook',
  publisher: 'Workman Publishing',
  totalPages: 529,
  gradeRange: '6-8',
  units: [
    {
      id: 'bio-unit-1', bookId: 'book-biology-ace', orderIndex: 1,
      title: 'Basics of Biology', pageStart: 1, pageEnd: 42,
      chapters: [
        { id: 'bio-ch-1', unitId: 'bio-unit-1', orderIndex: 1, title: 'Introduction to Biology', pageStart: 2, pageEnd: 10, estimatedMinutes: 15 },
        { id: 'bio-ch-2', unitId: 'bio-unit-1', orderIndex: 2, title: 'Critical Thinking in Biology', pageStart: 11, pageEnd: 18, estimatedMinutes: 15 },
        { id: 'bio-ch-3', unitId: 'bio-unit-1', orderIndex: 3, title: 'Characteristics of Life', pageStart: 19, pageEnd: 28, estimatedMinutes: 15 },
        { id: 'bio-ch-4', unitId: 'bio-unit-1', orderIndex: 4, title: 'Biological Classification', pageStart: 29, pageEnd: 42, estimatedMinutes: 18 },
      ],
    },
    {
      id: 'bio-unit-2', bookId: 'book-biology-ace', orderIndex: 2,
      title: 'The Chemistry of Life', pageStart: 43, pageEnd: 82,
      chapters: [
        { id: 'bio-ch-5', unitId: 'bio-unit-2', orderIndex: 5, title: 'Atoms and Molecules', pageStart: 44, pageEnd: 60, estimatedMinutes: 20 },
        { id: 'bio-ch-6', unitId: 'bio-unit-2', orderIndex: 6, title: 'The Importance of Water', pageStart: 61, pageEnd: 68, estimatedMinutes: 15 },
        { id: 'bio-ch-7', unitId: 'bio-unit-2', orderIndex: 7, title: 'Organic Compounds', pageStart: 69, pageEnd: 74, estimatedMinutes: 15 },
        { id: 'bio-ch-8', unitId: 'bio-unit-2', orderIndex: 8, title: 'Chemical Reactions and Enzymes', pageStart: 75, pageEnd: 82, estimatedMinutes: 15 },
      ],
    },
    {
      id: 'bio-unit-3', bookId: 'book-biology-ace', orderIndex: 3,
      title: 'Cell Theory', pageStart: 83, pageEnd: 140,
      chapters: [
        { id: 'bio-ch-9', unitId: 'bio-unit-3', orderIndex: 9, title: 'Cell Structure and Function', pageStart: 84, pageEnd: 96, estimatedMinutes: 18 },
        { id: 'bio-ch-10', unitId: 'bio-unit-3', orderIndex: 10, title: 'Chemical Energy and ATP', pageStart: 97, pageEnd: 102, estimatedMinutes: 12 },
        { id: 'bio-ch-11', unitId: 'bio-unit-3', orderIndex: 11, title: 'Photosynthesis', pageStart: 103, pageEnd: 108, estimatedMinutes: 15 },
        { id: 'bio-ch-12', unitId: 'bio-unit-3', orderIndex: 12, title: 'Cellular Respiration', pageStart: 109, pageEnd: 118, estimatedMinutes: 18 },
        { id: 'bio-ch-13', unitId: 'bio-unit-3', orderIndex: 13, title: 'Mitosis', pageStart: 119, pageEnd: 130, estimatedMinutes: 15 },
        { id: 'bio-ch-14', unitId: 'bio-unit-3', orderIndex: 14, title: 'Meiosis', pageStart: 131, pageEnd: 140, estimatedMinutes: 15 },
      ],
    },
    {
      id: 'bio-unit-4', bookId: 'book-biology-ace', orderIndex: 4,
      title: 'Bacteria, Viruses, Prions, and Viroids', pageStart: 141, pageEnd: 176,
      chapters: [
        { id: 'bio-ch-15', unitId: 'bio-unit-4', orderIndex: 15, title: 'Bacteria', pageStart: 142, pageEnd: 152, estimatedMinutes: 15 },
        { id: 'bio-ch-16', unitId: 'bio-unit-4', orderIndex: 16, title: 'Viruses', pageStart: 153, pageEnd: 162, estimatedMinutes: 15 },
        { id: 'bio-ch-17', unitId: 'bio-unit-4', orderIndex: 17, title: 'Prions and Viroids', pageStart: 163, pageEnd: 168, estimatedMinutes: 12 },
        { id: 'bio-ch-18', unitId: 'bio-unit-4', orderIndex: 18, title: 'Disease', pageStart: 169, pageEnd: 176, estimatedMinutes: 15 },
      ],
    },
    {
      id: 'bio-unit-7', bookId: 'book-biology-ace', orderIndex: 7,
      title: 'Plants', pageStart: 229, pageEnd: 266,
      chapters: [
        { id: 'bio-ch-26', unitId: 'bio-unit-7', orderIndex: 26, title: 'The Plant Kingdom', pageStart: 230, pageEnd: 240, estimatedMinutes: 15 },
        { id: 'bio-ch-27', unitId: 'bio-unit-7', orderIndex: 27, title: 'Plant Structure and Function', pageStart: 241, pageEnd: 247, estimatedMinutes: 15 },
        { id: 'bio-ch-28', unitId: 'bio-unit-7', orderIndex: 28, title: 'Plant Reproduction', pageStart: 248, pageEnd: 256, estimatedMinutes: 15 },
        { id: 'bio-ch-29', unitId: 'bio-unit-7', orderIndex: 29, title: 'Plant Adaptation', pageStart: 257, pageEnd: 266, estimatedMinutes: 15 },
      ],
    },
    {
      id: 'bio-unit-9', bookId: 'book-biology-ace', orderIndex: 9,
      title: 'The Human Body', pageStart: 325, pageEnd: 412,
      chapters: [
        { id: 'bio-ch-36', unitId: 'bio-unit-9', orderIndex: 36, title: 'Body Systems and Homeostasis', pageStart: 326, pageEnd: 333, estimatedMinutes: 15 },
        { id: 'bio-ch-39', unitId: 'bio-unit-9', orderIndex: 39, title: 'The Nervous and Endocrine Systems', pageStart: 353, pageEnd: 366, estimatedMinutes: 18 },
        { id: 'bio-ch-40', unitId: 'bio-unit-9', orderIndex: 40, title: 'The Respiratory and Circulatory Systems', pageStart: 367, pageEnd: 379, estimatedMinutes: 18 },
      ],
    },
    {
      id: 'bio-unit-10', bookId: 'book-biology-ace', orderIndex: 10,
      title: 'Genetics', pageStart: 413, pageEnd: 450,
      chapters: [
        { id: 'bio-ch-44', unitId: 'bio-unit-10', orderIndex: 44, title: 'Introduction to Genetics', pageStart: 414, pageEnd: 428, estimatedMinutes: 18 },
        { id: 'bio-ch-45', unitId: 'bio-unit-10', orderIndex: 45, title: 'DNA and RNA', pageStart: 429, pageEnd: 444, estimatedMinutes: 20 },
        { id: 'bio-ch-46', unitId: 'bio-unit-10', orderIndex: 46, title: 'Genetic Engineering', pageStart: 445, pageEnd: 450, estimatedMinutes: 15 },
      ],
    },
  ],
};

/**
 * Chemistry: Everything You Need to Ace Chemistry in One Big Fat Notebook
 * 12 Units, 36 Chapters, 519 pages
 */
export const bookChemistry: BookWithUnits = {
  id: 'book-chemistry-ace',
  title: 'Everything You Need to Ace Chemistry',
  series: 'Big Fat Notebook',
  publisher: 'Workman Publishing',
  totalPages: 519,
  gradeRange: '8-10',
  units: [
    {
      id: 'chem-unit-1', bookId: 'book-chemistry-ace', orderIndex: 1,
      title: 'Basics of Chemistry', pageStart: 1, pageEnd: 72,
      chapters: [
        { id: 'chem-ch-1', unitId: 'chem-unit-1', orderIndex: 1, title: 'Introduction to Chemistry', pageStart: 2, pageEnd: 15, estimatedMinutes: 15 },
        { id: 'chem-ch-2', unitId: 'chem-unit-1', orderIndex: 2, title: 'Conducting Experiments', pageStart: 16, pageEnd: 26, estimatedMinutes: 15 },
        { id: 'chem-ch-4', unitId: 'chem-unit-1', orderIndex: 4, title: 'Measurement and SI Units', pageStart: 40, pageEnd: 54, estimatedMinutes: 15 },
      ],
    },
    {
      id: 'chem-unit-2', bookId: 'book-chemistry-ace', orderIndex: 2,
      title: 'All About Matter', pageStart: 73, pageEnd: 112,
      chapters: [
        { id: 'chem-ch-6', unitId: 'chem-unit-2', orderIndex: 6, title: 'Properties of Matter & Changes in Form', pageStart: 74, pageEnd: 85, estimatedMinutes: 15 },
        { id: 'chem-ch-7', unitId: 'chem-unit-2', orderIndex: 7, title: 'States of Matter and Phase Changes', pageStart: 86, pageEnd: 99, estimatedMinutes: 15 },
        { id: 'chem-ch-8', unitId: 'chem-unit-2', orderIndex: 8, title: 'Atoms, Elements, Compounds, and Mixtures', pageStart: 100, pageEnd: 112, estimatedMinutes: 18 },
      ],
    },
    {
      id: 'chem-unit-4', bookId: 'book-chemistry-ace', orderIndex: 4,
      title: 'Elements and the Periodic Table', pageStart: 135, pageEnd: 178,
      chapters: [
        { id: 'chem-ch-11', unitId: 'chem-unit-4', orderIndex: 11, title: 'The Periodic Table', pageStart: 136, pageEnd: 150, estimatedMinutes: 18 },
        { id: 'chem-ch-12', unitId: 'chem-unit-4', orderIndex: 12, title: 'Periodic Trends', pageStart: 151, pageEnd: 171, estimatedMinutes: 20 },
      ],
    },
    {
      id: 'chem-unit-6', bookId: 'book-chemistry-ace', orderIndex: 6,
      title: 'Chemical Compounds and The Mole', pageStart: 231, pageEnd: 272,
      chapters: [
        { id: 'chem-ch-17', unitId: 'chem-unit-6', orderIndex: 17, title: 'Naming Chemical Substances', pageStart: 232, pageEnd: 248, estimatedMinutes: 20 },
        { id: 'chem-ch-18', unitId: 'chem-unit-6', orderIndex: 18, title: 'The Mole and Avogadro Number', pageStart: 249, pageEnd: 262, estimatedMinutes: 20 },
      ],
    },
    {
      id: 'chem-unit-7', bookId: 'book-chemistry-ace', orderIndex: 7,
      title: 'Chemical Reactions and Calculations', pageStart: 273, pageEnd: 310,
      chapters: [
        { id: 'chem-ch-20', unitId: 'chem-unit-7', orderIndex: 20, title: 'Balancing Chemical Reactions', pageStart: 274, pageEnd: 289, estimatedMinutes: 20 },
        { id: 'chem-ch-21', unitId: 'chem-unit-7', orderIndex: 21, title: 'Stoichiometry Calculations', pageStart: 290, pageEnd: 310, estimatedMinutes: 25 },
      ],
    },
    {
      id: 'chem-unit-10', bookId: 'book-chemistry-ace', orderIndex: 10,
      title: 'Acids, Bases, and pH', pageStart: 383, pageEnd: 422,
      chapters: [
        { id: 'chem-ch-28', unitId: 'chem-unit-10', orderIndex: 28, title: 'Properties of Acids and Bases', pageStart: 384, pageEnd: 392, estimatedMinutes: 15 },
        { id: 'chem-ch-29', unitId: 'chem-unit-10', orderIndex: 29, title: 'pH Scale and Neutralization', pageStart: 393, pageEnd: 404, estimatedMinutes: 18 },
      ],
    },
  ],
};

/**
 * Middle School Math: Everything You Need to Ace Math in One Big Fat Notebook
 * 6 Units, 63 Chapters, 529 pages
 */
export const bookMath: BookWithUnits = {
  id: 'book-math-ace',
  title: 'Everything You Need to Ace Math',
  series: 'Big Fat Notebook',
  publisher: 'Workman Publishing',
  totalPages: 529,
  gradeRange: '6-8',
  units: [
    {
      id: 'math-unit-1', bookId: 'book-math-ace', orderIndex: 1,
      title: 'The Number System', pageStart: 1, pageEnd: 84,
      chapters: [
        { id: 'math-ch-1', unitId: 'math-unit-1', orderIndex: 1, title: 'Types of Numbers & Number Line', pageStart: 2, pageEnd: 10, estimatedMinutes: 15 },
        { id: 'math-ch-3', unitId: 'math-unit-1', orderIndex: 3, title: 'Absolute Value', pageStart: 19, pageEnd: 24, estimatedMinutes: 12 },
        { id: 'math-ch-4', unitId: 'math-unit-1', orderIndex: 4, title: 'Factors and GCF', pageStart: 25, pageEnd: 32, estimatedMinutes: 15 },
        { id: 'math-ch-6', unitId: 'math-unit-1', orderIndex: 6, title: 'Fraction Basics & Addition/Subtraction', pageStart: 39, pageEnd: 48, estimatedMinutes: 18 },
        { id: 'math-ch-11', unitId: 'math-unit-1', orderIndex: 11, title: 'Adding & Subtracting Integers', pageStart: 65, pageEnd: 74, estimatedMinutes: 15 },
      ],
    },
    {
      id: 'math-unit-2', bookId: 'book-math-ace', orderIndex: 2,
      title: 'Ratios, Proportions, and Percents', pageStart: 85, pageEnd: 164,
      chapters: [
        { id: 'math-ch-15', unitId: 'math-unit-2', orderIndex: 15, title: 'Ratios and Unit Rates', pageStart: 86, pageEnd: 94, estimatedMinutes: 15 },
        { id: 'math-ch-17', unitId: 'math-unit-2', orderIndex: 17, title: 'Proportions and Scale', pageStart: 95, pageEnd: 102, estimatedMinutes: 15 },
        { id: 'math-ch-19', unitId: 'math-unit-2', orderIndex: 19, title: 'Percent Word Problems & Discounts', pageStart: 111, pageEnd: 130, estimatedMinutes: 18 },
      ],
    },
    {
      id: 'math-unit-3', bookId: 'book-math-ace', orderIndex: 3,
      title: 'Expressions and Equations', pageStart: 165, pageEnd: 250,
      chapters: [
        { id: 'math-ch-27', unitId: 'math-unit-3', orderIndex: 27, title: 'Algebraic Expressions & Order of Operations', pageStart: 166, pageEnd: 196, estimatedMinutes: 18 },
        { id: 'math-ch-35', unitId: 'math-unit-3', orderIndex: 35, title: 'Solving One-Step & Multi-Step Equations', pageStart: 219, pageEnd: 236, estimatedMinutes: 20 },
      ],
    },
    {
      id: 'math-unit-4', bookId: 'book-math-ace', orderIndex: 4,
      title: 'Geometry', pageStart: 251, pageEnd: 354,
      chapters: [
        { id: 'math-ch-41', unitId: 'math-unit-4', orderIndex: 41, title: 'Angles, Triangles, and Area', pageStart: 267, pageEnd: 294, estimatedMinutes: 18 },
        { id: 'math-ch-44', unitId: 'math-unit-4', orderIndex: 44, title: 'The Pythagorean Theorem', pageStart: 295, pageEnd: 300, estimatedMinutes: 15 },
        { id: 'math-ch-45', unitId: 'math-unit-4', orderIndex: 45, title: 'Circles: Circumference and Area', pageStart: 301, pageEnd: 308, estimatedMinutes: 15 },
      ],
    },
  ],
};

/**
 * Pre-Algebra & Algebra 1: Everything You Need to Ace Pre-Algebra and Algebra 1
 * 11 Units, 51 Chapters, 641 pages
 */
export const bookAlgebra: BookWithUnits = {
  id: 'book-algebra-ace',
  title: 'Everything You Need to Ace Pre-Algebra & Algebra 1',
  series: 'Big Fat Notebook',
  publisher: 'Workman Publishing',
  totalPages: 641,
  gradeRange: '7-9',
  units: [
    {
      id: 'alg-unit-1', bookId: 'book-algebra-ace', orderIndex: 1,
      title: 'Arithmetic Properties & Order of Operations', pageStart: 1, pageEnd: 22,
      chapters: [
        { id: 'alg-ch-1', unitId: 'alg-unit-1', orderIndex: 1, title: 'Types of Numbers & Real Number Subsets', pageStart: 2, pageEnd: 8, estimatedMinutes: 15 },
        { id: 'alg-ch-2', unitId: 'alg-unit-1', orderIndex: 2, title: 'Algebraic Properties (Distributive, Commutative)', pageStart: 9, pageEnd: 16, estimatedMinutes: 15 },
        { id: 'alg-ch-3', unitId: 'alg-unit-1', orderIndex: 3, title: 'PEMDAS Order of Operations', pageStart: 17, pageEnd: 22, estimatedMinutes: 15 },
      ],
    },
    {
      id: 'alg-unit-4', bookId: 'book-algebra-ace', orderIndex: 4,
      title: 'Exponents & Combining Like Terms', pageStart: 141, pageEnd: 174,
      chapters: [
        { id: 'alg-ch-19', unitId: 'alg-unit-4', orderIndex: 19, title: 'Laws of Exponents & Scientific Notation', pageStart: 142, pageEnd: 154, estimatedMinutes: 18 },
        { id: 'alg-ch-22', unitId: 'alg-unit-4', orderIndex: 22, title: 'Evaluating Expressions & Like Terms', pageStart: 163, pageEnd: 174, estimatedMinutes: 15 },
      ],
    },
    {
      id: 'alg-unit-5', bookId: 'book-algebra-ace', orderIndex: 5,
      title: 'Linear Equations & Systems', pageStart: 175, pageEnd: 246,
      chapters: [
        { id: 'alg-ch-25', unitId: 'alg-unit-5', orderIndex: 25, title: 'Solving Multi-Step Linear Equations', pageStart: 185, pageEnd: 194, estimatedMinutes: 20 },
        { id: 'alg-ch-29', unitId: 'alg-unit-5', orderIndex: 29, title: 'Systems of Equations: Substitution & Elimination', pageStart: 225, pageEnd: 246, estimatedMinutes: 25 },
      ],
    },
    {
      id: 'alg-unit-6', bookId: 'book-algebra-ace', orderIndex: 6,
      title: 'Graphing Lines, Slope & Intercepts', pageStart: 247, pageEnd: 324,
      chapters: [
        { id: 'alg-ch-33', unitId: 'alg-unit-6', orderIndex: 33, title: 'Slope of a Line (Rise over Run)', pageStart: 263, pageEnd: 276, estimatedMinutes: 18 },
        { id: 'alg-ch-34', unitId: 'alg-unit-6', orderIndex: 34, title: 'Slope-Intercept Form (y = mx + b)', pageStart: 277, pageEnd: 288, estimatedMinutes: 20 },
      ],
    },
  ],
};

/** All 5 STEM Books in ReadQuest */
export const allBooks: BookWithUnits[] = [
  sampleBookStructure,
  bookBiology,
  bookChemistry,
  bookMath,
  bookAlgebra,
];

export function getBookById(id: string): BookWithUnits {
  return allBooks.find((b) => b.id === id) ?? sampleBookStructure;
}
