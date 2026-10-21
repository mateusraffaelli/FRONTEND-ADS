const PRODUTOS = [
    { id: 'P001', nome: 'Pac-Man Deluxe',         preco: 89.90,  plataforma: 'Arcade',      img: 'img/pac-man.webp' },
    { id: 'P002', nome: 'Sonic Blast',             preco: 129.90, plataforma: 'Mega Drive', img: 'img/sonic.png' },
    { id: 'P003', nome: 'Donkey Kong 64',          preco: 149.90, plataforma: 'N64',        img: 'img/donkeykong.jpg'  },
    { id: 'P004', nome: 'Street Fighter II',       preco: 99.90,  plataforma: 'SNES',       img: 'img/st.jpg' },
    { id: 'P005', nome: 'Zelda: A Link to the Past',preco: 179.90, plataforma: 'SNES',      img: 'img/zelda.png'  },
    { id: 'P006', nome: 'Tetris Gold',             preco: 59.90,  plataforma: 'Game Boy',   img: 'img/tetris.jpg' },
    { id: 'P007', nome: 'Mega Man X',              preco: 109.90, plataforma: 'SNES',       img: 'img/megaman.png'  },
    { id: 'P008', nome: 'Mortal Kombat II',        preco: 119.90, plataforma: 'Arcade',     img: 'img/mortal-kombat.jpg'  },
    { id: 'P009', nome: 'Super Mario World',       preco: 159.90, plataforma: 'SNES',       img: 'img/mario.jpg'  },
    { id: 'P010', nome: 'Castlevania: SOTN',       preco: 189.90, plataforma: 'PS1',        img: 'img/castlevania.jpg'  },
    { id: 'P011', nome: 'Golden Axe',              preco: 79.90,  plataforma: 'Mega Drive', img: 'img/golden-axe.jpg'  },
    { id: 'P012', nome: 'Contra Force',            preco: 94.90,  plataforma: 'NES',        img: 'img/contra-force.jpg'  },
];



function formatarMoeda(valor) {
    return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
}

function formatarData(iso) {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('pt-BR');
}



function getClientes() {
    return JSON.parse(localStorage.getItem('retroplay_clientes') || '[]');
}

function salvarClientes(lista) {
    localStorage.setItem('retroplay_clientes', JSON.stringify(lista));
}

function gerarIdCliente() {
    const lista = getClientes();
    const num = lista.length + 1;
    return 'C' + String(num).padStart(3, '0');
}

function cadastrarCliente(dados) {
    const clientes = getClientes();
    const emailExiste = clientes.find(function(c) { return c.email === dados.email; });
    const cpfExiste   = clientes.find(function(c) { return c.cpf === dados.cpf; });
    if (emailExiste) return { ok: false, msg: 'E-mail ja cadastrado.' };
    if (cpfExiste)   return { ok: false, msg: 'CPF ja cadastrado.' };
    const novoCliente = {
        id: gerarIdCliente(),
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        cpf: dados.cpf,
        telefone: dados.telefone || '',
        rua: dados.rua || '',
        cep: dados.cep || '',
        numero: dados.numero || '',
        complemento: dados.complemento || '',
        criadoEm: new Date().toISOString()
    };
    clientes.push(novoCliente);
    salvarClientes(clientes);
    return { ok: true, id: novoCliente.id };
}

function editarCliente(id, dadosNovos) {
    const clientes = getClientes();
    const idx = clientes.findIndex(function(c) { return c.id === id; });
    if (idx === -1) return false;
    clientes[idx] = Object.assign({}, clientes[idx], dadosNovos, { id: clientes[idx].id });
    salvarClientes(clientes);
    return true;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;
    soma = 0;
    for (let j = 1; j <= 10; j++) soma += parseInt(cpf[j - 1]) * (12 - j);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf[10]);
}


const ADMIN_EMAIL = 'admin@gmail.com';

function getSessao() {
    return JSON.parse(localStorage.getItem('retroplay_sessao') || 'null');
}

function setSessao(cliente) {
    localStorage.setItem('retroplay_sessao', JSON.stringify(cliente));
}

function limparSessao() {
    localStorage.removeItem('retroplay_sessao');
}

function isAdmin() {
    const sessao = getSessao();
    return !!(sessao && sessao.email === ADMIN_EMAIL);
}

function login(email, senha) {
    const clientes = getClientes();
    const cliente = clientes.find(function(c) { return c.email === email && c.senha === senha; });
    if (!cliente) return { ok: false, msg: 'E-mail ou senha incorretos.' };
    setSessao(cliente);
    return { ok: true, cliente: cliente };
}

function logout() {
    limparSessao();
    window.location.href = 'index.html';
}

function getCarrinho() {
    return JSON.parse(localStorage.getItem('retroplay_carrinho') || '[]');
}

function salvarCarrinho(carrinho) {
    localStorage.setItem('retroplay_carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

function adicionarAoCarrinho(produtoId) {
    const produto = PRODUTOS.find(function(p) { return p.id === produtoId; });
    if (!produto) return;
    const carrinho = getCarrinho();
    const idx = carrinho.findIndex(function(i) { return i.id === produtoId; });
    if (idx >= 0) {
        carrinho[idx].qtd++;
    } else {
        carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, plataforma: produto.plataforma, qtd: 1 });
    }
    salvarCarrinho(carrinho);
    mostrarMensagem(produto.nome + ' adicionado ao carrinho!', 'sucesso');
}

function removerDoCarrinho(produtoId) {
    const carrinho = getCarrinho().filter(function(i) { return i.id !== produtoId; });
    salvarCarrinho(carrinho);
    renderizarCarrinho();
}

function alterarQtdCarrinho(produtoId, delta) {
    const carrinho = getCarrinho();
    const idx = carrinho.findIndex(function(i) { return i.id === produtoId; });
    if (idx === -1) return;
    carrinho[idx].qtd += delta;
    if (carrinho[idx].qtd <= 0) carrinho.splice(idx, 1);
    salvarCarrinho(carrinho);
    renderizarCarrinho();
}

function totalCarrinho() {
    return getCarrinho().reduce(function(soma, i) { return soma + i.preco * i.qtd; }, 0);
}

function atualizarContadorCarrinho() {
    const el = document.getElementById('cart-count');
    if (!el) return;
    const total = getCarrinho().reduce(function(s, i) { return s + i.qtd; }, 0);
    el.textContent = total;
    el.style.display = total > 0 ? 'inline-block' : 'none';
}


function renderizarCarrinho() {
    const lista   = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!lista) return;
    const carrinho = getCarrinho();
    if (carrinho.length === 0) {
        lista.innerHTML = '<p style="text-align:center;color:#888;padding:20px">Carrinho vazio. Adicione jogos na loja.</p>';
        if (totalEl) totalEl.textContent = 'R$ 0,00';
        return;
    }
    let html = '';
    for (let i = 0; i < carrinho.length; i++) {
        const item = carrinho[i];
        html += '<div class="item-carrinho">';
        html += '  <div class="nome-item">' + item.nome + '</div>';
        html += '  <div class="qtd-item">';
        html += '    <button onclick="alterarQtdCarrinho(\'' + item.id + '\', -1)">-</button>';
        html += '    <span>' + item.qtd + '</span>';
        html += '    <button onclick="alterarQtdCarrinho(\'' + item.id + '\', 1)">+</button>';
        html += '  </div>';
        html += '  <div class="preco-item">' + formatarMoeda(item.preco * item.qtd) + '</div>';
        html += '  <button class="btn btn-vermelho" style="padding:4px 8px;font-size:12px" onclick="removerDoCarrinho(\'' + item.id + '\')">Remover</button>';
        html += '</div>';
    }
    lista.innerHTML = html;
    if (totalEl) totalEl.textContent = formatarMoeda(totalCarrinho());
}


function getCompras() {
    return JSON.parse(localStorage.getItem('retroplay_compras') || '[]');
}

function salvarCompras(lista) {
    localStorage.setItem('retroplay_compras', JSON.stringify(lista));
}

function finalizarCompra() {
    const sessao = getSessao();
    if (!sessao) {
        window.location.href = 'login.html';
        return null;
    }
    const carrinho = getCarrinho();
    if (carrinho.length === 0) {
        mostrarMensagem('Carrinho vazio!', 'erro');
        return null;
    }
    const compras = getCompras();
    const novoId  = 'CP' + String(compras.length + 1).padStart(3, '0');
    compras.push({
        id: novoId,
        clienteId: sessao.id,
        clienteNome: sessao.nome,
        produtos: carrinho.map(function(i) {
            return { id: i.id, nome: i.nome, qtd: i.qtd, preco: i.preco };
        }),
        total: totalCarrinho(),
        data: new Date().toISOString(),
        status: 'Concluida'
    });
    salvarCompras(compras);
    salvarCarrinho([]);
    return novoId;
}


function mostrarMensagem(texto, tipo) {
    let el = document.getElementById('mensagem-toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'mensagem-toast';
        el.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;padding:10px 16px;border-radius:4px;font-size:13px;max-width:300px;';
        document.body.appendChild(el);
    }
    if (tipo === 'sucesso') {
        el.style.backgroundColor = '#eeffee';
        el.style.border = '1px solid #007700';
        el.style.color = '#007700';
    } else {
        el.style.backgroundColor = '#ffeeee';
        el.style.border = '1px solid #cc0000';
        el.style.color = '#cc0000';
    }
    el.textContent = texto;
    el.style.display = 'block';
    clearTimeout(el._timer);
    el._timer = setTimeout(function() { el.style.display = 'none'; }, 3000);
}


function atualizarNavbar() {
    const sessao    = getSessao();
    const userInfo  = document.getElementById('user-info');
    const navLogin  = document.getElementById('nav-login');
    const navLogout = document.getElementById('nav-logout');
    const navItemPerfil = document.getElementById('nav-item-perfil');
    const navItemLogin  = document.getElementById('nav-item-login');
    if (userInfo)  userInfo.textContent = sessao ? 'Olá, ' + sessao.nome.split(' ')[0] : '';
    if (navLogin)  navLogin.style.display = sessao ? 'none' : '';
    if (navLogout) navLogout.style.display = sessao ? '' : 'none';
    if (navItemPerfil) navItemPerfil.style.display = sessao ? '' : 'none';
    if (navItemLogin)  navItemLogin.style.display  = sessao ? 'none' : '';
    atualizarContadorCarrinho();
}

document.addEventListener('DOMContentLoaded', function() {
    atualizarNavbar();

   
    const paginaAtual = location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');
    for (let i = 0; i < links.length; i++) {
        if (links[i].getAttribute('href') === paginaAtual) {
            links[i].classList.add('active');
        }
    }

   
    const cartBtn   = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    if (cartBtn && cartModal) {
        cartBtn.addEventListener('click', function() {
            renderizarCarrinho();
            cartModal.classList.add('aberto');
        });
        const btnFechar = cartModal.querySelector('.modal-fechar');
        if (btnFechar) {
            btnFechar.addEventListener('click', function() {
                cartModal.classList.remove('aberto');
            });
        }
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) cartModal.classList.remove('aberto');
        });
    }


    if (sessionStorage.getItem('retroplay_acesso_negado')) {
        sessionStorage.removeItem('retroplay_acesso_negado');
        mostrarMensagem('Acesso restrito: apenas o administrador pode acessar essa página.', 'erro');
    }
});