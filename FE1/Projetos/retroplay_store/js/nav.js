(function () {

    const linkAdminMenu = isAdmin() ?
        '      <li><a href="relatorios.html">Admin</a></li>' : '';

    const navbarHTML = '' +
        '<header>' +
        '  <nav>' +
        '    <div class="nav-topo">' +
        '      <button id="menu-toggle" class="menu-toggle" aria-label="Abrir menu">&#9776;</button>' +
        '      <a href="index.html" class="navbar-brand">Retro<span>Play</span> </a>' +
        '      <div class="nav-acoes">' +
        '        <span id="user-info"></span>' +
        '        <button id="cart-btn" class="btn">Carrinho <span id="cart-count" style="display:none">0</span></button>' +
        '        <button id="nav-logout" class="btn btn-vermelho" style="display:none" onclick="logout()">Sair</button>' +
        '      </div>' +
        '    </div>' +
        '    <ul class="nav-links" id="nav-links">' +
        '      <li><a href="index.html">Inicio</a></li>' +
        '      <li><a href="loja.html">Loja</a></li>' +
        '      <li id="nav-item-perfil" style="display:none"><a href="login.html">Meu Perfil</a></li>' +
        '      <li id="nav-item-login"><a href="login.html" id="nav-login">Login</a></li>' +
        linkAdminMenu +
        '    </ul>' +
        '  </nav>' +
        '</header>';

    const modalHTML = '' +
        '<div class="modal-overlay" id="cart-modal">' +
        '  <div class="modal">' +
        '    <div class="modal-cabecalho">' +
        '      <h2>Carrinho</h2>' +
        '      <button class="modal-fechar" aria-label="Fechar">X</button>' +
        '    </div>' +
        '    <div id="cart-items"></div>' +
        '    <div class="total-carrinho">' +
        '      <span>Total</span>' +
        '      <span id="cart-total">R$ 0,00</span>' +
        '    </div>' +
        '    <div class="botoes-carrinho">' +
        '      <button class="btn btn-vermelho" onclick="document.getElementById(\'cart-modal\').classList.remove(\'aberto\')">Continuar comprando</button>' +
        '      <button class="btn btn-verde" onclick="irParaCheckout()">Finalizar compra</button>' +
        '    </div>' +
        '  </div>' +
        '</div>';

    const linkAdminRodape = isAdmin() ?
        ' <a href="relatorios.html">Relatórios</a>' : '';

    const footerHTML = '' +
        '<footer>' +
        '  <p>RetroPlay Store</p>' +
        '  <p>' +
        '    <a href="index.html">Início</a> |' +
        '    <a href="loja.html">Loja</a> |' +
        '    <a href="login.html">Login</a> |' +
        linkAdminRodape +
        '  </p>' +
        '  <p>2026 RetroPlay Store - Florianopolis, SC - Brasil</p>' +
        '</footer>';

    document.body.insertAdjacentHTML('afterbegin', navbarHTML + modalHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);

})();

function irParaCheckout() {
    const sessao = getSessao();
    if (!sessao) {
        mostrarMensagem('Faca login para finalizar a compra!', 'erro');
        setTimeout(function() { window.location.href = 'login.html'; }, 1500);
        return;
    }
    document.getElementById('cart-modal').classList.remove('aberto');
    window.location.href = 'loja.html#checkout';
}

document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (toggle && navLinks) {
        toggle.addEventListener('click', function () {
            navLinks.classList.toggle('aberto');
        });
    }
});