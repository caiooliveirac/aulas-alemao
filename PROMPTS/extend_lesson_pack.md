# Prompt: Criar pack de 2–3 lições (DeutschBrücke v2)

Você vai criar **2–3 lições novas** para o DeutschBrücke.
Cada lição individual deve seguir **todas** as regras do arquivo `PROMPTS/create_new_lesson.md` — leia-o primeiro.

Este prompt adiciona regras de **coerência entre lições do pack**.

---

## 1. Entrada esperada

| Campo | Exemplo |
|---|---|
| **Tópico** | Reisen |
| **Faixa de nível** | B1 → B1+ |
| **Quantidade** | 3 lições |
| **Foco geral** | Viagem e transporte: planejamento, no aeroporto, no hotel |
| **Gramática progressiva** | Lição 1: Futur I · Lição 2: indirekte Rede básica · Lição 3: Konjunktiv II para situações |

---

## 2. Regras de pack

### 2.1 IDs e numeração
- IDs devem seguir o padrão: `topico-01`, `topico-02`, `topico-03`
- Cada lição subsequente pode listar a anterior como `prerequisite`

### 2.2 Progressão de dificuldade
- A primeira lição do pack deve ser a **mais fácil** (mais scaffolding, mais reconhecimento)
- A última lição deve ter **mais produção** (mais translate, guided_write, menos cloze)
- A quantidade de `acceptedAnswers` em translate deve crescer ao longo do pack

| Lição no pack | Perfil de dificuldade |
|---|---|
| 1ª | 60% reconhecimento, 40% produção. Mais grammar_note, cloze, match_pairs |
| 2ª | 50/50. Introduza error_correction, dialogue_choice, multi_cloze |
| 3ª | 40% reconhecimento, 60% produção. Ênfase em translate, guided_write, vocab_recall |

### 2.3 Coerência temática
- As lições devem contar uma **história progressiva** ou explorar **facetas do mesmo tema**
- Vocabulário introduzido na lição 1 pode reaparecer (sem glossário) nas lições seguintes
- O texto do `reading` da lição 2+ pode fazer **referência** a eventos da lição anterior

### 2.4 SRS pool compartilhado
- Distribua ≥ 4 SRS seeds por lição (≥ 12 para pack de 3)
- Use `tags` consistentes entre lições para agrupar no review
- Evite SRS seeds redundantes — se a lição 1 tem um card para "hätte gern", não repita na lição 2
- No pack, garanta diversidade de `kind`: pelo menos 3 kinds diferentes de SRS no total

### 2.5 Não repetir padrões
- Se a lição 1 tem `reading → comprehension → cloze` como fluxo, a lição 2 **deve** ter um fluxo diferente
- Cada lição do pack deve usar ≥ 7 tipos de step (podem ser tipos diferentes entre lições)
- Varie o estilo de texto do reading: lição 1 pode ser narrativo, lição 2 diálogo, lição 3 e-mail/anúncio

---

## 3. Checklist adicional do pack

- [ ] Cada lição passa no checklist individual de `create_new_lesson.md`?
- [ ] O nível cresce ou se mantém ao longo do pack (nunca diminui)?
- [ ] Os `prerequisites` estão corretos (lição N lista lição N-1)?
- [ ] Os IDs seguem o padrão `topico-nn`?
- [ ] O vocabulário é reutilizado progressivamente?
- [ ] Os temas de SRS (`tags`) são consistentes?
- [ ] Seeds de SRS não se repetem entre lições?
- [ ] Os textos do reading variam em formato?
- [ ] A proporção reconhecimento/produção cresce ao longo do pack?
- [ ] `npm run validate-content` passa para TODOS os arquivos?

---

## 4. Formato de entrega

Retorne **cada lição como um bloco JSON separado** com o nome de arquivo indicado:

```
### content/lessons/topico-01.json
\`\`\`json
{ ... }
\`\`\`

### content/lessons/topico-02.json
\`\`\`json
{ ... }
\`\`\`
```

Não altere arquivos em `src/`. Não coloque conteúdo em TSX/JSX.
