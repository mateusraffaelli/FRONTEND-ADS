

// lista de personagens
var personagens = [
  { id: 1,  nome: "Arthur Morgan",     imagem: "imagens/Arthur_Morgan_-_Red_Dead_Redemption_2.png" },
  { id: 2,  nome: "Kratos",         imagem: "imagens/Newkratosrender.webp" },
  { id: 3,  nome: "Geralt",          imagem: "imagens/Witcher_PNG22.webp" },
  { id: 4,  nome: "Joel",            imagem: "imagens/joel.png" },
  { id: 5,  nome: "Scorpion",      imagem: "imagens/scorpion.png" },
  { id: 6,  nome: "Sonic",             imagem: "imagens/sonic.png" },
  { id: 7,  nome: "Mario",           imagem: "imagens/mario.png" },
  { id: 8,  nome: "Leon", imagem: "imagens/leon.png" },
  { id: 9,  nome: "CJ",     imagem: "imagens/cj.png" },
  { id: 10, nome: "Nathan Drake",  imagem: "imagens/nathan.png" },
  { id: 11, nome: "Trevor",            imagem: "imagens/trevor.png" },
  { id: 12, nome: "Lara Croft",            imagem: "imagens/lara.png" },
  { id: 13, nome: "Hollow Knight",             imagem: "imagens/knight.webp" },
  { id: 14, nome: "Master Chief Halo",            imagem: "imagens/halo.png" },
  { id: 15, nome: "Pikachu",          imagem: "imagens/pikachu.png" },
  { id: 16, nome: "Hitman",           imagem: "imagens/hitman.png" },
  { id: 17, nome: "Crash",             imagem: "imagens/crash.webp" },
  { id: 18, nome: "Link",             imagem: "imagens/link.png" },
  { id: 19, nome: "Ryu",         imagem: "imagens/ryu.png" },
  { id: 20, nome: "Edward Kenway",            imagem: "imagens/edward.png" },
];

// funcao pra adicionar personagem novo
function adicionarPersonagem(novoPersonagem) {
  personagens.push(novoPersonagem);
}


// dificuldades
var dificuldades = {
  facil:   { pares: 8,  colunas: 4 },
  medio:  { pares: 12, colunas: 6 },
  dificil: { pares: 16, colunas: 8 },
};

// variaveis
var cartasViradas = [];
var totalTentativas = 0;
var paresEncontrados = 0;
var totalPares = 0;
var travado = false;
var jogando = false;
var todasAsCartas = [];


// embaralhar array
function embaralhar(array) {
  var arr = array.slice();
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}


// gera as cartas (pares)
function gerarCartas(qtdPares) {
  var selecionados = embaralhar(personagens).slice(0, qtdPares);
  var pares = [];

  for (var i = 0; i < selecionados.length; i++) {
    var p = selecionados[i];
    pares.push({ id: p.id, nome: p.nome, imagem: p.imagem, uid: p.id + '-a' });
    pares.push({ id: p.id, nome: p.nome, imagem: p.imagem, uid: p.id + '-b' });
  }
  return embaralhar(pares);
}


// cria o elemento de uma carta
function criarCarta(carta, indice) {
  var div = document.createElement('div');
  div.className = 'carta';
  div.dataset.indice = indice;
  div.dataset.cartaId = carta.id;

  var interno = document.createElement('div');
  interno.className = 'carta-interna';

  var verso = document.createElement('div');
  verso.className = 'carta-verso';

  var frente = document.createElement('div');
  frente.className = 'carta-frente';
  frente.innerHTML = '<img src="' + carta.imagem + '" alt="' + carta.nome + '" class="carta-imagem">';

  interno.appendChild(verso);
  interno.appendChild(frente);
  div.appendChild(interno);

  div.addEventListener('click', function() {
    clicarCarta(div, indice);
  });

  return div;
}


// monta o tabuleiro
function montarTabuleiro(cartas, dificuldade) {
  var tabuleiro = document.getElementById('tabuleiro');
  tabuleiro.innerHTML = '';

  var colunas = dificuldades[dificuldade].colunas;

  // ajuste pra tela pequena
  if (window.innerWidth <= 400 && colunas > 4) {
    colunas = 4;
  } else if (window.innerWidth <= 540 && colunas > 6) {
    colunas = 6;
  }

  tabuleiro.style.gridTemplateColumns = 'repeat(' + colunas + ', 1fr)';

  for (var i = 0; i < cartas.length; i++) {
    var cartaEl = criarCarta(cartas[i], i);
    tabuleiro.appendChild(cartaEl);
  }
}


// quando clica na carta
function clicarCarta(elemento, indice) {
  if (travado) return;
  if (!jogando) return;
  if (elemento.classList.contains('virada')) return;
  if (elemento.classList.contains('encontrada')) return;
  if (cartasViradas.length >= 2) return;

  elemento.classList.add('virada');
  cartasViradas.push({ elemento: elemento, indice: indice, cartaId: parseInt(elemento.dataset.cartaId) });

  if (cartasViradas.length == 2) {
    totalTentativas++;
    atualizarPlacar();
    travado = true;

    var carta1 = cartasViradas[0];
    var carta2 = cartasViradas[1];

    if (carta1.cartaId === carta2.cartaId) {

      carta1.elemento.classList.add('encontrada');
      carta2.elemento.classList.add('encontrada');
      paresEncontrados++;
      cartasViradas = [];
      travado = false;
      atualizarPlacar();

      if (paresEncontrados == totalPares) {
        setTimeout(function() {
          mostrarFimDeJogo();
        }, 500);
      }

    } else {
      setTimeout(function() {
        carta1.elemento.classList.remove('virada');
        carta2.elemento.classList.remove('virada');
        cartasViradas = [];
        travado = false;
      }, 900);
    }
  }
}


// atualiza placar
function atualizarPlacar() {
  document.getElementById('tentativas').textContent = totalTentativas;
  document.getElementById('pares').textContent = paresEncontrados + ' / ' + totalPares;
}


// salvar e carregar dados 
function carregarDadosSalvos() {
  var partidas = localStorage.getItem('jogo_partidas');
  var melhor   = localStorage.getItem('jogo_melhor');
  return {
    partidas: parseInt(partidas) || 0,
    melhor:   melhor != null ? parseInt(melhor) : null
  };
}

function salvarResultado(tentativas) {
  var dados = carregarDadosSalvos();
  dados.partidas = dados.partidas + 1;

  var novoRecord = false;
  if (dados.melhor == null || tentativas < dados.melhor) {
    dados.melhor = tentativas;
    novoRecord = true;
  }

  localStorage.setItem('jogo_partidas', dados.partidas);
  localStorage.setItem('jogo_melhor',   dados.melhor);
  return { partidas: dados.partidas, melhor: dados.melhor, novoRecord: novoRecord };
}

function atualizarStatsNaTela() {
  var dados = carregarDadosSalvos();
  document.getElementById('partidas').textContent = dados.partidas;
  document.getElementById('recorde').textContent  = dados.melhor != null ? dados.melhor : '—';
}


// fim de jogo
function mostrarFimDeJogo() {
  jogando = false;
  var resultado = salvarResultado(totalTentativas);
  atualizarStatsNaTela();

  var titulo = '';
  var taxa = totalTentativas / totalPares;

  if (taxa <= 1.2) {
    titulo = 'Perfeito!';
  } else if (taxa <= 1.6) {
    titulo = 'Muito bem!';
  } else if (taxa <= 2.2) {
    titulo = 'Bom jogo!';
  } else {
    titulo = 'Continue tentando!';
  }

  document.getElementById('janela-titulo').textContent = titulo;
  document.getElementById('janela-mensagem').textContent   = 'Você completou com ' + totalTentativas + ' tentativas e ' + totalPares + ' pares.';

  var elMelhor = document.getElementById('janela-recorde');
  if (resultado.novoRecord) {
    elMelhor.innerHTML = '<span class="selo-recorde">Novo recorde!</span>';
  } else {
    elMelhor.textContent = 'Seu recorde: ' + resultado.melhor + ' tentativas.';
  }

  document.getElementById('fundo-escuro').classList.add('visivel');
}


// inicia o jogo
function iniciarJogo() {
  var dificuldade = document.getElementById('dificuldade').value;
  var qtdPares    = dificuldades[dificuldade].pares;

  cartasViradas     = [];
  totalTentativas   = 0;
  paresEncontrados  = 0;
  totalPares        = qtdPares;
  travado           = false;
  jogando           = true;
  todasAsCartas     = gerarCartas(qtdPares);

  document.getElementById('fundo-escuro').classList.remove('visivel');
  atualizarPlacar();
  montarTabuleiro(todasAsCartas, dificuldade);
}


// botoes
document.getElementById('botao-iniciar').addEventListener('click', function() {
  iniciarJogo();
});

document.getElementById('botao-jogar-de-novo').addEventListener('click', function() {
  iniciarJogo();
});


var timerResize;
window.addEventListener('resize', function() {
  clearTimeout(timerResize);
  timerResize = setTimeout(function() {
    if (jogando) {
      var dificuldade = document.getElementById('dificuldade').value;
      montarTabuleiro(todasAsCartas, dificuldade);
    }
  }, 250);
});

atualizarStatsNaTela();
iniciarJogo();