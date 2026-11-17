// Habilidades de trilha por NEX. Trilhas do Livro de Regras conferidas contra o livro (fotos das páginas 26–35);
// trilhas de Sobrevivendo ao Horror conferidas contra dados abertos (sistema ordemparanormal do Foundry VTT).
// Textos são resumos próprios — consulte o livro para a regra completa.
// Formato: [NEX, nome, custo, resumo]
window.TRILHAS_HAB = {
  /* ── Combatente ── */
  "Aniquilador": [
    [10, "A Favorita", "", "Escolha uma arma favorita: a categoria dela cai em I."],
    [40, "Técnica Secreta", "2 PE", "Categoria da favorita cai em II. Ao atacar com ela, gaste 2 PE por efeito: Amplo (atinge um alvo extra adjacente) ou Destruidor (+1 no multiplicador de crítico)."],
    [65, "Técnica Sublime", "", "Novos efeitos para a Técnica Secreta: Letal (+2 na margem de ameaça, ou +5 escolhendo duas vezes) e Perfurante (ignora até 5 de resistência a dano)."],
    [99, "Máquina de Matar", "", "Categoria da favorita cai em III; ela ganha +2 na margem de ameaça e +1 dado de dano."],
  ],
  "Comandante de Campo": [
    [10, "Inspirar Confiança", "2 PE", "Reação: um aliado em alcance curto rola de novo um teste que acabou de fazer."],
    [40, "Estrategista", "1 PE/aliado", "Ação padrão: direcione aliados em alcance curto (até seu Intelecto); no próximo turno cada um ganha uma ação de movimento extra."],
    [65, "Brecha na Guarda", "2 PE", "1×/rodada, quando um aliado fere um inimigo em alcance curto, reação para você ou outro aliado atacar esse inimigo. Inspirar Confiança e Estrategista passam a alcance médio."],
    [99, "Oficial Comandante", "5 PE", "Ação padrão: cada aliado que você vê em alcance médio ganha uma ação padrão extra no próximo turno."],
  ],
  "Guerreiro": [
    [10, "Técnica Letal", "", "+2 na margem de ameaça em todos os ataques corpo a corpo."],
    [40, "Revidar", "2 PE", "Ao bloquear um ataque, reação para atacar corpo a corpo quem te atacou."],
    [65, "Força Opressora", "1 PE", "Ao acertar corpo a corpo, derrubar ou empurrar o alvo como ação livre (+5 no empurrão a cada 10 de dano). Derrubou? +1 PE para um ataque extra."],
    [99, "Potência Máxima", "", "Ataque Especial com arma corpo a corpo tem todos os bônus numéricos dobrados."],
  ],
  "Operações Especiais": [
    [10, "Iniciativa Aprimorada", "", "+5 em Iniciativa e uma ação de movimento extra na primeira rodada."],
    [40, "Ataque Extra", "2 PE", "1×/rodada, quando faz um ataque, faça um ataque adicional."],
    [65, "Surto de Adrenalina", "5 PE", "1×/rodada, uma ação padrão ou de movimento extra."],
    [99, "Sempre Alerta", "", "Ganha uma ação padrão extra no início de cada combate."],
  ],
  "Tropa de Choque": [
    [10, "Casca Grossa", "", "+1 PV a cada 5% de NEX; ao bloquear, soma o Vigor na resistência a dano."],
    [40, "Cai Dentro", "1 PE", "Reação quando um inimigo em alcance curto ataca um aliado: ele faz Vontade (DT Vig) ou precisa atacar você (só se você puder ser atacado por ele). Quem passar fica imune a este poder até o fim da cena."],
    [65, "Duro de Matar", "2 PE", "Reação ao sofrer dano não paranormal: reduz à metade. Em NEX 85% vale também para dano paranormal."],
    [99, "Inquebrável", "", "Machucado: +5 na Defesa e resistência a dano 5. Morrendo: não fica indefeso e ainda pode agir (as regras de morte continuam)."],
  ],
  "Agente Secreto": [
    [10, "Carteirada", "", "Treino em Diplomacia ou Enganação (ou +2 se já treinado). Em cada missão recebe documentos que dão privilégios legais."],
    [40, "O Sorriso", "2 PE", "+2 em Diplomacia e Enganação; ao falhar nelas, pague 2 PE para rolar de novo (fica com o novo resultado)."],
    [65, "Método Investigativo", "2 PE", "Urgência das cenas de investigação aumenta em 1 rodada; pague 2 PE para transformar um evento de investigação em “sem evento”."],
    [99, "Multifacetado", "5 SAN", "1×/cena, gaste 5 SAN para receber as habilidades até NEX 65% de uma trilha de combatente ou especialista até o fim da cena."],
  ],
  "Caçador": [
    [10, "Rastrear o Paranormal", "", "Treino em Sobrevivência (ou +2); usa Sobrevivência no lugar de Ocultismo para identificar criaturas e de Investigação/Percepção para rastros paranormais."],
    [40, "Estudar Fraquezas", "", "Ação de interlúdio com uma pista do ser (parte do corpo, vestes): descobre uma informação útil sobre ele."],
    [65, "Atacar das Sombras", "", "Sem penalidade em Furtividade ao andar no deslocamento normal; atacar com arma silenciosa só dá −1d20 em Furtividade."],
    [99, "Estudar a Presa", "", "Estudar Fraquezas pode marcar um tipo de ser como presa: contra ele, +1d20 em perícias, +1 na margem e no multiplicador de crítico e RD 5."],
  ],
  "Monstruoso": [
    [10, "Ser Amaldiçoado", "", "Treino em Ocultismo (ou +2). Escolha um elemento: 1×/dia faz uma etapa ritualística e recebe resistência e efeitos do elemento até o fim do dia; sem ela, sofre fome e sede."],
    [40, "Ser Macabro", "", "A resistência do ritual diário sobe para 1d20 e a penalidade em perícias para −2d20; as mudanças do elemento se intensificam."],
    [65, "Ser Assustador", "", "Resistência do ritual diário sobe para 15, mas a Presença cai 1 permanentemente; ganha novo efeito do elemento."],
    [99, "Ser Aterrorizante", "", "Os efeitos do ritual diário viram permanentes, você conta como criatura paranormal e a resistência sobe para 20."],
  ],
  /* ── Especialista ── */
  "Atirador de Elite": [
    [10, "Mira de Elite", "", "Proficiência com armas de fogo de balas longas; soma Intelecto no dano delas."],
    [40, "Disparo Letal", "1 PE", "Ao mirar, +2 na margem de ameaça do próximo ataque até o fim do seu próximo turno."],
    [65, "Disparo Impactante", "2 PE", "Ao atacar com arma de fogo, em vez de causar dano, faça uma manobra: derrubar, desarmar, empurrar ou quebrar."],
    [99, "Atirar para Matar", "", "Crítico com arma de fogo causa dano máximo, sem rolar."],
  ],
  "Infiltrador": [
    [10, "Ataque Furtivo", "1 PE", "1×/rodada, contra alvo desprevenido ou flanqueado (corpo a corpo ou alcance curto): +1d6 de dano. Sobe para +2d6 (NEX 40), +3d6 (65) e +4d6 (99)."],
    [40, "Gatuno", "", "+5 em Atletismo e Crime; anda no deslocamento normal escondido sem penalidade."],
    [65, "Assassinar", "3 PE", "Ação de movimento analisando um alvo em alcance curto: o próximo Ataque Furtivo nele dobra os dados extras, e se causar dano o alvo fica inconsciente ou morrendo (Fortitude DT Agi evita)."],
    [99, "Sombra Fugaz", "3 PE", "Furtividade logo depois de atacar ou chamar atenção sem a penalidade de −3d20."],
  ],
  "Médico de Campo": [
    [10, "Paramédico", "2 PE", "Ação padrão: cura 2d10 PV de você ou de um aliado adjacente. Em NEX 40, 65 e 99 pode curar +1d10 cada, pagando +1 PE por dado extra. Trilha exige treino em Medicina; as habilidades exigem kit de medicina."],
    [40, "Equipe de Trauma", "2 PE", "Ação padrão: remove uma condição negativa (menos morrendo) de um aliado adjacente."],
    [65, "Resgate", "", "1×/rodada, aproxima-se como ação livre de aliado machucado ou morrendo em alcance curto. Ao curar PV ou remover condição dele, vocês dois ganham +5 na Defesa até seu próximo turno. Carregar alguém ocupa metade dos espaços para você."],
    [99, "Reanimação", "10 PE", "1×/cena, ação completa: traz de volta alguém que morreu nesta cena (exceto por dano massivo)."],
  ],
  "Negociador": [
    [10, "Eloquência", "1 PE/alvo", "Ação completa: Diplomacia, Enganação ou Intimidação contra a Vontade de alvos em alcance curto; quem perder fica fascinado enquanto você se concentra (ação padrão por rodada). Alvo hostil ou em combate tem +5 e novo teste a cada rodada; quem passar fica imune por um dia."],
    [40, "Discurso Motivador", "4 PE", "Ação padrão: você e aliados em alcance curto ganham +1d20 em perícias até o fim da cena (+2d20 por 8 PE a partir de NEX 65)."],
    [65, "Eu Conheço um Cara", "", "1×/missão, pede um favor à sua rede de contatos (reequipar o grupo, abrigo, resgate...). O mestre decide o que é possível."],
    [99, "Truque de Mestre", "5 PE", "Imita qualquer habilidade que viu um aliado usar na cena, pagando todos os custos dela."],
  ],
  "Técnico": [
    [10, "Inventário Otimizado", "", "Soma Intelecto à Força para calcular a carga."],
    [40, "Remendão", "1 PE", "Ação completa: tira a condição quebrado de um equipamento adjacente até o fim da cena; equipamentos gerais têm categoria −I para você."],
    [65, "Improvisar", "2 PE + 2/cat.", "Ação completa: cria uma versão funcional de um equipamento geral, que vira inútil no fim da cena."],
    [99, "Preparado para Tudo", "3 PE/cat.", "Ação de movimento: “encontra” na bolsa qualquer item (exceto armas)."],
  ],
  "Bibliotecário": [
    [10, "Conhecimento Prático", "2 PE", "Num teste de perícia (menos Luta e Pontaria), troca o atributo-base para Intelecto."],
    [40, "Leitor Contumaz", "2 PE", "Bônus da ação de interlúdio ler vira 1d8 e vale para qualquer perícia; pague 2 PE para somar +1 dado."],
    [65, "Rato de Biblioteca", "", "Em lugar cheio de livros, gaste alguns minutos (ou 1 rodada na investigação) para ganhar o efeito de ler ou revisar caso."],
    [99, "A Força do Saber", "", "+1 em Intelecto, soma Intelecto no total de PE e troca o atributo-base de uma perícia para Intelecto."],
  ],
  "Muambeiro": [
    [10, "Mascate", "", "Treino em Profissão (armeiro, engenheiro ou químico), +5 de carga; fabricar item improvisado tem DT −10."],
    [40, "Fabricação Própria", "", "Fabrica itens mundanos na metade do tempo."],
    [65, "Laboratório de Campo", "", "Treino (ou +5) em outra dessas Profissões; pode fabricar e consertar itens paranormais em campo."],
    [99, "Achado Conveniente", "5 PE", "Ação completa: “produz” um item de até categoria III (não paranormal) que funciona até o fim da cena."],
  ],
  "Perseverante": [
    [10, "Soluções Improvisadas", "2 PE", "Rola de novo um dos dados de um teste recém-feito e fica com o melhor."],
    [40, "Fuga Obstinada", "", "+1d20 em testes para fugir; em perseguições, como presa, aguenta até 4 falhas."],
    [65, "Determinação Inquestionável", "5 PE", "1×/cena, ação padrão: remove uma condição de medo, mental ou de paralisia."],
    [99, "Só Mais um Passo...", "5 PE", "1×/rodada, quando cairia a 0 PV, fica com 1 PV (não vale contra dano massivo)."],
  ],
  /* ── Ocultista ── */
  "Conduíte": [
    [10, "Ampliar Ritual", "+2 PE", "Aumenta o alcance de um ritual em um passo ou dobra a área."],
    [40, "Acelerar Ritual", "+4 PE", "1×/rodada, conjura um ritual como ação livre."],
    [65, "Anular Ritual", "PE do ritual", "Quando for alvo de um ritual, pague o mesmo PE que o conjurador pagou e vença um teste oposto de Ocultismo para cancelar todos os efeitos."],
    [99, "Canalizar o Medo", "", "Aprende o ritual Canalizar o Medo."],
  ],
  "Flagelador": [
    [10, "Poder do Flagelo", "", "Paga o custo de rituais com PV (2 PV por PE); esses PV só voltam com descanso."],
    [40, "Abraçar a Dor", "2 PE", "Reação ao sofrer dano não paranormal: reduz à metade."],
    [65, "Absorver Agonia", "", "Ao derrubar inimigos a 0 PV com um ritual, ganha PE temporários iguais ao círculo dele."],
    [99, "Medo Tangível", "", "Aprende o ritual Medo Tangível."],
  ],
  "Graduado": [
    [10, "Saber Ampliado", "", "Aprende um ritual de 1º círculo e mais um a cada novo círculo; não contam no limite."],
    [40, "Grimório Ritualístico", "", "Grimório com rituais de 1º/2º círculo iguais ao seu Intelecto (+1 a cada novo círculo), fora do limite. Para conjurar, empunhe-o e gaste uma ação completa folheando. Ocupa 1 espaço; se perdê-lo, refaz com duas ações de interlúdio."],
    [65, "Rituais Eficientes", "", "+5 na DT de todos os seus rituais."],
    [99, "Conhecendo o Medo", "", "Aprende o ritual Conhecendo o Medo."],
  ],
  "Intuitivo": [
    [10, "Mente Sã", "", "Resistência paranormal +5."],
    [40, "Presença Poderosa", "", "Soma Presença ao limite de PE por turno, só para conjurar rituais (não conta para a DT)."],
    [65, "Inabalável", "", "Resistência a dano mental e paranormal 10; se passar em Vontade contra efeito paranormal de meio dano, não sofre dano."],
    [99, "Presença do Medo", "", "Aprende o ritual Presença do Medo."],
  ],
  "Lâmina Paranormal": [
    [10, "Lâmina Maldita", "", "Aprende Amaldiçoar Arma; se já conhece, pode pagar +1 PE para conjurá-lo como ação de movimento. Com esse ritual ativo, ataca com Ocultismo em vez de Luta ou Pontaria."],
    [40, "Gladiador Paranormal", "", "Cada acerto corpo a corpo dá 2 PE temporários (máx. por cena = seu limite de PE)."],
    [65, "Conjuração Marcial", "2 PE", "1×/rodada, ao conjurar ritual de ação padrão, faz um ataque corpo a corpo como ação livre."],
    [99, "Lâmina do Medo", "", "Aprende o ritual Lâmina do Medo."],
  ],
  "Exorcista": [
    [10, "Revelação do Mal", "", "Treino em Religião (ou +2); usa Religião no lugar de Investigação, Percepção e Ocultismo para o paranormal."],
    [40, "Poder da Fé", "2 PE", "Vira veterano em Religião (ou +1d20); ao falhar numa resistência, repete com Religião."],
    [65, "Parareligiosidade", "+2 PE", "Adiciona a um ritual o efeito de um catalisador ritualístico à escolha."],
    [99, "Chagas da Resistência", "10 PV", "Quando a SAN chegaria a 0, gaste 10 PV para ficar com SAN 1."],
  ],
  "Parapsicólogo": [
    [10, "Terapia", "2 PE", "Usa Profissão (psicólogo) como Diplomacia; 1×/rodada troca uma resistência falhada contra dano mental (sua ou de aliado próximo) por esse teste."],
    [40, "Palavras-Chave", "PE variável", "Ao acalmar alguém, cada PE gasto (até seu limite) devolve 1 de SAN."],
    [65, "Reprogramação Mental", "5 PE", "Interlúdio: dá a um voluntário um poder geral, de classe ou o 1º de uma trilha até o próximo interlúdio."],
    [99, "A Sanidade Está Lá Fora", "5 PE", "Ação de movimento: remove todas as condições de medo e mentais de alguém adjacente (ou de você)."],
  ],
  "Possuído": [
    [10, "Poder Não Desejado", "", "Novos poderes de ocultista viram Transcender; ganha uma reserva de pontos de possessão (PP), recuperada ao dormir, para usar poderes da Entidade."],
    [40, "As Sombras Dentro de Mim", "2 PE", "Recupera 2 PP ao dormir; deixa a Entidade guiar o corpo: +1d20 em Acrobacia, Atletismo e Furtividade."],
    [65, "Ele Me Ensina", "", "Escolha Transcender ou o primeiro poder de outra trilha de ocultista."],
    [99, "Tornamo-nos Um", "6 PE", "Ganha um poder do seu elemento: Conhecimento (um poder qualquer na cena), Energia (teleporte médio), Morte (turno extra) ou Sangue (recupera 50 PV e fica brutal)."],
  ],
  /* Conteúdo sem resumo aqui: anote do livro. */
  "Granadeiro": [[10, "Habilidades do Granadeiro", "", "Veja Arquivos Secretos 4, p. 69, e anote aqui as habilidades por NEX."]],
  "Criptologista do Oculto": [[10, "Habilidades do Criptologista", "", "Veja Arquivos Secretos 5, p. 58, e anote aqui as habilidades por NEX."]],
  "Maledictólogo": [[10, "Habilidades do Maledictólogo", "", "Veja Arquivos Secretos 1, p. 45, e anote aqui as habilidades por NEX."]],
  "Durão": [[10, "Habilidades do Durão", "", "Veja Sobrevivendo ao Horror, p. 31, e anote aqui as habilidades por estágio."]],
  "Esotérico": [[10, "Habilidades do Esotérico", "", "Veja Sobrevivendo ao Horror, p. 32, e anote aqui as habilidades por estágio."]],
  "Esperto": [[10, "Habilidades do Esperto", "", "Veja Sobrevivendo ao Horror, p. 32, e anote aqui as habilidades por estágio."]],
};
