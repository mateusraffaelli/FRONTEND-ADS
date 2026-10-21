import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const projeto = "./lab_8";

function caminhoProjeto(...partes: string[]): string {
  return join(projeto, ...partes);
}

function lerArquivo(...partes: string[]): string {
  return readFileSync(caminhoProjeto(...partes), "utf-8");
}

function lerJson(...partes: string[]): Record<string, unknown> {
  return JSON.parse(lerArquivo(...partes));
}

function listarArquivos(diretorio: string): string[] {
  if (!existsSync(diretorio)) return [];

  return readdirSync(diretorio).flatMap((nome) => {
    const caminho = join(diretorio, nome);
    const stat = statSync(caminho);

    if (stat.isDirectory()) {
      if (["node_modules", "dist"].includes(nome)) return [];
      return listarArquivos(caminho);
    }

    return caminho;
  });
}

function arquivosFonte(): string[] {
  return listarArquivos(caminhoProjeto("src")).filter((arquivo) =>
    /\.(ts|js|css|html)$/.test(arquivo)
  );
}

function conteudoFonte(): string {
  const arquivos = [caminhoProjeto("index.html"), ...arquivosFonte()];

  return arquivos
    .filter((arquivo) => existsSync(arquivo))
    .map((arquivo) => readFileSync(arquivo, "utf-8"))
    .join("\n");
}

function removerComentarios(codigo: string): string {
  return codigo
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function dependencias(): Record<string, string> {
  const packageJson = lerJson("package.json") as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  return {
    ...(packageJson.dependencies ?? {}),
    ...(packageJson.devDependencies ?? {}),
  };
}

function usaBootstrap(): boolean {
  const deps = dependencias();
  const codigo = removerComentarios(conteudoFonte());

  return Boolean(
    deps.bootstrap ||
      /bootstrap(?:\.min)?\.(css|js)/i.test(codigo) ||
      /cdn\.jsdelivr\.net\/npm\/bootstrap/i.test(codigo)
  );
}

function usaTailwind(): boolean {
  const deps = dependencias();
  const codigo = removerComentarios(conteudoFonte());

  return Boolean(
    deps.tailwindcss ||
      deps["@tailwindcss/vite"] ||
      /cdn\.tailwindcss\.com/i.test(codigo) ||
      /@tailwind\s+(base|components|utilities)/i.test(codigo)
  );
}

function frameworkEscolhido(): "bootstrap" | "tailwind" | "ambos" | "nenhum" {
  const bootstrap = usaBootstrap();
  const tailwind = usaTailwind();

  if (bootstrap && tailwind) return "ambos";
  if (bootstrap) return "bootstrap";
  if (tailwind) return "tailwind";
  return "nenhum";
}

function possuiClasseDoFramework(codigo: string): boolean {
  const framework = frameworkEscolhido();

  if (framework === "bootstrap") {
    return /\b(container|row|col|card|btn|form-control|form-select|form-check|shadow|border|d-flex|gap-\d|p[xtblrse]?-[0-5]|m[xtblrse]?-[0-5]|text-|bg-)\b/.test(
      codigo
    );
  }

  if (framework === "tailwind") {
    return /\b(container|flex|grid|mx-auto|w-full|max-w-|rounded|shadow|border|space-y-|gap-|p[xtblr]?-[0-9]|m[xtblr]?-[0-9]|text-|bg-)\b/.test(
      codigo
    );
  }

  return false;
}

function valoresDeClasses(codigo: string): string[] {
  const valores: string[] = [];
  const codigoSemComentarios = removerComentarios(codigo);
  const padroes = [
    /\bclass(?:Name)?\s*=\s*["']([^"']+)["']/gi,
    /\.className\s*=\s*["']([^"']+)["']/gi,
    /\.classList\.add\s*\(([^)]+)\)/gi,
    /\.setAttribute\s*\(\s*["']class["']\s*,\s*["']([^"']+)["']\s*\)/gi,
  ];

  for (const padrao of padroes) {
    for (const match of codigoSemComentarios.matchAll(padrao)) {
      valores.push(match[1]);
    }
  }

  return valores;
}

function possuiClasseAtribuidaDoFramework(codigo: string): boolean {
  return valoresDeClasses(codigo).some((valor) => possuiClasseDoFramework(valor));
}

export {
  arquivosFonte,
  caminhoProjeto,
  conteudoFonte,
  existsSync,
  frameworkEscolhido,
  lerArquivo,
  lerJson,
  possuiClasseAtribuidaDoFramework,
  possuiClasseDoFramework,
  removerComentarios,
};
