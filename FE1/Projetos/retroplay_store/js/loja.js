let produtosFiltrados = PRODUTOS.slice();

function renderizarLoja() {
    const grade = document.getElementById('loja-grade');
    const vazio = document.getElementById('loja-vazio');

    if (produtosFiltrados.length === 0) {
        grade.innerHTML = '';
        vazio.classList.remove('oculto');
        return;
    }

    vazio.classList.add('oculto');
    let html = '';
    for (let i = 0; i < produtosFiltrados.length; i++) {
        const p = produtosFiltrados[i];
        html +=
    '<article class="card-produto">' +
    '  <img src="' + p.img + '" alt="' + p.nome + '" style="width:100%; height:160px; object-fit:cover; border-radius:4px; margin-bottom:10px;">' +
    '  <h3>' + p.nome + '</h3>' +
    '  <div class="plataforma">' + p.plataforma + '</div>' +
    '  <div class="preco">' + formatarMoeda(p.preco) + '</div>' +
    '  <button class="btn btn-vermelho" onclick="adicionarAoCarrinho(\'' + p.id + '\')">Adicionar ao carrinho</button>' +
    '</article>';
    }
    grade.innerHTML = html;
}

function aplicarFiltros() {
    const busca = document.getElementById('filtro-busca').value.toLowerCase();
    const plat  = document.getElementById('filtro-plataforma').value;
    const ordem = document.getElementById('filtro-ordem').value;

    let lista = PRODUTOS.slice();

    if (busca) {
        lista = lista.filter(function(p) {
            return p.nome.toLowerCase().indexOf(busca) >= 0 || p.plataforma.toLowerCase().indexOf(busca) >= 0;
        });
    }

    if (plat) {
        lista = lista.filter(function(p) { return p.plataforma === plat; });
    }

    if (ordem === 'az') lista.sort(function(a, b) { return a.nome.localeCompare(b.nome); });
    if (ordem === 'za') lista.sort(function(a, b) { return b.nome.localeCompare(a.nome); });
    if (ordem === 'menor') lista.sort(function(a, b) { return a.preco - b.preco; });
    if (ordem === 'maior') lista.sort(function(a, b) { return b.preco - a.preco; });

    produtosFiltrados = lista;
    renderizarLoja();
}

function renderizarCheckout() {
    const sessao = getSessao();
    const el = document.getElementById('checkout-conteudo');

    if (!sessao) {
        el.innerHTML =
            '<div style="text-align:center; padding:20px;">' +
            '  <p style="font-size:14px; color:#888; margin-bottom:15px;">Faca login para finalizar sua compra.</p>' +
            '  <a href="login.html" class="btn btn-azul">Entrar na conta</a>' +
            '</div>';
        return;
    }

    const carrinho = getCarrinho();
    if (carrinho.length === 0) {
        el.innerHTML = '<p style="text-align:center; color:#888; font-size:14px;">Seu carrinho esta vazio. Adicione jogos acima!</p>';
        return;
    }

    let itensHtml = '';
    for (let i = 0; i < carrinho.length; i++) {
        const item = carrinho[i];
        itensHtml +=
            '<div class="linha-pedido">' +
            '  <span>' + item.nome + ' x ' + item.qtd + '</span>' +
            '  <span>' + formatarMoeda(item.preco * item.qtd) + '</span>' +
            '</div>';
    }

    el.innerHTML =
        '<div class="checkout-box">' +
        '  <h3>Resumo do Pedido</h3>' +
        '  <p style="font-size:14px; margin-bottom:15px;">Cliente: <strong>' + sessao.nome + '</strong> (' + sessao.id + ')</p>' +
        itensHtml +
        '  <div class="total-pedido">' +
        '    <span>Total</span>' +
        '    <span>' + formatarMoeda(totalCarrinho()) + '</span>' +
        '  </div>' +
        '  <div id="alerta-checkout" style="margin-top:10px;"></div>' +
        '  <button class="btn btn-verde btn-bloco" onclick="confirmarCompra()">Confirmar Compra</button>' +
        '</div>';
}

function confirmarCompra() {
    const id = finalizarCompra();
    if (!id) return;
    const el = document.getElementById('checkout-conteudo');
    el.innerHTML =
        '<div style="text-align:center; padding:30px;">' +
        '  <h3 style="color:#007700; margin-bottom:10px;">Compra Confirmada!</h3>' +
        '  <p style="font-size:14px; color:#555;">Pedido <strong>' + id + '</strong> registrado com sucesso.</p>' +
        '  <a href="loja.html" class="btn btn-vermelho" style="display:inline-block; margin-top:15px;">Continuar comprando</a>' +
        '</div>';
    atualizarContadorCarrinho();
}

document.addEventListener('DOMContentLoaded', function () {
    renderizarLoja();
    renderizarCheckout();

    document.getElementById('filtro-busca').addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-plataforma').addEventListener('change', aplicarFiltros);
    document.getElementById('filtro-ordem').addEventListener('change', aplicarFiltros);

    if (location.hash === '#checkout') {
        setTimeout(function () {
            renderizarCheckout();
            const el = document.getElementById('checkout');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
});