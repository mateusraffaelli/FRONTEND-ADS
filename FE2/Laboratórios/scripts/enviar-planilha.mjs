import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const avaliacaoPath = path.resolve(rootDir, getArg("--arquivo") ?? "avaliacao.json");
const dryRun = hasArg("--dry-run");
const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
const appsScriptToken = process.env.GOOGLE_APPS_SCRIPT_TOKEN;
const matricula = getArg("--matricula") ?? process.env.ALUNO_MATRICULA ?? process.env.MATRICULA;
const maxTentativas = Number(process.env.AVALIACAO_ENVIO_TENTATIVAS ?? 5);

if (!appsScriptUrl && !dryRun) {
  fail("Variavel GOOGLE_APPS_SCRIPT_URL nao configurada.");
}

if (!matricula) {
  fail("Configure ALUNO_MATRICULA, MATRICULA ou use --matricula=<valor>.");
}

if (!appsScriptToken && !dryRun) {
  fail("Variavel GOOGLE_APPS_SCRIPT_TOKEN nao configurada.");
}

const avaliacao = JSON.parse(readFileSync(avaliacaoPath, "utf-8"));
const payload = criarPayload(avaliacao);

if (payload.notas.length === 0) {
  fail("Nenhum resultado de laboratorio encontrado em avaliacao.json.");
}

if (dryRun) {
  console.log(JSON.stringify(criarDryRun(payload), null, 2));
  process.exit(0);
}

const result = await enviarComTentativas(payload);

console.log(`${payload.notas.length} nota(s) enviadas para o Apps Script.`);

function criarPayload(avaliacao) {
  return {
    token: appsScriptToken,
    matricula,
    repositorio: avaliacao.repositorio ?? process.env.GITHUB_REPOSITORY ?? null,
    commit: avaliacao.commit ?? process.env.GITHUB_SHA ?? null,
    workflow: avaliacao.workflow ?? null,
    timestamp: avaliacao.timestamp,
    notas: (avaliacao.laboratorios ?? []).map((laboratorio) => ({
      laboratorio: laboratorio.laboratorio.replace(/^lab_/, ""),
      nota: laboratorio.nota,
      testesOk: laboratorio.testesOk,
      testesTotal: laboratorio.testesTotal,
    })),
  };
}

function criarDryRun(payload) {
  return {
    url: appsScriptUrl ? mascarar(appsScriptUrl) : "dry-run",
    payload: {
      ...payload,
      token: payload.token ? mascarar(payload.token) : undefined,
    },
  };
}

async function enviarComTentativas(payload) {
  let ultimoErro = null;

  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    const result = parseResponse(responseText);

    if (response.ok && result.ok !== false) {
      return result;
    }

    ultimoErro = result.error ?? `HTTP ${response.status} ${responseText}`;

    if (tentativa >= maxTentativas || !erroTemporario(ultimoErro, response.status)) {
      break;
    }

    const esperaMs = 2000 * tentativa;
    console.log(`Envio falhou temporariamente (${ultimoErro}). Tentando novamente em ${esperaMs}ms.`);
    await sleep(esperaMs);
  }

  fail(ultimoErro ?? "Falha ao enviar nota.");
}

function erroTemporario(message, status) {
  return status === 429 || status >= 500 || /lock|timeout|temporari/i.test(String(message));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mascarar(value) {
  const text = String(value);

  if (text.length <= 12) {
    return "***";
  }

  return `${text.slice(0, 6)}***${text.slice(-6)}`;
}

function parseResponse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return { ok: false, error: text };
  }
}

function getArg(name) {
  const prefix = `${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  return arg?.slice(prefix.length);
}

function hasArg(name) {
  return process.argv.includes(name);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
