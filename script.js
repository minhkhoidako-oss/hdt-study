const icons = {
  math: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="7" width="34" height="34" rx="10"/><path d="M15 16h18M15 23h18M15 30h18"/><path d="M22 13v22"/></svg>`,
  literature: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 9h17a7 7 0 0 1 7 7v23H19a7 7 0 0 1-7-7V9Z"/><path d="M36 16v23H19"/><path d="M19 18h11M19 24h9M19 30h11"/></svg>`,
  english: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="9" width="36" height="27" rx="7"/><path d="M12 15h10M27 15h7M12 22h24M12 29h15"/><path d="M16 40h16"/></svg>`,
  physics: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="4"/><ellipse cx="24" cy="24" rx="17" ry="7"/><ellipse cx="24" cy="24" rx="17" ry="7" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="17" ry="7" transform="rotate(120 24 24)"/></svg>`,
  chemistry: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 8h12M21 8v11L12 34a6 6 0 0 0 5 8h14a6 6 0 0 0 5-8l-9-15V8"/><path d="M15 31h18"/></svg>`,
  biology: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 12c11 4 18 12 18 22 0 7-4 10-9 10s-9-5-9-12c0-8 1-14 0-20Z"/><path d="M33 16c-7 3-12 8-17 17M24 16l-1 22"/></svg>`,
  geography: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17"/><path d="M7 24h34M24 7c5 5 7 11 7 17s-2 12-7 17M24 7c-5 5-7 11-7 17s2 12 7 17"/><path d="M12 14c4 2 8 3 12 3s8-1 12-3"/></svg>`,
  history: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 12h15a7 7 0 0 1 7 7v19H17a7 7 0 0 1-7-7V12Z"/><path d="M39 12H24a7 7 0 0 0-7 7v19h15a7 7 0 0 0 7-7V12Z"/><path d="M18 19h8M18 25h9M30 19h3M30 25h3"/></svg>`,
  civics: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 16h30L24 9 9 16Z"/><path d="M13 18v15M21 18v15M27 18v15M35 18v15"/><path d="M8 37h32M7 40h34"/></svg>`,
  file: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 6h18l8 8v28H12a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4Z"/><path d="M30 6v9h8M15 24h18M15 30h18M15 36h11"/></svg>`,
};

const subjectIconByName = {
  'Toán': icons.math,
  'Ngữ Văn': icons.literature,
  'Tiếng Anh': icons.english,
  'Vật Lý': icons.physics,
  'Hóa Học': icons.chemistry,
  'Sinh Học': icons.biology,
  'Địa Lý': icons.geography,
  'Lịch Sử': icons.history,
  'GDKT&PL': icons.civics
};

const subjectTone = {
  'Toán': 'blue',
  'Ngữ Văn': 'rose',
  'Tiếng Anh': 'indigo',
  'Vật Lý': 'cyan',
  'Hóa Học': 'orange',
  'Sinh Học': 'green',
  'Địa Lý': 'amber',
  'Lịch Sử': 'violet',
  'GDKT&PL': 'teal'
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (quoted && next === '"') {
        cell += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (ch === ',' && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && next === '\n') i++;
      row.push(cell);
      cell = '';

      if (row.some(v => v.trim() !== '')) {
        rows.push(row);
      }

      row = [];
    } else {
      cell += ch;
    }
  }

  if (cell !== '' || row.length) {
    row.push(cell);
    if (row.some(v => v.trim() !== '')) {
      rows.push(row);
    }
  }

  if (!rows.length) return [];

  const headers = rows[0].map(h => h.trim().toLowerCase());

  return rows.slice(1).map(r =>
    Object.fromEntries(
      headers.map((h, i) => [h, (r[i] || '').trim()])
    )
  );
}

function truthy(v) {
  return [
    'true',
    '1',
    'yes',
    'y',
    'có',
    'co',
    'hot',
    'featured',
    'x'
  ].includes(String(v).toLowerCase().trim());
}

function slugifyVi(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"]/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[m] || m));
}

function normalizeSubject(value = '') {
  const s = String(value).trim().toLowerCase();

  const aliases = {
    'toan': 'Toán',
    'toán': 'Toán',
    'ngữ văn': 'Ngữ Văn',
    'ngu van': 'Ngữ Văn',
    'tiếng anh': 'Tiếng Anh',
    'tieng anh': 'Tiếng Anh',
    'vật lý': 'Vật Lý',
    'vat ly': 'Vật Lý',
    'hóa học': 'Hóa Học',
    'hoa hoc': 'Hóa Học',
    'sinh học': 'Sinh Học',
    'sinh hoc': 'Sinh Học',
    'địa lý': 'Địa Lý',
    'dia ly': 'Địa Lý',
    'lịch sử': 'Lịch Sử',
    'lich su': 'Lịch Sử',
    'gdkt&pl': 'GDKT&PL'
  };

  return aliases[s] || String(value).trim() || 'Khác';
}

function normalizeSearch(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}

function inferIcon(subject) {
  return subjectIconByName[normalizeSubject(subject)] || icons.file;
}

function toneFor(subject) {
  return subjectTone[normalizeSubject(subject)] || 'blue';
}

function driveIdFromUrl(url = '') {
  const m =
    String(url).match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    String(url).match(/[?&]id=([a-zA-Z0-9_-]+)/);

  return m ? m[1] : '';
}

function normalizeSheetResources(rows) {
  return rows
    .filter(r => r.title)
    .map((r, i) => {
      const subject = normalizeSubject(r.subject);
      const rawUrl = r.url || r.fileurl || '';
      const driveId = r.driveid || driveIdFromUrl(rawUrl);
      const title = String(r.title).trim();

      return {
        id: r.id || `sheet-${i + 1}`,
        grade: String(r.grade || '12').trim(),
        subject,
        type: String(r.type || r.category || 'Tài liệu').trim(),
        title,
        desc:
          r.desc ||
          r.description ||
          'Tài liệu học tập miễn phí trên HDT Study.',
        hot: truthy(r.hot),
        featured: truthy(r.featured),
        file: r.filesize || r.file || 'PDF',
        icon: inferIcon(subject),
        url: rawUrl,
        driveId,
        slug: r.slug || slugifyVi(title),
        publishedAt: r.publishedat || ''
      };
    });
}

async function loadFromGoogleSheet() {
  if (!GOOGLE_SHEET_CSV_URL) return null;

  const status = document.getElementById('sheetStatus');

  try {
    if (status) {
      status.innerHTML =
        '<span class="status-dot"></span>Đang đồng bộ tài liệu...';
    }

    const res = await fetch(GOOGLE_SHEET_CSV_URL, {
      cache: 'no-store'
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = normalizeSheetResources(
      parseCsv(await res.text())
    );

    if (!data.length) {
      throw new Error('Google Sheet không có tài liệu hợp lệ');
    }

    if (status) {
      status.innerHTML =
        `<span class="status-dot is-live"></span>Đã đồng bộ ${data.length} tài liệu`;
    }

    return data;
  } catch (err) {
    console.warn(
      'HDT Study: không tải được Google Sheet.',
      err
    );

    if (status) {
      status.innerHTML =
        '<span class="status-dot is-fallback"></span>Đang dùng dữ liệu dự phòng';
    }

    return null;
  }
}

const resources = [
  {
    id: 1,
    grade: '12',
    subject: 'Toán',
    type: 'Chuyên đề',
    title: 'Vectơ và hệ trục tọa độ trong không gian – Toán 12',
    desc:
      'Tài liệu 320 trang gồm lý thuyết, ví dụ, bài tập và bộ đề ôn tập về vectơ trong không gian.',
    hot: true,
    featured: true,
    file: 'PDF · 3.4 MB',
    icon: icons.math,
    url: 'https://drive.google.com/file/d/1ppIPBjEmOcA_x2I3hnFxUhIl3DjEgjvf/view?usp=sharing',
    driveId: '1ppIPBjEmOcA_x2I3hnFxUhIl3DjEgjvf'
  },
  {
    id: 2,
    grade: '12',
    subject: 'Lịch Sử',
    type: 'Tổng ôn',
    title: 'Tóm tắt kiến thức Lịch sử 12',
    desc:
      'Bộ tóm tắt kiến thức theo chủ đề, phù hợp để hệ thống nhanh trước khi luyện đề.',
    hot: true,
    featured: true,
    file: 'PDF · 391 KB',
    icon: icons.history,
    url: 'https://drive.google.com/file/d/1irE6iY-ep7Bz4woZDMu7LYz0veAqyP2I/view?usp=sharing',
    driveId: '1irE6iY-ep7Bz4woZDMu7LYz0veAqyP2I'
  },
  {
    id: 3,
    grade: '12',
    subject: 'Sinh Học',
    type: 'Tổng ôn',
    title: 'Tổng hợp toàn bộ kiến thức Sinh học 12',
    desc:
      'Tài liệu tổng hợp kiến thức Sinh học 12, dùng để rà soát và củng cố trước kỳ thi.',
    hot: true,
    featured: true,
    file: 'PDF · 16 MB',
    icon: icons.biology,
    url: 'https://drive.google.com/file/d/1KKUtRhBoQC6jdJM2TxQmWa5OBUK5u4bB/view?usp=sharing',
    driveId: '1KKUtRhBoQC6jdJM2TxQmWa5OBUK5u4bB'
  }
];

let activeGrade = 'all';
let activeSubject = 'all';
let activeType = 'all';
let shown = 6;
let query = '';
let resourceData = [...resources];

const grid = document.getElementById('resourceGrid');
const loadMore = document.getElementById('loadMoreBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const syncBtn = document.getElementById('syncBtn');

const docModal = document.getElementById('docModal');
const docModalClose = document.getElementById('docModalClose');
const docModalTitle = document.getElementById('docModalTitle');
const docModalDesc = document.getElementById('docModalDesc');
const docModalMeta = document.getElementById('docModalMeta');
const docModalDetails = document.getElementById('docModalDetails');
const docModalVisual = document.getElementById('docModalVisual');
const docModalView = document.getElementById('docModalView');
const docModalDownload = document.getElementById('docModalDownload');
const docModalCopy = document.getElementById('docModalCopy');
const docModalType = document.getElementById('docModalType');

function matches(r) {
  const gradeOk =
    activeGrade === 'all' || r.grade === activeGrade;

  const subjectOk =
    activeSubject === 'all' ||
    r.subject === activeSubject;

  const typeOk =
    activeType === 'all' ||
    r.type === activeType;

  const q = normalizeSearch(query);

  const hay = normalizeSearch(
    [
      r.title,
      r.subject,
      r.type,
      r.desc,
      r.grade,
      r.tags || ''
    ].join(' ')
  );

  return (
    gradeOk &&
    subjectOk &&
    typeOk &&
    (!q || hay.includes(q))
  );
}

function driveViewUrl(r) {
  return (
    r.url ||
    (r.driveId
      ? `https://drive.google.com/file/d/${r.driveId}/view`
      : '')
  );
}

function driveDownloadUrl(r) {
  return r.driveId
    ? `https://drive.google.com/uc?export=download&id=${r.driveId}`
    : driveViewUrl(r);
}

function render() {
  const filtered = resourceData.filter(matches);

  const sorted = [...filtered].sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) ||
      Number(b.hot) - Number(a.hot) ||
      String(b.publishedAt || '').localeCompare(
        String(a.publishedAt || '')
      ) ||
      String(a.title).localeCompare(
        String(b.title),
        'vi'
      )
  );

  const visible = sorted.slice(0, shown);

  grid.innerHTML = visible.length
    ? visible
        .map(r => {
          const tone = toneFor(r.subject);
          const hasUrl = Boolean(r.url || r.driveId);
          const viewUrl = driveViewUrl(r);
          const detailUrl =
            `tai-lieu?slug=${encodeURIComponent(
              r.slug || slugifyVi(r.title)
            )}`;

          return `
            <article
              class="resource-card tone-${tone}"
              data-doc-id="${escapeHtml(r.id)}"
              data-detail-url="${detailUrl}"
              tabindex="0"
              role="link"
              aria-label="Xem ${escapeHtml(r.title)}"
            >
              <div class="resource-thumb">
                <div class="resource-thumb-pattern"></div>

                <div class="resource-badge-row">
                  <span class="resource-type-badge">PDF</span>

                  <span class="resource-badge">
                    ${
                      r.hot
                        ? '<span class="badge-dot hot"></span>HOT · '
                        : ''
                    }
                    <span class="badge-dot free"></span>
                    MIỄN PHÍ
                  </span>
                </div>

                <div class="resource-visual">
                  <span class="resource-visual-icon">
                    ${r.icon || icons.file}
                  </span>

                  <span class="resource-visual-label">
                    ${escapeHtml(r.subject)}
                  </span>
                </div>
              </div>

              <div class="resource-body">
                <div class="resource-meta">
                  <span>Lớp ${escapeHtml(r.grade)}</span>
                  <span>${escapeHtml(r.subject)}</span>
                  <span>${escapeHtml(r.type)}</span>
                </div>

                <h3>${escapeHtml(r.title)}</h3>

                <p>${escapeHtml(r.desc)}</p>

                <div class="resource-footer">
                  <div class="resource-actions">
                    ${
                      hasUrl
                        ? `
                          <button
                            class="resource-link resource-detail-btn"
                            type="button"
                            data-doc-id="${escapeHtml(r.id)}"
                          >
                            Xem chi tiết <span>→</span>
                          </button>
                        `
                        : `
                          <span class="resource-link muted-link">
                            Sắp cập nhật
                          </span>
                        `
                    }

                    ${
                      hasUrl
                        ? `
                          <a
                            class="resource-download"
                            href="${escapeHtml(
                              driveDownloadUrl(r)
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-stop-card="true"
                          >
                            Tải PDF
                          </a>
                        `
                        : ''
                    }
                  </div>

                  <span class="resource-file">
                    ${escapeHtml(r.file)}
                  </span>
                </div>
              </div>
            </article>
          `;
        })
        .join('')
    : `
      <div
        class="empty"
        style="
          grid-column:1/-1;
          padding:30px;
          border:1px dashed #d7dfeb;
          border-radius:20px;
          text-align:center;
          color:#6b7a90;
        "
      >
        Không tìm thấy tài liệu phù hợp.
        Hãy thử từ khóa hoặc bộ lọc khác.
      </div>
    `;

  loadMore.style.display =
    sorted.length > shown ? 'inline-flex' : 'none';

  updateStats();

  grid
    .querySelectorAll('.resource-card')
    .forEach(card => {
      const go = () => {
        window.location.href =
          card.dataset.detailUrl ||
          `tai-lieu?id=${encodeURIComponent(
            card.dataset.docId
          )}`;
      };

      card.addEventListener('click', e => {
        if (
          e.target.closest(
            'a,[data-stop-card="true"]'
          )
        ) {
          return;
        }

        if (e.target.closest('button')) {
          go();
          return;
        }

        go();
      });

      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          go();
        }
      });
    });

  grid
    .querySelectorAll('.resource-detail-btn')
    .forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();

        const card = btn.closest('.resource-card');

        window.location.href =
          card?.dataset.detailUrl ||
          `tai-lieu?id=${encodeURIComponent(
            btn.dataset.docId
          )}`;
      });
    });
}

function updateStats() {
  const subjects = new Set(
    resourceData.map(r => r.subject).filter(Boolean)
  ).size;

  const grades = new Set(
    resourceData.map(r => r.grade).filter(Boolean)
  );

  const docCount = resourceData.length;

  const fmt = n =>
    n > 99
      ? `${Math.round(n / 10) * 10}+`
      : String(n);

  document.getElementById('statDocuments').textContent =
    fmt(docCount);

  document.getElementById('statSubjects').textContent =
    subjects ? fmt(subjects) : '0';

  document.getElementById('statGrades').textContent =
    grades.size
      ? Array.from(grades).sort().join('–')
      : '10–12';

  document.getElementById('heroStatDocuments').textContent =
    fmt(docCount);

  document.getElementById('heroStatSubjects').textContent =
    subjects ? fmt(subjects) : '0';

  document.getElementById('heroStatGrades').textContent =
    grades.size;
}

function setFilter({
  grade = activeGrade,
  subject = activeSubject,
  type = activeType,
  scroll = true
} = {}) {
  activeGrade = grade;
  activeSubject = subject;
  activeType = type;
  shown = 6;

  document.querySelectorAll('.chip').forEach(x =>
    x.classList.toggle(
      'active',
      x.dataset.grade === activeGrade
    )
  );

  if (scroll) {
    document
      .getElementById('tai-lieu')
      .scrollIntoView({ behavior: 'smooth' });
  }

  render();
}

document
  .querySelectorAll('.chip')
  .forEach(btn =>
    btn.addEventListener('click', () =>
      setFilter({ grade: btn.dataset.grade })
    )
  );

document
  .querySelectorAll('.subject-filter')
  .forEach(btn =>
    btn.addEventListener('click', () =>
      setFilter({
        grade: 'all',
        subject: btn.dataset.subject,
        type: 'all'
      })
    )
  );

document
  .querySelectorAll('.type-filter')
  .forEach(btn =>
    btn.addEventListener('click', () =>
      setFilter({
        grade: 'all',
        subject: 'all',
        type: btn.dataset.type
      })
    )
  );

loadMore.addEventListener('click', () => {
  shown += 3;
  render();
});

searchBtn.addEventListener('click', () => {
  query = searchInput.value.trim();
  shown = 9;

  document
    .getElementById('tai-lieu')
    .scrollIntoView({ behavior: 'smooth' });

  render();
});

searchInput.addEventListener('input', () => {
  query = searchInput.value.trim();

  if (query.length === 0) {
    shown = 6;
    render();
  }
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

document
  .getElementById('menuBtn')
  .addEventListener('click', () => {
    const n = document.getElementById('mobileNav');
    const b = document.getElementById('menuBtn');

    const open = n.style.display === 'block';

    n.style.display = open ? 'none' : 'block';

    b.setAttribute(
      'aria-expanded',
      String(!open)
    );
  });

document
  .querySelectorAll('.mobile-nav a')
  .forEach(a =>
    a.addEventListener(
      'click',
      () =>
        (document.getElementById(
          'mobileNav'
        ).style.display = 'none')
    )
  );

document.getElementById('year').textContent =
  new Date().getFullYear();

function openDocument(id) {
  const r = resourceData.find(
    x => String(x.id) === String(id)
  );

  if (!r) return;

  const tone = toneFor(r.subject);

  docModalVisual.className =
    `doc-modal-visual tone-${tone}`;

  docModalVisual.innerHTML = `
    <div class="resource-visual-icon">
      ${r.icon || icons.file}
    </div>
    <span>${escapeHtml(r.subject)}</span>
  `;

  docModalType.textContent =
    (r.type || 'PDF').toUpperCase();

  docModalMeta.innerHTML = `
    <span>Lớp ${escapeHtml(r.grade)}</span>
    <span>${escapeHtml(r.subject)}</span>
    <span>${escapeHtml(r.type)}</span>
  `;

  docModalTitle.textContent = r.title;
  docModalDesc.textContent = r.desc || '';

  docModalDetails.innerHTML = `
    <div>
      <span>Định dạng</span>
      <strong>PDF</strong>
    </div>

    <div>
      <span>Dung lượng</span>
      <strong>${escapeHtml(r.file || 'PDF')}</strong>
    </div>

    <div>
      <span>Trạng thái</span>
      <strong>MIỄN PHÍ</strong>
    </div>

    ${
      r.hot
        ? `
          <div>
            <span>Ưu tiên</span>
            <strong>HOT</strong>
          </div>
        `
        : ''
    }
  `;

  const view = driveViewUrl(r);
  const download = driveDownloadUrl(r);
  const enabled = Boolean(view);

  docModalView.href = view || '#';
  docModalDownload.href = download || '#';

  docModalView.style.pointerEvents =
    enabled ? 'auto' : 'none';

  docModalDownload.style.pointerEvents =
    enabled ? 'auto' : 'none';

  docModalCopy.dataset.url = view || '';

  docModal.classList.add('is-open');
  docModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  docModalClose.focus();
}

function closeDocument() {
  docModal.classList.remove('is-open');
  docModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

docModalClose.addEventListener(
  'click',
  closeDocument
);

docModal.addEventListener('click', e => {
  if (e.target.matches('[data-close-modal]')) {
    closeDocument();
  }
});

document.addEventListener('keydown', e => {
  if (
    e.key === 'Escape' &&
    docModal.classList.contains('is-open')
  ) {
    closeDocument();
  }
});

docModalCopy.addEventListener(
  'click',
  async () => {
    const url = docModalCopy.dataset.url;

    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);

      const old = docModalCopy.textContent;

      docModalCopy.textContent = 'Đã sao chép';

      setTimeout(
        () => (docModalCopy.textContent = old),
        1400
      );
    } catch {
      window.prompt(
        'Sao chép liên kết tài liệu:',
        url
      );
    }
  }
);

async function syncResources() {
  const remote = await loadFromGoogleSheet();

  if (remote) {
    resourceData = remote;
    render();
    return true;
  }

  render(); 
  return false;
}

if (syncBtn) {
  syncBtn.addEventListener(
    'click',
    async () => {
      syncBtn.disabled = true;
      syncBtn.textContent = '↻ Đang đồng bộ...';

      await syncResources();

      setTimeout(() => {
        syncBtn.disabled = false;
        syncBtn.textContent = '↻ Đồng bộ';
      }, 700);
    }
  );
}

(async function init() {
  await syncResources();
})();
/* HDT FINAL DETAIL UX FIX
   Prevent full-page reload when clicking "Xem chi tiết".
   Keeps shareable ?slug=... URLs via History API and opens the existing modal.
*/
(function () {
  function findResourceBySlug(slug) {
    if (!slug || !Array.isArray(resourceData)) return null;
    const normalized = String(slug).trim().toLowerCase();

    return resourceData.find((r) => {
      const candidate = r.slug || slugifyVi(r.title);
      return String(candidate).toLowerCase() === normalized;
    }) || null;
  }

  function detailUrlFor(r) {
    const slug = r?.slug || slugifyVi(r?.title || '');
    return `tai-lieu?slug=${encodeURIComponent(slug)}`;
  }

  function updateDocumentSeo(r) {
    if (!r) return;

    const title = `${r.title} | HDT Study`;

    const description =
      r.desc ||
      `Tài liệu ${r.subject || ''} lớp ${r.grade || ''} miễn phí trên HDT Study.`;

    const canonicalUrl =
      `${window.location.origin}/${detailUrlFor(r).replace(/^\//, '')}`;

    document.title = title;

    const descriptionMeta =
      document.querySelector('meta[name="description"]');

    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', description);
    }

    let canonical =
      document.querySelector('link[rel="canonical"]');

    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }

    canonical.href = canonicalUrl;

    const ogTitle =
      document.querySelector('meta[property="og:title"]');

    const ogDescription =
      document.querySelector('meta[property="og:description"]');

    const ogUrl =
      document.querySelector('meta[property="og:url"]');

    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }

    if (ogUrl) {
      ogUrl.setAttribute('content', canonicalUrl);
    }
  }

  function restoreListSeo() {
    document.title =
      'HDT Study — Tài liệu ôn thi THPTQG miễn phí';

    const descriptionMeta =
      document.querySelector('meta[name="description"]');

    if (descriptionMeta) {
      descriptionMeta.setAttribute(
        'content',
        'HDT Study – kho tài liệu ôn thi THPTQG miễn phí, đề thi, chuyên đề và tài liệu học tập cho học sinh THPT.'
      );
    }

    const canonical =
      document.querySelector('link[rel="canonical"]');

    if (canonical) {
      canonical.href = `${window.location.origin}/`;
    }

    const ogTitle =
      document.querySelector('meta[property="og:title"]');

    const ogDescription =
      document.querySelector('meta[property="og:description"]');

    const ogUrl =
      document.querySelector('meta[property="og:url"]');

    if (ogTitle) {
      ogTitle.setAttribute(
        'content',
        'HDT Study — Tài liệu ôn thi THPTQG miễn phí'
      );
    }

    if (ogDescription) {
      ogDescription.setAttribute(
        'content',
        'Kho tài liệu, đề thi và chuyên đề THPTQG miễn phí cho học sinh.'
      );
    }

    if (ogUrl) {
      ogUrl.setAttribute(
        'content',
        `${window.location.origin}/`
      );
    }
  }

  function openFromSlug(slug, push) {
    const r = findResourceBySlug(slug);

    if (!r) return false;

    if (push) {
      history.pushState(
        {
          hdtDocument:
            r.slug || slugifyVi(r.title)
        },
        '',
        detailUrlFor(r)
      );
    }

    openDocument(r.id);
    updateDocumentSeo(r);

    return true;
  }

  function closeAndCleanUrl() {
    closeDocument();

    if (
      new URLSearchParams(window.location.search).has('slug')
    ) {
      history.replaceState({}, '', 'tai-lieu');
      restoreListSeo();
    }
  }

  // Capture clicks before the old card handlers run,
  // so no full-page navigation occurs.
  document.addEventListener(
    'click',
    function (event) {
      const detailBtn =
        event.target.closest?.('.resource-detail-btn');

      const card =
        event.target.closest?.('.resource-card');

      if (detailBtn) {
        const resource = resourceData.find(
          (r) =>
            String(r.id) ===
            String(detailBtn.dataset.docId)
        );

        if (!resource) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        openFromSlug(
          resource.slug ||
            slugifyVi(resource.title),
          true
        );

        return;
      }

      // Preserve download links and other interactive elements.
      if (
        !card ||
        event.target.closest(
          'a,button,input,select,textarea,[data-stop-card="true"]'
        )
      ) {
        return;
      }

      const resource = resourceData.find(
        (r) =>
          String(r.id) ===
          String(card.dataset.docId)
      );

      if (!resource) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      openFromSlug(
        resource.slug ||
          slugifyVi(resource.title),
        true
      );
    },
    true
  );

  docModalClose.addEventListener(
    'click',
    function () {
      if (
        new URLSearchParams(window.location.search).has(
          'slug'
        )
      ) {
        history.replaceState({}, '', 'tai-lieu');
        restoreListSeo();
      }
    }
  );

  window.addEventListener(
    'popstate',
    function () {
      const slug =
        new URLSearchParams(
          window.location.search
        ).get('slug');

      if (slug) {
        openFromSlug(slug, false);
      } else {
        closeDocument();
        restoreListSeo();
      }
    }
  );

  // If a user opens a shareable ?slug=... URL directly,
  // show the matching document modal after Google Sheets data renders.
  const gridEl =
    document.getElementById('resourceGrid');

  if (gridEl) {
    const observer =
      new MutationObserver(function () {
        const slug =
          new URLSearchParams(
            window.location.search
          ).get('slug');

        if (!slug) return;

        if (openFromSlug(slug, false)) {
          observer.disconnect();
        }
      });

    observer.observe(gridEl, {
      childList: true
    });
  }

  // Initial fallback for a very fast/local render.
  setTimeout(function () {
    const slug =
      new URLSearchParams(
        window.location.search
      ).get('slug');

    if (slug) {
      openFromSlug(slug, false);
    }
  }, 1200);
})();


/* =========================================================
   HDT FINAL SEARCH ENHANCEMENT
   - Không đụng vào logic "Xem chi tiết"
   - Tìm không dấu
   - Từ đồng nghĩa
   - Kỳ thi: THPTQG / ĐGNL / V-ACT / HSA / ĐGTD / TSA
   - Cho phép lỗi gõ nhẹ
   - Tìm theo title / subject / type / grade / desc / tags / exam
   - Search realtime khi người dùng nhập
   ========================================================= */

(function initAdvancedSearch() {
  const aliasMap = {
    thptqg: [
      'thptqg',
      'tot nghiep thpt',
      'thi tot nghiep',
      'tot nghiep'
    ],

    'tot nghiep': [
      'tot nghiep',
      'tot nghiep thpt',
      'thptqg'
    ],

    dgnl: [
      'dgnl',
      'danh gia nang luc',
      'vac t',
      'vac-t',
      'v act',
      'v-act',
      'hsa'
    ],

    'danh gia nang luc': [
      'danh gia nang luc',
      'dgnl',
      'vac t',
      'vac-t',
      'v act',
      'v-act',
      'hsa'
    ],

    'vac t': [
      'vac t',
      'vac-t',
      'v act',
      'v-act',
      'dgnl',
      'danh gia nang luc'
    ],

    'vac-t': [
      'vac t',
      'vac-t',
      'v act',
      'v-act',
      'dgnl',
      'danh gia nang luc'
    ],

    hsa: [
      'hsa',
      'dgnl',
      'danh gia nang luc'
    ],

    dgtd: [
      'dgtd',
      'danh gia tu duy',
      'tsa'
    ],

    'danh gia tu duy': [
      'danh gia tu duy',
      'dgtd',
      'tsa'
    ],

    tsa: [
      'tsa',
      'dgtd',
      'danh gia tu duy'
    ],

    'de thi': [
      'de thi',
      'de',
      'luyen de',
      'thi thu'
    ],

    'luyen de': [
      'luyen de',
      'de thi',
      'thi thu'
    ],

    toan: [
      'toan'
    ],

    'ngu van': [
      'ngu van',
      'van'
    ],

    'tieng anh': [
      'tieng anh',
      'english'
    ],

    'vat ly': [
      'vat ly',
      'ly'
    ],

    'hoa hoc': [
      'hoa hoc',
      'hoa'
    ],

    'sinh hoc': [
      'sinh hoc',
      'sinh'
    ],

    'lich su': [
      'lich su',
      'su'
    ],

    'dia ly': [
      'dia ly',
      'dia'
    ],

    'gdkt pl': [
      'gdkt pl',
      'gdkt&pl',
      'kinh te phap luat'
    ]
  };

  function normalize(value = '') {
    return String(value)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenize(value = '') {
    return normalize(value)
      .split(/\s+/)
      .filter(Boolean);
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a) return b.length;
    if (!b) return a.length;

    const prev = new Array(b.length + 1);

    for (let j = 0; j <= b.length; j++) {
      prev[j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
      let current = [i];

      for (let j = 1; j <= b.length; j++) {
        const insert = current[j - 1] + 1;
        const remove = prev[j] + 1;
        const replace =
          prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);

        current[j] = Math.min(
          insert,
          remove,
          replace
        );
      }

      for (let j = 0; j <= b.length; j++) {
        prev[j] = current[j];
      }
    }

    return prev[b.length];
  }

  function fuzzyTokenMatch(token, hayTokens) {
    if (!token || token.length < 4) {
      return false;
    }

    const maxDistance =
      token.length >= 7
        ? 2
        : 1;

    return hayTokens.some(
      candidate =>
        candidate.length >= 4 &&
        Math.abs(candidate.length - token.length) <= maxDistance &&
        levenshtein(token, candidate) <= maxDistance
    );
  }

  function expandToken(token) {
    const normalized = normalize(token);

    const aliases =
      aliasMap[normalized] || [normalized];

    return [
      normalized,
      ...aliases.map(normalize)
    ].filter(Boolean);
  }

  function termMatches(
    term,
    normalizedHay,
    hayTokens
  ) {
    const normalizedTerm = normalize(term);

    if (!normalizedTerm) {
      return true;
    }

    if (normalizedHay.includes(normalizedTerm)) {
      return true;
    }

    if (normalizedTerm.includes(' ')) {
      const words = normalizedTerm
        .split(/\s+/)
        .filter(Boolean);

      if (
        words.length &&
        words.every(word =>
          normalizedHay.includes(word)
        )
      ) {
        return true;
      }

      return false;
    }

    return fuzzyTokenMatch(
      normalizedTerm,
      hayTokens
    );
  }

  function advancedMatches(resource) {
    const gradeOk =
      activeGrade === 'all' ||
      String(resource.grade) === String(activeGrade);

    const subjectOk =
      activeSubject === 'all' ||
      normalize(resource.subject) ===
        normalize(activeSubject);

    const typeOk =
      activeType === 'all' ||
      normalize(resource.type) ===
        normalize(activeType);

    if (
      !gradeOk ||
      !subjectOk ||
      !typeOk
    ) {
      return false;
    }

    const rawQuery =
      String(query || '').trim();

    if (!rawQuery) {
      return true;
    }

    const normalizedHay = normalize(
      [
        resource.title,
        resource.subject,
        resource.type,
        resource.grade,
        resource.desc,

        resource.tags,
        resource.exam,
        resource.examType,
        resource.category,
        resource.keywords,
        resource.slug
      ]
        .filter(Boolean)
        .join(' ')
    );

    const hayTokens =
      tokenize(normalizedHay);

    /*
      Trường hợp người dùng nhập nguyên cụm:
      "đánh giá năng lực"
      "đánh giá tư duy"
      "tốt nghiệp thpt"
    */
    const wholeQuery =
      normalize(rawQuery);

    const wholeAliases =
      aliasMap[wholeQuery] || [];

    if (
      normalizedHay.includes(wholeQuery)
    ) {
      return true;
    }

    if (
      wholeAliases.some(alias =>
        normalizedHay.includes(normalize(alias))
      )
    ) {
      return true;
    }

    /*
      Trường hợp nhập nhiều từ:
      "toan 12"
      "lich su 12"
      "de thi toan"
      "dgnl 2026"
    */
    const tokens =
      tokenize(rawQuery);

    if (!tokens.length) {
      return true;
    }

    return tokens.every(token => {
      const alternatives =
        expandToken(token);

      return alternatives.some(
        term =>
          termMatches(
            term,
            normalizedHay,
            hayTokens
          )
      );
    });
  }

  /*
    Thay matcher cũ bằng matcher mới,
    KHÔNG đụng phần card/detail/modal.
  */
  matches = advancedMatches;

  /*
    Tìm realtime nhưng có debounce nhẹ
    để không render liên tục khi đang gõ.
  */
  let searchTimer = null;

  function runSearch({
    scroll = true
  } = {}) {
    query =
      String(searchInput?.value || '').trim();

    shown = query ? 9 : 6;

    if (
      scroll &&
      document.getElementById('tai-lieu')
    ) {
      document
        .getElementById('tai-lieu')
        .scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
    }

    render();
  }

  if (searchInput) {
    searchInput.placeholder =
      'Tìm tài liệu, môn học, lớp, ĐGNL, TSA...';

    /*
      Capture phase để chặn listener search cũ
      đang nằm trong script.js.
    */
    searchInput.addEventListener(
      'input',
      event => {
        event.stopImmediatePropagation();

        clearTimeout(searchTimer);

        searchTimer = setTimeout(() => {
          runSearch({
            scroll: false
          });
        }, 160);
      },
      true
    );

    searchInput.addEventListener(
      'keydown',
      event => {
        if (event.key !== 'Enter') {
          return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        clearTimeout(searchTimer);

        runSearch({
          scroll: true
        });
      },
      true
    );
  }

  if (searchBtn) {
    searchBtn.addEventListener(
      'click',
      event => {
        event.preventDefault();
        event.stopImmediatePropagation();

        clearTimeout(searchTimer);

        runSearch({
          scroll: true
        });
      },
      true
    );
  }
})();
