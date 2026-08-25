if (!window.storage) {
  window.storage = {
    async get(key) {
      const v = localStorage.getItem(key);
      return v === null ? null : { value: v };
    },
    async set(key, value) {
      localStorage.setItem(key, value);
    },
    async delete(key) {
      localStorage.removeItem(key);
    },
  };
}

let playersIndex = [];
let playersCache = {};
let currentPlayerId = null;
let currentView = "cat";
let saveTimer = null;
let previewCatId = null;
let showingPreview = false;

function emptyPlayerData() {
  const data = {};
  CATEGORIES.forEach((c) => {
    data[c.id] = { competencies: {}, themes: {}, bilan: {} };
  });
  data.synth = { domains: {} };
  return data;
}

async function loadIndex() {
  try {
    const r = await window.storage.get("players-index", false);
    if (r && r.value) {
      playersIndex = JSON.parse(r.value);
      return;
    }
  } catch (e) {}
  playersIndex = [];
}
async function saveIndex() {
  try {
    await window.storage.set(
      "players-index",
      JSON.stringify(playersIndex),
      false,
    );
  } catch (e) {
    console.error(e);
  }
}
async function loadPlayerData(id) {
  if (playersCache[id]) return playersCache[id];
  try {
    const r = await window.storage.get("player-data:" + id, false);
    if (r && r.value) {
      playersCache[id] = JSON.parse(r.value);
      const def = emptyPlayerData();
      Object.keys(def).forEach((k) => {
        if (!playersCache[id][k]) playersCache[id][k] = def[k];
      });
      return playersCache[id];
    }
  } catch (e) {}
  playersCache[id] = emptyPlayerData();
  return playersCache[id];
}
function scheduleSave(id) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => savePlayerData(id), 450);
}
async function savePlayerData(id) {
  try {
    await window.storage.set(
      "player-data:" + id,
      JSON.stringify(playersCache[id]),
      false,
    );
  } catch (e) {
    console.error(e);
  }
}
function escapeHtml(s) {
  return (s || "").replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        m
      ],
  );
}
function catLabel(id) {
  const c = CATEGORIES.find((c) => c.id === id);
  return c ? c.label : "";
}

function renderNewPlayerCatSelect() {
  const sel = document.getElementById("newPlayerCat");
  sel.innerHTML = CATEGORIES.map(
    (c) => `<option value="${c.id}">${c.label}</option>`,
  ).join("");
}

async function renderPlayerArea() {
  const area = document.getElementById("playerArea");
  if (showingPreview && previewCatId) {
    const cat = CATEGORIES.find((c) => c.id === previewCatId) || CATEGORIES[0];
    area.innerHTML = `<div class="preview-card">${renderCategoryHTML(cat, emptyPlayerData(), "")}</div>`;
    return;
  }
  if (!currentPlayerId) {
    area.innerHTML = `<div class="empty-state">Ajoute une joueuse ci-dessus pour commencer à remplir sa fiche.</div>`;
    return;
  }
  const player = playersIndex.find((p) => p.id === currentPlayerId);
  if (!player) {
    currentPlayerId = null;
    return renderPlayerArea();
  }

  const pdata = await loadPlayerData(currentPlayerId);
  const catOptions = CATEGORIES.map(
    (c) =>
      `<option value="${c.id}" ${c.id === player.catId ? "selected" : ""}>${c.label}</option>`,
  ).join("");
  const switchOptions = playersIndex
    .map(
      (p) =>
        `<option value="${p.id}" ${p.id === currentPlayerId ? "selected" : ""}>${escapeHtml(p.name)} (${catLabel(p.catId)})</option>`,
    )
    .join("");

  let header = `
    <div class="player-header">
      <div class="player-title">
        <h2><span class="player-avatar">${escapeHtml(player.name.charAt(0).toUpperCase())}</span> ${escapeHtml(player.name)}</h2>
        ${
          player.coach || player.season
            ? `<div class="player-meta">${[
                player.coach ? `Entraîneur : ${escapeHtml(player.coach)}` : "",
                player.season ? `Saison : ${escapeHtml(player.season)}` : "",
              ]
                .filter(Boolean)
                .map((t) => `<span class="meta-item">${t}</span>`)
                .join("")}</div>`
            : ""
        }
      </div>
      <div class="player-controls">
        <div class="player-switch-group">
          <select id="playerSwitchSelect">${switchOptions}</select>
          <button class="btn-icon" id="renamePlayerBtn" title="Renommer">✎</button>
          <button class="btn-icon" id="deletePlayerBtn" title="Supprimer">🗑</button>
        </div>
        <div class="cat-switch">
          <label>Catégorie :</label>
          <select id="playerCatSelect">${catOptions}</select>
        </div>
        <div class="subtabs">
          <button class="subtab-btn ${currentView === "cat" ? "active" : ""}" data-view="cat">Fiche compétences</button>
          <button class="subtab-btn ${currentView === "synth" ? "active" : ""}" data-view="synth">Synthèse</button>
        </div>
      </div>
    </div>
  `;

  let content = "";
  if (currentView === "synth") {
    content = renderSynthHTML(pdata, player.name);
  } else {
    const cat = CATEGORIES.find((c) => c.id === player.catId) || CATEGORIES[0];
    content = renderCategoryHTML(cat, pdata, player.name);
  }

  area.innerHTML = header + content;
  attachPlayerAreaEvents();
}

function levelOptionsHtml(groupAttrs, activeVal) {
  return LEVELS.map(
    (l) => `
    <span class="lvl-option ${activeVal === l.k ? "active" : ""}" data-lvl="${l.k}" ${groupAttrs}>
      <span class="box">${CHECK_SVG}</span>
      <span class="lbl">${l.label}</span>
    </span>
  `,
  ).join("");
}

function legendHtml() {
  const rows = LEVEL_LEGEND.map(
    (l) => `
    <div class="legend-row">
      <span class="legend-label">${escapeHtml(l.label)}</span>
      <span class="legend-desc">${escapeHtml(l.desc)}</span>
    </div>
  `,
  ).join("");
  return `
    <details class="legend-box">
      <summary>Comment utiliser la grille ?</summary>
      <p>Pour chaque compétence, cocher le niveau atteint :</p>
      ${rows}
    </details>
  `;
}

function renderCategoryHTML(cat, pdata, playerName) {
  const cd = pdata[cat.id];
  let sectionsHtml = cat.sections
    .map((sec) => {
      const rows = sec.i
        .map((item) => {
          const key = sec.t + "|" + item;
          const val = cd.competencies[key] || "";
          const opts = levelOptionsHtml(
            `data-cat="${cat.id}" data-key="${escapeHtml(key)}"`,
            val,
          );
          return `<div class="item-row"><span class="item-name">${escapeHtml(item)}</span><span class="lvl-group">${opts}</span></div>`;
        })
        .join("");
      return `<div class="section-block"><div class="section-title">${escapeHtml(sec.t)}</div>${rows}</div>`;
    })
    .join("");

  const themesHtml = cat.themes
    .map((th) => {
      const active = cd.themes[th];
      return `
    <div class="theme-item ${active ? "active" : ""}" data-cat="${cat.id}" data-theme="${escapeHtml(th)}">
      <span class="box">${CHECK_SVG}</span>
      <span class="lbl">${escapeHtml(th)}</span>
    </div>
  `;
    })
    .join("");

  const bilanHtml = BILAN_FIELDS.map(
    (f) => `
    <div class="field">
      <label>${f.label}</label>
      <textarea data-cat="${cat.id}" data-field="${f.k}" rows="2">${escapeHtml(cd.bilan[f.k] || "")}</textarea>
    </div>
  `,
  ).join("");

  return `
    <div class="card">
      <div class="cat-head">
        <h2>${escapeHtml(cat.full)}</h2>
        <p class="objectif">${escapeHtml(cat.objectif)}</p>
      </div>
      ${legendHtml()}
      ${sectionsHtml}
      <div class="bilan">
        <h3>Bilan entraîneur</h3>
        ${bilanHtml}
      </div>
      <div class="themes-box">
        <h3>Thèmes possibles à aborder</h3>
        <div class="theme-list">${themesHtml}</div>
      </div>
    </div>
    <div class="export-row">
      <button class="btn btn-navy" id="exportOne">Exporter PDF joueuse : ${escapeHtml(playerName)}</button>
      <button class="btn btn-outline" id="exportAll">Exporter PDF toutes les joueuses de la catégorie ${escapeHtml(cat.label)}</button>
    </div>
  `;
}

function renderSynthHTML(pdata, playerName) {
  const sd = pdata.synth;
  const rows = SYNTH_DOMAINS.map((dom) => {
    const entry = sd.domains[dom] || { level: "", priorite: "" };
    const opts = levelOptionsHtml(
      `data-domain="${escapeHtml(dom)}"`,
      entry.level,
    );
    return `<tr>
      <td>${escapeHtml(dom)}</td>
      <td><span class="lvl-group">${opts}</span></td>
      <td><textarea data-domain="${escapeHtml(dom)}" data-priorite="1" rows="2">${escapeHtml(entry.priorite || "")}</textarea></td>
    </tr>`;
  }).join("");

  return `
    <div class="card">
      <div class="cat-head">
        <h2>Grille club - Synthèse de progression générale</h2>
        <p class="objectif">À utiliser en fin de saison pour transmettre les informations à l'entraîneur de la catégorie suivante.</p>
      </div>
      ${legendHtml()}
      <table class="domain-table">
        <thead><tr><th>Domaine</th><th>Niveau</th><th>Priorité suivante</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="footnote-box">
        <div class="footnote-row">
          <span class="footnote-label">Fil rouge</span>
          <span class="footnote-text">Baby Hand : explorer → -7 : découvrir → -9 : maîtriser les fondamentaux → -11 : jouer ensemble → -13 : lire le jeu → -15 : accélérer et s'adapter → -18 : devenir autonome et performant.</span>
        </div>
        <div class="footnote-row">
          <span class="footnote-label">Valeurs club</span>
          <span class="footnote-text">Engagement • Solidarité • Humilité • Bravoure</span>
        </div>
      </div>
    </div>
    <div class="export-row">
      <button class="btn btn-navy" id="exportOne">Exporter PDF - ${escapeHtml(playerName)}</button>
    </div>
  `;
}

function attachPlayerAreaEvents() {
  const catSel = document.getElementById("playerCatSelect");
  if (catSel) {
    catSel.addEventListener("change", async () => {
      const player = playersIndex.find((p) => p.id === currentPlayerId);
      player.catId = catSel.value;
      await saveIndex();
      renderPlayerArea();
    });
  }
  const switchSel = document.getElementById("playerSwitchSelect");
  if (switchSel) {
    switchSel.addEventListener("change", (e) => {
      currentPlayerId = e.target.value;
      currentView = "cat";
      showingPreview = false;
      renderPlayerArea();
    });
  }
  const renameBtn = document.getElementById("renamePlayerBtn");
  if (renameBtn) {
    renameBtn.addEventListener("click", async () => {
      const p = playersIndex.find((pl) => pl.id === currentPlayerId);
      if (!p) return;
      const newName = prompt("Nouveau nom de la joueuse :", p.name);
      if (newName && newName.trim()) {
        p.name = newName.trim();
        await saveIndex();
        renderPlayerArea();
      }
    });
  }
  const deleteBtn = document.getElementById("deletePlayerBtn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      const id = currentPlayerId;
      if (!id) return;
      const p = playersIndex.find((pl) => pl.id === id);
      if (
        !confirm(`Supprimer ${p ? p.name : "cette joueuse"} et ses données ?`)
      )
        return;
      playersIndex = playersIndex.filter((pl) => pl.id !== id);
      delete playersCache[id];
      try {
        await window.storage.delete("player-data:" + id, false);
      } catch (err) {}
      await saveIndex();
      currentPlayerId = playersIndex.length ? playersIndex[0].id : null;
      renderPlayerArea();
    });
  }
  document.querySelectorAll(".subtab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentView = btn.dataset.view;
      renderPlayerArea();
    });
  });
  document.querySelectorAll(".lvl-option[data-key]").forEach((opt) => {
    opt.addEventListener("click", () => {
      const catId = opt.dataset.cat,
        key = opt.dataset.key,
        lvl = opt.dataset.lvl;
      const cd = playersCache[currentPlayerId][catId];
      cd.competencies[key] = cd.competencies[key] === lvl ? "" : lvl;
      renderPlayerArea();
      scheduleSave(currentPlayerId);
    });
  });
  document.querySelectorAll(".lvl-option[data-domain]").forEach((opt) => {
    opt.addEventListener("click", () => {
      const dom = opt.dataset.domain,
        lvl = opt.dataset.lvl;
      const sd = playersCache[currentPlayerId].synth;
      if (!sd.domains[dom]) sd.domains[dom] = { level: "", priorite: "" };
      sd.domains[dom].level = sd.domains[dom].level === lvl ? "" : lvl;
      renderPlayerArea();
      scheduleSave(currentPlayerId);
    });
  });
  document.querySelectorAll("textarea[data-priorite]").forEach((inp) => {
    inp.addEventListener("input", () => {
      const dom = inp.dataset.domain;
      const sd = playersCache[currentPlayerId].synth;
      if (!sd.domains[dom]) sd.domains[dom] = { level: "", priorite: "" };
      sd.domains[dom].priorite = inp.value;
      scheduleSave(currentPlayerId);
    });
  });
  document.querySelectorAll(".theme-item[data-theme]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const catId = chip.dataset.cat,
        th = chip.dataset.theme;
      const cd = playersCache[currentPlayerId][catId];
      cd.themes[th] = !cd.themes[th];
      renderPlayerArea();
      scheduleSave(currentPlayerId);
    });
  });
  document.querySelectorAll("textarea[data-field]").forEach((ta) => {
    ta.addEventListener("input", () => {
      const catId = ta.dataset.cat,
        field = ta.dataset.field;
      playersCache[currentPlayerId][catId].bilan[field] = ta.value;
      scheduleSave(currentPlayerId);
    });
  });
  const exOne = document.getElementById("exportOne");
  const exAll = document.getElementById("exportAll");
  if (exOne) exOne.addEventListener("click", () => exportPDF(false));
  if (exAll) exAll.addEventListener("click", () => exportPDF(true));
}

function drawCategoryForPlayer(doc, cat, pdata, player) {
  const marginL = 15,
    marginR = 15,
    pageW = 210,
    pageH = 297;
  const contentRight = pageW - marginR;
  let y = 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(18, 40, 69);
  doc.text("Evian Sports Handball", marginL, y);
  y += 6;
  doc.setFontSize(15);
  doc.text(cat.full, marginL, y);
  y += 6;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9.5);
  doc.setTextColor(90, 100, 115);
  const objLines = doc.splitTextToSize(cat.objectif, contentRight - marginL);
  doc.text(objLines, marginL, y);
  y += objLines.length * 4.2 + 3;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(20, 30, 40);
  doc.text("Nom du joueur : " + player.name, marginL, y);
  y += 5;
  if (player.coach) {
    doc.text("Nom de l'entraîneur : " + player.coach, marginL, y);
    y += 5;
  }
  if (player.season) {
    doc.text("Saison : " + player.season, marginL, y);
    y += 5;
  }
  doc.text(
    "Date export : " + new Date().toLocaleDateString("fr-FR"),
    marginL,
    y,
  );
  y += 8;

  const colW = 25,
    colGap = 3;
  const col = [
    contentRight - colW * 3 - colGap * 2,
    contentRight - colW * 2 - colGap,
    contentRight - colW,
  ];
  const textRight = col[0] - 4;

  function ensureSpace(h) {
    if (y + h > pageH - 15) {
      doc.addPage();
      y = 18;
    }
  }
  function drawSectionHeader(sec) {
    doc.setFillColor(28, 58, 99);
    doc.rect(marginL - 1, y - 4.2, contentRight - marginL + 2, 6.4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(sec.t, marginL, y - 0.6);
    doc.setFontSize(7.3);
    LEVELS.forEach((l, idx) => {
      doc.text(l.label, col[idx] + colW / 2 - 1, y - 0.6, { align: "center" });
    });
    y += 7;
  }

  const cd = pdata[cat.id];
  cat.sections.forEach((sec) => {
    ensureSpace(14);
    drawSectionHeader(sec);

    sec.i.forEach((item) => {
      const key = sec.t + "|" + item;
      const val = cd.competencies[key] || "";
      const lines = doc.splitTextToSize(item, textRight - marginL);
      const rowH = Math.max(6, lines.length * 4.2 + 2);
      ensureSpace(rowH + 2);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.7);
      doc.setTextColor(25, 35, 45);
      doc.text(lines, marginL, y);
      LEVELS.forEach((l, idx) => {
        const bx = col[idx] + colW / 2 - 1.7 - 1,
          by = y - 3.4,
          bs = 3.4;
        doc.setDrawColor(120, 130, 145);
        doc.rect(bx, by, bs, bs);
        if (val === l.k) {
          doc.setFillColor(47, 158, 92);
          doc.rect(bx + 0.5, by + 0.5, bs - 1, bs - 1, "F");
        }
      });
      doc.setDrawColor(220, 226, 232);
      doc.line(marginL - 1, y + rowH - 5, contentRight + 1, y + rowH - 5);
      y += rowH;
    });
    y += 2;
  });

  ensureSpace(20);
  y += 3;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(18, 40, 69);
  doc.text("Bilan entraîneur", marginL, y);
  y += 6;
  BILAN_FIELDS.forEach((f) => {
    const val = (cd.bilan[f.k] || "").trim();
    const lines = doc.splitTextToSize(val || "-", contentRight - marginL);
    ensureSpace(lines.length * 4.4 + 7);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.8);
    doc.setTextColor(60, 70, 85);
    doc.text(f.label + " :", marginL, y);
    y += 4.2;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(25, 35, 45);
    doc.text(lines, marginL, y);
    y += lines.length * 4.4 + 3;
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(150, 158, 168);
  doc.text(
    "Evian Sports Handball – Référentiel des compétences en HB / Cassandra BONNET",
    marginL,
    pageH - 10,
  );
}

function drawSynthForPlayer(doc, pdata, player) {
  const marginL = 15,
    marginR = 15,
    pageW = 210,
    pageH = 297;
  const contentRight = pageW - marginR;
  let y = 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(18, 40, 69);
  doc.text("Grille club - Synthèse de progression générale", marginL, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(20, 30, 40);
  doc.text("Nom du joueur : " + player.name, marginL, y);
  y += 5;
  if (player.coach) {
    doc.text("Nom de l'entraîneur : " + player.coach, marginL, y);
    y += 5;
  }
  if (player.season) {
    doc.text("Saison : " + player.season, marginL, y);
    y += 5;
  }
  doc.text(
    "Date export : " + new Date().toLocaleDateString("fr-FR"),
    marginL,
    y,
  );
  y += 9;

  const colW = 23,
    colGap = 4;
  const col = [
    marginL + 47,
    marginL + 47 + colW + colGap,
    marginL + 47 + (colW + colGap) * 2,
  ];
  const colPrio = col[2] + colW + 9;

  function drawHeader() {
    doc.setFillColor(28, 58, 99);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.rect(marginL - 1, y - 4.2, contentRight - marginL + 2, 6.4, "F");
    doc.text("Domaine", marginL, y - 0.6);
    doc.setFontSize(7);
    LEVELS.forEach((l, idx) => {
      doc.text(l.label, col[idx] + colW / 2, y - 0.6, { align: "center" });
    });
    doc.setFontSize(8.5);
    doc.text("Priorité suivante", colPrio, y - 0.6);
    y += 10;
  }
  drawHeader();

  const sd = pdata.synth;
  SYNTH_DOMAINS.forEach((dom) => {
    const entry = sd.domains[dom] || { level: "", priorite: "" };
    const prioLines = doc.splitTextToSize(
      entry.priorite || "",
      contentRight - colPrio,
    );
    const rowH = Math.max(9, prioLines.length * 4.2 + 3);
    if (y + rowH > pageH - 15) {
      doc.addPage();
      y = 18;
      drawHeader();
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.7);
    doc.setTextColor(25, 35, 45);
    doc.text(dom, marginL, y);

    LEVELS.forEach((l, idx) => {
      const bx = col[idx] + colW / 2 - 1.7,
        by = y - 3.4,
        bs = 3.4;
      doc.setDrawColor(120, 130, 145);
      doc.rect(bx, by, bs, bs);
      if (entry.level === l.k) {
        doc.setFillColor(47, 158, 92);
        doc.rect(bx + 0.5, by + 0.5, bs - 1, bs - 1, "F");
      }
    });

    if (prioLines.length) {
      doc.setFontSize(8.7);
      doc.setTextColor(25, 35, 45);
      doc.text(prioLines, colPrio, y);
    }

    doc.setDrawColor(220, 226, 232);
    doc.line(marginL - 1, y + rowH - 6, contentRight + 1, y + rowH - 6);
    y += rowH;
  });

  doc.setFontSize(7);
  doc.setTextColor(150, 158, 168);
  doc.text(
    "Evian Sports Handball – Référentiel des compétences en HB / Cassandra BONNET",
    marginL,
    pageH - 10,
  );
}

async function exportPDF(allInCategory) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const player = playersIndex.find((p) => p.id === currentPlayerId);
  const isSynth = currentView === "synth";
  const cat = isSynth
    ? null
    : CATEGORIES.find((c) => c.id === player.catId) || CATEGORIES[0];

  const targets = allInCategory
    ? playersIndex.filter((p) => p.catId === player.catId)
    : [player];
  let first = true;
  for (const p of targets) {
    const pdata = await loadPlayerData(p.id);
    if (!first) doc.addPage();
    first = false;
    if (isSynth) {
      drawSynthForPlayer(doc, pdata, p);
    } else {
      drawCategoryForPlayer(doc, cat, pdata, p);
    }
  }
  const fname = allInCategory
    ? `ESHB_${isSynth ? "Synthese" : cat.label}_joueuses.pdf`
    : `ESHB_${isSynth ? "Synthese" : cat.label}_${player.name}.pdf`;
  doc.save(fname.replace(/\s+/g, "_"));
}

function attachGlobalEvents() {
  document.getElementById("addPlayerBtn").addEventListener("click", addPlayer);
  ["newPlayerName", "newPlayerCoach", "newPlayerSeason"].forEach((id) => {
    document.getElementById(id).addEventListener("keydown", (e) => {
      if (e.key === "Enter") addPlayer();
    });
  });
  document.getElementById("newPlayerCat").addEventListener("change", (e) => {
    previewCatId = e.target.value;
    showingPreview = true;
    currentView = "cat";
    renderPlayerArea();
  });
}

async function addPlayer() {
  const nameInp = document.getElementById("newPlayerName");
  const coachInp = document.getElementById("newPlayerCoach");
  const seasonInp = document.getElementById("newPlayerSeason");
  const catSel = document.getElementById("newPlayerCat");

  for (const inp of [nameInp, coachInp, seasonInp]) {
    if (!inp.value.trim()) {
      inp.focus();
      inp.reportValidity();
      return;
    }
  }

  const id = "p" + Date.now() + Math.floor(Math.random() * 1000);
  playersIndex.push({
    id,
    name: nameInp.value.trim(),
    catId: catSel.value,
    coach: coachInp.value.trim(),
    season: seasonInp.value.trim(),
  });
  await saveIndex();
  nameInp.value = "";
  coachInp.value = "";
  seasonInp.value = "";
  currentPlayerId = id;
  currentView = "cat";
  showingPreview = false;
  renderPlayerArea();
}

function attachScrollTopButton() {
  const btn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 300);
  });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

async function init() {
  renderNewPlayerCatSelect();
  await loadIndex();
  if (playersIndex.length) {
    currentPlayerId = playersIndex[0].id;
  }
  attachGlobalEvents();
  attachScrollTopButton();
  await renderPlayerArea();
}
init();
