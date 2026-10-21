// Enum NivelAcesso e objeto usuario com três propriedades além do nível de acesso.

enum NivelAcesso {
  ALUNO,
  PROFESSOR,
  ADMIN,
}

interface Usuario {
  nome: string;
  email: string;
  idade: number;
  nivel: NivelAcesso;
}

const usuario: Usuario = {
  nome: "João Silva",
  email: "joao.silva@exemplo.com",
  idade: 21,
  nivel: NivelAcesso.ALUNO,
};

console.log(usuario);
console.log("Nível de acesso:", NivelAcesso[usuario.nivel]);