import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

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
  stimulus?: string;
  questionText: string;
  options?: string[];
  correctOptionIndex?: number;
  correctOptionsMulti?: number[];
  shortAnswerKey?: string;
  matchingPairs?: MatchingPair[];
  statements?: StatementCheck[];
  essayRubric?: string;
  rationale: string;
  topic: string;
  learningObjective: string;
}

export interface GenerationConfig {
  authorName?: string;
  schoolName: string;
  schoolLogo: string;
  educationLevel: 'SMA';
  grade: 'Kelas 10' | 'Kelas 11' | 'Kelas 12';
  subject: string;
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

function generateFallbackBank(config: GenerationConfig): QuestionItem[] {
  const result: QuestionItem[] = [];
  const topic = config.topic || 'Kebijakan Moneter, Inflasi, dan Keseimbangan Pasar';
  const learningObjective = config.learningObjective || 'Menganalisis dampak kebijakan moneter terhadap stabilitas harga dan pertumbuhan ekonomi nasional.';

  for (const qType of (config.selectedQuestionTypes || ['pilihan_ganda'])) {
    const count = Math.min(config.questionCounts?.[qType] || 5, 25);
    for (let i = 1; i <= count; i++) {
      const cog = config.selectedCognitiveLevels?.[(i - 1) % config.selectedCognitiveLevels.length] || 'C5';
      const think = config.selectedThinkingCategories?.[(i - 1) % config.selectedThinkingCategories.length] || 'HOTS';
      const diff = config.selectedDifficulties?.[(i - 1) % config.selectedDifficulties.length] || 'Sulit';
      const exp = config.selectedLearningExperiences?.[(i - 1) % config.selectedLearningExperiences.length] || 'Merefleksi';

      if (qType === 'pilihan_ganda') {
        result.push({
          id: `q-${qType}-${i}-${Date.now().toString(36)}`,
          type: qType,
          difficulty: diff,
          thinkingCategory: think,
          learningExperience: exp,
          cognitiveLevel: cog,
          stimulus: `Badan Pusat Statistik (BPS) mencatat laju inflasi tahunan (y-on-y) melonjak ke angka 5,8% akibat kenaikan harga komoditas pangan dunia dan disrupsi rantai pasok energi global. Bank Indonesia merespons situasi ini melalui Rapat Dewan Gubernur (RDG).`,
          questionText: `Berdasarkan stimulus data makroekonomi tersebut, langkah bauran kebijakan moneter manakah yang paling efektif dan tepat diterapkan oleh Bank Indonesia guna mengembalikan ekspektasi inflasi ke sasaran 3±1% tanpa menekan likuiditas sektor riil secara berlebihan?`,
          options: [
            'Menaikkan BI-Rate secara terukur diiringi optimalisasi instrumen Sekuritas Rupiah Bank Indonesia (SRBI) untuk menyerap kelebihan likuiditas valas dan domestik.',
            'Menurunkan Giro Wajib Minimum (GWM) perbankan dan membeli Surat Berharga Negara di pasar perdana dalam skala besar.',
            'Melakukan operasi pasar terbuka ekspansif dan membatasi penyaluran kredit perbankan ke UMKM.',
            'Menerapkan batas suku bunga kredit maksimum (capping) dan melakukan devaluasi nilai tukar Rupiah.',
            'Mengurangi cadangan devisa untuk membiayai impor barang konsumsi tanpa koordinasi dengan Tim Pengendalian Inflasi Pusat (TPIP).'
          ],
          correctOptionIndex: 0,
          rationale: `Kebijakan kontraksi moneter terukur dengan menaikkan suku bunga acuan (BI-Rate) dan menerbitkan SRBI secara efektif menyerap likuiditas tanpa membekukan kapasitas intermediasi perbankan untuk sektor prioritas.`,
          topic,
          learningObjective,
        });
      } else if (qType === 'pilihan_ganda_kompleks') {
        result.push({
          id: `q-${qType}-${i}-${Date.now().toString(36)}`,
          type: qType,
          difficulty: diff,
          thinkingCategory: think,
          learningExperience: exp,
          cognitiveLevel: cog,
          stimulus: `Pemerintah menyusun postur APBN dengan target penerimaan perpajakan yang agresif di tengah tren perlambatan ekonomi mitra dagang utama dan volatilitas harga komoditas ekspor.`,
          questionText: `Evaluasilah pernyataan-pernyataan berikut mengenai implikasi kebijakan fiskal counter-cyclical! Manakah pernyataan yang bernilai BENAR? (Pilihlah semua yang sesuai)`,
          options: [
            'Pemerintah sebaiknya memperlebar defisit fiskal secara terkendali untuk mempertahankan belanja perlindungan sosial dan infrastruktur dasar.',
            'Pemberian insentif super tax deduction untuk riset dan vokasi mendorong daya saing jangka panjang industri manufaktur domestik.',
            'Kebijakan menaikkan tarif PPN di tengah daya beli masyarakat yang melemah akan langsung meningkatkan pertumbuhan konsumsi rumah tangga.',
            'Automatic stabilizers bekerja secara otomatis menstabilkan fluktuasi siklus bisnis tanpa memerlukan undang-undang anggaran baru di setiap siklus.'
          ],
          correctOptionsMulti: [0, 1, 3],
          rationale: `Pernyataan 1, 2, dan 4 benar mencerminkan prinsip counter-cyclical fiscal policy dan automatic stabilizers. Pernyataan 3 keliru karena kenaikan tarif PPN saat daya beli rendah justru menekan marginal propensity to consume (MPC).`,
          topic,
          learningObjective,
        });
      } else if (qType === 'isian_singkat') {
        result.push({
          id: `q-${qType}-${i}-${Date.now().toString(36)}`,
          type: qType,
          difficulty: diff,
          thinkingCategory: think,
          learningExperience: exp,
          cognitiveLevel: cog,
          stimulus: `Pada fungsi permintaan Qd = 120 - 4P dan fungsi penawaran Qs = -30 + 6P, terjadi pergeseran ekuilibrium pasar komoditas beras setelah pemerintah memberikan subsidi sebesar Rp2 per unit produksi kepada petani.`,
          questionText: `Hitunglah besarnya harga keseimbangan pasar (P) yang baru setelah subsidi dinikmati oleh konsumen! Tuliskan angka nominal akhirnya saja (contoh: 13.8).`,
          shortAnswerKey: '13.8',
          rationale: `Fungsi penawaran baru dengan subsidi s=2: P = (Qs + 30)/6 - 2 => 6(P+2) = Qs + 30 => Qs' = 6P - 18. Ekuilibrium baru: 120 - 4P = 6P - 18 => 10P = 138 => P = 13,8.`,
          topic,
          learningObjective,
        });
      } else if (qType === 'uraian_esai') {
        result.push({
          id: `q-${qType}-${i}-${Date.now().toString(36)}`,
          type: qType,
          difficulty: diff,
          thinkingCategory: think,
          learningExperience: exp,
          cognitiveLevel: cog,
          stimulus: `Data Neraca Pembayaran Indonesia (NPI) menunjukkan surplus transaksi modal dan finansial yang mampu mengimbangi defisit transaksi berjalan (Current Account Deficit) sebesar 1,2% dari PDB. Namun, ketidakpastian geopolitik global memicu capital flight ke aset safe haven di Amerika Serikat.`,
          questionText: `Rancanglah sebuah kerangka strategi kebijakan komprehensif (Policy Mix) yang mengintegrasikan kebijakan fiskal, moneter, dan struktural untuk menjaga kestabilan nilai tukar Rupiah sekaligus mendorong reindustrialisasi berbasis nilai tambah dalam negeri! Uraikan argumen logis dan risiko dari masing-masing instrumen!`,
          essayRubric: `Rubrik Penilaian (Skor Maksimal 100):\n1. Pemahaman Konseptual NPI dan Valas (25 poin)\n2. Formulasi Bauran Kebijakan Moneter-Fiskal-Struktural (35 poin)\n3. Analisis Mitigasi Risiko dan Trade-Off (25 poin)\n4. Struktur Argumen dan Solutif (15 poin)`,
          rationale: `Jawaban siswa harus mencakup sinergi antara intervensi valas DNDF (moneter), insentif hilirisasi perpajakan (fiskal), serta deregulasi kemudahan berusaha dan hilirisasi SDA (struktural).`,
          topic,
          learningObjective,
        });
      } else if (qType === 'menjodohkan') {
        result.push({
          id: `q-${qType}-${i}-${Date.now().toString(36)}`,
          type: qType,
          difficulty: diff,
          thinkingCategory: think,
          learningExperience: exp,
          cognitiveLevel: cog,
          stimulus: `Berbagai bentuk pasar memiliki struktur dan karakteristik pembentukan harga yang unik dalam sistem perekonomian.`,
          questionText: `Jodohkanlah bentuk struktur pasar di Kolom A dengan karakteristik paling spesifik dan contoh riilnya di Kolom B!`,
          matchingPairs: [
            { premise: 'Pasar Monopoli Alamiah', response: 'Produksi dengan skala ekonomi tinggi (economies of scale), contoh: transmisi listrik PLN atau jaringan rel KAI' },
            { premise: 'Pasar Oligopoli Diferensiasi', response: 'Didominasi beberapa pemain besar dengan persaingan non-harga ketat, contoh: industri operator seluler' },
            { premise: 'Pasar Persaingan Monopolistik', response: 'Banyak produsen menghasilkan barang serupa namun terdiferensiasi kemasan/merek, contoh: industri sabun mandi' },
            { premise: 'Pasar Monopsoni', response: 'Hanya ada satu pembeli tunggal yang menghadapi banyak penjual, contoh: pabrik teh lokal membeli pucuk teh dari petani setempat' },
          ],
          rationale: `Pasangan ini menguji kemampuan analitis mengelompokkan struktur pasar berdasarkan barriers to entry, jumlah penjual/pembeli, dan diferensiasi produk.`,
          topic,
          learningObjective,
        });
      } else if (qType === 'benar_salah') {
        result.push({
          id: `q-${qType}-${i}-${Date.now().toString(36)}`,
          type: qType,
          difficulty: diff,
          thinkingCategory: think,
          learningExperience: exp,
          cognitiveLevel: cog,
          stimulus: `Teori Konsumsi Keynesian menyatakan bahwa pengeluaran konsumsi dipengaruhi secara signifikan oleh pendapatan disposabel saat ini (Current Disposable Income) melalui Marginal Propensity to Consume (MPC).`,
          questionText: `Tentukan apakah setiap pernyataan berikut mengenai teori perilaku konsumen dan tabungan bernilai Benar (B) atau Salah (S)!`,
          statements: [
            { statement: 'Nilai MPC selalu berada di antara 0 dan 1 dalam kondisi ekonomi normal.', isCorrect: true, explanation: 'Karena pertambahan konsumsi tidak melebihi pertambahan pendapatan.' },
            { statement: 'Jika nilai MPC = 0,8 maka angka pengganda pengeluaran (multiplier effect) investasi adalah 5.', isCorrect: true, explanation: 'Multiplier k = 1 / (1 - MPC) = 1 / 0,2 = 5.' },
            { statement: 'Saat pendapatan disposabel meningkat, porsi pendapatan yang ditabung (MPS) pasti selalu menurun mendekati nol.', isCorrect: false, explanation: 'Justru pada tingkat pendapatan lebih tinggi, kapasitas tabungan (MPS) cenderung meningkat.' }
          ],
          rationale: `Konsep MPC + MPS = 1 dan angka pengganda k = 1/(1-MPC) merupakan fondasi utama analisis makroekonomi agregat.`,
          topic,
          learningObjective,
        });
      } else if (qType === 'studi_kasus') {
        result.push({
          id: `q-${qType}-${i}-${Date.now().toString(36)}`,
          type: qType,
          difficulty: diff,
          thinkingCategory: think,
          learningExperience: exp,
          cognitiveLevel: 'C5',
          stimulus: `[STUDI KASUS]: Koperasi "Makmur Sejahtera" di Kabupaten X mengalami kelesuan omzet akibat anggota beralih berbelanja ke platform e-commerce dan minimarket berjejaring. Sisa Hasil Usaha (SHU) turun 45% dalam 2 tahun terakhir. Selain itu, partisipasi anggota muda dalam Rapat Anggota Tahunan (RAT) hanya sebesar 12%.`,
          questionText: `Sebagai seorang konsultan ekonomi koperasi, susunlah analisis evaluatif tentang kelemahan model bisnis koperasi konvensional tersebut serta rancang solusi transformasi digital dan restrukturisasi permodalan yang sesuai dengan prinsip jatidiri koperasi Indonesia!`,
          essayRubric: `Kriteria: Diagnosa masalah permodalan & daya saing (30%), Strategi digitalisasi & diversifikasi layanan (40%), Kepatuhan pada UU Perkoperasian & tata kelola (30%).`,
          rationale: `Menguji kemampuan siswa mengevaluasi studi kasus riil koperasi di era disrupsi digital dengan mempertahankan nilai gotong royong dan efisiensi pasar modern.`,
          topic,
          learningObjective,
        });
      } else if (qType === 'berbasis_konteks') {
        result.push({
          id: `q-${qType}-${i}-${Date.now().toString(36)}`,
          type: qType,
          difficulty: diff,
          thinkingCategory: think,
          learningExperience: exp,
          cognitiveLevel: cog,
          stimulus: `[INFOGRAFIS DATA]: Suatu negara kepulauan mengalami kenaikan Gini Ratio dari 0,381 menjadi 0,405 dalam tempo tiga tahun berturut-turut. Pada saat yang sama, pertumbuhan ekonomi tercatat 5,2% per tahun dengan tingkat inflasi 2,8%.`,
          questionText: `Analisislah fenomena yang terjadi pada negara kepulauan tersebut berdasarkan kurva Lorenz dan indikator distribusi pendapatan! Kesimpulan paling kritis yang mencerminkan realitas ekonomi tersebut adalah...`,
          options: [
            'Pertumbuhan ekonomi yang terjadi bersifat eksklusif, di mana akumulasi kekayaan lebih banyak dinikmati oleh kelompok berpendapatan 20% teratas.',
            'Kesejahteraan seluruh lapisan masyarakat meningkat merata karena inflasi yang rendah mengompensasi ketimpangan pendapatan.',
            'Kurva Lorenz bergeser mendekati garis kemerataan sempurna (garis diagonal 45 derajat).',
            'Sektor pertanian tradisional mengalami kenaikan produktivitas yang melampaui sektor jasa modern di perkotaan.',
            'Pemerintah telah berhasil mengimplementasikan sistem pajak progresif dan transfer payment secara maksimal.'
          ],
          correctOptionIndex: 0,
          rationale: `Kenaikan Gini Ratio (mendekati 1) menunjukkan jurang ketimpangan yang melebar (kurva Lorenz menjauhi garis diagonal), mengindikasikan trickle-down effect tidak bekerja efektif dan pertumbuhan dinikmati kelompok elit.`,
          topic,
          learningObjective,
        });
      } else if (qType === 'praktik_kinerja') {
        result.push({
          id: `q-${qType}-${i}-${Date.now().toString(36)}`,
          type: qType,
          difficulty: diff,
          thinkingCategory: think,
          learningExperience: exp,
          cognitiveLevel: 'C6',
          stimulus: `Tabel Data Keuangan Bengkel "Cepat Prima" per 31 Desember 2025:\n- Pendapatan Jasa: Rp85.000.000\n- Beban Gaji Karyawan: Rp22.000.000\n- Beban Sewa Tempat: Rp12.000.000\n- Beban Perlengkapan: Rp5.500.000\n- Beban Penyusutan Peralatan: Rp3.500.000\n- Pengambilan Pribadi (Prive) Pemilik: Rp4.000.000\n- Modal Awal 1 Januari 2025: Rp60.000.000`,
          questionText: `Susunlah Kertas Kerja Laporan Laba/Rugi dan Laporan Perubahan Modal akhir periode! Berapakah saldo Modal Akhir per 31 Desember 2025? Tunjukkan tahapan perhitungannya!`,
          essayRubric: `Laba Bersih = Pendapatan - Total Beban = Rp85.000.000 - Rp43.000.000 = Rp42.000.000. Penambahan Modal = Laba Bersih - Prive = Rp42.000.000 - Rp4.000.000 = Rp38.000.000. Modal Akhir = Rp60.000.000 + Rp38.000.000 = Rp98.000.000.`,
          rationale: `Mengukur keterampilan kinerja akuntansi siswa dalam menyusun siklus laporan keuangan jasa secara runtut dan presisi.`,
          topic,
          learningObjective,
        });
      } else if (qType === 'respons_tepat') {
        result.push({
          id: `q-${qType}-${i}-${Date.now().toString(36)}`,
          type: qType,
          difficulty: diff,
          thinkingCategory: think,
          learningExperience: exp,
          cognitiveLevel: 'C5',
          stimulus: `Sebuah startup teknologi logistik menghadapi lonjakan biaya bahan bakar operasional sebesar 30% dan penurunan margin keuntungan bersih menjadi minus 5%. Dewan komisaris menuntut agar perusahaan mencapai status operasional profitabel (break-even) dalam jangka waktu 6 bulan tanpa merusak reputasi layanan kepada konsumen.`,
          questionText: `Tentukan respons manajerial yang PALING TEPAT (Prioritas 1) dan yang PALING TIDAK TEPAT untuk diputuskan oleh Chief Executive Officer (CEO)!`,
          options: [
            'Paling Tepat: Optimasi rute pengiriman berbasis algoritma AI dan penghematan biaya non-esensial; Paling Tidak Tepat: Mengurangi standar keamanan armada pengiriman secara drastis.',
            'Paling Tepat: Menggandakan tarif pengiriman ke konsumen seketika; Paling Tidak Tepat: Bernegosiasi kontrak jangka panjang dengan pemasok bahan bakar.',
            'Paling Tepat: Menjual seluruh aset armada dan beralih ke outsourcing seratus persen tanpa mitigasi; Paling Tidak Tepat: Memberikan bonus performa kepada tim pemasaran.',
            'Paling Tepat: Menutup operasional di seluruh kota sekunder; Paling Tidak Tepat: Menjaga efisiensi bahan bakar melalui pelatihan pengemudi.'
          ],
          correctOptionIndex: 0,
          rationale: `Pilihan 0 secara logis menyeimbangkan efisiensi biaya internal jangka pendek tanpa mengorbankan keselamatan keselamatan kerja maupun loyalitas pelanggan.`,
          topic,
          learningObjective,
        });
      } else if (qType === 'sjt') {
        result.push({
          id: `q-${qType}-${i}-${Date.now().toString(36)}`,
          type: qType,
          difficulty: diff,
          thinkingCategory: think,
          learningExperience: exp,
          cognitiveLevel: 'C5',
          stimulus: `[SITUATIONAL JUDGEMENT TEST - SJT]:\nAnda diangkat sebagai Bendahara dalam kegiatan Pekan Kewirausahaan Siswa SMA. Tiga hari menjelang acara pembukaan, seorang koordinator seksi konsumsi meminta pencairan dana darurat sebesar Rp3.000.000 tanpa disertai nota rencana anggaran belanja (RAB) resmi, dengan alasan harga bahan pokok di pasar tradisional terus berfluktuasi cepat dan pedagang menolak pembayaran tempo.`,
          questionText: `Bagaimanakah tindakan terbaik Anda sebagai bendahara yang memegang prinsip integritas, akuntabilitas keuangan, dan kelancaran kegiatan organisasi sekolah?`,
          options: [
            'Mendampingi langsung koordinator konsumsi melakukan survei belanja ke pasar untuk mencatat pengeluaran riil bersama-sama dan mengeluarkan nota sementara yang ditandatangani Ketua Panitia.',
            'Langsung mencairkan seluruh uang kas tanpa tanda terima agar persiapan konsumsi tidak terlambat dan acara tidak gagal.',
            'Menolak mentah-mentah permintaan tersebut secara sepihak di depan anggota panitia lain tanpa memberikan alternatif solusi pemecahan masalah.',
            'Memberikan pinjaman dari uang saku pribadi Anda sendiri tanpa melibatkan pembukuan bendahara panitia.',
            'Menunda seluruh kegiatan pekan kewirausahaan sampai panitia lain mengumpulkan dana sponsor tambahan.'
          ],
          correctOptionIndex: 0,
          rationale: `Tindakan mendampingi dan membuat nota verifikasi sementara mencerminkan kompetensi pengambilan keputusan etis, akuntabilitas audit keuangan, dan kepemimpinan adaptif dalam situasi darurat.`,
          topic,
          learningObjective,
        });
      }
    }
  }

  return result;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ready',
      endpoint: '/api/generate-questions',
      service: 'Pusmendik TKA Ekonomi SMA Generator API (Vercel Serverless Function)',
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  let config: GenerationConfig = req.body;
  if (typeof config === 'string') {
    try {
      config = JSON.parse(config);
    } catch {
      return res.status(400).json({ error: 'Payload tidak valid: body bukan JSON yang sah.' });
    }
  }

  if (!config || !config.selectedQuestionTypes || config.selectedQuestionTypes.length === 0) {
    return res.status(400).json({ error: 'Konfigurasi tidak lengkap: Pilih minimal satu bentuk soal.' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (geminiApiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey: geminiApiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `
Anda adalah Pakar Asesmen Pendidikan Nasional Pusmendik Kemdikbud dan Guru Ahli Mata Pelajaran Ekonomi Jenjang SMA.
Tugas Anda adalah memproduksi butir-butir soal ujian standar asesmen nasional (TKA / ANBK Pusmendik Kemdikbud) berkualitas tinggi.

PARAMETER SOAL:
- Jenjang: SMA (${config.grade || 'Kelas 11'})
- Mata Pelajaran: Ekonomi SMA
- Topik / Materi: "${config.topic || 'Ekonomi Makro & Mikro, Kebijakan Fiskal/Moneter, Pelaku Ekonomi'}"
- Tujuan Pembelajaran: "${config.learningObjective || 'Peserta didik mampu mengevaluasi dan merumuskan solusi atas masalah ekonomi riil'}"
- Bentuk Soal yang Diminta: ${config.selectedQuestionTypes.join(', ')}
- Jumlah Soal per Bentuk: ${JSON.stringify(config.questionCounts || {})}
- Kategori Berpikir yang Diinginkan: ${(config.selectedThinkingCategories || ['HOTS']).join(', ')}
- Tingkat Kesulitan yang Diinginkan: ${(config.selectedDifficulties || ['Sedang', 'Sulit']).join(', ')}
- Pengalaman Belajar yang Diinginkan: ${(config.selectedLearningExperiences || ['Merefleksi']).join(', ')}
- Level Kognitif yang Diinginkan: ${(config.selectedCognitiveLevels || ['C4', 'C5', 'C6']).join(', ')}
- Instruksi Khusus: Berfokus pada evaluasi (C5), penciptaan (C6), dan pemecahan masalah kompleks ekonomi riil Indonesia (data BPS, Bank Indonesia, APBN Kemkeu, OJK, pasar modal, ekspor-impor, UMKM). Soal harus memiliki stimulus (bacaan kontekstual, tabel angka, atau studi kasus) yang autentik dan kaya wawasan.

Instruksi Tambahan Pengguna: ${config.customAiInstructions || 'Fokus pada HOTS C4-C6 dan studi kasus ekonomi riil.'}

Hasilkan JSON ARRAY yang berisi objek butir soal dengan format:
[
  {
    "id": "q-1",
    "type": "pilihan_ganda | pilihan_ganda_kompleks | isian_singkat | uraian_esai | menjodohkan | benar_salah | berbasis_konteks | studi_kasus | praktik_kinerja | respons_tepat | sjt",
    "difficulty": "Rendah | Sedang | Sulit",
    "thinkingCategory": "LOTS | MOTS | HOTS",
    "learningExperience": "Memahami | Mengaplikasi | Merefleksi",
    "cognitiveLevel": "C1 | C2 | C3 | C4 | C5 | C6",
    "stimulus": "Teks pengantar kontekstual, data angka, atau studi kasus",
    "questionText": "Teks pertanyaan jelas dan lugas",
    "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D", "Opsi E"],
    "correctOptionIndex": 0,
    "correctOptionsMulti": [0, 2],
    "shortAnswerKey": "kata kunci / nominal",
    "matchingPairs": [{"premise": "Pernyataan Kiri", "response": "Pasangan Kanan"}],
    "statements": [{"statement": "Pernyataan 1", "isCorrect": true, "explanation": "Alasan"}],
    "essayRubric": "Pedoman penskoran atau rubrik uraian",
    "rationale": "Pembahasan ilmiah dan konsep ekonomi komprehensif",
    "topic": "${config.topic || 'Ekonomi SMA'}",
    "learningObjective": "${config.learningObjective || 'Tujuan Pembelajaran'}"
  }
]
`;

      const geminiResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Anda adalah pembuat soal ahli berstandar Pusmendik Kemdikbud RI. Output HANYA boleh berupa valid JSON array.',
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = geminiResponse.text?.trim() || '';
      let parsedQuestions: QuestionItem[] = [];
      try {
        parsedQuestions = JSON.parse(responseText);
      } catch {
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedQuestions = JSON.parse(jsonMatch[0]);
        }
      }

      if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
        const formatted = parsedQuestions.map((q, idx) => ({
          ...q,
          id: q.id || `gen-${Date.now().toString(36)}-${idx}`,
          topic: q.topic || config.topic,
          learningObjective: q.learningObjective || config.learningObjective,
        }));
        return res.status(200).json({ success: true, questions: formatted, source: 'gemini-3.8-flash' });
      }
    } catch (err: unknown) {
      console.warn('Gemini API call on Vercel returned error or invalid JSON, using curated fallback bank:', err);
    }
  }

  // Fallback generation (when API key is not configured or in case of transient quota)
  const fallbackQuestions = generateFallbackBank(config);
  return res.status(200).json({
    success: true,
    questions: fallbackQuestions,
    source: 'bank-kurikulum-pusmendik-fallback',
    message: geminiApiKey
      ? 'Menggunakan bank kurikulum terkurasi berstandar Pusmendik.'
      : 'GEMINI_API_KEY belum disetel di Environment Variables Vercel. Menggunakan bank kurikulum terkurasi Pusmendik bawaan.',
  });
}
