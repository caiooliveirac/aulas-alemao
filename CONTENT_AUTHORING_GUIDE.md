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
4) Edite `steps[]` (8–15 steps, veja fluxo pedagógico abaixo):
   - `grammar_note` (instrução explícita com exemplos)
   - `reading` (chunks + glossário)
   - `comprehension` (pergunta + opções + explicação de distratores)
   - `match_pairs` (associação de pares)
   - `cloze` (lacuna `{___}` + regra gramatical)
   - `dialogue_choice` (diálogo interativo)
   - `error_correction` (encontrar e corrigir erro)
   - `multi_cloze` (múltiplas lacunas `{___0}`, `{___1}`…)
   - `translate` (tradução PT↔DE com múltiplas respostas aceitas)
   - `vocab_recall` (recall livre sem opções)
   - `reorder` (reordenar palavras)
   - `guided_write` (produção guiada com checkpoints)
5) Valide:
```bash
cd /home/ubuntu/deutschbruecke
npm run validate-content
```

## Convenções pedagógicas (v2)
- Microtarefas: cada step deve ser concluível em 20–90s.
- **Ensine antes de testar**: comece com `grammar_note` antes dos exercícios.
- Feedback imediato: inclua `explanation` + `distractorExplanations` quando possível.
- **Gradação**: reconhecimento (match) → recall assistido (cloze) → recall livre (vocab_recall/translate) → produção (guided_write).
- Produção guiada: `guided_write` com `starters` + `keywords` + `exampleAnswer` + `checkpoints`.
- Repetição inteligente: adicione `srs` em 3–5 steps por lição.
- **Contexto cultural**: use `culturalNote` nos metadados para situar o tema.
- **Objetivos claros**: use `objectives` nos metadados para que o aluno saiba o que vai aprender.

## Fluxo pedagógico recomendado
1. `grammar_note` — Ensinar a regra
2. `reading` — Contexto
3. `comprehension` — Compreensão global
4. `match_pairs` — Vocabulário (reconhecimento)
5. `cloze` — Regra com apoio
6. `dialogue_choice` — Contexto social
7. `error_correction` — Consciência metalinguística
8. `multi_cloze` — Desafio múltiplo
9. `translate` — Produção semi-livre
10. `vocab_recall` — Recall sem apoio
11. `reorder` — Estrutura da frase
12. `guided_write` — Produção livre

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

## Novos step types (v2) — resumo rápido

| Tipo | Propósito | Dificuldade |
|------|-----------|-------------|
| `grammar_note` | Ensinar regra com exemplos e fórmula | — |
| `match_pairs` | Associar pares (vocabulário) | ★☆☆ |
| `dialogue_choice` | Escolher resposta num diálogo | ★★☆ |
| `error_correction` | Encontrar e corrigir erro numa frase | ★★☆ |
| `multi_cloze` | Preencher múltiplas lacunas num texto | ★★★ |
| `translate` | Traduzir frase (PT↔DE) | ★★★ |
| `vocab_recall` | Digitar palavra/tradução sem opções | ★★★ |

## Checklist final
- `npm run validate-content` passa.
- Sem texto grande em um único chunk.
- Pelo menos 3 seeds de SRS distribuídas na lição.
- Metadados completos (keywords, skillTags, objectives).
- Começa com `grammar_note` ou `reading` (não pular direto para exercícios).
- Usa pelo menos 6 tipos de step diferentes por lição.
- `culturalNote` preenchido quando o tema permite.

## O que `validate-content` garante (robustez extra)
Além de verificar campos obrigatórios e tipos, ele falha cedo se detectar:
- `comprehension.correctIndex` fora do range de `options`
- `cloze.sentence` sem o marcador `{___}`
- `cloze.correct` que não está presente em `options`
- `reorder.words` com termos duplicados
- `multi_cloze.text` sem marcadores `{___N}` esperados
- `multi_cloze.blanks[].correct` ausente de `options`

Essas regras vivem no schema Zod em `src/content/schema.ts`.

