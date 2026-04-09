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
    contratos: [],
    contatos_leads: [],
    sac: [],
    fontes_recursos: [],   // NOVO
    tips: [],          // NOVO
    editais_programas: []    // NOVO


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
var editalArquivos = [];



var cardEquipe = [];  // ADICIONAR ESTA LINHA
var clienteContatos = [];  // ADICIONAR ESTA LINHA

// TIP - Termo de Intenção de Projetos
var tipResultados = [];
var tipColaboradores = [];
var tipInstituicoes = [];
var tipOrcamento = [];
var tipRiscos = [];
var tipCardId = null;
var tipEditingId = null;


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
            loadTableData('contratos'),
            loadTableData('contatos_leads'),
            loadTableData('sac'),
 	    loadTableData('fontes_recursos'),
	    loadTableData('tips'),           // NOVO
	    loadTableData('editais_programas')    // NOVO
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
        data.contatos_leads = results[12];
        data.sac = results[13];
        data.fontes_recursos = results[14];    // NOVO
	data.tips = results[15];            // NOVO
	data.editais_programas = results[16];    // NOVO
        
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

    window.renderContatoLeadGrid = renderContatoLeadGrid;
    window.filtrarContatosLeads = filtrarContatosLeads;
    window.openContatoLeadModal = openContatoLeadModal;
    window.saveContatoLead = saveContatoLead;
    window.deleteContatoLead = deleteContatoLead;
    window.converterLeadEmCliente = converterLeadEmCliente;
    window.renderSacView = renderSacView;
    window.openSacModal = openSacModal;
    window.saveSac = saveSac;
    window.deleteSac = deleteSac;
    window.aplicarFiltrosSac = aplicarFiltrosSac;
    window.limparFiltrosSac = limparFiltrosSac;
    window.exportSacToExcel = exportSacToExcel;
    window.gerarRelatorioSac = gerarRelatorioSac;
    window.onSacContatoLeadChange = onSacContatoLeadChange;
    window.renderDashboardSac = renderDashboardSac;
    window.populateSacFilters = populateSacFilters;

    window._executarGeracaoRelatorioSac = _executarGeracaoRelatorioSac;

    window.renderFonteRecursoGrid = renderFonteRecursoGrid;
    window.filtrarFontesRecursos = filtrarFontesRecursos;
    window.openFonteRecursoModal = openFonteRecursoModal;
    window.saveFonteRecurso = saveFonteRecurso;
    window.deleteFonteRecurso = deleteFonteRecurso;

    window.gerarRelatorioPipeline = gerarRelatorioPipeline;
    window._executarGeracaoRelatorioPipeline = _executarGeracaoRelatorioPipeline;

    window.openTipFromCard = openTipFromCard;
    window.saveTip = saveTip;
    window.addTipResultadoRow = addTipResultadoRow;
    window.updateTipResultado = updateTipResultado;
    window.removeTipResultado = removeTipResultado;
    window.addTipColaboradorRow = addTipColaboradorRow;
    window.updateTipColaborador = updateTipColaborador;
    window.removeTipColaborador = removeTipColaborador;
    window.addTipInstituicaoRow = addTipInstituicaoRow;
    window.updateTipInstituicao = updateTipInstituicao;
    window.removeTipInstituicao = removeTipInstituicao;
    window.addTipOrcamentoRow = addTipOrcamentoRow;
    window.updateTipOrcamento = updateTipOrcamento;
    window.removeTipOrcamento = removeTipOrcamento;
    window.updateTipOrcamentoTotal = updateTipOrcamentoTotal;
    window.onTipFonteChange = onTipFonteChange;
    window.addTipRiscoRow = addTipRiscoRow;
    window.updateTipRisco = updateTipRisco;
    window.removeTipRisco = removeTipRisco;
    window.exportTipToPdf = exportTipToPdf;

window.gerarRelatorioTip = gerarRelatorioTip;
window._executarGeracaoRelatorioTip = _executarGeracaoRelatorioTip;
window.applyHistoricoTipsFilters = applyHistoricoTipsFilters;
window.clearHistoricoTipsFilters = clearHistoricoTipsFilters;
window.loadHistoricoTipsFilters = loadHistoricoTipsFilters;
window.viewTipFromHistorico = viewTipFromHistorico;

window.exportSingleTipToPdf = exportSingleTipToPdf;

window.renderEditalProgramaGrid = renderEditalProgramaGrid;
window.filtrarEditaisProgramas = filtrarEditaisProgramas;
window.limparFiltrosEditais = limparFiltrosEditais;
window.openEditalProgramaModal = openEditalProgramaModal;
window.saveEditalPrograma = saveEditalPrograma;
window.deleteEditalPrograma = deleteEditalPrograma;
window.onEditalFonteRecursoChange = onEditalFonteRecursoChange;


window.handleEditalFileUpload = handleEditalFileUpload;
window.renderEditalArquivosGrid = renderEditalArquivosGrid;
window.updateEditalFileDescricao = updateEditalFileDescricao;
window.downloadEditalFile = downloadEditalFile;
window.previewEditalFile = previewEditalFile;
window.removeEditalFile = removeEditalFile;




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

    document.getElementById('contatoLeadForm').addEventListener('submit', saveContatoLead);
    document.getElementById('sacForm').addEventListener('submit', saveSac);

    document.getElementById('funnelSelect').addEventListener('change', onFunnelChange);
    document.getElementById('fonteRecursoForm').addEventListener('submit', saveFonteRecurso);

    document.getElementById('tipForm').addEventListener('submit', saveTip);

    document.getElementById('editalProgramaForm').addEventListener('submit', saveEditalPrograma);

    
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
    } else if (viewName === 'historicoTips') {
        loadHistoricoTipsFilters();
    } else if (viewName === 'tarefas') {
        loadFiltroResponsavelTarefas();
        renderTarefasView();
    } else if (viewName === 'colaboracao') {
        loadFiltroColaboradores();
        loadFiltroColaboradorCartoes();
        renderColaboracaoView();
    } else if (viewName === 'sac') {
        renderSacView();
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

        // NOVO: Adicionar botão "Gerar TIP" no formulário se estiver editando
        var existingTipBtn = document.getElementById('btnGerarTip');
        if (existingTipBtn) existingTipBtn.remove();
        
        var formActions = document.querySelector('#cardForm .form-actions');
        if (formActions) {
                    var tipBtn = document.createElement('button');
        tipBtn.type = 'button';
        tipBtn.id = 'btnGerarTip';
        tipBtn.className = 'btn-gerar-tip';
        tipBtn.style.cssText = 'padding: 8px 16px; font-size: 12px; letter-spacing: 0; text-transform: none;';
        tipBtn.innerHTML = '<i class="fas fa-file-signature"></i> Gerar TIP';
        tipBtn.onclick = function() { openTipFromCard(cardId); };
        formActions.insertBefore(tipBtn, formActions.firstChild);

        }



        document.getElementById('cardModalTitle').textContent = 'Editar Cartão';
    } else {
        document.getElementById('cardForm').setAttribute('data-list-id', listId);
        document.getElementById('cardModalTitle').textContent = 'Novo Cartão';

// NOVO: Remover botão TIP ao criar novo cartão
        var existingTipBtn = document.getElementById('btnGerarTip');
        if (existingTipBtn) existingTipBtn.remove();
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

// Adicionar ao final da função loadCardDropdowns(), antes do fechamento "}"
    var contatoLeadSelect = document.getElementById('cardContatoLead');
    contatoLeadSelect.innerHTML = '<option value="">Selecione</option>';
    data.contatos_leads.forEach(function(cl) {
        var tipoInfo = cl.tipo ? ' (' + cl.tipo + ')' : '';
        contatoLeadSelect.innerHTML += '<option value="' + cl.id + '">' + cl.nome + tipoInfo + '</option>';
    });


    // Edital/Programa de Financiamento
    var editalProgramaSelect = document.getElementById('cardEditalPrograma');
    editalProgramaSelect.innerHTML = '<option value="">Selecione</option>';
    data.editais_programas.forEach(function(ep) {
        var label = ep.nome + (ep.codigo ? ' (' + ep.codigo + ')' : '');
        editalProgramaSelect.innerHTML += '<option value="' + ep.id + '">' + label + '</option>';
    });




}

function populateCardForm(card) {
    document.getElementById('cardTitle').value = card.titulo || '';
    document.getElementById('cardDescricao').value = card.descricao || '';
    document.getElementById('cardDataContato').value = card.data_contato || '';
    document.getElementById('cardDataFechamento').value = card.data_fechamento || '';


    document.getElementById('cardDataRealFechamento').value = card.data_real_fechamento || '';  // NOVO


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
    document.getElementById('cardContatoLead').value = card.contato_lead_id || '';
    document.getElementById('cardEditalPrograma').value = card.edital_programa_id || '';


    document.getElementById('cardTipoPerda').value = card.tipo_perda || '';       // NOVO
    document.getElementById('cardDataPerda').value = card.data_perda || '';       // NOVO




    
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

        data_real_fechamento: document.getElementById('cardDataRealFechamento').value || null,  // NOVO


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


        tipo_perda: document.getElementById('cardTipoPerda').value || null,          // NOVO
        data_perda: document.getElementById('cardDataPerda').value || null,           // NOVO

	contato_lead_id: document.getElementById('cardContatoLead').value || null,
        edital_programa_id: document.getElementById('cardEditalPrograma').value || null,


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
    var contatoLead = data.contatos_leads.find(function(cl) { return cl.id === card.contato_lead_id; });  // NOVO
    var editalPrograma = data.editais_programas.find(function(ep) { return ep.id === card.edital_programa_id; });

    
    

    var motivoPerdaHTML = '';
	if (card.situacao === 'Perdida') {
   	 motivoPerdaHTML = 
        '<div class="field">' +
            '<div class="field-label">Tipo de Perda</div>' +
            '<div class="field-value" style="color: #EB5A46; font-weight: 600;">' + (card.tipo_perda || '-') + '</div>' +
        '</div>' +
        '<div class="field">' +
            '<div class="field-label">Data da Perda</div>' +
            '<div class="field-value">' + (card.data_perda || '-') + '</div>' +
        '</div>' +
        '<div class="field full-width">' +
            '<div class="field-label">Motivo da Perda (Detalhamento)</div>' +
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
            '<div class="field-label">Contato / Lead</div>' +
            '<div class="field-value">' + (contatoLead ? contatoLead.nome + (contatoLead.tipo ? ' (' + contatoLead.tipo + ')' : '') : '-') + '</div>' +
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
    		'<div class="field-label">Data Real de Fechamento</div>' +
   		 '<div class="field-value">' + (card.data_real_fechamento || '-') + '</div>' +
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
    var motivoPerdaRow = document.getElementById('motivoPerdaRow');
    
    if (situacao === 'Perdida') {
        motivoPerdaRow.style.display = 'flex';
    } else {
        motivoPerdaRow.style.display = 'none';
        // Limpar campos de perda quando a situação não for "Perdida"
        document.getElementById('cardMotivoPerda').value = '';
        document.getElementById('cardTipoPerda').value = '';
        document.getElementById('cardDataPerda').value = '';
    }
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

      else if (tabName === 'sac') {
        document.getElementById('dashboardSAC').classList.add('active');
        renderDashboardSac();
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



// Chart NEW: Perdas por Tipo
var tiposPerdaData = {};
cards.filter(function(c) { return c.situacao === 'Perdida'; }).forEach(function(card) {
    var tipoPerda = card.tipo_perda || 'Não Informado';
    tiposPerdaData[tipoPerda] = (tiposPerdaData[tipoPerda] || 0) + 1;
});
if (Object.keys(tiposPerdaData).length > 0) {
    renderPieChart('chartTipoPerda', tiposPerdaData);
} else {
    var canvasTipoPerda = document.getElementById('chartTipoPerda');
    if (canvasTipoPerda) {
        var ctxTP = canvasTipoPerda.getContext('2d');
        ctxTP.font = '13px Arial';
        ctxTP.fillStyle = '#6B778C';
        ctxTP.textAlign = 'center';
        ctxTP.fillText('Nenhuma perda registrada', canvasTipoPerda.width / 2, canvasTipoPerda.height / 2);
    }
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
    var filterSituacao = document.getElementById('filterSituacao').value;

    // Filtros de data
    var filterDataContatoInicio = document.getElementById('filterDataContatoInicio').value;
    var filterDataContatoFim = document.getElementById('filterDataContatoFim').value;
    var filterDataFechamentoInicio = document.getElementById('filterDataFechamentoInicio').value;
    var filterDataFechamentoFim = document.getElementById('filterDataFechamentoFim').value;
    var filterDataRealFechamentoInicio = document.getElementById('filterDataRealFechamentoInicio').value;
    var filterDataRealFechamentoFim = document.getElementById('filterDataRealFechamentoFim').value;
    var filterDataPerdaInicio = document.getElementById('filterDataPerdaInicio').value;
    var filterDataPerdaFim = document.getElementById('filterDataPerdaFim').value;

    var cardsFiltrados = data.cards.filter(function(card) {
        // Filtros de select existentes
        if (filterEtapa && card.list_id !== filterEtapa) return false;
        if (filterCliente && card.cliente_id !== filterCliente) return false;
        if (filterTema && card.tema_id !== filterTema) return false;
        if (filterResponsavel && card.responsavel_id !== filterResponsavel) return false;
        if (filterCultura && card.cultura_id !== filterCultura) return false;
        if (filterProjeto && card.projeto_id !== filterProjeto) return false;
        if (filterAtivo && card.ativo_id !== filterAtivo) return false;
        if (filterContrato && card.contrato_id !== filterContrato) return false;

        // Filtro de situação
        if (filterSituacao && card.situacao !== filterSituacao) return false;

        // Filtro: Data do Contato
        if (filterDataContatoInicio || filterDataContatoFim) {
            if (!card.data_contato) return false;
            if (filterDataContatoInicio && card.data_contato < filterDataContatoInicio) return false;
            if (filterDataContatoFim && card.data_contato > filterDataContatoFim) return false;
        }

        // Filtro: Previsão de Fechamento
        if (filterDataFechamentoInicio || filterDataFechamentoFim) {
            if (!card.data_fechamento) return false;
            if (filterDataFechamentoInicio && card.data_fechamento < filterDataFechamentoInicio) return false;
            if (filterDataFechamentoFim && card.data_fechamento > filterDataFechamentoFim) return false;
        }

        // Filtro: Data Real de Fechamento
        if (filterDataRealFechamentoInicio || filterDataRealFechamentoFim) {
            if (!card.data_real_fechamento) return false;
            if (filterDataRealFechamentoInicio && card.data_real_fechamento < filterDataRealFechamentoInicio) return false;
            if (filterDataRealFechamentoFim && card.data_real_fechamento > filterDataRealFechamentoFim) return false;
        }

        // Filtro: Data da Perda
        if (filterDataPerdaInicio || filterDataPerdaFim) {
            if (!card.data_perda) return false;
            if (filterDataPerdaInicio && card.data_perda < filterDataPerdaInicio) return false;
            if (filterDataPerdaFim && card.data_perda > filterDataPerdaFim) return false;
        }

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

	var contatoLead = data.contatos_leads.find(function(cl) { return cl.id === card.contato_lead_id; });

        // Formatar datas para exibição (DD/MM/AAAA)
        var formatDate = function(dateStr) {
            if (!dateStr) return '-';
            var partes = dateStr.split('-');
            if (partes.length === 3) return partes[2] + '/' + partes[1] + '/' + partes[0];
            return dateStr;
        };

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
            '<td>' + formatDate(card.data_contato) + '</td>' +
            '<td>' + formatDate(card.data_fechamento) + '</td>' +
            '<td>' + formatDate(card.data_real_fechamento) + '</td>' +
            '<td>' + (tema ? tema.nome : '-') + '</td>' +
            '<td>' + (cultura ? cultura.nome : '-') + '</td>' +
            '<td>' + (projeto ? projeto.titulo : '-') + '</td>' +
            '<td>' + (ativo ? ativo.nome : '-') + '</td>' +
            '<td>' + (contrato ? contrato.numero_saic : '-') + '</td>' +
            '<td>' + (card.situacao || '-') + '</td>' +
            '<td>' + (card.tipo_perda || '-') + '</td>' +
            '<td>' + formatDate(card.data_perda) + '</td>' +
            '<td>R$ ' + formatCurrency(valorTotal) + '</td>' +
 	     '<td>' + (contatoLead ? contatoLead.nome : '-') + '</td>' +
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
                '<th>Prev. Fechamento</th>' +
                '<th>Fech. Real</th>' +
                '<th>Tema</th>' +
                '<th>Cultura</th>' +
                '<th>Projeto</th>' +
                '<th>Ativo</th>' +
                '<th>Contrato</th>' +
                '<th>Situação</th>' +
                '<th>Tipo Perda</th>' +
                '<th>Data Perda</th>' +
                '<th>Valor</th>' +
 		'<th>Contato/Lead</th>' +
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
    document.getElementById('filterSituacao').value = '';

    // Limpar filtros de data
    document.getElementById('filterDataContatoInicio').value = '';
    document.getElementById('filterDataContatoFim').value = '';
    document.getElementById('filterDataFechamentoInicio').value = '';
    document.getElementById('filterDataFechamentoFim').value = '';
    document.getElementById('filterDataRealFechamentoInicio').value = '';
    document.getElementById('filterDataRealFechamentoFim').value = '';
    document.getElementById('filterDataPerdaInicio').value = '';
    document.getElementById('filterDataPerdaFim').value = '';

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

 	case 'contato_lead':
            document.getElementById('cadastroTitle').textContent = 'Cadastro de Contato / Lead';
            renderContatoLeadGrid();
            break;

case 'fonte_recurso':
            document.getElementById('cadastroTitle').textContent = 'Cadastro de Fonte de Recursos';
            renderFonteRecursoGrid();
            break;

case 'edital_programa':
            document.getElementById('cadastroTitle').textContent = 'Cadastro de Editais / Programas de Financiamento';
            renderEditalProgramaGrid();
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



// ==================== CONTATO / LEAD ====================

function renderContatoLeadGrid() {
    var container = document.getElementById('cadastroForm');
    container.innerHTML = 
        '<div class="filter-bar-cadastro">' +
            '<input type="text" id="filtroContatoLead" placeholder="Filtrar por nome..." ' +
                'onkeyup="filtrarContatosLeads()" class="filter-input-cadastro">' +
            '<button type="button" onclick="openContatoLeadModal()" class="btn-submit btn-blue" style="margin-left: 10px;">' +
                '<i class="fas fa-plus"></i> Novo Contato / Lead' +
            '</button>' +
        '</div>';
    
    renderContatoLeadTable(data.contatos_leads);
}

function filtrarContatosLeads() {
    var filtro = document.getElementById('filtroContatoLead').value.toLowerCase();
    var filtrados = data.contatos_leads.filter(function(c) {
        return (c.nome || '').toLowerCase().indexOf(filtro) !== -1 ||
               (c.email || '').toLowerCase().indexOf(filtro) !== -1 ||
               (c.tipo || '').toLowerCase().indexOf(filtro) !== -1 ||    // NOVO
               (c.cidade || '').toLowerCase().indexOf(filtro) !== -1;
    });
    renderContatoLeadTable(filtrados);
}

function renderContatoLeadTable(contatosLeads) {
    var grid = document.getElementById('cadastroGrid');
    
    if (contatosLeads.length === 0) {
        grid.innerHTML = '<p class="empty-message">Nenhum contato/lead cadastrado</p>';
        return;
    }
    
    var rowsHTML = '';
    contatosLeads.forEach(function(c) {
        var convertidoHTML = '';
        if (c.convertido_cliente) {
            var clienteVinculado = data.clientes.find(function(cl) { return cl.id === c.cliente_id; });
            convertidoHTML = '<span style="color: var(--green); font-weight: 600;"><i class="fas fa-check-circle"></i> ' + 
                (clienteVinculado ? clienteVinculado.nome : 'Sim') + '</span>';
        } else {
            convertidoHTML = '<button type="button" class="btn-submit btn-green" style="padding: 4px 10px; font-size: 11px;" ' +
                'onclick="converterLeadEmCliente(\'' + c.id + '\')" title="Converter em Cliente/Parceiro">' +
                '<i class="fas fa-user-plus"></i> Converter' +
            '</button>';
        }
        
        rowsHTML += '<tr>' +
            '<td>' + (c.nome || '-') + '</td>' +
 	    '<td>' + (c.tipo || '-') + '</td>' +           // NOVO
            '<td>' + (c.email || '-') + '</td>' +
            '<td>' + (c.cidade || '-') + '</td>' +
            '<td>' + (c.estado || '-') + '</td>' +
            '<td>' + convertidoHTML + '</td>' +
            '<td>' +
                '<button type="button" class="btn-edit" onclick="openContatoLeadModal(\'' + c.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button type="button" class="btn-delete" onclick="deleteContatoLead(\'' + c.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</td>' +
        '</tr>';
    });
    
    grid.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Nome</th>' +
                '<th>Tipo</th>' +           // NOVO
                '<th>E-mail</th>' +
                '<th>Cidade</th>' +
                '<th>UF</th>' +
                '<th>Cliente/Parceiro</th>' +
                '<th>Ações</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}

function openContatoLeadModal(id) {
    editingId = null;
    document.getElementById('contatoLeadForm').reset();
    
    if (id) {
        var contatoLead = data.contatos_leads.find(function(c) { return c.id === id; });
        if (!contatoLead) { alert('Contato/Lead não encontrado!'); return; }
        editingId = id;
        document.getElementById('contatoLeadNome').value = contatoLead.nome || '';
        document.getElementById('contatoLeadEmail').value = contatoLead.email || '';
	document.getElementById('contatoLeadTipo').value = contatoLead.tipo || '';  // NOVO
        document.getElementById('contatoLeadCidade').value = contatoLead.cidade || '';
        document.getElementById('contatoLeadEstado').value = contatoLead.estado || '';
        document.getElementById('contatoLeadModalTitle').textContent = 'Editar Contato / Lead';
    } else {
        document.getElementById('contatoLeadModalTitle').textContent = 'Novo Contato / Lead';
    }
    
    openModal('contatoLeadModal');
}

async function saveContatoLead(e) {
    e.preventDefault();
    
    var contatoLeadData = {
        id: editingId || generateId(),
        nome: document.getElementById('contatoLeadNome').value,
        email: document.getElementById('contatoLeadEmail').value,
	tipo: document.getElementById('contatoLeadTipo').value,  // NOVO
        cidade: document.getElementById('contatoLeadCidade').value,
        estado: document.getElementById('contatoLeadEstado').value,
        criador_id: currentUser.id
    };
    
    // Preservar dados de conversão se estiver editando
    if (editingId) {
        var existing = data.contatos_leads.find(function(c) { return c.id === editingId; });
        if (existing) {
            contatoLeadData.convertido_cliente = existing.convertido_cliente;
            contatoLeadData.cliente_id = existing.cliente_id;
            contatoLeadData.data_criacao = existing.data_criacao;
        }
    }
    
    try {
        showLoadingIndicator('Salvando contato/lead...');
        
        if (editingId) {
            await updateData('contatos_leads', editingId, contatoLeadData);
            var index = data.contatos_leads.findIndex(function(c) { return c.id === editingId; });
            data.contatos_leads[index] = contatoLeadData;
        } else {
            contatoLeadData.convertido_cliente = false;
            contatoLeadData.cliente_id = null;
            contatoLeadData.data_criacao = new Date().toISOString();
            await insertData('contatos_leads', contatoLeadData);
            data.contatos_leads.push(contatoLeadData);
        }
        
        hideLoadingIndicator();
        closeModal('contatoLeadModal');
        renderContatoLeadGrid();
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar contato/lead: ' + err.message);
    }
}

async function deleteContatoLead(id) {
    // Verificar se há SAC vinculado
    var sacVinculado = data.sac.some(function(s) { return s.contato_lead_id === id; });
    if (sacVinculado) {
        alert('Não é possível excluir este contato/lead pois existem ocorrências SAC vinculadas!');
        return;
    }
    
    if (confirm('Tem certeza que deseja excluir este contato/lead?')) {
        try {
            showLoadingIndicator('Excluindo contato/lead...');
            await deleteData('contatos_leads', id);
            data.contatos_leads = data.contatos_leads.filter(function(c) { return c.id !== id; });
            hideLoadingIndicator();
            renderContatoLeadGrid();
        } catch (err) {
            hideLoadingIndicator();
            alert('Erro ao excluir contato/lead: ' + err.message);
        }
    }
}

async function converterLeadEmCliente(contatoLeadId) {
    var contatoLead = data.contatos_leads.find(function(c) { return c.id === contatoLeadId; });
    if (!contatoLead) { alert('Contato/Lead não encontrado!'); return; }
    
    if (contatoLead.convertido_cliente) {
        alert('Este contato/lead já foi convertido em cliente!');
        return;
    }
    
    if (!confirm('Deseja converter "' + contatoLead.nome + '" em Cliente/Parceiro?\n\nO Contato/Lead será mantido no cadastro e um novo Cliente/Parceiro será criado com os dados disponíveis. Você poderá complementar os dados faltantes depois.')) {
        return;
    }
    
    try {
        showLoadingIndicator('Convertendo em cliente/parceiro...');
        
        // Criar novo cliente
        var novoCliente = {
            id: generateId(),
            nome: contatoLead.nome,
            email: contatoLead.email || '',
            cidade: contatoLead.cidade || '',
            estado: contatoLead.estado || '',
            tipo: '',
            endereco: '',
            telefone: '',
            redes_sociais: '',
            atividades: '',
            ativos: [],
            contatos: []
        };
        
        await insertData('clientes', novoCliente);
        data.clientes.push(novoCliente);
        
        // Atualizar contato/lead como convertido
        contatoLead.convertido_cliente = true;
        contatoLead.cliente_id = novoCliente.id;
        await updateData('contatos_leads', contatoLeadId, {
            convertido_cliente: true,
            cliente_id: novoCliente.id
        });
        
        hideLoadingIndicator();
        
        alert('Contato/Lead convertido com sucesso!\n\nUm novo Cliente/Parceiro "' + novoCliente.nome + '" foi criado. Você pode complementar os dados acessando o cadastro de Clientes/Parceiros.');
        
        renderContatoLeadGrid();
        
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao converter contato/lead: ' + err.message);
    }
}


// ==================== SAC (Serviço de Atendimento ao Cliente) ====================


function renderSacView() {
    var container = document.getElementById('sacViewContent');
    if (!container) return;
    
    // Estatísticas rápidas
    var totalSac = data.sac.length;
    var abertas = data.sac.filter(function(s) { return s.situacao === 'Aberta'; }).length;
    var andamento = data.sac.filter(function(s) { return s.situacao === 'Em Andamento'; }).length;
    var fechadas = data.sac.filter(function(s) { return s.situacao === 'Fechada'; }).length;
    
    var html = '<div class="historico-container" style="margin: 0;">';
    
    // Cabeçalho
    html += '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">' +
        '<h2 style="margin: 0; color: var(--dark-blue);"><i class="fas fa-headset" style="color: var(--primary-blue);"></i> SAC - Serviço de Atendimento ao Cliente</h2>' +
        '<div style="display: flex; gap: 8px;">' +
            '<button type="button" onclick="exportSacToExcel()" class="btn-submit btn-green" style="padding: 8px 15px; font-size: 12px;">' +
                '<i class="fas fa-file-excel"></i> Exportar Excel' +
            '</button>' +
            '<button type="button" onclick="openSacModal()" class="btn-submit btn-blue" style="padding: 8px 15px; font-size: 12px;">' +
                '<i class="fas fa-plus"></i> Nova Ocorrência' +
            '</button>' +
        '</div>' +
    '</div>';
    
    // Barra de estatísticas
    html += '<div class="sac-stats-bar">' +
        '<div class="sac-stat-item" style="border-top-color: var(--primary-blue);">' +
            '<span class="sac-stat-number" style="color: var(--primary-blue);">' + totalSac + '</span>' +
            '<span class="sac-stat-label">Total</span>' +
        '</div>' +
        '<div class="sac-stat-item" style="border-top-color: #5BA4CF;">' +
            '<span class="sac-stat-number" style="color: #5BA4CF;">' + abertas + '</span>' +
            '<span class="sac-stat-label">Abertas</span>' +
        '</div>' +
        '<div class="sac-stat-item" style="border-top-color: var(--orange);">' +
            '<span class="sac-stat-number" style="color: var(--orange);">' + andamento + '</span>' +
            '<span class="sac-stat-label">Em Andamento</span>' +
        '</div>' +
        '<div class="sac-stat-item" style="border-top-color: var(--green);">' +
            '<span class="sac-stat-number" style="color: var(--green);">' + fechadas + '</span>' +
            '<span class="sac-stat-label">Fechadas</span>' +
        '</div>' +
    '</div>';
    
    // Seção de filtros melhorada
    html += '<div class="sac-filters-section">' +
        '<h4><i class="fas fa-filter"></i> Filtros de Pesquisa</h4>' +
        '<div class="sac-filters-grid">' +
            '<div class="sac-filter-group">' +
                '<label>Período de Abertura</label>' +
                '<div class="sac-filter-date-range">' +
                    '<input type="date" id="filtroSacDataInicio" title="Data Início">' +
                    '<span class="sac-filter-date-sep">até</span>' +
                    '<input type="date" id="filtroSacDataFim" title="Data Fim">' +
                '</div>' +
            '</div>' +
            '<div class="sac-filter-group">' +
                '<label>Contato / Lead</label>' +
                '<select id="filtroSacContato"><option value="">Todos</option></select>' +
            '</div>' +
            '<div class="sac-filter-group">' +
                '<label>Município</label>' +
                '<input type="text" id="filtroSacCidade" placeholder="Buscar município...">' +
            '</div>' +
            '<div class="sac-filter-group">' +
                '<label>Cultura Agrícola</label>' +
                '<select id="filtroSacCultura"><option value="">Todas</option></select>' +
            '</div>' +
            '<div class="sac-filter-group">' +
                '<label>Tema</label>' +
                '<select id="filtroSacTema"><option value="">Todos</option></select>' +
            '</div>' +
            '<div class="sac-filter-group">' +
                '<label>Situação</label>' +
                '<select id="filtroSacSituacao">' +
                    '<option value="">Todas</option>' +
                    '<option value="Aberta">Aberta</option>' +
                    '<option value="Em Andamento">Em Andamento</option>' +
                    '<option value="Fechada">Fechada</option>' +
                '</select>' +
            '</div>' +
            '<div class="sac-filter-group">' +
                '<label>Nível de Solução</label>' +
                '<select id="filtroSacNivel">' +
                    '<option value="">Todos</option>' +
                    '<option value="Primeiro Nível">Primeiro Nível</option>' +
                    '<option value="Segundo Nível">Segundo Nível</option>' +
                '</select>' +
            '</div>' +
            '<div class="sac-filter-group">' +
                '<label>UF</label>' +
                '<select id="filtroSacUf">' +
                    '<option value="">Todos</option>' +
                    '<option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option>' +
                    '<option value="AM">AM</option><option value="BA">BA</option><option value="CE">CE</option>' +
                    '<option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option>' +
                    '<option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option>' +
                    '<option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option>' +
                    '<option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option>' +
                    '<option value="RJ">RJ</option><option value="RN">RN</option><option value="RS">RS</option>' +
                    '<option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option>' +
                    '<option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>' +
                '</select>' +
            '</div>' +
        '</div>' +
        '<div class="sac-filters-actions">' +
            '<button type="button" onclick="aplicarFiltrosSac()" class="btn-sac-filtrar">' +
                '<i class="fas fa-search"></i> Aplicar Filtros' +
            '</button>' +
            '<button type="button" onclick="limparFiltrosSac()" class="btn-sac-limpar">' +
                '<i class="fas fa-eraser"></i> Limpar Filtros' +
            '</button>' +
        '</div>' +
    '</div>';
    
    html += '<div id="sacGrid" class="historico-grid"></div>';
    html += '</div>';
    
    container.innerHTML = html;
    
    // Popular filtros
    populateSacFilters();
    
    // Renderizar grid com todos os dados
    renderSacGrid(data.sac);
}




function aplicarFiltrosSac() {
    var dataInicio = document.getElementById('filtroSacDataInicio').value;
    var dataFim = document.getElementById('filtroSacDataFim').value;
    var contato = document.getElementById('filtroSacContato').value;
    var cidade = document.getElementById('filtroSacCidade').value.toLowerCase();
    var cultura = document.getElementById('filtroSacCultura').value;
    var tema = document.getElementById('filtroSacTema').value;
    var situacao = document.getElementById('filtroSacSituacao').value;
    var nivel = document.getElementById('filtroSacNivel') ? document.getElementById('filtroSacNivel').value : '';
    var uf = document.getElementById('filtroSacUf') ? document.getElementById('filtroSacUf').value : '';
    
    var filtrados = data.sac.filter(function(s) {
        if (dataInicio && s.data_abertura && s.data_abertura < dataInicio) return false;
        if (dataFim && s.data_abertura && s.data_abertura > dataFim) return false;
        if (contato && s.contato_lead_id !== contato) return false;
        if (cidade && (!s.municipio || s.municipio.toLowerCase().indexOf(cidade) === -1)) return false;
        if (cultura && s.cultura_id !== cultura) return false;
        if (tema && s.tema_id !== tema) return false;
        if (situacao && s.situacao !== situacao) return false;
        if (nivel && s.nivel_solucao !== nivel) return false;
        if (uf && s.uf !== uf) return false;
        return true;
    });
    
    renderSacGrid(filtrados);
}



function limparFiltrosSac() {
    document.getElementById('filtroSacDataInicio').value = '';
    document.getElementById('filtroSacDataFim').value = '';
    document.getElementById('filtroSacContato').value = '';
    document.getElementById('filtroSacCidade').value = '';
    document.getElementById('filtroSacCultura').value = '';
    document.getElementById('filtroSacTema').value = '';
    document.getElementById('filtroSacSituacao').value = '';
    var nivelEl = document.getElementById('filtroSacNivel');
    if (nivelEl) nivelEl.value = '';
    var ufEl = document.getElementById('filtroSacUf');
    if (ufEl) ufEl.value = '';
    renderSacGrid(data.sac);
}




function renderSacGrid(sacItems) {
    var container = document.getElementById('sacGrid');
    if (!container) return;
    
    if (sacItems.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhuma ocorrência SAC encontrada</p>';
        return;
    }
    
    var formatDate = function(dateStr) {
        if (!dateStr) return '-';
        var partes = dateStr.split('-');
        if (partes.length === 3) return partes[2] + '/' + partes[1] + '/' + partes[0];
        return dateStr;
    };
    
    var rowsHTML = '';
    sacItems.forEach(function(s) {
        var cultura = data.culturas.find(function(c) { return c.id === s.cultura_id; });
        var tema = data.temas.find(function(t) { return t.id === s.tema_id; });
        
        var situacaoClass = '';
        if (s.situacao === 'Aberta') situacaoClass = 'status-nova';
        else if (s.situacao === 'Em Andamento') situacaoClass = 'status-andamento';
        else if (s.situacao === 'Fechada') situacaoClass = 'status-contratada';
        
        rowsHTML += '<tr>' +
            '<td>' + formatDate(s.data_abertura) + '</td>' +
            '<td>' + ((s.descricao_ocorrencia || '').substring(0, 60) + (s.descricao_ocorrencia && s.descricao_ocorrencia.length > 60 ? '...' : '')) + '</td>' +
            '<td>' + (s.nome_contato || '-') + '</td>' +
            '<td>' + (s.email_contato || '-') + '</td>' +
            '<td>' + (s.perfil_cliente || '-') + '</td>' +
            '<td>' + (s.municipio || '-') + '/' + (s.uf || '-') + '</td>' +
            '<td>' + (s.nivel_solucao || '-') + '</td>' +
            '<td>' + (cultura ? cultura.nome : '-') + '</td>' +
            '<td>' + (tema ? tema.nome : '-') + '</td>' +
            '<td><span class="card-status ' + situacaoClass + '">' + (s.situacao || '-') + '</span></td>' +
            '<td>' + formatDate(s.data_fechamento) + '</td>' +
            '<td>' +
                '<button type="button" class="btn-edit" onclick="openSacModal(\'' + s.id + '\')" title="Editar"><i class="fas fa-edit"></i></button>' +
                '<button type="button" class="btn-delete" onclick="deleteSac(\'' + s.id + '\')" title="Excluir"><i class="fas fa-trash"></i></button>' +
            '</td>' +
        '</tr>';
    });
    
    container.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Abertura</th>' +
                '<th>Descrição</th>' +
                '<th>Contato/Lead</th>' +
                '<th>E-mail</th>' +
                '<th>Perfil</th>' +
                '<th>Município/UF</th>' +
                '<th>Nível</th>' +
                '<th>Cultura</th>' +
                '<th>Tema</th>' +
                '<th>Situação</th>' +
                '<th>Fechamento</th>' +
                '<th>Ações</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}

function openSacModal(id) {
    editingId = null;
    document.getElementById('sacForm').reset();
    
    // Popular dropdowns
    loadSacDropdowns();
    
    if (id) {
        var sacItem = data.sac.find(function(s) { return s.id === id; });
        if (!sacItem) { alert('Ocorrência não encontrada!'); return; }
        editingId = id;
        document.getElementById('sacDescricaoOcorrencia').value = sacItem.descricao_ocorrencia || '';
        document.getElementById('sacDataAbertura').value = sacItem.data_abertura || '';
        document.getElementById('sacDataFechamento').value = sacItem.data_fechamento || '';
        document.getElementById('sacNivelSolucao').value = sacItem.nivel_solucao || '';
        document.getElementById('sacContatoLead').value = sacItem.contato_lead_id || '';
        document.getElementById('sacEmailContato').value = sacItem.email_contato || '';
        document.getElementById('sacPerfilCliente').value = sacItem.perfil_cliente || '';
        document.getElementById('sacMunicipio').value = sacItem.municipio || '';
        document.getElementById('sacUf').value = sacItem.uf || '';
        document.getElementById('sacCultura').value = sacItem.cultura_id || '';
        document.getElementById('sacTema').value = sacItem.tema_id || '';
        document.getElementById('sacSituacao').value = sacItem.situacao || 'Aberta';
        document.getElementById('sacObservacoes').value = sacItem.observacoes || '';
        document.getElementById('sacModalTitle').textContent = 'Editar Ocorrência SAC';
    } else {
        document.getElementById('sacDataAbertura').value = new Date().toISOString().split('T')[0];
        document.getElementById('sacSituacao').value = 'Aberta';
        document.getElementById('sacModalTitle').textContent = 'Nova Ocorrência SAC';
    }
    
    openModal('sacModal');
}

function loadSacDropdowns() {
    var contatoSelect = document.getElementById('sacContatoLead');
    contatoSelect.innerHTML = '<option value="">Selecione</option>';
    data.contatos_leads.forEach(function(c) {
        contatoSelect.innerHTML += '<option value="' + c.id + '">' + c.nome + '</option>';
    });
    
    var culturaSelect = document.getElementById('sacCultura');
    culturaSelect.innerHTML = '<option value="">Selecione</option>';
    data.culturas.forEach(function(c) {
        culturaSelect.innerHTML += '<option value="' + c.id + '">' + c.nome + '</option>';
    });
    
    var temaSelect = document.getElementById('sacTema');
    temaSelect.innerHTML = '<option value="">Selecione</option>';
    data.temas.forEach(function(t) {
        temaSelect.innerHTML += '<option value="' + t.id + '">' + t.nome + '</option>';
    });
}

function onSacContatoLeadChange() {
    var contatoLeadId = document.getElementById('sacContatoLead').value;
    
    if (contatoLeadId) {
        var contatoLead = data.contatos_leads.find(function(c) { return c.id === contatoLeadId; });
        if (contatoLead) {
            document.getElementById('sacEmailContato').value = contatoLead.email || '';
            document.getElementById('sacMunicipio').value = contatoLead.cidade || '';
            document.getElementById('sacUf').value = contatoLead.estado || '';
            
            // Preencher perfil: primeiro do cliente convertido, senão do tipo do contato/lead
            if (contatoLead.convertido_cliente && contatoLead.cliente_id) {
                var cliente = data.clientes.find(function(c) { return c.id === contatoLead.cliente_id; });
                if (cliente && cliente.tipo) {
                    document.getElementById('sacPerfilCliente').value = cliente.tipo;
                } else {
                    document.getElementById('sacPerfilCliente').value = contatoLead.tipo || '';  // NOVO
                }
            } else {
                document.getElementById('sacPerfilCliente').value = contatoLead.tipo || '';  // NOVO
            }
        }
    } else {
        document.getElementById('sacEmailContato').value = '';
        document.getElementById('sacPerfilCliente').value = '';
        document.getElementById('sacMunicipio').value = '';
        document.getElementById('sacUf').value = '';
    }
}







async function saveSac(e) {
    e.preventDefault();
    
    var sacData = {
        id: editingId || generateId(),
        descricao_ocorrencia: document.getElementById('sacDescricaoOcorrencia').value,
        data_abertura: document.getElementById('sacDataAbertura').value || null,
        data_fechamento: document.getElementById('sacDataFechamento').value || null,
        nivel_solucao: document.getElementById('sacNivelSolucao').value || null,
        contato_lead_id: document.getElementById('sacContatoLead').value || null,
        nome_contato: '',
        email_contato: document.getElementById('sacEmailContato').value || '',
        perfil_cliente: document.getElementById('sacPerfilCliente').value || '',
        municipio: document.getElementById('sacMunicipio').value || '',
        uf: document.getElementById('sacUf').value || '',
        cultura_id: document.getElementById('sacCultura').value || null,
        tema_id: document.getElementById('sacTema').value || null,
        situacao: document.getElementById('sacSituacao').value || 'Aberta',
        observacoes: document.getElementById('sacObservacoes').value || '',
        criador_id: currentUser.id,
        data_criacao: editingId ? (data.sac.find(function(s) { return s.id === editingId; }) || {}).data_criacao : new Date().toISOString()
    };
    
    // Preencher nome_contato a partir do contato/lead selecionado
    if (sacData.contato_lead_id) {
        var contatoLead = data.contatos_leads.find(function(c) { return c.id === sacData.contato_lead_id; });
        if (contatoLead) {
            sacData.nome_contato = contatoLead.nome;
        }
    }
    
    try {
        showLoadingIndicator('Salvando ocorrência SAC...');
        
        if (editingId) {
            await updateData('sac', editingId, sacData);
            var index = data.sac.findIndex(function(s) { return s.id === editingId; });
            data.sac[index] = sacData;
        } else {
            await insertData('sac', sacData);
            data.sac.push(sacData);
        }
        
        hideLoadingIndicator();
        closeModal('sacModal');
        renderSacView();
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar ocorrência SAC: ' + err.message);
    }
}

async function deleteSac(id) {
    if (confirm('Tem certeza que deseja excluir esta ocorrência SAC?')) {
        try {
            showLoadingIndicator('Excluindo ocorrência...');
            await deleteData('sac', id);
            data.sac = data.sac.filter(function(s) { return s.id !== id; });
            hideLoadingIndicator();
            renderSacView();
        } catch (err) {
            hideLoadingIndicator();
            alert('Erro ao excluir ocorrência: ' + err.message);
        }
    }
}

function exportSacToExcel() {
    if (data.sac.length === 0) {
        alert('Não há dados SAC para exportar!');
        return;
    }
    
    var exportData = data.sac.map(function(s) {
        var cultura = data.culturas.find(function(c) { return c.id === s.cultura_id; });
        var tema = data.temas.find(function(t) { return t.id === s.tema_id; });
        
        return {
            'Data Abertura': s.data_abertura || '',
            'Descrição da Ocorrência': s.descricao_ocorrencia || '',
            'Nome Contato/Lead': s.nome_contato || '',
            'E-mail Contato': s.email_contato || '',
            'Perfil Cliente': s.perfil_cliente || '',
            'Município': s.municipio || '',
            'UF': s.uf || '',
            'Nível Solução': s.nivel_solucao || '',
            'Cultura Agrícola': cultura ? cultura.nome : '',
            'Tema': tema ? tema.nome : '',
            'Situação': s.situacao || '',
            'Data Fechamento': s.data_fechamento || '',
            'Observações': s.observacoes || ''
        };
    });
    
    var ws = XLSX.utils.json_to_sheet(exportData);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SAC');
    XLSX.writeFile(wb, 'SAC_Embrapa_' + new Date().toISOString().slice(0, 10) + '.xlsx');
}

// ==================== RELATÓRIO SAC (PDF) ====================

function gerarRelatorioSac() {
    if (data.sac.length === 0) {
        alert('Não há dados SAC para gerar o relatório!');
        return;
    }
    
    // Limpar campos anteriores
    document.getElementById('relatorioSacDataInicio').value = '';
    document.getElementById('relatorioSacDataFim').value = '';
    
    // Remover listener anterior se existir
    var form = document.getElementById('relatorioSacFiltroForm');
    var newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var dataInicio = document.getElementById('relatorioSacDataInicio').value;
        var dataFim = document.getElementById('relatorioSacDataFim').value;
        
        closeModal('relatorioSacFiltroModal');
        
        _executarGeracaoRelatorioSac(dataInicio, dataFim);
    });
    
    openModal('relatorioSacFiltroModal');
}

function _executarGeracaoRelatorioSac(dataInicio, dataFim) {
    var sacFiltrado = data.sac.filter(function(s) {
        if (dataInicio && s.data_abertura && s.data_abertura < dataInicio) return false;
        if (dataFim && s.data_abertura && s.data_abertura > dataFim) return false;
        return true;
    });
    
    if (sacFiltrado.length === 0) {
        alert('Nenhuma ocorrência SAC encontrada no período informado.');
        return;
    }
    
    mostrarLoadingRelatorio('Gerando relatório SAC...');
    
    setTimeout(function() {
        try {
            var jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF('landscape', 'mm', 'a4');
            
            var startY = adicionarCabecalhoRelatorio(doc, 'Relatório SAC - Serviço de Atendimento ao Cliente');
            
            // Resumo
            var abertas = sacFiltrado.filter(function(s) { return s.situacao === 'Aberta'; }).length;
            var andamento = sacFiltrado.filter(function(s) { return s.situacao === 'Em Andamento'; }).length;
            var fechadas = sacFiltrado.filter(function(s) { return s.situacao === 'Fechada'; }).length;
            
            doc.setTextColor(23, 43, 77);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Resumo Estatístico', 14, startY);
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text('Total: ' + sacFiltrado.length + ' | Abertas: ' + abertas + ' | Em Andamento: ' + andamento + ' | Fechadas: ' + fechadas, 14, startY + 8);
            
            if (dataInicio || dataFim) {
                var formatDatePdf = function(d) {
                    if (!d) return '';
                    var p = d.split('-');
                    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : d;
                };
                doc.text('Período: ' + (dataInicio ? formatDatePdf(dataInicio) : 'início') + ' a ' + (dataFim ? formatDatePdf(dataFim) : 'hoje'), 14, startY + 14);
                startY += 8;
            }
            
            startY += 18;
            
            var tableData = sacFiltrado.map(function(s) {
                var cultura = data.culturas.find(function(c) { return c.id === s.cultura_id; });
                var tema = data.temas.find(function(t) { return t.id === s.tema_id; });
                
                return [
                    s.data_abertura || '-',
                    (s.descricao_ocorrencia || '-').substring(0, 40),
                    s.nome_contato || '-',
                    s.email_contato || '-',
                    s.perfil_cliente || '-',
                    (s.municipio || '-') + '/' + (s.uf || '-'),
                    s.nivel_solucao || '-',
                    cultura ? cultura.nome : '-',
                    tema ? tema.nome : '-',
                    s.situacao || '-',
                    s.data_fechamento || '-'
                ];
            });
            
            doc.autoTable({
                startY: startY,
                head: [[
                    'Abertura', 'Descrição', 'Contato', 'E-mail', 'Perfil',
                    'Município/UF', 'Nível', 'Cultura', 'Tema', 'Situação', 'Fechamento'
                ]],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [0, 121, 191],
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
                    fillColor: [240, 248, 255]
                },
                margin: { left: 14, right: 14 },
                didParseCell: function(cellData) {
                    if (cellData.column.index === 9 && cellData.section === 'body') {
                        if (cellData.cell.raw === 'Aberta') {
                            cellData.cell.styles.textColor = [0, 121, 191];
                            cellData.cell.styles.fontStyle = 'bold';
                        } else if (cellData.cell.raw === 'Fechada') {
                            cellData.cell.styles.textColor = [97, 189, 79];
                            cellData.cell.styles.fontStyle = 'bold';
                        } else if (cellData.cell.raw === 'Em Andamento') {
                            cellData.cell.styles.textColor = [255, 159, 26];
                            cellData.cell.styles.fontStyle = 'bold';
                        }
                    }
                }
            });
            
            adicionarRodapeRelatorio(doc);
            doc.save('Relatorio_SAC_' + new Date().toISOString().slice(0, 10) + '.pdf');
            
        } catch (error) {
            console.error('Erro ao gerar relatório SAC:', error);
            alert('Erro ao gerar o relatório SAC.');
        }
        
        esconderLoadingRelatorio();
    }, 100);
}




// ==================== DASHBOARD SAC ====================

function renderDashboardSac() {
    var container = document.getElementById('dashboardSAC');
    if (!container) return;
    
    if (data.sac.length === 0) {
        container.innerHTML = '<p class="empty-message" style="padding: 40px; text-align: center;">' +
            '<i class="fas fa-headset" style="font-size: 40px; color: var(--gray); display: block; margin-bottom: 10px;"></i>' +
            'Nenhuma ocorrência SAC cadastrada.' +
        '</p>';
        return;
    }
    
    var html = '<div class="charts-grid">';
    
    // Gráfico 1: Situação das Ocorrências
    html += '<div class="chart-card"><h3>Situação das Ocorrências</h3><canvas id="chartSacSituacao"></canvas></div>';
    
    // Gráfico 2: Nível de Solução
    html += '<div class="chart-card"><h3>Nível de Solução</h3><canvas id="chartSacNivel"></canvas></div>';
    
    // Gráfico 3: Por Cultura Agrícola
    html += '<div class="chart-card"><h3>Por Cultura Agrícola</h3><canvas id="chartSacCultura"></canvas></div>';
    
    // Gráfico 4: Por Tema
    html += '<div class="chart-card"><h3>Por Tema</h3><canvas id="chartSacTema"></canvas></div>';
    
    // Gráfico 5: Por Perfil do Cliente
    html += '<div class="chart-card"><h3>Por Perfil do Cliente</h3><canvas id="chartSacPerfil"></canvas></div>';
    
    // Gráfico 6: Evolução Mensal
    html += '<div class="chart-card"><h3>Evolução Mensal de Ocorrências</h3><canvas id="chartSacMensal"></canvas></div>';
    
    // Gráfico 7: Por UF
    html += '<div class="chart-card"><h3>Por Estado (UF)</h3><canvas id="chartSacUf"></canvas></div>';
    
    // Gráfico 8: Tempo Médio de Resolução
    html += '<div class="chart-card"><h3>Ocorrências por Município (Top 10)</h3><canvas id="chartSacMunicipio"></canvas></div>';
    
    html += '</div>';
    
    container.innerHTML = html;
    
    // Renderizar gráficos
    setTimeout(function() {
        renderSacCharts();
    }, 100);
}

function renderSacCharts() {
    // Destruir gráficos anteriores do SAC
    ['chartSacSituacao', 'chartSacNivel', 'chartSacCultura', 'chartSacTema',
     'chartSacPerfil', 'chartSacMensal', 'chartSacUf', 'chartSacMunicipio'].forEach(function(key) {
        if (chartInstances[key]) {
            chartInstances[key].destroy();
            delete chartInstances[key];
        }
    });
    
    // 1. Situação
    var situacaoData = {};
    data.sac.forEach(function(s) {
        var sit = s.situacao || 'Não definida';
        situacaoData[sit] = (situacaoData[sit] || 0) + 1;
    });
    renderPieChart('chartSacSituacao', situacaoData);
    
    // 2. Nível de Solução
    var nivelData = {};
    data.sac.forEach(function(s) {
        var nivel = s.nivel_solucao || 'Não definido';
        nivelData[nivel] = (nivelData[nivel] || 0) + 1;
    });
    renderPieChart('chartSacNivel', nivelData);
    
    // 3. Cultura
    var culturaData = {};
    data.sac.forEach(function(s) {
        var cultura = data.culturas.find(function(c) { return c.id === s.cultura_id; });
        var nome = cultura ? cultura.nome : 'Não informada';
        culturaData[nome] = (culturaData[nome] || 0) + 1;
    });
    renderPieChart('chartSacCultura', culturaData);
    
    // 4. Tema
    var temaData = {};
    data.sac.forEach(function(s) {
        var tema = data.temas.find(function(t) { return t.id === s.tema_id; });
        var nome = tema ? tema.nome : 'Não informado';
        temaData[nome] = (temaData[nome] || 0) + 1;
    });
    renderPieChart('chartSacTema', temaData);
    
    // 5. Perfil
    var perfilData = {};
    data.sac.forEach(function(s) {
        var perfil = s.perfil_cliente || 'Não informado';
        perfilData[perfil] = (perfilData[perfil] || 0) + 1;
    });
    renderPieChart('chartSacPerfil', perfilData);
    
    // 6. Evolução Mensal
    var mensalData = {};
    data.sac.forEach(function(s) {
        if (!s.data_abertura) return;
        var mes = s.data_abertura.substring(0, 7);
        mensalData[mes] = (mensalData[mes] || 0) + 1;
    });
    renderBarChart('chartSacMensal', mensalData);
    
    // 7. Por UF
    var ufData = {};
    data.sac.forEach(function(s) {
        var uf = s.uf || 'Não informado';
        ufData[uf] = (ufData[uf] || 0) + 1;
    });
    renderBarChart('chartSacUf', ufData);
    
    // 8. Por Município (Top 10)
    var municipioData = {};
    data.sac.forEach(function(s) {
        var mun = s.municipio || 'Não informado';
        municipioData[mun] = (municipioData[mun] || 0) + 1;
    });
    // Pegar top 10
    var municipioEntries = Object.entries(municipioData).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 10);
    var municipioTop10 = {};
    municipioEntries.forEach(function(entry) { municipioTop10[entry[0]] = entry[1]; });
    renderBarChart('chartSacMunicipio', municipioTop10);
}


// ==================== FONTE DE RECURSOS ====================

function renderFonteRecursoGrid() {
    var container = document.getElementById('cadastroForm');
    container.innerHTML = 
        '<div class="filter-bar-cadastro">' +
            '<input type="text" id="filtroFonteRecurso" placeholder="Filtrar por nome ou tipo..." ' +
                'onkeyup="filtrarFontesRecursos()" class="filter-input-cadastro">' +
            '<button type="button" onclick="openFonteRecursoModal()" class="btn-submit btn-blue" style="margin-left: 10px;">' +
                '<i class="fas fa-plus"></i> Nova Fonte de Recursos' +
            '</button>' +
        '</div>';
    
    renderFonteRecursoTable(data.fontes_recursos);
}

function filtrarFontesRecursos() {
    var filtro = document.getElementById('filtroFonteRecurso').value.toLowerCase();
    var filtrados = data.fontes_recursos.filter(function(f) {
        return (f.nome || '').toLowerCase().indexOf(filtro) !== -1 ||
               (f.tipo || '').toLowerCase().indexOf(filtro) !== -1;
    });
    renderFonteRecursoTable(filtrados);
}

function renderFonteRecursoTable(fontes) {
    var grid = document.getElementById('cadastroGrid');
    
    if (fontes.length === 0) {
        grid.innerHTML = '<p class="empty-message">Nenhuma fonte de recursos cadastrada</p>';
        return;
    }
    
    var rowsHTML = '';
    fontes.forEach(function(f) {
        var descResumo = f.descricao ? f.descricao.substring(0, 80) + (f.descricao.length > 80 ? '...' : '') : '-';
        
        var tipoBadgeColor = '#6B778C';
        if (f.tipo === 'Público') tipoBadgeColor = '#0079BF';
        else if (f.tipo === 'Privado') tipoBadgeColor = '#61BD4F';
        else if (f.tipo === 'Venture Capital') tipoBadgeColor = '#C377E0';
        else if (f.tipo === 'Investidor-Anjo') tipoBadgeColor = '#FF9F1A';
        else if (f.tipo === 'Banco de Desenvolvimento') tipoBadgeColor = '#00C2E0';
        else if (f.tipo === 'Fundação de Apoio') tipoBadgeColor = '#51E898';
        else if (f.tipo === 'Emendas Parlamentares') tipoBadgeColor = '#EB5A46';
        else if (f.tipo === 'Private Equity') tipoBadgeColor = '#344563';
        
        rowsHTML += '<tr>' +
            '<td><strong>' + (f.nome || '-') + '</strong></td>' +
            '<td>' +
                '<span style="display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; ' +
                'background: ' + tipoBadgeColor + '22; color: ' + tipoBadgeColor + '; border: 1px solid ' + tipoBadgeColor + '44;">' +
                (f.tipo || '-') + '</span>' +
            '</td>' +
            '<td>' + descResumo + '</td>' +
            '<td>' +
                '<button type="button" class="btn-edit" onclick="openFonteRecursoModal(\'' + f.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button type="button" class="btn-delete" onclick="deleteFonteRecurso(\'' + f.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</td>' +
        '</tr>';
    });
    
    grid.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Nome</th>' +
                '<th>Tipo</th>' +
                '<th>Descrição</th>' +
                '<th>Ações</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}

function openFonteRecursoModal(id) {
    editingId = null;
    document.getElementById('fonteRecursoForm').reset();
    
    if (id) {
        var fonte = data.fontes_recursos.find(function(f) { return f.id === id; });
        if (!fonte) { alert('Fonte de recursos não encontrada!'); return; }
        editingId = id;
        document.getElementById('fonteRecursoNome').value = fonte.nome || '';
        document.getElementById('fonteRecursoTipo').value = fonte.tipo || '';
        document.getElementById('fonteRecursoDescricao').value = fonte.descricao || '';
        document.getElementById('fonteRecursoModalTitle').textContent = 'Editar Fonte de Recursos';
    } else {
        document.getElementById('fonteRecursoModalTitle').textContent = 'Nova Fonte de Recursos';
    }
    
    openModal('fonteRecursoModal');
}

async function saveFonteRecurso(e) {
    e.preventDefault();
    
    var fonteData = {
        id: editingId || generateId(),
        nome: document.getElementById('fonteRecursoNome').value,
        tipo: document.getElementById('fonteRecursoTipo').value,
        descricao: document.getElementById('fonteRecursoDescricao').value,
        criador_id: currentUser.id
    };
    
    try {
        showLoadingIndicator('Salvando fonte de recursos...');
        
        if (editingId) {
            await updateData('fontes_recursos', editingId, fonteData);
            var index = data.fontes_recursos.findIndex(function(f) { return f.id === editingId; });
            data.fontes_recursos[index] = fonteData;
        } else {
            fonteData.data_criacao = new Date().toISOString();
            await insertData('fontes_recursos', fonteData);
            data.fontes_recursos.push(fonteData);
        }
        
        hideLoadingIndicator();
        closeModal('fonteRecursoModal');
        renderFonteRecursoGrid();
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar fonte de recursos: ' + err.message);
    }
}

async function deleteFonteRecurso(id) {
    if (confirm('Tem certeza que deseja excluir esta fonte de recursos?')) {
        try {
            showLoadingIndicator('Excluindo fonte de recursos...');
            await deleteData('fontes_recursos', id);
            data.fontes_recursos = data.fontes_recursos.filter(function(f) { return f.id !== id; });
            hideLoadingIndicator();
            renderFonteRecursoGrid();
        } catch (err) {
            hideLoadingIndicator();
            alert('Erro ao excluir fonte de recursos: ' + err.message);
        }
    }
}




// ==================== EDITAIS / PROGRAMAS DE FINANCIAMENTO ====================

function renderEditalProgramaGrid() {
    var container = document.getElementById('cadastroForm');
    container.innerHTML = 
        '<div class="filter-bar-cadastro" style="flex-wrap: wrap; gap: 10px;">' +
            '<input type="text" id="filtroEditalCodigo" placeholder="Filtrar por código..." ' +
                'onkeyup="filtrarEditaisProgramas()" class="filter-input-cadastro" style="max-width: 200px;">' +
            '<select id="filtroEditalTipo" onchange="filtrarEditaisProgramas()" style="padding: 10px; border: 2px solid var(--light-gray); border-radius: 6px; font-size: 14px; min-width: 180px;">' +
                '<option value="">Todos os Tipos de Recurso</option>' +
                '<option value="Subvenção econômica">Subvenção econômica</option>' +
                '<option value="Inovação Aberta">Inovação Aberta</option>' +
                '<option value="Fundo Perdido">Fundo Perdido</option>' +
                '<option value="Outros">Outros</option>' +
            '</select>' +
            '<select id="filtroEditalSituacao" onchange="filtrarEditaisProgramas()" style="padding: 10px; border: 2px solid var(--light-gray); border-radius: 6px; font-size: 14px; min-width: 150px;">' +
                '<option value="">Todas as Situações</option>' +
                '<option value="Aberta">Aberta</option>' +
                '<option value="Andamento">Andamento</option>' +
                '<option value="Concluída">Concluída</option>' +
            '</select>' +
            '<div style="display: flex; align-items: center; gap: 6px;">' +
                '<label style="font-size: 12px; font-weight: 600; color: var(--dark-blue); white-space: nowrap;">Publicação:</label>' +
                '<input type="date" id="filtroEditalDataPubInicio" onchange="filtrarEditaisProgramas()" ' +
                    'style="padding: 8px; border: 2px solid var(--light-gray); border-radius: 6px; font-size: 13px;">' +
                '<span style="font-size: 11px; color: var(--gray);">até</span>' +
                '<input type="date" id="filtroEditalDataPubFim" onchange="filtrarEditaisProgramas()" ' +
                    'style="padding: 8px; border: 2px solid var(--light-gray); border-radius: 6px; font-size: 13px;">' +
            '</div>' +
            '<button type="button" onclick="limparFiltrosEditais()" class="btn-clear-filters" style="padding: 10px 15px;">' +
                '<i class="fas fa-eraser"></i> Limpar' +
            '</button>' +
            '<button type="button" onclick="openEditalProgramaModal()" class="btn-submit btn-blue" style="margin-left: auto;">' +
                '<i class="fas fa-plus"></i> Novo Edital / Programa' +
            '</button>' +
        '</div>';
    
    renderEditalProgramaTable(data.editais_programas);
}

function filtrarEditaisProgramas() {
    var filtroCodigo = (document.getElementById('filtroEditalCodigo').value || '').toLowerCase();
    var filtroTipo = document.getElementById('filtroEditalTipo').value;
    var filtroSituacao = document.getElementById('filtroEditalSituacao').value;
    var filtroDataInicio = document.getElementById('filtroEditalDataPubInicio').value;
    var filtroDataFim = document.getElementById('filtroEditalDataPubFim').value;
    
    var filtrados = data.editais_programas.filter(function(e) {
        if (filtroCodigo && (e.codigo || '').toLowerCase().indexOf(filtroCodigo) === -1) return false;
        if (filtroTipo && e.tipo_recurso !== filtroTipo) return false;
        if (filtroSituacao && e.situacao !== filtroSituacao) return false;
        if (filtroDataInicio && e.data_publicacao && e.data_publicacao < filtroDataInicio) return false;
        if (filtroDataFim && e.data_publicacao && e.data_publicacao > filtroDataFim) return false;
        if ((filtroDataInicio || filtroDataFim) && !e.data_publicacao) return false;
        return true;
    });
    
    renderEditalProgramaTable(filtrados);
}

function limparFiltrosEditais() {
    document.getElementById('filtroEditalCodigo').value = '';
    document.getElementById('filtroEditalTipo').value = '';
    document.getElementById('filtroEditalSituacao').value = '';
    document.getElementById('filtroEditalDataPubInicio').value = '';
    document.getElementById('filtroEditalDataPubFim').value = '';
    renderEditalProgramaTable(data.editais_programas);
}

function renderEditalProgramaTable(editais) {
    var grid = document.getElementById('cadastroGrid');
    
    if (editais.length === 0) {
        grid.innerHTML = '<p class="empty-message">Nenhum edital/programa de financiamento encontrado</p>';
        return;
    }
    
    var formatDate = function(dateStr) {
        if (!dateStr) return '-';
        var partes = dateStr.split('-');
        if (partes.length === 3) return partes[2] + '/' + partes[1] + '/' + partes[0];
        return dateStr;
    };
    
    var rowsHTML = '';
    editais.forEach(function(e) {
        var fonte = data.fontes_recursos.find(function(f) { return f.id === e.fonte_recurso_id; });
        var tema = data.temas.find(function(t) { return t.id === e.tema_id; });
        
        var situacaoClass = '';
        var situacaoBg = '';
        if (e.situacao === 'Aberta') { situacaoClass = 'color: #2E7D32; font-weight: 600;'; situacaoBg = 'background: #E8F5E9; padding: 3px 10px; border-radius: 12px; font-size: 11px;'; }
        else if (e.situacao === 'Andamento') { situacaoClass = 'color: #E65100; font-weight: 600;'; situacaoBg = 'background: #FFF3E0; padding: 3px 10px; border-radius: 12px; font-size: 11px;'; }
        else if (e.situacao === 'Concluída') { situacaoClass = 'color: #6B778C; font-weight: 600;'; situacaoBg = 'background: #ECEFF1; padding: 3px 10px; border-radius: 12px; font-size: 11px;'; }
        
        var interesseClass = '';
        if (e.grau_interesse === 'Alto') interesseClass = 'color: #C62828; font-weight: 700;';
        else if (e.grau_interesse === 'Médio') interesseClass = 'color: #E65100; font-weight: 600;';
        else if (e.grau_interesse === 'Baixo') interesseClass = 'color: #6B778C;';
        
        rowsHTML += '<tr>' +
            '<td><strong>' + (e.nome || '-') + '</strong></td>' +
            '<td>' + (e.codigo || '-') + '</td>' +
            '<td>' + (fonte ? fonte.nome : '-') + '</td>' +
            '<td>' + (e.tipo_recurso || '-') + '</td>' +
            '<td><span style="' + situacaoClass + situacaoBg + '">' + (e.situacao || '-') + '</span></td>' +
            '<td>' + (tema ? tema.nome : '-') + '</td>' +
            '<td>' + formatDate(e.data_publicacao) + '</td>' +
            '<td>' + formatDate(e.prazo_final_submissao) + '</td>' +
            '<td style="text-align: right; color: var(--green); font-weight: 600;">' + (e.valor_total_disponivel ? 'R$ ' + formatCurrency(e.valor_total_disponivel) : '-') + '</td>' +
            '<td style="' + interesseClass + '">' + (e.grau_interesse || '-') + '</td>' +
            '<td>' +
                '<button type="button" class="btn-edit" onclick="openEditalProgramaModal(\'' + e.id + '\')"><i class="fas fa-edit"></i></button>' +
                '<button type="button" class="btn-delete" onclick="deleteEditalPrograma(\'' + e.id + '\')"><i class="fas fa-trash"></i></button>' +
            '</td>' +
        '</tr>';
    });
    
    grid.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th>Nome do Edital/Programa</th>' +
                '<th>Código</th>' +
                '<th>Instituição/Fonte</th>' +
                '<th>Tipo Recurso</th>' +
                '<th>Situação</th>' +
                '<th>Área Temática</th>' +
                '<th>Publicação</th>' +
                '<th>Prazo Submissão</th>' +
                '<th>Valor Disponível</th>' +
                '<th>Interesse</th>' +
                '<th>Ações</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}





function openEditalProgramaModal(id) {
    editingId = null;
    editalArquivos = [];    // NOVO: limpar arquivos
    document.getElementById('editalProgramaForm').reset();
    document.getElementById('editalArquivosBody').innerHTML = '';    // NOVO: limpar grid
    
    // Popular dropdowns
    loadEditalProgramaDropdowns();
    
    if (id) {
        var edital = data.editais_programas.find(function(e) { return e.id === id; });
        if (!edital) { alert('Edital/Programa não encontrado!'); return; }
        editingId = id;
        
        document.getElementById('editalNome').value = edital.nome || '';
        document.getElementById('editalCodigo').value = edital.codigo || '';
        document.getElementById('editalFonteRecurso').value = edital.fonte_recurso_id || '';
        document.getElementById('editalTipoFonte').value = edital.tipo_fonte || '';
        document.getElementById('editalSituacao').value = edital.situacao || '';
        document.getElementById('editalTema').value = edital.tema_id || '';
        document.getElementById('editalDataPublicacao').value = edital.data_publicacao || '';
        document.getElementById('editalPrazoSubmissao').value = edital.prazo_final_submissao || '';
        document.getElementById('editalPrevisaoResultado').value = edital.previsao_resultado || '';
        document.getElementById('editalTipoRecurso').value = edital.tipo_recurso || '';
        document.getElementById('editalValorTotal').value = edital.valor_total_disponivel || '';
        document.getElementById('editalValorMaxProjeto').value = edital.valor_maximo_projeto || '';
        document.getElementById('editalContrapartida').value = edital.contrapartida_exigida || '';
        document.getElementById('editalItensFinanciaveis').value = edital.itens_financiaveis || '';
        document.getElementById('editalPublicoAlvo').value = edital.publico_alvo || '';
        document.getElementById('editalRequisitosEquipe').value = edital.requisitos_equipe || '';
        document.getElementById('editalLinkOficial').value = edital.link_oficial || '';
        document.getElementById('editalGrauInteresse').value = edital.grau_interesse || '';
        document.getElementById('editalObservacao').value = edital.observacao || '';
        
        // NOVO: carregar arquivos existentes
        if (edital.arquivos && Array.isArray(edital.arquivos)) {
            editalArquivos = edital.arquivos.slice();
            renderEditalArquivosGrid();
        }
        
        document.getElementById('editalProgramaModalTitle').textContent = 'Editar Edital / Programa de Financiamento';
    } else {
        document.getElementById('editalProgramaModalTitle').textContent = 'Novo Edital / Programa de Financiamento';
    }
    
    openModal('editalProgramaModal');
}







function loadEditalProgramaDropdowns() {
    // Fonte de Recursos
    var fonteSelect = document.getElementById('editalFonteRecurso');
    fonteSelect.innerHTML = '<option value="">Selecione</option>';
    data.fontes_recursos.slice().sort(function(a, b) {
        return a.nome.localeCompare(b.nome);
    }).forEach(function(f) {
        fonteSelect.innerHTML += '<option value="' + f.id + '">' + f.nome + '</option>';
    });
    
    // Temas
    var temaSelect = document.getElementById('editalTema');
    temaSelect.innerHTML = '<option value="">Selecione</option>';
    data.temas.slice().sort(function(a, b) {
        return a.nome.localeCompare(b.nome);
    }).forEach(function(t) {
        temaSelect.innerHTML += '<option value="' + t.id + '">' + t.nome + '</option>';
    });
}

function onEditalFonteRecursoChange() {
    var fonteId = document.getElementById('editalFonteRecurso').value;
    var tipoInput = document.getElementById('editalTipoFonte');
    
    if (fonteId) {
        var fonte = data.fontes_recursos.find(function(f) { return f.id === fonteId; });
        tipoInput.value = fonte ? (fonte.tipo || '') : '';
    } else {
        tipoInput.value = '';
    }
}




async function saveEditalPrograma(e) {
    e.preventDefault();
    
    var editalData = {
        id: editingId || generateId(),
        nome: document.getElementById('editalNome').value,
        codigo: document.getElementById('editalCodigo').value,
        fonte_recurso_id: document.getElementById('editalFonteRecurso').value || null,
        tipo_fonte: document.getElementById('editalTipoFonte').value || null,
        situacao: document.getElementById('editalSituacao').value || null,
        tema_id: document.getElementById('editalTema').value || null,
        data_publicacao: document.getElementById('editalDataPublicacao').value || null,
        prazo_final_submissao: document.getElementById('editalPrazoSubmissao').value || null,
        previsao_resultado: document.getElementById('editalPrevisaoResultado').value || null,
        tipo_recurso: document.getElementById('editalTipoRecurso').value || null,
        valor_total_disponivel: parseFloat(document.getElementById('editalValorTotal').value) || null,
        valor_maximo_projeto: parseFloat(document.getElementById('editalValorMaxProjeto').value) || null,
        contrapartida_exigida: document.getElementById('editalContrapartida').value || null,
        itens_financiaveis: document.getElementById('editalItensFinanciaveis').value || null,
        publico_alvo: document.getElementById('editalPublicoAlvo').value || null,
        requisitos_equipe: document.getElementById('editalRequisitosEquipe').value || null,
        link_oficial: document.getElementById('editalLinkOficial').value || null,
        grau_interesse: document.getElementById('editalGrauInteresse').value || null,
        observacao: document.getElementById('editalObservacao').value || null,
        arquivos: editalArquivos,    // NOVO: salvar arquivos
        criador_id: currentUser.id
    };
    
    try {
        showLoadingIndicator('Salvando edital/programa...');
        
        if (editingId) {
            await updateData('editais_programas', editingId, editalData);
            var index = data.editais_programas.findIndex(function(e) { return e.id === editingId; });
            data.editais_programas[index] = editalData;
        } else {
            editalData.data_criacao = new Date().toISOString();
            await insertData('editais_programas', editalData);
            data.editais_programas.push(editalData);
        }
        
        hideLoadingIndicator();
        closeModal('editalProgramaModal');
        renderEditalProgramaGrid();
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar edital/programa: ' + err.message);
    }
}





async function deleteEditalPrograma(id) {
    if (confirm('Tem certeza que deseja excluir este edital/programa de financiamento?')) {
        try {
            showLoadingIndicator('Excluindo edital/programa...');
            await deleteData('editais_programas', id);
            data.editais_programas = data.editais_programas.filter(function(e) { return e.id !== id; });
            hideLoadingIndicator();
            renderEditalProgramaGrid();
        } catch (err) {
            hideLoadingIndicator();
            alert('Erro ao excluir edital/programa: ' + err.message);
        }
    }
}


// ==================== ARQUIVOS DO EDITAL/PROGRAMA ====================

function handleEditalFileUpload(event) {
    var files = event.target.files;
    var maxFileSize = 10 * 1024 * 1024; // 10MB por arquivo
    
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
    
    Array.from(files).forEach(function(file) {
        if (file.size > maxFileSize) {
            alert('O arquivo "' + file.name + '" excede o tamanho máximo de 10MB!');
            return;
        }
        
        if (tiposPermitidos.indexOf(file.type) === -1) {
            alert('Tipo de arquivo não permitido: ' + file.name + '\nFormatos aceitos: PDF, Word, Excel, PowerPoint, JPG, PNG');
            return;
        }
        
        var reader = new FileReader();
        reader.onload = function(e) {
            editalArquivos.push({
                id: generateId(),
                nome: file.name,
                tipo: file.type,
                tamanho: file.size,
                descricao: '',
                data: e.target.result,
                data_upload: new Date().toISOString()
            });
            renderEditalArquivosGrid();
        };
        reader.readAsDataURL(file);
    });
    
    event.target.value = '';
}

function renderEditalArquivosGrid() {
    var tbody = document.getElementById('editalArquivosBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (editalArquivos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--gray); padding: 20px;">' +
            '<i class="fas fa-cloud-upload-alt" style="font-size: 20px; display: block; margin-bottom: 8px;"></i>' +
            'Nenhum documento anexado. Use o botão acima para adicionar arquivos.' +
            '</td></tr>';
        return;
    }
    
    editalArquivos.forEach(function(file, index) {
        var tipoClasse = getEditalFileTipoClasse(file.tipo);
        var tipoLabel = getEditalFileTipoLabel(file.tipo);
        var tamanhoFormatado = formatFileSize(file.tamanho);
        
        var dataUploadFormatada = '';
        if (file.data_upload) {
            var d = new Date(file.data_upload);
            dataUploadFormatada = d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
        }
        
        tbody.innerHTML += 
            '<tr>' +
                '<td>' +
                    '<div style="display: flex; align-items: center; gap: 8px;">' +
                        '<span class="arquivo-tipo-badge ' + tipoClasse + '">' + tipoLabel + '</span>' +
                        '<div>' +
                            '<strong style="font-size: 12px;">' + file.nome + '</strong>' +
                            '<div style="font-size: 10px; color: var(--gray);">' + tamanhoFormatado +
                                (dataUploadFormatada ? ' — ' + dataUploadFormatada : '') +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</td>' +
                '<td>' +
                    '<input type="text" value="' + (file.descricao || '') + '" ' +
                        'placeholder="Adicione uma descrição..." ' +
                        'onchange="updateEditalFileDescricao(' + index + ', this.value)" ' +
                        'style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px;">' +
                '</td>' +
                '<td style="white-space: nowrap; text-align: center;">' +
                    '<button type="button" class="btn-download-ativo-file" onclick="downloadEditalFile(' + index + ')" title="Baixar arquivo">' +
                        '<i class="fas fa-download"></i>' +
                    '</button>' +
                    (isEditalFilePreviewable(file.tipo) ? 
                        '<button type="button" class="btn-preview-ativo-file" onclick="previewEditalFile(' + index + ')" title="Visualizar">' +
                            '<i class="fas fa-eye"></i>' +
                        '</button>' : '') +
                    '<button type="button" class="btn-remove-row" onclick="removeEditalFile(' + index + ')" title="Remover arquivo">' +
                        '<i class="fas fa-trash"></i>' +
                    '</button>' +
                '</td>' +
            '</tr>';
    });
}

function getEditalFileTipoClasse(mimeType) {
    if (!mimeType) return 'arquivo-tipo-outro';
    if (mimeType.indexOf('pdf') !== -1) return 'arquivo-tipo-pdf';
    if (mimeType.indexOf('word') !== -1 || mimeType.indexOf('msword') !== -1) return 'arquivo-tipo-doc';
    if (mimeType.indexOf('excel') !== -1 || mimeType.indexOf('spreadsheet') !== -1) return 'arquivo-tipo-xls';
    if (mimeType.indexOf('powerpoint') !== -1 || mimeType.indexOf('presentation') !== -1) return 'arquivo-tipo-ppt';
    if (mimeType.indexOf('image') !== -1) return 'arquivo-tipo-img';
    return 'arquivo-tipo-outro';
}

function getEditalFileTipoLabel(mimeType) {
    if (!mimeType) return 'Outro';
    if (mimeType.indexOf('pdf') !== -1) return 'PDF';
    if (mimeType.indexOf('word') !== -1 || mimeType.indexOf('msword') !== -1) return 'Word';
    if (mimeType.indexOf('excel') !== -1 || mimeType.indexOf('spreadsheet') !== -1) return 'Excel';
    if (mimeType.indexOf('powerpoint') !== -1 || mimeType.indexOf('presentation') !== -1) return 'PPT';
    if (mimeType.indexOf('jpeg') !== -1 || mimeType.indexOf('jpg') !== -1) return 'JPG';
    if (mimeType.indexOf('png') !== -1) return 'PNG';
    return 'Outro';
}

function isEditalFilePreviewable(mimeType) {
    if (!mimeType) return false;
    return mimeType.indexOf('pdf') !== -1 || mimeType.indexOf('image') !== -1;
}

function updateEditalFileDescricao(index, value) {
    if (editalArquivos[index]) {
        editalArquivos[index].descricao = value;
    }
}

function downloadEditalFile(index) {
    var file = editalArquivos[index];
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

function previewEditalFile(index) {
    var file = editalArquivos[index];
    if (!file || !file.data) {
        alert('Arquivo não disponível para visualização!');
        return;
    }
    
    var newWindow = window.open();
    if (file.tipo.indexOf('pdf') !== -1) {
        newWindow.document.write(
            '<html><head><title>' + file.nome + '</title></head>' +
            '<body style="margin:0;">' +
            '<embed width="100%" height="100%" src="' + file.data + '" type="application/pdf">' +
            '</body></html>'
        );
    } else if (file.tipo.indexOf('image') !== -1) {
        newWindow.document.write(
            '<html><head><title>' + file.nome + '</title></head>' +
            '<body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#333;">' +
            '<img src="' + file.data + '" style="max-width:100%; max-height:100vh;">' +
            '</body></html>'
        );
    }
}

function removeEditalFile(index) {
    if (confirm('Tem certeza que deseja remover o arquivo "' + editalArquivos[index].nome + '"?')) {
        editalArquivos.splice(index, 1);
        renderEditalArquivosGrid();
    }
}



// ==================== RELATÓRIO PIPELINE ====================

function gerarRelatorioPipeline() {
    if (data.cards.length === 0) {
        alert('Não há negociações cadastradas para gerar o relatório!');
        return;
    }
    
    // Limpar campos anteriores
    document.getElementById('relatorioPipelineDataInicio').value = '';
    document.getElementById('relatorioPipelineDataFim').value = '';
    document.getElementById('relatorioPipelineSituacao').value = '';
    
    // Remover listener anterior se existir
    var form = document.getElementById('relatorioPipelineFiltroForm');
    var newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var dataInicio = document.getElementById('relatorioPipelineDataInicio').value;
        var dataFim = document.getElementById('relatorioPipelineDataFim').value;
        var situacao = document.getElementById('relatorioPipelineSituacao').value;
        
        closeModal('relatorioPipelineFiltroModal');
        
        _executarGeracaoRelatorioPipeline(dataInicio, dataFim, situacao);
    });
    
    openModal('relatorioPipelineFiltroModal');
}

function _executarGeracaoRelatorioPipeline(dataInicio, dataFim, situacao) {
    // Filtrar negociações
    var cardsFiltrados = data.cards.filter(function(card) {
        // Filtro por situação
        if (situacao && card.situacao !== situacao) return false;
        
        // Filtro por data de previsão de fechamento
        if (dataInicio || dataFim) {
            if (!card.data_fechamento) return false;
            if (dataInicio && card.data_fechamento < dataInicio) return false;
            if (dataFim && card.data_fechamento > dataFim) return false;
        }
        
        return true;
    });
    
    if (cardsFiltrados.length === 0) {
        alert('Nenhuma negociação encontrada com os filtros informados.');
        return;
    }
    
    mostrarLoadingRelatorio('Gerando relatório de Pipeline...');
    
    setTimeout(function() {
        try {
            var jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF('landscape', 'mm', 'a4');
            
            var startY = adicionarCabecalhoRelatorio(doc, 'Relatório de Pipeline de Negociações');
            
            // Formatador de data
            var formatDatePdf = function(d) {
                if (!d) return '-';
                var p = d.split('-');
                return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : d;
            };
            
            // --- Resumo Estatístico ---
            doc.setTextColor(23, 43, 77);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Resumo Estatístico', 14, startY);
            
            var totalNegociacoes = cardsFiltrados.length;
            var novas = cardsFiltrados.filter(function(c) { return c.situacao === 'Nova'; }).length;
            var andamento = cardsFiltrados.filter(function(c) { return c.situacao === 'Em Andamento'; }).length;
            var contratadas = cardsFiltrados.filter(function(c) { return c.situacao === 'Contratada'; }).length;
            var perdidas = cardsFiltrados.filter(function(c) { return c.situacao === 'Perdida'; }).length;
            
            var valorTotal = 0;
            cardsFiltrados.forEach(function(c) { valorTotal += calculateCardTotal(c); });
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text('Total de Negociações: ' + totalNegociacoes + 
                ' | Novas: ' + novas + 
                ' | Em Andamento: ' + andamento + 
                ' | Contratadas: ' + contratadas + 
                ' | Perdidas: ' + perdidas, 14, startY + 8);
            
            doc.text('Valor Total do Pipeline: R$ ' + formatCurrency(valorTotal), 14, startY + 14);
            
            // Linha de filtros aplicados
            var filtrosTexto = 'Filtros: ';
            if (situacao) {
                filtrosTexto += 'Situação = ' + situacao;
            } else {
                filtrosTexto += 'Todas as situações';
            }
            if (dataInicio || dataFim) {
                filtrosTexto += ' | Período: ' + (dataInicio ? formatDatePdf(dataInicio) : 'início') + ' a ' + (dataFim ? formatDatePdf(dataFim) : 'hoje');
            } else {
                filtrosTexto += ' | Todas as datas';
            }
            doc.text(filtrosTexto, 14, startY + 20);
            
            startY += 30;
            
            // --- Tabela de dados ---
            var tableData = cardsFiltrados.map(function(card) {
                var cliente = data.clientes.find(function(c) { return c.id === card.cliente_id; });
                var contatoLead = data.contatos_leads.find(function(cl) { return cl.id === card.contato_lead_id; });
                var ativo = data.ativos.find(function(a) { return a.id === card.ativo_id; });
                var responsavel = data.users.find(function(u) { return u.id === card.responsavel_id; });
                var list = data.lists.find(function(l) { return l.id === card.list_id; });
                
                var trl = ativo ? (ativo.trl || '-') : '-';
                var crl = ativo ? (ativo.crl || '-') : '-';
                
                return [
                    (card.titulo || '-').substring(0, 35),
                    list ? list.nome : '-',
                    cliente ? (cliente.nome || '-').substring(0, 25) : '-',
                    contatoLead ? (contatoLead.nome || '-').substring(0, 25) : '-',
                    ativo ? (ativo.nome || '-').substring(0, 25) : '-',
                    trl,
                    crl,
                    responsavel ? (responsavel.nome || '-').substring(0, 20) : '-',
                    card.qualificacao ? card.qualificacao + '/5' : '-',
                    card.situacao || '-',
                    formatDatePdf(card.data_fechamento),
                    'R$ ' + formatCurrency(calculateCardTotal(card))
                ];
            });
            
            doc.autoTable({
                startY: startY,
                head: [[
                    'Título',
                    'Etapa',
                    'Cliente/Parceiro',
                    'Contato/Lead',
                    'Ativo Tecnológico',
                    'TRL',
                    'CRL',
                    'Responsável',
                    'Qual.',
                    'Situação',
                    'Prev. Fechamento',
                    'Valor'
                ]],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [0, 121, 191],
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
                    fillColor: [240, 248, 255]
                },
                columnStyles: {
                    0: { cellWidth: 30 },
                    1: { cellWidth: 22 },
                    2: { cellWidth: 25 },
                    3: { cellWidth: 25 },
                    4: { cellWidth: 25 },
                    5: { cellWidth: 10, halign: 'center' },
                    6: { cellWidth: 10, halign: 'center' },
                    7: { cellWidth: 22 },
                    8: { cellWidth: 10, halign: 'center' },
                    9: { cellWidth: 18, halign: 'center' },
                    10: { cellWidth: 22, halign: 'center' },
                    11: { cellWidth: 22, halign: 'right' }
                },
                margin: { left: 10, right: 10 },
                didParseCell: function(cellData) {
                    // Colorir situação
                    if (cellData.column.index === 9 && cellData.section === 'body') {
                        if (cellData.cell.raw === 'Nova') {
                            cellData.cell.styles.textColor = [0, 121, 191];
                            cellData.cell.styles.fontStyle = 'bold';
                        } else if (cellData.cell.raw === 'Em Andamento') {
                            cellData.cell.styles.textColor = [255, 159, 26];
                            cellData.cell.styles.fontStyle = 'bold';
                        } else if (cellData.cell.raw === 'Contratada') {
                            cellData.cell.styles.textColor = [97, 189, 79];
                            cellData.cell.styles.fontStyle = 'bold';
                        } else if (cellData.cell.raw === 'Perdida') {
                            cellData.cell.styles.textColor = [235, 90, 70];
                            cellData.cell.styles.fontStyle = 'bold';
                        }
                    }
                    // Colorir valor
                    if (cellData.column.index === 11 && cellData.section === 'body') {
                        cellData.cell.styles.textColor = [39, 125, 50];
                        cellData.cell.styles.fontStyle = 'bold';
                    }
                }
            });
            
            // --- Linha de total ao final ---
            var finalY = doc.lastAutoTable.finalY + 5;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(23, 43, 77);
            doc.text('Total de Negociações: ' + totalNegociacoes, 14, finalY);
            doc.setTextColor(39, 125, 50);
            doc.text('Valor Total: R$ ' + formatCurrency(valorTotal), doc.internal.pageSize.getWidth() - 14, finalY, { align: 'right' });
            
            adicionarRodapeRelatorio(doc);
            doc.save('Relatorio_Pipeline_' + new Date().toISOString().slice(0, 10) + '.pdf');
            
        } catch (error) {
            console.error('Erro ao gerar relatório Pipeline:', error);
            alert('Erro ao gerar o relatório de Pipeline.');
        }
        
        esconderLoadingRelatorio();
    }, 100);
}


// ==================== TIP - TERMO DE INTENÇÃO DE PROJETOS ====================

function openTipFromCard(cardId) {
    var card = data.cards.find(function(c) { return c.id === cardId; });
    if (!card) {
        alert('Cartão não encontrado!');
        return;
    }
    
    tipCardId = cardId;
    tipEditingId = null;
    tipResultados = [];
    tipColaboradores = [];
    tipInstituicoes = [];
    tipOrcamento = [];
    tipRiscos = [];
    
    document.getElementById('tipForm').reset();
    document.getElementById('tipResultadosBody').innerHTML = '';
    document.getElementById('tipColaboradoresBody').innerHTML = '';
    document.getElementById('tipInstituicoesBody').innerHTML = '';
    document.getElementById('tipOrcamentoBody').innerHTML = '';
    document.getElementById('tipRiscosBody').innerHTML = '';
    document.getElementById('tipOrcamentoTotal').textContent = '0,00';
    
    // Verificar se já existe TIP para este cartão
    var existingTip = data.tips.find(function(t) { return t.card_id === cardId; });
    
    if (existingTip) {
        tipEditingId = existingTip.id;
        document.getElementById('tipModalTitle').innerHTML = '<i class="fas fa-file-signature" style="color: var(--green);"></i> Editar TIP - Termo de Intenção de Projetos';
        
        // Preencher campos do TIP existente
        var solicitante = data.users.find(function(u) { return u.id === existingTip.solicitante_id; });
        document.getElementById('tipSolicitante').value = solicitante ? solicitante.nome : '-';
        document.getElementById('tipSolicitanteId').value = existingTip.solicitante_id || '';
        document.getElementById('tipTituloProposta').value = existingTip.titulo_proposta || '';
        document.getElementById('tipDescricaoProposta').value = existingTip.descricao_proposta || '';
        document.getElementById('tipPrazoExecucao').value = existingTip.prazo_execucao || '';
        document.getElementById('tipDataCriacao').value = existingTip.data_criacao || '';
        document.getElementById('tipObjetivo').value = existingTip.objetivo || '';
        document.getElementById('tipProblemaJustificativa').value = existingTip.problema_oportunidade_justificativa || '';
        
        if (existingTip.principais_resultados && Array.isArray(existingTip.principais_resultados)) {
            tipResultados = existingTip.principais_resultados.slice();
        }
        if (existingTip.colaboradores_potenciais && Array.isArray(existingTip.colaboradores_potenciais)) {
            tipColaboradores = existingTip.colaboradores_potenciais.slice();
        }
        if (existingTip.instituicoes_parceiras && Array.isArray(existingTip.instituicoes_parceiras)) {
            tipInstituicoes = existingTip.instituicoes_parceiras.slice();
        }
        if (existingTip.orcamento_fontes && Array.isArray(existingTip.orcamento_fontes)) {
            tipOrcamento = existingTip.orcamento_fontes.slice();
        }
        if (existingTip.analise_riscos && Array.isArray(existingTip.analise_riscos)) {
            tipRiscos = existingTip.analise_riscos.slice();
        }
    } else {
        document.getElementById('tipModalTitle').innerHTML = '<i class="fas fa-file-signature" style="color: var(--green);"></i> Novo TIP - Termo de Intenção de Projetos';
        
        // Preencher automaticamente a partir do cartão
        var responsavel = data.users.find(function(u) { return u.id === card.responsavel_id; });
        document.getElementById('tipSolicitante').value = responsavel ? responsavel.nome : '-';
        document.getElementById('tipSolicitanteId').value = card.responsavel_id || '';
        document.getElementById('tipTituloProposta').value = card.titulo || '';
        document.getElementById('tipDescricaoProposta').value = card.descricao || '';
        document.getElementById('tipDataCriacao').value = new Date().toISOString().split('T')[0];
        
        // Preencher colaboradores a partir da equipe do cartão
        if (card.equipe && Array.isArray(card.equipe)) {
            card.equipe.forEach(function(colaborador) {
                tipColaboradores.push({
                    id: generateId(),
                    usuario_id: colaborador.usuario_id,
                    nome: colaborador.nome || '',
                    responsabilidade: colaborador.principal_funcao || ''
                });
            });
        }
    }
    
    // Renderizar todas as grids
    renderTipResultadosGrid();
    renderTipColaboradoresGrid();
    renderTipInstituicoesGrid();
    renderTipOrcamentoGrid();
    renderTipRiscosGrid();
    
    // Fechar modal do cartão e abrir o do TIP
    closeModal('cardModal');
    openModal('tipModal');
}

// --- PRINCIPAIS RESULTADOS ---

function addTipResultadoRow() {
    tipResultados.push({
        id: generateId(),
        tipo_resultado: '',
        trl: '',
        descricao: '',
        como_ajuda: '',
        mes: ''
    });
    renderTipResultadosGrid();
}

function renderTipResultadosGrid() {
    var tbody = document.getElementById('tipResultadosBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    var tiposResultado = [
        'Cultivar',
        'Prática Agropecuária',
        'Procedimento Informatizado',
        'Softwares para Clientes Externos',
        'Produto Agropecuário ou Industrial',
        'Metodologia Técnica-Científica',
        'Ativo Cartográfico',
        'Sistemas Agropecuários, Alimentares e Florestais'
    ];
    
    tipResultados.forEach(function(item, index) {
        var tipoOptions = '<option value="">Selecione</option>';
        tiposResultado.forEach(function(tipo) {
            var selected = (item.tipo_resultado === tipo) ? 'selected' : '';
            tipoOptions += '<option value="' + tipo + '" ' + selected + '>' + tipo + '</option>';
        });
        
        var trlOptions = '<option value="">Selecione</option>';
        for (var i = 1; i <= 9; i++) {
            var selected = (item.trl == i) ? 'selected' : '';
            trlOptions += '<option value="' + i + '" ' + selected + '>' + i + '</option>';
        }
        
        tbody.innerHTML +=
            '<tr>' +
                '<td><select onchange="updateTipResultado(' + index + ',\'tipo_resultado\',this.value)">' + tipoOptions + '</select></td>' +
                '<td><select onchange="updateTipResultado(' + index + ',\'trl\',this.value)">' + trlOptions + '</select></td>' +
                '<td><textarea onchange="updateTipResultado(' + index + ',\'descricao\',this.value)">' + (item.descricao || '') + '</textarea></td>' +
                '<td><textarea onchange="updateTipResultado(' + index + ',\'como_ajuda\',this.value)">' + (item.como_ajuda || '') + '</textarea></td>' +
                '<td><input type="number" min="1" max="120" value="' + (item.mes || '') + '" placeholder="Mês" ' +
                    'onchange="updateTipResultado(' + index + ',\'mes\',this.value)"></td>' +
                '<td><button type="button" class="btn-remove-row" onclick="removeTipResultado(' + index + ')" title="Remover">' +
                    '<i class="fas fa-trash"></i></button></td>' +
            '</tr>';
    });
}

function updateTipResultado(index, field, value) {
    if (tipResultados[index]) tipResultados[index][field] = value;
}

function removeTipResultado(index) {
    tipResultados.splice(index, 1);
    renderTipResultadosGrid();
}

// --- COLABORADORES POTENCIAIS ---

function addTipColaboradorRow() {
    tipColaboradores.push({
        id: generateId(),
        usuario_id: '',
        nome: '',
        responsabilidade: ''
    });
    renderTipColaboradoresGrid();
}

function renderTipColaboradoresGrid() {
    var tbody = document.getElementById('tipColaboradoresBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    var usuariosOptions = '<option value="">Selecione um colaborador</option>';
    data.users.slice().sort(function(a, b) {
        return a.nome.localeCompare(b.nome);
    }).forEach(function(u) {
        usuariosOptions += '<option value="' + u.id + '">' + u.nome + (u.cargo ? ' (' + u.cargo + ')' : '') + '</option>';
    });
    
    tipColaboradores.forEach(function(item, index) {
        var selectedOption = usuariosOptions;
        if (item.usuario_id) {
            selectedOption = usuariosOptions.replace('value="' + item.usuario_id + '">', 'value="' + item.usuario_id + '" selected>');
        }
        
        tbody.innerHTML +=
            '<tr>' +
                '<td><select onchange="updateTipColaborador(' + index + ',\'usuario_id\',this.value, this)">' + selectedOption + '</select></td>' +
                '<td><input type="text" value="' + (item.responsabilidade || '') + '" placeholder="Ex: Coordenador, Pesquisador..." ' +
                    'onchange="updateTipColaborador(' + index + ',\'responsabilidade\',this.value)"></td>' +
                '<td><button type="button" class="btn-remove-row" onclick="removeTipColaborador(' + index + ')" title="Remover">' +
                    '<i class="fas fa-trash"></i></button></td>' +
            '</tr>';
    });
}

function updateTipColaborador(index, field, value, selectEl) {
    if (tipColaboradores[index]) {
        tipColaboradores[index][field] = value;
        if (field === 'usuario_id' && selectEl) {
            var usuario = data.users.find(function(u) { return u.id === value; });
            tipColaboradores[index].nome = usuario ? usuario.nome : '';
        }
    }
}

function removeTipColaborador(index) {
    tipColaboradores.splice(index, 1);
    renderTipColaboradoresGrid();
}

// --- INSTITUIÇÕES PARCEIRAS ---

function addTipInstituicaoRow() {
    tipInstituicoes.push({
        id: generateId(),
        cliente_id: '',
        nome_instituicao: '',
        responsabilidade: ''
    });
    renderTipInstituicoesGrid();
}

function renderTipInstituicoesGrid() {
    var tbody = document.getElementById('tipInstituicoesBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    var clientesOptions = '<option value="">Selecione uma instituição</option>';
    data.clientes.slice().sort(function(a, b) {
        return a.nome.localeCompare(b.nome);
    }).forEach(function(c) {
        clientesOptions += '<option value="' + c.id + '">' + c.nome + (c.tipo ? ' (' + c.tipo + ')' : '') + '</option>';
    });
    
    tipInstituicoes.forEach(function(item, index) {
        var selectedOption = clientesOptions;
        if (item.cliente_id) {
            selectedOption = clientesOptions.replace('value="' + item.cliente_id + '">', 'value="' + item.cliente_id + '" selected>');
        }
        
        tbody.innerHTML +=
            '<tr>' +
                '<td><select onchange="updateTipInstituicao(' + index + ',\'cliente_id\',this.value, this)">' + selectedOption + '</select></td>' +
                '<td><input type="text" value="' + (item.responsabilidade || '') + '" placeholder="Responsabilidade no projeto..." ' +
                    'onchange="updateTipInstituicao(' + index + ',\'responsabilidade\',this.value)"></td>' +
                '<td><button type="button" class="btn-remove-row" onclick="removeTipInstituicao(' + index + ')" title="Remover">' +
                    '<i class="fas fa-trash"></i></button></td>' +
            '</tr>';
    });
}

function updateTipInstituicao(index, field, value, selectEl) {
    if (tipInstituicoes[index]) {
        tipInstituicoes[index][field] = value;
        if (field === 'cliente_id') {
            var cliente = data.clientes.find(function(c) { return c.id === value; });
            tipInstituicoes[index].nome_instituicao = cliente ? cliente.nome : '';
        }
    }
}

function removeTipInstituicao(index) {
    tipInstituicoes.splice(index, 1);
    renderTipInstituicoesGrid();
}

// --- ORÇAMENTO E FONTE DE RECURSOS ---

function addTipOrcamentoRow() {
    tipOrcamento.push({
        id: generateId(),
        fonte_id: '',
        nome_fonte: '',
        tipo_fonte: '',
        valor_estimado: 0,
        percentual_participacao: 0,
        tem_edital: ''
    });
    renderTipOrcamentoGrid();
}

function renderTipOrcamentoGrid() {
    var tbody = document.getElementById('tipOrcamentoBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    var fontesOptions = '<option value="">Selecione uma fonte</option>';
    data.fontes_recursos.slice().sort(function(a, b) {
        return a.nome.localeCompare(b.nome);
    }).forEach(function(f) {
        fontesOptions += '<option value="' + f.id + '">' + f.nome + '</option>';
    });
    
    tipOrcamento.forEach(function(item, index) {
        var selectedOption = fontesOptions;
        if (item.fonte_id) {
            selectedOption = fontesOptions.replace('value="' + item.fonte_id + '">', 'value="' + item.fonte_id + '" selected>');
        }
        
        var editalOptions = '<option value="">Selecione</option>';
        ['Sim', 'Não', 'Em Análise'].forEach(function(op) {
            var selected = (item.tem_edital === op) ? 'selected' : '';
            editalOptions += '<option value="' + op + '" ' + selected + '>' + op + '</option>';
        });
        
        tbody.innerHTML +=
            '<tr>' +
                '<td><select onchange="onTipFonteChange(' + index + ',this.value)">' + selectedOption + '</select></td>' +
                '<td><input type="text" id="tipOrcamentoTipo_' + index + '" value="' + (item.tipo_fonte || '') + '" ' +
                    'readonly style="background-color: #f5f5f5; cursor: not-allowed;"></td>' +
                '<td><input type="number" step="0.01" value="' + (item.valor_estimado || '') + '" placeholder="0,00" ' +
                    'onchange="updateTipOrcamento(' + index + ',\'valor_estimado\',this.value); updateTipOrcamentoTotal();"></td>' +
                '<td><input type="number" step="0.01" min="0" max="100" value="' + (item.percentual_participacao || '') + '" placeholder="%" ' +
                    'onchange="updateTipOrcamento(' + index + ',\'percentual_participacao\',this.value)"></td>' +
                '<td><select onchange="updateTipOrcamento(' + index + ',\'tem_edital\',this.value)">' + editalOptions + '</select></td>' +
                '<td><button type="button" class="btn-remove-row" onclick="removeTipOrcamento(' + index + '); updateTipOrcamentoTotal();" title="Remover">' +
                    '<i class="fas fa-trash"></i></button></td>' +
            '</tr>';
    });
    
    updateTipOrcamentoTotal();
}

function onTipFonteChange(index, fonteId) {
    if (tipOrcamento[index]) {
        tipOrcamento[index].fonte_id = fonteId;
        var fonte = data.fontes_recursos.find(function(f) { return f.id === fonteId; });
        tipOrcamento[index].nome_fonte = fonte ? fonte.nome : '';
        tipOrcamento[index].tipo_fonte = fonte ? fonte.tipo : '';
        
        var tipoInput = document.getElementById('tipOrcamentoTipo_' + index);
        if (tipoInput) {
            tipoInput.value = fonte ? fonte.tipo : '';
        }
    }
}

function updateTipOrcamento(index, field, value) {
    if (tipOrcamento[index]) tipOrcamento[index][field] = value;
}

function removeTipOrcamento(index) {
    tipOrcamento.splice(index, 1);
    renderTipOrcamentoGrid();
}

function updateTipOrcamentoTotal() {
    var total = tipOrcamento.reduce(function(sum, item) {
        return sum + (parseFloat(item.valor_estimado) || 0);
    }, 0);
    document.getElementById('tipOrcamentoTotal').textContent = formatCurrency(total);
}

// --- ANÁLISE DE RISCOS ---

function addTipRiscoRow() {
    tipRiscos.push({
        id: generateId(),
        descricao: '',
        probabilidade: '',
        impacto: '',
        resposta: ''
    });
    renderTipRiscosGrid();
}

function renderTipRiscosGrid() {
    var tbody = document.getElementById('tipRiscosBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    tipRiscos.forEach(function(item, index) {
        var probOptions = '<option value="">Selecione</option>';
        ['Alta', 'Média', 'Baixa'].forEach(function(p) {
            var selected = (item.probabilidade === p) ? 'selected' : '';
            probOptions += '<option value="' + p + '" ' + selected + '>' + p + '</option>';
        });
        
        var impactoOptions = '<option value="">Selecione</option>';
        ['Alto', 'Médio', 'Baixo'].forEach(function(i) {
            var selected = (item.impacto === i) ? 'selected' : '';
            impactoOptions += '<option value="' + i + '" ' + selected + '>' + i + '</option>';
        });
        
        var respostaOptions = '<option value="">Selecione</option>';
        ['Evitar', 'Aceitar', 'Mitigar', 'Transferir'].forEach(function(r) {
            var selected = (item.resposta === r) ? 'selected' : '';
            respostaOptions += '<option value="' + r + '" ' + selected + '>' + r + '</option>';
        });
        
        tbody.innerHTML +=
            '<tr>' +
                '<td><textarea onchange="updateTipRisco(' + index + ',\'descricao\',this.value)" placeholder="Descreva o risco...">' + (item.descricao || '') + '</textarea></td>' +
                '<td><select onchange="updateTipRisco(' + index + ',\'probabilidade\',this.value)">' + probOptions + '</select></td>' +
                '<td><select onchange="updateTipRisco(' + index + ',\'impacto\',this.value)">' + impactoOptions + '</select></td>' +
                '<td><select onchange="updateTipRisco(' + index + ',\'resposta\',this.value)">' + respostaOptions + '</select></td>' +
                '<td><button type="button" class="btn-remove-row" onclick="removeTipRisco(' + index + ')" title="Remover">' +
                    '<i class="fas fa-trash"></i></button></td>' +
            '</tr>';
    });
}

function updateTipRisco(index, field, value) {
    if (tipRiscos[index]) tipRiscos[index][field] = value;
}

function removeTipRisco(index) {
    tipRiscos.splice(index, 1);
    renderTipRiscosGrid();
}

// --- SALVAR TIP ---

async function saveTip(e) {
    e.preventDefault();
    
    var tipData = {
        id: tipEditingId || generateId(),
        card_id: tipCardId,
        solicitante_id: document.getElementById('tipSolicitanteId').value || null,
        titulo_proposta: document.getElementById('tipTituloProposta').value,
        descricao_proposta: document.getElementById('tipDescricaoProposta').value,
        prazo_execucao: parseInt(document.getElementById('tipPrazoExecucao').value) || null,
        data_criacao: document.getElementById('tipDataCriacao').value || null,
        objetivo: document.getElementById('tipObjetivo').value,
        problema_oportunidade_justificativa: document.getElementById('tipProblemaJustificativa').value,
        principais_resultados: tipResultados,
        colaboradores_potenciais: tipColaboradores,
        instituicoes_parceiras: tipInstituicoes,
        orcamento_fontes: tipOrcamento,
        analise_riscos: tipRiscos,
        criador_id: currentUser.id,
        updated_at: new Date().toISOString()
    };
    
    try {
        showLoadingIndicator('Salvando TIP...');
        
        if (tipEditingId) {
            await updateData('tips', tipEditingId, tipData);
            var index = data.tips.findIndex(function(t) { return t.id === tipEditingId; });
            if (index >= 0) {
                data.tips[index] = tipData;
            } else {
                data.tips.push(tipData);
            }
        } else {
            tipData.data_registro = new Date().toISOString();
            await insertData('tips', tipData);
            data.tips.push(tipData);
        }
        
        hideLoadingIndicator();
        closeModal('tipModal');
        alert('TIP salvo com sucesso!');
        
    } catch (err) {
        hideLoadingIndicator();
        alert('Erro ao salvar TIP: ' + err.message);
    }
}

// --- EXPORTAR TIP PARA PDF ---

function exportTipToPdf() {
    mostrarLoadingRelatorio('Gerando PDF do TIP...');
    
    setTimeout(function() {
        try {
            var jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF('portrait', 'mm', 'a4');
            var pageWidth = doc.internal.pageSize.getWidth();
            var pageHeight = doc.internal.pageSize.getHeight();
            var marginLeft = 14;
            var marginRight = 14;
            var contentWidth = pageWidth - marginLeft - marginRight;
            var startY;
            
            // Dados do formulário
            var solicitante = document.getElementById('tipSolicitante').value || '-';
            var titulo = document.getElementById('tipTituloProposta').value || '-';
            var descricao = document.getElementById('tipDescricaoProposta').value || '-';
            var prazo = document.getElementById('tipPrazoExecucao').value || '-';
            var dataCriacao = document.getElementById('tipDataCriacao').value || '-';
            var objetivo = document.getElementById('tipObjetivo').value || '-';
            var problemaJust = document.getElementById('tipProblemaJustificativa').value || '-';
            
            var formatDatePdf = function(d) {
                if (!d || d === '-') return '-';
                var p = d.split('-');
                return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : d;
            };
            
            // Função auxiliar para verificar quebra de página
            var checkPageBreak = function(needed) {
                if (startY + needed > pageHeight - 25) {
                    doc.addPage();
                    startY = 20;
                }
            };
            
            // Função auxiliar para adicionar título de seção
            var addSectionTitle = function(text) {
                checkPageBreak(15);
                doc.setFillColor(0, 121, 191);
                doc.rect(marginLeft, startY - 4, contentWidth, 8, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.text(text, marginLeft + 3, startY + 1);
                startY += 10;
                doc.setTextColor(80, 80, 80);
            };
            
            // Função auxiliar para adicionar campo label:valor
            var addField = function(label, value) {
                checkPageBreak(8);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(23, 43, 77);
                doc.text(label + ':', marginLeft, startY);
                var labelWidth = doc.getTextWidth(label + ': ');
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(60, 60, 60);
                
                var maxWidth = contentWidth - labelWidth;
                var valueText = value || '-';
                var lines = doc.splitTextToSize(valueText, maxWidth);
                
                if (lines.length === 1) {
                    doc.text(lines[0], marginLeft + labelWidth, startY);
                    startY += 6;
                } else {
                    doc.text(lines[0], marginLeft + labelWidth, startY);
                    startY += 5;
                    for (var i = 1; i < lines.length; i++) {
                        checkPageBreak(5);
                        doc.text(lines[i], marginLeft + 5, startY);
                        startY += 5;
                    }
                    startY += 2;
                }
            };
            
            // Função auxiliar para adicionar texto longo (campo multilinha)
            var addLongTextField = function(label, value) {
                checkPageBreak(12);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(23, 43, 77);
                doc.text(label + ':', marginLeft, startY);
                startY += 5;
                
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(60, 60, 60);
                doc.setFontSize(9);
                
                var text = value || '-';
                var lines = doc.splitTextToSize(text, contentWidth - 5);
                
                for (var i = 0; i < lines.length; i++) {
                    checkPageBreak(5);
                    doc.text(lines[i], marginLeft + 3, startY);
                    startY += 4.5;
                }
                startY += 4;
            };
            
            // Função auxiliar para mensagem de seção vazia
            var addEmptyMessage = function(text) {
                doc.setFontSize(8);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(150, 150, 150);
                doc.text(text, marginLeft + 3, startY);
                startY += 8;
            };
            
            // ==============================
            // CABEÇALHO DO RELATÓRIO
            // ==============================
            doc.setFillColor(0, 121, 191);
            doc.rect(0, 0, pageWidth, 32, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('EMBRAPA Mandioca e Fruticultura', pageWidth / 2, 12, { align: 'center' });
            
            doc.setFontSize(13);
            doc.setFont('helvetica', 'normal');
            doc.text('Termo de Intenção de Projetos (TIP)', pageWidth / 2, 22, { align: 'center' });
            
            doc.setTextColor(100, 100, 100);
            doc.setFontSize(8);
            doc.text('Gerado em: ' + formatarDataRelatorio() + ' | Usuário: ' + currentUser.nome, pageWidth / 2, 40, { align: 'center' });
            
            doc.setDrawColor(0, 121, 191);
            doc.setLineWidth(0.5);
            doc.line(marginLeft, 44, pageWidth - marginRight, 44);
            
            startY = 50;
            
            // ==============================
            // SEÇÃO 1: INFORMAÇÕES GERAIS
            // ==============================
            addSectionTitle('INFORMAÇÕES GERAIS');
            
            addField('Solicitante', solicitante);
            addField('Data de Criação', formatDatePdf(dataCriacao));
            addField('Prazo de Execução', prazo + (prazo !== '-' ? ' meses' : ''));
            addField('Título da Proposta', titulo);
            
            startY += 3;
            
            // ==============================
            // SEÇÃO 2: DESCRIÇÃO DA PROPOSTA
            // ==============================
            addSectionTitle('DESCRIÇÃO DA PROPOSTA');
            addLongTextField('Descrição', descricao);
            
            // ==============================
            // SEÇÃO 3: OBJETIVO
            // ==============================
            addSectionTitle('OBJETIVO');
            addLongTextField('Objetivo', objetivo);
            
            // ==============================
            // SEÇÃO 4: PROBLEMA / OPORTUNIDADE / JUSTIFICATIVA
            // ==============================
            addSectionTitle('PROBLEMA / OPORTUNIDADE / JUSTIFICATIVA');
            addLongTextField('Problema / Oportunidade / Justificativa', problemaJust);
            
            // ==============================
            // SEÇÃO 5: PRINCIPAIS RESULTADOS
            // ==============================
            addSectionTitle('PRINCIPAIS RESULTADOS');
            
            if (tipResultados.length > 0) {
                var resultadosData = tipResultados.map(function(r) {
                    return [
                        r.tipo_resultado || '-',
                        r.trl || '-',
                        r.descricao || '-',
                        r.como_ajuda || '-',
                        r.mes || '-'
                    ];
                });
                
                doc.autoTable({
                    startY: startY,
                    head: [['Tipo do Resultado', 'TRL', 'Descrição', 'Como Ajuda?', 'Mês']],
                    body: resultadosData,
                    theme: 'grid',
                    tableWidth: contentWidth,
                    headStyles: {
                        fillColor: [97, 189, 79],
                        fontSize: 7,
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        halign: 'center',
                        cellPadding: 3
                    },
                    bodyStyles: {
                        fontSize: 7,
                        textColor: [50, 50, 50],
                        cellPadding: 3
                    },
                    alternateRowStyles: {
                        fillColor: [232, 245, 233]
                    },
                    columnStyles: {
                        0: { cellWidth: contentWidth * 0.25 },
                        1: { cellWidth: contentWidth * 0.08, halign: 'center' },
                        2: { cellWidth: contentWidth * 0.30 },
                        3: { cellWidth: contentWidth * 0.28 },
                        4: { cellWidth: contentWidth * 0.09, halign: 'center' }
                    },
                    margin: { left: marginLeft, right: marginRight }
                });
                startY = doc.lastAutoTable.finalY + 8;
            } else {
                addEmptyMessage('Nenhum resultado cadastrado.');
            }
            
            // ==============================
            // SEÇÃO 6: COLABORADORES POTENCIAIS
            // ==============================
            checkPageBreak(25);
            addSectionTitle('COLABORADORES POTENCIAIS');
            
            if (tipColaboradores.length > 0) {
                var colabData = tipColaboradores.map(function(c) {
                    var usuario = data.users.find(function(u) { return u.id === c.usuario_id; });
                    var nomeColaborador = usuario ? usuario.nome : (c.nome || '-');
                    var cargoColaborador = usuario ? (usuario.cargo || '-') : '-';
                    return [
                        nomeColaborador,
                        cargoColaborador,
                        c.responsabilidade || '-'
                    ];
                });
                
                doc.autoTable({
                    startY: startY,
                    head: [['Colaborador', 'Cargo', 'Possível Responsabilidade no Projeto']],
                    body: colabData,
                    theme: 'grid',
                    tableWidth: contentWidth,
                    headStyles: {
                        fillColor: [255, 159, 26],
                        fontSize: 7,
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        halign: 'center',
                        cellPadding: 3
                    },
                    bodyStyles: {
                        fontSize: 7,
                        textColor: [50, 50, 50],
                        cellPadding: 3
                    },
                    alternateRowStyles: {
                        fillColor: [255, 248, 225]
                    },
                    columnStyles: {
                        0: { cellWidth: contentWidth * 0.30 },
                        1: { cellWidth: contentWidth * 0.25 },
                        2: { cellWidth: contentWidth * 0.45 }
                    },
                    margin: { left: marginLeft, right: marginRight }
                });
                startY = doc.lastAutoTable.finalY + 8;
            } else {
                addEmptyMessage('Nenhum colaborador cadastrado.');
            }
            
            // ==============================
            // SEÇÃO 7: INSTITUIÇÕES PARCEIRAS
            // ==============================
            checkPageBreak(25);
            addSectionTitle('INSTITUIÇÕES PARCEIRAS');
            
            if (tipInstituicoes.length > 0) {
                var instData = tipInstituicoes.map(function(inst) {
                    var cliente = data.clientes.find(function(c) { return c.id === inst.cliente_id; });
                    var nomeInst = cliente ? cliente.nome : (inst.nome_instituicao || '-');
                    var tipoInst = cliente ? (cliente.tipo || '-') : '-';
                    var cidadeUf = cliente ? ((cliente.cidade || '') + (cliente.estado ? '/' + cliente.estado : '')) : '-';
                    return [
                        nomeInst,
                        tipoInst,
                        cidadeUf || '-',
                        inst.responsabilidade || '-'
                    ];
                });
                
                doc.autoTable({
                    startY: startY,
                    head: [['Instituição Parceira', 'Tipo', 'Cidade/UF', 'Responsabilidade no Projeto']],
                    body: instData,
                    theme: 'grid',
                    tableWidth: contentWidth,
                    headStyles: {
                        fillColor: [0, 121, 191],
                        fontSize: 7,
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        halign: 'center',
                        cellPadding: 3
                    },
                    bodyStyles: {
                        fontSize: 7,
                        textColor: [50, 50, 50],
                        cellPadding: 3
                    },
                    alternateRowStyles: {
                        fillColor: [228, 240, 246]
                    },
                    columnStyles: {
                        0: { cellWidth: contentWidth * 0.30 },
                        1: { cellWidth: contentWidth * 0.18 },
                        2: { cellWidth: contentWidth * 0.17 },
                        3: { cellWidth: contentWidth * 0.35 }
                    },
                    margin: { left: marginLeft, right: marginRight }
                });
                startY = doc.lastAutoTable.finalY + 8;
            } else {
                addEmptyMessage('Nenhuma instituição parceira cadastrada.');
            }
            
            // ==============================
            // SEÇÃO 8: ORÇAMENTO E FONTE DE RECURSOS
            // ==============================
            checkPageBreak(25);
            addSectionTitle('ORÇAMENTO E FONTE DE RECURSOS');
            
            if (tipOrcamento.length > 0) {
                var totalOrcamento = 0;
                var orcData = tipOrcamento.map(function(o) {
                    var valor = parseFloat(o.valor_estimado) || 0;
                    totalOrcamento += valor;
                    return [
                        o.nome_fonte || '-',
                        o.tipo_fonte || '-',
                        'R$ ' + formatCurrency(valor),
                        (o.percentual_participacao || '0') + '%',
                        o.tem_edital || '-'
                    ];
                });
                
                // Adicionar linha de total
                orcData.push([
                    'TOTAL GERAL',
                    '',
                    'R$ ' + formatCurrency(totalOrcamento),
                    '',
                    ''
                ]);
                
                doc.autoTable({
                    startY: startY,
                    head: [['Fonte Financiadora', 'Tipo', 'Valor Estimado (R$)', '% Participação', 'Tem Edital?']],
                    body: orcData,
                    theme: 'grid',
                    tableWidth: contentWidth,
                    headStyles: {
                        fillColor: [97, 189, 79],
                        fontSize: 7,
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        halign: 'center',
                        cellPadding: 3
                    },
                    bodyStyles: {
                        fontSize: 7,
                        textColor: [50, 50, 50],
                        cellPadding: 3
                    },
                    alternateRowStyles: {
                        fillColor: [232, 245, 233]
                    },
                    columnStyles: {
                        0: { cellWidth: contentWidth * 0.28 },
                        1: { cellWidth: contentWidth * 0.18 },
                        2: { cellWidth: contentWidth * 0.22, halign: 'right' },
                        3: { cellWidth: contentWidth * 0.15, halign: 'center' },
                        4: { cellWidth: contentWidth * 0.17, halign: 'center' }
                    },
                    margin: { left: marginLeft, right: marginRight },
                    didParseCell: function(cellData) {
                        // Última linha = TOTAL
                        if (cellData.row.index === orcData.length - 1 && cellData.section === 'body') {
                            cellData.cell.styles.fontStyle = 'bold';
                            cellData.cell.styles.fillColor = [200, 230, 201];
                            cellData.cell.styles.textColor = [27, 94, 32];
                            cellData.cell.styles.fontSize = 8;
                        }
                        // Colorir valores em verde
                        if (cellData.column.index === 2 && cellData.section === 'body' && cellData.row.index < orcData.length - 1) {
                            cellData.cell.styles.textColor = [39, 125, 50];
                            cellData.cell.styles.fontStyle = 'bold';
                        }
                    }
                });
                startY = doc.lastAutoTable.finalY + 8;
            } else {
                addEmptyMessage('Nenhuma fonte de recursos cadastrada.');
            }
            
            // ==============================
            // SEÇÃO 9: ANÁLISE DE RISCOS
            // ==============================
            checkPageBreak(25);
            addSectionTitle('ANÁLISE DE RISCOS');
            
            if (tipRiscos.length > 0) {
                var riscosData = tipRiscos.map(function(r) {
                    return [
                        r.descricao || '-',
                        r.probabilidade || '-',
                        r.impacto || '-',
                        r.resposta || '-'
                    ];
                });
                
                doc.autoTable({
                    startY: startY,
                    head: [['Descrição do Risco', 'Probabilidade', 'Impactos', 'Resposta']],
                    body: riscosData,
                    theme: 'grid',
                    tableWidth: contentWidth,
                    headStyles: {
                        fillColor: [235, 90, 70],
                        fontSize: 7,
                        textColor: [255, 255, 255],
                        fontStyle: 'bold',
                        halign: 'center',
                        cellPadding: 3
                    },
                    bodyStyles: {
                        fontSize: 7,
                        textColor: [50, 50, 50],
                        cellPadding: 3
                    },
                    alternateRowStyles: {
                        fillColor: [255, 235, 238]
                    },
                    columnStyles: {
                        0: { cellWidth: contentWidth * 0.46 },
                        1: { cellWidth: contentWidth * 0.18, halign: 'center' },
                        2: { cellWidth: contentWidth * 0.18, halign: 'center' },
                        3: { cellWidth: contentWidth * 0.18, halign: 'center' }
                    },
                    margin: { left: marginLeft, right: marginRight },
                    didParseCell: function(cellData) {
                        if (cellData.section === 'body') {
                            // Colorir Probabilidade
                            if (cellData.column.index === 1) {
                                if (cellData.cell.raw === 'Alta') {
                                    cellData.cell.styles.textColor = [198, 40, 40];
                                    cellData.cell.styles.fontStyle = 'bold';
                                } else if (cellData.cell.raw === 'Média') {
                                    cellData.cell.styles.textColor = [230, 81, 0];
                                    cellData.cell.styles.fontStyle = 'bold';
                                } else if (cellData.cell.raw === 'Baixa') {
                                    cellData.cell.styles.textColor = [46, 125, 50];
                                    cellData.cell.styles.fontStyle = 'bold';
                                }
                            }
                            // Colorir Impactos
                            if (cellData.column.index === 2) {
                                if (cellData.cell.raw === 'Alto') {
                                    cellData.cell.styles.textColor = [198, 40, 40];
                                    cellData.cell.styles.fontStyle = 'bold';
                                } else if (cellData.cell.raw === 'Médio') {
                                    cellData.cell.styles.textColor = [230, 81, 0];
                                    cellData.cell.styles.fontStyle = 'bold';
                                } else if (cellData.cell.raw === 'Baixo') {
                                    cellData.cell.styles.textColor = [46, 125, 50];
                                    cellData.cell.styles.fontStyle = 'bold';
                                }
                            }
                            // Colorir Resposta
                            if (cellData.column.index === 3) {
                                if (cellData.cell.raw === 'Evitar') {
                                    cellData.cell.styles.textColor = [198, 40, 40];
                                } else if (cellData.cell.raw === 'Mitigar') {
                                    cellData.cell.styles.textColor = [230, 81, 0];
                                } else if (cellData.cell.raw === 'Transferir') {
                                    cellData.cell.styles.textColor = [0, 121, 191];
                                } else if (cellData.cell.raw === 'Aceitar') {
                                    cellData.cell.styles.textColor = [46, 125, 50];
                                }
                            }
                        }
                    }
                });
                startY = doc.lastAutoTable.finalY + 8;
            } else {
                addEmptyMessage('Nenhum risco cadastrado.');
            }
            
                        // ==============================
            // SEÇÃO 10: DADOS DA NEGOCIAÇÃO DE ORIGEM
            // ==============================
            if (tipCardId) {
                var cardOrigem = data.cards.find(function(c) { return c.id === tipCardId; });
                if (cardOrigem) {
                    checkPageBreak(40);
                    
                    // Título da seção com estilo diferenciado (fundo escuro)
                    doc.setFillColor(23, 43, 77);
                    doc.rect(marginLeft, startY - 4, contentWidth, 8, 'F');
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'bold');
                    doc.text('DADOS DA NEGOCIAÇÃO DE ORIGEM', marginLeft + 3, startY + 1);
                    startY += 12;
                    
                    // Buscar dados relacionados
                    var clienteOrigem = data.clientes.find(function(c) { return c.id === cardOrigem.cliente_id; });
                    var ativoOrigem = data.ativos.find(function(a) { return a.id === cardOrigem.ativo_id; });
                    var temaOrigem = data.temas.find(function(t) { return t.id === cardOrigem.tema_id; });
                    var culturaOrigem = data.culturas.find(function(c) { return c.id === cardOrigem.cultura_id; });
                    var projetoOrigem = data.projetos.find(function(p) { return p.id === cardOrigem.projeto_id; });
                    var responsavelOrigem = data.users.find(function(u) { return u.id === cardOrigem.responsavel_id; });
                    var contratoOrigem = data.contratos.find(function(c) { return c.id === cardOrigem.contrato_id; });
                    var regiaoOrigem = data.regioes.find(function(r) { return r.id === cardOrigem.regiao_id; });
                    var valorCartao = calculateCardTotal(cardOrigem);
                    
                    // --- Card de destaque: Título e Situação ---
                    checkPageBreak(18);
                    doc.setFillColor(228, 240, 246);
                    doc.roundedRect(marginLeft, startY - 4, contentWidth, 16, 2, 2, 'F');
                    doc.setDrawColor(0, 121, 191);
                    doc.setLineWidth(0.5);
                    doc.roundedRect(marginLeft, startY - 4, contentWidth, 16, 2, 2, 'S');
                    
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(23, 43, 77);
                    doc.text(cardOrigem.titulo || 'Sem título', marginLeft + 5, startY + 2);
                    
                    // Badge de situação
                    var situacaoText = cardOrigem.situacao || '-';
                    var situacaoColor;
                    if (situacaoText === 'Contratada') situacaoColor = [97, 189, 79];
                    else if (situacaoText === 'Em Andamento') situacaoColor = [255, 159, 26];
                    else if (situacaoText === 'Nova') situacaoColor = [0, 121, 191];
                    else if (situacaoText === 'Perdida') situacaoColor = [235, 90, 70];
                    else situacaoColor = [107, 119, 140];
                    
                    var situacaoWidth = doc.getTextWidth(situacaoText) + 10;
                    var situacaoX = marginLeft + contentWidth - situacaoWidth - 5;
                    doc.setFillColor(situacaoColor[0], situacaoColor[1], situacaoColor[2]);
                    doc.roundedRect(situacaoX, startY - 2, situacaoWidth, 7, 3, 3, 'F');
                    doc.setFontSize(8);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(255, 255, 255);
                    doc.text(situacaoText, situacaoX + situacaoWidth / 2, startY + 3, { align: 'center' });
                    
                    // Valor abaixo do título
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(39, 125, 50);
                    doc.text('Valor Potencial: R$ ' + formatCurrency(valorCartao), marginLeft + 5, startY + 9);
                    
                    // Qualificação
                    var qualLabel = getQualificacaoLabel(cardOrigem.qualificacao);
                    doc.setTextColor(107, 119, 140);
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(8);
                    doc.text('Qualificação: ' + qualLabel, marginLeft + contentWidth / 2, startY + 9);
                    
                    startY += 18;
                    
                    // --- Tabela de dados principais da negociação ---
                    checkPageBreak(30);
                    
                    var dadosNegociacao = [
                        ['Cliente/Parceiro', clienteOrigem ? clienteOrigem.nome : '-', 'Responsável', responsavelOrigem ? responsavelOrigem.nome : '-'],
                        ['Ativo Tecnológico', ativoOrigem ? ativoOrigem.nome : '-', 'TRL / CRL', ativoOrigem ? (ativoOrigem.trl || '-') + ' / ' + (ativoOrigem.crl || '-') : '-'],
                        ['Tema', temaOrigem ? temaOrigem.nome : '-', 'Cultura Agrícola', culturaOrigem ? culturaOrigem.nome : '-'],
                        ['Projeto Vinculado', projetoOrigem ? projetoOrigem.titulo : '-', 'Contrato/Convênio', contratoOrigem ? contratoOrigem.numero_saic : '-'],
                        ['Região', regiaoOrigem ? regiaoOrigem.nome + (regiaoOrigem.estado ? ' (' + regiaoOrigem.estado + ')' : '') : '-', 'Data do Contato', formatDatePdf(cardOrigem.data_contato)],
                        ['Prev. Fechamento', formatDatePdf(cardOrigem.data_fechamento), 'Fech. Real', formatDatePdf(cardOrigem.data_real_fechamento)]
                    ];
                    
                    doc.autoTable({
                        startY: startY,
                        body: dadosNegociacao,
                        theme: 'plain',
                        tableWidth: contentWidth,
                        bodyStyles: {
                            fontSize: 8,
                            cellPadding: { top: 3, right: 4, bottom: 3, left: 4 }
                        },
                        columnStyles: {
                            0: { cellWidth: contentWidth * 0.18, fontStyle: 'bold', textColor: [23, 43, 77], fillColor: [240, 245, 250] },
                            1: { cellWidth: contentWidth * 0.32, textColor: [60, 60, 60] },
                            2: { cellWidth: contentWidth * 0.18, fontStyle: 'bold', textColor: [23, 43, 77], fillColor: [240, 245, 250] },
                            3: { cellWidth: contentWidth * 0.32, textColor: [60, 60, 60] }
                        },
                        margin: { left: marginLeft, right: marginRight },
                        didParseCell: function(cellData) {
                            if (cellData.section === 'body') {
                                // Borda inferior sutil em todas as células
                                cellData.cell.styles.lineWidth = 0.1;
                                cellData.cell.styles.lineColor = [200, 210, 220];
                            }
                        },
                        didDrawCell: function(cellData) {
                            if (cellData.section === 'body') {
                                // Linha separadora vertical entre pares de colunas
                                if (cellData.column.index === 1) {
                                    doc.setDrawColor(180, 200, 220);
                                    doc.setLineWidth(0.3);
                                    var cellX = cellData.cell.x + cellData.cell.width;
                                    doc.line(cellX, cellData.cell.y, cellX, cellData.cell.y + cellData.cell.height);
                                }
                            }
                        }
                    });
                    startY = doc.lastAutoTable.finalY + 8;
                    
                    // --- Descrição da negociação ---
                    if (cardOrigem.descricao) {
                        checkPageBreak(15);
                        doc.setFillColor(245, 247, 250);
                        var descLines = doc.splitTextToSize(cardOrigem.descricao, contentWidth - 10);
                        var descHeight = descLines.length * 4.5 + 12;
                        doc.roundedRect(marginLeft, startY - 2, contentWidth, descHeight, 2, 2, 'F');
                        doc.setDrawColor(200, 210, 220);
                        doc.setLineWidth(0.3);
                        doc.roundedRect(marginLeft, startY - 2, contentWidth, descHeight, 2, 2, 'S');
                        
                        doc.setFontSize(8);
                        doc.setFont('helvetica', 'bold');
                        doc.setTextColor(23, 43, 77);
                        doc.text('Descrição da Negociação:', marginLeft + 5, startY + 4);
                        
                        doc.setFont('helvetica', 'normal');
                        doc.setTextColor(80, 80, 80);
                        doc.setFontSize(8);
                        for (var dl = 0; dl < descLines.length; dl++) {
                            doc.text(descLines[dl], marginLeft + 5, startY + 10 + (dl * 4.5));
                        }
                        startY += descHeight + 6;
                    }
                    
                    // --- Equipe do cartão ---
                    if (cardOrigem.equipe && cardOrigem.equipe.length > 0) {
                        checkPageBreak(25);
                        
                        doc.setFontSize(9);
                        doc.setFont('helvetica', 'bold');
                        doc.setTextColor(23, 43, 77);
                        doc.text('Equipe da Negociação', marginLeft, startY);
                        startY += 5;
                        
                        var equipeData = cardOrigem.equipe.map(function(e) {
                            var usuario = data.users.find(function(u) { return u.id === e.usuario_id; });
                            return [
                                usuario ? usuario.nome : (e.nome || '-'),
                                usuario ? (usuario.cargo || '-') : '-',
                                e.principal_funcao || '-'
                            ];
                        });
                        
                        doc.autoTable({
                            startY: startY,
                            head: [['Membro da Equipe', 'Cargo', 'Função na Negociação']],
                            body: equipeData,
                            theme: 'grid',
                            tableWidth: contentWidth,
                            headStyles: {
                                fillColor: [23, 43, 77],
                                fontSize: 7,
                                textColor: [255, 255, 255],
                                fontStyle: 'bold',
                                halign: 'center',
                                cellPadding: 3
                            },
                            bodyStyles: {
                                fontSize: 7,
                                textColor: [50, 50, 50],
                                cellPadding: 3
                            },
                            alternateRowStyles: {
                                fillColor: [240, 245, 250]
                            },
                            columnStyles: {
                                0: { cellWidth: contentWidth * 0.30 },
                                1: { cellWidth: contentWidth * 0.25 },
                                2: { cellWidth: contentWidth * 0.45 }
                            },
                            margin: { left: marginLeft, right: marginRight }
                        });
                        startY = doc.lastAutoTable.finalY + 8;
                    }
                    
                    // --- Valor potencial detalhado ---
                    if (cardOrigem.valor_potencial && cardOrigem.valor_potencial.length > 0) {
                        checkPageBreak(25);
                        
                        doc.setFontSize(9);
                        doc.setFont('helvetica', 'bold');
                        doc.setTextColor(23, 43, 77);
                        doc.text('Valor Potencial Detalhado', marginLeft, startY);
                        startY += 5;
                        
                        var valorData = cardOrigem.valor_potencial.map(function(v) {
                            return [
                                v.descricao || '-',
                                v.quantidade || '0',
                                'R$ ' + formatCurrency(v.valor || 0),
                                'R$ ' + formatCurrency(v.total || 0)
                            ];
                        });
                        
                        valorData.push(['TOTAL', '', '', 'R$ ' + formatCurrency(valorCartao)]);
                        
                        doc.autoTable({
                            startY: startY,
                            head: [['Descrição', 'Qtd', 'Valor Unitário', 'Total']],
                            body: valorData,
                            theme: 'grid',
                            tableWidth: contentWidth,
                            headStyles: {
                                fillColor: [23, 43, 77],
                                fontSize: 7,
                                textColor: [255, 255, 255],
                                fontStyle: 'bold',
                                halign: 'center',
                                cellPadding: 3
                            },
                            bodyStyles: {
                                fontSize: 7,
                                textColor: [50, 50, 50],
                                cellPadding: 3
                            },
                            alternateRowStyles: {
                                fillColor: [240, 245, 250]
                            },
                            columnStyles: {
                                0: { cellWidth: contentWidth * 0.40 },
                                1: { cellWidth: contentWidth * 0.12, halign: 'center' },
                                2: { cellWidth: contentWidth * 0.24, halign: 'right' },
                                3: { cellWidth: contentWidth * 0.24, halign: 'right' }
                            },
                            margin: { left: marginLeft, right: marginRight },
                            didParseCell: function(cellData) {
                                // Linha total
                                if (cellData.row.index === valorData.length - 1 && cellData.section === 'body') {
                                    cellData.cell.styles.fontStyle = 'bold';
                                    cellData.cell.styles.fillColor = [23, 43, 77];
                                    cellData.cell.styles.textColor = [255, 255, 255];
                                    cellData.cell.styles.fontSize = 8;
                                }
                                // Valores em verde
                                if ((cellData.column.index === 2 || cellData.column.index === 3) && cellData.section === 'body' && cellData.row.index < valorData.length - 1) {
                                    cellData.cell.styles.textColor = [39, 125, 50];
                                    cellData.cell.styles.fontStyle = 'bold';
                                }
                            }
                        });
                        startY = doc.lastAutoTable.finalY + 8;
                    }
                    
                    // --- Informações de Perda (se aplicável) ---
                    if (cardOrigem.situacao === 'Perdida') {
                        checkPageBreak(25);
                        
                        doc.setFillColor(255, 235, 238);
                        var perdaHeight = 22;
                        if (cardOrigem.motivo_perda) {
                            var motivoLines = doc.splitTextToSize(cardOrigem.motivo_perda, contentWidth - 10);
                            perdaHeight += motivoLines.length * 4;
                        }
                        doc.roundedRect(marginLeft, startY - 2, contentWidth, perdaHeight, 2, 2, 'F');
                        doc.setDrawColor(235, 90, 70);
                        doc.setLineWidth(0.5);
                        doc.roundedRect(marginLeft, startY - 2, contentWidth, perdaHeight, 2, 2, 'S');
                        
                        doc.setFontSize(9);
                        doc.setFont('helvetica', 'bold');
                        doc.setTextColor(198, 40, 40);
                        doc.text('NEGOCIAÇÃO PERDIDA', marginLeft + 5, startY + 4);
                        
                        doc.setFontSize(8);
                        doc.setFont('helvetica', 'normal');
                        doc.setTextColor(80, 60, 60);
                        doc.text('Tipo de Perda: ' + (cardOrigem.tipo_perda || '-') + '    |    Data: ' + formatDatePdf(cardOrigem.data_perda), marginLeft + 5, startY + 11);
                        
                        if (cardOrigem.motivo_perda) {
                            doc.setFont('helvetica', 'bold');
                            doc.text('Motivo:', marginLeft + 5, startY + 18);
                            doc.setFont('helvetica', 'normal');
                            var motivoLines = doc.splitTextToSize(cardOrigem.motivo_perda, contentWidth - 10);
                            for (var ml = 0; ml < motivoLines.length; ml++) {
                                doc.text(motivoLines[ml], marginLeft + 5, startY + 23 + (ml * 4));
                            }
                        }
                        
                        startY += perdaHeight + 6;
                    }
                }
            }

            
            // ==============================
            // RODAPÉ EM TODAS AS PÁGINAS
            // ==============================
            var pageCount = doc.internal.getNumberOfPages();
            for (var i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.3);
                doc.line(marginLeft, pageHeight - 15, pageWidth - marginRight, pageHeight - 15);
                
                doc.setTextColor(128, 128, 128);
                doc.setFontSize(7);
                doc.setFont('helvetica', 'normal');
                doc.text('TIP - Termo de Intenção de Projetos | Embrapa Mandioca e Fruticultura', marginLeft, pageHeight - 8);
                doc.text('Página ' + i + ' de ' + pageCount, pageWidth - marginRight, pageHeight - 8, { align: 'right' });
            }
            
            // ==============================
            // SALVAR PDF
            // ==============================
            var nomeArquivo = 'TIP_' + (titulo !== '-' ? titulo : 'Sem_Titulo').substring(0, 30).replace(/[^a-zA-Z0-9\u00C0-\u00FF ]/g, '_').replace(/\s+/g, '_') + '_' + new Date().toISOString().slice(0, 10) + '.pdf';
            doc.save(nomeArquivo);
            
        } catch (error) {
            console.error('Erro ao gerar PDF do TIP:', error);
            alert('Erro ao gerar o PDF do TIP. Verifique o console para detalhes.');
        }
        
        esconderLoadingRelatorio();
    }, 100);
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

	    'Contato/Lead': (function() {
                var cl = data.contatos_leads.find(function(x) { return x.id === card.contato_lead_id; });
                return cl ? cl.nome : '';
            })(),

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

    	    'Data Real Fechamento': card.data_real_fechamento || '',
    	    'Tipo de Perda': card.tipo_perda || '',
   	    'Data da Perda': card.data_perda || '',



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
   } else if (viewName === 'historicoTips') {
        loadHistoricoTipsFilters();
    } else if (viewName === 'sac') {
        renderSacView();
    }
}



// ==================== MOBILE ADAPTAÇÕES ====================

// Detectar se é mobile
function isMobile() {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Fechar dropdowns ao clicar fora (essencial no mobile)
document.addEventListener('click', function(e) {
    if (isMobile()) {
        var dropdowns = document.querySelectorAll('.dropdown-menu');
        var clickedInsideDropdown = e.target.closest('.dropdown');
        
        if (!clickedInsideDropdown) {
            dropdowns.forEach(function(menu) {
                menu.style.display = 'none';
            });
        }
    }
});

// Toggle dropdown no mobile (substituir hover por click)
document.addEventListener('DOMContentLoaded', function() {
    if (isMobile()) {
        var dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(function(toggle) {
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                var menu = this.parentElement.querySelector('.dropdown-menu');
                var isVisible = menu.style.display === 'block';
                
                // Fechar todos os outros dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(function(m) {
                    m.style.display = 'none';
                });
                
                // Toggle o atual
                if (!isVisible) {
                    menu.style.display = 'block';
                    
                    // Adicionar overlay para fechar
                    var overlay = document.createElement('div');
                    overlay.id = 'mobileDropdownOverlay';
                    overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); z-index: 1000;';
                    overlay.addEventListener('click', function() {
                        menu.style.display = 'none';
                        this.remove();
                    });
                    document.body.appendChild(overlay);
                } else {
                    var existingOverlay = document.getElementById('mobileDropdownOverlay');
                    if (existingOverlay) existingOverlay.remove();
                }
            });
        });
        
        // Fechar dropdown quando clicar em um item do menu
        document.querySelectorAll('.dropdown-menu a').forEach(function(link) {
            link.addEventListener('click', function() {
                this.closest('.dropdown-menu').style.display = 'none';
                var overlay = document.getElementById('mobileDropdownOverlay');
                if (overlay) overlay.remove();
            });
        });
    }
});

// Ajustar Kanban para modo mobile
function adjustKanbanForMobile() {
    if (!isMobile()) return;
    
    var board = document.getElementById('kanbanBoard');
    if (!board) return;
    
    // Adicionar classes de colapso nas listas
    var lists = board.querySelectorAll('.kanban-list');
    lists.forEach(function(list) {
        var header = list.querySelector('.list-header');
        var cards = list.querySelector('.list-cards');
        
        if (!header || !cards) return;
        
        // Verificar se já tem o toggle
        if (header.querySelector('.mobile-toggle')) return;
        
        // Adicionar botão de toggle
        var toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
        toggleBtn.style.cssText = 'background: none; border: none; color: var(--gray); font-size: 16px; padding: 4px 8px; cursor: pointer; margin-left: 8px;';
        
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var isCollapsed = cards.style.display === 'none';
            cards.style.display = isCollapsed ? 'block' : 'none';
            this.querySelector('i').className = isCollapsed ? 'fas fa-chevron-down' : 'fas fa-chevron-right';
        });
        
        header.querySelector('h3').appendChild(toggleBtn);
    });
}

// Override renderKanbanBoard para chamar ajustes mobile
var originalRenderKanbanBoard = renderKanbanBoard;
renderKanbanBoard = function() {
    originalRenderKanbanBoard();
    setTimeout(adjustKanbanForMobile, 100);
};

// Desabilitar drag-and-drop no mobile (usar botões em vez disso)
var originalSetupDragAndDrop = setupDragAndDrop;
setupDragAndDrop = function() {
    if (isMobile()) {
        // No mobile, desabilitar drag nos cards
        document.querySelectorAll('.kanban-card').forEach(function(card) {
            card.draggable = false;
            card.style.cursor = 'default';
        });
        
        // Desabilitar drag nas listas
        document.querySelectorAll('.kanban-list').forEach(function(list) {
            list.draggable = false;
        });
    } else {
        originalSetupDragAndDrop();
    }
};

// Adicionar botão "Mover" nos cards no mobile
function addMobileCardMoveButtons() {
    if (!isMobile() || !currentBoard) return;
    
    document.querySelectorAll('.kanban-card').forEach(function(cardEl) {
        var cardId = cardEl.getAttribute('data-card-id');
        var actionsDiv = cardEl.querySelector('.card-actions');
        
        if (!actionsDiv || actionsDiv.querySelector('.btn-move')) return;
        
        var moveBtn = document.createElement('button');
        moveBtn.type = 'button';
        moveBtn.className = 'btn-move';
        moveBtn.setAttribute('data-card-id', cardId);
        moveBtn.title = 'Mover';
        moveBtn.innerHTML = '<i class="fas fa-arrows-alt"></i>';
        moveBtn.style.cssText = 'color: #6B778C; background: transparent; border: none; padding: 8px; cursor: pointer; font-size: 14px;';
        
        moveBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showMobileCardMoveModal(cardId);
        });
        
        actionsDiv.insertBefore(moveBtn, actionsDiv.firstChild);
    });
}

function showMobileCardMoveModal(cardId) {
    var card = data.cards.find(function(c) { return c.id === cardId; });
    if (!card) return;
    
    var lists = data.lists
        .filter(function(l) { return l.board_id === currentBoard.id; })
        .sort(function(a, b) { return a.ordem - b.ordem; });
    
    var currentList = data.lists.find(function(l) { return l.id === card.list_id; });
    
    var optionsHTML = '';
    lists.forEach(function(list) {
        var selected = list.id === card.list_id ? ' style="font-weight: bold; color: var(--primary-blue);"' : '';
        var currentMark = list.id === card.list_id ? ' ← Atual' : '';
        optionsHTML += '<button type="button" class="mobile-move-option" data-list-id="' + list.id + '"' + selected + '>' +
            list.nome + currentMark +
        '</button>';
    });
    
    // Criar modal de mover
    var moveModal = document.createElement('div');
    moveModal.id = 'mobileCardMoveModal';
    moveModal.className = 'modal show';
    moveModal.innerHTML = 
        '<div class="modal-content modal-small" style="padding: 20px;">' +
            '<span class="close" onclick="document.getElementById(\'mobileCardMoveModal\').remove()">&times;</span>' +
            '<h2 style="font-size: 15px;">Mover para:</h2>' +
            '<div style="display: flex; flex-direction: column; gap: 8px; margin-top: 15px;">' +
                optionsHTML +
            '</div>' +
        '</div>';
    
    document.body.appendChild(moveModal);
    
    // Style dos botões
    var style = document.createElement('style');
    style.textContent = '.mobile-move-option { width: 100%; padding: 14px 16px; border: 2px solid var(--light-gray); border-radius: 8px; background: var(--white); color: var(--dark-blue); font-size: 14px; cursor: pointer; text-align: left; transition: all 0.2s; } .mobile-move-option:hover, .mobile-move-option:active { background: var(--very-light-blue); border-color: var(--primary-blue); }';
    moveModal.appendChild(style);
    
    // Event listeners nos botões
    moveModal.querySelectorAll('.mobile-move-option').forEach(function(btn) {
        btn.addEventListener('click', async function() {
            var newListId = this.getAttribute('data-list-id');
            if (newListId !== card.list_id) {
                try {
                    await updateData('cards', cardId, { list_id: newListId });
                    card.list_id = newListId;
                    renderKanbanBoard();
                } catch (err) {
                    alert('Erro ao mover cartão: ' + err.message);
                }
            }
            moveModal.remove();
        });
    });
}

// Chamar ajustes após renderizar o kanban
var originalCreateListElement = createListElement;
// Nota: o hook já é feito pelo override de renderKanbanBoard acima

// Ajustar ao redimensionar
var resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        if (currentBoard) {
            adjustKanbanForMobile();
        }
    }, 250);
});



// ==================== HISTÓRICO DE TIPs ====================

function loadHistoricoTipsFilters() {
    // Popular filtro de Solicitante
    var solicitanteSelect = document.getElementById('filterTipSolicitante');
    if (solicitanteSelect) {
        solicitanteSelect.innerHTML = '<option value="">Todos</option>';
        data.users.forEach(function(u) {
            solicitanteSelect.innerHTML += '<option value="' + u.id + '">' + u.nome + '</option>';
        });
    }
}

function applyHistoricoTipsFilters() {
    var filterDataInicio = document.getElementById('filterTipDataInicio').value;
    var filterDataFim = document.getElementById('filterTipDataFim').value;
    var filterTitulo = document.getElementById('filterTipTitulo').value.toLowerCase().trim();
    var filterSolicitante = document.getElementById('filterTipSolicitante').value;
    
    var tipsFiltrados = data.tips.filter(function(tip) {
        // Filtro por data de criação
        if (filterDataInicio || filterDataFim) {
            if (!tip.data_criacao) return false;
            if (filterDataInicio && tip.data_criacao < filterDataInicio) return false;
            if (filterDataFim && tip.data_criacao > filterDataFim) return false;
        }
        
        // Filtro por título
        if (filterTitulo) {
            var titulo = (tip.titulo_proposta || '').toLowerCase();
            if (titulo.indexOf(filterTitulo) === -1) return false;
        }
        
        // Filtro por solicitante
        if (filterSolicitante && tip.solicitante_id !== filterSolicitante) return false;
        
        return true;
    });
    
    renderHistoricoTipsGrid(tipsFiltrados);
}

function clearHistoricoTipsFilters() {
    document.getElementById('filterTipDataInicio').value = '';
    document.getElementById('filterTipDataFim').value = '';
    document.getElementById('filterTipTitulo').value = '';
    document.getElementById('filterTipSolicitante').value = '';
    
    document.getElementById('historicoTipsGrid').innerHTML = '<p class="empty-message">Selecione os filtros e clique em "Confirmar" para visualizar os TIPs</p>';
}

function renderHistoricoTipsGrid(tips) {
    var container = document.getElementById('historicoTipsGrid');
    if (!container) return;
    
    if (tips.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum TIP encontrado com os filtros selecionados</p>';
        return;
    }
    
    var formatDate = function(dateStr) {
        if (!dateStr) return '-';
        var partes = dateStr.split('-');
        if (partes.length === 3) return partes[2] + '/' + partes[1] + '/' + partes[0];
        return dateStr;
    };
    
    var rowsHTML = '';
    tips.forEach(function(tip) {
        var solicitante = data.users.find(function(u) { return u.id === tip.solicitante_id; });
        var card = data.cards.find(function(c) { return c.id === tip.card_id; });
        var cliente = card ? data.clientes.find(function(c) { return c.id === card.cliente_id; }) : null;
        
        // Calcular valor total do orçamento
        var valorTotal = 0;
        if (tip.orcamento_fontes && Array.isArray(tip.orcamento_fontes)) {
            tip.orcamento_fontes.forEach(function(o) {
                valorTotal += parseFloat(o.valor_estimado) || 0;
            });
        }
        
        var numResultados = tip.principais_resultados ? tip.principais_resultados.length : 0;
        var numColaboradores = tip.colaboradores_potenciais ? tip.colaboradores_potenciais.length : 0;
        var numInstituicoes = tip.instituicoes_parceiras ? tip.instituicoes_parceiras.length : 0;
        var numRiscos = tip.analise_riscos ? tip.analise_riscos.length : 0;
        
        rowsHTML += '<tr>' +
            '<td>' +
                '<button type="button" class="btn-edit" onclick="viewTipFromHistorico(\'' + tip.id + '\')" title="Visualizar/Editar TIP">' +
                    '<i class="fas fa-eye"></i>' +
                '</button>' +
                '<button type="button" class="btn-edit" onclick="exportSingleTipToPdf(\'' + tip.id + '\')" title="Imprimir TIP" style="color: #EB5A46;">' +
                    '<i class="fas fa-file-pdf"></i>' +
                '</button>' +
            '</td>' +
            '<td><strong>' + (tip.titulo_proposta || '-') + '</strong></td>' +
            '<td>' + (solicitante ? solicitante.nome : '-') + '</td>' +
            '<td>' + formatDate(tip.data_criacao) + '</td>' +
            '<td>' + (tip.prazo_execucao ? tip.prazo_execucao + ' meses' : '-') + '</td>' +
            '<td>' + (card ? (card.titulo || '-') : '-') + '</td>' +
            '<td>' + (cliente ? cliente.nome : '-') + '</td>' +
            '<td style="text-align: center;">' + numResultados + '</td>' +
            '<td style="text-align: center;">' + numColaboradores + '</td>' +
            '<td style="text-align: center;">' + numInstituicoes + '</td>' +
            '<td style="text-align: center;">' + numRiscos + '</td>' +
            '<td style="text-align: right; color: var(--green); font-weight: 600;">R$ ' + formatCurrency(valorTotal) + '</td>' +
        '</tr>';
    });
    
    container.innerHTML = '<table>' +
        '<thead>' +
            '<tr>' +
                '<th style="width: 70px;">Ações</th>' +
                '<th>Título da Proposta</th>' +
                '<th>Solicitante</th>' +
                '<th>Data Criação</th>' +
                '<th>Prazo</th>' +
                '<th>Negociação</th>' +
                '<th>Cliente/Parceiro</th>' +
                '<th style="text-align: center;">Resultados</th>' +
                '<th style="text-align: center;">Colab.</th>' +
                '<th style="text-align: center;">Instit.</th>' +
                '<th style="text-align: center;">Riscos</th>' +
                '<th style="text-align: right;">Orçamento</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' + rowsHTML + '</tbody>' +
    '</table>';
}

function viewTipFromHistorico(tipId) {
    var tip = data.tips.find(function(t) { return t.id === tipId; });
    if (!tip) {
        alert('TIP não encontrado!');
        return;
    }
    
    // Abrir o TIP usando o cardId vinculado
    if (tip.card_id) {
        openTipFromCard(tip.card_id);
    } else {
        alert('Este TIP não está vinculado a nenhuma negociação.');
    }
}

function exportSingleTipToPdf(tipId) {
    var tip = data.tips.find(function(t) { return t.id === tipId; });
    if (!tip) {
        alert('TIP não encontrado!');
        return;
    }
    
    // Carregar dados do TIP no formulário e exportar
    if (tip.card_id) {
        // Carregar TIP temporariamente e exportar
        tipCardId = tip.card_id;
        tipEditingId = tip.id;
        tipResultados = tip.principais_resultados ? tip.principais_resultados.slice() : [];
        tipColaboradores = tip.colaboradores_potenciais ? tip.colaboradores_potenciais.slice() : [];
        tipInstituicoes = tip.instituicoes_parceiras ? tip.instituicoes_parceiras.slice() : [];
        tipOrcamento = tip.orcamento_fontes ? tip.orcamento_fontes.slice() : [];
        tipRiscos = tip.analise_riscos ? tip.analise_riscos.slice() : [];
        
        // Preencher campos do form oculto para que exportTipToPdf funcione
        document.getElementById('tipSolicitante').value = (function() {
            var u = data.users.find(function(u) { return u.id === tip.solicitante_id; });
            return u ? u.nome : '-';
        })();
        document.getElementById('tipSolicitanteId').value = tip.solicitante_id || '';
        document.getElementById('tipTituloProposta').value = tip.titulo_proposta || '';
        document.getElementById('tipDescricaoProposta').value = tip.descricao_proposta || '';
        document.getElementById('tipPrazoExecucao').value = tip.prazo_execucao || '';
        document.getElementById('tipDataCriacao').value = tip.data_criacao || '';
        document.getElementById('tipObjetivo').value = tip.objetivo || '';
        document.getElementById('tipProblemaJustificativa').value = tip.problema_oportunidade_justificativa || '';
        
        exportTipToPdf();
    } else {
        alert('Este TIP não está vinculado a nenhuma negociação.');
    }
}

// ==================== RELATÓRIO TIP (PDF) ====================

function gerarRelatorioTip() {
    if (!data.tips || data.tips.length === 0) {
        alert('Não há TIPs cadastrados para gerar o relatório!');
        return;
    }
    
    // Limpar campos anteriores
    document.getElementById('relatorioTipDataInicio').value = '';
    document.getElementById('relatorioTipDataFim').value = '';
    
    // Popular select de responsáveis
    var respSelect = document.getElementById('relatorioTipResponsavel');
    respSelect.innerHTML = '<option value="">Todos</option>';
    data.users.forEach(function(u) {
        respSelect.innerHTML += '<option value="' + u.id + '">' + u.nome + '</option>';
    });
    
    // Remover listener anterior se existir
    var form = document.getElementById('relatorioTipFiltroForm');
    var newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var responsavel = document.getElementById('relatorioTipResponsavel').value;
        var dataInicio = document.getElementById('relatorioTipDataInicio').value;
        var dataFim = document.getElementById('relatorioTipDataFim').value;
        
        closeModal('relatorioTipFiltroModal');
        
        _executarGeracaoRelatorioTip(responsavel, dataInicio, dataFim);
    });
    
    openModal('relatorioTipFiltroModal');
}

function _executarGeracaoRelatorioTip(responsavel, dataInicio, dataFim) {
    var tipsFiltrados = data.tips.filter(function(tip) {
        if (responsavel && tip.solicitante_id !== responsavel) return false;
        if (dataInicio || dataFim) {
            if (!tip.data_criacao) return false;
            if (dataInicio && tip.data_criacao < dataInicio) return false;
            if (dataFim && tip.data_criacao > dataFim) return false;
        }
        return true;
    });
    
    if (tipsFiltrados.length === 0) {
        alert('Nenhum TIP encontrado com os filtros informados.');
        return;
    }
    
    mostrarLoadingRelatorio('Gerando relatório de TIPs...');
    
    setTimeout(function() {
        try {
            var jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF('landscape', 'mm', 'a4');
            
            var startY = adicionarCabecalhoRelatorio(doc, 'Relatório de TIPs - Termos de Intenção de Projetos');
            
            var formatDatePdf = function(d) {
                if (!d) return '-';
                var p = d.split('-');
                return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : d;
            };
            
            // Resumo
            doc.setTextColor(23, 43, 77);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Resumo Estatístico', 14, startY);
            
            var valorTotalGeral = 0;
            tipsFiltrados.forEach(function(tip) {
                if (tip.orcamento_fontes && Array.isArray(tip.orcamento_fontes)) {
                    tip.orcamento_fontes.forEach(function(o) {
                        valorTotalGeral += parseFloat(o.valor_estimado) || 0;
                    });
                }
            });
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text('Total de TIPs: ' + tipsFiltrados.length + '  |  Valor Total Orçado: R$ ' + formatCurrency(valorTotalGeral), 14, startY + 8);
            
            // Filtros aplicados
            var filtrosTexto = 'Filtros: ';
            if (responsavel) {
                var userFiltro = data.users.find(function(u) { return u.id === responsavel; });
                filtrosTexto += 'Solicitante = ' + (userFiltro ? userFiltro.nome : '-');
            } else {
                filtrosTexto += 'Todos os solicitantes';
            }
            if (dataInicio || dataFim) {
                filtrosTexto += '  |  Período: ' + (dataInicio ? formatDatePdf(dataInicio) : 'início') + ' a ' + (dataFim ? formatDatePdf(dataFim) : 'hoje');
            }
            doc.text(filtrosTexto, 14, startY + 14);
            
            startY += 24;
            
            // Tabela resumo
            var tableData = tipsFiltrados.map(function(tip) {
                var solicitante = data.users.find(function(u) { return u.id === tip.solicitante_id; });
                var card = data.cards.find(function(c) { return c.id === tip.card_id; });
                var cliente = card ? data.clientes.find(function(c) { return c.id === card.cliente_id; }) : null;
                
                var valorOrcamento = 0;
                if (tip.orcamento_fontes && Array.isArray(tip.orcamento_fontes)) {
                    tip.orcamento_fontes.forEach(function(o) {
                        valorOrcamento += parseFloat(o.valor_estimado) || 0;
                    });
                }
                
                var numResultados = tip.principais_resultados ? tip.principais_resultados.length : 0;
                var numColaboradores = tip.colaboradores_potenciais ? tip.colaboradores_potenciais.length : 0;
                var numInstituicoes = tip.instituicoes_parceiras ? tip.instituicoes_parceiras.length : 0;
                var numRiscos = tip.analise_riscos ? tip.analise_riscos.length : 0;
                
                return [
                    (tip.titulo_proposta || '-').substring(0, 40),
                    solicitante ? solicitante.nome : '-',
                    formatDatePdf(tip.data_criacao),
                    tip.prazo_execucao ? tip.prazo_execucao + ' m' : '-',
                    card ? (card.titulo || '-').substring(0, 25) : '-',
                    cliente ? (cliente.nome || '-').substring(0, 25) : '-',
                    numResultados.toString(),
                    numColaboradores.toString(),
                    numInstituicoes.toString(),
                    numRiscos.toString(),
                    'R$ ' + formatCurrency(valorOrcamento)
                ];
            });
            
            // Linha de total
            tableData.push([
                'TOTAL (' + tipsFiltrados.length + ' TIPs)',
                '', '', '', '', '', '', '', '', '',
                'R$ ' + formatCurrency(valorTotalGeral)
            ]);
            
            doc.autoTable({
                startY: startY,
                head: [[
                    'Título da Proposta',
                    'Solicitante',
                    'Data Criação',
                    'Prazo',
                    'Negociação',
                    'Cliente/Parceiro',
                    'Result.',
                    'Colab.',
                    'Instit.',
                    'Riscos',
                    'Orçamento'
                ]],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [97, 189, 79],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 7,
                    halign: 'center'
                },
                bodyStyles: {
                    fontSize: 6.5,
                    textColor: [50, 50, 50]
                },
                alternateRowStyles: {
                    fillColor: [232, 245, 233]
                },
                columnStyles: {
                    0: { cellWidth: 38 },
                    1: { cellWidth: 28 },
                    2: { cellWidth: 20, halign: 'center' },
                    3: { cellWidth: 14, halign: 'center' },
                    4: { cellWidth: 30 },
                    5: { cellWidth: 30 },
                    6: { cellWidth: 14, halign: 'center' },
                    7: { cellWidth: 14, halign: 'center' },
                    8: { cellWidth: 14, halign: 'center' },
                    9: { cellWidth: 14, halign: 'center' },
                    10: { cellWidth: 28, halign: 'right' }
                },
                margin: { left: 14, right: 14 },
                didParseCell: function(cellData) {
                    // Última linha = TOTAL
                    if (cellData.row.index === tableData.length - 1 && cellData.section === 'body') {
                        cellData.cell.styles.fontStyle = 'bold';
                        cellData.cell.styles.fillColor = [200, 230, 201];
                        cellData.cell.styles.textColor = [27, 94, 32];
                        cellData.cell.styles.fontSize = 7;
                    }
                    // Colorir valor em verde
                    if (cellData.column.index === 10 && cellData.section === 'body' && cellData.row.index < tableData.length - 1) {
                        cellData.cell.styles.textColor = [39, 125, 50];
                        cellData.cell.styles.fontStyle = 'bold';
                    }
                }
            });
            
            // --- Detalhamento por TIP (cada TIP em uma seção) ---
            var detailStartY = doc.lastAutoTable.finalY + 15;
            
            tipsFiltrados.forEach(function(tip, tipIndex) {
                var pageHeight = doc.internal.pageSize.getHeight();
                var pageWidth = doc.internal.pageSize.getWidth();
                
                // Verificar se precisa nova página
                if (detailStartY > pageHeight - 60) {
                    doc.addPage();
                    detailStartY = 20;
                }
                
                var solicitante = data.users.find(function(u) { return u.id === tip.solicitante_id; });
                var card = data.cards.find(function(c) { return c.id === tip.card_id; });
                
                // Cabeçalho do TIP
                doc.setFillColor(23, 43, 77);
                doc.rect(14, detailStartY - 4, pageWidth - 28, 10, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text('TIP #' + (tipIndex + 1) + ': ' + (tip.titulo_proposta || '-').substring(0, 80), 18, detailStartY + 3);
                detailStartY += 12;
                
                // Info básica
                doc.setTextColor(80, 80, 80);
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.text('Solicitante: ' + (solicitante ? solicitante.nome : '-') + 
                    '  |  Data: ' + formatDatePdf(tip.data_criacao) + 
                    '  |  Prazo: ' + (tip.prazo_execucao ? tip.prazo_execucao + ' meses' : '-') +
                    '  |  Negociação: ' + (card ? (card.titulo || '-') : '-'), 18, detailStartY);
                detailStartY += 6;
                
                // Objetivo
                if (tip.objetivo) {
                    doc.setFontSize(8);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(23, 43, 77);
                    doc.text('Objetivo:', 18, detailStartY);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(80, 80, 80);
                    var objetivoLines = doc.splitTextToSize(tip.objetivo, pageWidth - 46);
                    doc.text(objetivoLines.slice(0, 3), 18, detailStartY + 4);
                    detailStartY += 4 + Math.min(objetivoLines.length, 3) * 4 + 4;
                }
                
                // Resultados resumo
                if (tip.principais_resultados && tip.principais_resultados.length > 0) {
                    if (detailStartY > pageHeight - 40) { doc.addPage(); detailStartY = 20; }
                    
                    var resultData = tip.principais_resultados.map(function(r) {
                        return [r.tipo_resultado || '-', r.trl || '-', (r.descricao || '-').substring(0, 50), r.mes || '-'];
                    });
                    
                    doc.autoTable({
                        startY: detailStartY,
                        head: [['Tipo Resultado', 'TRL', 'Descrição', 'Mês']],
                        body: resultData,
                        theme: 'grid',
                        headStyles: { fillColor: [97, 189, 79], fontSize: 6.5, textColor: [255, 255, 255], fontStyle: 'bold' },
                        bodyStyles: { fontSize: 6, textColor: [50, 50, 50] },
                        margin: { left: 18, right: 18 },
                        columnStyles: {
                            0: { cellWidth: 40 },
                            1: { cellWidth: 15, halign: 'center' },
                            2: { cellWidth: 140 },
                            3: { cellWidth: 15, halign: 'center' }
                        }
                    });
                    detailStartY = doc.lastAutoTable.finalY + 6;
                }
                
                // Orçamento resumo
                if (tip.orcamento_fontes && tip.orcamento_fontes.length > 0) {
                    if (detailStartY > pageHeight - 40) { doc.addPage(); detailStartY = 20; }
                    
                    var orcTipTotal = 0;
                    var orcData = tip.orcamento_fontes.map(function(o) {
                        var val = parseFloat(o.valor_estimado) || 0;
                        orcTipTotal += val;
                        return [o.nome_fonte || '-', o.tipo_fonte || '-', 'R$ ' + formatCurrency(val), (o.percentual_participacao || '0') + '%'];
                    });
                    orcData.push(['TOTAL', '', 'R$ ' + formatCurrency(orcTipTotal), '']);
                    
                    doc.autoTable({
                        startY: detailStartY,
                        head: [['Fonte Financiadora', 'Tipo', 'Valor', '%']],
                        body: orcData,
                        theme: 'grid',
                        headStyles: { fillColor: [255, 159, 26], fontSize: 6.5, textColor: [255, 255, 255], fontStyle: 'bold' },
                        bodyStyles: { fontSize: 6, textColor: [50, 50, 50] },
                        margin: { left: 18, right: 18 },
                        columnStyles: {
                            0: { cellWidth: 60 },
                            1: { cellWidth: 40 },
                            2: { cellWidth: 40, halign: 'right' },
                            3: { cellWidth: 20, halign: 'center' }
                        },
                        didParseCell: function(cellData) {
                            if (cellData.row.index === orcData.length - 1 && cellData.section === 'body') {
                                cellData.cell.styles.fontStyle = 'bold';
                                cellData.cell.styles.fillColor = [255, 243, 224];
                                cellData.cell.styles.textColor = [230, 81, 0];
                            }
                        }
                    });
                    detailStartY = doc.lastAutoTable.finalY + 10;
                }
                
                detailStartY += 5;
            });
            
            adicionarRodapeRelatorio(doc);
            doc.save('Relatorio_TIPs_' + new Date().toISOString().slice(0, 10) + '.pdf');
            
        } catch (error) {
            console.error('Erro ao gerar relatório TIP:', error);
            alert('Erro ao gerar o relatório de TIPs.');
        }
        
        esconderLoadingRelatorio();
    }, 100);
}



// Override para adicionar botões de mover após renderizar
var _origRender = renderKanbanBoard;
renderKanbanBoard = function() {
    _origRender();
    setTimeout(function() {
        adjustKanbanForMobile();
        addMobileCardMoveButtons();
    }, 150);
};

// Exportar funções mobile
window.isMobile = isMobile;
window.showMobileCardMoveModal = showMobileCardMoveModal;
window.adjustKanbanForMobile = adjustKanbanForMobile;


