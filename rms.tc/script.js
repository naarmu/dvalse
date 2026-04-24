// ============================================================
// Index page logic — filtering, searching, rendering
// ============================================================

(function () {
  "use strict";

  // -------- Badge helpers --------
  const priorityBadgeClass = (p) => `badge badge--${p.toLowerCase()}`;
  const typeBadgeClass = (t) => `badge badge--${t.toLowerCase().replace(/[^a-z]/g, "-")}`;

  // -------- State --------
  const state = {
    search: "",
    areas: new Set(),
    priorities: new Set(),
    types: new Set(),
  };

  // -------- Render filters --------
  function renderFilters() {
    const areaEl = document.getElementById("filter-areas");
    const priorityEl = document.getElementById("filter-priorities");
    const typeEl = document.getElementById("filter-types");

    // Count per area
    const areaCounts = {};
    const priorityCounts = {};
    const typeCounts = {};
    TC_DATA.forEach((tc) => {
      areaCounts[tc.area] = (areaCounts[tc.area] || 0) + 1;
      priorityCounts[tc.priority] = (priorityCounts[tc.priority] || 0) + 1;
      typeCounts[tc.type] = (typeCounts[tc.type] || 0) + 1;
    });

    areaEl.innerHTML = AREA_ORDER.map((code) => `
      <label class="filter-chip">
        <input type="checkbox" data-filter="area" value="${code}">
        <span>${code} · ${AREA_NAMES[code]}</span>
        <span class="filter-chip__count">${areaCounts[code] || 0}</span>
      </label>
    `).join("");

    priorityEl.innerHTML = PRIORITY_ORDER.map((p) => `
      <label class="filter-chip">
        <input type="checkbox" data-filter="priority" value="${p}">
        <span>${p}</span>
        <span class="filter-chip__count">${priorityCounts[p] || 0}</span>
      </label>
    `).join("");

    typeEl.innerHTML = TYPE_ORDER.map((t) => `
      <label class="filter-chip">
        <input type="checkbox" data-filter="type" value="${t}">
        <span>${t}</span>
        <span class="filter-chip__count">${typeCounts[t] || 0}</span>
      </label>
    `).join("");

    // Event binding
    document.querySelectorAll('input[type="checkbox"][data-filter]').forEach((input) => {
      input.addEventListener("change", (e) => {
        const target = e.target;
        const bucket = target.dataset.filter === "area" ? state.areas
                     : target.dataset.filter === "priority" ? state.priorities
                     : state.types;
        if (target.checked) bucket.add(target.value);
        else bucket.delete(target.value);
        renderTable();
      });
    });
  }

  // -------- Stats --------
  function renderStats() {
    const total = TC_DATA.length;
    const criticalCount = TC_DATA.filter((t) => t.priority === "Critical").length;
    const areaCount = new Set(TC_DATA.map((t) => t.area)).size;
    const screenCount = new Set(TC_DATA.map((t) => `${t.area}-${t.screen}`)).size;

    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-critical").textContent = criticalCount;
    document.getElementById("stat-areas").textContent = areaCount;
    document.getElementById("stat-screens").textContent = screenCount;
  }

  // -------- Filter logic --------
  function filteredList() {
    const q = state.search.trim().toLowerCase();
    return TC_DATA.filter((tc) => {
      if (state.areas.size && !state.areas.has(tc.area)) return false;
      if (state.priorities.size && !state.priorities.has(tc.priority)) return false;
      if (state.types.size && !state.types.has(tc.type)) return false;
      if (q) {
        const hay = `${tc.id} ${tc.title} ${tc.screen} ${AREA_NAMES[tc.area]}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  // -------- Render table --------
  function renderTable() {
    const list = filteredList();
    const tbody = document.getElementById("tc-tbody");
    const countEl = document.getElementById("tc-count");

    countEl.innerHTML = `<strong>${list.length}</strong> / ${TC_DATA.length} 건 표시`;

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="5">
          <div class="empty-state">
            <div class="empty-state__title">조건에 맞는 TC가 없습니다</div>
            <div>필터를 조정하거나 검색어를 변경해보세요.</div>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = list.map((tc) => {
      const href = tc.hasDetail ? `${tc.id}.html` : "#";
      const linkClass = tc.hasDetail ? "tc-id-link" : "tc-id-link tc-id-link--pending";
      const onclick = tc.hasDetail ? "" : `onclick="event.preventDefault(); alert('${tc.id}: 아직 상세 페이지가 작성되지 않았습니다.');"`;
      return `
        <tr>
          <td><a href="${href}" class="${linkClass}" ${onclick}>${tc.id}</a></td>
          <td class="tc-title-cell">${escapeHtml(tc.title)}</td>
          <td><span class="${typeBadgeClass(tc.type)}">${tc.type}</span></td>
          <td><span class="${priorityBadgeClass(tc.priority)}">${tc.priority}</span></td>
          <td style="color: var(--c-ink-50); font-size: 12px;">${AREA_NAMES[tc.area]} · ${tc.screen}</td>
        </tr>`;
    }).join("");
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
  }

  // -------- Search --------
  function bindSearch() {
    const input = document.getElementById("search-input");
    input.addEventListener("input", (e) => {
      state.search = e.target.value;
      renderTable();
    });
  }

  // -------- Reset --------
  function bindReset() {
    document.getElementById("btn-reset").addEventListener("click", () => {
      state.search = "";
      state.areas.clear();
      state.priorities.clear();
      state.types.clear();
      document.getElementById("search-input").value = "";
      document.querySelectorAll('input[type="checkbox"][data-filter]').forEach((i) => (i.checked = false));
      renderTable();
    });
  }

  // -------- Init --------
  document.addEventListener("DOMContentLoaded", () => {
    renderStats();
    renderFilters();
    bindSearch();
    bindReset();
    renderTable();
  });
})();
