#!/usr/bin/env python3
"""Збірка сайту CODE38.

Що робить:
  • генерує головні (index.html, en/index.html) і «Про автора» з одного шаблону,
    зі статичним списком статей — щоб Google бачив посилання без JavaScript;
  • вставляє в кожну статтю SEO-теги: canonical, Open Graph, Twitter, hreflang;
  • малює прев'ю-картинки 1200×630 для соцмереж (assets/og/*.jpg);
  • оновлює sitemap.xml і robots.txt.

Запуск із кореня репозиторію:  python3 tools/build.py
Адреса сайту і каталог статей беруться з assets/articles.js.
Підвал і контакти — з tools/partials/*.html (редагуються вручну).
"""
import html, json, os, re, subprocess
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

# ── каталог ──────────────────────────────────────────────────────────────
data = json.loads(subprocess.check_output(["node", "-e", """
global.window={}; require('./assets/articles.js');
console.log(JSON.stringify({url: window.SITE_URL, gc: window.GOATCOUNTER || '', topics: window.TOPICS, articles: window.ARTICLES}));
"""]))
SITE = data["url"].rstrip("/") + "/"
GC = data["gc"]
TOPICS = data["topics"]
ARTS = data["articles"]
for a in ARTS:
    a.setdefault("lang", "uk")
BY_ID = {a["id"]: a for a in ARTS}
LANGS = ["uk"] + (["en"] if any(a["lang"] == "en" and not a.get("draft") for a in ARTS) else [])
esc = lambda s: html.escape(str(s), quote=True)
partial = lambda name: open(f"tools/partials/{name}", encoding="utf-8").read().strip()

I18N = {
    "uk": dict(
        months=["січ","лют","бер","кві","тра","чер","лип","сер","вер","жов","лис","гру"],
        min="хв", soon="СКОРО", all="Усі", allDesc="Усі матеріали.",
        n=lambda n: f"{n} " + ("стаття" if n % 10 == 1 and n % 100 != 11 else "статті" if 2 <= n % 10 <= 4 and not 12 <= n % 100 <= 14 else "статей"),
        title="CODE38 — аналітика: геополітика, оборона, економіка",
        desc="Аналітичні статті CODE38 про геополітику, оборону, економіку України та фінанси — на документах, а не на емоціях.",
        ogdesc="Геополітика, оборона, економіка України та фінанси — без рожевих окулярів.",
        tag="аналітика", nav_articles="Статті", nav_topics="Теми", nav_about="Про автора",
        kicker="// Аналітика без рожевих окулярів",
        h1='Геополітика, оборона й економіка — <em>розібрані на документах</em>, а не на емоціях.',
        lede="Довгі тексти про те, як насправді ухвалюються рішення: в держбюджеті, у Вашингтоні, на фронті та у вашому гаманці.",
        s_a="статей", s_t="рубрик", s_m="хвилин читання", search="Пошук за назвою чи тегом…",
        topics="// Рубрики", switch_label="EN", switch_href="en/", locale="uk_UA",
        about_title="Про автора — CODE38", about_h="// Про автора",
        about_body=("<p>Пишу аналітичні статті українською та англійською — про геополітику, оборону, економіку України та фінанси. "
                    "Кожен текст спирається на першоджерела: звіти урядів, розсекречені документи, дані центробанків і розслідування, на які можна перейти й перевірити.</p>\n"
                    "    <p>Окремо працюю з консалтинговими задачами: ринкові стратегії, презентації, аналітичні записки.</p>"),
        empty="Нічого не знайдено.",
        rss_title="RSS — CODE38", rss_h="Нові статті CODE38 у вашій RSS-читалці", rss_p="Скопіюйте адресу стрічки у будь-яку RSS-читалку — Feedly, Inoreader, NetNewsWire чи іншу. Нові статті з\u2019являтимуться там автоматично, без реєстрації на сайті.", rss_addr="// Адреса стрічки", rss_copy="Скопіювати адресу", rss_done="Скопійовано ✓",
        sub_t="// Нові статті", sub_p="Підпишіться, щоб не пропустити нові матеріали: RSS-стрічка працює в будь-якій читалці — Feedly, Inoreader, NetNewsWire.",
    ),
    "en": dict(
        months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        min="min", soon="SOON", all="All", allDesc="All articles.",
        n=lambda n: f"{n} article" + ("" if n == 1 else "s"),
        title="CODE38 — analysis: geopolitics, defense, economics",
        desc="CODE38 publishes long-form analysis on geopolitics, defense, Ukraine’s economy and finance — built on documents, not emotions.",
        ogdesc="Geopolitics, defense, Ukraine’s economy and finance — without rose-tinted glasses.",
        tag="analysis", nav_articles="Articles", nav_topics="Topics", nav_about="About",
        kicker="// Analysis without rose-tinted glasses",
        h1='Geopolitics, defense and economics — <em>taken apart on documents</em>, not emotions.',
        lede="Long reads on how decisions are really made: in state budgets, in Washington, at the front and in your wallet.",
        s_a="articles", s_t="topics", s_m="minutes of reading", search="Search by title or tag…",
        topics="// Topics", switch_label="UA", switch_href="../", locale="en_US",
        about_title="About — CODE38", about_h="// About",
        about_body=("<p>I write long-form analysis in Ukrainian and English — on geopolitics, defense, Ukraine’s economy and finance. "
                    "Every piece is built on primary sources: government reports, declassified documents, central-bank data and investigations you can open and check yourself.</p>\n"
                    "    <p>I also take on consulting work: market strategy, presentations and analytical memos.</p>"),
        empty="English translations are on the way.",
        rss_title="RSS — CODE38", rss_h="New CODE38 articles in your RSS reader", rss_p="Copy the feed address into any RSS reader — Feedly, Inoreader, NetNewsWire or another. New articles will appear there automatically, no sign-up on the site.", rss_addr="// Feed address", rss_copy="Copy address", rss_done="Copied ✓",
        sub_t="// New articles", sub_p="Subscribe so you don’t miss new pieces: the RSS feed works in any reader — Feedly, Inoreader, NetNewsWire.",
    ),
}

def topic_name(t, lang): return (t.get("name_en") or t["name"]) if lang == "en" else t["name"]
def topic_desc(t, lang): return (t.get("desc_en") or t["desc"]) if lang == "en" else t["desc"]

def fmt_date(d, lang):
    y, m, dd = d.split("-")
    mo = I18N[lang]["months"][int(m) - 1]
    return f"{mo} {int(dd)}, {y}" if lang == "en" else f"{int(dd)} {mo} {y}"

def url_of(a): return SITE + a["file"]
def og_of(key): return f"{SITE}assets/og/{key}.jpg"
def pair_of(a):
    p = BY_ID.get(a.get("translation", "")) or next((b for b in ARTS if b.get("translation") == a["id"]), None)
    return p if p and not p.get("draft") else None

# ── прев'ю-картинки ──────────────────────────────────────────────────────
def build_og():
    from PIL import Image, ImageDraw, ImageFont
    F = lambda n, s: ImageFont.truetype(f"tools/fonts/{n}", s)
    os.makedirs("assets/og", exist_ok=True)
    BG, GOLD, WHITE, DIM, LINE = (13, 15, 18), (200, 169, 110), (240, 242, 245), (138, 144, 155), (31, 35, 41)

    def frame():
        im = Image.new("RGB", (1200, 630), BG)
        d = ImageDraw.Draw(im)
        d.rectangle([0, 0, 1200, 6], fill=GOLD)
        mono = F("JetBrainsMono_500Medium.ttf", 30)
        d.text((72, 58), "CODE", font=mono, fill=WHITE)
        d.text((72 + d.textlength("CODE", font=mono), 58), "38", font=mono, fill=GOLD)
        return im, d

    def wrap(d, text, font, width):
        lines, cur = [], ""
        for w in text.split():
            t = (cur + " " + w).strip()
            if d.textlength(t, font=font) <= width: cur = t
            else: lines.append(cur); cur = w
        lines.append(cur)
        return lines

    def bottom(d, right=""):
        d.line([(72, 540), (1128, 540)], fill=LINE, width=2)
        meta = F("Inter_500Medium.ttf", 24)
        d.text((72, 560), "vadim.li", font=meta, fill=DIM)
        if right: d.text((1128 - d.textlength(right, font=meta), 560), right, font=meta, fill=DIM)

    for a in ARTS:
        if a.get("draft"): continue
        im, d = frame()
        t = next((x for x in TOPICS if x["id"] == a["topic"]), {"name": a["topic"]})
        d.text((72, 132), topic_name(t, a["lang"]).upper(), font=F("JetBrainsMono_500Medium.ttf", 22), fill=GOLD)
        for size in (66, 60, 54, 48, 44):
            f = F("PlayfairDisplay_900Black.ttf", size)
            lines = wrap(d, a["title"], f, 1056)
            if len(lines) <= 4: break
        y = 182
        for ln in lines[:4]:
            d.text((72, y), ln, font=f, fill=WHITE); y += int(size * 1.18)
        bottom(d, f'{a["read"]} {I18N[a["lang"]]["min"]}' if a.get("read") else "")
        im.save(f"assets/og/{a['id']}.jpg", quality=86, optimize=True, progressive=True)

    for lang in ("uk", "en"):
        im, d = frame()
        f = F("PlayfairDisplay_900Black.ttf", 64)
        y = 196
        for ln in wrap(d, re.sub(r"</?em>", "", I18N[lang]["h1"]), f, 1056)[:4]:
            d.text((72, y), ln, font=f, fill=WHITE); y += 78
        bottom(d)
        im.save(f"assets/og/home-{lang}.jpg", quality=86, optimize=True, progressive=True)

# ── SEO-теги ─────────────────────────────────────────────────────────────
SEO_RE = re.compile(r"\n?[ \t]*<!-- seo -->.*?<!-- /seo -->", re.S)

def seo_block(*, title, desc, url, img, otype, locale, alts=(), extra="", noindex=False):
    t = ["<!-- seo -->",
         f'<meta name="description" content="{esc(desc)}">',
         f'<link rel="canonical" href="{url}">',
         '<meta property="og:site_name" content="CODE38">',
         f'<meta property="og:type" content="{otype}">',
         f'<meta property="og:title" content="{esc(title)}">',
         f'<meta property="og:description" content="{esc(desc)}">',
         f'<meta property="og:url" content="{url}">',
         f'<meta property="og:image" content="{img}">',
         '<meta property="og:image:width" content="1200">',
         '<meta property="og:image:height" content="630">',
         f'<meta property="og:locale" content="{locale}">',
         '<meta name="twitter:card" content="summary_large_image">',
         f'<meta name="twitter:title" content="{esc(title)}">',
         f'<meta name="twitter:description" content="{esc(desc)}">',
         f'<meta name="twitter:image" content="{img}">',
         f'<link rel="icon" href="{SITE}assets/favicon.svg" type="image/svg+xml">']
    t += [f'<link rel="alternate" hreflang="{hl}" href="{href}">' for hl, href in alts]
    fl = "en" if locale.startswith("en") else "uk"
    t.append(f'<link rel="alternate" type="application/rss+xml" title="CODE38{" (EN)" if fl == "en" else ""}" href="{feed_url(fl)}">')
    if extra: t.append(extra)
    if noindex: t.append('<meta name="robots" content="noindex">')
    if GC: t.append(f'<script data-goatcounter="https://{GC}.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>')
    t.append("<!-- /seo -->")
    return "\n".join(t)

def build_article_seo():
    for a in ARTS:
        if a.get("draft") or not os.path.exists(a["file"]): continue
        p = pair_of(a)
        alts = []
        if p:
            uk = a if a["lang"] == "uk" else p
            alts = [(a["lang"], url_of(a)), (p["lang"], url_of(p)), ("x-default", url_of(uk))]
        ld = {"@context": "https://schema.org", "@type": "Article",
              "headline": a["title"], "description": a.get("excerpt", ""),
              "datePublished": a.get("date"), "dateModified": a.get("updated", a.get("date")),
              "inLanguage": a["lang"], "keywords": ", ".join(a.get("tags", [])),
              "author": {"@type": "Person", "name": "vadim.li",
                         "url": SITE + ("en/about.html" if a["lang"] == "en" else "about.html")},
              "publisher": {"@type": "Organization", "name": "CODE38", "url": SITE,
                            "logo": {"@type": "ImageObject", "url": SITE + "assets/logo.png"}},
              "image": og_of(a["id"]), "mainEntityOfPage": url_of(a)}
        extra = '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + "</script>"
        blk = seo_block(title=a["title"], desc=a.get("excerpt", ""), url=url_of(a), img=og_of(a["id"]),
                        otype="article", locale=I18N[a["lang"]]["locale"], alts=alts, extra=extra)
        s = open(a["file"], encoding="utf-8").read()
        s = SEO_RE.sub("", s)
        s = re.sub(r'<html lang="[^"]*"', f'<html lang="{a["lang"]}"', s, count=1)
        s = re.sub(r'\n?[ \t]*<meta property="og:[^>]*>', "", s)
        s = re.sub(r'\n?[ \t]*<meta[^>]*name="(?:description|twitter:[^"]*)"[^>]*>', "", s)
        s = re.sub(r'<title>.*?</title>', f'<title>{esc(a["title"])} — CODE38</title>', s, count=1, flags=re.S)
        s = re.sub(r'\n?[ \t]*<link rel="canonical"[^>]*>', "", s)
        s = s.replace("</head>", blk + "\n</head>", 1)
        open(a["file"], "w", encoding="utf-8").write(bust(s))

# ── версії файлів у assets/: оновлюють кеш браузера після кожної зміни ──
import hashlib
def asset_ver(name):
    return hashlib.md5(open(os.path.join("assets", name), "rb").read()).hexdigest()[:8]
def bust(s):
    return re.sub(r'(assets/(site\.css|site\.js|site-nav\.js|articles\.js))(\?v=\w+)?',
                  lambda m: f"{m.group(1)}?v={asset_ver(m.group(2))}", s)

# ── головні та «Про автора» ───────────────────────────────────────────────
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">')

def card_html(a, lang, root, newest=None):
    t = next((x for x in TOPICS if x["id"] == a["topic"]), {"name": a["topic"]})
    L = I18N[lang]
    cls = "card" + (" featured" if newest and a["id"] == newest else "") + (" draft" if a.get("draft") else "")
    tags = "".join(f"<span>#{esc(x)}</span>" for x in a.get("tags", []))
    when = f'<b>{L["soon"]}</b>' if a.get("draft") else fmt_date(a["date"], lang)
    mins = f'{a["read"]} {L["min"]}' if a.get("read") else ""
    inner = (f'<div class="top"><span class="t">{esc(topic_name(t, lang))}</span><span>{"UA" if a["lang"] == "uk" else a["lang"].upper()}</span></div>'
             f'<div class="body"><h2>{esc(a["title"])}</h2>' + (f'<p>{esc(a["excerpt"])}</p>' if a.get("excerpt") else "")
             + (f'<div class="tags">{tags}</div>' if tags else "") + "</div>"
             f'<div class="foot"><span>{when}</span><span>{mins}</span></div>')
    return f'<div class="{cls}">{inner}</div>' if a.get("draft") else f'<a class="{cls}" href="{root}{esc(a["file"])}">{inner}</a>'

def page_head(lang, title, desc, seo, root):
    return (f'<!DOCTYPE html>\n<html lang="{lang}">\n<head>\n<meta charset="UTF-8">\n'
            f'<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>{esc(title)}</title>\n'
            f'{FONTS}\n<link rel="stylesheet" href="{root}assets/site.css">\n{seo}\n</head>')

def header(lang, root, active):
    L = I18N[lang]
    home = root or "./"
    show = ("en" if lang == "uk" else "uk") in LANGS
    sw = (f'<a id="lang-switch" class="lang" href="{L["switch_href"]}" hreflang="{"en" if lang == "uk" else "uk"}"'
          f'{"" if show else " hidden"}>{L["switch_label"]}</a>')
    on = lambda k: ' class="on"' if k == active else ""
    return (f'<header class="site-head"><div class="wrap">\n'
            f'  <a class="logo" href="{home}">CODE<span>38</span><small>{L["tag"]}</small></a>\n'
            f'  <nav><a href="{home}"{on("home")}>{L["nav_articles"]}</a><a href="{home}#rubryky">{L["nav_topics"]}</a>'
            f'<a href="about.html"{on("about")}>{L["nav_about"]}</a>{sw}</nav>\n</div></header>')

def home_alts():
    return [("uk", SITE), ("en", SITE + "en/"), ("x-default", SITE)] if len(LANGS) > 1 else []

def write(path, text):
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    open(path, "w", encoding="utf-8").write(bust(text))

def build_home(lang):
    L = I18N[lang]
    root = "" if lang == "uk" else "../"
    arts = sorted([a for a in ARTS if a["lang"] == lang], key=lambda a: a.get("date", ""), reverse=True)
    arts = [a for a in arts if not a.get("draft")] + [a for a in arts if a.get("draft")]
    live = [a for a in arts if not a.get("draft")]
    cnt = lambda tid: sum(1 for a in live if a["topic"] == tid)
    chips = f'<button class="chip on" data-t="all">{L["all"]}<i>{len(live)}</i></button>' + "".join(
        f'<button class="chip" data-t="{t["id"]}">{esc(topic_name(t, lang))}<i>{cnt(t["id"])}</i></button>' for t in TOPICS)
    newest = live[0]["id"] if live else None
    grid = "".join(card_html(a, lang, root, newest) for a in arts) or f'<div class="empty">{L["empty"]}</div>'
    tps = "".join(f'<a href="#{t["id"]}"><b>{esc(topic_name(t, lang))}</b><span>{esc(topic_desc(t, lang))}</span><em>{L["n"](cnt(t["id"]))}</em></a>'
                  for t in TOPICS if lang == "uk" or cnt(t["id"]))
    site_ld = [{"@context": "https://schema.org", "@type": "WebSite", "name": "CODE38",
                "alternateName": ["code38", "CODE38 — vadim.li"], "url": SITE, "inLanguage": lang},
               {"@context": "https://schema.org", "@type": "Organization", "name": "CODE38",
                "url": SITE, "logo": SITE + "assets/logo.png"}]
    seo = seo_block(title=L["title"], desc=L["desc"], url=SITE if lang == "uk" else SITE + "en/",
                    extra='<script type="application/ld+json">' + json.dumps(site_ld, ensure_ascii=False) + "</script>",
                    img=og_of(f"home-{lang}"), otype="website", locale=L["locale"], alts=home_alts(),
                    noindex=lang not in LANGS)
    body = f"""
<body data-root="{root}">
{header(lang, root, "home")}

<main class="wrap">
  <section class="hero">
    <div class="k">{L["kicker"]}</div>
    <h1>{L["h1"]}</h1>
    <p>{L["lede"]}</p>
    <div class="stats">
      <div><b id="stat-a">{len(live)}</b>{L["s_a"]}</div>
      <div><b id="stat-t">{sum(1 for t in TOPICS if cnt(t["id"]))}</b>{L["s_t"]}</div>
      <div><b id="stat-m">{sum(a.get("read", 0) for a in live)}</b>{L["s_m"]}</div>
    </div>
  </section>

  <div class="controls">
    <div class="chips" id="chips">{chips}</div>
    <input class="search" id="q" type="search" placeholder="{L["search"]}" aria-label="{L["search"]}">
  </div>
  <div class="topic-desc" id="topic-desc">{L["allDesc"]}</div>
  <div class="grid" id="grid">{grid}</div>

  {subscribe_html(lang, root)}

  <div id="rubryky">
    <div class="sec-h">{L["topics"]}</div>
    <div class="topics" id="topics">{tps}</div>
  </div>
</main>

{partial(f"footer.{lang}.html")}

<script src="{root}assets/articles.js"></script>
<script src="{root}assets/site.js"></script>
</body>
</html>
"""
    write("index.html" if lang == "uk" else "en/index.html", page_head(lang, L["title"], L["desc"], seo, root) + body)

def build_about(lang):
    L = I18N[lang]
    root = "" if lang == "uk" else "../"
    url = SITE + ("about.html" if lang == "uk" else "en/about.html")
    alts = [("uk", SITE + "about.html"), ("en", SITE + "en/about.html")] if len(LANGS) > 1 else []
    seo = seo_block(title=L["about_title"], desc=L["desc"], url=url, img=og_of(f"home-{lang}"),
                    otype="profile", locale=L["locale"], alts=alts, noindex=lang not in LANGS)
    body = f"""
<body data-root="{root}">
{header(lang, root, "about")}
<main class="wrap">
  <article class="page">
    <div class="sec-h" style="margin:0 0 16px">{L["about_h"]}</div>
    <h1>vadim.li</h1>
    {L["about_body"]}
    {partial(f"contact.{lang}.html")}
  </article>
</main>
{partial(f"footer.{lang}.html")}
<script src="{root}assets/articles.js"></script>
<script src="{root}assets/site.js"></script>
</body>
</html>
"""
    write("about.html" if lang == "uk" else "en/about.html", page_head(lang, L["about_title"], L["desc"], seo, root) + body)

# ── RSS ───────────────────────────────────────────────────────────────────
def feed_url(lang): return SITE + ("en/" if lang == "en" else "") + "feed.xml"

def build_feed(lang):
    from email.utils import format_datetime
    from datetime import datetime, timezone
    L = I18N[lang]
    arts = [a for a in ARTS if a["lang"] == lang and not a.get("draft") and os.path.exists(a["file"])]
    arts.sort(key=lambda a: a.get("date", ""), reverse=True)
    rfc = lambda d: format_datetime(datetime.fromisoformat(d).replace(hour=9, tzinfo=timezone.utc))
    home = SITE + ("en/" if lang == "en" else "")
    xml = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">', "<channel>",
           f"  <title>CODE38{' (English)' if lang == 'en' else ''}</title>",
           f"  <link>{home}</link>",
           f"  <description>{esc(L['ogdesc'])}</description>",
           f"  <language>{'en' if lang == 'en' else 'uk'}</language>",
           f'  <atom:link href="{feed_url(lang)}" rel="self" type="application/rss+xml"/>',
           f"  <image><url>{SITE}assets/logo.png</url><title>CODE38</title><link>{home}</link></image>"]
    if arts: xml.append(f"  <lastBuildDate>{rfc(arts[0]['date'])}</lastBuildDate>")
    for a in arts[:30]:
        t = next((x for x in TOPICS if x["id"] == a["topic"]), None)
        img = f"assets/og/{a['id']}.jpg"
        xml += ["  <item>", f"    <title>{esc(a['title'])}</title>", f"    <link>{url_of(a)}</link>",
                f'    <guid isPermaLink="true">{url_of(a)}</guid>', f"    <pubDate>{rfc(a['date'])}</pubDate>",
                f"    <description>{esc(a.get('excerpt', ''))}</description>"]
        if t: xml.append(f"    <category>{esc(topic_name(t, lang))}</category>")
        if os.path.exists(img):
            xml.append(f'    <enclosure url="{SITE}{img}" length="{os.path.getsize(img)}" type="image/jpeg"/>')
        xml.append("  </item>")
    xml += ["</channel>", "</rss>"]
    write(("en/" if lang == "en" else "") + "feed.xml", "\n".join(xml) + "\n")

def build_rss_page(lang):
    L = I18N[lang]
    root = "" if lang == "uk" else "../"
    from urllib.parse import quote
    fu = feed_url(lang)
    url = SITE + ("en/" if lang == "en" else "") + "rss.html"
    seo = seo_block(title=L["rss_title"], desc=L["sub_p"], url=url, img=og_of(f"home-{lang}"),
                    otype="website", locale=L["locale"])
    readers = [("Feedly", "https://feedly.com/i/subscription/feed/" + quote(fu, safe="")),
               ("Inoreader", "https://www.inoreader.com/?add_feed=" + quote(fu, safe=""))]
    btns = "".join(f'<a href="{h}" target="_blank" rel="noopener">{n}</a>' for n, h in readers)
    body = f"""
<body>
{header(lang, root, "")}
<main class="wrap">
  <section class="hero">
    <div class="k">// RSS</div>
    <h1>{L["rss_h"]}</h1>
    <p>{L["rss_p"]}</p>
  </section>
  <div class="subscribe">
    <div class="sub-t">{L["rss_addr"]}</div>
    <p><code id="feed-url" style="word-break:break-all">{fu}</code></p>
    <div class="sub-b"><a href="#" id="copy-feed">{L["rss_copy"]}</a>{btns}</div>
  </div>
  <p style="margin-top:28px"><a href="{root or './'}" style="color:var(--amber)">← CODE38</a></p>
</main>
{partial(f"footer.{lang}.html")}
<script>
document.getElementById("copy-feed").addEventListener("click", function (e) {{
  e.preventDefault(); var b = this;
  try {{ navigator.clipboard.writeText("{fu}").then(function () {{ b.textContent = "{L["rss_done"]}"; }}); }} catch (_) {{}}
}});
</script>
</body>
</html>
"""
    write(("en/" if lang == "en" else "") + "rss.html", page_head(lang, L["rss_title"], L["sub_p"], seo, root) + body)

def subscribe_html(lang, root):
    L = I18N[lang]
    from urllib.parse import quote
    feedly = "https://feedly.com/i/subscription/feed/" + quote(feed_url(lang), safe="")
    return (f'<div class="subscribe"><div class="sub-t">{L["sub_t"]}</div><p>{L["sub_p"]}</p>'
            f'<div class="sub-b"><a href="{root}{"en/" if lang == "en" else ""}rss.html">RSS</a><a href="{feedly}" target="_blank" rel="noopener">Feedly</a></div></div>')

# ── sitemap / robots ──────────────────────────────────────────────────────
def build_sitemap():
    today = date.today().isoformat()
    entries = [(SITE, today, home_alts()), (SITE + "about.html", today, [])]
    if "en" in LANGS:
        entries += [(SITE + "en/", today, home_alts()), (SITE + "en/about.html", today, [])]
    for a in sorted(ARTS, key=lambda a: a.get("date", ""), reverse=True):
        if a.get("draft") or not os.path.exists(a["file"]): continue
        p = pair_of(a)
        entries.append((url_of(a), a.get("date", today), [(a["lang"], url_of(a)), (p["lang"], url_of(p))] if p else []))
    xml = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for loc, mod, alts in entries:
        xml += ["  <url>", f"    <loc>{esc(loc)}</loc>", f"    <lastmod>{mod}</lastmod>"]
        xml += [f'    <xhtml:link rel="alternate" hreflang="{hl}" href="{esc(h)}"/>' for hl, h in alts]
        xml.append("  </url>")
    xml.append("</urlset>")
    write("sitemap.xml", "\n".join(xml) + "\n")
    write("robots.txt", f"User-agent: *\nAllow: /\n\nSitemap: {SITE}sitemap.xml\n")

if __name__ == "__main__":
    build_og()
    build_article_seo()
    for lang in ("uk", "en"):
        build_home(lang)
        build_about(lang)
        if lang in LANGS: build_feed(lang); build_rss_page(lang)
    build_sitemap()
    print("SITE:", SITE, "| мови:", LANGS, "| статей:", sum(1 for a in ARTS if not a.get("draft")))
