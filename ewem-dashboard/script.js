/* ==========================================================================
   EWEM Portfolio — behaviour
   Plain vanilla JS. Loads a static JSON manifest and renders the dashboard.
   No backend, no external runtime dependencies.
   ========================================================================== */
(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     Inline SVG icons (kept small and local so the site has no icon CDN
     dependency). Each value is the inner markup of a 24x24 stroke icon.
     ---------------------------------------------------------------------- */
  var ICONS = {
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    flask: '<path d="M9 3h6"/><path d="M10 3v6.4L5.3 17A2 2 0 0 0 7 20h10a2 2 0 0 0 1.7-3L14 9.4V3"/><path d="M7.6 14h8.8"/>',
    recycle: '<path d="M7.5 19.5H5a2 2 0 0 1-1.7-3l1.4-2.4"/><path d="m8 23-2.4-3.2L8.8 18"/><path d="M11 3.6a2 2 0 0 1 3.4 0l1.4 2.4"/><path d="m15.6 5.4 3 1.1-1.1-3.1"/><path d="M20.4 15a2 2 0 0 1-1.7 3H16"/><path d="m17.5 23 2.3-3.2-3.1-.7"/>',
    map: '<path d="M14.1 5.55a2 2 0 0 0 1.8 0l3.6-1.8A1 1 0 0 1 21 4.62v12.76a1 1 0 0 1-.55.9l-4.55 2.27a2 2 0 0 1-1.8 0l-4.2-2.1a2 2 0 0 0-1.8 0l-3.66 1.83A1 1 0 0 1 3 19.38V6.62a1 1 0 0 1 .55-.9l4.55-2.27a2 2 0 0 1 1.8 0z"/><path d="M15 5.76v15"/><path d="M9 3.24v15"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-5"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 14 3.5-4.5L14 12l5-6"/>',
    presentation: '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    bulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1h6c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2Z"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    award: '<circle cx="12" cy="8" r="5"/><path d="m8.5 12.5-1.4 8.2 4.9-2.4 4.9 2.4-1.4-8.2"/>',
    "file-text": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6"/>',
    "file-spreadsheet": '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8v6H8z"/><path d="M8 16h8M12 13v6"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.5-3.5L9 20"/>',
    folder: '<path d="M4 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2z"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    "external-link": '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/><path d="m13.5 8.5-5 5M8.5 8.5l5 5"/>',
    scroll: '<path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h11a2 2 0 0 0 2-2v-2H6a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h2"/><path d="M15 7H9M15 11H9"/>',
    tracker: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2 6.3-6.4 2 2-6.3z"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/>'
  };

  var FILE_ICON = { pdf: "file-text", docx: "file-text", xlsx: "file-spreadsheet", pptx: "presentation", png: "image", jpg: "image", jpeg: "image" };

  /* ----------------------------------------------------------------------
     Small helpers
     ---------------------------------------------------------------------- */
  function svg(name) {
    var path = ICONS[name] || ICONS["file-text"];
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + "</svg>";
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Encode each path segment so spaces and special characters are URL-safe.
  function encodePath(relPath) {
    return String(relPath).split("/").map(encodeURIComponent).join("/");
  }

  function formatBytes(bytes) {
    if (!isFinite(bytes) || bytes <= 0) return "";
    if (bytes < 1024) return bytes + " B";
    var kb = bytes / 1024;
    if (kb < 1024) return (kb < 10 ? kb.toFixed(1) : Math.round(kb)) + " KB";
    var mb = kb / 1024;
    return (mb < 10 ? mb.toFixed(1) : Math.round(mb)) + " MB";
  }

  /* ----------------------------------------------------------------------
     Theme
     ---------------------------------------------------------------------- */
  var THEME_KEY = "ewem-theme";
  var themeToggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* storage may be blocked */ }
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(stored || (prefersDark ? "dark" : "light"));

    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
      });
    }
  }

  /* ----------------------------------------------------------------------
     Navigation: mobile menu, scroll state, active section
     ---------------------------------------------------------------------- */
  function initNav() {
    var header = document.querySelector("[data-header]");
    var nav = document.getElementById("primary-nav");
    var toggle = document.getElementById("nav-toggle");
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));

    function closeMenu() {
      if (!nav) return;
      nav.classList.remove("is-open");
      if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation menu");
      }
    }

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      });
      links.forEach(function (l) { l.addEventListener("click", closeMenu); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
      document.addEventListener("click", function (e) {
        if (!nav.classList.contains("is-open")) return;
        if (nav.contains(e.target) || toggle.contains(e.target)) return;
        closeMenu();
      });
    }

    var headerH = function () {
      var v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h"));
      return isFinite(v) ? v : 66;
    };

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);

        var probe = window.scrollY + headerH() + 40;
        var active = links[0];
        links.forEach(function (l) {
          var target = document.querySelector(l.getAttribute("href"));
          if (target && target.offsetTop <= probe) active = l;
        });
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
          active = links[links.length - 1];
        }
        links.forEach(function (l) { l.classList.toggle("is-active", l === active); });
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { if (window.innerWidth > 820) closeMenu(); });
    onScroll();
  }

  /* ----------------------------------------------------------------------
     Rendering
     ---------------------------------------------------------------------- */
  var state = { data: null, files: {}, projects: [], resources: [], filters: { q: "", category: "all", type: "all" } };

  function fileHref(data, file) {
    return encodePath(data.assignmentsBase + file.path);
  }

  function renderStats(data) {
    var host = document.querySelector("[data-stats]");
    if (!host) return;

    var isa = data.isaActivities, ese = data.eseActivities;
    var folders = {};
    data.files.forEach(function (f) { folders[f.path.split("/")[0]] = true; });
    var folderCount = Object.keys(folders).length;
    var linked = isa.concat(ese).filter(function (a) { return a.files && a.files.length; }).length;
    var awaiting = (isa.length + ese.length) - linked;

    var cards = [
      { value: isa.length, label: "ISA activities listed", sub: "from the course brief" },
      { value: ese.length, label: "ESE activities listed", sub: "from the course brief" },
      { value: folderCount, label: "Activity folders discovered", sub: "under Assignments/" },
      { value: data.files.length, label: "Submission files linked", sub: "verified on disk" },
      { value: linked, label: "Activities with a linked file", sub: "across ISA and ESE" },
      { value: awaiting, label: "Awaiting a submission file", sub: "no matching file found", muted: true }
    ];

    host.innerHTML = cards.map(function (c) {
      return '<div class="stat' + (c.muted ? " stat--muted" : "") + '">' +
        '<span class="stat-value">' + escapeHtml(c.value) + "</span>" +
        '<span class="stat-label">' + escapeHtml(c.label) + "</span>" +
        '<span class="stat-sub">' + escapeHtml(c.sub) + "</span>" +
        "</div>";
    }).join("");
  }

  function fileLinkMarkup(data, file) {
    var type = data.fileTypes[file.ext] || {};
    var href = fileHref(data, file);
    // Browsers can render PDFs/images in a tab, so open those. Office files
    // are not reliably previewable, so give them a clean download instead.
    var attrs = type.viewable ? ' target="_blank" rel="noopener"' : " download";
    return '<a class="file-link" href="' + href + '"' + attrs + ">" +
      svg(FILE_ICON[file.ext] || "file-text") +
      '<span class="file-name">' + escapeHtml(file.filename) + "</span>" +
      '<span class="file-ext">' + escapeHtml(file.ext) + "</span></a>";
  }

  function activityCard(data, activity) {
    var files = (activity.files || []).map(function (id) { return state.files[id]; }).filter(Boolean);
    var isLinked = files.length > 0;

    var body = isLinked
      ? '<div class="activity-files">' + files.map(function (f) { return fileLinkMarkup(data, f); }).join("") + "</div>"
      : '<div class="missing-state">' + svg("alert") + "<span>Not yet linked — no matching submission file was found.</span></div>";

    return '<article class="activity-card">' +
      '<div class="activity-head">' +
        '<span class="activity-icon">' + svg(activity.icon) + "</span>" +
        '<span class="project-tags">' +
          '<span class="badge">' + escapeHtml(activity.badge) + "</span>" +
          '<span class="badge ' + (isLinked ? "badge--linked" : "badge--missing") + '">' +
            (isLinked ? "Linked" : "Not linked") + "</span>" +
        "</span>" +
      "</div>" +
      '<h3 class="activity-title">' + escapeHtml(activity.title) + "</h3>" +
      '<p class="activity-desc">' + escapeHtml(activity.description) + "</p>" +
      body +
      "</article>";
  }

  function renderActivities(data, list, selector) {
    var host = document.querySelector(selector);
    if (!host) return;
    host.innerHTML = list.map(function (a) { return activityCard(data, a); }).join("");
  }

  function projectRow(data, project) {
    var files = (project.files || []).map(function (id) { return state.files[id]; }).filter(Boolean);
    var tags = (project.categories || []).map(function (c) {
      return '<span class="tag">' + escapeHtml(data.categories[c] || c) + "</span>";
    }).join("");

    var fileCount = files.length + (files.length === 1 ? " file" : " files");
    var details = files.length
      ? '<details class="project-files">' +
          '<summary class="project-files-toggle">' + svg("folder") +
            "<span>" + escapeHtml(fileCount) + "</span>" + svg("chevron") +
          "</summary>" +
          '<div class="project-files-list">' +
            files.map(function (f) { return fileLinkMarkup(data, f); }).join("") +
          "</div>" +
        "</details>"
      : '<p class="project-nofiles">Not yet linked.</p>';

    return '<article class="project-row">' +
      '<span class="project-icon">' + svg(project.icon) + "</span>" +
      '<div class="project-body">' +
        '<div class="project-head">' +
          "<h3>" + escapeHtml(project.title) + "</h3>" +
          '<div class="project-tags">' + tags + "</div>" +
        "</div>" +
        '<p class="project-summary">' + escapeHtml(project.summary) + "</p>" +
        details +
      "</div>" +
      "</article>";
  }

  function renderProjects(filter) {
    var host = document.querySelector("[data-projects]");
    if (!host || !state.data) return;
    var list = state.projects.filter(function (p) {
      return !filter || filter === "all" || (p.categories || []).indexOf(filter) !== -1;
    });
    if (!list.length) {
      host.innerHTML = emptyMarkup("No projects in this category.", "Try a different filter.");
      return;
    }
    host.innerHTML = list.map(function (p) { return projectRow(state.data, p); }).join("");
  }

  function initProjectFilters() {
    var bar = document.querySelector("[data-project-filters]");
    if (!bar) return;
    bar.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-project-filter]");
      if (!btn) return;
      Array.prototype.slice.call(bar.querySelectorAll("[data-project-filter]")).forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      renderProjects(btn.getAttribute("data-project-filter"));
    });
  }

  function emptyMarkup(title, hint, iconName) {
    return '<div class="empty-state">' + svg(iconName || "search") +
      "<h3>" + escapeHtml(title) + "</h3><p>" + escapeHtml(hint || "") + "</p></div>";
  }

  function resourceItem(data, file) {
    var type = data.fileTypes[file.ext] || {};
    var href = fileHref(data, file);
    var size = formatBytes(file.sizeBytes);
    var cat = data.categories[file.category] || file.category;

    var meta = '<span class="meta-pill meta-pill--cat">' + escapeHtml(cat) + "</span>" +
      '<span class="meta-pill">' + escapeHtml(type.label || file.ext) + "</span>" +
      (size ? '<span class="meta-pill">' + size + "</span>" : "");

    var actions = type.viewable
      ? '<a class="btn-icon btn-icon--primary" href="' + href + '" target="_blank" rel="noopener">' +
          svg("external-link") + "Open</a>"
      : "";
    actions += '<a class="btn-icon" href="' + href + '" download>' + svg("download") + "Download</a>";

    return '<article class="resource-item">' +
      '<span class="resource-icon">' + svg(FILE_ICON[file.ext] || "file-text") + "</span>" +
      '<div class="resource-info">' +
        '<div class="resource-title">' + escapeHtml(file.title) + "</div>" +
        '<div class="resource-filename">' + escapeHtml(file.filename) + "</div>" +
      "</div>" +
      '<div class="resource-meta">' + meta + "</div>" +
      '<div class="resource-actions">' + actions + "</div>" +
      "</article>";
  }

  function renderResources() {
    var host = document.querySelector("[data-resource-list]");
    var countEl = document.querySelector("[data-resource-count]");
    if (!host || !state.data) return;

    var q = state.filters.q.toLowerCase().trim();
    var cat = state.filters.category;
    var type = state.filters.type;

    var list = state.resources.filter(function (f) {
      if (cat !== "all" && f.category !== cat) return false;
      if (type !== "all") {
        if (type === "image") {
          if (f.ext !== "png" && f.ext !== "jpg" && f.ext !== "jpeg") return false;
        } else if (f.ext !== type) {
          return false;
        }
      }
      if (q) {
        var hay = (f.title + " " + f.filename).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    if (countEl) countEl.textContent = list.length + (list.length === 1 ? " file" : " files") + " shown";

    if (!list.length) {
      host.innerHTML = emptyMarkup("No files match your search.", "Clear the search or reset the filters to see all files.");
      return;
    }
    host.innerHTML = list.map(function (f) { return resourceItem(state.data, f); }).join("");
  }

  function initResourceControls() {
    var search = document.querySelector("[data-resource-search]");
    var category = document.querySelector("[data-resource-category]");
    var type = document.querySelector("[data-resource-type]");
    var reset = document.querySelector("[data-resource-reset]");

    if (search) {
      search.addEventListener("input", function () {
        state.filters.q = search.value;
        renderResources();
      });
    }
    if (category) {
      category.addEventListener("change", function () {
        state.filters.category = category.value;
        renderResources();
      });
    }
    if (type) {
      type.addEventListener("change", function () {
        state.filters.type = type.value;
        renderResources();
      });
    }
    if (reset) {
      reset.addEventListener("click", function () {
        state.filters = { q: "", category: "all", type: "all" };
        if (search) search.value = "";
        if (category) category.value = "all";
        if (type) type.value = "all";
        renderResources();
        if (search) search.focus();
      });
    }
  }

  function showLoadError(err) {
    var message = "Could not load assets/data/assignments.json. If you opened this file directly " +
      "(file://), run a small local web server instead (see README).";
    if (window.console && console.error) console.error("[EWEM] manifest load failed:", err);
    ["[data-stats]", "[data-isa]", "[data-ese]", "[data-projects]", "[data-resource-list]"].forEach(function (sel) {
      var host = document.querySelector(sel);
      if (host) host.innerHTML = emptyMarkup("Unable to load data", message, "alert");
    });
    var countEl = document.querySelector("[data-resource-count]");
    if (countEl) countEl.textContent = "";
  }

  function boot(data) {
    state.data = data;
    state.projects = data.projects || [];
    state.resources = data.files || [];
    (data.files || []).forEach(function (f) { state.files[f.id] = f; });

    renderStats(data);
    renderActivities(data, data.isaActivities || [], "[data-isa]");
    renderActivities(data, data.eseActivities || [], "[data-ese]");
    renderProjects("all");
    initProjectFilters();
    initResourceControls();
    renderResources();
  }

  /* ----------------------------------------------------------------------
     Start
     ---------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    initNav();

    fetch("assets/data/assignments.json", { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status + " " + res.statusText);
        return res.json();
      })
      .then(boot)
      .catch(showLoadError);
  });
})();
