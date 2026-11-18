/* Верхня панель для сторінок статей.
   Підключення в будь-якій статті (перед </body>):
   <script src="../../assets/articles.js"></script>
   <script src="../../assets/site-nav.js"></script>
*/
(function () {
  var me = document.currentScript && document.currentScript.src;
  var root = me ? me.replace(/assets\/site-nav\.js.*$/, "") : "/";
  var path = location.href.replace(root, "").split("#")[0].split("?")[0];
  var arts = window.ARTICLES || [], topics = window.TOPICS || [];
  var art = arts.filter(function (a) { return path === a.file; })[0];
  var topic = art && topics.filter(function (t) { return t.id === art.topic; })[0];

  var css = document.createElement("style");
  css.textContent =
    "#vl-bar{position:relative;z-index:90;background:rgba(13,15,18,.96);backdrop-filter:blur(8px);border-bottom:1px solid #1f2329;font:12px/1 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.08em}" +
    "#vl-bar .in{max-width:1180px;margin:0 auto;padding:0 24px;height:44px;display:flex;align-items:center;justify-content:space-between;gap:16px}" +
    "#vl-bar a{color:#b8bec8;text-decoration:none;border:0}#vl-bar a:hover{color:#c8a96e}" +
    "#vl-bar .home{color:#dfe3ea;font-weight:700;letter-spacing:.06em;font-size:14px}#vl-bar .home span{color:#c8a96e}" +
    "#vl-bar .crumb{text-transform:uppercase;color:#a3a9b4}#vl-bar .crumb a{margin-left:8px}" +
    "#vl-next{max-width:720px;margin:56px auto 0;padding:0 24px;font:13px/1.6 'JetBrains Mono',ui-monospace,monospace}" +
    "#vl-next .h{color:#a3a9b4;letter-spacing:.2em;text-transform:uppercase;font-size:11px;margin-bottom:10px}" +
    "#vl-next a{display:block;font-family:Inter,system-ui,sans-serif;font-size:15px;border:1px solid #1f2329;padding:14px 16px;margin-bottom:8px;color:#dfe3ea;text-decoration:none}" +
    "#vl-next a:hover{border-color:#c8a96e}" +
    "#vl-bar .lang{margin-left:14px;border:1px solid #2a2f38;padding:3px 8px;color:#dfe3ea}#vl-bar .lang:hover{border-color:#c8a96e}#vl-bar .views{margin-left:14px;color:#b8bec8;letter-spacing:.06em}#vl-next a small{display:block;color:#b8bec8;margin-top:4px}" +
    "#vl-sub{max-width:720px;margin:56px auto 0;padding:0 24px;box-sizing:border-box}#vl-sub .in{border:1px solid #1f2329;background:#13161b;padding:20px 22px}" +
    "#vl-sub .h{font:12.5px 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.22em;text-transform:uppercase;color:#c8a96e}" +
    "#vl-sub p{font:15px/1.6 Inter,system-ui,sans-serif;color:#dfe3ea;margin:10px 0 14px}" +
    "#vl-sub .b{display:flex;gap:10px;flex-wrap:wrap}#vl-sub .b a{font:13px 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.08em;color:#f0f2f5;text-decoration:none;border:1px solid #7a6640;padding:8px 16px}" +
    "#vl-sub .b a:hover{border-color:#c8a96e;color:#c8a96e}";
  document.head.appendChild(css);

  var lang = art ? (art.lang || "uk") : ((document.documentElement.lang || "uk").slice(0, 2) === "en" ? "en" : "uk");
  var home = root + (lang === "en" ? "en/" : "");
  var tname = topic ? (lang === "en" ? (topic.name_en || topic.name) : topic.name) : "";
  var pair = art && (arts.filter(function (a) { return a.id === art.translation; })[0] ||
                     arts.filter(function (a) { return a.translation === art.id; })[0]);
  if (pair && pair.draft) pair = null;
  var sw = pair ? '<a class="lang" href="' + root + pair.file + '" hreflang="' + pair.lang + '">' + (pair.lang === "en" ? "EN" : "UA") + "</a>" : "";
  var bar = document.createElement("div");
  bar.id = "vl-bar";
  bar.innerHTML = '<div class="in"><a class="home" href="' + home + '">CODE<span>38</span></a>' +
    '<span class="crumb">' + (topic ? '<a href="' + home + "#" + topic.id + '">← ' + tname + "</a>" : '<a href="' + home + '">← ' + (lang === "en" ? "All articles" : "Усі статті") + "</a>") + sw + "</span></div>";
  document.body.insertBefore(bar, document.body.firstChild);

  // лічильник переглядів (GoatCounter → Settings → "Allow adding visitor counts on your website")
  if (art && window.GOATCOUNTER && window.fetch) {
    fetch("https://" + window.GOATCOUNTER + ".goatcounter.com/counter/" + encodeURIComponent(location.pathname) + ".json")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) {
        if (!d || !d.count) return;
        var v = document.createElement("span");
        v.className = "views";
        v.title = lang === "en" ? "views" : "переглядів";
        v.textContent = "◉ " + d.count;
        bar.querySelector(".crumb").appendChild(v);
      }).catch(function () {});
  }

  if (art) {
    // блок підписки на нові статті (RSS)
    var feed = (window.SITE_URL || "/").replace(/\/?$/, "/") + (lang === "en" ? "en/" : "") + "feed.xml";
    var sub = document.createElement("div");
    sub.id = "vl-sub";
    sub.innerHTML = '<div class="in"><div class="h">// ' + (lang === "en" ? "New articles" : "Нові статті") + '</div><p>' +
      (lang === "en" ? "Subscribe so you don’t miss new pieces: the RSS feed works in any reader — Feedly, Inoreader, NetNewsWire."
                     : "Підпишіться, щоб не пропустити нові матеріали: RSS-стрічка працює в будь-якій читалці — Feedly, Inoreader, NetNewsWire.") +
      '</p><div class="b"><a href="' + feed + '">RSS</a><a href="https://feedly.com/i/subscription/feed/' + encodeURIComponent(feed) +
      '" target="_blank" rel="noopener">Feedly</a></div></div>';
    var f0 = document.querySelector("footer");
    if (f0) f0.parentNode.insertBefore(sub, f0); else document.body.appendChild(sub);
  }

  if (art) {
    var more = arts.filter(function (a) { return a !== art && !a.draft && (a.lang || "uk") === lang && a.topic === art.topic; });
    if (!more.length) more = arts.filter(function (a) { return a !== art && !a.draft && (a.lang || "uk") === lang; });
    more = more.slice(0, 3);
    if (more.length) {
      var box = document.createElement("div");
      box.id = "vl-next";
      box.innerHTML = '<div class="h">// ' + (lang === "en" ? "Read next" : "Читати далі") + '</div>' + more.map(function (a) {
        return '<a href="' + root + a.file + '">' + a.title + "<small>" + (a.read ? a.read + (lang === "en" ? " min · " : " хв · ") : "") + (a.excerpt || "") + "</small></a>";
      }).join("");
      var foot = document.querySelector("footer");
      if (foot) foot.parentNode.insertBefore(box, foot); else document.body.appendChild(box);
    }
  }
})();
