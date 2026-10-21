
document.addEventListener('DOMContentLoaded', function () {

    const dataAtual = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    const relData = document.getElementById('rel-data');
    const relRodape = document.getElementById('rel-rodape-data');
    if (relData)   relData.textContent = dataAtual;
    if (relRodape) relRodape.textContent = 'Gerado em: ' + dataAtual;

    renderizarStats();

    renderizarTabelaClientes(getClientes());
    renderizarTabelaCompras(getCompras());

    const buscaClientes = document.getElementById('busca-clientes');
    const buscaCompras  = document.getElementById('busca-compras');
    if (buscaClientes) {
        buscaClientes.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') filtrarClientes();
        });
    }
    if (buscaCompras) {
        buscaCompras.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') filtrarCompras();
        });
    }
});


function renderizarStats() {
    const clientes = getClientes();
    const compras  = getCompras();
    const totalVendas = compras.reduce(function (s, c) { return s + c.total; }, 0);
    const totalItens  = compras.reduce(function (s, c) {
        return s + c.produtos.reduce(function (si, p) { return si + p.qtd; }, 0);
    }, 0);

    const el = document.getElementById('grade-stats');
    if (!el) return;

    el.innerHTML =
        '<div class="card-stat">' +
        '  <div class="numero">' + clientes.length + '</div>' +
        '  <div class="rotulo">Clientes cadastrados</div>' +
        '</div>' +
        '<div class="card-stat">' +
        '  <div class="numero">' + compras.length + '</div>' +
        '  <div class="rotulo">Compras realizadas</div>' +
        '</div>' +
        '<div class="card-stat">' +
        '  <div class="numero">' + formatarMoeda(totalVendas) + '</div>' +
        '  <div class="rotulo">Total em vendas</div>' +
        '</div>' +
        '<div class="card-stat">' +
        '  <div class="numero">' + totalItens + '</div>' +
        '  <div class="rotulo">Itens vendidos</div>' +
        '</div>';
}


function mostrarAba(aba) {
    const painelClientes = document.getElementById('painel-clientes');
    const painelCompras  = document.getElementById('painel-compras');
    const tabClientes    = document.getElementById('tab-clientes');
    const tabCompras     = document.getElementById('tab-compras');

    if (aba === 'clientes') {
        painelClientes.classList.remove('oculto');
        painelCompras.classList.add('oculto');
        tabClientes.classList.add('ativa');
        tabCompras.classList.remove('ativa');
    } else {
        painelClientes.classList.add('oculto');
        painelCompras.classList.remove('oculto');
        tabClientes.classList.remove('ativa');
        tabCompras.classList.add('ativa');
    }
}


function renderizarTabelaClientes(lista) {
    const tbody = document.getElementById('tbody-clientes');
    const vazio = document.getElementById('clientes-vazio');
    const tabela = document.getElementById('tabela-clientes');
    if (!tbody) return;

    if (lista.length === 0) {
        tbody.innerHTML = '';
        if (tabela) tabela.style.display = 'none';
        if (vazio)  vazio.classList.remove('oculto');
        return;
    }

    if (tabela) tabela.style.display = '';
    if (vazio)  vazio.classList.add('oculto');

    const compras = getCompras();
    let html = '';
    for (let i = 0; i < lista.length; i++) {
        const c = lista[i];
        
        const numCompras = compras.filter(function (cp) { return cp.clienteId === c.id; }).length;
        
        let cpfFormatado = c.cpf || '';
        if (cpfFormatado.length === 11) {
            cpfFormatado = cpfFormatado.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        html +=
            '<tr>' +
            '  <td>' + c.id + '</td>' +
            '  <td>' + c.nome + '</td>' +
            '  <td>' + c.email + '</td>' +
            '  <td>' + cpfFormatado + '</td>' +
            '  <td>' + (c.telefone || '-') + '</td>' +
            '  <td>' + formatarData(c.criadoEm) + '</td>' +
            '  <td>' + numCompras + '</td>' +
            '</tr>';
    }
    tbody.innerHTML = html;
}


function filtrarClientes() {
    const termo = document.getElementById('busca-clientes').value.toLowerCase().trim();
    const clientes = getClientes();

    if (!termo) {
        renderizarTabelaClientes(clientes);
        return;
    }

    const resultado = clientes.filter(function (c) {
        let cpfFormatado = (c.cpf || '');
        if (cpfFormatado.length === 11) {
            cpfFormatado = cpfFormatado.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return c.nome.toLowerCase().indexOf(termo) >= 0 ||
               c.id.toLowerCase().indexOf(termo) >= 0 ||
               c.email.toLowerCase().indexOf(termo) >= 0 ||
               c.cpf.indexOf(termo.replace(/\D/g, '')) >= 0 ||
               cpfFormatado.indexOf(termo) >= 0;
    });

    renderizarTabelaClientes(resultado);
}

function limparBuscaClientes() {
    document.getElementById('busca-clientes').value = '';
    renderizarTabelaClientes(getClientes());
}


function renderizarTabelaCompras(lista) {
    const tbody = document.getElementById('tbody-compras');
    const vazio = document.getElementById('compras-vazio');
    const tabela = document.getElementById('tabela-compras');
    if (!tbody) return;

    if (lista.length === 0) {
        tbody.innerHTML = '';
        if (tabela) tabela.style.display = 'none';
        if (vazio)  vazio.classList.remove('oculto');
        return;
    }

    if (tabela) tabela.style.display = '';
    if (vazio)  vazio.classList.add('oculto');

    let html = '';
    for (let i = 0; i < lista.length; i++) {
        const cp = lista[i];
        
        const produtosTexto = cp.produtos.map(function (p) {
            return p.nome + ' x' + p.qtd;
        }).join(', ');

        html +=
            '<tr>' +
            '  <td>' + cp.id + '</td>' +
            '  <td>' + cp.clienteNome + ' (' + cp.clienteId + ')</td>' +
            '  <td>' + produtosTexto + '</td>' +
            '  <td>' + formatarMoeda(cp.total) + '</td>' +
            '  <td>' + formatarData(cp.data) + '</td>' +
            '  <td>' + cp.status + '</td>' +
            '</tr>';
    }
    tbody.innerHTML = html;
}


function filtrarCompras() {
    const termo = document.getElementById('busca-compras').value.toLowerCase().trim();
    const compras = getCompras();

    if (!termo) {
        renderizarTabelaCompras(compras);
        return;
    }

    const resultado = compras.filter(function (cp) {
        if (cp.id.toLowerCase().indexOf(termo) >= 0) return true;
        
        if (cp.clienteNome.toLowerCase().indexOf(termo) >= 0) return true;
        
        if (cp.clienteId.toLowerCase().indexOf(termo) >= 0) return true;
        
        if (formatarData(cp.data).indexOf(termo) >= 0) return true;
        
        if (formatarMoeda(cp.total).toLowerCase().indexOf(termo) >= 0) return true;
        if (String(cp.total).indexOf(termo) >= 0) return true;
        
        const temProduto = cp.produtos.some(function (p) {
            return p.nome.toLowerCase().indexOf(termo) >= 0;
        });
        if (temProduto) return true;
        return false;
    });

    renderizarTabelaCompras(resultado);
}

function limparBuscaCompras() {
    document.getElementById('busca-compras').value = '';
    renderizarTabelaCompras(getCompras());
}

(function () {
    const EMAIL_ADMIN = 'admin@gmail.com';
    const sessao = JSON.parse(localStorage.getItem('retroplay_sessao') || 'null');
    if (!sessao || sessao.email !== EMAIL_ADMIN) {
        sessionStorage.setItem('retroplay_acesso_negado', '1');
        window.location.replace('index.html');
    }
})();