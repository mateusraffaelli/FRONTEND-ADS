// @vitest-environment jsdom
import { beforeEach, describe, expect, test, vi } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../../lab_1");
const HTML_PATH = resolve(ROOT, "index.html");
const SCRIPT_PATH = resolve(ROOT, "script.js");
let importCounter = 0;

const nextTick = () => new Promise((r) => setTimeout(r, 0));

function queryByTestId(testId) {
  return document.querySelector(`[data-testid="${testId}"]`);
}

function getByTestId(testId) {
  const el = queryByTestId(testId);
  if (!el) throw new Error(`Elemento não encontrado: data-testid="${testId}"`);
  return el;
}

function getDisplayText() {
  return getByTestId("display").textContent?.trim() ?? "";
}

function parseDisplayedNumber(text = getDisplayText()) {
  const normalized = text.replace(",", ".");
  const matches = normalized.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi);
  if (!matches || matches.length === 0) return Number.NaN;
  return Number(matches[matches.length - 1]);
}

function expectDisplayToContainNumber(value) {
  const text = getDisplayText().replace(",", ".");
  expect(text).toContain(String(value));
}

function expectHistoryItemToContainNumbers(item, values) {
  const text = item.textContent?.replace(",", ".") ?? "";
  for (const value of values) {
    expect(text).toContain(String(value));
  }
}

function getNumbersFromHistoryItem(item) {
  const text = item.textContent?.replace(",", ".") ?? "";
  return (text.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi) ?? []).map(Number);
}

function historyHasOperation(items, values) {
  return items.some((item) => {
    const numbers = getNumbersFromHistoryItem(item);
    return values.every((value, index) => numbers[index] === value);
  });
}

async function click(testId) {
  getByTestId(testId).dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await nextTick();
}

async function typeNumber(value) {
  for (const ch of String(value)) {
    if (ch === ".") {
      await click("key-dot");
    } else if (/\d/.test(ch)) {
      await click(`key-${ch}`);
    } else if (ch === "-") {
      await click("key-sign");
    }
  }
}

async function computeBinary(a, opTestId, b) {
  await click("key-clear");
  await typeNumber(String(a));
  await click(opTestId);
  await typeNumber(String(b));
  await click("key-equals");
  return parseDisplayedNumber();
}

async function assertBinaryOperation({ a, opTestId, b, expected }) {
  await click("key-clear");
  await typeNumber(String(a));
  expectDisplayToContainNumber(a);

  await click(opTestId);
  expectDisplayToContainNumber(a);

  await typeNumber(String(b));
  expectDisplayToContainNumber(b);

  await click("key-equals");
  expect(parseDisplayedNumber()).toBeCloseTo(expected, 8);
}

async function computeUnary(a, opTestId) {
  await click("key-clear");
  await typeNumber(String(a));

  const before = getDisplayText();
  await click(opTestId);

  let result = parseDisplayedNumber();
  if (getDisplayText() === before || Number.isNaN(result)) {
    await click("key-equals");
    result = parseDisplayedNumber();
  }

  return result;
}

function getHistoryItems() {
  return Array.from(getByTestId("history-list").querySelectorAll("li"));
}

function getReusableElementFromHistoryItem(item) {
  return (
    item.querySelector('button, [role="button"], a, [data-action="reuse"]') ??
    item
  );
}

async function loadApp() {
  const html = readFileSync(HTML_PATH, "utf8");
  document.documentElement.innerHTML = html;
  delete window.__lab1CalculatorInitialized;

  vi.resetModules();
  await import(
    `${pathToFileURL(SCRIPT_PATH).href}?t=${Date.now()}-${importCounter++}`
  );

  document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true }));
  window.dispatchEvent(new Event("load"));
  await nextTick();
}

describe.sequential("Laboratório 1 - Calculadora", () => {
  beforeEach(async () => {
    await loadApp();
    await click("key-clear");
  });

  test("Deve carregar a estrutura base esperada", () => {
    expect(getByTestId("display")).toBeTruthy();
    expect(getByTestId("key-add")).toBeTruthy();
    expect(getByTestId("key-subtract")).toBeTruthy();
    expect(getByTestId("key-multiply")).toBeTruthy();
    expect(getByTestId("key-divide")).toBeTruthy();
    expect(getByTestId("key-sqrt")).toBeTruthy();
    expect(getByTestId("key-power")).toBeTruthy();
    expect(getByTestId("key-percent")).toBeTruthy();
    expect(getByTestId("history-list")).toBeTruthy();
  });

  test("Deve exibir no display os dígitos inseridos", async () => {
    await typeNumber("12");
    const display = getDisplayText();
    expect(display).toMatch(/12/);
  });

  test("Deve limpar a entrada atual ao clicar em C", async () => {
    await typeNumber("123");
    expectDisplayToContainNumber(123);

    await click("key-clear");
    expect(parseDisplayedNumber()).toBe(0);
  });

  test.each([
    { name: "somar", a: 2, opTestId: "key-add", b: 3, expected: 5 },
    { name: "subtrair", a: 9, opTestId: "key-subtract", b: 4, expected: 5 },
    { name: "multiplicar", a: 6, opTestId: "key-multiply", b: 7, expected: 42 },
    { name: "dividir", a: 8, opTestId: "key-divide", b: 2, expected: 4 },
    { name: "potenciar", a: 2, opTestId: "key-power", b: 3, expected: 8 },
  ])("Deve $name exibindo operandos e resultado no display", assertBinaryOperation);

  test("Deve calcular a raiz quadrada de 81 = 9", async () => {
    const value = await computeUnary(81, "key-sqrt");
    expect(value).toBeCloseTo(9, 8);
  });

  test("Deve calcular a porcentagem de 50% = 0,5", async () => {
    const value = await computeUnary(50, "key-percent");
    expect(value).toBeCloseTo(0.5, 8);
  });

  test("Deve registrar no histórico a operação com operandos e resultado", async () => {
    await computeBinary(2, "key-add", 3);

    const items = getHistoryItems();
    expect(items.length).toBe(1);
    expectHistoryItemToContainNumbers(items[0], [2, 3, 5]);
  });

  test("Deve manter no histórico apenas as últimas 10 operações", async () => {
    for (let i = 1; i <= 12; i++) {
      await computeBinary(i, "key-add", 1);
    }

    const items = getHistoryItems();
    expect(items.length).toBe(10);
    expect(historyHasOperation(items, [12, 1, 13])).toBe(true);
    expect(historyHasOperation(items, [1, 1, 2])).toBe(false);
    expect(historyHasOperation(items, [2, 1, 3])).toBe(false);
  });

  test("Deve permitir reutilizar o resultado de uma operação do histórico", async () => {
    const result = await computeBinary(2, "key-add", 3);

    const historyItems = getHistoryItems();
    expect(historyItems.length).toBeGreaterThan(0);

    await click("key-clear");
    const before = getDisplayText();

    const reusable = getReusableElementFromHistoryItem(historyItems[0]);
    reusable.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await nextTick();

    if (getDisplayText() === before) {
      await click("key-equals");
    }

    expect(getDisplayText()).not.toBe(before);
    expect(parseDisplayedNumber()).toBeCloseTo(result, 8);
  });

  test("Deve remover itens ao clicar no botão de limpar histórico", async () => {
    await computeBinary(2, "key-add", 3);
    expect(getHistoryItems().length).toBeGreaterThan(0);

    await click("history-clear");
    expect(getHistoryItems().length).toBe(0);
  });
});
