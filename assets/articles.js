/* =========================================================
   КАТАЛОГ САЙТУ CODE38
   Щоб додати статтю:
   1. Поклади HTML-файл у папку articles/<тема>/
      (англійську — у en/articles/<тема>/)
   2. Додай один блок у масив ARTICLES нижче
      id — коротка латинська назва, унікальна
      lang — "uk" або "en"
      translation — id статті-пари іншою мовою (якщо є)
   3. Запусти python3 tools/build.py — він оновить SEO-теги,
      sitemap.xml, превʼю-картинки та статичний список на головних
   ========================================================= */

/* Адреса сайту. Після підключення домену змінити тут
   і знову запустити tools/build.py */
window.SITE_URL = "https://code38.com.ua/";
// GoatCounter: ім'я сайту (vadim → vadim.goatcounter.com). Порожньо — лічильник вимкнено.
window.GOATCOUNTER = "vadim";

window.TOPICS = [
  { id: "geopolitics", name: "Геополітика",       desc: "Realpolitik, союзи, інтереси великих держав",
    name_en: "Geopolitics", desc_en: "Realpolitik, alliances and great-power interests" },
  { id: "defense",     name: "Оборона",           desc: "Війна, зброя, ППО, військова економіка",
    name_en: "Defense", desc_en: "War, weapons, air defense, military economics" },
  { id: "economy",     name: "Економіка України", desc: "Бюджет, пенсії, ринок праці, реформи",
    name_en: "Ukraine’s Economy", desc_en: "Budget, pensions, labor market, reforms" },
  { id: "finance",     name: "Гроші та фінанси",  desc: "Валюти, CBDC, інвестиції, особисті фінанси",
    name_en: "Money & Finance", desc_en: "Currencies, CBDC, investing, personal finance" },
  { id: "ideas",       name: "Історія та ідеї",   desc: "Макроісторія, філософія, альтернативні сценарії",
    name_en: "History & Ideas", desc_en: "Macrohistory, philosophy, alternative scenarios" }
];

window.ARTICLES = [
  {
    id: "realpolitik",
    title: "Геополітика без рожевих окулярів: чому зброю дають не за «хорошу поведінку»",
    file: "articles/geopolitics/realpolitik.html",
    topic: "geopolitics",
    tags: ["США", "ЦРУ", "військова допомога"],
    date: "2026-11-15",
    lang: "uk",
    read: 16,
    excerpt: "Шістдесят років таємних постачань США: диктатори, ісламісти, наркоторговці — і жодної довідки про відсутність корупції.",
    featured: true
  },
  {
    id: "tnc-vs-smart-money",
    title: "Економіка касирів чи нація творців?",
    file: "articles/economy/tnc-vs-smart-money.html",
    topic: "economy",
    tags: ["ТНК", "інвестиції", "Smart Money"],
    date: "2026-11-01",
    lang: "uk",
    read: 6,
    excerpt: "Гірка правда про глобальні бренди: чому експансія ТНК і справжні інвестиції в локальний бізнес — це дві різні речі."
  },
  {
    id: "mobilization-limits",
    title: "Економічні межі тотальної мобілізації",
    file: "articles/defense/mobilization-limits.html",
    topic: "defense",
    tags: ["мобілізація", "бюджет", "економіка війни"],
    date: "2026-07-25",
    lang: "uk",
    read: 15,
    excerpt: "Чому гасло «воювати будуть усі» не витримує зустрічі з бюджетом — і що робити з осінньою мобілізацією в Росії."
  },
  {
    id: "cbdc",
    title: "Чому «гроші, що згорають» — це економічне самогубство",
    file: "articles/finance/cbdc.html",
    topic: "finance",
    tags: ["CBDC", "макроекономіка", "теорії змови"],
    date: "2026-07-20",
    lang: "uk",
    read: 10,
    excerpt: "Популярна теорія змови про CBDC з позиції фундаментальної економіки — просто, з прикладами, без паніки."
  },
  {
    id: "pension-trap",
    title: "Пенсійна пастка: чому 30–40-річним варто розраховувати лише на власні інвестиції",
    file: "articles/economy/pension-trap.html",
    topic: "economy",
    tags: ["пенсії", "демографія", "інвестиції", "IBKR"],
    date: "2026-05-01",
    lang: "uk",
    read: 14,
    excerpt: "Демографічний колапс, банкрутство солідарної системи та практична стратегія особистих накопичень."
  },
  {
    id: "missile-defense",
    title: "Протибалістичний захист: технологія, стратегія та завдання для України",
    file: "articles/defense/missile-defense.html",
    topic: "defense",
    tags: ["ППО", "ПРО", "Patriot", "SAMP/T"],
    date: "2025-10-01",
    lang: "uk",
    read: 14,
    excerpt: "Patriot проти SAMP/T, ешелони перехоплення, раннє попередження, Link-16 і проєкт Freyja — що реально збиває балістику."
  },
  {
    id: "presidents-economy",
    title: "Долар по 8, дороги замість ракет і чому ми платимо досі",
    file: "articles/economy/presidents-economy.html",
    topic: "economy",
    tags: ["президенти", "НБУ", "держборг", "ЗВР"],
    date: "2025-03-01",
    lang: "uk",
    read: 25,
    excerpt: "Економічні рішення кожного президента України в цифрах — від гіперінфляції Кравчука до «долара по 8» і доріг замість ракет."
  },
  {
    id: "biocentrism",
    title: "Альтернативна макроісторія біоцентризму",
    file: "articles/ideas/biocentrism.html",
    topic: "ideas",
    tags: ["макроісторія", "енергетика", "нутриціологія"],
    date: "2025-06-01",
    lang: "uk",
    read: 12,
    excerpt: "Що було б, якби людство відмовилося від експлуатації тварин у XIV столітті: два сценарії — оптимістичний і критичний."
  },

  // ── English translations ──
  {
    id: "realpolitik-en",
    translation: "realpolitik",
    title: "Geopolitics without rose-tinted glasses: why weapons aren’t a reward for “good behavior”",
    file: "articles/geopolitics/realpolitik-en.html",
    topic: "geopolitics",
    tags: ["USA", "CIA", "military aid"],
    date: "2026-11-15",
    lang: "en",
    read: 16,
    excerpt: "Sixty years of covert US arms deliveries: dictators, Islamists, drug traffickers — and not one certificate of clean governance.",
    featured: true
  },
  {
    id: "mobilization-limits-en",
    translation: "mobilization-limits",
    title: "The economic limits of total mobilization",
    file: "articles/defense/mobilization-limits-en.html",
    topic: "defense",
    tags: ["mobilization", "budget", "war economy"],
    date: "2026-07-25",
    lang: "en",
    read: 15,
    excerpt: "Why the slogan “everyone will fight” doesn’t survive contact with the budget — and what to do about Russia’s autumn mobilization."
  },
  {
    id: "missile-defense-en",
    translation: "missile-defense",
    title: "Ballistic missile defense: technology, strategy and the task for Ukraine",
    file: "articles/defense/missile-defense-en.html",
    topic: "defense",
    tags: ["air defense", "BMD", "Patriot", "SAMP/T"],
    date: "2025-10-01",
    lang: "en",
    read: 14,
    excerpt: "Patriot vs SAMP/T, intercept layers, early warning, Link-16 and the Freyja project — what actually shoots down ballistic missiles."
  },
  {
    id: "tnc-vs-smart-money-en",
    translation: "tnc-vs-smart-money",
    title: "An economy of cashiers or a nation of creators?",
    file: "articles/economy/tnc-vs-smart-money-en.html",
    topic: "economy",
    tags: ["multinationals", "investment", "smart money"],
    date: "2026-11-01",
    lang: "en",
    read: 6,
    excerpt: "The bitter truth about global brands: why multinational expansion and real investment in local business are two different things."
  },
  {
    id: "cbdc-en",
    translation: "cbdc",
    title: "Why “expiring money” would be economic suicide",
    file: "articles/finance/cbdc-en.html",
    topic: "finance",
    tags: ["CBDC", "macroeconomics", "conspiracy theories"],
    date: "2026-07-20",
    lang: "en",
    read: 10,
    excerpt: "A popular conspiracy theory about CBDCs from the standpoint of basic economics — simply, with examples, without panic."
  },
  {
    id: "pension-trap-en",
    translation: "pension-trap",
    title: "The pension trap: why people in their 30s and 40s should rely only on their own investments",
    file: "articles/economy/pension-trap-en.html",
    topic: "economy",
    tags: ["pensions", "demography", "investment", "IBKR"],
    date: "2026-05-01",
    lang: "en",
    read: 14,
    excerpt: "Demographic collapse, the bankruptcy of the pay-as-you-go system and a practical strategy for personal savings."
  },
  {
    id: "presidents-economy-en",
    translation: "presidents-economy",
    title: "A dollar at 8, roads instead of missiles, and why we are still paying",
    file: "articles/economy/presidents-economy-en.html",
    topic: "economy",
    tags: ["presidents", "National Bank", "public debt", "FX reserves"],
    date: "2025-03-01",
    lang: "en",
    read: 25,
    excerpt: "The economic decisions of every Ukrainian president in numbers — from Kravchuk’s hyperinflation to the “dollar at 8” and roads instead of missiles."
  },
  {
    id: "biocentrism-en",
    translation: "biocentrism",
    title: "An alternative macrohistory of biocentrism",
    file: "articles/ideas/biocentrism-en.html",
    topic: "ideas",
    tags: ["macrohistory", "energy", "nutrition"],
    date: "2025-06-01",
    lang: "en",
    read: 12,
    excerpt: "What if humanity had renounced the exploitation of animals in the 14th century: two scenarios — an optimistic one and a critical one."
  }
];
