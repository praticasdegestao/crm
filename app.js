// app.js - Versão Supabase

// app.js - Versão Supabase

// ==================== CONFIGURAÇÃO SUPABASE (GLOBAL) ====================
window.SUPABASE_URL = 'https://vbntaflijkqskxdhmhce.supabase.co';
window.SUPABASE_KEY = 'sb_publishable_Ih1Ow4iYklv67drFF-8VPg_CBhz_zXH';
window.supabaseClient = null;

// ==================== DATA STORAGE ====================
var data = {
    users: [],
    funnels: [],
    boards: [],
    lists: [],
    cards: [],
    clientes: [],
    regioes: [],
    ativos: [],
    culturas: [],
    temas: [],
    projetos: [],
    contratos: []
};

var currentUser = null;
var currentFunnel = null;
var currentBoard = null;
var editingId = null;
var deleteCallback = null;
var cardFiles = [];
var valorPotencialItems = [];
var cardTarefas = [];
var clienteAtivos = [];
var culturaEspecialistas = [];
var temaEspecialistas = [];
var ativoRiscos = [];
var ativoPaeein = [];
var ativoArquivos = [];

var cardEquipe = [];  // ADICIONAR ESTA LINHA
var clienteContatos = [];  // ADICIONAR ESTA LINHA

// Chart instances
var chartInstances = {};

// Mapa do Brasil
var mapaBrasil = null;
var markersLayer = null;

// Coordenadas aproximadas das capitais dos estados brasileiros
var coordenadasEstados = {
    'AC': { lat: -9.97499, lng: -67.8243 },
    'AL': { lat: -9.66599, lng: -35.735 },
    'AP': { lat: 0.034934, lng: -51.0694 },
    'AM': { lat: -3.11903, lng: -60.0217 },
    'BA': { lat: -12.9714, lng: -38.5014 },
    'CE': { lat: -3.71722, lng: -38.5433 },
    'DF': { lat: -15.7942, lng: -47.8822 },
    'ES': { lat: -20.3155, lng: -40.3128 },
    'GO': { lat: -16.6869, lng: -49.2648 },
    'MA': { lat: -2.52972, lng: -44.3028 },
    'MT': { lat: -15.601, lng: -56.0974 },
    'MS': { lat: -20.4697, lng: -54.6201 },
    'MG': { lat: -19.9167, lng: -43.9345 },
    'PA': { lat: -1.45583, lng: -48.5044 },
    'PB': { lat: -7.11532, lng: -34.861 },
    'PR': { lat: -25.4284, lng: -49.2733 },
    'PE': { lat: -8.04756, lng: -34.877 },
    'PI': { lat: -5.08921, lng: -42.8016 },
    'RJ': { lat: -22.9068, lng: -43.1729 },
    'RN': { lat: -5.79448, lng: -35.211 },
    'RS': { lat: -30.0346, lng: -51.2177 },
    'RO': { lat: -8.76077, lng: -63.8999 },
    'RR': { lat: 2.81954, lng: -60.6714 },
    'SC': { lat: -27.5954, lng: -48.548 },
    'SP': { lat: -23.5505, lng: -46.6333 },
    'SE': { lat: -10.9472, lng: -37.0731 },
    'TO': { lat: -10.1689, lng: -48.3317 }
};

// ==================== SUPABASE DATA FUNCTIONS ====================

async function loadTableData(tableName) {
    try {
        var response = await window.supabaseClient
            .from(tableName)
            .select('*');
        
        if (response.error) {
            console.error('Erro ao carregar ' + tableName + ':', response.error);
            return [];
        }
        return response.data || [];
    } catch (err) {
        console.error('Erro ao carregar ' + tableName + ':', err);
        return [];
    }
}

async function insertData(tableName, record) {
    try {
        var response = await window.supabaseClient
            .from(tableName)
            .insert([record])
            .select();
        
        if (response.error) {
            console.error('Erro ao inserir em ' + tableName + ':', response.error);
            throw response.error;
        }
        return response.data[0];
    } catch (err) {
        console.error('Erro ao inserir em ' + tableName + ':', err);
        throw err;
    }
}

async function updateData(tableName, id, record) {
    try {
        var response = await window.supabaseClient
            .from(tableName)
            .update(record)
            .eq('id', id)
            .select();
        
        if (response.error) {
            console.error('Erro ao atualizar ' + tableName + ':', response.error);
            throw response.error;
        }
        return response.data[0];
    } catch (err) {
        console.error('Erro ao atualizar ' + tableName + ':', err);
        throw err;
    }
}

async function deleteData(tableName, id) {
    try {
        var response = await window.supabaseClient
            .from(tableName)
            .delete()
            .eq('id', id);
        
        if (response.error) {
            console.error('Erro ao deletar de ' + tableName + ':', response.error);
            throw response.error;
        }
        return true;
    } catch (err) {
        console.error('Erro ao deletar de ' + tableName + ':', err);
        throw err;
    }
}

async function loadAllData() {
    try {
        showLoadingIndicator('Carregando dados...');
        
        var results = await Promise.all([
            loadTableData('users'),
            loadTableData('funnels'),
            loadTableData('boards'),
            loadTableData('lists'),
            loadTableData('cards'),
            loadTableData('clientes'),
            loadTableData('regioes'),
            loadTableData('ativos'),
            loadTableData('culturas'),
            loadTableData('temas'),
            loadTableData('projetos'),
            loadTableData('contratos')
        ]);
        
        data.users = results[0];
        data.funnels = results[1];
        data.boards = results[2];
        data.lists = results[3];
        data.cards = results[4];
        data.clientes = results[5];
        data.regioes = results[6];
        data.ativos = results[7];
        data.culturas = results[8];
        data.temas = results[9];
        data.projetos = results[10];
        data.contratos = results[11];
        
        hideLoadingIndicator();
        return true;
    } catch (err) {
        console.error('Erro ao carregar dados:', err);
        hideLoadingIndicator();
        return false;
    }
}

function showLoadingIndicator(message) {
    var existing = document.getElementById('loadingIndicator');
    if (existing) existing.remove();
    
    var loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingIndicator';
    loadingDiv.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 9999;';
    loadingDiv.innerHTML = '<div style="background: white; padding: 30px; border-radius: 8px; text-align: center;">' +
        '<i class="fas fa-spinner fa-spin" style="font-size: 32px; color: #0079BF;"></i>' +
        '<p style="margin-top: 15px; color: #172B4D;">' + message + '</p></div>';
    document.body.appendChild(loadingDiv);
}

function hideLoadingIndicator() {
    var loadingDiv = document.getElementById('loadingIndicator');
    if (loadingDiv) loadingDiv.remove();
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async function() {
    // Inicializar cliente Supabase
    if (window.supabase) {
        window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
        console.log('Supabase inicializado com sucesso');
    } else {
        console.error('SDK do Supabase não carregado!');
        alert('Erro: SDK do Supabase não foi carregado. Verifique sua conexão com a internet.');
        return;
    }
    
    await loadAllData();
    await initializeDefaultUser();
    setupEventListeners();
});

function generateId() {
    // Gera um UUID v4 válido
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0;
        var v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function initializeDefaultUser() {
    var existingUser = data.users.find(function(u) { return u.login === 'gilmar'; });
    if (!existingUser) {
        try {
            var defaultUser = {
                id: generateId(),
                nome: 'Gilmar Souza Santos',
                login: 'gilmar',
                senha: 'gilmar',
                cargo: 'Pesquisador',
                perfil: 'Administrador',
                telefone: '',
                email: ''
            };
            await insertData('users', defaultUser);
            data.users.push(defaultUser);
        } catch (err) {
            console.error('Erro ao criar usuário padrão:', err);
        }
    }
}


// ==================== TELA MINHAS NEGOCIAÇÕES E TAREFAS ====================

function renderMinhasNegociacoesView() {
    // Atualiza o nome do usuário no cabeçalho de boas-vindas
    var welcomeUserName = document.getElementById('welcomeUserName');
    if (welcomeUserName) {
        welcomeUserName.textContent = currentUser.nome;
    }
    
    renderMeusCartoesGrid();
    renderMinhasTarefasGridInicial();
    renderMinhasAtividadesGridInicial();  // ADICIONAR ESTA LINHA
}

function renderMeusCartoesGrid() {
    var container = document.getElementById('meusCartoesGrid');
    var countEl = document.getElementById('countMeusCartoes');
    
    if (!container) return;
    
    // Filtrar cartões onde o usuário é responsável
    var meusCartoes = data.cards.filter(function(card) {
        return card.responsavel_id === currentUser.id;
    });
    
    // Atualiza contador
    if (countEl) {
        countEl.textContent = meusCartoes.length;
    }
    
    if (meusCartoes.length === 0) {
        container.innerHTML = '<p class="empty-message" style="padding: 30px; text-align: center;">' +
            '<i class="fas fa-inbox" style="font-size: 40px; color: var(--gray); display: block; margin-bottom: 10px;"></i>' +
            'Você não possui cartões de negociação sob sua responsabilidade.' +
        '</p>';
        return;
    }
    
    var rowsHTML = '';
    meusCartoes.forEach(function(card) {
        var list = data.lists.find(function(l) { return l.id === card.list_id; });
        var board = data.boards.find(function(b) { return b.id === card.board_id; });
        var funnel = board ? data.funnels.find(function(f) { return f.id === board.funnel_id; }) : null;
        var cliente = data.clientes.find(function(c) { return c.id === card.cliente_id; });
        
        // Formatar data do contato
        var dataContatoFormatada = '-';
        if (card.data_contato) {
            var partes = card.data_contato.split('-');
            if (partes.length === 3) {
                dataContatoFormatada = partes[2] + '/' + partes[1] + '/' + partes[0];
            }
        }
        
        // Classe do status
        var statusClass = '';
        var statusText = card.situacao || '-';
        if (card.situacao === 'Nova') statusClass = 'nova';
        else if (card.situacao === 'Em Andamento') statusClass = 'andamento';
        else if (card.situacao === 'Contratada') statusClass = 'contratada';
        else if (card.situacao === 'Perdida') statusClass = 'perdida';
        
        rowsHTML += '<tr>' +
            '<td>' +
                '<div class="info-funil-quadro">' +
                    '<span class="funil-nome">' + (funnel ? funnel.nome : '-') + '</span>' +
                    ' <i class="fas fa-angle-right" style="color: #ccc; font-size: 10px;"></i> ' +
                    '<span class="quadro-nome">' + (board ? board.nome : '-') + '</span>' +
                '</div>' +
            '</td>' +
            '<td><span class="cartao-titulo">' + (card.titulo || 'Sem título') + '</span></td>' +
            '<td>' + (cliente ? cliente.nome : '-') + '</td>' +
            '<td>' + dataContatoFormatada + '</td>' +
            '<td>' + getQualificacaoStars(card.qualificacao) + '</td>' +
            '<td><span class="status-badge-mini ' + statusClass + '">' + statusText + '</span></td>' +
            '<td>' +
                '<button type="button" class="btn-edit-cartao" onclick="editarCartaoMinhasNegociacoes(\'' + card.id + '\')" title="Editar Cartão">' +
                    '<i class="fas fa-edit"></i> Editar' +
                '</button>' +
            '</td>' +
        '</tr>';
    });
    
    container.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Funil / Quadro</th>' +
                '<th>Título do Cartão</th>' +
                '<th>Cliente/Parceiro</th>' +
                '<th>Data Contato</th>' +
                '<th>Qualificação</th>' +
                '<th>Situação</th>' +
                '<th>Ações</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}

function renderMinhasTarefasGridInicial() {
    var container = document.getElementById('minhasTarefasGrid');
    var countEl = document.getElementById('countMinhasTarefas');
    
    if (!container) return;
    
    // Coletar todas as tarefas onde o usuário é responsável
    var minhasTarefas = [];
    
    data.cards.forEach(function(card) {
        if (!card.tarefas || !Array.isArray(card.tarefas)) return;
        
        card.tarefas.forEach(function(tarefa, tarefaIndex) {
            if (tarefa.responsavel_id === currentUser.id) {
                var cliente = data.clientes.find(function(c) { return c.id === card.cliente_id; });
                var board = data.boards.find(function(b) { return b.id === card.board_id; });
                var funnel = board ? data.funnels.find(function(f) { return f.id === board.funnel_id; }) : null;
                
                // Formatar prazo
                var prazoFormatado = '-';
                if (tarefa.prazo) {
                    var partes = tarefa.prazo.split('-');
                    if (partes.length === 3) {
                        prazoFormatado = partes[2] + '/' + partes[1] + '/' + partes[0];
                    }
                }
                
                minhasTarefas.push({
                    tarefa: tarefa,
                    card: card,
                    cliente: cliente,
                    board: board,
                    funnel: funnel,
                    prazoFormatado: prazoFormatado
                });
            }
        });
    });
    
    // Atualiza contador
    if (countEl) {
        countEl.textContent = minhasTarefas.length;
    }
    
    if (minhasTarefas.length === 0) {
        container.innerHTML = '<p class="empty-message" style="padding: 30px; text-align: center;">' +
            '<i class="fas fa-check-circle" style="font-size: 40px; color: var(--green); display: block; margin-bottom: 10px;"></i>' +
            'Você não possui tarefas pendentes.' +
        '</p>';
        return;
    }
    
    var rowsHTML = '';
    minhasTarefas.forEach(function(item) {
        var t = item.tarefa;
        var card = item.card;
        
        // Classe da situação
        var situacaoClass = '';
        if (t.situacao === 'Pendente') situacaoClass = 'pendente';
        else if (t.situacao === 'Andamento') situacaoClass = 'andamento';
        else if (t.situacao === 'Concluída') situacaoClass = 'concluida';
        
        rowsHTML += '<tr>' +
            '<td><strong>' + (t.titulo || '-') + '</strong></td>' +
            '<td>' + (t.descricao || '-') + '</td>' +
            '<td>' + item.prazoFormatado + '</td>' +
            '<td><span class="tarefa-situacao-badge ' + situacaoClass + '">' + (t.situacao || '-') + '</span></td>' +
            '<td>' +
                '<div style="font-size: 12px;">' +
                    '<strong>' + (card.titulo || 'Sem título') + '</strong><br>' +
                    '<span style="color: var(--gray); font-size: 11px;">' + (item.cliente ? item.cliente.nome : '-') + '</span>' +
                '</div>' +
            '</td>' +
            '<td>' +
                '<button type="button" class="btn-view-cartao-tarefa" onclick="verCartaoMinhasTarefas(\'' + card.id + '\')" title="Ver Cartão">' +
                    '<i class="fas fa-eye"></i> Ver Cartão' +
                '</button>' +
            '</td>' +
        '</tr>';
    });
    
    container.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Título da Tarefa</th>' +
                '<th>Descrição</th>' +
                '<th>Prazo</th>' +
                '<th>Situação</th>' +
                '<th>Cartão</th>' +
                '<th>Ações</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}


function renderMinhasAtividadesGridInicial() {
    var container = document.getElementById('minhasAtividadesGrid');
    var countEl = document.getElementById('countMinhasAtividades');
    
    if (!container) return;
    
    // Coletar todas as atividades (colaborações) onde o usuário participa
    var minhasAtividades = [];
    
    data.cards.forEach(function(card) {
        if (!card.equipe || !Array.isArray(card.equipe)) return;
        
        card.equipe.forEach(function(colaborador) {
            if (colaborador.usuario_id === currentUser.id) {
                var cliente = data.clientes.find(function(c) { return c.id === card.cliente_id; });
                var board = data.boards.find(function(b) { return b.id === card.board_id; });
                var funnel = board ? data.funnels.find(function(f) { return f.id === board.funnel_id; }) : null;
                var responsavel = data.users.find(function(u) { return u.id === card.responsavel_id; });
                
                // Formatar data do contato
                var dataContatoFormatada = '-';
                if (card.data_contato) {
                    var partes = card.data_contato.split('-');
                    if (partes.length === 3) {
                        dataContatoFormatada = partes[2] + '/' + partes[1] + '/' + partes[0];
                    }
                }
                
                minhasAtividades.push({
                    colaborador: colaborador,
                    card: card,
                    cliente: cliente,
                    board: board,
                    funnel: funnel,
                    responsavel: responsavel,
                    dataContatoFormatada: dataContatoFormatada
                });
            }
        });
    });
    
    // Atualiza contador
    if (countEl) {
        countEl.textContent = minhasAtividades.length;
    }
    
    if (minhasAtividades.length === 0) {
        container.innerHTML = '<p class="empty-message" style="padding: 30px; text-align: center;">' +
            '<i class="fas fa-handshake" style="font-size: 40px; color: var(--gray); display: block; margin-bottom: 10px;"></i>' +
            'Você não participa como colaborador em nenhuma negociação.' +
        '</p>';
        return;
    }
    
    var rowsHTML = '';
    minhasAtividades.forEach(function(item) {
        var statusClass = '';
        if (item.card.situacao === 'Nova') statusClass = 'nova';
        else if (item.card.situacao === 'Em Andamento') statusClass = 'andamento';
        else if (item.card.situacao === 'Contratada') statusClass = 'contratada';
        else if (item.card.situacao === 'Perdida') statusClass = 'perdida';
        
        rowsHTML += '<tr>' +
            '<td>' +
                '<div class="info-funil-quadro">' +
                    '<span class="funil-nome">' + (item.funnel ? item.funnel.nome : '-') + '</span>' +
                    ' <i class="fas fa-angle-right" style="color: #ccc; font-size: 10px;"></i> ' +
                    '<span class="quadro-nome">' + (item.board ? item.board.nome : '-') + '</span>' +
                '</div>' +
            '</td>' +
            '<td><span class="cartao-titulo">' + (item.card.titulo || 'Sem título') + '</span></td>' +
            '<td>' + (item.cliente ? item.cliente.nome : '-') + '</td>' +
            '<td>' + (item.responsavel ? item.responsavel.nome : '-') + '</td>' +
            '<td>' + item.dataContatoFormatada + '</td>' +
            '<td>' + (item.colaborador.principal_funcao || '-') + '</td>' +
            '<td><span class="status-badge-mini ' + statusClass + '">' + (item.card.situacao || '-') + '</span></td>' +
            '<td>' +
                '<button type="button" class="btn-view-atividade" onclick="viewCard(\'' + item.card.id + '\')" title="Ver Cartão">' +
                    '<i class="fas fa-eye"></i> Visualizar' +
                '</button>' +
            '</td>' +
        '</tr>';
    });
    
    container.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Funil / Quadro</th>' +
                '<th>Título do Cartão</th>' +
                '<th>Cliente/Parceiro</th>' +
                '<th>Responsável</th>' +
                '<th>Data Contato</th>' +
                '<th>Sua Função</th>' +
                '<th>Situação</th>' +
                '<th>Ações</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}


function editarCartaoMinhasNegociacoes(cardId) {
    var card = data.cards.find(function(c) { return c.id === cardId; });
    if (!card) {
        alert('Cartão não encontrado!');
        return;
    }
    
    // Configurar o board atual para permitir edição
    currentBoard = data.boards.find(function(b) { return b.id === card.board_id; });
    currentFunnel = currentBoard ? data.funnels.find(function(f) { return f.id === currentBoard.funnel_id; }) : null;
    
    // Abrir modal de edição
    openCardModal('edit', null, cardId);
}

function verCartaoMinhasTarefas(cardId) {
    var card = data.cards.find(function(c) { return c.id === cardId; });
    if (!card) {
        alert('Cartão não encontrado!');
        return;
    }
    
    // Abrir modal de visualização
    viewCard(cardId);
}

function acessarSistemaPrincipal() {
    // Esconder a tela de Minhas Negociações
    document.getElementById('minhasNegociacoesView').classList.remove('active');
    
    // Mostrar o header e a navegação principal
    document.querySelector('.header').style.display = 'flex';
    
    // Mostrar a view do Kanban
    document.getElementById('kanbanView').classList.add('active');
    
    // Atualizar navegação
    document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
    var kanbanBtn = document.querySelector('.nav-btn[data-view="kanban"]');
    if (kanbanBtn) kanbanBtn.classList.add('active');
    
    // Carregar funis
    loadFunnels();
}






// ==================== EVENT LISTENERS ====================
// ... CONTINUA COM O RESTO DO CÓDIGO ORIGINAL ...


    // ==================== Expor funções globalmente ====================
    // Isso é necessário porque o HTML chama funções via onclick
    
    window.openCadastro = openCadastro;
    window.openFunnelModal = openFunnelModal;
    window.deleteFunnel = deleteFunnel;
    window.openBoardModal = openBoardModal;
    window.deleteBoard = deleteBoard;
    window.loadBoard = loadBoard;
    window.openListModal = openListModal;
    window.deleteList = deleteList;
    window.openCardModal = openCardModal;
    window.viewCard = viewCard;
    window.deleteCard = deleteCard;
    window.toggleMotivoPerda = toggleMotivoPerda;
    window.addValorPotencialRow = addValorPotencialRow;
    window.updateValorItem = updateValorItem;
    window.removeValorItem = removeValorItem;
    window.handleFileUpload = handleFileUpload;
    window.updateFileDescricao = updateFileDescricao;
    window.removeFile = removeFile;
    window.addTarefaRow = addTarefaRow;
    window.removeTarefa = removeTarefa;
    window.updateTarefa = updateTarefa;
    window.updateTarefaSituacao = updateTarefaSituacao;
    window.updateTarefaFromView = updateTarefaFromView;
    window.abrirCartaoDaTarefa = abrirCartaoDaTarefa;
    window.showDashboardTab = showDashboardTab;
    window.renderMatrizRiscos = renderMatrizRiscos;
    window.filterClientesDashboard = filterClientesDashboard;
    window.exportDashboardToImage = exportDashboardToImage;
    window.updateHistoricoFilters = updateHistoricoFilters;
    window.applyHistoricoFilters = applyHistoricoFilters;
    window.clearFilters = clearFilters;
    window.openClienteModal = openClienteModal;
    window.deleteCliente = deleteCliente;
    window.addClienteAtivoRow = addClienteAtivoRow;
    window.updateClienteAtivo = updateClienteAtivo;
    window.removeClienteAtivo = removeClienteAtivo;
    window.openUsuarioModal = openUsuarioModal;
    window.deleteUsuario = deleteUsuario;
    window.openRegiaoModal = openRegiaoModal;
    window.deleteRegiao = deleteRegiao;
    window.openCulturaModal = openCulturaModal;
    window.deleteCultura = deleteCultura;
    window.addCulturaEspecialistaRow = addCulturaEspecialistaRow;
    window.updateCulturaEspecialista = updateCulturaEspecialista;
    window.removeCulturaEspecialista = removeCulturaEspecialista;
    window.openTemaModal = openTemaModal;
    window.deleteTema = deleteTema;
    window.addTemaEspecialistaRow = addTemaEspecialistaRow;
    window.updateTemaEspecialista = updateTemaEspecialista;
    window.removeTemaEspecialista = removeTemaEspecialista;
    window.openAtivoModal = openAtivoModal;
    window.deleteAtivo = deleteAtivo;
    window.addRiscoRow = addRiscoRow;
    window.updateRisco = updateRisco;
    window.removeRisco = removeRisco;
    window.addPaeeinRow = addPaeeinRow;
    window.updatePaeein = updatePaeein;
    window.removePaeein = removePaeein;
    window.openProjetoModal = openProjetoModal;
    window.deleteProjeto = deleteProjeto;
    window.openContratoModal = openContratoModal;
    window.deleteContrato = deleteContrato;
    window.filtrarContratos = filtrarContratos;
    window.onContratoClienteChange = onContratoClienteChange;
    window.closeModal = closeModal;
    window.exportToExcel = exportToExcel;
    window.gerarRelatorioClientes = gerarRelatorioClientes;
    window.gerarRelatorioAtivos = gerarRelatorioAtivos;
    window.gerarRelatorioContratos = gerarRelatorioContratos;
    window.renderMinhasNegociacoesView = renderMinhasNegociacoesView;
    window.editarCartaoMinhasNegociacoes = editarCartaoMinhasNegociacoes;
    window.verCartaoMinhasTarefas = verCartaoMinhasTarefas;
    window.acessarSistemaPrincipal = acessarSistemaPrincipal;
    window.abrirHistoricoCliente = abrirHistoricoCliente;
    window.viewCardFromHistoricoCliente = viewCardFromHistoricoCliente;
    window.removeFile = removeFile;

    window.handleAtivoFileUpload = handleAtivoFileUpload;
    window.updateAtivoFileDescricao = updateAtivoFileDescricao;
    window.downloadAtivoFile = downloadAtivoFile;
    window.previewAtivoFile = previewAtivoFile;
    window.removeAtivoFile = removeAtivoFile;

    window.renderColaboracaoView = renderColaboracaoView;
    window.loadFiltroColaboradores = loadFiltroColaboradores;
    window.loadFiltroColaboradorCartoes = loadFiltroColaboradorCartoes;

    window.renderMinhasAtividadesGridInicial = renderMinhasAtividadesGridInicial;

    window.aplicarFiltrosKanban = aplicarFiltrosKanban;
    window.limparFiltrosKanban = limparFiltrosKanban;
    window.loadKanbanFilters = loadKanbanFilters;

    window.AIAnalyzer = window.AIAnalyzer;
    window.AIInterface = window.AIInterface;
    window.AIGenerative = window.AIGenerative;

    // ... RESTO DO CÓDIGO CONTINUA AQUI ...
    // Cole todo o restante das funções do arquivo app.js original
    // (setupEventListeners, handleLogin, logout, showView, etc.)


// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('btnLogout').addEventListener('click', logout);
    document.getElementById('funnelForm').addEventListener('submit', saveFunnel);
    document.getElementById('boardForm').addEventListener('submit', saveBoard);
    document.getElementById('listForm').addEventListener('submit', saveList);
    document.getElementById('cardForm').addEventListener('submit', saveCard);
    document.getElementById('passwordForm').addEventListener('submit', confirmDelete);
    document.getElementById('clienteForm').addEventListener('submit', saveCliente);
    document.getElementById('usuarioForm').addEventListener('submit', saveUsuario);
    document.getElementById('ativoForm').addEventListener('submit', saveAtivo);
    document.getElementById('projetoForm').addEventListener('submit', saveProjeto);
    document.getElementById('regiaoForm').addEventListener('submit', saveRegiao);
    document.getElementById('culturaForm').addEventListener('submit', saveCultura);
    document.getElementById('temaForm').addEventListener('submit', saveTema);
    document.getElementById('contratoForm').addEventListener('submit', saveContrato);

    document.getElementById('funnelSelect').addEventListener('change', onFunnelChange);
    
    document.querySelectorAll('.nav-btn[data-view]').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var view = this.getAttribute('data-view');
            showView(view);
        });
    });

    document.getElementById('kanbanBoard').addEventListener('click', function(e) {
        var button = e.target.closest('button[data-action]');
        if (!button) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        var action = button.getAttribute('data-action');
        var cardId = button.getAttribute('data-card-id');
        
        if (!cardId) return;
        
        switch(action) {
            case 'view':
                viewCard(cardId);
                break;
            case 'edit':
                openCardModal('edit', null, cardId);
                break;
            case 'delete':
                deleteCard(cardId);
                break;
        }
    });
}

// ==================== LOGIN ====================
async function handleLogin(e) {
    e.preventDefault();
    e.stopPropagation(); 
    
    var login = document.getElementById('loginUser').value;
    var senha = document.getElementById('loginPassword').value;
    
    // Recarregar dados de usuários para garantir dados atualizados
    data.users = await loadTableData('users');
    
    var user = data.users.find(function(u) { return u.login === login && u.senha === senha; });
    
    if (user) {
        currentUser = user;
        currentFunnel = null;
        currentBoard = null;
        
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        document.getElementById('currentUserName').textContent = user.nome;
        
        document.getElementById('funnelSelect').selectedIndex = 0;
        document.getElementById('boardSelect').innerHTML = '<option value="">Selecione um Quadro</option>';
        
        document.getElementById('listManagement').classList.add('hidden');
        document.getElementById('kanbanBoard').innerHTML = '<p class="empty-message">Selecione um funil e quadro para começar</p>';
        
        // Recarregar todos os dados após login
        await loadAllData();
        
        // NOVO: Esconder o header inicialmente e mostrar a tela de Minhas Negociações
        document.querySelector('.header').style.display = 'none';
        
        // Garantir que todas as views estão escondidas
        document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
        
        // Mostrar a tela de Minhas Negociações
        document.getElementById('minhasNegociacoesView').classList.add('active');
        
        // Renderizar os dados da tela inicial
        renderMinhasNegociacoesView();
        
    } else {
        alert('Login ou senha incorretos!');
    }
}

function logout() {
    currentUser = null;
    currentFunnel = null;
    currentBoard = null;
    
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
    
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPassword').value = '';
    
    document.getElementById('funnelSelect').innerHTML = '<option value="">Selecione um Funil</option>';
    document.getElementById('boardSelect').innerHTML = '<option value="">Selecione um Quadro</option>';
    
    document.getElementById('listManagement').classList.add('hidden');
    document.getElementById('kanbanBoard').innerHTML = '<p class="empty-message">Selecione um funil e quadro para começar</p>';
    
    document.getElementById('currentUserName').textContent = '';
}

// ==================== VIEW MANAGEMENT ====================
function showView(viewName) {
    // Esconder a tela de Minhas Negociações se estiver visível
    document.getElementById('minhasNegociacoesView').classList.remove('active');
    
    // Garantir que o header está visível
    document.querySelector('.header').style.display = 'flex';
    
    document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
    document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
    
    document.getElementById(viewName + 'View').classList.add('active');
    var navBtn = document.querySelector('.nav-btn[data-view="' + viewName + '"]');
    if (navBtn) {
        navBtn.classList.add('active');
    }
    
    if (viewName === 'dashboard') {
        showDashboardTab('oportunidades');
    } else if (viewName === 'historico') {
        loadHistoricoFilters();
    } else if (viewName === 'tarefas') {
        loadFiltroResponsavelTarefas();
        renderTarefasView();
    }
}

// ==================== FUNNEL MANAGEMENT ====================
function loadFunnels() {
    var select = document.getElementById('funnelSelect');
    select.innerHTML = '<option value="">Selecione um Funil</option>';
    
    var funnelsVisiveis = data.funnels.filter(function(funnel) {
        if (currentUser.perfil === 'Administrador') {
            return true;
        }
        if (funnel.criador_id === currentUser.id) {
            return true;
        }
        var boardsDoFunil = data.boards.filter(function(b) { return b.funnel_id === funnel.id; });
        var boardIds = boardsDoFunil.map(function(b) { return b.id; });
        var temCartaoComoResponsavel = data.cards.some(function(card) {
            return boardIds.indexOf(card.board_id) !== -1 && card.responsavel_id === currentUser.id;
        });
        var temTarefaComoResponsavel = data.cards.some(function(card) {
            if (boardIds.indexOf(card.board_id) === -1) return false;
            if (!card.tarefas) return false;
            return card.tarefas.some(function(t) { return t.responsavel_id === currentUser.id; });
        });
        return temCartaoComoResponsavel || temTarefaComoResponsavel;
    });
    
    funnelsVisiveis.forEach(function(funnel) {
        var option = document.createElement('option');
        option.value = funnel.id;
        option.textContent = funnel.nome;
        select.appendChild(option);
    });
}

function onFunnelChange() {
    var funnelId = document.getElementById('funnelSelect').value;
    currentFunnel = data.funnels.find(function(f) { return f.id === funnelId; });
    currentBoard = null;
    document.getElementById('listManagement').classList.add('hidden');
    document.getElementById('kanbanBoard').innerHTML = '<p class="empty-message">Selecione um quadro para começar</p>';
    loadBoards();
}

function openFunnelModal(mode) {
    editingId = null;
    document.getElementById('funnelName').value = '';
    
    if (mode === 'edit') {
        var funnelId = document.getElementById('funnelSelect').value;
        if (!funnelId) {
            alert('Selecione um funil para editar!');
            return;
        }
        var funnel = data.funnels.find(function(f) { return f.id === funnelId; });
        
        if (currentUser.perfil !== 'Administrador' && funnel.criador_id !== currentUser.id) {
            alert('Você não tem permissão para editar este funil!');
            return;
        }
        
        editingId = funnelId;
        document.getElementById('funnelName').value = funnel.nome;
        document.getElementById('funnelModalTitle').textContent = 'Editar Funil';
    } else {
        document.getElementById('funnelModalTitle').textContent = 'Novo Funil de Negócios';
    }
    
    openModal('funnelModal');
}

async function saveFunnel(e) {
    e.preventDefault();
    var nome = document.getElementById('funnelName').value;
    
    try {
        showLoadingIndicator('Salvando funil...');
        
        if (editingId) {
            await updateData('funnels', editingId, { nome: nome });
            var funnel = data.funnels.find(function(f) { return f.id === editingId; });
            if (funnel) funnel.nome = nome;
        } else {
            var newFunnel = {
                id: generateId(),
                nome: nome,
                criador_id: currentUser.id
            };
            await insertData('funnels', newFunnel);
            data.funnels.push(newFunnel);
        }
        
        hideLoadingIndicator();
        loadFunnels();
        closeModal('funnelModal');
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar funil: ' + err.message);
    }
}

async function deleteFunnel() {
    var funnelId = document.getElementById('funnelSelect').value;
    if (!funnelId) {
        alert('Selecione um funil para excluir!');
        return;
    }
    
    var funnel = data.funnels.find(function(f) { return f.id === funnelId; });
    
    if (currentUser.perfil !== 'Administrador' && funnel.criador_id !== currentUser.id) {
        alert('Você não tem permissão para excluir este funil!');
        return;
    }
    
    var hasBoards = data.boards.some(function(b) { return b.funnel_id === funnelId; });
    if (hasBoards) {
        alert('Não é possível excluir um funil que possui quadros vinculados!');
        return;
    }
    
    deleteCallback = async function() {
        try {
            showLoadingIndicator('Excluindo funil...');
            await deleteData('funnels', funnelId);
            data.funnels = data.funnels.filter(function(f) { return f.id !== funnelId; });
            hideLoadingIndicator();
            loadFunnels();
            document.getElementById('boardSelect').innerHTML = '<option value="">Selecione um Quadro</option>';
            currentFunnel = null;
        } catch (err) {
            hideLoadingIndicator();
            alert('Erro ao excluir funil: ' + err.message);
        }
    };
    
    openPasswordModal();
}

// ==================== BOARD MANAGEMENT ====================
function loadBoards() {
    var select = document.getElementById('boardSelect');
    select.innerHTML = '<option value="">Selecione um Quadro</option>';
    
    if (!currentFunnel) return;
    
    var boards = data.boards.filter(function(b) { 
        if (b.funnel_id !== currentFunnel.id) return false;
        
        if (currentUser.perfil === 'Administrador') {
            return true;
        }
        if (b.criador_id === currentUser.id) {
            return true;
        }
        var temCartaoComoResponsavel = data.cards.some(function(card) {
            return card.board_id === b.id && card.responsavel_id === currentUser.id;
        });
        var temTarefaComoResponsavel = data.cards.some(function(card) {
            if (card.board_id !== b.id) return false;
            if (!card.tarefas) return false;
            return card.tarefas.some(function(t) { return t.responsavel_id === currentUser.id; });
        });
        return temCartaoComoResponsavel || temTarefaComoResponsavel;
    });
    
    boards.forEach(function(board) {
        var option = document.createElement('option');
        option.value = board.id;
        option.textContent = board.nome;
        select.appendChild(option);
    });
}


// ==================== FILTROS KANBAN ====================

// Variáveis globais para armazenar filtros ativos
var filtrosKanbanAtivos = {
    cliente: '',
    responsavel: '',
    ativo: ''
};

function loadKanbanFilters() {
    // Carregar opções de Cliente
    var clienteSelect = document.getElementById('filtroKanbanCliente');
    clienteSelect.innerHTML = '<option value="">Todos</option>';
    data.clientes.forEach(function(c) {
        clienteSelect.innerHTML += '<option value="' + c.id + '">' + c.nome + '</option>';
    });
    
    // Carregar opções de Responsável
    var responsavelSelect = document.getElementById('filtroKanbanResponsavel');
    responsavelSelect.innerHTML = '<option value="">Todos</option>';
    data.users.forEach(function(u) {
        responsavelSelect.innerHTML += '<option value="' + u.id + '">' + u.nome + '</option>';
    });
    
    // Carregar opções de Ativo Tecnológico
    var ativoSelect = document.getElementById('filtroKanbanAtivo');
    ativoSelect.innerHTML = '<option value="">Todos</option>';
    data.ativos.forEach(function(a) {
        ativoSelect.innerHTML += '<option value="' + a.id + '">' + a.nome + '</option>';
    });
}

function aplicarFiltrosKanban() {
    if (!currentBoard) {
        alert('Selecione um quadro primeiro!');
        return;
    }
    
    // Capturar valores dos filtros
    filtrosKanbanAtivos.cliente = document.getElementById('filtroKanbanCliente').value;
    filtrosKanbanAtivos.responsavel = document.getElementById('filtroKanbanResponsavel').value;
    filtrosKanbanAtivos.ativo = document.getElementById('filtroKanbanAtivo').value;
    
    // Atualizar indicador visual
    var filtersBar = document.querySelector('.kanban-filters-bar');
    if (filtrosKanbanAtivos.cliente || filtrosKanbanAtivos.responsavel || filtrosKanbanAtivos.ativo) {
        filtersBar.classList.add('filters-active');
    } else {
        filtersBar.classList.remove('filters-active');
    }
    
    // Re-renderizar o kanban com filtros aplicados
    renderKanbanBoard();
}

function limparFiltrosKanban() {
    // Limpar valores dos filtros
    document.getElementById('filtroKanbanCliente').value = '';
    document.getElementById('filtroKanbanResponsavel').value = '';
    document.getElementById('filtroKanbanAtivo').value = '';
    
    // Limpar objeto de filtros
    filtrosKanbanAtivos = {
        cliente: '',
        responsavel: '',
        ativo: ''
    };
    
    // Remover indicador visual
    var filtersBar = document.querySelector('.kanban-filters-bar');
    filtersBar.classList.remove('filters-active');
    
    // Re-renderizar o kanban sem filtros
    renderKanbanBoard();
}

function cardPassaFiltrosKanban(card) {
    // Se não há filtros ativos, retorna verdadeiro
    if (!filtrosKanbanAtivos.cliente && !filtrosKanbanAtivos.responsavel && !filtrosKanbanAtivos.ativo) {
        return true;
    }
    
    // Verificar filtro de cliente
    if (filtrosKanbanAtivos.cliente && card.cliente_id !== filtrosKanbanAtivos.cliente) {
        return false;
    }
    
    // Verificar filtro de responsável
    if (filtrosKanbanAtivos.responsavel && card.responsavel_id !== filtrosKanbanAtivos.responsavel) {
        return false;
    }
    
    // Verificar filtro de ativo tecnológico
    if (filtrosKanbanAtivos.ativo && card.ativo_id !== filtrosKanbanAtivos.ativo) {
        return false;
    }
    
    return true;
}




function openBoardModal(mode) {
    if (!currentFunnel) {
        alert('Selecione um funil primeiro!');
        return;
    }
    
    editingId = null;
    document.getElementById('boardName').value = '';
    
    if (mode === 'edit') {
        var boardId = document.getElementById('boardSelect').value;
        if (!boardId) {
            alert('Selecione um quadro para editar!');
            return;
        }
        var board = data.boards.find(function(b) { return b.id === boardId; });
        
        if (currentUser.perfil !== 'Administrador' && board.criador_id !== currentUser.id) {
            alert('Você não tem permissão para editar este quadro!');
            return;
        }
        
        editingId = boardId;
        document.getElementById('boardName').value = board.nome;
        document.getElementById('boardModalTitle').textContent = 'Editar Quadro';
    } else {
        document.getElementById('boardModalTitle').textContent = 'Novo Quadro Kanban';
    }
    
    openModal('boardModal');
}

async function saveBoard(e) {
    e.preventDefault();
    var nome = document.getElementById('boardName').value;
    
    try {
        showLoadingIndicator('Salvando quadro...');
        
        if (editingId) {
            await updateData('boards', editingId, { nome: nome });
            var board = data.boards.find(function(b) { return b.id === editingId; });
            if (board) board.nome = nome;
        } else {
            var boardId = generateId();
            var newBoard = {
                id: boardId,
                funnel_id: currentFunnel.id,
                nome: nome,
                criador_id: currentUser.id
            };
            await insertData('boards', newBoard);
            data.boards.push(newBoard);
            
            // Criar listas padrão
            var defaultLists = [
                'Primeiro contato (Lead)',
                'Oportunidade identificada',
                'Proposta',
                'Contratação'
            ];
            
            for (var i = 0; i < defaultLists.length; i++) {
                var newList = {
                    id: generateId(),
                    board_id: boardId,
                    nome: defaultLists[i],
                    ordem: i
                };
                await insertData('lists', newList);
                data.lists.push(newList);
            }
        }
        
        hideLoadingIndicator();
        loadBoards();
        closeModal('boardModal');
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar quadro: ' + err.message);
    }
}

async function deleteBoard() {
    var boardId = document.getElementById('boardSelect').value;
    if (!boardId) {
        alert('Selecione um quadro para excluir!');
        return;
    }
    
    var board = data.boards.find(function(b) { return b.id === boardId; });
    
    if (currentUser.perfil !== 'Administrador' && board.criador_id !== currentUser.id) {
        alert('Você não tem permissão para excluir este quadro!');
        return;
    }
    
    var hasLists = data.lists.some(function(l) { return l.board_id === boardId; });
    var hasCards = data.cards.some(function(c) { return c.board_id === boardId; });
    
    if (hasLists || hasCards) {
        alert('Não é possível excluir um quadro que possui listas ou cartões vinculados!');
        return;
    }
    
    deleteCallback = async function() {
        try {
            showLoadingIndicator('Excluindo quadro...');
            await deleteData('boards', boardId);
            data.boards = data.boards.filter(function(b) { return b.id !== boardId; });
            hideLoadingIndicator();
            loadBoards();
            renderKanbanBoard();
            currentBoard = null;
        } catch (err) {
            hideLoadingIndicator();
            alert('Erro ao excluir quadro: ' + err.message);
        }
    };
    
    openPasswordModal();
}

function loadBoard() {
    var boardId = document.getElementById('boardSelect').value;
    if (!boardId) {
        alert('Selecione um quadro para carregar!');
        return;
    }
    
    currentBoard = data.boards.find(function(b) { return b.id === boardId; });
    
    if (!currentBoard) {
        alert('Quadro não encontrado!');
        return;
    }
    
    var temPermissao = false;
    if (currentUser.perfil === 'Administrador') {
        temPermissao = true;
    } else if (currentBoard.criador_id === currentUser.id) {
        temPermissao = true;
    } else {
        temPermissao = data.cards.some(function(card) {
            return card.board_id === currentBoard.id && card.responsavel_id === currentUser.id;
        });
        if (!temPermissao) {
            temPermissao = data.cards.some(function(card) {
                if (card.board_id !== currentBoard.id) return false;
                if (!card.tarefas) return false;
                return card.tarefas.some(function(t) { return t.responsavel_id === currentUser.id; });
            });
        }
    }
    
    if (!temPermissao) {
        alert('Você não tem permissão para acessar este quadro!');
        currentBoard = null;
        return;
    }
    
    document.getElementById('listManagement').classList.remove('hidden');

	// ADICIONAR ESTAS 2 LINHAS
    loadKanbanFilters();
    limparFiltrosKanban(); // Limpar filtros ao carregar novo quadro


    renderKanbanBoard();
}

// ==================== LIST MANAGEMENT ====================



function renderKanbanBoard() {
    var container = document.getElementById('kanbanBoard');
    
    if (!currentBoard) {
        container.innerHTML = '<p class="empty-message">Selecione um funil e quadro para começar</p>';
        return;
    }
    
    var lists = data.lists
        .filter(function(l) { return l.board_id === currentBoard.id; })
        .sort(function(a, b) { return a.ordem - b.ordem; });
    
    if (currentUser.perfil !== 'Administrador' && currentBoard.criador_id !== currentUser.id) {
        lists = lists.filter(function(list) {
            return data.cards.some(function(card) {
                if (card.list_id !== list.id) return false;
                // ADICIONAR: Aplicar filtros aqui também
                if (!cardPassaFiltrosKanban(card)) return false;
                
                if (card.responsavel_id === currentUser.id) return true;
                if (card.tarefas) {
                    return card.tarefas.some(function(t) { return t.responsavel_id === currentUser.id; });
                }
                return false;
            });
        });
    }
    
    if (lists.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhuma lista encontrada. Adicione uma nova lista.</p>';
        return;
    }
    
    container.innerHTML = '';
    
    lists.forEach(function(list) {
        var listEl = createListElement(list);
        container.appendChild(listEl);
    });
    
    setupDragAndDrop();
}






function createListElement(list) {
    var div = document.createElement('div');
    div.className = 'kanban-list';
    div.setAttribute('data-list-id', list.id);
    div.draggable = true;
    
    // MODIFICADO: Aplicar filtros aqui
    var cards = data.cards
        .filter(function(c) { return c.list_id === list.id; })
        .filter(function(c) { return canViewCard(c); })
        .filter(function(c) { return cardPassaFiltrosKanban(c); }); // NOVA LINHA
    
    var cardsHTML = '';
    cards.forEach(function(card) {
        cardsHTML += createCardHTML(card);
    });
    
    // Contador de cartões com filtro
    var totalCartoes = data.cards.filter(function(c) { return c.list_id === list.id; }).length;
    var cartoesVistos = cards.length;
    var contadorTexto = cartoesVistos + (totalCartoes > cartoesVistos ? '/' + totalCartoes : '');
    
    div.innerHTML = 
        '<div class="list-header">' +
            '<h3>' + list.nome + ' <span style="font-size: 11px; color: var(--gray); font-weight: normal;">(' + contadorTexto + ')</span></h3>' +
            '<div class="list-actions">' +
                '<button type="button" class="btn-add-card" onclick="openCardModal(\'add\', \'' + list.id + '\')" title="Adicionar Cartão">' +
                    '<i class="fas fa-plus"></i>' +
                '</button>' +
                '<button type="button" class="btn-edit-list" onclick="openListModal(\'edit\', \'' + list.id + '\')" title="Editar Lista">' +
                    '<i class="fas fa-edit"></i>' +
                '</button>' +
                '<button type="button" class="btn-delete-list" onclick="deleteList(\'' + list.id + '\')" title="Excluir Lista">' +
                    '<i class="fas fa-trash"></i>' +
                '</button>' +
            '</div>' +
        '</div>' +
        '<div class="list-cards" data-list-id="' + list.id + '">' +
            cardsHTML +
        '</div>';
    
    return div;
}




function createCardHTML(card) {
    var qualificacaoClass = card.qualificacao ? 'qualificacao-' + card.qualificacao : '';
    var statusClass = getStatusClass(card.situacao);

    var cliente = data.clientes.find(function(c) { return c.id === card.cliente_id; });
    
    var dataContatoFormatada = '-';
    if (card.data_contato) {
        var partes = card.data_contato.split('-');
        if (partes.length === 3) {
            dataContatoFormatada = partes[2] + '/' + partes[1] + '/' + partes[0];
        } else {
            dataContatoFormatada = card.data_contato;
        }
    }

    var cardId = card.id;

    // NOVO: Calcular score de IA para o cartão
    var scoreHTML = '';
    if (window.AIAnalyzer && card.situacao !== 'Contratada' && card.situacao !== 'Perdida') {
        var scoreInfo = AIAnalyzer.calcularScoreNegociacao(cardId);
        if (scoreInfo) {
            scoreHTML = '<div style="display:flex; align-items:center; gap:5px; margin-top:5px; font-size:10px;">' +
                '<i class="fas fa-brain" style="color:' + scoreInfo.cor + ';"></i>' +
                '<span style="color:var(--gray);">Score:</span>' +
                '<span style="font-weight:bold; color:' + scoreInfo.cor + ';">' + scoreInfo.score + '</span>' +
                '<span style="color:var(--gray);">(' + scoreInfo.classificacao + ')</span>' +
            '</div>';
        }
    }

    return '<div class="kanban-card ' + qualificacaoClass + '" data-card-id="' + cardId + '" draggable="true">' +
        '<div class="card-title">' + (card.titulo || 'Sem título') + '</div>' +
        '<div class="card-info"><i class="fas fa-user"></i> ' + (cliente ? cliente.nome : '-') + '</div>' +
        '<div class="card-info"><i class="fas fa-calendar-alt"></i> ' + dataContatoFormatada + '</div>' +
        '<span class="card-status ' + statusClass + '">' + (card.situacao || '-') + '</span>' +
        '<div class="card-qualificacao">' + getQualificacaoStars(card.qualificacao) + '</div>' +
        scoreHTML +  // NOVO: Score de IA
        '<div class="card-actions">' +
            '<button type="button" class="btn-view" data-action="view" data-card-id="' + cardId + '" title="Visualizar">' +
                '<i class="fas fa-eye"></i>' +
            '</button>' +
            '<button type="button" class="btn-edit" data-action="edit" data-card-id="' + cardId + '" title="Editar">' +
                '<i class="fas fa-edit"></i>' +
            '</button>' +
            '<button type="button" class="btn-delete" data-action="delete" data-card-id="' + cardId + '" title="Excluir">' +
                '<i class="fas fa-trash"></i>' +
            '</button>' +
        '</div>' +
    '</div>';
}

function getStatusClass(status) {
    switch(status) {
        case 'Nova': return 'status-nova';
        case 'Em Andamento': return 'status-andamento';
        case 'Contratada': return 'status-contratada';
        case 'Perdida': return 'status-perdida';
        default: return '';
    }
}

function getQualificacaoLabel(qual) {
    var labels = {
        '1': '1. Muito Frio',
        '2': '2. Frio',
        '3': '3. Morno',
        '4': '4. Quente',
        '5': '5. Quero Contratar'
    };
    return labels[qual] || '-';
}

function getQualificacaoStars(qual) {
    var levels = parseInt(qual) || 0;
    var labels = {
        '1': 'Muito Frio',
        '2': 'Frio',
        '3': 'Morno',
        '4': 'Quente',
        '5': 'Quero Contratar'
    };
    var stars = '';
    for (var i = 1; i <= 5; i++) {
        stars += '<span class="star' + (i <= levels ? ' filled' : '') + '">&#9733;</span>';
    }
    var tooltip = labels[qual] || 'Sem qualificação';
    return '<span class="stars-container" title="' + tooltip + '">' + stars + '</span>';
}

function calculateCardTotal(card) {
    if (!card.valor_potencial || !Array.isArray(card.valor_potencial)) return 0;
    return card.valor_potencial.reduce(function(sum, item) {
        return sum + (parseFloat(item.total) || 0);
    }, 0);
}

function formatCurrency(value) {
    return parseFloat(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function canViewCard(card) {
    if (currentUser.perfil === 'Administrador') return true;
    
    var board = data.boards.find(function(b) { return b.id === card.board_id; });
    if (board && board.criador_id === currentUser.id) return true;
    
    if (card.responsavel_id === currentUser.id) return true;
    
    if (card.tarefas && card.tarefas.length > 0) {
        var isResponsavelTarefa = card.tarefas.some(function(t) {
            return t.responsavel_id === currentUser.id;
        });
        if (isResponsavelTarefa) return true;
    }
    
    return false;
}

function canEditCard(card) {
    return canViewCard(card);
}

function openListModal(mode, listId) {
    editingId = null;
    document.getElementById('listName').value = '';
    
    if (mode === 'edit' && listId) {
        var list = data.lists.find(function(l) { return l.id === listId; });
        editingId = listId;
        document.getElementById('listName').value = list.nome;
        document.getElementById('listModalTitle').textContent = 'Editar Lista';
    } else {
        document.getElementById('listModalTitle').textContent = 'Nova Lista';
    }
    
    openModal('listModal');
}

async function saveList(e) {
    e.preventDefault();
    var nome = document.getElementById('listName').value;
    
    try {
        showLoadingIndicator('Salvando lista...');
        
        if (editingId) {
            await updateData('lists', editingId, { nome: nome });
            var list = data.lists.find(function(l) { return l.id === editingId; });
            if (list) list.nome = nome;
        } else {
            var ordens = data.lists.filter(function(l) { return l.board_id === currentBoard.id; }).map(function(l) { return l.ordem; });
            var maxOrdem = ordens.length > 0 ? Math.max.apply(null, ordens) : -1;
            var newList = {
                id: generateId(),
                board_id: currentBoard.id,
                nome: nome,
                ordem: maxOrdem + 1
            };
            await insertData('lists', newList);
            data.lists.push(newList);
        }
        
        hideLoadingIndicator();
        renderKanbanBoard();
        closeModal('listModal');
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar lista: ' + err.message);
    }
}

async function deleteList(listId) {
    var hasCards = data.cards.some(function(c) { return c.list_id === listId; });
    if (hasCards) {
        alert('Não é possível excluir uma lista que possui cartões!');
        return;
    }
    
    deleteCallback = async function() {
        try {
            showLoadingIndicator('Excluindo lista...');
            await deleteData('lists', listId);
            data.lists = data.lists.filter(function(l) { return l.id !== listId; });
            hideLoadingIndicator();
            renderKanbanBoard();
        } catch (err) {
            hideLoadingIndicator();
            alert('Erro ao excluir lista: ' + err.message);
        }
    };
    
    openPasswordModal();
}

// ==================== CARD MANAGEMENT ====================
function openCardModal(mode, listId, cardId) {
    editingId = null;
    cardFiles = [];
    valorPotencialItems = [];
    cardTarefas = [];
    cardEquipe = []; 
    
    document.getElementById('cardForm').reset();
    document.getElementById('valorPotencialBody').innerHTML = '';
    document.getElementById('arquivosBody').innerHTML = '';
    document.getElementById('tarefasBody').innerHTML = '';
    document.getElementById('colaboradoresBody').innerHTML = '';

    document.getElementById('valorTotalGeral').textContent = '0,00';
    document.getElementById('motivoPerdaRow').style.display = 'none';
    
    loadCardDropdowns();
    populateCardEquipeSelect();
    
    if (mode === 'edit' && cardId) {
        var card = data.cards.find(function(c) { return c.id === cardId; });
        if (!canEditCard(card)) {
            alert('Você não tem permissão para editar este cartão!');
            return;
        }
        editingId = cardId;
        populateCardForm(card);
        document.getElementById('cardModalTitle').textContent = 'Editar Cartão';
    } else {
        document.getElementById('cardForm').setAttribute('data-list-id', listId);
        document.getElementById('cardModalTitle').textContent = 'Novo Cartão';
    }
    
    openModal('cardModal');
}

function loadCardDropdowns() {
    var clienteSelect = document.getElementById('cardCliente');
    clienteSelect.innerHTML = '<option value="">Selecione</option>';
    data.clientes.forEach(function(c) {
        clienteSelect.innerHTML += '<option value="' + c.id + '">' + c.nome + '</option>';
    });
    
    var responsavelSelect = document.getElementById('cardResponsavel');
    responsavelSelect.innerHTML = '<option value="">Selecione</option>';
    data.users.forEach(function(u) {
        responsavelSelect.innerHTML += '<option value="' + u.id + '">' + u.nome + '</option>';
    });
    
    var regiaoSelect = document.getElementById('cardRegiao');
    regiaoSelect.innerHTML = '<option value="">Selecione</option>';
    data.regioes.forEach(function(r) {
        var estadoInfo = r.estado ? ' (' + r.estado + ')' : '';
        regiaoSelect.innerHTML += '<option value="' + r.id + '">' + r.nome + estadoInfo + '</option>';
    });
    
    var culturaSelect = document.getElementById('cardCultura');
    culturaSelect.innerHTML = '<option value="">Selecione</option>';
    data.culturas.forEach(function(c) {
        culturaSelect.innerHTML += '<option value="' + c.id + '">' + c.nome + '</option>';
    });
    
    var temaSelect = document.getElementById('cardTema');
    temaSelect.innerHTML = '<option value="">Selecione</option>';
    data.temas.forEach(function(t) {
        temaSelect.innerHTML += '<option value="' + t.id + '">' + t.nome + '</option>';
    });
    
    var projetoSelect = document.getElementById('cardProjeto');
    projetoSelect.innerHTML = '<option value="">Selecione</option>';
    data.projetos.forEach(function(p) {
        projetoSelect.innerHTML += '<option value="' + p.id + '">' + p.titulo + '</option>';
    });
    
    var ativoSelect = document.getElementById('cardAtivo');
    ativoSelect.innerHTML = '<option value="">Selecione</option>';
    data.ativos.forEach(function(a) {
        ativoSelect.innerHTML += '<option value="' + a.id + '">' + a.nome + '</option>';
    });

    var contratoSelect = document.getElementById('cardContrato');
    contratoSelect.innerHTML = '<option value="">Selecione</option>';
    data.contratos.forEach(function(c) {
        var cliente = data.clientes.find(function(cl) { return cl.id === c.cliente_id; });
        var label = c.numero_saic + (cliente ? ' - ' + cliente.nome : '');
        contratoSelect.innerHTML += '<option value="' + c.id + '">' + label + '</option>';
    });
}

function populateCardForm(card) {
    document.getElementById('cardTitle').value = card.titulo || '';
    document.getElementById('cardDescricao').value = card.descricao || '';
    document.getElementById('cardDataContato').value = card.data_contato || '';
    document.getElementById('cardDataFechamento').value = card.data_fechamento || '';
    document.getElementById('cardResponsavel').value = card.responsavel_id || '';
    document.getElementById('cardCultura').value = card.cultura_id || '';
    document.getElementById('cardTema').value = card.tema_id || '';
    document.getElementById('cardCliente').value = card.cliente_id || '';
    document.getElementById('cardRegiao').value = card.regiao_id || '';
    document.getElementById('cardProjeto').value = card.projeto_id || '';
    document.getElementById('cardAtivo').value = card.ativo_id || '';
    document.getElementById('cardContrato').value = card.contrato_id || '';
    document.getElementById('cardQualificacao').value = card.qualificacao || '';
    document.getElementById('cardSituacao').value = card.situacao || '';
    document.getElementById('cardMotivoPerda').value = card.motivo_perda || '';
    
    if (card.situacao === 'Perdida') {
        document.getElementById('motivoPerdaRow').style.display = 'flex';
    }
    
    if (card.valor_potencial && Array.isArray(card.valor_potencial)) {
        valorPotencialItems = card.valor_potencial.slice();
        renderValorPotencialGrid();
    }
    
    if (card.arquivos && Array.isArray(card.arquivos)) {
        cardFiles = card.arquivos.slice();
        renderArquivosGrid();
    }

    if (card.tarefas && Array.isArray(card.tarefas)) {
        cardTarefas = card.tarefas.slice();
        renderTarefasGrid();
    }

if (card.equipe && Array.isArray(card.equipe)) {
        cardEquipe = card.equipe.slice();
        renderColaboradoresGrid();
        populateCardEquipeSelect();
    }
}

async function saveCard(e) {
    e.preventDefault();
    
    var listId;
    if (editingId) {
        var existingCard = data.cards.find(function(c) { return c.id === editingId; });
        listId = existingCard.list_id;
    } else {
        listId = document.getElementById('cardForm').getAttribute('data-list-id');
    }
    
    var cardData = {
        id: editingId || generateId(),
        list_id: listId,
        board_id: currentBoard.id,
        titulo: document.getElementById('cardTitle').value,
        descricao: document.getElementById('cardDescricao').value,
        data_contato: document.getElementById('cardDataContato').value || null,
        data_fechamento: document.getElementById('cardDataFechamento').value || null,
        responsavel_id: document.getElementById('cardResponsavel').value || null,
        cultura_id: document.getElementById('cardCultura').value || null,
        tema_id: document.getElementById('cardTema').value || null,
        cliente_id: document.getElementById('cardCliente').value || null,
        regiao_id: document.getElementById('cardRegiao').value || null,
        projeto_id: document.getElementById('cardProjeto').value || null,
        ativo_id: document.getElementById('cardAtivo').value || null,
        contrato_id: document.getElementById('cardContrato').value || null,
        qualificacao: document.getElementById('cardQualificacao').value || null,
        situacao: document.getElementById('cardSituacao').value || null,
        motivo_perda: document.getElementById('cardMotivoPerda').value || null,
        valor_potencial: valorPotencialItems,
        arquivos: cardFiles,
        tarefas: cardTarefas,
	equipe: cardEquipe,  // ADICIONAR ESTA LINHA
        criador_id: editingId ? existingCard.criador_id : currentUser.id,
        data_criacao: editingId ? existingCard.data_criacao : new Date().toISOString()
    };
    
    try {
        showLoadingIndicator('Salvando cartão...');
        
        if (editingId) {
            await updateData('cards', editingId, cardData);
            var index = data.cards.findIndex(function(c) { return c.id === editingId; });
            data.cards[index] = cardData;
        } else {
            await insertData('cards', cardData);
            data.cards.push(cardData);
        }
        
        hideLoadingIndicator();
        renderKanbanBoard();
        closeModal('cardModal');
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar cartão: ' + err.message);
    }
}

async function deleteCard(cardId) {
    var card = data.cards.find(function(c) { return c.id === cardId; });
    if (!canEditCard(card)) {
        alert('Você não tem permissão para excluir este cartão!');
        return;
    }
    
    if (confirm('Tem certeza que deseja excluir este cartão?')) {
        try {
            showLoadingIndicator('Excluindo cartão...');
            await deleteData('cards', cardId);
            data.cards = data.cards.filter(function(c) { return c.id !== cardId; });
            hideLoadingIndicator();
            renderKanbanBoard();
        } catch (err) {
            hideLoadingIndicator();
            alert('Erro ao excluir cartão: ' + err.message);
        }
    }
}

function viewCard(cardId) {
    var card = data.cards.find(function(c) { return c.id === cardId; });
    if (!canViewCard(card)) {
        alert('Você não tem permissão para visualizar este cartão!');
        return;
    }
    
    var cliente = data.clientes.find(function(c) { return c.id === card.cliente_id; });
    var responsavel = data.users.find(function(u) { return u.id === card.responsavel_id; });
    var regiao = data.regioes.find(function(r) { return r.id === card.regiao_id; });
    var cultura = data.culturas.find(function(c) { return c.id === card.cultura_id; });
    var tema = data.temas.find(function(t) { return t.id === card.tema_id; });
    var projeto = data.projetos.find(function(p) { return p.id === card.projeto_id; });
    var ativo = data.ativos.find(function(a) { return a.id === card.ativo_id; });
    var contrato = data.contratos.find(function(c) { return c.id === card.contrato_id; });
    var valorTotal = calculateCardTotal(card);
    
    var motivoPerdaHTML = '';
    if (card.situacao === 'Perdida') {
        motivoPerdaHTML = '<div class="field full-width">' +
            '<div class="field-label">Motivo da Perda</div>' +
            '<div class="field-value">' + (card.motivo_perda || '-') + '</div>' +
        '</div>';
    }
    
    var tarefasHTML = '';
    if (card.tarefas && card.tarefas.length > 0) {
        tarefasHTML = '<div class="field full-width"><div class="field-label">Tarefas</div><div class="field-value">';
        tarefasHTML += '<table style="width:100%; font-size:11px; border-collapse:collapse;">';
        tarefasHTML += '<tr style="background:#172B4D;color:#fff;"><th style="padding:5px;">Título</th><th style="padding:5px;">Responsável</th><th style="padding:5px;">Prazo</th><th style="padding:5px;">Situação</th></tr>';
        card.tarefas.forEach(function(t) {
            var resp = data.users.find(function(u) { return u.id === t.responsavel_id; });
            tarefasHTML += '<tr><td style="padding:5px;border-bottom:1px solid #eee;">' + (t.titulo || '-') + '</td>';
            tarefasHTML += '<td style="padding:5px;border-bottom:1px solid #eee;">' + (resp ? resp.nome : '-') + '</td>';
            tarefasHTML += '<td style="padding:5px;border-bottom:1px solid #eee;">' + (t.prazo || '-') + '</td>';
            tarefasHTML += '<td style="padding:5px;border-bottom:1px solid #eee;">' + (t.situacao || '-') + '</td></tr>';
        });
        tarefasHTML += '</table></div></div>';
    }

    // NOVO: Gerar sugestões de IA para o cartão
    var iaHTML = '';
    if (window.AIInterface) {
        iaHTML = AIInterface.renderSugestoesCartao(cardId);
    }
    
    var content = document.getElementById('viewCardContent');
    content.innerHTML = 
        '<div class="field">' +
            '<div class="field-label">Título</div>' +
            '<div class="field-value">' + (card.titulo || '-') + '</div>' +
        '</div>' +
        '<div class="field">' +
            '<div class="field-label">Cliente/Parceiro</div>' +
            '<div class="field-value">' + (cliente ? cliente.nome : '-') + '</div>' +
        '</div>' +
        '<div class="field">' +
            '<div class="field-label">Responsável</div>' +
            '<div class="field-value">' + (responsavel ? responsavel.nome : '-') + '</div>' +
        '</div>' +
        '<div class="field">' +
            '<div class="field-label">Data do Contato</div>' +
            '<div class="field-value">' + (card.data_contato || '-') + '</div>' +
        '</div>' +
        '<div class="field">' +
            '<div class="field-label">Previsão Fechamento</div>' +
            '<div class="field-value">' + (card.data_fechamento || '-') + '</div>' +
        '</div>' +
        '<div class="field">' +
            '<div class="field-label">Região</div>' +
            '<div class="field-value">' + (regiao ? regiao.nome + (regiao.estado ? ' (' + regiao.estado + ')' : '') : '-') + '</div>' +
        '</div>' +
        '<div class="field">' +
            '<div class="field-label">Cultura Agrícola</div>' +
            '<div class="field-value">' + (cultura ? cultura.nome : '-') + '</div>' +
        '</div>' +
        '<div class="field">' +
            '<div class="field-label">Tema</div>' +
            '<div class="field-value">' + (tema ? tema.nome : '-') + '</div>' +
        '</div>' +
        '<div class="field">' +
            '<div class="field-label">Projeto</div>' +
            '<div class="field-value">' + (projeto ? projeto.titulo : '-') + '</div>' +
        '</div>' +
        '<div class="field">' +
            '<div class="field-label">Ativo Tecnológico</div>' +
            '<div class="field-value">' + (ativo ? ativo.nome : '-') + '</div>' +
        '</div>' +
        '<div class="field">' +
            '<div class="field-label">Contrato/Convênio</div>' +
            '<div class="field-value">' + (contrato ? contrato.numero_saic : '-') + '</div>' +
        '</div>' +
        '<div class="field">' +
            '<div class="field-label">Qualificação</div>' +
            '<div class="field-value">' + getQualificacaoLabel(card.qualificacao) + '</div>' +
        '</div>' +
        '<div class="field">' +
            '<div class="field-label">Situação</div>' +
            '<div class="field-value">' + (card.situacao || '-') + '</div>' +
        '</div>' +
        '<div class="field full-width">' +
            '<div class="field-label">Descrição</div>' +
            '<div class="field-value">' + (card.descricao || '-') + '</div>' +
        '</div>' +
        motivoPerdaHTML +
        '<div class="field full-width">' +
            '<div class="field-label">Valor Potencial Total</div>' +
            '<div class="field-value" style="color: #61BD4F; font-size: 18px; font-weight: bold;">R$ ' + formatCurrency(valorTotal) + '</div>' +
        '</div>' +
        tarefasHTML +
        iaHTML;  // NOVO: Sugestões de IA
    
    openModal('viewCardModal');
}

function toggleMotivoPerda() {
    var situacao = document.getElementById('cardSituacao').value;
    document.getElementById('motivoPerdaRow').style.display = situacao === 'Perdida' ? 'flex' : 'none';
}

// ==================== EQUIPE DO CARTÃO ====================

function addCardEquipe() {
    var selectEl = document.getElementById('cardEquipeSelect');
    var usuarioId = selectEl.value;
    
    if (!usuarioId) {
        alert('Selecione um usuário para adicionar!');
        return;
    }
    
    // Verificar se o usuário já está na equipe
    var jaExiste = cardEquipe.some(function(m) { return m.usuario_id === usuarioId; });
    if (jaExiste) {
        alert('Este usuário já está na equipe!');
        return;
    }
    
    var usuario = data.users.find(function(u) { return u.id === usuarioId; });
    
    if (usuario) {
        cardEquipe.push({
            id: generateId(),
            usuario_id: usuarioId,
            nome: usuario.nome,
            cargo: usuario.cargo || '',
            principal_funcao: '',
            data_adicao: new Date().toISOString()
        });
        
        renderColaboradoresGrid();
        selectEl.value = '';
        populateCardEquipeSelect();
    }
}






function renderColaboradoresGrid() {
    var tbody = document.getElementById('colaboradoresBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (cardEquipe.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--gray); padding: 20px;">Nenhum colaborador adicionado</td></tr>';
        return;
    }
    
    cardEquipe.forEach(function(colaborador, index) {
        tbody.innerHTML += 
            '<tr>' +
                '<td><strong>' + (colaborador.nome || '-') + '</strong></td>' +
                '<td>' + (colaborador.cargo || '-') + '</td>' +
                '<td>' +
                    '<input type="text" value="' + (colaborador.principal_funcao || '') + '" ' +
                    'placeholder="Ex: Coordenador, Técnico..." ' +
                    'onchange="updateColaborador(' + index + ', \'principal_funcao\', this.value)" ' +
                    'style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">' +
                '</td>' +
                '<td><button type="button" class="btn-remove-row" onclick="removeCardEquipe(' + index + ')" title="Remover">' +
                    '<i class="fas fa-trash"></i></button></td>' +
            '</tr>';
    });
}


function updateColaborador(index, field, value) {
    if (cardEquipe[index]) {
        cardEquipe[index][field] = value;
    }
}

function removeCardEquipe(index) {
    cardEquipe.splice(index, 1);
    renderColaboradoresGrid();
    populateCardEquipeSelect();
}


function populateCardEquipeSelect() {
    var selectEl = document.getElementById('cardEquipeSelect');
    if (!selectEl) return;
    
    selectEl.innerHTML = '<option value="">Selecione um usuário</option>';
    
    // ORDENAR usuários por nome alfabeticamente
    var usuariosOrdenados = data.users.slice().sort(function(a, b) {
        return a.nome.localeCompare(b.nome);
    });
    
    usuariosOrdenados.forEach(function(u) {
        // Não adicionar o usuário se já está na equipe
        var jaExiste = cardEquipe.some(function(m) { return m.usuario_id === u.id; });
        if (!jaExiste) {
            selectEl.innerHTML += '<option value="' + u.id + '">' + u.nome + 
                (u.cargo ? ' (' + u.cargo + ')' : '') + '</option>';
        }
    });
}

// ==================== VALOR POTENCIAL ====================
function addValorPotencialRow() {
    valorPotencialItems.push({
        id: generateId(),
        descricao: '',
        quantidade: 0,
        valor: 0,
        total: 0
    });
    renderValorPotencialGrid();
}

function renderValorPotencialGrid() {
    var tbody = document.getElementById('valorPotencialBody');
    tbody.innerHTML = '';
    
    valorPotencialItems.forEach(function(item, index) {
        tbody.innerHTML += 
            '<tr>' +
                '<td><input type="text" value="' + item.descricao + '" onchange="updateValorItem(' + index + ', \'descricao\', this.value)"></td>' +
                '<td><input type="number" value="' + item.quantidade + '" onchange="updateValorItem(' + index + ', \'quantidade\', this.value)" style="width: 80px;"></td>' +
                '<td><input type="number" step="0.01" value="' + item.valor + '" onchange="updateValorItem(' + index + ', \'valor\', this.value)" style="width: 100px;"></td>' +
                '<td>R$ ' + formatCurrency(item.total) + '</td>' +
                '<td><button type="button" class="btn-remove-row" onclick="removeValorItem(' + index + ')"><i class="fas fa-trash"></i></button></td>' +
            '</tr>';
    });
    
    updateValorTotal();
}

function updateValorItem(index, field, value) {
    valorPotencialItems[index][field] = value;
    if (field === 'quantidade' || field === 'valor') {
        valorPotencialItems[index].total = parseFloat(valorPotencialItems[index].quantidade || 0) * parseFloat(valorPotencialItems[index].valor || 0);
        renderValorPotencialGrid();
    }
}

function removeValorItem(index) {
    valorPotencialItems.splice(index, 1);
    renderValorPotencialGrid();
}

function updateValorTotal() {
    var total = valorPotencialItems.reduce(function(sum, item) {
        return sum + parseFloat(item.total || 0);
    }, 0);
    document.getElementById('valorTotalGeral').textContent = formatCurrency(total);
}

// ==================== FILE UPLOAD ====================
// ==================== FILE UPLOAD ====================
function handleFileUpload(event) {
    var files = event.target.files;
    
    Array.from(files).forEach(function(file) {
        if (file.type === 'application/pdf') {
            var reader = new FileReader();
            reader.onload = function(e) {
                cardFiles.push({
                    id: generateId(),
                    nome: file.name,
                    descricao: '',
                    data: e.target.result
                });
                renderArquivosGrid();
            };
            reader.readAsDataURL(file);
        } else {
            alert('Apenas arquivos PDF são permitidos!');
        }
    });
    
    event.target.value = '';
}

function renderArquivosGrid() {
    var tbody = document.getElementById('arquivosBody');
    tbody.innerHTML = '';
    
    cardFiles.forEach(function(file, index) {
        tbody.innerHTML += 
            '<tr>' +
                '<td>' + file.nome + '</td>' +
                '<td><input type="text" value="' + (file.descricao || '') + '" onchange="updateFileDescricao(' + index + ', this.value)"></td>' +
                '<td>' +
                    '<button type="button" class="btn-download-file" onclick="downloadFile(' + index + ')" title="Baixar arquivo" style="background: #0079BF; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">' +
                        '<i class="fas fa-download"></i>' +
                    '</button>' +
                    '<button type="button" class="btn-remove-row" onclick="removeFile(' + index + ')" title="Remover arquivo">' +
                        '<i class="fas fa-trash"></i>' +
                    '</button>' +
                '</td>' +
            '</tr>';
    });
}

function updateFileDescricao(index, value) {
    cardFiles[index].descricao = value;
}

function removeFile(index) {
    cardFiles.splice(index, 1);
    renderArquivosGrid();
}

function downloadFile(index) {
    var file = cardFiles[index];
    if (!file || !file.data) {
        alert('Arquivo não disponível para download!');
        return;
    }
    
    // Criar elemento de link temporário para download
    var link = document.createElement('a');
    link.href = file.data;
    link.download = file.nome || 'arquivo.pdf';
    
    // Adicionar ao DOM, clicar e remover
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


// ==================== TAREFAS DO CARTÃO ====================
function renderTarefasGrid() {
    var tbody = document.getElementById('tarefasBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    cardTarefas.forEach(function(tarefa, index) {
        var usuariosOptions = '<option value="">Selecione</option>';
        data.users.forEach(function(u) {
            var selected = (tarefa.responsavel_id === u.id) ? 'selected' : '';
            usuariosOptions += '<option value="' + u.id + '" ' + selected + '>' + u.nome + '</option>';
        });

        var situacoes = ['Pendente', 'Andamento', 'Concluída'];
        var situacaoOptions = '<option value="">Selecione</option>';
        situacoes.forEach(function(s) {
            var selected = (tarefa.situacao === s) ? 'selected' : '';
            situacaoOptions += '<option value="' + s + '" ' + selected + '>' + s + '</option>';
        });

        var badgeClass = '';
        if (tarefa.situacao === 'Pendente') badgeClass = 'tarefa-pendente';
        if (tarefa.situacao === 'Andamento') badgeClass = 'tarefa-andamento';
        if (tarefa.situacao === 'Concluída') badgeClass = 'tarefa-concluida';

        tbody.innerHTML +=
            '<tr>' +
                '<td><input type="text" class="tarefa-input" value="' + (tarefa.titulo || '') + '" ' +
                    'placeholder="Título da tarefa" ' +
                    'onchange="updateTarefa(' + index + ',\'titulo\',this.value)"></td>' +
                '<td><input type="text" class="tarefa-input" value="' + (tarefa.descricao || '') + '" ' +
                    'placeholder="Descrição" ' +
                    'onchange="updateTarefa(' + index + ',\'descricao\',this.value)"></td>' +
                '<td><select class="tarefa-select" onchange="updateTarefa(' + index + ',\'responsavel_id\',this.value)">' +
                    usuariosOptions + '</select></td>' +
                '<td><input type="date" class="tarefa-input tarefa-date" value="' + (tarefa.prazo || '') + '" ' +
                    'onchange="updateTarefa(' + index + ',\'prazo\',this.value)"></td>' +
                '<td><select class="tarefa-select ' + badgeClass + '" ' +
                    'onchange="updateTarefaSituacao(' + index + ',this)">' +
                    situacaoOptions + '</select></td>' +
                '<td><input type="text" class="tarefa-input" value="' + (tarefa.acoes_realizadas || '') + '" ' +
                    'placeholder="Ações realizadas" ' +
                    'onchange="updateTarefa(' + index + ',\'acoes_realizadas\',this.value)"></td>' +
                '<td><button type="button" class="btn-remove-row" onclick="removeTarefa(' + index + ')" title="Remover">' +
                    '<i class="fas fa-trash"></i></button></td>' +
            '</tr>';
    });
}

function addTarefaRow() {
    cardTarefas.push({
        id: generateId(),
        titulo: '',
        descricao: '',
        responsavel_id: '',
        prazo: '',
        situacao: 'Pendente',
        acoes_realizadas: ''
    });
    renderTarefasGrid();
}

function removeTarefa(index) {
    cardTarefas.splice(index, 1);
    renderTarefasGrid();
}

function updateTarefa(index, field, value) {
    if (cardTarefas[index]) {
        cardTarefas[index][field] = value;
    }
}

function updateTarefaSituacao(index, selectEl) {
    if (cardTarefas[index]) {
        cardTarefas[index].situacao = selectEl.value;
        selectEl.className = 'tarefa-select';
        if (selectEl.value === 'Pendente') selectEl.classList.add('tarefa-pendente');
        if (selectEl.value === 'Andamento') selectEl.classList.add('tarefa-andamento');
        if (selectEl.value === 'Concluída') selectEl.classList.add('tarefa-concluida');
    }
}

// ==================== VIEW TAREFAS ====================
function renderTarefasView() {
    var container = document.getElementById('tarefasViewGrid');
    if (!container) return;

    var filtroSituacaoEl = document.getElementById('filtroSituacaoTarefa');
    var filtroSituacao = filtroSituacaoEl ? filtroSituacaoEl.value : '';
    
    var filtroResponsavelEl = document.getElementById('filtroResponsavelTarefa');
    var filtroResponsavel = filtroResponsavelEl ? filtroResponsavelEl.value : '';

    var minhasTarefas = [];
    var isAdmin = currentUser.perfil === 'Administrador';

    data.cards.forEach(function(card) {
        if (!card.tarefas || !Array.isArray(card.tarefas)) return;

        card.tarefas.forEach(function(tarefa, tarefaIndex) {
            if (!isAdmin && tarefa.responsavel_id !== currentUser.id) return;
            if (filtroResponsavel && tarefa.responsavel_id !== filtroResponsavel) return;
            if (filtroSituacao && tarefa.situacao !== filtroSituacao) return;

            var responsavel = data.users.find(function(u) { return u.id === tarefa.responsavel_id; });
            var cliente = data.clientes.find(function(c) { return c.id === card.cliente_id; });

            var prazoFormatado = '';
            if (tarefa.prazo) {
                var p = tarefa.prazo.split('-');
                if (p.length === 3) prazoFormatado = p[2] + '/' + p[1] + '/' + p[0];
            }

            var badgeClass = 'tarefa-badge';
            if (tarefa.situacao === 'Pendente') badgeClass += ' badge-pendente';
            if (tarefa.situacao === 'Andamento') badgeClass += ' badge-andamento';
            if (tarefa.situacao === 'Concluída') badgeClass += ' badge-concluida';

            minhasTarefas.push({
                tarefa: tarefa,
                tarefaIndex: tarefaIndex,
                card: card,
                nomeResponsavel: responsavel ? responsavel.nome : '',
                nomeCliente: cliente ? cliente.nome : '',
                prazoFormatado: prazoFormatado,
                badgeClass: badgeClass
            });
        });
    });

    if (minhasTarefas.length === 0) {
        var mensagem = isAdmin ? 
            'Nenhuma tarefa encontrada com os filtros selecionados.' : 
            'Nenhuma tarefa encontrada para <strong>' + currentUser.nome + '</strong>.';
        
        container.innerHTML =
            '<p class="empty-message" style="padding:30px; text-align:center;">' +
            '<i class="fas fa-check-circle" style="font-size:40px; color:var(--green); display:block; margin-bottom:10px;"></i>' +
            mensagem +
            '</p>';
        return;
    }

    var rowsHTML = '';
    minhasTarefas.forEach(function(item) {
        var t = item.tarefa;
        var cardId = item.card.id;
        var tarefaIndex = item.tarefaIndex;
        
        var situacaoOptions = '';
        ['Pendente', 'Andamento', 'Concluída'].forEach(function(s) {
            var selected = (t.situacao === s) ? 'selected' : '';
            situacaoOptions += '<option value="' + s + '" ' + selected + '>' + s + '</option>';
        });
        
        rowsHTML +=
            '<tr data-card-id="' + cardId + '" data-tarefa-index="' + tarefaIndex + '">' +
            '<td>' + (t.titulo || '-') + '</td>' +
            '<td>' + (t.descricao || '-') + '</td>' +
            '<td><span class="responsavel-tag"><i class="fas fa-user"></i> ' + item.nomeResponsavel + '</span></td>' +
            '<td>' + (item.prazoFormatado || '-') + '</td>' +
            '<td>' +
                '<select class="tarefa-situacao-edit" onchange="updateTarefaFromView(\'' + cardId + '\', ' + tarefaIndex + ', \'situacao\', this.value)">' +
                    situacaoOptions +
                '</select>' +
            '</td>' +
            '<td>' +
                '<input type="text" class="tarefa-acoes-edit" value="' + (t.acoes_realizadas || '') + '" ' +
                    'onblur="updateTarefaFromView(\'' + cardId + '\', ' + tarefaIndex + ', \'acoes_realizadas\', this.value)" ' +
                    'placeholder="Ações realizadas...">' +
            '</td>' +
            '<td class="cartao-link-cell">' +
                '<button type="button" class="btn-link-cartao" onclick="abrirCartaoDaTarefa(\'' + cardId + '\')" ' +
                    'title="Abrir cartão: ' + (item.card.titulo || '') + '">' +
                    '<i class="fas fa-external-link-alt"></i> ' +
                    '<span class="cartao-titulo-link">' + (item.card.titulo || 'Sem título') + '</span>' +
                '</button>' +
                '<div class="cartao-cliente-info">' + item.nomeCliente + '</div>' +
            '</td>' +
            '</tr>';
    });

    container.innerHTML =
        '<table class="tarefas-view-table">' +
        '<thead><tr>' +
            '<th>Título</th>' +
            '<th>Descrição</th>' +
            '<th>Responsável</th>' +
            '<th>Prazo</th>' +
            '<th>Situação</th>' +
            '<th>Ações Realizadas</th>' +
            '<th>Cartão</th>' +
        '</tr></thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
        '</table>';
}

async function updateTarefaFromView(cardId, tarefaIndex, field, value) {
    var card = data.cards.find(function(c) { return c.id === cardId; });
    if (card && card.tarefas && card.tarefas[tarefaIndex]) {
        card.tarefas[tarefaIndex][field] = value;
        
        try {
            await updateData('cards', cardId, { tarefas: card.tarefas });
        } catch (err) {
            console.error('Erro ao atualizar tarefa:', err);
        }
    }
}

function abrirCartaoDaTarefa(cardId) {
    var card = data.cards.find(function(c) { return c.id === cardId; });
    if (!card) {
        alert('Cartão não encontrado!');
        return;
    }
    
    if (!canViewCard(card)) {
        alert('Você não tem permissão para acessar este cartão!');
        return;
    }
    
    viewCard(cardId);
}

function loadFiltroResponsavelTarefas() {
    var select = document.getElementById('filtroResponsavelTarefa');
    if (!select) return;
    
    if (currentUser.perfil === 'Administrador') {
        select.style.display = '';
        var labelEl = document.querySelector('label[for="filtroResponsavelTarefa"]');
        if (labelEl) labelEl.style.display = '';
    } else {
        select.style.display = 'none';
        var labelResp = document.querySelector('label[for="filtroResponsavelTarefa"]');
        if (labelResp) labelResp.style.display = 'none';
    }
    
    select.innerHTML = '<option value="">Todos os Responsáveis</option>';
    data.users.forEach(function(u) {
        select.innerHTML += '<option value="' + u.id + '">' + u.nome + '</option>';
    });
}

// ==================== DRAG AND DROP ====================
function setupDragAndDrop() {
    document.querySelectorAll('.kanban-card').forEach(function(card) {
        card.addEventListener('dragstart', handleCardDragStart);
        card.addEventListener('dragend', handleCardDragEnd);
    });
    
    document.querySelectorAll('.list-cards').forEach(function(list) {
        list.addEventListener('dragover', handleDragOver);
        list.addEventListener('drop', handleCardDrop);
        list.addEventListener('dragleave', handleDragLeave);
    });
    
    document.querySelectorAll('.kanban-list').forEach(function(list) {
        list.addEventListener('dragstart', handleListDragStart);
        list.addEventListener('dragend', handleListDragEnd);
    });
    
    document.getElementById('kanbanBoard').addEventListener('dragover', handleBoardDragOver);
    document.getElementById('kanbanBoard').addEventListener('drop', handleListDrop);
}

var draggedCard = null;
var draggedList = null;

function handleCardDragStart(e) {
    draggedCard = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.getAttribute('data-card-id'));
    e.stopPropagation();
}

function handleCardDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedCard = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

async function handleCardDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (!draggedCard) return;
    
    var cardId = e.dataTransfer.getData('text/plain');
    var newListId = e.currentTarget.getAttribute('data-list-id');
    
    var card = data.cards.find(function(c) { return c.id === cardId; });
    if (card && canEditCard(card)) {
        try {
            await updateData('cards', cardId, { list_id: newListId });
            card.list_id = newListId;
            renderKanbanBoard();
        } catch (err) {
            console.error('Erro ao mover cartão:', err);
            alert('Erro ao mover cartão');
        }
    }
}

function handleListDragStart(e) {
    if (e.target.classList.contains('kanban-card')) return;
    draggedList = e.target.closest('.kanban-list');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedList.getAttribute('data-list-id'));
}

function handleListDragEnd(e) {
    draggedList = null;
}

function handleBoardDragOver(e) {
    if (!draggedList) return;
    e.preventDefault();
}

async function handleListDrop(e) {
    if (!draggedList) return;
    e.preventDefault();
    
    var board = document.getElementById('kanbanBoard');
    var lists = Array.from(board.querySelectorAll('.kanban-list'));
    var dropIndex = -1;
    
    for (var i = 0; i < lists.length; i++) {
        var rect = lists[i].getBoundingClientRect();
        if (e.clientX < rect.right) {
            dropIndex = i;
            break;
        }
    }
    
    if (dropIndex >= 0) {
        board.insertBefore(draggedList, lists[dropIndex]);
        
        var newOrder = Array.from(board.querySelectorAll('.kanban-list')).map(function(l, i) {
            return {
                id: l.getAttribute('data-list-id'),
                ordem: i
            };
        });
        
        for (var j = 0; j < newOrder.length; j++) {
            var item = newOrder[j];
            var list = data.lists.find(function(l) { return l.id === item.id; });
            if (list) {
                list.ordem = item.ordem;
                try {
                    await updateData('lists', item.id, { ordem: item.ordem });
                } catch (err) {
                    console.error('Erro ao atualizar ordem da lista:', err);
                }
            }
        }
    }
}

// ==================== DASHBOARD ====================


function showDashboardTab(tabName) {
    document.querySelectorAll('.dashboard-tab').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.dashboard-tab-content').forEach(function(c) { c.classList.remove('active'); });
    
    var clickedTab = document.querySelector('.dashboard-tab[onclick*="' + tabName + '"]');
    if (clickedTab) clickedTab.classList.add('active');
    
    if (tabName === 'oportunidades') {
        document.getElementById('dashboardOportunidades').classList.add('active');
        renderDashboardOportunidades();
    } else if (tabName === 'ativos') {
        document.getElementById('dashboardAtivos').classList.add('active');
        renderDashboardAtivos();
    } else if (tabName === 'clientes') {
        document.getElementById('dashboardClientes').classList.add('active');
        loadDashboardClientesFiltros();
    } else if (tabName === 'ia') {
        // NOVO: Aba de IA
        document.getElementById('dashboardIA').classList.add('active');
        if (window.AIInterface) {
            AIInterface.renderPainelIA();
        }
    }
}



function renderDashboard() {
    showDashboardTab('oportunidades');
}

function renderDashboardOportunidades() {
    Object.keys(chartInstances).forEach(function(key) {
        if (chartInstances[key]) {
            chartInstances[key].destroy();
        }
    });
    chartInstances = {};

    var cards = data.cards;
    
    if (cards.length === 0) {
        return;
    }

    // Chart 1: Por Etapa (Lista)
    var etapasData = {};
    cards.forEach(function(card) {
        var list = data.lists.find(function(l) { return l.id === card.list_id; });
        var etapaNome = list ? list.nome : 'Sem Etapa';
        etapasData[etapaNome] = (etapasData[etapaNome] || 0) + 1;
    });
    renderPieChart('chartEtapas', etapasData);

    // Chart 2: Por Tema
    var temasData = {};
    cards.forEach(function(card) {
        var tema = data.temas.find(function(t) { return t.id === card.tema_id; });
        var temaNome = tema ? tema.nome : 'Sem Tema';
        temasData[temaNome] = (temasData[temaNome] || 0) + 1;
    });
    renderPieChart('chartTemas', temasData);

    // Chart 3: Por Cliente
    var clientesData = {};
    cards.forEach(function(card) {
        var cliente = data.clientes.find(function(c) { return c.id === card.cliente_id; });
        var clienteNome = cliente ? cliente.nome : 'Sem Cliente';
        clientesData[clienteNome] = (clientesData[clienteNome] || 0) + 1;
    });
    renderBarChart('chartClientes', clientesData);

    // Chart 4: Por Ativo Tecnológico
    var ativosData = {};
    cards.forEach(function(card) {
        var ativo = data.ativos.find(function(a) { return a.id === card.ativo_id; });
        var ativoNome = ativo ? ativo.nome : 'Sem Ativo';
        ativosData[ativoNome] = (ativosData[ativoNome] || 0) + 1;
    });
    renderBarChart('chartAtivos', ativosData);

    // Chart 5: Por Projeto
    var projetosData = {};
    cards.forEach(function(card) {
        var projeto = data.projetos.find(function(p) { return p.id === card.projeto_id; });
        var projetoNome = projeto ? projeto.titulo : 'Sem Projeto';
        projetosData[projetoNome] = (projetosData[projetoNome] || 0) + 1;
    });
    renderPieChart('chartProjetos', projetosData);

    // Chart 6: Por Cultura
    var culturasData = {};
    cards.forEach(function(card) {
        var cultura = data.culturas.find(function(c) { return c.id === card.cultura_id; });
        var culturaNome = cultura ? cultura.nome : 'Sem Cultura';
        culturasData[culturaNome] = (culturasData[culturaNome] || 0) + 1;
    });
    renderPieChart('chartCulturas', culturasData);

    // Chart 7: Quantidade por Etapa
    renderBarChart('chartQtdEtapas', etapasData);

    // Chart 8: Por Região
    var regioesData = {};
    cards.forEach(function(card) {
        var regiao = data.regioes.find(function(r) { return r.id === card.regiao_id; });
        var regiaoNome = regiao ? regiao.nome : 'Sem Região';
        regioesData[regiaoNome] = (regioesData[regiaoNome] || 0) + 1;
    });
    renderPieChart('chartRegioes', regioesData);

    // Chart 9: Por Responsável
    var responsaveisData = {};
    cards.forEach(function(card) {
        var responsavel = data.users.find(function(u) { return u.id === card.responsavel_id; });
        var responsavelNome = responsavel ? responsavel.nome : 'Sem Responsável';
        responsaveisData[responsavelNome] = (responsaveisData[responsavelNome] || 0) + 1;
    });
    renderBarChart('chartResponsaveis', responsaveisData);

    // Chart 10: Perdas por Etapa
    var perdasData = {};
    cards.filter(function(c) { return c.situacao === 'Perdida'; }).forEach(function(card) {
        var list = data.lists.find(function(l) { return l.id === card.list_id; });
        var etapaNome = list ? list.nome : 'Sem Etapa';
        perdasData[etapaNome] = (perdasData[etapaNome] || 0) + 1;
    });
    if (Object.keys(perdasData).length > 0) {
        renderBarChart('chartPerdas', perdasData);
    }

    // Chart 11: Situação da Negociação
    var situacaoData = {};
    cards.forEach(function(card) {
        var situacao = card.situacao || 'Sem Situação';
        situacaoData[situacao] = (situacaoData[situacao] || 0) + 1;
    });
    renderPieChart('chartSituacao', situacaoData);

    // Chart 12: Qualificação
    var qualificacaoData = {};
    var qualLabels = {
        '1': 'Muito Frio',
        '2': 'Frio',
        '3': 'Morno',
        '4': 'Quente',
        '5': 'Quero Contratar'
    };
    cards.forEach(function(card) {
        var qual = card.qualificacao ? qualLabels[card.qualificacao] : 'Sem Qualificação';
        qualificacaoData[qual] = (qualificacaoData[qual] || 0) + 1;
    });
    renderPieChart('chartQualificacao', qualificacaoData);
}



function renderPieChart(canvasId, dataObj) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var labels = Object.keys(dataObj);
    var values = Object.values(dataObj);
    
    var colors = [
        '#0079BF', '#61BD4F', '#FF9F1A', '#EB5A46', '#C377E0',
        '#00C2E0', '#51E898', '#FF78CB', '#344563', '#B3BAC5'
    ];

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 10 },
                        padding: 10
                    }
                },
                // NOVO: Configuração para exibir rótulos de dados
                datalabels: {
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 11
                    },
                    formatter: function(value, context) {
                        var total = context.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                        var percentage = ((value / total) * 100).toFixed(1);
                        return value + ' (' + percentage + '%)';
                    },
                    display: function(context) {
                        return context.dataset.data[context.dataIndex] > 0;
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function renderBarChart(canvasId, dataObj) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var labels = Object.keys(dataObj);
    var values = Object.values(dataObj);

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantidade',
                data: values,
                backgroundColor: '#0079BF',
                borderColor: '#005A8F',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                // NOVO: Configuração para exibir rótulos de dados
                datalabels: {
                    color: '#172B4D',
                    anchor: 'end',
                    align: 'top',
                    font: {
                        weight: 'bold',
                        size: 11
                    },
                    formatter: function(value) {
                        return value;
                    },
                    display: function(context) {
                        return context.dataset.data[context.dataIndex] > 0;
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                },
                x: {
                    ticks: {
                        font: { size: 9 },
                        maxRotation: 45
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}



// ==================== DASHBOARD ATIVOS ====================
function renderDashboardAtivos() {
    loadFiltroAtivoRisco();
    renderTrlCrlBubbleChart();
}

function loadFiltroAtivoRisco() {
    var select = document.getElementById('filterAtivoRisco');
    if (!select) return;
    select.innerHTML = '<option value="">Selecione um Ativo</option>';
    
    data.ativos.forEach(function(a) {
        select.innerHTML += '<option value="' + a.id + '">' + a.nome + '</option>';
    });
}

function renderTrlCrlBubbleChart() {
    var canvas = document.getElementById('chartTrlCrlBubble');
    if (!canvas) return;
    
    if (chartInstances['chartTrlCrlBubble']) {
        chartInstances['chartTrlCrlBubble'].destroy();
    }
    
    var ctx = canvas.getContext('2d');
    
    // Filtrar ativos com TRL e CRL
    var ativosComDados = data.ativos.filter(function(a) {
        return a.trl && a.crl;
    });

    if (ativosComDados.length === 0) {
        ctx.font = '14px Arial';
        ctx.fillStyle = '#6B778C';
        ctx.textAlign = 'center';
        ctx.fillText('Nenhum ativo com TRL e CRL cadastrados', canvas.width / 2, canvas.height / 2);
        return;
    }

    // Agrupar ativos por quadrante (TRL x CRL)
    var quadrantes = {};
    ativosComDados.forEach(function(a) {
        var key = a.trl + '_' + a.crl;
        if (!quadrantes[key]) {
            quadrantes[key] = [];
        }
        quadrantes[key].push(a);
    });

    // Criar datasets com offset para evitar sobreposição
    var colors = ['#0079BF', '#61BD4F', '#FF9F1A', '#EB5A46', '#C377E0', '#00C2E0', '#51E898', '#FF78CB', '#344563', '#B3BAC5'];
    var bubbleData = [];
    var colorIndex = 0;

    Object.keys(quadrantes).forEach(function(key) {
        var ativos = quadrantes[key];
        var coords = key.split('_');
        var baseTrl = parseInt(coords[0]);
        var baseCrl = parseInt(coords[1]);
        
        // Calcular offsets para múltiplos ativos no mesmo quadrante
        var offsetPatterns = [
            { x: 0, y: 0 },
            { x: 0.25, y: 0.15 },
            { x: -0.25, y: 0.15 },
            { x: 0.25, y: -0.15 },
            { x: -0.25, y: -0.15 },
            { x: 0, y: 0.25 },
            { x: 0, y: -0.25 },
            { x: 0.35, y: 0 },
            { x: -0.35, y: 0 },
            { x: 0.2, y: 0.25 },
            { x: -0.2, y: 0.25 },
            { x: 0.2, y: -0.25 },
            { x: -0.2, y: -0.25 }
        ];
        
        ativos.forEach(function(ativo, idx) {
            var offset = offsetPatterns[idx % offsetPatterns.length];
            var color = colors[colorIndex % colors.length];
            
            bubbleData.push({
                label: ativo.nome,
                data: [{
                    x: baseTrl + offset.x,
                    y: baseCrl + offset.y,
                    r: 12
                }],
                backgroundColor: color + '99',
                borderColor: color,
                borderWidth: 2,
                // Dados extras para tooltip
                trlOriginal: baseTrl,
                crlOriginal: baseCrl
            });
            
            colorIndex++;
        });
    });

    // Criar linhas de grade para quadrantes

 var quadrantLines = {
    id: 'quadrantLines',
    beforeDraw: function(chart) {
        var ctx = chart.ctx;
        var xAxis = chart.scales.x;
        var yAxis = chart.scales.y;
        
        ctx.save();
        
        // Ponto central do gráfico (TRL=5.5, CRL=5.5)
        var centerX = xAxis.getPixelForValue(5.5);
        var centerY = yAxis.getPixelForValue(5.5);
        
        // Limites do gráfico
        var leftX = xAxis.getPixelForValue(0.5);
        var rightX = xAxis.getPixelForValue(10.5);
        var topY = yAxis.getPixelForValue(10.5);
        var bottomY = yAxis.getPixelForValue(0.5);
        
        // ============================================
        // QUADRANTE INFERIOR ESQUERDO - VERMELHO CLARO
        // (TRL baixo, CRL baixo) - Baixa maturidade tecnológica e comercial
        // ============================================
        ctx.fillStyle = 'rgba(255, 99, 71, 0.25)'; // Vermelho claro (tomato)
        ctx.fillRect(leftX, centerY, centerX - leftX, bottomY - centerY);
        
        // ============================================
        // QUADRANTE INFERIOR DIREITO - LARANJA CLARO
        // (TRL alto, CRL baixo) - Alta maturidade tecnológica, baixa comercial
        // ============================================
        ctx.fillStyle = 'rgba(255, 165, 0, 0.25)'; // Laranja claro
        ctx.fillRect(centerX, centerY, rightX - centerX, bottomY - centerY);
        
        // ============================================
        // QUADRANTE SUPERIOR ESQUERDO - VERDE CLARO
        // (TRL baixo, CRL alto) - Baixa maturidade tecnológica, alta comercial
        // ============================================
        ctx.fillStyle = 'rgba(144, 238, 144, 0.35)'; // Verde claro (lightgreen)
        ctx.fillRect(leftX, topY, centerX - leftX, centerY - topY);
        
        // ============================================
        // QUADRANTE SUPERIOR DIREITO - AZUL CLARO
        // (TRL alto, CRL alto) - Alta maturidade tecnológica e comercial
        // ============================================
        ctx.fillStyle = 'rgba(135, 206, 250, 0.35)'; // Azul claro (lightskyblue)
        ctx.fillRect(centerX, topY, rightX - centerX, centerY - topY);
        
        // ============================================
        // LINHAS DIVISÓRIAS DOS QUADRANTES
        // ============================================
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Linha tracejada
        
        // Linha vertical central (divide TRL)
        ctx.beginPath();
        ctx.moveTo(centerX, topY);
        ctx.lineTo(centerX, bottomY);
        ctx.stroke();
        
        // Linha horizontal central (divide CRL)
        ctx.beginPath();
        ctx.moveTo(leftX, centerY);
        ctx.lineTo(rightX, centerY);
        ctx.stroke();
        
        ctx.setLineDash([]); // Reset para linha sólida
        
        // ============================================
        // LINHAS DE GRADE (mais sutis)
        // ============================================
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 1;
        
        // Linhas verticais (TRL)
        for (var i = 1; i <= 10; i++) {
            if (i === 5 || i === 6) continue; // Pula linhas próximas ao centro
            var x = xAxis.getPixelForValue(i);
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.stroke();
        }
        
        // Linhas horizontais (CRL)
        for (var j = 1; j <= 10; j++) {
            if (j === 5 || j === 6) continue; // Pula linhas próximas ao centro
            var y = yAxis.getPixelForValue(j);
            ctx.beginPath();
            ctx.moveTo(leftX, y);
            ctx.lineTo(rightX, y);
            ctx.stroke();
        }
        
        // ============================================
        // RÓTULOS DOS QUADRANTES
        // ============================================
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        
        // Inferior Esquerdo - Vermelho
        ctx.fillStyle = 'rgba(180, 50, 50, 0.7)';
        ctx.fillText('Baixo TRL / Baixo CRL', (leftX + centerX) / 2, (centerY + bottomY) / 2);
        
        // Inferior Direito - Laranja
        ctx.fillStyle = 'rgba(180, 100, 0, 0.7)';
        ctx.fillText('Alto TRL / Baixo CRL', (centerX + rightX) / 2, (centerY + bottomY) / 2);
        
        // Superior Esquerdo - Verde
        ctx.fillStyle = 'rgba(50, 130, 50, 0.7)';
        ctx.fillText('Baixo TRL / Alto CRL', (leftX + centerX) / 2, (topY + centerY) / 2);
        
        // Superior Direito - Azul
        ctx.fillStyle = 'rgba(50, 100, 180, 0.7)';
        ctx.fillText('Alto TRL / Alto CRL', (centerX + rightX) / 2, (topY + centerY) / 2);
        
        ctx.restore();
    }
};



    chartInstances['chartTrlCrlBubble'] = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: bubbleData
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { 
                        font: { size: 9 },
                        boxWidth: 12,
                        padding: 8
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var dataset = context.dataset;
                            var trl = dataset.trlOriginal || Math.round(context.raw.x);
                            var crl = dataset.crlOriginal || Math.round(context.raw.y);
                            return dataset.label + ': TRL=' + trl + ', CRL=' + crl;
                        }
                    }
                }
            },



     scales: {
    x: {
        type: 'linear',
        position: 'bottom',
        title: { 
            display: true, 
            text: 'TRL (Technology Readiness Level)',
            font: { weight: 'bold', size: 12 },
            color: '#172B4D'
        },
        min: 0,
        max: 11,
        ticks: { 
            stepSize: 1,
            font: { size: 11, weight: 'bold' },
            color: '#172B4D',
            autoSkip: false,
            includeBounds: false,
            callback: function(value, index, ticks) {
                if (value >= 1 && value <= 10) {
                    return value;
                }
                return '';
            }
        },
        grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
        }
    },
    y: {
        type: 'linear',
        position: 'left',
        title: { 
            display: true, 
            text: 'CRL (Commercial Readiness Level)',
            font: { weight: 'bold', size: 12 },
            color: '#172B4D'
        },
        min: 0,
        max: 11,
        ticks: { 
            stepSize: 1,
            font: { size: 11, weight: 'bold' },
            color: '#172B4D',
            autoSkip: false,
            includeBounds: false,
            callback: function(value, index, ticks) {
                if (value >= 1 && value <= 10) {
                    return value;
                }
                return '';
            }
        },
        grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)'
        }
    }
}



        },
        plugins: [quadrantLines]
    });
}

function renderMatrizRiscos() {
    var ativoId = document.getElementById('filterAtivoRisco').value;
    var container = document.getElementById('matrizRiscosContainer');
    var legendaContainer = document.getElementById('legendaRiscos');
    
    if (!ativoId) {
        container.innerHTML = '<div id="heatmapRiscos" class="heatmap-container"></div>';
        legendaContainer.innerHTML = '';
        return;
    }
    
    var ativo = data.ativos.find(function(a) { return a.id === ativoId; });
    
    if (!ativo || !ativo.riscos || ativo.riscos.length === 0) {
        container.innerHTML = '<p class="empty-message" style="padding: 50px;">Nenhum risco cadastrado para este ativo</p>';
        legendaContainer.innerHTML = '';
        return;
    }

    var matriz = [
        [[], [], []],
        [[], [], []],
        [[], [], []]
    ];
    
    var probMap = { 'Baixa': 2, 'Media': 1, 'Alta': 0 };
    var impactMap = { 'Baixo': 0, 'Medio': 1, 'Alto': 2 };
    
    ativo.riscos.forEach(function(r) {
        var probIndex = probMap[r.probabilidade];
        var impactIndex = impactMap[r.impacto];
        if (probIndex !== undefined && impactIndex !== undefined) {
            matriz[probIndex][impactIndex].push(r);
        }
    });

    var cores = [
        ['#FFEB3B', '#FF9800', '#F44336'],
        ['#8BC34A', '#FFEB3B', '#FF9800'],
        ['#4CAF50', '#8BC34A', '#FFEB3B']
    ];

    var html = '<div class="heatmap-grid">';
    html += '<div class="heatmap-ylabel">Probabilidade</div>';
    html += '<div class="heatmap-main">';
    
    var probLabels = ['Alta', 'Média', 'Baixa'];
    var impactLabels = ['Baixo', 'Médio', 'Alto'];
    
    html += '<div class="heatmap-rows">';
    for (var i = 0; i < 3; i++) {
        html += '<div class="heatmap-row">';
        html += '<div class="heatmap-row-label">' + probLabels[i] + '</div>';
        for (var j = 0; j < 3; j++) {
            var riscos = matriz[i][j];
            var bgColor = cores[i][j];
            html += '<div class="heatmap-cell" style="background-color: ' + bgColor + ';">';
            if (riscos.length > 0) {
                riscos.forEach(function(r) {
                    html += '<div class="heatmap-risk-point" title="' + (r.id_risco || 'Risco') + ': ' + (r.descricao || '').substring(0, 100) + '">';
                    html += r.id_risco || '';
                    html += '</div>';
                });
            }
            html += '</div>';
        }
        html += '</div>';
    }
    html += '</div>';
    
    html += '<div class="heatmap-xlabel-row">';
    html += '<div class="heatmap-corner"></div>';
    impactLabels.forEach(function(label) {
        html += '<div class="heatmap-col-label">' + label + '</div>';
    });
    html += '</div>';
    html += '<div class="heatmap-xlabel">Impacto</div>';
    
    html += '</div></div>';
    
    container.innerHTML = html;

    legendaContainer.innerHTML = 
        '<strong>Legenda de Níveis de Risco:</strong><br>' +
        '<span class="legenda-item"><span class="legenda-color" style="background:#4CAF50;"></span> Muito Baixo</span>' +
        '<span class="legenda-item"><span class="legenda-color" style="background:#8BC34A;"></span> Baixo</span>' +
        '<span class="legenda-item"><span class="legenda-color" style="background:#FFEB3B;"></span> Médio</span>' +
        '<span class="legenda-item"><span class="legenda-color" style="background:#FF9800;"></span> Alto</span>' +
        '<span class="legenda-item"><span class="legenda-color" style="background:#F44336;"></span> Crítico</span>';
}

// ==================== DASHBOARD CLIENTES ====================
function loadDashboardClientesFiltros() {
    var contratoSelect = document.getElementById('filtroClienteContrato');
    if (contratoSelect) {
        contratoSelect.innerHTML = '<option value="">Todos</option>';
        data.contratos.forEach(function(c) {
            contratoSelect.innerHTML += '<option value="' + c.id + '">' + c.numero_saic + '</option>';
        });
    }
    
    var ativoSelect = document.getElementById('filtroClienteAtivo');
    if (ativoSelect) {
        ativoSelect.innerHTML = '<option value="">Todos</option>';
        data.ativos.forEach(function(a) {
            ativoSelect.innerHTML += '<option value="' + a.id + '">' + a.nome + '</option>';
        });
    }
    
    var culturaSelect = document.getElementById('filtroClienteCultura');
    if (culturaSelect) {
        culturaSelect.innerHTML = '<option value="">Todas</option>';
        data.culturas.forEach(function(c) {
            culturaSelect.innerHTML += '<option value="' + c.id + '">' + c.nome + '</option>';
        });
    }
    
    var nomeInput = document.getElementById('filtroClienteNome');
    if (nomeInput) nomeInput.value = '';
    
    var cidadeInput = document.getElementById('filtroClienteCidade');
    if (cidadeInput) cidadeInput.value = '';
    
    var estadoSelect = document.getElementById('filtroClienteEstado');
    if (estadoSelect) estadoSelect.value = '';
    
      
    filterClientesDashboard();
}

function initMapaBrasil() {
    var mapContainer = document.getElementById('mapaBrasil');
    if (!mapContainer) return;
    
    if (typeof L === 'undefined') {
        console.warn('Leaflet não está carregado. O mapa não será exibido.');
        mapContainer.innerHTML = '<p class="empty-message" style="padding: 50px;">Biblioteca de mapas não disponível no modo offline.</p>';
        return;
    }
    
    if (mapaBrasil) {
        try {
            mapaBrasil.remove();
        } catch(e) {
            console.warn('Erro ao remover mapa:', e);
        }
        mapaBrasil = null;
    }
    
    try {
        mapaBrasil = L.map('mapaBrasil').setView([-14.235, -51.9253], 4);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(mapaBrasil);
        
        markersLayer = L.layerGroup().addTo(mapaBrasil);
        
        atualizarMarcadoresMapa(data.clientes);
    } catch(e) {
        console.error('Erro ao inicializar mapa:', e);
        mapContainer.innerHTML = '<p class="empty-message" style="padding: 50px;">Erro ao carregar o mapa. Verifique sua conexão.</p>';
    }
}

async function atualizarMarcadoresMapa(clientes) {
    if (!mapaBrasil || !markersLayer) return;
    
    if (typeof L === 'undefined') return;
    
    markersLayer.clearLayers();
    
    for (var i = 0; i < clientes.length; i++) {
        var cliente = clientes[i];
        var cidade = cliente.cidade ? cliente.cidade.trim() : null;
        var estado = cliente.estado ? cliente.estado.toUpperCase().trim() : null;
        
        if (cidade && estado) {
            try {
                // Buscar coordenadas da cidade via Nominatim (OpenStreetMap)
                var response = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + 
                    encodeURIComponent(cidade + ', ' + estado + ', Brasil') + '&limit=1');
                var data = await response.json();
                
                if (data && data.length > 0) {
                    var lat = parseFloat(data[0].lat);
                    var lng = parseFloat(data[0].lon);
                    
                    var customIcon = L.divIcon({
                        className: 'custom-marker',
                        html: '<div style="background-color: #0079BF; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"><i class="fas fa-user" style="font-size: 10px;"></i></div>',
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    });
                    
                    var popupContent = '<strong>' + cliente.nome + '</strong><br>' +
                        '<small>' + cidade + '/' + estado + '</small><br>' +
                        (cliente.tipo ? '<small>Tipo: ' + cliente.tipo + '</small><br>' : '') +
                        (cliente.telefone ? '<small>Tel: ' + cliente.telefone + '</small>' : '');
                    
                    var marker = L.marker([lat, lng], { icon: customIcon })
                        .bindPopup(popupContent);
                    
                    markersLayer.addLayer(marker);
                }
            } catch (e) {
                console.warn('Erro ao buscar coordenadas para: ' + cidade + '/' + estado, e);
                // Fallback: usar coordenadas do estado
                if (coordenadasEstados[estado]) {
                    var coord = coordenadasEstados[estado];
                    var fallbackIcon = L.divIcon({
                        className: 'custom-marker',
                        html: '<div style="background-color: #FF9F1A; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 10px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"><i class="fas fa-user" style="font-size: 10px;"></i></div>',
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    });
                    
                    var fallbackPopup = '<strong>' + cliente.nome + '</strong><br>' +
                        '<small>' + (cidade || '') + '/' + estado + ' (aprox.)</small>';
                    
                    var fallbackMarker = L.marker([coord.lat, coord.lng], { icon: fallbackIcon })
                        .bindPopup(fallbackPopup);
                    
                    markersLayer.addLayer(fallbackMarker);
                }
            }
            
            // Pequeno delay para não sobrecarregar a API do Nominatim
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
}

async function filterClientesDashboard() {
    var filtroNomeEl = document.getElementById('filtroClienteNome');
    var filtroContratoEl = document.getElementById('filtroClienteContrato');
    var filtroAtivoEl = document.getElementById('filtroClienteAtivo');
    var filtroCulturaEl = document.getElementById('filtroClienteCultura');
    var filtroCidadeEl = document.getElementById('filtroClienteCidade');
    var filtroEstadoEl = document.getElementById('filtroClienteEstado');
    
    var filtroNome = filtroNomeEl ? filtroNomeEl.value.toLowerCase() : '';
    var filtroContrato = filtroContratoEl ? filtroContratoEl.value : '';
    var filtroAtivo = filtroAtivoEl ? filtroAtivoEl.value : '';
    var filtroCultura = filtroCulturaEl ? filtroCulturaEl.value : '';
    var filtroCidade = filtroCidadeEl ? filtroCidadeEl.value.toLowerCase() : '';
    var filtroEstado = filtroEstadoEl ? filtroEstadoEl.value : '';
    
    var clientesFiltrados = data.clientes.filter(function(cliente) {
        if (filtroNome && cliente.nome.toLowerCase().indexOf(filtroNome) === -1) {
            return false;
        }
        
        if (filtroCidade && (!cliente.cidade || cliente.cidade.toLowerCase().indexOf(filtroCidade) === -1)) {
            return false;
        }
        
        if (filtroEstado && (!cliente.estado || cliente.estado.toUpperCase() !== filtroEstado)) {
            return false;
        }
        
        if (filtroContrato) {
            var temContrato = data.contratos.some(function(c) {
                return c.id === filtroContrato && c.cliente_id === cliente.id;
            });
            if (!temContrato) return false;
        }
        
        if (filtroAtivo) {
            var temAtivo = data.cards.some(function(card) {
                return card.cliente_id === cliente.id && card.ativo_id === filtroAtivo;
            });
            var temAtivoCliente = cliente.ativos && cliente.ativos.some(function(a) {
                return a.ativo_id === filtroAtivo;
            });
            if (!temAtivo && !temAtivoCliente) return false;
        }
        
        if (filtroCultura) {
            var temCultura = data.cards.some(function(card) {
                return card.cliente_id === cliente.id && card.cultura_id === filtroCultura;
            });
            if (!temCultura) return false;
        }
        
        return true;
    });
    
        
    renderClientesDashboardGrid(clientesFiltrados);
}


function renderClientesDashboardGrid(clientes) {
    var container = document.getElementById('clientesResultGrid');
    if (!container) return;
    
    if (clientes.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum cliente encontrado com os filtros selecionados</p>';
        return;
    }
    
    var rowsHTML = '';
    clientes.forEach(function(c) {
        var contratos = data.contratos.filter(function(ct) { return ct.cliente_id === c.id; });
        var contratosStr = contratos.map(function(ct) { return ct.numero_saic; }).join(', ') || '-';
        
        var cartoes = data.cards.filter(function(card) { return card.cliente_id === c.id; });
        var qtdCartoes = cartoes.length;
        
        rowsHTML += '<tr>' +
            '<td>' + c.nome + '</td>' +
            '<td>' + (c.tipo || '-') + '</td>' +
            '<td>' + (c.email || '-') + '</td>' +
            '<td>' + (c.telefone || '-') + '</td>' +
            '<td>' + (c.cidade || '-') + '</td>' +
            '<td>' + (c.estado || '-') + '</td>' +
            '<td>' + contratosStr + '</td>' +
            '<td style="text-align: center;">' + qtdCartoes + '</td>' +
            '<td>' +
                '<button type="button" class="btn-historico-cliente" onclick="abrirHistoricoCliente(\'' + c.id + '\')" title="Consultar Histórico">' +
                    '<i class="fas fa-history"></i> Histórico' +
                '</button>' +
            '</td>' +
        '</tr>';
    });

    
    container.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Nome</th>' +
                '<th>Tipo</th>' +
                '<th>E-mail</th>' +
                '<th>Telefone</th>' +
                '<th>Cidade</th>' +
                '<th>Estado</th>' +
                '<th>Contratos</th>' +
                '<th>Cartões</th>' +
                '<th>Ações</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}


// ==================== HISTÓRICO DO CLIENTE NO DASHBOARD ====================
function abrirHistoricoCliente(clienteId) {
    var cliente = data.clientes.find(function(c) { return c.id === clienteId; });
    if (!cliente) {
        alert('Cliente não encontrado!');
        return;
    }
    
    // Buscar todos os cartões relacionados ao cliente
    var cartoes = data.cards.filter(function(card) { return card.cliente_id === clienteId; });
    
    // Criar conteúdo do modal
    var content = '<div class="historico-cliente-header">' +
        '<h3><i class="fas fa-user"></i> ' + cliente.nome + '</h3>' +
        '<p><strong>Tipo:</strong> ' + (cliente.tipo || '-') + ' | ' +
        '<strong>Cidade:</strong> ' + (cliente.cidade || '-') + '/' + (cliente.estado || '-') + ' | ' +
        '<strong>Telefone:</strong> ' + (cliente.telefone || '-') + '</p>' +
    '</div>';
    
    if (cartoes.length === 0) {
        content += '<p class="empty-message" style="padding: 30px; text-align: center;">' +
            '<i class="fas fa-inbox" style="font-size: 40px; color: var(--gray); display: block; margin-bottom: 10px;"></i>' +
            'Nenhum histórico de negociação encontrado para este cliente.' +
        '</p>';
    } else {
        content += '<div class="historico-cliente-stats">' +
            '<div class="stat-box"><span class="stat-number">' + cartoes.length + '</span><span class="stat-label">Total de Negociações</span></div>';
        
        // Contar por situação
        var novas = cartoes.filter(function(c) { return c.situacao === 'Nova'; }).length;
        var andamento = cartoes.filter(function(c) { return c.situacao === 'Em Andamento'; }).length;
        var contratadas = cartoes.filter(function(c) { return c.situacao === 'Contratada'; }).length;
        var perdidas = cartoes.filter(function(c) { return c.situacao === 'Perdida'; }).length;
        
        content += '<div class="stat-box stat-nova"><span class="stat-number">' + novas + '</span><span class="stat-label">Novas</span></div>' +
            '<div class="stat-box stat-andamento"><span class="stat-number">' + andamento + '</span><span class="stat-label">Em Andamento</span></div>' +
            '<div class="stat-box stat-contratada"><span class="stat-number">' + contratadas + '</span><span class="stat-label">Contratadas</span></div>' +
            '<div class="stat-box stat-perdida"><span class="stat-number">' + perdidas + '</span><span class="stat-label">Perdidas</span></div>' +
        '</div>';
        
        // Tabela de histórico
        content += '<div class="historico-cliente-grid"><table>' +
            '<thead><tr>' +
                '<th></th>' +
                '<th>Título</th>' +
                '<th>Etapa</th>' +
                '<th>Responsável</th>' +
                '<th>Data Contato</th>' +
                '<th>Tema</th>' +
                '<th>Cultura</th>' +
                '<th>Ativo</th>' +
                '<th>Situação</th>' +
                '<th>Valor</th>' +
            '</tr></thead><tbody>';
        
        cartoes.forEach(function(card) {
            var list = data.lists.find(function(l) { return l.id === card.list_id; });
            var responsavel = data.users.find(function(u) { return u.id === card.responsavel_id; });
            var tema = data.temas.find(function(t) { return t.id === card.tema_id; });
            var cultura = data.culturas.find(function(c) { return c.id === card.cultura_id; });
            var ativo = data.ativos.find(function(a) { return a.id === card.ativo_id; });
            var valorTotal = calculateCardTotal(card);
            
            var statusClass = '';
            if (card.situacao === 'Nova') statusClass = 'status-nova';
            else if (card.situacao === 'Em Andamento') statusClass = 'status-andamento';
            else if (card.situacao === 'Contratada') statusClass = 'status-contratada';
            else if (card.situacao === 'Perdida') statusClass = 'status-perdida';
            
            var dataFormatada = '-';
            if (card.data_contato) {
                var partes = card.data_contato.split('-');
                if (partes.length === 3) {
                    dataFormatada = partes[2] + '/' + partes[1] + '/' + partes[0];
                }
            }
            
            content += '<tr>' +
                '<td>' +
                    '<button type="button" class="btn-view-mini" onclick="viewCardFromHistoricoCliente(\'' + card.id + '\')" title="Visualizar Cartão">' +
                        '<i class="fas fa-eye"></i>' +
                    '</button>' +
                '</td>' +
                '<td><strong>' + (card.titulo || '-') + '</strong></td>' +
                '<td>' + (list ? list.nome : '-') + '</td>' +
                '<td>' + (responsavel ? responsavel.nome : '-') + '</td>' +
                '<td>' + dataFormatada + '</td>' +
                '<td>' + (tema ? tema.nome : '-') + '</td>' +
                '<td>' + (cultura ? cultura.nome : '-') + '</td>' +
                '<td>' + (ativo ? ativo.nome : '-') + '</td>' +
                '<td><span class="card-status ' + statusClass + '">' + (card.situacao || '-') + '</span></td>' +
                '<td style="text-align: right; font-weight: 600; color: var(--green);">R$ ' + formatCurrency(valorTotal) + '</td>' +
            '</tr>';
        });
        
        content += '</tbody></table></div>';
    }
    
    // Exibir no modal
    document.getElementById('historicoClienteContent').innerHTML = content;
    document.getElementById('historicoClienteModalTitle').textContent = 'Histórico do Cliente';
    openModal('historicoClienteModal');
}

function viewCardFromHistoricoCliente(cardId) {
    closeModal('historicoClienteModal');
    viewCard(cardId);
}



function exportDashboardToImage() {
    var dashboardEl = document.getElementById('dashboardContainer');
    
    html2canvas(dashboardEl).then(function(canvas) {
        var link = document.createElement('a');
        link.download = 'dashboard_crm_embrapa.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

// ==================== HISTORICO ====================
function loadHistoricoFilters() {
    var etapaSelect = document.getElementById('filterEtapa');
    etapaSelect.innerHTML = '<option value="">Todas as Etapas</option>';
    var etapasUnicas = [];
    data.lists.forEach(function(l) {
        if (etapasUnicas.indexOf(l.nome) === -1) {
            etapasUnicas.push(l.nome);
            etapaSelect.innerHTML += '<option value="' + l.id + '">' + l.nome + '</option>';
        }
    });
    
    var clienteSelect = document.getElementById('filterCliente');
    clienteSelect.innerHTML = '<option value="">Todos os Clientes</option>';
    data.clientes.forEach(function(c) {
        clienteSelect.innerHTML += '<option value="' + c.id + '">' + c.nome + '</option>';
    });
    
    var temaSelect = document.getElementById('filterTema');
    temaSelect.innerHTML = '<option value="">Todos os Temas</option>';
    data.temas.forEach(function(t) {
        temaSelect.innerHTML += '<option value="' + t.id + '">' + t.nome + '</option>';
    });
    
    var responsavelSelect = document.getElementById('filterResponsavel');
    responsavelSelect.innerHTML = '<option value="">Todos os Responsáveis</option>';
    data.users.forEach(function(u) {
        responsavelSelect.innerHTML += '<option value="' + u.id + '">' + u.nome + '</option>';
    });
    
    var culturaSelect = document.getElementById('filterCultura');
    culturaSelect.innerHTML = '<option value="">Todas as Culturas</option>';
    data.culturas.forEach(function(c) {
        culturaSelect.innerHTML += '<option value="' + c.id + '">' + c.nome + '</option>';
    });
    
    var projetoSelect = document.getElementById('filterProjeto');
    projetoSelect.innerHTML = '<option value="">Todos os Projetos</option>';
    data.projetos.forEach(function(p) {
        projetoSelect.innerHTML += '<option value="' + p.id + '">' + p.titulo + '</option>';
    });
    
    var ativoSelect = document.getElementById('filterAtivo');
    ativoSelect.innerHTML = '<option value="">Todos os Ativos</option>';
    data.ativos.forEach(function(a) {
        ativoSelect.innerHTML += '<option value="' + a.id + '">' + a.nome + '</option>';
    });
    
    var contratoSelect = document.getElementById('filterContrato');
    contratoSelect.innerHTML = '<option value="">Todos os Contratos</option>';
    data.contratos.forEach(function(c) {
        contratoSelect.innerHTML += '<option value="' + c.id + '">' + c.numero_saic + '</option>';
    });
}

function updateHistoricoFilters() {
    // Função vazia - usuário precisa clicar em Confirmar
}

function applyHistoricoFilters() {
    var filterEtapa = document.getElementById('filterEtapa').value;
    var filterCliente = document.getElementById('filterCliente').value;
    var filterTema = document.getElementById('filterTema').value;
    var filterResponsavel = document.getElementById('filterResponsavel').value;
    var filterCultura = document.getElementById('filterCultura').value;
    var filterProjeto = document.getElementById('filterProjeto').value;
    var filterAtivo = document.getElementById('filterAtivo').value;
    var filterContrato = document.getElementById('filterContrato').value;
    
    var cardsFiltrados = data.cards.filter(function(card) {
        if (filterEtapa && card.list_id !== filterEtapa) return false;
        if (filterCliente && card.cliente_id !== filterCliente) return false;
        if (filterTema && card.tema_id !== filterTema) return false;
        if (filterResponsavel && card.responsavel_id !== filterResponsavel) return false;
        if (filterCultura && card.cultura_id !== filterCultura) return false;
        if (filterProjeto && card.projeto_id !== filterProjeto) return false;
        if (filterAtivo && card.ativo_id !== filterAtivo) return false;
        if (filterContrato && card.contrato_id !== filterContrato) return false;
        return true;
    });
    
    renderHistoricoGrid(cardsFiltrados);
}

function renderHistoricoGrid(cards) {
    var container = document.getElementById('historicoGrid');
    
    if (cards.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum registro encontrado com os filtros selecionados</p>';
        return;
    }
    
    var rowsHTML = '';
    cards.forEach(function(card) {
        var list = data.lists.find(function(l) { return l.id === card.list_id; });
        var cliente = data.clientes.find(function(c) { return c.id === card.cliente_id; });
        var responsavel = data.users.find(function(u) { return u.id === card.responsavel_id; });
        var tema = data.temas.find(function(t) { return t.id === card.tema_id; });
        var cultura = data.culturas.find(function(c) { return c.id === card.cultura_id; });
        var projeto = data.projetos.find(function(p) { return p.id === card.projeto_id; });
        var ativo = data.ativos.find(function(a) { return a.id === card.ativo_id; });
        var contrato = data.contratos.find(function(c) { return c.id === card.contrato_id; });
        var valorTotal = calculateCardTotal(card);
        
        rowsHTML += '<tr>' +
            '<td>' +
                '<button type="button" class="btn-edit" onclick="viewCard(\'' + card.id + '\')" title="Visualizar">' +
                    '<i class="fas fa-eye"></i>' +
                '</button>' +
            '</td>' +
            '<td>' + (card.titulo || '-') + '</td>' +
            '<td>' + (list ? list.nome : '-') + '</td>' +
            '<td>' + (cliente ? cliente.nome : '-') + '</td>' +
            '<td>' + (responsavel ? responsavel.nome : '-') + '</td>' +
            '<td>' + (card.data_contato || '-') + '</td>' +
            '<td>' + (tema ? tema.nome : '-') + '</td>' +
            '<td>' + (cultura ? cultura.nome : '-') + '</td>' +
            '<td>' + (projeto ? projeto.titulo : '-') + '</td>' +
            '<td>' + (ativo ? ativo.nome : '-') + '</td>' +
            '<td>' + (contrato ? contrato.numero_saic : '-') + '</td>' +
            '<td>' + (card.situacao || '-') + '</td>' +
            '<td>R$ ' + formatCurrency(valorTotal) + '</td>' +
        '</tr>';
    });
    
    container.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th style="width: 40px;"></th>' +
                '<th>Título</th>' +
                '<th>Etapa</th>' +
                '<th>Cliente</th>' +
                '<th>Responsável</th>' +
                '<th>Data Contato</th>' +
                '<th>Tema</th>' +
                '<th>Cultura</th>' +
                '<th>Projeto</th>' +
                '<th>Ativo</th>' +
                '<th>Contrato</th>' +
                '<th>Situação</th>' +
                '<th>Valor</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}

function clearFilters() {
    document.getElementById('filterEtapa').value = '';
    document.getElementById('filterCliente').value = '';
    document.getElementById('filterTema').value = '';
    document.getElementById('filterResponsavel').value = '';
    document.getElementById('filterCultura').value = '';
    document.getElementById('filterProjeto').value = '';
    document.getElementById('filterAtivo').value = '';
    document.getElementById('filterContrato').value = '';
    
    document.getElementById('historicoGrid').innerHTML = '<p class="empty-message">Selecione os filtros e clique em "Confirmar" para visualizar os dados</p>';
}

// ==================== CADASTROS ====================
function openCadastro(tipo) {
    showView('cadastro');
    
    switch(tipo) {
        case 'cliente':
            document.getElementById('cadastroTitle').textContent = 'Cadastro de Cliente/Parceiro';
            renderClienteGrid();
            break;
        case 'usuario':
            document.getElementById('cadastroTitle').textContent = 'Cadastro de Usuário';
            renderUsuarioGrid();
            break;
        case 'regiao':
            document.getElementById('cadastroTitle').textContent = 'Cadastro de Região';
            renderRegiaoGrid();
            break;
        case 'ativo':
            document.getElementById('cadastroTitle').textContent = 'Cadastro de Ativo Tecnológico';
            renderAtivoGrid();
            break;
        case 'cultura':
            document.getElementById('cadastroTitle').textContent = 'Cadastro de Cultura Agrícola';
            renderCulturaGrid();
            break;
        case 'tema':
            document.getElementById('cadastroTitle').textContent = 'Cadastro de Tema';
            renderTemaGrid();
            break;
        case 'projeto':
            document.getElementById('cadastroTitle').textContent = 'Cadastro de Projeto';
            renderProjetoGrid();
            break;
        case 'contrato':
            document.getElementById('cadastroTitle').textContent = 'Cadastro de Contratos / Convênios';
            renderContratoGrid();
            break;
    }
}

// ==================== CLIENTE ====================
function renderClienteGrid() {
    var container = document.getElementById('cadastroForm');
    container.innerHTML = '<button type="button" onclick="openClienteModal()" class="btn-submit btn-orange" style="margin-bottom: 15px;">' +
        '<i class="fas fa-plus"></i> Novo Cliente/Parceiro' +
    '</button>';
    
    var grid = document.getElementById('cadastroGrid');
    if (data.clientes.length === 0) {
        grid.innerHTML = '<p class="empty-message">Nenhum cliente cadastrado</p>';
        return;
    }
    
    var rowsHTML = '';
    data.clientes.forEach(function(c) {
        rowsHTML += '<tr>' +
            '<td>' + c.nome + '</td>' +
            '<td>' + (c.tipo || '') + '</td>' +
            '<td>' + (c.email || '') + '</td>' +
            '<td>' + (c.telefone || '') + '</td>' +
            '<td>' + (c.cidade || '') + '</td>' +
            '<td>' + (c.estado || '') + '</td>' +
            '<td>' +
                '<button type="button" class="btn-edit" onclick="openClienteModal(\'' + c.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button type="button" class="btn-delete" onclick="deleteCliente(\'' + c.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</td>' +
        '</tr>';
    });
    
    grid.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Nome</th>' +
                '<th>Tipo</th>' +
                '<th>E-mail</th>' +
                '<th>Telefone</th>' +
                '<th>Cidade</th>' +
                '<th>Estado</th>' +
                '<th>Ações</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}

function openClienteModal(id) {
    editingId = null;
    clienteAtivos = [];
    clienteContatos = [];
    document.getElementById('clienteForm').reset();
    document.getElementById('clienteAtivosBody').innerHTML = '';
    document.getElementById('clienteContatosBody').innerHTML = '';
    document.getElementById('clienteHistoricoGrid').innerHTML = '';
    
    if (id) {
        var cliente = data.clientes.find(function(c) { return c.id === id; });
        editingId = id;
        document.getElementById('clienteNome').value = cliente.nome || '';
        document.getElementById('clienteTipo').value = cliente.tipo || '';
        document.getElementById('clienteEndereco').value = cliente.endereco || '';
        document.getElementById('clienteEmail').value = cliente.email || '';
        document.getElementById('clienteTelefone').value = cliente.telefone || '';
        document.getElementById('clienteRedes').value = cliente.redes_sociais || '';
        document.getElementById('clienteCidade').value = cliente.cidade || '';
        document.getElementById('clienteEstado').value = cliente.estado || '';
        document.getElementById('clienteAtividades').value = cliente.atividades || '';
        
        if (cliente.ativos && Array.isArray(cliente.ativos)) {
            clienteAtivos = cliente.ativos.slice();
            renderClienteAtivosGrid();
        }
        

        if (cliente.contatos && Array.isArray(cliente.contatos)) {
            clienteContatos = cliente.contatos.slice();
            renderClienteContatosGrid();
        }

        renderClienteHistorico(id);
        
        document.getElementById('clienteModalTitle').textContent = 'Editar Cliente/Parceiro';
    } else {
        document.getElementById('clienteModalTitle').textContent = 'Novo Cliente/Parceiro';
    }
    
    openModal('clienteModal');
}

function renderClienteHistorico(clienteId) {
    var cards = data.cards.filter(function(c) { return c.cliente_id === clienteId; });
    var container = document.getElementById('clienteHistoricoGrid');
    
    if (cards.length === 0) {
        container.innerHTML = '<p style="color: #6B778C; font-size: 12px;">Nenhum histórico encontrado</p>';
        return;
    }
    
    var rowsHTML = '';
    cards.forEach(function(card) {
        var list = data.lists.find(function(l) { return l.id === card.list_id; });
        var responsavel = data.users.find(function(u) { return u.id === card.responsavel_id; });
        var tema = data.temas.find(function(t) { return t.id === card.tema_id; });
        var cultura = data.culturas.find(function(c) { return c.id === card.cultura_id; });
        var ativo = data.ativos.find(function(a) { return a.id === card.ativo_id; });
        
        var trl = ativo ? (ativo.trl || '-') : '-';
        var crl = ativo ? (ativo.crl || '-') : '-';
        
        rowsHTML += '<tr>' +
            '<td>' +
                '<button type="button" class="btn-view-historico" data-card-id="' + card.id + '" title="Visualizar Cartão" style="background: none; border: none; color: #0079BF; cursor: pointer;">' +
                    '<i class="fas fa-external-link-alt"></i>' +
                '</button>' +
            '</td>' +            '<td>' + (card.titulo || '-') + '</td>' +
            '<td>' + (list ? list.nome : '-') + '</td>' +
            '<td>' + (responsavel ? responsavel.nome : '-') + '</td>' +
            '<td>' + (card.data_contato || '-') + '</td>' +
            '<td>' + (cultura ? cultura.nome : '-') + '</td>' +
            '<td>' + (tema ? tema.nome : '-') + '</td>' +
            '<td>' + trl + '</td>' +
            '<td>' + crl + '</td>' +
        '</tr>';
    });
    
    container.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th style="width: 30px;"></th>' +
                '<th>Título</th>' +
                '<th>Etapa</th>' +
                '<th>Responsável</th>' +
                '<th>Data Contato</th>' +
                '<th>Cultura Agrícola</th>' +
                '<th>Tema</th>' +
                '<th>TRL</th>' +
                '<th>CRL</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';

    container.addEventListener('click', function(e) {
        var button = e.target.closest('.btn-view-historico');
        if (button) {
            e.preventDefault();
            var cardId = button.getAttribute('data-card-id');
            viewCardFromHistorico(cardId);
        }
    });
}

function viewCardFromHistorico(cardId) {
    closeModal('clienteModal');
    viewCard(cardId);
}

function addClienteAtivoRow() {
    clienteAtivos.push({ id: generateId(), ativo_id: '', uso: '' });
    renderClienteAtivosGrid();
}

function renderClienteAtivosGrid() {
    var tbody = document.getElementById('clienteAtivosBody');
    tbody.innerHTML = '';
    
    var ativosOptions = '<option value="">Selecione</option>';
    data.ativos.forEach(function(a) {
        ativosOptions += '<option value="' + a.id + '">' + a.nome + '</option>';
    });
    
    clienteAtivos.forEach(function(item, index) {
        var selectedOption = ativosOptions.replace('value="' + item.ativo_id + '"', 'value="' + item.ativo_id + '" selected');
        tbody.innerHTML += '<tr>' +
            '<td><select onchange="updateClienteAtivo(' + index + ', \'ativo_id\', this.value)">' + selectedOption + '</select></td>' +
            '<td><input type="text" value="' + (item.uso || '') + '" onchange="updateClienteAtivo(' + index + ', \'uso\', this.value)"></td>' +
            '<td><button type="button" class="btn-remove-row" onclick="removeClienteAtivo(' + index + ')"><i class="fas fa-trash"></i></button></td>' +
        '</tr>';
    });
}

function updateClienteAtivo(index, field, value) {
    clienteAtivos[index][field] = value;
}

function removeClienteAtivo(index) {
    clienteAtivos.splice(index, 1);
    renderClienteAtivosGrid();
}

async function saveCliente(e) {
    e.preventDefault();
    
    var clienteData = {
        id: editingId || generateId(),
        nome: document.getElementById('clienteNome').value,
        tipo: document.getElementById('clienteTipo').value,
        endereco: document.getElementById('clienteEndereco').value,
        email: document.getElementById('clienteEmail').value,
        telefone: document.getElementById('clienteTelefone').value,
        redes_sociais: document.getElementById('clienteRedes').value,
        cidade: document.getElementById('clienteCidade').value,
        estado: document.getElementById('clienteEstado').value,
        atividades: document.getElementById('clienteAtividades').value,
        ativos: clienteAtivos,
        contatos: clienteContatos  // ADICIONAR ESTA LINHA
    };
    
    try {
        showLoadingIndicator('Salvando cliente...');
        
        if (editingId) {
            await updateData('clientes', editingId, clienteData);
            var index = data.clientes.findIndex(function(c) { return c.id === editingId; });
            data.clientes[index] = clienteData;
        } else {
            await insertData('clientes', clienteData);
            data.clientes.push(clienteData);
        }
        
        hideLoadingIndicator();
        closeModal('clienteModal');
        renderClienteGrid();
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar cliente: ' + err.message);
    }
}

async function deleteCliente(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        try {
            showLoadingIndicator('Excluindo cliente...');
            await deleteData('clientes', id);
            data.clientes = data.clientes.filter(function(c) { return c.id !== id; });
            hideLoadingIndicator();
            renderClienteGrid();
        } catch (err) {
            hideLoadingIndicator();
            alert('Erro ao excluir cliente: ' + err.message);
        }
    }
}

// ==================== CONTATOS DO CLIENTE ====================
function addClienteContatoRow() {
    clienteContatos.push({
        id: generateId(),
        nome: '',
        cargo: '',
        email: '',
        telefone: ''
    });
    renderClienteContatosGrid();
}

function renderClienteContatosGrid() {
    var tbody = document.getElementById('clienteContatosBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    clienteContatos.forEach(function(contato, index) {
        tbody.innerHTML += 
            '<tr>' +
                '<td><input type="text" value="' + (contato.nome || '') + '" ' +
                    'placeholder="Nome do contato" ' +
                    'onchange="updateClienteContato(' + index + ', \'nome\', this.value)" style="width: 100%;"></td>' +
                '<td><input type="text" value="' + (contato.cargo || '') + '" ' +
                    'placeholder="Ex: Gerente, Coordenador" ' +
                    'onchange="updateClienteContato(' + index + ', \'cargo\', this.value)" style="width: 100%;"></td>' +
                '<td><input type="email" value="' + (contato.email || '') + '" ' +
                    'placeholder="E-mail" ' +
                    'onchange="updateClienteContato(' + index + ', \'email\', this.value)" style="width: 100%;"></td>' +
                '<td><input type="tel" value="' + (contato.telefone || '') + '" ' +
                    'placeholder="(XX) 9XXXX-XXXX" ' +
                    'onchange="updateClienteContato(' + index + ', \'telefone\', this.value)" style="width: 100%;"></td>' +
                '<td><button type="button" class="btn-remove-row" onclick="removeClienteContato(' + index + ')" title="Remover contato">' +
                    '<i class="fas fa-trash"></i></button></td>' +
            '</tr>';
    });
}

function updateClienteContato(index, field, value) {
    if (clienteContatos[index]) {
        clienteContatos[index][field] = value;
    }
}

function removeClienteContato(index) {
    clienteContatos.splice(index, 1);
    renderClienteContatosGrid();
}


// ==================== USUARIO ====================
function renderUsuarioGrid() {
    var container = document.getElementById('cadastroForm');
    container.innerHTML = '<button type="button" onclick="openUsuarioModal()" class="btn-submit btn-green" style="margin-bottom: 15px;">' +
        '<i class="fas fa-plus"></i> Novo Usuário' +
    '</button>';
    
    var grid = document.getElementById('cadastroGrid');
    if (data.users.length === 0) {
        grid.innerHTML = '<p class="empty-message">Nenhum usuário cadastrado</p>';
        return;
    }
    
    var rowsHTML = '';
    data.users.forEach(function(u) {
        rowsHTML += '<tr>' +
            '<td>' + u.nome + '</td>' +
            '<td>' + u.login + '</td>' +
            '<td>' + (u.cargo || '') + '</td>' +
            '<td>' + (u.perfil || '') + '</td>' +
            '<td>' + (u.telefone || '') + '</td>' +
            '<td>' + (u.email || '') + '</td>' +
            '<td>' +
                '<button type="button" class="btn-edit" onclick="openUsuarioModal(\'' + u.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button type="button" class="btn-delete" onclick="deleteUsuario(\'' + u.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</td>' +
        '</tr>';
    });
    
    grid.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Nome</th>' +
                '<th>Login</th>' +
                '<th>Cargo</th>' +
                '<th>Perfil</th>' +
                '<th>Telefone</th>' +
                '<th>E-mail</th>' +
                '<th>Ações</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}

function openUsuarioModal(id) {
    editingId = null;
    document.getElementById('usuarioForm').reset();
    
    if (id) {
        var usuario = data.users.find(function(u) { return u.id === id; });
        editingId = id;
        document.getElementById('usuarioNome').value = usuario.nome || '';
        document.getElementById('usuarioLogin').value = usuario.login || '';
        document.getElementById('usuarioSenha').value = usuario.senha || '';
        document.getElementById('usuarioCargo').value = usuario.cargo || '';
        document.getElementById('usuarioPerfil').value = usuario.perfil || '';
        document.getElementById('usuarioTelefone').value = usuario.telefone || '';
        document.getElementById('usuarioEmail').value = usuario.email || '';
        document.getElementById('usuarioModalTitle').textContent = 'Editar Usuário';
    } else {
        document.getElementById('usuarioModalTitle').textContent = 'Novo Usuário';
    }
    
    openModal('usuarioModal');
}

async function saveUsuario(e) {
    e.preventDefault();
    
    var usuarioData = {
        id: editingId || generateId(),
        nome: document.getElementById('usuarioNome').value,
        login: document.getElementById('usuarioLogin').value,
        senha: document.getElementById('usuarioSenha').value,
        cargo: document.getElementById('usuarioCargo').value,
        perfil: document.getElementById('usuarioPerfil').value,
        telefone: document.getElementById('usuarioTelefone').value,
        email: document.getElementById('usuarioEmail').value
    };
    
    try {
        showLoadingIndicator('Salvando usuário...');
        
        if (editingId) {
            await updateData('users', editingId, usuarioData);
            var index = data.users.findIndex(function(u) { return u.id === editingId; });
            data.users[index] = usuarioData;
        } else {
            await insertData('users', usuarioData);
            data.users.push(usuarioData);
        }
        
        hideLoadingIndicator();
        closeModal('usuarioModal');
        renderUsuarioGrid();
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar usuário: ' + err.message);
    }
}

async function deleteUsuario(id) {
    if (data.users.length <= 1) {
        alert('Não é possível excluir o único usuário do sistema!');
        return;
    }
    
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        try {
            showLoadingIndicator('Excluindo usuário...');
            await deleteData('users', id);
            data.users = data.users.filter(function(u) { return u.id !== id; });
            hideLoadingIndicator();
            renderUsuarioGrid();
        } catch (err) {
            hideLoadingIndicator();
            alert('Erro ao excluir usuário: ' + err.message);
        }
    }
}

// ==================== REGIAO ====================
function renderRegiaoGrid() {
    var container = document.getElementById('cadastroForm');
    container.innerHTML = '<button type="button" onclick="openRegiaoModal()" class="btn-submit btn-blue" style="margin-bottom: 15px;">' +
        '<i class="fas fa-plus"></i> Nova Região' +
    '</button>';
    
    var grid = document.getElementById('cadastroGrid');
    if (data.regioes.length === 0) {
        grid.innerHTML = '<p class="empty-message">Nenhuma região cadastrada</p>';
        return;
    }
    
    var rowsHTML = '';
    data.regioes.forEach(function(r) {
        rowsHTML += '<tr>' +
            '<td>' + r.nome + '</td>' +
            '<td>' + (r.estado || '') + '</td>' +
            '<td>' +
                '<button type="button" class="btn-edit" onclick="openRegiaoModal(\'' + r.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button type="button" class="btn-delete" onclick="deleteRegiao(\'' + r.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</td>' +
        '</tr>';
    });
    
    grid.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Nome da Região</th>' +
                '<th>Estado</th>' +
                '<th>Ações</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}

function openRegiaoModal(id) {
    editingId = null;
    document.getElementById('regiaoForm').reset();
    
    if (id) {
        var regiao = data.regioes.find(function(r) { return r.id === id; });
        editingId = id;
        document.getElementById('regiaoNome').value = regiao.nome || '';
        document.getElementById('regiaoEstado').value = regiao.estado || '';
        document.getElementById('regiaoModalTitle').textContent = 'Editar Região';
    } else {
        document.getElementById('regiaoModalTitle').textContent = 'Nova Região';
    }
    
    openModal('regiaoModal');
}

async function saveRegiao(e) {
    e.preventDefault();
    
    var regiaoData = {
        id: editingId || generateId(),
        nome: document.getElementById('regiaoNome').value,
        estado: document.getElementById('regiaoEstado').value
    };
    
    try {
        showLoadingIndicator('Salvando região...');
        
        if (editingId) {
            await updateData('regioes', editingId, regiaoData);
            var index = data.regioes.findIndex(function(r) { return r.id === editingId; });
            data.regioes[index] = regiaoData;
        } else {
            await insertData('regioes', regiaoData);
            data.regioes.push(regiaoData);
        }
        
        hideLoadingIndicator();
        closeModal('regiaoModal');
        renderRegiaoGrid();
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar região: ' + err.message);
    }
}

async function deleteRegiao(id) {
    if (confirm('Tem certeza que deseja excluir esta região?')) {
        try {
            showLoadingIndicator('Excluindo região...');
            await deleteData('regioes', id);
            data.regioes = data.regioes.filter(function(r) { return r.id !== id; });
            hideLoadingIndicator();
            renderRegiaoGrid();
        } catch (err) {
            hideLoadingIndicator();
            alert('Erro ao excluir região: ' + err.message);
        }
    }
}

// ==================== CULTURA AGRICOLA ====================
function renderCulturaGrid() {
    var container = document.getElementById('cadastroForm');
    container.innerHTML = '<button type="button" onclick="openCulturaModal()" class="btn-submit btn-green" style="margin-bottom: 15px;">' +
        '<i class="fas fa-plus"></i> Nova Cultura Agrícola' +
    '</button>';
    
    var grid = document.getElementById('cadastroGrid');
    if (data.culturas.length === 0) {
        grid.innerHTML = '<p class="empty-message">Nenhuma cultura cadastrada</p>';
        return;
    }
    
    var rowsHTML = '';
    data.culturas.forEach(function(c) {
        var numEspecialistas = c.especialistas ? c.especialistas.length : 0;
        rowsHTML += '<tr>' +
            '<td>' + c.nome + '</td>' +
            '<td>' + numEspecialistas + ' especialista(s)</td>' +
            '<td>' +
                '<button type="button" class="btn-edit" onclick="openCulturaModal(\'' + c.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button type="button" class="btn-delete" onclick="deleteCultura(\'' + c.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</td>' +
        '</tr>';
    });
    
    grid.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Nome da Cultura</th>' +
                '<th>Especialistas</th>' +
                '<th>Ações</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}

function openCulturaModal(id) {
    editingId = null;
    culturaEspecialistas = [];
    document.getElementById('culturaForm').reset();
    document.getElementById('culturaEspecialistasBody').innerHTML = '';
    
    if (id) {
        var cultura = data.culturas.find(function(c) { return c.id === id; });
        editingId = id;
        document.getElementById('culturaNome').value = cultura.nome || '';
        
        if (cultura.especialistas && Array.isArray(cultura.especialistas)) {
            culturaEspecialistas = cultura.especialistas.slice();
            renderCulturaEspecialistasGrid();
        }
        
        document.getElementById('culturaModalTitle').textContent = 'Editar Cultura Agrícola';
    } else {
        document.getElementById('culturaModalTitle').textContent = 'Nova Cultura Agrícola';
    }
    
    openModal('culturaModal');
}

function addCulturaEspecialistaRow() {
    culturaEspecialistas.push({ id: generateId(), usuario_id: '', formacao: '', contato: '' });
    renderCulturaEspecialistasGrid();
}

function renderCulturaEspecialistasGrid() {
    var tbody = document.getElementById('culturaEspecialistasBody');
    tbody.innerHTML = '';
    
    // Criar options de usuários para o select
    var usuariosOptions = '<option value="">Selecione um especialista</option>';
    data.users.forEach(function(u) {
        usuariosOptions += '<option value="' + u.id + '">' + u.nome + '</option>';
    });
    
    culturaEspecialistas.forEach(function(item, index) {
        var selectedOption = usuariosOptions;
        if (item.usuario_id) {
            selectedOption = usuariosOptions.replace('value="' + item.usuario_id + '"', 'value="' + item.usuario_id + '" selected');
        }
        
        tbody.innerHTML += '<tr>' +
            '<td><select onchange="updateCulturaEspecialista(' + index + ', \'usuario_id\', this.value)">' + selectedOption + '</select></td>' +
            '<td><input type="text" value="' + (item.formacao || '') + '" onchange="updateCulturaEspecialista(' + index + ', \'formacao\', this.value)"></td>' +
            '<td><input type="text" value="' + (item.contato || '') + '" onchange="updateCulturaEspecialista(' + index + ', \'contato\', this.value)"></td>' +
            '<td><button type="button" class="btn-remove-row" onclick="removeCulturaEspecialista(' + index + ')"><i class="fas fa-trash"></i></button></td>' +
        '</tr>';
    });
}

function updateCulturaEspecialista(index, field, value) {
    culturaEspecialistas[index][field] = value;
}

function removeCulturaEspecialista(index) {
    culturaEspecialistas.splice(index, 1);
    renderCulturaEspecialistasGrid();
}

async function saveCultura(e) {
    e.preventDefault();
    
    var culturaData = {
        id: editingId || generateId(),
        nome: document.getElementById('culturaNome').value,
        especialistas: culturaEspecialistas
    };
    
    try {
        showLoadingIndicator('Salvando cultura...');
        
        if (editingId) {
            await updateData('culturas', editingId, culturaData);
            var index = data.culturas.findIndex(function(c) { return c.id === editingId; });
            data.culturas[index] = culturaData;
        } else {
            await insertData('culturas', culturaData);
            data.culturas.push(culturaData);
        }
        
        hideLoadingIndicator();
        closeModal('culturaModal');
        renderCulturaGrid();
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar cultura: ' + err.message);
    }
}

async function deleteCultura(id) {
    if (confirm('Tem certeza que deseja excluir esta cultura?')) {
        try {
            showLoadingIndicator('Excluindo cultura...');
            await deleteData('culturas', id);
            data.culturas = data.culturas.filter(function(c) { return c.id !== id; });
            hideLoadingIndicator();
            renderCulturaGrid();
        } catch (err) {
            hideLoadingIndicator();
            alert('Erro ao excluir cultura: ' + err.message);
        }
    }
}

// ==================== TEMA ====================
function renderTemaGrid() {
    var container = document.getElementById('cadastroForm');
    container.innerHTML = '<button type="button" onclick="openTemaModal()" class="btn-submit btn-orange" style="margin-bottom: 15px;">' +
        '<i class="fas fa-plus"></i> Novo Tema' +
    '</button>';
    
    var grid = document.getElementById('cadastroGrid');
    if (data.temas.length === 0) {
        grid.innerHTML = '<p class="empty-message">Nenhum tema cadastrado</p>';
        return;
    }
    
    var rowsHTML = '';
    data.temas.forEach(function(t) {
        var numEspecialistas = t.especialistas ? t.especialistas.length : 0;
        rowsHTML += '<tr>' +
            '<td>' + t.nome + '</td>' +
            '<td>' + numEspecialistas + ' especialista(s)</td>' +
            '<td>' +
                '<button type="button" class="btn-edit" onclick="openTemaModal(\'' + t.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button type="button" class="btn-delete" onclick="deleteTema(\'' + t.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</td>' +
        '</tr>';
    });
    
    grid.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Nome do Tema</th>' +
                '<th>Especialistas</th>' +
                '<th>Ações</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}

function openTemaModal(id) {
    editingId = null;
    temaEspecialistas = [];
    document.getElementById('temaForm').reset();
    document.getElementById('temaEspecialistasBody').innerHTML = '';
    
    if (id) {
        var tema = data.temas.find(function(t) { return t.id === id; });
        editingId = id;
        document.getElementById('temaNome').value = tema.nome || '';
        
        if (tema.especialistas && Array.isArray(tema.especialistas)) {
            temaEspecialistas = tema.especialistas.slice();
            renderTemaEspecialistasGrid();
        }
        
        document.getElementById('temaModalTitle').textContent = 'Editar Tema';
    } else {
        document.getElementById('temaModalTitle').textContent = 'Novo Tema';
    }
    
    openModal('temaModal');
}

function addTemaEspecialistaRow() {
    temaEspecialistas.push({ id: generateId(), nome: '', formacao: '', contato: '' });
    renderTemaEspecialistasGrid();
}

function renderTemaEspecialistasGrid() {
    var tbody = document.getElementById('temaEspecialistasBody');
    tbody.innerHTML = '';
    
    temaEspecialistas.forEach(function(item, index) {
        tbody.innerHTML += '<tr>' +
            '<td><input type="text" value="' + (item.nome || '') + '" onchange="updateTemaEspecialista(' + index + ', \'nome\', this.value)"></td>' +
            '<td><input type="text" value="' + (item.formacao || '') + '" onchange="updateTemaEspecialista(' + index + ', \'formacao\', this.value)"></td>' +
            '<td><input type="text" value="' + (item.contato || '') + '" onchange="updateTemaEspecialista(' + index + ', \'contato\', this.value)"></td>' +
            '<td><button type="button" class="btn-remove-row" onclick="removeTemaEspecialista(' + index + ')"><i class="fas fa-trash"></i></button></td>' +
        '</tr>';
    });
}

function updateTemaEspecialista(index, field, value) {
    temaEspecialistas[index][field] = value;
}

function removeTemaEspecialista(index) {
    temaEspecialistas.splice(index, 1);
    renderTemaEspecialistasGrid();
}

async function saveTema(e) {
    e.preventDefault();
    
    var temaData = {
        id: editingId || generateId(),
        nome: document.getElementById('temaNome').value,
        especialistas: temaEspecialistas
    };
    
    try {
        showLoadingIndicator('Salvando tema...');
        
        if (editingId) {
            await updateData('temas', editingId, temaData);
            var index = data.temas.findIndex(function(t) { return t.id === editingId; });
            data.temas[index] = temaData;
        } else {
            await insertData('temas', temaData);
            data.temas.push(temaData);
        }
        
        hideLoadingIndicator();
        closeModal('temaModal');
        renderTemaGrid();
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar tema: ' + err.message);
    }
}

async function deleteTema(id) {
    if (confirm('Tem certeza que deseja excluir este tema?')) {
        try {
            showLoadingIndicator('Excluindo tema...');
            await deleteData('temas', id);
            data.temas = data.temas.filter(function(t) { return t.id !== id; });
            hideLoadingIndicator();
            renderTemaGrid();
        } catch (err) {
            hideLoadingIndicator();
            alert('Erro ao excluir tema: ' + err.message);
        }
    }
}

// ==================== ATIVO TECNOLOGICO ====================
function canAccessAtivo(ativo) {
    if (currentUser.perfil === 'Administrador') {
        return true;
    }
    
    if (ativo && ativo.gestor === currentUser.id) {
        return true;
    }
    
    if (!ativo) {
        return true;
    }
    
    return false;
}

function renderAtivoGrid() {
    var container = document.getElementById('cadastroForm');
    container.innerHTML = '<button type="button" onclick="openAtivoModal()" class="btn-submit btn-blue" style="margin-bottom: 15px;">' +
        '<i class="fas fa-plus"></i> Novo Ativo Tecnológico' +
    '</button>';
    
    loadAtivoDropdowns();
    
    var grid = document.getElementById('cadastroGrid');
    
    var ativosFiltrados = data.ativos.filter(function(a) {
        return canAccessAtivo(a);
    });
    
    if (ativosFiltrados.length === 0) {
        grid.innerHTML = '<p class="empty-message">Nenhum ativo disponível para o seu perfil</p>';
        return;
    }
    
    var rowsHTML = '';
    ativosFiltrados.forEach(function(a) {
        var projeto = data.projetos.find(function(p) { return p.id === a.projeto_origem; });
        var gestor = data.users.find(function(u) { return u.id === a.gestor; });
        var qtdRiscos = a.riscos ? a.riscos.length : 0;
        var qtdPaeein = a.paeein ? a.paeein.length : 0;
        rowsHTML += '<tr>' +
            '<td>' + a.nome + '</td>' +
            '<td>' + (projeto ? projeto.titulo : '-') + '</td>' +
            '<td>' + (a.trl || '-') + '</td>' +
            '<td>' + (a.crl || '-') + '</td>' +
            '<td>' + (gestor ? gestor.nome : '-') + '</td>' +
            '<td>' + (a.em_adocao || '-') + '</td>' +
            '<td>' + qtdRiscos + '</td>' +
            '<td>' + qtdPaeein + '</td>' +
            '<td>' +
                '<button type="button" class="btn-edit" onclick="openAtivoModal(\'' + a.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button type="button" class="btn-delete" onclick="deleteAtivo(\'' + a.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</td>' +
        '</tr>';
    });
    
    grid.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Nome</th>' +
                '<th>Projeto Origem</th>' +
                '<th>TRL</th>' +
                '<th>CRL</th>' +
                '<th>Gestor</th>' +
                '<th>Em Adoção</th>' +
                '<th>Riscos</th>' +
                '<th>PAEEIn</th>' +
                '<th>Ações</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}

function loadAtivoDropdowns() {
    var projetoSelect = document.getElementById('ativoProjetoOrigem');
    projetoSelect.innerHTML = '<option value="">Selecione</option>';
    data.projetos.forEach(function(p) {
        projetoSelect.innerHTML += '<option value="' + p.id + '">' + p.titulo + '</option>';
    });
    
    var gestorSelect = document.getElementById('ativoGestor');
    gestorSelect.innerHTML = '<option value="">Selecione</option>';
    data.users.forEach(function(u) {
        gestorSelect.innerHTML += '<option value="' + u.id + '">' + u.nome + '</option>';
    });
}

function openAtivoModal(id) {
    editingId = null;
    ativoRiscos = [];
    ativoPaeein = [];
    ativoArquivos = [];

    document.getElementById('ativoForm').reset();
    document.getElementById('ativoHistoricoGrid').innerHTML = '';
    document.getElementById('riscosBody').innerHTML = '';
    
    var paeeinBody = document.getElementById('paeeinBody');
    if (paeeinBody) paeeinBody.innerHTML = '';

    var arquivosBody = document.getElementById('ativoArquivosBody');
    if (arquivosBody) arquivosBody.innerHTML = '';
    
    loadAtivoDropdowns();
    
    if (id) {
        var ativo = data.ativos.find(function(a) { return a.id === id; });
        
        if (!ativo) {
            alert('Ativo não encontrado!');
            return;
        }
        
        if (!canAccessAtivo(ativo)) {
            alert('Você não tem permissão para acessar este ativo!');
            return;
        }
        
        editingId = id;
        document.getElementById('ativoNome').value = ativo.nome || '';
        document.getElementById('ativoDescricao').value = ativo.descricao || '';
        document.getElementById('ativoProjetoOrigem').value = ativo.projeto_origem || '';
        document.getElementById('ativoTRL').value = ativo.trl || '';
        document.getElementById('ativoCRL').value = ativo.crl || '';
        document.getElementById('ativoGestor').value = ativo.gestor || '';
        document.getElementById('ativoEmAdocao').value = ativo.em_adocao || '';
        document.getElementById('ativoDadosAdocao').value = ativo.dados_adocao || '';
        document.getElementById('ativoModalTitle').textContent = 'Editar Ativo Tecnológico';
        
        if (ativo.riscos && Array.isArray(ativo.riscos)) {
            ativoRiscos = ativo.riscos.slice();
            renderRiscosGrid();
        }
        
        if (ativo.paeein && Array.isArray(ativo.paeein)) {
            ativoPaeein = ativo.paeein.slice();
            renderPaeeinGrid();
        }

	if (ativo.arquivos && Array.isArray(ativo.arquivos)) {
            ativoArquivos = ativo.arquivos.slice();
            renderAtivoArquivosGrid();
        }
        
        renderAtivoHistorico(id);
    } else {
        document.getElementById('ativoDadosAdocao').value = '';
        document.getElementById('ativoModalTitle').textContent = 'Novo Ativo Tecnológico';
    }
    
    openModal('ativoModal');
}

// ==================== RISCOS DO ATIVO ====================
function addRiscoRow() {
    var nextId = 'R' + (ativoRiscos.length + 1);
    ativoRiscos.push({
        id: generateId(),
        id_risco: nextId,
        descricao: '',
        causa: '',
        consequencia: '',
        probabilidade: '',
        impacto: '',
        controles_existentes: '',
        resposta_risco: '',
        descricao_resposta: ''
    });
    renderRiscosGrid();
}

function renderRiscosGrid() {
    var tbody = document.getElementById('riscosBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    ativoRiscos.forEach(function(risco, index) {
        var probOptions = '<option value="">Selecione</option>';
        ['Baixa', 'Media', 'Alta'].forEach(function(p) {
            var selected = (risco.probabilidade === p) ? 'selected' : '';
            probOptions += '<option value="' + p + '" ' + selected + '>' + p + '</option>';
        });

        var impactOptions = '<option value="">Selecione</option>';
        ['Baixo', 'Medio', 'Alto'].forEach(function(i) {
            var selected = (risco.impacto === i) ? 'selected' : '';
            impactOptions += '<option value="' + i + '" ' + selected + '>' + i + '</option>';
        });

        var respostaOptions = '<option value="">Selecione</option>';
        ['Evitar', 'Mitigar', 'Aceitar', 'Transferir'].forEach(function(r) {
            var selected = (risco.resposta_risco === r) ? 'selected' : '';
            respostaOptions += '<option value="' + r + '" ' + selected + '>' + r + '</option>';
        });

        tbody.innerHTML +=
            '<tr>' +
                '<td><input type="text" class="risco-id-input" value="' + (risco.id_risco || '') + '" ' +
                    'onchange="updateRisco(' + index + ',\'id_risco\',this.value)"></td>' +
                '<td><textarea onchange="updateRisco(' + index + ',\'descricao\',this.value)">' + (risco.descricao || '') + '</textarea></td>' +
                '<td><input type="text" value="' + (risco.causa || '') + '" ' +
                    'onchange="updateRisco(' + index + ',\'causa\',this.value)"></td>' +
                '<td><input type="text" value="' + (risco.consequencia || '') + '" ' +
                    'onchange="updateRisco(' + index + ',\'consequencia\',this.value)"></td>' +
                '<td><select onchange="updateRisco(' + index + ',\'probabilidade\',this.value)">' + probOptions + '</select></td>' +
                '<td><select onchange="updateRisco(' + index + ',\'impacto\',this.value)">' + impactOptions + '</select></td>' +
                '<td><textarea onchange="updateRisco(' + index + ',\'controles_existentes\',this.value)">' + (risco.controles_existentes || '') + '</textarea></td>' +
                '<td><select onchange="updateRisco(' + index + ',\'resposta_risco\',this.value)">' + respostaOptions + '</select></td>' +
                '<td><textarea onchange="updateRisco(' + index + ',\'descricao_resposta\',this.value)">' + (risco.descricao_resposta || '') + '</textarea></td>' +
                '<td><button type="button" class="btn-remove-row" onclick="removeRisco(' + index + ')" title="Remover">' +
                    '<i class="fas fa-trash"></i></button></td>' +
            '</tr>';
    });
}

function updateRisco(index, field, value) {
    if (ativoRiscos[index]) {
        ativoRiscos[index][field] = value;
    }
}

function removeRisco(index) {
    ativoRiscos.splice(index, 1);
    renderRiscosGrid();
}

// ==================== PAEEIN DO ATIVO ====================
function addPaeeinRow() {
    ativoPaeein.push({
        id: generateId(),
        situacao: '',
        solucoes: '',
        descricao_aplicacao: '',
        quem: '',
        quando: '',
        porque_sera_feito: '',
        quanto_custa: '',
        mes_ano_acompanhamento: '',
        descricao_acompanhamento: ''
    });
    renderPaeeinGrid();
}

function renderPaeeinGrid() {
    var tbody = document.getElementById('paeeinBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    var situacaoOptions = '<option value="">Selecione</option>';
    ['Executar Ações', 'Em Análise', 'Aguardando Recursos', 'Em Execução', 'Concluído', 'Suspenso', 'Cancelado'].forEach(function(s) {
        situacaoOptions += '<option value="' + s + '">' + s + '</option>';
    });

    var usuariosOptions = '<option value="">Selecione</option>';
    data.users.forEach(function(u) {
        usuariosOptions += '<option value="' + u.id + '">' + u.nome + '</option>';
    });

    ativoPaeein.forEach(function(item, index) {
        var situacaoOpts = situacaoOptions.replace('value="' + item.situacao + '">', 'value="' + item.situacao + '" selected>');
        var quemOpts = usuariosOptions.replace('value="' + item.quem + '">', 'value="' + item.quem + '" selected>');

        tbody.innerHTML +=
            '<tr>' +
                '<td><select onchange="updatePaeein(' + index + ',\'situacao\',this.value)">' + situacaoOpts + '</select></td>' +
                '<td><input type="text" value="' + (item.solucoes || '') + '" ' +
                    'onchange="updatePaeein(' + index + ',\'solucoes\',this.value)"></td>' +
                '<td><textarea onchange="updatePaeein(' + index + ',\'descricao_aplicacao\',this.value)">' + (item.descricao_aplicacao || '') + '</textarea></td>' +
                '<td><select onchange="updatePaeein(' + index + ',\'quem\',this.value)">' + quemOpts + '</select></td>' +
                '<td><input type="date" value="' + (item.quando || '') + '" ' +
                    'onchange="updatePaeein(' + index + ',\'quando\',this.value)"></td>' +
                '<td><textarea onchange="updatePaeein(' + index + ',\'porque_sera_feito\',this.value)">' + (item.porque_sera_feito || '') + '</textarea></td>' +
                '<td><input type="number" step="0.01" value="' + (item.quanto_custa || '') + '" ' +
                    'onchange="updatePaeein(' + index + ',\'quanto_custa\',this.value)" style="width: 80px;"></td>' +
                '<td><input type="month" value="' + (item.mes_ano_acompanhamento || '') + '" ' +
                    'onchange="updatePaeein(' + index + ',\'mes_ano_acompanhamento\',this.value)"></td>' +
                '<td><textarea onchange="updatePaeein(' + index + ',\'descricao_acompanhamento\',this.value)">' + (item.descricao_acompanhamento || '') + '</textarea></td>' +
                '<td><button type="button" class="btn-remove-row" onclick="removePaeein(' + index + ')" title="Remover">' +
                    '<i class="fas fa-trash"></i></button></td>' +
            '</tr>';
    });
}

function updatePaeein(index, field, value) {
    if (ativoPaeein[index]) {
        ativoPaeein[index][field] = value;
    }
}

function removePaeein(index) {
    ativoPaeein.splice(index, 1);
    renderPaeeinGrid();
}

// ==================== ARQUIVOS DO ATIVO TECNOLÓGICO ====================

function handleAtivoFileUpload(event) {
    var files = event.target.files;
    var maxFileSize = 10 * 1024 * 1024; // 10MB por arquivo
    
    Array.from(files).forEach(function(file) {
        // Verificar tamanho do arquivo
        if (file.size > maxFileSize) {
            alert('O arquivo "' + file.name + '" excede o tamanho máximo de 10MB!');
            return;
        }
        
        // Verificar tipo de arquivo
        var tiposPermitidos = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'image/jpeg',
            'image/png'
        ];
        
        if (tiposPermitidos.indexOf(file.type) === -1) {
            alert('Tipo de arquivo não permitido: ' + file.name);
            return;
        }
        
        var reader = new FileReader();
        reader.onload = function(e) {
            ativoArquivos.push({
                id: generateId(),
                nome: file.name,
                tipo: file.type,
                tamanho: file.size,
                descricao: '',
                data: e.target.result,
                data_upload: new Date().toISOString()
            });
            renderAtivoArquivosGrid();
        };
        reader.readAsDataURL(file);
    });
    
    event.target.value = '';
}

function renderAtivoArquivosGrid() {
    var tbody = document.getElementById('ativoArquivosBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (ativoArquivos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--gray); padding: 20px;">Nenhum arquivo anexado</td></tr>';
        return;
    }
    
    ativoArquivos.forEach(function(file, index) {
        var tipoClasse = getAtivoFileTipoClasse(file.tipo);
        var tipoLabel = getAtivoFileTipoLabel(file.tipo);
        var tamanhoFormatado = formatFileSize(file.tamanho);
        
        tbody.innerHTML += 
            '<tr>' +
                '<td>' +
                    '<strong>' + file.nome + '</strong>' +
                    '<span class="arquivo-info-size">' + tamanhoFormatado + '</span>' +
                '</td>' +
                '<td><span class="arquivo-tipo-badge ' + tipoClasse + '">' + tipoLabel + '</span></td>' +
                '<td><input type="text" value="' + (file.descricao || '') + '" placeholder="Adicione uma descrição..." onchange="updateAtivoFileDescricao(' + index + ', this.value)" style="width: 100%;"></td>' +
                '<td style="white-space: nowrap;">' +
                    '<button type="button" class="btn-download-ativo-file" onclick="downloadAtivoFile(' + index + ')" title="Baixar arquivo">' +
                        '<i class="fas fa-download"></i>' +
                    '</button>' +
                    (isPreviewableFile(file.tipo) ? 
                        '<button type="button" class="btn-preview-ativo-file" onclick="previewAtivoFile(' + index + ')" title="Visualizar">' +
                            '<i class="fas fa-eye"></i>' +
                        '</button>' : '') +
                    '<button type="button" class="btn-remove-row" onclick="removeAtivoFile(' + index + ')" title="Remover arquivo">' +
                        '<i class="fas fa-trash"></i>' +
                    '</button>' +
                '</td>' +
            '</tr>';
    });
}

function getAtivoFileTipoClasse(mimeType) {
    if (mimeType.indexOf('pdf') !== -1) return 'arquivo-tipo-pdf';
    if (mimeType.indexOf('word') !== -1 || mimeType.indexOf('msword') !== -1) return 'arquivo-tipo-doc';
    if (mimeType.indexOf('excel') !== -1 || mimeType.indexOf('spreadsheet') !== -1) return 'arquivo-tipo-xls';
    if (mimeType.indexOf('powerpoint') !== -1 || mimeType.indexOf('presentation') !== -1) return 'arquivo-tipo-ppt';
    if (mimeType.indexOf('image') !== -1) return 'arquivo-tipo-img';
    return 'arquivo-tipo-outro';
}

function getAtivoFileTipoLabel(mimeType) {
    if (mimeType.indexOf('pdf') !== -1) return 'PDF';
    if (mimeType.indexOf('word') !== -1 || mimeType.indexOf('msword') !== -1) return 'Word';
    if (mimeType.indexOf('excel') !== -1 || mimeType.indexOf('spreadsheet') !== -1) return 'Excel';
    if (mimeType.indexOf('powerpoint') !== -1 || mimeType.indexOf('presentation') !== -1) return 'PowerPoint';
    if (mimeType.indexOf('jpeg') !== -1 || mimeType.indexOf('jpg') !== -1) return 'JPG';
    if (mimeType.indexOf('png') !== -1) return 'PNG';
    return 'Outro';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function isPreviewableFile(mimeType) {
    return mimeType.indexOf('pdf') !== -1 || mimeType.indexOf('image') !== -1;
}

function updateAtivoFileDescricao(index, value) {
    if (ativoArquivos[index]) {
        ativoArquivos[index].descricao = value;
    }
}

function downloadAtivoFile(index) {
    var file = ativoArquivos[index];
    if (!file || !file.data) {
        alert('Arquivo não disponível para download!');
        return;
    }
    
    var link = document.createElement('a');
    link.href = file.data;
    link.download = file.nome || 'arquivo';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function previewAtivoFile(index) {
    var file = ativoArquivos[index];
    if (!file || !file.data) {
        alert('Arquivo não disponível para visualização!');
        return;
    }
    
    // Abrir em nova aba para PDFs e imagens
    var newWindow = window.open();
    if (file.tipo.indexOf('pdf') !== -1) {
        newWindow.document.write('<html><head><title>' + file.nome + '</title></head><body style="margin:0;"><embed width="100%" height="100%" src="' + file.data + '" type="application/pdf"></body></html>');
    } else if (file.tipo.indexOf('image') !== -1) {
        newWindow.document.write('<html><head><title>' + file.nome + '</title></head><body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#333;"><img src="' + file.data + '" style="max-width:100%; max-height:100vh;"></body></html>');
    }
}

function removeAtivoFile(index) {
    if (confirm('Tem certeza que deseja remover este arquivo?')) {
        ativoArquivos.splice(index, 1);
        renderAtivoArquivosGrid();
    }
}


function renderAtivoHistorico(ativoId) {
    var cards = data.cards.filter(function(c) { return c.ativo_id === ativoId; });
    var container = document.getElementById('ativoHistoricoGrid');
    
    if (cards.length === 0) {
        container.innerHTML = '<p style="color: #6B778C; font-size: 12px;">Nenhum histórico encontrado</p>';
        return;
    }
    
    var rowsHTML = '';
    cards.forEach(function(card) {
        var cliente = data.clientes.find(function(c) { return c.id === card.cliente_id; });
        var regiao = data.regioes.find(function(r) { return r.id === card.regiao_id; });
        var cultura = data.culturas.find(function(c) { return c.id === card.cultura_id; });
        var tema = data.temas.find(function(t) { return t.id === card.tema_id; });
        
        rowsHTML += '<tr>' +
            '<td>' +
                '<button type="button" class="btn-view-historico-ativo" data-card-id="' + card.id + '" title="Visualizar Cartão" style="background: none; border: none; color: #0079BF; cursor: pointer;">' +
                    '<i class="fas fa-external-link-alt"></i>' +
                '</button>' +
            '</td>' +
            '<td>' + (card.titulo || '-') + '</td>' +
            '<td>' + (cliente ? cliente.nome : '-') + '</td>' +
            '<td>' + (regiao ? regiao.nome + (regiao.estado ? ' (' + regiao.estado + ')' : '') : '-') + '</td>' +
            '<td>' + (cultura ? cultura.nome : '-') + '</td>' +
            '<td>' + (tema ? tema.nome : '-') + '</td>' +
        '</tr>';
    });
    
    container.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th style="width: 30px;"></th>' +
                '<th>Título</th>' +
                '<th>Cliente/Parceiro</th>' +
                '<th>Região</th>' +
                '<th>Cultura Agrícola</th>' +
                '<th>Tema</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';

    container.addEventListener('click', function(e) {
        var button = e.target.closest('.btn-view-historico-ativo');
        if (button) {
            e.preventDefault();
            var cardId = button.getAttribute('data-card-id');
            viewCardFromAtivo(cardId);
        }
    });
}

function viewCardFromAtivo(cardId) {
    closeModal('ativoModal');
    viewCard(cardId);
}

async function saveAtivo(e) {
    e.preventDefault();
    
    var ativoData = {
        id: editingId || generateId(),
        nome: document.getElementById('ativoNome').value,
        descricao: document.getElementById('ativoDescricao').value,
        projeto_origem: document.getElementById('ativoProjetoOrigem').value || null,
        trl: document.getElementById('ativoTRL').value || null,
        crl: document.getElementById('ativoCRL').value || null,
        gestor: document.getElementById('ativoGestor').value || null,
        em_adocao: document.getElementById('ativoEmAdocao').value || null,
        dados_adocao: document.getElementById('ativoDadosAdocao').value || null,
        riscos: ativoRiscos,
        paeein: ativoPaeein,
        arquivos: ativoArquivos // ADICIONAR ESTA LINHA
    };
    
    try {
        showLoadingIndicator('Salvando ativo...');
        
        if (editingId) {
            await updateData('ativos', editingId, ativoData);
            var index = data.ativos.findIndex(function(a) { return a.id === editingId; });
            data.ativos[index] = ativoData;
        } else {
            await insertData('ativos', ativoData);
            data.ativos.push(ativoData);
        }
        
        hideLoadingIndicator();
        closeModal('ativoModal');
        renderAtivoGrid();
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar ativo: ' + err.message);
    }
}

async function deleteAtivo(id) {
    var ativo = data.ativos.find(function(a) { return a.id === id; });
    
    if (!canAccessAtivo(ativo)) {
        alert('Você não tem permissão para excluir este ativo!');
        return;
    }
    
    if (confirm('Tem certeza que deseja excluir este ativo?')) {
        try {
            showLoadingIndicator('Excluindo ativo...');
            await deleteData('ativos', id);
            data.ativos = data.ativos.filter(function(a) { return a.id !== id; });
            hideLoadingIndicator();
            renderAtivoGrid();
        } catch (err) {
            hideLoadingIndicator();
            alert('Erro ao excluir ativo: ' + err.message);
        }
    }
}

// ==================== PROJETO ====================
function renderProjetoGrid() {
    var container = document.getElementById('cadastroForm');
    container.innerHTML = '<button type="button" onclick="openProjetoModal()" class="btn-submit btn-orange" style="margin-bottom: 15px;">' +
        '<i class="fas fa-plus"></i> Novo Projeto' +
    '</button>';
    
    loadProjetoDropdowns();
    
    var grid = document.getElementById('cadastroGrid');
    if (data.projetos.length === 0) {
        grid.innerHTML = '<p class="empty-message">Nenhum projeto cadastrado</p>';
        return;
    }
    
    var rowsHTML = '';
    data.projetos.forEach(function(p) {
        var responsavel = data.users.find(function(u) { return u.id === p.responsavel; });
        var descricaoResumo = p.descricao ? p.descricao.substring(0, 50) + '...' : '-';
        rowsHTML += '<tr>' +
            '<td>' + (p.codigo || '') + '</td>' +
            '<td>' + (p.titulo || '') + '</td>' +
            '<td>' + (responsavel ? responsavel.nome : '-') + '</td>' +
            '<td>' + descricaoResumo + '</td>' +
            '<td>' +
                '<button type="button" class="btn-edit" onclick="openProjetoModal(\'' + p.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button type="button" class="btn-delete" onclick="deleteProjeto(\'' + p.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</td>' +
        '</tr>';
    });
    
    grid.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Código</th>' +
                '<th>Título</th>' +
                '<th>Responsável</th>' +
                '<th>Descrição</th>' +
                '<th>Ações</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}

function loadProjetoDropdowns() {
    var responsavelSelect = document.getElementById('projetoResponsavel');
    responsavelSelect.innerHTML = '<option value="">Selecione</option>';
    data.users.forEach(function(u) {
        responsavelSelect.innerHTML += '<option value="' + u.id + '">' + u.nome + '</option>';
    });
}

function openProjetoModal(id) {
    editingId = null;
    document.getElementById('projetoForm').reset();
    loadProjetoDropdowns();
    
    if (id) {
        var projeto = data.projetos.find(function(p) { return p.id === id; });
        editingId = id;
        document.getElementById('projetoCodigo').value = projeto.codigo || '';
        document.getElementById('projetoTitulo').value = projeto.titulo || '';
        document.getElementById('projetoDescricao').value = projeto.descricao || '';
        document.getElementById('projetoResponsavel').value = projeto.responsavel || '';
        document.getElementById('projetoModalTitle').textContent = 'Editar Projeto';
    } else {
        document.getElementById('projetoModalTitle').textContent = 'Novo Projeto';
    }
    
    openModal('projetoModal');
}

async function saveProjeto(e) {
    e.preventDefault();
    
    var projetoData = {
        id: editingId || generateId(),
        codigo: document.getElementById('projetoCodigo').value,
        titulo: document.getElementById('projetoTitulo').value,
        descricao: document.getElementById('projetoDescricao').value,
        responsavel: document.getElementById('projetoResponsavel').value || null
    };
    
    try {
        showLoadingIndicator('Salvando projeto...');
        
        if (editingId) {
            await updateData('projetos', editingId, projetoData);
            var index = data.projetos.findIndex(function(p) { return p.id === editingId; });
            data.projetos[index] = projetoData;
        } else {
            await insertData('projetos', projetoData);
            data.projetos.push(projetoData);
        }
        
        hideLoadingIndicator();
        closeModal('projetoModal');
        renderProjetoGrid();
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar projeto: ' + err.message);
    }
}

async function deleteProjeto(id) {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
        try {
            showLoadingIndicator('Excluindo projeto...');
            await deleteData('projetos', id);
            data.projetos = data.projetos.filter(function(p) { return p.id !== id; });
            hideLoadingIndicator();
            renderProjetoGrid();
        } catch (err) {
            hideLoadingIndicator();
            alert('Erro ao excluir projeto: ' + err.message);
        }
    }
}

// ==================== CONTRATOS / CONVENIOS ====================
function renderContratoGrid() {
    var container = document.getElementById('cadastroForm');
    
    container.innerHTML = 
        '<div class="filter-bar-cadastro">' +
            '<input type="text" id="filtroContrato" placeholder="Filtrar por Cliente ou Número SAIC..." ' +
                'onkeyup="filtrarContratos()" class="filter-input-cadastro">' +
            '<button type="button" onclick="openContratoModal()" class="btn-submit btn-blue" style="margin-left: 10px;">' +
                '<i class="fas fa-plus"></i> Novo Contrato/Convênio' +
            '</button>' +
        '</div>';
    
    renderContratoTable(data.contratos);
}

function filtrarContratos() {
    var filtro = document.getElementById('filtroContrato').value.toLowerCase();
    
    var contratosFiltrados = data.contratos.filter(function(c) {
        var cliente = data.clientes.find(function(cl) { return cl.id === c.cliente_id; });
        var nomeCliente = cliente ? cliente.nome.toLowerCase() : '';
        var numeroSaic = (c.numero_saic || '').toLowerCase();
        
        return nomeCliente.indexOf(filtro) !== -1 || numeroSaic.indexOf(filtro) !== -1;
    });
    
    renderContratoTable(contratosFiltrados);
}

function renderContratoTable(contratos) {
    var grid = document.getElementById('cadastroGrid');
    
    if (contratos.length === 0) {
        grid.innerHTML = '<p class="empty-message">Nenhum contrato/convênio encontrado</p>';
        return;
    }
    
    var rowsHTML = '';
    contratos.forEach(function(c) {
        var cliente = data.clientes.find(function(cl) { return cl.id === c.cliente_id; });
        var cultura = data.culturas.find(function(cu) { return cu.id === c.cultura_id; });
        var fiscal = data.users.find(function(u) { return u.id === c.fiscal_id; });
        
        rowsHTML += '<tr>' +
            '<td>' + (c.numero_saic || '-') + '</td>' +
            '<td>' + (c.protocolo_sei || '-') + '</td>' +
            '<td>' + (cliente ? cliente.nome : '-') + '</td>' +
            '<td>' + (c.tipo_parceiro || '-') + '</td>' +
            '<td>' + (c.ano_assinatura || '-') + '</td>' +
            '<td>' + (c.data_final_vigencia || '-') + '</td>' +
            '<td>' + (c.tipo_parceria || '-') + '</td>' +
            '<td>' + (cultura ? cultura.nome : '-') + '</td>' +
            '<td>' + (fiscal ? fiscal.nome : '-') + '</td>' +
            '<td>' + (c.cidade || '-') + '</td>' +
            '<td>' + (c.uf || '-') + '</td>' +
            '<td>' +
                '<button type="button" class="btn-edit" onclick="openContratoModal(\'' + c.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button type="button" class="btn-delete" onclick="deleteContrato(\'' + c.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</td>' +
        '</tr>';
    });
    
    grid.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Nº SAIC</th>' +
                '<th>Protocolo SEI</th>' +
                '<th>Cliente/Parceiro</th>' +
                '<th>Tipo Parceiro</th>' +
                '<th>Ano Assinatura</th>' +
                '<th>Vigência Final</th>' +
                '<th>Tipo Parceria</th>' +
                '<th>Cultura Agrícola</th>' +
                '<th>Fiscal</th>' +
                '<th>Cidade</th>' +
                '<th>UF</th>' +
                '<th>Ações</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}

function loadContratoDropdowns() {
    var clienteSelect = document.getElementById('contratoCliente');
    clienteSelect.innerHTML = '<option value="">Selecione</option>';
    data.clientes.forEach(function(c) {
        clienteSelect.innerHTML += '<option value="' + c.id + '">' + c.nome + '</option>';
    });
    
    var culturaSelect = document.getElementById('contratoCultura');
    culturaSelect.innerHTML = '<option value="">Selecione</option>';
    data.culturas.forEach(function(c) {
        culturaSelect.innerHTML += '<option value="' + c.id + '">' + c.nome + '</option>';
    });
    
    var fiscalSelect = document.getElementById('contratoFiscal');
    fiscalSelect.innerHTML = '<option value="">Selecione</option>';
    data.users.forEach(function(u) {
        fiscalSelect.innerHTML += '<option value="' + u.id + '">' + u.nome + '</option>';
    });
}

function onContratoClienteChange() {
    var clienteId = document.getElementById('contratoCliente').value;
    var tipoParceiroField = document.getElementById('contratoTipoParceiro');
    
    if (clienteId) {
        var cliente = data.clientes.find(function(c) { return c.id === clienteId; });
        if (cliente && cliente.tipo) {
            tipoParceiroField.value = cliente.tipo;
        } else {
            tipoParceiroField.value = '';
        }
    } else {
        tipoParceiroField.value = '';
    }
}

function openContratoModal(id) {
    editingId = null;
    document.getElementById('contratoForm').reset();
    loadContratoDropdowns();
    
    if (id) {
        var contrato = data.contratos.find(function(c) { return c.id === id; });
        editingId = id;
        document.getElementById('contratoNumeroSaic').value = contrato.numero_saic || '';
        document.getElementById('contratoProtocoloSei').value = contrato.protocolo_sei || '';
        document.getElementById('contratoCliente').value = contrato.cliente_id || '';
        document.getElementById('contratoTipoParceiro').value = contrato.tipo_parceiro || '';
        document.getElementById('contratoAnoAssinatura').value = contrato.ano_assinatura || '';
        document.getElementById('contratoDataFinalVigencia').value = contrato.data_final_vigencia || '';
        document.getElementById('contratoTipoParceria').value = contrato.tipo_parceria || '';
        document.getElementById('contratoCultura').value = contrato.cultura_id || '';
        document.getElementById('contratoFiscal').value = contrato.fiscal_id || '';
        document.getElementById('contratoCidade').value = contrato.cidade || '';
        document.getElementById('contratoUf').value = contrato.uf || '';
        document.getElementById('contratoModalTitle').textContent = 'Editar Contrato/Convênio';
    } else {
        document.getElementById('contratoModalTitle').textContent = 'Novo Contrato/Convênio';
    }
    
    openModal('contratoModal');
}

async function saveContrato(e) {
    e.preventDefault();
    
    var contratoData = {
        id: editingId || generateId(),
        numero_saic: document.getElementById('contratoNumeroSaic').value,
        protocolo_sei: document.getElementById('contratoProtocoloSei').value,
        cliente_id: document.getElementById('contratoCliente').value || null,
        tipo_parceiro: document.getElementById('contratoTipoParceiro').value,
        ano_assinatura: document.getElementById('contratoAnoAssinatura').value || null,
        data_final_vigencia: document.getElementById('contratoDataFinalVigencia').value || null,
        tipo_parceria: document.getElementById('contratoTipoParceria').value,
        cultura_id: document.getElementById('contratoCultura').value || null,
        fiscal_id: document.getElementById('contratoFiscal').value || null,
        cidade: document.getElementById('contratoCidade').value,
        uf: document.getElementById('contratoUf').value
    };
    
    try {
        showLoadingIndicator('Salvando contrato...');
        
        if (editingId) {
            await updateData('contratos', editingId, contratoData);
            var index = data.contratos.findIndex(function(c) { return c.id === editingId; });
            data.contratos[index] = contratoData;
        } else {
            await insertData('contratos', contratoData);
            data.contratos.push(contratoData);
        }
        
        hideLoadingIndicator();
        closeModal('contratoModal');
        renderContratoGrid();
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar contrato: ' + err.message);
    }
}

async function deleteContrato(id) {
    if (confirm('Tem certeza que deseja excluir este contrato/convênio?')) {
        try {
            showLoadingIndicator('Excluindo contrato...');
            await deleteData('contratos', id);
            data.contratos = data.contratos.filter(function(c) { return c.id !== id; });
            hideLoadingIndicator();
            renderContratoGrid();
        } catch (err) {
            hideLoadingIndicator();
            alert('Erro ao excluir contrato: ' + err.message);
        }
    }
}

// ==================== MODAL HELPERS ====================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
    editingId = null;
}

function openPasswordModal() {
    document.getElementById('confirmPassword').value = '';
    openModal('passwordModal');
}

async function confirmDelete(e) {
    e.preventDefault();
    var password = document.getElementById('confirmPassword').value;
    
    if (password === 'crm') {
        if (typeof deleteCallback === 'function') {
            await deleteCallback();
            deleteCallback = null;
        }
        closeModal('passwordModal');
    } else {
        alert('Senha incorreta!');
    }
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(function(modal) {
            modal.classList.remove('show');
        });
    }
});

// ==================== EXPORT FUNCTIONS ====================
function exportToExcel() {
    if (data.cards.length === 0) {
        alert('Não há dados para exportar!');
        return;
    }
    
    var exportData = data.cards.map(function(card) {
        var list = data.lists.find(function(l) { return l.id === card.list_id; });
        var cliente = data.clientes.find(function(c) { return c.id === card.cliente_id; });
        var responsavel = data.users.find(function(u) { return u.id === card.responsavel_id; });
        var tema = data.temas.find(function(t) { return t.id === card.tema_id; });
        var cultura = data.culturas.find(function(c) { return c.id === card.cultura_id; });
        var projeto = data.projetos.find(function(p) { return p.id === card.projeto_id; });
        var ativo = data.ativos.find(function(a) { return a.id === card.ativo_id; });
        var regiao = data.regioes.find(function(r) { return r.id === card.regiao_id; });
        var contrato = data.contratos.find(function(c) { return c.id === card.contrato_id; });
        
        return {
            'Título': card.titulo || '',
            'Etapa': list ? list.nome : '',
            'Cliente': cliente ? cliente.nome : '',
            'Responsável': responsavel ? responsavel.nome : '',
            'Data Contato': card.data_contato || '',
            'Previsão Fechamento': card.data_fechamento || '',
            'Tema': tema ? tema.nome : '',
            'Cultura': cultura ? cultura.nome : '',
            'Projeto': projeto ? projeto.titulo : '',
            'Ativo': ativo ? ativo.nome : '',
            'Região': regiao ? regiao.nome : '',
            'Contrato': contrato ? contrato.numero_saic : '',
            'Situação': card.situacao || '',
            'Qualificação': getQualificacaoLabel(card.qualificacao),
            'Valor Total': 'R$ ' + formatCurrency(calculateCardTotal(card)),
            'Descrição': card.descricao || ''
        };
    });
    
    var ws = XLSX.utils.json_to_sheet(exportData);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'CRM Embrapa');
    
    XLSX.writeFile(wb, 'crm_embrapa_export.xlsx');
}

// ==================== RELATÓRIOS PDF ====================

function mostrarLoadingRelatorio(mensagem) {
    var loadingDiv = document.createElement('div');
    loadingDiv.id = 'relatorioLoading';
    loadingDiv.className = 'relatorio-loading';
    loadingDiv.innerHTML = 
        '<div class="relatorio-loading-content">' +
            '<i class="fas fa-spinner"></i>' +
            '<p>' + mensagem + '</p>' +
        '</div>';
    document.body.appendChild(loadingDiv);
}

function esconderLoadingRelatorio() {
    var loadingDiv = document.getElementById('relatorioLoading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function formatarDataRelatorio() {
    var hoje = new Date();
    var dia = String(hoje.getDate()).padStart(2, '0');
    var mes = String(hoje.getMonth() + 1).padStart(2, '0');
    var ano = hoje.getFullYear();
    var hora = String(hoje.getHours()).padStart(2, '0');
    var minuto = String(hoje.getMinutes()).padStart(2, '0');
    return dia + '/' + mes + '/' + ano + ' às ' + hora + ':' + minuto;
}

function adicionarCabecalhoRelatorio(doc, titulo) {
    var pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFillColor(0, 121, 191);
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('EMBRAPA Mandioca e Fruticultura', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(titulo, pageWidth / 2, 25, { align: 'center' });
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text('Gerado em: ' + formatarDataRelatorio() + ' | Usuário: ' + currentUser.nome, pageWidth / 2, 45, { align: 'center' });
    
    doc.setDrawColor(0, 121, 191);
    doc.setLineWidth(0.5);
    doc.line(14, 50, pageWidth - 14, 50);
    
    return 55;
}

function adicionarRodapeRelatorio(doc) {
    var pageCount = doc.internal.getNumberOfPages();
    var pageWidth = doc.internal.pageSize.getWidth();
    var pageHeight = doc.internal.pageSize.getHeight();
    
    for (var i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);
        
        doc.setTextColor(128, 128, 128);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Sistema de Gestão de CRM - Embrapa Mandioca e Fruticultura', 14, pageHeight - 8);
        doc.text('Página ' + i + ' de ' + pageCount, pageWidth - 14, pageHeight - 8, { align: 'right' });
    }
}

function gerarRelatorioClientes() {
    if (data.clientes.length === 0) {
        alert('Não há clientes cadastrados para gerar o relatório!');
        return;
    }
    
    mostrarLoadingRelatorio('Gerando relatório de Clientes/Parceiros...');
    
    setTimeout(function() {
        try {
            var jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF('landscape', 'mm', 'a4');
            
            var startY = adicionarCabecalhoRelatorio(doc, 'Relatório de Clientes/Parceiros');
            
            doc.setTextColor(23, 43, 77);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Resumo Estatístico', 14, startY);
            
            var tiposCount = {};
            data.clientes.forEach(function(c) {
                var tipo = c.tipo || 'Não informado';
                tiposCount[tipo] = (tiposCount[tipo] || 0) + 1;
            });
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text('Total de Clientes/Parceiros: ' + data.clientes.length, 14, startY + 8);
            
            var tiposTexto = 'Por Tipo: ';
            Object.keys(tiposCount).forEach(function(tipo, idx) {
                tiposTexto += tipo + ' (' + tiposCount[tipo] + ')';
                if (idx < Object.keys(tiposCount).length - 1) tiposTexto += ', ';
            });
            doc.text(tiposTexto, 14, startY + 14);
            
            startY += 25;
            
            var tableData = data.clientes.map(function(c) {
                var contratos = data.contratos.filter(function(ct) { return ct.cliente_id === c.id; });
                var contratosStr = contratos.map(function(ct) { return ct.numero_saic; }).join(', ') || '-';
                var ativos = c.ativos ? c.ativos.length : 0;
                
                return [
                    c.nome || '-',
                    c.tipo || '-',
                    c.email || '-',
                    c.telefone || '-',
                    c.cidade || '-',
                    c.estado || '-',
                    c.endereco || '-',
                    ativos.toString(),
                    contratosStr
                ];
            });
            
            doc.autoTable({
                startY: startY,
                head: [[
                    'Nome', 'Tipo', 'E-mail', 'Telefone', 'Cidade', 'UF', 'Endereço', 'Ativos', 'Contratos'
                ]],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [0, 121, 191],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 8,
                    halign: 'center'
                },
                bodyStyles: {
                    fontSize: 7,
                    textColor: [50, 50, 50]
                },
                alternateRowStyles: {
                    fillColor: [240, 248, 255]
                },
                columnStyles: {
                    0: { cellWidth: 35 },
                    1: { cellWidth: 25 },
                    2: { cellWidth: 40 },
                    3: { cellWidth: 25 },
                    4: { cellWidth: 25 },
                    5: { cellWidth: 12 },
                    6: { cellWidth: 45 },
                    7: { cellWidth: 15, halign: 'center' },
                    8: { cellWidth: 35 }
                },
                margin: { left: 14, right: 14 }
            });
            
            adicionarRodapeRelatorio(doc);
            
            doc.save('Relatorio_Clientes_Parceiros_' + new Date().toISOString().slice(0, 10) + '.pdf');
            
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            alert('Erro ao gerar o relatório. Verifique o console para mais detalhes.');
        }
        
        esconderLoadingRelatorio();
    }, 100);
}

function gerarRelatorioAtivos() {
    if (data.ativos.length === 0) {
        alert('Não há ativos tecnológicos cadastrados para gerar o relatório!');
        return;
    }
    
    mostrarLoadingRelatorio('Gerando relatório de Ativos Tecnológicos...');
    
    setTimeout(function() {
        try {
            var jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF('portrait', 'mm', 'a4');
            
            var startY = adicionarCabecalhoRelatorio(doc, 'Relatório de Ativos Tecnológicos');
            
            doc.setTextColor(23, 43, 77);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Resumo Estatístico', 14, startY);
            
            var emAdocaoCount = data.ativos.filter(function(a) { return a.em_adocao === 'Sim'; }).length;
            var comRiscosCount = data.ativos.filter(function(a) { return a.riscos && a.riscos.length > 0; }).length;
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text('Total de Ativos: ' + data.ativos.length + ' | Em Adoção: ' + emAdocaoCount + ' | Com Riscos: ' + comRiscosCount, 14, startY + 8);
            
            startY += 18;
            
            var tableData = data.ativos.map(function(a) {
                var projeto = data.projetos.find(function(p) { return p.id === a.projeto_origem; });
                var gestor = data.users.find(function(u) { return u.id === a.gestor; });
                var qtdRiscos = a.riscos ? a.riscos.length : 0;
                
                return [
                    a.nome || '-',
                    projeto ? projeto.titulo : '-',
                    a.trl || '-',
                    a.crl || '-',
                    gestor ? gestor.nome : '-',
                    a.em_adocao || '-',
                    qtdRiscos.toString(),
                    (a.descricao || '-').substring(0, 50)
                ];
            });
            
            doc.autoTable({
                startY: startY,
                head: [[
                    'Nome', 'Projeto Origem', 'TRL', 'CRL', 'Gestor', 'Em Adoção', 'Riscos', 'Descrição'
                ]],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [97, 189, 79],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 8,
                    halign: 'center'
                },
                bodyStyles: {
                    fontSize: 7,
                    textColor: [50, 50, 50]
                },
                alternateRowStyles: {
                    fillColor: [232, 245, 233]
                },
                columnStyles: {
                    0: { cellWidth: 30 },
                    1: { cellWidth: 30 },
                    2: { cellWidth: 12, halign: 'center' },
                    3: { cellWidth: 12, halign: 'center' },
                    4: { cellWidth: 25 },
                    5: { cellWidth: 18, halign: 'center' },
                    6: { cellWidth: 15, halign: 'center' },
                    7: { cellWidth: 40 }
                },
                margin: { left: 14, right: 14 }
            });
            
            adicionarRodapeRelatorio(doc);
            
            doc.save('Relatorio_Ativos_Tecnologicos_' + new Date().toISOString().slice(0, 10) + '.pdf');
            
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            alert('Erro ao gerar o relatório. Verifique o console para mais detalhes.');
        }
        
        esconderLoadingRelatorio();
    }, 100);
}

function gerarRelatorioContratos() {
    if (data.contratos.length === 0) {
        alert('Não há contratos cadastrados para gerar o relatório!');
        return;
    }
    
    mostrarLoadingRelatorio('Gerando relatório de Contratos/Convênios...');
    
    setTimeout(function() {
        try {
            var jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF('landscape', 'mm', 'a4');
            
            var startY = adicionarCabecalhoRelatorio(doc, 'Relatório de Contratos e Convênios');
            
            doc.setTextColor(23, 43, 77);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Resumo Estatístico', 14, startY);
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text('Total de Contratos/Convênios: ' + data.contratos.length, 14, startY + 8);
            
            startY += 18;
            
            var tableData = data.contratos.map(function(c) {
                var cliente = data.clientes.find(function(cl) { return cl.id === c.cliente_id; });
                var cultura = data.culturas.find(function(cu) { return cu.id === c.cultura_id; });
                var fiscal = data.users.find(function(u) { return u.id === c.fiscal_id; });
                
                var vigenciaStatus = '-';
                if (c.data_final_vigencia) {
                    var hoje = new Date();
                    var vigencia = new Date(c.data_final_vigencia);
                    vigenciaStatus = vigencia >= hoje ? 'Vigente' : 'Vencido';
                }
                
                return [
                    c.numero_saic || '-',
                    c.protocolo_sei || '-',
                    cliente ? cliente.nome : '-',
                    c.tipo_parceiro || '-',
                    c.ano_assinatura || '-',
                    c.data_final_vigencia || '-',
                    vigenciaStatus,
                    (c.tipo_parceria || '-').substring(0, 30),
                    cultura ? cultura.nome : '-',
                    fiscal ? fiscal.nome : '-',
                    (c.cidade || '-') + '/' + (c.uf || '-')
                ];
            });
            
            doc.autoTable({
                startY: startY,
                head: [[
                    'Nº SAIC', 'Protocolo SEI', 'Cliente/Parceiro', 'Tipo Parceiro', 
                    'Ano', 'Vigência Final', 'Status', 'Tipo Parceria', 
                    'Cultura', 'Fiscal', 'Cidade/UF'
                ]],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [255, 159, 26],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 7,
                    halign: 'center'
                },
                bodyStyles: {
                    fontSize: 6,
                    textColor: [50, 50, 50]
                },
                alternateRowStyles: {
                    fillColor: [255, 248, 225]
                },
                columnStyles: {
                    0: { cellWidth: 22 },
                    1: { cellWidth: 22 },
                    2: { cellWidth: 35 },
                    3: { cellWidth: 22 },
                    4: { cellWidth: 12, halign: 'center' },
                    5: { cellWidth: 22 },
                    6: { cellWidth: 18, halign: 'center' },
                    7: { cellWidth: 35 },
                    8: { cellWidth: 22 },
                    9: { cellWidth: 28 },
                    10: { cellWidth: 25 }
                },
                margin: { left: 14, right: 14 },
                didParseCell: function(data) {
                    if (data.column.index === 6 && data.section === 'body') {
                        if (data.cell.raw === 'Vigente') {
                            data.cell.styles.textColor = [97, 189, 79];
                            data.cell.styles.fontStyle = 'bold';
                        } else if (data.cell.raw === 'Vencido') {
                            data.cell.styles.textColor = [235, 90, 70];
                            data.cell.styles.fontStyle = 'bold';
                        }
                    }
                }
            });
            
            adicionarRodapeRelatorio(doc);
            
            doc.save('Relatorio_Contratos_Convenios_' + new Date().toISOString().slice(0, 10) + '.pdf');
            
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            alert('Erro ao gerar o relatório. Verifique o console para mais detalhes.');
        }
        
        esconderLoadingRelatorio();
    }, 100);
}

// ==================== COLABORAÇÃO ====================

function loadFiltroColaboradores() {
    var select = document.getElementById('filtroColaboradorResponsavel');
    if (!select) return;
    
    // Coletar todos os colaboradores únicos
    var colaboradoresUnicos = {};
    
    data.cards.forEach(function(card) {
        if (card.equipe && Array.isArray(card.equipe)) {
            card.equipe.forEach(function(colaborador) {
                // ===== ADICIONAR VERIFICAÇÃO DE PERMISSÃO =====
                var temPermissao = false;
                
                if (currentUser.perfil === 'Administrador') {
                    // Admin vê todos
                    temPermissao = true;
                } else if (currentUser.perfil === 'Usuário') {
                    // Usuário vê apenas se é o colaborador
                    if (colaborador.usuario_id === currentUser.id) {
                        temPermissao = true;
                    }
                }
                // ===== FIM DA VERIFICAÇÃO =====
                
                if (temPermissao && colaborador.usuario_id && !colaboradoresUnicos[colaborador.usuario_id]) {
                    var usuario = data.users.find(function(u) { return u.id === colaborador.usuario_id; });
                    if (usuario) {
                        colaboradoresUnicos[colaborador.usuario_id] = usuario.nome;
                    }
                }
            });
        }
    });
    
    select.innerHTML = '<option value="">Todos os Colaboradores</option>';
    Object.keys(colaboradoresUnicos).sort(function(a, b) {
        return colaboradoresUnicos[a].localeCompare(colaboradoresUnicos[b]);
    }).forEach(function(usuarioId) {
        select.innerHTML += '<option value="' + usuarioId + '">' + colaboradoresUnicos[usuarioId] + '</option>';
    });
}




function loadFiltroColaboradorCartoes() {
    var select = document.getElementById('filtroColaboradorCartao');
    if (!select) return;
    
    // Coletar todos os cartões que possuem colaboradores
    var cartoesComColaboradores = {};
    
    data.cards.forEach(function(card) {
        if (card.equipe && Array.isArray(card.equipe) && card.equipe.length > 0) {
            // ===== ADICIONAR VERIFICAÇÃO DE PERMISSÃO =====
            var temPermissao = false;
            
            if (currentUser.perfil === 'Administrador') {
                // Admin vê todos os cartões com colaboradores
                temPermissao = true;
            } else if (currentUser.perfil === 'Usuário') {
                // Usuário vê apenas cartões onde ele é colaborador
                var ehColaborador = card.equipe.some(function(colaborador) {
                    return colaborador.usuario_id === currentUser.id;
                });
                if (ehColaborador) {
                    temPermissao = true;
                }
            }
            // ===== FIM DA VERIFICAÇÃO =====
            
            if (temPermissao) {
                cartoesComColaboradores[card.id] = card.titulo;
            }
        }
    });
    
    select.innerHTML = '<option value="">Todos os Cartões</option>';
    Object.keys(cartoesComColaboradores).forEach(function(cardId) {
        select.innerHTML += '<option value="' + cardId + '">' + cartoesComColaboradores[cardId] + '</option>';
    });
}




function renderColaboracaoView() {
    var container = document.getElementById('colaboracaoViewGrid');
    if (!container) return;
    
    var filtroColaborador = document.getElementById('filtroColaboradorResponsavel').value;
    var filtroCartao = document.getElementById('filtroColaboradorCartao').value;
    
    var colaboracoes = [];
    
    data.cards.forEach(function(card) {
        if (!card.equipe || !Array.isArray(card.equipe) || card.equipe.length === 0) return;
        
        card.equipe.forEach(function(colaborador) {
            // ===== ADICIONAR VERIFICAÇÃO DE PERMISSÃO =====
            var temPermissao = false;
            
            if (currentUser.perfil === 'Administrador') {
                // Admin vê todas as colaborações
                temPermissao = true;
            } else if (currentUser.perfil === 'Usuário') {
                // Usuário vê apenas suas próprias colaborações
                if (colaborador.usuario_id === currentUser.id) {
                    temPermissao = true;
                }
            }
            
            if (!temPermissao) return; // Pula para o próximo colaborador
            // ===== FIM DA VERIFICAÇÃO =====
            
            // Aplicar filtros
            if (filtroColaborador && colaborador.usuario_id !== filtroColaborador) return;
            if (filtroCartao && card.id !== filtroCartao) return;
            
            var usuario = data.users.find(function(u) { return u.id === colaborador.usuario_id; });
            var cliente = data.clientes.find(function(c) { return c.id === card.cliente_id; });
            var list = data.lists.find(function(l) { return l.id === card.list_id; });
            
            colaboracoes.push({
                colaborador: colaborador,
                card: card,
                usuario: usuario,
                cliente: cliente,
                list: list
            });
        });
    });
    
    if (colaboracoes.length === 0) {
        container.innerHTML = '<p class="empty-message" style="padding: 30px; text-align: center;">' +
            '<i class="fas fa-handshake" style="font-size: 40px; color: var(--gray); display: block; margin-bottom: 10px;"></i>' +
            'Nenhuma colaboração encontrada com os filtros selecionados.' +
        '</p>';
        return;
    }

    
    var rowsHTML = '';
    colaboracoes.forEach(function(item) {
        var statusClass = '';
        if (item.card.situacao === 'Nova') statusClass = 'status-nova';
        else if (item.card.situacao === 'Em Andamento') statusClass = 'status-andamento';
        else if (item.card.situacao === 'Contratada') statusClass = 'status-contratada';
        else if (item.card.situacao === 'Perdida') statusClass = 'status-perdida';
        
        var dataContatoFormatada = '-';
        if (item.card.data_contato) {
            var partes = item.card.data_contato.split('-');
            if (partes.length === 3) {
                dataContatoFormatada = partes[2] + '/' + partes[1] + '/' + partes[0];
            }
        }
        
        rowsHTML +=
            '<tr>' +
                '<td>' +
                    '<button type="button" class="btn-link-cartao" onclick="viewCard(\'' + item.card.id + '\')" ' +
                        'title="Abrir cartão: ' + (item.card.titulo || '') + '">' +
                        '<i class="fas fa-external-link-alt"></i> ' +
                        '<span class="cartao-titulo-link">' + (item.card.titulo || 'Sem título') + '</span>' +
                    '</button>' +
                    '<div class="cartao-cliente-info">' + (item.cliente ? item.cliente.nome : '-') + '</div>' +
                '</td>' +
                '<td>' +
                    '<div style="font-weight: 600;">' + (item.usuario ? item.usuario.nome : '-') + '</div>' +
                    '<div style="font-size: 11px; color: var(--gray);">' + (item.usuario ? item.usuario.cargo : '-') + '</div>' +
                '</td>' +
                '<td>' + (item.colaborador.principal_funcao || '-') + '</td>' +
                '<td>' + (item.list ? item.list.nome : '-') + '</td>' +
                '<td>' + dataContatoFormatada + '</td>' +
                '<td><span class="card-status ' + statusClass + '">' + (item.card.situacao || '-') + '</span></td>' +
                '<td style="text-align: center;">' +
                    '<button type="button" class="btn-view-mini" onclick="viewCard(\'' + item.card.id + '\')" title="Visualizar Cartão">' +
                        '<i class="fas fa-eye"></i>' +
                    '</button>' +
                '</td>' +
            '</tr>';
    });
    
    container.innerHTML =
        '<table class="tarefas-view-table">' +
        '<thead><tr>' +
            '<th>Cartão de Negociação</th>' +
            '<th>Colaborador</th>' +
            '<th>Principal Função</th>' +
            '<th>Etapa</th>' +
            '<th>Data Contato</th>' +
            '<th>Situação</th>' +
            '<th>Ações</th>' +
        '</tr></thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
        '</table>';
}

function showView(viewName) {
    // Esconder a tela de Minhas Negociações se estiver visível
    document.getElementById('minhasNegociacoesView').classList.remove('active');
    
    // Garantir que o header está visível
    document.querySelector('.header').style.display = 'flex';
    
    document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
    document.querySelectorAll('.nav-btn').forEach(function(b) { b.classList.remove('active'); });
    
    document.getElementById(viewName + 'View').classList.add('active');
    var navBtn = document.querySelector('.nav-btn[data-view="' + viewName + '"]');
    if (navBtn) {
        navBtn.classList.add('active');
    }
    
    if (viewName === 'dashboard') {
        showDashboardTab('oportunidades');
    } else if (viewName === 'historico') {
        loadHistoricoFilters();
    } else if (viewName === 'tarefas') {
        loadFiltroResponsavelTarefas();
        renderTarefasView();
    } else if (viewName === 'colaboracao') {
        // ADICIONAR ESTAS LINHAS
        loadFiltroColaboradores();
        loadFiltroColaboradorCartoes();
        renderColaboracaoView();
    }
}
