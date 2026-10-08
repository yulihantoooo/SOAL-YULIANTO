import React, { useState } from 'react';
import { 
  GenerationConfig, 
  QuestionType, 
  DifficultyLevel, 
  ThinkingCategory, 
  LearningExperience, 
  CognitiveLevel, 
  QuestionItem 
} from '../types/quiz.js';
import { 
  TOPIC_PRESETS, 
  LOGO_PRESETS 
} from '../data/defaults.js';
import { 
  Sparkles, 
  Download, 
  CheckSquare, 
  Square, 
  Settings, 
  BookOpen, 
  CheckCircle2, 
  Lightbulb, 
  Sliders, 
  Layers, 
  BrainCircuit, 
  FileCheck, 
  Play,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  UserCheck,
  User
} from 'lucide-react';

interface AdminDashboardProps {
  config: GenerationConfig;
  setConfig: React.Dispatch<React.SetStateAction<GenerationConfig>>;
  onGenerate: () => Promise<void>;
  isGenerating: boolean;
  onDownloadPdf: () => void;
  questions: QuestionItem[];
  onStartSimulation: () => void;
  logoModalOpen: boolean;
  setLogoModalOpen: (open: boolean) => void;
}

const QUESTION_TYPES_CONFIG: { id: QuestionType; label: string; desc: string }[] = [
  { id: 'pilihan_ganda', label: 'Pilihan Ganda', desc: '1 jawaban benar dengan 5 opsi distractor (A, B, C, D, E).' },
  { id: 'pilihan_ganda_kompleks', label: 'Pilihan Ganda Kompleks', desc: 'Memungkinkan siswa memilih lebih dari satu opsi jawaban yang benar.' },
  { id: 'isian_singkat', label: 'Isian Singkat', desc: 'Pertanyaan tertutup dengan jawaban angka / formula / istilah ekonomi presisi.' },
  { id: 'uraian_esai', label: 'Uraian / Esai', desc: 'Analisis mendalam dengan rubrik penskoran analitik kualitatif.' },
  { id: 'menjodohkan', label: 'Menjodohkan', desc: 'Mencocokkan premis masalah/konsep ekonomi dengan karakteristik di kolom kanan.' },
  { id: 'benar_salah', label: 'Benar–Salah', desc: 'Evaluasi serangkaian pernyataan ekonomi bernilai Benar atau Salah.' },
  { id: 'berbasis_konteks', label: 'Berbasis Konteks / Stimulus', desc: 'Soal berpijak pada tabel data statistik BPS, kurva, atau infografis terkini.' },
  { id: 'studi_kasus', label: 'Studi Kasus', desc: 'Simulasi problem nyata dunia usaha, UMKM, inflasi daerah, atau neraca dagang.' },
  { id: 'praktik_kinerja', label: 'Praktik / Kinerja', desc: 'Penyusunan siklus akuntansi, kertas kerja laba rugi, atau simulasi anggaran.' },
  { id: 'respons_tepat', label: 'Menentukan Respons Paling Tepat / Paling Tidak Tepat', desc: 'Menguji ketajaman prioritas strategi manajerial dan pemecahan krisis ekonomi.' },
  { id: 'sjt', label: 'Situational Judgemental Test (SJT)', desc: 'Dilema etika keputusan bisnis, perbankan, dan integritas pengelola keuangan.' },
];

const COUNT_OPTIONS = [5, 10, 15, 20, 25, 50, 75, 100];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  config,
  setConfig,
  onGenerate,
  isGenerating,
  onDownloadPdf,
  questions,
  onStartSimulation,
  logoModalOpen,
  setLogoModalOpen,
}) => {
  const [activePresetCategory, setActivePresetCategory] = useState<string>('All');

  // Toggle question type
  const toggleQuestionType = (typeId: QuestionType) => {
    setConfig((prev) => {
      const exists = prev.selectedQuestionTypes.includes(typeId);
      let updatedTypes: QuestionType[];
      if (exists) {
        if (prev.selectedQuestionTypes.length === 1) {
          return prev; // keep at least one
        }
        updatedTypes = prev.selectedQuestionTypes.filter((t) => t !== typeId);
      } else {
        updatedTypes = [...prev.selectedQuestionTypes, typeId];
      }
      return {
        ...prev,
        selectedQuestionTypes: updatedTypes,
      };
    });
  };

  // Change question count for specific type
  const handleCountChange = (typeId: QuestionType, count: number) => {
    setConfig((prev) => ({
      ...prev,
      questionCounts: {
        ...prev.questionCounts,
        [typeId]: count,
      },
    }));
  };

  // Multi-select for Difficulty
  const toggleDifficulty = (diff: DifficultyLevel) => {
    setConfig((prev) => {
      const exists = prev.selectedDifficulties.includes(diff);
      if (exists && prev.selectedDifficulties.length === 1) return prev;
      return {
        ...prev,
        selectedDifficulties: exists
          ? prev.selectedDifficulties.filter((d) => d !== diff)
          : [...prev.selectedDifficulties, diff],
      };
    });
  };

  // Multi-select for Thinking Category (LOTS, MOTS, HOTS)
  const toggleThinking = (think: ThinkingCategory) => {
    setConfig((prev) => {
      const exists = prev.selectedThinkingCategories.includes(think);
      if (exists && prev.selectedThinkingCategories.length === 1) return prev;
      return {
        ...prev,
        selectedThinkingCategories: exists
          ? prev.selectedThinkingCategories.filter((t) => t !== think)
          : [...prev.selectedThinkingCategories, think],
      };
    });
  };

  // Multi-select for Learning Experience (Memahami, Mengaplikasi, Merefleksi)
  const toggleLearningExperience = (exp: LearningExperience) => {
    setConfig((prev) => {
      const exists = prev.selectedLearningExperiences.includes(exp);
      if (exists && prev.selectedLearningExperiences.length === 1) return prev;
      return {
        ...prev,
        selectedLearningExperiences: exists
          ? prev.selectedLearningExperiences.filter((e) => e !== exp)
          : [...prev.selectedLearningExperiences, exp],
      };
    });
  };

  // Multi-select for Cognitive Level (C1 to C6)
  const toggleCognitiveLevel = (cog: CognitiveLevel) => {
    setConfig((prev) => {
      const exists = prev.selectedCognitiveLevels.includes(cog);
      if (exists && prev.selectedCognitiveLevels.length === 1) return prev;
      return {
        ...prev,
        selectedCognitiveLevels: exists
          ? prev.selectedCognitiveLevels.filter((c) => c !== cog)
          : [...prev.selectedCognitiveLevels, cog],
      };
    });
  };

  // Handle Logo Upload from Local Computer
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setConfig((prev) => ({ ...prev, schoolLogo: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate total configured questions
  const totalConfiguredQuestions = config.selectedQuestionTypes.reduce(
    (sum, t) => sum + (config.questionCounts[t] || 5),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Hero Banner / Status Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white border border-blue-900/50 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Generator Asesmen Berstandar Pusmendik Kemdikbud TKA</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-md border border-amber-300 tracking-wide">
                <UserCheck className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                <span>PENYUSUN ASESMEN: {config.authorName || 'YULIANTO HARSONO'}</span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Pusat Konfigurasi & Bank Soal Ekonomi SMA
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Disusun oleh <strong className="text-amber-300 font-bold">{config.authorName || 'YULIANTO HARSONO'}</strong> — Buat paket soal terstandar asesmen nasional untuk Mata Pelajaran Ekonomi SMA dengan spektrum kognitif lengkap (C1–C6), kategori LOTS/MOTS/HOTS, 11 variasi bentuk soal, dan orientasi evaluasi serta pemecahan masalah kompleks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses Gemini 3.8 AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Butir Soal AI</span>
                </>
              )}
            </button>

            <button
              onClick={onDownloadPdf}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              title="Download file PDF resmi Kisi-kisi, Butir Soal, Kunci Jawaban & Pembahasan otomatis"
            >
              <Download className="w-4 h-4" />
              <span>Simpan PDF (Otomatis)</span>
            </button>

            <button
              onClick={onStartSimulation}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Coba CBT Siswa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Settings & Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Core Subject & Curriculum Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Identitas Institusi, Jenjang, Mata Pelajaran & Kelas */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Identitas Asesmen & Kelas</h3>
                  <p className="text-xs text-slate-500">Parameter utama jenjang dan mata pelajaran Ekonomi</p>
                </div>
              </div>

              <button
                onClick={() => setLogoModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Ubah Nama & Logo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Penyusun / Guru Pengampu */}
              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-300/80 shadow-sm">
                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Penyusun / Guru</span>
                </label>
                <input
                  type="text"
                  value={config.authorName || 'YULIANTO HARSONO'}
                  onChange={(e) => setConfig((p) => ({ ...p, authorName: e.target.value }))}
                  className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Nama Penyusun"
                />
              </div>

              {/* Jenjang */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Jenjang Pendidikan
                </label>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className="text-base font-extrabold text-slate-900">SMA</span>
                  <span className="text-[11px] text-slate-400 font-medium">(Fase E & F)</span>
                </div>
              </div>

              {/* Jenis Soal / Mata Pelajaran */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Jenis Soal
                </label>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span className="text-sm font-extrabold text-slate-900">Mata Pelajaran Ekonomi</span>
                </div>
              </div>

              {/* Pilihan Kelas */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Pilihan Kelas
                </label>
                <select
                  value={config.grade}
                  onChange={(e) => setConfig((p) => ({ ...p, grade: e.target.value as any }))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Kelas 10">Kelas 10 (Fase E)</option>
                  <option value="Kelas 11">Kelas 11 (Fase F - Awal)</option>
                  <option value="Kelas 12">Kelas 12 (Fase F - Lanjutan)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Topik / Materi & Tujuan Pembelajaran (Text Boxes) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Topik Materi & Tujuan Pembelajaran</h3>
                  <p className="text-xs text-slate-500">Isi di text box atau klik preset kurikulum ekonomi SMA siap pakai</p>
                </div>
              </div>
            </div>

            {/* Topic Input Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Topik atau Materi yang Diinginkan:
                </label>
                <span className="text-[11px] text-blue-600 font-medium">Text Box Aktif</span>
              </div>
              <textarea
                value={config.topic}
                onChange={(e) => setConfig((p) => ({ ...p, topic: e.target.value }))}
                rows={2}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: Mekanisme Pasar dan Elastisitas, Kebijakan Fiskal & Moneter, Pendapatan Nasional, dll."
              />
            </div>

            {/* Learning Objective Input Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tujuan Pembelajaran:
                </label>
                <span className="text-[11px] text-indigo-600 font-medium">Text Box Aktif</span>
              </div>
              <textarea
                value={config.learningObjective}
                onChange={(e) => setConfig((p) => ({ ...p, learningObjective: e.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Contoh: Peserta didik mampu mengevaluasi data inflasi BPS dan merumuskan solusi bauran kebijakan moneter Bank Indonesia..."
              />
            </div>

            {/* Quick Topic Presets */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  <span>Preset Materi Kurikulum Ekonomi SMA Terstandar:</span>
                </span>
                <span className="text-[11px] text-slate-400">Klik untuk isi otomatis</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {TOPIC_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setConfig((p) => ({
                        ...p,
                        topic: preset.title,
                        learningObjective: preset.objective,
                        grade: preset.grade as any,
                      }));
                    }}
                    className="text-left px-2.5 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors cursor-pointer shadow-sm"
                  >
                    <span className="font-bold text-blue-600 mr-1">[{preset.grade}]</span>
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Bentuk Soal Multi-Select + Otomatis Dropdown Jumlah Soal (5..100) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Bentuk Soal & Jumlah Soal Otomatis</h3>
                  <p className="text-xs text-slate-500">
                    Pilih lebih dari satu bentuk soal. Setiap bentuk yang dipilih otomatis memunculkan dropdown jumlah soal (5–100 butir).
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold">
                {config.selectedQuestionTypes.length} Bentuk Dipilih
              </span>
            </div>

            <div className="space-y-3">
              {QUESTION_TYPES_CONFIG.map((item) => {
                const isSelected = config.selectedQuestionTypes.includes(item.id);
                const currentCount = config.questionCounts[item.id] || 5;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-300 shadow-sm'
                        : 'bg-slate-50/50 border-slate-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div
                        onClick={() => toggleQuestionType(item.id)}
                        className="flex items-start gap-3 cursor-pointer flex-1"
                      >
                        <div className="mt-0.5 text-blue-600">
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 fill-blue-600 text-white" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <span className={`text-sm font-bold ${isSelected ? 'text-blue-950' : 'text-slate-800'}`}>
                            {item.label}
                          </span>
                          <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>

                      {/* Dropdown Jumlah Soal (Muncul Otomatis Saat Bentuk Soal Dipilih) */}
                      {isSelected && (
                        <div className="flex items-center gap-2 pl-8 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-blue-200">
                          <label className="text-xs font-bold text-blue-900 whitespace-nowrap">
                            Jumlah Soal:
                          </label>
                          <select
                            value={currentCount}
                            onChange={(e) => handleCountChange(item.id, parseInt(e.target.value, 10))}
                            className="bg-white border-2 border-blue-400 rounded-lg px-2.5 py-1 text-xs font-bold text-blue-950 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                          >
                            {COUNT_OPTIONS.map((num) => (
                              <option key={num} value={num}>
                                {num} Soal
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-900 text-white p-3.5 rounded-xl flex items-center justify-between text-xs font-medium">
              <span>Total Alokasi Soal yang Dikonfigurasi:</span>
              <span className="font-extrabold text-amber-400 text-sm">{totalConfiguredQuestions} Butir Soal</span>
            </div>
          </div>
        </div>

        {/* Right Column: Cognitive & Thinking Framework (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 4: Tingkat Kesulitan & LOTS, MOTS, HOTS */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Tingkat Berpikir & Kesulitan</h3>
                <p className="text-xs text-slate-500">Dapat dipilih ketiganya oleh user</p>
              </div>
            </div>

            {/* LOTS, MOTS, HOTS Multi-select */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Kategori Berpikir (LOTS, MOTS, HOTS):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['LOTS', 'MOTS', 'HOTS'] as ThinkingCategory[]).map((think) => {
                  const active = config.selectedThinkingCategories.includes(think);
                  return (
                    <button
                      key={think}
                      type="button"
                      onClick={() => toggleThinking(think)}
                      className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                        active
                          ? think === 'HOTS'
                            ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-400 shadow-sm'
                            : think === 'MOTS'
                            ? 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-400 shadow-sm'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-400 shadow-sm'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-sm">{think}</span>
                      <span className="text-[9px] font-normal opacity-80">
                        {think === 'HOTS' ? 'Higher Order' : think === 'MOTS' ? 'Middle Order' : 'Lower Order'}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-500 italic">
                *User dapat memilih LOTS, MOTS, dan HOTS sekaligus untuk komposisi berimbang.
              </p>
            </div>

            {/* Tingkat Kesulitan: Rendah, Sedang, Sulit */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tingkat Kesulitan Soal:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Rendah', 'Sedang', 'Sulit'] as DifficultyLevel[]).map((diff) => {
                  const active = config.selectedDifficulties.includes(diff);
                  return (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => toggleDifficulty(diff)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {diff}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 5: Pengalaman Belajar (Memahami, Mengaplikasi, Merefleksi) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2.5">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Pengalaman Belajar Target</h3>
                <p className="text-xs text-slate-500">Dapat dipilih ketiga pengalaman belajar oleh user</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'Memahami' as LearningExperience,
                  title: 'Memahami',
                  desc: 'Menguji pemahaman dasar konsep, definisi, dan mekanisme ekonomi.',
                },
                {
                  id: 'Mengaplikasi' as LearningExperience,
                  title: 'Mengaplikasi',
                  desc: 'Aplikasi konsep ekonomi dalam konteks riil kehidupan, pasar, dan dunia usaha.',
                },
                {
                  id: 'Merefleksi' as LearningExperience,
                  title: 'Merefleksi',
                  desc: 'Refleksi kritis, evaluasi kebijakan publik, dan sintesis pemecahan masalah makro.',
                },
              ].map((item) => {
                const isSelected = config.selectedLearningExperiences.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleLearningExperience(item.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-purple-50 border-purple-300 shadow-sm'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 opacity-75'
                    }`}
                  >
                    <div className="mt-0.5 text-purple-600">
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 fill-purple-600 text-white" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-bold ${isSelected ? 'text-purple-950' : 'text-slate-800'}`}>
                        {item.title}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 6: Level Kognitif C1 sampai C6 (User Dapat Memilih) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-cyan-50 text-cyan-700 rounded-lg">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Level Kognitif (C1 – C6)</h3>
                  <p className="text-xs text-slate-500">Taksonomi Bloom asesmen Pusmendik</p>
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded">
                {config.selectedCognitiveLevels.length} Level Aktif
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'C1' as CognitiveLevel, name: 'C1 - Mengingat', note: 'Recall data & istilah' },
                { id: 'C2' as CognitiveLevel, name: 'C2 - Memahami', note: 'Jelaskan konsep' },
                { id: 'C3' as CognitiveLevel, name: 'C3 - Mengaplikasi', note: 'Hitung & terapkan' },
                { id: 'C4' as CognitiveLevel, name: 'C4 - Menganalisis', note: 'Bedah data & kurva' },
                { id: 'C5' as CognitiveLevel, name: 'C5 - Mengevaluasi', note: 'Kritik & justifikasi' },
                { id: 'C6' as CognitiveLevel, name: 'C6 - Mencipta', note: 'Rancang solusi & strategi' },
              ].map((cog) => {
                const active = config.selectedCognitiveLevels.includes(cog.id);
                const isHighBloom = cog.id === 'C5' || cog.id === 'C6';
                return (
                  <button
                    key={cog.id}
                    type="button"
                    onClick={() => toggleCognitiveLevel(cog.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? isHighBloom
                          ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-400'
                          : 'bg-cyan-50 border-cyan-300 ring-1 ring-cyan-400'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${active ? 'text-slate-900' : 'text-slate-600'}`}>
                        {cog.name}
                      </span>
                      {isHighBloom && (
                        <span className="text-[9px] font-extrabold px-1 rounded bg-rose-200 text-rose-800">
                          Prioritas
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{cog.note}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 7: Instruksi Khusus untuk AI (Evaluasi, Penciptaan, Masalah Kompleks) */}
          <div className="bg-gradient-to-br from-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-indigo-800/50 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-amber-300">
                Instruksi Khusus untuk AI (Evaluasi & Masalah Kompleks)
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Menugaskan model AI (Gemini 3.8 Flash) untuk berfokus pada evaluasi, penciptaan, dan pemecahan masalah kompleks, memastikan kualitas soal benar-benar sesuai dengan tingkat berpikir yang diharapkan.
            </p>
            <textarea
              value={config.customAiInstructions}
              onChange={(e) => setConfig((p) => ({ ...p, customAiInstructions: e.target.value }))}
              rows={3}
              className="w-full rounded-xl bg-slate-800/90 border border-indigo-700/60 p-3 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Modal Ubah Nama & Logo */}
      {logoModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Ubah Nama Sekolah & Logo</h3>
              </div>
              <button
                onClick={() => setLogoModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Nama Penyusun / Guru */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Nama Penyusun / Guru Pengampu:</span>
              </label>
              <input
                type="text"
                value={config.authorName || 'YULIANTO HARSONO'}
                onChange={(e) => setConfig((p) => ({ ...p, authorName: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="YULIANTO HARSONO"
              />
            </div>

            {/* Nama Sekolah */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Nama Sekolah / Lembaga:</label>
              <input
                type="text"
                value={config.schoolName}
                onChange={(e) => setConfig((p) => ({ ...p, schoolName: e.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* URL Logo atau Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase">Logo Sekolah / Instansi:</label>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl border-2 border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                  {config.schoolLogo ? (
                    <img src={config.schoolLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    value={config.schoolLogo}
                    onChange={(e) => setConfig((p) => ({ ...p, schoolLogo: e.target.value }))}
                    placeholder="Masukkan URL logo..."
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File Gambar</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Preset Logo Cepat */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-500 uppercase">Pilih Preset Logo Resmi:</label>
              <div className="grid grid-cols-3 gap-2">
                {LOGO_PRESETS.map((lp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setConfig((p) => ({ ...p, schoolLogo: lp.url }))}
                    className="p-2 rounded-xl border border-slate-200 hover:border-blue-500 text-center text-[11px] font-medium text-slate-700 transition-colors cursor-pointer bg-slate-50 hover:bg-blue-50"
                  >
                    <div className="w-8 h-8 mx-auto rounded overflow-hidden mb-1 border border-slate-200">
                      <img src={lp.url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="line-clamp-1">{lp.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setLogoModalOpen(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow cursor-pointer"
              >
                Simpan & Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
