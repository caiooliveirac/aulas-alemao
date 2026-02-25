# Prompt: Criar uma nova lição de alemão (DeutschBrücke v2)

Você é um designer instrucional para o DeutschBrücke, um app de alemão B1→C1.
Produza **um JSON** de lição que seguirá o schema Zod e passará `npm run validate-content`.

---

## 1. Entrada esperada

O humano deve fornecer:

| Campo | Exemplo |
|---|---|
| **Tópico** | Gesundheit |
| **Título** | Beim Hausarzt: Symptome beschreiben |
| **Gramática alvo** | Konjunktiv II (sollte, könnte, müsste) para conselhos médicos |
| **Nível** | B1+ |
| **Pré-requisitos** | gesundheit-01 |

Se qualquer campo estiver ausente, assuma valores razoáveis.

---

## 2. Estrutura obrigatória

### 2.1 Metadados

```jsonc
{
  "id": "topico-nn",           // slug: [a-z0-9-]+
  "title": "...",
  "topic": "...",              // deve existir em topics.json
  "level": "B1+" | "B2" | …,  // A1 A2 B1 B1+ B2 B2+ C1
  "grammarFocus": "...",
  "lexicalFocus": "...",       // campo de vocabulário (opcional)
  "estimatedMinutes": 15,      // 10–25
  "xpReward": 200,             // soma dos XP de todos os steps
  "keywords": ["…"],           // 4–8 termos
  "skillTags": ["reading","vocab","grammar","writing","dialogue","translation","srs"],
  "objectives": [              // OBRIGATÓRIO: 2–4 frases curtas
    "Usar X para Y",
    "Vocabulário de Z"
  ],
  "prerequisites": ["id-da-licao-anterior"],  // lista ou []
  "culturalNote": "Uma nota cultural de 2–3 frases sobre o contexto do tema na Alemanha."
}
```

### 2.2 Steps: regras e quantidades

| Regra | Valor |
|---|---|
| Total de steps | **10–15** (mínimo absoluto: 8) |
| Tipos diferentes | **≥ 7** dos 12 disponíveis |
| Primeiro step | SEMPRE `grammar_note` |
| Segundo step | SEMPRE `reading` |
| Último step | SEMPRE `guided_write` |
| Antes de testar um conceito | Ensine-o (grammar_note ou reading) |
| `translate` ou `vocab_recall` | pelo menos 1 de cada |
| `error_correction` | pelo menos 1 |
| SRS seeds totais | ≥ 4 distribuídas nos steps |

### 2.3 Fluxo pedagógico recomendado

```
1. grammar_note     — ensine a regra
2. reading          — exponha em contexto real
3. comprehension    — teste compreensão
4. match_pairs      — vocabulário associativo
5. cloze            — lacuna guiada
6. dialogue_choice  — pragmática e registro
7. error_correction — consciência de erro
8. multi_cloze      — texto com múltiplas lacunas
9. translate        — produção nível frase (PT→DE)
10. vocab_recall    — recall sem opções
11. reorder         — sintaxe e ordem verbal
12. guided_write    — produção aberta com scaffolding
```

Você pode reorganizar e repetir tipos conforme o tema, mas a progressão de dificuldade deve ser:
**reconhecimento → seleção guiada → produção com scaffold → produção livre**.

---

## 3. Regras por tipo de step

### 3.1 `grammar_note`
```jsonc
{
  "type": "grammar_note",
  "title": "Título conciso da regra",
  "explanation": "Explicação clara de 2-4 frases em português. Dê o PORQUÊ.",
  "examples": [             // 3–5 exemplos
    {
      "de": "Frase em alemão",
      "pt": "Tradução",
      "highlight": "trecho na frase DE a destacar"
    }
  ],
  "ruleFormula": "Padrão visual: Subj + würde + … + Infinitiv",  // OBRIGATÓRIO
  "commonMistake": "Erro comum que alunos B1 cometem, e por quê.",
  "xp": 5
}
```

### 3.2 `reading`
```jsonc
{
  "type": "reading",
  "instruction": "Instrução EM ALEMÃO: Lies den Dialog aufmerksam.",
  "chunks": [                // 2–4 chunks
    {
      "text": "Parágrafo de 2–5 frases. Inclua a gramática-alvo em contexto NATURAL.",
      "glossary": [          // 2–5 termos por chunk
        {
          "term": "Wort",
          "de": "Definição em alemão simples",
          "pt": "Tradução",
          "example": "Frase de exemplo (opcional)"
        }
      ]
    }
  ],
  "xp": 10
}
```

**Regras de conteúdo do texto:**
- Situação realista do cotidiano alemão
- Use a gramática-alvo **naturalmente** (não force)
- Nível lexical alvo + ~15% de vocabulário novo (glossário)
- Mínimo 150 palavras no total dos chunks

### 3.3 `comprehension`
```jsonc
{
  "type": "comprehension",
  "question": "Pergunta que exige INFERÊNCIA, não cópia literal do texto.",
  "options": ["A", "B", "C", "D"],   // SEMPRE 4 opções
  "correctIndex": 2,
  "explanation": "Por que a resposta é C e não as outras.",
  "distractorExplanations": [         // OBRIGATÓRIO
    "A está errado porque…",
    "B está errado porque…",
    "D está errado porque…"
  ],
  "xpCorrect": 20,
  "xpWrong": 6
}
```

**REGRA CRÍTICA para distratores:**
- NUNCA use distratores absurdos ou que não tenham relação com o texto.
- Cada distrator deve ser **plausível mas incorreto**.
- Pelo menos 1 distrator deve ser um **erro gramatical comum** (ex: usar indicativo onde deveria ser Konjunktiv).
- A pergunta deve exigir **compreensão global ou inferência**, não busca de palavra literal.

**Exemplos de distratores BOM vs RUIM:**

| ❌ Ruim (B1 elimina instantaneamente) | ✅ Bom (exige reflexão) |
|---|---|
| "Sie hat gar nichts gesagt" (absurdo) | "Sie hat gesagt: 'Geben Sie mir Tomaten'" (usa indicativo em vez de Konjunktiv II — plausível mas errado no contexto) |
| "Er hatte einen Unfall" (sem relação) | "Er hatte schon seit Wochen Fieber" (plausível mas não mencionado no texto) |

### 3.4 `cloze`
```jsonc
{
  "type": "cloze",
  "instruction": "Instrução focada no que testar.",
  "sentence": "Er sagte, er {___} das tun.",
  "options": ["wurde", "würde", "wird", "wäre"],  // 4–5 opções
  "correct": "würde",
  "explanation": "Würde + Infinitiv = Konjunktiv II regular. 'Wurde' é Präteritum.",
  "grammarRule": "Konjunktiv II: würde + Infinitiv",
  "srs": { "front": "Er sagte, er ___ das tun.", "back": "würde", "kind": "cloze", "tags": ["konjunktiv"] }
}
```

**REGRA CRÍTICA para opções:**
- Mínimo 4 opções
- Pelo menos 2 distratores devem pertencer à **mesma categoria gramatical** (ex: formas verbais do mesmo verbo, ou preposições que regem casos diferentes)
- O distrator-chave deve ser uma **confusão real** de alunos B1

### 3.5 `reorder`
```jsonc
{
  "type": "reorder",
  "instruction": "Instrução clara. Foque no fenômeno gramatical (ex: Verbposition im Nebensatz).",
  "words": ["Tomaten", "kaufen", "Sophie", "weil", "auf dem Markt", "möchte", ","],
  "correct": "Sophie möchte Tomaten kaufen , weil auf dem Markt",
  "hint": "Lembra: no Nebensatz com 'weil', o verbo vai para o final.",
  "srs": { "front": "Ordene: Tomaten, kaufen, Sophie, weil…", "back": "Sophie möchte Tomaten kaufen, weil…", "kind": "reorder" }
}
```

**REGRAS CRÍTICAS:**
1. **NUNCA coloque as palavras na ordem correta no array.** O array `words` é a ordem que o aluno vê inicialmente — o app faz um shuffle por segurança, mas os dados devem já estar embaralhados para clareza.
2. Use **6–10 tokens** (não 4 como trivial, não 15 como impossível).
3. A pontuação (`,`, `?`, `.`) deve ser token separado quando relevante.
4. A capitalização da primeira palavra NÃO deve revelar a posição. Se necessário, coloque-a em minúscula no array e documente no `correct` com maiúscula — a comparação é case-insensitive na interface.
5. Inclua pelo menos 1 **armadilha de posição** (ex: verbo que deveria ir para o final em Nebensatz mas parece natural no meio).

**Técnica de embaralhamento:**
- Pegue a frase correta e mova o verbo principal para a primeira posição
- Coloque a conjunção no meio
- Inverta o sujeito e o complemento
- Certifique-se que a ordem resultante NÃO FORMA FRASE GRAMATICAL

### 3.6 `match_pairs`
```jsonc
{
  "type": "match_pairs",
  "instruction": "Verbinde die Mengenangaben mit den passenden Lebensmitteln.",
  "pairs": [
    { "left": "ein Kilo", "right": "Kartoffeln" },
    { "left": "ein Stück", "right": "Kuchen" },
    { "left": "eine Scheibe", "right": "Brot" },
    { "left": "ein Glas", "right": "Marmelade" },
    { "left": "eine Dose", "right": "Thunfisch" }
  ],
  "srs": { "front": "ein Stück ___", "back": "Kuchen (um pedaço de bolo)", "kind": "match", "tags": ["mengen"] }
}
```

**Regras:**
- 4–6 pares (mínimo 4)
- Os pares devem ter **lógica não trivial** — evite associações que qualquer A1 faria (ex: "Hund → dog")
- Para B1+, use pares que envolvam distinções sutis (ex: regência verbal, colocações)

### 3.7 `dialogue_choice`
```jsonc
{
  "type": "dialogue_choice",
  "instruction": "Wähle die passende Antwort.",
  "context": "No mercado, o vendedor pergunta se Sophie quer mais algo.",
  "lines": [
    { "speaker": "Verkäufer", "text": "Darf es sonst noch etwas sein?" },
    { "speaker": "Sophie", "text": "Hmm, einen Moment bitte…" }
  ],
  "choicePrompt": "O que Sophie deveria responder?",
  "options": [
    "Könnten Sie mir noch etwas Petersilie geben?",
    "Ja, ich möchte gern noch ein Bund Petersilie.",
    "Petersilie hab ich auch gern, glaub ich."
  ],
  "correctIndex": 0,
  "explanation": "'Könnten Sie' é a forma mais adequada para um pedido educado a um desconhecido. Opção B usa 'möchte' que é aceitável mas menos formal. Opção C é vaga e não formula um pedido claro.",
  "xpCorrect": 20,
  "xpWrong": 8
}
```

**REGRA CRÍTICA — AMBIGUIDADE REAL:**
- As opções devem incluir pelo menos 1 que é **gramaticalmente correta mas pragmaticamente inferior**.
- A diferença deve ser de **registro, adequação ou nuance** — não de correção gramatical óbvia.
- NUNCA inclua opções absurdas ou rudes que qualquer pessoa eliminaria.
- Explique POR QUE uma resposta é melhor, reconhecendo que outras são parcialmente aceitáveis.

### 3.8 `error_correction`
```jsonc
{
  "type": "error_correction",
  "instruction": "Finde den Fehler und korrigiere ihn.",
  "sentence": "Ich will gern ein Kilo Tomaten.",
  "errorWord": "will",
  "correctedWord": "hätte",
  "explanation": "'Will' é direto demais para um pedido no mercado. Em alemão formal, use 'hätte gern' (Konjunktiv II) para pedidos educados.",
  "srs": { "front": "Ich ___ gern ein Kilo Tomaten. (polido)", "back": "hätte", "kind": "error_correction", "tags": ["konjunktiv"] }
}
```

**Regras:**
- O erro deve ser um **ERRO REAL E COMUM** de alunos B1 (não um typo)
- A frase com erro deve soar **quase natural** — o aluno precisa reconhecer a sutileza
- A explicação deve conectar ao conceito gramatical da lição

### 3.9 `translate` — PRODUÇÃO (o step mais valioso)

```jsonc
{
  "type": "translate",
  "instruction": "Übersetze ins Deutsche. Benutze den Konjunktiv II.",
  "direction": "pt_to_de",
  "source": "Eu gostaria de meio quilo de queijo, por favor.",
  "acceptedAnswers": [
    "Ich hätte gern ein halbes Kilo Käse, bitte.",
    "Ich hätte gern 500 Gramm Käse, bitte.",
    "Ich hätte gerne ein halbes Kilo Käse bitte.",
    "Ich hätte gerne 500 Gramm Käse, bitte.",
    "Ich hätte gern ein halbes Kilo Käse.",
    "Könnten Sie mir ein halbes Kilo Käse geben, bitte?",
    "Könnte ich bitte ein halbes Kilo Käse haben?",
    "Könnte ich ein halbes Kilo Käse bekommen?"
  ],
  "hint": "Lembre-se: 'hätte gern' ou 'Könnten Sie…?' para pedidos.",
  "explanation": "Variantes aceitas: 'hätte gern/gerne', 'Könnten Sie/Könnte ich', 'ein halbes Kilo/500 Gramm'. O artigo de Käse (der) não aparece com Mengenangaben.",
  "srs": { "front": "Eu gostaria de meio quilo de queijo (polido)", "back": "Ich hätte gern ein halbes Kilo Käse.", "kind": "translate", "tags": ["konjunktiv","mengen"] }
}
```

**🔴 REGRAS CRÍTICAS para `acceptedAnswers` — ENGENHARIA REVERSA OBRIGATÓRIA:**

Este é o step mais valioso pedagogicamente. O aluno digita livremente. A comparação é feita por normalização: `lowercase → remove pontuação → trim spaces`. Portanto:

1. **Cubra TODAS as variações legítimas.** Para cada frase, pense em:
   - Sinônimos de verbo: hätte/möchte/würde/könnte
   - Variantes regionais: gern/gerne
   - Unidades alternativas: ein halbes Kilo/500 Gramm/ein Pfund
   - Com e sem "bitte"
   - Com e sem vírgula (normalização remove)
   - Formas pessoais: "Ich hätte" / "Könnten Sie" / "Könnte ich"
   - Verbos alternativos: geben/haben/bekommen
   - Com e sem artigo depois de Mengenangabe

2. **Mínimo 6 variantes**, idealmente 8–12.

3. **Técnica de engenharia reversa por eixos de variação:**
   Para cada `source`:
   - Escreva a resposta "padrão"
   - Gere variantes por eixo:
     - Eixo 1: verbo modal (hätte/könnte/möchte)
     - Eixo 2: advérbio (gern/gerne/bitte/—)
     - Eixo 3: estrutura (declarativa/interrogativa)
     - Eixo 4: vocabulário alternativo (equivalentes)
   - Combine os eixos: 3 modais × 2 advérbios × 2 estruturas = 12 combinações
   - Elimine as antinatural, mantenha ≥ 6

4. **Não aceite respostas que ignorem o conceito-alvo.** Se a lição é sobre Konjunktiv II, não aceite "Ich will Käse" (isso é um erro, não variação).

### 3.10 `vocab_recall`
```jsonc
{
  "type": "vocab_recall",
  "instruction": "Wie sagt man das auf Deutsch?",
  "prompt": "salsinha (erva para cozinhar)",
  "direction": "pt_to_de",
  "acceptedAnswers": [
    "Petersilie",
    "die Petersilie",
    "Die Petersilie"
  ],
  "hint": "É um Kraut verde, começa com P…",
  "srs": { "front": "salsinha", "back": "die Petersilie", "kind": "vocab_recall", "tags": ["lebensmittel"] }
}
```

**Regras para `acceptedAnswers`:**
- Inclua: com artigo, sem artigo, artigo maiúsculo
- Para substantivos compostos: a forma completa e abreviações comuns
- Para verbos: Infinitiv e eventualmente formas conjugadas relevantes
- Mínimo 3 variantes

### 3.11 `multi_cloze`
```jsonc
{
  "type": "multi_cloze",
  "instruction": "Fülle alle Lücken aus.",
  "text": "Sophie {___0} gern ein Kilo Tomaten. {___1} Sie mir bitte eine Tüte {___2}?",
  "blanks": [
    {
      "id": 0,
      "options": ["hätte", "hat", "hatte", "will"],
      "correct": "hätte",
      "explanation": "Konjunktiv II para pedido educado."
    },
    {
      "id": 1,
      "options": ["Könnten", "Können", "Konnten", "Wollen"],
      "correct": "Könnten",
      "explanation": "'Könnten' (Konjunktiv II) é mais educado que 'Können' (indicativo)."
    },
    {
      "id": 2,
      "options": ["geben", "gegeben", "gibt", "gab"],
      "correct": "geben",
      "explanation": "Infinitiv no final da frase após verbo modal."
    }
  ]
}
```

**Regras:**
- 2–4 lacunas por step
- 4 opções por lacuna (mínimo)
- Os distratores de cada lacuna devem ser formas **DO MESMO PARADIGMA** (tempos do mesmo verbo, casos do mesmo substantivo, etc.)
- A dificuldade-chave deve ser a **distinção entre formas próximas** (Konjunktiv II vs. Indikativ, Präteritum vs. Konjunktiv)

### 3.12 `guided_write`
```jsonc
{
  "type": "guided_write",
  "instruction": "Escreva 2–3 frases pedindo produtos num mercado. Use Konjunktiv II.",
  "starters": ["Ich hätte gern…", "Könnten Sie mir…", "Würden Sie bitte…"],
  "keywords": ["hätte", "Könnten", "ein Kilo", "bitte"],
  "exampleAnswer": "Ich hätte gern ein Kilo Tomaten und 200 Gramm Champignons. Könnten Sie mir bitte eine Tüte geben?",
  "checkpoints": [            // OBRIGATÓRIO — 3–5 itens
    "Usei pelo menos uma forma de Konjunktiv II (hätte/könnten/würden)",
    "Incluí uma Mengenangabe (Kilo, Gramm, Stück, etc.)",
    "Minha frase soa como um pedido educado, não uma ordem",
    "Usei vocabulário de alimentos da lição"
  ],
  "srs": { "front": "Como pedir 1kg de tomates polidamente?", "back": "Ich hätte gern ein Kilo Tomaten.", "kind": "guided_write", "tags": ["konjunktiv"] },
  "xp": 20
}
```

---

## 4. Calibração de dificuldade por nível

### Tabela de referência

| Aspecto | B1 | B1+ | B2 | B2+ / C1 |
|---|---|---|---|---|
| Gramática | Nebensätze, Konj. II básico, Passiv | Konj. II irregular, Relativsätze, Plusquamperfekt | Konj. I (indirekte Rede), Partizipialattribute | Nominalisierung, Konnektoren avançados, Modalpartikeln |
| **Cloze opções** | 4 | 4–5 | 5 | 5–6 |
| **Comprehension distratores** | 1 plausível, 2 implausíveis | 2 plausíveis, 1 implausível | 2–3 plausíveis | todos plausíveis + ambiguidade |
| **Reorder tokens** | 6–8 | 7–9 | 8–10 | 10–12 |
| **Translate acceptedAnswers** | 6+ variações | 8+ variações | 8–10 variações | 10+ variações |
| **Texto reading** | 150–200 palavras | 200–300 | 250–350 | 350–500 |
| **Vocab nível** | frequência ≤ 3000 | 3000–5000 | 4000–6000 | 7000+ |

### Princípio de dificuldade

> Um exercício B1+ deve ser **resolvível por um aluno B1+ atento, mas não óbvio**.
> Se o aluno B1+ acerta sem pensar, está fácil demais.
> Se um B2 erra com frequência, está difícil demais.

**Para cada exercício, pergunte-se:**
1. Um aluno pode acertar sem ler o texto? → Muito fácil
2. A resposta é uma cópia literal de algo que acabou de ler? → Muito fácil
3. Só há 1 opção gramaticalmente possível? → Fácil demais para B1+
4. O aluno precisa combinar regra aprendida + contexto para acertar? → ✅ Dificuldade ideal

---

## 5. SRS seeds

Distribua pelo menos **4 seeds** na lição:
- 1 em cloze (paradigma verbal)
- 1 em translate (produção de frase)
- 1 em error_correction ou vocab_recall (consciência de erro ou vocabulário)
- 1 em guided_write ou reorder (estrutura frasal)

Formato:
```jsonc
{
  "front": "Pergunta/prompt do card (em PT ou DE)",
  "back": "Resposta esperada",
  "kind": "cloze" | "reorder" | "guided_write" | "match" | "translate" | "error_correction" | "vocab_recall",
  "tags": ["tema1", "tema2"]
}
```

---

## 6. XP e tempo

| Tipo | XP correto | XP errado | Minutos estimados |
|---|---|---|---|
| `grammar_note` | 5 | — | 1–2 |
| `reading` | 10 | — | 2–3 |
| `comprehension` | 20 | 6 | 1–2 |
| `cloze` | 20 | 6 | 1 |
| `reorder` | 25 | 8 | 1–2 |
| `match_pairs` | 25 | 10 | 1–2 |
| `dialogue_choice` | 20 | 8 | 1–2 |
| `error_correction` | 25 | 6 | 1–2 |
| `multi_cloze` | 30 | 8 | 2–3 |
| `translate` | 25 | 6 | 2–3 |
| `vocab_recall` | 20 | 4 | 1 |
| `guided_write` | 15–20 | — | 2–4 |

`xpReward` = soma de todos os XP corretos dos steps.
`estimatedMinutes` = soma dos minutos individuais.

---

## 7. Codificação JSON

- Use `\u201E` para „ e `\u201C` para " (aspas alemãs)
- Nunca use `"` (aspas normais) dentro de strings que representam diálogos
- Quebre linhas longas no editor, mas o JSON deve estar em uma única string por campo
- Rode `npm run validate-content` antes de finalizar

---

## 8. Checklist final

Antes de entregar o JSON, verifique:

- [ ] ≥ 10 steps?
- [ ] ≥ 7 tipos diferentes de step?
- [ ] Começa com `grammar_note`?
- [ ] `reading` logo após grammar_note?
- [ ] Termina com `guided_write`?
- [ ] `guided_write` tem `checkpoints` (3–5)?
- [ ] Pelo menos 1 `translate` com ≥ 6 `acceptedAnswers`?
- [ ] Pelo menos 1 `vocab_recall` com ≥ 3 `acceptedAnswers`?
- [ ] Pelo menos 1 `error_correction`?
- [ ] Pelo menos 1 `dialogue_choice` com ambiguidade real?
- [ ] Todos os `comprehension` têm 4 opções + `distractorExplanations`?
- [ ] Todos os `cloze` têm ≥ 4 opções?
- [ ] Todos os `reorder.words` estão EMBARALHADOS (não na ordem correta)?
- [ ] ≥ 4 SRS seeds distribuídas?
- [ ] `objectives` preenchido (2–4)?
- [ ] `culturalNote` preenchida?
- [ ] `xpReward` = soma dos XP?
- [ ] `estimatedMinutes` calculado?
- [ ] Distratores são plausíveis, não absurdos?
- [ ] Dificuldade coerente com o nível declarado?
- [ ] Texto do reading ≥ 150 palavras?
- [ ] `npm run validate-content` passa sem erros?

---

## 9. Antipadrões — NÃO FAÇA ISTO

| ❌ Antipadrão | ✅ O que fazer em vez |
|---|---|
| Comprehension com resposta = cópia literal do texto | Pergunte sobre inferência ou implicação |
| Distratores absurdos ("Ela não disse nada e saiu correndo") | Distratores gramaticalmente plausíveis mas semanticamente imprecisos |
| Reorder com 4 tokens triviais | 6–10 tokens com armadilha de posição verbal |
| Reorder com palavras já na ordem correta | Embaralhe deliberadamente, quebre blocos óbvios |
| Translate com 2 acceptedAnswers | Mínimo 6, engenharia reversa de eixo de variação |
| Cloze com 3 opções onde 2 são de outra classe gramatical | 4+ opções do mesmo paradigma gramatical |
| Dialogue com opção obviamente rude/absurda | 3 opções todas educadas mas com registro diferente |
| Começar com reading sem grammar_note | SEMPRE ensine antes de testar |
| guided_write sem checkpoints | SEMPRE inclua 3–5 pontos de autoavaliação |
| Lição com 5 steps e 3 tipos | Mínimo 10 steps, 7 tipos |
| Mesmo padrão reading→comprehension→cloze repetido | Variedade de tipos, intercale produção e reconhecimento |

---

## 10. Exemplo: esqueleto de lição B1+

```
Step  1: grammar_note     — Regra principal
Step  2: reading          — Texto contextualizado (250+ palavras)
Step  3: comprehension    — Pergunta inferencial sobre o texto
Step  4: match_pairs      — Vocabulário da lição em pares
Step  5: cloze            — Lacuna testando regra ensinada
Step  6: dialogue_choice  — Escolha pragmática em diálogo
Step  7: error_correction — Erro real de B1 na gramática-alvo
Step  8: multi_cloze      — Texto com 3 lacunas do mesmo paradigma
Step  9: translate        — PT→DE com 8+ acceptedAnswers
Step 10: vocab_recall     — Recall DE←PT sem opções
Step 11: reorder          — 8 tokens com armadilha de Verbposition
Step 12: guided_write     — Produção aberta com checkpoints
```

---

## 11. Referência rápida do schema Zod

Os tipos TypeScript exportados são: `Lesson`, `LessonMeta`, `LessonStep`, `SrsCardSeed`, `GlossaryEntry`, `GrammarExample`, `MatchPair`, `DialogueLine`, `MultiClozeBlank`.

Níveis válidos: `A1`, `A2`, `B1`, `B1+`, `B2`, `B2+`, `C1`.

Skill tags válidos: `reading`, `vocab`, `grammar`, `listening`, `speaking`, `writing`, `srs`, `culture`, `dialogue`, `translation`.

SRS kinds válidos: `cloze`, `reorder`, `guided_write`, `match`, `translate`, `error_correction`, `vocab_recall`.

ID da lição: apenas `[a-z0-9-]+`.
