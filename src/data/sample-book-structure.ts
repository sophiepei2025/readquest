import type { BookWithUnits } from '@/types';

/**
 * Complete book structure for "Everything You Need to Ace Science"
 * 11 Units, 49 Chapters, 544 pages
 *
 * Page ranges are estimated based on ~11 pages per chapter average.
 * Actual page numbers should be verified against the physical book.
 */
export const sampleBookStructure: BookWithUnits = {
  id: 'book-science-ace',
  title: 'Everything You Need to Ace Science',
  series: 'Big Fat Notebook',
  publisher: 'Workman Publishing',
  totalPages: 544,
  gradeRange: '6-8',
  units: [
    {
      id: 'unit-1', bookId: 'book-science-ace', orderIndex: 1,
      title: 'Scientific Investigation',
      pageStart: 1, pageEnd: 54,
      chapters: [
        { id: 'ch-1', unitId: 'unit-1', orderIndex: 1, title: 'Thinking Like a Scientist', pageStart: 1, pageEnd: 12, estimatedMinutes: 15 },
        { id: 'ch-2', unitId: 'unit-1', orderIndex: 2, title: 'Scientific Experiments', pageStart: 13, pageEnd: 24, estimatedMinutes: 15 },
        { id: 'ch-3', unitId: 'unit-1', orderIndex: 3, title: 'Lab Reports and Evaluating Results', pageStart: 25, pageEnd: 36, estimatedMinutes: 15 },
        { id: 'ch-4', unitId: 'unit-1', orderIndex: 4, title: 'SI Units and Measurements', pageStart: 37, pageEnd: 46, estimatedMinutes: 12 },
        { id: 'ch-5', unitId: 'unit-1', orderIndex: 5, title: 'Lab Safety and Scientific Tools', pageStart: 47, pageEnd: 54, estimatedMinutes: 10 },
      ],
    },
    {
      id: 'unit-2', bookId: 'book-science-ace', orderIndex: 2,
      title: 'Matter, Chemical Reactions, and Solutions',
      pageStart: 55, pageEnd: 100,
      chapters: [
        { id: 'ch-6', unitId: 'unit-2', orderIndex: 6, title: 'Matter, Properties, and Phases', pageStart: 55, pageEnd: 72, estimatedMinutes: 20 },
        { id: 'ch-7', unitId: 'unit-2', orderIndex: 7, title: 'Periodic Table, Atomic Structure, and Compounds', pageStart: 73, pageEnd: 90, estimatedMinutes: 25 },
        { id: 'ch-8', unitId: 'unit-2', orderIndex: 8, title: 'Solutions and Fluids', pageStart: 91, pageEnd: 100, estimatedMinutes: 12 },
      ],
    },
    {
      id: 'unit-3', bookId: 'book-science-ace', orderIndex: 3,
      title: 'Motion, Forces, and Work',
      pageStart: 101, pageEnd: 148,
      chapters: [
        { id: 'ch-9', unitId: 'unit-3', orderIndex: 9, title: 'Motion', pageStart: 101, pageEnd: 112, estimatedMinutes: 15 },
        { id: 'ch-10', unitId: 'unit-3', orderIndex: 10, title: "Force and Newton's Laws of Motion", pageStart: 113, pageEnd: 124, estimatedMinutes: 18 },
        { id: 'ch-11', unitId: 'unit-3', orderIndex: 11, title: 'Gravity, Friction, and More Forces', pageStart: 125, pageEnd: 136, estimatedMinutes: 15 },
        { id: 'ch-12', unitId: 'unit-3', orderIndex: 12, title: 'Work and Machines', pageStart: 137, pageEnd: 148, estimatedMinutes: 15 },
      ],
    },
    {
      id: 'unit-4', bookId: 'book-science-ace', orderIndex: 4,
      title: 'Energy',
      pageStart: 149, pageEnd: 208,
      chapters: [
        { id: 'ch-13', unitId: 'unit-4', orderIndex: 13, title: 'Forms of Energy', pageStart: 149, pageEnd: 160, estimatedMinutes: 15 },
        { id: 'ch-14', unitId: 'unit-4', orderIndex: 14, title: 'Thermal Energy', pageStart: 161, pageEnd: 172, estimatedMinutes: 15 },
        { id: 'ch-15', unitId: 'unit-4', orderIndex: 15, title: 'Light and Sound Waves', pageStart: 173, pageEnd: 184, estimatedMinutes: 18 },
        { id: 'ch-16', unitId: 'unit-4', orderIndex: 16, title: 'Electricity and Magnetism', pageStart: 185, pageEnd: 196, estimatedMinutes: 18 },
        { id: 'ch-17', unitId: 'unit-4', orderIndex: 17, title: 'Electrical Energy Sources', pageStart: 197, pageEnd: 208, estimatedMinutes: 15 },
      ],
    },
    {
      id: 'unit-5', bookId: 'book-science-ace', orderIndex: 5,
      title: 'Outer Space: The Universe and the Solar System',
      pageStart: 209, pageEnd: 256,
      chapters: [
        { id: 'ch-18', unitId: 'unit-5', orderIndex: 18, title: 'The Solar System and Space Exploration', pageStart: 209, pageEnd: 222, estimatedMinutes: 18 },
        { id: 'ch-19', unitId: 'unit-5', orderIndex: 19, title: 'The Sun-Earth-Moon System', pageStart: 223, pageEnd: 234, estimatedMinutes: 15 },
        { id: 'ch-20', unitId: 'unit-5', orderIndex: 20, title: 'Stars and Galaxies', pageStart: 235, pageEnd: 246, estimatedMinutes: 15 },
        { id: 'ch-21', unitId: 'unit-5', orderIndex: 21, title: 'The Origin of the Universe and Our Solar System', pageStart: 247, pageEnd: 256, estimatedMinutes: 12 },
      ],
    },
    {
      id: 'unit-6', bookId: 'book-science-ace', orderIndex: 6,
      title: 'The Earth, Weather, Atmosphere, and Climate',
      pageStart: 257, pageEnd: 326,
      chapters: [
        { id: 'ch-22', unitId: 'unit-6', orderIndex: 22, title: "Minerals, Rocks, and the Earth's Structure", pageStart: 257, pageEnd: 270, estimatedMinutes: 18 },
        { id: 'ch-23', unitId: 'unit-6', orderIndex: 23, title: "Earth's Crust in Motion", pageStart: 271, pageEnd: 282, estimatedMinutes: 15 },
        { id: 'ch-24', unitId: 'unit-6', orderIndex: 24, title: 'Weathering and Erosion', pageStart: 283, pageEnd: 294, estimatedMinutes: 15 },
        { id: 'ch-25', unitId: 'unit-6', orderIndex: 25, title: "The Earth's Atmosphere and Water Cycle", pageStart: 295, pageEnd: 306, estimatedMinutes: 15 },
        { id: 'ch-26', unitId: 'unit-6', orderIndex: 26, title: 'Weather', pageStart: 307, pageEnd: 318, estimatedMinutes: 15 },
        { id: 'ch-27', unitId: 'unit-6', orderIndex: 27, title: 'Climate', pageStart: 319, pageEnd: 326, estimatedMinutes: 10 },
      ],
    },
    {
      id: 'unit-7', bookId: 'book-science-ace', orderIndex: 7,
      title: 'Life: Classification and Cells',
      pageStart: 327, pageEnd: 378,
      chapters: [
        { id: 'ch-28', unitId: 'unit-7', orderIndex: 28, title: 'Organisms and Biological Classification', pageStart: 327, pageEnd: 340, estimatedMinutes: 18 },
        { id: 'ch-29', unitId: 'unit-7', orderIndex: 29, title: 'Cell Theory and Cell Structure', pageStart: 341, pageEnd: 352, estimatedMinutes: 15 },
        { id: 'ch-30', unitId: 'unit-7', orderIndex: 30, title: 'Cellular Transport and Metabolism', pageStart: 353, pageEnd: 366, estimatedMinutes: 18 },
        { id: 'ch-31', unitId: 'unit-7', orderIndex: 31, title: 'Cell Reproduction and Protein Synthesis', pageStart: 367, pageEnd: 378, estimatedMinutes: 18 },
      ],
    },
    {
      id: 'unit-8', bookId: 'book-science-ace', orderIndex: 8,
      title: 'Plants and Animals',
      pageStart: 379, pageEnd: 422,
      chapters: [
        { id: 'ch-32', unitId: 'unit-8', orderIndex: 32, title: 'Plant Structure and Reproduction', pageStart: 379, pageEnd: 392, estimatedMinutes: 18 },
        { id: 'ch-33', unitId: 'unit-8', orderIndex: 33, title: 'Animals: Invertebrates', pageStart: 393, pageEnd: 404, estimatedMinutes: 15 },
        { id: 'ch-34', unitId: 'unit-8', orderIndex: 34, title: 'Animals: Vertebrates', pageStart: 405, pageEnd: 414, estimatedMinutes: 12 },
        { id: 'ch-35', unitId: 'unit-8', orderIndex: 35, title: 'Animal and Plant Homeostasis and Behavior', pageStart: 415, pageEnd: 422, estimatedMinutes: 10 },
      ],
    },
    {
      id: 'unit-9', bookId: 'book-science-ace', orderIndex: 9,
      title: 'The Human Body and Body Systems',
      pageStart: 423, pageEnd: 486,
      chapters: [
        { id: 'ch-36', unitId: 'unit-9', orderIndex: 36, title: 'Skeletal and Muscular Systems', pageStart: 423, pageEnd: 434, estimatedMinutes: 15 },
        { id: 'ch-37', unitId: 'unit-9', orderIndex: 37, title: 'Nervous and Endocrine Systems', pageStart: 435, pageEnd: 446, estimatedMinutes: 15 },
        { id: 'ch-38', unitId: 'unit-9', orderIndex: 38, title: 'Digestive and Excretory Systems', pageStart: 447, pageEnd: 456, estimatedMinutes: 12 },
        { id: 'ch-39', unitId: 'unit-9', orderIndex: 39, title: 'Respiratory and Circulatory Systems', pageStart: 457, pageEnd: 468, estimatedMinutes: 15 },
        { id: 'ch-40', unitId: 'unit-9', orderIndex: 40, title: 'Immune and Lymphatic Systems', pageStart: 469, pageEnd: 478, estimatedMinutes: 12 },
        { id: 'ch-41', unitId: 'unit-9', orderIndex: 41, title: 'Human Reproductive and Development', pageStart: 479, pageEnd: 486, estimatedMinutes: 10 },
      ],
    },
    {
      id: 'unit-10', bookId: 'book-science-ace', orderIndex: 10,
      title: 'History of Life: Heredity, Evolution, and Fossils',
      pageStart: 487, pageEnd: 522,
      chapters: [
        { id: 'ch-42', unitId: 'unit-10', orderIndex: 42, title: 'Heredity and Genetics', pageStart: 487, pageEnd: 498, estimatedMinutes: 18 },
        { id: 'ch-43', unitId: 'unit-10', orderIndex: 43, title: 'Evolution', pageStart: 499, pageEnd: 508, estimatedMinutes: 12 },
        { id: 'ch-44', unitId: 'unit-10', orderIndex: 44, title: 'Fossils and Rock Ages', pageStart: 509, pageEnd: 516, estimatedMinutes: 10 },
        { id: 'ch-45', unitId: 'unit-10', orderIndex: 45, title: 'History of Life on Earth', pageStart: 517, pageEnd: 522, estimatedMinutes: 8 },
      ],
    },
    {
      id: 'unit-11', bookId: 'book-science-ace', orderIndex: 11,
      title: 'Ecology: Habitats, Interdependence, and Resources',
      pageStart: 523, pageEnd: 544,
      chapters: [
        { id: 'ch-46', unitId: 'unit-11', orderIndex: 46, title: 'Ecology and Ecosystems', pageStart: 523, pageEnd: 528, estimatedMinutes: 8 },
        { id: 'ch-47', unitId: 'unit-11', orderIndex: 47, title: 'Interdependence and the Cycling of Energy and Matter', pageStart: 529, pageEnd: 534, estimatedMinutes: 8 },
        { id: 'ch-48', unitId: 'unit-11', orderIndex: 48, title: 'Ecological Succession and Biomes', pageStart: 535, pageEnd: 540, estimatedMinutes: 8 },
        { id: 'ch-49', unitId: 'unit-11', orderIndex: 49, title: 'Natural Resources and Conservation', pageStart: 541, pageEnd: 544, estimatedMinutes: 6 },
      ],
    },
  ],
};
