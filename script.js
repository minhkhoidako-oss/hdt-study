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
  computer: `<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="8" width="36" height="26" rx="5"/><path d="M16 40h16M24 34v6M14 15h20M14 21h9M27 21h7M14 27h16"/></svg>`,
  technology: `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M30 8a9 9 0 0 0-11 12L8 31l4 4 11-11A9 9 0 0 0 30 8Z"/><path d="m34 28 6 6-6 6-6-6M31 11l6-6M37 15l5-1"/></svg>`,
};

const subjectIconByName = {
  'Toán': icons.math, 'Ngữ Văn': icons.literature, 'Tiếng Anh': icons.english,
  'Vật Lý': icons.physics, 'Hóa Học': icons.chemistry, 'Sinh Học': icons.biology,
  'Địa Lý': icons.geography, 'Lịch Sử': icons.history, 'GDKT&PL': icons.civics,
  'Tin Học': icons.english, 'Công Nghệ': icons.file
};
const subjectTone = {
  'Toán': 'blue', 'Ngữ Văn': 'rose', 'Tiếng Anh': 'indigo', 'Vật Lý': 'cyan',
  'Hóa Học': 'orange', 'Sinh Học': 'green', 'Địa Lý': 'amber', 'Lịch Sử': 'violet',
  'GDKT&PL': 'teal', 'Tin Học': 'blue', 'Công Nghệ': 'orange'
};

function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (ch === '"') { if (quoted && next === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (ch === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && next === '\n') i++; row.push(cell); cell = '';
      if (row.some(v => v.trim() !== '')) rows.push(row); row = [];
    } else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); if (row.some(v => v.trim() !== '')) rows.push(row); }
  if (!rows.length) return [];
  const headers = rows[0].map(h => h.trim().toLowerCase());
  return rows.slice(1).map(r => Object.fromEntries(headers.map((h, i) => [h, (r[i] || '').trim()])));
}

function truthy(v) { return ['true','1','yes','y','có','co','hot','featured','x'].includes(String(v).toLowerCase().trim()); }
function slugifyVi(value = '') { return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,90); }
function escapeHtml(value = '') { return String(value).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m] || m)); }
function normalizeSubject(value = '') {
  const s = String(value).trim().toLowerCase();
  const aliases = {'toan':'Toán','toán':'Toán','ngữ văn':'Ngữ Văn','ngu van':'Ngữ Văn','tiếng anh':'Tiếng Anh','tieng anh':'Tiếng Anh','vật lý':'Vật Lý','vat ly':'Vật Lý','hóa học':'Hóa Học','hoa hoc':'Hóa Học','sinh học':'Sinh Học','sinh hoc':'Sinh Học','địa lý':'Địa Lý','dia ly':'Địa Lý','lịch sử':'Lịch Sử','lich su':'Lịch Sử','gdkt&pl':'GDKT&PL','gdkt pl':'GDKT&PL','tin học':'Tin Học','tin hoc':'Tin Học','công nghệ':'Công Nghệ','cong nghe':'Công Nghệ'};
  return aliases[s] || String(value).trim() || 'Khác';
}
function normalizeSearch(value = '') { return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim(); }
function inferIcon(subject) { return subjectIconByName[normalizeSubject(subject)] || icons.file; }
function toneFor(subject) { return subjectTone[normalizeSubject(subject)] || 'blue'; }
function driveIdFromUrl(url = '') { const m = String(url).match(/\/d\/([a-zA-Z0-9_-]+)/) || String(url).match(/[?&]id=([a-zA-Z0-9_-]+)/); return m ? m[1] : ''; }

function normalizeSheetResources(rows) {
  return rows.filter(r => r.title).map((r, i) => {
    const subject = normalizeSubject(r.subject);
    const rawUrl = r.url || r.fileurl || '';
    const exam = String(r.exam || r.examname || r.examtype || r.kythi || r['kỳ thi'] || '').trim();
    const tags = String(r.tags || r.keywords || r.tukhoa || r['từ khóa'] || '').trim();
    return {
      id: r.id || `sheet-${i + 1}`,
      grade: String(r.grade || '12').trim(),
      subject,
      type: String(r.type || r.category || 'Tài liệu').trim(),
      title: String(r.title).trim(),
      desc: r.desc || r.description || 'Tài liệu học tập miễn phí trên HDT Study.',
      exam,
      tags,
      keywords: tags,
      hot: truthy(r.hot),
      featured: truthy(r.featured),
      file: r.filesize || r.file || 'PDF',
      icon: inferIcon(subject),
      url: rawUrl,
      driveId: r.driveid || driveIdFromUrl(rawUrl),
      slug: r.slug || slugifyVi(r.title),
      publishedAt: r.publishedat || ''
    };
  });
}

async function loadFromGoogleSheet() {
  if (!GOOGLE_SHEET_CSV_URL) return null;
  const status = document.getElementById('sheetStatus');
  try {
    if (status) status.innerHTML = '<span class="status-dot"></span>Đang đồng bộ tài liệu...';
    const res = await fetch(GOOGLE_SHEET_CSV_URL, { cache:'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = normalizeSheetResources(parseCsv(await res.text()));
    if (!data.length) throw new Error('Google Sheet không có tài liệu hợp lệ');
    if (status) status.innerHTML = `<span class="status-dot is-live"></span>Đã đồng bộ ${data.length} tài liệu`;
    return data;
  } catch (err) {
    console.warn('HDT Study: không tải được Google Sheet.', err);
    if (status) status.innerHTML = '<span class="status-dot is-fallback"></span>Đang dùng dữ liệu dự phòng';
    return null;
  }
}

const resources = [
  {id:1,grade:'12',subject:'Toán',type:'Chuyên đề',title:'Vectơ và hệ trục tọa độ trong không gian – Toán 12',desc:'Tài liệu 320 trang gồm lý thuyết, ví dụ, bài tập và bộ đề ôn tập về vectơ trong không gian.',hot:true,featured:true,file:'PDF · 3.4 MB',icon:icons.math,url:'https://drive.google.com/file/d/1ppIPBjEmOcA_x2I3hnFxUhIl3DjEgjvf/view?usp=sharing',driveId:'1ppIPBjEmOcA_x2I3hnFxUhIl3DjEgjvf'},
  {id:2,grade:'12',subject:'Lịch Sử',type:'Tổng ôn',title:'Tóm tắt kiến thức Lịch sử 12',desc:'Bộ tóm tắt kiến thức theo chủ đề, phù hợp để hệ thống nhanh trước khi luyện đề.',hot:true,featured:true,file:'PDF · 391 KB',icon:icons.history,url:'https://drive.google.com/file/d/1irE6iY-ep7Bz4woZDMu7LYz0veAqyP2I/view?usp=sharing',driveId:'1irE6iY-ep7Bz4woZDMu7LYz0veAqyP2I'},
  {id:3,grade:'12',subject:'Sinh Học',type:'Tổng ôn',title:'Tổng hợp toàn bộ kiến thức Sinh học 12',desc:'Tài liệu tổng hợp kiến thức Sinh học 12, dùng để rà soát và củng cố trước kỳ thi.',hot:true,featured:true,file:'PDF · 16 MB',icon:icons.biology,url:'https://drive.google.com/file/d/1KKUtRhBoQC6jdJM2TxQmWa5OBUK5u4bB/view?usp=sharing',driveId:'1KKUtRhBoQC6jdJM2TxQmWa5OBUK5u4bB'}
];

let activeGrade='all', activeSubject='all', activeType='all', shown=6, query='';
let resourceData=[...resources];
const grid=document.getElementById('resourceGrid');
const loadMore=document.getElementById('loadMoreBtn');
const searchInput=document.getElementById('searchInput');
const searchBtn=document.getElementById('searchBtn');
const searchClear=document.getElementById('searchClear');
const searchFeedback=document.getElementById('searchFeedback');
const syncBtn=document.getElementById('syncBtn');
const docModal=document.getElementById('docModal'), docModalClose=document.getElementById('docModalClose'), docModalTitle=document.getElementById('docModalTitle'), docModalDesc=document.getElementById('docModalDesc'), docModalMeta=document.getElementById('docModalMeta'), docModalDetails=document.getElementById('docModalDetails'), docModalVisual=document.getElementById('docModalVisual'), docModalView=document.getElementById('docModalView'), docModalDownload=document.getElementById('docModalDownload'), docModalCopy=document.getElementById('docModalCopy'), docModalType=document.getElementById('docModalType');

// Search aliases are directional: a broad DGNL search includes related exams,
// while searching a specific exam such as HSA does not return V-ACT as an equivalent.
const SEARCH_QUERY_ALIASES = [
  { id: 'dgnl', triggers: ['dgnl', 'danh gia nang luc'], variants: ['dgnl', 'danh gia nang luc', 'v act', 'vact', 'hsa', 'hsca', 'h sca', 'spt'] },
  { id: 'dgtd', triggers: ['dgtd', 'danh gia tu duy', 'tsa'], variants: ['dgtd', 'danh gia tu duy', 'tsa'] },
  { id: 'vact', triggers: ['v act', 'vact'], variants: ['v act', 'vact'] },
  { id: 'hsa', triggers: ['hsa'], variants: ['hsa'] },
  { id: 'hsca', triggers: ['hsca', 'h sca'], variants: ['hsca', 'h sca'] },
  { id: 'spt', triggers: ['spt'], variants: ['spt', 'dgnl spt'] },
  { id: 'thptqg', triggers: ['thptqg', 'thpt', 'tn thpt', 'tot nghiep thpt', 'thi tot nghiep'], variants: ['thptqg', 'thpt', 'tn thpt', 'tot nghiep thpt', 'thi tot nghiep'] }
].map(group => ({ ...group, triggers: group.triggers.map(normalizeSearch), variants: group.variants.map(normalizeSearch) }));
const GENERIC_TERMS = new Set(['pdf', 'tai', 'lieu', 'mien', 'phi', 'free', 'hdt', 'study']);
const searchIndexCache = new WeakMap();

function editDistanceLE1(a, b) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, differences = 0;
  while (i < a.length && j < b.length) {
    if (a[i] !== b[j]) {
      if (++differences > 1) return false;
      if (a.length > b.length) i++;
      else if (b.length > a.length) j++;
      else { i++; j++; }
    } else { i++; j++; }
  }
  if (i < a.length || j < b.length) differences++;
  return differences <= 1;
}

function includesSearchPhrase(text, phrase) {
  if (!text || !phrase) return false;
  return (` ${text} `).includes(` ${phrase} `);
}

function buildSearchConcepts(query) {
  const tokens = normalizeSearch(query).split(' ').filter(Boolean);
  const concepts = [];
  const usedGroups = new Set();
  let i = 0;

  while (i < tokens.length) {
    let bestMatch = null;
    SEARCH_QUERY_ALIASES.forEach((group, groupIndex) => {
      group.triggers.forEach(trigger => {
        const triggerTokens = trigger.split(' ');
        if (i + triggerTokens.length > tokens.length) return;
        const matches = triggerTokens.every((token, offset) => tokens[i + offset] === token);
        if (matches && (!bestMatch || triggerTokens.length > bestMatch.length)) {
          bestMatch = { group, groupIndex, length: triggerTokens.length, label: trigger };
        }
      });
    });

    if (bestMatch) {
      if (!usedGroups.has(bestMatch.groupIndex)) {
        concepts.push({ label: bestMatch.label, variants: bestMatch.group.variants });
        usedGroups.add(bestMatch.groupIndex);
      }
      i += bestMatch.length;
      continue;
    }

    const token = tokens[i++];
    if (GENERIC_TERMS.has(token)) continue;
    concepts.push({ label: token, variants: [token] });
  }

  return concepts;
}

function getSearchIndex(resource) {
  const cached = searchIndexCache.get(resource);
  if (cached) return cached;

  const fieldValues = [
    ['title', resource.title, 12],
    ['subject', resource.subject, 10],
    ['exam', resource.exam || resource.examName || '', 11],
    ['type', resource.type, 8],
    ['grade', `lop ${resource.grade || ''} ${resource.grade || ''}`, 7],
    ['tags', `${resource.tags || ''} ${resource.keywords || ''}`, 6],
    ['slug', resource.slug, 5],
    ['desc', resource.desc, 3],
    ['id', resource.id, 1.5]
  ];
  const fields = fieldValues.map(([name, value, weight]) => {
    const text = normalizeSearch(value || '');
    return { name, text, words: text.split(' ').filter(Boolean), weight };
  });
  const index = {
    fields,
    title: fields.find(field => field.name === 'title').text,
    subject: fields.find(field => field.name === 'subject').text,
    exam: fields.find(field => field.name === 'exam').text,
    type: fields.find(field => field.name === 'type').text,
    allText: fields.map(field => field.text).join(' ')
  };
  searchIndexCache.set(resource, index);
  return index;
}

function tokenScore(term, words) {
  let best = 0;
  for (const word of words) {
    if (word === term) best = Math.max(best, 10);
    else if (term.length >= 4 && word.startsWith(term)) best = Math.max(best, 7);
    else if (term.length >= 4 && word.length >= 4 && term.startsWith(word)) best = Math.max(best, 6);
    else if (term.length >= 4 && word.length >= 4 && editDistanceLE1(term, word)) best = Math.max(best, 5);
  }
  return best;
}

function variantFieldScore(variant, field) {
  const normalized = normalizeSearch(variant);
  if (!normalized || !field.text) return 0;
  if (includesSearchPhrase(field.text, normalized)) {
    return field.weight * (normalized.includes(' ') ? 1.28 : 1.12);
  }

  const phraseTokens = normalized.split(' ').filter(Boolean);
  if (phraseTokens.length > 1) {
    const scores = phraseTokens.map(token => tokenScore(token, field.words));
    if (scores.every(score => score > 0)) return field.weight * (Math.min(...scores) / 10) * 0.72;
    return 0;
  }
  return field.weight * tokenScore(normalized, field.words) / 10;
}

function resourceSearchScore(resource, query) {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return 0;

  const concepts = buildSearchConcepts(normalizedQuery);
  // A search for only generic words such as "tài liệu" should show the full catalog.
  if (!concepts.length) return 1;

  const index = getSearchIndex(resource);
  let score = 0;
  let matchedConcepts = 0;

  for (const concept of concepts) {
    let best = 0;
    for (const variant of concept.variants) {
      for (const field of index.fields) {
        best = Math.max(best, variantFieldScore(variant, field));
      }
    }
    if (best > 0) {
      matchedConcepts++;
      score += best;
    }
  }

  if (!matchedConcepts) return 0;
  const coverage = matchedConcepts / concepts.length;
  // Multi-word queries should match most of the requested concepts, avoiding noisy OR-only results.
  if (concepts.length > 1 && coverage < 0.6) return 0;
  score *= 0.45 + 0.55 * coverage;

  if (includesSearchPhrase(index.title, normalizedQuery)) score += 48;
  if (includesSearchPhrase(index.subject, normalizedQuery)) score += 28;
  if (includesSearchPhrase(index.exam, normalizedQuery)) score += 30;
  if (includesSearchPhrase(index.type, normalizedQuery)) score += 18;
  if (includesSearchPhrase(index.allText, normalizedQuery)) score += 8;
  if (matchedConcepts === concepts.length) score += 16;

  return score;
}

function matchesFilters(r){ return (activeGrade==='all'||r.grade===activeGrade)&&(activeSubject==='all'||r.subject===activeSubject)&&(activeType==='all'||r.type===activeType); }
function filteredSorted(){
  const base=resourceData.filter(matchesFilters);
  if(!normalizeSearch(query)) return [...base].sort((a,b)=>Number(b.featured)-Number(a.featured)||Number(b.hot)-Number(a.hot)||String(b.publishedAt||'').localeCompare(String(a.publishedAt||''))||String(a.title).localeCompare(String(b.title),'vi'));
  return base.map(r=>({...r,__score:resourceSearchScore(r,query)})).filter(r=>r.__score>0).sort((a,b)=>b.__score-a.__score||Number(b.featured)-Number(a.featured)||Number(b.hot)-Number(a.hot));
}
function driveViewUrl(r){return r.url||(r.driveId?`https://drive.google.com/file/d/${r.driveId}/view`:'');}
function driveDownloadUrl(r){return r.driveId?`https://drive.google.com/uc?export=download&id=${r.driveId}`:driveViewUrl(r);}

function render(){
  const sorted=filteredSorted(), visible=sorted.slice(0,shown);
  grid.innerHTML=visible.length?visible.map(r=>{
    const tone=toneFor(r.subject), hasUrl=Boolean(r.url||r.driveId), detailUrl=`tai-lieu?slug=${encodeURIComponent(r.slug||slugifyVi(r.title))}`;
    return `<article class="resource-card tone-${tone}" data-doc-id="${escapeHtml(r.id)}" data-detail-url="${detailUrl}" tabindex="0" role="link" aria-label="Xem ${escapeHtml(r.title)}"><div class="resource-thumb"><div class="resource-thumb-pattern"></div><div class="resource-badge-row"><span class="resource-type-badge">PDF</span><span class="resource-badge">${r.hot?'<span class="badge-dot hot"></span>HOT · ':''}<span class="badge-dot free"></span>MIỄN PHÍ</span></div><div class="resource-visual"><span class="resource-visual-icon">${r.icon||icons.file}</span><span class="resource-visual-label">${escapeHtml(r.subject)}</span></div></div><div class="resource-body"><div class="resource-meta"><span>Lớp ${escapeHtml(r.grade)}</span><span>${escapeHtml(r.subject)}</span><span>${escapeHtml(r.type)}</span></div><h3>${escapeHtml(r.title)}</h3><p>${escapeHtml(r.desc)}</p><div class="resource-footer"><div class="resource-actions">${hasUrl?`<button class="resource-link resource-detail-btn" type="button" data-doc-id="${escapeHtml(r.id)}">Xem chi tiết <span>→</span></button>`:`<span class="resource-link muted-link">Sắp cập nhật</span>`}${hasUrl?`<a class="resource-download" href="${escapeHtml(driveDownloadUrl(r))}" target="_blank" rel="noopener noreferrer" data-stop-card="true">Tải PDF</a>`:''}</div><span class="resource-file">${escapeHtml(r.file)}</span></div></div></article>`;
  }).join(''):`<div class="empty search-empty" style="grid-column:1/-1;padding:34px;border:1px dashed #d7dfeb;border-radius:20px;text-align:center;color:#6b7a90"><strong>Chưa tìm thấy tài liệu phù hợp.</strong><br><span>Thử “Toán 12”, “ĐGNL”, “TSA”, “đề thi thử” hoặc tên tài liệu cụ thể.</span></div>`;
  loadMore.style.display=sorted.length>shown?'inline-flex':'none';
  updateSearchFeedback(sorted.length);
  updateStats();
  grid.querySelectorAll('.resource-card').forEach(card=>{
    const go=()=>{window.location.href=card.dataset.detailUrl||`tai-lieu?id=${encodeURIComponent(card.dataset.docId)}`};
    card.addEventListener('click',e=>{if(e.target.closest('a,[data-stop-card="true"]'))return;if(e.target.closest('button')){go();return}go()});
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}});
  });
  grid.querySelectorAll('.resource-detail-btn').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const card=btn.closest('.resource-card');window.location.href=card?.dataset.detailUrl||`tai-lieu?id=${encodeURIComponent(btn.dataset.docId)}`}));
}
function updateSearchFeedback(count){
  const hasQ=normalizeSearch(query).length>0;
  if(!searchFeedback) return;
  if(hasQ){ searchFeedback.innerHTML=count?`Tìm thấy <strong>${count}</strong> tài liệu cho “${escapeHtml(query)}”.`:`Không tìm thấy tài liệu cho “${escapeHtml(query)}”. Hãy thử một từ khóa gần nghĩa.`; searchFeedback.classList.toggle('is-empty',!count); }
  else searchFeedback.textContent='';
  if(searchClear) searchClear.hidden=!hasQ;
}
function updateStats(){
  const subjects=new Set(resourceData.map(r=>r.subject).filter(Boolean)).size, grades=new Set(resourceData.map(r=>r.grade).filter(Boolean));
  const docCount=resourceData.length, fmt=n=>n>99?`${Math.round(n/10)*10}+`:String(n);
  document.getElementById('statDocuments').textContent=fmt(docCount);
  document.getElementById('statSubjects').textContent=subjects?fmt(subjects):'0';
  document.getElementById('statGrades').textContent=grades.size?Array.from(grades).sort().join('–'):'10–12';
  document.getElementById('heroStatDocuments').textContent=fmt(docCount);
  document.getElementById('heroStatSubjects').textContent=subjects?fmt(subjects):'0';
  document.getElementById('heroStatGrades').textContent=grades.size;
}
function setFilter({grade=activeGrade,subject=activeSubject,type=activeType,scroll=true}={}){
  activeGrade=grade; activeSubject=subject; activeType=type; shown=6;
  document.querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x.dataset.grade===activeGrade));
  if(scroll) document.getElementById('tai-lieu').scrollIntoView({behavior:'smooth'});
  render();
}
function runSearch(value=searchInput.value,scroll=true){query=value.trim();shown=9;if(scroll)document.getElementById('tai-lieu').scrollIntoView({behavior:'smooth'});render();}
document.querySelectorAll('.chip').forEach(btn=>btn.addEventListener('click',()=>setFilter({grade:btn.dataset.grade})));
document.querySelectorAll('.subject-filter').forEach(btn=>btn.addEventListener('click',()=>setFilter({grade:'all',subject:btn.dataset.subject,type:'all'})));
document.querySelectorAll('.type-filter').forEach(btn=>btn.addEventListener('click',()=>setFilter({grade:'all',subject:'all',type:btn.dataset.type})));
document.querySelectorAll('[data-search]').forEach(btn=>btn.addEventListener('click',()=>{searchInput.value=btn.dataset.search;runSearch(btn.dataset.search,true)}));
loadMore.addEventListener('click',()=>{shown+=3;render();});
searchBtn.addEventListener('click',()=>runSearch(searchInput.value,true));
searchInput.addEventListener('input',()=>{const v=searchInput.value.trim();if(v.length===0){query='';shown=6;render();}else if(v.length>=2){query=v;shown=9;render();}else{query='';shown=6;render();}});
searchInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();runSearch(searchInput.value,true)}});
searchClear?.addEventListener('click',()=>{searchInput.value='';query='';shown=6;searchInput.focus();render();});
document.getElementById('menuBtn').addEventListener('click',()=>{const n=document.getElementById('mobileNav'),b=document.getElementById('menuBtn'),open=n.style.display==='block';n.style.display=open?'none':'block';b.setAttribute('aria-expanded',String(!open))});
document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>document.getElementById('mobileNav').style.display='none'));
document.getElementById('year').textContent=new Date().getFullYear();

function openDocument(id){const r=resourceData.find(x=>String(x.id)===String(id));if(!r)return;const tone=toneFor(r.subject);docModalVisual.className=`doc-modal-visual tone-${tone}`;docModalVisual.innerHTML=`<div class="resource-visual-icon">${r.icon||icons.file}</div><span>${escapeHtml(r.subject)}</span>`;docModalType.textContent=(r.type||'PDF').toUpperCase();docModalMeta.innerHTML=`<span>Lớp ${escapeHtml(r.grade)}</span><span>${escapeHtml(r.subject)}</span><span>${escapeHtml(r.type)}</span>`;docModalTitle.textContent=r.title;docModalDesc.textContent=r.desc||'';docModalDetails.innerHTML=`<div><span>Định dạng</span><strong>PDF</strong></div><div><span>Dung lượng</span><strong>${escapeHtml(r.file||'PDF')}</strong></div><div><span>Trạng thái</span><strong>MIỄN PHÍ</strong></div>${r.hot?'<div><span>Ưu tiên</span><strong>HOT</strong></div>':''}`;const view=driveViewUrl(r),download=driveDownloadUrl(r);const enabled=Boolean(view);docModalView.href=view||'#';docModalDownload.href=download||'#';docModalView.style.pointerEvents=enabled?'auto':'none';docModalDownload.style.pointerEvents=enabled?'auto':'none';docModalCopy.dataset.url=view||'';docModal.classList.add('is-open');docModal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');docModalClose.focus();}
function closeDocument(){docModal.classList.remove('is-open');docModal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');}
docModalClose.addEventListener('click',closeDocument);docModal.addEventListener('click',e=>{if(e.target.matches('[data-close-modal]'))closeDocument()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&docModal.classList.contains('is-open'))closeDocument()});
docModalCopy.addEventListener('click',async()=>{const url=docModalCopy.dataset.url;if(!url)return;try{await navigator.clipboard.writeText(url);const old=docModalCopy.textContent;docModalCopy.textContent='Đã sao chép';setTimeout(()=>docModalCopy.textContent=old,1400)}catch{window.prompt('Sao chép liên kết tài liệu:',url)}});
async function syncResources(){const remote=await loadFromGoogleSheet();if(remote){resourceData=remote;render();return true}render();return false;}
if(syncBtn)syncBtn.addEventListener('click',async()=>{syncBtn.disabled=true;syncBtn.textContent='↻ Đang đồng bộ...';await syncResources();setTimeout(()=>{syncBtn.disabled=false;syncBtn.textContent='↻ Đồng bộ'},700)});
(async function init(){await syncResources()})();

/* HDT v22.1 — smooth document details without full-page reload */
(function enableSmoothDocumentDetails(){
  function findResourceById(id){
    return Array.isArray(resourceData)
      ? resourceData.find(r => String(r.id) === String(id))
      : null;
  }

  function slugFor(r){
    return r?.slug || slugifyVi(r?.title || '');
  }

  function shareableUrl(r){
    return `${location.origin}/tai-lieu?slug=${encodeURIComponent(slugFor(r))}`;
  }

  function updateDocumentUrl(r){
    const url = shareableUrl(r);
    history.pushState({ hdtDocument: slugFor(r) }, '', url);
  }

  function updateDocumentMeta(r){
    if(!r) return;
    const title = `${r.title} — HDT Study`;
    const desc = String(
      r.desc ||
      `Tài liệu ${r.subject || 'THPT'} lớp ${r.grade || ''} miễn phí trên HDT Study.`
    ).replace(/\s+/g,' ').trim().slice(0,160);

    document.title = title;

    const meta = document.querySelector('meta[name="description"]');
    if(meta) meta.setAttribute('content', desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if(!canonical){
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = shareableUrl(r);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if(ogTitle) ogTitle.setAttribute('content', title);
    if(ogDescription) ogDescription.setAttribute('content', desc);
    if(ogUrl) ogUrl.setAttribute('content', shareableUrl(r));
  }

  function restoreListMeta(){
    document.title = 'HDT Study — Tài liệu ôn thi THPTQG miễn phí';

    const meta = document.querySelector('meta[name="description"]');
    if(meta){
      meta.setAttribute(
        'content',
        'HDT Study – kho tài liệu ôn thi THPTQG miễn phí, đề thi, chuyên đề và tài liệu học tập cho học sinh THPT.'
      );
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if(canonical) canonical.href = `${location.origin}/`;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if(ogTitle) ogTitle.setAttribute('content', document.title);
    if(ogDescription) ogDescription.setAttribute('content', 'Kho tài liệu, đề thi và chuyên đề THPTQG miễn phí cho học sinh.');
    if(ogUrl) ogUrl.setAttribute('content', `${location.origin}/`);
  }

  /* Capture before the old card handlers so the browser does not navigate/reload. */
  document.addEventListener('click', function(event){
    const detailButton = event.target.closest?.('.resource-detail-btn');
    const card = event.target.closest?.('.resource-card');

    if(detailButton){
      const resource = findResourceById(detailButton.dataset.docId);
      if(!resource) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      updateDocumentUrl(resource);
      openDocument(resource.id);
      updateDocumentMeta(resource);
      return;
    }

    if(!card) return;
    if(event.target.closest('a,button,input,select,textarea,[data-stop-card="true"]')) return;

    const resource = findResourceById(card.dataset.docId);
    if(!resource) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    updateDocumentUrl(resource);
    openDocument(resource.id);
    updateDocumentMeta(resource);
  }, true);

  /* Keep browser Back/Forward in sync with the modal. */
  window.addEventListener('popstate', function(){
    const slug = new URLSearchParams(location.search).get('slug');

    if(!slug){
      closeDocument();
      restoreListMeta();
      return;
    }

    const resource = Array.isArray(resourceData)
      ? resourceData.find(r => slugFor(r) === slug)
      : null;

    if(resource){
      openDocument(resource.id);
      updateDocumentMeta(resource);
    }
  });

  /* Closing the modal cleans the shareable URL without reloading. */
  if(docModalClose){
    docModalClose.addEventListener('click', function(){
      if(new URLSearchParams(location.search).has('slug')){
        history.replaceState({}, '', `${location.origin}/`);
        restoreListMeta();
      }
    });
  }
})();

