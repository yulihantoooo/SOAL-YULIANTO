export type QuestionType =
  | 'pilihan_ganda'
  | 'pilihan_ganda_kompleks'
  | 'isian_singkat'
  | 'uraian_esai'
  | 'menjodohkan'
  | 'benar_salah'
  | 'berbasis_konteks'
  | 'studi_kasus'
  | 'praktik_kinerja'
  | 'respons_tepat'
  | 'sjt';

export type DifficultyLevel = 'Rendah' | 'Sedang' | 'Sulit';
export type ThinkingCategory = 'LOTS' | 'MOTS' | 'HOTS';
export type LearningExperience = 'Memahami' | 'Mengaplikasi' | 'Merefleksi';
export type CognitiveLevel = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';

export interface MatchingPair {
  premise: string;
  response: string;
}

export interface StatementCheck {
  statement: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuestionItem {
  id: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  thinkingCategory: ThinkingCategory;
  learningExperience: LearningExperience;
  cognitiveLevel: CognitiveLevel;
  stimulus?: string; // Teks bacaan, data tabel, studi kasus
  questionText: string;
  options?: string[]; // Untuk PG, respons tepat, SJT
  correctOptionIndex?: number;
  correctOptionsMulti?: number[]; // Untuk PG Kompleks (pilihan lebih dari satu)
  shortAnswerKey?: string; // Untuk isian singkat
  matchingPairs?: MatchingPair[]; // Untuk menjodohkan
  statements?: StatementCheck[]; // Untuk benar-salah & PG Kompleks model pernyataan
  essayRubric?: string; // Untuk uraian / studi kasus / praktik kinerja
  rationale: string; // Pembahasan & analisis konsep
  topic: string;
  learningObjective: string;
}

export interface GenerationConfig {
  schoolName: string;
  schoolLogo: string;
  educationLevel: 'SMA';
  grade: 'Kelas 10' | 'Kelas 11' | 'Kelas 12';
  subject: string; // "Ekonomi SMA"
  topic: string;
  learningObjective: string;
  selectedQuestionTypes: QuestionType[];
  questionCounts: Record<QuestionType, number>;
  selectedDifficulties: DifficultyLevel[];
  selectedThinkingCategories: ThinkingCategory[];
  selectedLearningExperiences: LearningExperience[];
  selectedCognitiveLevels: CognitiveLevel[];
  customAiInstructions: string;
}
