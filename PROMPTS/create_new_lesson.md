# Prompt — Criar nova lição (JSON, data-driven)

Crie **apenas** um novo arquivo JSON em `content/lessons/<id>.json` para o app DeutschBrücke (B1→B2).

Antes de começar, leia:
- `AGENT_LESSON_AUTHORING_PACKET.md`
- `LESSON_SCHEMA.md`

Regras (não negociar):
1) Não altere nada em `src/`.
2) Não coloque conteúdo em TSX/JSX.
3) O JSON precisa passar em `npm run validate-content`.
4) Em `cloze.sentence`, use sempre o marcador `{___}`.
5) Em `comprehension`, `correctIndex` deve apontar para `options`.
6) Em `cloze`, `correct` deve estar dentro de `options`.

Entrega:
- Metadados completos.
- 6–10 steps misturando: `reading`, `comprehension`, `cloze`, `reorder`, `guided_write`.
- `reading` com 2–4 chunks e glossário curto.
- 2–4 seeds de SRS em `cloze.srs` ou `reorder.srs` (pode 1 em `guided_write.srs`).
- Feedback imediato: inclua `explanation` nos steps avaliativos.

Formato da resposta:
- Retorne somente o conteúdo do arquivo JSON final.
