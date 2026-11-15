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
    "#vl-bar a{color:#8a909b;text-decoration:none;border:0}#vl-bar a:hover{color:#c8a96e}" +
    "#vl-bar .home{color:#d4d8e0;font-weight:700;letter-spacing:0;font-size:14px}#vl-bar .home span{color:#c8a96e}" +
    "#vl-bar .crumb{text-transform:uppercase;color:#6b7280}#vl-bar .crumb a{margin-left:8px}" +
    "#vl-next{max-width:720px;margin:56px auto 0;padding:0 24px;font:13px/1.6 'JetBrains Mono',ui-monospace,monospace}" +
    "#vl-next .h{color:#6b7280;letter-spacing:.2em;text-transform:uppercase;font-size:11px;margin-bottom:10px}" +
    "#vl-next a{display:block;font-family:Inter,system-ui,sans-serif;font-size:15px;border:1px solid #1f2329;padding:14px 16px;margin-bottom:8px;color:#d4d8e0;text-decoration:none}" +
    "#vl-next a:hover{border-color:#c8a96e}#vl-next a small{display:block;color:#8a909b;margin-top:4px}";
  document.head.appendChild(css);

  var bar = document.createElement("div");
  bar.id = "vl-bar";
  bar.innerHTML = '<div class="in"><a class="home" href="' + root + '">vadim<span>.</span>li</a>' +
    '<span class="crumb">' + (topic ? '<a href="' + root + "#" + topic.id + '">← ' + topic.name + "</a>" : '<a href="' + root + '">← Усі статті</a>') + "</span></div>";
  document.body.insertBefore(bar, document.body.firstChild);

  if (art) {
    var more = arts.filter(function (a) { return a !== art && !a.draft && a.topic === art.topic; });
    if (!more.length) more = arts.filter(function (a) { return a !== art && !a.draft; });
    more = more.slice(0, 3);
    if (more.length) {
      var box = document.createElement("div");
      box.id = "vl-next";
      box.innerHTML = '<div class="h">// Читати далі</div>' + more.map(function (a) {
        return '<a href="' + root + a.file + '">' + a.title + "<small>" + (a.read ? a.read + " хв · " : "") + (a.excerpt || "") + "</small></a>";
      }).join("");
      var foot = document.querySelector("footer");
      if (foot) foot.parentNode.insertBefore(box, foot); else document.body.appendChild(box);
    }
  }
})();
