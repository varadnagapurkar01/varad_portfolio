/* ============================================
   ADMIN ANALYTICS MODULE
   Only activates when visitor name = "varad0036c"
   ============================================ */

(function () {
  'use strict';

  const ADMIN_NAME = 'varad0036c';
  const API = 'http://localhost:3000/api';
  const REFRESH_MS = 6000; // auto-refresh every 6 seconds

  let refreshTimer = null;
  let barChart = null, pieChart = null, lineChart = null;
  let isOpen = false;

  /* ─── Chart.js CDN Loader ─── */
  function loadChartJS(cb) {
    if (window.Chart) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  /* ─── Page name beautifier ─── */
  const PAGE_LABELS = {
    home: '🏠 Home',
    cricket: '🏏 Cricket',
    devops: '⚙️ DevOps',
    certifications: '🏅 Certifications',
    certification: '🏅 Certifications',
    projects: '🚀 Projects',
    documents: '📄 Documents',
    personality: '🧠 Personality',
    introduction: '👤 Introduction',
  };

  function label(raw) {
    if (!raw) return 'Unknown';
    const k = raw.toLowerCase().replace('.html', '');
    return PAGE_LABELS[k] || (k.charAt(0).toUpperCase() + k.slice(1));
  }

  /* ─── Build the full panel DOM ─── */
  function buildPanel() {
    if (document.getElementById('adminAnalyticsPanel')) return;

    const panel = document.createElement('div');
    panel.id = 'adminAnalyticsPanel';
    panel.innerHTML = `
      <div class="aap-backdrop" id="aapBackdrop"></div>
      <div class="aap-drawer" id="aapDrawer">
        <div class="aap-header">
          <div class="aap-title">
            <span class="aap-icon">📊</span>
            <span>Visitor Analytics</span>
            <span class="aap-live-badge">● LIVE</span>
          </div>
          <button class="aap-close" id="aapClose" title="Close">✕</button>
        </div>

        <div class="aap-scroll">

          <!-- Summary Cards -->
          <div class="aap-cards" id="aapCards">
            <div class="aap-card aap-card--blue">
              <div class="aap-card-icon">👁️</div>
              <div class="aap-card-value" id="aapTotalVisits">—</div>
              <div class="aap-card-label">Total Visits</div>
            </div>
            <div class="aap-card aap-card--purple">
              <div class="aap-card-icon">👤</div>
              <div class="aap-card-value" id="aapUniqueVisitors">—</div>
              <div class="aap-card-label">Unique Visitors</div>
            </div>
            <div class="aap-card aap-card--green">
              <div class="aap-card-icon">👥</div>
              <div class="aap-card-value" id="aapTotalUsers">—</div>
              <div class="aap-card-label">Registered Users</div>
            </div>
            <div class="aap-card aap-card--orange">
              <div class="aap-card-icon">📅</div>
              <div class="aap-card-value" id="aapToday">—</div>
              <div class="aap-card-label">Today</div>
            </div>
            <div class="aap-card aap-card--teal">
              <div class="aap-card-icon">📆</div>
              <div class="aap-card-value" id="aapWeek">—</div>
              <div class="aap-card-label">This Week</div>
            </div>
            <div class="aap-card aap-card--rose">
              <div class="aap-card-icon">🗓️</div>
              <div class="aap-card-value" id="aapMonth">—</div>
              <div class="aap-card-label">This Month</div>
            </div>
          </div>

          <!-- Highlight Row -->
          <div class="aap-highlights" id="aapHighlights">
            <div class="aap-hl aap-hl--hot">
              <div class="aap-hl-emoji">🔥</div>
              <div>
                <div class="aap-hl-title">Most Visited</div>
                <div class="aap-hl-value" id="aapMost">—</div>
              </div>
            </div>
            <div class="aap-hl aap-hl--cold">
              <div class="aap-hl-emoji">🧊</div>
              <div>
                <div class="aap-hl-title">Least Visited</div>
                <div class="aap-hl-value" id="aapLeast">—</div>
              </div>
            </div>
          </div>

          <!-- Charts Row 1: Bar + Pie -->
          <div class="aap-chart-row">
            <div class="aap-chart-box">
              <div class="aap-chart-title">Visits per Page</div>
              <canvas id="aapBarChart" height="200"></canvas>
            </div>
            <div class="aap-chart-box">
              <div class="aap-chart-title">Traffic Distribution</div>
              <canvas id="aapPieChart" height="200"></canvas>
            </div>
          </div>

          <!-- Chart Row 2: Line -->
          <div class="aap-chart-box aap-chart-box--full">
            <div class="aap-chart-title">Daily Traffic — Last 30 Days</div>
            <canvas id="aapLineChart" height="130"></canvas>
          </div>

          <!-- Top Pages Table -->
          <div class="aap-table-box">
            <div class="aap-chart-title">Top Pages</div>
            <table class="aap-table">
              <thead>
                <tr><th>Rank</th><th>Page</th><th>Visits</th><th>Share</th></tr>
              </thead>
              <tbody id="aapTopPages"></tbody>
            </table>
          </div>

          <!-- Recent Visitors -->
          <div class="aap-table-box">
            <div class="aap-chart-title">Recent Visitors</div>
            <table class="aap-table">
              <thead>
                <tr><th>#</th><th>Name</th><th>Date</th><th>Browser</th></tr>
              </thead>
              <tbody id="aapRecentVisitors"></tbody>
            </table>
          </div>

          <div class="aap-footer-note" id="aapRefreshNote">Auto-refreshing every 6s…</div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    document.getElementById('aapClose').addEventListener('click', closePanel);
    document.getElementById('aapBackdrop').addEventListener('click', closePanel);
  }

  /* ─── Inject CSS ─── */
  function injectStyles() {
    if (document.getElementById('aapStyles')) return;
    const style = document.createElement('style');
    style.id = 'aapStyles';
    style.textContent = `
      /* ── Visitors Nav Link ── */
      #adminNavLink {
        display: none;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #fff !important;
        padding: 6px 16px !important;
        border-radius: 20px;
        font-weight: 700;
        letter-spacing: 0.5px;
        animation: aap-pulse 2s ease-in-out infinite;
        cursor: pointer;
        border: none;
        font-size: inherit;
        font-family: inherit;
      }
      #adminNavLink:hover { opacity: 0.9; transform: translateY(-2px); }

      /* ── Visitors Mobile Nav Link ── */
      #adminMobileNavLink {
        display: none;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #fff !important;
        padding: 10px 20px !important;
        border-radius: 20px;
        font-weight: 700;
        margin-top: 8px;
        cursor: pointer;
        border: none;
        font-size: inherit;
        font-family: inherit;
        text-align: center;
      }

      @keyframes aap-pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
        50% { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
      }

      /* ── Panel ── */
      #adminAnalyticsPanel {
        position: fixed;
        inset: 0;
        z-index: 99999;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      #adminAnalyticsPanel.aap-visible {
        pointer-events: all;
        opacity: 1;
      }
      .aap-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.65);
        backdrop-filter: blur(4px);
      }
      .aap-drawer {
        position: absolute;
        top: 0; right: 0; bottom: 0;
        width: min(960px, 100vw);
        background: #0f0f1a;
        display: flex;
        flex-direction: column;
        transform: translateX(100%);
        transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
        box-shadow: -10px 0 60px rgba(0,0,0,0.5);
      }
      #adminAnalyticsPanel.aap-visible .aap-drawer {
        transform: translateX(0);
      }

      /* Header */
      .aap-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 28px;
        background: linear-gradient(90deg, #1a1a2e, #16213e);
        border-bottom: 1px solid rgba(99,102,241,0.3);
        flex-shrink: 0;
      }
      .aap-title {
        font-family: 'Montserrat', sans-serif;
        font-size: 1.4rem;
        font-weight: 700;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .aap-icon { font-size: 1.6rem; }
      .aap-live-badge {
        font-size: 0.7rem;
        color: #4ade80;
        background: rgba(74,222,128,0.15);
        padding: 3px 10px;
        border-radius: 20px;
        border: 1px solid rgba(74,222,128,0.3);
        animation: aap-blink 1.5s ease-in-out infinite;
      }
      @keyframes aap-blink {
        0%,100% { opacity: 1; } 50% { opacity: 0.4; }
      }
      .aap-close {
        background: rgba(255,255,255,0.1);
        border: none;
        color: #fff;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1rem;
        transition: background 0.2s;
        display: flex; align-items: center; justify-content: center;
      }
      .aap-close:hover { background: rgba(239,68,68,0.5); }

      /* Scroll area */
      .aap-scroll {
        overflow-y: auto;
        flex: 1;
        padding: 24px;
        scrollbar-width: thin;
        scrollbar-color: #6366f1 #1a1a2e;
      }

      /* Summary Cards */
      .aap-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 14px;
        margin-bottom: 20px;
      }
      .aap-card {
        border-radius: 14px;
        padding: 18px 14px;
        text-align: center;
        border: 1px solid rgba(255,255,255,0.08);
        transition: transform 0.2s;
      }
      .aap-card:hover { transform: translateY(-4px); }
      .aap-card--blue   { background: linear-gradient(135deg,#1e3a5f,#1e40af22); border-color:#3b82f660; }
      .aap-card--purple { background: linear-gradient(135deg,#2e1065,#7c3aed22); border-color:#8b5cf660; }
      .aap-card--green  { background: linear-gradient(135deg,#064e3b,#10b98122); border-color:#10b98160; }
      .aap-card--orange { background: linear-gradient(135deg,#451a03,#f59e0b22); border-color:#f59e0b60; }
      .aap-card--teal   { background: linear-gradient(135deg,#042f2e,#14b8a622); border-color:#14b8a660; }
      .aap-card--rose   { background: linear-gradient(135deg,#4c0519,#f4364522); border-color:#f4364560; }
      .aap-card-icon  { font-size: 1.5rem; margin-bottom: 6px; }
      .aap-card-value {
        font-family: 'Montserrat', sans-serif;
        font-size: 2rem;
        font-weight: 800;
        color: #fff;
        margin-bottom: 4px;
        transition: all 0.4s;
      }
      .aap-card-label { font-size: 0.72rem; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 1px; }

      /* Highlights */
      .aap-highlights {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
        margin-bottom: 20px;
      }
      .aap-hl {
        border-radius: 14px;
        padding: 16px 18px;
        display: flex;
        align-items: center;
        gap: 14px;
        border: 1px solid rgba(255,255,255,0.08);
      }
      .aap-hl--hot { background: linear-gradient(135deg,#431407,#ea580c22); border-color:#ea580c60; }
      .aap-hl--cold { background: linear-gradient(135deg,#0c1a2e,#0ea5e922); border-color:#0ea5e960; }
      .aap-hl-emoji { font-size: 2rem; }
      .aap-hl-title { font-size: 0.72rem; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
      .aap-hl-value { color: #fff; font-weight: 700; font-size: 1rem; }

      /* Chart boxes */
      .aap-chart-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 16px;
      }
      .aap-chart-box {
        background: #1a1a2e;
        border: 1px solid rgba(99,102,241,0.2);
        border-radius: 14px;
        padding: 18px;
        margin-bottom: 16px;
      }
      .aap-chart-box--full { width: 100%; }
      .aap-chart-title {
        font-family: 'Montserrat', sans-serif;
        font-size: 0.85rem;
        font-weight: 700;
        color: rgba(255,255,255,0.7);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 14px;
      }

      /* Table */
      .aap-table-box {
        background: #1a1a2e;
        border: 1px solid rgba(99,102,241,0.2);
        border-radius: 14px;
        padding: 18px;
        margin-bottom: 16px;
        overflow-x: auto;
      }
      .aap-table { width: 100%; border-collapse: collapse; }
      .aap-table th {
        color: rgba(255,255,255,0.45);
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        padding: 10px 12px;
        border-bottom: 1px solid rgba(255,255,255,0.07);
        text-align: left;
      }
      .aap-table td {
        color: rgba(255,255,255,0.85);
        padding: 10px 12px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        font-size: 0.88rem;
      }
      .aap-table tr:last-child td { border-bottom: none; }
      .aap-table tr:hover td { background: rgba(255,255,255,0.03); }

      .aap-rank { display: inline-flex; align-items: center; justify-content: center;
                  width: 26px; height: 26px; border-radius: 50%; font-weight: 700; font-size: 0.8rem; }
      .aap-rank-1 { background: #f59e0b; color: #000; }
      .aap-rank-2 { background: #9ca3af; color: #000; }
      .aap-rank-3 { background: #a16207; color: #fff; }
      .aap-rank-n { background: rgba(255,255,255,0.1); color: #fff; }

      .aap-share-bar { display: flex; align-items: center; gap: 8px; }
      .aap-share-track { width: 60px; height: 5px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
      .aap-share-fill { height: 100%; background: linear-gradient(90deg,#6366f1,#a855f7); border-radius: 3px; transition: width 0.8s; }

      .aap-footer-note {
        text-align: center;
        color: rgba(255,255,255,0.25);
        font-size: 0.75rem;
        padding: 12px 0 4px;
      }

      /* Responsive */
      @media (max-width: 640px) {
        .aap-chart-row { grid-template-columns: 1fr; }
        .aap-highlights { grid-template-columns: 1fr; }
        .aap-cards { grid-template-columns: repeat(2, 1fr); }
        .aap-drawer { width: 100vw; }
      }
    `;
    document.head.appendChild(style);
  }

  /* ─── Helper: browser name ─── */
  function browser(ua) {
    if (!ua) return '—';
    if (ua.includes('Edg')) return '🌊 Edge';
    if (ua.includes('Chrome')) return '🌐 Chrome';
    if (ua.includes('Firefox')) return '🦊 Firefox';
    if (ua.includes('Safari')) return '🧭 Safari';
    return '🌐 Browser';
  }

  /* ─── Helper: date format ─── */
  function fmtDate(str) {
    if (!str) return '—';
    const d = new Date(str);
    return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  }

  /* ─── Render/update charts ─── */
  const COLORS = [
    'rgba(99,102,241,0.85)', 'rgba(16,185,129,0.85)', 'rgba(245,158,11,0.85)',
    'rgba(59,130,246,0.85)', 'rgba(236,72,153,0.85)', 'rgba(20,184,166,0.85)',
    'rgba(239,68,68,0.85)',  'rgba(168,85,247,0.85)'
  ];

  function updateCharts(pageBreakdown, dailyTrend) {
    const pageLabels = (pageBreakdown || []).map(p => label(p.page));
    const pageData   = (pageBreakdown || []).map(p => p.views);

    /* ── Bar Chart ── */
    const barCtx = document.getElementById('aapBarChart');
    if (barCtx) {
      if (barChart) {
        barChart.data.labels = pageLabels;
        barChart.data.datasets[0].data = pageData;
        barChart.update('none');
      } else {
        barChart = new Chart(barCtx, {
          type: 'bar',
          data: {
            labels: pageLabels,
            datasets: [{ label: 'Visits', data: pageData,
              backgroundColor: COLORS, borderRadius: 6, borderSkipped: false }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false },
              tooltip: { backgroundColor: '#1a1a2e', titleColor: '#fff', bodyColor: '#a5b4fc' }
            },
            scales: {
              x: { ticks: { color: 'rgba(255,255,255,0.5)', font:{size:11} }, grid: { display: false } },
              y: { ticks: { color: 'rgba(255,255,255,0.5)', precision: 0 },
                   grid: { color: 'rgba(255,255,255,0.06)' }, beginAtZero: true }
            }
          }
        });
      }
    }

    /* ── Pie Chart ── */
    const pieCtx = document.getElementById('aapPieChart');
    if (pieCtx) {
      if (pieChart) {
        pieChart.data.labels = pageLabels;
        pieChart.data.datasets[0].data = pageData;
        pieChart.update('none');
      } else {
        pieChart = new Chart(pieCtx, {
          type: 'doughnut',
          data: {
            labels: pageLabels,
            datasets: [{ data: pageData, backgroundColor: COLORS,
              borderColor: '#0f0f1a', borderWidth: 2, hoverOffset: 8 }]
          },
          options: {
            responsive: true, maintainAspectRatio: false, cutout: '62%',
            plugins: {
              legend: { position: 'right', labels: { color: 'rgba(255,255,255,0.7)', font:{size:11}, padding: 14 } },
              tooltip: { backgroundColor: '#1a1a2e', titleColor: '#fff', bodyColor: '#a5b4fc' }
            }
          }
        });
      }
    }

    /* ── Line Chart ── */
    const lineCtx = document.getElementById('aapLineChart');
    if (lineCtx) {
      const trend = dailyTrend || [];
      const lineLabels = trend.map(d => {
        const dt = new Date(d.date);
        return dt.toLocaleDateString('en-IN', { month:'short', day:'numeric' });
      });
      const lineData = trend.map(d => d.views);

      if (lineChart) {
        lineChart.data.labels = lineLabels;
        lineChart.data.datasets[0].data = lineData;
        lineChart.update('none');
      } else {
        // build gradient
        const grad = lineCtx.getContext('2d').createLinearGradient(0, 0, 0, 200);
        grad.addColorStop(0, 'rgba(99,102,241,0.35)');
        grad.addColorStop(1, 'rgba(99,102,241,0)');

        lineChart = new Chart(lineCtx, {
          type: 'line',
          data: {
            labels: lineLabels,
            datasets: [{
              label: 'Visits', data: lineData,
              borderColor: '#6366f1', backgroundColor: grad,
              borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: '#a5b4fc',
              fill: true, tension: 0.45
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false },
              tooltip: { backgroundColor: '#1a1a2e', titleColor: '#fff', bodyColor: '#a5b4fc' }
            },
            scales: {
              x: { ticks: { color: 'rgba(255,255,255,0.4)', font:{size:10}, maxTicksLimit: 10 }, grid: { display: false } },
              y: { ticks: { color: 'rgba(255,255,255,0.4)', precision: 0 },
                   grid: { color: 'rgba(255,255,255,0.06)' }, beginAtZero: true }
            }
          }
        });
      }
    }
  }

  /* ─── Main data fetch & render ─── */
  async function fetchAndRender() {
    try {
      const [analyticsRes, visitorsRes] = await Promise.all([
        fetch(`${API}/analytics`),
        fetch(`${API}/visitors`)
      ]);

      const analytics = await analyticsRes.json();
      const visitorsData = await visitorsRes.json();

      if (!analytics.success) return;
      const d = analytics.data;

      /* Cards */
      const set = (id, val) => {
        const el = document.getElementById(id);
        if (el && el.textContent !== String(val)) el.textContent = val ?? '0';
      };
      set('aapTotalVisits',    d.totalVisits);
      set('aapUniqueVisitors', d.uniqueVisitors);
      set('aapToday',          d.todayVisits);
      set('aapWeek',           d.weekVisits);
      set('aapMonth',          d.monthVisits);

      /* Registered users from visitors table */
      const totalUsersRes = await fetch(`${API}/visitor-count`);
      const totalUsers = await totalUsersRes.json();
      set('aapTotalUsers', totalUsers.count ?? '—');

      /* Highlights */
      const pb = d.pageBreakdown || [];
      if (pb.length > 0) {
        document.getElementById('aapMost').textContent  = label(pb[0].page) + ' (' + pb[0].views + ')';
        document.getElementById('aapLeast').textContent = label(pb[pb.length-1].page) + ' (' + pb[pb.length-1].views + ')';
      }

      /* Charts */
      updateCharts(d.pageBreakdown, d.dailyTrend);

      /* Top Pages table */
      const tbody = document.getElementById('aapTopPages');
      if (tbody) {
        const total = d.totalVisits || 1;
        tbody.innerHTML = pb.map((p, i) => {
          const pct = ((p.views / total) * 100).toFixed(1);
          const rankClass = i < 3 ? `aap-rank-${i+1}` : 'aap-rank-n';
          return `<tr>
            <td><span class="aap-rank ${rankClass}">${i+1}</span></td>
            <td>${label(p.page)}</td>
            <td><strong>${p.views}</strong></td>
            <td><div class="aap-share-bar">
              <span style="color:rgba(255,255,255,0.6);font-size:.8rem">${pct}%</span>
              <div class="aap-share-track"><div class="aap-share-fill" style="width:${pct}%"></div></div>
            </div></td>
          </tr>`;
        }).join('');
      }

      /* Recent Visitors */
      const rvbody = document.getElementById('aapRecentVisitors');
      if (rvbody && visitorsData.success) {
        rvbody.innerHTML = visitorsData.visitors.slice(0, 10).map((v, i) => `<tr>
          <td>${i+1}</td>
          <td><strong>${escHtml(v.name)}</strong></td>
          <td>${fmtDate(v.created_at)}</td>
          <td>${browser(v.user_agent)}</td>
        </tr>`).join('');
      }

    } catch (e) {
      console.warn('[AdminAnalytics] fetch error:', e.message);
    }
  }

  function escHtml(s) {
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  /* ─── Open / Close ─── */
  function openPanel() {
    if (isOpen) return;
    isOpen = true;
    const panel = document.getElementById('adminAnalyticsPanel');
    if (!panel) return;
    panel.classList.add('aap-visible');
    document.body.style.overflow = 'hidden';

    loadChartJS(() => {
      fetchAndRender();
      refreshTimer = setInterval(fetchAndRender, REFRESH_MS);
    });
  }

  function closePanel() {
    isOpen = false;
    const panel = document.getElementById('adminAnalyticsPanel');
    if (panel) panel.classList.remove('aap-visible');
    document.body.style.overflow = '';
    if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
  }

  /* ─── Activate admin mode (called from welcome-popup after name check) ─── */
  window.activateAdminMode = function () {
    injectStyles();
    buildPanel();

    // Show navbar link (desktop)
    const navLink = document.getElementById('adminNavLink');
    if (navLink) {
      navLink.style.display = 'inline-flex';
      navLink.onclick = openPanel;
    }

    // Show mobile nav link
    const mobileLink = document.getElementById('adminMobileNavLink');
    if (mobileLink) {
      mobileLink.style.display = 'block';
      mobileLink.onclick = () => { openPanel(); };
    }

    console.log('%c[Admin] Analytics unlocked 📊', 'color:#6366f1;font-weight:bold;font-size:14px');
  };

  /* ─── Check on load if name already stored ─── */
  document.addEventListener('DOMContentLoaded', () => {
    const stored =
      localStorage.getItem('portfolioVisitorName') ||
      sessionStorage.getItem('portfolioVisitorName');
    if (stored && stored.trim() === ADMIN_NAME) {
      window.activateAdminMode();
    }
  });

})();
