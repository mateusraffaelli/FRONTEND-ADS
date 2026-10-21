import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { catalogo, listarDisponiveis } from "../../lab_7/src/catalogo.js";

async function importarScriptComDom(): Promise<Document> {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html lang="pt-BR">
      <body>
        <strong id="total-disponiveis">0</strong>
        <ul id="lista-produtos">
          <li class="empty-state">Nenhum produto renderizado ainda.</li>
        </ul>
        <form id="form-busca">
          <input id="produto-id" name="id" type="number" value="1" />
          <button type="submit">Buscar</button>
        </form>
        <output id="resultado-busca">Nenhuma busca realizada.</output>
      </body>
    </html>
  `);

  vi.stubGlobal("window", dom.window);
  vi.stubGlobal("document", dom.window.document);
  vi.stubGlobal("HTMLElement", dom.window.HTMLElement);
  vi.stubGlobal("HTMLFormElement", dom.window.HTMLFormElement);
  vi.stubGlobal("FormData", dom.window.FormData);
  vi.stubGlobal("Event", dom.window.Event);

  await import("../../lab_7/src/script.js");
  dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));

  return dom.window.document;
}

describe("Laboratório 7 - Exercício 5", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  test("deve renderizar produtos disponíveis e atualizar o total", async () => {
    const document = await importarScriptComDom();
    const lista = document.querySelector("#lista-produtos");
    const total = document.querySelector("#total-disponiveis");
    const quantidadeDisponiveis = listarDisponiveis(catalogo).length;

    expect(lista).not.toBeNull();
    expect(total).not.toBeNull();
    expect(lista?.textContent).not.toContain("Nenhum produto renderizado");
    expect(lista?.querySelectorAll("li")).toHaveLength(quantidadeDisponiveis);
    expect(total?.textContent?.trim()).toBe(String(quantidadeDisponiveis));
  });

  test("deve buscar produto pelo formulário e exibir o resultado", async () => {
    const document = await importarScriptComDom();
    const produto = catalogo[0];
    const form = document.querySelector<HTMLFormElement>("#form-busca");
    const input = document.querySelector<HTMLInputElement>("#produto-id");
    const resultado = document.querySelector("#resultado-busca");

    expect(form).not.toBeNull();
    expect(input).not.toBeNull();
    expect(resultado).not.toBeNull();

    input!.value = String(produto.id);
    form!.dispatchEvent(
      new document.defaultView!.Event("submit", {
        bubbles: true,
        cancelable: true,
      })
    );

    expect(resultado?.textContent).toContain(produto.nome);
    expect(resultado?.textContent).toContain(produto.categoria);
    expect(resultado?.textContent).toMatch(/R\$/);
  });
});
