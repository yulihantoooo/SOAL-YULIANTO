import React, { useState } from 'react';
import { 
  BookOpen, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Layers, 
  BrainCircuit, 
  Code2, 
  CheckCircle2 
} from 'lucide-react';

export const MasterPromptGuide: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const fullPromptText = `# PANDUAN DAN MASTER PROMPT GOOGLE AI STUDIO
## PROYEK: SISTEM ASESMEN & SIMULASI TKA EKONOMI SMA MODEL PUSMENDIK KEMDIKBUD

Petunjuk ini dirancang khusus untuk diinputkan ke Google AI Studio (Model: gemini-3.8-flash) guna memproduksi aplikasi web penuh maupun menghasilkan butir soal ekonomi SMA berkualitas tinggi.

---

### I. PERAN DAN IDENTITAS AI (SYSTEM INSTRUCTIONS)
Anda adalah Pakar Penilaian dan Asesmen Pendidikan Pusmendik Kemdikbudristek RI sekaligus Konsultan Ahli Kurikulum Mata Pelajaran Ekonomi Jenjang SMA. Tugas Anda adalah merancang dan menyusun butir soal tes kemampuan akademik (TKA / Asesmen Nasional) yang otentik, saintifik, dan berbasis konteks nyata Indonesia.

---

### II. PERSYARATAN UTAMA SISTEM
1. **Jenjang Pendidikan:** SMA (Sekolah Menengah Atas).
2. **Jenis Soal:** Mata Pelajaran Ekonomi SMA.
3. **Pilihan Kelas:**
   - Kelas 10 (Fase E - Konsep Dasar Ekonomi, Masalah Pokok, Kelangkaan, Mekanisme Pasar, Lembaga Jasa Keuangan/OJK, Bank Sentral).
   - Kelas 11 (Fase F - Pendapatan Nasional, Pertumbuhan Ekonomi, Ketenagakerjaan, Inflasi, Kebijakan Fiskal/APBN, Kebijakan Moneter).
   - Kelas 12 (Fase F - Kerjasama Internasional, Neraca Pembayaran, Valuta Asing, Akuntansi Perusahaan Jasa & Dagang, Kewirausahaan).
4. **Bentuk Soal (Multi-Select):**
   - Pilihan Ganda (1 jawaban benar, 5 opsi distractor A-E)
   - Pilihan Ganda Kompleks (jawaban benar lebih dari satu)
   - Isian Singkat (jawaban angka nominal / istilah presisi)
   - Uraian / Esai (evaluasi kebijakan dan analisis mendalam dengan rubrik)
   - Menjodohkan (mencocokkan premis konsep dengan karakteristik)
   - Benar–Salah (menentukan validitas serangkaian proposisi ekonomi)
   - Berbasis Konteks / Stimulus (berpijak pada tabel data BPS / Bank Indonesia)
   - Studi Kasus (pemecahan krisis riil dunia usaha / koperasi / UMKM)
   - Praktik / Kinerja (penyusunan kertas kerja akuntansi / anggaran)
   - Menentukan Respons Paling Tepat / Paling Tidak Tepat (prioritas keputusan manajerial)
   - Situational Judgemental Test - SJT (dilema etis keputusan keuangan & perbankan)
5. **Jumlah Soal per Bentuk:** Dropdown pilihan 5, 10, 15, 20, 25, 50, 75, dan 100 butir.

---

### III. DISTRIBUSI KOGNITIF & PENGALAMAN BELAJAR
- **Kategori Berpikir (Dapat dipilih ketiganya):**
  - LOTS (Lower Order Thinking Skills)
  - MOTS (Middle Order Thinking Skills)
  - HOTS (Higher Order Thinking Skills)
- **Tingkat Kesulitan:** Rendah, Sedang, Sulit.
- **Pengalaman Belajar (Dapat dipilih ketiganya):**
  - Memahami: Menguji pemahaman dasar konsep, definisi, dan mekanisme ekonomi.
  - Mengaplikasi: Aplikasi dalam konteks riil kehidupan, pasar, dan dunia usaha.
  - Merefleksi: Refleksi kritis atas kebijakan fiskal/moneter dan evaluasi fenomena makro.
- **Level Kognitif Taksonomi Bloom (C1–C6):**
  - C1: Mengingat
  - C2: Memahami
  - C3: Menerapkan / Mengaplikasikan
  - C4: Menganalisis
  - C5: Mengevaluasi
  - C6: Mencipta

---

### IV. INSTRUKSI KHUSUS UNTUK AI (QUALITY CONTROL)
- **Fokus Prioritas:** Soal harus berfokus pada evaluasi (C5), penciptaan (C6), dan pemecahan masalah kompleks.
- **Stimulus Kontekstual:** Wajib menyertakan stimulus berupa studi kasus aktual, tabel statistik makroekonomi (misal data inflasi BPS, neraca pembayaran, BI-Rate, postur APBN), atau skenario bisnis otentik.
- **Kualitas Distractor:** Pilihan jawaban salah (distractor) harus masuk akal (plausible) dan mendiagnosis miskonsepsi umum peserta didik.
- **Pembahasan:** Setiap butir soal wajib menyertakan pembahasan komprehensif, konsep ekonomi yang mendasari, dan pedoman penskoran (rubrik).

---

### V. FITUR TAMBAHAN PLATFORM
1. **Dashboard Admin:**
   - Menu ubah nama sekolah/lembaga dan ganti logo (upload file / URL).
   - Text box input topik materi dan tujuan pembelajaran yang fleksibel diedit.
   - Bank soal interaktif yang memungkinkan admin mengedit butir soal secara leluasa.
2. **Simulasi CBT Pusmendik:**
   - Tampilan persis portal resmi Pusmendik Kemdikbud (https://pusmendik.kemdikbud.go.id/tka/simulasi_tka).
   - Fitur ukuran fon (A, A+, A++), countdown timer ujian, panel navigasi "Daftar Soal", tombol "Soal Sebelumnya", tombol kuning "Ragu-ragu", dan "Soal Berikutnya".
3. **Ekspor Dokumen:**
   - Tombol "Simpan PDF" yang secara otomatis mengunduh file PDF resmi lengkap dengan kop instansi, tabel kisi-kisi, butir soal, dan kunci jawaban/pembahasan.
4. **Kompatibilitas Penuh Vercel (Serverless):**
   - Endpoint \`/api/generate-questions\` tersedia secara native via Vercel Serverless Function (\`api/generate-questions.ts\`).
   - Cukup pasang \`GEMINI_API_KEY\` di menu Vercel Project Settings > Environment Variables (hanya berjalan di server-side, tidak pernah terekspos ke browser).
   - Dilengkapi \`vercel.json\` untuk routing otomatis.
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const downloadTextFile = () => {
    const blob = new Blob([fullPromptText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Petunjuk_Master_Google_AI_Studio_TKA_Ekonomi_SMA.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header Guide */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-800/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Dokumentasi Resmi & Panduan Master Prompt</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Petunjuk Komprehensif Google AI Studio
          </h2>
          <p className="text-xs text-slate-300">
            Gunakan spesifikasi terstruktur ini pada Google AI Studio untuk merancang dan mereplikasi sistem generator bank soal Ekonomi SMA berstandar Pusmendik Kemdikbud RI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Master Prompt'}</span>
          </button>

          <button
            onClick={downloadTextFile}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .MD</span>
          </button>
        </div>
      </div>

      {/* Guide Highlights Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="p-2 w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">11 Variasi Bentuk Soal</h3>
          <p className="text-xs text-slate-600">
            Mencakup PG, PG Kompleks, Isian Singkat, Uraian, Menjodohkan, Benar-Salah, Stimulus, Studi Kasus, Praktik Akuntansi, Respons Tepat, dan SJT dengan kuota 5–100 soal.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="p-2 w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Taksonomi C1–C6 & HOTS</h3>
          <p className="text-xs text-slate-600">
            Integrasi dimensi berpikir LOTS, MOTS, dan HOTS serta 3 pilar pengalaman belajar (Memahami, Mengaplikasi, Merefleksi) yang dapat dipilih ketiganya.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="p-2 w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Simulator Pusmendik & PDF</h3>
          <p className="text-xs text-slate-600">
            Antarmuka CBT siswa dengan timer dan ragu-ragu yang identik dengan simulasi resmi Pusmendik, plus export PDF otomatis berfungsi penuh.
          </p>
        </div>
      </div>

      {/* Structured Code / Prompt Block */}
      <div className="bg-slate-900 rounded-2xl p-6 text-slate-100 font-mono text-xs shadow-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400 font-semibold ml-2 text-[11px]">
              Master_Prompt_Pusmendik_Ekonomi_SMA.md
            </span>
          </div>

          <button
            onClick={copyToClipboard}
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin Semua'}</span>
          </button>
        </div>

        <pre className="whitespace-pre-wrap leading-relaxed text-slate-200 font-sans text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 max-h-[500px] overflow-y-auto">
          {fullPromptText}
        </pre>
      </div>
    </div>
  );
};
