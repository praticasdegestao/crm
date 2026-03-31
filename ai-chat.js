// ai-chat.js - Chat Inteligente Local para o CRM Embrapa
// Motor de NLP baseado em regras para consulta de dados via prompt
// VERSÃO CORRIGIDA - Filtros compostos e prioridade de intenções

var AIChatEngine = {

    // Histórico de mensagens
    historico: [],

    // -------------------------------------------------------
    // MOTOR PRINCIPAL DE PROCESSAMENTO
    // -------------------------------------------------------
    processarPergunta: function(pergunta) {
        if (!pergunta || pergunta.trim() === '') {
            return { texto: 'Por favor, digite uma pergunta sobre os dados do CRM.', tipo: 'aviso' };
        }

        var p = pergunta.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

        // Registrar no histórico
        this.historico.push({ role: 'user', texto: pergunta, timestamp: new Date() });

        var resposta = null;

        // Tentar cada categoria de interpretação em ordem de prioridade
        resposta = resposta || this._interpretarSaudacao(p);
        resposta = resposta || this._interpretarAjuda(p);
        resposta = resposta || this._interpretarResumoGeral(p);
        resposta = resposta || this._interpretarPipeline(p);
        resposta = resposta || this._interpretarClientes(p, pergunta);
        resposta = resposta || this._interpretarNegociacoes(p, pergunta);
        resposta = resposta || this._interpretarTarefas(p);
        resposta = resposta || this._interpretarResponsaveis(p, pergunta);
        resposta = resposta || this._interpretarAtivos(p, pergunta);
        resposta = resposta || this._interpretarContratos(p, pergunta);
        resposta = resposta || this._interpretarProjetos(p, pergunta);
        resposta = resposta || this._interpretarCulturas(p, pergunta);
        resposta = resposta || this._interpretarTemas(p, pergunta);
        resposta = resposta || this._interpretarRegioes(p, pergunta);
        resposta = resposta || this._interpretarValores(p);
        resposta = resposta || this._interpretarQualificacao(p);
        resposta = resposta || this._interpretarPerdas(p);
        resposta = resposta || this._interpretarPrevisao(p);
        resposta = resposta || this._interpretarComparacao(p);
        resposta = resposta || this._interpretarTendencia(p);
        resposta = resposta || this._interpretarTop(p);
        resposta = resposta || this._interpretarAlerta(p);

        if (!resposta) {
            resposta = this._respostaPadrao(pergunta);
        }

        this.historico.push({ role: 'assistant', texto: resposta.texto, timestamp: new Date() });

        return resposta;
    },

    // -------------------------------------------------------
    // HELPER: Mapa completo de estados brasileiros
    // -------------------------------------------------------
    _siglaMap: {
        'acre': 'AC', 'alagoas': 'AL', 'amapa': 'AP', 'amazonas': 'AM',
        'bahia': 'BA', 'ceara': 'CE', 'distrito federal': 'DF',
        'espirito santo': 'ES', 'goias': 'GO', 'maranhao': 'MA',
        'mato grosso': 'MT', 'mato grosso do sul': 'MS', 'minas gerais': 'MG',
        'minas': 'MG', 'para': 'PA', 'paraiba': 'PB', 'parana': 'PR',
        'pernambuco': 'PE', 'piaui': 'PI', 'rio de janeiro': 'RJ',
        'rio grande do norte': 'RN', 'rio grande do sul': 'RS',
        'rondonia': 'RO', 'roraima': 'RR', 'santa catarina': 'SC',
        'sao paulo': 'SP', 'sergipe': 'SE', 'tocantins': 'TO'
    },

    _resolverEstado: function(texto) {
        if (!texto || texto.length < 2) return null;

        var textoNorm = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

        // Se já é uma sigla válida (2 letras)
        if (textoNorm.length === 2) {
            var siglaUpper = textoNorm.toUpperCase();
            var self = this;
            var siglasValidas = {};
            Object.keys(this._siglaMap).forEach(function(k) {
                siglasValidas[self._siglaMap[k]] = k;
            });
            if (siglasValidas[siglaUpper]) {
                return { sigla: siglaUpper, nome: siglasValidas[siglaUpper] };
            }
        }

        // Buscar pelo nome completo
        if (this._siglaMap[textoNorm]) {
            return { sigla: this._siglaMap[textoNorm], nome: textoNorm };
        }

        // Match parcial
        var self = this;
        var encontrado = null;
        Object.keys(this._siglaMap).forEach(function(nomeEstado) {
            if (!encontrado && (nomeEstado.indexOf(textoNorm) !== -1 || textoNorm.indexOf(nomeEstado) !== -1)) {
                encontrado = { sigla: self._siglaMap[nomeEstado], nome: nomeEstado };
            }
        });

        return encontrado;
    },

    // Helper: Extrair nome de entidade após preposição
    _extrairEntidadeAposPreposicao: function(p, termosPre) {
        for (var i = 0; i < termosPre.length; i++) {
            var idx = p.lastIndexOf(termosPre[i]);
            if (idx !== -1) {
                var resto = p.substring(idx + termosPre[i].length).trim();
                if (resto.length > 1) return resto;
            }
        }
        return null;
    },

    // Helper: Buscar cliente por nome (parcial)
    _buscarClientePorNome: function(nomeBusca) {
        if (!nomeBusca || nomeBusca.length < 2) return null;
        var nomeNorm = nomeBusca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return data.clientes.find(function(c) {
            var clienteNorm = c.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            return clienteNorm.indexOf(nomeNorm) !== -1;
        });
    },

    // Helper: Buscar responsável por nome (parcial)
    _buscarResponsavelPorNome: function(nomeBusca) {
        if (!nomeBusca || nomeBusca.length < 2) return null;
        var nomeNorm = nomeBusca.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return data.users.find(function(u) {
            var userNorm = u.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            return userNorm.indexOf(nomeNorm) !== -1;
        });
    },

    // -------------------------------------------------------
    // INTERPRETADORES DE INTENÇÃO
    // -------------------------------------------------------

    _interpretarSaudacao: function(p) {
        if (/^(oi|ola|hey|bom dia|boa tarde|boa noite|hello|hi)/.test(p)) {
            var hora = new Date().getHours();
            var saudacao = hora < 12 ? 'Bom dia' : (hora < 18 ? 'Boa tarde' : 'Boa noite');
            return {
                texto: saudacao + '! Sou o assistente de análise do CRM Embrapa. ' +
                    'Posso ajudar com informações sobre negociações, clientes, tarefas, ativos tecnológicos e muito mais. ' +
                    'Digite **"ajuda"** para ver exemplos do que posso responder.',
                tipo: 'saudacao'
            };
        }
        return null;
    },

    _interpretarAjuda: function(p) {
        if (/^(ajuda|help|o que voce (pode|sabe)|como funciona|comandos|exemplos)/.test(p)) {
            return {
                texto: '**Exemplos de perguntas que posso responder:**\n\n' +
                    '📊 **Resumo e Pipeline:**\n' +
                    '• "Qual o resumo geral do CRM?"\n' +
                    '• "Como está o pipeline?"\n' +
                    '• "Qual o valor total do pipeline?"\n\n' +
                    '👥 **Clientes:**\n' +
                    '• "Quantos clientes temos?"\n' +
                    '• "Quais clientes são da Bahia?"\n' +
                    '• "Clientes de SP"\n' +
                    '• "Informações sobre o cliente [nome]"\n\n' +
                    '📋 **Negociações:**\n' +
                    '• "Quantas negociações estão em andamento?"\n' +
                    '• "Quais negociações estão paradas?"\n' +
                    '• "Negociações contratadas"\n' +
                    '• "Negociações do cliente [nome]"\n\n' +
                    '✅ **Tarefas:**\n' +
                    '• "Quantas tarefas estão atrasadas?"\n' +
                    '• "Tarefas pendentes"\n\n' +
                    '👤 **Responsáveis:**\n' +
                    '• "Quem tem mais negociações?"\n' +
                    '• "Negociações do [nome do responsável]"\n\n' +
                    '🔧 **Ativos e Contratos:**\n' +
                    '• "Quantos ativos tecnológicos temos?"\n' +
                    '• "Contratos que vencem este ano"\n' +
                    '• "Contratos vencidos"\n\n' +
                    '📈 **Análises:**\n' +
                    '• "Qual a taxa de conversão?"\n' +
                    '• "Top 5 negociações por valor"\n' +
                    '• "Quais são os alertas?"\n' +
                    '• "Tendência de negociações"',
                tipo: 'ajuda'
            };
        }
        return null;
    },

    _interpretarResumoGeral: function(p) {
        if (/(resumo|visao geral|overview|status geral|como esta o crm|panorama|situacao geral)/.test(p)) {
            var totalCards = data.cards.length;
            var totalClientes = data.clientes.length;
            var totalAtivos = data.ativos.length;
            var totalContratos = data.contratos.length;

            var novas = data.cards.filter(function(c) { return c.situacao === 'Nova'; }).length;
            var andamento = data.cards.filter(function(c) { return c.situacao === 'Em Andamento'; }).length;
            var contratadas = data.cards.filter(function(c) { return c.situacao === 'Contratada'; }).length;
            var perdidas = data.cards.filter(function(c) { return c.situacao === 'Perdida'; }).length;

            var valorTotal = 0;
            data.cards.forEach(function(c) { valorTotal += calculateCardTotal(c); });

            var taxaConversao = totalCards > 0 ? Math.round((contratadas / totalCards) * 100) : 0;

            var tarefasAtrasadas = 0;
            data.cards.forEach(function(c) {
                if (!c.tarefas) return;
                c.tarefas.forEach(function(t) {
                    if (t.situacao !== 'Concluída' && t.prazo && new Date(t.prazo) < new Date()) {
                        tarefasAtrasadas++;
                    }
                });
            });

            return {
                texto: '**📊 Resumo Geral do CRM Embrapa**\n\n' +
                    '**Números Gerais:**\n' +
                    '• Total de Negociações: **' + totalCards + '**\n' +
                    '• Total de Clientes/Parceiros: **' + totalClientes + '**\n' +
                    '• Ativos Tecnológicos: **' + totalAtivos + '**\n' +
                    '• Contratos/Convênios: **' + totalContratos + '**\n\n' +
                    '**Status das Negociações:**\n' +
                    '• 🆕 Novas: **' + novas + '**\n' +
                    '• 🔄 Em Andamento: **' + andamento + '**\n' +
                    '• ✅ Contratadas: **' + contratadas + '**\n' +
                    '• ❌ Perdidas: **' + perdidas + '**\n\n' +
                    '**Indicadores:**\n' +
                    '• Valor Total do Pipeline: **R$ ' + formatCurrency(valorTotal) + '**\n' +
                    '• Taxa de Conversão: **' + taxaConversao + '%**\n' +
                    '• Tarefas Atrasadas: **' + tarefasAtrasadas + '**\n\n' +
                    (tarefasAtrasadas > 0 ? '⚠️ _Atenção: existem tarefas atrasadas que precisam de revisão._' : '✅ _Sem alertas críticos no momento._'),
                tipo: 'resumo'
            };
        }
        return null;
    },

    _interpretarPipeline: function(p) {
        if (/(pipeline|funil|etapas|como esta(o)? (o |as )?negocia)/.test(p)) {
            var etapasMap = {};
            var valorPorEtapa = {};

            data.cards.forEach(function(card) {
                if (card.situacao === 'Perdida' || card.situacao === 'Contratada') return;
                var list = data.lists.find(function(l) { return l.id === card.list_id; });
                var nome = list ? list.nome : 'Sem Etapa';
                etapasMap[nome] = (etapasMap[nome] || 0) + 1;
                valorPorEtapa[nome] = (valorPorEtapa[nome] || 0) + calculateCardTotal(card);
            });

            var texto = '**📈 Status do Pipeline**\n\n';
            var totalAtivo = 0;
            var valorTotalPipeline = 0;

            Object.keys(etapasMap).forEach(function(etapa) {
                texto += '• **' + etapa + '**: ' + etapasMap[etapa] + ' negociação(ões) — R$ ' + formatCurrency(valorPorEtapa[etapa]) + '\n';
                totalAtivo += etapasMap[etapa];
                valorTotalPipeline += valorPorEtapa[etapa];
            });

            texto += '\n**Total ativo no pipeline:** ' + totalAtivo + ' negociações\n';
            texto += '**Valor total do pipeline:** R$ ' + formatCurrency(valorTotalPipeline);

            if (window.AIAnalyzer) {
                var previsao = AIAnalyzer.preverReceitaPipeline();
                texto += '\n**Previsão ponderada:** R$ ' + formatCurrency(previsao.totalPonderado);
            }

            return { texto: texto, tipo: 'pipeline' };
        }
        return null;
    },

    // ============================================================
    // CLIENTES - CORRIGIDO: prioridade de filtro por estado
    // ============================================================
    _interpretarClientes: function(p, original) {
        var self = this;

        // ----------------------------------------------------------
        // PRIORIDADE 1: Clientes por ESTADO/LOCALIDADE
        // Exemplos: "quantos clientes tem na Bahia", "clientes da BA",
        //           "clientes de SP", "parceiros em Minas Gerais"
        // ----------------------------------------------------------
        var preposicoes = [' da ', ' do ', ' de ', ' no ', ' na ', ' em ', ' ne ', ' nos ', ' nas '];
        var temCliente = /(clientes|parceiros|cliente|parceiro)/.test(p);
        var temLocalidade = false;
        var estadoTexto = null;

        if (temCliente) {
            for (var i = 0; i < preposicoes.length; i++) {
                var idx = p.lastIndexOf(preposicoes[i]);
                if (idx !== -1) {
                    var resto = p.substring(idx + preposicoes[i].length).trim();
                    if (resto.length >= 2) {
                        var estadoInfo = self._resolverEstado(resto);
                        if (estadoInfo) {
                            temLocalidade = true;
                            estadoTexto = estadoInfo;
                            break;
                        }
                    }
                }
            }
        }

        if (temCliente && temLocalidade && estadoTexto) {
            var clientesEstado = data.clientes.filter(function(c) {
                return c.estado && c.estado.toUpperCase() === estadoTexto.sigla;
            });

            if (clientesEstado.length > 0) {
                var nomeFormatado = estadoTexto.nome.charAt(0).toUpperCase() + estadoTexto.nome.slice(1);
                var texto = '**👥 Clientes em ' + nomeFormatado + ' (' + estadoTexto.sigla + '): ' + clientesEstado.length + '**\n\n';
                clientesEstado.forEach(function(c) {
                    texto += '• **' + c.nome + '** — ' + (c.cidade || '-') + ' | ' + (c.tipo || '-') + '\n';
                });
                return { texto: texto, tipo: 'clientes' };
            } else {
                return {
                    texto: 'Não encontrei nenhum cliente cadastrado em **' + estadoTexto.nome + '** (' + estadoTexto.sigla + ').\n\n' +
                        'Verifique se o estado está correto ou se os clientes estão com o campo "Estado" preenchido.',
                    tipo: 'aviso'
                };
            }
        }

        // ----------------------------------------------------------
        // PRIORIDADE 2: Quantos clientes (total geral)
        // ----------------------------------------------------------
        if (/(quantos|total|numero).*(clientes|parceiros)/.test(p) || /(clientes|parceiros).*(quantos|total|numero)/.test(p)) {
            var tipos = {};
            data.clientes.forEach(function(c) {
                var tipo = c.tipo || 'Não classificado';
                tipos[tipo] = (tipos[tipo] || 0) + 1;
            });

            var texto = '**👥 Total de Clientes/Parceiros: ' + data.clientes.length + '**\n\n';
            texto += '**Por tipo:**\n';
            Object.keys(tipos).sort(function(a, b) { return tipos[b] - tipos[a]; }).forEach(function(tipo) {
                texto += '• ' + tipo + ': **' + tipos[tipo] + '**\n';
            });
            return { texto: texto, tipo: 'clientes' };
        }

        // ----------------------------------------------------------
        // PRIORIDADE 3: Buscar cliente específico por nome
        // ----------------------------------------------------------
        if (/(informac|dados|detalh|sobre|buscar|encontr|pesquis).*(cliente|parceiro)/.test(p) ||
            /(cliente|parceiro).*(informac|dados|detalh)/.test(p)) {
            var nomeBusca = original.replace(/.*(?:cliente|parceiro|sobre|informações|dados|detalhes)\s*(?:do|da|de|o|a)?\s*/i, '').trim();
            if (nomeBusca.length > 2) {
                var clienteEncontrado = self._buscarClientePorNome(nomeBusca);

                if (clienteEncontrado) {
                    var cartoesCliente = data.cards.filter(function(c) { return c.cliente_id === clienteEncontrado.id; });
                    var contratosCliente = data.contratos.filter(function(c) { return c.cliente_id === clienteEncontrado.id; });

                    var texto = '**📋 Informações do Cliente: ' + clienteEncontrado.nome + '**\n\n';
                    texto += '• **Tipo:** ' + (clienteEncontrado.tipo || '-') + '\n';
                    texto += '• **Cidade/UF:** ' + (clienteEncontrado.cidade || '-') + '/' + (clienteEncontrado.estado || '-') + '\n';
                    texto += '• **Telefone:** ' + (clienteEncontrado.telefone || '-') + '\n';
                    texto += '• **E-mail:** ' + (clienteEncontrado.email || '-') + '\n';
                    texto += '• **Negociações:** ' + cartoesCliente.length + '\n';
                    texto += '• **Contratos:** ' + contratosCliente.length + '\n';

                    if (cartoesCliente.length > 0) {
                        texto += '\n**Negociações:**\n';
                        cartoesCliente.forEach(function(c) {
                            var valor = calculateCardTotal(c);
                            texto += '• ' + (c.titulo || 'Sem título') + ' — ' + (c.situacao || '-') + ' — R$ ' + formatCurrency(valor) + '\n';
                        });
                    }

                    return { texto: texto, tipo: 'cliente-detalhe' };
                } else {
                    return { texto: 'Não encontrei nenhum cliente com o nome "' + nomeBusca + '". Verifique a grafia e tente novamente.', tipo: 'aviso' };
                }
            }
        }

        return null;
    },

    // ============================================================
    // NEGOCIAÇÕES - CORRIGIDO: filtros compostos (situação + cliente + estado)
    // ============================================================
    _interpretarNegociacoes: function(p, original) {
        var self = this;

        // ----------------------------------------------------------
        // Detectar filtros compostos na pergunta
        // ----------------------------------------------------------
        var filtroCliente = null;
        var filtroEstado = null;

        // Tentar extrair cliente da pergunta
        var preposicoes = [' do cliente ', ' da empresa ', ' do parceiro ', ' da '];
        for (var i = 0; i < preposicoes.length; i++) {
            var idx = p.indexOf(preposicoes[i]);
            if (idx !== -1) {
                var nomeExtraido = p.substring(idx + preposicoes[i].length).trim();
                // Limpar termos finais que não são nomes
                nomeExtraido = nomeExtraido.replace(/\?$/, '').trim();
                if (nomeExtraido.length > 2) {
                    var clienteMatch = self._buscarClientePorNome(nomeExtraido);
                    if (clienteMatch) {
                        filtroCliente = clienteMatch;
                        break;
                    }
                }
            }
        }

        // Tentar extrair estado
        var prepEstado = [' na ', ' no ', ' em ', ' de ', ' da ', ' do '];
        for (var j = 0; j < prepEstado.length; j++) {
            var idxE = p.lastIndexOf(prepEstado[j]);
            if (idxE !== -1) {
                var restoE = p.substring(idxE + prepEstado[j].length).trim().replace(/\?$/, '');
                if (restoE.length >= 2) {
                    var estadoInfo = self._resolverEstado(restoE);
                    if (estadoInfo) {
                        filtroEstado = estadoInfo;
                        break;
                    }
                }
            }
        }

        // ----------------------------------------------------------
        // Por situação (com filtros compostos)
        // ----------------------------------------------------------
        var situacoes = {
            'nova': 'Nova', 'novas': 'Nova',
            'andamento': 'Em Andamento', 'em andamento': 'Em Andamento',
            'contratada': 'Contratada', 'contratadas': 'Contratada', 'ganhas': 'Contratada', 'ganha': 'Contratada',
            'perdida': 'Perdida', 'perdidas': 'Perdida'
        };

        for (var key in situacoes) {
            if (p.indexOf(key) !== -1 && /(negociac|cartao|cartoes|quantas|quais|listar)/.test(p)) {
                var sit = situacoes[key];
                var cards = data.cards.filter(function(c) { return c.situacao === sit; });

                // Aplicar filtro de cliente
                if (filtroCliente) {
                    cards = cards.filter(function(c) { return c.cliente_id === filtroCliente.id; });
                }

                // Aplicar filtro de estado (via cliente)
                if (filtroEstado && !filtroCliente) {
                    var clientesDoEstado = data.clientes.filter(function(c) {
                        return c.estado && c.estado.toUpperCase() === filtroEstado.sigla;
                    }).map(function(c) { return c.id; });
                    cards = cards.filter(function(c) {
                        return clientesDoEstado.indexOf(c.cliente_id) !== -1;
                    });
                }

                var filtroDescricao = '';
                if (filtroCliente) filtroDescricao = ' do cliente ' + filtroCliente.nome;
                if (filtroEstado && !filtroCliente) filtroDescricao = ' em ' + filtroEstado.nome;

                var texto = '**Negociações "' + sit + '"' + filtroDescricao + ': ' + cards.length + '**\n\n';
                if (cards.length > 0 && cards.length <= 20) {
                    cards.forEach(function(c) {
                        var cliente = data.clientes.find(function(cl) { return cl.id === c.cliente_id; });
                        texto += '• **' + (c.titulo || 'Sem título') + '** — ' + (cliente ? cliente.nome : '-') + ' — R$ ' + formatCurrency(calculateCardTotal(c)) + '\n';
                    });
                } else if (cards.length > 20) {
                    texto += '_Mostrando os 20 primeiros:_\n\n';
                    cards.slice(0, 20).forEach(function(c) {
                        var cliente = data.clientes.find(function(cl) { return cl.id === c.cliente_id; });
                        texto += '• **' + (c.titulo || 'Sem título') + '** — ' + (cliente ? cliente.nome : '-') + '\n';
                    });
                }
                return { texto: texto, tipo: 'negociacoes' };
            }
        }

        // ----------------------------------------------------------
        // Negociações de um cliente específico (sem filtro de situação)
        // Exemplos: "negociações do cliente X", "cartões da empresa Y"
        // ----------------------------------------------------------
        if (/(negociac|cartao|cartoes)/.test(p) && filtroCliente) {
            var cardsCliente = data.cards.filter(function(c) { return c.cliente_id === filtroCliente.id; });

            var texto = '**📋 Negociações do cliente ' + filtroCliente.nome + ': ' + cardsCliente.length + '**\n\n';
            if (cardsCliente.length > 0) {
                cardsCliente.forEach(function(c) {
                    texto += '• **' + (c.titulo || 'Sem título') + '** — ' + (c.situacao || '-') + ' — R$ ' + formatCurrency(calculateCardTotal(c)) + '\n';
                });
            }
            return { texto: texto, tipo: 'negociacoes' };
        }

        // Negociações paradas
        if (/(parada|parado|inat|sem (atividade|contato|moviment)|estagnada)/.test(p)) {
            var paradas = window.AIAnalyzer ? AIAnalyzer._identificarNegociacoesParadas(30) : [];
            if (paradas.length > 0) {
                var texto = '**⏰ Negociações Paradas (sem atividade há mais de 30 dias): ' + paradas.length + '**\n\n';
                paradas.slice(0, 10).forEach(function(item) {
                    texto += '• **' + item.titulo + '** — ' + item.cliente + ' — **' + item.diasParada + ' dias** sem atividade\n';
                });
                if (paradas.length > 10) texto += '\n_...e mais ' + (paradas.length - 10) + ' negociações paradas._';
                return { texto: texto, tipo: 'alerta' };
            } else {
                return { texto: '✅ Não há negociações paradas há mais de 30 dias.', tipo: 'info' };
            }
        }

        // Total de negociações
        if (/(quantas|total|numero).*(negociac|cartao|cartoes)/.test(p) || /(negociac|cartao|cartoes).*(quantas|total)/.test(p)) {
            return {
                texto: '**Total de negociações cadastradas: ' + data.cards.length + '**',
                tipo: 'info'
            };
        }

        return null;
    },

    _interpretarTarefas: function(p) {
        if (/(tarefa|tarefas)/.test(p)) {
            var totalTarefas = 0;
            var pendentes = 0;
            var andamento = 0;
            var concluidas = 0;
            var atrasadas = 0;

            data.cards.forEach(function(c) {
                if (!c.tarefas) return;
                c.tarefas.forEach(function(t) {
                    totalTarefas++;
                    if (t.situacao === 'Pendente') pendentes++;
                    else if (t.situacao === 'Andamento') andamento++;
                    else if (t.situacao === 'Concluída') concluidas++;

                    if (t.situacao !== 'Concluída' && t.prazo && new Date(t.prazo) < new Date()) {
                        atrasadas++;
                    }
                });
            });

            if (/(atrasada|vencida|atraso)/.test(p)) {
                var listaAtrasadas = window.AIAnalyzer ? AIAnalyzer._identificarTarefasAtrasadas() : [];
                var texto = '**⚠️ Tarefas Atrasadas: ' + atrasadas + '**\n\n';
                if (listaAtrasadas.length > 0) {
                    listaAtrasadas.slice(0, 10).forEach(function(t) {
                        texto += '• **' + t.tarefaTitulo + '** — Cartão: ' + t.cardTitulo + ' — Responsável: ' + t.responsavel + ' — **' + t.diasAtraso + ' dias** de atraso\n';
                    });
                }
                return { texto: texto, tipo: 'alerta' };
            }

            return {
                texto: '**✅ Resumo das Tarefas**\n\n' +
                    '• Total: **' + totalTarefas + '**\n' +
                    '• Pendentes: **' + pendentes + '**\n' +
                    '• Em Andamento: **' + andamento + '**\n' +
                    '• Concluídas: **' + concluidas + '**\n' +
                    '• ⚠️ Atrasadas: **' + atrasadas + '**',
                tipo: 'tarefas'
            };
        }
        return null;
    },

    // ============================================================
    // RESPONSÁVEIS - CORRIGIDO: melhor captura de nomes
    // ============================================================
    _interpretarResponsaveis: function(p, original) {
        var self = this;

        if (/(quem tem mais|responsavel|responsaveis|carga|distribuic)/.test(p)) {
            var respCount = {};
            data.cards.forEach(function(c) {
                if (!c.responsavel_id) return;
                respCount[c.responsavel_id] = (respCount[c.responsavel_id] || 0) + 1;
            });

            var lista = Object.keys(respCount).map(function(rId) {
                var user = data.users.find(function(u) { return u.id === rId; });
                return { nome: user ? user.nome : 'Desconhecido', qtd: respCount[rId] };
            }).sort(function(a, b) { return b.qtd - a.qtd; });

            var texto = '**👤 Distribuição de Negociações por Responsável:**\n\n';
            lista.forEach(function(item, idx) {
                texto += (idx + 1) + '. **' + item.nome + '**: ' + item.qtd + ' negociação(ões)\n';
            });

            return { texto: texto, tipo: 'responsaveis' };
        }

        // Buscar por nome de responsável
        if (/(negociac|cartoes?|trabalho|demanda)/.test(p)) {
            var nomeBusca = self._extrairEntidadeAposPreposicao(p, [' do ', ' da ', ' de ']);

            if (nomeBusca) {
                var usuario = self._buscarResponsavelPorNome(nomeBusca);

                if (usuario) {
                    var cardsResp = data.cards.filter(function(c) { return c.responsavel_id === usuario.id; });
                    var texto = '**Negociações de ' + usuario.nome + ': ' + cardsResp.length + '**\n\n';
                    cardsResp.forEach(function(c) {
                        var cliente = data.clientes.find(function(cl) { return cl.id === c.cliente_id; });
                        texto += '• **' + (c.titulo || 'Sem título') + '** — ' + (cliente ? cliente.nome : '-') + ' — ' + (c.situacao || '-') + '\n';
                    });
                    return { texto: texto, tipo: 'responsavel-detalhe' };
                }
            }
        }

        return null;
    },

    // ============================================================
    // ATIVOS - CORRIGIDO: adicionado filtro por projeto
    // ============================================================
    _interpretarAtivos: function(p, original) {
        if (/(ativo|ativos|tecnolog)/.test(p)) {

            // Ativos de um projeto específico
            if (/(projeto|proj)/.test(p)) {
                var nomeProjeto = this._extrairEntidadeAposPreposicao(p, [' do projeto ', ' do proj ', ' de ']);
                if (nomeProjeto) {
                    var projetoNorm = nomeProjeto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    var projeto = data.projetos.find(function(pr) {
                        return pr.titulo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').indexOf(projetoNorm) !== -1;
                    });
                    if (projeto) {
                        var ativosDoProjeto = data.ativos.filter(function(a) { return a.projeto_origem === projeto.id; });
                        var texto = '**🔧 Ativos do Projeto "' + projeto.titulo + '": ' + ativosDoProjeto.length + '**\n\n';
                        ativosDoProjeto.forEach(function(a) {
                            var gestor = data.users.find(function(u) { return u.id === a.gestor; });
                            texto += '• **' + a.nome + '** — TRL: ' + (a.trl || '-') + ' | CRL: ' + (a.crl || '-') + ' | Gestor: ' + (gestor ? gestor.nome : '-') + '\n';
                        });
                        return { texto: texto, tipo: 'ativos' };
                    }
                }
            }

            if (/(quantos|total|numero|listar|quais)/.test(p)) {
                var texto = '**🔧 Ativos Tecnológicos: ' + data.ativos.length + '**\n\n';
                data.ativos.forEach(function(a) {
                    var gestor = data.users.find(function(u) { return u.id === a.gestor; });
                    texto += '• **' + a.nome + '** — TRL: ' + (a.trl || '-') + ' | CRL: ' + (a.crl || '-') + ' | Gestor: ' + (gestor ? gestor.nome : '-') + '\n';
                });
                return { texto: texto, tipo: 'ativos' };
            }

            if (/(adocao|adotado)/.test(p)) {
                var emAdocao = data.ativos.filter(function(a) { return a.em_adocao === 'Sim'; });
                var texto = '**Ativos em Adoção: ' + emAdocao.length + ' de ' + data.ativos.length + '**\n\n';
                emAdocao.forEach(function(a) {
                    texto += '• **' + a.nome + '** — ' + (a.dados_adocao || 'Sem detalhes') + '\n';
                });
                return { texto: texto, tipo: 'ativos' };
            }
        }
        return null;
    },

    // ============================================================
    // CONTRATOS - CORRIGIDO: adicionado "contratos vencidos"
    // ============================================================
    _interpretarContratos: function(p, original) {
        if (/(contrato|convenio|convênio)/.test(p)) {

            // Contratos vencidos
            if (/(vencido|expirado|venceram)/.test(p)) {
                var hoje = new Date();
                var contratosVencidos = data.contratos.filter(function(c) {
                    if (!c.data_final_vigencia) return false;
                    return new Date(c.data_final_vigencia) < hoje;
                });

                var texto = '**📄 Contratos Vencidos: ' + contratosVencidos.length + '**\n\n';
                contratosVencidos.forEach(function(c) {
                    var cliente = data.clientes.find(function(cl) { return cl.id === c.cliente_id; });
                    texto += '• **' + c.numero_saic + '** — ' + (cliente ? cliente.nome : '-') + ' — Vigência: ' + c.data_final_vigencia + ' ⚠️ VENCIDO\n';
                });
                if (contratosVencidos.length === 0) {
                    texto = '✅ Nenhum contrato vencido encontrado.';
                }
                return { texto: texto, tipo: 'contratos' };
            }

            // Contratos que vencem este ano
            if (/(vence|vigencia|vencimento|expira)/.test(p)) {
                var hoje = new Date();
                var anoAtual = hoje.getFullYear();

                var contratosVencendo = data.contratos.filter(function(c) {
                    if (!c.data_final_vigencia) return false;
                    var vigencia = new Date(c.data_final_vigencia);
                    return vigencia.getFullYear() === anoAtual;
                });

                var texto = '**📄 Contratos com vigência expirando em ' + anoAtual + ': ' + contratosVencendo.length + '**\n\n';
                contratosVencendo.forEach(function(c) {
                    var cliente = data.clientes.find(function(cl) { return cl.id === c.cliente_id; });
                    var vencido = new Date(c.data_final_vigencia) < hoje;
                    texto += '• **' + c.numero_saic + '** — ' + (cliente ? cliente.nome : '-') + ' — Vigência: ' + c.data_final_vigencia + (vencido ? ' ⚠️ VENCIDO' : '') + '\n';
                });
                return { texto: texto, tipo: 'contratos' };
            }

            // Contratos de um cliente específico
            var nomeCliente = this._extrairEntidadeAposPreposicao(p, [' do cliente ', ' da empresa ', ' do parceiro ', ' do ', ' da ']);
            if (nomeCliente) {
                var clienteMatch = this._buscarClientePorNome(nomeCliente);
                if (clienteMatch) {
                    var contratosCliente = data.contratos.filter(function(c) { return c.cliente_id === clienteMatch.id; });
                    var texto = '**📄 Contratos de ' + clienteMatch.nome + ': ' + contratosCliente.length + '**\n\n';
                    contratosCliente.forEach(function(c) {
                        texto += '• **' + c.numero_saic + '** — Tipo: ' + (c.tipo_parceria || '-') + ' — Vigência: ' + (c.data_final_vigencia || '-') + '\n';
                    });
                    return { texto: texto, tipo: 'contratos' };
                }
            }

            if (/(quantos|total|numero|listar)/.test(p)) {
                return {
                    texto: '**📄 Total de Contratos/Convênios: ' + data.contratos.length + '**',
                    tipo: 'info'
                };
            }
        }
        return null;
    },

    _interpretarProjetos: function(p, original) {
        if (/(projeto|projetos)/.test(p) && /(quantos|total|listar|quais)/.test(p)) {
            var texto = '**📂 Projetos Cadastrados: ' + data.projetos.length + '**\n\n';
            data.projetos.forEach(function(proj) {
                var resp = data.users.find(function(u) { return u.id === proj.responsavel; });
                texto += '• **' + (proj.codigo || '-') + '** — ' + proj.titulo + ' — Resp: ' + (resp ? resp.nome : '-') + '\n';
            });
            return { texto: texto, tipo: 'projetos' };
        }
        return null;
    },

    _interpretarCulturas: function(p, original) {
        if (/(cultura|culturas|agricola)/.test(p) && /(quantas|total|listar|quais)/.test(p)) {
            var texto = '**🌱 Culturas Agrícolas: ' + data.culturas.length + '**\n\n';
            data.culturas.forEach(function(c) {
                var numEsp = c.especialistas ? c.especialistas.length : 0;
                texto += '• **' + c.nome + '** — ' + numEsp + ' especialista(s)\n';
            });
            return { texto: texto, tipo: 'culturas' };
        }
        return null;
    },

    _interpretarTemas: function(p, original) {
        if (/(tema|temas)/.test(p) && /(quantos|total|listar|quais)/.test(p)) {
            var texto = '**🏷️ Temas Cadastrados: ' + data.temas.length + '**\n\n';
            data.temas.forEach(function(t) {
                var numEsp = t.especialistas ? t.especialistas.length : 0;
                texto += '• **' + t.nome + '** — ' + numEsp + ' especialista(s)\n';
            });
            return { texto: texto, tipo: 'temas' };
        }
        return null;
    },

    _interpretarRegioes: function(p, original) {
        if (/(regiao|regioes|regiões)/.test(p) && /(quantas|total|listar|quais)/.test(p)) {
            var texto = '**📍 Regiões Cadastradas: ' + data.regioes.length + '**\n\n';
            data.regioes.forEach(function(r) {
                texto += '• **' + r.nome + '** — ' + (r.estado || '-') + '\n';
            });
            return { texto: texto, tipo: 'regioes' };
        }
        return null;
    },

    // ============================================================
    // VALORES - CORRIGIDO: filtro por cliente e estado
    // ============================================================
    _interpretarValores: function(p) {
        if (/(valor|valores|financeiro|receita|faturamento|quanto vale|valor total)/.test(p)) {
            var self = this;

            // Verificar se há filtro de cliente
            var nomeCliente = self._extrairEntidadeAposPreposicao(p, [' do cliente ', ' da empresa ', ' do parceiro ']);
            var clienteFiltro = nomeCliente ? self._buscarClientePorNome(nomeCliente) : null;

            // Verificar se há filtro de estado
            var estadoFiltro = null;
            var prepEstado = [' na ', ' no ', ' em ', ' da ', ' do ', ' de '];
            for (var i = 0; i < prepEstado.length; i++) {
                var idx = p.lastIndexOf(prepEstado[i]);
                if (idx !== -1) {
                    var resto = p.substring(idx + prepEstado[i].length).trim().replace(/\?$/, '');
                    if (resto.length >= 2) {
                        var estadoInfo = self._resolverEstado(resto);
                        if (estadoInfo) {
                            estadoFiltro = estadoInfo;
                            break;
                        }
                    }
                }
            }

            var cardsParaCalculo = data.cards;

            // Aplicar filtro de cliente
            if (clienteFiltro) {
                cardsParaCalculo = cardsParaCalculo.filter(function(c) { return c.cliente_id === clienteFiltro.id; });
            }

            // Aplicar filtro de estado
            if (estadoFiltro && !clienteFiltro) {
                var clientesDoEstado = data.clientes.filter(function(c) {
                    return c.estado && c.estado.toUpperCase() === estadoFiltro.sigla;
                }).map(function(c) { return c.id; });
                cardsParaCalculo = cardsParaCalculo.filter(function(c) {
                    return clientesDoEstado.indexOf(c.cliente_id) !== -1;
                });
            }

            var valorTotal = 0;
            var valorContratado = 0;
            var valorPipeline = 0;

            cardsParaCalculo.forEach(function(c) {
                var val = calculateCardTotal(c);
                valorTotal += val;
                if (c.situacao === 'Contratada') valorContratado += val;
                if (c.situacao !== 'Perdida' && c.situacao !== 'Contratada') valorPipeline += val;
            });

            var descricaoFiltro = '';
            if (clienteFiltro) descricaoFiltro = ' — Cliente: ' + clienteFiltro.nome;
            if (estadoFiltro && !clienteFiltro) descricaoFiltro = ' — Estado: ' + estadoFiltro.nome + ' (' + estadoFiltro.sigla + ')';

            return {
                texto: '**💰 Análise de Valores' + descricaoFiltro + '**\n\n' +
                    '• Valor total de todas as negociações: **R$ ' + formatCurrency(valorTotal) + '**\n' +
                    '• Valor contratado: **R$ ' + formatCurrency(valorContratado) + '**\n' +
                    '• Valor no pipeline (ativas): **R$ ' + formatCurrency(valorPipeline) + '**\n' +
                    (cardsParaCalculo.length > 0 ? '• Negociações consideradas: **' + cardsParaCalculo.length + '**\n' : '') +
                    (window.AIAnalyzer && !clienteFiltro && !estadoFiltro ? '\n• Previsão ponderada: **R$ ' + formatCurrency(AIAnalyzer.preverReceitaPipeline().totalPonderado) + '**' : ''),
                tipo: 'valores'
            };
        }
        return null;
    },

    _interpretarQualificacao: function(p) {
        if (/(qualificac|quente|frio|morno)/.test(p)) {
            var qualLabels = { '1': 'Muito Frio', '2': 'Frio', '3': 'Morno', '4': 'Quente', '5': 'Quero Contratar' };
            var qualCount = {};
            var semQual = 0;

            data.cards.forEach(function(c) {
                if (c.qualificacao && qualLabels[c.qualificacao]) {
                    var label = c.qualificacao + '. ' + qualLabels[c.qualificacao];
                    qualCount[label] = (qualCount[label] || 0) + 1;
                } else {
                    semQual++;
                }
            });

            var texto = '**⭐ Distribuição de Qualificação**\n\n';
            Object.keys(qualCount).sort().forEach(function(q) {
                texto += '• ' + q + ': **' + qualCount[q] + '**\n';
            });
            if (semQual > 0) texto += '• Sem qualificação: **' + semQual + '**\n';

            return { texto: texto, tipo: 'qualificacao' };
        }
        return null;
    },

    _interpretarPerdas: function(p) {
        if (/(perda|perdas|perdida|perdidas|motivo.*(perda|perdida)|por que perd)/.test(p)) {
            var perdas = data.cards.filter(function(c) { return c.situacao === 'Perdida'; });

            if (perdas.length === 0) {
                return { texto: '✅ Nenhuma negociação perdida registrada.', tipo: 'info' };
            }

            var texto = '**❌ Análise de Perdas: ' + perdas.length + ' negociação(ões)**\n\n';
            var taxaPerda = Math.round((perdas.length / data.cards.length) * 100);
            texto += '**Taxa de perda:** ' + taxaPerda + '%\n\n';

            var motivos = {};
            perdas.forEach(function(c) {
                var motivo = c.motivo_perda || 'Motivo não informado';
                motivos[motivo] = (motivos[motivo] || 0) + 1;
            });

            texto += '**Motivos:**\n';
            Object.keys(motivos).sort(function(a, b) { return motivos[b] - motivos[a]; }).forEach(function(m) {
                texto += '• ' + m + ': **' + motivos[m] + '**\n';
            });

            return { texto: texto, tipo: 'perdas' };
        }
        return null;
    },

    _interpretarPrevisao: function(p) {
        if (/(previsao|prever|previsão|forecast|probabilidade|score|fechamento)/.test(p)) {
            if (!window.AIAnalyzer) {
                return { texto: 'Módulo de análise de IA não disponível.', tipo: 'erro' };
            }

            var previsao = AIAnalyzer.preverReceitaPipeline();
            var texto = '**🔮 Previsão de Pipeline**\n\n';
            texto += '• Pipeline total: **R$ ' + formatCurrency(previsao.totalPipeline) + '**\n';
            texto += '• Previsão ponderada (por score): **R$ ' + formatCurrency(previsao.totalPonderado) + '**\n\n';

            if (previsao.porEtapa.length > 0) {
                texto += '**Por etapa:**\n';
                previsao.porEtapa.forEach(function(e) {
                    var prob = e.valor > 0 ? Math.round((e.ponderado / e.valor) * 100) : 0;
                    texto += '• ' + e.etapa + ': ' + e.quantidade + ' negociações — R$ ' + formatCurrency(e.valor) + ' (prob. média: ' + prob + '%)\n';
                });
            }

            return { texto: texto, tipo: 'previsao' };
        }
        return null;
    },

    _interpretarComparacao: function(p) {
        if (/(comparar|comparacao|versus|vs|diferenca entre)/.test(p)) {
            return {
                texto: 'Para comparações, tente perguntas como:\n' +
                    '• "Quantas negociações estão contratadas vs perdidas?"\n' +
                    '• "Qual a taxa de conversão?"\n' +
                    '• "Quem tem mais negociações?"',
                tipo: 'dica'
            };
        }

        // Taxa de conversão
        if (/(taxa|percentual|porcentagem).*(conversao|sucesso)/.test(p) || /(conversao|sucesso).*(taxa|percentual)/.test(p)) {
            var total = data.cards.length;
            var contratadas = data.cards.filter(function(c) { return c.situacao === 'Contratada'; }).length;
            var perdidas = data.cards.filter(function(c) { return c.situacao === 'Perdida'; }).length;
            var taxaConv = total > 0 ? Math.round((contratadas / total) * 100) : 0;
            var taxaPerda = total > 0 ? Math.round((perdidas / total) * 100) : 0;

            return {
                texto: '**📊 Taxas de Conversão**\n\n' +
                    '• Total de negociações: **' + total + '**\n' +
                    '• Contratadas: **' + contratadas + '** (' + taxaConv + '%)\n' +
                    '• Perdidas: **' + perdidas + '** (' + taxaPerda + '%)\n' +
                    '• Em andamento: **' + (total - contratadas - perdidas) + '** (' + (100 - taxaConv - taxaPerda) + '%)\n\n' +
                    '**Taxa de conversão: ' + taxaConv + '%**',
                tipo: 'metricas'
            };
        }
        return null;
    },

    _interpretarTendencia: function(p) {
        if (/(tendencia|tendência|crescimento|queda|evolucao|evolução)/.test(p)) {
            var mesesCount = {};
            data.cards.forEach(function(c) {
                if (!c.data_contato) return;
                var mes = c.data_contato.substring(0, 7);
                mesesCount[mes] = (mesesCount[mes] || 0) + 1;
            });

            var meses = Object.keys(mesesCount).sort();
            if (meses.length < 2) {
                return { texto: 'Dados insuficientes para análise de tendência (necessários ao menos 2 meses de dados).', tipo: 'aviso' };
            }

            var texto = '**📈 Tendência de Negociações por Mês**\n\n';
            meses.forEach(function(m) {
                var barra = '';
                for (var i = 0; i < mesesCount[m]; i++) barra += '█';
                texto += '• ' + m + ': ' + barra + ' **' + mesesCount[m] + '**\n';
            });

            if (meses.length >= 3) {
                var ultimos = meses.slice(-3);
                var vals = ultimos.map(function(m) { return mesesCount[m]; });
                if (vals[2] > vals[1] && vals[1] > vals[0]) {
                    texto += '\n📈 **Tendência de crescimento** nos últimos 3 meses!';
                } else if (vals[2] < vals[1] && vals[1] < vals[0]) {
                    texto += '\n📉 **Tendência de queda** nos últimos 3 meses. Atenção!';
                } else {
                    texto += '\n↔️ **Tendência estável** nos últimos 3 meses.';
                }
            }

            return { texto: texto, tipo: 'tendencia' };
        }
        return null;
    },

    _interpretarTop: function(p) {
        if (/(top|ranking|maiores|melhores|principais)/.test(p)) {
            var n = 5;
            var matchNum = p.match(/top\s*(\d+)/);
            if (matchNum) n = parseInt(matchNum[1]);

            // Top por valor
            if (/(valor|valor potencial|caro|valiosa)/.test(p)) {
                var cardsComValor = data.cards.map(function(c) {
                    return { card: c, valor: calculateCardTotal(c) };
                }).filter(function(item) { return item.valor > 0; })
                    .sort(function(a, b) { return b.valor - a.valor; })
                    .slice(0, n);

                var texto = '**🏆 Top ' + n + ' Negociações por Valor**\n\n';
                cardsComValor.forEach(function(item, idx) {
                    var cliente = data.clientes.find(function(cl) { return cl.id === item.card.cliente_id; });
                    texto += (idx + 1) + '. **' + (item.card.titulo || 'Sem título') + '** — ' + (cliente ? cliente.nome : '-') + ' — **R$ ' + formatCurrency(item.valor) + '** — ' + (item.card.situacao || '-') + '\n';
                });
                return { texto: texto, tipo: 'ranking' };
            }

            // Top por score
            if (/(score|probabilidade|chance|fechamento)/.test(p) && window.AIAnalyzer) {
                var scores = [];
                data.cards.forEach(function(c) {
                    if (c.situacao === 'Contratada' || c.situacao === 'Perdida') return;
                    var scoreInfo = AIAnalyzer.calcularScoreNegociacao(c.id);
                    if (scoreInfo) scores.push({ card: c, score: scoreInfo.score, prob: scoreInfo.probabilidadeFechamento });
                });
                scores.sort(function(a, b) { return b.score - a.score; });

                var texto = '**🏆 Top ' + n + ' Negociações por Probabilidade de Fechamento**\n\n';
                scores.slice(0, n).forEach(function(item, idx) {
                    var cliente = data.clientes.find(function(cl) { return cl.id === item.card.cliente_id; });
                    texto += (idx + 1) + '. **' + (item.card.titulo || 'Sem título') + '** — Score: **' + item.score + '** — Prob: **' + item.prob + '** — ' + (cliente ? cliente.nome : '-') + '\n';
                });
                return { texto: texto, tipo: 'ranking' };
            }

            // Top clientes
            if (/(cliente|parceiro)/.test(p)) {
                var clienteCount = {};
                data.cards.forEach(function(c) {
                    if (!c.cliente_id) return;
                    clienteCount[c.cliente_id] = (clienteCount[c.cliente_id] || 0) + 1;
                });

                var topClientes = Object.keys(clienteCount).map(function(cid) {
                    var cl = data.clientes.find(function(c) { return c.id === cid; });
                    return { nome: cl ? cl.nome : 'Desconhecido', qtd: clienteCount[cid] };
                }).sort(function(a, b) { return b.qtd - a.qtd; }).slice(0, n);

                var texto = '**🏆 Top ' + n + ' Clientes por Número de Negociações**\n\n';
                topClientes.forEach(function(item, idx) {
                    texto += (idx + 1) + '. **' + item.nome + '**: ' + item.qtd + ' negociação(ões)\n';
                });
                return { texto: texto, tipo: 'ranking' };
            }

            // Top genérico (por valor)
            var cardsValor = data.cards.map(function(c) {
                return { card: c, valor: calculateCardTotal(c) };
            }).sort(function(a, b) { return b.valor - a.valor; }).slice(0, n);

            var texto = '**🏆 Top ' + n + ' Negociações por Valor**\n\n';
            cardsValor.forEach(function(item, idx) {
                var cliente = data.clientes.find(function(cl) { return cl.id === item.card.cliente_id; });
                texto += (idx + 1) + '. **' + (item.card.titulo || 'Sem título') + '** — R$ ' + formatCurrency(item.valor) + ' — ' + (item.card.situacao || '-') + '\n';
            });
            return { texto: texto, tipo: 'ranking' };
        }
        return null;
    },

    _interpretarAlerta: function(p) {
        if (/(alerta|alertas|problema|risco|atencao|urgente|critico)/.test(p)) {
            var alertas = [];

            // Tarefas atrasadas
            var atrasadas = 0;
            data.cards.forEach(function(c) {
                if (!c.tarefas) return;
                c.tarefas.forEach(function(t) {
                    if (t.situacao !== 'Concluída' && t.prazo && new Date(t.prazo) < new Date()) atrasadas++;
                });
            });
            if (atrasadas > 0) alertas.push('⚠️ **' + atrasadas + ' tarefa(s) atrasada(s)** precisam de atenção');

            // Negociações paradas
            if (window.AIAnalyzer) {
                var paradas = AIAnalyzer._identificarNegociacoesParadas(30);
                if (paradas.length > 0) alertas.push('⏰ **' + paradas.length + ' negociação(ões) parada(s)** há mais de 30 dias');
            }

            // Contratos vencidos
            var contratosVencidos = data.contratos.filter(function(c) {
                return c.data_final_vigencia && new Date(c.data_final_vigencia) < new Date();
            });
            if (contratosVencidos.length > 0) alertas.push('📄 **' + contratosVencidos.length + ' contrato(s) vencido(s)** precisam de renovação');

            // Fechamentos próximos
            var proximosFechamento = data.cards.filter(function(c) {
                if (!c.data_fechamento || c.situacao === 'Contratada' || c.situacao === 'Perdida') return false;
                var dias = Math.ceil((new Date(c.data_fechamento) - new Date()) / (1000 * 60 * 60 * 24));
                return dias >= 0 && dias <= 7;
            });
            if (proximosFechamento.length > 0) alertas.push('🔔 **' + proximosFechamento.length + ' negociação(ões)** com fechamento previsto nos próximos 7 dias');

            // Fechamentos atrasados
            var fechamentosAtrasados = data.cards.filter(function(c) {
                if (!c.data_fechamento || c.situacao === 'Contratada' || c.situacao === 'Perdida') return false;
                return new Date(c.data_fechamento) < new Date();
            });
            if (fechamentosAtrasados.length > 0) alertas.push('❌ **' + fechamentosAtrasados.length + ' negociação(ões)** com previsão de fechamento vencida');

            if (alertas.length === 0) {
                return { texto: '✅ **Nenhum alerta crítico no momento.** Tudo parece estar em ordem.', tipo: 'info' };
            }

            return {
                texto: '**🚨 Alertas do CRM (' + alertas.length + ')**\n\n' + alertas.join('\n'),
                tipo: 'alerta'
            };
        }
        return null;
    },

    // ============================================================
    // RESPOSTA PADRÃO - CORRIGIDO: busca com termos menores (2+ chars)
    // ============================================================
    _respostaPadrao: function(pergunta) {
        var termosBusca = pergunta.toLowerCase().split(' ').filter(function(t) { return t.length > 2; });

        if (termosBusca.length > 0) {
            var resultados = [];

            // Buscar em clientes
            data.clientes.forEach(function(c) {
                termosBusca.forEach(function(t) {
                    if (c.nome.toLowerCase().indexOf(t) !== -1) {
                        resultados.push('👤 Cliente: **' + c.nome + '** (' + (c.tipo || '-') + ') — ' + (c.cidade || '-') + '/' + (c.estado || '-'));
                    }
                });
            });

            // Buscar em cards
            data.cards.forEach(function(c) {
                termosBusca.forEach(function(t) {
                    if (c.titulo && c.titulo.toLowerCase().indexOf(t) !== -1) {
                        resultados.push('📋 Negociação: **' + c.titulo + '** (' + (c.situacao || '-') + ')');
                    }
                });
            });

            // Buscar em ativos
            data.ativos.forEach(function(a) {
                termosBusca.forEach(function(t) {
                    if (a.nome.toLowerCase().indexOf(t) !== -1) {
                        resultados.push('🔧 Ativo: **' + a.nome + '** (TRL: ' + (a.trl || '-') + ')');
                    }
                });
            });

            // Buscar em projetos
            data.projetos.forEach(function(pr) {
                termosBusca.forEach(function(t) {
                    if (pr.titulo && pr.titulo.toLowerCase().indexOf(t) !== -1) {
                        resultados.push('📂 Projeto: **' + pr.titulo + '**');
                    }
                });
            });

            // Buscar em contratos
            data.contratos.forEach(function(ct) {
                termosBusca.forEach(function(t) {
                    if (ct.numero_saic && ct.numero_saic.toLowerCase().indexOf(t) !== -1) {
                        resultados.push('📄 Contrato: **' + ct.numero_saic + '**');
                    }
                });
            });

            // Remover duplicatas
            resultados = resultados.filter(function(v, i, a) { return a.indexOf(v) === i; });

            if (resultados.length > 0) {
                return {
                    texto: '**🔍 Resultados encontrados para "' + pergunta + '":**\n\n' + resultados.slice(0, 10).join('\n') +
                        (resultados.length > 10 ? '\n\n_...e mais ' + (resultados.length - 10) + ' resultados._' : ''),
                    tipo: 'busca'
                };
            }
        }

        return {
            texto: 'Não consegui entender sua pergunta. Tente reformulá-la ou digite **"ajuda"** para ver exemplos do que posso responder.\n\n' +
                '**Algumas sugestões:**\n' +
                '• "Qual o resumo geral do CRM?"\n' +
                '• "Quantos clientes temos?"\n' +
                '• "Clientes da Bahia"\n' +
                '• "Negociações do cliente [nome]"\n' +
                '• "Quais negociações estão paradas?"\n' +
                '• "Top 5 negociações por valor"\n' +
                '• "Contratos vencidos"\n' +
                '• "Quais são os alertas?"',
            tipo: 'erro'
        };
    }
};


// ==================== INTERFACE DO CHAT ====================

var AIChatInterface = {

    isOpen: false,

    renderChat: function() {
        var existente = document.getElementById('aiChatContainer');
        if (existente) existente.remove();

        var container = document.createElement('div');
        container.id = 'aiChatContainer';
        container.innerHTML =
            '<div id="aiChatFab" onclick="AIChatInterface.toggleChat()">' +
                '<i class="fas fa-comments"></i>' +
                '<span class="chat-fab-label">Chat IA</span>' +
            '</div>' +

            '<div id="aiChatWindow" class="ai-chat-window">' +
                '<div class="ai-chat-header">' +
                    '<div class="ai-chat-header-info">' +
                        '<i class="fas fa-robot"></i>' +
                        '<div>' +
                            '<strong>Assistente CRM</strong>' +
                            '<small>Análise local de dados</small>' +
                        '</div>' +
                    '</div>' +
                    '<div class="ai-chat-header-actions">' +
                        '<button onclick="AIChatInterface.limparChat()" title="Limpar conversa"><i class="fas fa-eraser"></i></button>' +
                        '<button onclick="AIChatInterface.toggleChat()" title="Fechar"><i class="fas fa-times"></i></button>' +
                    '</div>' +
                '</div>' +

                '<div id="aiChatMessages" class="ai-chat-messages">' +
                    '<div class="ai-chat-msg ai-chat-msg-bot">' +
                        '<div class="ai-chat-msg-avatar"><i class="fas fa-robot"></i></div>' +
                        '<div class="ai-chat-msg-content">' +
                            '<p>Olá! Sou o assistente de análise do CRM Embrapa. Posso consultar todos os dados cadastrados e responder suas perguntas.</p>' +
                            '<p>Digite <strong>"ajuda"</strong> para ver exemplos ou faça uma pergunta diretamente!</p>' +
                        '</div>' +
                    '</div>' +
                '</div>' +

                '<div class="ai-chat-suggestions" id="aiChatSuggestions">' +
                    '<button onclick="AIChatInterface.enviarSugestao(\'Qual o resumo geral?\')">📊 Resumo geral</button>' +
                    '<button onclick="AIChatInterface.enviarSugestao(\'Quais são os alertas?\')">🚨 Alertas</button>' +
                    '<button onclick="AIChatInterface.enviarSugestao(\'Como está o pipeline?\')">📈 Pipeline</button>' +
                    '<button onclick="AIChatInterface.enviarSugestao(\'Tarefas atrasadas\')">⏰ Tarefas</button>' +
                '</div>' +

                '<div class="ai-chat-input-area">' +
                    '<input type="text" id="aiChatInput" placeholder="Pergunte sobre os dados do CRM..." ' +
                        'onkeypress="if(event.key===\'Enter\') AIChatInterface.enviarMensagem()">' +
                    '<button onclick="AIChatInterface.enviarMensagem()" id="aiChatSendBtn">' +
                        '<i class="fas fa-paper-plane"></i>' +
                    '</button>' +
                '</div>' +
            '</div>';

        document.body.appendChild(container);
    },

    toggleChat: function() {
        var chatWindow = document.getElementById('aiChatWindow');
        var fab = document.getElementById('aiChatFab');

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            chatWindow.classList.add('open');
            fab.classList.add('hidden');
            document.getElementById('aiChatInput').focus();
        } else {
            chatWindow.classList.remove('open');
            fab.classList.remove('hidden');
        }
    },

    enviarMensagem: function() {
        var input = document.getElementById('aiChatInput');
        var pergunta = input.value.trim();
        if (!pergunta) return;

        this._adicionarMensagem(pergunta, 'user');
        input.value = '';

        var sugestoes = document.getElementById('aiChatSuggestions');
        if (sugestoes) sugestoes.style.display = 'none';

        this._mostrarDigitando();

        var self = this;
        setTimeout(function() {
            self._removerDigitando();
            var resposta = AIChatEngine.processarPergunta(pergunta);
            self._adicionarMensagem(resposta.texto, 'bot', resposta.tipo);
        }, 300 + Math.random() * 500);
    },

    enviarSugestao: function(texto) {
        document.getElementById('aiChatInput').value = texto;
        this.enviarMensagem();
    },

    limparChat: function() {
        var container = document.getElementById('aiChatMessages');
        container.innerHTML =
            '<div class="ai-chat-msg ai-chat-msg-bot">' +
                '<div class="ai-chat-msg-avatar"><i class="fas fa-robot"></i></div>' +
                '<div class="ai-chat-msg-content">' +
                    '<p>Conversa limpa! Como posso ajudar?</p>' +
                '</div>' +
            '</div>';

        AIChatEngine.historico = [];

        var sugestoes = document.getElementById('aiChatSuggestions');
        if (sugestoes) sugestoes.style.display = 'flex';
    },

    _adicionarMensagem: function(texto, role, tipo) {
        var container = document.getElementById('aiChatMessages');

        var msgDiv = document.createElement('div');
        msgDiv.className = 'ai-chat-msg ai-chat-msg-' + (role === 'user' ? 'user' : 'bot');

        if (role === 'user') {
            msgDiv.innerHTML =
                '<div class="ai-chat-msg-content">' +
                    '<p>' + this._escapeHtml(texto) + '</p>' +
                '</div>' +
                '<div class="ai-chat-msg-avatar"><i class="fas fa-user"></i></div>';
        } else {
            var htmlTexto = this._formatarMarkdown(texto);
            var tipoClass = tipo ? ' ai-chat-tipo-' + tipo : '';

            msgDiv.innerHTML =
                '<div class="ai-chat-msg-avatar"><i class="fas fa-robot"></i></div>' +
                '<div class="ai-chat-msg-content' + tipoClass + '">' + htmlTexto + '</div>';
        }

        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    },

    _mostrarDigitando: function() {
        var container = document.getElementById('aiChatMessages');
        var typingDiv = document.createElement('div');
        typingDiv.id = 'aiChatTyping';
        typingDiv.className = 'ai-chat-msg ai-chat-msg-bot';
        typingDiv.innerHTML =
            '<div class="ai-chat-msg-avatar"><i class="fas fa-robot"></i></div>' +
            '<div class="ai-chat-msg-content ai-chat-typing">' +
                '<span class="dot"></span><span class="dot"></span><span class="dot"></span>' +
            '</div>';
        container.appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
    },

    _removerDigitando: function() {
        var typing = document.getElementById('aiChatTyping');
        if (typing) typing.remove();
    },

    _escapeHtml: function(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    _formatarMarkdown: function(texto) {
        var html = this._escapeHtml(texto);
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\_(.+?)\_/g, '<em>$1</em>');
        html = html.replace(/\n/g, '<br>');
        html = html.replace(/•\s/g, '<span class="ai-chat-bullet">•</span> ');
        return '<p>' + html + '</p>';
    }
};


// ==================== INICIALIZAR CHAT ====================
var _chatInitInterval = setInterval(function() {
    if (document.getElementById('mainApp') && !document.getElementById('aiChatContainer')) {
        AIChatInterface.renderChat();
        clearInterval(_chatInitInterval);
    }
}, 1000);


// ==================== EXPORTAR PARA USO GLOBAL ====================
window.AIChatEngine = AIChatEngine;
window.AIChatInterface = AIChatInterface;
