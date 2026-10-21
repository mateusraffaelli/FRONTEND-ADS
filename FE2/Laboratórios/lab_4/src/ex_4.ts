// Objeto com pelo menos três propriedades obrigatórias, mas pode ter propriedades adicionais não definidas na criação.

interface Produto {
  nome: string;
  preco: number;
  quantidade: number;
  [propriedadeExtra: string]: any; 
}

const produto: Produto = {
  nome: "Notebook",
  preco: 3500,
  quantidade: 10,
};

produto.marca = "Dell";
produto.cor = "Prata";
produto.garantiaMeses = 12;
produto.emPromocao = true;
produto.categoria = "Eletrônicos";

console.log(produto);