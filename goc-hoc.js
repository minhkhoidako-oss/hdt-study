/* HDT Góc học tập - homepage CMS bridge.
   Safe by design: if the article feed is not configured or fails,
   the existing static homepage cards remain untouched. */
(function () {
  'use strict';

  const FEED_URL = typeof GOOGLE_ARTICLES_CSV_URL === 'string'
    ? GOOGLE_ARTICLES_CSV_URL.trim()
    : '';

  if (!FEED_URL) return;

  const grid = document.querySelector('#goc-hoc .article-grid');
  const section = document.getElementById('goc-hoc');
  if (!grid || !section) return;

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = '';
    let quoted = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];

      if (quoted) {
        if (ch === '"' && next === '"') {
          cell += '"';
          i++;
        } else if (ch === '"') {
          quoted = false;
        } else {
          cell += ch;
        }
      } else if (ch === '"') {
        quoted = true;
      } else if (ch === ',') {
        row.push(cell);
        cell = '';
      } else if (ch === '\n') {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = '';
      } else if (ch !== '\r') {
        cell += ch;
      }
    }

    if (cell !== '' || row.length) {
      row.push(cell);
      rows.push(row);
    }

    if (!rows.length) return [];

    const headers = rows[0].map(v => String(v).trim());
    return rows.slice(1).filter(r => r.some(Boolean)).map(r => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (r[i] ?? '').trim(); });
      return obj;
    });
  }

  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function slugify(value) {
    return String(value ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function isPublished(article) {
    const status = String(article.status || '').toLowerCase().trim();
    return status === 'published' || status === '1' || status === 'true' || status === 'da xuat ban';
  }

  function dateValue(article) {
    const n = Date.parse(article.publishedAt || article.date || '');
    return Number.isNaN(n) ? 0 : n;
  }

  function normalize(article) {
    return {
      ...article,
      slug: article.slug || slugify(article.title),
      category: article.category || 'Góc học tập',
      excerpt: article.excerpt || '',
      featured: String(article.featured || '').toLowerCase() === 'true'
    };
  }

  function card(article, toneClass, icon) {
    return `
      <article class="article-card article-cms-card">
        <div class="article-thumb ${toneClass}">${icon}</div>
        <div class="article-body">
          <span>${esc(article.category)}</span>
          <h3>${esc(article.title)}</h3>
          <p>${esc(article.excerpt)}</p>
          <a href="bai-viet.html?slug=${encodeURIComponent(article.slug)}">
            Đọc bài <span class="arrow-icon" aria-hidden="true">→</span>
          </a>
        </div>
      </article>`;
  }

  const icons = {
    blue: '<svg class="article-icon" viewBox="0 0 48 48" aria-hidden="true"><path d="M18 27c-2.7-1.8-4-4.4-4-7.3A10 10 0 0 1 24 9a10 10 0 0 1 10 10.7c0 3-1.3 5.4-4 7.3-1.6 1.1-2 2.3-2 4.5h-8c0-2.2-.4-3.4-2-4.5Z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M19 36h10M21 40h6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    yellow: '<svg class="article-icon" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="14" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="24" cy="24" r="6" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="m33 15 8-8M35 7h6v6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    purple: '<svg class="article-icon" viewBox="0 0 48 48" aria-hidden="true"><path d="M10 11h12c3.3 0 6 2.7 6 6v22H16c-3.3 0-6-2.7-6-6V11Z" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M38 11H26c-3.3 0-6 2.7-6 6v22h12c3.3 0 6-2.7 6-6V11Z" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M16 19h6M16 24h6M26 19h6M26 24h6" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/></svg>'
  };

  fetch(FEED_URL, { cache: 'no-store' })
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    })
    .then(text => parseCsv(text).map(normalize).filter(a => a.title && isPublished(a)))
    .then(articles => {
      if (!articles.length) return;

      articles.sort((a, b) => Number(b.featured) - Number(a.featured) || dateValue(b) - dateValue(a));
      const selected = articles.slice(0, 3);
      const tones = ['thumb-blue', 'thumb-yellow', 'thumb-purple'];
      const iconKeys = ['blue', 'yellow', 'purple'];

      grid.innerHTML = selected
        .map((a, i) => card(a, tones[i], icons[iconKeys[i]]))
        .join('');

      const head = section.querySelector('.section-head');
      if (head && !head.querySelector('.article-hub-link')) {
        const link = document.createElement('a');
        link.className = 'secondary-btn article-hub-link';
        link.href = 'bai-viet.html';
        link.textContent = 'Xem tất cả bài viết →';
        head.appendChild(link);
      }
    })
    .catch(() => {
      // Keep the original static cards as a safe fallback.
    });
})();
