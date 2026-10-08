import { useState } from 'react';
import { Header } from './components/Header.js';
import { AdminDashboard } from './components/AdminDashboard.js';
import { QuestionBankEditor } from './components/QuestionBankEditor.js';
import { TkaSimulationCbt } from './components/TkaSimulationCbt.js';
import { MasterPromptGuide } from './components/MasterPromptGuide.js';
import { DEFAULT_CONFIG, INITIAL_SEED_QUESTIONS } from './data/defaults.js';
import { GenerationConfig, QuestionItem } from './types/quiz.js';
import { downloadQuizPdf } from './utils/pdfGenerator.js';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<GenerationConfig>(DEFAULT_CONFIG);
  const [questions, setQuestions] = useState<QuestionItem[]>(INITIAL_SEED_QUESTIONS);
  const [activeTab, setActiveTab] = useState<'generator' | 'bank' | 'simulation' | 'prompt_guide'>('generator');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [logoModalOpen, setLogoModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Generate Questions via Backend Gemini AI / Curated Bank
  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    showToast('Menghubungkan ke Gemini 3.8 AI & mengolah butir soal...', 'info');

    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const rawText = await response.text();
      let data: any = null;

      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          `Respons server bukan JSON (Status HTTP ${response.status}). Periksa rute /api/generate-questions.`
        );
      }

      if (response.ok && data?.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
        const sourceLabel =
          data.source === 'gemini-3.8-flash'
            ? 'via Gemini 3.8 Flash'
            : 'via Bank Kurikulum Pusmendik Terkurasi';
        showToast(
          `Berhasil memproduksi ${data.questions.length} butir soal (${sourceLabel})!`,
          'success'
        );
        setActiveTab('bank');
      } else {
        const errMsg = data?.error || data?.message || `Gagal memproses soal (HTTP ${response.status})`;
        showToast(errMsg, 'error');
      }
    } catch (err: unknown) {
      console.error('Generation error:', err);
      const message = err instanceof Error ? err.message : 'Terjadi kendala koneksi ke endpoint /api/generate-questions';
      showToast(message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle PDF Export
  const handleDownloadPdf = () => {
    if (questions.length === 0) {
      showToast('Belum ada soal untuk dicetak ke PDF. Silakan buat soal terlebih dahulu.', 'error');
      return;
    }

    try {
      downloadQuizPdf(questions, config);
      showToast('File PDF Asesmen Ekonomi SMA berhasil diunduh secara otomatis!', 'success');
    } catch (err) {
      console.error('PDF error:', err);
      showToast('Gagal membuat file PDF. Silakan periksa kembali data.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-bold transition-all animate-in slide-in-from-bottom duration-200 bg-slate-900 text-white border-slate-700">
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* When in simulation mode, show CBT full view */}
      {activeTab === 'simulation' ? (
        <TkaSimulationCbt
          questions={questions}
          config={config}
          onExitSimulation={() => setActiveTab('generator')}
        />
      ) : (
        <>
          {/* Header */}
          <Header
            config={config}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            questionCount={questions.length}
            onDownloadPdf={handleDownloadPdf}
            onOpenLogoModal={() => setLogoModalOpen(true)}
          />

          {/* Main Body per Active Tab */}
          <main className="flex-1 pb-16">
            {activeTab === 'generator' && (
              <AdminDashboard
                config={config}
                setConfig={setConfig}
                onGenerate={handleGenerateQuestions}
                isGenerating={isGenerating}
                onDownloadPdf={handleDownloadPdf}
                questions={questions}
                onStartSimulation={() => setActiveTab('simulation')}
                logoModalOpen={logoModalOpen}
                setLogoModalOpen={setLogoModalOpen}
              />
            )}

            {activeTab === 'bank' && (
              <QuestionBankEditor
                questions={questions}
                setQuestions={setQuestions}
                config={config}
                onDownloadPdf={handleDownloadPdf}
                onStartSimulation={() => setActiveTab('simulation')}
              />
            )}

            {activeTab === 'prompt_guide' && <MasterPromptGuide />}
          </main>

          {/* Official Footer */}
          <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs text-center">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">SIMULASI TKA EKONOMI SMA</span>
                <span>•</span>
                <span>Pusat Asesmen Pendidikan Kemdikbud Model</span>
              </div>
              <div>
                <span>Konfigurasi C1-C6 HOTS • LOTS/MOTS • 11 Bentuk Soal • Ekspor PDF Terverifikasi</span>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
