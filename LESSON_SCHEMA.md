# Lesson Schema (v1) — detalhado

Fonte de verdade do schema: `src/content/schema.ts` (Zod).

## Lesson (metadados)
```json
{
	"id": "reisen-02",
	"title": "…",
	"topic": "Reisen",
	"level": "B1",
	"grammarFocus": "…",
	"lexicalFocus": "…",
	"estimatedMinutes": 12,
	"xpReward": 140,
	"keywords": ["…"],
	"skillTags": ["reading", "grammar"],
	"steps": [
		{ "type": "reading", "chunks": [{ "text": "…" }] }
	]
}
```

### Campos e regras
- `id`: `^[a-z0-9-]+$` (ex.: `alltag-02`)
- `level`: `A2 | B1 | B1+ | B2`
- `estimatedMinutes`: 1..90
- `keywords[]`: mínimo 1
- `skillTags[]`: mínimo 1, valores:
	- `reading | vocab | grammar | listening | speaking | writing | srs`

## Step types

### reading
Leitura em blocos (chunks). Glossário é por chunk.

Recomendação: 2–4 chunks por leitura.

```json
{
	"type": "reading",
	"instruction": "opcional",
	"chunks": [
		{
			"text": "Texto...",
			"glossary": [
				{ "term": "Wort", "de": "definição", "pt": "tradução" }
			]
		}
	],
	"xp": 10
}
```

### comprehension
```json
{
	"type": "comprehension",
	"question": "…?",
	"options": ["A", "B", "C"],
	"correctIndex": 1,
	"explanation": "opcional",
	"xpCorrect": 20,
	"xpWrong": 6
}
```

Regras validadas:
- `correctIndex` precisa ser `< options.length`.

### cloze
Use `{___}` como marcador.

```json
{
	"type": "cloze",
	"instruction": "…",
	"sentence": "Das ist {___} Beispiel.",
	"options": ["ein", "eine"],
	"correct": "ein",
	"explanation": "opcional",
	"srs": {
		"front": "Das ist ___ Beispiel.",
		"back": "ein",
		"kind": "cloze",
		"tags": ["artikel"]
	},
	"xpCorrect": 20,
	"xpWrong": 6
}
```

Regras validadas:
- `sentence` precisa conter `{___}`.
- `correct` precisa estar dentro de `options`.

### reorder
```json
{
	"type": "reorder",
	"instruction": "…",
	"words": ["Maria", "hofft,", "dass", "…"],
	"correct": "Maria hofft, dass …",
	"hint": "opcional",
	"srs": {
		"front": "Ordne: …",
		"back": "…",
		"kind": "reorder"
	}
}
```

Regras validadas:
- `words[]` não deve conter duplicados.

### guided_write
```json
{
	"type": "guided_write",
	"instruction": "…",
	"starters": ["Ich …"],
	"keywords": ["weil", "obwohl"],
	"exampleAnswer": "…",
	"srs": {
		"front": "Escreva 1 frase com weil…",
		"back": "Checklist mental: verbo no fim…",
		"kind": "guided_write"
	},
	"xp": 15
}
```

## Validação
- `npm run validate-content` valida todos os JSON em `content/lessons/`.
- `npm run build` roda validação automaticamente (via `prebuild`).

## Robustez extra (regras semânticas)
Além de tipos e campos obrigatórios, o schema também valida regras semânticas para evitar erros comuns de autoria:
- `comprehension.correctIndex` dentro do range de `options`
- `cloze.sentence` contém `{___}`
- `cloze.correct` é um dos itens de `options`
- `reorder.words` não contém duplicados

Implementação: `src/content/schema.ts`.
