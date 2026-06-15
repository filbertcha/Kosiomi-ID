# 📊 Kosiomi-ID
**Kosiomi-ID** adalah platform visualisasi data sosio-ekonomi Indonesia yang mentransformasi kumpulan data dari **38 provinsi di Indonesia** selama periode **2016–2025** menjadi antarmuka yang interaktif, intuitif, dan real-time. Data yang digunakan berasal dari website resmi BPS.

---

## ✨ Fitur Utama

### 📈 KPI Dashboard
Menampilkan ringkasan indikator tahun **2025** dan perbandingannya terhadap tahun **2024**, sehingga pengguna dapat melihat perubahan terbaru secara cepat.

**Indikator yang tersedia:**
- Gini Ratio (Ketimpangan Pendapatan)
- Tingkat Pengangguran Terbuka (TPT)
- Indeks Kedalaman Kemiskinan (P1)

<p align="center">
  <img src="screenshots/kpi-dashboard.png" width="800">
</p>

---

### 📉 Tren Nasional
Visualisasi tren nasional Indonesia menggunakan **Line Chart** dengan filter indikator sehingga pengguna dapat beralih antara:

- Gini Ratio
- Tingkat Pengangguran Terbuka (TPT)
- Indeks Kedalaman Kemiskinan (P1)

<p align="center">
  <img src="screenshots/national-trend.png" width="800">
</p>

---

### 🗺️ Tren Antar Provinsi
Menyediakan visualisasi perkembangan indikator setiap provinsi dalam rentang waktu 2016–2025.

Fitur yang tersedia:
- Pemilihan provinsi
- Pemilihan indikator
- Visualisasi menggunakan line chart

<p align="center">
  <img src="screenshots/province-trend.png" width="800">
</p>

---

### 🔗 Analisis Korelasi Antar Indikator
Membandingkan hubungan antara dua indikator menggunakan **Scatter Plot**.

Fitur yang tersedia:
- Pemilihan indikator pada sumbu X
- Pemilihan indikator pada sumbu Y
- Filter tahun

Visualisasi ini membantu mengidentifikasi pola dan hubungan antar indikator sosial-ekonomi.

<p align="center">
  <img src="screenshots/correlation-analysis.png" width="800">
</p>

---

### 🏆 Top 5 Provinsi
Menampilkan peringkat **5 provinsi terbaik/tertinggi** untuk setiap indikator berdasarkan tahun yang dipilih.

Fitur:
- Filter tahun

<p align="center">
  <img src="screenshots/top5-ranking.png" width="800">
</p>

---

## 📊 Dataset

Kosiomi-ID menggunakan data sosio-ekonomi dari **38 provinsi di Indonesia** pada periode **2016–2025** dengan atribut:

| Indikator | Deskripsi |
|------------|-----------|
| **Gini Ratio** | Mengukur tingkat ketimpangan distribusi pendapatan |
| **Tingkat Pengangguran Terbuka (TPT)** | Persentase angkatan kerja yang belum bekerja |
| **Indeks Kedalaman Kemiskinan (P1)** | Mengukur rata-rata jarak pengeluaran penduduk miskin terhadap garis kemiskinan |

Sumber dataset:
1. Gini Ratio (Ketimpangan Pendapatan): https://www.bps.go.id/id/statistics-table/2/OTgjMg==/gini-ratio-menurut-provinsi-dan-daerah.html
2. Tingkat Pengangguran Terbuka (TPT): https://www.bps.go.id/id/statistics-table/2/NTQzIzI=/tingkat-pengangguran-terbuka--agustus-2023.html
3.  Indeks Kedalaman Kemiskinan (P1): https://www.bps.go.id/id/statistics-table/2/NTAzIzI=/indeks-kedalaman-kemiskinan-p1-menurut-provinsi-dan-daerah.html

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- HTML5
- CSS3
- JavaScript
- Chart.js

### Backend
- Flask (Python)

---
