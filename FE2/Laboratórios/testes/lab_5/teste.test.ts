import { describe, test, expect, beforeEach, vi } from "vitest";
import { Filme, Jogo, Cliente, type Artista } from "../../lab_5/src/lab.js";

// Função auxiliar para extrair a quantidade de cópias a partir da string de descrição
function extrairCopias(descricao: string): number {
  const match = descricao.match(/C[oó]pias Dispon[ií]veis:\s*(\d+)/i);
  if (!match) {
    throw new Error(
      `Não foi possível encontrar o número de cópias em: "${descricao}"`
    );
  }
  return Number(match[1]);
}

describe("Questão 2", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  describe("Cliente", () => {
    test('deve expor o nome informado no construtor', () => {
      const cliente = new Cliente("Alice");

      const nome = cliente.nome;

      expect(nome).toBe("Alice");

    });

    test("deve expor o código único gerado", () => {
      const cliente = new Cliente("Bob");

      const codigo = cliente.codigo;

      expect(typeof codigo).toBe("number");
      expect(codigo).toBeGreaterThan(0);
    });

    test("deve possuir código único", () => {
      const c3 = new Cliente("Carol");
      const c1 = new Cliente("David");
      const c2 = new Cliente("Eva");

      expect(c1.codigo).not.toBe(c2.codigo);
      expect(c1.codigo).not.toBe(c3.codigo);
      expect(c2.codigo).not.toBe(c3.codigo);
    });

    test('deve incluir o código gerado na lista estática de códigos', () => {
      const codigoAntes = Cliente.codigos.length;

      const cliente = new Cliente("Frank");
      const codigoDepois = Cliente.codigos.length;

      expect(codigoDepois).toBe(codigoAntes + 1);
      expect(Cliente.codigos).toContain(cliente.codigo);
    });
  });

  describe("Filme", () => {
    test("deve incluir título e cópias disponíveis na descrição", () => {
      const elenco: Artista[] = [];
      const filme = new Filme("Matrix", 3, elenco);

      const descricao = filme.descricao();

      expect(descricao).toContain("Título: Matrix");
      expect(descricao).toContain("Cópias Disponíveis: 3");
    });

    test("deve listar o elenco formatado corretamente na descrição", () => {
      const elenco: Artista[] = [
        { nome: "Ana", sobrenome: "Silva", nacionalidade: "Brasileira" },
        { nome: "John", sobrenome: "Doe", nacionalidade: "Americana" },
      ];

      const filme = new Filme("Filme Teste", 2, elenco);
      const desc = filme.descricao();

      expect(desc).toContain("Título: Filme Teste");
      expect(desc).toContain(
        "Elenco: Ana Silva (Brasileira); John Doe (Americana)"
      );
    });

    test("deve diminuir o número de cópias ao alugar", () => {
      const elenco: Artista[] = [];
      const filme = new Filme("Inception", 2, elenco);
      const cliente = new Cliente("Cliente 1");

      const sucesso = filme.alugar(cliente);

      expect(sucesso).toBe(true);
      expect(filme.copias).toBe(1);
    });

    test("não deve alugar quando não houver cópias disponíveis", () => {
      const elenco: Artista[] = [];
      const filme = new Filme("Filme Raro", 1, elenco);
      const c1 = new Cliente("Cliente A");
      const c2 = new Cliente("Cliente B");

      const primeiroAluguel = filme.alugar(c1);
      const segundoAluguel = filme.alugar(c2);

      expect(primeiroAluguel).toBe(true);
      expect(segundoAluguel).toBe(false);
      expect(filme.copias).toBe(0);
    });
    
    test("não deve permitir aluguel duplicado do mesmo cliente", () => {
      const elenco: Artista[] = [];
      const filme = new Filme("Inception", 2, elenco);
      const cliente = new Cliente("Cliente 1");

      const primeiroAluguel = filme.alugar(cliente);
      const segundoAluguel = filme.alugar(cliente);

      expect(primeiroAluguel).toBe(true);
      expect(segundoAluguel).toBe(false);
      expect(filme.copias).toBe(1);
    });

    test("deve devolver cópia sem multa se devolvido em até 5 dias", () => {
      const filme = new Filme("Filme Y", 2, []);
      const cliente = new Cliente("Cliente Filme");

      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-01T10:00:00Z"));
      filme.alugar(cliente);
      vi.setSystemTime(new Date("2025-01-04T10:00:00Z"));
      const multa = filme.devolver(cliente);

      expect(multa).toBe(0);
      vi.useRealTimers();
    });

    test("deve calcular multa correta quando devolvido com atraso", () => {
      const filme = new Filme("Filme Z", 1, []);
      const cliente = new Cliente("Cliente Atrasado");

      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-02-01T10:00:00Z"));
      filme.alugar(cliente);
      vi.setSystemTime(new Date("2025-02-10T10:00:00Z"));
      const multa = filme.devolver(cliente);

      expect(multa).toBe(12);
      vi.useRealTimers();
    });

    test("deve retornar -1 se o cliente devolver sem ter alugado", () => {
      const filme = new Filme("Filme X", 1, []);
      const cliente = new Cliente("Fulano");

      const multa = filme.devolver(cliente);
      expect(multa).toBe(-1);
    });
  });

  describe("Jogo", () => {
    test("deve incluir título, cópias disponíveis e plataforma na descrição", () => {
      const jogo = new Jogo("Zelda", 5, "Switch");

      const desc = jogo.descricao();

      expect(desc).toContain("Título: Zelda");
      expect(desc).toContain("Cópias Disponíveis: 5");
      expect(desc).toContain("Plataforma: Switch");
    });

    test("deve diminuir o número de cópias ao alugar", () => {
      const elenco: Artista[] = [];
      const jogo = new Jogo("Inception", 2, "PC");
      const cliente = new Cliente("Cliente 1");

      const sucesso = jogo.alugar(cliente);

      expect(sucesso).toBe(true);
      expect(jogo.copias).toBe(1);
    });

    test("não deve alugar quando não houver cópias disponíveis", () => {
      const elenco: Artista[] = [];
      const jogo = new Jogo("Jogo Raro", 1, "PS5");
      const c1 = new Cliente("Cliente A");
      const c2 = new Cliente("Cliente B");

      const primeiroAluguel = jogo.alugar(c1);
      const segundoAluguel = jogo.alugar(c2);

      expect(primeiroAluguel).toBe(true);
      expect(segundoAluguel).toBe(false);
      expect(jogo.copias).toBe(0);
    });
    
    test("não deve permitir aluguel duplicado do mesmo cliente", () => {
      const elenco: Artista[] = [];
      const jogo = new Jogo("Inception", 2, "PC");
      const cliente = new Cliente("Cliente 1");

      const primeiroAluguel = jogo.alugar(cliente);
      const segundoAluguel = jogo.alugar(cliente);

      expect(primeiroAluguel).toBe(true);
      expect(segundoAluguel).toBe(false);
      expect(jogo.copias).toBe(1);
    });

    test("deve devolver cópia sem multa se devolvido em até 7 dias", () => {
      const jogo = new Jogo("Jogo Y", 2, "Switch");
      const cliente = new Cliente("Jogador 1");

      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-03-01T10:00:00Z"));
      jogo.alugar(cliente);
      vi.setSystemTime(new Date("2025-03-07T10:00:00Z"));      
      const multa = jogo.devolver(cliente);

      expect(multa).toBe(0);
      vi.useRealTimers();
    });

    test("deve calcular multa correta quando devolvido com atraso", () => {
      const jogo = new Jogo("Jogo Z", 1, "PlayStation");
      const cliente = new Cliente("Jogador Atrasado");

      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-04-01T10:00:00Z"));
      jogo.alugar(cliente);
      vi.setSystemTime(new Date("2025-04-11T10:00:00Z"));
      const multa = jogo.devolver(cliente);

      expect(multa).toBe(15);
      vi.useRealTimers();
    });

    test("deve retornar -1 se o cliente devolver sem ter alugado", () => {
      const jogo = new Jogo("Jogo X", 3, "PC");
      const cliente = new Cliente("Jogador");

      const multa = jogo.devolver(cliente);
      
      expect(multa).toBe(-1);
    });
  });
});
