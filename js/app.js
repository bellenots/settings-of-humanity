/* Settings of Humanity — hash router + data loaders */
(function () {
  const SECTIONS = [
    "general",
    "household",
    "scorecard",
    "media",
    "associations",
    "updates",
    "standards",
  ];

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

  function route() {
    let hash = (location.hash || "#general").replace(/^#/, "").split("?")[0];
    if (!SECTIONS.includes(hash)) hash = "general";
    $$(".section").forEach((s) => s.classList.toggle("active", s.id === `sec-${hash}`));
    $$(".nav-item").forEach((n) =>
      n.classList.toggle("active", n.dataset.section === hash)
    );
    const title = $(`#sec-${hash}`)?.dataset.title || "Settings of Humanity";
    const sub = $(`#sec-${hash}`)?.dataset.sub || "";
    $("#pageTitle").textContent = title;
    $("#pageSub").textContent = sub;
    document.title = `${title} · Settings of Humanity`;
    closeSidebar();
    window.scrollTo(0, 0);
  }

  function openSidebar() {
    $(".sidebar").classList.add("open");
    $(".overlay").classList.add("show");
  }
  function closeSidebar() {
    $(".sidebar").classList.remove("open");
    $(".overlay").classList.remove("show");
  }

  async function loadJSON(path) {
    const r = await fetch(path);
    if (!r.ok) throw new Error(`${path} ${r.status}`);
    return r.json();
  }

  function fmtM(n) {
    if (n == null || Number.isNaN(n)) return "—";
    if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return String(n);
  }

  function renderUpdates(data) {
    const host = $("#updatesList");
    if (!host) return;
    host.innerHTML = (data.items || [])
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .map(
        (item) => `
      <article class="news-item">
        <div class="news-meta">
          <time datetime="${item.date}">${item.date}</time>
          ${(item.tags || []).map((t) => `<span class="badge neutral">${t}</span>`).join("")}
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        ${item.body ? `<p style="margin-top:.35rem">${escapeHtml(item.body)}</p>` : ""}
      </article>`
      )
      .join("");
  }

  function renderScorecard(data) {
    const host = $("#scorecardList");
    if (!host) return;
    host.innerHTML = (data.indicators || [])
      .map((ind) => {
        const status =
          ind.status === "partial"
            ? '<span class="badge warn">partial</span>'
            : ind.status === "wired"
            ? '<span class="badge ok">wired</span>'
            : '<span class="badge neutral">data wiring soon</span>';
        return `
        <article class="indicator">
          <div class="indicator-head">
            <span class="num">${String(ind.id).padStart(2, "0")}</span>
            <h3>${escapeHtml(ind.name)}</h3>
            ${status}
          </div>
          <dl>
            <dt>Definition</dt><dd>${escapeHtml(ind.definition)}</dd>
            <dt>Best source</dt><dd>${escapeHtml(ind.best_source)}</dd>
            <dt>Geography</dt><dd>${escapeHtml(ind.geography)}</dd>
            <dt>Caveats</dt><dd>${escapeHtml(ind.caveats)}</dd>
            <dt>False credit risk</dt><dd><em>Politicians may falsely claim credit by…</em> ${escapeHtml(ind.politicians_may_falsely_claim_credit_by)}</dd>
          </dl>
        </article>`;
      })
      .join("");
  }

  function renderYoutubeTables(data) {
    const makeTable = (rows, id) => {
      const host = $(id);
      if (!host) return;
      host.innerHTML = `
        <table>
          <thead><tr><th>#</th><th>Channel</th><th>Subs</th><th>Views</th><th>Lean</th></tr></thead>
          <tbody>
            ${rows
              .map(
                (r) => `<tr>
              <td class="num">${r.rank}</td>
              <td>${escapeHtml(r.channel)}</td>
              <td class="num">${escapeHtml(r.subscribers_display || fmtM(r.subscribers))}</td>
              <td class="num">${escapeHtml(r.views_display || "—")}</td>
              <td>${escapeHtml(r.lean || "")}</td>
            </tr>`
              )
              .join("")}
          </tbody>
        </table>`;
    };
    makeTable(data.overall_top10_us_news_politics || [], "#ytOverallTable");
    makeTable(data.left_top10 || [], "#ytLeftTable");
    makeTable(data.right_top10 || [], "#ytRightTable");
  }

  function renderDAI(data) {
    const host = $("#daiPartyStats");
    if (!host || !data) return;
    const o = data.officials_dai_gt_none || {};
    const by = o.by_party || {};
    host.innerHTML = `
      <div class="grid">
        <div class="card"><div class="stat">${o.total ?? "—"}</div><div class="stat-label">Officials DAI &gt; none</div></div>
        <div class="card"><div class="stat">${by.Democrat ?? "—"}</div><div class="stat-label">Democrat</div></div>
        <div class="card"><div class="stat">${by.Republican ?? "—"}</div><div class="stat-label">Republican</div></div>
        <div class="card"><div class="stat">${by.Independent ?? "—"}</div><div class="stat-label">Independent</div></div>
      </div>`;
    const bands = o.by_band || {};
    const bandHost = $("#daiBands");
    if (bandHost) {
      bandHost.innerHTML = Object.entries(bands)
        .map(([k, v]) => `<span class="badge neutral">${k}: ${v}</span>`)
        .join(" ");
    }
  }

  function renderSiteNumbers(n) {
    if (!n) return;
    const set = (id, val) => {
      const el = $(id);
      if (el) el.textContent = val;
    };
    set("#statFoodMean", (n.food_burden?.mean_pct_income ?? "—") + "%");
    set("#statFoodCorr", "r ≈ " + (n.food_burden?.corr_vs_lean_right ?? "—"));
    set("#statElecMean", (n.energy_burden?.mean_elec_pct_income ?? "—") + "%");
    set("#statElecAvg", (n.energy_burden?.us_avg_elec_cents ?? "—") + " ¢/kWh");
    set("#statIncomeCorr", "r ≈ " + (n.income_politics?.corr_lean_vs_income ?? "—"));
    set("#statCounties", String(n.income_politics?.n_counties ?? "—"));
    set("#statDaiTotal", String(n.dai?.officials_dai_gt_none ?? "—"));
    set("#statYtLeft", fmtM(n.youtube?.left_subs_sum));
    set("#statYtRight", fmtM(n.youtube?.right_subs_sum));
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }


  let sohChartsBuilt = false;
  function cleanSeries(arr) {
    return (arr || []).map((v) => (v == null || Number.isNaN(Number(v)) ? null : Number(v)));
  }

  function sohTickColor() {
    return getComputedStyle(document.documentElement).getPropertyValue("--muted").trim() || "#98989f";
  }
  function sohGridColor() {
    return "rgba(128,128,128,0.18)";
  }

  async function buildSohMediaCharts() {
    if (sohChartsBuilt || typeof Chart === "undefined") return;
    const el = document.getElementById("sohChartLevels");
    if (!el) return;
    let H;
    try {
      H = await loadJSON("data/historical_timeline.json");
    } catch (e) {
      try {
        H = await loadJSON("data/youtube_historical_timeline_site.json");
      } catch (e2) {
        console.error("timeline json", e2);
        return;
      }
    }
    sohChartsBuilt = true;
    const years = H.years || [];
    const left = cleanSeries(H.left_fixed_sum).map((v) => (v == null ? null : v / 1e6));
    const right = cleanSeries(H.right_fixed_sum).map((v) => (v == null ? null : v / 1e6));
    const mega = cleanSeries(H.mega_fixed_sum).map((v) => (v == null ? null : v / 1e9));
    const leftY = cleanSeries(H.left_fixed_yoy).map((v) => (v == null ? null : v * 100));
    const rightY = cleanSeries(H.right_fixed_yoy).map((v) => (v == null ? null : v * 100));
    const megaY = cleanSeries(H.mega_fixed_yoy).map((v) => (v == null ? null : v * 100));
    const gap = cleanSeries(H.right_minus_left_yoy).map((v) => (v == null ? null : v * 100));
    const tick = sohTickColor();
    const grid = sohGridColor();
    const baseOpts = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { color: tick } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = ctx.parsed.y;
              if (v == null) return ctx.dataset.label + ": —";
              return ctx.dataset.label + ": " + (Number.isInteger(v) ? v : v.toFixed(2));
            },
          },
        },
      },
      scales: {
        x: { ticks: { color: tick }, grid: { color: grid } },
        y: { ticks: { color: tick }, grid: { color: grid } },
      },
    };

    new Chart(document.getElementById("sohChartLevels"), {
      type: "line",
      data: {
        labels: years,
        datasets: [
          { label: "Left (M)", data: left, borderColor: "#5B8DEF", backgroundColor: "rgba(91,141,239,.2)", tension: 0.25, yAxisID: "y" },
          { label: "Right (M)", data: right, borderColor: "#E45756", backgroundColor: "rgba(228,87,86,.2)", tension: 0.25, yAxisID: "y" },
          { label: "Mega (B)", data: mega, borderColor: "#F2C94C", backgroundColor: "rgba(242,201,76,.15)", tension: 0.25, yAxisID: "y1", borderDash: [4, 3] },
        ],
      },
      options: {
        ...baseOpts,
        scales: {
          x: baseOpts.scales.x,
          y: { type: "linear", position: "left", title: { display: true, text: "Partisan (millions)", color: tick }, ticks: { color: tick }, grid: { color: grid } },
          y1: { type: "linear", position: "right", title: { display: true, text: "Mega (billions)", color: "#F2C94C" }, ticks: { color: "#F2C94C" }, grid: { drawOnChartArea: false } },
        },
      },
    });

    new Chart(document.getElementById("sohChartRvL"), {
      type: "bar",
      data: {
        labels: years,
        datasets: [
          { label: "Left (M)", data: left, backgroundColor: "#5B8DEF" },
          { label: "Right (M)", data: right, backgroundColor: "#E45756" },
        ],
      },
      options: {
        ...baseOpts,
        scales: {
          x: baseOpts.scales.x,
          y: { ...baseOpts.scales.y, title: { display: true, text: "Subscribers (millions)", color: tick } },
        },
      },
    });

    new Chart(document.getElementById("sohChartYoy"), {
      type: "bar",
      data: {
        labels: years,
        datasets: [
          { label: "Left YoY %", data: leftY, backgroundColor: "#5B8DEF" },
          { label: "Right YoY %", data: rightY, backgroundColor: "#E45756" },
          { label: "Mega YoY %", data: megaY, backgroundColor: "#F2C94C" },
        ],
      },
      options: {
        ...baseOpts,
        scales: {
          x: baseOpts.scales.x,
          y: { ...baseOpts.scales.y, title: { display: true, text: "YoY growth (%)", color: tick } },
        },
      },
    });

    new Chart(document.getElementById("sohChartGap"), {
      type: "line",
      data: {
        labels: years,
        datasets: [
          {
            label: "Right − Left YoY (pp)",
            data: gap,
            borderColor: "#AF52DE",
            backgroundColor: "rgba(175,82,222,.2)",
            fill: true,
            tension: 0.25,
          },
        ],
      },
      options: {
        ...baseOpts,
        scales: {
          x: baseOpts.scales.x,
          y: { ...baseOpts.scales.y, title: { display: true, text: "Gap (percentage points)", color: tick } },
        },
      },
    });
  }

  function setupYtTabs() {
    $$(".yt-tabs .tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".yt-tabs .tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const which = tab.dataset.yt;
        $$(".yt-panel").forEach((p) => p.classList.toggle("active", p.dataset.yt === which));
        if (which === "timeline") buildSohMediaCharts();
      });
    });
  }

  async function boot() {
    $("#menuBtn")?.addEventListener("click", openSidebar);
    $(".overlay")?.addEventListener("click", closeSidebar);
    $$(".nav-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        location.hash = item.dataset.section;
      });
    });
    window.addEventListener("hashchange", route);
    setupYtTabs();
    route();

    try {
      const [updates, scorecard, yt10, dai, numbers] = await Promise.all([
        loadJSON("data/updates.json"),
        loadJSON("data/scorecard_indicators.json"),
        loadJSON("data/youtube_top10.json"),
        loadJSON("data/party_association_summary.json"),
        loadJSON("data/site_numbers.json"),
      ]);
      renderUpdates(updates);
      renderScorecard(scorecard);
      renderYoutubeTables(yt10);
      renderDAI(dai);
      renderSiteNumbers(numbers);
      // Preload charts if media/timeline already selected
      if ((location.hash || "").includes("media")) {
        /* charts build on timeline tab open */
      }
    } catch (err) {
      console.error(err);
      const el = $("#dataError");
      if (el) {
        el.style.display = "block";
        el.textContent = "Some data files failed to load. Open via a local server (not file://).";
      }
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
