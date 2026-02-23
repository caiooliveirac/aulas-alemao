import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const required = [
  "package.json",
  "next.config.ts",
  path.join("src", "app"),
  path.join("content", "lessons"),
];

const missing = required.filter((p) => !fs.existsSync(path.join(cwd, p)));
if (missing.length > 0) {
  // Message intentionally explicit: this is the failure mode that already happened (ENOENT / wrong folder).
  console.error("\n[DeutschBr\u00fccke] Diret\u00f3rio errado para rodar comandos.");
  console.error(`CWD atual: ${cwd}`);
  console.error("Arquivos/pastas esperados (faltando):");
  for (const p of missing) console.error(`- ${p}`);
  console.error("\nEntre na pasta do projeto e tente de novo:");
  console.error("  cd /home/ubuntu/deutschbruecke");
  process.exit(1);
}
