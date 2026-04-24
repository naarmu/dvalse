/* URS Index — filter & render */
(function () {
  const searchInput   = document.getElementById("search-input");
  const filterAreas   = document.getElementById("filter-areas");
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
  const selected = { areas: new Set(), query: "" };

  URS_AREA_ORDER.forEach((code) => {
    const cnt = URS_LIST.filter(u => u.area === code).length;
    if (!cnt) return;
    const id = `flt-area-${code}`;
    const label = document.createElement("label");
    label.className = "filter-option";
    label.innerHTML = `
      <input type="checkbox" id="${id}" data-filter="area" value="${code}">
      <span class="filter-option__label">${code} · ${URS_AREA_NAMES[code]}</span>
      <span class="filter-option__count">${cnt}</span>
    `;
    filterAreas.appendChild(label);
  });

  filterAreas.addEventListener("change", (e) => {
    if (e.target.dataset.filter !== "area") return;
    if (e.target.checked) selected.areas.add(e.target.value);
    else selected.areas.delete(e.target.value);
    render();
  });

  searchInput.addEventListener("input", (e) => {
    selected.query = e.target.value.trim().toLowerCase();
    render();
  });

  btnReset.addEventListener("click", () => {
    selected.areas.clear();
    selected.query = "";
    searchInput.value = "";
    filterAreas.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    render();
  });

  // ----- Render -----
  function render() {
    const filtered = URS_LIST.filter((u) => {
      if (selected.areas.size && !selected.areas.has(u.area)) return false;
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
