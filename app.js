const CATEGORIES = [
  { key: "all", label: "الكل" },
  { key: "alerts", label: "إنذارات قبل القصف", special: true },
  { key: "hebrew", label: "النافذة العبرية", className: "hebrew-tab" },
  { key: "سياسة", label: "سياسة" },
  { key: "أمن", label: "أمن" },
  { key: "اقتصاد", label: "اقتصاد" },
  { key: "فن", label: "فن" },
  { key: "رياضة", label: "رياضة" },
  { key: "دولي", label: "دولي" }
];

const HEBREW_CATEGORY = "النافذة العبرية";
const UI_TEXT = {
  ar: {
    siteTitle: "أبعاد المشهد",
    siteTagline: "حيث يبدأ الخبر",
    livePrices: "الأسعار المباشرة",
    services: "خدمات",
    about: "من نحن؟",
    privacy: "سياسة الخصوصية",
    terms: "شروط الاستخدام",
    contact: "اتصل بنا",
    field: "من الميدان",
    tv: "شاشة لبنان",
    mostRead: "الأكثر قراءة",
    weatherCity: "بيروت 19°C",
    weatherDesc: "مشمس لغائم",
    loading: "بانتظار معالجة الأخبار عبر الذكاء الاصطناعي...",
    loadingHebrew: "بانتظار ترجمة أخبار النافذة العبرية عبر الذكاء الاصطناعي...",
    by: "بواسطة: أبعاد المشهد",
    now: "الآن",
    minuteAgo: "منذ {n} دقيقة",
    hourAgo: "منذ {n} ساعة",
    dayAgo: "منذ {n} يوم",
    quickRead: "قراءة سريعة",
    oneMinute: "دقيقة واحدة",
    deepRead: "أبعاد المشهد",
    fiveMinutes: "5 دقائق",
    articleBody: "متن الخبر",
    dimensions: "أبعاد المشهد",
    sourceComparison: "مقارنة المصادر",
    quickSummary: "الخلاصة السريعة",
    backHome: "→ العودة للرئيسية",
    breaking: "عاجل",
    noMostRead: "بانتظار الأخبار الأكثر قراءة...",
    askToggle: "اسأل المشهد",
    askTitle: "اسأل المشهد",
    askIntro: "اسأل عن آخر الأخبار المنشورة على أبعاد المشهد، والجواب يبنى فقط على قاعدة أخبار الموقع.",
    askPlaceholder: "مثلاً: شو ملخص الوضع الأمني بالجنوب؟",
    askSend: "إرسال",
    askHello: "أهلاً. اسألني عن الأخبار المنشورة على أبعاد المشهد، مثل: ما آخر تطورات الجنوب؟ أو ما أبرز أخبار النافذة العبرية؟",
    askLimit: "وصلت للحد التجريبي اليومي: 5 أسئلة. جرّب من جديد بكرا، أو تابع الأخبار مباشرة من الصفحة.",
    askRemaining: "متبقي {n} من {limit} أسئلة مجانية اليوم",
    titleSuffix: "أخبار لبنان الآن"
  }
};

const LIVE_TV_CHANNELS = [
  { name: "المنار", network: "Al Manar", url: "https://icanlive.tv/live/8786/al-manar.html", streamUrl: "https://edge.fastpublish.me/live/index.m3u8", type: "hls" },
  { name: "الميادين", network: "Al Mayadeen", url: "https://icanlive.tv/live/13052/al-mayadeen.html", streamUrl: "https://mdnlv.cdn.octivid.com/almdn/smil:mpegts.stream.smil/playlist.m3u8", type: "hls" },
  { name: "OTV", network: "Orange TV", url: "https://icanlive.tv/live/10534/orange-tv-otv.html", streamUrl: "https://otv.hibridcdn.net/otv/tv_abr/otv/tv_240p/chunks.m3u8", type: "hls", useProxy: true },
  { name: "تلفزيون لبنان", network: "Tele Liban", url: "https://icanlive.tv/live/16463/tele-liban.html", streamUrl: "https://cdn.catiacast.video/abr/ed8f807e2548db4507d2a6f4ba0c4a06/playlist.m3u8", type: "hls" },
  { name: "MTV Lebanon", network: "MTV Lebanon", url: "http://venolie.com/navo/view/p/mtv.php", streamUrl: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mtv-lebanon/b8ebb2a5affb812f1541712adde10e26/index.m3u8", type: "hls" },
  { name: "المشهد", network: "Al Mashhad TV", url: "http://venolie.com/navo/view/p/almashhad.php", embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCWnBTuzUUDpKhJPGuDQMynA&autoplay=1&mute=1&playsinline=1&rel=0", type: "iframe" },
  { name: "صوت لبنان", network: "Voice of Lebanon TV", url: "http://venolie.com/navo/view/p/vdl24.php", streamUrl: "https://svs.itworkscdn.net/vdltvlive/vdltv.smil/vdltvpublish/vdltv/chunks.m3u8", type: "hls" },
  { name: "الحدث", network: "Al Hadath", url: "http://venolie.com/navo/view/p/lbc.php", streamUrl: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-hadath/2ff87ec4c2f3ede35295a20637d9f8fd/index.m3u8", type: "hls" }
];

let fieldReports = [];
let fieldReportsMessage = "";
let strikeAlerts = [];
let strikeAlertsMessage = "";
let strikeAlertsAccountUrl = "https://x.com/avichayadraee";
let strikeAlertsSignature = "";
let selectedSecurityAlertKey = "";
let alertSweepTimer = null;
const activeOperationalLayerState = {
  resistance: false,
  enemy: false
};
let activeTvChannel = null;
let liveTvHls = null;
let hlsLoaderPromise = null;
let marketPrices = {
  dollar: "89,500 ل.ل",
  dollarSource: "lira-rate.com"
};

const TWO_MINUTES = 2 * 60 * 1000;
const PAGE_SIZE = 5;
const ASK_DAILY_LIMIT = 5;
let currentFilter = "all";
let visibleCount = PAGE_SIZE;
let loadingOlder = false;
let usingServerFeed = false;
let knownArticleIds = new Set();
let initialServerLoadComplete = false;
let audioUnlocked = false;
let pendingNotificationSound = false;
let lastNewsSignal = "";
let activeBreakingId = "";

let articles = [];

const BREAKING_WINDOW_MS = 2 * 60 * 60 * 1000;
const BREAKING_MIN_SCORE = 5;
const BREAKING_LABEL = "\u0639\u0627\u062c\u0644";

const tickerTrack = document.getElementById("tickerTrack");
const breakingBanner = document.getElementById("breakingBanner");
const catTabs = document.getElementById("catTabs");
const feed = document.getElementById("feed");
const fieldFeed = document.getElementById("fieldFeed");
const header = document.querySelector(".header");
const headerActions = document.getElementById("headerActions");
const headerMenuButton = document.getElementById("headerMenuButton");
const headerMenu = document.getElementById("headerMenu");
const fieldToggle = document.getElementById("fieldToggle");
const fieldLivePanel = document.getElementById("fieldLivePanel");
const fieldClose = document.getElementById("fieldClose");
const fieldBackdrop = document.getElementById("fieldBackdrop");
const mostReadList = document.getElementById("mostReadList");
const articleView = document.getElementById("articleView");
const avContent = document.getElementById("avContent");
const backButton = document.getElementById("backButton");
const liveTvButton = document.getElementById("liveTvButton");
const liveTvView = document.getElementById("liveTvView");
const liveTvClose = document.getElementById("liveTvClose");
const liveTvTitle = document.getElementById("liveTvTitle");
const liveTvStatus = document.getElementById("liveTvStatus");
const liveTvChannels = document.getElementById("liveTvChannels");
const tvPlaceholder = document.getElementById("tvPlaceholder");
const whatIfButton = document.getElementById("whatIfButton");
const scenarioView = document.getElementById("scenarioView");
const scenarioClose = document.getElementById("scenarioClose");
const scenarioForm = document.getElementById("scenarioForm");
const scenarioSelect = document.getElementById("scenarioSelect");
const scenarioDuration = document.getElementById("scenarioDuration");
const scenarioLoading = document.getElementById("scenarioLoading");
const scenarioLoadingText = document.getElementById("scenarioLoadingText");
const scenarioResults = document.getElementById("scenarioResults");
const askWidget = document.getElementById("askWidget");
const askToggle = document.getElementById("askToggle");
const askPanel = document.getElementById("askPanel");
const askClose = document.getElementById("askClose");
const askForm = document.getElementById("askForm");
const askInput = document.getElementById("askInput");
const askMessages = document.getElementById("askMessages");
const askCounter = document.getElementById("askCounter");
const newsChannel = "BroadcastChannel" in window ? new BroadcastChannel("abaad-news-updates") : null;

function init() {
  applySiteLanguage();
  renderTicker();
  loadMarketPrices();
  loadFieldReports();
  loadStrikeAlerts();
  renderTabs();
  renderLiveTvChannels();
  initAskWidget();
  loadServerArticles().then(renderFeed);
  backButton.addEventListener("click", closeArticle);
  headerMenuButton?.addEventListener("click", toggleHeaderMenu);
  fieldToggle?.addEventListener("click", () => {
    closeHeaderMenu();
    openFieldPanel();
  });
  fieldClose?.addEventListener("click", closeFieldPanel);
  fieldBackdrop?.addEventListener("click", closeFieldPanel);
  liveTvButton?.addEventListener("click", () => {
    closeHeaderMenu();
    openLiveTv();
  });
  liveTvClose?.addEventListener("click", closeLiveTv);
  liveTvView?.addEventListener("click", (event) => {
    if (event.target === liveTvView) closeLiveTv();
  });
  whatIfButton?.addEventListener("click", () => {
    closeHeaderMenu();
    openScenarioSimulator();
  });
  scenarioClose?.addEventListener("click", closeScenarioSimulator);
  scenarioView?.addEventListener("click", (event) => {
    if (event.target === scenarioView) closeScenarioSimulator();
  });
  scenarioForm?.addEventListener("submit", submitScenarioSimulation);
  breakingBanner?.addEventListener("click", () => {
    if (activeBreakingId) openArticle(activeBreakingId);
  });
  breakingBanner?.addEventListener("keydown", (event) => {
    if (!activeBreakingId || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    openArticle(activeBreakingId);
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeHeaderMenu();
    if (event.key === "Escape" && askWidget?.classList.contains("open")) closeAskWidget();
    if (event.key === "Escape" && liveTvView?.classList.contains("open")) closeLiveTv();
    if (event.key === "Escape" && scenarioView?.classList.contains("open")) closeScenarioSimulator();
    if (event.key === "Escape" && fieldLivePanel?.classList.contains("open")) closeFieldPanel();
  });
  document.addEventListener("click", (event) => {
    if (!headerActions?.contains(event.target) && !headerMenu?.contains(event.target)) closeHeaderMenu();
  });
  window.addEventListener("pointerdown", unlockNotificationSound, { once: true });
  window.addEventListener("keydown", unlockNotificationSound, { once: true });
  window.addEventListener("scroll", handleInfiniteScroll, { passive: true });
  window.addEventListener("storage", handleNewsStorageSignal);
  newsChannel?.addEventListener("message", (event) => handleNewsSignal(event.data));
  setInterval(updateNewStates, 30000);
  setInterval(updateBreakingBanner, 30000);
  setInterval(loadServerArticles, 10000);
  setInterval(loadFieldReports, 60000);
  setInterval(loadStrikeAlerts, 60000);
  setInterval(loadMarketPrices, 2 * 60 * 1000);
}

function toggleHeaderMenu() {
  const isOpen = headerMenu?.classList.toggle("open");
  header?.classList.toggle("menu-open", Boolean(isOpen));
  headerMenuButton?.classList.toggle("open", Boolean(isOpen));
  headerMenuButton?.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

function closeHeaderMenu() {
  headerMenu?.classList.remove("open");
  header?.classList.remove("menu-open");
  headerMenuButton?.classList.remove("open");
  headerMenuButton?.setAttribute("aria-expanded", "false");
}

function openScenarioSimulator() {
  scenarioView?.classList.add("open");
  scenarioView?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => scenarioSelect?.focus(), 80);
}

function closeScenarioSimulator() {
  scenarioView?.classList.remove("open");
  scenarioView?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

async function submitScenarioSimulation(event) {
  event.preventDefault();
  if (!scenarioForm || !scenarioSelect || !scenarioDuration || !scenarioResults) return;

  const scenario = scenarioSelect.value;
  const duration = scenarioDuration.value;
  setScenarioBusy(true);
  renderScenarioLoadingStep(0);

  try {
    const response = await fetch("/api/scenario-simulator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario, duration })
    });
    const data = await response.json();
    if (!response.ok || data.ok === false) throw new Error(data.error || "تعذر تشغيل المحاكي.");
    renderScenarioResults(data.result || {}, data.mode || "local");
  } catch (error) {
    renderScenarioError(error.message || "تعذر تشغيل المحاكي حالياً.");
  } finally {
    setScenarioBusy(false);
  }
}

function setScenarioBusy(isBusy) {
  if (scenarioLoading) scenarioLoading.hidden = !isBusy;
  scenarioForm?.querySelectorAll("select, button").forEach((item) => {
    item.disabled = isBusy;
  });
}

function renderScenarioLoadingStep(index) {
  if (!scenarioLoadingText || scenarioLoading.hidden) return;
  const steps = [
    "جاري استدعاء البيانات الجيوسياسية...",
    "تحليل مؤشرات السوق والتموين...",
    "محاكاة المسارات السياسية والأمنية...",
    "صياغة التقرير التحليلي..."
  ];
  scenarioLoadingText.textContent = steps[index % steps.length];
  setTimeout(() => renderScenarioLoadingStep(index + 1), 1200);
}

function renderScenarioResults(result, mode = "local") {
  if (!scenarioResults) return;
  const metrics = Array.isArray(result.metrics) ? result.metrics.slice(0, 4) : [];
  const actions = Array.isArray(result.actions) ? result.actions.slice(0, 4) : [];
  const report = result.report || "لا توجد قراءة كافية لهذا السيناريو حالياً.";
  const confidence = result.confidence ? `${Math.round(Number(result.confidence) * 100)}%` : "تقديري";

  scenarioResults.innerHTML = `
    <div class="scenario-dashboard" data-mode="${escapeHtml(mode)}">
      <div class="scenario-metrics">
        ${metrics.map(renderScenarioMetric).join("")}
      </div>
      <article class="scenario-report">
        <div class="scenario-report-top">
          <span>${mode === "ai" ? "AI Analysis" : "Local Estimate"}</span>
          <strong>ثقة القراءة: ${escapeHtml(confidence)}</strong>
        </div>
        <h3>${escapeHtml(result.title || "التقرير التحليلي الشامل")}</h3>
        ${paragraphs(report)}
        ${actions.length ? `
          <div class="scenario-actions">
            <h4>ما يجب مراقبته</h4>
            <ul>${actions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </div>
        ` : ""}
      </article>
    </div>
  `;
}

function renderScenarioMetric(metric = {}) {
  const status = metric.status || "watch";
  const value = metric.value || "قيد التقدير";
  return `
    <article class="scenario-metric ${escapeHtml(status)}">
      <span>${escapeHtml(metric.label || "مؤشر")}</span>
      <strong>${escapeHtml(value)}</strong>
      <em>${escapeHtml(metric.trend || "مراقبة")}</em>
      <p>${escapeHtml(metric.description || "")}</p>
    </article>
  `;
}

function renderScenarioError(message) {
  if (!scenarioResults) return;
  scenarioResults.innerHTML = `
    <div class="scenario-empty scenario-error">
      <strong>تعذر تشغيل المحاكي</strong>
      <span>${escapeHtml(message)}</span>
    </div>
  `;
}

function t(key, replacements = {}) {
  const template = UI_TEXT.ar[key] || key;
  return Object.entries(replacements).reduce((text, [name, value]) => {
    return text.replaceAll(`{${name}}`, String(value));
  }, template);
}

function applySiteLanguage() {
  localStorage.removeItem("abaad-site-language");
  document.documentElement.lang = "ar";
  document.documentElement.dir = "rtl";
  document.body.dir = "rtl";
  document.body.classList.add("lang-ar");

  const tickerLabel = document.querySelector(".ticker-label");
  if (tickerLabel) tickerLabel.textContent = t("livePrices");
  const headerTitle = document.querySelector(".header h1");
  if (headerTitle) headerTitle.textContent = t("siteTitle");
  const headerSubtitle = document.querySelector(".header p");
  if (headerSubtitle) headerSubtitle.textContent = t("siteTagline");
  const articleBrand = document.querySelector(".av-header span");
  if (articleBrand) articleBrand.textContent = t("siteTitle");
  if (headerMenuButton) headerMenuButton.textContent = t("services");
  if (fieldToggle) fieldToggle.textContent = t("field");
  if (liveTvButton) liveTvButton.textContent = t("tv");
  if (backButton) backButton.textContent = t("backHome");
  document.querySelectorAll('a[href="./about.html"]').forEach((link) => { link.textContent = t("about"); });
  document.querySelectorAll('a[href="./privacy.html"]').forEach((link) => { link.textContent = t("privacy"); });
  document.querySelectorAll('a[href="./terms.html"]').forEach((link) => { link.textContent = t("terms"); });
  document.querySelectorAll('a[href="./contact.html"]').forEach((link) => { link.textContent = t("contact"); });
  if (askToggle) askToggle.textContent = t("askToggle");
  if (askInput) askInput.placeholder = t("askPlaceholder");
  const askSubmit = askForm?.querySelector("button");
  if (askSubmit) askSubmit.textContent = t("askSend");

  const weatherStrong = document.querySelector(".weather-card strong");
  if (weatherStrong) weatherStrong.textContent = t("weatherCity");
  const weatherText = document.querySelector(".weather-card span");
  if (weatherText) weatherText.textContent = t("weatherDesc");
  const mostReadTitle = document.querySelector(".most-read h2");
  if (mostReadTitle) mostReadTitle.textContent = t("mostRead");

  const askHeadTitle = document.querySelector(".ask-head h2");
  if (askHeadTitle) askHeadTitle.textContent = t("askTitle");
  const askIntro = document.querySelector(".ask-intro");
  if (askIntro) askIntro.textContent = t("askIntro");
  const footerBrand = document.querySelector(".site-footer strong");
  if (footerBrand) footerBrand.textContent = t("siteTitle");
  const footerText = document.querySelector(".site-footer span");
  if (footerText) footerText.textContent = "منصة إخبارية لبنانية ذكية، حيث يبدأ الخبر.";

  document.title = `${t("siteTitle")} - ${t("titleSuffix")}`;
}

function getCategoryLabel(category) {
  return category?.label || category || "";
}

function getDisplayTitle(article) {
  return article?.title || "";
}

function getDisplayLead(article) {
  return getArticleLead(article);
}

function getDisplayTags(article) {
  return Array.isArray(article?.hashtags) ? article.hashtags : [];
}

function getDefaultReadingMode(article) {
  return "deep";
}

function firstTextParagraph(value = "") {
  return String(value || "")
    .split(/\n{2,}|(?<=\.)\s+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)[0] || "";
}

function initAskWidget() {
  if (!askWidget || !askToggle || !askForm) return;
  updateAskCounter();
  askToggle.addEventListener("click", () => {
    if (askWidget.classList.contains("open")) closeAskWidget();
    else openAskWidget();
  });
  askClose?.addEventListener("click", closeAskWidget);
  askForm.addEventListener("submit", submitAskQuestion);
}

function openAskWidget() {
  askWidget?.classList.add("open");
  askWidget?.setAttribute("aria-hidden", "false");
  askToggle?.setAttribute("aria-expanded", "true");
  if (askMessages && !askMessages.dataset.ready) {
    appendAskMessage("bot", t("askHello"));
    askMessages.dataset.ready = "1";
  }
  setTimeout(() => askInput?.focus(), 80);
}

function closeAskWidget() {
  askWidget?.classList.remove("open");
  askWidget?.setAttribute("aria-hidden", "true");
  askToggle?.setAttribute("aria-expanded", "false");
}

async function submitAskQuestion(event) {
  event.preventDefault();
  const question = askInput?.value.trim() || "";
  if (!question) return;

  const usage = getAskUsage();
  if (usage.count >= ASK_DAILY_LIMIT) {
    appendAskMessage("bot", t("askLimit"));
    updateAskCounter();
    return;
  }

  appendAskMessage("user", question);
  askInput.value = "";
  setAskBusy(true);

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "تعذر تجهيز الجواب حالياً.");
    incrementAskUsage();
    appendAskMessage("bot", data.answer || "ما لقيت جواباً كافياً حالياً.", data.sources || []);
  } catch (error) {
    appendAskMessage("bot", error.message || "صار خطأ مؤقت. جرّب بعد قليل.");
  } finally {
    setAskBusy(false);
    updateAskCounter();
  }
}

function appendAskMessage(role, text, sources = []) {
  if (!askMessages) return;
  const item = document.createElement("div");
  item.className = `ask-message ${role === "user" ? "user" : "bot"}`;
  item.textContent = text;

  if (role !== "user" && sources.length) {
    const list = document.createElement("div");
    list.className = "ask-sources";
    sources.slice(0, 3).forEach((source) => {
      const chip = document.createElement("span");
      chip.className = "ask-source-chip";
      chip.textContent = `${source.category || "خبر"}: ${source.title || ""}`;
      list.appendChild(chip);
    });
    item.appendChild(list);
  }

  askMessages.appendChild(item);
  askMessages.scrollTop = askMessages.scrollHeight;
}

function setAskBusy(isBusy) {
  if (askInput) askInput.disabled = isBusy;
  const button = askForm?.querySelector("button");
  if (button) {
    button.disabled = isBusy;
    button.textContent = isBusy ? "يفكر..." : "إرسال";
  }
}

function getAskUsageKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `abaad-ask-${year}-${month}-${day}`;
}

function getAskUsage() {
  const key = getAskUsageKey();
  const count = Number(localStorage.getItem(key) || 0);
  return { key, count: Number.isFinite(count) ? count : 0 };
}

function incrementAskUsage() {
  const usage = getAskUsage();
  localStorage.setItem(usage.key, String(usage.count + 1));
}

function updateAskCounter() {
  if (!askCounter) return;
  const remaining = Math.max(0, ASK_DAILY_LIMIT - getAskUsage().count);
  askCounter.textContent = t("askRemaining", { n: remaining, limit: ASK_DAILY_LIMIT });
}

function openFieldPanel() {
  fieldLivePanel?.classList.add("open");
  fieldLivePanel?.setAttribute("aria-hidden", "false");
  fieldBackdrop?.classList.add("open");
  fieldBackdrop?.setAttribute("aria-hidden", "false");
  document.body.classList.add("field-open");
}

function closeFieldPanel() {
  fieldLivePanel?.classList.remove("open");
  fieldLivePanel?.setAttribute("aria-hidden", "true");
  fieldBackdrop?.classList.remove("open");
  fieldBackdrop?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("field-open");
}

async function loadMarketPrices() {
  try {
    const response = await fetch("/api/market-prices");
    const data = await response.json();
    if (data?.dollar) {
      marketPrices = {
        dollar: data.dollar,
        dollarSource: data.source || "lira-rate.com"
      };
      renderTicker();
    }
  } catch {
    renderTicker();
  }
}

function renderLiveTvChannels() {
  if (!liveTvChannels) return;
  liveTvChannels.innerHTML = LIVE_TV_CHANNELS.map((channel, index) => `
    <button class="tv-channel" type="button" data-index="${index}">
      <span>${escapeHtml(channel.name)}</span>
      <small>${escapeHtml(channel.network)}</small>
    </button>
  `).join("");

  liveTvChannels.querySelectorAll(".tv-channel").forEach((button) => {
    button.addEventListener("click", () => selectTvChannel(Number(button.dataset.index)));
  });
}

function openLiveTv() {
  liveTvView?.classList.add("open");
  liveTvView?.setAttribute("aria-hidden", "false");
  document.body.classList.add("live-tv-open");
  document.body.style.overflow = "hidden";
}

function closeLiveTv() {
  stopLiveTvPlayback();
  liveTvView?.classList.remove("open");
  liveTvView?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("live-tv-open");
  if (!articleView.classList.contains("open")) document.body.style.overflow = "";
}

function selectTvChannel(index) {
  const channel = LIVE_TV_CHANNELS[index];
  if (!channel) return;
  activeTvChannel = channel;
  if (liveTvTitle) liveTvTitle.textContent = channel.name;
  if (liveTvStatus) liveTvStatus.textContent = channel.streamUrl || channel.embedUrl ? "يعمل داخل أبعاد المشهد" : "لا يوجد رابط تشغيل داخلي مباشر حالياً";

  stopLiveTvPlayback();
  if (channel.type === "iframe" && channel.embedUrl) {
    tvPlaceholder.innerHTML = `
      <iframe class="live-tv-frame" src="${escapeHtml(channel.embedUrl)}" title="${escapeHtml(channel.name)}" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>
    `;
  } else if (channel.streamUrl) {
    tvPlaceholder.innerHTML = `
      <video id="liveTvPlayer" class="live-tv-player" controls autoplay muted playsinline></video>
      <div class="tv-play-badge">Live</div>
    `;
    playHlsChannel(channel);
  } else {
    tvPlaceholder.innerHTML = `
      <strong>${escapeHtml(channel.name)}</strong>
      <span>لا يوجد رابط بث مباشر داخلي لهذه القناة حالياً.</span>
    `;
  }
  tvPlaceholder?.classList.remove("hidden");

  liveTvChannels?.querySelectorAll(".tv-channel").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.index) === index);
  });
}

function stopLiveTvPlayback() {
  if (liveTvHls) {
    liveTvHls.destroy();
    liveTvHls = null;
  }
  const player = document.getElementById("liveTvPlayer");
  if (player) {
    player.pause();
    player.removeAttribute("src");
    player.load();
  }
}

function playHlsChannel(channel) {
  const player = document.getElementById("liveTvPlayer");
  if (!player) return;
  const source = channel.useProxy ? `/api/live-tv/proxy?url=${encodeURIComponent(channel.streamUrl)}` : channel.streamUrl;
  player.muted = true;
  player.autoplay = true;
  player.playsInline = true;

  if (player.canPlayType("application/vnd.apple.mpegurl")) {
    player.src = source;
    player.play().catch(() => {});
    return;
  }

  loadHlsScript()
    .then((Hls) => {
      if (!Hls?.isSupported()) {
        showTvPlaybackError(channel);
        return;
      }
      liveTvHls = new Hls({ enableWorker: true, lowLatencyMode: true });
      liveTvHls.loadSource(source);
      liveTvHls.attachMedia(player);
      liveTvHls.on(Hls.Events.MANIFEST_PARSED, () => player.play().catch(() => {}));
      liveTvHls.on(Hls.Events.ERROR, (_event, data) => {
        if (data?.fatal) showTvPlaybackError(channel);
      });
    })
    .catch(() => showTvPlaybackError(channel));
}

function loadHlsScript() {
  if (window.Hls) return Promise.resolve(window.Hls);
  if (!hlsLoaderPromise) {
    hlsLoaderPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js";
      script.async = true;
      script.onload = () => resolve(window.Hls);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return hlsLoaderPromise;
}

function showTvPlaybackError(channel) {
  if (liveTvStatus) liveTvStatus.textContent = "تعذر تشغيل البث الآن";
  if (!tvPlaceholder) return;
  tvPlaceholder.innerHTML = `
    <strong>${escapeHtml(channel.name)}</strong>
    <span>البث موجود، لكن المشغل لم يتمكن من تحميله الآن. جرّب قناة ثانية أو أعد المحاولة بعد قليل.</span>
  `;
}

async function loadFieldReports() {
  try {
    const response = await fetch("/api/field-reports");
    const data = await response.json();
    fieldReports = Array.isArray(data.reports) ? data.reports : [];
    fieldReportsMessage = data.message || "";
  } catch {
    fieldReports = [];
    fieldReportsMessage = "";
  }
  updateFieldToggleCount();
  renderFieldFeed();
}

function updateFieldToggleCount() {
  if (!fieldToggle) return;
  fieldToggle.dataset.count = fieldReports.length ? String(Math.min(fieldReports.length, 99)) : "";
  fieldToggle.classList.toggle("has-updates", fieldReports.length > 0);
}

async function loadStrikeAlerts() {
  const previousSignature = strikeAlertsSignature;
  let nextAlerts = strikeAlerts;
  let nextMessage = strikeAlertsMessage;
  let nextAccountUrl = strikeAlertsAccountUrl;

  try {
    const response = await fetch("/api/strike-alerts");
    const data = await response.json();
    nextAlerts = Array.isArray(data.alerts) ? data.alerts : [];
    nextMessage = data.message || "";
    nextAccountUrl = data.accountUrl || "https://x.com/avichayadraee";
  } catch {
    nextAlerts = [];
    nextMessage = "";
  }

  const nextSignature = buildStrikeAlertsSignature(nextAlerts);
  strikeAlerts = nextAlerts;
  strikeAlertsMessage = nextMessage;
  strikeAlertsAccountUrl = nextAccountUrl;
  strikeAlertsSignature = nextSignature;

  if (currentFilter === "alerts" && nextSignature !== previousSignature) renderFeed();
}

function buildStrikeAlertsSignature(alerts = []) {
  return alerts.map((alert, index) => getAlertStableKey(alert, index)).join("::");
}

function getAlertStableKey(alert = {}, index = 0) {
  const areas = Array.isArray(alert.areas) ? alert.areas.join("|") : "";
  return [
    alert.id,
    alert.url,
    alert.text,
    alert.label,
    areas
  ].filter(Boolean).join("|") || `alert-${index}`;
}

function renderFieldFeed() {
  if (!fieldFeed) return;
  if (!fieldReports.length) {
    fieldFeed.innerHTML = `<div class="field-empty">${escapeHtml(fieldReportsMessage || "أضف حسابات المراسلين لعرض مباشر من الميدان.")}</div>`;
    return;
  }
  fieldFeed.innerHTML = fieldReports.map((report) => `
    <article class="field-post">
      <div class="field-avatar">${escapeHtml(report.initials)}</div>
      <div>
        <div class="field-meta">
          <a class="field-account" href="${report.url}" target="_blank" rel="noopener">${escapeHtml(report.handle)}</a>
          <span>/ ${escapeHtml(report.time)}</span>
        </div>
        <div class="field-text">${escapeHtml(report.text)}</div>
        <div class="field-actions">
          <a class="field-source" href="${report.url}" target="_blank" rel="noopener">𝕏</a>
          <span>♡</span>
          <span>↻</span>
          <span>💬</span>
        </div>
      </div>
    </article>
  `).join("");
}

function renderTicker() {
  const items = [
    ["💵 الدولار (سوق موازي):", marketPrices.dollar],
    ["⛽ بنزين 95:", "1,470,000 ل.ل"],
    ["⛽ بنزين 98:", "1,550,000 ل.ل"],
    ["🛢️ مازوت:", "1,200,000 ل.ل"],
    ["💵 الدولار (سوق موازي):", marketPrices.dollar],
    ["⛽ بنزين 95:", "1,470,000 ل.ل"],
    ["⛽ بنزين 98:", "1,550,000 ل.ل"],
    ["🛢️ مازوت:", "1,200,000 ل.ل"]
  ];

  tickerTrack.innerHTML = items
    .map(([label, value], index) => {
      const sep = index === items.length - 1 ? "" : '<span class="sep">|</span>';
      return `<span class="item">${label} <span class="val">${value}</span></span>${sep}`;
    })
    .join("");
}

function renderTabs() {
  catTabs.innerHTML = CATEGORIES.map((category) => {
    const active = category.key === currentFilter ? " active" : "";
    const special = category.special ? " alerts-tab" : "";
    const custom = category.className ? ` ${category.className}` : "";
    return `<button class="cat-tab${special}${custom}${active}" type="button" data-cat="${category.key}">${getCategoryLabel(category)}</button>`;
  }).join("");

  catTabs.querySelectorAll(".cat-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      currentFilter = tab.dataset.cat;
      visibleCount = PAGE_SIZE;
      renderTabs();
      renderFeed();
      renderMostRead();
    });
  });
}

function renderFeed() {
  if (currentFilter === "alerts") {
    renderStrikeAlerts();
    return;
  }

  const visible = getFilteredArticles().slice(0, visibleCount);

  if (!visible.length) {
    feed.innerHTML = `<div class="loading">${currentFilter === "hebrew" ? t("loadingHebrew") : t("loading")}</div>`;
    return;
  }

  feed.innerHTML = visible.map(renderCard).join("");
  feed.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => openArticle(card.dataset.id, card));
  });
}

function renderStrikeAlerts() {
  const mapEvents = buildLebanonLiveMapEvents(strikeAlerts);
  const alertCount = strikeAlerts.length;
  const statusText = alertCount ? `${alertCount} تحديث مباشر` : "بانتظار الربط الحي";

  feed.innerHTML = `
    <section class="alerts-map security-map-shell" aria-label="إنذارات قبل القصف">
      <div class="alerts-hero">
        <div>
          <span class="alerts-kicker">رصد ميداني حساس</span>
          <h2>خريطة لبنان الأمنية الحية</h2>
          <p>خريطة جغرافية تفاعلية تعرض الإنذارات والاستهدافات المؤكدة فقط، مع تصنيف زمني واضح حتى لا تتحول الصفحة إلى ضجيج بصري.</p>
        </div>
        <a class="alerts-source" href="${escapeHtml(strikeAlertsAccountUrl)}" target="_blank" rel="noopener">حساب المصدر</a>
      </div>

      <div class="live-security-map">
        <div class="security-map-toolbar" aria-label="فلتر المناطق">
          <button class="security-region-btn active" type="button" data-region="all">كل لبنان</button>
          <button class="security-region-btn" type="button" data-region="south">الجنوب</button>
          <button class="security-region-btn" type="button" data-region="bekaa">البقاع</button>
          <button class="security-region-btn" type="button" data-region="dahiyeh">الضاحية الجنوبية</button>
          <button class="security-layer-toggle resistance" type="button" data-layer="resistance" aria-pressed="false">
            <span class="layer-toggle-dot"></span>
            عمليات المقاومة
          </button>
          <button class="security-layer-toggle enemy" type="button" data-layer="enemy" aria-pressed="false">
            <span class="layer-toggle-dot"></span>
            تحركات وتموضع الجيش الإسرائيلي
          </button>
        </div>

        <div class="security-map-status">
          <span><span class="security-live-dot"></span><strong>${escapeHtml(statusText)}</strong></span>
          <div class="security-map-legend" aria-label="حالات المؤشرات">
            <span class="active-warning">إخلاء فوري</span>
            <span class="recent-strike">استهداف قريب</span>
            <span class="past-strike">أرشيف اليوم</span>
          </div>
        </div>

        <div class="security-map-layout">
          <div class="security-map-viewport" id="securityMapViewport">
            <div class="security-real-map" id="securityRealMap" aria-label="خريطة لبنان الواقعية"></div>
            <div class="ops-layer-notice" id="opsLayerNotice" hidden></div>
            <div class="security-map-fallback" id="securityMapFallback">
              <div class="security-map-stage" id="securityMapStage">
                ${renderLebanonMapBase()}
                ${renderLebanonMapMarkers(mapEvents)}
                ${renderOperationalLayerFallbackMarkers()}
              </div>
            </div>
          </div>
          <aside class="alert-drawer" id="alertDrawer" aria-live="polite" hidden></aside>
        </div>
      </div>

      ${strikeAlerts.length ? renderAlertTimeline() : renderAlertPending()}
    </section>
  `;

  initLebanonLiveMapInteractions(mapEvents);
}

const LEBANON_MAP_BOUNDS = {
  minLat: 33.02,
  maxLat: 34.72,
  minLng: 35.05,
  maxLng: 36.65
};

const LEBANON_AREA_COORDINATES = [
  ["بيروت", 33.8938, 35.5018, "beirut"],
  ["الضاحية الجنوبية", 33.8530, 35.5070, "dahiyeh"],
  ["حارة حريك", 33.8611, 35.5122, "dahiyeh"],
  ["برج البراجنة", 33.8450, 35.5000, "dahiyeh"],
  ["الحدث", 33.8340, 35.5270, "dahiyeh"],
  ["الشياح", 33.8620, 35.5270, "dahiyeh"],
  ["الغبيري", 33.8750, 35.5090, "dahiyeh"],
  ["النبطية", 33.3789, 35.4839, "south"],
  ["صور", 33.2705, 35.2038, "south"],
  ["صيدا", 33.5630, 35.3688, "south"],
  ["بنت جبيل", 33.1190, 35.4330, "south"],
  ["مرجعيون", 33.3600, 35.5920, "south"],
  ["الخيام", 33.3300, 35.6140, "south"],
  ["كفركلا", 33.2790, 35.5530, "south"],
  ["الناقورة", 33.1180, 35.1390, "south"],
  ["العديسة", 33.2640, 35.5360, "south"],
  ["الطيبة", 33.2930, 35.5060, "south"],
  ["ميس الجبل", 33.1190, 35.5150, "south"],
  ["عيتا الشعب", 33.1000, 35.3350, "south"],
  ["يارون", 33.0760, 35.4260, "south"],
  ["الزرارية", 33.4480, 35.3750, "south"],
  ["الصرفند", 33.4472, 35.2953, "south"],
  ["تفاحتا", 33.4360, 35.3300, "south"],
  ["البابلية", 33.4240, 35.3520, "south"],
  ["قعقعية الصنوبر", 33.4150, 35.3900, "south"],
  ["المروانية", 33.4070, 35.4070, "south"],
  ["السكسكية", 33.3920, 35.3480, "south"],
  ["عرنايا", 33.5350, 35.5020, "south"],
  ["عرنابة", 33.5350, 35.5020, "south"],
  ["عنقون", 33.5450, 35.4070, "south"],
  ["كفر فيلا", 33.4740, 35.4900, "south"],
  ["الغازية", 33.5170, 35.3700, "south"],
  ["أنصارية", 33.4440, 35.3480, "south"],
  ["قانا", 33.2080, 35.2980, "south"],
  ["صريفا", 33.3000, 35.3250, "south"],
  ["دير قانون", 33.2230, 35.3000, "south"],
  ["رأس العين", 33.2600, 35.2200, "south"],
  ["جنوب لبنان", 33.3333, 35.4167, "south"],
  ["البقاع", 33.8833, 36.0000, "bekaa"],
  ["زحلة", 33.8460, 35.9020, "bekaa"],
  ["رياق", 33.8550, 36.0010, "bekaa"],
  ["بعلبك", 34.0050, 36.2180, "bekaa"],
  ["الهرمل", 34.3940, 36.3850, "bekaa"]
];

const OPERATIONAL_LAYER_MAX_AGE_HOURS = 72;
const OPERATIONAL_LAYER_LIMIT = 10;

let resistanceOpsLayers = null;
let enemyDeploymentLayers = null;

function getResistanceOperationsData() {
  return buildNewsBackedOperationalLayer({
    type: "resistance_operation",
    titlePrefix: "عملية مقاومة موثقة",
    requiredAny: [
      /حزب\s*الله/,
      /المقاوم[ةه]/,
      /المقاومة\s*الإسلامية/,
      /المقاومه\s*الاسلاميه/
    ],
    include: [
      /استهدف/,
      /استهداف/,
      /قصف/,
      /صاروخ/,
      /صواريخ/,
      /مسيّرة/,
      /مسيرة/,
      /تجمع/,
      /جنود/,
      /آلية/,
      /اليات/,
      /موقع/,
      /ثكنة/,
      /قاعد[ةه]/,
      /رشقة/,
      /كمين/
    ],
    reject: [
      /تشييع/,
      /تأبين/,
      /نعى/,
      /بيان\s+نعي/
    ]
  });
}

function getEnemyDeploymentData() {
  return buildNewsBackedOperationalLayer({
    type: "enemy_deployment",
    titlePrefix: "تحرك أو تموضع إسرائيلي موثق",
    requiredAny: [
      /الجيش\s*الإسرائيلي/,
      /الجيش\s*الاسرائيلي/,
      /قوات\s*إسرائيلية/,
      /قوات\s*اسرائيلية/,
      /قوات\s*الاحتلال/,
      /العدو\s*الإسرائيلي/,
      /العدو\s*الاسرائيلي/,
      /إسرائيلي/,
      /اسرائيلي/
    ],
    include: [
      /توغل/,
      /تسلل/,
      /تموضع/,
      /تحرك/,
      /تحركات/,
      /انتشار/,
      /حشد/,
      /دبابات/,
      /آليات/,
      /اليات/,
      /جرافات/,
      /نقطة\s*عسكرية/,
      /غارة/,
      /غارات/,
      /استهدف/,
      /استهداف/,
      /قصف/,
      /مسيّرة/,
      /مسيرة/,
      /انفجار/,
      /خرق/,
      /إطلاق\s*نار/,
      /اطلاق\s*نار/,
      /خط\s*التماس/,
      /السياج/,
      /الحدود/
    ],
    reject: [
      /بيان\s+سياسي/,
      /مقابلة/,
      /تصريح/
    ]
  });
}

function buildNewsBackedOperationalLayer(config) {
  const now = Date.now();
  const seen = new Set();
  const sourceArticles = Array.isArray(articles) ? articles : [];

  return sourceArticles
    .filter((article) => article && isRenderableArticle(article))
    .map((article, index) => {
      if (isHebrewArticle(article) || !isLebaneseOperationalNewsSource(article)) return null;

      const timestamp = article.createdAt || article.publishedAt || article.updatedAt || "";
      const publishedMs = Date.parse(timestamp);
      const ageHours = Number.isFinite(publishedMs) ? (now - publishedMs) / 36e5 : Infinity;
      if (ageHours > OPERATIONAL_LAYER_MAX_AGE_HOURS) return null;

      const text = buildOperationalArticleText(article);
      if (!matchesOperationalLayerText(text, config)) return null;

      const areas = extractOperationalAreas(text);
      if (!areas.length) return null;

      const area = areas[0];
      const coords = resolveLebanonAreaCoordinates(area, { id: article.id, text }, index, 0);
      const signature = `${config.type}:${article.id || article.title}:${area}`;
      if (seen.has(signature)) return null;
      seen.add(signature);

      return {
        id: `${config.type}-${article.id || index}`,
        lat: coords.lat,
        lng: coords.lng,
        title: article.title || `${config.titlePrefix}: ${area}`,
        description: buildOperationalDescription(article, area),
        timestamp,
        type: config.type,
        source: article.source || "",
        sourceUrl: article.sourceUrl || "",
        area,
        region: coords.region,
        approximate: coords.approximate
      };
    })
    .filter(Boolean)
    .sort((a, b) => Date.parse(b.timestamp || 0) - Date.parse(a.timestamp || 0))
    .slice(0, OPERATIONAL_LAYER_LIMIT);
}

function buildOperationalArticleText(article = {}) {
  return [
    article.title,
    article.lead,
    article.summary,
    article.body,
    article.dimensions,
    article.category,
    article.section,
    article.source,
    ...(Array.isArray(article.hashtags) ? article.hashtags : [])
  ].filter(Boolean).join(" ");
}

function isLebaneseOperationalNewsSource(article = {}) {
  const source = `${article.source || ""} ${article.sourceUrl || ""}`.toLowerCase();
  if (!source.trim()) return false;
  return [
    "lbc",
    "lbcgroup",
    "lbci",
    "aljadeed",
    "newtv",
    "lebanon24",
    "lebanon 24",
    "lebanondebate",
    "lebanon debate",
    "elnashra",
    "النشرة",
    "nna",
    "national news agency",
    "almanar",
    "المنار",
    "almayadeen",
    "الميادين",
    "mtv",
    "bintjbeil",
    "بنت جبيل",
    "annahar",
    "النهار",
    "tayyar",
    "vdl",
    "voice of lebanon"
  ].some((hint) => source.includes(hint));
}

function matchesOperationalLayerText(text, config) {
  const value = normalizeArabicOperationalText(text);
  const hasRequired = !config.requiredAny?.length || config.requiredAny.some((pattern) => pattern.test(value));
  const hasSignal = !config.include?.length || config.include.some((pattern) => pattern.test(value));
  const isRejected = config.reject?.some((pattern) => pattern.test(value));
  return hasRequired && hasSignal && !isRejected;
}

function normalizeArabicOperationalText(value = "") {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractOperationalAreas(text = "") {
  const value = normalizeArabicOperationalText(text);
  return LEBANON_AREA_COORDINATES
    .map(([name]) => name)
    .filter((name) => value.includes(normalizeArabicOperationalText(name)))
    .sort((a, b) => normalizeArabicOperationalText(b).length - normalizeArabicOperationalText(a).length)
    .slice(0, 3);
}

function buildOperationalDescription(article, area) {
  const source = article.source || "مصدر إخباري لبناني";
  const summary = [article.lead, article.summary, article.body, article.dimensions, article.title]
    .map((item) => normalizeArabicOperationalText(item))
    .find(Boolean) || "";
  return `${source} · ${area} · ${summary.slice(0, 190)}${summary.length > 190 ? "..." : ""}`;
}

function buildLebanonLiveMapEvents(alerts = []) {
  const events = [];
  alerts.slice(0, 14).forEach((alert, alertIndex) => {
    const areas = Array.isArray(alert.areas) && alert.areas.length ? alert.areas : [alert.label || "تحديث ميداني"];
    const ageMinutes = getAlertAgeMinutes(alert);
    const statusCode = getSecurityStatusCode(alert, ageMinutes);
    const statusLabel = getSecurityStatusLabel(statusCode);
    const ageLabel = formatAlertAgeLabel(ageMinutes, alert.time);

    areas.slice(0, 8).forEach((area, areaIndex) => {
      if (events.length >= 24) return;
      const coords = resolveLebanonAreaCoordinates(area, alert, alertIndex, areaIndex);
      const point = projectLebanonCoordinates(coords.lat, coords.lng);
      events.push({
        id: `${getAlertStableKey(alert, alertIndex)}::${area}::${areaIndex}`,
        alert,
        area,
        statusCode,
        statusLabel,
        statusClass: statusCode.toLowerCase().replace(/_/g, "-"),
        ageLabel,
        region: coords.region,
        lat: coords.lat,
        lng: coords.lng,
        x: point.x,
        y: point.y,
        approximate: coords.approximate
      });
    });
  });
  return events;
}

function renderLebanonMapBase() {
  return `
    <svg class="lebanon-map-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="lebanonLand" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#1a3a57" />
          <stop offset="58%" stop-color="#0f2c43" />
          <stop offset="100%" stop-color="#071827" />
        </linearGradient>
        <filter id="landGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.2" flood-color="#5fb3ff" flood-opacity="0.28" />
        </filter>
      </defs>
      <rect class="map-sea" x="0" y="0" width="100" height="100" />
      <path class="map-coastline" d="M20 6 C16 15 18 23 15 31 C12 39 13 45 16 51 C19 58 17 65 19 72 C22 82 18 90 23 97" />
      <path class="lebanon-land" filter="url(#landGlow)" d="M24 5 C36 7 45 13 48 23 C52 35 63 40 67 51 C71 63 64 72 69 84 C61 92 47 98 31 96 C24 86 27 77 23 68 C18 58 19 48 22 40 C26 31 22 22 24 5 Z" />
      <path class="map-border" d="M48 23 C58 27 63 34 64 43 C67 56 75 65 70 84" />
      <path class="map-road main" d="M25 11 C28 22 25 31 28 42 C31 55 26 66 31 80 C34 88 32 93 35 96" />
      <path class="map-road" d="M31 43 C39 45 48 48 61 53" />
      <path class="map-road" d="M29 69 C39 68 48 70 64 78" />
      <circle class="map-city" cx="28" cy="33" r="1.2" />
      <text x="31" y="34">بيروت</text>
      <circle class="map-city" cx="30" cy="52" r="1.1" />
      <text x="33" y="53">صيدا</text>
      <circle class="map-city" cx="25" cy="70" r="1.1" />
      <text x="28" y="71">صور</text>
      <circle class="map-city inland" cx="54" cy="43" r="1.1" />
      <text x="57" y="44">البقاع</text>
      <text class="map-label-north" x="60" y="17">لبنان</text>
    </svg>
    <div class="map-grid-overlay" aria-hidden="true"></div>
  `;
}

function renderLebanonMapMarkers(events = []) {
  if (!events.length) {
    return `
      <div class="security-map-empty">
        <strong>لا توجد إنذارات حية موثقة الآن</strong>
        <span>الخريطة جاهزة لاستقبال أول تحديث من المصدر.</span>
      </div>
    `;
  }

  return events.map((event, index) => {
    const tooltip = `${event.area} · ${event.ageLabel} · ${event.statusLabel}`;
    return `
      <button class="security-marker ${event.statusClass}" type="button"
        data-map-index="${index}"
        data-region="${escapeHtml(event.region)}"
        data-tooltip="${escapeHtml(tooltip)}"
        style="--x:${event.x}%;--y:${event.y}%"
        aria-label="${escapeHtml(tooltip)}">
        <span class="marker-core"></span>
        <span class="marker-label">${escapeHtml(event.area)}</span>
      </button>
    `;
  }).join("");
}

function renderOperationalLayerFallbackMarkers() {
  const resistance = declutterOperationalPoints(getResistanceOperationsData(), "resistance");
  const enemy = declutterOperationalPoints(getEnemyDeploymentData(), "enemy");
  return [...resistance, ...enemy].map((item) => {
    const point = projectLebanonCoordinates(item.renderLat, item.renderLng);
    const label = item.kind === "resistance" ? "عمليات المقاومة" : "تموضع";
    return `
      <button class="ops-fallback-marker ${item.kind}" type="button"
        data-ops-layer="${item.kind}"
        style="--x:${point.x}%;--y:${point.y}%"
        title="${escapeHtml(`${label}: ${item.title}`)}"
        aria-label="${escapeHtml(`${label}: ${item.title}`)}">
        <span class="ops-fallback-icon"></span>
      </button>
    `;
  }).join("");
}

function declutterOperationalPoints(points = [], kind = "resistance") {
  const taken = [];
  return points.map((point, index) => {
    let renderLat = Number(point.lat);
    let renderLng = Number(point.lng);
    taken.forEach((other, otherIndex) => {
      const distance = Math.hypot(renderLat - other.lat, renderLng - other.lng);
      if (distance < 0.026) {
        const angle = ((index + otherIndex + 1) * 137.5) * Math.PI / 180;
        const offset = 0.018 + (index % 3) * 0.006;
        renderLat += Math.sin(angle) * offset;
        renderLng += Math.cos(angle) * offset;
      }
    });
    taken.push({ lat: renderLat, lng: renderLng });
    return { ...point, kind, renderLat, renderLng };
  });
}

function initLebanonLiveMapInteractions(events) {
  if (alertSweepTimer) {
    clearInterval(alertSweepTimer);
    alertSweepTimer = null;
  }

  const viewport = feed.querySelector("#securityMapViewport");
  const stage = feed.querySelector("#securityMapStage");
  const drawer = feed.querySelector("#alertDrawer");
  const opsNotice = feed.querySelector("#opsLayerNotice");
  const markers = [...feed.querySelectorAll(".security-marker[data-map-index]")];
  const regionButtons = [...feed.querySelectorAll(".security-region-btn")];
  const layerButtons = [...feed.querySelectorAll(".security-layer-toggle[data-layer]")];
  const fallbackOpsMarkers = [...feed.querySelectorAll(".ops-fallback-marker[data-ops-layer]")];
  let realMapController = null;

  const openByIndex = (index) => {
    const event = events[index];
    if (!event || !drawer) return;
    selectedSecurityAlertKey = event.id || "";
    markers.forEach((marker) => marker.classList.toggle("selected", Number(marker.dataset.mapIndex) === index));
    realMapController?.select(index);
    drawer.innerHTML = renderSecurityMapDrawer(event);
    drawer.hidden = false;
    drawer.querySelector(".alert-drawer-close")?.addEventListener("click", () => {
      selectedSecurityAlertKey = "";
      drawer.hidden = true;
      markers.forEach((marker) => marker.classList.remove("selected"));
      realMapController?.clearSelection();
    });
  };

  realMapController = initRealLebanonSecurityMap(events, openByIndex);

  const setRegion = (region) => {
    const config = getSecurityRegionView(region);
    if (stage) {
      stage.style.setProperty("--map-scale", config.scale);
      stage.style.setProperty("--map-x", `${config.x}%`);
      stage.style.setProperty("--map-y", `${config.y}%`);
    }
    realMapController?.setRegion(region);
    viewport?.setAttribute("data-region", region);
    regionButtons.forEach((button) => button.classList.toggle("active", button.dataset.region === region));
    markers.forEach((marker) => {
      const out = region !== "all" && marker.dataset.region !== region;
      marker.classList.toggle("out-region", out);
    });
  };

  regionButtons.forEach((button) => {
    button.addEventListener("click", () => setRegion(button.dataset.region || "all"));
  });
  setRegion("all");

  const operationalLayerCounts = {
    resistance: getResistanceOperationsData().length,
    enemy: getEnemyDeploymentData().length
  };

  const showOperationalLayerNotice = (layer) => {
    if (!opsNotice) return;
    const label = layer === "resistance" ? "عمليات المقاومة" : "تحركات الجيش الإسرائيلي";
    opsNotice.innerHTML = `
      <strong>${escapeHtml(label)}</strong>
      <span>لا توجد نقاط حديثة موثقة من مصادر لبنانية لهذه الطبقة الآن.</span>
    `;
    opsNotice.hidden = false;
    clearTimeout(showOperationalLayerNotice.timer);
    showOperationalLayerNotice.timer = setTimeout(() => {
      if (opsNotice) opsNotice.hidden = true;
    }, 4200);
  };

  const setOperationalLayer = (layer, enabled, options = {}) => {
    if (enabled && !operationalLayerCounts[layer]) {
      if (!options.silent) showOperationalLayerNotice(layer);
      enabled = false;
    }
    activeOperationalLayerState[layer] = enabled;
    layerButtons
      .filter((button) => button.dataset.layer === layer)
      .forEach((button) => {
        button.classList.toggle("active", enabled);
        button.setAttribute("aria-pressed", enabled ? "true" : "false");
      });
    fallbackOpsMarkers
      .filter((marker) => marker.dataset.opsLayer === layer)
      .forEach((marker) => marker.classList.toggle("active", enabled));
    realMapController?.setOperationalLayer(layer, enabled);
  };

  layerButtons.forEach((button) => {
    const count = operationalLayerCounts[button.dataset.layer] || 0;
    button.classList.toggle("empty", count === 0);
    button.title = count ? `${count} تحديثات موثقة من الأخبار المنشورة` : "لا توجد أخبار حديثة موثقة لهذه الطبقة الآن";
    button.addEventListener("click", () => {
      const layer = button.dataset.layer;
      const enabled = !button.classList.contains("active");
      setOperationalLayer(layer, enabled);
    });
  });
  setOperationalLayer("resistance", Boolean(activeOperationalLayerState.resistance), { silent: true });
  setOperationalLayer("enemy", Boolean(activeOperationalLayerState.enemy), { silent: true });

  if (!markers.length || !drawer || !events.length) return;

  markers.forEach((marker) => {
    marker.addEventListener("click", () => openByIndex(Number(marker.dataset.mapIndex)));
    marker.addEventListener("mouseenter", () => marker.classList.add("hovered"));
    marker.addEventListener("mouseleave", () => marker.classList.remove("hovered"));
    marker.addEventListener("keydown", (event) => {
      if (!["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      openByIndex(Number(marker.dataset.mapIndex));
    });
  });

  if (selectedSecurityAlertKey) {
    const preservedIndex = events.findIndex((event) => event.id === selectedSecurityAlertKey);
    if (preservedIndex >= 0) {
      requestAnimationFrame(() => openByIndex(preservedIndex));
    } else {
      selectedSecurityAlertKey = "";
    }
  }

  let activeIndex = -1;
  alertSweepTimer = setInterval(() => {
    if (!document.body.contains(feed) || currentFilter !== "alerts") {
      clearInterval(alertSweepTimer);
      alertSweepTimer = null;
      return;
    }
    activeIndex = (activeIndex + 1) % markers.length;
    markers.forEach((marker, index) => marker.classList.toggle("swept", index === activeIndex));
  }, 1400);
}

function initRealLebanonSecurityMap(events = [], openByIndex) {
  const container = feed.querySelector("#securityRealMap");
  const viewport = feed.querySelector("#securityMapViewport");
  if (!container || !window.L || !Array.isArray(events)) return null;

  try {
    viewport?.classList.add("leaflet-ready");
    container.innerHTML = "";

    const map = L.map(container, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: true,
      tap: true
    });

    L.control.zoom({ position: "topright" }).addTo(map);
    map.attributionControl.setPrefix("");
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      minZoom: 7,
      attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    resistanceOpsLayers = buildOperationalLeafletLayer(
      declutterOperationalPoints(getResistanceOperationsData(), "resistance"),
      "resistance"
    );
    enemyDeploymentLayers = buildOperationalLeafletLayer(
      declutterOperationalPoints(getEnemyDeploymentData(), "enemy"),
      "enemy"
    );
    const operationalLayerGroups = {
      resistance: resistanceOpsLayers,
      enemy: enemyDeploymentLayers
    };

    const layers = events.map((event, index) => {
      const marker = L.marker([event.lat, event.lng], {
        keyboard: true,
        title: event.area,
        icon: buildSecurityLeafletIcon(event)
      }).addTo(map);

      const radius = event.statusCode === "ACTIVE_WARNING"
        ? 2100
        : event.statusCode === "RECENT_STRIKE"
          ? 1700
          : 1200;
      const fillOpacity = getSecurityCircleFillOpacity(event.statusCode);
      const circle = L.circle([event.lat, event.lng], {
        radius: event.approximate ? radius * 1.18 : radius,
        className: `security-leaflet-circle ${event.statusClass}`,
        color: getSecurityMapColor(event.statusCode),
        fillColor: getSecurityMapColor(event.statusCode),
        fillOpacity,
        weight: event.statusCode === "ACTIVE_WARNING" ? 1 : 0.9
      }).addTo(map);

      marker.bindTooltip(
        `<strong>${escapeHtml(event.area)}</strong><span>${escapeHtml(event.statusLabel)} · ${escapeHtml(event.ageLabel)}</span>`,
        { direction: "top", offset: [0, -18], opacity: 0.96, className: "security-leaflet-tooltip" }
      );
      marker.on("click", () => openByIndex(index));

      return { event, index, marker, circle };
    });

    const setRegion = (region = "all") => {
      const visible = layers.filter((layer) => region === "all" || layer.event.region === region);
      layers.forEach((layer) => {
        const inRegion = region === "all" || layer.event.region === region;
        layer.marker.getElement()?.classList.toggle("out-region", !inRegion);
        layer.circle.setStyle({
          opacity: inRegion ? 0.78 : 0.12,
          fillOpacity: inRegion ? getSecurityCircleFillOpacity(layer.event.statusCode) : 0.02
        });
      });

      const bounds = visible.length
        ? L.latLngBounds(visible.map((layer) => [layer.event.lat, layer.event.lng])).pad(0.38)
        : getLeafletRegionBounds(region);
      map.fitBounds(bounds.isValid?.() === false ? getLeafletRegionBounds(region) : bounds, {
        animate: true,
        duration: 0.7,
        maxZoom: region === "dahiyeh" ? 13 : region === "south" ? 10 : 9
      });
    };

    const select = (index) => {
      layers.forEach((layer) => layer.marker.getElement()?.classList.toggle("selected", layer.index === index));
      const layer = layers.find((item) => item.index === index);
      if (!layer) return;
      map.flyTo([layer.event.lat, layer.event.lng], Math.max(map.getZoom(), layer.event.region === "dahiyeh" ? 13 : 11), {
        animate: true,
        duration: 0.55
      });
      layer.marker.openTooltip();
    };

    const clearSelection = () => {
      layers.forEach((layer) => layer.marker.getElement()?.classList.remove("selected"));
    };

    const setOperationalLayer = (layer, enabled) => {
      const group = operationalLayerGroups[layer];
      if (!group) return;
      if (enabled) {
        if (!map.hasLayer(group)) group.addTo(map);
      } else if (map.hasLayer(group)) {
        map.removeLayer(group);
      }
    };

    setTimeout(() => {
      map.invalidateSize();
      setRegion("all");
    }, 120);

    return { setRegion, select, clearSelection, setOperationalLayer };
  } catch (error) {
    viewport?.classList.remove("leaflet-ready");
    return null;
  }
}

function buildSecurityLeafletIcon(event) {
  return L.divIcon({
    className: `security-leaflet-marker ${event.statusClass}`,
    html: `
      <span class="leaflet-marker-core"></span>
      <span class="leaflet-marker-label">${escapeHtml(event.area)}</span>
    `,
    iconSize: [108, 30],
    iconAnchor: [14, 15]
  });
}

function buildOperationalLeafletLayer(points = [], kind = "resistance") {
  const group = L.layerGroup();
  points.forEach((point) => {
    const marker = L.marker([point.renderLat || point.lat, point.renderLng || point.lng], {
      keyboard: true,
      title: point.title,
      icon: buildOperationalLeafletIcon(kind)
    });
    marker.bindTooltip(renderOperationalTooltip(point, kind), {
      direction: "top",
      offset: [0, -16],
      opacity: 0.96,
      className: `ops-leaflet-tooltip ${kind}`
    });
    marker.bindPopup(renderOperationalPopup(point, kind), {
      className: `ops-leaflet-popup ${kind}`,
      closeButton: true,
      maxWidth: 280
    });
    marker.addTo(group);
  });
  return group;
}

function buildOperationalLeafletIcon(kind = "resistance") {
  const label = kind === "resistance" ? "عمليات المقاومة" : "تموضع";
  return L.divIcon({
    className: `ops-leaflet-marker ${kind}`,
    html: `
      <span class="ops-icon ${kind}" aria-hidden="true"></span>
      <span class="ops-screen-label">${escapeHtml(label)}</span>
    `,
    iconSize: [38, 34],
    iconAnchor: [19, 17]
  });
}

function renderOperationalTooltip(point, kind = "resistance") {
  const label = kind === "resistance" ? "عمليات المقاومة" : "تحركات وتموضع";
  return `<strong>${escapeHtml(label)}</strong><span>${escapeHtml(point.title || "")}</span>`;
}

function renderOperationalPopup(point, kind = "resistance") {
  const label = kind === "resistance" ? "عمليات المقاومة" : "تحركات وتموضع الجيش الإسرائيلي";
  return `
    <div class="ops-popup-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(point.title || "")}</strong>
      <p>${escapeHtml(point.description || "")}</p>
      <time>${escapeHtml(formatOperationalTimestamp(point.timestamp))}</time>
      ${point.sourceUrl ? `<a href="${escapeHtml(point.sourceUrl)}" target="_blank" rel="noopener">فتح مصدر الخبر</a>` : ""}
    </div>
  `;
}

function formatOperationalTimestamp(value = "") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return cleanup(value || "توقيت غير محدد");
  return new Intl.DateTimeFormat("ar", {
    timeZone: "Europe/Berlin",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit"
  }).format(date);
}

function getSecurityMapColor(statusCode) {
  if (statusCode === "RECENT_STRIKE") return "#f59e0b";
  if (statusCode === "PAST_STRIKE") return "#64748b";
  return "#e00000";
}

function getSecurityCircleFillOpacity(statusCode) {
  if (statusCode === "ACTIVE_WARNING") return 0.065;
  if (statusCode === "RECENT_STRIKE") return 0.085;
  return 0.045;
}

function getLeafletRegionBounds(region = "all") {
  const bounds = {
    south: [[33.03, 35.05], [33.62, 35.72]],
    bekaa: [[33.62, 35.72], [34.45, 36.55]],
    dahiyeh: [[33.81, 35.45], [33.89, 35.56]],
    beirut: [[33.83, 35.43], [33.92, 35.58]],
    all: [[33.02, 35.05], [34.72, 36.65]]
  };
  return L.latLngBounds(bounds[region] || bounds.all);
}

function renderSecurityMapDrawer(event) {
  const alert = event.alert || {};
  const areas = Array.isArray(alert.areas) && alert.areas.length
    ? alert.areas.map((area) => `<span>${escapeHtml(area)}</span>`).join("")
    : `<span>${escapeHtml(event.area)}</span>`;
  return `
    <button class="alert-drawer-close" type="button" aria-label="إغلاق">×</button>
    <span class="drawer-kicker ${event.statusClass}">${escapeHtml(event.statusLabel)}</span>
    <h3>${escapeHtml(event.area)}</h3>
    <div class="drawer-meta">
      <span>${escapeHtml(event.ageLabel)}</span>
      <span>${event.approximate ? "موقع تقريبي" : "موقع معروف"}</span>
      <span>${escapeHtml(getRegionLabel(event.region))}</span>
    </div>
    <p class="drawer-text">${escapeHtml(alert.text || "")}</p>
    <div class="drawer-analysis">
      <strong>قراءة أبعاد المشهد</strong>
      <p>${escapeHtml(buildAlertCivilAnalysis(event.area, alert, event.statusCode === "ACTIVE_WARNING" ? "hot" : event.statusCode === "RECENT_STRIKE" ? "warm" : "old"))}</p>
    </div>
    <div class="drawer-areas">${areas}</div>
    <a class="drawer-source" href="${escapeHtml(alert.url || strikeAlertsAccountUrl)}" target="_blank" rel="noopener">اقرأ التحليل الميداني ←</a>
  `;
}

function resolveLebanonAreaCoordinates(area, alert, alertIndex, areaIndex) {
  const known = findKnownAreaCoordinates(area);
  if (known) return known;
  const region = inferLebanonRegion(area, alert?.text || "");
  return getFallbackLebanonCoordinates(`${area}-${alert?.id || alert?.url || alertIndex}-${areaIndex}`, region);
}

function findKnownAreaCoordinates(area) {
  const normalized = normalizeMapAreaName(area);
  if (!normalized) return null;
  const match = LEBANON_AREA_COORDINATES.find(([name]) => {
    const key = normalizeMapAreaName(name);
    return normalized.includes(key) || key.includes(normalized);
  });
  if (!match) return null;
  return { lat: match[1], lng: match[2], region: match[3], approximate: false };
}

function getFallbackLebanonCoordinates(seed, region) {
  const centers = {
    south: { lat: 33.3333, lng: 35.4167 },
    bekaa: { lat: 33.8833, lng: 36.0000 },
    dahiyeh: { lat: 33.8530, lng: 35.5070 },
    beirut: { lat: 33.8938, lng: 35.5018 },
    all: { lat: 33.8547, lng: 35.8623 }
  };
  const selected = centers[region] || centers.all;
  return {
    lat: selected.lat,
    lng: selected.lng,
    region,
    approximate: true
  };
}

function projectLebanonCoordinates(lat, lng) {
  const x = ((lng - LEBANON_MAP_BOUNDS.minLng) / (LEBANON_MAP_BOUNDS.maxLng - LEBANON_MAP_BOUNDS.minLng)) * 100;
  const y = (1 - ((lat - LEBANON_MAP_BOUNDS.minLat) / (LEBANON_MAP_BOUNDS.maxLat - LEBANON_MAP_BOUNDS.minLat))) * 100;
  return {
    x: Math.max(6, Math.min(94, Math.round(x * 10) / 10)),
    y: Math.max(5, Math.min(95, Math.round(y * 10) / 10))
  };
}

function getSecurityStatusCode(alert, ageMinutes) {
  const text = `${alert?.text || ""} ${alert?.label || ""}`;
  const hasEvacuationWarning = /إنذار|انذار|إخلاء|اخلاء|إخلاء منازلكم|اخلاء منازلكم|سلامتكم|الابتعاد|الانتقال/.test(text);
  const hasConfirmedStrike = /قصف|غارة|غارات|استهدفت|استهدفوا|استهداف مباشر|سقوط|انفجار|مسيرة|مسيّرة|صاروخ|صواريخ/.test(text);
  if (hasEvacuationWarning && (ageMinutes == null || ageMinutes <= 24 * 60)) return "ACTIVE_WARNING";
  if (hasConfirmedStrike && (ageMinutes == null || ageMinutes <= 120)) return "RECENT_STRIKE";
  if (hasConfirmedStrike || (ageMinutes != null && ageMinutes > 24 * 60)) return "PAST_STRIKE";
  return "ACTIVE_WARNING";
}

function getSecurityStatusLabel(statusCode) {
  if (statusCode === "RECENT_STRIKE") return "تم الاستهداف قريباً";
  if (statusCode === "PAST_STRIKE") return "حدث سابق";
  return "إخلاء فوري";
}

function inferLebanonRegion(area, text = "") {
  const value = `${area || ""} ${text || ""}`;
  if (/الضاحية|حارة حريك|برج البراجنة|الحدث|الشياح|الغبيري/.test(value)) return "dahiyeh";
  if (/البقاع|بعلبك|الهرمل|زحلة|رياق/.test(value)) return "bekaa";
  if (/جنوب|صور|صيدا|النبطية|بنت جبيل|مرجعيون|الخيام|كفركلا|الناقورة|العديسة|الطيبة|ميس الجبل|عيتا|يارون|الصرفند|الغازية|قانا|صريفا/.test(value)) return "south";
  if (/بيروت/.test(value)) return "beirut";
  return "all";
}

function normalizeMapAreaName(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/^ال/, "")
    .replace(/\s+/g, "")
    .trim();
}

function getSecurityRegionView(region) {
  const views = {
    all: { scale: 1, x: 0, y: 0 },
    south: { scale: 1.65, x: 0, y: -18 },
    bekaa: { scale: 1.65, x: -15, y: -4 },
    dahiyeh: { scale: 3.1, x: 4, y: 17 }
  };
  return views[region] || views.all;
}

function getRegionLabel(region) {
  if (region === "south") return "الجنوب";
  if (region === "bekaa") return "البقاع";
  if (region === "dahiyeh") return "الضاحية";
  if (region === "beirut") return "بيروت";
  return "لبنان";
}

function renderAlertPins(pins) {
  const visiblePins = pins.length ? pins : [{
    area: "إنذار موثق",
    zone: "muted",
    x: 50,
    y: 50,
    ageLabel: "بانتظار تحديث",
    status: "قيد الربط"
  }];
  return visiblePins.slice(0, 12).map((pin, index) => {
    const tooltip = `${pin.area} · ${pin.ageLabel} · ${pin.status}`;
    return `
      <button class="alert-pin ${pin.zone}${pins.length ? "" : " muted"}" type="button"
        data-alert-index="${index}"
        data-tooltip="${escapeHtml(tooltip)}"
        style="--x:${pin.x}%;--y:${pin.y}%"
        aria-label="${escapeHtml(tooltip)}">
        <i></i>
        <b>${escapeHtml(pin.area)}</b>
      </button>
    `;
  }).join("");
}

function buildAlertRadarPins(alerts = []) {
  const pins = [];
  alerts.slice(0, 8).forEach((alert, alertIndex) => {
    const areas = Array.isArray(alert.areas) && alert.areas.length ? alert.areas : [alert.label || "تحديث"];
    const ageMinutes = getAlertAgeMinutes(alert);
    const zone = getAlertTemporalZone(ageMinutes);
    const status = getAlertCivilStatus(alert, ageMinutes);
    const ageLabel = formatAlertAgeLabel(ageMinutes, alert.time);
    const radius = zone === "hot" ? 16 : zone === "warm" ? 29 : 41;
    areas.slice(0, 6).forEach((area, areaIndex) => {
      if (pins.length >= 12) return;
      const angle = getStableAngle(`${alert.id || alert.url || alert.text || ""}-${area}-${alertIndex}-${areaIndex}`);
      pins.push({
        alert,
        area,
        zone,
        status,
        ageLabel,
        x: clampRadarPosition(50 + Math.cos(angle) * radius),
        y: clampRadarPosition(50 + Math.sin(angle) * radius)
      });
    });
  });
  return pins;
}

function initAlertRadarInteractions(pins) {
  if (alertSweepTimer) {
    clearInterval(alertSweepTimer);
    alertSweepTimer = null;
  }

  const pinButtons = [...feed.querySelectorAll(".alert-pin[data-alert-index]")];
  const drawer = feed.querySelector("#alertDrawer");
  if (!pinButtons.length || !drawer || !pins.length) return;

  const openByIndex = (index) => {
    const pin = pins[index];
    if (!pin) return;
    pinButtons.forEach((button) => button.classList.toggle("selected", Number(button.dataset.alertIndex) === index));
    drawer.innerHTML = renderAlertDrawer(pin);
    drawer.hidden = false;
    drawer.querySelector(".alert-drawer-close")?.addEventListener("click", () => {
      drawer.hidden = true;
      pinButtons.forEach((button) => button.classList.remove("selected"));
    });
  };

  pinButtons.forEach((button) => {
    button.addEventListener("click", () => openByIndex(Number(button.dataset.alertIndex)));
    button.addEventListener("keydown", (event) => {
      if (!["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      openByIndex(Number(button.dataset.alertIndex));
    });
  });

  let activeIndex = -1;
  alertSweepTimer = setInterval(() => {
    if (!document.body.contains(feed) || currentFilter !== "alerts") {
      clearInterval(alertSweepTimer);
      alertSweepTimer = null;
      return;
    }
    activeIndex = (activeIndex + 1) % pinButtons.length;
    pinButtons.forEach((button, index) => button.classList.toggle("swept", index === activeIndex));
  }, 1200);
}

function renderAlertDrawer(pin) {
  const alert = pin.alert || {};
  const areas = Array.isArray(alert.areas) && alert.areas.length
    ? alert.areas.map((area) => `<span>${escapeHtml(area)}</span>`).join("")
    : `<span>${escapeHtml(pin.area)}</span>`;
  return `
    <button class="alert-drawer-close" type="button" aria-label="إغلاق">×</button>
    <span class="drawer-kicker ${pin.zone}">${escapeHtml(pin.status)}</span>
    <h3>${escapeHtml(pin.area)}</h3>
    <div class="drawer-meta">
      <span>${escapeHtml(pin.ageLabel)}</span>
      <span>${escapeHtml(alert.label || "إنذار إخلاء")}</span>
    </div>
    <p class="drawer-text">${escapeHtml(alert.text || "")}</p>
    <div class="drawer-analysis">
      <strong>قراءة أبعاد المشهد</strong>
      <p>${escapeHtml(buildAlertCivilAnalysis(pin.area, alert, pin.zone))}</p>
    </div>
    <div class="drawer-areas">${areas}</div>
    <a class="drawer-source" href="${escapeHtml(alert.url || strikeAlertsAccountUrl)}" target="_blank" rel="noopener">فتح المصدر الأصلي</a>
  `;
}

function getAlertAgeMinutes(alert) {
  const publishedMs = Date.parse(alert?.publishedAt || "");
  if (!publishedMs) return null;
  return Math.max(0, Math.round((Date.now() - publishedMs) / 60000));
}

function getAlertTemporalZone(ageMinutes) {
  if (ageMinutes == null) return "hot";
  if (ageMinutes <= 120) return "hot";
  if (ageMinutes <= 360) return "warm";
  return "old";
}

function formatAlertAgeLabel(ageMinutes, fallback = "") {
  if (ageMinutes == null) return fallback || "الوقت غير محدد";
  if (ageMinutes < 60) return `منذ ${ageMinutes || 1} دقيقة`;
  const hours = Math.floor(ageMinutes / 60);
  const minutes = ageMinutes % 60;
  return minutes ? `منذ ${hours}س ${minutes}د` : `منذ ${hours} ساعات`;
}

function getAlertCivilStatus(alert, ageMinutes) {
  const text = `${alert?.text || ""} ${alert?.label || ""}`;
  if (/قصف|استهداف|غارة|غارات|سقوط|انفجار/.test(text)) return "تم الاستهداف";
  if (ageMinutes != null && ageMinutes <= 120) return "إنذار نشط";
  if (ageMinutes != null && ageMinutes <= 360) return "متابعة ميدانية";
  return "تحديث قديم";
}

function buildAlertCivilAnalysis(area, alert, zone) {
  const text = `${area || ""} ${alert?.text || ""}`;
  if (/الضاحية|بيروت|حارة حريك|برج البراجنة|الحدث|الشياح|الغبير/.test(text)) {
    return "الإنذار يطال نطاقاً مدنياً كثيفاً، لذلك الأولوية هنا لسرعة التحقق من المصدر ومتابعة أي حركة نزوح أو تحديث رسمي لاحق.";
  }
  if (/صور|الصرفند|الغازية|الزهراني|صيدا|الناقورة|قانا/.test(text)) {
    return "الموقع يقع ضمن خط الساحل الجنوبي، ما يجعل متابعة الوقت الفاصل بين الإنذار وأي تحديث لاحق مهمة لفهم مستوى الضغط على السكان والطرقات.";
  }
  if (/بنت جبيل|مرجعيون|الخيام|كفركلا|العديسة|الطيبة|ميس الجبل|عيता|يارون/.test(text)) {
    return "الإنذار يرتبط بحزام حدودي حساس، وتتم قراءته إخبارياً عبر توقيته وتكراره وحركة البيانات اللاحقة من دون استنتاجات ميدانية غير مؤكدة.";
  }
  return zone === "hot"
    ? "إنذار حديث يحتاج متابعة لصيقة خلال الساعات الأولى، مع إبقاء القراءة مبنية على المصدر المنشور فقط وأي تحديثات رسمية لاحقة."
    : "تحديث ضمن سجل الإنذارات الأخير، يفيد في فهم تراكم الضغط على المناطق المذكورة أكثر من كونه خبراً منفصلاً بحد ذاته.";
}

function getStableAngle(seed) {
  let hash = 0;
  for (let index = 0; index < String(seed).length; index += 1) {
    hash = ((hash << 5) - hash) + String(seed).charCodeAt(index);
    hash |= 0;
  }
  return ((Math.abs(hash) % 360) * Math.PI) / 180;
}

function clampRadarPosition(value) {
  return Math.max(8, Math.min(92, Math.round(value * 10) / 10));
}

function renderAlertTimeline() {
  return `
    <div class="alert-timeline">
      ${strikeAlerts.map((alert) => {
        const areas = Array.isArray(alert.areas) && alert.areas.length
          ? alert.areas.map((area) => `<span>${escapeHtml(area)}</span>`).join("")
          : `<span>منشور جديد</span>`;
        return `
          <article class="alert-card ${alert.severity === "high" ? "danger" : "watch"}">
            <div class="alert-card-top">
              <strong>${escapeHtml(alert.label || "تحديث مراقبة")}</strong>
              <time>${escapeHtml(alert.time || "")}</time>
            </div>
            <p>${escapeHtml(alert.text)}</p>
            <div class="alert-areas">${areas}</div>
            <a href="${escapeHtml(alert.url || strikeAlertsAccountUrl)}" target="_blank" rel="noopener">فتح المنشور الأصلي</a>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderAlertPending() {
  return `
    <div class="alert-pending">
      <strong>لا توجد إنذارات حية معروضة الآن.</strong>
      <p>${escapeHtml(strikeAlertsMessage || "بانتظار ربط X API أو RSS bridge لعرض آخر منشورات الحساب مباشرة.")}</p>
      <span>لن يتم نشر أي إنذار وهمي أو غير صادر عن المصدر.</span>
    </div>
  `;
}

function loadXWidgets() {
  if (window.twttr?.widgets) {
    window.twttr.widgets.load(feed);
    return;
  }
  if (document.getElementById("x-widgets-script")) return;
  const script = document.createElement("script");
  script.id = "x-widgets-script";
  script.async = true;
  script.src = "https://platform.twitter.com/widgets.js";
  script.charset = "utf-8";
  document.body.appendChild(script);
}

async function loadServerArticles(forceNotification = false) {
  try {
    const response = await fetch("/api/articles?limit=80");
    if (!response.ok) throw new Error("API unavailable");
    const data = await response.json();
    if (data.online === false) {
      articles = [];
      knownArticleIds = new Set();
      hideBreakingBanner();
      feed.innerHTML = `<div class="loading">${escapeHtml(data.message || "الموقع متوقف مؤقتاً")}</div>`;
      renderMostRead();
      return;
    }
    if (!Array.isArray(data.articles)) return;
    const publicArticles = data.articles.filter(isRenderableArticle);
    const incomingIds = publicArticles.map((article) => String(article.id));
    const hasNewArticles = incomingIds.some((id) => !knownArticleIds.has(id));
    usingServerFeed = true;
    articles = publicArticles.map((article) => ({
      id: String(article.id),
      title: article.title,
      category: article.category || "سياسة",
      section: article.section || "",
      status: article.status || "",
      createdAt: article.createdAt,
      source: article.source || "",
      sourceUrl: article.sourceUrl || "",
      views: Number(article.views || 0),
      imageUrl: isDisplayImageUrl(article.imageUrl) ? article.imageUrl : "",
      videoUrl: isDisplayVideoUrl(article.videoUrl) ? article.videoUrl : "",
      media: normalizeArticleMedia(article.media || []),
      hashtags: Array.isArray(article.hashtags) ? article.hashtags : [],
      lead: article.lead || "",
      summary: article.summary || "",
      body: article.body || "",
      dimensions: article.dimensions || "",
      sourceDifferences: Array.isArray(article.sourceDifferences) ? article.sourceDifferences : [],
      contradictionRadar: article.contradictionRadar || null,
      factCheck: article.factCheck || null,
      content: normalizeContent(article)
    }));
    knownArticleIds = new Set(incomingIds);
    if (initialServerLoadComplete && hasNewArticles) playNotificationSound();
    if (forceNotification && hasNewArticles) playNotificationSound();
    initialServerLoadComplete = true;
    if (currentFilter !== "alerts") renderFeed();
    renderMostRead();
    updateBreakingBanner();
  } catch {
    usingServerFeed = false;
  }
}

function updateBreakingBanner() {
  if (!breakingBanner) return;
  const article = findBreakingArticle();
  if (!article) {
    hideBreakingBanner();
    return;
  }

  activeBreakingId = article.id;
  const title = getDisplayTitle(article);
  const label = t("breaking");
  breakingBanner.hidden = false;
  breakingBanner.tabIndex = 0;
  breakingBanner.setAttribute("role", "button");
  breakingBanner.setAttribute("aria-label", `${label}: ${title}`);
  breakingBanner.innerHTML = `
    <span class="breaking-pill">${label}</span>
    <strong class="breaking-title">${escapeHtml(title)}</strong>
    <span class="breaking-time">${timeAgo(article.createdAt)}</span>
  `;
  document.body.classList.add("breaking-active");
}

function hideBreakingBanner() {
  activeBreakingId = "";
  if (breakingBanner) {
    breakingBanner.hidden = true;
    breakingBanner.removeAttribute("role");
    breakingBanner.removeAttribute("aria-label");
    breakingBanner.removeAttribute("tabindex");
    breakingBanner.innerHTML = "";
  }
  document.body.classList.remove("breaking-active");
}

function findBreakingArticle() {
  return articles
    .filter(isRenderableArticle)
    .filter((article) => !isHebrewArticle(article))
    .map((article) => ({ article, score: getBreakingScore(article) }))
    .filter((item) => item.score >= BREAKING_MIN_SCORE)
    .sort((a, b) => b.score - a.score || new Date(b.article.createdAt) - new Date(a.article.createdAt))[0]?.article || null;
}

function getBreakingScore(article) {
  const createdAt = new Date(article?.createdAt || 0).getTime();
  if (!Number.isFinite(createdAt)) return 0;
  const age = Date.now() - createdAt;
  if (age < 0 || age > BREAKING_WINDOW_MS) return 0;

  const text = `${article.category || ""} ${article.title || ""} ${article.body || ""} ${article.dimensions || ""}`;
  const fieldSecurityPattern = /(غارة|غارات|قصف|استهداف|استهدف|إنذار|انذار|صفارات|إخلاء|اخلاء|انفجار|مسيرة|مسيّرة|صاروخ|صواريخ|قذيفة|قذائف|هجوم|اعتداء|توغل|تسلل|إطلاق نار|اطلاق نار|ضربة|ضربات|تحليق|خرق أمني)/;
  const casualtyPattern = /(شهيد|شهداء|قتيل|قتلى|جريح|جرحى|مصاب|مصابين|إصابة|اصابة|ضحايا|سقوط)/;
  const actorPattern = /(إسرائيلي|اسرائيلي|حزب الله|جنوب لبنان|الحدود|طيران|مسيرة|مسيّرة|صاروخ|صواريخ)/;
  const hasFieldSecurity = fieldSecurityPattern.test(text);
  const hasCasualties = casualtyPattern.test(text);

  if (!hasFieldSecurity && !hasCasualties) return 0;

  let score = 0;
  if (String(article.category || "").includes("\u0623\u0645\u0646")) score += 2;
  if (hasFieldSecurity) score += 4;
  if (hasCasualties) score += 3;
  if (actorPattern.test(text)) score += 2;
  if (/عاجل/.test(text)) score += 1;
  if (age < 30 * 60 * 1000) score += 1;
  return score;
}

function isDisplayImageUrl(imageUrl) {
  const value = String(imageUrl || "").trim();
  if (/^\/api\/symbolic-image\/[^?#]+\.svg(?:[?#].*)?$/i.test(value)) return true;
  if (!/^https?:\/\//i.test(value)) return false;
  if (/\.(svg|gif)(\?|#|$)/i.test(value)) return false;
  return !/(breaking[-_]?news[-_]?lines|breaking[-_]?news[-_]?image|breaking[-_]?news\.png|breakingnews|news[-_]?placeholder|article[-_]?placeholder|favicon|sprite|logo|icon|avatar|profile|placeholder|default|noimage|no-image|blank|transparent|facebook\.com\/tr|pixel|beacon|analytics|pageview|collect|noscript=1)/i.test(value);
}

function normalizeArticleMedia(items = []) {
  const media = [];
  const seen = new Set();
  for (const item of Array.isArray(items) ? items : []) {
    const url = String(item?.url || item || "").trim();
    if (!/^https?:\/\//i.test(url) || seen.has(url)) continue;
    const type = getArticleMediaType(item?.type, url, item?.mime);
    if (!type) continue;
    if (type === "image" && !isDisplayImageUrl(url)) continue;
    if (type === "video" && !isDisplayVideoUrl(url)) continue;
    seen.add(url);
    media.push({
      type,
      url,
      poster: isDisplayImageUrl(item?.poster) ? item.poster : ""
    });
  }
  return media.slice(0, 8);
}

function getArticleMediaType(type = "", url = "", mime = "") {
  const value = `${type} ${url} ${mime}`.toLowerCase();
  if (/video|mp4|webm|m3u8|mov|animated_gif/.test(value)) return "video";
  if (/image|photo|jpg|jpeg|png|webp/.test(value)) return "image";
  return "";
}

function isDisplayVideoUrl(videoUrl) {
  const value = String(videoUrl || "").trim();
  if (!/^https?:\/\//i.test(value)) return false;
  return /\.(mp4|webm|m3u8|mov)(\?|#|$)/i.test(value) || /video|tweet_video|ext_tw_video/i.test(value);
}

function getArticleVideo(article = {}) {
  const mediaVideo = normalizeArticleMedia(article.media || []).find((item) => item.type === "video");
  const directUrl = isDisplayVideoUrl(article.videoUrl) ? article.videoUrl : mediaVideo?.url || "";
  return {
    url: directUrl,
    poster: article.imageUrl || mediaVideo?.poster || "",
    embedUrl: directUrl ? "" : getTweetEmbedUrl(article.sourceUrl)
  };
}

function getTweetEmbedUrl(url = "") {
  const id = String(url || "").match(/(?:x|twitter)\.com\/[^/]+\/status\/(\d+)/i)?.[1];
  return id ? `https://platform.twitter.com/embed/Tweet.html?id=${encodeURIComponent(id)}&theme=light&dnt=true` : "";
}

function renderMostRead() {
  if (!mostReadList) return;
  const ranked = articles
    .filter(isRenderableArticle)
    .filter((article) => currentFilter === "hebrew" ? isHebrewArticle(article) : !isHebrewArticle(article))
    .sort((a, b) => Number(b.views || 0) - Number(a.views || 0) || new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  if (!ranked.length) {
    mostReadList.innerHTML = `<li><span class="mr-title">${t("noMostRead")}</span></li>`;
    return;
  }

  mostReadList.innerHTML = ranked.map((article) => `
    <li data-id="${escapeHtml(article.id)}">
      <span class="mr-title"><span class="mr-cat">${escapeHtml(getCategoryLabel(article.category))}:</span> ${escapeHtml(getDisplayTitle(article))}</span>
    </li>
  `).join("");

  mostReadList.querySelectorAll("li[data-id]").forEach((item) => {
    item.addEventListener("click", () => openArticle(item.dataset.id));
  });
}

function handleNewsStorageSignal(event) {
  if (!["abaad-news-published", "abaad-strike-alerts-refresh"].includes(event.key) || !event.newValue) return;
  handleNewsSignal(event.newValue);
}

function handleNewsSignal(signal) {
  const value = typeof signal === "string" ? signal : JSON.stringify(signal || {});
  if (!value || value === lastNewsSignal) return;
  lastNewsSignal = value;
  try {
    const parsed = typeof signal === "string" ? JSON.parse(signal) : signal;
    if (parsed?.type === "strike-alerts") {
      loadStrikeAlerts();
      return;
    }
  } catch {}
  loadServerArticles(true);
}

function renderCardMedia(article, safeTitle) {
  const video = getArticleVideo(article);
  if (article.imageUrl) {
    return `
      <div class="card-media">
        <img class="card-img" src="${escapeHtml(article.imageUrl)}" alt="${safeTitle}" loading="lazy" onerror="this.closest('.card-media')?.remove()" />
        ${video.url || video.embedUrl ? `<span class="card-video-badge">فيديو</span>` : ""}
      </div>
    `;
  }

  if (video.url || video.embedUrl) {
    return `
      <div class="card-video-preview" aria-label="فيديو مرفق">
        <span class="card-video-play"></span>
        <strong>فيديو مرفق</strong>
      </div>
    `;
  }

  return "";
}

function renderArticleMedia(article, title) {
  const video = getArticleVideo(article);
  const safeTitle = escapeHtml(title);

  if (video.url) {
    return `
      <div class="av-media">
        <video class="av-video" controls playsinline preload="metadata" ${video.poster ? `poster="${escapeHtml(video.poster)}"` : ""}>
          <source src="${escapeHtml(video.url)}" />
        </video>
        ${article.imageUrl ? "" : `<span class="av-video-source">فيديو مرفق بالمنشور الأصلي</span>`}
      </div>
    `;
  }

  if (video.embedUrl) {
    return `
      <div class="av-media av-media-embed">
        <iframe class="av-video-embed" src="${escapeHtml(video.embedUrl)}" title="${safeTitle}" loading="lazy" allowfullscreen></iframe>
      </div>
    `;
  }

  if (article.imageUrl) {
    return `<img class="av-img" src="${escapeHtml(article.imageUrl)}" alt="${safeTitle}" onerror="this.remove()" />`;
  }

  return "";
}

function renderCard(article) {
  const isBrandNew = isNew(article.createdAt);
  const displayTitle = getDisplayTitle(article);
  const safeTitle = escapeHtml(displayTitle);

  return `
    <article class="card${isBrandNew ? " is-new" : ""}" data-id="${article.id}" data-time="${article.createdAt}">
      ${renderCardMedia(article, safeTitle)}
      <div class="card-body">
        <span class="card-category">${escapeHtml(getCategoryLabel(article.category))}</span>
        <div class="card-meta">
          <span>${t("by")}</span>
          <span class="dot"></span>
          <span>${timeAgo(article.createdAt)}</span>
        </div>
        <h2 class="card-title">${safeTitle}</h2>
        ${renderHashtags(getDisplayTags(article))}
        <div class="card-footer">
          <div class="share-btns" onclick="event.stopPropagation()">
            ${shareButtons(article)}
          </div>
          <span class="card-time">${timeAgo(article.createdAt)}</span>
        </div>
      </div>
    </article>
  `;
}

function openArticle(id, sourceCard, options = {}) {
  const article = articles.find((item) => String(item.id) === String(id));
  if (!isRenderableArticle(article)) {
    closeArticle();
    loadServerArticles();
    return;
  }
  if (!options.skipTrack) trackArticleView(article.id);

  const displayTitle = getDisplayTitle(article);
  const defaultMode = getDefaultReadingMode(article);
  document.title = `${displayTitle} - ${t("siteTitle")}`;
  document.body.style.overflow = "hidden";
  document.body.classList.add("article-open");
  if (avContent) avContent.dataset.articleId = String(article.id);

  avContent.innerHTML = `
    ${renderArticleMedia(article, displayTitle)}
    <div class="av-body">
      <span class="av-cat">${escapeHtml(getCategoryLabel(article.category))}</span>
      <h1 class="av-title">${escapeHtml(displayTitle)}</h1>
      <div class="av-meta">
        <span>${t("by")}</span>
        <span>•</span>
        <span>${timeAgo(article.createdAt)}</span>
      </div>
      ${renderReadingSwitch(article, defaultMode)}
      <div class="av-text">
        <div class="reading-panel reading-panel-fast" data-reading-panel="fast" ${defaultMode === "fast" ? "" : "hidden"}>
          ${renderFastRead(article)}
        </div>
        <div class="reading-panel reading-panel-deep" data-reading-panel="deep" ${defaultMode === "deep" ? "" : "hidden"}>
          ${renderDeepArticle(article)}
        </div>
      </div>
      ${renderHashtags(getDisplayTags(article), "article-tags")}
      <div class="av-share">
        ${shareButtons(article)}
      </div>
    </div>
  `;
  articleView.scrollTo({ top: 0, behavior: "instant" });
  requestAnimationFrame(() => {
    articleView.classList.add("open");
    articleView.setAttribute("aria-hidden", "false");
    initArticleReadingSwitch();
    setArticleReadingMode(defaultMode);
  });
}

function renderReadingSwitch(article, selectedMode = "deep") {
  return `
    <div class="article-reading-switch" role="tablist" aria-label="وضع القراءة">
      <button class="reading-mode-btn${selectedMode === "fast" ? " active" : ""}" type="button" data-reading-mode="fast" role="tab" aria-selected="${selectedMode === "fast" ? "true" : "false"}">
        <span>${t("quickRead")}</span>
        <small>${t("oneMinute")}</small>
      </button>
      <button class="reading-mode-btn${selectedMode === "deep" ? " active" : ""}" type="button" data-reading-mode="deep" role="tab" aria-selected="${selectedMode === "deep" ? "true" : "false"}">
        <span>${t("deepRead")}</span>
        <small>${t("fiveMinutes")}</small>
      </button>
    </div>
  `;
}

function initArticleReadingSwitch() {
  const switcher = avContent.querySelector(".article-reading-switch");
  if (!switcher) return;

  switcher.addEventListener("click", (event) => {
    const button = event.target.closest("[data-reading-mode]");
    if (!button) return;
    setArticleReadingMode(button.dataset.readingMode || "deep");
  });
}

function setArticleReadingMode(mode) {
  const selectedMode = mode === "fast" ? "fast" : "deep";
  avContent.querySelectorAll("[data-reading-mode]").forEach((button) => {
    const active = button.dataset.readingMode === selectedMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
  avContent.querySelectorAll("[data-reading-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.readingPanel !== selectedMode;
  });
  const tags = avContent.querySelector(".article-tags");
  if (tags) tags.hidden = selectedMode === "fast";
}

function renderHashtags(tags = [], extraClass = "") {
  const visibleTags = tags.filter(Boolean).slice(0, 8);
  if (!visibleTags.length) return "";
  return `<div class="hashtags ${extraClass}" onclick="event.stopPropagation()">
    ${visibleTags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
  </div>`;
}

function trackArticleView(id) {
  fetch(`/api/articles/${encodeURIComponent(id)}/view`, { method: "POST" }).catch(() => {});
}

function closeArticle() {
  articleView.classList.remove("open");
  articleView.setAttribute("aria-hidden", "true");
  setTimeout(() => {
    if (!articleView.classList.contains("open")) {
      document.body.style.overflow = "";
      document.body.classList.remove("article-open");
    }
  }, 560);
  document.title = `${t("siteTitle")} - ${t("titleSuffix")}`;
}

function shareButtons(article) {
  const tags = getDisplayTags(article).join(" ");
  const title = encodeURIComponent([getDisplayTitle(article), tags].filter(Boolean).join(" "));
  const url = encodeURIComponent(`${window.location.href.split("#")[0]}#article-${String(article.id)}`);

  return `
    <a class="share-btn fb" href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" rel="noopener" title="Facebook">f</a>
    <a class="share-btn tw" href="https://twitter.com/intent/tweet?text=${title}&url=${url}" target="_blank" rel="noopener" title="X">𝕏</a>
    <a class="share-btn wa" href="https://wa.me/?text=${title}%0A${url}" target="_blank" rel="noopener" title="WhatsApp">W</a>
  `;
}

function getFilteredArticles() {
  return articles
    .filter(isRenderableArticle)
    .filter((article) => {
      if (currentFilter === "all") return !isHebrewArticle(article);
      if (currentFilter === "hebrew") return isHebrewArticle(article);
      return !isHebrewArticle(article) && article.category === currentFilter;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function isHebrewArticle(article) {
  return article?.section === "hebrew" || article?.category === HEBREW_CATEGORY;
}

function isRenderableArticle(article) {
  if (!article) return false;
  if (article.status === "source-fallback") return false;
  const text = `${article.title || ""} ${article.body || ""} ${article.dimensions || ""} ${article.summary || ""}`;
  return !containsSourceFallbackNotice(text);
}

function containsSourceFallbackNotice(text = "") {
  const value = String(text || "");
  return value.includes("\u0628\u0627\u0646\u062a\u0638\u0627\u0631 \u0625\u0639\u0627\u062f\u0629 \u062a\u062d\u0631\u064a\u0631\u0647")
    || value.includes("\u0639\u0646\u062f \u0639\u0648\u062f\u0629 \u062d\u0635\u0629 Gemini")
    || value.includes("source-fallback");
}

function handleInfiniteScroll() {
  if (currentFilter === "alerts" || articleView.classList.contains("open") || loadingOlder) return;
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;
  if (!nearBottom) return;

  loadingOlder = true;
  setTimeout(() => {
    visibleCount += PAGE_SIZE;
    loadingOlder = false;
    renderFeed();
  }, 250);
}

function updateNewStates() {
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.toggle("is-new", isNew(card.dataset.time));
  });
  updateBreakingBanner();
}

function normalizeContent(article) {
  if (article.body || article.dimensions) return [article.body, article.dimensions].filter(Boolean);
  if (Array.isArray(article.content) && article.content.length) return article.content;
  if (article.summary) return [article.summary];
  return [article.title];
}

function renderDeepArticle(article) {
  return `
    ${renderArticleBody(article)}
    ${renderSourceDifferences(article)}
    ${renderContradictionRadar(article)}
  `;
}

function renderArticleBody(article) {
  const body = article.body || article.content?.[0] || "";
  const dimensions = article.dimensions || article.content?.[1] || "";

  return `
    <h2 class="article-section-title">${t("articleBody")}</h2>
    ${paragraphs(body)}
    ${dimensions ? `<h2 class="article-section-title">${t("dimensions")}</h2>${renderDimensions(dimensions)}` : ""}
  `;
}

function renderFastRead(article) {
  const lead = getDisplayLead(article);
  const text = lead || getDisplayTitle(article);
  return `
    <section class="fast-read-box">
      <span class="fast-read-label">${t("quickSummary")}</span>
      ${paragraphs(text)}
    </section>
  `;
}

function getArticleLead(article) {
  const candidates = [
    article.lead,
    article.summary,
    article.body,
    Array.isArray(article.content) ? article.content[0] : ""
  ];
  const text = candidates.map((item) => String(item || "").trim()).find(Boolean) || "";
  return text
    .split(/\n{2,}|(?<=\.)\s+(?=[\u0600-\u06FF])/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)[0] || text;
}

function renderSourceDifferences(article) {
  const differences = normalizeSourceDifferences(article.sourceDifferences || article.source_differences);
  const source = article.source ? escapeHtml(article.source) : "مصدر الخبر";

  if (differences.length) {
    return `
      <h2 class="article-section-title">${t("sourceComparison")}</h2>
      <ul class="source-differences-list">
        ${differences.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    `;
  }

  return `
    <h2 class="article-section-title">${t("sourceComparison")}</h2>
    <div class="source-differences-card">
      <span>المصدر الأساسي</span>
      <strong>${source}</strong>
      <p>تظهر هنا الفروقات والتفاصيل المكملة تلقائياً عند توفر أكثر من مصدر موثوق للحدث نفسه.</p>
    </div>
  `;
}

function normalizeSourceDifferences(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean).slice(0, 4);
  }
  return String(value || "")
    .split(/\n+|[؛;]/)
    .map((item) => item.replace(/^[\-\d\.\)\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 4);
}

function getArticleContradictionRadar(article) {
  return null;
  const radar = article?.contradictionRadar || article?.contradiction_radar || null;
  if (!radar || typeof radar !== "object") return null;
  const hasContradiction = radar.hasContradiction === true
    || radar.has_contradiction === true
    || String(radar.hasContradiction || radar.has_contradiction || "").toLowerCase() === "true";
  if (!hasContradiction) return null;
  const metadata = radar.metadata || {};
  const content = radar.content || {};
  const current = content.current_stance || content.currentStance || {};
  const old = content.old_stance || content.oldStance || {};
  const analysis = radar.analysis || {};
  const confidenceScore = Number(
    radar.confidenceScore
    || radar.confidence_score
    || metadata.confidenceScore
    || metadata.confidence_score
    || 0
  );
  const normalized = {
    politicianName: metadata.politicianName || metadata.politician_name || radar.politicianName || radar.politician_name || "",
    topic: metadata.topic || radar.topic || "",
    confidenceScore: Number.isFinite(confidenceScore) ? confidenceScore : 0,
    currentStance: current.text || radar.currentStance || radar.current_stance || "",
    oldStance: old.text || radar.oldStance || radar.old_stance || "",
    oldDate: old.date || radar.oldDate || radar.old_date || "",
    oldSourceUrl: old.source_url || old.sourceUrl || radar.oldSourceUrl || radar.old_source_url || "",
    sourceOfOldStance: radar.sourceOfOldStance || radar.source_of_old_stance || "",
    aiAnalysis: analysis.summary || radar.aiAnalysis || radar.ai_analysis || ""
  };
  if (!normalized.politicianName || !normalized.currentStance || !normalized.oldStance || !normalized.sourceOfOldStance) return null;
  return normalized;
}

function renderContradictionRadar(article) {
  const radar = getArticleContradictionRadar(article);
  if (!radar) return "";

  return `
    <section class="contradiction-radar-card">
      <div class="contradiction-radar-head">
        <span>رادار التناقضات</span>
        <strong>موثق فقط</strong>
      </div>
      <h2>${escapeHtml(radar.politicianName)}</h2>
      <div class="contradiction-radar-grid">
        <article>
          <span>الموقف الحالي</span>
          <p>${escapeHtml(radar.currentStance)}</p>
        </article>
        <article>
          <span>الموقف السابق</span>
          <p>${escapeHtml(radar.oldStance)}</p>
        </article>
      </div>
      <div class="contradiction-radar-source">
        <span>${escapeHtml(radar.oldDate || "تاريخ موثق")}</span>
        <strong>${escapeHtml(radar.sourceOfOldStance)}</strong>
      </div>
      <p class="contradiction-radar-analysis">${escapeHtml(radar.aiAnalysis)}</p>
    </section>
  `;
}

function renderContradictionRadar(article) {
  const radar = getArticleContradictionRadar(article);
  if (!radar) return "";
  const confidenceLabel = radar.confidenceScore
    ? `${Math.round(radar.confidenceScore * 100)}% موثق`
    : "موثق فقط";
  const evidenceLink = isHttpUrl(radar.oldSourceUrl)
    ? `<a class="contradiction-evidence-link" href="${escapeHtml(radar.oldSourceUrl)}" target="_blank" rel="noopener">فتح الدليل</a>`
    : "";

  return `
    <section class="contradiction-radar-card">
      <div class="contradiction-radar-head">
        <span>رادار التناقضات</span>
        <strong>${confidenceLabel}</strong>
      </div>
      <h2>${escapeHtml(radar.politicianName)}</h2>
      ${radar.topic ? `<div class="contradiction-topic-pill">${escapeHtml(radar.topic)}</div>` : ""}
      <div class="contradiction-radar-grid">
        <article>
          <span>الموقف الحالي</span>
          <p>${escapeHtml(radar.currentStance)}</p>
        </article>
        <article>
          <span>الموقف السابق</span>
          <p>${escapeHtml(radar.oldStance)}</p>
        </article>
      </div>
      <div class="contradiction-radar-source">
        <span>${escapeHtml(radar.oldDate || "تاريخ موثق")}</span>
        <strong>${escapeHtml(radar.sourceOfOldStance)}</strong>
        ${evidenceLink}
      </div>
      <p class="contradiction-radar-analysis">${escapeHtml(radar.aiAnalysis)}</p>
    </section>
  `;
}

function isHttpUrl(value = "") {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function renderDimensions(text) {
  const raw = String(text || "").replace(/\r/g, "").trim();
  if (!raw) return "";

  const headingPattern = new RegExp(
    "^\\s*(?:\\u062a\\u062f\\u0627\\u0639\\u064a\\u0627\\u062a\\s+\\u0627\\u0644\\u0645\\u0634\\u0647\\u062f|\\u0623\\u0628\\u0639\\u0627\\u062f\\s+\\u0627\\u0644\\u0645\\u0634\\u0647\\u062f)\\s*[:：-]?\\s*",
    "u"
  );
  const clean = raw.replace(headingPattern, "").trim();
  const itemPattern = /(?:^|\n|\s)([1-9\u0661-\u0669])[\.\)]\s+([\s\S]*?)(?=(?:\n|\s)[1-9\u0661-\u0669][\.\)]\s+|$)/g;
  const matches = [...clean.matchAll(itemPattern)];

  if (!matches.length) return paragraphs(clean);

  const intro = clean.slice(0, matches[0].index).trim();
  const items = matches.map((match) => match[2].trim()).filter(Boolean);
  if (!items.length) return paragraphs(clean);

  return `
    ${intro ? paragraphs(intro) : ""}
    <ol class="implications-list">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ol>
  `;
}

function paragraphs(text) {
  return String(text || "")
    .split(/\n{2,}|(?<=\.)\s+(?=[\u0600-\u06FF])/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function unlockNotificationSound() {
  audioUnlocked = true;
  if (pendingNotificationSound) {
    pendingNotificationSound = false;
    playNotificationSound();
  }
}

function playNotificationSound() {
  if (!audioUnlocked) {
    pendingNotificationSound = true;
    return;
  }

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.42);
  gain.connect(context.destination);

  [740, 980].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, context.currentTime + index * 0.12);
    oscillator.connect(gain);
    oscillator.start(context.currentTime + index * 0.12);
    oscillator.stop(context.currentTime + index * 0.12 + 0.18);
  });

  setTimeout(() => context.close(), 700);
}

function isNew(dateStr) {
  return Date.now() - new Date(dateStr).getTime() < TWO_MINUTES;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("now");
  if (mins < 60) return t("minuteAgo", { n: mins });
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t("hourAgo", { n: hrs });
  const days = Math.floor(hrs / 24);
  return t("dayAgo", { n: days });
}

function minutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

init();
