import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const testesDir = path.join(rootDir, "testes");
const tempDir = path.join(rootDir, ".avaliacao");

const laboratorioArg = getArg("--laboratorio") ?? getArg("--lab");
const laboratorio = laboratorioArg ?? process.env.LABORATORIO ?? "todos";
const prazoEntrega = getArg("--prazo") ?? null;
const dataEntrega = getArg("--data-entrega") ?? process.env.AVALIACAO_DATA_ENTREGA ?? new Date().toISOString();
const outputPath = path.resolve(
  rootDir,
  process.env.AVALIACAO_OUTPUT ?? "avaliacao.json",
);

if (!existsSync(testesDir)) {
  fail(`Diretorio de testes nao encontrado: ${path.relative(rootDir, testesDir)}`);
}

rmSync(tempDir, { force: true, recursive: true });
mkdirSync(tempDir, { recursive: true });

const labs = resolveLabs(laboratorio);
const resultados = labs.map(avaliarLaboratorio);
const totalTestes = sum(resultados, "testesTotal");
const testesOk = sum(resultados, "testesOk");
const testesFalhando = sum(resultados, "testesFalhando");
const notaOriginal = calcularNota(testesOk, totalTestes);
const atraso = calcularAtraso(prazoEntrega, dataEntrega);
const nota = aplicarPenalidade(notaOriginal, atraso);

const avaliacao = {
  timestamp: new Date().toISOString(),
  laboratorio: laboratorio.toString(),
  repositorio: process.env.GITHUB_REPOSITORY ?? null,
  commit: process.env.GITHUB_SHA ?? null,
  workflow: workflowUrl(),
  sucesso: testesFalhando === 0,
  prazoEntrega,
  dataEntrega,
  atrasoDias: atraso.dias,
  entregaAceita: atraso.entregaAceita,
  penalidadePercentual: atraso.penalidadePercentual,
  testesOk,
  testesFalhando,
  testesTotal: totalTestes,
  notaOriginal,
  nota,
  laboratorios: resultados,
};

writeFileSync(outputPath, `${JSON.stringify(avaliacao, null, 2)}\n`);

console.log(`Avaliacao gravada em ${path.relative(rootDir, outputPath)}`);
console.log(`Testes: ${testesOk}/${totalTestes}`);
if (prazoEntrega) {
  console.log(`Prazo: ${prazoEntrega}`);
  console.log(`Atraso: ${atraso.dias} dia(s)`);
  console.log(`Penalidade: ${(atraso.penalidadePercentual * 100).toFixed(0)}%`);
}
console.log(`Nota: ${nota.toFixed(2)}`);

if (testesFalhando > 0) {
  console.log("Ha testes falhando. O workflow continuara para permitir registrar a nota.");
}

function avaliarLaboratorio(lab) {
  const labDir = path.join(testesDir, lab);
  const entregaLaboratorio = obterDataEntregaLaboratorio(lab) ?? dataEntrega;
  const testFiles = readdirSync(labDir)
    .filter((file) => /\.test\.[cm]?[jt]s$/.test(file))
    .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));

  if (testFiles.length === 0) {
    fail(`Nenhum arquivo de teste encontrado em ${path.relative(rootDir, labDir)}`);
  }

  const exercicios = testFiles.map((file, index) => avaliarArquivoTeste(lab, file, index));
  const testesTotal = sum(exercicios, "testesTotal");
  const testesOk = sum(exercicios, "testesOk");
  const testesFalhando = sum(exercicios, "testesFalhando");
  const notaOriginal = calcularNota(testesOk, testesTotal);
  const atraso = calcularAtraso(prazoEntrega, entregaLaboratorio);

  return {
    laboratorio: lab,
    sucesso: testesFalhando === 0,
    prazoEntrega,
    dataEntrega: entregaLaboratorio,
    atrasoDias: atraso.dias,
    entregaAceita: atraso.entregaAceita,
    penalidadePercentual: atraso.penalidadePercentual,
    testesOk,
    testesFalhando,
    testesTotal,
    notaOriginal,
    nota: aplicarPenalidade(notaOriginal, atraso),
    exercicios,
  };
}

function obterDataEntregaLaboratorio(lab) {
  const labRelativo = lab;
  const result = spawnSync(
    "git",
    ["log", "-1", "--format=%cI", "--", labRelativo],
    {
      cwd: rootDir,
      encoding: "utf-8",
    },
  );

  const date = result.stdout?.trim();

  if (result.status !== 0 || !date) {
    return null;
  }

  return date;
}

function avaliarArquivoTeste(lab, file, index) {
  const testeRelativo = path.join("testes", lab, file);
  const outputFile = path.join(tempDir, `${lab}-${index + 1}.json`);
  const result = spawnSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["vitest", "run", testeRelativo, "--reporter=json", `--outputFile=${outputFile}`],
    {
      cwd: rootDir,
      encoding: "utf-8",
    },
  );

  const json = lerRelatorioVitest(outputFile);
  const testesTotal = json?.numTotalTests ?? 1;
  const testesOk = json?.numPassedTests ?? 0;
  const testesFalhando = json?.numFailedTests ?? (result.status === 0 ? 0 : testesTotal);
  const erros = coletarErros(json, result);

  return {
    exercicio: path.basename(file).replace(/\.test\.[^.]+$/, ""),
    arquivo: testeRelativo,
    sucesso: result.status === 0 && testesFalhando === 0,
    testesOk,
    testesFalhando,
    testesTotal,
    nota: calcularNota(testesOk, testesTotal),
    erros,
  };
}

function resolveLabs(value) {
  const normalized = value.toString().trim().toLowerCase();

  if (["atual", "current", "latest", "ultimo"].includes(normalized)) {
    return [resolveLabAtual()];
  }

  if (["todos", "all", "*"].includes(normalized)) {
    const labs = readdirSync(testesDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && /^lab_\d+$/.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));

    if (labs.length === 0) {
      fail("Nenhum laboratorio com testes foi encontrado.");
    }

    return labs;
  }

  const lab = normalized.startsWith("lab_") ? normalized : `lab_${normalized}`;
  const labDir = path.join(testesDir, lab);

  if (!/^lab_\d+$/.test(lab) || !existsSync(labDir)) {
    fail(`Laboratorio invalido ou sem testes: ${value}`);
  }

  return [lab];
}

function resolveLabAtual() {
  const labs = listarLabsComTestes();

  if (labs.length === 0) {
    fail("Nenhum laboratorio com testes foi encontrado.");
  }

  return labs[labs.length - 1];
}

function listarLabsComTestes() {
  return readdirSync(testesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^lab_\d+$/.test(entry.name))
    .filter((entry) =>
      readdirSync(path.join(testesDir, entry.name)).some((file) =>
        /\.test\.[cm]?[jt]s$/.test(file),
      ),
    )
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));
}

function lerRelatorioVitest(file) {
  if (!existsSync(file)) {
    return null;
  }

  try {
    return JSON.parse(readFileSync(file, "utf-8"));
  } catch {
    return null;
  }
}

function coletarErros(json, result) {
  const erros = [];

  for (const suite of json?.testResults ?? []) {
    for (const assertion of suite.assertionResults ?? []) {
      if (assertion.status === "failed") {
        erros.push({
          teste: assertion.fullName,
          mensagens: assertion.failureMessages ?? [],
        });
      }
    }
  }

  if (erros.length === 0 && result.status !== 0) {
    erros.push({
      teste: "Falha ao executar o arquivo de teste",
      mensagens: [result.stderr || result.stdout || "Vitest falhou sem mensagem."],
    });
  }

  return erros;
}

function calcularNota(ok, total) {
  if (total === 0) {
    return 0;
  }

  return Number(((ok / total) * 10).toFixed(2));
}

function calcularAtraso(prazo, entrega) {
  if (!prazo) {
    return {
      dias: 0,
      entregaAceita: true,
      penalidadePercentual: 0,
    };
  }

  const prazoDate = parseDate(prazo, true);
  const entregaDate = parseDate(entrega, false);

  if (!prazoDate || !entregaDate) {
    fail("Datas invalidas. Use ISO 8601 ou YYYY-MM-DD em --prazo.");
  }

  const diffMs = entregaDate.getTime() - prazoDate.getTime();
  const dias = Math.max(0, Math.ceil(diffMs / 86_400_000));
  return {
    dias,
    entregaAceita: true,
    penalidadePercentual: Math.min(dias * 0.1, 1),
  };
}

function aplicarPenalidade(nota, atraso) {
  return Number(Math.max(0, nota * (1 - atraso.penalidadePercentual)).toFixed(2));
}

function parseDate(value, endOfDayWhenDateOnly) {
  const text = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return new Date(`${text}T${endOfDayWhenDateOnly ? "23:59:59.999" : "00:00:00.000"}Z`);
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sum(items, field) {
  return items.reduce((total, item) => total + item[field], 0);
}

function getArg(name) {
  const prefix = `${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  return arg?.slice(prefix.length);
}

function workflowUrl() {
  const server = process.env.GITHUB_SERVER_URL;
  const repository = process.env.GITHUB_REPOSITORY;
  const runId = process.env.GITHUB_RUN_ID;

  if (!server || !repository || !runId) {
    return null;
  }

  return `${server}/${repository}/actions/runs/${runId}`;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
