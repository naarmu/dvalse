/* URS Index — filter & render */
(function () {
  const searchInput   = document.getElementById("search-input");
  const filterAreas   = document.getElementById("filter-areas");
  const filterStatus  = document.getElementById("filter-status");
  const urnTbody      = document.getElementById("urs-tbody");
  const urnCount      = document.getElementById("urs-count");
  const statTotal     = document.getElementById("stat-total");
  const statAreas     = document.getElementById("stat-areas");
  const statReady     = document.getElementById("stat-ready");
  const statDraft     = document.getElementById("stat-draft");
  const btnReset      = document.getElementById("btn-reset");

  // ----- Stats -----
  const total = URS_LIST.length;
  const ready = URS_LIST.filter(u => u.hasDetail).length;
  const areas = new Set(URS_LIST.map(u => u.area)).size;
  statTotal.innerHTML = `${total} <span class="unit">건</span>`;
  statAreas.innerHTML = `${areas} <span class="unit">영역</span>`;
  statReady.innerHTML = `${ready} <span class="unit">건</span>`;
  statDraft.innerHTML = `${total - ready} <span class="unit">건</span>`;

  // ----- Filters -----
  const selected = { areas: new Set(), status: new Set(), query: "" };

  URS_AREA_ORDER.forEach((code) => {
    const cnt = URS_LIST.filter(u => u.area === code).length;
    if (!cnt) return;
    const label = document.createElement("label");
    label.className = "filter-chip";
    label.innerHTML = `
      <input type="checkbox" data-filter="area" value="${code}">
      <span>${code} · ${URS_AREA_NAMES[code]}</span>
      <span class="filter-chip__count">${cnt}</span>
    `;
    filterAreas.appendChild(label);
  });

  // Status filter (Ready / Draft)
  [
    { key: "ready", label: "Ready",  count: ready },
    { key: "draft", label: "Draft",  count: total - ready },
  ].forEach((opt) => {
    const label = document.createElement("label");
    label.className = "filter-chip";
    label.innerHTML = `
      <input type="checkbox" data-filter="status" value="${opt.key}">
      <span>${opt.label}</span>
      <span class="filter-chip__count">${opt.count}</span>
    `;
    filterStatus.appendChild(label);
  });

  filterAreas.addEventListener("change", (e) => {
    if (e.target.dataset.filter !== "area") return;
    if (e.target.checked) selected.areas.add(e.target.value);
    else selected.areas.delete(e.target.value);
    render();
  });

  filterStatus.addEventListener("change", (e) => {
    if (e.target.dataset.filter !== "status") return;
    if (e.target.checked) selected.status.add(e.target.value);
    else selected.status.delete(e.target.value);
    render();
  });

  searchInput.addEventListener("input", (e) => {
    selected.query = e.target.value.trim().toLowerCase();
    render();
  });

  btnReset.addEventListener("click", () => {
    selected.areas.clear();
    selected.status.clear();
    selected.query = "";
    searchInput.value = "";
    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(cb => cb.checked = false);
    render();
  });

  // ----- Render -----
  function render() {
    const filtered = URS_LIST.filter((u) => {
      if (selected.areas.size && !selected.areas.has(u.area)) return false;
      if (selected.status.size) {
        const st = u.hasDetail ? "ready" : "draft";
        if (!selected.status.has(st)) return false;
      }
      if (selected.query) {
        const hay = `${u.id} ${u.title} ${u.screen}`.toLowerCase();
        if (!hay.includes(selected.query)) return false;
      }
      return true;
    });

    urnCount.textContent = `${filtered.length} / ${total} 건 표시`;

    const rows = filtered.map((u) => {
      const linkCls = u.hasDetail ? "tc-id-link" : "tc-id-link tc-id-link--pending";
      const linkHtml = u.hasDetail
        ? `<a href="${u.id}.html" class="${linkCls}">${u.id}</a>`
        : `<span class="${linkCls}">${u.id}</span>`;
      const statusBadge = u.hasDetail
        ? '<span class="badge badge--functional">READY</span>'
        : '<span class="badge badge--ui">DRAFT</span>';
      return `
        <tr>
          <td>${linkHtml}</td>
          <td>${u.title}</td>
          <td>${statusBadge}</td>
          <td>${u.area} · ${u.screen}</td>
        </tr>`;
    }).join("");

    urnTbody.innerHTML = rows || `<tr><td colspan="4" class="tc-table__empty">조건에 맞는 URS가 없습니다.</td></tr>`;
  }

  render();
})();
