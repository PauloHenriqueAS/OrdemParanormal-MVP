const STORAGE_KEY = "op-mvp-data";

const ACTIONS = [
  { id: "pista-comum", label: "Encontrou pista comum", points: 5 },
  { id: "pista-importante", label: "Encontrou pista importante", points: 10 },
  { id: "enigma", label: "Resolveu enigma", points: 10 },
  { id: "ideia", label: "Teve uma ideia importante", points: 10 },
  { id: "aliado", label: "Salvou um aliado", points: 10 },
  { id: "inimigo", label: "Derrotou inimigo", points: 5 },
  { id: "chefe", label: "Derrotou chefe", points: 15 },
  { id: "estrategia", label: "Criou estratégia decisiva", points: 10 },
  { id: "interpretacao", label: "Boa interpretação de personagem", points: 5 },
  { id: "momento", label: "Momento marcante ou emocionante", points: 10 },
  { id: "criativa", label: "Solução criativa para um problema", points: 5 },
  { id: "objetivo", label: "Completou objetivo da missão", points: 15 },
  { id: "salvou-grupo", label: "Fez uma jogada que salvou o grupo", points: 20 },
];

const CLASSES = ["Combatente", "Especialista", "Ocultista"];
const RANKS = ["Recruta", "Operador", "Agente Especial", "Oficial de Operações", "Agente de Elite"];

const app = document.getElementById("app");
const modalRoot = document.getElementById("modal-root");

const state = { campaigns: readStoredCampaigns() };
const ui = {
  screen: "home",
  campaignId: null,
  selectedPlayerId: null,
  flashPlayerId: null,
  certificateFrom: "home",
};

let previewUrl = null;

function uid() {
  if (globalThis.crypto && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `op-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function classes(...parts) {
  return parts.filter(Boolean).join(" ");
}

function cleanName(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function imgSrc(src) {
  if (typeof src !== "string" || !src.startsWith("data:image/")) return "";
  if (src.includes('"') || src.includes("<")) return "";
  return src;
}

function previewSrc(src) {
  if (typeof src !== "string") return "";
  if (src.startsWith("blob:")) return src;
  return imgSrc(src);
}

function initials(name) {
  const parts = cleanName(name).split(" ").filter(Boolean);
  if (!parts.length) return "OP";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function formatWhen(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function playerCountLabel(count) {
  return count === 1 ? "1 jogador" : `${count} jogadores`;
}

function historyLabel(count) {
  return count === 1 ? "1 registro" : `${count} registros`;
}

function clampNex(value) {
  const number = Number(value);
  if (!Number.isInteger(number)) return 0;
  return Math.min(99, Math.max(0, number));
}

function normalizePlayer(player) {
  const source = player || {};
  const points = Number(source.pontos);
  return {
    id: String(source.id || uid()),
    nome: String(source.nome || "Jogador"),
    token: typeof source.token === "string" ? source.token : "",
    classe: String(source.classe || CLASSES[0]),
    nex: clampNex(source.nex),
    patente: String(source.patente || RANKS[0]),
    pontos: Number.isFinite(points) ? Math.max(0, Math.round(points)) : 0,
  };
}

function normalizeEntry(entry) {
  const source = entry || {};
  const points = Number(source.pontos);
  return {
    id: String(source.id || uid()),
    jogador: String(source.jogador || ""),
    acao: String(source.acao || "Ação"),
    pontos: Number.isFinite(points) ? Math.round(points) : 0,
    quando: String(source.quando || new Date().toISOString()),
  };
}

function normalizeCampaign(campaign) {
  const source = campaign || {};
  return {
    id: String(source.id || uid()),
    nome: String(source.nome || "Campanha"),
    banner: typeof source.banner === "string" ? source.banner : "",
    players: Array.isArray(source.players) ? source.players.map(normalizePlayer) : [],
    historico: Array.isArray(source.historico) ? source.historico.map(normalizeEntry) : [],
  };
}

function readStoredCampaigns() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.campaigns)) return [];
    return data.campaigns.map(normalizeCampaign);
  } catch (err) {
    return [];
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, campaigns: state.campaigns }));
    return true;
  } catch (err) {
    state.campaigns = readStoredCampaigns();
    window.alert("Não foi possível salvar neste navegador. O espaço para imagens pode ter acabado. Tente arquivos menores.");
    return false;
  }
}

function findCampaign(id) {
  return state.campaigns.find((campaign) => campaign.id === id) || null;
}

function currentCampaign() {
  return findCampaign(ui.campaignId);
}

function leaders(players) {
  if (!players.length) return [];
  const max = Math.max(...players.map((player) => player.pontos));
  if (max <= 0) return [];
  return players.filter((player) => player.pontos === max);
}

function rankedPlayers(players) {
  return [...players].sort((a, b) => b.pontos - a.pontos || a.nome.localeCompare(b.nome, "pt-BR"));
}

function campaignStatus(campaign) {
  const top = leaders(campaign.players);
  if (!top.length) return "Sem pontuação nesta sessão";
  if (top.length === 1) return `MVP: ${top[0].nome}`;
  return `MVP: ${top.map((player) => player.nome).join(", ")}`;
}

function playerName(campaign, playerId) {
  return campaign.players.find((player) => player.id === playerId)?.nome || "Jogador removido";
}

function announce(text) {
  const live = document.getElementById("live");
  if (!live) return;
  live.textContent = "";
  window.setTimeout(() => {
    live.textContent = text;
  }, 30);
}

function canvasHasAlpha(ctx, width, height) {
  const data = ctx.getImageData(0, 0, width, height).data;
  for (let index = 3; index < data.length; index += 16) {
    if (data[index] < 250) return true;
  }
  return false;
}

function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("imagem"));
    };
    image.src = url;
  });
}

async function decodeImage(file) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch (err) {
      try {
        return await createImageBitmap(file);
      } catch (inner) {
        return loadImageElement(file);
      }
    }
  }
  return loadImageElement(file);
}

async function readImage(file, maxEdge, options = {}) {
  if (!file) throw new Error("arquivo");
  if (file.type && !file.type.startsWith("image/")) throw new Error("tipo");
  if (file.size > 12 * 1024 * 1024) throw new Error("tamanho");
  const bitmap = await decodeImage(file);
  try {
    const largest = Math.max(bitmap.width, bitmap.height) || 1;
    const scale = Math.min(1, maxEdge / largest);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("canvas");
    if (options.background) {
      ctx.fillStyle = options.background;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);
    const usePng = !options.background && canvasHasAlpha(ctx, width, height);
    return usePng ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    if (bitmap && typeof bitmap.close === "function") bitmap.close();
  }
}

function fieldValue(form, name) {
  const element = form.elements.namedItem(name);
  return element && "value" in element ? element.value : "";
}

function fieldFile(form, name) {
  const element = form.elements.namedItem(name);
  if (!element || !element.files || !element.files.length) return null;
  return element.files[0];
}

function showError(form, message) {
  const error = form.querySelector(".form-error");
  if (error) error.textContent = message;
}

function resolveChoice(selectValue, customValue, emptyMessage) {
  if (selectValue === "__outra__") {
    const custom = cleanName(customValue);
    if (!custom) return { error: emptyMessage };
    return { value: custom };
  }
  return { value: selectValue };
}

function optionsMarkup(list, current) {
  const known = !current || list.includes(current);
  const options = list.map((item, index) => {
    const selected = known && (current ? item === current : index === 0);
    return `<option value="${esc(item)}"${selected ? " selected" : ""}>${esc(item)}</option>`;
  }).join("");
  return `${options}<option value="__outra__"${known ? "" : " selected"}>Outra</option>`;
}

function bannerVisual(src, name, className) {
  const safe = imgSrc(src);
  if (safe) return `<img class="${className}" alt="" decoding="async" src="${safe}">`;
  return `<div class="${className} banner-fallback" aria-hidden="true">${esc(initials(name))}</div>`;
}

function avatarHtml(player, sizeClass) {
  const safe = imgSrc(player.token);
  if (safe) return `<img class="avatar ${sizeClass}" alt="" decoding="async" src="${safe}">`;
  return `<div class="avatar avatar-fallback ${sizeClass}" aria-hidden="true">${esc(initials(player.nome))}</div>`;
}

function previewMarkup(src, token) {
  const safe = previewSrc(src);
  if (!safe) return "";
  return `<img class="${token ? "preview-token" : ""}" alt="Prévia da imagem" src="${safe}">`;
}

function withNote(content) {
  return `${content}<p class="save-note">Salvo neste navegador. Outro computador ou outro navegador não vê estas campanhas.</p>`;
}

function renderHome() {
  const cards = state.campaigns.length
    ? `<div class="campaign-grid">${state.campaigns.map(renderCampaignCard).join("")}</div>`
    : `<div class="empty"><h3>Nenhuma campanha ainda</h3><p>Crie a primeira mesa e envie o banner.</p></div>`;

  return withNote(`
    <div class="page-head">
      <div>
        <p class="kicker">Ordem Paranormal</p>
        <h2>Campanhas</h2>
        <p class="lede">Crie uma campanha com banner, cadastre os jogadores e marque os pontos durante a sessão para definir o MVP.</p>
      </div>
      <button type="button" class="btn btn-primary" data-action="new-campaign">Nova campanha</button>
    </div>
    ${cards}
  `);
}

function renderCampaignCard(campaign) {
  return `
    <article class="campaign-card">
      <div class="card-open" role="button" tabindex="0" data-action="open-campaign" data-id="${esc(campaign.id)}">
        ${bannerVisual(campaign.banner, campaign.nome, "card-media")}
        <div class="card-copy">
          <h3>${esc(campaign.nome)}</h3>
          <p>${playerCountLabel(campaign.players.length)}</p>
          <p>${esc(campaignStatus(campaign))}</p>
        </div>
      </div>
      <div class="card-actions">
        <button type="button" class="btn btn-ghost btn-small" data-action="edit-campaign" data-id="${esc(campaign.id)}">Editar</button>
        <button type="button" class="btn btn-primary btn-small" data-action="open-certificate" data-id="${esc(campaign.id)}" data-from="home">MVP</button>
        <button type="button" class="btn btn-danger btn-small" data-action="delete-campaign" data-id="${esc(campaign.id)}">Excluir</button>
      </div>
    </article>
  `;
}

function renderMvp(players) {
  if (!players.length) {
    return `
      <section class="mvp-panel">
        <p class="kicker">MVP da sessão</p>
        <h3>Cadastre os jogadores para começar</h3>
        <p>Depois é só selecionar quem realizou a ação e marcar os pontos.</p>
      </section>
    `;
  }
  const top = leaders(players);
  if (!top.length) {
    return `
      <section class="mvp-panel">
        <p class="kicker">MVP da sessão</p>
        <h3>A mesa ainda não tem um MVP</h3>
        <p>Selecione um personagem e registre a primeira ação.</p>
      </section>
    `;
  }
  const tied = top.length > 1;
  return `
    <section class="mvp-panel">
      <p class="kicker">${tied ? "Empate no MVP" : "MVP da sessão"}</p>
      <ul class="mvp-list">
        ${top.map((player) => `
          <li>
            ${avatarHtml(player, "avatar-lg")}
            <div>
              <h3>${esc(player.nome)}</h3>
              <p>${esc(player.classe)} · NEX ${player.nex}% · ${esc(player.patente)}</p>
            </div>
            <strong>${player.pontos} pts</strong>
          </li>
        `).join("")}
      </ul>
    </section>
  `;
}

function renderRankStrip(players, selectedId) {
  if (!players.length) return "";
  const top = leaders(players);
  let place = 0;
  let lastPoints = null;
  const items = rankedPlayers(players).map((player) => {
    if (player.pontos !== lastPoints) {
      place += 1;
      lastPoints = player.pontos;
    }
    const isMvp = top.some((item) => item.id === player.id);
    return `
      <li class="${classes(isMvp && "is-mvp", player.id === selectedId && "is-selected")}">
        <span class="place">${place}</span>
        <span>${esc(player.nome)}</span>
        ${isMvp ? '<span class="mvp-badge">MVP</span>' : ""}
        <strong>${player.pontos}</strong>
      </li>
    `;
  }).join("");
  return `<ol class="rank-strip" aria-label="Ranking da sessão">${items}</ol>`;
}

function renderPlayerCard(campaign, player, flashId) {
  const selected = ui.selectedPlayerId === player.id;
  const leader = leaders(campaign.players).some((item) => item.id === player.id);
  return `
    <article class="${classes("player-card", selected && "is-selected", leader && "is-leader", player.id === flashId && "is-flash")}">
      <div class="player-select" role="button" tabindex="0" data-action="select-player" data-id="${esc(player.id)}" aria-pressed="${selected ? "true" : "false"}">
        ${avatarHtml(player, "")}
        <div class="player-info">
          <div class="name-line">
            <h3>${esc(player.nome)}</h3>
            ${selected ? '<span class="selected-flag">Selecionado</span>' : ""}
            ${leader ? '<span class="mvp-badge">MVP</span>' : ""}
          </div>
          <p>${esc(player.classe)}</p>
          <p class="meta">NEX ${player.nex}% · ${esc(player.patente)}</p>
        </div>
        <strong class="points">${player.pontos}<span> pts</span></strong>
      </div>
      <div class="inline-actions">
        <button type="button" class="btn btn-ghost btn-small" data-action="edit-player" data-id="${esc(player.id)}">Editar</button>
        <button type="button" class="btn btn-danger btn-small" data-action="delete-player" data-id="${esc(player.id)}">Remover</button>
      </div>
    </article>
  `;
}

function renderActions(selected) {
  const hint = selected
    ? `Registrando para <strong>${esc(selected.nome)}</strong>.`
    : "Selecione o personagem que realizou a ação.";
  const disabled = selected ? "" : "disabled";
  const rows = ACTIONS.map((action) => `
    <li>
      <button type="button" class="action-btn" data-action="award" data-id="${esc(action.id)}" ${disabled}>
        <span>${esc(action.label)}</span>
        <strong>+${action.points}</strong>
      </button>
    </li>
  `).join("");
  return `
    <section class="panel panel-actions">
      <h3>Pontuação do MVP</h3>
      <p class="hint">${hint}</p>
      <div class="table-head" aria-hidden="true"><span>Ação</span><span>Pontos</span></div>
      <ul class="action-list">${rows}</ul>
    </section>
  `;
}

function renderHistory(campaign) {
  const items = campaign.historico.length
    ? campaign.historico.map((entry) => `
      <li class="history-item">
        <div class="history-copy">
          <time datetime="${esc(entry.quando)}">${esc(formatWhen(entry.quando))}</time>
          <p><strong>${esc(playerName(campaign, entry.jogador))}</strong> · ${esc(entry.acao)}</p>
        </div>
        <strong class="history-points">+${entry.pontos}</strong>
        <button type="button" class="btn btn-ghost btn-small" data-action="undo" data-id="${esc(entry.id)}">Desfazer</button>
      </li>
    `).join("")
    : `<div class="empty"><h3>Nenhuma ação nesta sessão</h3><p>Os lançamentos aparecem aqui e podem ser desfeitos.</p></div>`;
  return `
    <section class="panel panel-history">
      <div class="section-head">
        <h3>Histórico</h3>
        <span class="meta">${historyLabel(campaign.historico.length)}</span>
      </div>
      ${campaign.historico.length ? `<ul class="history-list">${items}</ul>` : items}
    </section>
  `;
}

function renderCampaign(campaign, flashId) {
  if (ui.selectedPlayerId && !campaign.players.some((player) => player.id === ui.selectedPlayerId)) {
    ui.selectedPlayerId = null;
  }
  const selected = campaign.players.find((player) => player.id === ui.selectedPlayerId) || null;
  const canReset = campaign.historico.length > 0 || campaign.players.some((player) => player.pontos > 0);
  const players = campaign.players.length
    ? `<div class="player-grid">${campaign.players.map((player) => renderPlayerCard(campaign, player, flashId)).join("")}</div>`
    : `<div class="empty"><h3>Nenhum jogador nesta campanha</h3><p>Cadastre os personagens com o token, a classe, o NEX e a patente.</p></div>`;

  return withNote(`
    <div class="mesa">
    <div class="toolbar">
      <button type="button" class="btn btn-ghost" data-action="go-home">Campanhas</button>
      <div class="toolbar-right">
        <button type="button" class="btn btn-ghost" data-action="edit-campaign" data-id="${esc(campaign.id)}">Editar</button>
        <button type="button" class="btn btn-primary" data-action="open-certificate" data-id="${esc(campaign.id)}" data-from="campaign">MVP</button>
        <button type="button" class="btn btn-ghost" data-action="reset-scores" data-id="${esc(campaign.id)}" ${canReset ? "" : "disabled"}>Zerar pontuação</button>
        <button type="button" class="btn btn-danger" data-action="delete-campaign" data-id="${esc(campaign.id)}">Excluir</button>
      </div>
    </div>
    <section class="hero">
      ${bannerVisual(campaign.banner, campaign.nome, "hero-media")}
      <div class="hero-scrim">
        <p class="kicker">Campanha</p>
        <h2>${esc(campaign.nome)}</h2>
      </div>
    </section>
    ${renderMvp(campaign.players)}
    <div class="board">
      <section>
        <div class="section-head">
          <div>
            <h3>Jogadores</h3>
            <p class="meta">${playerCountLabel(campaign.players.length)}</p>
          </div>
          <button type="button" class="btn btn-primary" data-action="new-player">Cadastrar jogador</button>
        </div>
        ${renderRankStrip(campaign.players, ui.selectedPlayerId)}
        ${players}
      </section>
      <div class="stack">
        ${renderActions(selected)}
        ${renderHistory(campaign)}
      </div>
    </div>
    </div>
  `);
}

function captureScroll() {
  const mesa = document.querySelector(".mesa");
  return {
    x: window.scrollX,
    y: window.scrollY,
    mesa: mesa ? mesa.scrollTop : 0,
  };
}

function applyScroll(position) {
  window.scrollTo(position.x, position.y);
  const mesa = document.querySelector(".mesa");
  if (mesa) mesa.scrollTop = position.mesa;
}

function certificateWhen(campaign) {
  const last = campaign.historico[0];
  const date = last ? new Date(last.quando) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

function renderCertificate(campaign) {
  const top = leaders(campaign.players);
  const when = certificateWhen(campaign);
  const copy = top.length
    ? `
      <p class="certificate-lead">${top.length > 1 ? "A Ordem reconhece, em conjunto, os agentes" : "A Ordem reconhece o agente"}</p>
      <p class="certificate-reason">${top.length > 1 ? "como destaques" : "como destaque"} da campanha <strong>${esc(campaign.nome)}</strong>.</p>
      ${when ? `<p class="certificate-foot">${esc(when)}</p>` : ""}
    `
    : `
      <p class="certificate-lead">Esta sessão ainda não tem um MVP.</p>
      <p class="certificate-reason">Registre as ações na campanha <strong>${esc(campaign.nome)}</strong> para emitir o certificado.</p>
    `;
  const honorees = top.length
    ? `
      <ul class="certificate-honorees">
        ${top.map((player) => `
          <li class="certificate-honoree">
            ${avatarHtml(player, "avatar-certificate")}
            <div>
              <h3>${esc(player.nome)}</h3>
              <p class="certificate-meta">${esc(player.classe)} · NEX ${player.nex}%</p>
              <p class="certificate-meta">${esc(player.patente)}</p>
              <p class="certificate-points">${player.pontos} pontos</p>
            </div>
          </li>
        `).join("")}
      </ul>
    `
    : "";

  return withNote(`
    <div class="certificate-page">
      <div class="toolbar">
        <button type="button" class="btn btn-ghost" data-action="close-certificate">Voltar</button>
      </div>
      <article class="certificate" aria-label="Certificado de MVP">
        <span class="cert-corner cert-corner-tl" aria-hidden="true"></span>
        <span class="cert-corner cert-corner-tr" aria-hidden="true"></span>
        <span class="cert-corner cert-corner-bl" aria-hidden="true"></span>
        <span class="cert-corner cert-corner-br" aria-hidden="true"></span>
        <header class="certificate-brand">
          <img class="certificate-seal" src="assets/logo.png" alt="">
          <div>
            <p class="kicker">Ordem Paranormal</p>
            <h2>Certificado de MVP</h2>
          </div>
        </header>
        <div class="certificate-rule" aria-hidden="true"></div>
        <div class="certificate-layout${top.length ? "" : " is-empty"}">
          <div class="certificate-copy">${copy}</div>
          ${honorees}
        </div>
      </article>
    </div>
  `);
}

function render(options = {}) {
  try {
    const flashId = ui.flashPlayerId;
    ui.flashPlayerId = null;
    const position = options.keepScroll ? captureScroll() : null;
    let campaign = null;
    if (ui.screen === "campaign" || ui.screen === "certificate") {
      campaign = currentCampaign();
      if (!campaign) {
        ui.screen = "home";
        ui.campaignId = null;
        ui.selectedPlayerId = null;
      }
    }
    const onCertificate = ui.screen === "certificate" && Boolean(campaign);
    document.body.classList.toggle("is-campaign", ui.screen === "campaign" && Boolean(campaign));
    document.body.classList.toggle("is-certificate", onCertificate);
    document.title = onCertificate
      ? `Certificado de MVP — ${campaign.nome}`
      : "Ordem Paranormal-MVP (OP-MVP)";
    app.innerHTML = onCertificate
      ? renderCertificate(campaign)
      : (ui.screen === "campaign" && campaign ? renderCampaign(campaign, flashId) : renderHome());
    if (position) {
      applyScroll(position);
      requestAnimationFrame(() => applyScroll(position));
    } else {
      window.scrollTo(0, 0);
    }
  } catch (err) {
    app.innerHTML = `<p class="form-error">Não foi possível abrir esta tela.</p>`;
    console.error(err);
  }
}

function clearPreviewUrl() {
  if (!previewUrl) return;
  URL.revokeObjectURL(previewUrl);
  previewUrl = null;
}

function openModal(html) {
  clearPreviewUrl();
  modalRoot.innerHTML = html;
  document.body.classList.add("modal-open");
  const field = modalRoot.querySelector("input, select, button");
  if (field) field.focus();
}

function closeModal() {
  clearPreviewUrl();
  modalRoot.innerHTML = "";
  document.body.classList.remove("modal-open");
}

function renderCampaignForm(campaign) {
  return `
    <div class="modal-backdrop">
      <form class="modal" id="campaign-form" data-id="${esc(campaign ? campaign.id : "")}" novalidate role="dialog" aria-modal="true" aria-labelledby="campaign-form-title">
        <h2 id="campaign-form-title">${campaign ? "Editar campanha" : "Nova campanha"}</h2>
        <label class="field">
          <span>Nome</span>
          <input name="nome" maxlength="80" value="${esc(campaign ? campaign.nome : "")}" autocomplete="off" spellcheck="false">
        </label>
        <label class="field">
          <span>Banner</span>
          <input name="banner" type="file" accept="image/*" data-preview="#banner-preview">
          <small>A imagem é reduzida antes de ser salva neste navegador.</small>
        </label>
        <div class="preview" id="banner-preview">${previewMarkup(campaign ? campaign.banner : "")}</div>
        <p class="form-error" role="alert"></p>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" data-action="close-modal">Cancelar</button>
          <button type="submit" class="btn btn-primary">Salvar campanha</button>
        </div>
      </form>
    </div>
  `;
}

function renderPlayerForm(player) {
  const classe = player ? player.classe : "";
  const patente = player ? player.patente : "";
  const classCustom = Boolean(classe && !CLASSES.includes(classe));
  const rankCustom = Boolean(patente && !RANKS.includes(patente));
  return `
    <div class="modal-backdrop">
      <form class="modal" id="player-form" data-player-id="${esc(player ? player.id : "")}" novalidate role="dialog" aria-modal="true" aria-labelledby="player-form-title">
        <h2 id="player-form-title">${player ? "Editar jogador" : "Cadastrar jogador"}</h2>
        <label class="field">
          <span>Token</span>
          <input name="token" type="file" accept="image/*" data-preview="#token-preview" data-preview-shape="token">
          <small>A imagem do token é reduzida antes de ser salva neste navegador.</small>
        </label>
        <div class="preview" id="token-preview">${previewMarkup(player ? player.token : "", true)}</div>
        <label class="field">
          <span>Nome</span>
          <input name="nome" maxlength="60" value="${esc(player ? player.nome : "")}" autocomplete="off" spellcheck="false" autocapitalize="words">
        </label>
        <label class="field">
          <span>Classe</span>
          <select name="classe" data-custom-target="#classe-custom">${optionsMarkup(CLASSES, classe)}</select>
        </label>
        <label class="field" id="classe-custom"${classCustom ? "" : " hidden"}>
          <span>Qual classe?</span>
          <input name="classeCustom" maxlength="40" value="${esc(classCustom ? classe : "")}" placeholder="Digite a classe" autocomplete="off">
        </label>
        <label class="field">
          <span>NEX %</span>
          <input name="nex" type="number" inputmode="numeric" min="0" max="99" step="1" value="${player ? player.nex : 0}">
        </label>
        <label class="field">
          <span>Patente</span>
          <select name="patente" data-custom-target="#patente-custom">${optionsMarkup(RANKS, patente)}</select>
        </label>
        <label class="field" id="patente-custom"${rankCustom ? "" : " hidden"}>
          <span>Qual patente?</span>
          <input name="patenteCustom" maxlength="40" value="${esc(rankCustom ? patente : "")}" placeholder="Digite a patente" autocomplete="off">
        </label>
        <p class="form-error" role="alert"></p>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" data-action="close-modal">Cancelar</button>
          <button type="submit" class="btn btn-primary">Salvar jogador</button>
        </div>
      </form>
    </div>
  `;
}

function openConfirm({ title, message, confirmLabel, action, id }) {
  openModal(`
    <div class="modal-backdrop">
      <div class="modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <h2 id="confirm-title">${esc(title)}</h2>
        <p>${esc(message)}</p>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" data-action="close-modal">Cancelar</button>
          <button type="button" class="btn btn-danger" data-action="${esc(action)}" data-id="${esc(id)}">${esc(confirmLabel)}</button>
        </div>
      </div>
    </div>
  `);
}

async function saveCampaign(form) {
  const submit = form.querySelector("[type=submit]");
  if (submit) submit.disabled = true;
  try {
    showError(form, "");
    const nome = cleanName(fieldValue(form, "nome"));
    if (!nome) {
      showError(form, "Dê um nome para a campanha.");
      return;
    }
    const existing = findCampaign(form.dataset.id || "");
    const file = fieldFile(form, "banner");
    if (!existing && !file) {
      showError(form, "Escolha a imagem de banner.");
      return;
    }
    if (file && file.size > 12 * 1024 * 1024) {
      showError(form, "Essa imagem é grande demais. Escolha um arquivo de até 12 MB.");
      return;
    }
    let banner = existing ? existing.banner : "";
    if (file) {
      try {
        banner = await readImage(file, 1280, { background: "#0c0b09" });
      } catch (err) {
        showError(form, "Não foi possível ler essa imagem. Use JPG, PNG ou WebP.");
        return;
      }
    }
    if (existing) {
      existing.nome = nome;
      existing.banner = banner;
    } else {
      state.campaigns.unshift({
        id: uid(),
        nome,
        banner,
        players: [],
        historico: [],
      });
    }
    if (!persist()) {
      render({ keepScroll: true });
      return;
    }
    closeModal();
    render({ keepScroll: Boolean(existing) });
  } finally {
    if (submit && submit.isConnected) submit.disabled = false;
  }
}

async function savePlayer(form) {
  const submit = form.querySelector("[type=submit]");
  if (submit) submit.disabled = true;
  try {
    const campaign = currentCampaign();
    if (!campaign) return;
    showError(form, "");
    const nome = cleanName(fieldValue(form, "nome"));
    if (!nome) {
      showError(form, "Dê um nome para o jogador.");
      return;
    }
    const classe = resolveChoice(fieldValue(form, "classe"), fieldValue(form, "classeCustom"), "Informe a classe.");
    if (classe.error) {
      showError(form, classe.error);
      return;
    }
    const patente = resolveChoice(fieldValue(form, "patente"), fieldValue(form, "patenteCustom"), "Informe a patente.");
    if (patente.error) {
      showError(form, patente.error);
      return;
    }
    const rawNex = fieldValue(form, "nex").trim();
    if (!/^\d+$/.test(rawNex) || Number(rawNex) > 99) {
      showError(form, "O NEX precisa ser um inteiro de 0 a 99.");
      return;
    }
    const existing = campaign.players.find((player) => player.id === (form.dataset.playerId || "")) || null;
    const file = fieldFile(form, "token");
    if (!existing && !file) {
      showError(form, "Escolha a imagem do token.");
      return;
    }
    if (file && file.size > 12 * 1024 * 1024) {
      showError(form, "Essa imagem é grande demais. Escolha um arquivo de até 12 MB.");
      return;
    }
    let token = existing ? existing.token : "";
    if (file) {
      try {
        token = await readImage(file, 320);
      } catch (err) {
        showError(form, "Não foi possível ler essa imagem. Use JPG, PNG ou WebP.");
        return;
      }
    }
    const next = {
      id: existing ? existing.id : uid(),
      nome,
      token,
      classe: classe.value,
      nex: Number(rawNex),
      patente: patente.value,
      pontos: existing ? existing.pontos : 0,
    };
    if (existing) {
      const index = campaign.players.findIndex((player) => player.id === existing.id);
      campaign.players[index] = next;
    } else {
      campaign.players.push(next);
    }
    if (!persist()) {
      render({ keepScroll: true });
      return;
    }
    closeModal();
    render({ keepScroll: true });
  } finally {
    if (submit && submit.isConnected) submit.disabled = false;
  }
}

function deleteCampaign(campaignId) {
  state.campaigns = state.campaigns.filter((campaign) => campaign.id !== campaignId);
  if (!persist()) {
    render({ keepScroll: true });
    return;
  }
  if (ui.campaignId === campaignId) {
    ui.screen = "home";
    ui.campaignId = null;
    ui.selectedPlayerId = null;
  }
  closeModal();
  render();
}

function deletePlayer(playerId) {
  const campaign = currentCampaign();
  if (!campaign) return;
  campaign.players = campaign.players.filter((player) => player.id !== playerId);
  campaign.historico = campaign.historico.filter((entry) => entry.jogador !== playerId);
  if (ui.selectedPlayerId === playerId) ui.selectedPlayerId = null;
  if (!persist()) {
    render({ keepScroll: true });
    return;
  }
  closeModal();
  render({ keepScroll: true });
}

function award(actionId) {
  const campaign = currentCampaign();
  const action = ACTIONS.find((item) => item.id === actionId);
  const player = campaign && campaign.players.find((item) => item.id === ui.selectedPlayerId);
  if (!campaign || !action || !player) return;
  player.pontos += action.points;
  campaign.historico.unshift({
    id: uid(),
    jogador: player.id,
    acao: action.label,
    pontos: action.points,
    quando: new Date().toISOString(),
  });
  if (!persist()) {
    render({ keepScroll: true });
    return;
  }
  ui.flashPlayerId = player.id;
  announce(`${player.nome} recebeu ${action.points} pontos: ${action.label}. Total: ${player.pontos}.`);
  render({ keepScroll: true });
}

function undo(entryId) {
  const campaign = currentCampaign();
  if (!campaign) return;
  const index = campaign.historico.findIndex((entry) => entry.id === entryId);
  if (index < 0) return;
  const [entry] = campaign.historico.splice(index, 1);
  const player = campaign.players.find((item) => item.id === entry.jogador);
  if (player) player.pontos = Math.max(0, player.pontos - entry.pontos);
  if (!persist()) {
    render({ keepScroll: true });
    return;
  }
  announce("Lançamento desfeito.");
  render({ keepScroll: true });
}

function resetSession(campaignId) {
  const campaign = findCampaign(campaignId);
  if (!campaign) return;
  campaign.players.forEach((player) => {
    player.pontos = 0;
  });
  campaign.historico = [];
  if (!persist()) {
    render({ keepScroll: true });
    return;
  }
  closeModal();
  announce("Pontuação da sessão zerada.");
  render({ keepScroll: true });
}

function onClick(event) {
  if (event.target instanceof HTMLElement && event.target.classList.contains("modal-backdrop")) {
    closeModal();
    return;
  }
  const el = event.target instanceof Element ? event.target.closest("[data-action]") : null;
  if (!el) return;
  const { action, id = "" } = el.dataset;
  switch (action) {
    case "close-modal":
      closeModal();
      break;
    case "go-home":
      ui.screen = "home";
      ui.campaignId = null;
      ui.selectedPlayerId = null;
      closeModal();
      render();
      break;
    case "new-campaign":
      openModal(renderCampaignForm(null));
      break;
    case "edit-campaign": {
      const campaign = findCampaign(id);
      if (campaign) openModal(renderCampaignForm(campaign));
      break;
    }
    case "open-certificate":
      ui.certificateFrom = el.dataset.from === "campaign" ? "campaign" : "home";
      ui.screen = "certificate";
      if (id) ui.campaignId = id;
      closeModal();
      render();
      break;
    case "close-certificate":
      if (ui.certificateFrom === "campaign") {
        ui.screen = "campaign";
      } else {
        ui.screen = "home";
        ui.campaignId = null;
        ui.selectedPlayerId = null;
      }
      render();
      break;
    case "open-campaign":
      ui.screen = "campaign";
      ui.campaignId = id;
      ui.selectedPlayerId = null;
      render();
      break;
    case "delete-campaign":
      openConfirm({
        title: "Excluir campanha?",
        message: "A campanha, os jogadores e a pontuação serão apagados deste navegador.",
        confirmLabel: "Excluir",
        action: "confirm-delete-campaign",
        id,
      });
      break;
    case "confirm-delete-campaign":
      deleteCampaign(id);
      break;
    case "new-player":
      if (currentCampaign()) openModal(renderPlayerForm(null));
      break;
    case "edit-player": {
      const campaign = currentCampaign();
      const player = campaign && campaign.players.find((item) => item.id === id);
      if (player) openModal(renderPlayerForm(player));
      break;
    }
    case "delete-player":
      openConfirm({
        title: "Remover jogador?",
        message: "O jogador e os pontos dele saem desta campanha.",
        confirmLabel: "Remover",
        action: "confirm-delete-player",
        id,
      });
      break;
    case "confirm-delete-player":
      deletePlayer(id);
      break;
    case "select-player":
      ui.selectedPlayerId = ui.selectedPlayerId === id ? null : id;
      render({ keepScroll: true });
      break;
    case "award":
      award(id);
      break;
    case "undo":
      undo(id);
      break;
    case "reset-scores":
      openConfirm({
        title: "Zerar pontuação?",
        message: "A pontuação e o histórico desta sessão serão apagados. Os jogadores continuam cadastrados.",
        confirmLabel: "Zerar pontuação",
        action: "confirm-reset",
        id,
      });
      break;
    case "confirm-reset":
      resetSession(id);
      break;
    default:
      break;
  }
}

function onSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  if (form.id === "campaign-form") {
    event.preventDefault();
    void saveCampaign(form);
  } else if (form.id === "player-form") {
    event.preventDefault();
    void savePlayer(form);
  }
}

function onChange(event) {
  const target = event.target;
  if (target instanceof HTMLSelectElement && target.dataset.customTarget) {
    const field = document.querySelector(target.dataset.customTarget);
    if (!field) return;
    const custom = target.value === "__outra__";
    field.hidden = !custom;
    if (custom) {
      const input = field.querySelector("input");
      if (input) input.focus();
    }
    return;
  }
  if (!(target instanceof HTMLInputElement) || !target.dataset.preview) return;
  const box = document.querySelector(target.dataset.preview);
  const file = target.files && target.files[0];
  clearPreviewUrl();
  if (!file || !box) return;
  previewUrl = URL.createObjectURL(file);
  box.innerHTML = previewMarkup(previewUrl, target.dataset.previewShape === "token");
}

function onKeydown(event) {
  if (event.key === "Escape" && modalRoot.innerHTML) {
    event.preventDefault();
    closeModal();
    return;
  }
  if (event.key !== "Enter" && event.key !== " ") return;
  if (event.target instanceof HTMLElement && event.target.matches("[role=button][data-action]")) {
    event.preventDefault();
    event.target.click();
  }
}

document.addEventListener("mousedown", (event) => {
  const card = event.target instanceof Element ? event.target.closest("[data-action='select-player']") : null;
  if (card) event.preventDefault();
}, true);
document.addEventListener("click", onClick);
document.addEventListener("submit", onSubmit);
document.addEventListener("change", onChange);
document.addEventListener("keydown", onKeydown);
render();
