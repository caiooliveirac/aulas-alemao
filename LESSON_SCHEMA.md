# Lesson Schema (v2) — detalhado

Fonte de verdade do schema: `src/content/schema.ts` (Zod).

## Filosofia pedagógica (v2)

O schema v2 foi desenhado para superar limitações de apps como Duolingo:

1. **Instrução antes da prática**: `grammar_note` ensina a regra antes de testar.
2. **Gradação de dificuldade**: reconhecimento → recall assistido → recall livre → produção.
3. **Variedade cognitiva**: 12 tipos de exercício evitam adaptação e mantêm engajamento.
4. **Feedback rico**: explicação de distratores, regras gramaticais, erros comuns.
5. **Contexto real**: diálogos, cenários, notas culturais.

## Lesson (metadados)
```json
{
  "id": "alltag-02",
  "title": "Einkaufen auf dem Wochenmarkt",
  "topic": "Alltag",
  "level": "B1",
  "grammarFocus": "Konjunktiv II (hätte, würde, könnte)",
  "lexicalFocus": "Lebensmittel, Mengen",
  "estimatedMinutes": 18,
  "xpReward": 220,
  "keywords": ["einkaufen", "markt", "konjunktiv"],
  "skillTags": ["reading", "grammar", "dialogue", "translation"],
  "objectives": [
    "Usar Konjunktiv II para pedidos educados",
    "Vocabulário de alimentos e quantidades"
  ],
  "prerequisites": ["alltag-01"],
  "culturalNote": "Na Alemanha, os Wochenmärkte são tradição…",
  "steps": [...]
}
```

### Campos e regras
- `id`: `^[a-z0-9-]+$` (ex.: `alltag-02`)
- `level`: `A1 | A2 | B1 | B1+ | B2 | B2+ | C1`
- `estimatedMinutes`: 1..90
- `keywords[]`: mínimo 1
- `skillTags[]`: mínimo 1, valores:
  - `reading | vocab | grammar | listening | speaking | writing | srs | culture | dialogue | translation`
- `objectives[]` *(opcional)*: objetivos de aprendizagem mostrados no início
- `prerequisites[]` *(opcional)*: IDs de lições que devem ser feitas antes
- `culturalNote` *(opcional)*: nota cultural contextual

---

## Step Types (12 tipos)

### 1. reading
Leitura em blocos com glossário contextual. 2–4 chunks recomendados.

```json
{
  "type": "reading",
  "instruction": "opcional",
  "chunks": [
    {
      "text": "Texto...",
      "glossary": [
        { "term": "Wort", "de": "definição", "pt": "tradução", "example": "opcional" }
      ],
      "audioUrl": "opcional (URL)"
    }
  ],
  "xp": 10
}
```

### 2. comprehension
Múltipla escolha com explicação de distratores.

```json
{
  "type": "comprehension",
  "question": "…?",
  "options": ["A", "B", "C"],
  "correctIndex": 1,
  "explanation": "Por que B está certo",
  "distractorExplanations": ["Por que A está errado", "", "Por que C está errado"],
  "xpCorrect": 20,
  "xpWrong": 6
}
```

### 3. cloze
Lacuna com referência à regra gramatical.

```json
{
  "type": "cloze",
  "instruction": "…",
  "sentence": "Das ist {___} Beispiel.",
  "options": ["ein", "eine"],
  "correct": "ein",
  "acceptedAnswers": ["ein"],
  "explanation": "…",
  "grammarRule": "Regra formal (opcional)",
  "srs": { "front": "…", "back": "…", "kind": "cloze", "tags": ["…"] },
  "xpCorrect": 20,
  "xpWrong": 6
}
```

### 4. reorder

```json
{
  "type": "reorder",
  "instruction": "…",
  "words": ["Maria", "hofft,", "dass", "…"],
  "correct": "Maria hofft, dass …",
  "hint": "opcional",
  "srs": { "front": "…", "back": "…", "kind": "reorder" },
  "xpCorrect": 25,
  "xpWrong": 8
}
```

### 5. guided_write
Produção guiada com checklist de autoavaliação.

```json
{
  "type": "guided_write",
  "instruction": "…",
  "starters": ["Ich …"],
  "keywords": ["weil", "obwohl"],
  "exampleAnswer": "…",
  "checkpoints": ["Usou 'weil'?", "Verbo no fim do Nebensatz?"],
  "srs": { "front": "…", "back": "…", "kind": "guided_write" },
  "xp": 15
}
```

### 6. grammar_note ⭐ NOVO
Instrução explícita com exemplos, fórmula e erro comum.

```json
{
  "type": "grammar_note",
  "title": "Pedidos educados com Konjunktiv II",
  "explanation": "Texto explicativo…",
  "examples": [
    { "de": "Ich hätte gern…", "pt": "Eu gostaria de…", "highlight": "hätte gern" }
  ],
  "ruleFormula": "hätte gern + [Menge] + [Produkt]",
  "commonMistake": "Erro: 'Ich will Käse' → soa rude.",
  "xp": 5
}
```

### 7. match_pairs ⭐ NOVO

```json
{
  "type": "match_pairs",
  "instruction": "Verbinde…",
  "pairs": [
    { "left": "ein Kilo", "right": "Tomaten" },
    { "left": "ein Stück", "right": "Käse" }
  ],
  "xpCorrect": 25,
  "xpWrong": 10
}
```

### 8. translate ⭐ NOVO

```json
{
  "type": "translate",
  "instruction": "…",
  "direction": "pt_to_de",
  "source": "Eu gostaria de um quilo de maçãs.",
  "acceptedAnswers": ["Ich hätte gern ein Kilo Äpfel."],
  "hint": "opcional",
  "explanation": "opcional",
  "xpCorrect": 25,
  "xpWrong": 6
}
```

### 9. error_correction ⭐ NOVO

```json
{
  "type": "error_correction",
  "instruction": "Finde den Fehler.",
  "sentence": "Ich will gern ein Kilo Kartoffeln.",
  "errorWord": "will",
  "correctedWord": "hätte",
  "explanation": "'will' é rude; use Konjunktiv II.",
  "xpCorrect": 25,
  "xpWrong": 6
}
```

### 10. dialogue_choice ⭐ NOVO

```json
{
  "type": "dialogue_choice",
  "instruction": "Wähle die passende Antwort.",
  "context": "Du bist am Obststand.",
  "lines": [
    { "speaker": "Verkäufer", "text": "Was darf es sein?" }
  ],
  "choicePrompt": "Was sagst du?",
  "options": ["Ich hätte gern…", "Gib mir!"],
  "correctIndex": 0,
  "explanation": "opcional",
  "xpCorrect": 20,
  "xpWrong": 6
}
```

### 11. vocab_recall ⭐ NOVO

```json
{
  "type": "vocab_recall",
  "instruction": "Wie heißt das auf Deutsch?",
  "prompt": "salsinha",
  "direction": "pt_to_de",
  "acceptedAnswers": ["Petersilie", "die Petersilie"],
  "hint": "opcional",
  "xpCorrect": 20,
  "xpWrong": 4
}
```

### 12. multi_cloze ⭐ NOVO
Marcadores: `{___0}`, `{___1}`, `{___2}`, etc.

```json
{
  "type": "multi_cloze",
  "instruction": "Ergänze den Dialog.",
  "text": "Ich {___0} gern Käse. {___1} es noch etwas sein?",
  "blanks": [
    { "id": 0, "options": ["hätte", "habe"], "correct": "hätte", "explanation": "…" },
    { "id": 1, "options": ["Darf", "Muss"], "correct": "Darf", "explanation": "…" }
  ],
  "xpCorrect": 30,
  "xpWrong": 8
}
```

---

## Fluxo pedagógico recomendado (12–15 steps)

1. **grammar_note** — Ensinar a regra
2. **reading** — Contexto
3. **comprehension** — Compreensão global
4. **match_pairs** — Vocabulário (reconhecimento)
5. **cloze** — Regra com apoio
6. **dialogue_choice** — Contexto social
7. **error_correction** — Consciência metalinguística
8. **multi_cloze** — Desafio múltiplo
9. **translate** — Produção semi-livre
10. **vocab_recall** — Recall sem apoio
11. **reorder** — Estrutura da frase
12. **guided_write** — Produção livre

---

## Validação
- `npm run validate-content`
- `npm run build` (via `prebuild`)

## Regras semânticas validadas
- `comprehension.correctIndex` < `options.length`
- `cloze.sentence` contém `{___}`
- `cloze.correct` ∈ `options`
- `reorder.words` sem duplicados
- `multi_cloze.text` contém `{___N}` para cada blank
- `multi_cloze.blanks[].correct` ∈ `options`

Implementação: `src/content/schema.ts`.
