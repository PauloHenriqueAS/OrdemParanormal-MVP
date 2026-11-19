(() => {
  // Controle de iniciativa: agentes (ligados às fichas) e ameaças cadastradas na hora.
  const STORAGE_KEY = "op-mvp-iniciativa";

  const ui = { addOpen: false };

  function op() {
    return window.OP || {};
  }

  function esc(value) {
    return op().esc ? op().esc(value) : String(value);
  }

  function uid() {
    return op().uid ? op().uid() : `ini-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function int(value, min, max, fallback) {
    const n = Math.round(Number(value));
    if (!Number.isFinite(n)) return fallback;
    return Math.min(max, Math.max(min, n));
  }

  function signed(n) {
    return n < 0 ? `−${Math.abs(n)}` : `+${n}`;
  }

  /* ───────────── estado ───────────── */

  function normalizeCombatente(raw) {
    const s = raw && typeof raw === "object" ? raw : {};
    const tipo = s.tipo === "agente" ? "agente" : "ameaca";
    return {
      id: String(s.id || uid()).replace(/[^\w-]/g, "").slice(0, 80) || uid(),
      tipo,
      sheetId: tipo === "agente" ? String(s.sheetId || "") : "",
      nome: String(s.nome || (tipo === "agente" ? "Agente" : "Ameaça")).slice(0, 60),
      iniciativa: s.iniciativa === null || s.iniciativa === "" || s.iniciativa === undefined ? null : int(s.iniciativa, -99, 999, null),
      dados: int(s.dados, 0, 5, 1),
      bonus: int(s.bonus, -99, 99, 0),
      pv: int(s.pv, 0, 99999, 0),
      pvMax: int(s.pvMax, 0, 99999, 0),
      defesa: s.defesa === null || s.defesa === "" ? null : int(s.defesa, 0, 999, null),
      notas: String(s.notas || "").slice(0, 200),
    };
  }

  function emptyState() {
    return { rodada: 1, turno: 0, ativo: false, lista: [] };
  }

  function readState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return emptyState();
      const data = JSON.parse(raw);
      const lista = Array.isArray(data.lista) ? data.lista.map(normalizeCombatente) : [];
      return {
        rodada: int(data.rodada, 1, 9999, 1),
        turno: int(data.turno, 0, Math.max(0, lista.length - 1), 0),
        ativo: Boolean(data.ativo) && lista.length > 0,
        lista,
      };
    } catch (err) {
      return emptyState();
    }
  }

  let state = readState();

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      op().toast?.("Não foi possível salvar a iniciativa neste navegador.", { tone: "warn" });
    }
  }

  function save() {
    persist();
    op().render?.({ keepScroll: true });
  }

  function sheetsById() {
    const list = window.Sheets && typeof window.Sheets.list === "function" ? window.Sheets.list() : [];
    return new Map(list.map((sheet) => [sheet.id, sheet]));
  }

  /* ───────────── dados ───────────── */

  function d20() {
    if (globalThis.crypto?.getRandomValues) {
      const buf = new Uint32Array(1);
      do { crypto.getRandomValues(buf); } while (buf[0] >= 4294967280);
      return (buf[0] % 20) + 1;
    }
    return Math.floor(Math.random() * 20) + 1;
  }

  // Mesmo teste da ficha: d20 iguais à AGI e fica com o maior; AGI 0 rola 2 e fica com o pior.
  function rollIniciativa(c) {
    const pior = c.dados === 0;
    const n = pior ? 2 : c.dados;
    const dados = Array.from({ length: n }, d20);
    const kept = pior ? Math.min(...dados) : Math.max(...dados);
    return { total: kept + c.bonus, dados, kept };
  }

  function dadosLabel(c) {
    return c.dados === 0 ? "2d20 pior" : `${c.dados}d20`;
  }

  // Maior iniciativa primeiro; empate: maior bônus; sem valor vai para o fim. Mantém quem está no turno.
  function ordenar() {
    const atual = state.lista[state.turno];
    state.lista = state.lista
      .map((c, i) => ({ c, i }))
      .sort((a, b) => {
        const va = a.c.iniciativa;
        const vb = b.c.iniciativa;
        if (va === null && vb === null) return a.i - b.i;
        if (va === null) return 1;
        if (vb === null) return -1;
        return vb - va || b.c.bonus - a.c.bonus || a.i - b.i;
      })
      .map(({ c }) => c);
    if (atual) state.turno = Math.max(0, state.lista.indexOf(atual));
  }

  /* ───────────── render ───────────── */

  function vidaPct(atual, max) {
    return max > 0 ? Math.min(100, Math.round((atual / max) * 100)) : 0;
  }

  function rowHtml(c, index, fichas) {
    const ficha = c.tipo === "agente" ? fichas.get(c.sheetId) : null;
    const pv = ficha ? ficha.pv : c.pv;
    const pvMax = ficha ? ficha.pvMax : c.pvMax;
    const caido = pvMax > 0 && pv <= 0;
    const atual = state.ativo && index === state.turno;
    const defesa = ficha ? ficha.defesa : c.defesa;
    const meta = [
      c.tipo === "agente" ? (ficha ? ficha.classe || "Agente" : "Ficha removida") : "Ameaça",
      `${dadosLabel(c)} ${signed(c.bonus)}`,
      defesa !== null && defesa !== undefined ? `Def ${defesa}` : "",
      ficha ? `SAN ${ficha.san}/${ficha.sanMax} · PE ${ficha.pe}/${ficha.peMax}` : "",
    ].filter(Boolean).join(" · ");
    const vida = pvMax > 0
      ? `
        <div class="ini-hp">
          <button type="button" class="ini-step" data-action="ini-pv" data-id="${esc(c.id)}" data-delta="-5" aria-label="−5 PV">−5</button>
          <button type="button" class="ini-step" data-action="ini-pv" data-id="${esc(c.id)}" data-delta="-1" aria-label="−1 PV">−</button>
          <div class="ini-hp-bar"><span style="width:${vidaPct(pv, pvMax)}%"></span><b>${pv}/${pvMax}</b></div>
          <button type="button" class="ini-step" data-action="ini-pv" data-id="${esc(c.id)}" data-delta="1" aria-label="+1 PV">+</button>
          <button type="button" class="ini-step" data-action="ini-pv" data-id="${esc(c.id)}" data-delta="5" aria-label="+5 PV">+5</button>
        </div>`
      : `<p class="hint ini-no-hp">Sem PV cadastrado</p>`;
    const foto = ficha && op().imgSrc?.(ficha.imagem)
      ? `<img class="ini-avatar" alt="" src="${op().imgSrc(ficha.imagem)}">`
      : `<span class="ini-avatar ini-avatar-fallback ${c.tipo === "agente" ? "" : "is-threat"}" aria-hidden="true">${esc((c.nome || "?").trim().charAt(0).toUpperCase())}</span>`;
    return `
      <li class="ini-row ${c.tipo === "agente" ? "is-agent" : "is-threat"}${atual ? " is-current" : ""}${caido ? " is-down" : ""}">
        <div class="ini-order">
          <button type="button" class="ini-move" data-action="ini-move" data-id="${esc(c.id)}" data-dir="-1" aria-label="Subir ${esc(c.nome)}"${index === 0 ? " disabled" : ""}>▲</button>
          <span class="ini-pos">${index + 1}</span>
          <button type="button" class="ini-move" data-action="ini-move" data-id="${esc(c.id)}" data-dir="1" aria-label="Descer ${esc(c.nome)}"${index === state.lista.length - 1 ? " disabled" : ""}>▼</button>
        </div>
        <label class="ini-value">
          <span>Inic.</span>
          <input type="number" inputmode="numeric" min="-99" max="999" value="${c.iniciativa ?? ""}" placeholder="—" data-ini-field="iniciativa" data-id="${esc(c.id)}" aria-label="Iniciativa de ${esc(c.nome)}">
        </label>
        <div class="ini-body">
          <div class="ini-name">
            ${foto}
            <div>
              <strong>${esc(c.nome)}${atual ? ' <em class="ini-badge">Turno</em>' : ""}${caido ? ` <em class="ini-badge is-down">${c.tipo === "agente" ? "Morrendo" : "Derrotado"}</em>` : ""}</strong>
              <small>${esc(meta)}</small>
            </div>
          </div>
          ${vida}
          ${c.notas ? `<p class="ini-notes">${esc(c.notas)}</p>` : ""}
        </div>
        <div class="ini-actions">
          <button type="button" class="btn btn-ghost btn-small" data-action="ini-roll-one" data-id="${esc(c.id)}">Rolar</button>
          ${c.tipo === "ameaca" ? `<button type="button" class="btn btn-ghost btn-small" data-action="ini-edit" data-id="${esc(c.id)}">Editar</button>` : ""}
          <button type="button" class="btn btn-danger btn-small" data-action="ini-remove" data-id="${esc(c.id)}" aria-label="Tirar ${esc(c.nome)} do combate">✕</button>
        </div>
      </li>
    `;
  }

  function render() {
    const fichas = sheetsById();
    // Remove agentes cujas fichas foram apagadas? Mantém, mas mostra "Ficha removida".
    const lista = state.lista.length
      ? `<ol class="ini-list">${state.lista.map((c, i) => rowHtml(c, i, fichas)).join("")}</ol>`
      : `<div class="empty"><h3>Nenhum combatente</h3><p>Adicione os agentes das fichas e cadastre as ameaças do combate.</p></div>`;
    const atual = state.ativo ? state.lista[state.turno] : null;
    const semValor = state.lista.filter((c) => c.iniciativa === null).length;
    return `
      <div class="page-head">
        <div>
          <button type="button" class="btn btn-ghost btn-back" data-action="go-hub">‹ Início</button>
          <p class="kicker">Combate</p>
          <h2>Iniciativa</h2>
          <p class="lede">Adicione os agentes e as ameaças, role a iniciativa e passe os turnos. A vida dos agentes é a mesma da ficha.</p>
        </div>
        <div class="head-actions">
          <button type="button" class="btn btn-primary" data-action="ini-add-agents">+ Agentes</button>
          <button type="button" class="btn btn-primary" data-action="ini-add-threat">+ Ameaça</button>
        </div>
      </div>

      <section class="panel ini-panel">
        <div class="ini-bar">
          <div class="ini-round">
            <span>Rodada</span>
            <strong>${state.rodada}</strong>
          </div>
          <div class="ini-now">
            <span>${state.ativo ? "Vez de" : "Combate parado"}</span>
            <strong>${atual ? esc(atual.nome) : state.lista.length ? "Role e comece" : "—"}</strong>
          </div>
          <div class="ini-controls">
            ${state.ativo
              ? `<button type="button" class="btn btn-ghost" data-action="ini-prev">‹ Anterior</button>
                 <button type="button" class="btn btn-primary ini-next" data-action="ini-next">Próximo turno ›</button>`
              : `<button type="button" class="btn btn-primary ini-next" data-action="ini-start"${state.lista.length ? "" : " disabled"}>Começar combate</button>`}
          </div>
        </div>
        <div class="ini-tools">
          <button type="button" class="btn btn-ghost btn-small" data-action="ini-roll-all"${state.lista.length ? "" : " disabled"}>🎲 Rolar todos</button>
          <button type="button" class="btn btn-ghost btn-small" data-action="ini-roll-missing"${semValor ? "" : " disabled"}>Rolar quem falta (${semValor})</button>
          <button type="button" class="btn btn-ghost btn-small" data-action="ini-sort"${state.lista.length > 1 ? "" : " disabled"}>Ordenar</button>
          <button type="button" class="btn btn-ghost btn-small" data-action="ini-clear-threats"${state.lista.some((c) => c.tipo === "ameaca") ? "" : " disabled"}>Tirar ameaças</button>
          <button type="button" class="btn btn-danger btn-small" data-action="ini-end"${state.lista.length ? "" : " disabled"}>Encerrar combate</button>
        </div>
        ${lista}
        <p class="hint ini-foot">A lista se ordena sozinha ao rolar ou digitar a iniciativa. Use ▲▼ para desempatar. Agentes rolam com a AGI e o bônus de Iniciativa da ficha.</p>
      </section>
    `;
  }

  function renderAgentsModal() {
    const list = window.Sheets && typeof window.Sheets.list === "function" ? window.Sheets.list() : [];
    const naLista = new Set(state.lista.filter((c) => c.tipo === "agente").map((c) => c.sheetId));
    const itens = list.length
      ? list.map((s) => {
        const ja = naLista.has(s.id);
        return `
          <label class="ini-pick${ja ? " is-in" : ""}">
            <input type="checkbox" name="agente" value="${esc(s.id)}"${ja ? " disabled checked" : " checked"}>
            <span><strong>${esc(s.nome)}</strong><small>${esc([s.classe, `AGI ${s.agi}`, `Iniciativa ${signed(s.bonusIniciativa)}`, ja ? "já está no combate" : ""].filter(Boolean).join(" · "))}</small></span>
          </label>`;
      }).join("")
      : `<p class="hint">Nenhuma ficha cadastrada ainda.</p>`;
    return `
      <div class="modal-backdrop">
        <form class="modal modal-sheet" id="ini-agents-form" novalidate role="dialog" aria-modal="true" aria-labelledby="ini-agents-title">
          <header class="modal-head">
            <h2 id="ini-agents-title">Adicionar agentes</h2>
            <button type="button" class="icon-btn" data-action="close-modal" aria-label="Fechar">✕</button>
          </header>
          <div class="ini-pick-list">${itens}</div>
          <label class="ini-check"><input type="checkbox" name="rolar" checked> Rolar a iniciativa deles agora</label>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" data-action="close-modal">Cancelar</button>
            <button type="submit" class="btn btn-primary"${list.length ? "" : " disabled"}>Adicionar</button>
          </div>
        </form>
      </div>
    `;
  }

  function renderThreatModal(c) {
    const editar = Boolean(c);
    const v = c || { nome: "", dados: 1, bonus: 0, pvMax: 0, defesa: null, notas: "" };
    return `
      <div class="modal-backdrop">
        <form class="modal modal-sheet" id="ini-threat-form" data-id="${editar ? esc(c.id) : ""}" novalidate role="dialog" aria-modal="true" aria-labelledby="ini-threat-title">
          <header class="modal-head">
            <h2 id="ini-threat-title">${editar ? "Editar ameaça" : "Nova ameaça"}</h2>
            <button type="button" class="icon-btn" data-action="close-modal" aria-label="Fechar">✕</button>
          </header>
          <label class="field"><span>Nome</span><input name="nome" maxlength="50" value="${esc(v.nome)}" placeholder="Zumbi de Sangue" autocomplete="off" data-autofocus></label>
          <div class="entry-grid">
            ${editar ? "" : `<label class="field"><span>Quantidade</span><input name="qtd" type="number" inputmode="numeric" min="1" max="20" value="1"></label>`}
            <label class="field"><span>Dados (AGI)</span><input name="dados" type="number" inputmode="numeric" min="0" max="5" value="${v.dados}"></label>
            <label class="field"><span>Bônus inic.</span><input name="bonus" type="number" inputmode="numeric" min="-99" max="99" value="${v.bonus}"></label>
            <label class="field"><span>PV</span><input name="pv" type="number" inputmode="numeric" min="0" max="99999" value="${v.pvMax || ""}" placeholder="opcional"></label>
            <label class="field"><span>Defesa</span><input name="defesa" type="number" inputmode="numeric" min="0" max="999" value="${v.defesa ?? ""}" placeholder="opcional"></label>
          </div>
          <label class="field"><span>Anotações</span><input name="notas" maxlength="200" value="${esc(v.notas)}" placeholder="Resistência a balístico, fraco a Energia..."></label>
          ${editar ? "" : `<label class="ini-check"><input type="checkbox" name="rolar" checked> Rolar a iniciativa agora</label>`}
          <p class="form-error" role="alert"></p>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" data-action="close-modal">Cancelar</button>
            <button type="submit" class="btn btn-primary">${editar ? "Salvar" : "Adicionar"}</button>
          </div>
        </form>
      </div>
    `;
  }

  /* ───────────── ações ───────────── */

  function find(id) {
    return state.lista.find((c) => c.id === id) || null;
  }

  function rolarEm(c) {
    const r = rollIniciativa(c);
    c.iniciativa = r.total;
    return r;
  }

  function syncAgentes() {
    // Atualiza dados/bônus dos agentes pelo que está na ficha agora.
    const fichas = sheetsById();
    state.lista.forEach((c) => {
      if (c.tipo !== "agente") return;
      const f = fichas.get(c.sheetId);
      if (!f) return;
      c.nome = f.nome;
      c.dados = f.agi;
      c.bonus = f.bonusIniciativa;
    });
  }

  function handleAction(action, el, id) {
    if (action === "open-initiative") {
      op().closeModal?.();
      op().ui.screen = "initiative";
      op().ui.sheetId = null;
      op().render?.();
      return true;
    }
    if (!action.startsWith("ini-")) return false;
    const helpers = op();
    switch (action) {
      case "ini-add-agents":
        helpers.openModal?.(renderAgentsModal());
        return true;
      case "ini-add-threat":
        helpers.openModal?.(renderThreatModal(null));
        return true;
      case "ini-edit": {
        const c = find(id);
        if (c) helpers.openModal?.(renderThreatModal(c));
        return true;
      }
      case "ini-roll-all":
      case "ini-roll-missing": {
        syncAgentes();
        state.lista.forEach((c) => { if (action === "ini-roll-all" || c.iniciativa === null) rolarEm(c); });
        ordenar();
        if (action === "ini-roll-all" && !state.ativo) state.turno = 0;
        save();
        helpers.toast?.(action === "ini-roll-all" ? "Iniciativa rolada para todos." : "Iniciativa rolada para quem faltava.");
        return true;
      }
      case "ini-roll-one": {
        const c = find(id);
        if (!c) return true;
        syncAgentes();
        const r = rolarEm(c);
        ordenar();
        save();
        helpers.toast?.(`${c.nome}: ${r.total} (dados ${r.dados.join(", ")} → ${r.kept} ${signed(c.bonus)})`);
        return true;
      }
      case "ini-sort":
        ordenar();
        save();
        return true;
      case "ini-move": {
        const i = state.lista.findIndex((c) => c.id === id);
        const j = i + (Number(el.dataset.dir) < 0 ? -1 : 1);
        if (i < 0 || j < 0 || j >= state.lista.length) return true;
        const atual = state.lista[state.turno];
        [state.lista[i], state.lista[j]] = [state.lista[j], state.lista[i]];
        state.turno = Math.max(0, state.lista.indexOf(atual));
        save();
        return true;
      }
      case "ini-start":
        if (!state.lista.length) return true;
        if (state.lista.some((c) => c.iniciativa === null)) {
          syncAgentes();
          state.lista.forEach((c) => { if (c.iniciativa === null) rolarEm(c); });
          ordenar();
        }
        state.ativo = true;
        state.turno = 0;
        state.rodada = 1;
        save();
        helpers.announce?.(`Combate iniciado. Vez de ${state.lista[0].nome}.`);
        return true;
      case "ini-next":
      case "ini-prev": {
        if (!state.lista.length) return true;
        const n = state.lista.length;
        // Ameaças derrotadas (PV 0) são puladas ao avançar.
        const derrotada = (c) => c.tipo === "ameaca" && c.pvMax > 0 && c.pv <= 0;
        if (action === "ini-next") {
          let passos = 0;
          do {
            state.turno += 1;
            if (state.turno >= n) { state.turno = 0; state.rodada += 1; }
            passos += 1;
          } while (derrotada(state.lista[state.turno]) && passos < n);
        } else {
          state.turno -= 1;
          if (state.turno < 0) {
            if (state.rodada > 1) { state.turno = n - 1; state.rodada -= 1; } else state.turno = 0;
          }
        }
        save();
        const c = state.lista[state.turno];
        helpers.announce?.(`Rodada ${state.rodada}. Vez de ${c.nome}.`);
        requestAnimationFrame(() => document.querySelector(".ini-row.is-current")?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
        return true;
      }
      case "ini-pv": {
        const c = find(id);
        if (!c) return true;
        const delta = Number(el.dataset.delta) || 0;
        if (c.tipo === "agente") {
          if (window.Sheets?.adjustVital?.(c.sheetId, "pv", delta) === null) helpers.toast?.("A ficha deste agente não existe mais.", { tone: "warn" });
        } else {
          c.pv = int(c.pv + delta, 0, Math.max(c.pvMax, c.pv + Math.max(delta, 0)), c.pv);
        }
        save();
        return true;
      }
      case "ini-remove": {
        const i = state.lista.findIndex((c) => c.id === id);
        if (i < 0) return true;
        state.lista.splice(i, 1);
        if (i < state.turno) state.turno -= 1;
        if (state.turno >= state.lista.length) state.turno = 0;
        if (!state.lista.length) state.ativo = false;
        save();
        return true;
      }
      case "ini-clear-threats": {
        const atual = state.lista[state.turno];
        state.lista = state.lista.filter((c) => c.tipo !== "ameaca");
        state.turno = Math.max(0, state.lista.indexOf(atual));
        if (!state.lista.length) state.ativo = false;
        save();
        return true;
      }
      case "ini-end":
        helpers.openConfirm?.({
          title: "Encerrar combate?",
          message: "A lista de iniciativa será limpa (agentes e ameaças). A vida nas fichas continua como está.",
          confirmLabel: "Encerrar",
          action: "ini-end-confirm",
        });
        return true;
      case "ini-end-confirm":
        helpers.closeModal?.();
        state.lista = [];
        state.ativo = false;
        state.turno = 0;
        state.rodada = 1;
        save();
        helpers.toast?.("Combate encerrado.");
        return true;
      default:
        return false;
    }
  }

  function handleSubmit(form) {
    const helpers = op();
    if (form.id === "ini-agents-form") {
      const ids = [...form.querySelectorAll('input[name="agente"]:checked:not(:disabled)')].map((i) => i.value);
      const rolar = form.querySelector('input[name="rolar"]')?.checked;
      const fichas = sheetsById();
      ids.forEach((sheetId) => {
        const f = fichas.get(sheetId);
        if (!f) return;
        const c = normalizeCombatente({ tipo: "agente", sheetId, nome: f.nome, dados: f.agi, bonus: f.bonusIniciativa });
        if (rolar) rolarEm(c);
        state.lista.push(c);
      });
      if (rolar) ordenar();
      helpers.closeModal?.();
      save();
      if (ids.length) helpers.toast?.(ids.length === 1 ? "1 agente adicionado." : `${ids.length} agentes adicionados.`);
      return true;
    }
    if (form.id === "ini-threat-form") {
      const get = (name) => form.elements.namedItem(name)?.value ?? "";
      const nome = String(get("nome")).trim();
      if (!nome) {
        helpers.showError?.(form, "Dê um nome para a ameaça.");
        return true;
      }
      const pvMax = get("pv") === "" ? 0 : int(get("pv"), 0, 99999, 0);
      const base = {
        tipo: "ameaca",
        nome,
        dados: int(get("dados"), 0, 5, 1),
        bonus: int(get("bonus"), -99, 99, 0),
        defesa: get("defesa") === "" ? null : int(get("defesa"), 0, 999, null),
        notas: get("notas"),
      };
      const editId = form.dataset.id;
      if (editId) {
        const c = find(editId);
        if (c) {
          const perdido = Math.max(0, c.pvMax - c.pv);
          Object.assign(c, normalizeCombatente({ ...c, ...base, pvMax, pv: Math.max(0, pvMax - perdido), iniciativa: c.iniciativa }));
        }
      } else {
        const qtd = int(get("qtd"), 1, 20, 1);
        const rolar = form.querySelector('input[name="rolar"]')?.checked;
        for (let i = 1; i <= qtd; i += 1) {
          const c = normalizeCombatente({ ...base, nome: qtd > 1 ? `${nome} ${i}` : nome, pv: pvMax, pvMax });
          if (rolar) rolarEm(c);
          state.lista.push(c);
        }
        if (rolar) ordenar();
      }
      helpers.closeModal?.();
      save();
      return true;
    }
    return false;
  }

  function handleChange(target) {
    if (!(target instanceof HTMLInputElement) || target.dataset.iniField !== "iniciativa") return false;
    const c = find(target.dataset.id);
    if (!c) return true;
    c.iniciativa = target.value === "" ? null : int(target.value, -99, 999, null);
    ordenar();
    save();
    return true;
  }

  function summary() {
    if (!state.lista.length) return "Nenhum combate";
    return state.ativo ? `Rodada ${state.rodada} · ${state.lista.length} no combate` : `${state.lista.length} na lista`;
  }

  window.Initiative = { render, handleAction, handleSubmit, handleChange, summary };

  if (window.OP && typeof window.OP.render === "function" && window.OP.ui?.screen === "initiative") {
    window.OP.render();
  }
})();
