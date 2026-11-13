(() => {
  const STORAGE_KEY = "op-mvp-fichas";

  const ATTR_KEYS = ["agi", "for", "int", "pre", "vig"];
  const ATTR_LABELS = { agi: "AGI", for: "FOR", int: "INT", pre: "PRE", vig: "VIG" };
  const ATTR_NAMES = {
    agi: "Agilidade",
    for: "Força",
    int: "Intelecto",
    pre: "Presença",
    vig: "Vigor",
  };

  const CIRCULOS = ["I", "II", "III", "IV"];
  const ELEMENTOS = ["Sangue", "Morte", "Energia", "Conhecimento", "Medo", "Outro"];

  const PERICIAS_BASE = [
    { id: "acrobacia", nome: "Acrobacia", attr: "agi", soTreinada: false },
    { id: "adestramento", nome: "Adestramento", attr: "pre", soTreinada: true },
    { id: "artes", nome: "Artes", attr: "pre", soTreinada: true },
    { id: "atletismo", nome: "Atletismo", attr: "for", soTreinada: false },
    { id: "atualidades", nome: "Atualidades", attr: "int", soTreinada: false },
    { id: "ciencias", nome: "Ciências", attr: "int", soTreinada: true },
    { id: "crime", nome: "Crime", attr: "agi", soTreinada: true },
    { id: "diplomacia", nome: "Diplomacia", attr: "pre", soTreinada: false },
    { id: "enganacao", nome: "Enganação", attr: "pre", soTreinada: false },
    { id: "fortitude", nome: "Fortitude", attr: "vig", soTreinada: false },
    { id: "furtividade", nome: "Furtividade", attr: "agi", soTreinada: false },
    { id: "iniciativa", nome: "Iniciativa", attr: "agi", soTreinada: false },
    { id: "intimidacao", nome: "Intimidação", attr: "pre", soTreinada: false },
    { id: "intuicao", nome: "Intuição", attr: "pre", soTreinada: false },
    { id: "investigacao", nome: "Investigação", attr: "int", soTreinada: false },
    { id: "luta", nome: "Luta", attr: "for", soTreinada: false },
    { id: "medicina", nome: "Medicina", attr: "int", soTreinada: false },
    { id: "ocultismo", nome: "Ocultismo", attr: "int", soTreinada: true },
    { id: "percepcao", nome: "Percepção", attr: "pre", soTreinada: false },
    { id: "pilotagem", nome: "Pilotagem", attr: "agi", soTreinada: true },
    { id: "pontaria", nome: "Pontaria", attr: "agi", soTreinada: false },
    { id: "profissao", nome: "Profissão", attr: "int", soTreinada: true },
    { id: "reflexos", nome: "Reflexos", attr: "agi", soTreinada: false },
    { id: "religiao", nome: "Religião", attr: "pre", soTreinada: true },
    { id: "sobrevivencia", nome: "Sobrevivência", attr: "int", soTreinada: false },
    { id: "tatica", nome: "Tática", attr: "int", soTreinada: true },
    { id: "tecnologia", nome: "Tecnologia", attr: "int", soTreinada: true },
    { id: "vontade", nome: "Vontade", attr: "pre", soTreinada: false },
  ];

  const sheetUi = {
    tab: "combate",
    periciasFiltro: "todas",
    ritualFiltroCirculo: "todos",
    ritualFiltroElemento: "todos",
    ritualBusca: "",
  };

  const sheetsState = { sheets: readSheets() };

  function op() {
    return window.OP || {};
  }

  function esc(value) {
    return op().esc ? op().esc(value) : String(value ?? "");
  }

  function uid() {
    return op().uid ? op().uid() : `op-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function cleanName(value) {
    return op().cleanName ? op().cleanName(value) : String(value || "").replace(/\s+/g, " ").trim();
  }

  function imgSrc(src) {
    return op().imgSrc ? op().imgSrc(src) : "";
  }

  function initials(name) {
    return op().initials ? op().initials(name) : "OP";
  }

  function clampInt(value, min, max, fallback = 0) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, Math.round(number)));
  }

  function treinoBonus(treino) {
    return [0, 5, 10, 15][clampInt(treino, 0, 3, 0)] || 0;
  }

  function normalizePericia(raw, base) {
    const source = raw || {};
    return {
      id: base.id,
      nome: base.nome,
      attr: base.attr,
      soTreinada: base.soTreinada,
      treino: clampInt(source.treino, 0, 3, 0),
      outros: clampInt(source.outros, -99, 99, 0),
      especial: String(source.especial || ""),
    };
  }

  function defaultPericias(list) {
    const map = new Map((Array.isArray(list) ? list : []).map((item) => [item.id, item]));
    return PERICIAS_BASE.map((base) => normalizePericia(map.get(base.id), base));
  }

  function normalizeBond(raw) {
    const source = raw || {};
    return {
      id: String(source.id || uid()),
      nome: String(source.nome || "Personagem"),
      foto: typeof source.foto === "string" ? source.foto : "",
      nivel: clampInt(source.nivel, 0, 3, 0),
    };
  }

  function normalizeAtaque(raw) {
    const source = raw || {};
    return {
      id: String(source.id || uid()),
      nome: String(source.nome || "Ataque"),
      teste: String(source.teste || ""),
      dano: String(source.dano || ""),
      critico: String(source.critico || ""),
      especial: String(source.especial || ""),
    };
  }

  function normalizeHabilidade(raw) {
    const source = raw || {};
    return {
      id: String(source.id || uid()),
      nome: String(source.nome || "Habilidade"),
      descricao: String(source.descricao || ""),
    };
  }

  function normalizeRitual(raw) {
    const source = raw || {};
    const circulo = String(source.circulo || "I").toUpperCase();
    return {
      id: String(source.id || uid()),
      nome: String(source.nome || "Ritual"),
      circulo: CIRCULOS.includes(circulo) ? circulo : "I",
      elemento: String(source.elemento || "Outro"),
      custo: String(source.custo || ""),
      dt: String(source.dt || ""),
      efeito: String(source.efeito || ""),
      dados: String(source.dados || ""),
      pagina: String(source.pagina || ""),
    };
  }

  function normalizeItem(raw) {
    const source = raw || {};
    return {
      id: String(source.id || uid()),
      nome: String(source.nome || "Item"),
      categoria: String(source.categoria || ""),
      espacos: clampInt(source.espacos, 0, 99, 0),
      descricao: String(source.descricao || ""),
    };
  }

  function createEmptySheet(partial = {}) {
    return normalizeSheet({
      id: uid(),
      nome: "Novo Personagem",
      jogador: "",
      origem: "",
      classe: "Combatente",
      trilha: "",
      nex: 5,
      patente: "Recruta",
      imagem: "",
      atributos: { agi: 1, for: 1, int: 1, pre: 1, vig: 1 },
      pv: 10,
      pvMax: 10,
      san: 10,
      sanMax: 10,
      pe: 5,
      peMax: 5,
      peRodada: 1,
      defesa: 10,
      deslocamento: 9,
      pericias: defaultPericias(),
      ataques: [],
      habilidades: [],
      rituais: [],
      inventario: [],
      cargaMax: 5,
      credito: 0,
      prestigio: 0,
      dtRitual: "",
      relacoes: [],
      vinculos: [],
      aparencia: "",
      personalidade: "",
      historico: "",
      objetivo: "",
      ...partial,
    });
  }

  function seedXimira() {
    return createEmptySheet({
      nome: "Ximira",
      jogador: "Exemplo",
      origem: "Acadêmico",
      classe: "Ocultista",
      trilha: "Graduado",
      nex: 15,
      patente: "Operador",
      atributos: { agi: 2, for: 1, int: 3, pre: 2, vig: 2 },
      pv: 16,
      pvMax: 16,
      san: 20,
      sanMax: 20,
      pe: 12,
      peMax: 12,
      peRodada: 3,
      defesa: 12,
      deslocamento: 9,
      pericias: defaultPericias([
        { id: "investigacao", treino: 1 },
        { id: "medicina", treino: 1 },
        { id: "ocultismo", treino: 2 },
        { id: "ciencias", treino: 1 },
        { id: "vontade", treino: 1 },
        { id: "percepcao", treino: 1 },
      ]),
      ataques: [
        {
          id: uid(),
          nome: "Adaga ritualística",
          teste: "Luta",
          dano: "1d4",
          critico: "19-20 / x2",
          especial: "Arma leve",
        },
      ],
      habilidades: [
        {
          id: uid(),
          nome: "Esotérico",
          descricao: "Pode aprender e conjurar rituais conforme a classe e o NEX.",
        },
      ],
      rituais: [
        {
          id: uid(),
          nome: "Cicatrização",
          circulo: "I",
          elemento: "Sangue",
          custo: "1 PE",
          dt: "15",
          dados: "1d8+1",
          efeito: "Cura ferimentos leves no alvo tocado.",
          pagina: "",
        },
        {
          id: uid(),
          nome: "Eletrocussão",
          circulo: "II",
          elemento: "Energia",
          custo: "2 PE",
          dt: "18",
          dados: "3d8+3",
          efeito: "Dispara uma descarga elétrica no alvo.",
          pagina: "",
        },
      ],
      inventario: [
        { id: uid(), nome: "Kit médico", categoria: "Equipamento", espacos: 1, descricao: "" },
        { id: uid(), nome: "Grimório", categoria: "Esotérico", espacos: 1, descricao: "Anotações de rituais." },
      ],
      cargaMax: 5,
      credito: 2,
      prestigio: 1,
      dtRitual: "15",
      relacoes: [
        { id: uid(), nome: "Agente Cruz", foto: "", nivel: 2 },
        { id: uid(), nome: "Helena", foto: "", nivel: 1 },
      ],
      vinculos: [
        { id: uid(), nome: "Agente Cruz", foto: "", nivel: 1 },
      ],
      aparencia: "Cabelo escuro, olhar atento, jaqueta com símbolos discretos.",
      personalidade: "Curiosa, metódica e cautelosa com o Outro Lado.",
      historico: "Ficha de exemplo para demonstrar o módulo de fichas do OP-MVP.",
      objetivo: "Catalogar manifestações e proteger a equipe.",
    });
  }

  function normalizeSheet(raw) {
    const source = raw || {};
    const attrs = source.atributos || {};
    const atributos = {};
    ATTR_KEYS.forEach((key) => {
      atributos[key] = clampInt(attrs[key] ?? source[key], 0, 5, 1);
    });
    return {
      id: String(source.id || uid()),
      nome: String(source.nome || "Personagem"),
      jogador: String(source.jogador || ""),
      origem: String(source.origem || ""),
      classe: String(source.classe || ""),
      trilha: String(source.trilha || ""),
      nex: clampInt(source.nex, 0, 99, 0),
      patente: String(source.patente || ""),
      imagem: typeof source.imagem === "string" ? source.imagem : "",
      atributos,
      pv: clampInt(source.pv, 0, 9999, 0),
      pvMax: clampInt(source.pvMax, 0, 9999, 0),
      san: clampInt(source.san, 0, 9999, 0),
      sanMax: clampInt(source.sanMax, 0, 9999, 0),
      pe: clampInt(source.pe, 0, 9999, 0),
      peMax: clampInt(source.peMax, 0, 9999, 0),
      peRodada: clampInt(source.peRodada, 0, 99, 0),
      defesa: clampInt(source.defesa, 0, 99, 10),
      deslocamento: clampInt(source.deslocamento, 0, 99, 9),
      pericias: defaultPericias(source.pericias),
      ataques: Array.isArray(source.ataques) ? source.ataques.map(normalizeAtaque) : [],
      habilidades: Array.isArray(source.habilidades) ? source.habilidades.map(normalizeHabilidade) : [],
      rituais: Array.isArray(source.rituais) ? source.rituais.map(normalizeRitual) : [],
      inventario: Array.isArray(source.inventario) ? source.inventario.map(normalizeItem) : [],
      cargaMax: clampInt(source.cargaMax, 0, 99, 5),
      credito: clampInt(source.credito, 0, 99, 0),
      prestigio: clampInt(source.prestigio, 0, 99, 0),
      dtRitual: String(source.dtRitual || ""),
      relacoes: Array.isArray(source.relacoes) ? source.relacoes.map(normalizeBond) : [],
      vinculos: Array.isArray(source.vinculos) ? source.vinculos.map(normalizeBond) : [],
      aparencia: String(source.aparencia || ""),
      personalidade: String(source.personalidade || ""),
      historico: String(source.historico || ""),
      objetivo: String(source.objetivo || ""),
    };
  }

  function readSheets() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const seeded = [seedXimira()];
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, sheets: seeded }));
        return seeded;
      }
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.sheets)) return [];
      return data.sheets.map(normalizeSheet);
    } catch (err) {
      return [seedXimira()];
    }
  }

  function persistSheets() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, sheets: sheetsState.sheets }));
      return true;
    } catch (err) {
      sheetsState.sheets = readSheets();
      window.alert("Não foi possível salvar as fichas neste navegador. O espaço para imagens pode ter acabado.");
      return false;
    }
  }

  function findSheet(id) {
    return sheetsState.sheets.find((sheet) => sheet.id === id) || null;
  }

  function currentSheet() {
    const ui = op().ui;
    return ui ? findSheet(ui.sheetId) : null;
  }

  function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  function slugName(name) {
    return cleanName(name).toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "ficha";
  }

  function portraitHtml(sheet, className) {
    const safe = imgSrc(sheet.imagem);
    if (safe) return `<img class="${className}" alt="" decoding="async" src="${safe}">`;
    return `<div class="${className} sheet-portrait-fallback" aria-hidden="true">${esc(initials(sheet.nome))}</div>`;
  }

  function bondPhotoHtml(bond) {
    const safe = imgSrc(bond.foto);
    if (safe) return `<img class="bond-photo" alt="" decoding="async" src="${safe}">`;
    return `<div class="bond-photo bond-photo-fallback" aria-hidden="true">${esc(initials(bond.nome))}</div>`;
  }

  function heartsHtml(nivel, list, bondId) {
    return [1, 2, 3].map((level) => {
      const filled = nivel >= level;
      return `
        <button
          type="button"
          class="heart-btn${filled ? " is-filled" : ""}"
          data-action="sheet-set-heart"
          data-list="${esc(list)}"
          data-id="${esc(bondId)}"
          data-level="${level}"
          aria-label="${level} ${level === 1 ? "coração" : "corações"}"
          aria-pressed="${filled ? "true" : "false"}"
        >♥</button>
      `;
    }).join("");
  }

  function withSheetNote(content) {
    return `${content}<p class="save-note">Fichas salvas neste navegador. Use exportar JSON para levar a outro dispositivo.</p>`;
  }

  function renderSheetsList() {
    const cards = sheetsState.sheets.length
      ? `<div class="campaign-grid">${sheetsState.sheets.map(renderSheetCard).join("")}</div>`
      : `<div class="empty"><h3>Nenhuma ficha ainda</h3><p>Crie a primeira ou importe um JSON.</p></div>`;

    return withSheetNote(`
      <div class="page-head">
        <div>
          <button type="button" class="btn btn-ghost" data-action="go-hub">Início</button>
          <p class="kicker">Ordem Paranormal</p>
          <h2>Fichas</h2>
          <p class="lede">Selecione um personagem para abrir a ficha completa, editar recursos e relacionamentos.</p>
        </div>
        <div class="inline-actions">
          <button type="button" class="btn btn-ghost" data-action="sheet-import">Importar JSON</button>
          <button type="button" class="btn btn-ghost" data-action="sheet-export-all">Exportar todas</button>
          <button type="button" class="btn btn-primary" data-action="sheet-new">Nova ficha</button>
          <input id="sheet-import-input" class="sr-file" type="file" accept="application/json,.json" hidden>
        </div>
      </div>
      ${cards}
    `);
  }

  function renderSheetCard(sheet) {
    return `
      <article class="campaign-card sheet-card">
        <div class="card-open" role="button" tabindex="0" data-action="open-sheet" data-id="${esc(sheet.id)}">
          ${portraitHtml(sheet, "card-media sheet-card-media")}
          <div class="card-copy">
            <h3>${esc(sheet.nome)}</h3>
            <p>${esc(sheet.classe || "Sem classe")} · NEX ${sheet.nex}%</p>
            <p>${esc(sheet.jogador ? `Jogador: ${sheet.jogador}` : "Sem jogador")}</p>
          </div>
        </div>
        <div class="card-actions">
          <button type="button" class="btn btn-primary btn-small" data-action="open-sheet" data-id="${esc(sheet.id)}">Abrir</button>
          <button type="button" class="btn btn-ghost btn-small" data-action="sheet-export-one" data-id="${esc(sheet.id)}">Exportar</button>
          <button type="button" class="btn btn-danger btn-small" data-action="sheet-delete" data-id="${esc(sheet.id)}">Excluir</button>
        </div>
      </article>
    `;
  }

  function attrNodes(sheet) {
    const order = [
      { key: "for", style: "top" },
      { key: "agi", style: "left" },
      { key: "int", style: "right" },
      { key: "pre", style: "bottom-left" },
      { key: "vig", style: "bottom-right" },
    ];
    return order.map(({ key, style }) => `
      <label class="attr-node attr-${style}">
        <span class="attr-label">${ATTR_LABELS[key]}</span>
        <input
          class="attr-input"
          type="number"
          inputmode="numeric"
          min="0"
          max="5"
          data-sheet-field="atributos.${key}"
          value="${sheet.atributos[key]}"
        >
        <span class="attr-name">${ATTR_NAMES[key]}</span>
      </label>
    `).join("");
  }

  function resourceBar(label, kind, current, max, colorClass) {
    const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
    return `
      <div class="resource-bar ${colorClass}">
        <div class="resource-head">
          <strong>${esc(label)}</strong>
          <div class="resource-controls">
            <button type="button" class="btn btn-ghost btn-small" data-action="sheet-resource" data-kind="${kind}" data-delta="-1">−</button>
            <input type="number" inputmode="numeric" min="0" max="9999" data-sheet-field="${kind}" value="${current}" class="resource-now">
            <span>/</span>
            <input type="number" inputmode="numeric" min="0" max="9999" data-sheet-field="${kind}Max" value="${max}" class="resource-max">
            <button type="button" class="btn btn-ghost btn-small" data-action="sheet-resource" data-kind="${kind}" data-delta="1">+</button>
          </div>
        </div>
        <div class="resource-track" aria-hidden="true"><span style="width:${pct}%"></span></div>
      </div>
    `;
  }

  function periciaTotal(sheet, pericia) {
    return treinoBonus(pericia.treino) + pericia.outros;
  }

  function renderPericias(sheet) {
    const filtered = sheet.pericias.filter((pericia) => {
      if (sheetUi.periciasFiltro === "treinadas") return pericia.treino > 0;
      return true;
    });
    const rows = filtered.map((pericia) => {
      const pips = [1, 2, 3].map((level) => `
        <button
          type="button"
          class="pip${pericia.treino >= level ? " is-on" : ""}"
          data-action="sheet-treino"
          data-id="${esc(pericia.id)}"
          data-level="${level}"
          aria-label="Treino ${level}"
        ></button>
      `).join("");
      return `
        <div class="pericia-row">
          <span class="pericia-name">${esc(pericia.nome)}${pericia.soTreinada ? "*" : ""}</span>
          <div class="pericia-pips">${pips}</div>
          <span class="pericia-attr">${ATTR_LABELS[pericia.attr]}</span>
          <input class="pericia-outros" type="number" inputmode="numeric" data-sheet-field="pericia.${pericia.id}.outros" value="${pericia.outros}">
          <strong class="pericia-total">${periciaTotal(sheet, pericia)}</strong>
        </div>
      `;
    }).join("");

    return `
      <section class="sheet-panel pericias-panel">
        <div class="sheet-tabs pericia-tabs">
          <button type="button" class="sheet-tab${sheetUi.periciasFiltro === "todas" ? " is-active" : ""}" data-action="sheet-pericias-filtro" data-id="todas">Todas as perícias</button>
          <button type="button" class="sheet-tab${sheetUi.periciasFiltro === "treinadas" ? " is-active" : ""}" data-action="sheet-pericias-filtro" data-id="treinadas">Apenas treinadas</button>
        </div>
        <div class="pericia-head">
          <span>Perícia</span>
          <span>Treino</span>
          <span>Dado</span>
          <span>Bônus</span>
          <span>Total</span>
        </div>
        <div class="pericia-list">${rows || `<p class="hint">Nenhuma perícia treinada.</p>`}</div>
      </section>
    `;
  }

  function renderAtaques(sheet) {
    const rows = sheet.ataques.map((ataque) => `
      <article class="entry-card">
        <div class="entry-grid">
          <label class="field"><span>Nome</span><input data-sheet-field="ataque.${ataque.id}.nome" value="${esc(ataque.nome)}"></label>
          <label class="field"><span>Teste</span><input data-sheet-field="ataque.${ataque.id}.teste" value="${esc(ataque.teste)}"></label>
          <label class="field"><span>Dano</span><input data-sheet-field="ataque.${ataque.id}.dano" value="${esc(ataque.dano)}"></label>
          <label class="field"><span>Crítico</span><input data-sheet-field="ataque.${ataque.id}.critico" value="${esc(ataque.critico)}"></label>
          <label class="field field-span"><span>Especial</span><input data-sheet-field="ataque.${ataque.id}.especial" value="${esc(ataque.especial)}"></label>
        </div>
        <button type="button" class="btn btn-danger btn-small" data-action="sheet-remove-ataque" data-id="${esc(ataque.id)}">Remover</button>
      </article>
    `).join("");
    return `
      <div class="tab-toolbar">
        <button type="button" class="btn btn-primary btn-small" data-action="sheet-add-ataque">Adicionar ataque</button>
      </div>
      <div class="entry-list">${rows || `<div class="empty"><p>Nenhum ataque cadastrado.</p></div>`}</div>
    `;
  }

  function renderHabilidades(sheet) {
    const rows = sheet.habilidades.map((hab) => `
      <article class="entry-card">
        <label class="field"><span>Nome</span><input data-sheet-field="habilidade.${hab.id}.nome" value="${esc(hab.nome)}"></label>
        <label class="field"><span>Descrição</span><textarea rows="3" data-sheet-field="habilidade.${hab.id}.descricao">${esc(hab.descricao)}</textarea></label>
        <button type="button" class="btn btn-danger btn-small" data-action="sheet-remove-habilidade" data-id="${esc(hab.id)}">Remover</button>
      </article>
    `).join("");
    return `
      <div class="tab-toolbar">
        <button type="button" class="btn btn-primary btn-small" data-action="sheet-add-habilidade">Adicionar habilidade</button>
      </div>
      <div class="entry-list">${rows || `<div class="empty"><p>Nenhuma habilidade cadastrada.</p></div>`}</div>
    `;
  }

  function renderRituais(sheet) {
    const busca = sheetUi.ritualBusca.trim().toLowerCase();
    const filtered = sheet.rituais.filter((ritual) => {
      if (sheetUi.ritualFiltroCirculo !== "todos" && ritual.circulo !== sheetUi.ritualFiltroCirculo) return false;
      if (sheetUi.ritualFiltroElemento !== "todos" && ritual.elemento !== sheetUi.ritualFiltroElemento) return false;
      if (busca && !ritual.nome.toLowerCase().includes(busca)) return false;
      return true;
    });
    const cards = filtered.map((ritual) => `
      <article class="ritual-card elemento-${esc(ritual.elemento.toLowerCase())}">
        <div class="ritual-top">
          <input class="ritual-name" data-sheet-field="ritual.${ritual.id}.nome" value="${esc(ritual.nome)}">
          <span class="ritual-badge">${esc(ritual.circulo)}</span>
        </div>
        <div class="entry-grid ritual-grid">
          <label class="field"><span>Elemento</span>
            <select data-sheet-field="ritual.${ritual.id}.elemento">
              ${ELEMENTOS.map((el) => `<option value="${esc(el)}"${ritual.elemento === el ? " selected" : ""}>${esc(el)}</option>`).join("")}
            </select>
          </label>
          <label class="field"><span>Círculo</span>
            <select data-sheet-field="ritual.${ritual.id}.circulo">
              ${CIRCULOS.map((c) => `<option value="${c}"${ritual.circulo === c ? " selected" : ""}>${c}</option>`).join("")}
            </select>
          </label>
          <label class="field"><span>Custo</span><input data-sheet-field="ritual.${ritual.id}.custo" value="${esc(ritual.custo)}"></label>
          <label class="field"><span>DT</span><input data-sheet-field="ritual.${ritual.id}.dt" value="${esc(ritual.dt)}"></label>
          <label class="field"><span>Dados</span><input data-sheet-field="ritual.${ritual.id}.dados" value="${esc(ritual.dados)}"></label>
          <label class="field field-span"><span>Efeito</span><textarea rows="2" data-sheet-field="ritual.${ritual.id}.efeito">${esc(ritual.efeito)}</textarea></label>
        </div>
        <button type="button" class="btn btn-danger btn-small" data-action="sheet-remove-ritual" data-id="${esc(ritual.id)}">Remover</button>
      </article>
    `).join("");

    return `
      <div class="tab-toolbar ritual-toolbar">
        <label class="field dt-field">
          <span>DT do Ritual</span>
          <input data-sheet-field="dtRitual" value="${esc(sheet.dtRitual)}" placeholder="—">
        </label>
        <input class="search-input" type="search" placeholder="Buscar ritual" value="${esc(sheetUi.ritualBusca)}" data-action-input="sheet-ritual-busca">
        <button type="button" class="btn btn-primary btn-small" data-action="sheet-add-ritual">Adicionar ritual</button>
      </div>
      <div class="filter-row">
        <button type="button" class="chip${sheetUi.ritualFiltroCirculo === "todos" ? " is-active" : ""}" data-action="sheet-ritual-circulo" data-id="todos">Todos</button>
        ${CIRCULOS.map((c) => `<button type="button" class="chip${sheetUi.ritualFiltroCirculo === c ? " is-active" : ""}" data-action="sheet-ritual-circulo" data-id="${c}">${c}</button>`).join("")}
        <span class="filter-sep"></span>
        <button type="button" class="chip${sheetUi.ritualFiltroElemento === "todos" ? " is-active" : ""}" data-action="sheet-ritual-elemento" data-id="todos">Todos</button>
        ${ELEMENTOS.map((el) => `<button type="button" class="chip${sheetUi.ritualFiltroElemento === el ? " is-active" : ""}" data-action="sheet-ritual-elemento" data-id="${esc(el)}">${esc(el)}</button>`).join("")}
      </div>
      <div class="entry-list">${cards || `<div class="empty"><p>Nenhum ritual encontrado.</p></div>`}</div>
    `;
  }

  function renderInventario(sheet) {
    const carga = sheet.inventario.reduce((sum, item) => sum + item.espacos, 0);
    const rows = sheet.inventario.map((item) => `
      <article class="entry-card">
        <div class="entry-grid">
          <label class="field"><span>Item</span><input data-sheet-field="item.${item.id}.nome" value="${esc(item.nome)}"></label>
          <label class="field"><span>Categoria</span><input data-sheet-field="item.${item.id}.categoria" value="${esc(item.categoria)}"></label>
          <label class="field"><span>Espaços</span><input type="number" inputmode="numeric" min="0" data-sheet-field="item.${item.id}.espacos" value="${item.espacos}"></label>
          <label class="field field-span"><span>Descrição</span><input data-sheet-field="item.${item.id}.descricao" value="${esc(item.descricao)}"></label>
        </div>
        <button type="button" class="btn btn-danger btn-small" data-action="sheet-remove-item" data-id="${esc(item.id)}">Remover</button>
      </article>
    `).join("");
    return `
      <div class="inv-meta entry-grid">
        <label class="field"><span>Carga</span><input type="text" readonly value="${carga} / ${sheet.cargaMax}"></label>
        <label class="field"><span>Carga máx.</span><input type="number" min="0" data-sheet-field="cargaMax" value="${sheet.cargaMax}"></label>
        <label class="field"><span>Crédito</span><input type="number" min="0" data-sheet-field="credito" value="${sheet.credito}"></label>
        <label class="field"><span>Prestígio</span><input type="number" min="0" data-sheet-field="prestigio" value="${sheet.prestigio}"></label>
      </div>
      <div class="tab-toolbar">
        <button type="button" class="btn btn-primary btn-small" data-action="sheet-add-item">Adicionar item</button>
      </div>
      <div class="entry-list">${rows || `<div class="empty"><p>Inventário vazio.</p></div>`}</div>
    `;
  }

  function renderBondSection(title, subtitle, listKey, bonds) {
    const cards = bonds.map((bond) => `
      <article class="bond-card">
        ${bondPhotoHtml(bond)}
        <div class="bond-body">
          <input class="bond-name" data-sheet-field="bond.${listKey}.${bond.id}.nome" value="${esc(bond.nome)}">
          <div class="hearts">${heartsHtml(bond.nivel, listKey, bond.id)}</div>
          <div class="bond-actions">
            <label class="btn btn-ghost btn-small bond-photo-btn">
              Foto
              <input type="file" accept="image/*" hidden data-action-file="sheet-bond-photo" data-list="${esc(listKey)}" data-id="${esc(bond.id)}">
            </label>
            <button type="button" class="btn btn-danger btn-small" data-action="sheet-remove-bond" data-list="${esc(listKey)}" data-id="${esc(bond.id)}">Remover</button>
          </div>
        </div>
      </article>
    `).join("");

    return `
      <section class="bond-section">
        <header class="bond-section-head">
          <h3>${esc(title)}</h3>
          <p>${esc(subtitle)}</p>
          <button type="button" class="btn btn-primary btn-small" data-action="sheet-add-bond" data-list="${esc(listKey)}">Cadastrar</button>
        </header>
        <div class="bond-grid">${cards || `<div class="empty"><p>Nenhum personagem nesta lista.</p></div>`}</div>
      </section>
    `;
  }

  function renderRelacionamentos(sheet) {
    return `
      <div class="relationships">
        ${renderBondSection("Pontos de Relação", "O que você pensa de outros", "relacoes", sheet.relacoes)}
        ${renderBondSection("Vínculos Conquistados", "O que outros pensam de você", "vinculos", sheet.vinculos)}
      </div>
    `;
  }

  function renderNotas(sheet) {
    return `
      <div class="entry-list notes-grid">
        <label class="field"><span>Aparência</span><textarea rows="3" data-sheet-field="aparencia">${esc(sheet.aparencia)}</textarea></label>
        <label class="field"><span>Personalidade</span><textarea rows="3" data-sheet-field="personalidade">${esc(sheet.personalidade)}</textarea></label>
        <label class="field"><span>Histórico</span><textarea rows="3" data-sheet-field="historico">${esc(sheet.historico)}</textarea></label>
        <label class="field"><span>Objetivo</span><textarea rows="3" data-sheet-field="objetivo">${esc(sheet.objetivo)}</textarea></label>
      </div>
    `;
  }

  function findPericia(sheet, id) {
    return sheet.pericias.find((item) => item.id === id) || null;
  }

  function periciaBonusLabel(sheet, id) {
    const pericia = findPericia(sheet, id);
    if (!pericia) return "—";
    if (pericia.treino <= 0) return "não treinada";
    const bonus = periciaTotal(sheet, pericia);
    const nivel = ["", "Treinado", "Veterano", "Expert"][pericia.treino] || "Treinado";
    return `${nivel} · bônus +${bonus}`;
  }

  function renderAjuda(sheet) {
    const reflexos = findPericia(sheet, "reflexos");
    const fortitude = findPericia(sheet, "fortitude");
    const luta = findPericia(sheet, "luta");
    const defesaEsquiva = sheet.defesa + (reflexos && reflexos.treino > 0 ? periciaTotal(sheet, reflexos) : 0);
    const rdBloqueio = fortitude && fortitude.treino > 0 ? periciaTotal(sheet, fortitude) : 0;

    return `
      <div class="help-panel">
        <p class="help-intro">Resumo das <strong>Ações Especiais de Defesa</strong> (livro básico, combate). Quando alguém te ataca, você pode gastar <strong>1 reação por rodada</strong> e declarar a reação <strong>antes</strong> do inimigo rolar o teste de ataque.</p>

        <article class="help-card">
          <h3>Defesa</h3>
          <p>É o número que o atacante precisa igualar ou superar no teste de ataque para te acertar.</p>
          <ul>
            <li>Fórmula base: <strong>10 + Agilidade + proteções + outros bônus</strong>.</li>
            <li>Se o teste de ataque for menor que a Defesa, o golpe erra.</li>
            <li>Sua Defesa atual nesta ficha: <strong>${sheet.defesa}</strong>.</li>
          </ul>
        </article>

        <article class="help-card">
          <h3>Esquiva</h3>
          <p>Requer ser <strong>treinado em Reflexos</strong>. Serve contra <strong>qualquer ataque</strong> (corpo a corpo ou à distância).</p>
          <ul>
            <li>Efeito: some o <strong>bônus de Reflexos</strong> à sua Defesa <em>só contra aquele ataque</em>.</li>
            <li>Se mesmo assim o inimigo acertar, a reação já foi gasta.</li>
            <li>Nesta ficha: Reflexos ${esc(periciaBonusLabel(sheet, "reflexos"))}${reflexos && reflexos.treino > 0 ? ` → Defesa ao esquivar: <strong>${defesaEsquiva}</strong>` : ""}.</li>
          </ul>
        </article>

        <article class="help-card">
          <h3>Bloqueio</h3>
          <p>Requer ser <strong>treinado em Fortitude</strong>. Só contra ataques <strong>corpo a corpo</strong>.</p>
          <ul>
            <li>A Defesa continua a mesma.</li>
            <li>Se o ataque acertar, você recebe <strong>redução de dano</strong> igual ao bônus de Fortitude (pode zerar o dano).</li>
            <li>Nesta ficha: Fortitude ${esc(periciaBonusLabel(sheet, "fortitude"))}${fortitude && fortitude.treino > 0 ? ` → RD <strong>${rdBloqueio}</strong> ao bloquear` : ""}.</li>
          </ul>
        </article>

        <article class="help-card">
          <h3>Contra-ataque</h3>
          <p>Requer ser <strong>treinado em Luta</strong>. Só responde a um ataque <strong>corpo a corpo</strong>.</p>
          <ul>
            <li>Você declara a reação antes da rolagem.</li>
            <li>Se o ataque inimigo <strong>errar</strong> sua Defesa, você pode fazer um <strong>ataque corpo a corpo</strong> nele.</li>
            <li>Se o ataque inimigo acertar, você sofre o golpe normalmente e não contra-ataca.</li>
            <li>Nesta ficha: Luta ${esc(periciaBonusLabel(sheet, "luta"))}${luta && luta.treino > 0 ? "" : " — treine Luta para usar"}.</li>
          </ul>
        </article>

        <article class="help-card help-card-note">
          <h3>Resumo rápido</h3>
          <ul>
            <li><strong>1 reação por rodada</strong> (salvo poder/item que diga o contrário).</li>
            <li>Declare <strong>antes</strong> da rolagem de ataque.</li>
            <li><strong>Esquiva</strong> = mais Defesa · <strong>Bloqueio</strong> = menos dano · <strong>Contra-ataque</strong> = golpe de volta se errarem.</li>
          </ul>
          <p class="hint">Texto adaptado das regras de combate do Ordem Paranormal RPG (Jambo Editora). Em dúvida, o livro e o mestre prevalecem.</p>
        </article>
      </div>
    `;
  }

  function renderTabContent(sheet) {
    switch (sheetUi.tab) {
      case "habilidades": return renderHabilidades(sheet);
      case "rituais": return renderRituais(sheet);
      case "inventario": return renderInventario(sheet);
      case "relacionamentos": return renderRelacionamentos(sheet);
      case "notas": return renderNotas(sheet);
      case "ajuda": return renderAjuda(sheet);
      case "combate":
      default: return renderAtaques(sheet);
    }
  }

  function renderSheetDetail(sheet) {
    const tabs = [
      ["combate", "Combate"],
      ["habilidades", "Habilidades"],
      ["rituais", "Rituais"],
      ["inventario", "Inventário"],
      ["relacionamentos", "Relacionamentos"],
      ["notas", "Notas"],
      ["ajuda", "Ajuda"],
    ];

    return withSheetNote(`
      <div class="toolbar sheet-toolbar">
        <button type="button" class="btn btn-ghost" data-action="go-sheets">Fichas</button>
        <div class="inline-actions">
          <button type="button" class="btn btn-ghost" data-action="sheet-export-one" data-id="${esc(sheet.id)}">Exportar JSON</button>
          <label class="btn btn-ghost">
            Trocar imagem
            <input type="file" accept="image/*" hidden data-action-file="sheet-portrait">
          </label>
        </div>
      </div>
      <div class="sheet-layout">
        <aside class="sheet-col sheet-col-left">
          <div class="sheet-identity">
            ${portraitHtml(sheet, "sheet-portrait")}
            <div class="identity-fields">
              <label class="field"><span>Jogador</span><input data-sheet-field="jogador" value="${esc(sheet.jogador)}"></label>
              <label class="field"><span>Personagem</span><input data-sheet-field="nome" value="${esc(sheet.nome)}"></label>
              <label class="field"><span>Origem</span><input data-sheet-field="origem" value="${esc(sheet.origem)}"></label>
              <label class="field"><span>Classe</span><input data-sheet-field="classe" value="${esc(sheet.classe)}"></label>
              <label class="field"><span>Trilha</span><input data-sheet-field="trilha" value="${esc(sheet.trilha)}"></label>
              <label class="field"><span>Patente</span><input data-sheet-field="patente" value="${esc(sheet.patente)}"></label>
            </div>
          </div>
          <section class="attrs-panel">
            <div class="attrs-core"><span>Atributos</span></div>
            <div class="attrs-ring">${attrNodes(sheet)}</div>
          </section>
          <div class="sheet-stats entry-grid">
            <label class="field"><span>NEX %</span><input type="number" min="0" max="99" data-sheet-field="nex" value="${sheet.nex}"></label>
            <label class="field"><span>Defesa</span><input type="number" min="0" data-sheet-field="defesa" value="${sheet.defesa}"></label>
            <label class="field"><span>Desloc.</span><input type="number" min="0" data-sheet-field="deslocamento" value="${sheet.deslocamento}"></label>
            <label class="field"><span>PE / rodada</span><input type="number" min="0" data-sheet-field="peRodada" value="${sheet.peRodada}"></label>
          </div>
          ${resourceBar("Vida", "pv", sheet.pv, sheet.pvMax, "resource-vida")}
          ${resourceBar("Sanidade", "san", sheet.san, sheet.sanMax, "resource-san")}
          ${resourceBar("Esforço", "pe", sheet.pe, sheet.peMax, "resource-pe")}
        </aside>
        <section class="sheet-col sheet-col-mid">
          ${renderPericias(sheet)}
        </section>
        <section class="sheet-col sheet-col-right">
          <div class="sheet-tabs">
            ${tabs.map(([id, label]) => `
              <button type="button" class="sheet-tab${sheetUi.tab === id ? " is-active" : ""}" data-action="sheet-tab" data-id="${id}">${label}</button>
            `).join("")}
          </div>
          <div class="sheet-tab-panel">
            ${renderTabContent(sheet)}
          </div>
        </section>
      </div>
    `);
  }

  function renderSheetForm() {
    return `
      <div class="modal-backdrop">
        <form class="modal" id="sheet-form" novalidate role="dialog" aria-modal="true" aria-labelledby="sheet-form-title">
          <h2 id="sheet-form-title">Nova ficha</h2>
          <label class="field">
            <span>Imagem do personagem</span>
            <input name="imagem" type="file" accept="image/*" data-preview="#sheet-preview">
            <small>Opcional. A imagem é reduzida antes de salvar.</small>
          </label>
          <div class="preview" id="sheet-preview"></div>
          <label class="field"><span>Personagem</span><input name="nome" maxlength="80" autocomplete="off"></label>
          <label class="field"><span>Jogador</span><input name="jogador" maxlength="80" autocomplete="off"></label>
          <label class="field"><span>Origem</span><input name="origem" maxlength="60" autocomplete="off"></label>
          <label class="field"><span>Classe</span><input name="classe" maxlength="60" autocomplete="off" placeholder="Combatente, Especialista, Ocultista..."></label>
          <label class="field"><span>NEX %</span><input name="nex" type="number" min="0" max="99" value="5"></label>
          <p class="form-error" role="alert"></p>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" data-action="close-modal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Criar ficha</button>
          </div>
        </form>
      </div>
    `;
  }

  function patchField(sheet, path, value) {
    if (path.startsWith("atributos.")) {
      const key = path.split(".")[1];
      if (ATTR_KEYS.includes(key)) sheet.atributos[key] = clampInt(value, 0, 5, sheet.atributos[key]);
      return;
    }
    if (path.startsWith("pericia.")) {
      const [, id, field] = path.split(".");
      const pericia = sheet.pericias.find((item) => item.id === id);
      if (pericia && field === "outros") pericia.outros = clampInt(value, -99, 99, 0);
      return;
    }
    if (path.startsWith("ataque.")) {
      const [, id, field] = path.split(".");
      const ataque = sheet.ataques.find((item) => item.id === id);
      if (ataque && field in ataque) ataque[field] = String(value);
      return;
    }
    if (path.startsWith("habilidade.")) {
      const [, id, field] = path.split(".");
      const hab = sheet.habilidades.find((item) => item.id === id);
      if (hab && field in hab) hab[field] = String(value);
      return;
    }
    if (path.startsWith("ritual.")) {
      const [, id, field] = path.split(".");
      const ritual = sheet.rituais.find((item) => item.id === id);
      if (!ritual || !(field in ritual)) return;
      if (field === "circulo") {
        const next = String(value).toUpperCase();
        ritual.circulo = CIRCULOS.includes(next) ? next : ritual.circulo;
      } else {
        ritual[field] = String(value);
      }
      return;
    }
    if (path.startsWith("item.")) {
      const [, id, field] = path.split(".");
      const item = sheet.inventario.find((entry) => entry.id === id);
      if (!item || !(field in item)) return;
      if (field === "espacos") item.espacos = clampInt(value, 0, 99, 0);
      else item[field] = String(value);
      return;
    }
    if (path.startsWith("bond.")) {
      const [, list, id, field] = path.split(".");
      const arr = list === "vinculos" ? sheet.vinculos : sheet.relacoes;
      const bond = arr.find((entry) => entry.id === id);
      if (bond && field === "nome") bond.nome = String(value);
      return;
    }
    const numeric = ["nex", "pv", "pvMax", "san", "sanMax", "pe", "peMax", "peRodada", "defesa", "deslocamento", "cargaMax", "credito", "prestigio"];
    if (numeric.includes(path)) {
      const max = path === "nex" ? 99 : 9999;
      sheet[path] = clampInt(value, 0, max, sheet[path]);
      return;
    }
    if (["nome", "jogador", "origem", "classe", "trilha", "patente", "dtRitual", "aparencia", "personalidade", "historico", "objetivo"].includes(path)) {
      sheet[path] = String(value);
    }
  }

  function saveAndRender(keepScroll = true) {
    if (!persistSheets()) {
      op().render?.({ keepScroll: true });
      return false;
    }
    op().render?.({ keepScroll });
    return true;
  }

  async function createSheetFromForm(form) {
    const helpers = op();
    const showError = helpers.showError;
    const fieldValue = helpers.fieldValue;
    const fieldFile = helpers.fieldFile;
    const readImage = helpers.readImage;
    showError?.(form, "");
    const nome = cleanName(fieldValue(form, "nome"));
    if (!nome) {
      showError?.(form, "Dê um nome para o personagem.");
      return;
    }
    const file = fieldFile(form, "imagem");
    let imagem = "";
    if (file) {
      try {
        imagem = await readImage(file, 720);
      } catch (err) {
        showError?.(form, "Não foi possível ler essa imagem. Use JPG, PNG ou WebP.");
        return;
      }
    }
    const sheet = createEmptySheet({
      nome,
      jogador: cleanName(fieldValue(form, "jogador")),
      origem: cleanName(fieldValue(form, "origem")),
      classe: cleanName(fieldValue(form, "classe")) || "Combatente",
      nex: clampInt(fieldValue(form, "nex"), 0, 99, 5),
      imagem,
    });
    sheetsState.sheets.unshift(sheet);
    if (!persistSheets()) return;
    helpers.closeModal?.();
    helpers.ui.screen = "sheet";
    helpers.ui.sheetId = sheet.id;
    helpers.render?.();
  }

  function importFromJsonText(text) {
    const data = JSON.parse(text);
    let incoming = [];
    if (Array.isArray(data)) incoming = data;
    else if (data && Array.isArray(data.sheets)) incoming = data.sheets;
    else if (data && data.nome) incoming = [data];
    else throw new Error("formato");
    const normalized = incoming.map(normalizeSheet).map((sheet) => ({ ...sheet, id: uid() }));
    if (!normalized.length) throw new Error("vazio");
    sheetsState.sheets.unshift(...normalized);
    if (!persistSheets()) return;
    op().announce?.(`${normalized.length === 1 ? "Ficha importada" : `${normalized.length} fichas importadas`}.`);
    op().render?.();
  }

  function handleAction(action, el, id) {
    const helpers = op();
    const ui = helpers.ui;
    switch (action) {
      case "go-sheets":
        ui.screen = "sheets";
        ui.sheetId = null;
        helpers.closeModal?.();
        helpers.render?.();
        return true;
      case "open-sheets":
        ui.screen = "sheets";
        ui.sheetId = null;
        helpers.render?.();
        return true;
      case "open-sheet":
        ui.screen = "sheet";
        ui.sheetId = id;
        sheetUi.tab = "combate";
        helpers.render?.();
        return true;
      case "sheet-new":
        helpers.openModal?.(renderSheetForm());
        return true;
      case "sheet-delete":
        helpers.openConfirm?.({
          title: "Excluir ficha?",
          message: "A ficha será apagada deste navegador.",
          confirmLabel: "Excluir",
          action: "confirm-delete-sheet",
          id,
        });
        return true;
      case "confirm-delete-sheet": {
        sheetsState.sheets = sheetsState.sheets.filter((sheet) => sheet.id !== id);
        if (ui.sheetId === id) {
          ui.screen = "sheets";
          ui.sheetId = null;
        }
        persistSheets();
        helpers.closeModal?.();
        helpers.render?.();
        return true;
      }
      case "sheet-export-all":
        downloadJson("fichas-ordem-paranormal.json", { version: 1, sheets: sheetsState.sheets });
        return true;
      case "sheet-export-one": {
        const sheet = findSheet(id) || currentSheet();
        if (!sheet) return true;
        downloadJson(`${slugName(sheet.nome)}.json`, sheet);
        return true;
      }
      case "sheet-import": {
        const input = document.getElementById("sheet-import-input");
        if (input) input.click();
        return true;
      }
      case "sheet-tab":
        sheetUi.tab = id || "combate";
        helpers.render?.({ keepScroll: true });
        return true;
      case "sheet-pericias-filtro":
        sheetUi.periciasFiltro = id === "treinadas" ? "treinadas" : "todas";
        helpers.render?.({ keepScroll: true });
        return true;
      case "sheet-ritual-circulo":
        sheetUi.ritualFiltroCirculo = id || "todos";
        helpers.render?.({ keepScroll: true });
        return true;
      case "sheet-ritual-elemento":
        sheetUi.ritualFiltroElemento = id || "todos";
        helpers.render?.({ keepScroll: true });
        return true;
      case "sheet-resource": {
        const sheet = currentSheet();
        if (!sheet) return true;
        const kind = el.dataset.kind;
        const delta = Number(el.dataset.delta || 0);
        if (!["pv", "san", "pe"].includes(kind)) return true;
        sheet[kind] = clampInt(sheet[kind] + delta, 0, sheet[`${kind}Max`] || 9999, sheet[kind]);
        saveAndRender(true);
        return true;
      }
      case "sheet-treino": {
        const sheet = currentSheet();
        if (!sheet) return true;
        const pericia = sheet.pericias.find((item) => item.id === id);
        if (!pericia) return true;
        const level = clampInt(el.dataset.level, 1, 3, 1);
        pericia.treino = pericia.treino === level ? level - 1 : level;
        saveAndRender(true);
        return true;
      }
      case "sheet-add-ataque": {
        const sheet = currentSheet();
        if (!sheet) return true;
        sheet.ataques.push(normalizeAtaque({ nome: "Novo ataque" }));
        saveAndRender(true);
        return true;
      }
      case "sheet-remove-ataque": {
        const sheet = currentSheet();
        if (!sheet) return true;
        sheet.ataques = sheet.ataques.filter((item) => item.id !== id);
        saveAndRender(true);
        return true;
      }
      case "sheet-add-habilidade": {
        const sheet = currentSheet();
        if (!sheet) return true;
        sheet.habilidades.push(normalizeHabilidade({ nome: "Nova habilidade" }));
        saveAndRender(true);
        return true;
      }
      case "sheet-remove-habilidade": {
        const sheet = currentSheet();
        if (!sheet) return true;
        sheet.habilidades = sheet.habilidades.filter((item) => item.id !== id);
        saveAndRender(true);
        return true;
      }
      case "sheet-add-ritual": {
        const sheet = currentSheet();
        if (!sheet) return true;
        sheet.rituais.unshift(normalizeRitual({ nome: "Novo ritual" }));
        sheetUi.tab = "rituais";
        saveAndRender(true);
        return true;
      }
      case "sheet-remove-ritual": {
        const sheet = currentSheet();
        if (!sheet) return true;
        sheet.rituais = sheet.rituais.filter((item) => item.id !== id);
        saveAndRender(true);
        return true;
      }
      case "sheet-add-item": {
        const sheet = currentSheet();
        if (!sheet) return true;
        sheet.inventario.push(normalizeItem({ nome: "Novo item" }));
        saveAndRender(true);
        return true;
      }
      case "sheet-remove-item": {
        const sheet = currentSheet();
        if (!sheet) return true;
        sheet.inventario = sheet.inventario.filter((item) => item.id !== id);
        saveAndRender(true);
        return true;
      }
      case "sheet-add-bond": {
        const sheet = currentSheet();
        if (!sheet) return true;
        const list = el.dataset.list === "vinculos" ? "vinculos" : "relacoes";
        sheet[list].push(normalizeBond({ nome: "Novo personagem", nivel: 0 }));
        sheetUi.tab = "relacionamentos";
        saveAndRender(true);
        return true;
      }
      case "sheet-remove-bond": {
        const sheet = currentSheet();
        if (!sheet) return true;
        const list = el.dataset.list === "vinculos" ? "vinculos" : "relacoes";
        sheet[list] = sheet[list].filter((item) => item.id !== id);
        saveAndRender(true);
        return true;
      }
      case "sheet-set-heart": {
        const sheet = currentSheet();
        if (!sheet) return true;
        const list = el.dataset.list === "vinculos" ? "vinculos" : "relacoes";
        const bond = sheet[list].find((item) => item.id === id);
        if (!bond) return true;
        const level = clampInt(el.dataset.level, 1, 3, 1);
        bond.nivel = bond.nivel === level ? level - 1 : level;
        saveAndRender(true);
        return true;
      }
      default:
        return false;
    }
  }

  function handleSubmit(form) {
    if (form.id !== "sheet-form") return false;
    void createSheetFromForm(form);
    return true;
  }

  function handleFieldEdit(target) {
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return false;
    const path = target.dataset.sheetField;
    if (!path) return false;
    const sheet = currentSheet();
    if (!sheet) return false;
    const active = {
      id: target.id,
      name: target.name,
      path,
      start: target.selectionStart,
      end: target.selectionEnd,
      tag: target.tagName,
    };
    patchField(sheet, path, target.value);
    if (!persistSheets()) {
      op().render?.({ keepScroll: true });
      return true;
    }
    const needsRerender = path.startsWith("pericia.")
      || path.startsWith("atributos.")
      || ["pv", "pvMax", "san", "sanMax", "pe", "peMax", "cargaMax"].includes(path)
      || path.endsWith(".espacos");
    if (needsRerender) {
      op().render?.({ keepScroll: true });
      const next = document.querySelector(`[data-sheet-field="${CSS.escape(active.path)}"]`);
      if (next && typeof next.focus === "function") {
        next.focus();
        if (typeof next.setSelectionRange === "function" && active.start != null) {
          try { next.setSelectionRange(active.start, active.end); } catch (err) { /* ignore */ }
        }
      }
    }
    return true;
  }

  async function handleFile(input) {
    const helpers = op();
    const action = input.dataset.actionFile;
    if (!action) return false;
    const file = input.files && input.files[0];
    if (!file) return true;
    if (action === "sheet-portrait") {
      const sheet = currentSheet();
      if (!sheet) return true;
      try {
        sheet.imagem = await helpers.readImage(file, 720);
        saveAndRender(true);
      } catch (err) {
        window.alert("Não foi possível ler essa imagem.");
      }
      return true;
    }
    if (action === "sheet-bond-photo") {
      const sheet = currentSheet();
      if (!sheet) return true;
      const list = input.dataset.list === "vinculos" ? "vinculos" : "relacoes";
      const bond = sheet[list].find((item) => item.id === input.dataset.id);
      if (!bond) return true;
      try {
        bond.foto = await helpers.readImage(file, 240);
        saveAndRender(true);
      } catch (err) {
        window.alert("Não foi possível ler essa imagem.");
      }
      return true;
    }
    return false;
  }

  function handleChange(target) {
    if (target instanceof HTMLInputElement && target.id === "sheet-import-input") {
      const file = target.files && target.files[0];
      if (!file) return true;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          importFromJsonText(String(reader.result || ""));
        } catch (err) {
          window.alert("JSON inválido. Use uma ficha ou a lista exportada pelo app.");
        }
        target.value = "";
      };
      reader.readAsText(file);
      return true;
    }
    if (target instanceof HTMLInputElement && target.dataset.actionFile) {
      void handleFile(target);
      return true;
    }
    if (target instanceof HTMLSelectElement && target.dataset.sheetField) {
      return handleFieldEdit(target);
    }
    return false;
  }

  function handleInput(target) {
    if (target instanceof HTMLInputElement && target.dataset.actionInput === "sheet-ritual-busca") {
      sheetUi.ritualBusca = target.value;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      op().render?.({ keepScroll: true });
      const next = document.querySelector("[data-action-input='sheet-ritual-busca']");
      if (next) {
        next.focus();
        try { next.setSelectionRange(start, end); } catch (err) { /* ignore */ }
      }
      return true;
    }
    if (target.dataset && target.dataset.sheetField) {
      return handleFieldEdit(target);
    }
    return false;
  }

  function render(screen) {
    if (screen === "sheets") return renderSheetsList();
    if (screen === "sheet") {
      const sheet = currentSheet();
      if (!sheet) return renderSheetsList();
      return renderSheetDetail(sheet);
    }
    return "";
  }

  function titleFor(screen) {
    if (screen === "sheets") return "Fichas — OP-MVP";
    if (screen === "sheet") {
      const sheet = currentSheet();
      return sheet ? `${sheet.nome} — Ficha` : "Ficha — OP-MVP";
    }
    return "";
  }

  window.Sheets = {
    render,
    titleFor,
    handleAction,
    handleSubmit,
    handleChange,
    handleInput,
    get: findSheet,
    getCount: () => sheetsState.sheets.length,
  };

  if (window.OP && typeof window.OP.render === "function") {
    window.OP.render();
  }
})();
