# DeutschBrücke — Pacote para Agentes (Autoria de Lições)

Objetivo: permitir que um agente gere **novas lições** adicionando **apenas** arquivos JSON em `content/lessons/`, sem tocar em `src/`.

## O que o agente DEVE entregar
- Um arquivo novo: `content/lessons/<id>.json`
- JSON válido (sem comentários) que passa em `npm run validate-content`

## Regras inegociáveis
1) **Não** altere componentes React/TS (`src/`).
2) **Não** coloque textos longos em TSX/JSX.
3) Use strings curtas e divida leitura em `reading.chunks`.
4) Em `cloze.sentence` use **obrigatoriamente** o marcador `{___}`.
5) Em `comprehension`, `correctIndex` precisa existir dentro do array `options`.
6) Em `cloze`, `correct` precisa ser exatamente um item de `options`.

## Robustez extra (o validator pega automaticamente)
Além de checar tipos/campos obrigatórios, o schema valida regras que evitam bugs comuns:
- `comprehension.correctIndex` não pode ser maior/igual ao tamanho de `options`
- `cloze.sentence` precisa conter `{___}`
- `cloze.correct` precisa estar dentro de `cloze.options`
- `reorder.words` não pode conter duplicados

Fonte de verdade dessas regras: `src/content/schema.ts`.

## Onde olhar exemplos
- Lições prontas: `content/lessons/*.json`
- Schema (fonte de verdade): `src/content/schema.ts`

## Checklist de qualidade (antes de finalizar)
- Metadados completos: `topic`, `level`, `grammarFocus`, `estimatedMinutes`, `xpReward`, `keywords`, `skillTags`.
- 6–10 steps, alternando tipos para manter microtarefas.
- `reading` com 2–4 chunks + glossário contextual (poucas entradas, úteis).
- Pelo menos 2 steps com seed de SRS (`cloze.srs` ou `reorder.srs`).
- Sem “página em branco”: guided writing com `starters` e `keywords`.
- Textos com aspas alemãs „…“ podem ser usados normalmente no JSON.

## Como validar local
```bash
cd /home/ubuntu/deutschbruecke
npm run validate-content
```

Se falhar, corrija o JSON e rode novamente.
