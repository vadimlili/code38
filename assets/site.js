(function () {
  var LANG = (document.documentElement.lang || "uk").slice(0, 2) === "en" ? "en" : "uk";
  var ROOT = document.body.getAttribute("data-root") || "";
  var I18N = {
    uk: {
      all: "Усі", allDesc: "Усі матеріали.", sNew: "Нові", sPop: "Популярні", sBy: "Сортувати:", views: "переглядів", noViews: "Дані про перегляди поки недоступні", empty: "Нічого не знайдено.", none: "Статті скоро з'являться.",
      min: "хв", soon: "СКОРО",
      months: ["січ","лют","бер","кві","тра","чер","лип","сер","вер","жов","лис","гру"],
      n: function (n) { var a = n % 10, b = n % 100; return n + " " + (a === 1 && b !== 11 ? "стаття" : a >= 2 && a <= 4 && (b < 12 || b > 14) ? "статті" : "статей"); }
    },
    en: {
      all: "All", allDesc: "All articles.", sNew: "Newest", sPop: "Popular", sBy: "Sort:", views: "views", noViews: "View counts aren’t available yet", empty: "Nothing found.", none: "English translations are on the way.",
      min: "min", soon: "SOON",
      months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      n: function (n) { return n + (n === 1 ? " article" : " articles"); }
    }
  }[LANG];

  var T = (window.TOPICS || []).map(function (t) {
    return { id: t.id, name: LANG === "en" ? (t.name_en || t.name) : t.name, desc: LANG === "en" ? (t.desc_en || t.desc) : t.desc };
  });
  var A = (window.ARTICLES || []).filter(function (a) { return (a.lang || "uk") === LANG; });
  A.sort(function (a, b) {
    if (!!a.draft !== !!b.draft) return a.draft ? 1 : -1;
    return (b.date || "").localeCompare(a.date || "");
  });
  var byId = {}; T.forEach(function (t) { byId[t.id] = t; });
  var live = A.filter(function (a) { return !a.draft; });
  // позначка «НОВЕ» — лише на найсвіжішій опублікованій статті
  var newestId = live.length ? live[0].id : null;

  // сортування: найновіша стаття завжди перша й виділена; решта — за датою або за переглядами
  var SORT = "new", VIEWS = {}, viewsOk = false;
  try { if (localStorage.getItem("code38-sort") === "pop") SORT = "pop"; } catch (e) {}

  var grid = document.getElementById("grid"), chips = document.getElementById("chips"),
      q = document.getElementById("q"), desc = document.getElementById("topic-desc"),
      topicsBox = document.getElementById("topics");
  if (!grid) return;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function fmt(d) { if (!d) return ""; var p = d.split("-"); return LANG === "en" ? I18N.months[+p[1]-1] + " " + (+p[2]) + ", " + p[0] : (+p[2]) + " " + I18N.months[+p[1]-1] + " " + p[0]; }
  function count(id) { return live.filter(function (a) { return a.topic === id; }).length; }
  function current() { var h = (location.hash || "").replace("#", ""); return byId[h] ? h : "all"; }

  function renderChips(cur) {
    var html = '<button class="chip' + (cur === "all" ? " on" : "") + '" data-t="all">' + I18N.all + "<i>" + live.length + "</i></button>";
    T.forEach(function (t) {
      html += '<button class="chip' + (cur === t.id ? " on" : "") + '" data-t="' + t.id + '">' + esc(t.name) + "<i>" + count(t.id) + "</i></button>";
    });
    chips.innerHTML = html;
  }

  function card(a) {
    var t = byId[a.topic] || { name: a.topic };
    var cls = "card" + (a.id === newestId ? " featured" : "") + (a.draft ? " draft" : "");
    var inner =
      '<div class="top"><span class="t">' + esc(t.name) + "</span><span>" + (a.lang === "uk" ? "UA" : (a.lang || "").toUpperCase()) + "</span></div>" +
      '<div class="body"><h2>' + esc(a.title) + "</h2>" + (a.excerpt ? "<p>" + esc(a.excerpt) + "</p>" : "") +
      (a.tags && a.tags.length ? '<div class="tags">' + a.tags.map(function (x) { return "<span>#" + esc(x) + "</span>"; }).join("") + "</div>" : "") +
      "</div>" +
      '<div class="foot"><span>' + (a.draft ? "<b>" + I18N.soon + "</b>" : fmt(a.date)) + "</span><span>" +
      (VIEWS[a.id] ? '<em class="v" title="' + I18N.views + '">◉ ' + VIEWS[a.id] + "</em>" : "") + (a.read ? a.read + " " + I18N.min : "") + "</span></div>";
    return a.draft ? '<div class="' + cls + '">' + inner + "</div>" : '<a class="' + cls + '" href="' + ROOT + esc(a.file) + '">' + inner + "</a>";
  }

  function render() {
    var cur = current(), s = (q.value || "").trim().toLowerCase();
    renderChips(cur);
    desc.textContent = cur === "all" ? I18N.allDesc : byId[cur].desc;
    var list = A.filter(function (a) {
      if (cur !== "all" && a.topic !== cur) return false;
      if (!s) return true;
      return (a.title + " " + (a.excerpt || "") + " " + (a.tags || []).join(" ")).toLowerCase().indexOf(s) > -1;
    });
    list = sorted(list);
    renderSort();
    grid.innerHTML = list.length ? list.map(card).join("") : '<div class="empty">' + (A.length ? I18N.empty : I18N.none) + "</div>";
  }

  function sorted(list) {
    var pinned = list.filter(function (a) { return a.id === newestId; });
    var rest = list.filter(function (a) { return a.id !== newestId; });
    rest.sort(function (a, b) {
      if (!!a.draft !== !!b.draft) return a.draft ? 1 : -1;
      if (SORT === "pop") { var d = (VIEWS[b.id] || 0) - (VIEWS[a.id] || 0); if (d) return d; }
      return (b.date || "").localeCompare(a.date || "");
    });
    return pinned.concat(rest);
  }

  var sortBox = document.createElement("div");
  sortBox.className = "sort";
  desc.parentNode.insertBefore(sortBox, desc);
  sortBox.appendChild(desc);
  var sortBtns = document.createElement("div");
  sortBtns.className = "sort-b";
  sortBox.appendChild(sortBtns);
  function renderSort() {
    sortBtns.innerHTML = "<span>" + I18N.sBy + "</span>" +
      '<button data-s="new"' + (SORT === "new" ? ' class="on"' : "") + ">" + I18N.sNew + "</button>" +
      '<button data-s="pop"' + (SORT === "pop" ? ' class="on"' : "") + (viewsOk ? "" : ' title="' + I18N.noViews + '"') + ">" + I18N.sPop + "</button>";
  }
  sortBtns.addEventListener("click", function (e) {
    var b = e.target.closest("[data-s]"); if (!b) return;
    SORT = b.getAttribute("data-s");
    try { localStorage.setItem("code38-sort", SORT); } catch (_) {}
    render();
  });

  // перегляди з GoatCounter (потрібно ввімкнути «Allow adding visitor counts» у налаштуваннях)
  if (window.GOATCOUNTER && window.fetch) {
    var left = live.length;
    live.forEach(function (a) {
      fetch("https://" + window.GOATCOUNTER + ".goatcounter.com/counter/" + encodeURIComponent("/" + a.file) + ".json")
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { var n = d && parseInt(String(d.count).replace(/\D/g, ""), 10); if (n) { VIEWS[a.id] = n; viewsOk = true; } })
        .catch(function () {})
        .then(function () { if (--left === 0 && viewsOk) render(); });
    });
  }

  chips.addEventListener("click", function (e) {
    var b = e.target.closest("[data-t]"); if (!b) return;
    var t = b.getAttribute("data-t");
    if (t === "all") { history.replaceState(null, "", location.pathname + location.search); render(); }
    else location.hash = t;
  });
  q.addEventListener("input", render);
  window.addEventListener("hashchange", render);

  if (topicsBox) {
    topicsBox.innerHTML = T.filter(function (t) { return LANG === "uk" || count(t.id); }).map(function (t) {
      return '<a href="#' + t.id + '" onclick="window.scrollTo(0,0)"><b>' + esc(t.name) + "</b><span>" + esc(t.desc) + "</span><em>" + I18N.n(count(t.id)) + "</em></a>";
    }).join("");
  }
  var sa = document.getElementById("stat-a"), st = document.getElementById("stat-t"), sm = document.getElementById("stat-m");
  if (sa) sa.textContent = live.length;
  if (st) st.textContent = T.filter(function (t) { return count(t.id); }).length;
  if (sm) sm.textContent = live.reduce(function (s, a) { return s + (a.read || 0); }, 0);

  // Перемикач мови: показуємо лише коли є статті іншою мовою
  var sw = document.getElementById("lang-switch");
  if (sw) {
    var other = LANG === "uk" ? "en" : "uk";
    var hasOther = (window.ARTICLES || []).some(function (a) { return (a.lang || "uk") === other && !a.draft; });
    if (hasOther) sw.hidden = false;
  }
  render();
})();
