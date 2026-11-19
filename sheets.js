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

  const CIRCULOS = [1, 2, 3, 4];
  const ROMANOS = { I: 1, II: 2, III: 3, IV: 4 };
  const CUSTO_PADRAO = { 1: 1, 2: 3, 3: 6, 4: 10 };
  const ELEMENTOS = ["Sangue", "Morte", "Energia", "Conhecimento", "Medo", "Outro"];
  const ELEMENTO_SLUG = {
    Sangue: "sangue",
    Morte: "morte",
    Energia: "energia",
    Conhecimento: "conhecimento",
    Medo: "medo",
  };

  const VITALS = {
    pv: { nome: "Vida", sigla: "PV" },
    san: { nome: "Sanidade", sigla: "SAN" },
    pe: { nome: "Esforço", sigla: "PE" },
  };

  // Condições do livro básico (resumo próprio dos efeitos).
  const CONDICOES = [
    ["abalado", "Abalado", "medo", "−1d20 em testes. Se ficar abalado de novo, vira apavorado."],
    ["apavorado", "Apavorado", "medo", "−2d20 em perícias e foge da fonte do medo (pode parar ao perdê-la de vista ou passar de alcance médio). Se não puder fugir, age, mas não se aproxima dela."],
    ["agarrado", "Agarrado", "paralisia", "Desprevenido e imóvel, −1d20 em ataques e só ataca com armas leves. Ataques à distância contra quem está agarrando têm 50% de chance de acertar o alvo errado."],
    ["alquebrado", "Alquebrado", "mental", "Custo em PE de habilidades e rituais aumenta em +1."],
    ["asfixiado", "Asfixiado", "fisico", "Prende a respiração por rodadas iguais ao Vigor; depois, Fortitude por rodada (DT 5, +5 por teste). Falhou: inconsciente e perde 1d6 PV por rodada até respirar."],
    ["atordoado", "Atordoado", "mental", "Desprevenido e não pode fazer ações."],
    ["caido", "Caído", "movimento", "−2d20 em ataques corpo a corpo e deslocamento 1,5m. −5 na Defesa contra corpo a corpo, +5 contra ataques à distância."],
    ["cego", "Cego", "sentidos", "Desprevenido e lento; não faz Percepção para observar e tem −2d20 em perícias de Agilidade ou Força. Todos os alvos têm camuflagem total."],
    ["confuso", "Confuso", "mental", "Role 1d6 no início do turno: 1 anda em direção aleatória; 2–3 não age; 4–5 ataca o ser mais próximo; 6 a condição acaba."],
    ["debilitado", "Debilitado", "fisico", "−2d20 em testes de AGI, FOR e VIG. Se ficar debilitado de novo, fica inconsciente."],
    ["desprevenido", "Desprevenido", "combate", "−5 na Defesa e −1d20 em Reflexos."],
    ["doente", "Doente", "fisico", "Sob efeito de uma doença (efeito conforme a doença)."],
    ["em-chamas", "Em chamas", "combate", "1d6 de dano de fogo no início do turno; ação padrão ou água para apagar."],
    ["enjoado", "Enjoado", "fisico", "Só pode fazer uma ação padrão ou de movimento por rodada (não ambas)."],
    ["enredado", "Enredado", "paralisia", "Lento, vulnerável e −1d20 em ataques."],
    ["envenenado", "Envenenado", "fisico", "Efeito conforme o veneno (outra condição ou dano recorrente). Dano de vários venenos se acumula."],
    ["esmorecido", "Esmorecido", "mental", "−2d20 em testes de INT e PRE."],
    ["exausto", "Exausto", "fadiga", "Debilitado, lento e vulnerável. Se ficar exausto de novo, fica inconsciente."],
    ["fascinado", "Fascinado", "mental", "−2d20 em Percepção e só observa o que o fascinou. Ação hostil contra ele encerra; sacudi-lo gasta ação padrão."],
    ["fatigado", "Fatigado", "fadiga", "Fraco e vulnerável. Se fatigar de novo, fica exausto."],
    ["fraco", "Fraco", "fisico", "−1d20 em testes de AGI, FOR e VIG. Se ficar fraco de novo, fica debilitado."],
    ["frustrado", "Frustrado", "mental", "−1d20 em testes de INT e PRE. Se ficar frustrado de novo, fica esmorecido."],
    ["imovel", "Imóvel", "paralisia", "Todo deslocamento vira 0m."],
    ["inconsciente", "Inconsciente", "combate", "Indefeso e não faz ações, nem reações. Acordá-lo gasta ação padrão."],
    ["indefeso", "Indefeso", "combate", "Desprevenido, −10 na Defesa, falha automaticamente em Reflexos e pode sofrer golpe de misericórdia."],
    ["lento", "Lento", "paralisia", "Deslocamento pela metade; não pode correr nem fazer investidas."],
    ["ofuscado", "Ofuscado", "sentidos", "−1d20 em ataques e em Percepção."],
    ["paralisado", "Paralisado", "paralisia", "Imóvel e indefeso; só faz ações puramente mentais."],
    ["pasmo", "Pasmo", "mental", "Não pode fazer ações."],
    ["petrificado", "Petrificado", "combate", "Inconsciente, com resistência a dano 10."],
    ["sangrando", "Sangrando", "fisico", "No início do turno, Vigor (DT 20): passou, estabiliza; falhou, perde 1d6 PV e continua. Aliado estabiliza com ação completa e Medicina (DT 20)."],
    ["surdo", "Surdo", "sentidos", "Não faz Percepção para ouvir, −2d20 em Iniciativa e conta como condição ruim para conjurar rituais."],
    ["surpreendido", "Surpreendido", "combate", "Não percebeu os inimigos: desprevenido e não pode fazer ações."],
    ["vulneravel", "Vulnerável", "combate", "−2 na Defesa."],
  ];
  const CONDICAO_IDS = new Set(CONDICOES.map(([id]) => id));

  // Listas fixas (Livro de Regras, Sobrevivendo ao Horror, Arquivos Secretos).
  const CLASSES = ["Combatente", "Especialista", "Ocultista", "Sobrevivente"];
  const TRILHAS = {
    Combatente: [
      ["Livro de Regras", ["Aniquilador", "Comandante de Campo", "Guerreiro", "Operações Especiais", "Tropa de Choque"]],
      ["Sobrevivendo ao Horror", ["Agente Secreto", "Caçador", "Monstruoso"]],
    ],
    Especialista: [
      ["Livro de Regras", ["Atirador de Elite", "Infiltrador", "Médico de Campo", "Negociador", "Técnico"]],
      ["Sobrevivendo ao Horror", ["Bibliotecário", "Muambeiro", "Perseverante"]],
      ["Arquivos Secretos", ["Granadeiro"]],
    ],
    Ocultista: [
      ["Livro de Regras", ["Conduíte", "Flagelador", "Graduado", "Intuitivo", "Lâmina Paranormal"]],
      ["Sobrevivendo ao Horror", ["Exorcista", "Parapsicólogo", "Possuído"]],
      ["Arquivos Secretos", ["Criptologista do Oculto", "Maledictólogo"]],
    ],
    Sobrevivente: [
      ["Sobrevivendo ao Horror", ["Durão", "Esotérico", "Esperto"]],
    ],
  };
  const ORIGENS = [
    ["Livro de Regras", ["Acadêmico", "Agente de Saúde", "Amnésico", "Artista", "Atleta", "Chef", "Criminoso", "Cultista Arrependido", "Desgarrado", "Engenheiro", "Executivo", "Investigador", "Lutador", "Magnata", "Mercenário", "Militar", "Operário", "Policial", "Religioso", "Servidor Público", "T.I.", "Teórico da Conspiração", "Trabalhador Rural", "Trambiqueiro", "Universitário", "Vítima"]],
    ["Sobrevivendo ao Horror", ["Amigo dos Animais", "Astronauta", "Chef do Outro Lado", "Colegial", "Cosplayer", "Diplomata", "Experimento", "Explorador", "Fanático por Criaturas", "Fotógrafo", "Inventor Paranormal", "Jovem Místico", "Legista do Turno da Noite", "Mateiro", "Mergulhador", "Motorista", "Nerd Entusiasta", "Profetizado", "Psicólogo", "Repórter Investigativo"]],
    ["Arquivos Secretos", ["Caçador de Recompensas", "Cientista Ex-Panacea", "Cobaia Sobrevivente", "Ferido por Ritual", "Funcionário de Beira de Estrada", "Influencer Paranormal", "Segurança Ex-Panacea", "Transtornado Arrependido", "Ufólogo"]],
  ];
  // Patente pelos pontos de prestígio (PP).
  const PATENTES = [
    ["Recruta", 0],
    ["Operador", 20],
    ["Agente Especial", 50],
    ["Oficial de Operações", 100],
    ["Agente de Elite", 200],
  ];

  function habsDaTrilha(trilha) {
    const lista = (window.TRILHAS_HAB || {})[trilha];
    return Array.isArray(lista) ? lista : [];
  }

  // Mantém na ficha as habilidades da trilha escolhida até o NEX atual (a trilha começa em NEX 10%).
  // Habilidades de outra trilha (cadastradas automaticamente) saem. Retorna { add, rem }.
  function syncTrilhaHabs(sheet) {
    const antes = sheet.habilidades.length;
    sheet.habilidades = sheet.habilidades.filter((hab) => !hab.trilha || hab.trilha === sheet.trilha);
    const rem = antes - sheet.habilidades.length;
    let add = 0;
    if (sheet.trilha) {
      const limite = Math.max(sheet.nex, 10);
      habsDaTrilha(sheet.trilha).forEach(([nex, nome, custo, resumo]) => {
        if (nex > limite) return;
        if (sheet.habilidades.some((hab) => hab.trilha === sheet.trilha && hab.nome === nome)) return;
        sheet.habilidades.push(normalizeHabilidade({
          nome,
          descricao: `${custo ? `Custo: ${custo}. ` : ""}${resumo}`,
          trilha: sheet.trilha,
          nex,
        }));
        add += 1;
      });
      // ordem: habilidades da trilha por NEX, depois as demais
      const daTrilha = sheet.habilidades.filter((hab) => hab.trilha).sort((a, b) => a.nex - b.nex);
      sheet.habilidades = [...daTrilha, ...sheet.habilidades.filter((hab) => !hab.trilha)];
    }
    return { add, rem };
  }

  function avisarTrilha(sheet, mudou) {
    if (!mudou.add && !mudou.rem) return;
    const partes = [];
    if (mudou.add) partes.push(`${mudou.add} ${mudou.add === 1 ? "habilidade adicionada" : "habilidades adicionadas"}`);
    if (mudou.rem) partes.push(`${mudou.rem} da trilha anterior ${mudou.rem === 1 ? "removida" : "removidas"}`);
    op().toast?.(`${sheet.trilha || "Trilha"}: ${partes.join(", ")}. Veja na aba Habilidades.`);
  }

  function trilhasDa(classe) {
    return (TRILHAS[classe] || []).flatMap(([, nomes]) => nomes);
  }

  function patentePorPrestigio(pp) {
    return PATENTES.reduce((atual, [nome, min]) => (pp >= min ? nome : atual), PATENTES[0][0]);
  }

  // Monta um <select>; um valor antigo fora da lista continua aparecendo para não se perder.
  function optionsHtml(grupos, valor, vazio) {
    const todos = grupos.flatMap(([, nomes]) => nomes);
    const legado = valor && !todos.includes(valor) ? `<option value="${esc(valor)}" selected>${esc(valor)} (antigo)</option>` : "";
    const corpo = grupos.map(([livro, nomes]) => {
      const opts = nomes.map((nome) => `<option value="${esc(nome)}"${nome === valor ? " selected" : ""}>${esc(nome)}</option>`).join("");
      return grupos.length > 1 && livro ? `<optgroup label="${esc(livro)}">${opts}</optgroup>` : opts;
    }).join("");
    return `${vazio !== undefined ? `<option value=""${valor ? "" : " selected"}>${esc(vazio)}</option>` : ""}${legado}${corpo}`;
  }

  function classeOptions(valor) {
    return optionsHtml([["", CLASSES]], valor);
  }

  function trilhaOptions(classe, valor) {
    return optionsHtml(TRILHAS[classe] || [], valor, "Sem trilha (escolha no NEX 10%)");
  }

  function origemOptions(valor) {
    return optionsHtml(ORIGENS, valor, "Escolha a origem");
  }

  function patenteOptions(valor) {
    const legado = valor && !PATENTES.some(([nome]) => nome === valor) ? `<option value="${esc(valor)}" selected>${esc(valor)} (antigo)</option>` : "";
    return `<option value=""${valor ? "" : " selected"}>Sem patente</option>${legado}${PATENTES.map(([nome, min]) => `<option value="${esc(nome)}"${nome === valor ? " selected" : ""}>${esc(nome)} · ${min}+ PP</option>`).join("")}`;
  }

  const TABS = [
    ["geral", "Geral"],
    ["pericias", "Perícias"],
    ["combate", "Combate"],
    ["habilidades", "Habilidades"],
    ["rituais", "Rituais"],
    ["inventario", "Inventário"],
    ["relacionamentos", "Relações"],
    ["notas", "Notas"],
    ["ajuda", "Ajuda"],
  ];
  const WIDE_ONLY_TABS = ["geral", "pericias"];

  const NUMERIC_FIELDS = ["nex", "pv", "pvMax", "san", "sanMax", "pe", "peMax", "peRodada", "defesa", "deslocamento", "cargaMax", "credito", "prestigio"];
  const TEXT_FIELDS = ["nome", "jogador", "origem", "classe", "trilha", "patente", "dtRitual", "aparencia", "personalidade", "historico", "objetivo"];

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
    tab: "geral",
    wideTab: "combate",
    periciasFiltro: "todas",
    ritualAberto: "",
  };

  const catUi = {
    busca: "",
    circulo: 0,
    elemento: "todos",
    aberto: "",
    soMeus: false,
  };

  let persistTimer = 0;
  let lastCast = null;
  let lastRestore = null;

  /* ───────────── helpers ───────────── */

  function op() {
    return window.OP || {};
  }

  function esc(value) {
    return op().esc ? op().esc(value ?? "") : String(value ?? "");
  }

  function uid() {
    return op().uid ? op().uid() : `op-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }

  // Ids vão para atributos HTML e para caminhos "tipo.id.campo": só aceita caracteres seguros.
  function safeId(value) {
    const text = typeof value === "string" || typeof value === "number" ? String(value) : "";
    return /^[A-Za-z0-9_-]{1,80}$/.test(text) ? text : uid();
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
    if (value === "" || value === null || value === undefined) return fallback;
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, Math.round(number)));
  }

  function fold(text) {
    return String(text || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  }

  function catalogo() {
    return window.RITUAIS || { lista: [], get: () => null, ELEMENTOS: [], CIRCULO_ROMANO: {} };
  }

  function catalogoPorNome(nome) {
    const alvo = fold(nome);
    if (!alvo) return null;
    return catalogo().lista.find((ritual) => fold(ritual.nome) === alvo) || null;
  }

  function treinoBonus(treino) {
    return [0, 5, 10, 15][clampInt(treino, 0, 3, 0)] || 0;
  }

  // Ordem Paranormal: rola d20 iguais ao atributo e fica com o maior; com 0, rola 2d20 e fica com o pior.
  function diceCount(valor) {
    const n = clampInt(valor, 0, 5, 1);
    return n === 0 ? 2 : n;
  }

  function diceLabel(valor) {
    return clampInt(valor, 0, 5, 1) === 0 ? "2d20 pior" : `${diceCount(valor)}d20`;
  }

  const DIE_ICON = '<svg class="die-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="8.5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="8.5" cy="15.5" r="1.5" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.5" fill="currentColor"/></svg>';

  function signed(number) {
    return number >= 0 ? `+${number}` : `−${Math.abs(number)}`;
  }

  /* ───────────── normalização ───────────── */

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
    const map = new Map((Array.isArray(list) ? list : []).filter(Boolean).map((item) => [item.id, item]));
    return PERICIAS_BASE.map((base) => normalizePericia(map.get(base.id), base));
  }

  function normalizeBond(raw) {
    const source = raw || {};
    return {
      id: safeId(source.id),
      nome: String(source.nome || "Personagem"),
      foto: typeof source.foto === "string" ? source.foto : "",
      nivel: clampInt(source.nivel, -3, 3, 0),
    };
  }

  function normalizeAtaque(raw) {
    const source = raw || {};
    return {
      id: safeId(source.id),
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
      id: safeId(source.id),
      nome: String(source.nome || "Habilidade"),
      descricao: String(source.descricao || ""),
      trilha: typeof source.trilha === "string" ? source.trilha.slice(0, 60) : "",
      nex: clampInt(source.nex, 0, 99, 0),
    };
  }

  function parseCirculo(value) {
    if (typeof value === "string" && ROMANOS[value.trim().toUpperCase()]) return ROMANOS[value.trim().toUpperCase()];
    return clampInt(parseInt(value, 10), 1, 4, 1);
  }

  function parsePe(value, fallback) {
    if (typeof value === "number" && Number.isFinite(value)) return clampInt(value, 0, 99, fallback);
    const match = String(value ?? "").match(/\d+/);
    return match ? clampInt(match[0], 0, 99, fallback) : fallback;
  }

  function optionalPe(value) {
    if (value === "" || value === null || value === undefined) return null;
    const number = parsePe(value, -1);
    return number < 0 ? null : number;
  }

  /*
   * Ritual da ficha. Com `ref`, os dados vêm do catálogo (window.RITUAIS) e só guardamos
   * a escolha de elemento e as anotações. Sem `ref`, é um ritual próprio, editável.
   * Fichas antigas (campos livres custo/dt/dados/efeito) são migradas aqui.
   */
  function normalizeRitual(raw) {
    const source = raw || {};
    let base = typeof source.ref === "string" ? catalogo().get(source.ref) : null;
    const legado = !("ref" in source);
    if (!base && legado) base = catalogoPorNome(source.nome);
    const circulo = base ? base.circulo : parseCirculo(source.circulo);
    let notas = String(source.notas || "");
    if (base && legado && !notas) {
      notas = [source.dados ? `Dados: ${source.dados}` : "", source.efeito || ""].filter(Boolean).join(" — ");
    }
    let elemento = String(source.elemento || "");
    if (base) elemento = base.elementos.includes(elemento) ? elemento : base.elementos[0];
    else if (!elemento) elemento = "Outro";
    return {
      id: safeId(source.id),
      ref: base ? base.id : "",
      nome: base ? base.nome : String(source.nome || "Ritual"),
      circulo,
      elemento,
      custo: base ? base.custo : parsePe(source.custo, CUSTO_PADRAO[circulo]),
      execucao: String(source.execucao || ""),
      alcance: String(source.alcance || ""),
      alvo: String(source.alvo || ""),
      duracao: String(source.duracao || ""),
      resistencia: String(source.resistencia || ""),
      efeito: base ? "" : [source.efeito, legado && source.dados ? `Dados: ${source.dados}` : ""].filter(Boolean).join(" — "),
      discentePe: base ? null : optionalPe(source.discentePe),
      verdadeiroPe: base ? null : optionalPe(source.verdadeiroPe),
      notas,
    };
  }

  function normalizeItem(raw) {
    const source = raw || {};
    return {
      id: safeId(source.id),
      nome: String(source.nome || "Item"),
      categoria: String(source.categoria || ""),
      espacos: clampInt(source.espacos, 0, 99, 0),
      descricao: String(source.descricao || ""),
    };
  }

  function normalizeStats(raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    const conjuracoes = {};
    const lista = source.conjuracoes && typeof source.conjuracoes === "object" ? source.conjuracoes : {};
    Object.keys(lista).slice(0, 300).forEach((key) => {
      const item = lista[key] || {};
      const n = clampInt(item.n, 0, 99999, 0);
      if (n > 0) conjuracoes[safeId(key)] = { nome: String(item.nome || "Ritual").slice(0, 80), n };
    });
    return {
      pvPerdido: clampInt(source.pvPerdido, 0, 9999999, 0),
      sanPerdida: clampInt(source.sanPerdida, 0, 9999999, 0),
      peGasto: clampInt(source.peGasto, 0, 9999999, 0),
      conjuracoes,
    };
  }

  function normalizeCrise(raw) {
    const source = raw && typeof raw === "object" ? raw : {};
    const one = (value) => {
      const v = value && typeof value === "object" ? value : {};
      return { ativo: Boolean(v.ativo), marcas: clampInt(v.marcas, 0, 3, 3) };
    };
    return { morrendo: one(source.morrendo), enlouquecendo: one(source.enlouquecendo) };
  }

  // Atualiza o texto das habilidades de trilha cadastradas antes da revisão contra o livro.
  function refreshTrilhaTexts(habilidades) {
    return habilidades.map((hab) => {
      if (!hab.trilha) return hab;
      const item = habsDaTrilha(hab.trilha).find(([, nome]) => nome === hab.nome);
      if (!item) return hab;
      const [, , custo, resumo] = item;
      return { ...hab, descricao: `${custo ? `Custo: ${custo}. ` : ""}${resumo}` };
    });
  }

  function normalizeSheet(raw) {
    const source = raw || {};
    const attrs = source.atributos || {};
    const atributos = {};
    ATTR_KEYS.forEach((key) => {
      atributos[key] = clampInt(attrs[key] ?? source[key], 0, 5, 1);
    });
    const list = (value, fn) => (Array.isArray(value) ? value.map(fn) : []);
    const rituais = [];
    const refs = new Set();
    list(source.rituais, normalizeRitual).forEach((ritual) => {
      if (ritual.ref) {
        if (refs.has(ritual.ref)) return;
        refs.add(ritual.ref);
      }
      rituais.push(ritual);
    });
    return {
      id: safeId(source.id),
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
      stats: normalizeStats(source.stats),
      crise: normalizeCrise(source.crise),
      fim: ["morto", "insano"].includes(source.fim) ? source.fim : "",
      fimEm: typeof source.fimEm === "string" ? source.fimEm.slice(0, 40) : "",
      habsV: 2,
      condicoes: [...new Set((Array.isArray(source.condicoes) ? source.condicoes : []).map(String).filter((id) => CONDICAO_IDS.has(id)))],
      pericias: defaultPericias(source.pericias),
      ataques: list(source.ataques, normalizeAtaque),
      habilidades: source.habsV === 2 ? list(source.habilidades, normalizeHabilidade) : refreshTrilhaTexts(list(source.habilidades, normalizeHabilidade)),
      rituais,
      inventario: list(source.inventario, normalizeItem),
      cargaMax: clampInt(source.cargaMax, 0, 99, 5),
      credito: clampInt(source.credito, 0, 99, 0),
      prestigio: clampInt(source.prestigio, 0, 999, 0),
      dtRitual: String(source.dtRitual || ""),
      relacoes: list(source.relacoes, normalizeBond),
      vinculos: list(source.vinculos, normalizeBond),
      aparencia: String(source.aparencia || ""),
      personalidade: String(source.personalidade || ""),
      historico: String(source.historico || ""),
      objetivo: String(source.objetivo || ""),
    };
  }

  function createEmptySheet(partial = {}) {
    return normalizeSheet({
      id: uid(),
      nome: "Novo Personagem",
      classe: "Combatente",
      nex: 5,
      patente: "Recruta",
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
      cargaMax: 5,
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
      pericias: [
        { id: "investigacao", treino: 1 },
        { id: "medicina", treino: 1 },
        { id: "ocultismo", treino: 2 },
        { id: "ciencias", treino: 1 },
        { id: "vontade", treino: 1 },
        { id: "percepcao", treino: 1 },
      ],
      ataques: [
        { nome: "Adaga ritualística", teste: "Luta", dano: "1d4", critico: "19-20 / x2", especial: "Arma leve" },
      ],
      habilidades: [
        { nome: "Escolhido pelo Outro Lado", descricao: "Pode aprender e conjurar rituais conforme a classe e o NEX." },
      ],
      rituais: [
        { ref: "cicatrizacao" },
        { ref: "eletrocussao" },
        { ref: "terceiro-olho" },
      ],
      inventario: [
        { nome: "Kit médico", categoria: "Equipamento", espacos: 1, descricao: "" },
        { nome: "Grimório", categoria: "Esotérico", espacos: 1, descricao: "Anotações de rituais." },
      ],
      cargaMax: 5,
      credito: 2,
      prestigio: 1,
      dtRitual: "15",
      relacoes: [
        { nome: "Agente Cruz", foto: "", nivel: 2 },
        { nome: "Helena", foto: "", nivel: 1 },
      ],
      vinculos: [
        { nome: "Agente Cruz", foto: "", nivel: 1 },
      ],
      aparencia: "Cabelo escuro, olhar atento, jaqueta com símbolos discretos.",
      personalidade: "Curiosa, metódica e cautelosa com o Outro Lado.",
      historico: "Ficha de exemplo para demonstrar o módulo de fichas do OP-MVP.",
      objetivo: "Catalogar manifestações e proteger a equipe.",
    });
  }

  /* ───────────── armazenamento ───────────── */

  function readSheets() {
    let raw = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      return [seedXimira()];
    }
    if (!raw) {
      const seeded = [seedXimira()];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, sheets: seeded }));
      } catch (err) {
        /* sem espaço: segue só em memória */
      }
      return seeded;
    }
    try {
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.sheets)) return [];
      return data.sheets.map(normalizeSheet);
    } catch (err) {
      return [];
    }
  }

  const sheetsState = { sheets: readSheets() };

  function persistSheets() {
    window.clearTimeout(persistTimer);
    persistTimer = 0;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, sheets: sheetsState.sheets }));
      return true;
    } catch (err) {
      window.alert("Não foi possível salvar as fichas neste navegador. O espaço para imagens pode ter acabado — tente fotos menores ou exporte as fichas.");
      return false;
    }
  }

  // Digitação salva com um pequeno atraso para não regravar todas as fichas (com imagens) a cada tecla.
  function schedulePersist() {
    window.clearTimeout(persistTimer);
    persistTimer = window.setTimeout(persistSheets, 350);
  }

  function flush() {
    if (persistTimer) persistSheets();
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
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    window.setTimeout(() => {
      link.remove();
      URL.revokeObjectURL(url);
    }, 1500);
  }

  function slugName(name) {
    return fold(cleanName(name)).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "ficha";
  }

  function saveAndRender(keepScroll = true) {
    const ok = persistSheets();
    op().render?.({ keepScroll });
    return ok;
  }

  /* ───────────── peças de interface ───────────── */

  function portraitHtml(sheet, className) {
    const safe = imgSrc(sheet.imagem);
    if (safe) return `<img class="${className}" alt="" decoding="async" src="${safe}">`;
    return `<div class="${className} sheet-portrait-fallback" aria-hidden="true">${esc(initials(sheet.nome))}</div>`;
  }

  const SKULL = "\u2620\uFE0E";

  // nivel vai de −3 (três caveiras, laço negativo) a +3 (três corações).
  function heartsHtml(nivel, list, bondId) {
    const negative = nivel < 0;
    const amount = Math.abs(nivel);
    const icons = [1, 2, 3].map((step) => {
      const level = negative ? -step : step;
      const filled = amount >= step;
      const label = negative
        ? `${step} ${step === 1 ? "caveira" : "caveiras"}`
        : `${step} ${step === 1 ? "coração" : "corações"}`;
      return `<button type="button" class="heart-btn${negative ? " is-skull" : ""}${filled ? " is-filled" : ""}" data-action="sheet-set-heart" data-list="${esc(list)}" data-id="${esc(bondId)}" data-level="${level}" aria-label="${label}" aria-pressed="${filled ? "true" : "false"}">${negative ? SKULL : "♥"}</button>`;
    }).join("");
    const step = (delta, sign, label) => `<button type="button" class="bond-step" data-action="sheet-bond-step" data-list="${esc(list)}" data-id="${esc(bondId)}" data-delta="${delta}" aria-label="${label}"${(delta < 0 ? nivel <= -3 : nivel >= 3) ? " disabled" : ""}>${sign}</button>`;
    return `
      <div class="bond-level${negative ? " is-negative" : ""}">
        <div class="hearts" role="group" aria-label="Nível do laço">${icons}</div>
        <div class="bond-steps">
          ${step(-1, "−", "Piorar laço")}
          ${step(1, "+", "Melhorar laço")}
        </div>
      </div>
      <span class="bond-mood">${esc(bondMood(nivel))}</span>
    `;
  }

  function bondMood(nivel) {
    return { "-3": "Inimigo", "-2": "Hostil", "-1": "Desconfiança", 0: "Neutro", 1: "Simpatia", 2: "Amizade", 3: "Laço forte" }[nivel] || "Neutro";
  }

  function bondIcons(nivel) {
    if (nivel < 0) return `${SKULL.repeat(-nivel)} · ${bondMood(nivel)}`;
    return `${"♥".repeat(nivel)}${"♡".repeat(3 - nivel)} · ${bondMood(nivel)}`;
  }

  function withSheetNote(content) {
    return `${content}<p class="save-note">Fichas salvas neste navegador. Use Exportar para levar a outro dispositivo.</p>`;
  }

  function emptyBlock(title, text) {
    return `<div class="empty">${title ? `<h3>${esc(title)}</h3>` : ""}<p>${esc(text)}</p></div>`;
  }

  function renderSheetsList() {
    const cards = sheetsState.sheets.length
      ? `<div class="campaign-grid sheet-grid">${sheetsState.sheets.map(renderSheetCard).join("")}</div>`
      : emptyBlock("Nenhuma ficha ainda", "Crie a primeira ou importe um arquivo JSON.");

    return withSheetNote(`
      <div class="page-head">
        <div>
          <button type="button" class="btn btn-ghost btn-back" data-action="go-hub">‹ Início</button>
          <p class="kicker">Ordem Paranormal</p>
          <h2>Fichas</h2>
          <p class="lede">Abra um personagem para controlar vida, sanidade, PE, rituais e relacionamentos durante a sessão.</p>
        </div>
        <div class="head-actions">
          <button type="button" class="btn btn-primary" data-action="sheet-new">Nova ficha</button>
          <button type="button" class="btn btn-ghost" data-action="open-initiative">Iniciativa</button>
          <button type="button" class="btn btn-ghost" data-action="sheet-import">Importar</button>
          <button type="button" class="btn btn-ghost" data-action="sheet-export-all"${sheetsState.sheets.length ? "" : " disabled"}>Exportar todas</button>
          <input id="sheet-import-input" type="file" accept="application/json,.json" hidden>
        </div>
      </div>
      ${cards}
    `);
  }

  function miniBar(kind, current, max) {
    const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
    return `<span class="mini-vital mini-${kind}"><span class="mini-label">${VITALS[kind].sigla} ${current}/${max}</span><span class="mini-track"><span style="width:${pct}%"></span></span></span>`;
  }

  function renderSheetCard(sheet) {
    return `
      <article class="campaign-card sheet-card">
        <div class="card-open sheet-card-open" role="button" tabindex="0" data-action="open-sheet" data-id="${esc(sheet.id)}">
          ${portraitHtml(sheet, "sheet-card-portrait")}
          <div class="card-copy">
            <h3>${esc(sheet.nome)}</h3>
            <p>${esc(sheet.classe || "Sem classe")} · NEX ${sheet.nex}%</p>
            <p>${esc(sheet.jogador ? `Jogador: ${sheet.jogador}` : "Sem jogador")}</p>
            <div class="mini-vitals">
              ${miniBar("pv", sheet.pv, sheet.pvMax)}
              ${miniBar("san", sheet.san, sheet.sanMax)}
              ${miniBar("pe", sheet.pe, sheet.peMax)}
            </div>
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
      <div class="attr-node attr-${style}">
        <span class="attr-label">${ATTR_LABELS[key]}</span>
        <input class="attr-input" type="number" inputmode="numeric" min="0" max="5" data-sheet-field="atributos.${key}" value="${sheet.atributos[key]}" aria-label="${ATTR_NAMES[key]}">
        <span class="attr-name">${ATTR_NAMES[key]}</span>
        <button type="button" class="attr-roll${sheet.atributos[key] === 0 ? " is-worst" : ""}" data-action="sheet-roll" data-attr="${key}" data-attr-dice="${key}" aria-label="Rolar ${ATTR_NAMES[key]}: ${diceLabel(sheet.atributos[key])}">${DIE_ICON}<span>${diceLabel(sheet.atributos[key])}</span></button>
      </div>
    `).join("");
  }

  /* ───────────── estatísticas e crise ───────────── */

  const STAT_KEY = { pv: "pvPerdido", san: "sanPerdida", pe: "peGasto" };

  // Soma o que foi perdido em PV/SAN/PE para a tela final.
  function registrarPerda(sheet, kind, antes, depois) {
    if (STAT_KEY[kind] && depois < antes) sheet.stats[STAT_KEY[kind]] += antes - depois;
  }

  function desfazerPerda(sheet, kind, valor) {
    if (STAT_KEY[kind]) sheet.stats[STAT_KEY[kind]] = Math.max(0, sheet.stats[STAT_KEY[kind]] - valor);
  }

  const CRISE = {
    morrendo: {
      kind: "pv",
      titulo: "Morrendo",
      fim: "morto",
      icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.4C.9 8 3.2 4 7 4c2.1 0 3.6 1.1 5 2.9C13.4 5.1 14.9 4 17 4c3.8 0 6.1 4 4.6 7.6C19.5 16.4 12 21 12 21z" fill="currentColor"/></svg>',
      perda: "Falhou / começou o turno morrendo",
      sair: "Estabilizado ou curado",
      texto: (nome) => `
        <p><strong>${esc(nome)}</strong> chegou a 0 PV e está <strong>morrendo</strong>: cai inconsciente, sangrando à beira da morte.</p>
        <ul>
          <li>Cada vez que começar um turno ainda morrendo, apague <strong>uma marca</strong>. Os turnos não precisam ser seguidos.</li>
          <li>Se as <strong>3 marcas</strong> se apagarem na mesma cena, o personagem <strong>morre</strong>.</li>
          <li>Para sair: um aliado estabiliza com <strong>Medicina (DT 20)</strong>, ou um efeito específico (cura, habilidade).</li>
        </ul>`,
    },
    enlouquecendo: {
      kind: "san",
      titulo: "Enlouquecendo",
      fim: "insano",
      icone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5C6.5 5 2.6 9.2 1.5 12c1.1 2.8 5 7 10.5 7s9.4-4.2 10.5-7C21.4 9.2 17.5 5 12 5z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3.6" fill="currentColor"/></svg>',
      perda: "Falhou / começou o turno enlouquecendo",
      sair: "Acalmado",
      texto: (nome) => `
        <p><strong>${esc(nome)}</strong> chegou a 0 de Sanidade e está <strong>enlouquecendo</strong>: a mente cede ao Outro Lado.</p>
        <ul>
          <li>Cada vez que começar um turno ainda enlouquecendo, apague <strong>uma marca</strong>. Os turnos não precisam ser seguidos.</li>
          <li>Se as <strong>3 marcas</strong> se apagarem na mesma cena, o personagem fica <strong>insano</strong> e vira um NPC.</li>
          <li>Para sair: um aliado pode acalmá-lo com <strong>Diplomacia (DT 20, +5 a cada vez que já foi acalmado na cena)</strong>, ou algo que recupere SAN.</li>
        </ul>`,
    },
  };

  // Recuperou PV/SAN acima de 0: sai do estado e as marcas voltam.
  function syncCrise(sheet) {
    Object.entries(CRISE).forEach(([tipo, def]) => {
      if (sheet[def.kind] > 0 && sheet.crise[tipo].ativo) sheet.crise[tipo] = { ativo: false, marcas: 3 };
    });
  }

  function marcasHtml(tipo, marcas, interativo) {
    const def = CRISE[tipo];
    return [1, 2, 3].map((n) => {
      const on = marcas >= n;
      const attrs = interativo ? ` data-action="crise-marca" data-tipo="${tipo}" data-level="${n}" aria-label="Marca ${n}${on ? " (ativa)" : " (apagada)"}" aria-pressed="${on ? "true" : "false"}"` : ' aria-hidden="true"';
      return `<${interativo ? 'button type="button"' : "span"} class="crise-marca${on ? " is-on" : ""}"${attrs}>${def.icone}</${interativo ? "button" : "span"}>`;
    }).join("");
  }

  function criseBarHtml(sheet) {
    if (sheet.fim) {
      const morto = sheet.fim === "morto";
      return `
        <div class="crise-bar" id="sheet-crise">
          <button type="button" class="crise-btn crise-fim crise-${morto ? "morrendo" : "enlouquecendo"}" data-action="crise-final">
            <span class="crise-btn-title">${morto ? "Em memória" : "Insano"}</span>
            <span class="crise-btn-sub">${morto ? "Ver homenagem e estatísticas" : "Ver regras de insanidade"}</span>
          </button>
        </div>`;
    }
    const botoes = Object.entries(CRISE).map(([tipo, def]) => {
      const estado = sheet.crise[tipo];
      if (sheet[def.kind] > 0 && !estado.ativo) return "";
      if (!estado.ativo) {
        return `<button type="button" class="crise-btn crise-${tipo} is-alert" data-action="crise-abrir" data-tipo="${tipo}">
          <span class="crise-btn-title">${def.titulo}</span>
          <span class="crise-btn-sub">${def.kind === "pv" ? "PV" : "SAN"} zerou · toque para entrar</span>
        </button>`;
      }
      return `<button type="button" class="crise-btn crise-${tipo} is-active" data-action="crise-abrir" data-tipo="${tipo}">
          <span class="crise-btn-title">${def.titulo}</span>
          <span class="crise-marcas crise-marcas-sm">${marcasHtml(tipo, estado.marcas, false)}</span>
        </button>`;
    }).join("");
    return botoes ? `<div class="crise-bar" id="sheet-crise">${botoes}</div>` : "";
  }

  function renderCriseModal(sheet, tipo) {
    const def = CRISE[tipo];
    const estado = sheet.crise[tipo];
    return `
      <div class="modal-backdrop">
        <div class="modal modal-sheet crise-modal crise-${tipo}" role="dialog" aria-modal="true" aria-labelledby="crise-title">
          <header class="modal-head">
            <h2 id="crise-title">${def.titulo}</h2>
            <button type="button" class="icon-btn" data-action="close-modal" aria-label="Fechar">✕</button>
          </header>
          <div class="crise-texto">${def.texto(sheet.nome)}</div>
          <div class="crise-marcas" role="group" aria-label="Marcas restantes">${marcasHtml(tipo, estado.marcas, true)}</div>
          <p class="crise-restam" aria-live="polite">${estado.marcas === 1 ? "Última marca!" : `${estado.marcas} marcas restantes`}</p>
          <div class="crise-acoes">
            <button type="button" class="btn btn-danger" data-action="crise-falha" data-tipo="${tipo}">${esc(def.perda)} (−1)</button>
            <button type="button" class="btn btn-ghost" data-action="crise-sair" data-tipo="${tipo}">${esc(def.sair)}</button>
          </div>
        </div>
      </div>
    `;
  }

  function topRituais(sheet) {
    return Object.values(sheet.stats.conjuracoes).sort((a, b) => b.n - a.n).slice(0, 3);
  }

  function renderFinalModal(sheet) {
    const morto = sheet.fim === "morto";
    const jogador = sheet.jogador ? esc(sheet.jogador) : "você";
    const desfazer = `<button type="button" class="btn btn-ghost btn-small" data-action="crise-reverter">Desfazer (foi engano)</button>`;
    if (morto) {
      const top = topRituais(sheet);
      const rituais = top.length
        ? `<ol class="final-rituais">${top.map((r) => `<li><span>${esc(r.nome)}</span><b>${r.n}×</b></li>`).join("")}</ol>`
        : `<p class="hint">Nenhum ritual conjurado pela ficha.</p>`;
      return `
        <div class="modal-backdrop final-backdrop">
          <div class="modal final-modal final-morto" role="dialog" aria-modal="true" aria-labelledby="final-title">
            <button type="button" class="icon-btn final-close" data-action="close-modal" aria-label="Fechar">✕</button>
            <div class="final-portrait">${portraitHtml(sheet, "final-photo")}</div>
            <p class="final-kicker">Em memória de</p>
            <h2 id="final-title">${esc(sheet.nome)}</h2>
            <p class="final-meta">${esc([sheet.classe, `NEX ${sheet.nex}%`, sheet.patente].filter(Boolean).join(" · "))}</p>
            <p class="final-agradece">Obrigado, ${jogador}, por dar vida a ${esc(sheet.nome)}. Cada escolha, cada medo enfrentado e cada risco corrido fizeram parte desta história. A Ordem não esquece quem ficou no caminho.</p>
            <div class="final-stats">
              <div class="final-stat stat-san"><b>${sheet.stats.sanPerdida}</b><span>Sanidade perdida</span></div>
              <div class="final-stat stat-pe"><b>${sheet.stats.peGasto}</b><span>PE gastos</span></div>
              <div class="final-stat stat-pv"><b>${sheet.stats.pvPerdido}</b><span>Vida perdida</span></div>
            </div>
            <h3 class="final-sub">Rituais mais usados</h3>
            ${rituais}
            <div class="final-acoes">${desfazer}</div>
          </div>
        </div>
      `;
    }
    return `
      <div class="modal-backdrop final-backdrop">
        <div class="modal final-modal final-insano" role="dialog" aria-modal="true" aria-labelledby="final-title">
          <button type="button" class="icon-btn final-close" data-action="close-modal" aria-label="Fechar">✕</button>
          <p class="final-kicker">O Outro Lado venceu</p>
          <h2 id="final-title">${esc(sheet.nome)} está insano</h2>
          <div class="final-regras">
            <h3>Regra do livro</h3>
            <ul>
              <li><strong>Vira NPC:</strong> quem começa três turnos enlouquecendo na mesma cena fica insano — o personagem passa a ser controlado pelo mestre.</li>
            </ul>
            <h3>Sugestões para a mesa (opcional, não são regra)</h3>
            <ul>
              <li><strong>Sem volta na missão:</strong> para o grupo, ele está perdido até o fim da missão.</li>
              <li><strong>Pode virar ameaça:</strong> o mestre decide como a loucura se manifesta — fuga, delírio, violência ou entrega total ao Paranormal.</li>
              <li><strong>Equipamento e pistas:</strong> o que ele carregava pode ser recuperado pelo grupo, se conseguirem contê-lo.</li>
              <li><strong>Novo agente:</strong> o jogador cria outro personagem para seguir na campanha, no NEX combinado com o mestre.</li>
              <li><strong>Regra da mesa:</strong> se o mestre permitir, um tratamento longo entre missões pode trazer o personagem de volta — mas ele nunca é o mesmo.</li>
            </ul>
          </div>
          <div class="final-acoes">${desfazer}</div>
        </div>
      </div>
    `;
  }

  function refreshCrise(sheet) {
    const atual = document.getElementById("sheet-crise");
    const html = criseBarHtml(sheet);
    if (atual) atual.outerHTML = html || "";
    else if (html) document.getElementById("sheet-markers")?.insertAdjacentHTML("afterend", html);
  }

  /* ───────────── marcadores ───────────── */

  // Selo automático de cada barra, calculado pelos valores atuais.
  function vitalFlag(sheet, kind) {
    const atual = sheet[kind];
    const max = sheet[`${kind}Max`];
    if (max <= 0) return null;
    if (kind === "pv") {
      if (atual <= 0) return { tone: "danger", texto: "Morrendo", info: "PV 0: morrendo. Se começar 3 turnos morrendo na mesma cena (não precisam ser seguidos), o personagem morre." };
      if (atual <= max / 2) return { tone: "warn", texto: "Machucado", info: "Metade dos PV ou menos." };
    }
    if (kind === "san") {
      if (atual <= 0) return { tone: "danger", texto: "Enlouquecendo", info: "SAN 0: enlouquecendo. Precisa ser acalmado antes do fim da cena." };
      if (atual <= max / 4) return { tone: "warn", texto: "Baixa", info: "Um quarto da Sanidade ou menos." };
    }
    if (kind === "pe" && atual <= 0) return { tone: "warn", texto: "Esgotado", info: "Sem PE para habilidades e rituais." };
    return null;
  }

  function autoMarkers(sheet) {
    const list = ["pv", "san", "pe"].map((kind) => {
      const flag = vitalFlag(sheet, kind);
      return flag ? { ...flag, id: `auto-${kind}`, sigla: VITALS[kind].sigla } : null;
    }).filter(Boolean);
    const carga = cargaAtual(sheet);
    if (carga > sheet.cargaMax) {
      const muito = carga > sheet.cargaMax * 2;
      list.push({
        id: "auto-carga",
        tone: muito ? "danger" : "warn",
        texto: muito ? "Carga excessiva" : "Sobrecarregado",
        info: muito ? "Mais que o dobro da carga: não consegue se mover." : "Acima da carga: −5 na Defesa e −3m de deslocamento.",
        sigla: "Carga",
      });
    }
    return list;
  }

  function markersRowHtml(sheet) {
    const auto = autoMarkers(sheet).filter((m) => !(m.tone === "danger" && (m.id === "auto-pv" || m.id === "auto-san"))).map((m) => `<button type="button" class="marker marker-${m.tone}" data-action="sheet-conditions" title="${esc(m.info)}"><span class="marker-dot" aria-hidden="true"></span>${esc(m.texto)}</button>`);
    const manual = sheet.condicoes.map((id) => {
      const cond = CONDICOES.find(([cid]) => cid === id);
      return cond ? `<button type="button" class="marker marker-cond" data-action="sheet-conditions" title="${esc(cond[3])}">${esc(cond[1])}</button>` : "";
    });
    const total = sheet.condicoes.length;
    return `
      <div class="markers-row" id="sheet-markers" aria-label="Marcadores e condições">
        ${auto.join("")}${manual.join("")}
        <button type="button" class="marker marker-add" data-action="sheet-conditions">${total ? "Condições" : "+ Condição"}</button>
        <button type="button" class="marker marker-restore" data-action="sheet-restore" title="Encher PV, SAN e PE até o máximo"${sheet.pv >= sheet.pvMax && sheet.san >= sheet.sanMax && sheet.pe >= sheet.peMax ? " disabled" : ""}>↺ Restaurar tudo</button>
      </div>
    `;
  }

  function refreshMarkers(sheet) {
    const row = document.getElementById("sheet-markers");
    if (row) row.outerHTML = markersRowHtml(sheet);
  }

  function renderConditionsModal(sheet) {
    const auto = autoMarkers(sheet);
    const autoHtml = auto.length
      ? `<ul class="cond-auto">${auto.map((m) => `<li class="marker-${m.tone}"><strong>${esc(m.texto)}</strong><span>${esc(m.info)}</span></li>`).join("")}</ul>`
      : `<p class="hint">Nenhum marcador automático agora.</p>`;
    const items = CONDICOES.map(([id, nome, , efeito]) => {
      const on = sheet.condicoes.includes(id);
      return `
        <button type="button" class="cond-item${on ? " is-on" : ""}" data-action="sheet-toggle-condition" data-id="${id}" aria-pressed="${on ? "true" : "false"}">
          <span class="cond-check" aria-hidden="true">${on ? "✓" : ""}</span>
          <span class="cond-text"><strong>${esc(nome)}</strong><small>${esc(efeito)}</small></span>
        </button>
      `;
    }).join("");
    return `
      <div class="modal-backdrop">
        <div class="modal modal-sheet cond-modal" role="dialog" aria-modal="true" aria-labelledby="cond-title">
          <header class="modal-head">
            <h2 id="cond-title">Marcadores</h2>
            <button type="button" class="icon-btn" data-action="close-modal" aria-label="Fechar">✕</button>
          </header>
          <h3 class="cond-sub">Automáticos</h3>
          ${autoHtml}
          <div class="cond-head">
            <h3 class="cond-sub">Condições</h3>
            ${sheet.condicoes.length ? `<button type="button" class="btn btn-ghost btn-small" data-action="sheet-clear-conditions">Limpar todas</button>` : ""}
          </div>
          <div class="cond-list">${items}</div>
        </div>
      </div>
    `;
  }

  function vitalHtml(sheet, kind) {
    const info = VITALS[kind];
    const current = sheet[kind];
    const max = sheet[`${kind}Max`];
    const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;
    const flag = vitalFlag(sheet, kind);
    return `
      <div class="vital vital-${kind}${flag ? ` has-flag flag-${flag.tone}` : ""}">
        ${flag ? `<span class="vital-flag" title="${esc(flag.info)}">${esc(flag.texto)}</span>` : ""}
        <button type="button" class="vital-main" data-action="sheet-vital-edit" data-kind="${kind}" aria-label="Editar ${info.nome}: ${current} de ${max}">
          <span class="vital-label">${info.sigla}<span class="vital-name"> · ${info.nome}</span></span>
          <span class="vital-value"><b>${current}</b><span>/${max}</span></span>
          <span class="vital-track" aria-hidden="true"><span style="width:${pct}%"></span></span>
        </button>
        <div class="vital-steps">
          <button type="button" class="step-btn" data-action="sheet-resource" data-kind="${kind}" data-delta="-1" aria-label="Diminuir ${info.nome}">−</button>
          <button type="button" class="step-btn" data-action="sheet-resource" data-kind="${kind}" data-delta="1" aria-label="Aumentar ${info.nome}">+</button>
        </div>
      </div>
    `;
  }

  function renderVitalForm(sheet, kind) {
    const info = VITALS[kind];
    const deltas = [-10, -5, -1, 1, 5, 10];
    return `
      <div class="modal-backdrop">
        <form class="modal modal-sheet vital-form vital-${kind}" id="vital-form" data-kind="${kind}" novalidate role="dialog" aria-modal="true" aria-labelledby="vital-form-title">
          <header class="modal-head">
            <h2 id="vital-form-title">${info.nome}</h2>
            <button type="button" class="icon-btn" data-action="close-modal" aria-label="Fechar">✕</button>
          </header>
          <div class="vital-form-values">
            <label class="field"><span>Atual</span><input name="atual" type="number" inputmode="numeric" min="0" max="9999" value="${sheet[kind]}" data-autofocus></label>
            <span class="vital-form-sep" aria-hidden="true">/</span>
            <label class="field"><span>Máximo</span><input name="max" type="number" inputmode="numeric" min="0" max="9999" value="${sheet[`${kind}Max`]}"></label>
          </div>
          <div class="quick-row" role="group" aria-label="Ajuste rápido">
            ${deltas.map((delta) => `<button type="button" class="chip" data-action="vital-quick" data-delta="${delta}">${signed(delta)}</button>`).join("")}
          </div>
          <div class="quick-row">
            <button type="button" class="chip" data-action="vital-quick" data-fill="0">Zerar</button>
            <button type="button" class="chip" data-action="vital-quick" data-fill="1">Encher</button>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" data-action="close-modal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    `;
  }

  /* ───────────── rolagem de dados ───────────── */

  let lastRoll = null;
  let rollTimer = 0;

  function d20() {
    if (globalThis.crypto?.getRandomValues) {
      const buf = new Uint32Array(1);
      // descarta o topo para não enviesar o resultado
      do { crypto.getRandomValues(buf); } while (buf[0] >= 4294967280);
      return (buf[0] % 20) + 1;
    }
    return Math.floor(Math.random() * 20) + 1;
  }

  function openRoll(spec) {
    lastRoll = spec;
    window.clearInterval(rollTimer);
    const count = diceCount(spec.valor);
    const pior = clampInt(spec.valor, 0, 5, 1) === 0;
    const results = Array.from({ length: count }, d20);
    const kept = pior ? Math.min(...results) : Math.max(...results);
    const keptIndex = results.indexOf(kept);
    const total = kept + (spec.bonus || 0);
    const formula = `${diceLabel(spec.valor)}${spec.bonus ? ` ${spec.bonus > 0 ? "+" : "−"} ${Math.abs(spec.bonus)}` : ""}`;
    const nota = kept === 20 ? "Natural 20!" : kept === 1 ? "Natural 1" : "";
    const dice = results.map((_, index) => `<span class="die" data-die="${index}" style="--i:${index}"><b>?</b></span>`).join("");

    op().openModal?.(`
      <div class="modal-backdrop">
        <div class="modal roll-modal is-rolling" role="dialog" aria-modal="true" aria-labelledby="roll-title">
          <header class="modal-head">
            <div>
              <p class="roll-kicker">${esc(ATTR_LABELS[spec.attr] || "")} · ${esc(formula)}</p>
              <h2 id="roll-title">${esc(spec.titulo)}</h2>
            </div>
            <button type="button" class="icon-btn" data-action="close-modal" aria-label="Fechar">✕</button>
          </header>
          <div class="dice-tray">${dice}</div>
          <p class="roll-rule">${pior ? "Atributo 0: rola 2d20 e fica com o <strong>pior</strong>." : `Fica com o <strong>maior</strong> de ${count} ${count === 1 ? "dado" : "dados"}.`}</p>
          <div class="roll-result" aria-live="polite">
            <span class="roll-total">—</span>
            <span class="roll-detail"></span>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" data-action="close-modal">Fechar</button>
            <button type="button" class="btn btn-primary" data-action="roll-again">Rolar de novo</button>
          </div>
        </div>
      </div>
    `);

    const modal = document.querySelector(".roll-modal");
    if (!modal) return;
    const faces = [...modal.querySelectorAll(".die b")];
    const finish = () => {
      window.clearInterval(rollTimer);
      modal.classList.remove("is-rolling");
      faces.forEach((face, index) => {
        face.textContent = results[index];
        const die = face.parentElement;
        die.classList.toggle("is-kept", index === keptIndex);
        die.classList.toggle("is-dropped", index !== keptIndex);
        die.classList.toggle("is-crit", results[index] === 20);
        die.classList.toggle("is-fumble", results[index] === 1);
      });
      modal.querySelector(".roll-total").textContent = total;
      modal.querySelector(".roll-detail").textContent = [spec.bonus ? `dado ${kept} ${spec.bonus > 0 ? "+" : "−"} ${Math.abs(spec.bonus)}` : "", nota].filter(Boolean).join(" · ");
      modal.classList.toggle("is-crit", kept === 20);
      modal.classList.toggle("is-fumble", kept === 1);
    };
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    const start = Date.now();
    rollTimer = window.setInterval(() => {
      if (!document.body.contains(modal)) { window.clearInterval(rollTimer); return; }
      if (Date.now() - start > 750) { finish(); return; }
      faces.forEach((face) => { face.textContent = d20(); });
    }, 60);
  }

  /* ───────────── perícias ───────────── */

  function periciaTotal(pericia) {
    return treinoBonus(pericia.treino) + pericia.outros;
  }

  function renderPericias(sheet) {
    const filtered = sheet.pericias.filter((pericia) => sheetUi.periciasFiltro !== "treinadas" || pericia.treino > 0);
    const rows = filtered.map((pericia) => {
      const pips = [1, 2, 3].map((level) => `<button type="button" class="pip${pericia.treino >= level ? " is-on" : ""}" data-action="sheet-treino" data-id="${esc(pericia.id)}" data-level="${level}" aria-label="${esc(pericia.nome)}: ${["", "treinado", "veterano", "expert"][level]}" aria-pressed="${pericia.treino >= level ? "true" : "false"}"></button>`).join("");
      return `
        <div class="pericia-row${pericia.treino > 0 ? " is-trained" : ""}">
          <span class="pericia-name">${esc(pericia.nome)}${pericia.soTreinada ? '<abbr title="Somente treinada">*</abbr>' : ""}<small>${ATTR_LABELS[pericia.attr]} · <span data-attr-dice-text="${pericia.attr}">${diceLabel(sheet.atributos[pericia.attr])}</span></small></span>
          <div class="pericia-pips">${pips}</div>
          <input class="pericia-outros" type="number" inputmode="numeric" min="-99" max="99" data-sheet-field="pericia.${esc(pericia.id)}.outros" value="${pericia.outros}" aria-label="Outros bônus de ${esc(pericia.nome)}">
          <strong class="pericia-total">${signed(periciaTotal(pericia))}</strong>
          <button type="button" class="pericia-roll" data-action="sheet-roll" data-pericia="${esc(pericia.id)}" aria-label="Rolar ${esc(pericia.nome)}">${DIE_ICON}</button>
        </div>
      `;
    }).join("");

    return `
      <section class="sheet-panel pericias-panel">
        <div class="seg" role="group" aria-label="Filtro de perícias">
          <button type="button" class="seg-btn${sheetUi.periciasFiltro === "todas" ? " is-active" : ""}" data-action="sheet-pericias-filtro" data-id="todas">Todas</button>
          <button type="button" class="seg-btn${sheetUi.periciasFiltro === "treinadas" ? " is-active" : ""}" data-action="sheet-pericias-filtro" data-id="treinadas">Treinadas</button>
        </div>
        <div class="pericia-head" aria-hidden="true">
          <span>Perícia</span>
          <span>Treino</span>
          <span>Extra</span>
          <span>Total</span>
          <span>Rolar</span>
        </div>
        <div class="pericia-list">${rows || `<p class="hint">Nenhuma perícia treinada.</p>`}</div>
        <p class="hint pericia-foot">* somente treinada. Cada grau de treino soma +5. Role d20 iguais ao atributo e fique com o maior; atributo 0 rola 2d20 e fica com o pior.</p>
      </section>
    `;
  }

  /* ───────────── combate, habilidades, inventário ───────────── */

  function renderAtaques(sheet) {
    const rows = sheet.ataques.map((ataque) => `
      <article class="entry-card">
        <div class="entry-grid">
          <label class="field field-span"><span>Nome</span><input data-sheet-field="ataque.${esc(ataque.id)}.nome" value="${esc(ataque.nome)}"></label>
          <label class="field"><span>Teste</span><input data-sheet-field="ataque.${esc(ataque.id)}.teste" value="${esc(ataque.teste)}"></label>
          <label class="field"><span>Dano</span><input data-sheet-field="ataque.${esc(ataque.id)}.dano" value="${esc(ataque.dano)}"></label>
          <label class="field"><span>Crítico</span><input data-sheet-field="ataque.${esc(ataque.id)}.critico" value="${esc(ataque.critico)}"></label>
          <label class="field"><span>Especial</span><input data-sheet-field="ataque.${esc(ataque.id)}.especial" value="${esc(ataque.especial)}"></label>
        </div>
        <button type="button" class="btn btn-danger btn-small" data-action="sheet-remove-ataque" data-id="${esc(ataque.id)}">Remover</button>
      </article>
    `).join("");
    return `
      <div class="tab-toolbar">
        <h3>Ataques</h3>
        <button type="button" class="btn btn-primary btn-small" data-action="sheet-add-ataque">Adicionar ataque</button>
      </div>
      <div class="entry-list">${rows || emptyBlock("", "Nenhum ataque cadastrado.")}</div>
    `;
  }

  function renderHabilidades(sheet) {
    const rows = sheet.habilidades.map((hab) => `
      <article class="entry-card${hab.trilha ? " is-trilha" : ""}">
        ${hab.trilha ? `<p class="hab-badge">Trilha ${esc(hab.trilha)} · NEX ${hab.nex}%</p>` : ""}
        <label class="field"><span>Nome</span><input data-sheet-field="habilidade.${esc(hab.id)}.nome" value="${esc(hab.nome)}"></label>
        <label class="field"><span>Descrição</span><textarea rows="3" data-sheet-field="habilidade.${esc(hab.id)}.descricao">${esc(hab.descricao)}</textarea></label>
        <button type="button" class="btn btn-danger btn-small" data-action="sheet-remove-habilidade" data-id="${esc(hab.id)}">Remover</button>
      </article>
    `).join("");
    return `
      <div class="tab-toolbar">
        <div>
          <h3>Habilidades</h3>
          ${sheet.trilha ? `<p class="meta">Trilha ${esc(sheet.trilha)}: as habilidades entram sozinhas conforme o NEX sobe.</p>` : `<p class="meta">Escolha uma trilha na aba Geral para cadastrar as habilidades dela.</p>`}
        </div>
        <button type="button" class="btn btn-primary btn-small" data-action="sheet-add-habilidade">Adicionar habilidade</button>
      </div>
      <div class="entry-list">${rows || emptyBlock("", "Nenhuma habilidade cadastrada.")}</div>
    `;
  }

  function cargaAtual(sheet) {
    return sheet.inventario.reduce((sum, item) => sum + item.espacos, 0);
  }

  function cargaLabel(sheet) {
    return `${cargaAtual(sheet)} / ${sheet.cargaMax}`;
  }

  function renderInventario(sheet) {
    const rows = sheet.inventario.map((item) => `
      <article class="entry-card">
        <div class="entry-grid">
          <label class="field field-span"><span>Item</span><input data-sheet-field="item.${esc(item.id)}.nome" value="${esc(item.nome)}"></label>
          <label class="field"><span>Categoria</span><input data-sheet-field="item.${esc(item.id)}.categoria" value="${esc(item.categoria)}"></label>
          <label class="field"><span>Espaços</span><input type="number" inputmode="numeric" min="0" max="99" data-sheet-field="item.${esc(item.id)}.espacos" value="${item.espacos}"></label>
          <label class="field field-span"><span>Descrição</span><input data-sheet-field="item.${esc(item.id)}.descricao" value="${esc(item.descricao)}"></label>
        </div>
        <button type="button" class="btn btn-danger btn-small" data-action="sheet-remove-item" data-id="${esc(item.id)}">Remover</button>
      </article>
    `).join("");
    const over = cargaAtual(sheet) > sheet.cargaMax;
    return `
      <div class="stat-grid">
        <div class="stat-box${over ? " is-over" : ""}" id="carga-box"><span>Carga</span><strong id="carga-display">${cargaLabel(sheet)}</strong></div>
        <label class="stat-box"><span>Carga máx.</span><input type="number" inputmode="numeric" min="0" max="99" data-sheet-field="cargaMax" value="${sheet.cargaMax}"></label>
        <label class="stat-box"><span>Crédito</span><input type="number" inputmode="numeric" min="0" max="99" data-sheet-field="credito" value="${sheet.credito}"></label>
        <label class="stat-box"><span>Prestígio</span><input type="number" inputmode="numeric" min="0" max="999" data-sheet-field="prestigio" value="${sheet.prestigio}"></label>
      </div>
      <div class="tab-toolbar">
        <h3>Itens</h3>
        <button type="button" class="btn btn-primary btn-small" data-action="sheet-add-item">Adicionar item</button>
      </div>
      <div class="entry-list">${rows || emptyBlock("", "Inventário vazio.")}</div>
    `;
  }

  /* ───────────── rituais ───────────── */

  function ordinal(circulo) {
    return `${circulo}º`;
  }

  function elementoClass(elemento) {
    return `el-${ELEMENTO_SLUG[elemento] || "outro"}`;
  }

  function elementoTags(elementos) {
    return elementos.map((el) => `<span class="el-tag ${elementoClass(el)}">${esc(el)}</span>`).join("");
  }

  // Junta o ritual da ficha com os dados do catálogo em um formato único para exibir e conjurar.
  function ritualInfo(ritual) {
    const base = ritual.ref ? catalogo().get(ritual.ref) : null;
    if (base) {
      return {
        base,
        nome: base.nome,
        circulo: base.circulo,
        custo: base.custo,
        elementos: base.escolheElemento ? [ritual.elemento] : base.elementos,
        execucao: base.execucao,
        alcance: base.alcance,
        alvo: base.alvo,
        duracao: base.duracao,
        resistencia: base.resistencia,
        descricao: base.descricao,
        discente: base.discente,
        verdadeiro: base.verdadeiro,
        fonte: base.fonte,
      };
    }
    const forma = (pe) => (pe === null ? null : { pe, circulo: 0, afinidade: false, texto: "" });
    return {
      base: null,
      nome: ritual.nome,
      circulo: ritual.circulo,
      custo: ritual.custo,
      elementos: [ritual.elemento],
      execucao: ritual.execucao,
      alcance: ritual.alcance,
      alvo: ritual.alvo ? `Alvo: ${ritual.alvo}` : "",
      duracao: ritual.duracao,
      resistencia: ritual.resistencia,
      descricao: ritual.efeito,
      discente: forma(ritual.discentePe),
      verdadeiro: forma(ritual.verdadeiroPe),
      fonte: "Ritual próprio",
    };
  }

  function formaRequisito(forma) {
    const parts = [];
    if (forma.circulo) parts.push(`${ordinal(forma.circulo)} círculo`);
    if (forma.afinidade) parts.push("afinidade");
    return parts.length ? `Requer ${parts.join(" e ")}.` : "";
  }

  function ritualFacts(info) {
    const facts = [
      ["Execução", info.execucao],
      ["Alcance", info.alcance],
      ["Duração", info.duracao],
      ["Resistência", info.resistencia],
    ].filter(([, value]) => value);
    const alvo = info.alvo ? info.alvo.split(": ") : null;
    if (alvo && alvo.length > 1) facts.splice(2, 0, [alvo[0], alvo.slice(1).join(": ")]);
    return facts.length
      ? `<dl class="ritual-facts">${facts.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl>`
      : "";
  }

  function ritualFormas(info) {
    const linha = (label, forma) => (forma
      ? `<p class="ritual-forma"><strong>${label} (+${forma.pe} PE)</strong> ${esc(forma.texto)} ${forma.circulo || forma.afinidade ? `<em>${esc(formaRequisito(forma))}</em>` : ""}</p>`
      : "");
    return `${linha("Discente", info.discente)}${linha("Verdadeiro", info.verdadeiro)}`;
  }

  function castButton(sheet, ritual, info, forma) {
    const extra = forma === "normal" ? 0 : info[forma].pe;
    const custo = info.custo + extra;
    const semPe = sheet.pe < custo;
    const acimaLimite = sheet.peRodada > 0 && custo > sheet.peRodada;
    const label = forma === "normal" ? "Conjurar" : forma === "discente" ? "Discente" : "Verdadeiro";
    return `
      <button type="button" class="cast-btn cast-${forma}${semPe ? " is-short" : ""}" data-action="sheet-cast" data-id="${esc(ritual.id)}" data-forma="${forma}" aria-disabled="${semPe ? "true" : "false"}" aria-label="${label} ${esc(info.nome)} por ${custo} PE${semPe ? " — PE insuficiente" : ""}">
        <span>${label}</span>
        <strong>${custo} PE${acimaLimite ? '<i title="Acima do limite de PE por rodada" aria-hidden="true"> !</i>' : ""}</strong>
      </button>
    `;
  }

  function renderRitualCard(sheet, ritual) {
    const info = ritualInfo(ritual);
    const aberto = sheetUi.ritualAberto === ritual.id;
    const meta = [info.elementos.join(" / "), info.execucao, info.alcance].filter(Boolean).join(" · ");
    const escolha = info.base && info.base.escolheElemento
      ? `<label class="field"><span>Elemento escolhido</span>
           <select data-sheet-field="ritual.${esc(ritual.id)}.elemento">
             ${info.base.elementos.map((el) => `<option value="${esc(el)}"${ritual.elemento === el ? " selected" : ""}>${esc(el)}</option>`).join("")}
           </select></label>`
      : "";
    const detalhes = aberto ? `
      <div class="ritual-body">
        ${ritualFacts(info)}
        ${info.descricao ? `<p class="ritual-desc">${esc(info.descricao)}</p>` : ""}
        ${ritualFormas(info)}
        ${escolha}
        <label class="field"><span>Anotações</span><textarea rows="2" data-sheet-field="ritual.${esc(ritual.id)}.notas" placeholder="Componentes, lembretes, DT...">${esc(ritual.notas)}</textarea></label>
        <div class="ritual-foot">
          <span class="meta">${esc(info.fonte)}</span>
          <span class="ritual-foot-actions">
            ${info.base ? "" : `<button type="button" class="btn btn-ghost btn-small" data-action="sheet-ritual-edit" data-id="${esc(ritual.id)}">Editar</button>`}
            <button type="button" class="btn btn-danger btn-small" data-action="sheet-remove-ritual" data-id="${esc(ritual.id)}">Remover</button>
          </span>
        </div>
      </div>
    ` : "";
    return `
      <article class="ritual-card ${elementoClass(info.elementos[0])}${aberto ? " is-open" : ""}">
        <button type="button" class="ritual-head" data-action="sheet-ritual-toggle" data-id="${esc(ritual.id)}" aria-expanded="${aberto ? "true" : "false"}">
          <span class="ritual-circle" aria-label="${ordinal(info.circulo)} círculo">${ordinal(info.circulo)}</span>
          <span class="ritual-title">
            <strong>${esc(info.nome)}</strong>
            <span class="ritual-meta">${esc(meta)}</span>
          </span>
          <span class="ritual-chevron" aria-hidden="true">${aberto ? "▴" : "▾"}</span>
        </button>
        ${!aberto && ritual.notas ? `<p class="ritual-note">${esc(ritual.notas)}</p>` : ""}
        ${detalhes}
        <div class="cast-row">
          ${castButton(sheet, ritual, info, "normal")}
          ${info.discente ? castButton(sheet, ritual, info, "discente") : ""}
          ${info.verdadeiro ? castButton(sheet, ritual, info, "verdadeiro") : ""}
        </div>
      </article>
    `;
  }

  function renderRituais(sheet) {
    const ordenados = [...sheet.rituais].sort((a, b) => a.circulo - b.circulo || a.nome.localeCompare(b.nome, "pt-BR"));
    const cards = ordenados.map((ritual) => renderRitualCard(sheet, ritual)).join("");
    const pct = sheet.peMax > 0 ? Math.min(100, Math.round((sheet.pe / sheet.peMax) * 100)) : 0;
    return `
      <div class="ritual-summary">
        <div class="pe-box">
          <span class="pe-box-label">PE disponíveis</span>
          <strong>${sheet.pe}<span>/${sheet.peMax}</span></strong>
          <span class="vital-track" aria-hidden="true"><span style="width:${pct}%"></span></span>
        </div>
        <label class="stat-box"><span>DT do ritual</span><input data-sheet-field="dtRitual" value="${esc(sheet.dtRitual)}" placeholder="—" inputmode="numeric"></label>
        <label class="stat-box"><span>PE / rodada</span><input type="number" inputmode="numeric" min="0" max="99" data-sheet-field="peRodada" value="${sheet.peRodada}"></label>
      </div>
      <div class="tab-toolbar">
        <h3>Meus rituais <span class="count">${sheet.rituais.length}</span></h3>
        <div class="toolbar-buttons">
          <button type="button" class="btn btn-primary btn-small" data-action="sheet-ritual-catalog">Catálogo de rituais</button>
          <button type="button" class="btn btn-ghost btn-small" data-action="sheet-ritual-custom">Ritual próprio</button>
        </div>
      </div>
      <div class="entry-list">
        ${cards || emptyBlock("Nenhum ritual na ficha", "Abra o catálogo para ver todos os rituais e escolher os do seu personagem.")}
      </div>
      ${sheet.rituais.length ? `<p class="hint ritual-hint">Toque em Conjurar para gastar os PE automaticamente. Custos: 1º círculo 1 PE · 2º 3 PE · 3º 6 PE · 4º 10 PE, mais o extra das formas Discente e Verdadeiro. O sinal ! indica custo acima do seu limite de PE por rodada.</p>` : ""}
    `;
  }

  /* ─── catálogo ─── */

  function catalogoFiltrado(sheet) {
    const busca = fold(catUi.busca);
    const naFicha = new Set(sheet.rituais.map((ritual) => ritual.ref).filter(Boolean));
    return catalogo().lista.filter((ritual) => {
      if (catUi.circulo && ritual.circulo !== catUi.circulo) return false;
      if (catUi.elemento !== "todos" && !ritual.elementos.includes(catUi.elemento)) return false;
      if (catUi.soMeus && !naFicha.has(ritual.id)) return false;
      if (busca && !fold(`${ritual.nome} ${ritual.descricao}`).includes(busca)) return false;
      return true;
    });
  }

  function renderCatalogRow(ritual, naFicha) {
    const aberto = catUi.aberto === ritual.id;
    const adicionado = naFicha.has(ritual.id);
    const meta = [ritual.execucao, ritual.alcance, ritual.duracao].filter(Boolean).join(" · ");
    const detalhes = aberto ? `
      <div class="ritual-body">
        ${ritualFacts(ritual)}
        <p class="ritual-desc">${esc(ritual.descricao)}</p>
        ${ritualFormas(ritual)}
        <p class="meta">${esc(ritual.fonte)}</p>
      </div>
    ` : "";
    return `
      <article class="cat-row ${elementoClass(ritual.elementos[0])}${adicionado ? " is-added" : ""}${aberto ? " is-open" : ""}">
        <div class="cat-row-top">
          <button type="button" class="ritual-head" data-action="cat-details" data-id="${esc(ritual.id)}" aria-expanded="${aberto ? "true" : "false"}">
            <span class="ritual-circle" aria-label="${ordinal(ritual.circulo)} círculo">${ordinal(ritual.circulo)}</span>
            <span class="ritual-title">
              <strong>${esc(ritual.nome)}</strong>
              <span class="ritual-tags">${elementoTags(ritual.elementos)}<span class="ritual-meta">${ritual.custo} PE · ${esc(meta)}</span></span>
            </span>
          </button>
          <button type="button" class="cat-add${adicionado ? " is-on" : ""}" data-action="cat-add" data-id="${esc(ritual.id)}" aria-pressed="${adicionado ? "true" : "false"}" aria-label="${adicionado ? "Remover" : "Adicionar"} ${esc(ritual.nome)}">${adicionado ? "✓ Na ficha" : "+ Adicionar"}</button>
        </div>
        ${detalhes}
      </article>
    `;
  }

  function catalogChips() {
    const circ = [[0, "Todos"], ...CIRCULOS.map((c) => [c, `${ordinal(c)} círculo`])];
    const els = [["todos", "Todos"], ...catalogo().ELEMENTOS.map((el) => [el, el])];
    return `
      <div class="chip-row" role="group" aria-label="Círculo">
        ${circ.map(([value, label]) => `<button type="button" class="chip${catUi.circulo === value ? " is-active" : ""}" data-action="cat-circulo" data-id="${value}" aria-pressed="${catUi.circulo === value ? "true" : "false"}">${label}</button>`).join("")}
      </div>
      <div class="chip-row" role="group" aria-label="Elemento">
        ${els.map(([value, label]) => `<button type="button" class="chip ${value === "todos" ? "" : elementoClass(value)}${catUi.elemento === value ? " is-active" : ""}" data-action="cat-elemento" data-id="${esc(value)}" aria-pressed="${catUi.elemento === value ? "true" : "false"}">${esc(label)}</button>`).join("")}
        <button type="button" class="chip chip-mine${catUi.soMeus ? " is-active" : ""}" data-action="cat-meus" aria-pressed="${catUi.soMeus ? "true" : "false"}">Só os meus</button>
      </div>
    `;
  }

  function catalogListHtml(sheet) {
    const naFicha = new Set(sheet.rituais.map((ritual) => ritual.ref).filter(Boolean));
    const lista = catalogoFiltrado(sheet);
    if (!lista.length) return emptyBlock("Nenhum ritual encontrado", "Tente outro nome ou limpe os filtros.");
    return lista.map((ritual) => renderCatalogRow(ritual, naFicha)).join("");
  }

  function catalogCountLabel(sheet) {
    const total = catalogoFiltrado(sheet).length;
    const naFicha = sheet.rituais.filter((ritual) => ritual.ref).length;
    return `${total === 1 ? "1 ritual" : `${total} rituais`} · ${naFicha} na ficha`;
  }

  function renderCatalogModal(sheet) {
    return `
      <div class="modal-backdrop">
        <div class="modal modal-full catalog" role="dialog" aria-modal="true" aria-labelledby="catalog-title">
          <header class="modal-head">
            <div>
              <p class="kicker">${esc(sheet.nome)}</p>
              <h2 id="catalog-title">Catálogo de rituais</h2>
            </div>
            <button type="button" class="icon-btn" data-action="close-modal" aria-label="Fechar catálogo">✕</button>
          </header>
          <div class="catalog-filters">
            <input class="search-input" type="search" placeholder="Buscar por nome ou efeito" value="${esc(catUi.busca)}" data-action-input="cat-busca" aria-label="Buscar ritual" autocomplete="off" enterkeyhint="search">
            <div id="cat-chips">${catalogChips()}</div>
            <p class="meta" id="cat-count" aria-live="polite">${catalogCountLabel(sheet)}</p>
          </div>
          <div class="catalog-list" id="cat-list">${catalogListHtml(sheet)}</div>
          <footer class="modal-foot">
            <p class="meta">Resumos dos livros de Ordem Paranormal RPG. Em dúvida, vale o livro.</p>
            <button type="button" class="btn btn-primary" data-action="close-modal">Concluir</button>
          </footer>
        </div>
      </div>
    `;
  }

  function refreshCatalog(sheet, options = {}) {
    const list = document.getElementById("cat-list");
    if (!list) return;
    const top = list.scrollTop;
    list.innerHTML = catalogListHtml(sheet);
    list.scrollTop = options.resetScroll ? 0 : top;
    const chips = document.getElementById("cat-chips");
    if (chips) chips.innerHTML = catalogChips();
    const count = document.getElementById("cat-count");
    if (count) count.textContent = catalogCountLabel(sheet);
  }

  function renderRitualForm(ritual) {
    const r = ritual || { nome: "", circulo: 1, elemento: "Outro", custo: "", execucao: "padrão", alcance: "", alvo: "", duracao: "", resistencia: "", efeito: "", discentePe: null, verdadeiroPe: null };
    return `
      <div class="modal-backdrop">
        <form class="modal" id="ritual-form" data-id="${esc(ritual ? ritual.id : "")}" novalidate role="dialog" aria-modal="true" aria-labelledby="ritual-form-title">
          <header class="modal-head">
            <h2 id="ritual-form-title">${ritual ? "Editar ritual" : "Ritual próprio"}</h2>
            <button type="button" class="icon-btn" data-action="close-modal" aria-label="Fechar">✕</button>
          </header>
          <p class="hint">Para rituais dos livros, use o catálogo. Aqui você cadastra rituais criados pela mesa.</p>
          <label class="field"><span>Nome</span><input name="nome" maxlength="80" value="${esc(r.nome)}" autocomplete="off" data-autofocus></label>
          <div class="entry-grid">
            <label class="field"><span>Círculo</span>
              <select name="circulo">${CIRCULOS.map((c) => `<option value="${c}"${r.circulo === c ? " selected" : ""}>${ordinal(c)} (${CUSTO_PADRAO[c]} PE)</option>`).join("")}</select>
            </label>
            <label class="field"><span>Elemento</span>
              <select name="elemento">${ELEMENTOS.map((el) => `<option value="${esc(el)}"${r.elemento === el ? " selected" : ""}>${esc(el)}</option>`).join("")}</select>
            </label>
            <label class="field"><span>Custo em PE</span><input name="custo" type="number" inputmode="numeric" min="0" max="99" value="${esc(r.custo)}" placeholder="padrão do círculo"></label>
            <label class="field"><span>Execução</span><input name="execucao" maxlength="40" value="${esc(r.execucao)}"></label>
            <label class="field"><span>Alcance</span><input name="alcance" maxlength="40" value="${esc(r.alcance)}"></label>
            <label class="field"><span>Duração</span><input name="duracao" maxlength="40" value="${esc(r.duracao)}"></label>
            <label class="field"><span>Alvo ou área</span><input name="alvo" maxlength="80" value="${esc(r.alvo)}"></label>
            <label class="field"><span>Resistência</span><input name="resistencia" maxlength="60" value="${esc(r.resistencia)}"></label>
            <label class="field"><span>Discente: +PE</span><input name="discentePe" type="number" inputmode="numeric" min="0" max="99" value="${r.discentePe ?? ""}" placeholder="não tem"></label>
            <label class="field"><span>Verdadeiro: +PE</span><input name="verdadeiroPe" type="number" inputmode="numeric" min="0" max="99" value="${r.verdadeiroPe ?? ""}" placeholder="não tem"></label>
          </div>
          <label class="field"><span>Efeito</span><textarea name="efeito" rows="4">${esc(r.efeito)}</textarea></label>
          <p class="form-error" role="alert"></p>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" data-action="close-modal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar ritual</button>
          </div>
        </form>
      </div>
    `;
  }

  function saveRitualForm(form) {
    const helpers = op();
    const sheet = currentSheet();
    if (!sheet) return;
    const value = (name) => helpers.fieldValue(form, name);
    const nome = cleanName(value("nome"));
    if (!nome) {
      helpers.showError(form, "Dê um nome para o ritual.");
      return;
    }
    const circulo = parseCirculo(value("circulo"));
    const data = normalizeRitual({
      id: form.dataset.id || uid(),
      ref: "",
      nome,
      circulo,
      elemento: value("elemento"),
      custo: value("custo") === "" ? CUSTO_PADRAO[circulo] : value("custo"),
      execucao: cleanName(value("execucao")),
      alcance: cleanName(value("alcance")),
      alvo: cleanName(value("alvo")),
      duracao: cleanName(value("duracao")),
      resistencia: cleanName(value("resistencia")),
      efeito: String(value("efeito")).trim(),
      discentePe: value("discentePe"),
      verdadeiroPe: value("verdadeiroPe"),
    });
    const index = sheet.rituais.findIndex((item) => item.id === form.dataset.id);
    if (index >= 0) {
      data.notas = sheet.rituais[index].notas;
      sheet.rituais[index] = data;
    } else {
      sheet.rituais.push(data);
    }
    sheetUi.ritualAberto = data.id;
    helpers.closeModal();
    saveAndRender(true);
  }

  function castRitual(sheet, ritualId, forma) {
    const helpers = op();
    const ritual = sheet.rituais.find((item) => item.id === ritualId);
    if (!ritual) return;
    const info = ritualInfo(ritual);
    const tipo = forma === "discente" || forma === "verdadeiro" ? forma : "normal";
    if (tipo !== "normal" && !info[tipo]) return;
    const custo = info.custo + (tipo === "normal" ? 0 : info[tipo].pe);
    if (sheet.pe < custo) {
      helpers.toast?.(`PE insuficiente para ${info.nome}: custa ${custo}, você tem ${sheet.pe}.`, { tone: "warn" });
      helpers.announce?.(`PE insuficiente para ${info.nome}.`);
      return;
    }
    sheet.pe -= custo;
    sheet.stats.peGasto += custo;
    const chave = safeId(ritual.ref || ritual.id);
    const reg = sheet.stats.conjuracoes[chave] || { nome: info.nome, n: 0 };
    sheet.stats.conjuracoes[chave] = { nome: info.nome, n: reg.n + 1 };
    lastCast = { sheetId: sheet.id, custo, chave };
    saveAndRender(true);
    const sufixo = tipo === "normal" ? "" : tipo === "discente" ? " (Discente)" : " (Verdadeiro)";
    const aviso = sheet.peRodada > 0 && custo > sheet.peRodada ? ` Acima do limite de ${sheet.peRodada} PE por rodada.` : "";
    helpers.toast?.(`${info.nome}${sufixo}: −${custo} PE · restam ${sheet.pe}.${aviso}`, { actionLabel: "Desfazer", action: "sheet-cast-undo" });
    helpers.announce?.(`${info.nome}${sufixo} conjurado. ${custo} PE gastos, restam ${sheet.pe}.`);
  }

  /* ───────────── relacionamentos ───────────── */

  function bondList(sheet, list) {
    return list === "vinculos" ? sheet.vinculos : sheet.relacoes;
  }

  function renderBondSection(title, subtitle, listKey, bonds) {
    const cards = bonds.map((bond) => {
      const safe = imgSrc(bond.foto);
      const photo = safe
        ? `<img class="bond-photo" alt="" decoding="async" loading="lazy" src="${safe}"><span class="bond-zoom" aria-hidden="true">Ampliar</span>`
        : `<span class="bond-photo bond-photo-fallback" aria-hidden="true">${esc(initials(bond.nome))}</span><span class="bond-zoom" aria-hidden="true">Adicionar foto</span>`;
      return `
        <article class="bond-card">
          <button type="button" class="bond-photo-btn" data-action="sheet-bond-view" data-list="${esc(listKey)}" data-id="${esc(bond.id)}" aria-label="${safe ? `Ampliar foto de ${esc(bond.nome)}` : `Adicionar foto de ${esc(bond.nome)}`}">${photo}</button>
          <div class="bond-body">
            <input class="bond-name" data-sheet-field="bond.${esc(listKey)}.${esc(bond.id)}.nome" value="${esc(bond.nome)}" aria-label="Nome" maxlength="60">
            ${heartsHtml(bond.nivel, listKey, bond.id)}
            <div class="bond-actions">
              <label class="btn btn-ghost btn-small">
                ${safe ? "Trocar foto" : "Foto"}
                <input type="file" accept="image/*" hidden data-action-file="sheet-bond-photo" data-list="${esc(listKey)}" data-id="${esc(bond.id)}">
              </label>
              <button type="button" class="btn btn-danger btn-small" data-action="sheet-remove-bond" data-list="${esc(listKey)}" data-id="${esc(bond.id)}">Remover</button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    return `
      <section class="bond-section">
        <header class="tab-toolbar">
          <div>
            <h3>${esc(title)}</h3>
            <p class="meta">${esc(subtitle)}</p>
          </div>
          <button type="button" class="btn btn-primary btn-small" data-action="sheet-add-bond" data-list="${esc(listKey)}">Cadastrar</button>
        </header>
        ${cards ? `<div class="bond-grid">${cards}</div>` : emptyBlock("", "Nenhum personagem nesta lista.")}
      </section>
    `;
  }

  function renderRelacionamentos(sheet) {
    return `
      <div class="relationships">
        ${renderBondSection("Pontos de Relação", "O que você pensa dos outros", "relacoes", sheet.relacoes)}
        ${renderBondSection("Vínculos Conquistados", "O que os outros pensam de você", "vinculos", sheet.vinculos)}
        <p class="hint">Até 3 corações para laços positivos e até 3 caveiras para laços negativos. Use − e + para ajustar; toque na foto para ampliar.</p>
      </div>
    `;
  }

  function renderNotas(sheet) {
    return `
      <div class="entry-list notes-grid">
        <label class="field"><span>Aparência</span><textarea rows="4" data-sheet-field="aparencia">${esc(sheet.aparencia)}</textarea></label>
        <label class="field"><span>Personalidade</span><textarea rows="4" data-sheet-field="personalidade">${esc(sheet.personalidade)}</textarea></label>
        <label class="field"><span>Histórico</span><textarea rows="5" data-sheet-field="historico">${esc(sheet.historico)}</textarea></label>
        <label class="field"><span>Objetivo</span><textarea rows="3" data-sheet-field="objetivo">${esc(sheet.objetivo)}</textarea></label>
      </div>
    `;
  }

  /* ───────────── ajuda ───────────── */

  function findPericia(sheet, id) {
    return sheet.pericias.find((item) => item.id === id) || null;
  }

  function periciaBonusLabel(sheet, id) {
    const pericia = findPericia(sheet, id);
    if (!pericia) return "—";
    if (pericia.treino <= 0) return "não treinada";
    const nivel = ["", "Treinado", "Veterano", "Expert"][pericia.treino] || "Treinado";
    return `${nivel} · bônus ${signed(periciaTotal(pericia))}`;
  }

  function renderAjuda(sheet) {
    const reflexos = findPericia(sheet, "reflexos");
    const fortitude = findPericia(sheet, "fortitude");
    const luta = findPericia(sheet, "luta");
    const defesaEsquiva = sheet.defesa + (reflexos && reflexos.treino > 0 ? periciaTotal(reflexos) : 0);
    const rdBloqueio = fortitude && fortitude.treino > 0 ? periciaTotal(fortitude) : 0;

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

        <article class="help-card">
          <h3>Rituais e PE</h3>
          <ul>
            <li>Custo base: <strong>1º círculo 1 PE</strong> · <strong>2º 3 PE</strong> · <strong>3º 6 PE</strong> · <strong>4º 10 PE</strong>.</li>
            <li>As formas <strong>Discente</strong> e <strong>Verdadeiro</strong> somam PE extras ao custo base e podem exigir círculo maior ou afinidade.</li>
            <li>Na aba Rituais, o botão Conjurar desconta os PE na hora; dá para desfazer logo depois.</li>
          </ul>
        </article>

        <article class="help-card help-card-note">
          <h3>Resumo rápido</h3>
          <ul>
            <li><strong>1 reação por rodada</strong> (salvo poder/item que diga o contrário).</li>
            <li>Declare <strong>antes</strong> da rolagem de ataque.</li>
            <li><strong>Esquiva</strong> = mais Defesa · <strong>Bloqueio</strong> = menos dano · <strong>Contra-ataque</strong> = golpe de volta se errarem.</li>
          </ul>
          <p class="hint">Texto adaptado das regras do Ordem Paranormal RPG (Jambô Editora). Em dúvida, o livro e o mestre prevalecem.</p>
        </article>
      </div>
    `;
  }

  /* ───────────── ficha ───────────── */

  function renderGeral(sheet) {
    const temImagem = Boolean(imgSrc(sheet.imagem));
    return `
      <div class="sheet-identity">
        <div class="portrait-box">
          <button type="button" class="portrait-btn" data-action="sheet-portrait-view" aria-label="${temImagem ? "Ampliar imagem do personagem" : "Escolher imagem do personagem"}">
            ${portraitHtml(sheet, "sheet-portrait")}
          </button>
          <label class="btn btn-ghost btn-small">
            ${temImagem ? "Trocar imagem" : "Adicionar imagem"}
            <input type="file" accept="image/*" hidden data-action-file="sheet-portrait" id="sheet-portrait-input">
          </label>
        </div>
        <div class="identity-fields">
          <label class="field field-span"><span>Personagem</span><input data-sheet-field="nome" value="${esc(sheet.nome)}" maxlength="80"></label>
          <label class="field field-span"><span>Jogador</span><input data-sheet-field="jogador" value="${esc(sheet.jogador)}" maxlength="80"></label>
          <label class="field"><span>Origem</span><select data-sheet-field="origem">${origemOptions(sheet.origem)}</select></label>
          <label class="field"><span>Classe</span><select data-sheet-field="classe">${classeOptions(sheet.classe)}</select></label>
          <label class="field"><span>Trilha</span><select data-sheet-field="trilha"${TRILHAS[sheet.classe] ? "" : " disabled"}>${trilhaOptions(sheet.classe, sheet.trilha)}</select></label>
          <label class="field"><span>Patente${sheet.patente !== patentePorPrestigio(sheet.prestigio) ? ` <small class="field-tip">${sheet.prestigio} PP = ${esc(patentePorPrestigio(sheet.prestigio))}</small>` : ""}</span><select data-sheet-field="patente">${patenteOptions(sheet.patente)}</select></label>
        </div>
      </div>
      <section class="attrs-panel" aria-label="Atributos">
        <div class="attrs-core"><span>Atributos</span></div>
        <p class="attrs-hint">Toque nos dados para rolar</p>
        <div class="attrs-ring">${attrNodes(sheet)}</div>
      </section>
      <div class="stat-grid">
        <label class="stat-box"><span>NEX %</span><input type="number" inputmode="numeric" min="0" max="99" data-sheet-field="nex" value="${sheet.nex}"></label>
        <label class="stat-box"><span>Defesa</span><input type="number" inputmode="numeric" min="0" max="99" data-sheet-field="defesa" value="${sheet.defesa}"></label>
        <label class="stat-box"><span>Desloc. (m)</span><input type="number" inputmode="numeric" min="0" max="99" data-sheet-field="deslocamento" value="${sheet.deslocamento}"></label>
        <label class="stat-box"><span>PE / rodada</span><input type="number" inputmode="numeric" min="0" max="99" data-sheet-field="peRodada" value="${sheet.peRodada}"></label>
      </div>
    `;
  }

  function renderTabContent(sheet, tab) {
    switch (tab) {
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

  function tabButtons(active, tabs, extraClass) {
    return tabs.map(([id, label]) => `<button type="button" role="tab" class="sheet-tab${active === id ? " is-active" : ""}${extraClass || ""}" data-action="sheet-tab" data-id="${id}" aria-selected="${active === id ? "true" : "false"}">${label}</button>`).join("");
  }

  function renderSheetDetail(sheet) {
    const tab = TABS.some(([id]) => id === sheetUi.tab) ? sheetUi.tab : "geral";
    const wideTab = WIDE_ONLY_TABS.includes(tab) ? sheetUi.wideTab : tab;
    const subtitle = [sheet.classe, `NEX ${sheet.nex}%`, sheet.patente].filter(Boolean).join(" · ");

    return withSheetNote(`
      <div class="sheet-top">
        <button type="button" class="btn btn-ghost btn-back" data-action="go-sheets">‹ Fichas</button>
        <div class="sheet-heading">
          <h2 id="sheet-title">${esc(sheet.nome)}</h2>
          <p class="meta" id="sheet-subtitle">${esc(subtitle)}</p>
        </div>
        <button type="button" class="btn btn-ghost btn-small" data-action="sheet-export-one" data-id="${esc(sheet.id)}">Exportar</button>
      </div>
      <div class="sheet-sticky">
        <div class="vitals" role="group" aria-label="Vida, Sanidade e Esforço">
          ${vitalHtml(sheet, "pv")}
          ${vitalHtml(sheet, "san")}
          ${vitalHtml(sheet, "pe")}
        </div>
        ${markersRowHtml(sheet)}
        ${criseBarHtml(sheet)}
        <nav class="sheet-tabs sheet-tabs-compact" role="tablist" aria-label="Seções da ficha">
          ${tabButtons(tab, TABS)}
        </nav>
      </div>
      <div class="sheet-layout" data-tab="${tab}">
        <aside class="sheet-col sheet-col-left">
          ${renderGeral(sheet)}
        </aside>
        <section class="sheet-col sheet-col-mid">
          ${renderPericias(sheet)}
        </section>
        <section class="sheet-col sheet-col-right">
          <nav class="sheet-tabs sheet-tabs-wide" role="tablist" aria-label="Seções da ficha">
            ${tabButtons(wideTab, TABS.filter(([id]) => !WIDE_ONLY_TABS.includes(id)))}
          </nav>
          <div class="sheet-tab-panel">
            ${renderTabContent(sheet, wideTab)}
          </div>
        </section>
      </div>
    `);
  }

  function renderSheetForm() {
    return `
      <div class="modal-backdrop">
        <form class="modal" id="sheet-form" novalidate role="dialog" aria-modal="true" aria-labelledby="sheet-form-title">
          <header class="modal-head">
            <h2 id="sheet-form-title">Nova ficha</h2>
            <button type="button" class="icon-btn" data-action="close-modal" aria-label="Fechar">✕</button>
          </header>
          <label class="field"><span>Personagem</span><input name="nome" maxlength="80" autocomplete="off" data-autofocus></label>
          <label class="field"><span>Jogador</span><input name="jogador" maxlength="80" autocomplete="off"></label>
          <div class="entry-grid">
            <label class="field"><span>Classe</span><select name="classe" data-form-classe>${classeOptions("Combatente")}</select></label>
            <label class="field"><span>Trilha</span><select name="trilha" data-form-trilha>${trilhaOptions("Combatente", "")}</select></label>
            <label class="field"><span>Origem</span><select name="origem">${origemOptions("")}</select></label>
            <label class="field"><span>Patente</span><select name="patente">${patenteOptions("Recruta")}</select></label>
            <label class="field"><span>NEX %</span><input name="nex" type="number" inputmode="numeric" min="0" max="99" value="5"></label>
          </div>
          <label class="field">
            <span>Imagem do personagem</span>
            <input name="imagem" type="file" accept="image/*" data-preview="#sheet-preview">
            <small>Opcional. A imagem é reduzida antes de salvar.</small>
          </label>
          <div class="preview" id="sheet-preview"></div>
          <p class="form-error" role="alert"></p>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" data-action="close-modal">Cancelar</button>
            <button type="submit" class="btn btn-primary">Criar ficha</button>
          </div>
        </form>
      </div>
    `;
  }

  /* ───────────── edição de campos ───────────── */

  function splitPath(path) {
    return String(path).split(".");
  }

  function patchField(sheet, path, value) {
    const parts = splitPath(path);
    const [kind] = parts;
    if (kind === "atributos") {
      const key = parts[1];
      if (ATTR_KEYS.includes(key)) sheet.atributos[key] = clampInt(value, 0, 5, sheet.atributos[key]);
      return;
    }
    if (kind === "pericia") {
      const pericia = sheet.pericias.find((item) => item.id === parts[1]);
      if (pericia && parts[2] === "outros") pericia.outros = clampInt(value, -99, 99, pericia.outros);
      return;
    }
    if (kind === "ataque") {
      const ataque = sheet.ataques.find((item) => item.id === parts[1]);
      if (ataque && ["nome", "teste", "dano", "critico", "especial"].includes(parts[2])) ataque[parts[2]] = String(value);
      return;
    }
    if (kind === "habilidade") {
      const hab = sheet.habilidades.find((item) => item.id === parts[1]);
      if (hab && ["nome", "descricao"].includes(parts[2])) hab[parts[2]] = String(value);
      return;
    }
    if (kind === "ritual") {
      const ritual = sheet.rituais.find((item) => item.id === parts[1]);
      if (!ritual) return;
      if (parts[2] === "notas") ritual.notas = String(value);
      if (parts[2] === "elemento") {
        const base = ritual.ref ? catalogo().get(ritual.ref) : null;
        if (!base || base.elementos.includes(String(value))) ritual.elemento = String(value);
      }
      return;
    }
    if (kind === "item") {
      const item = sheet.inventario.find((entry) => entry.id === parts[1]);
      if (!item) return;
      if (parts[2] === "espacos") item.espacos = clampInt(value, 0, 99, item.espacos);
      else if (["nome", "categoria", "descricao"].includes(parts[2])) item[parts[2]] = String(value);
      return;
    }
    if (kind === "bond") {
      const bond = bondList(sheet, parts[1]).find((entry) => entry.id === parts[2]);
      if (bond && parts[3] === "nome") bond.nome = String(value);
      return;
    }
    if (NUMERIC_FIELDS.includes(path)) {
      const max = ["nex", "peRodada", "defesa", "deslocamento", "cargaMax", "credito"].includes(path) ? 99 : path === "prestigio" ? 999 : 9999;
      sheet[path] = clampInt(value, 0, max, sheet[path]);
      return;
    }
    if (TEXT_FIELDS.includes(path)) sheet[path] = String(value);
    // Trocou de classe: a trilha antiga não vale mais.
    if (path === "classe" && sheet.trilha && !trilhasDa(sheet.classe).includes(sheet.trilha)) sheet.trilha = "";
  }

  function readNumber(sheet, path) {
    const parts = splitPath(path);
    if (parts[0] === "atributos") return sheet.atributos[parts[1]];
    if (parts[0] === "pericia") return sheet.pericias.find((item) => item.id === parts[1])?.outros;
    if (parts[0] === "item") return sheet.inventario.find((item) => item.id === parts[1])?.espacos;
    if (NUMERIC_FIELDS.includes(path)) return sheet[path];
    return undefined;
  }

  // Atualiza só o que depende do campo, sem redesenhar a tela (redesenhar fecharia o teclado no celular).
  function reflectField(sheet, path, target) {
    const parts = splitPath(path);
    if (parts[0] === "atributos" && ATTR_KEYS.includes(parts[1])) {
      const valor = sheet.atributos[parts[1]];
      document.querySelectorAll(`[data-attr-dice="${parts[1]}"]`).forEach((btn) => {
        btn.classList.toggle("is-worst", valor === 0);
        btn.setAttribute("aria-label", `Rolar ${ATTR_NAMES[parts[1]]}: ${diceLabel(valor)}`);
        const text = btn.querySelector("span");
        if (text) text.textContent = diceLabel(valor);
      });
      document.querySelectorAll(`[data-attr-dice-text="${parts[1]}"]`).forEach((node) => { node.textContent = diceLabel(valor); });
    } else if (parts[0] === "pericia") {
      const pericia = sheet.pericias.find((item) => item.id === parts[1]);
      const total = target.closest(".pericia-row")?.querySelector(".pericia-total");
      if (pericia && total) total.textContent = signed(periciaTotal(pericia));
    } else if (path === "cargaMax" || (parts[0] === "item" && parts[2] === "espacos")) {
      const display = document.getElementById("carga-display");
      if (display) display.textContent = cargaLabel(sheet);
      document.getElementById("carga-box")?.classList.toggle("is-over", cargaAtual(sheet) > sheet.cargaMax);
      refreshMarkers(sheet);
    } else if (["nome", "classe", "nex", "patente"].includes(path)) {
      const title = document.getElementById("sheet-title");
      if (title) title.textContent = sheet.nome || "Personagem";
      const subtitle = document.getElementById("sheet-subtitle");
      if (subtitle) subtitle.textContent = [sheet.classe, `NEX ${sheet.nex}%`, sheet.patente].filter(Boolean).join(" · ");
    }
  }

  function handleFieldEdit(target, committed) {
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return false;
    const path = target.dataset.sheetField;
    if (!path) return false;
    const sheet = currentSheet();
    if (!sheet) return false;
    const trilhaAntes = sheet.trilha;
    patchField(sheet, path, target.value);
    reflectField(sheet, path, target);
    if (sheet.trilha !== trilhaAntes || (committed && path === "nex")) {
      const mudou = syncTrilhaHabs(sheet);
      avisarTrilha(sheet, mudou);
      if (mudou.add || mudou.rem) {
        persistSheets();
        op().render?.({ keepScroll: true });
        return true;
      }
    }
    if (committed) {
      if (target instanceof HTMLInputElement && target.type === "number") {
        const stored = readNumber(sheet, path);
        if (stored !== undefined && String(stored) !== target.value) target.value = String(stored);
      }
      persistSheets();
      if (target instanceof HTMLSelectElement) op().render?.({ keepScroll: true });
    } else {
      schedulePersist();
    }
    return true;
  }

  /* ───────────── ações ───────────── */

  async function createSheetFromForm(form) {
    const helpers = op();
    const submit = form.querySelector("[type=submit]");
    if (submit) submit.disabled = true;
    try {
      helpers.showError(form, "");
      const nome = cleanName(helpers.fieldValue(form, "nome"));
      if (!nome) {
        helpers.showError(form, "Dê um nome para o personagem.");
        return;
      }
      const file = helpers.fieldFile(form, "imagem");
      let imagem = "";
      if (file) {
        try {
          imagem = await helpers.readImage(file, 720);
        } catch (err) {
          helpers.showError(form, "Não foi possível ler essa imagem. Use JPG, PNG ou WebP de até 12 MB.");
          return;
        }
      }
      const sheet = createEmptySheet({
        nome,
        jogador: cleanName(helpers.fieldValue(form, "jogador")),
        origem: cleanName(helpers.fieldValue(form, "origem")),
        classe: CLASSES.includes(helpers.fieldValue(form, "classe")) ? helpers.fieldValue(form, "classe") : "Combatente",
        trilha: cleanName(helpers.fieldValue(form, "trilha")),
        patente: cleanName(helpers.fieldValue(form, "patente")),
        nex: clampInt(helpers.fieldValue(form, "nex"), 0, 99, 5),
        imagem,
      });
      syncTrilhaHabs(sheet);
      sheetsState.sheets.unshift(sheet);
      if (!persistSheets()) {
        sheetsState.sheets = sheetsState.sheets.filter((item) => item !== sheet);
        return;
      }
      helpers.closeModal();
      helpers.ui.screen = "sheet";
      helpers.ui.sheetId = sheet.id;
      sheetUi.tab = "geral";
      helpers.render();
    } finally {
      if (submit && submit.isConnected) submit.disabled = false;
    }
  }

  function importFromJsonText(text) {
    const data = JSON.parse(text);
    let incoming = [];
    if (Array.isArray(data)) incoming = data;
    else if (data && Array.isArray(data.sheets)) incoming = data.sheets;
    else if (data && typeof data === "object" && data.nome) incoming = [data];
    else throw new Error("formato");
    const valid = incoming.filter((item) => item && typeof item === "object");
    if (!valid.length) throw new Error("vazio");
    // Mesmo id de uma ficha já existente: atualiza no lugar. Senão, entra como ficha nova.
    const before = sheetsState.sheets.slice();
    let atualizadas = 0;
    let novas = 0;
    valid.forEach((item) => {
      const sheet = normalizeSheet(item);
      const index = item.id ? sheetsState.sheets.findIndex((current) => current.id === sheet.id) : -1;
      if (index >= 0) {
        sheetsState.sheets[index] = sheet;
        atualizadas += 1;
      } else {
        sheetsState.sheets.unshift({ ...sheet, id: uid() });
        novas += 1;
      }
    });
    if (!persistSheets()) {
      sheetsState.sheets = before;
      return;
    }
    const partes = [];
    if (atualizadas) partes.push(atualizadas === 1 ? "1 ficha atualizada" : `${atualizadas} fichas atualizadas`);
    if (novas) partes.push(novas === 1 ? "1 ficha importada" : `${novas} fichas importadas`);
    const label = partes.join(", ").replace(/^./, (c) => c.toUpperCase());
    op().toast?.(`${label}.`);
    op().announce?.(`${label}.`);
    op().render?.();
  }

  function removeFrom(sheet, key, id) {
    sheet[key] = sheet[key].filter((item) => item.id !== id);
    saveAndRender(true);
  }

  function handleAction(action, el, id) {
    const helpers = op();
    const ui = helpers.ui;
    const sheet = currentSheet();

    switch (action) {
      case "go-sheets":
      case "open-sheets":
        flush();
        ui.screen = "sheets";
        ui.sheetId = null;
        helpers.closeModal?.();
        helpers.render?.();
        return true;
      case "open-sheet":
        ui.screen = "sheet";
        ui.sheetId = id;
        sheetUi.tab = "geral";
        sheetUi.wideTab = "combate";
        sheetUi.ritualAberto = "";
        helpers.render?.();
        return true;
      case "sheet-new":
        helpers.openModal?.(renderSheetForm());
        return true;
      case "sheet-delete":
        helpers.openConfirm?.({
          title: "Excluir ficha?",
          message: `A ficha de ${findSheet(id)?.nome || "personagem"} será apagada deste navegador. Exporte antes se quiser guardar uma cópia.`,
          confirmLabel: "Excluir",
          action: "confirm-delete-sheet",
          id,
        });
        return true;
      case "confirm-delete-sheet":
        sheetsState.sheets = sheetsState.sheets.filter((item) => item.id !== id);
        if (ui.sheetId === id) {
          ui.screen = "sheets";
          ui.sheetId = null;
        }
        persistSheets();
        helpers.closeModal?.();
        helpers.render?.();
        return true;
      case "sheet-export-all":
        flush();
        downloadJson("fichas-ordem-paranormal.json", { version: 2, sheets: sheetsState.sheets });
        return true;
      case "sheet-export-one": {
        flush();
        const target = findSheet(id) || sheet;
        if (target) downloadJson(`${slugName(target.nome)}.json`, target);
        return true;
      }
      case "sheet-import":
        document.getElementById("sheet-import-input")?.click();
        return true;
      case "sheet-tab": {
        const next = TABS.some(([tabId]) => tabId === id) ? id : "geral";
        sheetUi.tab = next;
        if (!WIDE_ONLY_TABS.includes(next)) sheetUi.wideTab = next;
        flush();
        helpers.render?.({ keepScroll: true });
        const sticky = document.querySelector(".sheet-sticky");
        const layout = document.querySelector(".sheet-layout");
        if (sticky && layout && helpers.isCompact?.()) {
          const top = layout.getBoundingClientRect().top - sticky.getBoundingClientRect().height;
          if (top < 0) window.scrollBy(0, top - 4);
        }
        document.querySelector(".sheet-tabs-compact .sheet-tab.is-active")?.scrollIntoView({ block: "nearest", inline: "center" });
        return true;
      }
      case "sheet-pericias-filtro":
        sheetUi.periciasFiltro = id === "treinadas" ? "treinadas" : "todas";
        helpers.render?.({ keepScroll: true });
        return true;
      case "sheet-resource": {
        if (!sheet) return true;
        const kind = el.dataset.kind;
        if (!VITALS[kind]) return true;
        const delta = Number(el.dataset.delta || 0);
        const max = sheet[`${kind}Max`];
        // Não trava no máximo quando o valor já está acima dele (PV temporários, por exemplo).
        const teto = delta > 0 ? Math.max(max, sheet[kind]) : 9999;
        const antes = sheet[kind];
        sheet[kind] = clampInt(sheet[kind] + delta, 0, teto, sheet[kind]);
        registrarPerda(sheet, kind, antes, sheet[kind]);
        syncCrise(sheet);
        saveAndRender(true);
        return true;
      }
      case "crise-abrir": {
        const tipo = el.dataset.tipo;
        if (!sheet || !CRISE[tipo] || sheet.fim) return true;
        if (!sheet.crise[tipo].ativo) {
          sheet.crise[tipo] = { ativo: true, marcas: 3 };
          persistSheets();
          refreshCrise(sheet);
        }
        helpers.openModal?.(renderCriseModal(sheet, tipo));
        return true;
      }
      case "crise-falha":
      case "crise-marca": {
        const tipo = el.dataset.tipo;
        if (!sheet || !CRISE[tipo] || sheet.fim) return true;
        const estado = sheet.crise[tipo];
        if (action === "crise-falha") estado.marcas = Math.max(0, estado.marcas - 1);
        else {
          const n = clampInt(el.dataset.level, 1, 3, 1);
          estado.marcas = estado.marcas >= n ? n - 1 : n;
        }
        if (estado.marcas <= 0) {
          sheet.fim = CRISE[tipo].fim;
          sheet.fimEm = new Date().toISOString();
          Object.keys(sheet.crise).forEach((key) => { sheet.crise[key].ativo = false; });
          saveAndRender(true);
          helpers.openModal?.(renderFinalModal(sheet));
          return true;
        }
        persistSheets();
        helpers.openModal?.(renderCriseModal(sheet, tipo));
        refreshCrise(sheet);
        return true;
      }
      case "crise-sair": {
        const tipo = el.dataset.tipo;
        if (!sheet || !CRISE[tipo]) return true;
        sheet.crise[tipo] = { ativo: false, marcas: 3 };
        const kind = CRISE[tipo].kind;
        if (sheet[kind] <= 0) sheet[kind] = 1;
        helpers.closeModal?.();
        saveAndRender(true);
        helpers.toast?.(`${sheet.nome} saiu do estado ${CRISE[tipo].titulo.toLowerCase()} com 1 ${kind === "pv" ? "PV" : "de SAN"}.`);
        return true;
      }
      case "crise-final":
        if (sheet?.fim) helpers.openModal?.(renderFinalModal(sheet));
        return true;
      case "crise-reverter":
        if (!sheet) return true;
        sheet.fim = "";
        sheet.fimEm = "";
        helpers.closeModal?.();
        saveAndRender(true);
        helpers.toast?.("Desfeito: o personagem voltou à ficha.");
        return true;
      case "sheet-restore": {
        if (!sheet) return true;
        lastRestore = { sheetId: sheet.id, pv: sheet.pv, san: sheet.san, pe: sheet.pe, crise: JSON.parse(JSON.stringify(sheet.crise)) };
        // Não baixa quem está acima do máximo (PV temporários, por exemplo).
        ["pv", "san", "pe"].forEach((kind) => { sheet[kind] = Math.max(sheet[kind], sheet[`${kind}Max`]); });
        syncCrise(sheet);
        saveAndRender(true);
        helpers.toast?.(`${sheet.nome}: PV ${sheet.pv}, SAN ${sheet.san} e PE ${sheet.pe} restaurados.`, { actionLabel: "Desfazer", action: "sheet-restore-undo" });
        helpers.announce?.("PV, Sanidade e PE restaurados ao máximo.");
        return true;
      }
      case "sheet-restore-undo": {
        const target = lastRestore ? findSheet(lastRestore.sheetId) : null;
        if (target) {
          target.pv = lastRestore.pv;
          target.san = lastRestore.san;
          target.pe = lastRestore.pe;
          target.crise = lastRestore.crise;
          lastRestore = null;
          saveAndRender(true);
          helpers.announce?.("Restauração desfeita.");
        }
        helpers.clearToast?.();
        return true;
      }
      case "sheet-conditions":
        if (sheet) helpers.openModal?.(renderConditionsModal(sheet));
        return true;
      case "sheet-toggle-condition": {
        if (!sheet || !CONDICAO_IDS.has(id)) return true;
        sheet.condicoes = sheet.condicoes.includes(id) ? sheet.condicoes.filter((c) => c !== id) : [...sheet.condicoes, id];
        persistSheets();
        const on = sheet.condicoes.includes(id);
        el.classList.toggle("is-on", on);
        el.setAttribute("aria-pressed", on ? "true" : "false");
        const check = el.querySelector(".cond-check");
        if (check) check.textContent = on ? "✓" : "";
        refreshMarkers(sheet);
        return true;
      }
      case "sheet-clear-conditions":
        if (!sheet) return true;
        sheet.condicoes = [];
        persistSheets();
        helpers.openModal?.(renderConditionsModal(sheet));
        refreshMarkers(sheet);
        return true;
      case "sheet-vital-edit":
        if (sheet && VITALS[el.dataset.kind]) helpers.openModal?.(renderVitalForm(sheet, el.dataset.kind));
        return true;
      case "vital-quick": {
        const form = el.closest("form");
        const input = form?.elements.namedItem("atual");
        const maxInput = form?.elements.namedItem("max");
        if (!input || !maxInput) return true;
        const max = clampInt(maxInput.value, 0, 9999, 0);
        if (el.dataset.fill === "1") input.value = String(max);
        else if (el.dataset.fill === "0") input.value = "0";
        else input.value = String(clampInt(clampInt(input.value, 0, 9999, 0) + Number(el.dataset.delta || 0), 0, 9999, 0));
        return true;
      }
      case "sheet-treino": {
        if (!sheet) return true;
        const pericia = sheet.pericias.find((item) => item.id === id);
        if (!pericia) return true;
        const level = clampInt(el.dataset.level, 1, 3, 1);
        pericia.treino = pericia.treino === level ? level - 1 : level;
        saveAndRender(true);
        return true;
      }
      case "sheet-add-ataque":
        if (!sheet) return true;
        sheet.ataques.push(normalizeAtaque({ nome: "Novo ataque" }));
        saveAndRender(true);
        return true;
      case "sheet-remove-ataque":
        if (sheet) removeFrom(sheet, "ataques", id);
        return true;
      case "sheet-add-habilidade":
        if (!sheet) return true;
        sheet.habilidades.push(normalizeHabilidade({ nome: "Nova habilidade" }));
        saveAndRender(true);
        return true;
      case "sheet-remove-habilidade":
        if (sheet) removeFrom(sheet, "habilidades", id);
        return true;
      case "sheet-add-item":
        if (!sheet) return true;
        sheet.inventario.push(normalizeItem({ nome: "Novo item" }));
        saveAndRender(true);
        return true;
      case "sheet-remove-item":
        if (sheet) removeFrom(sheet, "inventario", id);
        return true;

      /* rituais */
      case "sheet-ritual-toggle":
        flush();
        sheetUi.ritualAberto = sheetUi.ritualAberto === id ? "" : id;
        helpers.render?.({ keepScroll: true });
        return true;
      case "sheet-ritual-catalog":
        if (!sheet) return true;
        catUi.aberto = "";
        helpers.openModal?.(renderCatalogModal(sheet));
        return true;
      case "sheet-ritual-custom":
        if (sheet) helpers.openModal?.(renderRitualForm(null));
        return true;
      case "sheet-ritual-edit": {
        const ritual = sheet?.rituais.find((item) => item.id === id);
        if (ritual && !ritual.ref) helpers.openModal?.(renderRitualForm(ritual));
        return true;
      }
      case "sheet-remove-ritual": {
        const ritual = sheet?.rituais.find((item) => item.id === id);
        if (!ritual) return true;
        helpers.openConfirm?.({
          title: "Remover ritual?",
          message: `${ritual.nome} sai da ficha${ritual.notas ? ", junto com as anotações" : ""}.`,
          confirmLabel: "Remover",
          action: "confirm-remove-ritual",
          id,
        });
        return true;
      }
      case "confirm-remove-ritual":
        helpers.closeModal?.();
        if (sheet) removeFrom(sheet, "rituais", id);
        return true;
      case "sheet-cast":
        if (sheet) castRitual(sheet, id, el.dataset.forma);
        return true;
      case "sheet-cast-undo": {
        const target = lastCast ? findSheet(lastCast.sheetId) : null;
        if (target) {
          target.pe = clampInt(target.pe + lastCast.custo, 0, 9999, target.pe);
          desfazerPerda(target, "pe", lastCast.custo);
          const reg = target.stats.conjuracoes[lastCast.chave];
          if (reg) {
            reg.n -= 1;
            if (reg.n <= 0) delete target.stats.conjuracoes[lastCast.chave];
          }
          lastCast = null;
          saveAndRender(true);
          helpers.announce?.(`Conjuração desfeita. PE: ${target.pe}.`);
        }
        helpers.clearToast?.();
        return true;
      }
      case "cat-details":
        if (!sheet) return true;
        catUi.aberto = catUi.aberto === id ? "" : id;
        refreshCatalog(sheet);
        return true;
      case "cat-add": {
        if (!sheet) return true;
        const base = catalogo().get(id);
        if (!base) return true;
        const index = sheet.rituais.findIndex((item) => item.ref === id);
        if (index >= 0) sheet.rituais.splice(index, 1);
        else sheet.rituais.push(normalizeRitual({ ref: id }));
        persistSheets();
        refreshCatalog(sheet);
        helpers.render?.({ keepScroll: true });
        helpers.announce?.(index >= 0 ? `${base.nome} removido da ficha.` : `${base.nome} adicionado à ficha.`);
        return true;
      }
      case "cat-circulo":
        if (!sheet) return true;
        catUi.circulo = clampInt(id, 0, 4, 0);
        refreshCatalog(sheet, { resetScroll: true });
        return true;
      case "cat-elemento":
        if (!sheet) return true;
        catUi.elemento = catalogo().ELEMENTOS.includes(id) ? id : "todos";
        refreshCatalog(sheet, { resetScroll: true });
        return true;
      case "cat-meus":
        if (!sheet) return true;
        catUi.soMeus = !catUi.soMeus;
        refreshCatalog(sheet, { resetScroll: true });
        return true;

      /* relacionamentos e imagens */
      case "sheet-add-bond": {
        if (!sheet) return true;
        const list = el.dataset.list === "vinculos" ? "vinculos" : "relacoes";
        sheet[list].push(normalizeBond({ nome: "Novo personagem", nivel: 0 }));
        saveAndRender(true);
        return true;
      }
      case "sheet-remove-bond": {
        if (!sheet) return true;
        const list = el.dataset.list === "vinculos" ? "vinculos" : "relacoes";
        const bond = sheet[list].find((item) => item.id === id);
        if (!bond) return true;
        helpers.openConfirm?.({
          title: "Remover personagem?",
          message: `${bond.nome} sai desta lista.`,
          confirmLabel: "Remover",
          action: list === "vinculos" ? "confirm-remove-vinculo" : "confirm-remove-relacao",
          id,
        });
        return true;
      }
      case "confirm-remove-vinculo":
      case "confirm-remove-relacao":
        helpers.closeModal?.();
        if (sheet) removeFrom(sheet, action === "confirm-remove-vinculo" ? "vinculos" : "relacoes", id);
        return true;
      case "sheet-set-heart": {
        if (!sheet) return true;
        const bond = bondList(sheet, el.dataset.list).find((item) => item.id === id);
        if (!bond) return true;
        const level = clampInt(el.dataset.level, -3, 3, 1);
        const toward = level > 0 ? level - 1 : level + 1;
        bond.nivel = bond.nivel === level ? toward : level;
        saveAndRender(true);
        return true;
      }
      case "sheet-roll": {
        if (!sheet) return true;
        if (el.dataset.pericia) {
          const pericia = sheet.pericias.find((item) => item.id === el.dataset.pericia);
          if (pericia) openRoll({ titulo: pericia.nome, attr: pericia.attr, valor: sheet.atributos[pericia.attr], bonus: periciaTotal(pericia) });
        } else if (ATTR_KEYS.includes(el.dataset.attr)) {
          const key = el.dataset.attr;
          openRoll({ titulo: ATTR_NAMES[key], attr: key, valor: sheet.atributos[key], bonus: 0 });
        }
        return true;
      }
      case "roll-again":
        if (lastRoll) openRoll(lastRoll);
        return true;
      case "sheet-bond-step": {
        if (!sheet) return true;
        const bond = bondList(sheet, el.dataset.list).find((item) => item.id === id);
        if (!bond) return true;
        const delta = Number(el.dataset.delta) < 0 ? -1 : 1;
        bond.nivel = clampInt(bond.nivel + delta, -3, 3, bond.nivel);
        saveAndRender(true);
        return true;
      }
      case "sheet-bond-view": {
        if (!sheet) return true;
        const list = el.dataset.list === "vinculos" ? "vinculos" : "relacoes";
        const bond = sheet[list].find((item) => item.id === id);
        if (!bond) return true;
        if (imgSrc(bond.foto)) {
          const tipo = list === "vinculos" ? "Vínculo conquistado" : "Ponto de relação";
          helpers.openImage?.(bond.foto, bond.nome, `${bondIcons(bond.nivel)} · ${tipo}`);
        } else {
          el.closest(".bond-card")?.querySelector("input[type=file]")?.click();
        }
        return true;
      }
      case "sheet-portrait-view":
        if (!sheet) return true;
        if (imgSrc(sheet.imagem)) {
          helpers.openImage?.(sheet.imagem, sheet.nome, [sheet.classe, `NEX ${sheet.nex}%`].filter(Boolean).join(" · "));
        } else {
          document.getElementById("sheet-portrait-input")?.click();
        }
        return true;
      default:
        return false;
    }
  }

  function handleSubmit(form) {
    if (form.id === "sheet-form") {
      void createSheetFromForm(form);
      return true;
    }
    if (form.id === "ritual-form") {
      saveRitualForm(form);
      return true;
    }
    if (form.id === "vital-form") {
      const sheet = currentSheet();
      const kind = form.dataset.kind;
      if (sheet && VITALS[kind]) {
        const helpers = op();
        sheet[`${kind}Max`] = clampInt(helpers.fieldValue(form, "max"), 0, 9999, sheet[`${kind}Max`]);
        const antes = sheet[kind];
        sheet[kind] = clampInt(helpers.fieldValue(form, "atual"), 0, 9999, sheet[kind]);
        registrarPerda(sheet, kind, antes, sheet[kind]);
        syncCrise(sheet);
        helpers.closeModal();
        saveAndRender(true);
      }
      return true;
    }
    return false;
  }

  async function handleFile(input) {
    const helpers = op();
    const action = input.dataset.actionFile;
    const file = input.files && input.files[0];
    if (!file) return;
    const sheet = currentSheet();
    if (!sheet) return;
    let target = null;
    let field = "";
    if (action === "sheet-portrait") {
      target = sheet;
      field = "imagem";
    } else if (action === "sheet-bond-photo") {
      target = bondList(sheet, input.dataset.list).find((item) => item.id === input.dataset.id) || null;
      field = "foto";
    }
    if (!target) return;
    const previous = target[field];
    try {
      // 720px: nítido o bastante para a visualização ampliada sem estourar o armazenamento do navegador.
      target[field] = await helpers.readImage(file, 720);
    } catch (err) {
      input.value = "";
      helpers.toast?.("Não foi possível ler essa imagem. Use JPG, PNG ou WebP de até 12 MB.", { tone: "warn" });
      return;
    }
    if (!persistSheets()) target[field] = previous;
    helpers.render?.({ keepScroll: true });
  }

  function handleChange(target) {
    if (target instanceof HTMLSelectElement && target.hasAttribute("data-form-classe")) {
      const trilha = target.form?.querySelector("[data-form-trilha]");
      if (trilha) trilha.innerHTML = trilhaOptions(target.value, "");
      return true;
    }
    if (target instanceof HTMLInputElement && target.id === "sheet-import-input") {
      const file = target.files && target.files[0];
      if (!file) return true;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          importFromJsonText(String(reader.result || ""));
        } catch (err) {
          op().toast?.("Arquivo inválido. Use uma ficha ou a lista exportada pelo app.", { tone: "warn" });
        }
        target.value = "";
      };
      reader.onerror = () => {
        op().toast?.("Não foi possível ler o arquivo.", { tone: "warn" });
        target.value = "";
      };
      reader.readAsText(file);
      return true;
    }
    if (target instanceof HTMLInputElement && target.dataset.actionFile) {
      void handleFile(target);
      return true;
    }
    if (target instanceof HTMLElement && target.dataset.sheetField) {
      return handleFieldEdit(target, true);
    }
    return false;
  }

  function handleInput(target) {
    if (target instanceof HTMLInputElement && target.dataset.actionInput === "cat-busca") {
      catUi.busca = target.value;
      const sheet = currentSheet();
      if (sheet) refreshCatalog(sheet, { resetScroll: true });
      return true;
    }
    if (target instanceof HTMLSelectElement) return Boolean(target.dataset.sheetField);
    if (target instanceof HTMLElement && target.dataset.sheetField) {
      return handleFieldEdit(target, false);
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

  window.addEventListener("pagehide", flush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });

  window.Sheets = {
    render,
    titleFor,
    handleAction,
    handleSubmit,
    handleChange,
    handleInput,
    flush,
    get: findSheet,
    getCount: () => sheetsState.sheets.length,
    // Usado pelo módulo de iniciativa.
    list: () => sheetsState.sheets.map((sheet) => {
      const ini = sheet.pericias.find((item) => item.id === "iniciativa");
      return {
        id: sheet.id,
        nome: sheet.nome,
        jogador: sheet.jogador,
        classe: sheet.classe,
        imagem: sheet.imagem,
        agi: sheet.atributos.agi,
        bonusIniciativa: ini ? periciaTotal(ini) : 0,
        pv: sheet.pv, pvMax: sheet.pvMax,
        san: sheet.san, sanMax: sheet.sanMax,
        pe: sheet.pe, peMax: sheet.peMax,
        defesa: sheet.defesa,
        fim: sheet.fim,
      };
    }),
    adjustVital: (sheetId, kind, delta) => {
      const sheet = findSheet(sheetId);
      if (!sheet || !VITALS[kind]) return null;
      const antes = sheet[kind];
      const teto = delta > 0 ? Math.max(sheet[`${kind}Max`], antes) : 9999;
      sheet[kind] = clampInt(antes + delta, 0, teto, antes);
      registrarPerda(sheet, kind, antes, sheet[kind]);
      syncCrise(sheet);
      persistSheets();
      return sheet[kind];
    },
  };

  if (window.OP && typeof window.OP.render === "function") {
    window.OP.render();
  }
})();
