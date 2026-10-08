import React, { useState } from 'react';
import { QuestionItem, QuestionType, GenerationConfig } from '../types/quiz.js';
import { 
  FileText, 
  Trash2, 
  Edit3, 
  Plus, 
  Check, 
  Download, 
  Sparkles, 
  Filter, 
  Layers, 
  Save, 
  HelpCircle,
  Eye,
  AlertCircle
} from 'lucide-react';

interface QuestionBankEditorProps {
  questions: QuestionItem[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionItem[]>>;
  config: GenerationConfig;
  onDownloadPdf: () => void;
  onStartSimulation: () => void;
}

export const QuestionBankEditor: React.FC<QuestionBankEditorProps> = ({
  questions,
  setQuestions,
  config,
  onDownloadPdf,
  onStartSimulation,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCognitive, setFilterCognitive] = useState<string>('all');
  const [previewStimulusId, setPreviewStimulusId] = useState<string | null>(null);

  // Form edit state
  const [editForm, setEditForm] = useState<QuestionItem | null>(null);

  const startEdit = (q: QuestionItem) => {
    setEditingId(q.id);
    setEditForm(JSON.parse(JSON.stringify(q)));
  };

  const saveEdit = () => {
    if (!editForm) return;
    setQuestions((prev) =>
      prev.map((item) => (item.id === editForm.id ? editForm : item))
    );
    setEditingId(null);
    setEditForm(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const deleteQuestion = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus butir soal ini?')) {
      setQuestions((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const addNewQuestion = () => {
    const newQ: QuestionItem = {
      id: `manual-${Date.now().toString(36)}`,
      type: 'pilihan_ganda',
      difficulty: 'Sedang',
      thinkingCategory: 'HOTS',
      learningExperience: 'Mengaplikasi',
      cognitiveLevel: 'C4',
      stimulus: 'Stimulus kontekstual baru tentang perekonomian nasional.',
      questionText: 'Pertanyaan ekonomi baru yang menguji pemecahan masalah:',
      options: ['Pilihan Jawaban A', 'Pilihan Jawaban B', 'Pilihan Jawaban C', 'Pilihan Jawaban D', 'Pilihan Jawaban E'],
      correctOptionIndex: 0,
      rationale: 'Pembahasan konsep dan justifikasi ilmiah.',
      topic: config.topic,
      learningObjective: config.learningObjective,
    };
    setQuestions([newQ, ...questions]);
    startEdit(newQ);
  };

  const filteredQuestions = questions.filter((q) => {
    if (filterType !== 'all' && q.type !== filterType) return false;
    if (filterCognitive !== 'all' && q.cognitiveLevel !== filterCognitive) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Bar Editor */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Bank & Editor Soal Asesmen Ekonomi SMA</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Total {questions.length} butir soal terdaftar • Sepenuhnya dapat diedit langsung oleh guru/admin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={addNewQuestion}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Soal Manual</span>
          </button>

          <button
            onClick={onDownloadPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Simpan PDF</span>
          </button>

          <button
            onClick={onStartSimulation}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Simulasi CBT</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-700">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="font-bold">Filter Bentuk:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Semua Bentuk ({questions.length})</option>
            <option value="pilihan_ganda">Pilihan Ganda</option>
            <option value="pilihan_ganda_kompleks">Pilihan Ganda Kompleks</option>
            <option value="isian_singkat">Isian Singkat</option>
            <option value="uraian_esai">Uraian / Esai</option>
            <option value="menjodohkan">Menjodohkan</option>
            <option value="benar_salah">Benar–Salah</option>
            <option value="berbasis_konteks">Berbasis Konteks</option>
            <option value="studi_kasus">Studi Kasus</option>
            <option value="praktik_kinerja">Praktik / Kinerja</option>
            <option value="respons_tepat">Respons Paling Tepat</option>
            <option value="sjt">Situational Judgement Test (SJT)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold">Level Kognitif:</span>
          <select
            value={filterCognitive}
            onChange={(e) => setFilterCognitive(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Semua Level</option>
            <option value="C1">C1 - Mengingat</option>
            <option value="C2">C2 - Memahami</option>
            <option value="C3">C3 - Mengaplikasi</option>
            <option value="C4">C4 - Menganalisis</option>
            <option value="C5">C5 - Mengevaluasi</option>
            <option value="C6">C6 - Mencipta</option>
          </select>
        </div>

        <div className="ml-auto text-slate-500 text-[11px]">
          Menampilkan <span className="font-bold text-slate-900">{filteredQuestions.length}</span> dari{' '}
          {questions.length} butir
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-700">Tidak ada butir soal yang sesuai filter</h3>
            <p className="text-xs text-slate-500">
              Ubah kriteria filter atau klik "Generate Butir Soal AI" pada Dashboard untuk memproduksi soal baru.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isEditing = editingId === q.id;

            if (isEditing && editForm) {
              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl p-6 border-2 border-blue-500 shadow-lg space-y-4 animate-in fade-in"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-extrabold text-blue-700 uppercase">
                      Edit Butir Soal #{idx + 1} ({editForm.type})
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        onClick={saveEdit}
                        className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Simpan Perubahan</span>
                      </button>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Tingkat Kesulitan:</label>
                      <select
                        value={editForm.difficulty}
                        onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value as any })}
                        className="w-full border border-slate-300 rounded p-1.5"
                      >
                        <option value="Rendah">Rendah</option>
                        <option value="Sedang">Sedang</option>
                        <option value="Sulit">Sulit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Kategori Berpikir:</label>
                      <select
                        value={editForm.thinkingCategory}
                        onChange={(e) => setEditForm({ ...editForm, thinkingCategory: e.target.value as any })}
                        className="w-full border border-slate-300 rounded p-1.5"
                      >
                        <option value="LOTS">LOTS</option>
                        <option value="MOTS">MOTS</option>
                        <option value="HOTS">HOTS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Level Kognitif:</label>
                      <select
                        value={editForm.cognitiveLevel}
                        onChange={(e) => setEditForm({ ...editForm, cognitiveLevel: e.target.value as any })}
                        className="w-full border border-slate-300 rounded p-1.5"
                      >
                        <option value="C1">C1 - Mengingat</option>
                        <option value="C2">C2 - Memahami</option>
                        <option value="C3">C3 - Mengaplikasi</option>
                        <option value="C4">C4 - Menganalisis</option>
                        <option value="C5">C5 - Mengevaluasi</option>
                        <option value="C6">C6 - Mencipta</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Pengalaman Belajar:</label>
                      <select
                        value={editForm.learningExperience}
                        onChange={(e) => setEditForm({ ...editForm, learningExperience: e.target.value as any })}
                        className="w-full border border-slate-300 rounded p-1.5"
                      >
                        <option value="Memahami">Memahami</option>
                        <option value="Mengaplikasi">Mengaplikasi</option>
                        <option value="Merefleksi">Merefleksi</option>
                      </select>
                    </div>
                  </div>

                  {/* Stimulus Edit */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Stimulus / Teks Bacaan / Kasus:
                    </label>
                    <textarea
                      value={editForm.stimulus || ''}
                      onChange={(e) => setEditForm({ ...editForm, stimulus: e.target.value })}
                      rows={3}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  {/* Pertanyaan Edit */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pertanyaan Butir Soal:</label>
                    <textarea
                      value={editForm.questionText}
                      onChange={(e) => setEditForm({ ...editForm, questionText: e.target.value })}
                      rows={2}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-900 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Options edit if PG */}
                  {editForm.options && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">Pilihan Jawaban & Opsi:</label>
                      {editForm.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <span className="w-6 text-xs font-bold text-slate-500">
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...(editForm.options || [])];
                              newOpts[oIdx] = e.target.value;
                              setEditForm({ ...editForm, options: newOpts });
                            }}
                            className="flex-1 border border-slate-300 rounded px-2.5 py-1 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => setEditForm({ ...editForm, correctOptionIndex: oIdx })}
                            className={`px-2 py-1 rounded text-[11px] font-bold ${
                              editForm.correctOptionIndex === oIdx
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {editForm.correctOptionIndex === oIdx ? '✓ Kunci Benar' : 'Jadikan Kunci'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pembahasan & Rationale */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pembahasan & Analisis Konsep:
                    </label>
                    <textarea
                      value={editForm.rationale}
                      onChange={(e) => setEditForm({ ...editForm, rationale: e.target.value })}
                      rows={3}
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800"
                    />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
              >
                {/* Header item */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {q.type.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {q.difficulty}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        q.thinkingCategory === 'HOTS'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : q.thinkingCategory === 'MOTS'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {q.thinkingCategory}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                      {q.cognitiveLevel}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => startEdit(q)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit butir soal"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteQuestion(q.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus soal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stimulus Preview */}
                {q.stimulus && (
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-950 font-normal leading-relaxed">
                    <span className="font-bold block text-amber-800 mb-1 text-[11px] uppercase tracking-wider">
                      Stimulus Kontekstual:
                    </span>
                    <p className="whitespace-pre-line">{q.stimulus}</p>
                  </div>
                )}

                {/* Question Text */}
                <div className="text-sm font-semibold text-slate-900 leading-snug">
                  {q.questionText}
                </div>

                {/* Options display */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect =
                        q.correctOptionIndex === oIdx ||
                        (q.correctOptionsMulti && q.correctOptionsMulti.includes(oIdx));
                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-lg border text-xs ${
                            isCorrect
                              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                          {opt}
                          {isCorrect && (
                            <span className="ml-2 text-[10px] text-emerald-700 font-bold">✓ KUNCI</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Matching Pairs */}
                {q.matchingPairs && q.matchingPairs.length > 0 && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-700">Pasangan Menjodohkan:</span>
                    {q.matchingPairs.map((mp, mIdx) => (
                      <div key={mIdx} className="flex justify-between items-center py-1 border-b border-slate-200/60 last:border-0">
                        <span className="font-medium text-slate-800">{mp.premise}</span>
                        <span className="text-slate-400">⇄</span>
                        <span className="font-semibold text-blue-700">{mp.response}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Statements for Benar-Salah */}
                {q.statements && q.statements.length > 0 && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <span className="font-bold text-slate-700">Pernyataan Benar / Salah:</span>
                    {q.statements.map((st, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between py-1 border-b border-slate-200/60 last:border-0">
                        <span className="text-slate-800">{st.statement}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            st.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {st.isCorrect ? 'BENAR' : 'SALAH'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Short Answer Key */}
                {q.shortAnswerKey && (
                  <div className="text-xs bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-500 font-medium">Kunci Isian Singkat: </span>
                    <span className="font-bold text-blue-900 font-mono">"{q.shortAnswerKey}"</span>
                  </div>
                )}

                {/* Rationale & Rubric */}
                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800 block">Pembahasan & Analisis Konsep:</span>
                  <p>{q.rationale}</p>
                  {q.essayRubric && (
                    <p className="text-[11px] text-slate-500 italic mt-1">
                      Rubrik Penskoran: {q.essayRubric}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
