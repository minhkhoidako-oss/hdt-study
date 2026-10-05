/* HDT Study Article CMS
   Feed: Google Sheets published as CSV.
   Content is stored as plain text with lightweight Markdown-like conventions:
   ## Heading, - bullet, blank line = paragraph. */
(function () {
  'use strict';

  const FEED_URL = typeof GOOGLE_ARTICLES_CSV_URL === 'string'
    ? GOOGLE_ARTICLES_CSV_URL.trim()
    : '';

  const root = document.getElementById('articleApp');
  if (!root) return;

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = '';
    let quoted = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];
      if (quoted) {
        if (ch === '"' && next === '"') { cell += '"'; i++; }
        else if (ch === '"') quoted = false;
        else cell += ch;
      } else if (ch === '"') quoted = true;
      else if (ch === ',') { row.push(cell); cell = ''; }
      else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
      else if (ch !== '\r') cell += ch;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    if (!rows.length) return [];
    const headers = rows[0].map(v => String(v).trim());
    return rows.slice(1).filter(r => r.some(Boolean)).map(r => {
      const o = {}; headers.forEach((h, i) => { o[h] = (r[i] ?? '').trim(); }); return o;
    });
  }

  function normalizeText(value) {
    return String(value ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').trim();
  }

  function slugify(value) {
    return normalizeText(value).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function published(a) {
    const s = normalizeText(a.status);
    return s === 'published' || s === '1' || s === 'true' || s === 'da xuat ban';
  }

  function prepare(a) {
    return { ...a, slug: a.slug || slugify(a.title), category: a.category || 'Góc học tập', excerpt: a.excerpt || '' };
  }

  function formatDate(value) {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
  }

  function renderContent(text) {
    const lines = String(text || '').replace(/\r/g, '').split('\n');
    const html = [];
    let paragraph = [];
    let list = [];

    const flushParagraph = () => {
      if (paragraph.length) {
        html.push(`<p>${esc(paragraph.join(' ').trim())}</p>`);
        paragraph = [];
      }
    };
    const flushList = () => {
      if (list.length) {
        html.push(`<ul>${list.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`);
        list = [];
      }
    };

    lines.forEach(line => {
      const t = line.trim();
      if (!t) { flushParagraph(); flushList(); return; }
      if (t.startsWith('## ')) { flushParagraph(); flushList(); html.push(`<h2>${esc(t.slice(3).trim())}</h2>`); return; }
      if (t.startsWith('### ')) { flushParagraph(); flushList(); html.push(`<h3>${esc(t.slice(4).trim())}</h3>`); return; }
      if (t.startsWith('- ')) { flushParagraph(); list.push(t.slice(2).trim()); return; }
      flushList(); paragraph.push(t);
    });
    flushParagraph(); flushList();
    return html.join('');
  }

  function setMeta(article) {
    const title = `${article.title} | HDT Study`;
    const description = (article.excerpt || `${article.category}: ${article.title} trên HDT Study.`).replace(/\s+/g, ' ').slice(0, 155);
    const canonical = `${location.origin}/bai-viet.html?slug=${encodeURIComponent(article.slug)}`;
    document.title = title;
    const set = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
    set('meta[name="description"]', 'content', description);
    set('meta[property="og:title"]', 'content', title);
    set('meta[property="og:description"]', 'content', description);
    set('meta[property="og:url"]', 'content', canonical);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = canonical;

    const graph = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description,
      datePublished: article.publishedAt || undefined,
      mainEntityOfPage: canonical,
      inLanguage: 'vi',
      author: { '@type': 'Organization', name: 'HDT Study', url: location.origin },
      publisher: { '@type': 'Organization', name: 'HDT Study', url: location.origin }
    };
    let schema = document.getElementById('articleSchema');
    if (!schema) { schema = document.createElement('script'); schema.id = 'articleSchema'; schema.type = 'application/ld+json'; document.head.appendChild(schema); }
    schema.textContent = JSON.stringify(graph);
  }

  function renderHeader() {
    root.innerHTML = `
      <section class="article-hub-head">
        <div>
          <span class="hub-kicker">GÓC HỌC TẬP</span>
          <h1>Mẹo học, chiến lược & kinh nghiệm</h1>
          <p>Nội dung thực tế giúp học sinh học gọn hơn, ôn đúng trọng tâm và chuẩn bị tốt hơn cho các kỳ thi.</p>
        </div>
        <a class="article-back-link" href="index.html#goc-hoc">← Về trang chủ</a>
      </section>
      <div class="article-toolbar">
        <input id="articleSearch" type="search" placeholder="Tìm bài viết..." autocomplete="off" />
        <select id="articleCategory"><option value="all">Tất cả chủ đề</option></select>
      </div>
      <div id="articleList" class="article-list"></div>`;
  }

  function renderList(articles) {
    const list = document.getElementById('articleList');
    if (!list) return;
    if (!articles.length) {
      list.innerHTML = `<div class="article-empty"><strong>Chưa tìm thấy bài viết.</strong><span>Thử từ khóa khác.</span></div>`;
      return;
    }
    list.innerHTML = articles.map(a => `
      <article class="article-list-card">
        <div class="article-list-date">${esc(formatDate(a.publishedAt))}</div>
        <div class="article-list-main">
          <span class="article-list-category">${esc(a.category)}</span>
          <h2><a href="bai-viet.html?slug=${encodeURIComponent(a.slug)}">${esc(a.title)}</a></h2>
          <p>${esc(a.excerpt)}</p>
          <a class="article-read-link" href="bai-viet.html?slug=${encodeURIComponent(a.slug)}">Đọc bài →</a>
        </div>
      </article>`).join('');
  }

  function setupList(articles) {
    const input = document.getElementById('articleSearch');
    const select = document.getElementById('articleCategory');
    const categories = [...new Set(articles.map(a => a.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'vi'));
    categories.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c; select.appendChild(o); });
    const apply = () => {
      const q = normalizeText(input.value);
      const cat = select.value;
      const filtered = articles.filter(a => {
        if (cat !== 'all' && a.category !== cat) return false;
        if (!q) return true;
        const hay = normalizeText(`${a.title} ${a.category} ${a.excerpt} ${a.tags || ''}`);
        return hay.includes(q);
      });
      renderList(filtered);
    };
    input.addEventListener('input', apply);
    select.addEventListener('change', apply);
    renderList(articles);
  }

  function renderDetail(article, articles) {
    const description = article.excerpt || `${article.category}: ${article.title}`;
    const relatedSlugs = String(article.relatedSlugs || '').split(',').map(s => slugify(s)).filter(Boolean);
    const related = articles.filter(a => a.slug !== article.slug && (relatedSlugs.includes(a.slug) || a.category === article.category)).slice(0, 3);
    root.innerHTML = `
      <main class="article-detail-wrap">
        <article class="article-detail">
          <a class="article-breadcrumb" href="bai-viet.html">Góc học tập</a>
          <span class="article-detail-category">${esc(article.category)}</span>
          <h1>${esc(article.title)}</h1>
          <p class="article-detail-lead">${esc(description)}</p>
          <div class="article-detail-meta">${esc(formatDate(article.publishedAt))}</div>
          <div class="article-detail-content">${renderContent(article.content)}</div>
          ${related.length ? `<section class="article-related"><h2>Bài viết liên quan</h2><div class="article-related-grid">${related.map(a => `<a href="bai-viet.html?slug=${encodeURIComponent(a.slug)}"><span>${esc(a.category)}</span><strong>${esc(a.title)}</strong><small>Đọc bài →</small></a>`).join('')}</div></section>` : ''}
          <div class="article-detail-cta"><div><strong>HDT Study</strong><span>Tìm thêm tài liệu và đề thi miễn phí.</span></div><a href="index.html#tai-lieu">Khám phá tài liệu →</a></div>
        </article>
      </main>`;
    setMeta(article);
  }

  renderHeader();

  if (!FEED_URL) {
    document.getElementById('articleList').innerHTML = `<div class="article-empty"><strong>Chưa kết nối CMS bài viết.</strong><span>Hãy thêm GOOGLE_ARTICLES_CSV_URL vào config.js.</span></div>`;
    return;
  }

  fetch(FEED_URL, { cache: 'no-store' })
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
    .then(text => parseCsv(text).map(prepare).filter(a => a.title && published(a)))
    .then(articles => {
      articles.sort((a, b) => (Date.parse(b.publishedAt || '') || 0) - (Date.parse(a.publishedAt || '') || 0));
      const slug = new URLSearchParams(location.search).get('slug');
      if (slug) {
        const article = articles.find(a => a.slug === slug);
        if (article) {
          renderDetail(article, articles);
          return;
        }
      }
      setupList(articles);
    })
    .catch(() => {
      const list = document.getElementById('articleList');
      if (list) list.innerHTML = `<div class="article-empty"><strong>Không thể tải bài viết lúc này.</strong><span>Kiểm tra link CSV của sheet BaiViet.</span></div>`;
    });
})();
