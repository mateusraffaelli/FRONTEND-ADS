// • Crie uma lista inicial com pelo menos cinco produtos;
// • Exporte essa lista para que ela possa ser usada por outros módulos;
// • A lista deve importar o tipo Produto;
// • Pelo menos um produto deve estar indisponível para compra.

import { Produto } from "./produto";

const catalogo: Produto[] = [
  {
    id: 1,
    nome: "Notebook Dell Inspiron 15",
    categoria: "notebooks",
    preco: 3499.9,
    disponivel: true,
  },
  {
    id: 2,
    nome: "Monitor LG UltraWide 29\"",
    categoria: "monitores",
    preco: 1299.0,
    disponivel: true,
  },
  {
    id: 3,
    nome: "Teclado Mecânico Redragon Kumara",
    categoria: "perifericos",
    preco: 199.9,
    disponivel: false,
  },
  {
    id: 4,
    nome: "SSD Kingston NV2 1TB",
    categoria: "armazenamento",
    preco: 349.5,
    disponivel: true,
  },
  {
    id: 5,
    nome: "Placa de Vídeo RTX 4060",
    categoria: "componentes",
    preco: 2199.0,
    disponivel: false,
  },
];

export { catalogo };

// • Implemente e exporte as funções listarDisponiveis e
// buscarPorId;
// • A função listarDisponiveis deve retornar apenas os produtos disponíveis;
// • A função buscarPorId deve retornar o produto encontrado ou null;
// • As funções não devem acessar diretamente o DOM.

const listarDisponiveis = (lista: Produto[]): Produto[] => {
  return lista.filter((p) => p.disponivel);
};

const buscarPorId = (lista: Produto[], id: number): Produto | null => {
  const produtoEncontrado = lista.find((p) => p.id === id);

  if (!produtoEncontrado) return null;

  return produtoEncontrado;
};

export { listarDisponiveis, buscarPorId };