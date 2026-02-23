# DeutschBrücke — Guia de Autoria de Conteúdo (humano + agente)

Objetivo: adicionar novas lições **sem mexer na lógica central**.

Se você vai delegar para um agente, comece por: `AGENT_LESSON_AUTHORING_PACKET.md`.

## Onde fica o conteúdo
- `content/lessons/*.json`: lições (uma por arquivo)
- `content/topics.json`: ícones por tema

## Regra de ouro (evita builds quebrados)
- Conteúdo (texto alemão, opções, explicações) fica em **JSON**.
- React/TSX fica pequeno: ele só renderiza os steps.

Isso evita os problemas reais já vistos:
- aspas tipográficas („…“) encerrando string sem querer em TSX
- erro cascata de parser (“Invalid Character —”)

## Quickstart: criar nova lição
1) Copie um exemplo existente (por ex. `content/lessons/alltag-01.json`).
2) Salve como: `content/lessons/<id>.json`.
   - `<id>` deve ser `a-z0-9-` (ex.: `arbeit-02`, `reisen-02`).
3) Edite metadados:
   - `topic`, `level`, `grammarFocus`, `estimatedMinutes`, `xpReward`
   - `keywords[]` (para busca/organização futura)
   - `skillTags[]` (para filtros futuros)
4) Edite `steps[]` (6–10 steps):
   - `reading` (chunks + glossário)
   - `comprehension` (pergunta + opções)
   - `cloze` (lacuna `{___}`)
   - `reorder` (reordenar palavras)
   - `guided_write` (produção guiada)
5) Valide:
```bash
cd /home/ubuntu/deutschbruecke
npm run validate-content
```

## Convenções pedagógicas (B1 → B2)
- Microtarefas: cada step deve ser concluível em 20–90s.
- Feedback imediato: sempre que houver “certo/errado”, inclua `explanation` curta.
- Produção guiada: `guided_write` sempre com `starters` + `keywords` + `exampleAnswer`.
- Repetição inteligente: adicione `srs` em 2–4 steps por lição.

## Como escrever `reading` (chunked reading)
- Prefira 2–4 chunks por step `reading`.
- Cada chunk deve ter 1–3 frases curtas.
- Glossário deve ser contextual e curto (2–5 termos por chunk).

Formato:
```json
{
  "type": "reading",
  "chunks": [
    {
      "text": "Texto curto...",
      "glossary": [
        { "term": "Wort", "de": "definição", "pt": "tradução" }
      ]
    }
  ],
  "xp": 10
}
```

## Cloze: regras importantes
- `sentence` precisa conter **{___}** (a validação falha se não tiver).
- `correct` precisa estar dentro de `options` (igualzinho).
- Evite opções ambíguas (diferenças mínimas sem contexto).

## Comprehension: regras importantes
- `correctIndex` precisa apontar para um item existente em `options`.
- `options` deve ter pelo menos 2 itens.

## Reorder: regras importantes
- `words[]` deve ter palavras/frases pequenas e **não duplicadas**.
- `correct` deve ser uma frase canônica (sem ponto final é ok, mas mantenha consistente).

## Aspas e caracteres (evitar bugs)
- Aspas alemãs „…“ funcionam bem em JSON (UTF‑8).
- Se usar aspas ASCII `"` dentro de strings JSON, lembre de escapar.
- Se um texto ficar grande, divida em chunks em vez de uma string gigantesca.

## Checklist final
- `npm run validate-content` passa.
- Sem texto grande em um único chunk.
- Pelo menos 2 seeds de SRS (`cloze.srs`/`reorder.srs`/`guided_write.srs`).
- Metadados completos (keywords e skillTags não vazios).

## O que `validate-content` garante (robustez extra)
Além de verificar campos obrigatórios e tipos, ele falha cedo se detectar:
- `comprehension.correctIndex` fora do range de `options`
- `cloze.sentence` sem o marcador `{___}`
- `cloze.correct` que não está presente em `options`
- `reorder.words` com termos duplicados

Essas regras vivem no schema Zod em `src/content/schema.ts`.

