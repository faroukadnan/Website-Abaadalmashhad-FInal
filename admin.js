const loginPanel = document.querySelector("#loginPanel");
const dashboard = document.querySelector("#dashboard");
const loginForm = document.querySelector("#loginForm");
const loginError = document.querySelector("#loginError");
const articlesTable = document.querySelector("#articlesTable");
const emptyState = document.querySelector("#emptyState");
const totalArticles = document.querySelector("#totalArticles");
const totalViews = document.querySelector("#totalViews");
const lastUpdated = document.querySelector("#lastUpdated");
const siteStatusCard = document.querySelector("#siteStatusCard");
const siteStatusText = document.querySelector("#siteStatusText");
const siteStatusToggle = document.querySelector("#siteStatusToggle");
const siteStatusNote = document.querySelector("#siteStatusNote");
const geminiCountdown = document.querySelector("#geminiCountdown");
const geminiCountdownTitle = document.querySelector("#geminiCountdownTitle");
const geminiCountdownNote = document.querySelector("#geminiCountdownNote");
const geminiCountdownClock = document.querySelector("#geminiCountdownClock");
const apiUsageGrid = document.querySelector("#apiUsageGrid");
const apiUsageNote = document.querySelector("#apiUsageNote");
const apiUsageUpdated = document.querySelector("#apiUsageUpdated");
const apiUsageButton = document.querySelector("#apiUsageButton");
const apiUsageModal = document.querySelector("#apiUsageModal");
const warRoomButton = document.querySelector("#warRoomButton");
const warRoomModal = document.querySelector("#warRoomModal");
const warRoomUpdated = document.querySelector("#warRoomUpdated");
const warRoomContent = document.querySelector("#warRoomContent");
const ideasButton = document.querySelector("#ideasButton");
const ideasModal = document.querySelector("#ideasModal");
const ideaForm = document.querySelector("#ideaForm");
const ideasList = document.querySelector("#ideasList");
const saveIdeaButton = document.querySelector("#saveIdeaButton");
const cancelIdeaButton = document.querySelector("#cancelIdeaButton");
const flowMapButton = document.querySelector("#flowMapButton");
const flowMapModal = document.querySelector("#flowMapModal");
const flowMapUpdated = document.querySelector("#flowMapUpdated");
const flowCanvas = document.querySelector("#flowCanvas");
const flowDetails = document.querySelector("#flowDetails");
const searchInput = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const addButton = document.querySelector("#addButton");
const refreshButton = document.querySelector("#refreshButton");
const refreshAlertsButton = document.querySelector("#refreshAlertsButton");
const logoutButton = document.querySelector("#logoutButton");
const articleModal = document.querySelector("#articleModal");
const modalTitle = document.querySelector("#modalTitle");
const modalBody = document.querySelector("#modalBody");
const imageDeskModal = document.querySelector("#imageDeskModal");
const imageDeskBody = document.querySelector("#imageDeskBody");
const editModal = document.querySelector("#editModal");
const editForm = document.querySelector("#editForm");
const editModalTitle = document.querySelector("#editModalTitle");
const closeEditButton = document.querySelector("#closeEditButton");
const cancelEditButton = document.querySelector("#cancelEditButton");

let articles = [];
let developmentIdeas = [];
let siteOnline = true;
let warRoomTimer = null;
let flowMapTimer = null;
let flowPlaybackTimer = null;
let flowPlaybackIndex = 0;
let geminiStatusTimer = null;
let geminiCountdownTimer = null;
let geminiCountdownUntil = null;
let geminiPendingCount = 0;
let geminiReadyKeyCount = 0;
let geminiCoolingKeyCount = 0;
let geminiCountdownMode = "ready";
let geminiAutoRetrying = false;
let geminiLastAutoRetryAt = 0;
let activeFlowNode = "sources";
let lastFlowNodes = [];
let lastFlowStatus = {};
let lastFlowUsage = {};
let flowConnectorFrame = null;
let flowResizeObserver = null;
const newsChannel = "BroadcastChannel" in window ? new BroadcastChannel("abaad-news-updates") : null;
const BREMEN_TIME_ZONE = "Europe/Berlin";

init();

async function init() {
  const me = await fetchJson("/api/admin/me");
  if (me.authenticated) showDashboard();
  else showLogin();

  loginForm.addEventListener("submit", handleLogin);
  apiUsageButton.addEventListener("click", openApiUsage);
  warRoomButton?.addEventListener("click", openWarRoom);
  warRoomModal?.addEventListener("close", stopWarRoom);
  ideasButton?.addEventListener("click", openIdeas);
  saveIdeaButton?.addEventListener("click", saveIdea);
  cancelIdeaButton?.addEventListener("click", resetIdeaForm);
  flowMapButton?.addEventListener("click", openFlowMap);
  flowMapModal?.addEventListener("close", stopFlowMap);
  siteStatusToggle?.addEventListener("click", toggleSiteStatus);
  addButton.addEventListener("click", addArticle);
  refreshButton.addEventListener("click", refreshFromFeeds);
  refreshAlertsButton?.addEventListener("click", refreshStrikeAlerts);
  logoutButton.addEventListener("click", logout);
  searchInput.addEventListener("input", renderTable);
  categoryFilter.addEventListener("change", renderTable);
  editForm.addEventListener("submit", saveEdit);
  closeEditButton.addEventListener("click", () => editModal.close());
  cancelEditButton.addEventListener("click", () => editModal.close());
}

async function handleLogin(event) {
  event.preventDefault();
  loginError.textContent = "";
  const data = Object.fromEntries(new FormData(loginForm).entries());
  data.username = normalizeLoginValue(data.username);
  data.password = normalizeLoginValue(data.password);
  const result = await fetchJson("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!result.ok) {
    loginError.textContent = "اسم المستخدم أو كلمة المرور غير صحيحة";
    return;
  }

  showDashboard();
}

function normalizeLoginValue(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim();
}

async function logout() {
  await fetchJson("/api/logout", { method: "POST" });
  showLogin();
}

function showLogin() {
  loginPanel.classList.remove("hidden");
  dashboard.classList.add("hidden");
  stopGeminiCountdown();
  stopWarRoom();
}

function showDashboard() {
  loginPanel.classList.add("hidden");
  dashboard.classList.remove("hidden");
  loadArticles();
  loadSiteStatus();
  startGeminiCountdown();
}

async function loadArticles() {
  const data = await fetchJson("/api/admin/articles");
  if (data.error) {
    showLogin();
    return;
  }
  articles = data.articles || [];
  renderStats();
  renderTable();
}

async function loadSiteStatus() {
  const data = await fetchJson("/api/admin/site-status");
  if (data.error) {
    renderSiteStatus({ online: true });
    return;
  }
  renderSiteStatus(data);
}

async function toggleSiteStatus() {
  if (!siteStatusToggle) return;
  siteStatusToggle.disabled = true;
  siteStatusToggle.textContent = siteOnline ? "Turning off..." : "Turning on...";
  const data = await fetchJson("/api/admin/site-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ online: !siteOnline })
  });
  if (!data.error) renderSiteStatus(data);
  else renderSiteStatus({ online: siteOnline });
  siteStatusToggle.disabled = false;
}

function renderSiteStatus(data) {
  siteOnline = data.online !== false;
  siteStatusCard?.classList.toggle("offline", !siteOnline);
  siteStatusCard?.classList.toggle("online", siteOnline);
  if (siteStatusText) siteStatusText.textContent = siteOnline ? "Online" : "Offline";
  if (siteStatusToggle) siteStatusToggle.textContent = siteOnline ? "Turn Off" : "Turn On";
  if (siteStatusNote) {
    siteStatusNote.textContent = siteOnline
      ? "Public website is visible"
      : "Visitors see an offline page";
  }
}

async function loadApiUsage() {
  const data = await fetchJson("/api/admin/api-usage");
  if (data.error) return;
  renderApiUsage(data);
}

function startGeminiCountdown() {
  stopGeminiCountdown();
  loadGeminiCountdown();
  geminiStatusTimer = window.setInterval(loadGeminiCountdown, 10000);
  geminiCountdownTimer = window.setInterval(renderGeminiCountdown, 1000);
}

function stopGeminiCountdown() {
  if (geminiStatusTimer) window.clearInterval(geminiStatusTimer);
  if (geminiCountdownTimer) window.clearInterval(geminiCountdownTimer);
  geminiStatusTimer = null;
  geminiCountdownTimer = null;
}

async function loadGeminiCountdown() {
  if (!geminiCountdown) return;
  const [usage, status] = await Promise.all([
    fetchJson("/api/admin/api-usage"),
    fetchJson("/api/status")
  ]);
  if (usage.error) return;

  const services = Array.isArray(usage.services) ? usage.services : [];
  const gemini = services.find((service) => service.id === "gemini") || {};
  const keys = Array.isArray(gemini.keys) ? gemini.keys : [];
  const waits = keys
    .filter((key) => key.pausedUntil)
    .map((key) => new Date(key.pausedUntil).getTime())
    .filter((time) => Number.isFinite(time) && time > Date.now());

  geminiPendingCount = Number(status?.stats?.pendingRetry || 0);
  geminiReadyKeyCount = keys.filter((key) => key.status === "ready").length;
  geminiCoolingKeyCount = waits.length;
  geminiCountdownUntil = waits.length ? Math.min(...waits) : null;
  if (!gemini.configured) geminiCountdownMode = "missing";
  else if (geminiReadyKeyCount > 0) geminiCountdownMode = "ready";
  else if (geminiCountdownUntil) geminiCountdownMode = "waiting";
  else geminiCountdownMode = "ready";
  renderGeminiCountdown();
  if (geminiCountdownMode === "ready" && geminiPendingCount > 0) {
    requestGeminiAutoRetry("ready");
  }
}

function renderGeminiCountdown() {
  if (!geminiCountdown) return;
  geminiCountdown.classList.remove("ready", "waiting", "missing");
  geminiCountdown.classList.add(geminiCountdownMode);

  if (geminiCountdownMode === "missing") {
    geminiCountdownTitle.textContent = "Gemini API Key Missing";
    geminiCountdownNote.textContent = "Add a Gemini key so the AI can edit new stories.";
    geminiCountdownClock.textContent = "--:--";
    return;
  }

  if (geminiCountdownMode === "waiting" && geminiCountdownUntil) {
    const seconds = Math.max(0, Math.ceil((geminiCountdownUntil - Date.now()) / 1000));
    geminiCountdownTitle.textContent = "Gemini quota wait";
    geminiCountdownNote.textContent = `${formatEnglishNumber(geminiPendingCount)} news waiting for AI editing. Auto retry when the timer reaches zero.`;
    geminiCountdownClock.textContent = formatCountdownClock(seconds);
    if (seconds <= 0) requestGeminiAutoRetry("timer");
    return;
  }

  geminiCountdownTitle.textContent = "Gemini Ready";
  geminiCountdownNote.textContent = geminiPendingCount
    ? geminiAutoRetrying
      ? `${formatEnglishNumber(geminiPendingCount)} news waiting. Auto retry is running now.`
      : `${formatEnglishNumber(geminiPendingCount)} news waiting. Backup key is active.`
    : geminiCoolingKeyCount
      ? `${formatEnglishNumber(geminiReadyKeyCount)} key ready, ${formatEnglishNumber(geminiCoolingKeyCount)} cooling down.`
      : "AI editorial agent is ready to process news.";
  geminiCountdownClock.textContent = "00:00";
}

async function requestGeminiAutoRetry(reason = "auto") {
  const now = Date.now();
  if (geminiAutoRetrying) return;
  if (now - geminiLastAutoRetryAt < 45000) return;
  if (geminiPendingCount <= 0 && reason !== "timer") return;

  geminiAutoRetrying = true;
  geminiLastAutoRetryAt = now;
  if (geminiCountdownTitle) geminiCountdownTitle.textContent = "Gemini Auto Retry";
  if (geminiCountdownNote) geminiCountdownNote.textContent = "Retrying pending news now. The timer will reset automatically.";
  if (geminiCountdownClock) geminiCountdownClock.textContent = "RUN";

  try {
    await fetchJson("/api/refresh");
    await loadArticles();
    await loadApiUsage();
  } finally {
    geminiAutoRetrying = false;
    window.setTimeout(loadGeminiCountdown, 1200);
  }
}

async function openApiUsage() {
  await loadApiUsage();
  apiUsageModal.showModal();
}

async function openWarRoom() {
  await loadWarRoom();
  warRoomModal.showModal();
  stopWarRoom();
  warRoomTimer = window.setInterval(loadWarRoom, 5000);
}

function stopWarRoom() {
  if (warRoomTimer) window.clearInterval(warRoomTimer);
  warRoomTimer = null;
}

async function loadWarRoom() {
  if (!warRoomContent) return;
  const [status, usage, site, articleData, alerts, field, prices] = await Promise.all([
    fetchJson("/api/status"),
    fetchJson("/api/admin/api-usage"),
    fetchJson("/api/admin/site-status"),
    fetchJson("/api/admin/articles"),
    fetchJson("/api/strike-alerts"),
    fetchJson("/api/field-reports"),
    fetchJson("/api/market-prices")
  ]);

  if (!articleData.error && Array.isArray(articleData.articles)) {
    articles = articleData.articles;
    renderStats();
    renderTable();
  }

  renderWarRoom({
    status: status || {},
    usage: usage || {},
    site: site || {},
    alerts: alerts || {},
    field: field || {},
    prices: prices || {}
  });
}

function renderWarRoom({ status = {}, usage = {}, site = {}, alerts = {}, field = {}, prices = {} }) {
  const stats = status.stats || {};
  const services = Array.isArray(usage.services) ? usage.services : [];
  const serviceById = Object.fromEntries(services.map((service) => [service.id, service]));
  const geminiStatus = getServiceStatus(serviceById.gemini || {});
  const imageStatus = getServiceStatus(serviceById.google_cse || {});
  const xStatus = getServiceStatus(serviceById.x || {});
  const breaking = findWarRoomBreaking();
  const highRisk = articles.map((article) => ({ article, risk: getWarRoomRisk(article) }))
    .filter((item) => item.risk.score >= 5 || normalizeFactCheck(item.article.factCheck).status !== "pass")
    .sort((a, b) => b.risk.score - a.risk.score || new Date(b.article.createdAt || 0) - new Date(a.article.createdAt || 0))
    .slice(0, 5);
  const latest = [...articles].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 6);
  const lastErrors = Array.isArray(stats.lastErrors) ? stats.lastErrors.slice(0, 4) : [];
  const categoryCounts = getCategoryCounts();
  const readiness = calculateWarReadiness({ site, geminiStatus, imageStatus, xStatus, stats });

  if (warRoomUpdated) warRoomUpdated.textContent = formatDateTime(new Date());
  warRoomContent.innerHTML = `
    <section class="war-hero ${escapeHtml(readiness.className)}">
      <div class="war-radar" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
      <div class="war-hero-main">
        <span class="war-kicker">Current Lead</span>
        <h3>${breaking ? escapeHtml(breaking.title) : "No active breaking lead"}</h3>
        <p>${breaking ? escapeHtml(getArticleSnippet(breaking)) : "لا يوجد خبر عاجل قوي ضمن نافذة الساعتين حالياً."}</p>
        ${breaking ? `<button type="button" class="war-open-article" data-id="${escapeHtml(breaking.id)}">Open Story</button>` : ""}
      </div>
      <div class="war-readiness">
        <span>Readiness</span>
        <strong>${formatEnglishNumber(readiness.score)}%</strong>
        <small>${escapeHtml(readiness.label)}</small>
      </div>
    </section>

    <section class="war-metrics">
      ${renderWarMetric("Website", site.online === false ? "Offline" : "Online", site.online === false ? "error" : "ok")}
      ${renderWarMetric("Gemini", statusLabel(geminiStatus), geminiStatus === "ready" ? "ok" : geminiStatus === "missing" ? "error" : "warn")}
      ${renderWarMetric("Pending AI", formatEnglishNumber(stats.pendingRetry || 0), Number(stats.pendingRetry || 0) ? "warn" : "ok")}
      ${renderWarMetric("Fact Blocks", formatEnglishNumber(stats.factCheckBlocked || 0), Number(stats.factCheckBlocked || 0) ? "warn" : "ok")}
      ${renderWarMetric("Field", formatEnglishNumber((field.reports || []).length), (field.reports || []).length ? "live" : "idle")}
      ${renderWarMetric("Alerts", formatEnglishNumber((alerts.alerts || []).length), (alerts.alerts || []).length ? "live" : "idle")}
      ${renderWarMetric("Dollar", prices.dollar || "--", "ok")}
      ${renderWarMetric("Images", statusLabel(imageStatus), imageStatus === "ready" ? "ok" : "warn")}
    </section>

    <section class="war-grid">
      <article class="war-panel war-flow-panel">
        <div class="war-panel-head">
          <span>Live Flow</span>
          <strong>مسار غرفة العمليات</strong>
        </div>
        <div class="war-flow">
          ${renderWarStep("Feeds", status.polling ? "live" : "ok", `${formatEnglishNumber(status.feeds || 0)} sources`)}
          ${renderWarStep("Guardrails", Number(stats.pendingRetry || 0) ? "warn" : "ok", `${formatEnglishNumber(stats.accepted || 0)} accepted`)}
          ${renderWarStep("AI Desk", geminiStatus === "ready" ? "ok" : "warn", `${formatEnglishNumber(stats.geminiCalls || 0)} calls`)}
          ${renderWarStep("Publish", site.online === false ? "error" : "ok", `${formatEnglishNumber(articles.length)} stories`)}
        </div>
      </article>

      <article class="war-panel">
        <div class="war-panel-head">
          <span>Risk Queue</span>
          <strong>أخبار تحتاج عين تحريرية</strong>
        </div>
        <div class="war-list">
          ${(highRisk.length ? highRisk : latest.slice(0, 3).map((article) => ({ article, risk: getWarRoomRisk(article) }))).map(({ article, risk }) => `
            <button type="button" class="war-story" data-id="${escapeHtml(article.id)}">
              <b>${escapeHtml(article.category || "--")}</b>
              <span>${escapeHtml(article.title)}</span>
              <em>${escapeHtml(risk.label)} · ${formatEnglishNumber(normalizeFactCheck(article.factCheck).score)}%</em>
            </button>
          `).join("")}
        </div>
      </article>

      <article class="war-panel">
        <div class="war-panel-head">
          <span>Latest Desk</span>
          <strong>آخر الأخبار الداخلة</strong>
        </div>
        <div class="war-list compact">
          ${latest.map((article) => `
            <button type="button" class="war-story" data-id="${escapeHtml(article.id)}">
              <b>${escapeHtml(formatDateTime(article.createdAt || new Date()))}</b>
              <span>${escapeHtml(article.title)}</span>
              <em>${escapeHtml(article.source || "--")}</em>
            </button>
          `).join("")}
        </div>
      </article>

      <article class="war-panel">
        <div class="war-panel-head">
          <span>Sources & Errors</span>
          <strong>إشارات النظام</strong>
        </div>
        <ul class="war-errors">
          ${(lastErrors.length ? lastErrors : [{ at: new Date().toISOString(), message: "No system errors right now." }]).map((item) => `
            <li>
              <time>${escapeHtml(formatDateTime(item.at || new Date()))}</time>
              <span>${escapeHtml(item.message || "")}</span>
            </li>
          `).join("")}
        </ul>
      </article>

      <article class="war-panel">
        <div class="war-panel-head">
          <span>Coverage Map</span>
          <strong>توزيع التصنيفات</strong>
        </div>
        <div class="war-bars">
          ${categoryCounts.map((item) => `
            <div class="war-bar">
              <span>${escapeHtml(item.category)}</span>
              <i style="--w:${item.percent}%"></i>
              <b>${formatEnglishNumber(item.count)}</b>
            </div>
          `).join("")}
        </div>
      </article>
    </section>
  `;

  warRoomContent.querySelectorAll("[data-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const article = articles.find((item) => String(item.id) === String(button.dataset.id));
      if (article) viewArticle(article);
    });
  });
}

function renderWarMetric(label, value, state = "ok") {
  return `
    <div class="war-metric ${escapeHtml(state)}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderWarStep(label, state, metric) {
  return `
    <div class="war-step ${escapeHtml(state)}">
      <i></i>
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(metric)}</span>
    </div>
  `;
}

function findWarRoomBreaking() {
  return articles
    .filter(Boolean)
    .map((article) => ({ article, risk: getWarRoomRisk(article) }))
    .filter((item) => item.risk.score >= 7 && Date.now() - new Date(item.article.createdAt || 0).getTime() < 2 * 60 * 60 * 1000)
    .sort((a, b) => b.risk.score - a.risk.score || new Date(b.article.createdAt || 0) - new Date(a.article.createdAt || 0))[0]?.article || null;
}

function getWarRoomRisk(article = {}) {
  const text = `${article.category || ""} ${article.title || ""} ${article.body || ""} ${article.dimensions || ""}`;
  let score = 0;
  if (String(article.category || "").includes("أمن")) score += 3;
  if (/(عاجل|غارة|غارات|قصف|استهداف|استهدف|إنذار|انذار|صفارات|إخلاء|اخلاء|انفجار)/.test(text)) score += 4;
  if (/(شهيد|شهداء|قتيل|قتلى|جريح|جرحى|مصاب|مصابين|إصابة|اصابة|ضحايا|سقوط)/.test(text)) score += 3;
  if (/(إسرائيلي|اسرائيلي|حزب الله|جنوب لبنان|الحدود|طيران|مسيرة|مسيّرة|صاروخ|صواريخ)/.test(text)) score += 2;
  const fact = normalizeFactCheck(article.factCheck);
  if (fact.status === "review") score += 2;
  if (fact.status === "block") score += 4;
  const label = score >= 9 ? "High Alert" : score >= 6 ? "Monitor" : fact.status === "pass" ? "Stable" : "Review";
  return { score, label };
}

function getArticleSnippet(article = {}) {
  return String(article.body || article.dimensions || article.title || "").replace(/\s+/g, " ").slice(0, 190);
}

function getCategoryCounts() {
  const counts = new Map();
  for (const article of articles) {
    const category = article.category || "--";
    counts.set(category, (counts.get(category) || 0) + 1);
  }
  const total = Math.max(1, articles.length);
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count, percent: Math.max(6, Math.round((count / total) * 100)) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);
}

function calculateWarReadiness({ site = {}, geminiStatus = "unknown", imageStatus = "unknown", xStatus = "unknown", stats = {} }) {
  let score = 100;
  if (site.online === false) score -= 35;
  if (geminiStatus === "quota_wait" || geminiStatus === "limited") score -= 18;
  if (geminiStatus === "missing") score -= 35;
  if (imageStatus === "quota_wait" || imageStatus === "limited") score -= 8;
  if (xStatus === "quota_wait" || xStatus === "limited") score -= 6;
  if (Number(stats.pendingRetry || 0) > 0) score -= Math.min(20, Number(stats.pendingRetry || 0) * 2);
  if (Number(stats.lastErrors?.length || 0) > 4) score -= 8;
  score = Math.max(0, Math.min(100, score));
  return {
    score,
    className: score >= 80 ? "ready" : score >= 55 ? "watch" : "danger",
    label: score >= 80 ? "Systems operational" : score >= 55 ? "Needs attention" : "Critical checks required"
  };
}

async function openFlowMap() {
  stopFlowMap();
  await loadFlowMap();
  flowMapModal.showModal();
  flowMapTimer = window.setInterval(loadFlowMap, 5000);
  startFlowPlayback();
  startFlowConnectorObserver();
  scheduleFlowConnectorDraw();
  window.setTimeout(scheduleFlowConnectorDraw, 90);
}

function stopFlowMap() {
  if (flowMapTimer) window.clearInterval(flowMapTimer);
  if (flowPlaybackTimer) window.clearInterval(flowPlaybackTimer);
  if (flowConnectorFrame) window.cancelAnimationFrame(flowConnectorFrame);
  stopFlowConnectorObserver();
  flowMapTimer = null;
  flowPlaybackTimer = null;
  flowConnectorFrame = null;
}

function startFlowPlayback() {
  if (flowPlaybackTimer) window.clearInterval(flowPlaybackTimer);
  flowPlaybackTimer = window.setInterval(() => {
    if (!lastFlowNodes.length || !flowMapModal?.open) return;
    flowPlaybackIndex = (flowPlaybackIndex + 1) % lastFlowNodes.length;
    activeFlowNode = lastFlowNodes[flowPlaybackIndex]?.id || activeFlowNode;
    renderFlowMap(lastFlowNodes, lastFlowStatus, lastFlowUsage, { preserveUpdatedAt: true });
  }, 2200);
}

async function loadFlowMap() {
  if (!flowCanvas || !flowDetails) return;
  const [status, usage, site, articleData] = await Promise.all([
    fetchJson("/api/status"),
    fetchJson("/api/admin/api-usage"),
    fetchJson("/api/admin/site-status"),
    fetchJson("/api/admin/articles")
  ]);

  if (!articleData.error && Array.isArray(articleData.articles)) {
    articles = articleData.articles;
    renderStats();
    renderTable();
  }

  const nodes = buildFlowNodes(status, usage, site);
  lastFlowNodes = nodes;
  lastFlowStatus = status;
  lastFlowUsage = usage;
  if (!nodes.some((node) => node.id === activeFlowNode)) activeFlowNode = nodes[0]?.id || "";
  flowPlaybackIndex = Math.max(0, nodes.findIndex((node) => node.id === activeFlowNode));
  renderFlowMap(nodes, status, usage);
}

function buildFlowNodes(status = {}, usage = {}, site = {}) {
  const services = Array.isArray(usage.services) ? usage.services : [];
  const serviceById = Object.fromEntries(services.map((service) => [service.id, service]));
  const stats = status.stats || {};
  const lastErrors = Array.isArray(stats.lastErrors) ? stats.lastErrors : [];
  const feedErrors = lastErrors.filter((item) => /returned 40|returned 50|Feed failed|Kan Israel|reuters|almanar|bintjbeil/i.test(item.message || ""));
  const geminiService = serviceById.gemini || {};
  const imageService = serviceById.google_cse || {};
  const xService = serviceById.x || {};
  const latestError = lastErrors[0]?.message || "لا توجد أخطاء محلية مسجلة حالياً.";
  const totalViewsCount = articles.reduce((sum, article) => sum + Number(article.views || 0), 0);

  return [
    {
      id: "sources",
      title: "مصادر الأخبار",
      kicker: "Feeds",
      status: feedErrors.length ? "warn" : "ok",
      metric: `${Number(status.feeds || 0)} مصدر`,
      description: `المصادر الأساسية ${Number(status.mainFeeds || 0)}، والنافذة العبرية ${Number(status.hebrewFeeds || 0)}.`,
      detail: feedErrors.length ? `آخر أعطال مصادر: ${feedErrors.slice(0, 3).map((item) => item.message).join(" | ")}` : "المصادر المربوطة جاهزة، وأي مصدر محجوب يظهر هنا فوراً."
    },
    {
      id: "collector",
      title: "جامع الأخبار",
      kicker: "Poller",
      status: status.polling ? "live" : "ok",
      metric: status.polling ? "يعمل الآن" : "جاهز",
      description: `يجلب الأخبار كل ${Math.round(Number(status.pollIntervalMs || 120000) / 60000)} دقائق.`,
      detail: `آخر جلب: ${status.lastPoll ? formatDateTime(status.lastPoll) : "--"}`
    },
    {
      id: "filter",
      title: "الفلترة والتنظيف",
      kicker: "Guardrails",
      status: Number(stats.rejected || 0) > Number(stats.accepted || 0) * 4 && Number(stats.rejected || 0) > 10 ? "warn" : "ok",
      metric: `${Number(stats.accepted || 0)} قبول / ${Number(stats.pendingRetry || 0)} انتظار`,
      description: "يحذف التكرار، الروابط غير الخبرية، الفيديوهات الدعائية، والأخبار القديمة.",
      detail: `العناصر المجلوبة: ${Number(stats.fetched || 0)}. المرفوض نهائياً: ${Number(stats.rejected || 0)}. المنتظر لإعادة محاولة Gemini: ${Number(stats.pendingRetry || 0)}. ${latestError}`
    },
    {
      id: "ai",
      title: "AI Editorial Agent",
      kicker: "Gemini",
      status: toFlowStatus(getServiceStatus(geminiService)),
      metric: statusLabel(getServiceStatus(geminiService)),
      description: "يعيد الصياغة، يترجم النافذة العبرية، ويطبق قواعد التحقق والتحرير.",
      detail: geminiService.lastError?.message || "لا توجد مشكلة Gemini مسجلة الآن."
    },
    {
      id: "media",
      title: "الصور والهاشتاغ",
      kicker: "Media",
      status: toFlowStatus(getServiceStatus(imageService)),
      metric: statusLabel(getServiceStatus(imageService)),
      description: "يحاول أخذ صورة من المصدر ثم من Google Custom Search، ويولّد هاشتاغات للخبر.",
      detail: imageService.lastError?.message || "الصور تعمل من المصدر عند توفرها، وGoogle يظهر تحذيره هنا إذا تعطل."
    },
    {
      id: "field",
      title: "الميدان والإنذارات",
      kicker: "X / RSS",
      status: toFlowStatus(getServiceStatus(xService)),
      metric: statusLabel(getServiceStatus(xService)),
      description: "يتابع مراسلي الميدان وإنذارات ما قبل القصف عبر X أو RSS البديل.",
      detail: xService.lastError?.message || "لا توجد مشكلة X/RSS مسجلة الآن."
    },
    {
      id: "storage",
      title: "قاعدة الأخبار",
      kicker: "Storage",
      status: Number(status.articles || 0) ? "ok" : "warn",
      metric: `${Number(status.articles || 0)} خبر`,
      description: "يحفظ الأخبار المنشورة والزيارات والتعديلات اليدوية في ملف البيانات المحلي.",
      detail: `الأخبار الظاهرة في لوحة التحكم: ${articles.length}. مجموع الزيارات: ${formatEnglishNumber(totalViewsCount)}.`
    },
    {
      id: "publish",
      title: "واجهة الموقع",
      kicker: "Public Site",
      status: site.online === false ? "error" : "ok",
      metric: site.online === false ? "Offline" : "Online",
      description: "يعرض الأخبار للزوار، التصنيفات، المشاركة، والصوت عند نزول خبر جديد.",
      detail: site.online === false ? "الموقع مطفأ من لوحة التحكم، الزوار يشاهدون صفحة توقف مؤقت." : "الموقع ظاهر للزوار ويقرأ آخر الأخبار المنشورة."
    }
  ];
}

function renderFlowMap(nodes, status = {}, usage = {}, options = {}) {
  const safeStatus = status || {};
  const activeIndex = Math.max(0, nodes.findIndex((node) => node.id === activeFlowNode));
  flowPlaybackIndex = activeIndex;
  if (!options.preserveUpdatedAt) flowMapUpdated.textContent = formatDateTime(new Date());
  flowCanvas.innerHTML = `
    <div class="flow-stage" style="--active-step: ${activeIndex}; --step-count: ${nodes.length};">
      <div class="flow-radar" aria-hidden="true"></div>
      <svg class="flow-connectors" id="flowConnectorSvg" aria-hidden="true" focusable="false">
        <defs>
          <marker id="flowArrowHead" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="10" markerHeight="10" orient="auto">
            <path d="M1 1 L11 6 L1 11 Z"></path>
          </marker>
          <linearGradient id="flowConnectorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#0b7a4b" />
            <stop offset="52%" stop-color="#1877f2" />
            <stop offset="100%" stop-color="#cc0000" />
          </linearGradient>
        </defs>
        <g id="flowConnectorLayer"></g>
      </svg>
      <div class="flow-node-track">
      ${nodes.map((node, index) => `
        <button id="flow-node-${escapeHtml(node.id)}" class="flow-node ${node.status}${node.id === activeFlowNode ? " active in-motion" : ""}" type="button" data-node="${escapeHtml(node.id)}" data-flow-index="${index}" data-step="${index + 1}" aria-pressed="${node.id === activeFlowNode ? "true" : "false"}">
          <span class="flow-node-glow" aria-hidden="true"></span>
          <span class="flow-pulse" aria-hidden="true"></span>
          <span class="flow-step-badge">${formatEnglishNumber(index + 1)}</span>
          <small>${escapeHtml(node.kicker)}</small>
          <strong>${escapeHtml(node.title)}</strong>
          <b>${escapeHtml(node.metric)}</b>
          ${node.status === "warn" || node.status === "error" ? `<em class="flow-issue">${escapeHtml(flowIssueLabel(node.status))}</em>` : ""}
        </button>
      `).join("")}
      </div>
      <div class="flow-stepper" aria-hidden="true">
        ${nodes.map((node, index) => `<span class="${index < activeIndex ? "done" : index === activeIndex ? "active" : ""}"></span>`).join("")}
      </div>
    </div>
  `;

  flowCanvas.querySelectorAll(".flow-node").forEach((button) => {
    button.addEventListener("click", () => {
      activeFlowNode = button.dataset.node;
      flowPlaybackIndex = Math.max(0, lastFlowNodes.findIndex((node) => node.id === activeFlowNode));
      renderFlowMap(lastFlowNodes, safeStatus, usage || {});
    });
  });
  flowCanvas.querySelector(".flow-node-track")?.addEventListener("scroll", scheduleFlowConnectorDraw, { passive: true });
  if (flowMapModal?.open) startFlowConnectorObserver();
  scheduleFlowConnectorDraw();

  const active = nodes.find((node) => node.id === activeFlowNode) || nodes[0];
  const errors = safeStatus.stats?.lastErrors || [];
  flowDetails.innerHTML = active ? `
    <div class="flow-detail-head ${active.status}">
      <span>${escapeHtml(active.kicker)}</span>
      <strong>${escapeHtml(active.title)}</strong>
      <b>${escapeHtml(flowStatusLabel(active.status))}</b>
    </div>
    <p>${escapeHtml(active.description)}</p>
    <div class="flow-detail-box">${escapeHtml(active.detail)}</div>
    <div class="flow-mini-grid">
      <span><b>Fetched</b>${formatEnglishNumber(safeStatus.stats?.fetched || 0)}</span>
      <span><b>Accepted</b>${formatEnglishNumber(safeStatus.stats?.accepted || 0)}</span>
      <span><b>Rejected</b>${formatEnglishNumber(safeStatus.stats?.rejected || 0)}</span>
      <span><b>Pending AI</b>${formatEnglishNumber(safeStatus.stats?.pendingRetry || 0)}</span>
      <span><b>Gemini Calls</b>${formatEnglishNumber(safeStatus.stats?.geminiCalls || 0)}</span>
    </div>
    <h3>آخر إشارات النظام</h3>
    <ul class="flow-errors">
      ${(errors.length ? errors.slice(0, 5) : [{ message: "لا توجد أخطاء حالياً", at: new Date().toISOString() }]).map((item) => `
        <li>
          <time>${escapeHtml(formatDateTime(item.at || new Date()))}</time>
          <span>${escapeHtml(item.message)}</span>
        </li>
      `).join("")}
    </ul>
  ` : "";
}

function scheduleFlowConnectorDraw() {
  if (flowConnectorFrame) window.cancelAnimationFrame(flowConnectorFrame);
  flowConnectorFrame = window.requestAnimationFrame(drawFlowConnectors);
}

function startFlowConnectorObserver() {
  if (!flowCanvas || !("ResizeObserver" in window)) return;
  stopFlowConnectorObserver();
  flowResizeObserver = new ResizeObserver(scheduleFlowConnectorDraw);
  [
    flowCanvas,
    flowCanvas.querySelector(".flow-stage"),
    flowCanvas.querySelector(".flow-node-track"),
    ...flowCanvas.querySelectorAll(".flow-node")
  ].filter(Boolean).forEach((element) => flowResizeObserver.observe(element));
}

function stopFlowConnectorObserver() {
  if (!flowResizeObserver) return;
  flowResizeObserver.disconnect();
  flowResizeObserver = null;
}

function drawFlowConnectors() {
  flowConnectorFrame = null;
  if (!flowCanvas || !flowMapModal?.open) return;

  const stage = flowCanvas.querySelector(".flow-stage");
  const svg = flowCanvas.querySelector("#flowConnectorSvg");
  const layer = flowCanvas.querySelector("#flowConnectorLayer");
  const nodeElements = [...flowCanvas.querySelectorAll(".flow-node")]
    .sort((a, b) => Number(a.dataset.flowIndex || 0) - Number(b.dataset.flowIndex || 0));

  if (!stage || !svg || !layer || nodeElements.length < 2) return;

  const stageRect = stage.getBoundingClientRect();
  const width = Math.max(1, stageRect.width);
  const height = Math.max(1, stageRect.height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  layer.replaceChildren();

  for (let index = 0; index < nodeElements.length - 1; index += 1) {
    const startNode = nodeElements[index];
    const endNode = nodeElements[index + 1];
    const pathData = buildConnectorPath(startNode, endNode, stageRect);
    const state = getConnectorState(startNode, endNode);
    appendConnectorPath(layer, pathData, state, index);
  }
}

function buildConnectorPath(startNode, endNode, stageRect) {
  const startRect = startNode.getBoundingClientRect();
  const endRect = endNode.getBoundingClientRect();
  const startCenter = rectCenter(startRect);
  const endCenter = rectCenter(endRect);
  const start = edgePointToward(startRect, endCenter, stageRect);
  const end = edgePointToward(endRect, startCenter, stageRect);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const curve = Math.max(42, Math.min(160, Math.hypot(dx, dy) * 0.38));
  const horizontal = Math.abs(dx) >= Math.abs(dy);
  const c1 = horizontal
    ? { x: start.x + Math.sign(dx || 1) * curve, y: start.y }
    : { x: start.x, y: start.y + Math.sign(dy || 1) * curve };
  const c2 = horizontal
    ? { x: end.x - Math.sign(dx || 1) * curve, y: end.y }
    : { x: end.x, y: end.y - Math.sign(dy || 1) * curve };
  return `M ${round(start.x)} ${round(start.y)} C ${round(c1.x)} ${round(c1.y)}, ${round(c2.x)} ${round(c2.y)}, ${round(end.x)} ${round(end.y)}`;
}

function rectCenter(rect) {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}

function edgePointToward(rect, targetCenter, stageRect) {
  const center = rectCenter(rect);
  const dx = targetCenter.x - center.x;
  const dy = targetCenter.y - center.y;
  const halfW = rect.width / 2;
  const halfH = rect.height / 2;
  const scaleX = dx ? halfW / Math.abs(dx) : Infinity;
  const scaleY = dy ? halfH / Math.abs(dy) : Infinity;
  const scale = Math.min(scaleX, scaleY, 1);
  return {
    x: center.x + dx * scale - stageRect.left,
    y: center.y + dy * scale - stageRect.top
  };
}

function appendConnectorPath(layer, pathData, state, index) {
  const ns = "http://www.w3.org/2000/svg";
  const group = document.createElementNS(ns, "g");
  group.setAttribute("class", `flow-connector ${state}`);

  const base = document.createElementNS(ns, "path");
  base.setAttribute("class", "flow-connector-base");
  base.setAttribute("d", pathData);
  base.setAttribute("marker-end", "url(#flowArrowHead)");

  const signal = document.createElementNS(ns, "path");
  signal.setAttribute("class", "flow-connector-signal");
  signal.setAttribute("d", pathData);
  signal.style.animationDelay = `${index * -0.18}s`;

  const dot = document.createElementNS(ns, "circle");
  dot.setAttribute("class", "flow-connector-dot");
  dot.setAttribute("r", state === "error" ? "5.5" : "4.8");

  const motion = document.createElementNS(ns, "animateMotion");
  motion.setAttribute("dur", "2.8s");
  motion.setAttribute("begin", `${index * 0.28}s`);
  motion.setAttribute("repeatCount", "indefinite");
  motion.setAttribute("path", pathData);
  dot.appendChild(motion);

  group.append(base, signal, dot);
  layer.appendChild(group);
}

function getConnectorState(startNode, endNode) {
  if (startNode.classList.contains("error") || endNode.classList.contains("error")) return "error";
  if (startNode.classList.contains("warn") || endNode.classList.contains("warn")) return "warn";
  if (startNode.classList.contains("live") || endNode.classList.contains("live")) return "live";
  return "ok";
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function flowIssueLabel(status) {
  if (status === "error") return "Error";
  if (status === "warn") return "Check";
  return "";
}

function toFlowStatus(status) {
  if (status === "ready") return "ok";
  if (status === "quota_wait" || status === "limited") return "warn";
  if (status === "missing") return "error";
  return "idle";
}

function flowStatusLabel(status) {
  const labels = {
    ok: "يعمل",
    live: "يعمل الآن",
    warn: "بحاجة انتباه",
    error: "مشكلة",
    idle: "غير معروف"
  };
  return labels[status] || labels.idle;
}

async function refreshFromFeeds() {
  refreshButton.disabled = true;
  refreshButton.textContent = "جاري الجلب...";
  await fetchJson("/api/refresh");
  await loadArticles();
  await loadApiUsage();
  await loadGeminiCountdown();
  refreshButton.disabled = false;
  refreshButton.textContent = "تحديث";
}

async function refreshStrikeAlerts() {
  if (!refreshAlertsButton) return;
  refreshAlertsButton.disabled = true;
  refreshAlertsButton.textContent = "جاري فحص الإنذارات...";

  const result = await fetchJson("/api/admin/strike-alerts/refresh", { method: "POST" });
  const count = Array.isArray(result.alerts) ? result.alerts.length : 0;

  if (result.ok) {
    refreshAlertsButton.textContent = count ? `تم: ${formatEnglishNumber(count)} إنذار` : "لا إنذارات جديدة";
    signalStrikeAlertsRefresh(count);
    if (warRoomModal?.open) await loadWarRoom();
  } else {
    refreshAlertsButton.textContent = "فشل التحديث";
  }

  window.setTimeout(() => {
    refreshAlertsButton.disabled = false;
    refreshAlertsButton.textContent = "تحديث الإنذارات";
  }, 2400);
}

window.addEventListener("resize", scheduleFlowConnectorDraw);

function renderStats() {
  totalArticles.textContent = formatEnglishNumber(articles.length);
  totalViews.textContent = formatEnglishNumber(articles.reduce((sum, article) => sum + Number(article.views || 0), 0));
  lastUpdated.textContent = formatBremenTime(new Date());
}

function renderApiUsage(data) {
  if (!apiUsageGrid) return;
  const services = Array.isArray(data.services) ? data.services : [];
  apiUsageUpdated.textContent = data.generatedAt ? formatDateTime(data.generatedAt) : "--";
  apiUsageNote.textContent = data.note || "";
  apiUsageGrid.innerHTML = services.map((service) => {
    const status = getServiceStatus(service);
    const keyRows = Array.isArray(service.keys) && service.keys.length
      ? service.keys.map((key) => `
          <li>
            <span>${escapeHtml(key.label)}</span>
            <strong class="api-status ${escapeHtml(key.status || "unknown")}">${statusLabel(key.status)}</strong>
            ${key.pausedUntil ? `<small>يرجع بعد ${formatDuration(key.resumesInSeconds)}</small>` : ""}
          </li>
        `).join("")
      : `<li><span>بدون مفتاح</span><strong class="api-status ready">لا يحتاج token</strong></li>`;

    return `
      <article class="api-card ${status}">
        <div class="api-card-top">
          <div>
            <span>${escapeHtml(service.name)}</span>
            <strong>${service.configured ? "مربوط" : "غير مربوط"}</strong>
          </div>
          <b>${statusLabel(status)}</b>
        </div>
        <ul class="api-keys">${keyRows}</ul>
        <div class="api-metrics">
          ${renderUsageMetrics(service.used)}
        </div>
        <p class="api-remaining">المتبقي: ${escapeHtml(service.remaining || "غير متاح")}</p>
        ${service.lastError ? `<p class="api-error">${escapeHtml(service.lastError.message)}</p>` : ""}
      </article>
    `;
  }).join("");
}

function getServiceStatus(service) {
  if (!service.configured) return "missing";
  const keys = Array.isArray(service.keys) ? service.keys : [];
  if (keys.some((key) => key.status === "ready")) return "ready";
  if (keys.some((key) => key.status === "quota_wait")) return "quota_wait";
  if (keys.some((key) => key.status === "limited")) return "limited";
  return "ready";
}

function renderUsageMetrics(used = {}) {
  const entries = Object.entries(used).filter(([, value]) => value !== null && value !== undefined && value !== "");
  if (!entries.length) return `<span>لا توجد بيانات استخدام محلية بعد</span>`;
  return entries.map(([key, value]) => `
    <span><b>${metricLabel(key)}</b>${escapeHtml(formatMetricValue(value))}</span>
  `).join("");
}

function metricLabel(key) {
  const labels = {
    calls: "طلبات",
    failures: "أخطاء",
    promptTokens: "Prompt tokens",
    outputTokens: "Output tokens",
    totalTokens: "Total tokens",
    localRequests: "محاولات محلية",
    localErrors: "أخطاء محلية",
    cached: "Cache",
    lastFetch: "آخر جلب"
  };
  return labels[key] || key;
}

function formatMetricValue(value) {
  if (typeof value === "boolean") return value ? "نعم" : "لا";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) return formatDateTime(value);
  return value;
}

function statusLabel(status) {
  const labels = {
    ready: "جاهز",
    limited: "محدود",
    quota_wait: "Quota wait",
    missing: "ناقص",
    unknown: "غير معروف"
  };
  return labels[status] || labels.unknown;
}

function formatDuration(seconds = 0) {
  const mins = Math.ceil(Number(seconds || 0) / 60);
  if (mins <= 1) return "أقل من دقيقة";
  if (mins < 60) return `${mins} دقيقة`;
  return `${Math.ceil(mins / 60)} ساعة`;
}

function formatCountdownClock(seconds = 0) {
  const total = Math.max(0, Number(seconds || 0));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = Math.floor(total % 60);
  const pad = (value) => String(value).padStart(2, "0");
  return hours ? `${pad(hours)}:${pad(minutes)}:${pad(secs)}` : `${pad(minutes)}:${pad(secs)}`;
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    hourCycle: "h23",
    timeZone: BREMEN_TIME_ZONE
  }).format(new Date(value));
}

function formatBremenTime(value) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: BREMEN_TIME_ZONE
  }).format(new Date(value));
}

function formatEnglishNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function renderTable() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const filtered = articles.filter((article) => {
    const matchesCategory = category === "all" || article.category === category;
    const matchesSearch = !query || `${article.title} ${article.body} ${article.source}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  emptyState.textContent = articles.length
    ? "لا توجد أخبار مطابقة للبحث أو التصنيف"
    : "لا توجد أخبار منشورة حالياً. اضغط تحديث لجلب أخبار جديدة، أو انتظر عودة حصة Gemini إذا كان يعطي quota exceeded.";
  emptyState.classList.toggle("show", filtered.length === 0);
  articlesTable.innerHTML = filtered.map((article) => `
    <tr>
      <td class="title-cell">${escapeHtml(article.title)}</td>
      <td><span class="pill">${escapeHtml(article.category)}</span></td>
      <td>${escapeHtml(article.source || "--")}</td>
      <td>${renderFactCheckCell(article)}</td>
      <td><span class="views">${Number(article.views || 0)}</span></td>
      <td>
        <div class="row-actions">
          <button type="button" data-action="view" data-id="${escapeHtml(article.id)}">View</button>
          <button type="button" class="image" data-action="image" data-id="${escapeHtml(article.id)}">Images</button>
          <button type="button" class="edit" data-action="edit" data-id="${escapeHtml(article.id)}">Edit</button>
          <button type="button" class="delete" data-action="delete" data-id="${escapeHtml(article.id)}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");

  articlesTable.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => handleAction(button.dataset.action, button.dataset.id));
  });
}

function renderFactCheckCell(article) {
  const fact = normalizeFactCheck(article.factCheck);
  const flags = fact.flags.slice(0, 2).map((flag) => `<span>${escapeHtml(flag.label || flag.type || "")}</span>`).join("");
  return `
    <div class="fact-check ${escapeHtml(fact.status)}">
      <strong>${formatEnglishNumber(fact.score)}%</strong>
      <em>${escapeHtml(fact.label)}</em>
      ${flags ? `<div class="fact-flags">${flags}</div>` : ""}
    </div>
  `;
}

function normalizeFactCheck(fact = {}) {
  const score = Number.isFinite(Number(fact.score)) ? Number(fact.score) : 0;
  const status = ["pass", "review", "block"].includes(fact.status) ? fact.status : score >= 75 ? "pass" : score >= 60 ? "review" : "block";
  return {
    score,
    status,
    label: fact.label || (status === "pass" ? "موثوق" : status === "review" ? "مراجعة" : "محجوب"),
    flags: Array.isArray(fact.flags) ? fact.flags : []
  };
}

function handleAction(action, id) {
  const article = articles.find((item) => String(item.id) === String(id));
  if (!article) return;
  if (action === "view") viewArticle(article);
  if (action === "image") openImageDesk(article);
  if (action === "edit") editArticle(article);
  if (action === "delete") deleteArticle(article);
}

async function openImageDesk(article) {
  if (!imageDeskModal || !imageDeskBody) return;
  imageDeskBody.innerHTML = `
    <div class="image-desk-loading">
      <strong>${escapeHtml(article.title)}</strong>
      <span>عم نبحث عن أفضل 3 اقتراحات للصورة...</span>
    </div>
  `;
  imageDeskModal.showModal();
  const data = await fetchJson(`/api/admin/articles/${encodeURIComponent(article.id)}/image-suggestions`);
  if (data.error || !Array.isArray(data.suggestions)) {
    imageDeskBody.innerHTML = `<div class="image-desk-loading"><strong>تعذر جلب الاقتراحات</strong><span>${escapeHtml(data.error || "Network error")}</span></div>`;
    return;
  }
  renderImageDesk(article, data.suggestions);
}

function renderImageDesk(article, suggestions) {
  imageDeskBody.innerHTML = `
    <div class="image-desk-title">
      <span>${article.imageUrl ? "الصورة الحالية موجودة، فيك تبدّلها" : "هذا الخبر بلا صورة، اختر واحدة للنشر"}</span>
      <strong>${escapeHtml(article.title)}</strong>
    </div>
    <div class="image-suggestions">
      ${suggestions.map((suggestion) => `
        <article class="image-suggestion ${suggestion.available ? "" : "unavailable"}">
          <div class="image-preview">
            ${suggestion.available ? `<img src="${escapeHtml(suggestion.previewUrl || suggestion.url)}" alt="${escapeHtml(suggestion.label)}" onerror="this.closest('.image-suggestion').classList.add('unavailable'); this.remove();" />` : `<span>لا توجد صورة</span>`}
          </div>
          <div class="image-suggestion-body">
            <strong>${escapeHtml(suggestion.label)}</strong>
            <p>${escapeHtml(suggestion.note || "")}</p>
            <button type="button" data-image-url="${escapeHtml(suggestion.url || "")}" ${suggestion.available ? "" : "disabled"}>Apply</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;

  imageDeskBody.querySelectorAll("[data-image-url]").forEach((button) => {
    button.addEventListener("click", () => applyImageSuggestion(article, button.dataset.imageUrl));
  });
}

async function applyImageSuggestion(article, imageUrl) {
  if (!imageUrl) return;
  const result = await fetchJson(`/api/admin/articles/${encodeURIComponent(article.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: article.title,
      category: article.category,
      body: article.body,
      dimensions: article.dimensions || "",
      imageUrl
    })
  });

  if (result.ok) {
    imageDeskModal?.close();
    await loadArticles();
  }
}

function viewArticle(article) {
  const fact = normalizeFactCheck(article.factCheck);
  modalTitle.textContent = article.title;
  modalBody.innerHTML = `
    <p><strong>التصنيف:</strong> ${escapeHtml(article.category)} | <strong>الزيارات:</strong> ${Number(article.views || 0)}</p>
    <div class="fact-detail ${escapeHtml(fact.status)}">
      <strong>Fact Check: ${formatEnglishNumber(fact.score)}% - ${escapeHtml(fact.label)}</strong>
      ${fact.flags.length ? `<ul>${fact.flags.map((flag) => `<li>${escapeHtml(flag.label || flag.type || "")}</li>`).join("")}</ul>` : "<span>لا توجد ملاحظات حرجة.</span>"}
    </div>
    <h3>متن الخبر</h3>
    ${article.imageUrl ? `<img class="modal-image" src="${escapeHtml(article.imageUrl)}" alt="${escapeHtml(article.title)}" />` : ""}
    ${paragraphs(article.body)}
    ${article.dimensions ? `<h3>أبعاد المشهد</h3>${paragraphs(article.dimensions)}` : ""}
  `;
  articleModal.showModal();
}

function editArticle(article) {
  editModalTitle.textContent = "تعديل الخبر";
  editForm.elements.id.value = article.id;
  editForm.elements.title.value = article.title;
  editForm.elements.category.value = article.category;
  editForm.elements.imageUrl.value = article.imageUrl || "";
  editForm.elements.body.value = article.body || "";
  editForm.elements.dimensions.value = article.dimensions || "";
  editModal.showModal();
}

function addArticle() {
  editModalTitle.textContent = "إضافة خبر";
  editForm.reset();
  editForm.elements.id.value = "";
  editForm.elements.imageUrl.value = "";
  editForm.elements.category.value = "سياسة";
  editModal.showModal();
}

async function saveEdit(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(editForm).entries());
  const isNew = !data.id;
  const url = isNew ? "/api/admin/articles" : `/api/admin/articles/${encodeURIComponent(data.id)}`;
  const result = await fetchJson(url, {
    method: isNew ? "POST" : "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (result.ok) {
    editModal.close();
    await loadArticles();
    if (isNew) notifyNewsPublished(result.article?.id || data.title);
  }
}

async function deleteArticle(article) {
  const confirmed = confirm(`Delete this news?\n\n${article.title}`);
  if (!confirmed) return;
  const result = await fetchJson(`/api/admin/articles/${encodeURIComponent(article.id)}`, { method: "DELETE" });
  if (result.ok) await loadArticles();
}

async function openIdeas() {
  if (!ideasModal) return;
  resetIdeaForm();
  ideasModal.showModal();
  await loadIdeas();
}

async function loadIdeas() {
  if (!ideasList) return;
  ideasList.innerHTML = `<div class="ideas-empty">عم نحمّل الأفكار...</div>`;
  const data = await fetchJson("/api/admin/ideas");
  if (data.error) {
    ideasList.innerHTML = `<div class="ideas-empty error">تعذر تحميل الأفكار: ${escapeHtml(data.error)}</div>`;
    return;
  }
  developmentIdeas = Array.isArray(data.ideas) ? data.ideas : [];
  renderIdeas();
}

function renderIdeas() {
  if (!ideasList) return;
  if (!developmentIdeas.length) {
    ideasList.innerHTML = `<div class="ideas-empty">لا توجد أفكار محفوظة حالياً.</div>`;
    return;
  }

  ideasList.innerHTML = developmentIdeas.map((idea) => `
    <article class="idea-card">
      <div class="idea-card-head">
        <span>${escapeHtml(idea.status || "قيد التطوير")}</span>
        <small>${idea.updatedAt ? formatDateTime(idea.updatedAt) : "--"}</small>
      </div>
      <h3>${escapeHtml(idea.title)}</h3>
      <p>${escapeHtml(idea.body)}</p>
      <div class="idea-card-actions">
        <button type="button" data-idea-action="edit" data-idea-id="${escapeHtml(idea.id)}">Edit</button>
        <button type="button" class="delete" data-idea-action="delete" data-idea-id="${escapeHtml(idea.id)}">Delete</button>
      </div>
    </article>
  `).join("");

  ideasList.querySelectorAll("[data-idea-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.ideaAction;
      const id = button.dataset.ideaId;
      if (action === "edit") editIdea(id);
      if (action === "delete") deleteIdea(id);
    });
  });
}

function getIdeaInput(name) {
  return ideaForm?.querySelector(`[name="${name}"]`);
}

function getIdeaFormData() {
  return {
    id: getIdeaInput("id")?.value || "",
    title: getIdeaInput("title")?.value.trim() || "",
    status: getIdeaInput("status")?.value || "قيد التطوير",
    body: getIdeaInput("body")?.value.trim() || ""
  };
}

function resetIdeaForm() {
  if (!ideaForm) return;
  const id = getIdeaInput("id");
  const title = getIdeaInput("title");
  const status = getIdeaInput("status");
  const body = getIdeaInput("body");
  if (id) id.value = "";
  if (title) title.value = "";
  if (status) status.value = "قيد التطوير";
  if (body) body.value = "";
  if (saveIdeaButton) saveIdeaButton.textContent = "حفظ الفكرة";
}

function editIdea(id) {
  const idea = developmentIdeas.find((item) => String(item.id) === String(id));
  if (!idea || !ideaForm) return;
  getIdeaInput("id").value = idea.id;
  getIdeaInput("title").value = idea.title || "";
  getIdeaInput("status").value = idea.status || "قيد التطوير";
  getIdeaInput("body").value = idea.body || "";
  if (saveIdeaButton) saveIdeaButton.textContent = "تحديث الفكرة";
  ideaForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function saveIdea() {
  if (!ideaForm || !saveIdeaButton) return;
  const data = getIdeaFormData();
  if (!data.title || !data.body) {
    alert("اكتب عنوان الفكرة وتفاصيلها قبل الحفظ.");
    return;
  }

  const isEdit = Boolean(data.id);
  const url = isEdit ? `/api/admin/ideas/${encodeURIComponent(data.id)}` : "/api/admin/ideas";
  saveIdeaButton.disabled = true;
  saveIdeaButton.textContent = isEdit ? "عم نحدّث..." : "عم نحفظ...";
  const result = await fetchJson(url, {
    method: isEdit ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  saveIdeaButton.disabled = false;

  if (!result.ok) {
    alert(result.error || "تعذر حفظ الفكرة.");
    saveIdeaButton.textContent = isEdit ? "تحديث الفكرة" : "حفظ الفكرة";
    return;
  }

  resetIdeaForm();
  await loadIdeas();
}

async function deleteIdea(id) {
  const idea = developmentIdeas.find((item) => String(item.id) === String(id));
  if (!idea) return;
  const confirmed = confirm(`Delete this idea?\n\n${idea.title}`);
  if (!confirmed) return;
  const result = await fetchJson(`/api/admin/ideas/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (result.ok) {
    if (getIdeaInput("id")?.value === id) resetIdeaForm();
    await loadIdeas();
  }
}

async function fetchJson(url, options) {
  try {
    const response = await fetch(url, options);
    return await response.json();
  } catch {
    return { ok: false, error: "Network error" };
  }
}

function paragraphs(text) {
  return String(text || "")
    .split(/\n{2,}|(?<=\.)\s+(?=[\u0600-\u06FF])/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function notifyNewsPublished(id) {
  const payload = JSON.stringify({
    id: id || Date.now(),
    at: Date.now(),
    source: "admin"
  });
  try {
    localStorage.setItem("abaad-news-published", payload);
  } catch {}
  newsChannel?.postMessage(payload);
}

function signalStrikeAlertsRefresh(count = 0) {
  const payload = JSON.stringify({
    type: "strike-alerts",
    count,
    at: Date.now(),
    source: "admin"
  });
  try {
    localStorage.setItem("abaad-strike-alerts-refresh", payload);
  } catch {}
  newsChannel?.postMessage(payload);
}
