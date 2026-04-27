/* ============================================================
   RMS Docs — Common Navigation
   Renders the top nav (Requirement / UXUI / QA) and sub-nav
   based on the current page's data attributes.
   ============================================================ */

(function () {
  // ------------------------------------------------------------
  // 1. Navigation definition
  // ------------------------------------------------------------
  // Each top tab has:
  //   key     — matches data-top on <body>
  //   label   — display text
  //   icon    — inline SVG path (24x24 viewBox, stroke-based)
  //   children — sub-nav items with (key, label, href, disabled)
  // ------------------------------------------------------------

  const NAV = [
    {
      key: "requirement",
      label: "Requirement",
      icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
      children: [
        { key: "urs", label: "URS", href: "urs-index.html" },
        { key: "funclist", label: "Function List", href: "#", disabled: true },
        { key: "srs", label: "SRS", href: "#", disabled: true },
      ],
    },
    {
      key: "uxui",
      label: "UXUI",
      icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
      children: [
        { key: "ux-scenario", label: "UX 시나리오", href: "#", disabled: true },
        { key: "ui-design", label: "UI 디자인", href: "#", disabled: true },
      ],
    },
    {
      key: "qa",
      label: "QA",
      icon: '<path d="M3 12h18M3 6h18M3 18h18"/>',
      children: [
        { key: "test-cases", label: "Test Cases", href: "index.html" },
        { key: "execution", label: "Execution", href: "#", disabled: true },
        { key: "history", label: "History", href: "#", disabled: true },
      ],
    },
  ];

  // Icons for sub-nav items (key → inline SVG path)
  const SUBNAV_ICONS = {
    "urs":          '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h4"/>',
    "funclist":     '<path d="M3 6h18M3 12h18M3 18h18"/>',
    "srs":          '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    "ux-scenario":  '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
    "ui-design":    '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    "test-cases":   '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 9h6v6H9z"/>',
    "execution":    '<polygon points="5 3 19 12 5 21 5 3"/>',
    "history":      '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  };

  // Icon for "back to index" shown as the first sub-nav entry on detail pages
  const INDEX_ICON = '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 9h6v6H9z"/>';
  const FILE_ICON  = '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>';

  // ------------------------------------------------------------
  // 2. Helpers
  // ------------------------------------------------------------

  function svgIcon(pathMarkup, size = 16) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${pathMarkup}</svg>`;
  }

  function findTop(key) {
    return NAV.find((t) => t.key === key) || NAV[NAV.length - 1];
  }

  // ------------------------------------------------------------
  // 3. Render top nav
  // ------------------------------------------------------------

  function renderTopNav(activeTopKey) {
    const meta = document.body.dataset.meta || "RMS Docs · v0.3";

    const itemsHtml = NAV.map((tab) => {
      const isActive = tab.key === activeTopKey;
      const activeCls = isActive ? " active" : "";
      const firstChild = tab.children.find((c) => !c.disabled);
      const clickHandler = isActive
        ? ""
        : firstChild
        ? ` onclick="location.href='${firstChild.href}'"`
        : "";
      const cursorStyle = isActive || !firstChild ? "" : 'style="cursor:pointer;"';
      return `
        <div class="topnav-item${activeCls}" ${cursorStyle}${clickHandler}>
          <span class="icon">${svgIcon(tab.icon)}</span>
          <span>${tab.label}</span>
        </div>`;
    }).join("");

    return `
      <nav class="app-topnav">
        <div class="app-brand">
          <span class="app-brand__logo">Park</span>
          <span class="app-brand__sub">SYSTEMS · Docs</span>
        </div>
        <div class="topnav-items">${itemsHtml}</div>
        <div class="topnav-meta">
          <span>${meta}</span>
          <span class="topnav-meta__sep"></span>
          <span>2026.04.24</span>
        </div>
      </nav>`;
  }

  // ------------------------------------------------------------
  // 4. Render sub-nav
  //    Two modes:
  //      (a) index mode  — lists sub-nav siblings (URS / Function List / SRS ...)
  //      (b) detail mode — shows "back to [parent index]" + current doc id
  // ------------------------------------------------------------

  function renderSubNav(activeTopKey, activeSubKey, detailId, detailParentHref) {
    const top = findTop(activeTopKey);

    // Detail mode: show "← Index" + current doc pill + prev/next nav
    if (detailId) {
      const parentHref = detailParentHref || "index.html";
      const prevId     = document.body.dataset.prev || "";
      const nextId     = document.body.dataset.next || "";
      const prevTitle  = document.body.dataset.prevTitle || prevId;
      const nextTitle  = document.body.dataset.nextTitle || nextId;

      const prevHtml = prevId
        ? `<a href="${prevId}.html" class="subnav-nav" title="${prevTitle}" aria-label="이전: ${prevTitle}">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25"><path d="M15 18l-6-6 6-6"/></svg>
           </a>`
        : `<span class="subnav-nav subnav-nav--disabled" title="이전 항목 없음" aria-label="이전 항목 없음">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25"><path d="M15 18l-6-6 6-6"/></svg>
           </span>`;
      const nextHtml = nextId
        ? `<a href="${nextId}.html" class="subnav-nav" title="${nextTitle}" aria-label="다음: ${nextTitle}">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25"><path d="M9 18l6-6-6-6"/></svg>
           </a>`
        : `<span class="subnav-nav subnav-nav--disabled" title="다음 항목 없음" aria-label="다음 항목 없음">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25"><path d="M9 18l6-6-6-6"/></svg>
           </span>`;

      return `
        <div class="app-subnav">
          <div class="subnav-item">
            <a href="${parentHref}">
              ${svgIcon(INDEX_ICON, 13)}
              <span>Index</span>
            </a>
          </div>
          <div class="subnav-item active">
            ${svgIcon(FILE_ICON, 13)}
            <span>${detailId}</span>
          </div>
          <div class="subnav-spacer"></div>
          <div class="subnav-nav-group">
            ${prevHtml}
            ${nextHtml}
          </div>
        </div>`;
    }

    // Index mode: list siblings
    const itemsHtml = top.children.map((child) => {
      const isActive = child.key === activeSubKey;
      const activeCls = isActive ? " active" : "";
      const disabledCls = child.disabled ? " subnav-item--disabled" : "";
      const iconPath = SUBNAV_ICONS[child.key] || FILE_ICON;
      const iconHtml = svgIcon(iconPath, 13);
      const badgeHtml = child.disabled
        ? `<span class="subnav-item__badge">준비중</span>`
        : "";

      if (child.disabled) {
        return `
          <div class="subnav-item${disabledCls}">
            ${iconHtml}
            <span>${child.label}</span>
            ${badgeHtml}
          </div>`;
      }

      if (isActive) {
        return `
          <div class="subnav-item active">
            ${iconHtml}
            <span>${child.label}</span>
          </div>`;
      }

      return `
        <div class="subnav-item">
          <a href="${child.href}">
            ${iconHtml}
            <span>${child.label}</span>
          </a>
        </div>`;
    }).join("");

    return `
      <div class="app-subnav">
        ${itemsHtml}
        <div class="subnav-spacer"></div>
      </div>`;
  }

  // ------------------------------------------------------------
  // 5. Inject
  // ------------------------------------------------------------

  function inject() {
    const top    = document.body.dataset.top || "qa";
    const sub    = document.body.dataset.sub || "test-cases";
    const docId  = document.body.dataset.docid || "";
    const parent = document.body.dataset.parent || "";

    // Remove legacy hardcoded nav if present
    const legacyTop = document.querySelector("body > nav.app-topnav");
    if (legacyTop) legacyTop.remove();
    const legacySub = document.querySelector("body > div.app-subnav");
    if (legacySub) legacySub.remove();

    const topHtml = renderTopNav(top);
    const subHtml = renderSubNav(top, sub, docId, parent);

    // Insert at the top of body
    document.body.insertAdjacentHTML("afterbegin", topHtml + subHtml);
  }

  // Run immediately (script is loaded at the end of body or with defer)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
