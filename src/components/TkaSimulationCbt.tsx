import React, { useState, useEffect } from 'react';
import { QuestionItem, GenerationConfig } from '../types/quiz.js';
import { 
  Clock, 
  HelpCircle, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  AlertTriangle, 
  RotateCcw, 
  Award, 
  Layers, 
  Check, 
  FileText 
} from 'lucide-react';

interface TkaSimulationCbtProps {
  questions: QuestionItem[];
  config: GenerationConfig;
  onExitSimulation: () => void;
}

export const TkaSimulationCbt: React.FC<TkaSimulationCbtProps> = ({
  questions,
  config,
  onExitSimulation,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [fontSizeLevel, setFontSizeLevel] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 60 minutes
  const [showQuestionGridModal, setShowQuestionGridModal] = useState<boolean>(false);
  const [showFinishModal, setShowFinishModal] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Student Answers State
  // { [questionId]: answerValue }
  const [answers, setAnswers] = useState<Record<string, any>>({});
  // Doubtful / Ragu-ragu flags: { [questionId]: boolean }
  const [doubtful, setDoubtful] = useState<Record<string, boolean>>({});

  // Countdown timer
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  const currentQ = questions[currentIndex] || questions[0];

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIdx: number) => {
    if (isFinished) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIdx,
    }));
  };

  const handleToggleMultiOption = (optIdx: number) => {
    if (isFinished) return;
    const currentList: number[] = Array.isArray(answers[currentQ.id]) ? answers[currentQ.id] : [];
    const exists = currentList.includes(optIdx);
    const nextList = exists ? currentList.filter((x) => x !== optIdx) : [...currentList, optIdx];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: nextList,
    }));
  };

  const handleShortAnswerChange = (val: string) => {
    if (isFinished) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: val,
    }));
  };

  const handleStatementChange = (sIdx: number, val: boolean) => {
    if (isFinished) return;
    const currentStatements = answers[currentQ.id] || {};
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...currentStatements,
        [sIdx]: val,
      },
    }));
  };

  const handleMatchingChange = (pIdx: number, respText: string) => {
    if (isFinished) return;
    const currentMap = answers[currentQ.id] || {};
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...currentMap,
        [pIdx]: respText,
      },
    }));
  };

  const toggleDoubtful = () => {
    if (isFinished) return;
    setDoubtful((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const isAnswered = (qId: string) => {
    const ans = answers[qId];
    if (ans === undefined || ans === null) return false;
    if (Array.isArray(ans)) return ans.length > 0;
    if (typeof ans === 'string') return ans.trim().length > 0;
    if (typeof ans === 'object') return Object.keys(ans).length > 0;
    return true;
  };

  // Score Calculation
  const calculateResult = () => {
    let score = 0;
    let maxScore = questions.length;
    let correctCount = 0;

    questions.forEach((q) => {
      const userAns = answers[q.id];
      if (q.type === 'pilihan_ganda' || q.type === 'berbasis_konteks' || q.type === 'respons_tepat' || q.type === 'sjt') {
        if (userAns === q.correctOptionIndex) {
          score += 1;
          correctCount += 1;
        }
      } else if (q.type === 'pilihan_ganda_kompleks') {
        const correctSet = q.correctOptionsMulti || [];
        const userSet = Array.isArray(userAns) ? userAns : [];
        if (
          correctSet.length === userSet.length &&
          correctSet.every((val) => userSet.includes(val))
        ) {
          score += 1;
          correctCount += 1;
        }
      } else if (q.type === 'isian_singkat') {
        if (
          typeof userAns === 'string' &&
          q.shortAnswerKey &&
          userAns.trim().toLowerCase() === q.shortAnswerKey.trim().toLowerCase()
        ) {
          score += 1;
          correctCount += 1;
        }
      } else if (q.type === 'benar_salah') {
        const statements = q.statements || [];
        let allTrue = true;
        statements.forEach((st, idx) => {
          if (userAns?.[idx] !== st.isCorrect) allTrue = false;
        });
        if (allTrue && statements.length > 0) {
          score += 1;
          correctCount += 1;
        }
      } else {
        // Essay / performance / matching partial credit
        if (isAnswered(q.id)) {
          score += 0.8;
          correctCount += 1;
        }
      }
    });

    const percent = Math.round((score / maxScore) * 100);
    return { score, maxScore, correctCount, percent };
  };

  const fontClasses = {
    normal: 'text-sm',
    large: 'text-base',
    xlarge: 'text-lg',
  }[fontSizeLevel];

  if (isFinished) {
    const result = calculateResult();
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Hasil Simulasi TKA Pusmendik Kemdikbud
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              Tes Simulasi Ekonomi SMA Selesai
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {config.schoolName} • {config.grade} • Topik: {config.topic}
            </p>
          </div>

          {/* Score Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 block">Nilai Capaian</span>
              <span className="text-3xl font-black text-blue-900">{result.percent}</span>
              <span className="text-[11px] text-slate-400 block">Skala 100</span>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-xs font-semibold text-emerald-700 block">Ketuntasan Butir</span>
              <span className="text-3xl font-black text-emerald-800">{result.correctCount}</span>
              <span className="text-[11px] text-emerald-600 block">dari {result.maxScore} Soal</span>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-xs font-semibold text-amber-700 block">Kategori Kelulusan</span>
              <span className="text-lg font-black text-amber-900 mt-1 block">
                {result.percent >= 75 ? 'Sangat Mahir' : result.percent >= 60 ? 'Cakap' : 'Perlu Bimbingan'}
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setIsFinished(false);
                setCurrentIndex(0);
                setTimeLeft(3600);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Simulasi</span>
            </button>
            <button
              onClick={onExitSimulation}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-all cursor-pointer"
            >
              Kembali ke Dashboard Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Pusmendik Top CBT Header */}
      <div className="bg-[#0b2847] text-white border-b-4 border-amber-400 px-4 py-2.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-white/10 p-1 flex items-center justify-center border border-white/20">
              <img
                src={config.schoolLogo}
                alt="Logo"
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-amber-300 uppercase block">
                SIMULASI TKA - PUSMENDIK KEMDIKBUD
              </span>
              <span className="text-xs font-semibold text-slate-100">
                {config.subject} ({config.grade})
              </span>
            </div>
          </div>

          {/* Middle: Font size adjuster (A- / A / A+) khas Pusmendik */}
          <div className="flex items-center space-x-1 bg-white/10 px-2 py-1 rounded-lg border border-white/10 text-xs">
            <span className="text-[11px] text-slate-300 mr-1.5 font-medium">Ukuran Fon:</span>
            <button
              onClick={() => setFontSizeLevel('normal')}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                fontSizeLevel === 'normal' ? 'bg-amber-400 text-slate-950' : 'text-white hover:bg-white/20'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSizeLevel('large')}
              className={`px-2 py-0.5 rounded text-sm font-bold transition-colors ${
                fontSizeLevel === 'large' ? 'bg-amber-400 text-slate-950' : 'text-white hover:bg-white/20'
              }`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSizeLevel('xlarge')}
              className={`px-2 py-0.5 rounded text-base font-bold transition-colors ${
                fontSizeLevel === 'xlarge' ? 'bg-amber-400 text-slate-950' : 'text-white hover:bg-white/20'
              }`}
            >
              A++
            </button>
          </div>

          {/* Right: Timer & Daftar Soal button */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700 text-amber-300 font-mono font-bold text-sm">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            <button
              onClick={() => setShowQuestionGridModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-extrabold shadow transition-colors cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Daftar Soal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Examination Body: 2 Columns */}
      <div className="max-w-7xl mx-auto w-full px-4 py-4 flex-1 flex flex-col">
        {/* Info bar soal aktif */}
        <div className="bg-white rounded-t-xl px-4 py-2.5 border-t border-x border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="bg-blue-900 text-white px-2 py-0.5 rounded text-xs font-extrabold">
              SOAL NOMOR {currentIndex + 1}
            </span>
            <span className="text-slate-500 font-normal">
              dari {questions.length} Soal
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
              {currentQ.type.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Level: <b className="text-blue-900">{currentQ.cognitiveLevel}</b></span>
            <span>•</span>
            <span>Kategori: <b className="text-rose-700">{currentQ.thinkingCategory}</b></span>
          </div>
        </div>

        {/* 2-Columns Layout: Left Stimulus, Right Question & Options */}
        <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 min-h-[460px]">
          {/* Kolom Kiri: STIMULUS */}
          <div className="p-5 overflow-y-auto max-h-[600px] space-y-4 bg-slate-50/50">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Stimulus Bacaan / Konteks Ekonomi</span>
              </span>
              <span className="text-[10px] text-slate-400">Pusmendik TKA</span>
            </div>

            {currentQ.stimulus ? (
              <div className={`text-slate-800 leading-relaxed font-normal whitespace-pre-line ${fontClasses}`}>
                {currentQ.stimulus}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic py-8 text-center">
                (Soal ini langsung menguji pemahaman konsep tanpa stimulus bacaan terpisah)
              </div>
            )}
          </div>

          {/* Kolom Kanan: BUTIR PERTANYAAN & JAWABAN SISWA */}
          <div className="p-5 overflow-y-auto max-h-[600px] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className={`font-bold text-slate-900 leading-snug ${fontClasses}`}>
                {currentQ.questionText}
              </div>

              {/* Tipe: Pilihan Ganda & Berbasis Konteks & SJT */}
              {(currentQ.type === 'pilihan_ganda' ||
                currentQ.type === 'berbasis_konteks' ||
                currentQ.type === 'respons_tepat' ||
                currentQ.type === 'sjt') && (
                <div className="space-y-2.5">
                  {(currentQ.options || []).map((opt, oIdx) => {
                    const isSelected = answers[currentQ.id] === oIdx;
                    const letter = String.fromCharCode(65 + oIdx);
                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 shadow-sm text-blue-950 font-semibold'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600 border border-slate-300'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className={`pt-0.5 leading-snug ${fontClasses}`}>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tipe: Pilihan Ganda Kompleks */}
              {currentQ.type === 'pilihan_ganda_kompleks' && (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded block">
                    *Pilihan ganda kompleks: Anda dapat memilih lebih dari satu jawaban yang benar.
                  </span>
                  {(currentQ.options || []).map((opt, oIdx) => {
                    const selectedList: number[] = Array.isArray(answers[currentQ.id]) ? answers[currentQ.id] : [];
                    const isChecked = selectedList.includes(oIdx);
                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleToggleMultiOption(oIdx)}
                        className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-blue-50 border-blue-600 text-blue-950 font-semibold'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                            isChecked
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className={`leading-snug ${fontClasses}`}>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tipe: Isian Singkat */}
              {currentQ.type === 'isian_singkat' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 block">Ketik Jawaban Anda:</label>
                  <input
                    type="text"
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleShortAnswerChange(e.target.value)}
                    placeholder="Tuliskan jawaban singkat Anda di sini..."
                    className="w-full border-2 border-slate-300 rounded-xl p-3 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
              )}

              {/* Tipe: Benar Salah */}
              {currentQ.type === 'benar_salah' && (
                <div className="space-y-3">
                  <span className="text-xs text-slate-500 block">Tentukan Benar atau Salah untuk tiap butir:</span>
                  {(currentQ.statements || []).map((st, sIdx) => {
                    const currentVal = answers[currentQ.id]?.[sIdx];
                    return (
                      <div key={sIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <p className={`font-medium text-slate-800 ${fontClasses}`}>{st.statement}</p>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                            <input
                              type="radio"
                              name={`bs-${currentQ.id}-${sIdx}`}
                              checked={currentVal === true}
                              onChange={() => handleStatementChange(sIdx, true)}
                              className="w-4 h-4 text-emerald-600"
                            />
                            <span>BENAR</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                            <input
                              type="radio"
                              name={`bs-${currentQ.id}-${sIdx}`}
                              checked={currentVal === false}
                              onChange={() => handleStatementChange(sIdx, false)}
                              className="w-4 h-4 text-rose-600"
                            />
                            <span>SALAH</span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tipe: Menjodohkan */}
              {currentQ.type === 'menjodohkan' && (
                <div className="space-y-3">
                  <span className="text-xs text-slate-500 block">Jodohkan kolom kiri dengan opsi pilihan:</span>
                  {(currentQ.matchingPairs || []).map((mp, pIdx) => {
                    const chosen = answers[currentQ.id]?.[pIdx] || '';
                    return (
                      <div key={pIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className={`font-medium text-slate-800 flex-1 ${fontClasses}`}>
                          {pIdx + 1}. {mp.premise}
                        </span>
                        <select
                          value={chosen}
                          onChange={(e) => handleMatchingChange(pIdx, e.target.value)}
                          className="bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-medium text-blue-900 max-w-xs focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">-- Pilih Pasangan --</option>
                          {(currentQ.matchingPairs || []).map((resp, rIdx) => (
                            <option key={rIdx} value={resp.response}>
                              {resp.response}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tipe: Uraian / Studi Kasus / Praktik Kinerja */}
              {(currentQ.type === 'uraian_esai' ||
                currentQ.type === 'studi_kasus' ||
                currentQ.type === 'praktik_kinerja') && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 block">
                    Ketik Lembar Jawaban Uraian / Analisis Kritis Anda:
                  </label>
                  <textarea
                    rows={6}
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleShortAnswerChange(e.target.value)}
                    placeholder="Tuliskan argumen, tahapan perhitungan, atau formulasi kebijakan ekonomi Anda secara lengkap..."
                    className="w-full border-2 border-slate-300 rounded-xl p-3 text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pusmendik Bottom Navigation Bar */}
        <div className="bg-white border-x border-b border-slate-200 rounded-b-xl px-4 py-3 mt-0 flex flex-wrap items-center justify-between gap-3 shadow-md">
          {/* Tombol Sebelumnya */}
          <button
            onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white font-bold text-xs shadow transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Soal Sebelumnya</span>
          </button>

          {/* Checkbox / Tombol RAGU-RAGU Khas Pusmendik TKA (Kuning) */}
          <button
            onClick={toggleDoubtful}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs shadow transition-all cursor-pointer border-2 ${
              doubtful[currentQ.id]
                ? 'bg-amber-400 border-amber-500 text-slate-950 ring-2 ring-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
            }`}
          >
            <input
              type="checkbox"
              checked={!!doubtful[currentQ.id]}
              onChange={() => {}}
              className="w-4 h-4 accent-amber-500 pointer-events-none"
            />
            <span>RAGU-RAGU</span>
          </button>

          {/* Tombol Berikutnya / Selesai */}
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((p) => Math.min(questions.length - 1, p + 1))}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow transition-colors cursor-pointer"
            >
              <span>Soal Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowFinishModal(true)}
              className="flex items-center gap-1 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-colors cursor-pointer animate-pulse"
            >
              <span>SELESAI TES</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal Grid Daftar Soal Khas Pusmendik (Warna: Terjawab, Ragu-ragu, Belum dijawab) */}
      {showQuestionGridModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Daftar Butir Soal Asesmen</h3>
                <p className="text-xs text-slate-500">Klik nomor untuk melompat langsung ke soal</p>
              </div>
              <button
                onClick={() => setShowQuestionGridModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Status Legend Pusmendik */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[#0b2847] border border-slate-700"></span>
                <span>Sudah Dijawab</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-amber-400 border border-amber-500"></span>
                <span>Ragu-ragu</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-white border border-slate-400"></span>
                <span>Belum Dijawab</span>
              </div>
            </div>

            {/* Grid 1..N */}
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2.5 max-h-72 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const answered = isAnswered(q.id);
                const isDoubt = doubtful[q.id];
                const isCurrent = currentIndex === idx;

                let bgClass = 'bg-white text-slate-800 border-slate-300';
                if (isDoubt) {
                  bgClass = 'bg-amber-400 text-slate-950 border-amber-500 font-black';
                } else if (answered) {
                  bgClass = 'bg-[#0b2847] text-white border-[#0b2847] font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowQuestionGridModal(false);
                    }}
                    className={`h-11 rounded-lg border-2 text-xs flex flex-col items-center justify-center transition-all cursor-pointer ${bgClass} ${
                      isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                    }`}
                  >
                    <span className="font-bold">{idx + 1}</span>
                    <span className="text-[8px] uppercase opacity-75">{q.type.slice(0, 2)}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowQuestionGridModal(false);
                  setShowFinishModal(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
              >
                Selesaikan Tes Sekarang
              </button>
              <button
                onClick={() => setShowQuestionGridModal(false)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Selesai Tes */}
      {showFinishModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="font-bold text-slate-900 text-lg">Konfirmasi Selesai Tes</h3>
              <p className="text-xs text-slate-500 mt-1">
                Apakah Anda yakin ingin mengakhiri sesi Simulasi TKA Ekonomi SMA ini? Jawaban Anda akan dihitung dan direkapitulasi secara otomatis.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Soal Terjawab:</span>
                <span className="font-bold text-blue-900">
                  {questions.filter((q) => isAnswered(q.id)).length} dari {questions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Soal Ragu-ragu:</span>
                <span className="font-bold text-amber-700">
                  {Object.values(doubtful).filter(Boolean).length}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowFinishModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Lanjutkan Mengerjakan
              </button>
              <button
                onClick={() => {
                  setShowFinishModal(false);
                  setIsFinished(true);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
              >
                Ya, Selesai Tes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
