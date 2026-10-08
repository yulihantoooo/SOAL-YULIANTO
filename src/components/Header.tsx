import React from 'react';
import { GenerationConfig } from '../types/quiz.js';
import { 
  Sliders, 
  FileText, 
  Monitor, 
  BookOpen, 
  Download, 
  GraduationCap, 
  Sparkles 
} from 'lucide-react';

interface HeaderProps {
  config: GenerationConfig;
  activeTab: 'generator' | 'bank' | 'simulation' | 'prompt_guide';
  setActiveTab: (tab: 'generator' | 'bank' | 'simulation' | 'prompt_guide') => void;
  questionCount: number;
  onDownloadPdf: () => void;
  onOpenLogoModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  activeTab,
  setActiveTab,
  questionCount,
  onDownloadPdf,
  onOpenLogoModal,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white shadow-lg sticky top-0 z-40">
      {/* Top Bar Kemdikbud & Instansi */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-4 py-2 text-xs border-b border-blue-800/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded font-semibold bg-amber-400 text-slate-950 text-[10px] tracking-wider uppercase">
              Pusmendik TKA
            </span>
            <span className="text-slate-300 font-medium hidden sm:inline">
              Pusat Asesmen Pendidikan - Kemendikbudristek RI
            </span>
            <span className="text-slate-400 hidden md:inline">|</span>
            <span className="text-cyan-300 font-medium hidden md:inline">
              Mata Pelajaran: {config.subject} ({config.grade})
            </span>
          </div>

          <div className="flex items-center space-x-3 text-slate-300">
            <button
              onClick={onOpenLogoModal}
              className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
              title="Ubah Nama & Logo Instansi"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="underline decoration-dotted">{config.schoolName}</span>
            </button>
            <span className="text-slate-600">|</span>
            <span className="bg-slate-800/80 px-2 py-0.5 rounded text-[11px] font-mono text-cyan-400 border border-slate-700">
              {questionCount} Soal Tersedia
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-3">
            <div 
              onClick={onOpenLogoModal}
              className="relative w-11 h-11 rounded-lg overflow-hidden bg-slate-800 border-2 border-amber-400/80 flex items-center justify-center p-0.5 cursor-pointer shadow hover:scale-105 transition-transform"
              title="Klik untuk ubah logo"
            >
              {config.schoolLogo ? (
                <img
                  src={config.schoolLogo}
                  alt="Logo"
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=150&auto=format&fit=crop&q=80';
                  }}
                />
              ) : (
                <GraduationCap className="w-6 h-6 text-amber-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                  SIMULASI TKA EKONOMI SMA
                </h1>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-600/60 text-blue-200 border border-blue-400/30">
                  C1-C6 HOTS
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span>Model Pusmendik Kemdikbud</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">Asesmen Standar Nasional</span>
              </p>
            </div>
          </div>

          {/* Quick PDF button on mobile */}
          <button
            onClick={onDownloadPdf}
            className="md:hidden flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center flex-wrap gap-1.5 w-full md:w-auto justify-center">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'generator'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Dashboard & Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('bank')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'bank'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Bank & Editor Soal</span>
            <span className="px-1.5 py-0.2 bg-blue-950 text-blue-300 rounded text-[10px] border border-blue-700">
              {questionCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'simulation'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-amber-300 hover:text-white hover:bg-slate-800 border border-amber-500/30'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Simulasi CBT Pusmendik</span>
          </button>

          <button
            onClick={() => setActiveTab('prompt_guide')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'prompt_guide'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Petunjuk AI Studio</span>
            <span className="sm:hidden">Petunjuk</span>
          </button>

          {/* Desktop PDF Download Button */}
          <button
            onClick={onDownloadPdf}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-emerald-600/30 transition-all ml-2 cursor-pointer"
            title="Download file PDF resmi Kisi-kisi, Butir Soal, Kunci Jawaban & Pembahasan otomatis"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Simpan PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
