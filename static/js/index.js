// Data

let allData = [],
  indonesiaData = [],
  provincesData = [];
let selectedProvinces = [
  "JAWA TIMUR",
  "JAWA BARAT",
  "PAPUA",
  "DKI JAKARTA",
  "SUMATERA UTARA",
];
let currentIndIndonesia = "gini";
let currentIndProvince = "gini";
let currentRankYear = 2025;
let chartIndonesia = null,
  chartProvince = null,
  chartScatter = null;

const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const PROVINCE_COLORS = [
  "#e46d18",
  "#35b6ed",
  "#9379e2",
  "#44daa3",
  "#f06a7e",
  "#f5bb28",
  "#7e89ec",
  "#36dcc6",
  "#ed6fb0",
  "#86efac",
  "#67e8f9",
  "#c084fc",
  "#fdba74",
  "#7dd3fc",
  "#d8b4fe",
  "#6ee7b7",
  "#fca5a5",
  "#fcd34d",
  "#a5b4fc",
  "#5eead4",
  "#f9a8d4",
  "#bbf7d0",
  "#bfdbfe",
  "#e9d5ff",
  "#f2cca1",
  "#bae6fd",
  "#ddd6fe",
  "#a7f3d0",
  "#fecaca",
  "#fef08a",
  "#c7d2fe",
  "#99f6e4",
  "#fbcfe8",
  "#d1fae5",
  "#dbeafe",
  "#e5e1f8",
  "#ffedd5",
  "#e0f2fe",
  "#f3e8ff",
];

const IND_LABELS = {
  gini: "Gini Ratio",
  pengangguran: "Tingkat Pengangguran (%)",
  kemiskinan: "Indeks Kedalaman Kemiskinan",
};
const IND_COLORS = {
  gini: "#f46e0f",
  pengangguran: "#22abe6",
  kemiskinan: "#e7697c",
};

// Init

async function init() {
  const res = await fetch("/api/data");
  allData = await res.json();
  indonesiaData = allData
    .filter((d) => d.provinsi === "INDONESIA")
    .sort((a, b) => a.tahun - b.tahun);
  provincesData = allData.filter((d) => d.provinsi !== "INDONESIA");

  fillKPIs();
  buildProvinceChips();
  buildYearButtons();
  buildScatterYears();
  renderIndonesiaChart();
  renderProvinceChart();
  renderScatter();
  renderRanking(2025);
}

// KPIs: Key Performance Indicators

function fillKPIs() {
  const d2025 = indonesiaData.find((d) => d.tahun === 2025);
  const d2024 = indonesiaData.find((d) => d.tahun === 2024);
  if (!d2025) return;

  // ?. digunakan untuk menghindari error jika nilai sebelumnya null atau undefined.
  // toFixed() digunakan untuk membatasi jumlah angka di belakang desimal.
  // ?? menggunakan nilai sebelah kanan jika nilai sebelah kiri null atau undefined
  document.getElementById("kpi-gini").textContent =
    d2025.gini?.toFixed(3) ?? "—";
  document.getElementById("kpi-tpe").textContent =
    (d2025.pengangguran?.toFixed(2) ?? "—") + "%";
  document.getElementById("kpi-miskin").textContent =
    (d2025.kemiskinan?.toFixed(2) ?? "—") + "%";

  function trendElement(id, v25, v24) {
    if (!v25 || !v24) return;
    const el = document.getElementById(id);
    const diff = v25 - v24;
    const sign = diff > 0 ? "▲" : "▼";
    el.className = "kpi-trend " + (diff > 0 ? "up" : "down");
    el.textContent = `${sign} ${Math.abs(diff).toFixed(3)} vs 2024`;
  }
  trendElement("kpi-gini-trend", d2025.gini, d2024?.gini);
  trendElement("kpi-tpe-trend", d2025.pengangguran, d2024?.pengangguran);
  trendElement("kpi-miskin-trend", d2025.kemiskinan, d2024?.kemiskinan);
}

// Chart 1 – Indonesia Trend

function renderIndonesiaChart() {
  const ind = currentIndIndonesia;
  const vals = indonesiaData.map((d) => d[ind]);
  const labels = indonesiaData.map((d) => d.tahun);
  const color = IND_COLORS[ind];

  if (chartIndonesia) chartIndonesia.destroy();

  const ctx = document.getElementById("chart-indonesia").getContext("2d");
  const grad = ctx.createLinearGradient(0, 0, 0, 300);
  grad.addColorStop(0, color + "44");
  grad.addColorStop(1, color + "00");

  chartIndonesia = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: IND_LABELS[ind],
          data: vals,
          borderColor: color,
          backgroundColor: grad,
          borderWidth: 2.5,
          pointRadius: 5,
          pointBackgroundColor: color,
          pointBorderColor: "#0b0f19",
          pointBorderWidth: 2,
          fill: true,
          tension: 0.35,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1a2236",
          borderColor: "#1f2d44",
          borderWidth: 1,
          titleColor: "#94a3b8",
          bodyColor: "#e2e8f0",
          titleFont: { family: "DM Mono", size: 11 },
          bodyFont: { family: "DM Mono", size: 12 },
        },
      },
      scales: {
        x: {
          grid: { color: "#1f2d4455" },
          ticks: {
            color: "#64748b",
            font: { family: "DM Mono", size: 11 },
          },
        },
        y: {
          grid: { color: "#1f2d4455" },
          ticks: {
            color: "#64748b",
            font: { family: "DM Mono", size: 11 },
          },
        },
      },
      animation: { duration: 600, easing: "easeOutQuart" },
    },
  });

  // Insight
  const valid = vals.filter((v) => v != null);
  const first = valid[0],
    last = valid[valid.length - 1];
  const delta = last - first;
  const pct = ((delta / first) * 100).toFixed(1);
  const trend =
    delta > 0 ? "📈 <strong>Uptrend</strong>" : "📉 <strong>Downtrend</strong>";
  const dir = delta > 0 ? "naik" : "turun";
  const minVal = Math.min(...valid).toFixed(3);
  const maxVal = Math.max(...valid).toFixed(3);
  document.getElementById("insight-indonesia-text").innerHTML =
    `${trend} · ${IND_LABELS[ind]} Indonesia <strong>${dir}</strong> sebesar <strong>${Math.abs(pct)}%</strong> dari <strong>${first?.toFixed(3)}</strong> (2016) ke <strong>${last?.toFixed(3)}</strong> (2025). Nilai terendah <strong>${minVal}</strong>, tertinggi <strong>${maxVal}</strong>.`;
}

function switchIndonesia(ind, btn) {
  currentIndIndonesia = ind;
  document.querySelectorAll("#toggle-indonesia .toggle-btn").forEach((b) => {
    b.classList.remove(
      "active",
      "active-gini",
      "active-pengangguran",
      "active-kemiskinan",
    );
  });
  btn.classList.add("active", "active-" + ind);
  renderIndonesiaChart();
}

// Chart 2 - Province

function buildProvinceChips() {
  // Operator ... digunakan untuk mengubah iterable (seperti Set) menjadi array.
  // Set adalah struktur data JavaScript yang hanya menyimpan nilai unik.
  // map() adalah fungsi array yang mengubah setiap elemen menjadi nilai baru.
  const provList = [...new Set(provincesData.map((d) => d.provinsi))].sort();
  const container = document.getElementById("province-chips");
  container.innerHTML = "";
  provList.forEach((p) => {
    const btn = document.createElement("button");
    btn.className =
      "province-chip" + (selectedProvinces.includes(p) ? " selected" : "");
    btn.textContent = p.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
    btn.dataset.prov = p;
    btn.onclick = () => toggleProvince(p, btn);
    container.appendChild(btn);
  });
}

function toggleProvince(prov, btn) {
  if (selectedProvinces.includes(prov)) {
    if (selectedProvinces.length <= 1) return;
    selectedProvinces = selectedProvinces.filter((p) => p !== prov);
    btn.classList.remove("selected");
  } else {
    if (selectedProvinces.length >= 8) return;
    selectedProvinces.push(prov);
    btn.classList.add("selected");
  }
  renderProvinceChart();
}

function renderProvinceChart() {
  const ind = currentIndProvince;
  const color = IND_COLORS[ind];

  const datasets = selectedProvinces.map((prov, i) => {
    const provData = provincesData
      .filter((d) => d.provinsi === prov)
      .sort((a, b) => a.tahun - b.tahun);
    return {
      label: prov.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
      data: YEARS.map((y) => {
        const d = provData.find((d) => d.tahun === y);
        return d ? d[ind] : null;
      }),
      borderColor: PROVINCE_COLORS[i % PROVINCE_COLORS.length],
      backgroundColor: "transparent",
      borderWidth: 2,
      pointRadius: 3.5,
      pointBackgroundColor: PROVINCE_COLORS[i % PROVINCE_COLORS.length],
      pointBorderColor: "#0b0f19",
      pointBorderWidth: 1.5,
      tension: 0.3,
      spanGaps: true,
    };
  });

  // Average line
  const avgData = YEARS.map((y) => {
    const vals = provincesData
      .filter((d) => d.tahun === y && d[ind] != null)
      .map((d) => d[ind]);
    return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
  });
  datasets.push({
    label: "Rata-rata Nasional",
    data: avgData,
    borderColor: "#ffffff33",
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderDash: [6, 3],
    pointRadius: 0,
    tension: 0.3,
    spanGaps: true,
  });

  if (chartProvince) chartProvince.destroy();
  const ctx = document.getElementById("chart-province").getContext("2d");
  chartProvince = new Chart(ctx, {
    type: "line",
    data: { labels: YEARS, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#94a3b8",
            font: { family: "DM Mono", size: 10 },
            boxWidth: 16,
            padding: 12,
          },
        },
        tooltip: {
          backgroundColor: "#1a2236",
          borderColor: "#1f2d44",
          borderWidth: 1,
          titleColor: "#94a3b8",
          bodyColor: "#e2e8f0",
          titleFont: { family: "DM Mono", size: 11 },
          bodyFont: { family: "DM Mono", size: 12 },
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        x: {
          grid: { color: "#1f2d4422" },
          ticks: {
            color: "#64748b",
            font: { family: "DM Mono", size: 11 },
          },
        },
        y: {
          grid: { color: "#1f2d4422" },
          ticks: {
            color: "#64748b",
            font: { family: "DM Mono", size: 11 },
          },
        },
      },
      animation: { duration: 500 },
    },
  });

  // INSIGHT berbasis average
  const latestAvg = avgData[avgData.length - 1];
  const aboveAvg = [],
    belowAvg = [];
  selectedProvinces.forEach((prov) => {
    const provData = provincesData.filter(
      (d) => d.provinsi === prov && d[ind] != null,
    );
    if (!provData.length) return;
    const provAvg = provData.reduce((s, d) => s + d[ind], 0) / provData.length;
    if (provAvg > latestAvg)
      aboveAvg.push(
        prov.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
      );
    else
      belowAvg.push(
        prov.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
      );
  });

  let ins = `Rata-rata nasional <strong>${IND_LABELS[ind]}</strong> 2025: <strong>${latestAvg?.toFixed(3) ?? "—"}</strong>. `;
  if (aboveAvg.length)
    ins += `<strong>Di atas rata-rata:</strong> ${aboveAvg.join(", ")}. `;
  if (belowAvg.length)
    ins += `<strong>Di bawah rata-rata:</strong> ${belowAvg.join(", ")}.`;
  document.getElementById("insight-province-text").innerHTML = ins;
}

function switchProvince(ind, btn) {
  currentIndProvince = ind;
  document.querySelectorAll("#toggle-provinsi .toggle-btn").forEach((b) => {
    b.classList.remove(
      "active",
      "active-gini",
      "active-pengangguran",
      "active-kemiskinan",
    );
  });
  btn.classList.add("active", "active-" + ind);
  renderProvinceChart();
}

// Chart 3 - Scatter

function buildScatterYears() {
  const sel = document.getElementById("scatter-year");
  YEARS.forEach((y) => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    sel.appendChild(opt);
  });
}

function updateScatter() {
  const xInd = document.getElementById("scatter-x").value;
  const yInd = document.getElementById("scatter-y").value;
  const year = document.getElementById("scatter-year").value;

  let data = provincesData;
  if (year !== "all") data = data.filter((d) => d.tahun === parseInt(year));
  data = data.filter((d) => d[xInd] != null && d[yInd] != null);

  const provList = [...new Set(data.map((d) => d.provinsi))].sort();
  const datasets = provList.map((prov, i) => {
    const pts = data
      .filter((d) => d.provinsi === prov)
      .map((d) => ({ x: d[xInd], y: d[yInd], tahun: d.tahun }));
    return {
      label: prov.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
      data: pts,
      backgroundColor: PROVINCE_COLORS[i % PROVINCE_COLORS.length] + "cc",
      borderColor: PROVINCE_COLORS[i % PROVINCE_COLORS.length],
      borderWidth: 1,
      pointRadius: 6,
      pointHoverRadius: 9,
    };
  });

  if (chartScatter) chartScatter.destroy();
  const ctx = document.getElementById("chart-scatter").getContext("2d");
  chartScatter = new Chart(ctx, {
    type: "scatter",
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#94a3b8",
            font: { family: "DM Mono", size: 9 },
            boxWidth: 10,
            padding: 8,
          },
        },
        tooltip: {
          backgroundColor: "#1a2236",
          borderColor: "#1f2d44",
          borderWidth: 1,
          titleColor: "#94a3b8",
          bodyColor: "#e2e8f0",
          titleFont: { family: "DM Mono", size: 11 },
          bodyFont: { family: "DM Mono", size: 12 },
          callbacks: {
            label: (ctx) => {
              const d = ctx.raw;
              return `${ctx.dataset.label} (${d.tahun || ""}): X=${d.x?.toFixed(3)}, Y=${d.y?.toFixed(3)}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: IND_LABELS[xInd],
            color: "#64748b",
            font: { family: "DM Mono", size: 11 },
          },
          grid: { color: "#1f2d4422" },
          ticks: {
            color: "#64748b",
            font: { family: "DM Mono", size: 11 },
          },
        },
        y: {
          title: {
            display: true,
            text: IND_LABELS[yInd],
            color: "#64748b",
            font: { family: "DM Mono", size: 11 },
          },
          grid: { color: "#1f2d4422" },
          ticks: {
            color: "#64748b",
            font: { family: "DM Mono", size: 11 },
          },
        },
      },
      animation: { duration: 400 },
    },
  });

  // Insight: correlation direction
  let xVals = data.map((d) => d[xInd]),
    yVals = data.map((d) => d[yInd]);
  const n = xVals.length;
  if (n > 1) {
    const mx = xVals.reduce((a, b) => a + b) / n,
      my = yVals.reduce((a, b) => a + b) / n;
    const cov =
      xVals.reduce((s, x, i) => s + (x - mx) * (yVals[i] - my), 0) / n;
    const sx = Math.sqrt(xVals.reduce((s, x) => s + (x - mx) ** 2, 0) / n);
    const sy = Math.sqrt(yVals.reduce((s, y) => s + (y - my) ** 2, 0) / n);
    const r = sx * sy ? (cov / (sx * sy)).toFixed(3) : 0;
    const dir = r > 0 ? "korelasi positif" : "korelasi negatif";
    document.getElementById("insight-scatter").innerHTML =
      `Koefisien korelasi Pearson antara <strong>${IND_LABELS[xInd]}</strong> dan <strong>${IND_LABELS[yInd]}</strong>: <strong>r = ${r}</strong> (<strong>${dir}</strong>). ${n} titik data ${year === "all" ? "seluruh tahun" : "tahun " + year}.`;
  }
}

function renderScatter() {
  updateScatter();
}

// Section 4 - Ranking

function buildYearButtons() {
  const container = document.getElementById("year-btns");
  YEARS.forEach((y) => {
    const btn = document.createElement("button");
    btn.className = "year-btn" + (y === 2025 ? " active" : "");
    btn.textContent = y;
    btn.onclick = () => {
      document
        .querySelectorAll(".year-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentRankYear = y;
      renderRanking(y);
    };
    container.appendChild(btn);
  });
}

async function renderRanking(year) {
  const res = await fetch(`/api/ranking/${year}`);
  const data = await res.json();
  renderRankList("rank-gini", data.gini, "gini", "gini");
  renderRankList(
    "rank-pengangguran",
    data.pengangguran,
    "pengangguran",
    "pengangguran",
  );
  renderRankList(
    "rank-kemiskinan",
    data.kemiskinan,
    "kemiskinan",
    "kemiskinan",
  );
}

function renderRankList(containerId, items, indKey, barClass) {
  const container = document.getElementById(containerId);
  if (!items || !items.length) {
    container.innerHTML =
      '<div style="color:var(--text-dim);font-size:11px;padding:8px">Data tidak tersedia</div>';
    return;
  }
  const maxVal = items[0][indKey];
  const units = { gini: "", pengangguran: "", kemiskinan: "" };
  container.innerHTML = items
    .map((item, i) => {
      const pct = ((item[indKey] / maxVal) * 100).toFixed(1);
      const name = item.provinsi
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return `
      <div class="rank-item">
        <div class="rank-num">${i + 1}</div>
        <div class="rank-prov">${name}<span>Tahun ${item.tahun}</span></div>
        <div class="rank-bar-wrap">
          <div class="rank-bar ${barClass}" style="width:${pct}%"></div>
          <div class="rank-val">${item[indKey]?.toFixed(3)}${units[indKey]}</div>
        </div>
      </div>`;
    })
    .join("");
}

// UTILS

function scrollToSection(id) {
  document
    .getElementById(id)
    .scrollIntoView({ behavior: "smooth", block: "start" });
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
  event.target.classList.add("active");
}

// Chart.js defaults
Chart.defaults.color = "#64748b";
Chart.defaults.borderColor = "#1f2d44";
Chart.defaults.font.family = "DM Mono";

// START
init();
