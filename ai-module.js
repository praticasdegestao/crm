// ai-module.js - Módulo de Inteligência Artificial do CRM Embrapa

// ==================== CONFIGURAÇÃO ====================
var AI_CONFIG = {
    apiKey: '',
    apiProvider: 'local',
    openaiEndpoint: 'https://api.openai.com/v1/chat/completions',
    claudeEndpoint: 'https://api.anthropic.com/v1/messages',
    model: 'gpt-4o-mini',
    maxTokens: 1500
};

// ==================== MOTOR DE ANÁLISE LOCAL ====================

var AIAnalyzer = {

    // -------------------------------------------------------
    // 1. ANÁLISE DE PADRÕES
    // -------------------------------------------------------
    analisarPadroes: function() {
        var insights = [];

        // --- Padrão: Taxa de conversão por etapa ---
        var etapasStats = this._calcularConversaoPorEtapa();
        if (etapasStats.gargalo) {
            insights.push({
                tipo: 'padrao',
                icone: 'fas fa-exclamation-triangle',
                cor: '#FF9F1A',
                titulo: 'Gargalo Identificado',
                descricao: 'A etapa "' + etapasStats.gargalo.nome + '" concentra ' +
                    etapasStats.gargalo.percentual + '% dos cartões. ' +
                    'Considere revisar o processo nesta fase.',
                prioridade: 'alta',
                dados: etapasStats
            });
        }

        // --- Padrão: Negociações paradas ---
        var negociacoesParadas = this._identificarNegociacoesParadas(30);
        if (negociacoesParadas.length > 0) {
            insights.push({
                tipo: 'padrao',
                icone: 'fas fa-clock',
                cor: '#EB5A46',
                titulo: 'Negociações Paradas',
                descricao: negociacoesParadas.length + ' negociação(ões) não têm atividade há mais de 30 dias. ' +
                    'Risco de perda se não forem retomadas.',
                prioridade: 'alta',
                itens: negociacoesParadas
            });
        }

        // --- Padrão: Clientes com múltiplas negociações ---
        var clientesRecorrentes = this._identificarClientesRecorrentes();
        if (clientesRecorrentes.length > 0) {
            insights.push({
                tipo: 'padrao',
                icone: 'fas fa-users',
                cor: '#61BD4F',
                titulo: 'Clientes Recorrentes',
                descricao: clientesRecorrentes.length + ' cliente(s) possuem múltiplas negociações. ' +
                    'Oportunidade para fortalecer relacionamento e aumentar valor.',
                prioridade: 'media',
                itens: clientesRecorrentes
            });
        }

        // --- Padrão: Distribuição de qualificação ---
        var qualStats = this._analisarDistribuicaoQualificacao();
        if (qualStats.insight) {
            insights.push({
                tipo: 'padrao',
                icone: 'fas fa-star',
                cor: '#0079BF',
                titulo: 'Distribuição de Qualificação',
                descricao: qualStats.insight,
                prioridade: 'media',
                dados: qualStats
            });
        }

        // --- Padrão: Taxa de perda por etapa ---
        var perdasPorEtapa = this._analisarPerdasPorEtapa();
        if (perdasPorEtapa.insight) {
            insights.push({
                tipo: 'padrao',
                icone: 'fas fa-chart-line',
                cor: '#EB5A46',
                titulo: 'Análise de Perdas',
                descricao: perdasPorEtapa.insight,
                prioridade: 'alta',
                dados: perdasPorEtapa
            });
        }

        // --- Padrão: Concentração de responsáveis ---
        var concentracao = this._analisarConcentracaoResponsaveis();
        if (concentracao.insight) {
            insights.push({
                tipo: 'padrao',
                icone: 'fas fa-balance-scale',
                cor: '#FF9F1A',
                titulo: 'Distribuição de Carga',
                descricao: concentracao.insight,
                prioridade: 'media',
                dados: concentracao
            });
        }

        // --- Padrão: Sazonalidade de contatos ---
        var sazonalidade = this._analisarSazonalidade();
        if (sazonalidade.insight) {
            insights.push({
                tipo: 'padrao',
                icone: 'fas fa-calendar-alt',
                cor: '#5BA4CF',
                titulo: 'Tendência Temporal',
                descricao: sazonalidade.insight,
                prioridade: 'baixa',
                dados: sazonalidade
            });
        }

        // --- Padrão: Tarefas atrasadas ---
        var tarefasAtrasadas = this._identificarTarefasAtrasadas();
        if (tarefasAtrasadas.length > 0) {
            insights.push({
                tipo: 'padrao',
                icone: 'fas fa-tasks',
                cor: '#EB5A46',
                titulo: 'Tarefas Atrasadas',
                descricao: tarefasAtrasadas.length + ' tarefa(s) estão com prazo vencido. ' +
                    'Atenção urgente necessária.',
                prioridade: 'alta',
                itens: tarefasAtrasadas
            });
        }

        return insights;
    },

    // -------------------------------------------------------
    // 2. SUGESTÕES DE PRÓXIMAS AÇÕES
    // -------------------------------------------------------
    sugerirProximasAcoes: function(cardId) {
        var card = data.cards.find(function(c) { return c.id === cardId; });
        if (!card) return [];

        var sugestoes = [];
        var cliente = data.clientes.find(function(c) { return c.id === card.cliente_id; });
        var list = data.lists.find(function(l) { return l.id === card.list_id; });
        var etapaNome = list ? list.nome.toLowerCase() : '';

        // --- Sugestão baseada na qualificação ---
        if (!card.qualificacao || card.qualificacao === '') {
            sugestoes.push({
                icone: 'fas fa-star',
                texto: 'Defina a qualificação desta negociação para melhor acompanhamento.',
                acao: 'Editar cartão e preencher o campo "Qualificação"',
                urgencia: 'media'
            });
        }

        // --- Sugestão baseada na etapa ---
        if (etapaNome.indexOf('primeiro contato') !== -1 || etapaNome.indexOf('lead') !== -1) {
            sugestoes.push({
                icone: 'fas fa-phone',
                texto: 'Agende um contato de acompanhamento dentro dos próximos 7 dias.',
                acao: 'Criar uma tarefa de follow-up',
                urgencia: 'alta'
            });

            if (!card.data_fechamento) {
                sugestoes.push({
                    icone: 'fas fa-calendar',
                    texto: 'Defina uma previsão de fechamento para esta negociação.',
                    acao: 'Editar cartão e preencher "Previsão de Fechamento"',
                    urgencia: 'media'
                });
            }
        }

        if (etapaNome.indexOf('oportunidade') !== -1) {
            sugestoes.push({
                icone: 'fas fa-file-alt',
                texto: 'Prepare uma proposta técnica/comercial detalhada.',
                acao: 'Avançar para a etapa de Proposta',
                urgencia: 'alta'
            });

            if (card.qualificacao && parseInt(card.qualificacao) >= 4) {
                sugestoes.push({
                    icone: 'fas fa-rocket',
                    texto: 'Qualificação alta! Priorize esta negociação para fechamento rápido.',
                    acao: 'Agendar reunião decisiva com o cliente',
                    urgencia: 'alta'
                });
            }
        }

        if (etapaNome.indexOf('proposta') !== -1) {
            sugestoes.push({
                icone: 'fas fa-handshake',
                texto: 'Faça follow-up da proposta enviada. Verifique dúvidas do cliente.',
                acao: 'Entrar em contato para acompanhar a proposta',
                urgencia: 'alta'
            });

            if (!card.contrato_id) {
                sugestoes.push({
                    icone: 'fas fa-file-contract',
                    texto: 'Associe ou prepare o contrato/convênio para esta negociação.',
                    acao: 'Vincular contrato ao cartão',
                    urgencia: 'media'
                });
            }
        }

        if (etapaNome.indexOf('contrata') !== -1) {
            sugestoes.push({
                icone: 'fas fa-check-circle',
                texto: 'Finalize a documentação e formalize o contrato.',
                acao: 'Alterar situação para "Contratada" após assinatura',
                urgencia: 'alta'
            });
        }

        // --- Sugestão baseada em tarefas ---
        if (!card.tarefas || card.tarefas.length === 0) {
            sugestoes.push({
                icone: 'fas fa-tasks',
                texto: 'Crie pelo menos uma tarefa de acompanhamento para esta negociação.',
                acao: 'Adicionar tarefas no cartão',
                urgencia: 'media'
            });
        } else {
            var tarefasPendentes = card.tarefas.filter(function(t) {
                return t.situacao === 'Pendente' || t.situacao === 'Andamento';
            });
            var tarefasAtrasadas = card.tarefas.filter(function(t) {
                if (!t.prazo || t.situacao === 'Concluída') return false;
                return new Date(t.prazo) < new Date();
            });

            if (tarefasAtrasadas.length > 0) {
                sugestoes.push({
                    icone: 'fas fa-exclamation-circle',
                    texto: tarefasAtrasadas.length + ' tarefa(s) atrasada(s)! Atualize ou redefina os prazos.',
                    acao: 'Revisar tarefas pendentes',
                    urgencia: 'alta'
                });
            }

            if (tarefasPendentes.length === 0 && card.situacao !== 'Contratada' && card.situacao !== 'Perdida') {
                sugestoes.push({
                    icone: 'fas fa-plus-circle',
                    texto: 'Todas as tarefas estão concluídas. Crie novas ações ou avance a etapa.',
                    acao: 'Definir próximos passos',
                    urgencia: 'media'
                });
            }
        }

        // --- Sugestão baseada no valor ---
        var valorTotal = calculateCardTotal(card);
        if (valorTotal === 0) {
            sugestoes.push({
                icone: 'fas fa-dollar-sign',
                texto: 'Preencha o valor potencial desta oportunidade para análises financeiras.',
                acao: 'Editar cartão e preencher "Valor Potencial"',
                urgencia: 'baixa'
            });
        }

        // --- Sugestão baseada em campos vazios ---
        if (!card.tema_id) {
            sugestoes.push({
                icone: 'fas fa-tag',
                texto: 'Associe um tema a esta negociação para melhor categorização.',
                acao: 'Editar cartão e preencher "Tema"',
                urgencia: 'baixa'
            });
        }

        if (!card.ativo_id) {
            sugestoes.push({
                icone: 'fas fa-cogs',
                texto: 'Vincule um ativo tecnológico relacionado a esta negociação.',
                acao: 'Editar cartão e preencher "Ativo Tecnológico"',
                urgencia: 'baixa'
            });
        }

        // --- Sugestão baseada no histórico do cliente ---
        if (cliente) {
            var outrasNegociacoes = data.cards.filter(function(c) {
                return c.cliente_id === cliente.id && c.id !== card.id;
            });

            var negociacoesContratadas = outrasNegociacoes.filter(function(c) {
                return c.situacao === 'Contratada';
            });

            if (negociacoesContratadas.length > 0) {
                sugestoes.push({
                    icone: 'fas fa-history',
                    texto: 'Cliente já tem ' + negociacoesContratadas.length +
                        ' contrato(s) anterior(es). Use o relacionamento existente a seu favor.',
                    acao: 'Consultar histórico do cliente para referências',
                    urgencia: 'media'
                });
            }

            var negociacoesPerdidas = outrasNegociacoes.filter(function(c) {
                return c.situacao === 'Perdida';
            });

            if (negociacoesPerdidas.length > 0) {
                sugestoes.push({
                    icone: 'fas fa-exclamation-triangle',
                    texto: 'Atenção: ' + negociacoesPerdidas.length +
                        ' negociação(ões) anterior(es) com este cliente foram perdidas. Analise os motivos.',
                    acao: 'Revisar motivos de perda anteriores',
                    urgencia: 'alta'
                });
            }
        }

        // --- Sugestão baseada na previsão de fechamento ---
        if (card.data_fechamento) {
            var diasParaFechamento = Math.ceil(
                (new Date(card.data_fechamento) - new Date()) / (1000 * 60 * 60 * 24)
            );

            if (diasParaFechamento < 0) {
                sugestoes.push({
                    icone: 'fas fa-calendar-times',
                    texto: 'A previsão de fechamento já passou há ' +
                        Math.abs(diasParaFechamento) + ' dia(s). Atualize a data ou revise a negociação.',
                    acao: 'Atualizar previsão de fechamento',
                    urgencia: 'alta'
                });
            } else if (diasParaFechamento <= 7) {
                sugestoes.push({
                    icone: 'fas fa-bell',
                    texto: 'Fechamento previsto em ' + diasParaFechamento +
                        ' dia(s). Intensifique os esforços de conclusão.',
                    acao: 'Agendar ação decisiva esta semana',
                    urgencia: 'alta'
                });
            } else if (diasParaFechamento <= 30) {
                sugestoes.push({
                    icone: 'fas fa-hourglass-half',
                    texto: 'Fechamento previsto em ' + diasParaFechamento +
                        ' dias. Mantenha o ritmo de acompanhamento.',
                    acao: 'Revisar cronograma de atividades',
                    urgencia: 'media'
                });
            }
        }

        return sugestoes;
    },

    // -------------------------------------------------------
    // 3. PREVISÃO (SCORING E PROBABILIDADE)
    // -------------------------------------------------------
    calcularScoreNegociacao: function(cardId) {
        var card = data.cards.find(function(c) { return c.id === cardId; });
        if (!card) return null;

        var score = 50;
        var fatores = [];

        // Fator: Qualificação
        if (card.qualificacao) {
            var qualBonus = parseInt(card.qualificacao) * 4;
            score += qualBonus;
            fatores.push({
                fator: 'Qualificação (' + card.qualificacao + '/5)',
                impacto: '+' + qualBonus,
                positivo: true
            });
        } else {
            score -= 5;
            fatores.push({
                fator: 'Qualificação não definida',
                impacto: '-5',
                positivo: false
            });
        }

        // Fator: Tarefas concluídas
        if (card.tarefas && card.tarefas.length > 0) {
            var concluidas = card.tarefas.filter(function(t) {
                return t.situacao === 'Concluída';
            }).length;
            var taxaConclusao = concluidas / card.tarefas.length;
            var tarefaBonus = Math.round(taxaConclusao * 15);
            score += tarefaBonus;
            fatores.push({
                fator: 'Tarefas concluídas (' + Math.round(taxaConclusao * 100) + '%)',
                impacto: '+' + tarefaBonus,
                positivo: true
            });

            var atrasadas = card.tarefas.filter(function(t) {
                if (!t.prazo || t.situacao === 'Concluída') return false;
                return new Date(t.prazo) < new Date();
            }).length;
            if (atrasadas > 0) {
                var penalidade = atrasadas * 5;
                score -= penalidade;
                fatores.push({
                    fator: atrasadas + ' tarefa(s) atrasada(s)',
                    impacto: '-' + penalidade,
                    positivo: false
                });
            }
        }

        // Fator: Valor potencial preenchido
        var valorTotal = calculateCardTotal(card);
        if (valorTotal > 0) {
            score += 5;
            fatores.push({
                fator: 'Valor potencial definido (R$ ' + formatCurrency(valorTotal) + ')',
                impacto: '+5',
                positivo: true
            });
        }

        // Fator: Campos preenchidos
        var camposImportantes = [
            card.tema_id, card.cultura_id, card.ativo_id,
            card.projeto_id, card.regiao_id, card.contrato_id
        ];
        var camposPreenchidos = camposImportantes.filter(function(c) { return c; }).length;
        var camposBonus = Math.round((camposPreenchidos / camposImportantes.length) * 10);
        score += camposBonus;
        fatores.push({
            fator: 'Campos preenchidos (' + camposPreenchidos + '/' + camposImportantes.length + ')',
            impacto: '+' + camposBonus,
            positivo: true
        });

        // Fator: Histórico do cliente
        if (card.cliente_id) {
            var cliente = data.clientes.find(function(c) { return c.id === card.cliente_id; });
            if (cliente) {
                var negociacoesAnteriores = data.cards.filter(function(c) {
                    return c.cliente_id === cliente.id && c.id !== card.id;
                });
                var contratadas = negociacoesAnteriores.filter(function(c) {
                    return c.situacao === 'Contratada';
                }).length;
                var perdidas = negociacoesAnteriores.filter(function(c) {
                    return c.situacao === 'Perdida';
                }).length;

                if (contratadas > 0) {
                    var bonus = Math.min(contratadas * 5, 10);
                    score += bonus;
                    fatores.push({
                        fator: 'Cliente com ' + contratadas + ' contrato(s) anterior(es)',
                        impacto: '+' + bonus,
                        positivo: true
                    });
                }
                if (perdidas > contratadas) {
                    score -= 5;
                    fatores.push({
                        fator: 'Cliente com mais perdas que contratos',
                        impacto: '-5',
                        positivo: false
                    });
                }
            }
        }

        // Fator: Etapa avançada
        if (card.list_id) {
            var allLists = data.lists
                .filter(function(l) { return l.board_id === card.board_id; })
                .sort(function(a, b) { return a.ordem - b.ordem; });
            var listIndex = allLists.findIndex(function(l) { return l.id === card.list_id; });
            if (listIndex >= 0 && allLists.length > 0) {
                var progresso = (listIndex / (allLists.length - 1)) * 10;
                score += Math.round(progresso);
                fatores.push({
                    fator: 'Etapa ' + (listIndex + 1) + ' de ' + allLists.length,
                    impacto: '+' + Math.round(progresso),
                    positivo: true
                });
            }
        }

        // Fator: Tempo sem atualização
        if (card.data_contato) {
            var diasSemAtividade = Math.ceil(
                (new Date() - new Date(card.data_contato)) / (1000 * 60 * 60 * 24)
            );
            if (diasSemAtividade > 60) {
                score -= 15;
                fatores.push({
                    fator: 'Sem contato há ' + diasSemAtividade + ' dias',
                    impacto: '-15',
                    positivo: false
                });
            } else if (diasSemAtividade > 30) {
                score -= 8;
                fatores.push({
                    fator: 'Sem contato há ' + diasSemAtividade + ' dias',
                    impacto: '-8',
                    positivo: false
                });
            }
        }

        // Normalizar score entre 0 e 100
        score = Math.max(0, Math.min(100, score));

        var classificacao, corClassificacao;
        if (score >= 80) {
            classificacao = 'Muito Alta';
            corClassificacao = '#61BD4F';
        } else if (score >= 60) {
            classificacao = 'Alta';
            corClassificacao = '#8FCE79';
        } else if (score >= 40) {
            classificacao = 'Média';
            corClassificacao = '#FF9F1A';
        } else if (score >= 20) {
            classificacao = 'Baixa';
            corClassificacao = '#EB5A46';
        } else {
            classificacao = 'Muito Baixa';
            corClassificacao = '#C62828';
        }

        return {
            score: score,
            classificacao: classificacao,
            cor: corClassificacao,
            fatores: fatores,
            probabilidadeFechamento: Math.round(score * 0.85) + '%'
        };
    },

    // -------------------------------------------------------
    // 4. PREVISÃO DE RECEITA (PIPELINE)
    // -------------------------------------------------------
    preverReceitaPipeline: function() {
        var previsao = {
            totalPipeline: 0,
            totalPonderado: 0,
            porEtapa: [],
            porMes: []
        };

        var etapasMap = {};

        data.cards.forEach(function(card) {
            if (card.situacao === 'Perdida' || card.situacao === 'Contratada') return;

            var valorTotal = calculateCardTotal(card);
            var scoreInfo = AIAnalyzer.calcularScoreNegociacao(card.id);
            var probabilidade = scoreInfo ? scoreInfo.score / 100 : 0.5;
            var valorPonderado = valorTotal * probabilidade;

            previsao.totalPipeline += valorTotal;
            previsao.totalPonderado += valorPonderado;

            var list = data.lists.find(function(l) { return l.id === card.list_id; });
            var etapaNome = list ? list.nome : 'Sem Etapa';
            if (!etapasMap[etapaNome]) {
                etapasMap[etapaNome] = { valor: 0, ponderado: 0, count: 0 };
            }
            etapasMap[etapaNome].valor += valorTotal;
            etapasMap[etapaNome].ponderado += valorPonderado;
            etapasMap[etapaNome].count++;
        });

        Object.keys(etapasMap).forEach(function(etapa) {
            previsao.porEtapa.push({
                etapa: etapa,
                valor: etapasMap[etapa].valor,
                ponderado: etapasMap[etapa].ponderado,
                quantidade: etapasMap[etapa].count
            });
        });

        return previsao;
    },

    // -------------------------------------------------------
    // FUNÇÕES AUXILIARES DE ANÁLISE
    // -------------------------------------------------------

    _calcularConversaoPorEtapa: function() {
        var etapasCount = {};
        var totalCards = data.cards.length;
        var gargalo = null;

        data.cards.forEach(function(card) {
            var list = data.lists.find(function(l) { return l.id === card.list_id; });
            var nome = list ? list.nome : 'Sem Etapa';
            etapasCount[nome] = (etapasCount[nome] || 0) + 1;
        });

        var maxPercentual = 0;
        Object.keys(etapasCount).forEach(function(etapa) {
            var percentual = Math.round((etapasCount[etapa] / totalCards) * 100);
            if (percentual > maxPercentual && percentual > 40) {
                maxPercentual = percentual;
                gargalo = { nome: etapa, quantidade: etapasCount[etapa], percentual: percentual };
            }
        });

        return { etapas: etapasCount, gargalo: gargalo, total: totalCards };
    },

    _identificarNegociacoesParadas: function(diasLimite) {
        var hoje = new Date();
        var paradas = [];

        data.cards.forEach(function(card) {
            if (card.situacao === 'Contratada' || card.situacao === 'Perdida') return;

            var ultimaAtividade = card.data_contato ? new Date(card.data_contato) : null;

            if (card.tarefas && card.tarefas.length > 0) {
                card.tarefas.forEach(function(t) {
                    if (t.prazo) {
                        var dataTarefa = new Date(t.prazo);
                        if (!ultimaAtividade || dataTarefa > ultimaAtividade) {
                            ultimaAtividade = dataTarefa;
                        }
                    }
                });
            }

            if (ultimaAtividade) {
                var diasParada = Math.ceil((hoje - ultimaAtividade) / (1000 * 60 * 60 * 24));
                if (diasParada > diasLimite) {
                    var cliente = data.clientes.find(function(c) { return c.id === card.cliente_id; });
                    paradas.push({
                        cardId: card.id,
                        titulo: card.titulo,
                        cliente: cliente ? cliente.nome : '-',
                        diasParada: diasParada
                    });
                }
            }
        });

        return paradas.sort(function(a, b) { return b.diasParada - a.diasParada; });
    },

    _identificarClientesRecorrentes: function() {
        var clienteCount = {};

        data.cards.forEach(function(card) {
            if (!card.cliente_id) return;
            clienteCount[card.cliente_id] = (clienteCount[card.cliente_id] || 0) + 1;
        });

        var recorrentes = [];
        Object.keys(clienteCount).forEach(function(clienteId) {
            if (clienteCount[clienteId] >= 2) {
                var cliente = data.clientes.find(function(c) { return c.id === clienteId; });
                if (cliente) {
                    recorrentes.push({
                        clienteId: clienteId,
                        nome: cliente.nome,
                        quantidade: clienteCount[clienteId]
                    });
                }
            }
        });

        return recorrentes.sort(function(a, b) { return b.quantidade - a.quantidade; });
    },

    _analisarDistribuicaoQualificacao: function() {
        var qualCount = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, 'sem': 0 };
        var total = data.cards.length;

        data.cards.forEach(function(card) {
            if (card.qualificacao && qualCount[card.qualificacao] !== undefined) {
                qualCount[card.qualificacao]++;
            } else {
                qualCount['sem']++;
            }
        });

        var insight = null;
        var frias = qualCount['1'] + qualCount['2'];
        var quentes = qualCount['4'] + qualCount['5'];

        if (total > 0) {
            if (qualCount['sem'] > total * 0.3) {
                insight = Math.round((qualCount['sem'] / total) * 100) +
                    '% das negociações não têm qualificação definida. Isso dificulta a priorização.';
            } else if (frias > quentes * 2) {
                insight = 'A maioria das negociações está classificada como fria (' +
                    frias + '). Considere estratégias para aquecer o pipeline.';
            } else if (quentes > frias) {
                insight = 'Pipeline saudável! ' + quentes +
                    ' negociação(ões) quente(s) com potencial de fechamento próximo.';
            }
        }

        return { distribuicao: qualCount, insight: insight };
    },

    _analisarPerdasPorEtapa: function() {
        var perdas = data.cards.filter(function(c) { return c.situacao === 'Perdida'; });
        var perdasPorEtapa = {};
        var insight = null;

        perdas.forEach(function(card) {
            var list = data.lists.find(function(l) { return l.id === card.list_id; });
            var nome = list ? list.nome : 'Sem Etapa';
            perdasPorEtapa[nome] = (perdasPorEtapa[nome] || 0) + 1;
        });

        if (perdas.length > 0) {
            var maxPerdas = 0;
            var etapaCritica = '';
            Object.keys(perdasPorEtapa).forEach(function(etapa) {
                if (perdasPorEtapa[etapa] > maxPerdas) {
                    maxPerdas = perdasPorEtapa[etapa];
                    etapaCritica = etapa;
                }
            });

            var taxaPerda = Math.round((perdas.length / data.cards.length) * 100);
            insight = 'Taxa de perda geral: ' + taxaPerda + '%. ' +
                'A etapa "' + etapaCritica + '" concentra a maior quantidade de perdas (' +
                maxPerdas + '). Investigue os motivos.';
        }

        return { perdasPorEtapa: perdasPorEtapa, totalPerdas: perdas.length, insight: insight };
    },

    _analisarConcentracaoResponsaveis: function() {
        var responsavelCount = {};
        var insight = null;

        data.cards.forEach(function(card) {
            if (!card.responsavel_id) return;
            responsavelCount[card.responsavel_id] = (responsavelCount[card.responsavel_id] || 0) + 1;
        });

        var responsaveis = Object.keys(responsavelCount);
        if (responsaveis.length > 0) {
            var maxCount = 0;
            var responsavelMaisCarregado = '';
            var total = data.cards.length;

            responsaveis.forEach(function(rId) {
                if (responsavelCount[rId] > maxCount) {
                    maxCount = responsavelCount[rId];
                    responsavelMaisCarregado = rId;
                }
            });

            var usuario = data.users.find(function(u) {
                return u.id === responsavelMaisCarregado;
            });
            var percentual = Math.round((maxCount / total) * 100);

            if (percentual > 50 && responsaveis.length > 1) {
                insight = (usuario ? usuario.nome : 'Um responsável') +
                    ' concentra ' + percentual + '% das negociações (' + maxCount + '). ' +
                    'Considere redistribuir para evitar sobrecarga.';
            }
        }

        return { distribuicao: responsavelCount, insight: insight };
    },

    _analisarSazonalidade: function() {
        var mesesCount = {};
        var insight = null;

        data.cards.forEach(function(card) {
            if (!card.data_contato) return;
            var mes = card.data_contato.substring(0, 7);
            mesesCount[mes] = (mesesCount[mes] || 0) + 1;
        });

        var meses = Object.keys(mesesCount).sort();
        if (meses.length >= 3) {
            var ultimosMeses = meses.slice(-3);
            var valores = ultimosMeses.map(function(m) { return mesesCount[m]; });

            if (valores[2] > valores[1] && valores[1] > valores[0]) {
                insight = 'Tendência de crescimento nos últimos 3 meses! ' +
                    'De ' + valores[0] + ' para ' + valores[2] + ' novos contatos por mês.';
            } else if (valores[2] < valores[1] && valores[1] < valores[0]) {
                insight = 'Tendência de queda nos últimos 3 meses. ' +
                    'De ' + valores[0] + ' para ' + valores[2] + ' novos contatos por mês. Atenção!';
            }
        }

        return { porMes: mesesCount, insight: insight };
    },

    _identificarTarefasAtrasadas: function() {
        var hoje = new Date();
        var atrasadas = [];

        data.cards.forEach(function(card) {
            if (!card.tarefas) return;

            card.tarefas.forEach(function(tarefa) {
                if (tarefa.situacao === 'Concluída') return;
                if (!tarefa.prazo) return;

                var prazo = new Date(tarefa.prazo);
                if (prazo < hoje) {
                    var responsavel = data.users.find(function(u) {
                        return u.id === tarefa.responsavel_id;
                    });
                    atrasadas.push({
                        cardId: card.id,
                        cardTitulo: card.titulo,
                        tarefaTitulo: tarefa.titulo,
                        responsavel: responsavel ? responsavel.nome : '-',
                        diasAtraso: Math.ceil((hoje - prazo) / (1000 * 60 * 60 * 24))
                    });
                }
            });
        });

        return atrasadas.sort(function(a, b) { return b.diasAtraso - a.diasAtraso; });
    }
};


// ==================== INTEGRAÇÃO COM IA GENERATIVA (OPCIONAL) ====================

var AIGenerative = {

    gerarAnaliseAvancada: async function(contexto) {
        if (AI_CONFIG.apiProvider === 'local' || !AI_CONFIG.apiKey) {
            return null;
        }

        var prompt = this._construirPrompt(contexto);

        try {
            if (AI_CONFIG.apiProvider === 'openai') {
                return await this._chamarOpenAI(prompt);
            } else if (AI_CONFIG.apiProvider === 'claude') {
                return await this._chamarClaude(prompt);
            }
        } catch (error) {
            console.error('Erro na IA Generativa:', error);
            return null;
        }
    },

    _construirPrompt: function(contexto) {
        return 'Você é um analista de CRM especializado em agronegócio (Embrapa). ' +
            'Analise os seguintes dados e forneça insights acionáveis em português brasileiro.\n\n' +
            'DADOS DO PIPELINE:\n' +
            '- Total de negociações: ' + contexto.totalCards + '\n' +
            '- Situação: Novas=' + contexto.novas + ', Em Andamento=' + contexto.andamento +
            ', Contratadas=' + contexto.contratadas + ', Perdidas=' + contexto.perdidas + '\n' +
            '- Valor total do pipeline: R$ ' + contexto.valorTotal + '\n' +
            '- Taxa de conversão: ' + contexto.taxaConversao + '%\n' +
            '- Tarefas atrasadas: ' + contexto.tarefasAtrasadas + '\n' +
            '- Negociações paradas (>30 dias): ' + contexto.negociacoesParadas + '\n\n' +
            'Forneça:\n' +
            '1. Três insights principais sobre o pipeline\n' +
            '2. Três ações recomendadas prioritárias\n' +
            '3. Uma previsão de fechamento para o próximo mês\n\n' +
            'Responda em formato JSON com as chaves: insights (array), acoes (array), previsao (string).';
    },

    _chamarOpenAI: async function(prompt) {
        var response = await fetch(AI_CONFIG.openaiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + AI_CONFIG.apiKey
            },
            body: JSON.stringify({
                model: AI_CONFIG.model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: AI_CONFIG.maxTokens,
                temperature: 0.7
            })
        });

        var data = await response.json();
        if (data.choices && data.choices[0]) {
            try {
                return JSON.parse(data.choices[0].message.content);
            } catch (e) {
                return { texto: data.choices[0].message.content };
            }
        }
        return null;
    },

    _chamarClaude: async function(prompt) {
        var response = await fetch(AI_CONFIG.claudeEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': AI_CONFIG.apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: AI_CONFIG.model,
                max_tokens: AI_CONFIG.maxTokens,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        var data = await response.json();
        if (data.content && data.content[0]) {
            try {
                return JSON.parse(data.content[0].text);
            } catch (e) {
                return { texto: data.content[0].text };
            }
        }
        return null;
    }
};


// ==================== INTERFACE DO MÓDULO DE IA ====================

var AIInterface = {

    // Renderiza o painel completo de IA no Dashboard
    renderPainelIA: function() {
        var container = document.getElementById('aiInsightsContainer');
        if (!container) return;

        if (data.cards.length === 0) {
            container.innerHTML = '<p class="empty-message" style="padding:30px; text-align:center;">' +
                '<i class="fas fa-robot" style="font-size:40px; color:var(--gray); display:block; margin-bottom:10px;"></i>' +
                'Cadastre negociações para ativar a análise inteligente.' +
                '</p>';
            return;
        }

        var insights = AIAnalyzer.analisarPadroes();
        var previsaoReceita = AIAnalyzer.preverReceitaPipeline();

        var html = '';

        // --- Cabeçalho da análise ---
        html += '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">' +
            '<div>' +
                '<h3 style="margin:0; color:var(--dark-blue); font-size:16px;"><i class="fas fa-robot"></i> Análise Inteligente do Pipeline</h3>' +
                '<small style="color:var(--gray);">Atualizado em: ' + new Date().toLocaleString('pt-BR') + '</small>' +
            '</div>' +
            '<button onclick="AIInterface.renderPainelIA()" class="btn-submit" style="padding:8px 15px; font-size:12px;">' +
                '<i class="fas fa-sync-alt"></i> Atualizar' +
            '</button>' +
        '</div>';

        // --- Cards de KPIs Preditivos (RESPONSIVO) ---
        html += '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap:10px; margin-bottom:25px;">';

        // KPI 1: Pipeline total
        html += this._renderKpiCard(
            'Pipeline Total',
            'R$ ' + formatCurrency(previsaoReceita.totalPipeline),
            'fas fa-chart-line',
            '#0079BF'
        );

        // KPI 2: Pipeline ponderado
        html += this._renderKpiCard(
            'Previsão Ponderada',
            'R$ ' + formatCurrency(previsaoReceita.totalPonderado),
            'fas fa-balance-scale',
            '#61BD4F'
        );

        // KPI 3: Taxa de conversão
        var contratadas = data.cards.filter(function(c) {
            return c.situacao === 'Contratada';
        }).length;
        var taxaConversao = data.cards.length > 0 ?
            Math.round((contratadas / data.cards.length) * 100) : 0;
        html += this._renderKpiCard(
            'Taxa de Conversão',
            taxaConversao + '%',
            'fas fa-percentage',
            taxaConversao >= 30 ? '#61BD4F' : (taxaConversao >= 15 ? '#FF9F1A' : '#EB5A46')
        );

        // KPI 4: Saúde do pipeline
        var saude = this._calcularSaudePipeline();
        html += this._renderKpiCard(
            'Saúde do Pipeline',
            saude.texto,
            saude.icone,
            saude.cor
        );

        html += '</div>';

        // --- Insights de Padrões ---
        if (insights.length > 0) {
            html += '<div style="margin-bottom:25px;">';
            html += '<h4 style="color:var(--dark-blue); margin-bottom:15px; font-size:14px;">' +
                '<i class="fas fa-lightbulb" style="color:#FF9F1A;"></i> Insights e Alertas (' +
                insights.length + ')</h4>';

            insights.forEach(function(insight) {
                html += '<div style="background:#fff; border-left:4px solid ' + insight.cor +
                    '; border-radius:6px; padding:12px; margin-bottom:10px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">' +
                    '<div style="display:flex; align-items:flex-start; gap:10px;">' +
                        '<i class="' + insight.icone + '" style="color:' + insight.cor +
                        '; font-size:18px; margin-top:2px; flex-shrink:0;"></i>' +
                        '<div style="flex:1; min-width:0;">' +
                            '<strong style="color:var(--dark-blue); font-size:13px;">' + insight.titulo + '</strong>' +
                            '<span style="display:inline-block; padding:2px 8px; border-radius:10px; font-size:10px; ' +
                            'margin-left:8px; background:' +
                            (insight.prioridade === 'alta' ? '#FFEBEE; color:#C62828' :
                                insight.prioridade === 'media' ? '#FFF3E0; color:#E65100' :
                                '#E8F5E9; color:#2E7D32') + ';">' +
                            insight.prioridade.toUpperCase() + '</span>' +
                            '<p style="margin:5px 0 0; color:var(--gray); font-size:12px; word-wrap:break-word;">' +
                            insight.descricao + '</p>';

                // Exibir itens detalhados se existirem
                if (insight.itens && insight.itens.length > 0) {
                    html += '<div style="margin-top:10px; max-height:150px; overflow-y:auto; overflow-x:auto; -webkit-overflow-scrolling:touch;">';
                    html += '<table style="width:100%; font-size:11px; border-collapse:collapse; min-width:300px;">';

                    if (insight.titulo === 'Negociações Paradas') {
                        html += '<tr style="background:#f5f5f5;"><th style="padding:4px 8px; text-align:left;">Título</th>' +
                            '<th style="padding:4px 8px;">Cliente</th>' +
                            '<th style="padding:4px 8px;">Dias Parada</th></tr>';
                        insight.itens.slice(0, 5).forEach(function(item) {
                            html += '<tr><td style="padding:4px 8px;">' + item.titulo + '</td>' +
                                '<td style="padding:4px 8px;">' + item.cliente + '</td>' +
                                '<td style="padding:4px 8px; text-align:center; color:#EB5A46; font-weight:bold;">' +
                                item.diasParada + ' dias</td></tr>';
                        });
                    } else if (insight.titulo === 'Clientes Recorrentes') {
                        html += '<tr style="background:#f5f5f5;"><th style="padding:4px 8px; text-align:left;">Cliente</th>' +
                            '<th style="padding:4px 8px;">Negociações</th></tr>';
                        insight.itens.forEach(function(item) {
                            html += '<tr><td style="padding:4px 8px;">' + item.nome + '</td>' +
                                '<td style="padding:4px 8px; text-align:center; font-weight:bold;">' +
                                item.quantidade + '</td></tr>';
                        });
                    } else if (insight.titulo === 'Tarefas Atrasadas') {
                        html += '<tr style="background:#f5f5f5;"><th style="padding:4px 8px; text-align:left;">Tarefa</th>' +
                            '<th style="padding:4px 8px;">Cartão</th>' +
                            '<th style="padding:4px 8px;">Responsável</th>' +
                            '<th style="padding:4px 8px;">Atraso</th></tr>';
                        insight.itens.slice(0, 5).forEach(function(item) {
                            html += '<tr><td style="padding:4px 8px;">' + item.tarefaTitulo + '</td>' +
                                '<td style="padding:4px 8px;">' + item.cardTitulo + '</td>' +
                                '<td style="padding:4px 8px;">' + item.responsavel + '</td>' +
                                '<td style="padding:4px 8px; text-align:center; color:#EB5A46; font-weight:bold;">' +
                                item.diasAtraso + ' dias</td></tr>';
                        });
                    }

                    html += '</table></div>';
                }

                html += '</div></div></div>';
            });

            html += '</div>';
        }

        // --- Previsão de Receita por Etapa (COM SCROLL MOBILE) ---
        if (previsaoReceita.porEtapa.length > 0) {
            html += '<div style="margin-bottom:25px;">';
            html += '<h4 style="color:var(--dark-blue); margin-bottom:15px; font-size:14px;">' +
                '<i class="fas fa-chart-bar" style="color:#61BD4F;"></i> Previsão de Receita por Etapa</h4>';

            html += '<div style="overflow-x:auto; -webkit-overflow-scrolling:touch;">';
            html += '<table style="width:100%; border-collapse:collapse; font-size:12px; background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1); min-width:600px;">';
            html += '<thead><tr style="background:linear-gradient(135deg, var(--dark-blue), var(--primary-blue));">' +
                '<th style="padding:10px; color:#fff; text-align:left;">Etapa</th>' +
                '<th style="padding:10px; color:#fff; text-align:center;">Qtd</th>' +
                '<th style="padding:10px; color:#fff; text-align:right;">Valor Pipeline</th>' +
                '<th style="padding:10px; color:#fff; text-align:right;">Valor Ponderado</th>' +
                '<th style="padding:10px; color:#fff; text-align:center;">Prob. Média</th>' +
                '</tr></thead><tbody>';

            previsaoReceita.porEtapa.forEach(function(item) {
                var probMedia = item.valor > 0 ? Math.round((item.ponderado / item.valor) * 100) : 0;
                html += '<tr style="border-bottom:1px solid #eee;">' +
                    '<td style="padding:8px; font-weight:600; font-size:11px;">' + item.etapa + '</td>' +
                    '<td style="padding:8px; text-align:center;">' + item.quantidade + '</td>' +
                    '<td style="padding:8px; text-align:right; font-size:11px;">R$ ' + formatCurrency(item.valor) + '</td>' +
                    '<td style="padding:8px; text-align:right; color:#61BD4F; font-weight:600; font-size:11px;">R$ ' +
                    formatCurrency(item.ponderado) + '</td>' +
                    '<td style="padding:8px; text-align:center;">' +
                        '<div style="background:#eee; border-radius:10px; height:20px; position:relative; overflow:hidden; min-width:60px;">' +
                            '<div style="background:' + (probMedia >= 60 ? '#61BD4F' : probMedia >= 30 ? '#FF9F1A' : '#EB5A46') +
                            '; height:100%; width:' + probMedia + '%; border-radius:10px;"></div>' +
                            '<span style="position:absolute; top:2px; left:50%; transform:translateX(-50%); font-size:10px; font-weight:bold;">' +
                            probMedia + '%</span>' +
                        '</div>' +
                    '</td>' +
                '</tr>';
            });

            html += '<tr style="background:#f5f7fa; font-weight:bold;">' +
                '<td style="padding:10px;">TOTAL</td>' +
                '<td style="padding:10px; text-align:center;">' +
                previsaoReceita.porEtapa.reduce(function(s, e) { return s + e.quantidade; }, 0) + '</td>' +
                '<td style="padding:10px; text-align:right;">R$ ' + formatCurrency(previsaoReceita.totalPipeline) + '</td>' +
                '<td style="padding:10px; text-align:right; color:#61BD4F;">R$ ' +
                formatCurrency(previsaoReceita.totalPonderado) + '</td>' +
                '<td style="padding:10px;"></td></tr>';

            html += '</tbody></table></div></div>';
        }

        // --- Top 5 negociações por score ---
        html += this._renderTopNegociacoesPorScore();

        container.innerHTML = html;
    },

    // Renderiza sugestões dentro do modal de visualização do cartão
    renderSugestoesCartao: function(cardId) {
        var sugestoes = AIAnalyzer.sugerirProximasAcoes(cardId);
        var scoreInfo = AIAnalyzer.calcularScoreNegociacao(cardId);

        if (sugestoes.length === 0 && !scoreInfo) return '';

        var html = '<div class="full-width" style="margin-top:20px; border-top:2px solid #E4F0F6; padding-top:20px;">';

        // --- Score da negociação ---
        if (scoreInfo) {
            html += '<div style="background:linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius:8px; padding:15px; margin-bottom:15px;">';
            html += '<div style="display:flex; align-items:center; gap:15px; flex-wrap:wrap;">';
            html += '<div style="width:80px; height:80px; border-radius:50%; background:conic-gradient(' +
                scoreInfo.cor + ' ' + (scoreInfo.score * 3.6) + 'deg, #eee 0deg); display:flex; align-items:center; justify-content:center; flex-shrink:0;">' +
                '<div style="width:60px; height:60px; border-radius:50%; background:#fff; display:flex; align-items:center; justify-content:center; flex-direction:column;">' +
                    '<span style="font-size:20px; font-weight:bold; color:' + scoreInfo.cor + ';">' + scoreInfo.score + '</span>' +
                    '<span style="font-size:8px; color:var(--gray);">de 100</span>' +
                '</div></div>';

            html += '<div style="flex:1; min-width:0;">' +
                '<div style="font-weight:bold; font-size:14px; color:var(--dark-blue);">' +
                    '<i class="fas fa-brain" style="color:' + scoreInfo.cor + ';"></i> Score da Negociação</div>' +
                '<div style="font-size:13px; color:' + scoreInfo.cor + '; font-weight:600; margin-top:3px; word-wrap:break-word;">' +
                    scoreInfo.classificacao + ' - Prob. fechamento: ' + scoreInfo.probabilidadeFechamento +
                '</div>' +
            '</div></div>';

            // Fatores do score
            html += '<div style="margin-top:12px; display:flex; flex-wrap:wrap; gap:6px;">';
            scoreInfo.fatores.forEach(function(f) {
                html += '<span style="display:inline-flex; align-items:center; gap:4px; padding:3px 8px; ' +
                    'border-radius:12px; font-size:10px; background:' +
                    (f.positivo ? '#E8F5E9; color:#2E7D32' : '#FFEBEE; color:#C62828') + ';">' +
                    '<i class="fas fa-' + (f.positivo ? 'arrow-up' : 'arrow-down') + '" style="font-size:8px;"></i> ' +
                    f.fator + ' (' + f.impacto + ')' +
                '</span>';
            });
            html += '</div></div>';
        }

        // --- Sugestões de ações ---
        if (sugestoes.length > 0) {
            html += '<h4 style="color:var(--dark-blue); margin:15px 0 10px; font-size:14px;"><i class="fas fa-lightbulb" style="color:#FF9F1A;"></i> Sugestões de Próximas Ações</h4>';

            sugestoes.forEach(function(s) {
                var urgenciaCor = s.urgencia === 'alta' ? '#EB5A46' :
                    s.urgencia === 'media' ? '#FF9F1A' : '#61BD4F';

                html += '<div style="display:flex; align-items:flex-start; gap:10px; padding:10px; margin-bottom:8px; ' +
                    'background:#fff; border-radius:6px; border-left:3px solid ' + urgenciaCor + ';">' +
                    '<i class="' + s.icone + '" style="color:' + urgenciaCor + '; font-size:14px; margin-top:2px; flex-shrink:0;"></i>' +
                    '<div style="flex:1; min-width:0;">' +
                        '<div style="font-size:12px; color:var(--dark-blue); word-wrap:break-word;">' + s.texto + '</div>' +
                        '<div style="font-size:11px; color:var(--gray); margin-top:3px;">' +
                            '<i class="fas fa-arrow-right" style="font-size:9px;"></i> ' + s.acao +
                        '</div>' +
                    '</div>' +
                '</div>';
            });
        }

        html += '</div>';
        return html;
    },

    // --- Helpers de interface ---

    _renderKpiCard: function(titulo, valor, icone, cor) {
        return '<div style="background:#fff; border-radius:8px; padding:15px; box-shadow:0 2px 8px rgba(0,0,0,0.08); ' +
            'border-top:3px solid ' + cor + ';">' +
            '<div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">' +
                '<i class="' + icone + '" style="color:' + cor + '; font-size:16px;"></i>' +
                '<span style="font-size:10px; color:var(--gray); text-transform:uppercase; line-height:1.2;">' + titulo + '</span>' +
            '</div>' +
            '<div style="font-size:18px; font-weight:bold; color:var(--dark-blue); word-wrap:break-word;">' + valor + '</div>' +
        '</div>';
    },

    _calcularSaudePipeline: function() {
        var total = data.cards.length;
        if (total === 0) return { texto: 'Sem dados', icone: 'fas fa-question-circle', cor: '#6B778C' };

        var perdidas = data.cards.filter(function(c) { return c.situacao === 'Perdida'; }).length;
        var contratadas = data.cards.filter(function(c) { return c.situacao === 'Contratada'; }).length;
        var paradas = AIAnalyzer._identificarNegociacoesParadas(30).length;
        var atrasadas = AIAnalyzer._identificarTarefasAtrasadas().length;

        var pontuacao = 100;
        pontuacao -= (perdidas / total) * 30;
        pontuacao -= (paradas / total) * 25;
        pontuacao -= Math.min(atrasadas * 3, 20);
        pontuacao += (contratadas / total) * 25;

        pontuacao = Math.max(0, Math.min(100, Math.round(pontuacao)));

        if (pontuacao >= 70) return { texto: 'Saudável', icone: 'fas fa-heartbeat', cor: '#61BD4F' };
        if (pontuacao >= 40) return { texto: 'Atenção', icone: 'fas fa-exclamation-circle', cor: '#FF9F1A' };
        return { texto: 'Crítico', icone: 'fas fa-heart-broken', cor: '#EB5A46' };
    },

    _renderTopNegociacoesPorScore: function() {
        var scores = [];

        data.cards.forEach(function(card) {
            if (card.situacao === 'Contratada' || card.situacao === 'Perdida') return;
            var scoreInfo = AIAnalyzer.calcularScoreNegociacao(card.id);
            if (scoreInfo) {
                var cliente = data.clientes.find(function(c) { return c.id === card.cliente_id; });
                scores.push({
                    card: card,
                    score: scoreInfo.score,
                    classificacao: scoreInfo.classificacao,
                    cor: scoreInfo.cor,
                    probabilidade: scoreInfo.probabilidadeFechamento,
                    valor: calculateCardTotal(card),
                    cliente: cliente ? cliente.nome : '-'
                });
            }
        });

        scores.sort(function(a, b) { return b.score - a.score; });
        var top5 = scores.slice(0, 5);

        if (top5.length === 0) return '';

        var html = '<div>';
        html += '<h4 style="color:var(--dark-blue); margin-bottom:15px; font-size:14px;">' +
            '<i class="fas fa-trophy" style="color:#FF9F1A;"></i> Top 5 - Maior Probabilidade de Fechamento</h4>';

        html += '<div style="overflow-x:auto; -webkit-overflow-scrolling:touch;">';
        html += '<table style="width:100%; border-collapse:collapse; font-size:12px; background:#fff; border-radius:6px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.1); min-width:700px;">';
        html += '<thead><tr style="background:linear-gradient(135deg, #FF9F1A, #FFAB4A);">' +
            '<th style="padding:10px; color:#fff; text-align:center; width:40px;">#</th>' +
            '<th style="padding:10px; color:#fff; text-align:left;">Negociação</th>' +
            '<th style="padding:10px; color:#fff; text-align:left;">Cliente</th>' +
            '<th style="padding:10px; color:#fff; text-align:center;">Score</th>' +
            '<th style="padding:10px; color:#fff; text-align:center;">Probabilidade</th>' +
            '<th style="padding:10px; color:#fff; text-align:right;">Valor</th>' +
            '</tr></thead><tbody>';

        top5.forEach(function(item, idx) {
            html += '<tr style="border-bottom:1px solid #eee;">' +
                '<td style="padding:8px; text-align:center; font-weight:bold; color:' +
                    (idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : 'var(--gray)') + ';">' +
                    (idx + 1) + '</td>' +
                '<td style="padding:8px; font-weight:600; font-size:11px;">' +
                    '<a href="javascript:void(0)" onclick="viewCard(\'' + item.card.id + '\')" style="color:var(--primary-blue); text-decoration:none;">' +
                    (item.card.titulo || 'Sem título') + '</a></td>' +
                '<td style="padding:8px; font-size:11px;">' + item.cliente + '</td>' +
                '<td style="padding:8px; text-align:center;">' +
                    '<span style="display:inline-block; padding:3px 10px; border-radius:15px; font-weight:bold; font-size:11px; ' +
                    'background:' + item.cor + '22; color:' + item.cor + ';">' + item.score + '</span></td>' +
                '<td style="padding:8px; text-align:center; font-weight:600; color:' + item.cor + '; font-size:11px;">' +
                    item.probabilidade + '</td>' +
                '<td style="padding:8px; text-align:right; font-size:11px;">R$ ' + formatCurrency(item.valor) + '</td>' +
            '</tr>';
        });

        html += '</tbody></table></div></div>';
        return html;
    }
};

// ==================== EXPORTAR PARA USO GLOBAL ====================
window.AIAnalyzer = AIAnalyzer;
window.AIGenerative = AIGenerative;
window.AIInterface = AIInterface;
window.AI_CONFIG = AI_CONFIG;
