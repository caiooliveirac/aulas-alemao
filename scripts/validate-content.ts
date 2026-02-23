import fs from "node:fs/promises";
import path from "node:path";
import { LessonSchema } from "../src/content/schema";

type ValidationError = { file: string; message: string };

async function main() {
  const lessonsDir = path.join(process.cwd(), "content", "lessons");
  const entries = await fs.readdir(lessonsDir, { withFileTypes: true });
  const lessonFiles = entries.filter((e) => e.isFile() && e.name.endsWith(".json")).map((e) => e.name);

  if (lessonFiles.length === 0) {
    console.error(`[validate-content] Nenhuma li\u00e7\u00e3o encontrada em: ${lessonsDir}`);
    process.exit(1);
  }

  const errors: ValidationError[] = [];
  const ids = new Set<string>();

  for (const fileName of lessonFiles) {
    const filePath = path.join(lessonsDir, fileName);
    let raw: string;
    try {
      raw = await fs.readFile(filePath, "utf8");
    } catch (e) {
      errors.push({ file: fileName, message: `Falha ao ler arquivo: ${String(e)}` });
      continue;
    }

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch (e) {
      errors.push({ file: fileName, message: `JSON inv\u00e1lido: ${String(e)}` });
      continue;
    }

    const parsed = LessonSchema.safeParse(json);
    if (!parsed.success) {
      errors.push({ file: fileName, message: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" | ") });
      continue;
    }

    if (ids.has(parsed.data.id)) {
      errors.push({ file: fileName, message: `id duplicado: ${parsed.data.id}` });
      continue;
    }
    ids.add(parsed.data.id);
  }

  if (errors.length > 0) {
    console.error("\n[validate-content] Falhas de valida\u00e7\u00e3o:\n");
    for (const err of errors) {
      console.error(`- ${err.file}: ${err.message}`);
    }
    console.error("\nDica: evite colocar textos longos em TSX; mantenha tudo em JSON dentro de content/lessons.");
    process.exit(1);
  }

  console.log(`[validate-content] OK (${lessonFiles.length} li\u00e7\u00f5es)`);
}

main().catch((e) => {
  console.error(`[validate-content] Erro inesperado: ${String(e)}`);
  process.exit(1);
});
