document.addEventListener('DOMContentLoaded', function () {

    const grid = document.getElementById('home-produtos');
    const primeiros = PRODUTOS.slice(0, 4);

    for (let i = 0; i < primeiros.length; i++) {
        const p = primeiros[i];
        const card = document.createElement('article');
        card.className = 'card-produto';
        card.innerHTML =
            '<img src="' + p.img + '" alt="' + p.nome + '" style="width:100%; height:160px; object-fit:cover; border-radius:4px; margin-bottom:10px;">' +
            '<h3>' + p.nome + '</h3>' +
            '<div class="plataforma">' + p.plataforma + '</div>' +
            '<div class="preco">' + formatarMoeda(p.preco) + '</div>' +
            '<button class="btn btn-vermelho" onclick="adicionarAoCarrinho(\'' + p.id + '\')">Comprar</button>';
        grid.appendChild(card);
    }

    const formContato = document.getElementById('form-contato');
    if (formContato) {
        formContato.addEventListener('submit', function (e) {
            e.preventDefault();
            const nome  = document.getElementById('c-nome').value.trim();
            const email = document.getElementById('c-email').value.trim();
            const msg   = document.getElementById('c-msg').value.trim();
            const fb    = document.getElementById('feedback-contato');

            if (!nome || !email || !msg) {
                fb.innerHTML = '<div class="alerta alerta-erro">Preencha todos os campos!</div>';
                return;
            }
            fb.innerHTML = '<div class="alerta alerta-sucesso">Mensagem enviada! Retornaremos em breve.</div>';
            this.reset();
        });
    }

});