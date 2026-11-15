(function () {
  var T = window.TOPICS || [], A = (window.ARTICLES || []).slice();
  A.sort(function (a, b) {
    if (!!a.draft !== !!b.draft) return a.draft ? 1 : -1;
    return (b.date || "").localeCompare(a.date || "");
  });
  var byId = {}; T.forEach(function (t) { byId[t.id] = t; });
  var grid = document.getElementById("grid"), chips = document.getElementById("chips"),
      q = document.getElementById("q"), desc = document.getElementById("topic-desc"),
      topicsBox = document.getElementById("topics");
  var live = A.filter(function (a) { return !a.draft; });

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function fmt(d) {
    if (!d) return "";
    var m = ["січ","лют","бер","кві","тра","чер","лип","сер","вер","жов","лис","гру"], p = d.split("-");
    return (+p[2]) + " " + m[+p[1] - 1] + " " + p[0];
  }
  function count(id) { return live.filter(function (a) { return a.topic === id; }).length; }

  function current() {
    var h = (location.hash || "").replace("#", "");
    return byId[h] ? h : "all";
  }

  function renderChips(cur) {
    var html = '<button class="chip' + (cur === "all" ? " on" : "") + '" data-t="all">Усі<i>' + live.length + "</i></button>";
    T.forEach(function (t) {
      html += '<button class="chip' + (cur === t.id ? " on" : "") + '" data-t="' + t.id + '">' + esc(t.name) + "<i>" + count(t.id) + "</i></button>";
    });
    chips.innerHTML = html;
  }

  function card(a) {
    var t = byId[a.topic] || { name: a.topic };
    var cls = "card" + (a.featured && !a.draft ? " featured" : "") + (a.draft ? " draft" : "");
    var inner =
      '<div class="top"><span class="t">' + esc(t.name) + "</span><span>" + (a.lang || "").toUpperCase() + "</span></div>" +
      '<div class="body"><h2>' + esc(a.title) + "</h2>" + (a.excerpt ? "<p>" + esc(a.excerpt) + "</p>" : "") +
      (a.tags && a.tags.length ? '<div class="tags">' + a.tags.map(function (x) { return "<span>#" + esc(x) + "</span>"; }).join("") + "</div>" : "") +
      "</div>" +
      '<div class="foot"><span>' + (a.draft ? "<b>СКОРО</b>" : fmt(a.date)) + "</span><span>" + (a.read ? a.read + " хв" : "") + "</span></div>";
    return a.draft ? '<div class="' + cls + '">' + inner + "</div>" : '<a class="' + cls + '" href="' + esc(a.file) + '">' + inner + "</a>";
  }

  function render() {
    var cur = current(), s = (q.value || "").trim().toLowerCase();
    renderChips(cur);
    desc.textContent = cur === "all" ? "Усі матеріали, свіжі — першими." : byId[cur].desc;
    var list = A.filter(function (a) {
      if (cur !== "all" && a.topic !== cur) return false;
      if (!s) return true;
      return (a.title + " " + (a.excerpt || "") + " " + (a.tags || []).join(" ")).toLowerCase().indexOf(s) > -1;
    });
    grid.innerHTML = list.length ? list.map(card).join("") : '<div class="empty">Нічого не знайдено.</div>';
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
    topicsBox.innerHTML = T.map(function (t) {
      var n = count(t.id);
      return '<a href="#' + t.id + '" onclick="window.scrollTo(0,0)"><b>' + esc(t.name) + "</b><span>" + esc(t.desc) + "</span><em>" + n + " " + (n === 1 ? "стаття" : n > 1 && n < 5 ? "статті" : "статей") + "</em></a>";
    }).join("");
  }
  var sa = document.getElementById("stat-a"), st = document.getElementById("stat-t"), sm = document.getElementById("stat-m");
  if (sa) sa.textContent = live.length;
  if (st) st.textContent = T.filter(function (t) { return count(t.id); }).length;
  if (sm) sm.textContent = live.reduce(function (s, a) { return s + (a.read || 0); }, 0);
  render();
})();
