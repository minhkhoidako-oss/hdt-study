/* HDT Study Donate Module v1.0
 * Static-site friendly: no backend, no payment data collection.
 * Requires donate-qr.png in the same directory as this file.
 */
(function () {
  'use strict';
  if (window.__HDT_DONATE_V1__) return;
  window.__HDT_DONATE_V1__ = true;

  const currentScript = document.currentScript;
  const assetBase = currentScript && currentScript.src
    ? new URL('.', currentScript.src).href
    : new URL('.', window.location.href).href;
  const qrSrc = new URL('donate-qr.png', assetBase).href;

  const css = `
  .hdt-donate-fab{position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(20px,env(safe-area-inset-bottom));z-index:9990;display:inline-flex;align-items:center;gap:9px;border:0;border-radius:999px;padding:13px 18px;background:linear-gradient(135deg,#6d43df,#a64ad8);color:#fff;font:700 14px/1.2 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-shadow:0 12px 30px rgba(99,65,180,.28);cursor:pointer;transition:transform .18s ease,box-shadow .18s ease}
  .hdt-donate-fab:hover{transform:translateY(-2px);box-shadow:0 16px 34px rgba(99,65,180,.34)}
  .hdt-donate-fab:focus-visible,.hdt-donate-modal button:focus-visible,.hdt-donate-modal a:focus-visible{outline:3px solid #f3b9dc;outline-offset:3px}
  .hdt-donate-fab-icon{font-size:18px;line-height:1}
  .hdt-donate-backdrop{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(19,22,40,.62);backdrop-filter:blur(5px)}
  .hdt-donate-backdrop.is-open{display:flex}
  .hdt-donate-modal{position:relative;display:grid;grid-template-columns:minmax(0, .92fr) minmax(0,1.08fr);gap:22px;width:min(760px,100%);max-height:min(90vh,850px);overflow:auto;padding:28px;border:1px solid rgba(255,255,255,.7);border-radius:26px;background:#fff;color:#20243a;box-shadow:0 28px 90px rgba(11,15,35,.3);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
  .hdt-donate-close{position:absolute;top:12px;right:14px;display:grid;place-items:center;width:38px;height:38px;border:0;border-radius:50%;background:#f2f0fa;color:#4c4765;font-size:26px;line-height:1;cursor:pointer}
  .hdt-donate-qr-side{align-self:center;text-align:center;padding:4px 0}
  .hdt-donate-qr-frame{display:inline-grid;place-items:center;width:min(100%,300px);padding:12px;border:1px solid #e5def8;border-radius:22px;background:linear-gradient(145deg,#fff,#f8f5ff);box-shadow:0 10px 30px rgba(96,68,160,.1)}
  .hdt-donate-qr{display:block;width:100%;height:auto;aspect-ratio:1;object-fit:contain;border-radius:10px;background:#fff;image-rendering:auto}
  .hdt-donate-qr-caption{margin:12px 0 0;color:#6c6681;font-size:12px;line-height:1.5}
  .hdt-donate-content{align-self:center;padding:8px 0}
  .hdt-donate-kicker{display:inline-flex;align-items:center;gap:7px;margin:0 0 10px;padding:7px 11px;border-radius:99px;background:#f2edff;color:#6a45bb;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
  .hdt-donate-title{margin:0 36px 10px 0;color:#20243a;font-size:clamp(24px,3.2vw,34px);line-height:1.15;letter-spacing:-.04em}
  .hdt-donate-title span{color:#8b4de0}
  .hdt-donate-lead{margin:0 0 16px;color:#5f6275;font-size:14px;line-height:1.75}
  .hdt-donate-doc{display:none;margin:0 0 14px;padding:11px 13px;border:1px solid #e9e2fa;border-radius:12px;background:#faf8ff;color:#5f4c91;font-size:13px;line-height:1.5;overflow-wrap:anywhere}
  .hdt-donate-doc.is-visible{display:block}
  .hdt-donate-steps{display:grid;gap:9px;margin:0 0 17px;padding:0;list-style:none}
  .hdt-donate-steps li{display:flex;gap:10px;align-items:flex-start;color:#52566c;font-size:13px;line-height:1.55}
  .hdt-donate-step-num{flex:0 0 23px;display:grid;place-items:center;width:23px;height:23px;border-radius:8px;background:#f0eaff;color:#7048c7;font-size:11px;font-weight:800}
  .hdt-donate-assurance{margin:0 0 18px;color:#77798b;font-size:12px;line-height:1.55}
  .hdt-donate-actions{display:flex;flex-wrap:wrap;gap:9px;align-items:center}
  .hdt-donate-primary,.hdt-donate-secondary,.hdt-donate-qr-download{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:43px;padding:11px 15px;border-radius:12px;text-decoration:none;font:700 13px/1.3 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer}
  .hdt-donate-primary{border:1px solid #7046ca;background:#7046ca;color:#fff}
  .hdt-donate-primary:hover{background:#5e37b4}
  .hdt-donate-secondary,.hdt-donate-qr-download{border:1px solid #e2d9f4;background:#fff;color:#5c4b8b}
  .hdt-donate-secondary:hover,.hdt-donate-qr-download:hover{background:#f8f5ff}
  .hdt-donate-qr-download{margin-top:12px;min-height:36px;padding:8px 12px;font-size:12px}
  .hdt-donate-thanks{margin:13px 0 0;color:#8a8798;font-size:11px;line-height:1.5}
  @media(max-width:640px){.hdt-donate-fab{right:max(12px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));padding:12px 14px;font-size:13px}.hdt-donate-modal{grid-template-columns:1fr;gap:12px;width:min(440px,100%);max-height:92vh;padding:22px 18px 18px;border-radius:22px}.hdt-donate-qr-side{padding:0}.hdt-donate-qr-frame{width:min(62vw,230px);padding:8px;border-radius:16px}.hdt-donate-qr-caption{margin-top:7px;font-size:11px}.hdt-donate-content{padding:0}.hdt-donate-title{font-size:25px;margin-right:32px}.hdt-donate-lead{font-size:13px;line-height:1.65;margin-bottom:12px}.hdt-donate-steps{gap:7px;margin-bottom:12px}.hdt-donate-assurance{margin-bottom:12px}.hdt-donate-actions{display:grid;grid-template-columns:1fr}.hdt-donate-primary,.hdt-donate-secondary{width:100%;min-height:42px}.hdt-donate-thanks{margin-top:9px}}
  @media(prefers-reduced-motion:reduce){.hdt-donate-fab{transition:none}}
  `;

  const style = document.createElement('style');
  style.id = 'hdt-donate-style-v1';
  style.textContent = css;
  document.head.appendChild(style);

  const fab = document.createElement('button');
  fab.type = 'button';
  fab.className = 'hdt-donate-fab';
  fab.setAttribute('aria-haspopup', 'dialog');
  fab.setAttribute('aria-controls', 'hdtDonateModal');
  fab.innerHTML = '<span class="hdt-donate-fab-icon" aria-hidden="true">♥</span><span>Ủng hộ HDT</span>';

  const backdrop = document.createElement('div');
  backdrop.className = 'hdt-donate-backdrop';
  backdrop.id = 'hdtDonateModal';
  backdrop.setAttribute('aria-hidden', 'true');
  backdrop.innerHTML = `
    <section class="hdt-donate-modal" role="dialog" aria-modal="true" aria-labelledby="hdtDonateTitle" aria-describedby="hdtDonateLead">
      <button class="hdt-donate-close" type="button" aria-label="Đóng cửa sổ donate">×</button>
      <div class="hdt-donate-qr-side">
        <div class="hdt-donate-qr-frame"><img class="hdt-donate-qr" data-src="${qrSrc}" alt="Mã QR VietQR/Napas 24/7 để ủng hộ HDT Study" loading="lazy" decoding="async" data-hdt-donate-qr="true"></div>
        <div class="hdt-donate-qr-caption">Quét bằng ứng dụng ngân hàng hỗ trợ VietQR/Napas 24/7.</div>
        <a class="hdt-donate-qr-download" href="${qrSrc}" download="HDT-Study-donate-QR.png">↓ Lưu ảnh QR</a>
      </div>
      <div class="hdt-donate-content">
        <div class="hdt-donate-kicker"><span aria-hidden="true">✦</span> GÓP SỨC DUY TRÌ KHO TÀI LIỆU</div>
        <h2 class="hdt-donate-title" id="hdtDonateTitle">Cùng HDT giữ tài liệu <span>miễn phí</span></h2>
        <p class="hdt-donate-lead" id="hdtDonateLead">HDT Study chia sẻ tài liệu ôn tập miễn phí cho học sinh. Nếu tài liệu hữu ích với bạn, một khoản ủng hộ tùy tâm sẽ giúp chúng mình duy trì website, cập nhật tài liệu mới và cải thiện trải nghiệm học tập.</p>
        <div class="hdt-donate-doc" aria-live="polite"></div>
        <ol class="hdt-donate-steps">
          <li><span class="hdt-donate-step-num">1</span><span>Mở ứng dụng ngân hàng và quét mã QR.</span></li>
          <li><span class="hdt-donate-step-num">2</span><span>Nhập số tiền bạn thấy phù hợp — không có mức tối thiểu.</span></li>
          <li><span class="hdt-donate-step-num">3</span><span>Kiểm tra tên người nhận hiển thị trong ứng dụng trước khi xác nhận.</span></li>
        </ol>
        <p class="hdt-donate-assurance">Ủng hộ hoàn toàn tự nguyện. Tài liệu vẫn miễn phí kể cả khi bạn không đóng góp. Website không yêu cầu thông tin cá nhân hay bằng chứng chuyển khoản.</p>
        <div class="hdt-donate-actions">
          <button class="hdt-donate-primary" type="button" data-hdt-donate-continue style="display:none">Tiếp tục tải tài liệu →</button>
          <button class="hdt-donate-secondary" type="button" data-hdt-donate-close>Đóng cửa sổ</button>
        </div>
        <p class="hdt-donate-thanks">Cảm ơn bạn đã học cùng HDT Study ♥</p>
      </div>
    </section>`;

  document.body.appendChild(fab);
  document.body.appendChild(backdrop);

  const closeButton = backdrop.querySelector('.hdt-donate-close');
  const dismissButton = backdrop.querySelector('[data-hdt-donate-close]');
  const continueButton = backdrop.querySelector('[data-hdt-donate-continue]');
  const docNotice = backdrop.querySelector('.hdt-donate-doc');
  const title = backdrop.querySelector('#hdtDonateTitle');
  const lead = backdrop.querySelector('#hdtDonateLead');
  let pendingDownload = null;
  let previousFocus = null;

  function showDonate(options) {
    options = options || {};
    const qrImage = backdrop.querySelector('[data-hdt-donate-qr]');
    if (qrImage && !qrImage.getAttribute('src')) qrImage.src = qrImage.dataset.src || qrSrc;
    previousFocus = document.activeElement;
    pendingDownload = options.url ? { url: options.url, target: options.target || '_blank' } : null;
    continueButton.style.display = pendingDownload ? 'inline-flex' : 'none';
    docNotice.classList.toggle('is-visible', Boolean(options.docTitle));
    docNotice.textContent = options.docTitle ? `Bạn đang chuẩn bị tải: ${options.docTitle}` : '';

    title.innerHTML = pendingDownload
      ? 'Tài liệu miễn phí — <span>ủng hộ tùy tâm</span>'
      : 'Cùng HDT giữ tài liệu <span>miễn phí</span>';
    lead.textContent = pendingDownload
      ? 'Trước khi tải, nếu tài liệu hữu ích với bạn, hãy cân nhắc ủng hộ tùy tâm để giúp HDT duy trì kho tài liệu miễn phí. Bạn không cần donate để tải — chỉ cần chọn “Tiếp tục tải tài liệu”.'
      : 'HDT Study chia sẻ tài liệu ôn tập miễn phí cho học sinh. Nếu tài liệu hữu ích với bạn, một khoản ủng hộ tùy tâm sẽ giúp chúng mình duy trì website, cập nhật tài liệu mới và cải thiện trải nghiệm học tập.';

    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }

  function hideDonate(keepPending) {
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (!keepPending) pendingDownload = null;
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }

  function continueDownload() {
    const item = pendingDownload;
    if (!item || !item.url) {
      hideDonate(false);
      return;
    }
    // Keep the user gesture synchronous to reduce popup-blocking on mobile browsers.
    const link = document.createElement('a');
    link.href = item.url;
    link.target = item.target || '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    hideDonate(false);
    link.click();
    link.remove();
  }

  fab.addEventListener('click', () => showDonate());
  closeButton.addEventListener('click', () => hideDonate(false));
  dismissButton.addEventListener('click', () => hideDonate(false));
  continueButton.addEventListener('click', continueDownload);
  backdrop.addEventListener('click', event => {
    if (event.target === backdrop) hideDonate(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && backdrop.classList.contains('is-open')) hideDonate(false);
  });

  function isDownloadLink(anchor) {
    if (!anchor || anchor.hasAttribute('data-hdt-donate-ignore')) return false;
    if (anchor.id === 'docModalDownload' || anchor.matches('.resource-download, .download-btn, [data-donate-download], [data-download]')) return true;
    const label = [anchor.textContent, anchor.getAttribute('aria-label'), anchor.className].join(' ');
    return /(?:tải\s*(?:pdf|tài\s*liệu|xuống|file)|download\s*(?:pdf|file|document)?)/i.test(label);
  }

  function getDocumentTitle(anchor) {
    const modalTitle = document.getElementById('docModalTitle');
    if (anchor.id === 'docModalDownload' && modalTitle && modalTitle.textContent.trim()) return modalTitle.textContent.trim();
    const card = anchor.closest('[data-doc-id], .resource-card, .v23-list-card, article');
    const heading = card && card.querySelector('h1,h2,h3,h4');
    return heading ? heading.textContent.trim() : '';
  }

  // Capture phase prevents the browser from starting the download before the consent-free prompt.
  document.addEventListener('click', event => {
    const anchor = event.target && event.target.closest ? event.target.closest('a') : null;
    if (!anchor || !isDownloadLink(anchor)) return;
    const href = anchor.href;
    if (!href || href === '#' || anchor.getAttribute('aria-disabled') === 'true') return;
    event.preventDefault();
    event.stopPropagation();
    showDonate({ url: href, target: anchor.target || '_blank', docTitle: getDocumentTitle(anchor) });
  }, true);
})();
