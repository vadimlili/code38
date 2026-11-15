# vadim.li — сайт статей

Статичний сайт для GitHub Pages: без збирання, без фреймворків, без бази даних.

```
index.html              головна: рубрики, пошук, картки статей
about.html              про автора
404.html                сторінка помилки
CNAME.example           перейменуй у CNAME, коли підключатимеш домен
assets/
  articles.js           ← КАТАЛОГ: теми та список статей (редагуєш тільки його)
  site.css / site.js    стиль і логіка головної
  site-nav.js           верхня панель + «Читати далі» для сторінок статей
articles/
  geopolitics/  defense/  economy/  finance/  ideas/
```

## Як додати статтю (2 хвилини)

1. Поклади HTML-файл у потрібну папку, наприклад `articles/economy/pension-crisis.html`.
2. У самому файлі статті перед `</body>` встав два рядки:
   ```html
   <script src="../../assets/articles.js"></script>
   <script src="../../assets/site-nav.js"></script>
   ```
   Вони додадуть панель «← vadim.li / Рубрика» зверху та блок «Читати далі» внизу.
3. Відкрий `assets/articles.js` і додай (або виправ) блок:
   ```js
   {
     title: "Назва статті",
     file: "articles/economy/pension-crisis.html",
     topic: "economy",          // id з TOPICS
     tags: ["пенсії", "НБУ"],
     date: "2026-11-20",        // РРРР-ММ-ДД, по ній сортування
     lang: "uk",
     read: 14,                  // хвилин читання
     excerpt: "Один-два рядки анонсу.",
     featured: false            // true = золота рамка «ГОЛОВНЕ»
   },
   ```
   У каталозі вже є 5 чернеток (`draft: true`) для статей, які в тебе вже є. Перевір назву файлу, прибери `draft: true`, і стаття з'явиться на сайті.

Нова рубрика: додай рядок у `TOPICS` і створи папку в `articles/`.

## Публікація

Сайт живе в репозиторії `vadimlili/code38`. Після кожного коміту в `main` GitHub Pages оновлює його за хвилину:
`https://vadimlili.github.io/code38/`

Перший раз: **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.

## Підключення свого домену

1. Купи домен у будь-якого реєстратора (Cloudflare, Namecheap, Porkbun тощо).
2. У DNS-налаштуваннях домену створи записи:

   | Тип   | Ім'я  | Значення               |
   |-------|-------|------------------------|
   | A     | @     | 185.199.108.153        |
   | A     | @     | 185.199.109.153        |
   | A     | @     | 185.199.110.153        |
   | A     | @     | 185.199.111.153        |
   | CNAME | www   | vadimlili.github.io    |

3. Перейменуй `CNAME.example` → `CNAME`, усередині — тільки твій домен (наприклад `vadim.li`). Залий у репозиторій.
4. **Settings → Pages → Custom domain** → впиши домен → Save. Коли DNS оновиться (від кількох хвилин до доби), постав галочку **Enforce HTTPS**.

Порада: увімкни **Settings → Pages → Verify domain** (через TXT-запис), щоб ніхто інший не зміг прив'язати твій домен до свого репозиторію.
