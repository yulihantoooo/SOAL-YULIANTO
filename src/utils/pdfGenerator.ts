import { jsPDF } from 'jspdf';
import { QuestionItem, GenerationConfig } from '../types/quiz.js';

export function downloadQuizPdf(questions: QuestionItem[], config: GenerationConfig): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 15) {
      doc.addPage();
      y = margin;
      drawHeaderFooterMini();
    }
  };

  const drawHeaderFooterMini = () => {
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `${config.schoolName} - SIMULASI TKA EKONOMI SMA (${config.grade})`,
      margin,
      10
    );
    doc.text(
      `Halaman ${doc.getNumberOfPages()}`,
      pageWidth - margin - 20,
      10
    );
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, 11, pageWidth - margin, 11);
  };

  // --- KOP SURAT / HEADER RESMI ---
  doc.setDrawColor(30, 58, 138); // blue-900
  doc.setLineWidth(0.8);

  // Decorative header box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 58, 138);
  doc.text(config.schoolName.toUpperCase(), margin + 6, y + 8);

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('ASESMEN KISI-KISI & BANK SOAL TKA PUSMENDIK KEMDIKBUD', margin + 6, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Mata Pelajaran: ${config.subject}   |   Jenjang: SMA   |   Tingkat: ${config.grade}`, margin + 6, y + 21);
  doc.text(`Penyusun: ${config.authorName || 'YULIANTO HARSONO'}   |   Topik: ${config.topic.slice(0, 50)}${config.topic.length > 50 ? '...' : ''}`, margin + 6, y + 26);

  y += 38;

  // --- INFO KELENGKAPAN ASESMEN ---
  doc.setFillColor(239, 246, 255);
  doc.rect(margin, y, contentWidth, 18, 'F');
  doc.setDrawColor(191, 219, 254);
  doc.rect(margin, y, contentWidth, 18, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 64, 175);
  doc.text('PARAMETER DAN KISI-KISI ASESMEN:', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const diffs = config.selectedDifficulties.join(', ');
  const thinks = config.selectedThinkingCategories.join(', ');
  const exps = config.selectedLearningExperiences.join(', ');
  const cogs = config.selectedCognitiveLevels.join(', ');

  doc.text(`Tingkat Kesulitan: ${diffs}   |   Kategori Berpikir: ${thinks}`, margin + 4, y + 10);
  doc.text(`Pengalaman Belajar: ${exps}   |   Level Kognitif: ${cogs}`, margin + 4, y + 14);

  y += 24;

  // --- SECTION I: DAFTAR BUTIR SOAL ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('BAGIAN I: BUTIR SOAL SIMULASI TKA', margin, y);
  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 2, margin + 80, y + 2);
  y += 8;

  questions.forEach((q, index) => {
    checkPageBreak(35);

    // Question Header Badge
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 6.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 6.5, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`Nomor ${index + 1}  [${formatQuestionTypeLabel(q.type)}]`, margin + 2, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    const badgeMeta = `${q.difficulty} | ${q.thinkingCategory} | ${q.cognitiveLevel} | ${q.learningExperience}`;
    doc.text(badgeMeta, pageWidth - margin - 65, y + 4.5);

    y += 9;

    // Stimulus (if present)
    if (q.stimulus && q.stimulus.trim().length > 0) {
      checkPageBreak(25);
      doc.setFillColor(254, 252, 232); // amber-50
      doc.setDrawColor(253, 230, 138);

      const stimulusLines = doc.splitTextToSize(`[STIMULUS BACAAN / KONTEKS EKONOMI]\n${q.stimulus}`, contentWidth - 8);
      const stimulusBoxHeight = stimulusLines.length * 3.6 + 6;

      doc.rect(margin, y, contentWidth, stimulusBoxHeight, 'F');
      doc.rect(margin, y, contentWidth, stimulusBoxHeight, 'D');

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(113, 63, 18);
      doc.text(stimulusLines, margin + 4, y + 4.5);

      y += stimulusBoxHeight + 3;
    }

    // Question Text
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    const qLines = doc.splitTextToSize(q.questionText, contentWidth - 4);
    doc.text(qLines, margin + 2, y + 3);
    y += qLines.length * 4 + 4;

    // Options or Question-Specific Format
    if (q.type === 'pilihan_ganda' || q.type === 'berbasis_konteks' || q.type === 'respons_tepat' || q.type === 'sjt') {
      const letters = ['A', 'B', 'C', 'D', 'E'];
      (q.options || []).forEach((opt, optIdx) => {
        checkPageBreak(12);
        const optLines = doc.splitTextToSize(`${letters[optIdx]}. ${opt}`, contentWidth - 8);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        doc.text(optLines, margin + 4, y);
        y += optLines.length * 3.8 + 1.5;
      });
    } else if (q.type === 'pilihan_ganda_kompleks') {
      (q.options || []).forEach((opt, optIdx) => {
        checkPageBreak(12);
        const optLines = doc.splitTextToSize(`[   ]  ${opt}`, contentWidth - 8);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);
        doc.text(optLines, margin + 4, y);
        y += optLines.length * 3.8 + 1.5;
      });
    } else if (q.type === 'isian_singkat') {
      checkPageBreak(12);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Lembar Jawaban Siswa: __________________________________________________', margin + 4, y);
      y += 8;
    } else if (q.type === 'benar_salah') {
      checkPageBreak(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Pernyataan:', margin + 4, y);
      doc.text('Benar (B) / Salah (S)', pageWidth - margin - 35, y);
      y += 4;

      (q.statements || []).forEach((st, sIdx) => {
        checkPageBreak(10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(51, 65, 85);
        const sLines = doc.splitTextToSize(`${sIdx + 1}. ${st.statement}`, contentWidth - 45);
        doc.text(sLines, margin + 4, y);
        doc.text('[   B   ]    [   S   ]', pageWidth - margin - 35, y);
        y += sLines.length * 3.6 + 2;
      });
    } else if (q.type === 'menjodohkan') {
      checkPageBreak(22);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Kolom A (Premis)', margin + 4, y);
      doc.text('Kolom B (Pasangan Karakteristik)', margin + contentWidth / 2, y);
      y += 4;

      (q.matchingPairs || []).forEach((mp, mIdx) => {
        checkPageBreak(12);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(51, 65, 85);
        const pLines = doc.splitTextToSize(`${mIdx + 1}. ${mp.premise}`, contentWidth / 2 - 8);
        const rLines = doc.splitTextToSize(`( ${String.fromCharCode(65 + mIdx)} ) ${mp.response}`, contentWidth / 2 - 6);
        const maxH = Math.max(pLines.length, rLines.length) * 3.6 + 2;
        doc.text(pLines, margin + 4, y);
        doc.text(rLines, margin + contentWidth / 2, y);
        y += maxH;
      });
    } else if (q.type === 'uraian_esai' || q.type === 'studi_kasus' || q.type === 'praktik_kinerja') {
      checkPageBreak(24);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      for (let line = 0; line < 4; line++) {
        doc.line(margin + 4, y + line * 5, pageWidth - margin - 4, y + line * 5);
      }
      y += 24;
    }

    y += 4; // Space between questions
  });

  // --- SECTION II: KUNCI JAWABAN & PEMBAHASAN LENGKAP ---
  doc.addPage();
  y = margin;
  drawHeaderFooterMini();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('BAGIAN II: KUNCI JAWABAN & PEMBAHASAN MENDALAM', margin, y);
  doc.setDrawColor(22, 101, 52); // green-800
  doc.setLineWidth(0.5);
  doc.line(margin, y + 2, margin + 115, y + 2);
  y += 8;

  questions.forEach((q, index) => {
    checkPageBreak(30);

    doc.setFillColor(240, 253, 244); // green-50
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setDrawColor(187, 247, 208);
    doc.rect(margin, y, contentWidth, 6, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(22, 101, 52);

    let keyText = '';
    const letters = ['A', 'B', 'C', 'D', 'E'];
    if (q.correctOptionIndex !== undefined) {
      keyText = `Kunci Jawaban: ${letters[q.correctOptionIndex] || '-'}`;
    } else if (q.correctOptionsMulti && q.correctOptionsMulti.length > 0) {
      keyText = `Kunci Jawaban: ${q.correctOptionsMulti.map((k) => letters[k]).join(', ')}`;
    } else if (q.shortAnswerKey) {
      keyText = `Kunci Jawaban: "${q.shortAnswerKey}"`;
    } else if (q.statements) {
      keyText = `Kunci: ${q.statements.map((s, i) => `#${i + 1}:${s.isCorrect ? 'B' : 'S'}`).join(' | ')}`;
    } else {
      keyText = 'Rubrik Kinerja / Esai';
    }

    doc.text(`Soal #${index + 1}  -  ${keyText}`, margin + 3, y + 4.2);
    y += 8;

    // Pembahasan Text
    checkPageBreak(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Pembahasan Ilmiah & Analisis Konsep:', margin + 3, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    const ratLines = doc.splitTextToSize(q.rationale, contentWidth - 6);
    doc.text(ratLines, margin + 3, y);
    y += ratLines.length * 3.6 + 3;

    if (q.essayRubric) {
      checkPageBreak(15);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      const rubLines = doc.splitTextToSize(`Pedoman Penskoran: ${q.essayRubric}`, contentWidth - 6);
      doc.text(rubLines, margin + 3, y);
      y += rubLines.length * 3.4 + 2;
    }

    y += 3;
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Dokumen resmi Simulasi TKA & Bank Soal Ekonomi SMA - Pusmendik Kemdikbud. Penyusun: ${config.authorName || 'YULIANTO HARSONO'}.`,
      margin,
      pageHeight - 6
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - margin - 22, pageHeight - 6);
  }

  // Otomatis terdownload
  const sanitizedTopic = config.topic.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 25);
  const filename = `Soal_Ekonomi_SMA_${config.grade.replace(' ', '_')}_${sanitizedTopic}_Pusmendik_TKA.pdf`;
  doc.save(filename);
}

function formatQuestionTypeLabel(type: string): string {
  const map: Record<string, string> = {
    pilihan_ganda: 'Pilihan Ganda',
    pilihan_ganda_kompleks: 'Pilihan Ganda Kompleks',
    isian_singkat: 'Isian Singkat',
    uraian_esai: 'Uraian / Esai',
    menjodohkan: 'Menjodohkan',
    benar_salah: 'Benar–Salah',
    berbasis_konteks: 'Berbasis Konteks / Stimulus',
    studi_kasus: 'Studi Kasus',
    praktik_kinerja: 'Praktik / Kinerja',
    respons_tepat: 'Menentukan Respons Paling Tepat',
    sjt: 'Situational Judgemental Test (SJT)',
  };
  return map[type] || type;
}
