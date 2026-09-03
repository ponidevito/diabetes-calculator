/* Bread Units Calculator - app logic (vanilla JS, no dependencies).
   Bundled by gulp: foods.js + i18n.js + main.js -> build/js/scripts.min.js */
(function () {
  "use strict";

  var LANGS = ["uk", "en", "es"];
  var DEFAULT_LANG = "uk";
  var TABLE_PREVIEW_ROWS = 8;        // rows shown before "show more" on desktop
  var TABLE_PREVIEW_ROWS_MOBILE = 3; // ... and on small screens
  var TABLE_EXPAND_STEP = 8;         // each "show more" click reveals this many extra rows
  var MOBILE_MQ = window.matchMedia
    ? window.matchMedia("(max-width: 640px)")
    : { matches: false, addEventListener: function () {}, addListener: function () {} };
  function tablePreviewRows() { return MOBILE_MQ.matches ? TABLE_PREVIEW_ROWS_MOBILE : TABLE_PREVIEW_ROWS; }
  var I18N = window.BUC_I18N || {};
  var FOODS = window.BUC_FOODS || [];
  var CATS = ["bakery", "cereals", "pasta", "veggies", "legumes", "fruits", "juices", "dairy", "nuts", "fastfood", "other"];

  var state = {
    lang: DEFAULT_LANG,
    theme: "light",
    norm: 12, // grams of carbohydrates per 1 XE - original calculator used 10 or 12
    mode: "food", // "food" = pick from list, "manual" = type carbs per 100 g
    tableLimit: null // null = show the initial preview; otherwise the max rows to render
  };

  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function t(key) {
    var d = I18N[state.lang] || I18N[DEFAULT_LANG] || {};
    if (key in d) return d[key];
    return (I18N[DEFAULT_LANG] && I18N[DEFAULT_LANG][key]) || key;
  }
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function num(v) { return parseFloat(String(v == null ? "" : v).replace(",", ".")); }

  /* ---------------- i18n ---------------- */
  function applyI18n() {
    document.documentElement.lang = state.lang;

    $all("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    $all("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    $all("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(",").forEach(function (pair) {
        var p = pair.split(":");
        if (p.length === 2) el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });

    document.title = t("meta.title");
    setMeta('meta[name="description"]', "content", t("meta.description"));
    setMeta('meta[property="og:title"]', "content", t("meta.title"));
    setMeta('meta[property="og:description"]', "content", t("meta.description"));
    setMeta('meta[property="og:locale"]', "content", { uk: "uk_UA", en: "en_US", es: "es_ES" }[state.lang]);

    updateLangSwitch();
    relabelTableFilters();
    rebuildFoodOptions();
    rebuildTable();
  }
  function setMeta(sel, attr, val) { var el = $(sel); if (el && val) el.setAttribute(attr, val); }

  /* ---------------- language switch (custom listbox) ---------------- */
  function langCode(lang) { return lang === "uk" ? "UA" : lang.toUpperCase(); }

  function updateLangSwitch() {
    var wrap = $("#lang-switch");
    if (!wrap) return;
    var current = null;
    $all(".lang-switch__option", wrap).forEach(function (o) {
      var sel = o.getAttribute("data-lang") === state.lang;
      o.setAttribute("aria-selected", sel ? "true" : "false");
      if (sel) current = o;
    });
    if (!current) return;
    var flag = $("#lang-current-flag");
    var srcFlag = $(".lang-switch__flag", current);
    if (flag && srcFlag) flag.innerHTML = srcFlag.innerHTML;
    var code = $("#lang-current-code");
    if (code) code.textContent = langCode(state.lang);
  }

  function initLangSwitch() {
    var wrap = $("#lang-switch");
    if (!wrap) return;
    var toggle = $("#lang-toggle", wrap);
    var menu = $("#lang-menu", wrap);
    var opts = $all(".lang-switch__option", wrap);
    if (!toggle || !menu || !opts.length) return;

    function isOpen() { return wrap.classList.contains("is-open"); }

    function onDocPointer(e) { if (!wrap.contains(e.target)) close(false); }
    function onKey(e) {
      if (!isOpen()) return;
      var i = opts.indexOf(document.activeElement);
      switch (e.key) {
        case "Escape": e.preventDefault(); close(true); break;
        case "ArrowDown": e.preventDefault(); (opts[i + 1] || opts[0]).focus(); break;
        case "ArrowUp": e.preventDefault(); (opts[i - 1] || opts[opts.length - 1]).focus(); break;
        case "Home": e.preventDefault(); opts[0].focus(); break;
        case "End": e.preventDefault(); opts[opts.length - 1].focus(); break;
        case "Tab": close(false); break;
      }
    }

    function open() {
      wrap.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      var sel = opts.filter(function (o) { return o.getAttribute("aria-selected") === "true"; })[0] || opts[0];
      sel.focus();
      document.addEventListener("pointerdown", onDocPointer, true);
      document.addEventListener("keydown", onKey, true);
    }
    function close(focusToggle) {
      if (!isOpen()) { if (focusToggle) toggle.focus(); return; }
      wrap.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.removeEventListener("pointerdown", onDocPointer, true);
      document.removeEventListener("keydown", onKey, true);
      if (focusToggle) toggle.focus();
    }
    function choose(o) {
      var lang = o.getAttribute("data-lang");
      close(true);
      if (lang && lang !== state.lang) setLang(lang);
    }

    toggle.addEventListener("click", function () { isOpen() ? close(false) : open(); });
    opts.forEach(function (o) {
      o.addEventListener("click", function () { choose(o); });
      o.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); choose(o); }
      });
    });
  }

  // App build: there is only one local page, so the language is remembered
  // on-device (localStorage, falling back to the device locale) instead of
  // being encoded in a URL path like on the website.
  function detectLang() {
    var saved = read("buc-lang");
    if (saved && LANGS.indexOf(saved) > -1) return saved;
    var nav = ((navigator.language || navigator.userLanguage || "") + "").slice(0, 2).toLowerCase();
    return LANGS.indexOf(nav) > -1 ? nav : DEFAULT_LANG;
  }
  function setLang(lang) {
    if (LANGS.indexOf(lang) === -1 || lang === state.lang) return;
    state.lang = lang;
    store("buc-lang", lang);
    applyI18n();
  }

  /* ---------------- theme ---------------- */
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    var b = $("#theme-toggle");
    if (b) b.setAttribute("aria-pressed", state.theme === "dark" ? "true" : "false");
  }
  function setTheme(theme) {
    state.theme = theme === "dark" ? "dark" : "light";
    store("buc-theme", state.theme);
    applyTheme();
  }

  /* ---------------- food select ---------------- */
  function foodName(f) { return (f.name && (f.name[state.lang] || f.name.en)) || f.id; }

  function rebuildFoodOptions() {
    var select = $("#calc-food");
    if (!select) return;
    var current = select.value;
    select.innerHTML = "";

    var ph = document.createElement("option");
    ph.value = "";
    ph.textContent = t("calc.food.placeholder");
    select.appendChild(ph);

    CATS.forEach(function (cat) {
      var items = FOODS.filter(function (f) { return f.cat === cat; });
      if (!items.length) return;
      var g = document.createElement("optgroup");
      g.label = t("cat." + cat);
      items.sort(function (a, b) { return foodName(a).localeCompare(foodName(b), state.lang); });
      items.forEach(function (f) {
        var o = document.createElement("option");
        o.value = f.id;
        o.textContent = foodName(f);
        g.appendChild(o);
      });
      select.appendChild(g);
    });

    if (current && FOODS.some(function (f) { return f.id === current; })) select.value = current;
  }

  function getFood(id) {
    return FOODS.filter(function (f) { return f.id === id; })[0] || null;
  }

  /* ---------------- calculation ----------------
   * Original project formula, unchanged:
   *     XE = (carbsPer100 / 100) * portionWeight / norm
   */
  function computeXE(carbsPer100, weight, norm) {
    return (carbsPer100 / 100) * weight / norm;
  }

  function fmt(n) { return n.toFixed(1); }
  function round1(n) { return Math.round(n * 10) / 10; }

  var animId = null;
  function animateResult(target) {
    var el = $("#calc-result-value");
    if (!el) return;
    if (animId) cancelAnimationFrame(animId);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = fmt(target); return; }
    var start = performance.now();
    var from = parseFloat(el.textContent) || 0;
    var dur = 450;
    function step(now) {
      var p = Math.min(1, (now - start) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (target - from) * e);
      if (p < 1) animId = requestAnimationFrame(step);
    }
    animId = requestAnimationFrame(step);
  }

  function showError(msg) {
    var box = $("#calc-error");
    if (!box) return;
    box.textContent = msg || "";
    box.hidden = !msg;
  }

  // carbs per 100 g for the current mode (from the food list, or typed manually)
  function currentInputs() {
    var weight = num(($("#calc-weight") || {}).value);
    var carbs;
    if (state.mode === "food") {
      var f = getFood((($("#calc-food") || {}).value));
      carbs = f ? f.carbs : NaN;
    } else {
      carbs = num(($("#calc-carbs") || {}).value);
    }
    return { carbs: carbs, weight: weight };
  }

  function inputsValid(v) {
    return !isNaN(v.carbs) && v.carbs >= 1 && v.carbs <= 100 && !isNaN(v.weight) && v.weight > 0;
  }

  function calculate() {
    var v = currentInputs();

    if (state.mode === "food" && !getFood((($("#calc-food") || {}).value))) {
      showError(t("calc.error.food")); return;
    }
    if (isNaN(v.carbs) || v.carbs < 1 || v.carbs > 100) { showError(t("calc.error.carbs")); return; }
    if (isNaN(v.weight) || v.weight <= 0) { showError(t("calc.error.weight")); return; }
    showError("");

    var xe = computeXE(v.carbs, v.weight, state.norm);
    if (!isFinite(xe)) return;

    var card = $("#calc-result");
    card.classList.remove("is-empty");
    card.classList.add("is-active", "pop");
    setTimeout(function () { card.classList.remove("pop"); }, 320);
    animateResult(xe);

    var f = $("#calc-formula");
    f.textContent = t("calc.formula")
      .replace("{carbs}", round1(v.carbs))
      .replace("{weight}", round1(v.weight))
      .replace("{norm}", state.norm)
      .replace("{result}", fmt(xe));
    f.hidden = false;

    showGiForSelectedFood();
  }

  // GI note under the result, shown only when a listed food with a GI is selected
  function showGiForSelectedFood() {
    var el = $("#calc-gi");
    if (!el) return;
    var food = state.mode === "food" ? getFood((($("#calc-food") || {}).value)) : null;
    var band = food ? giBand(food.gi) : null;
    if (!band) { el.hidden = true; return; }
    el.className = "result__gi result__gi--" + band;
    el.textContent = t("calc.gi.label") + " " + food.gi + " · " + t("gi." + band);
    el.hidden = false;
  }

  function recalcIfActive() {
    if ($("#calc-result") && $("#calc-result").classList.contains("is-active") && inputsValid(currentInputs())) {
      calculate();
    }
  }

  function setMode(mode, focus) {
    state.mode = mode === "manual" ? "manual" : "food";
    store("buc-mode", state.mode);
    var card = $("#calculator");
    if (card) card.setAttribute("data-mode", state.mode);

    $all("[data-calc-tab]").forEach(function (b) {
      var active = b.getAttribute("data-calc-tab") === state.mode;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
      b.tabIndex = active ? 0 : -1;
      if (active && focus) b.focus();
    });

    // carry the value across: fill the manual field from the selected food
    if (state.mode === "manual") {
      var f = getFood((($("#calc-food") || {}).value));
      var c = $("#calc-carbs");
      if (f && c && !num(c.value)) c.value = f.carbs;
    }

    showError("");
    recalcIfActive();
  }

  function resetCalc() {
    ["#calc-food", "#calc-carbs", "#calc-weight"].forEach(function (s) { var el = $(s); if (el) el.value = ""; });
    showError("");
    var card = $("#calc-result");
    if (card) { card.classList.add("is-empty"); card.classList.remove("is-active"); }
    var val = $("#calc-result-value"); if (val) val.textContent = "0.0";
    var f = $("#calc-formula"); if (f) f.hidden = true;
    var gi = $("#calc-gi"); if (gi) gi.hidden = true;
    var food = $("#calc-food"); if (food) food.focus();
  }

  /* ---------------- food table ---------------- */
  function amountFor1XE(food) {
    // grams (or ml) of this food that contain one XE, at the current norm
    return Math.round((state.norm * 100) / food.carbs);
  }

  /* ---------------- glycemic index ---------------- */
  // band for a numeric GI: "low" (<=55) | "mid" (56-69) | "high" (>=70) | null
  function giBand(gi) {
    if (gi == null || isNaN(gi)) return null;
    if (gi <= 55) return "low";
    if (gi <= 69) return "mid";
    return "high";
  }
  // coloured pill for the food table; "—" when GI is not meaningful
  function giBadge(f) {
    var band = giBand(f.gi);
    if (!band) return '<span class="gi-badge gi-badge--na">—</span>';
    return '<span class="gi-badge gi-badge--' + band + '" title="' + f.gi + " · " + t("gi." + band) + '">' +
      f.gi + '<span class="visually-hidden"> — ' + t("gi." + band) + "</span></span>";
  }

  // rows for the current category filter + search query, sorted for display
  function currentTableRows() {
    var q = (($("#table-search") || {}).value || "").trim().toLowerCase();
    var active = $(".table-filter .is-active");
    var cat = active ? active.getAttribute("data-cat") : "all";
    var giActive = $(".table-gi-filter .is-active");
    var giKey = giActive ? giActive.getAttribute("data-gi") : "all";
    return FOODS
      .filter(function (f) { return cat === "all" || f.cat === cat; })
      .filter(function (f) { return giKey === "all" || giBand(f.gi) === giKey; })
      .filter(function (f) {
        if (!q) return true;
        return LANGS.some(function (l) { return (f.name[l] || "").toLowerCase().indexOf(q) > -1; });
      })
      .sort(function (a, b) {
        if (a.cat !== b.cat) return CATS.indexOf(a.cat) - CATS.indexOf(b.cat);
        return foodName(a).localeCompare(foodName(b), state.lang);
      });
  }

  function rebuildTable() {
    var tbody = $("#food-tbody");
    if (!tbody) return;

    var rows = currentTableRows();

    var preview = tablePreviewRows();
    // how many rows are visible right now: the preview, or the accumulated limit
    var visible = Math.min(state.tableLimit == null ? preview : state.tableLimit, rows.length);
    var allShown = visible >= rows.length;
    var toggle = $("#table-toggle");
    var toggleWrap = toggle ? toggle.parentElement : null;
    var isExpandable = rows.length > preview;
    if (toggleWrap) toggleWrap.hidden = !isExpandable;
    if (toggle) {
      var key = allShown ? "table.collapse" : "table.expand";
      toggle.setAttribute("aria-expanded", allShown ? "true" : "false");
      toggle.setAttribute("data-i18n", key);
      toggle.textContent = t(key);
    }

    tbody.innerHTML = "";
    if (!rows.length) {
      var tr = document.createElement("tr");
      tr.innerHTML = '<td colspan="5" class="food-table__empty">' + t("table.empty") + "</td>";
      tbody.appendChild(tr);
      return;
    }

    rows.slice(0, visible).forEach(function (f) {
      var unit = f.liquid ? t("calc.weight.suffix").split("/")[1].trim() : t("calc.carbs.suffix");
      var tr = document.createElement("tr");
      tr.innerHTML =
        '<td data-label="' + t("table.col.product") + '"><span class="food-table__cat">' + t("cat." + f.cat) + "</span>" + foodName(f) + "</td>" +
        '<td data-label="' + t("table.col.amount") + '">' + amountFor1XE(f) + " " + unit + "</td>" +
        '<td data-label="' + t("table.col.carbs") + '">' + f.carbs + " " + t("calc.carbs.suffix") + "</td>" +
        '<td data-label="' + t("table.col.gi") + '">' + giBadge(f) + "</td>" +
        '<td class="food-table__action"><button type="button" class="link-btn" data-use="' + f.id + '">' + t("table.use") + "</button></td>";
      tbody.appendChild(tr);
    });
  }

  // build a row of single-select filter chips inside `selector`
  function buildFilterChips(selector, attr, entries) {
    var wrap = $(selector);
    if (!wrap) return;
    wrap.innerHTML = "";
    entries.forEach(function (e, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.setAttribute(attr, e.key);
      b.textContent = e.label;
      if (i === 0) b.classList.add("is-active");
      b.addEventListener("click", function () {
        $all(".chip", wrap).forEach(function (c) { c.classList.remove("is-active"); });
        b.classList.add("is-active");
        state.tableLimit = null;
        rebuildTable();
      });
      wrap.appendChild(b);
    });
  }

  // re-label the (already built) filter chips for the current language,
  // keeping each row's active selection
  function relabelTableFilters() {
    $all(".table-filter .chip").forEach(function (c) {
      var k = c.getAttribute("data-cat");
      c.textContent = k === "all" ? t("table.filter.all") : t("cat." + k);
    });
    $all(".table-gi-filter .chip").forEach(function (c) {
      var k = c.getAttribute("data-gi");
      c.textContent = k === "all" ? t("table.gi.all") : t("gi." + k);
    });
  }

  function buildTableFilters() {
    buildFilterChips(".table-filter", "data-cat",
      [{ key: "all", label: t("table.filter.all") }].concat(
        CATS.map(function (c) { return { key: c, label: t("cat." + c) }; })));

    buildFilterChips(".table-gi-filter", "data-gi", [
      { key: "all", label: t("table.gi.all") },
      { key: "low", label: t("gi.low") },
      { key: "mid", label: t("gi.mid") },
      { key: "high", label: t("gi.high") }
    ]);
  }

  function useFoodInCalculator(id) {
    var food = getFood(id);
    if (!food) return;
    var select = $("#calc-food"); if (select) select.value = id;
    var carbs = $("#calc-carbs"); if (carbs) carbs.value = food.carbs;
    var weight = $("#calc-weight");
    if (weight && !num(weight.value)) weight.value = food.piece || 100;
    calculate();
    setView("calculator");
  }

  /* ---------------- app view (bottom-nav tabs) ----------------
   * App build only: the calculator and the food table are separate
   * full-screen tabs instead of one long scrolling page. */
  function setView(view) {
    view = view === "table" ? "table" : "calculator";
    $all(".view-panel").forEach(function (el) {
      el.hidden = el.getAttribute("data-view") !== view;
    });
    $all("[data-view-tab]").forEach(function (b) {
      var active = b.getAttribute("data-view-tab") === view;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
      b.tabIndex = active ? 0 : -1;
    });
    window.scrollTo(0, 0);
  }

  function initViewTabs() {
    var tabs = $all("[data-view-tab]");
    if (!tabs.length) return;
    tabs.forEach(function (btn) {
      btn.addEventListener("click", function () { setView(btn.getAttribute("data-view-tab")); });
      btn.addEventListener("keydown", function (e) {
        var i = tabs.indexOf(btn);
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          var next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
          next.focus();
          setView(next.getAttribute("data-view-tab"));
        }
      });
    });
  }

  /* ---------------- nav ---------------- */
  function initMenu() {
    var toggle = $(".nav__toggle");
    var menu = $("#primary-nav");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-locked", open);
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-locked");
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 800 && menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-locked");
      }
    });
  }

  /* ---------------- scroll reveal ---------------- */
  function initReveal() {
    var els = $all("[data-reveal]");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- floating "back to calculator" ---------------- */
  function initBackToCalc() {
    var link = $(".skip-link");
    var calc = $("#calculator");
    if (!link || !calc || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      var e = entries[0];
      // show once the calculator has been scrolled up out of view
      link.classList.toggle("is-visible", !e.isIntersecting && e.boundingClientRect.top < 0);
    }, { threshold: 0 });
    io.observe(calc);
  }

  /* ---------------- init ---------------- */
  function init() {
    var savedTheme = read("buc-theme");
    if (savedTheme) state.theme = savedTheme;
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) state.theme = "dark";
    applyTheme();

    state.lang = detectLang();

    var savedNorm = parseInt(read("buc-norm"), 10);
    if (savedNorm === 10 || savedNorm === 12) state.norm = savedNorm;

    var savedMode = read("buc-mode");
    state.mode = savedMode === "manual" ? "manual" : "food";

    var themeBtn = $("#theme-toggle");
    if (themeBtn) themeBtn.addEventListener("click", function () {
      setTheme(state.theme === "dark" ? "light" : "dark");
      rebuildTable();
    });

    initLangSwitch();

    $all("[data-set-norm]").forEach(function (btn) {
      var n = parseInt(btn.getAttribute("data-set-norm"), 10) === 10 ? 10 : 12;
      if (n === state.norm) { btn.classList.add("is-active"); btn.setAttribute("aria-pressed", "true"); }
      btn.addEventListener("click", function () {
        state.norm = n;
        store("buc-norm", String(n));
        $all("[data-set-norm]").forEach(function (b) {
          var active = b === btn;
          b.classList.toggle("is-active", active);
          b.setAttribute("aria-pressed", active ? "true" : "false");
        });
        rebuildTable();
        recalcIfActive();
      });
    });

    var tablist = $(".calc-tabs");
    if (tablist) {
      var tabs = $all("[data-calc-tab]", tablist);
      tabs.forEach(function (btn) {
        btn.addEventListener("click", function () { setMode(btn.getAttribute("data-calc-tab")); });
        btn.addEventListener("keydown", function (e) {
          var i = tabs.indexOf(btn);
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            var next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
            setMode(next.getAttribute("data-calc-tab"), true);
          }
        });
      });
    }
    setMode(state.mode);

    var food = $("#calc-food");
    if (food) food.addEventListener("change", function () {
      showError("");
      recalcIfActive();
    });

    var form = $("#calc-form");
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); calculate(); });
    var resetBtn = $("#calc-reset");
    if (resetBtn) resetBtn.addEventListener("click", resetCalc);

    // carbohydrates per 100 g: keep within 1-100
    var carbsEl = $("#calc-carbs");
    if (carbsEl) carbsEl.addEventListener("input", function () {
      var n = num(carbsEl.value);
      if (!isNaN(n) && n > 100) carbsEl.value = "100";
      recalcIfActive();
    });

    // portion weight: digits only, at most 4
    var weightEl = $("#calc-weight");
    if (weightEl) weightEl.addEventListener("input", function () {
      var trimmed = weightEl.value.replace(/\D/g, "").slice(0, 4);
      if (weightEl.value !== trimmed) weightEl.value = trimmed;
      recalcIfActive();
    });

    var search = $("#table-search");
    if (search) search.addEventListener("input", function () {
      state.tableLimit = null;
      rebuildTable();
    });

    var tableToggle = $("#table-toggle");
    if (tableToggle) tableToggle.addEventListener("click", function () {
      var total = currentTableRows().length;
      var current = state.tableLimit == null ? tablePreviewRows() : state.tableLimit;
      // reveal TABLE_EXPAND_STEP more rows, or collapse back once everything is visible
      state.tableLimit = current >= total ? null : current + TABLE_EXPAND_STEP;
      rebuildTable();
    });

    // re-render the table when crossing the mobile breakpoint (preview 3 <-> 8)
    var onMqChange = function () { rebuildTable(); };
    if (MOBILE_MQ.addEventListener) MOBILE_MQ.addEventListener("change", onMqChange);
    else if (MOBILE_MQ.addListener) MOBILE_MQ.addListener(onMqChange);

    var tbody = $("#food-tbody");
    if (tbody) tbody.addEventListener("click", function (e) {
      var b = e.target.closest("[data-use]");
      if (b) useFoodInCalculator(b.getAttribute("data-use"));
    });

    buildTableFilters();
    initMenu();
    initReveal();
    initBackToCalc();
    initViewTabs();
    setView("calculator");
    applyI18n();

    var y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
