import { describe, expect, test } from "vitest";

import {
  SalaGrupo,
  SalaReservavel,
  Usuario,
  type Recurso,
  type Sala,
} from "../questoes/questao2";

const salaGrupoBase = (): Sala => ({
  id: 10,
  nome: "Sala Atlas",
  categoria: "grupo",
  preco: 30,
  quantidade: 2,
  disponivel: true,
});

const recursos: Recurso[] = [
  { nome: "Projetor", tipo: "multimidia", localizacao: "teto" },
  { nome: "Quadro", tipo: "escrita", localizacao: "parede" },
];

class SalaReservavelTeste extends SalaReservavel {
  encerrarReserva(): number {
    return 0;
  }
}

describe("Questão 2:", () => {
  describe("a)", () => {
    test("define a interface Sala no formato esperado", () => {
      const sala: Sala = salaGrupoBase();

      const resultado = sala;

      expect(resultado).toEqual({
        id: 10,
        nome: "Sala Atlas",
        categoria: "grupo",
        preco: 30,
        quantidade: 2,
        disponivel: true,
      });
    });

    test("aceita todas as categorias previstas no tipo Sala", () => {
      const individual: Sala = { ...salaGrupoBase(), categoria: "individual" };
      const grupo: Sala = { ...salaGrupoBase(), categoria: "grupo" };
      const laboratorio: Sala = { ...salaGrupoBase(), categoria: "laboratorio" };
      const categorias = [individual.categoria, grupo.categoria, laboratorio.categoria];

      expect(categorias).toEqual(["individual", "grupo", "laboratorio"]);
    });
  });

  describe("b)", () => {
    test("permite criar uma classe concreta a partir de SalaReservavel", () => {
      const classeBase = SalaReservavel;
      
      const salaTesteHerdaDeSalaReservavel = SalaReservavelTeste.prototype instanceof classeBase;

      expect(classeBase).toBeDefined();
      expect(salaTesteHerdaDeSalaReservavel).toBe(true);
    });

    test("toSala retorna uma Sala no mesmo formato recebido no construtor", () => {
      const sala = new SalaReservavelTeste(salaGrupoBase());

      const resultado = sala.toSala();

      expect(resultado).toEqual(salaGrupoBase());
    });

    test("descricao herdada indica indisponibilidade com texto não", () => {
      const sala = new SalaReservavelTeste(
        { ...salaGrupoBase(), disponivel: false },
      );

      const resultado = sala.descricao();

      expect(resultado).toContain("disponível: não");
    });

    test("reservar decrementa quantidade, registra a reserva e impede reserva duplicada do mesmo usuário", () => {
      const sala = new SalaReservavelTeste(salaGrupoBase());
      const usuario = new Usuario("Carla");

      const primeiraReserva = sala.reservar(usuario);
      const estadoDepoisDaPrimeiraReserva = sala.toSala();
      const segundaReserva = sala.reservar(usuario);
      const estadoDepoisDaSegundaReserva = sala.toSala();

      expect(primeiraReserva).toBe(true);
      expect((sala as any).reservas).toHaveLength(1);
      expect((sala as any).reservas[0].usuario).toBe(usuario);
      expect(estadoDepoisDaPrimeiraReserva).toEqual({
        ...salaGrupoBase(),
        quantidade: 1,
      });
      expect(segundaReserva).toBe(false);
      expect((sala as any).reservas).toHaveLength(1);
      expect((sala as any).reservas[0].usuario).toBe(usuario);
      expect(estadoDepoisDaSegundaReserva.quantidade).toBe(1);
    });

    test("reservar define a sala como indisponível quando a quantidade chega a zero", () => {
      const sala = new SalaReservavelTeste({ ...salaGrupoBase(), quantidade: 1 });
      const usuario = new Usuario("Diego");

      const resultadoReserva = sala.reservar(usuario);
      const estadoAtual = sala.toSala();

      expect(resultadoReserva).toBe(true);
      expect(estadoAtual).toEqual({
        ...salaGrupoBase(),
        quantidade: 0,
        disponivel: false,
      });
    });

    test("reservar falha quando a sala está indisponível ou sem horários disponíveis", () => {
      const indisponivel = new SalaReservavelTeste(
        { ...salaGrupoBase(), disponivel: false },
      );
      const semHorarios = new SalaReservavelTeste(
        { ...salaGrupoBase(), quantidade: 0 },
      );

      const reservaIndisponivel = indisponivel.reservar(new Usuario("Eva"));
      const estadoIndisponivel = indisponivel.toSala();
      const reservaSemHorarios = semHorarios.reservar(new Usuario("Felipe"));
      const estadoSemHorarios = semHorarios.toSala();

      expect(reservaIndisponivel).toBe(false);
      expect(estadoIndisponivel).toEqual({
        ...salaGrupoBase(),
        disponivel: false,
      });
      expect(reservaSemHorarios).toBe(false);
      expect(estadoSemHorarios).toEqual({
        ...salaGrupoBase(),
        quantidade: 0,
      });
    });

    test("reservar permite usuários diferentes até esgotar os horários", () => {
      const sala = new SalaReservavelTeste(salaGrupoBase());
      const usuario1 = new Usuario("Gabriel");
      const usuario2 = new Usuario("Helena");
      const usuario3 = new Usuario("Igor");

      const primeiraReserva = sala.reservar(usuario1);
      const segundaReserva = sala.reservar(usuario2);
      const terceiraReserva = sala.reservar(usuario3);
      const estadoAtual = sala.toSala();

      expect(primeiraReserva).toBe(true);
      expect(segundaReserva).toBe(true);
      expect(terceiraReserva).toBe(false);
      expect((sala as any).reservas).toHaveLength(2);
      expect(estadoAtual).toEqual({
        ...salaGrupoBase(),
        quantidade: 0,
        disponivel: false,
      });
    });

    test("reservar não altera reservas, quantidade nem disponibilidade quando falha", () => {
      const sala = new SalaReservavelTeste(
        { ...salaGrupoBase(), quantidade: 0, disponivel: false },
      );
      const usuario = new Usuario("Julia");
      const resultadoReserva = sala.reservar(usuario);
      const estadoAtual = sala.toSala();

      expect(resultadoReserva).toBe(false);
      expect((sala as any).reservas).toEqual([]);
      expect(estadoAtual).toEqual({
        ...salaGrupoBase(),
        quantidade: 0,
        disponivel: false,
      });
    });
  });

  describe("c)", () => {
    test("SalaGrupo recebe uma Sala e descreve o estado inicial com recursos", () => {
      const sala = new SalaGrupo(salaGrupoBase(), recursos);

      const resultado = sala.descricao();

      expect(resultado).toBe(
        "ID: 10, Sala Atlas (grupo) - R$ 30 por hora - horários disponíveis: 2 - disponível: sim, Recursos: Projetor multimidia (teto); Quadro escrita (parede)",
      );
    });

    test("SalaGrupo descreve corretamente uma lista vazia de recursos", () => {
      const sala = new SalaGrupo(salaGrupoBase(), []);

      const resultado = sala.descricao();

      expect(resultado).toBe(
        "ID: 10, Sala Atlas (grupo) - R$ 30 por hora - horários disponíveis: 2 - disponível: sim, Recursos: ",
      );
    });

    test("encerrarReserva remove a reserva, libera horário e retorna zero", () => {
      const sala = new SalaGrupo({ ...salaGrupoBase(), quantidade: 1 }, recursos);
      const usuario = new Usuario("Gabriel");
      
      sala.reservar(usuario);
      const estadoAntesDoEncerramento = sala.toSala();
      const resultadoEncerramento = sala.encerrarReserva(usuario);
      const estadoDepoisDoEncerramento = sala.toSala();

      expect(estadoAntesDoEncerramento).toEqual({
        ...salaGrupoBase(),
        quantidade: 0,
        disponivel: false,
      });
      expect(resultadoEncerramento).toBe(0);
      expect((sala as any).reservas).toEqual([]);
      expect(estadoDepoisDoEncerramento).toEqual({
        ...salaGrupoBase(),
        quantidade: 1,
        disponivel: true,
      });
    });

    test("encerrarReserva mantém o estado e retorna -1 quando o usuário não tem reserva aberta", () => {
      const sala = new SalaGrupo(salaGrupoBase(), recursos);
      const usuario = new Usuario("Helena");

      const resultadoEncerramento = sala.encerrarReserva(usuario);
      const estadoAtual = sala.toSala();

      expect(resultadoEncerramento).toBe(-1);
      expect((sala as any).reservas).toEqual([]);
      expect(estadoAtual).toEqual(salaGrupoBase());
    });

    test("encerrarReserva remove apenas a reserva do usuário informado", () => {
      const sala = new SalaGrupo(salaGrupoBase(), recursos);
      const usuario1 = new Usuario("Isabela");
      const usuario2 = new Usuario("João");

      sala.reservar(usuario1);
      sala.reservar(usuario2);
      const resultadoEncerramento = sala.encerrarReserva(usuario1);
      const estadoAtual = sala.toSala();

      expect(resultadoEncerramento).toBe(0);
      expect((sala as any).reservas).toHaveLength(1);
      expect((sala as any).reservas[0].usuario).toBe(usuario2);
      expect(estadoAtual).toEqual({
        ...salaGrupoBase(),
        quantidade: 1,
        disponivel: true,
      });
    });

    test("encerrarReserva permite nova reserva do mesmo usuário após encerramento", () => {
      const sala = new SalaGrupo({ ...salaGrupoBase(), quantidade: 1 }, recursos);
      const usuario = new Usuario("Laura");

      const primeiraReserva = sala.reservar(usuario);
      const resultadoEncerramento = sala.encerrarReserva(usuario);
      const segundaReserva = sala.reservar(usuario);
      const estadoAtual = sala.toSala();

      expect(primeiraReserva).toBe(true);
      expect(resultadoEncerramento).toBe(0);
      expect(segundaReserva).toBe(true);
      expect((sala as any).reservas).toHaveLength(1);
      expect((sala as any).reservas[0].usuario).toBe(usuario);
      expect(estadoAtual).toEqual({
        ...salaGrupoBase(),
        quantidade: 0,
        disponivel: false,
      });
    });
  });

  describe("d)", () => {
    test("Usuario recebe nome, gera códigos únicos e expõe getters", () => {
      const usuario1 = new Usuario("Ana");
      const usuario2 = new Usuario("Bruno");

      const nomeUsuario1 = usuario1.nome;
      const nomeUsuario2 = usuario2.nome;
      const codigoUsuario1 = usuario1.codigo;
      const codigoUsuario2 = usuario2.codigo;
      const codigos = Usuario.codigos;

      expect(nomeUsuario1).toBe("Ana");
      expect(nomeUsuario2).toBe("Bruno");
      expect(codigoUsuario1).not.toBe(codigoUsuario2);
      expect(codigos).toContain(codigoUsuario1);
      expect(codigos).toContain(codigoUsuario2);
    });

    test("gerarCodigo retorna número único e registra o código gerado", () => {
      const codigosAntes = Usuario.codigos;

      const codigo = Usuario.gerarCodigo();

      expect(typeof codigo).toBe("number");
      expect(codigosAntes).not.toContain(codigo);
      expect(Usuario.codigos).toContain(codigo);
    });

    test("getter estático codigos não permite alterar a lista interna diretamente", () => {
      const usuario = new Usuario("Marina");
      const codigos = Usuario.codigos;

      codigos.push(-1);

      expect(Usuario.codigos).toContain(usuario.codigo);
      expect(Usuario.codigos).not.toContain(-1);
    });
  });

  describe("e)", () => {
    test("define a interface Recurso no formato esperado", () => {
      const recurso: Recurso = recursos[0];

      const resultado = recurso;

      expect(resultado).toEqual({
        nome: "Projetor",
        tipo: "multimidia",
        localizacao: "teto",
      });
    });

    test("permite múltiplos recursos com nome, tipo e localização", () => {
      const listaRecursos = recursos;

      const resultado = listaRecursos;

      expect(resultado).toEqual([
        { nome: "Projetor", tipo: "multimidia", localizacao: "teto" },
        { nome: "Quadro", tipo: "escrita", localizacao: "parede" },
      ]);
    });
  });
});
