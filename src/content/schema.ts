import { z } from "zod";

export const LevelSchema = z.enum(["A1", "A2", "B1", "B1+", "B2", "B2+", "C1"]);

export const SkillTagSchema = z.enum([
  "reading",
  "vocab",
  "grammar",
  "listening",
  "speaking",
  "writing",
  "srs",
  "culture",
  "dialogue",
  "translation",
]);

export const GlossaryEntrySchema = z.object({
  term: z.string().min(1),
  de: z.string().min(1),
  pt: z.string().min(1),
  example: z.string().min(1).optional(),
  audioUrl: z.string().url().optional(),
});

export const SrsCardSeedSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
  kind: z.enum([
    "cloze",
    "reorder",
    "guided_write",
    "match",
    "translate",
    "error_correction",
    "vocab_recall",
  ]),
  tags: z.array(z.string().min(1)).optional(),
});

// ── Reading ──────────────────────────────────────────────

export const ReadingChunkSchema = z.object({
  text: z.string().min(1),
  glossary: z.array(GlossaryEntrySchema).optional(),
  audioUrl: z.string().url().optional(),
});

export const ReadingStepSchema = z.object({
  type: z.literal("reading"),
  instruction: z.string().min(1).optional(),
  chunks: z.array(ReadingChunkSchema).min(1),
  xp: z.number().int().min(0).optional(),
});

// ── Comprehension ────────────────────────────────────────

export const ComprehensionStepSchema = z
  .object({
    type: z.literal("comprehension"),
    question: z.string().min(1),
    options: z.array(z.string().min(1)).min(2),
    correctIndex: z.number().int().min(0),
    explanation: z.string().min(1).optional(),
    distractorExplanations: z.array(z.string().min(1)).optional(),
    xpCorrect: z.number().int().min(0).optional(),
    xpWrong: z.number().int().min(0).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.correctIndex >= val.options.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correctIndex"],
        message: `correctIndex (${val.correctIndex}) precisa ser < options.length (${val.options.length})`,
      });
    }
  });

// ── Cloze ────────────────────────────────────────────────

export const ClozeStepSchema = z
  .object({
    type: z.literal("cloze"),
    instruction: z.string().min(1),
    sentence: z.string().min(1),
    options: z.array(z.string().min(1)).min(2),
    correct: z.string().min(1),
    acceptedAnswers: z.array(z.string().min(1)).optional(),
    explanation: z.string().min(1).optional(),
    grammarRule: z.string().min(1).optional(),
    srs: SrsCardSeedSchema.optional(),
    xpCorrect: z.number().int().min(0).optional(),
    xpWrong: z.number().int().min(0).optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.sentence.includes("{___}")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sentence"],
        message: "sentence precisa conter o marcador {___}",
      });
    }
    if (!val.options.includes(val.correct)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correct"],
        message: "correct precisa ser exatamente um dos itens em options",
      });
    }
  });

// ── Reorder ──────────────────────────────────────────────

export const ReorderStepSchema = z
  .object({
    type: z.literal("reorder"),
    instruction: z.string().min(1),
    words: z.array(z.string().min(1)).min(2),
    correct: z.string().min(1),
    hint: z.string().min(1).optional(),
    srs: SrsCardSeedSchema.optional(),
    xpCorrect: z.number().int().min(0).optional(),
    xpWrong: z.number().int().min(0).optional(),
  })
  .superRefine((val, ctx) => {
    const unique = new Set(val.words);
    if (unique.size !== val.words.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["words"],
        message: "words não deve conter itens duplicados",
      });
    }
  });

// ── Guided Write ─────────────────────────────────────────

export const GuidedWriteStepSchema = z.object({
  type: z.literal("guided_write"),
  instruction: z.string().min(1),
  starters: z.array(z.string().min(1)).min(1),
  keywords: z.array(z.string().min(1)).min(1),
  exampleAnswer: z.string().min(1),
  checkpoints: z.array(z.string().min(1)).optional(),
  srs: SrsCardSeedSchema.optional(),
  xp: z.number().int().min(0).optional(),
});

// ── NEW: Grammar Note (instrução explícita) ──────────────

export const GrammarExampleSchema = z.object({
  de: z.string().min(1),
  pt: z.string().min(1),
  highlight: z.string().min(1).optional(),
});

export const GrammarNoteStepSchema = z.object({
  type: z.literal("grammar_note"),
  title: z.string().min(1),
  explanation: z.string().min(1),
  examples: z.array(GrammarExampleSchema).min(1),
  ruleFormula: z.string().min(1).optional(),
  commonMistake: z.string().min(1).optional(),
  xp: z.number().int().min(0).optional(),
});

// ── NEW: Match Pairs (vocabulário associativo) ───────────

export const MatchPairSchema = z.object({
  left: z.string().min(1),
  right: z.string().min(1),
});

export const MatchPairsStepSchema = z.object({
  type: z.literal("match_pairs"),
  instruction: z.string().min(1),
  pairs: z.array(MatchPairSchema).min(2).max(8),
  srs: SrsCardSeedSchema.optional(),
  xpCorrect: z.number().int().min(0).optional(),
  xpWrong: z.number().int().min(0).optional(),
});

// ── NEW: Translate (tradução bidirecional) ───────────────

export const TranslateStepSchema = z.object({
  type: z.literal("translate"),
  instruction: z.string().min(1),
  direction: z.enum(["pt_to_de", "de_to_pt"]),
  source: z.string().min(1),
  acceptedAnswers: z.array(z.string().min(1)).min(1),
  hint: z.string().min(1).optional(),
  explanation: z.string().min(1).optional(),
  srs: SrsCardSeedSchema.optional(),
  xpCorrect: z.number().int().min(0).optional(),
  xpWrong: z.number().int().min(0).optional(),
});

// ── NEW: Error Correction (encontrar e corrigir erro) ────

export const ErrorCorrectionStepSchema = z.object({
  type: z.literal("error_correction"),
  instruction: z.string().min(1),
  sentence: z.string().min(1),
  errorWord: z.string().min(1),
  correctedWord: z.string().min(1),
  explanation: z.string().min(1),
  srs: SrsCardSeedSchema.optional(),
  xpCorrect: z.number().int().min(0).optional(),
  xpWrong: z.number().int().min(0).optional(),
});

// ── NEW: Dialogue Choice (diálogo interativo) ────────────

export const DialogueLineSchema = z.object({
  speaker: z.string().min(1),
  text: z.string().min(1),
  isChoice: z.boolean().optional(),
});

export const DialogueChoiceStepSchema = z.object({
  type: z.literal("dialogue_choice"),
  instruction: z.string().min(1),
  context: z.string().min(1),
  lines: z.array(DialogueLineSchema).min(1),
  choicePrompt: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctIndex: z.number().int().min(0),
  explanation: z.string().min(1).optional(),
  xpCorrect: z.number().int().min(0).optional(),
  xpWrong: z.number().int().min(0).optional(),
});

// ── NEW: Vocab Recall (recall livre, sem opções) ─────────

export const VocabRecallStepSchema = z.object({
  type: z.literal("vocab_recall"),
  instruction: z.string().min(1),
  prompt: z.string().min(1),
  direction: z.enum(["pt_to_de", "de_to_pt"]),
  acceptedAnswers: z.array(z.string().min(1)).min(1),
  hint: z.string().min(1).optional(),
  explanation: z.string().min(1).optional(),
  srs: SrsCardSeedSchema.optional(),
  xpCorrect: z.number().int().min(0).optional(),
  xpWrong: z.number().int().min(0).optional(),
});

// ── NEW: Multi-Cloze (múltiplas lacunas num texto) ───────

export const MultiClozeBlankSchema = z.object({
  id: z.number().int().min(0),
  options: z.array(z.string().min(1)).min(2),
  correct: z.string().min(1),
  explanation: z.string().min(1).optional(),
});

export const MultiClozeStepSchema = z
  .object({
    type: z.literal("multi_cloze"),
    instruction: z.string().min(1),
    text: z.string().min(1),
    blanks: z.array(MultiClozeBlankSchema).min(1),
    srs: SrsCardSeedSchema.optional(),
    xpCorrect: z.number().int().min(0).optional(),
    xpWrong: z.number().int().min(0).optional(),
  })
  .superRefine((val, ctx) => {
    for (const blank of val.blanks) {
      const marker = `{___${blank.id}}`;
      if (!val.text.includes(marker)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["text"],
          message: `text precisa conter o marcador ${marker}`,
        });
      }
      if (!blank.options.includes(blank.correct)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["blanks"],
          message: `blank ${blank.id}: correct "${blank.correct}" precisa estar em options`,
        });
      }
    }
  });

// ── Discriminated Union ──────────────────────────────────

export const LessonStepSchema = z.discriminatedUnion("type", [
  ReadingStepSchema,
  ComprehensionStepSchema,
  ClozeStepSchema,
  ReorderStepSchema,
  GuidedWriteStepSchema,
  GrammarNoteStepSchema,
  MatchPairsStepSchema,
  TranslateStepSchema,
  ErrorCorrectionStepSchema,
  DialogueChoiceStepSchema,
  VocabRecallStepSchema,
  MultiClozeStepSchema,
]);

// ── Lesson Metadata (enriquecido) ────────────────────────

export const LessonMetaSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "Use apenas a-z, 0-9 e hífen"),
  title: z.string().min(1),
  topic: z.string().min(1),
  level: LevelSchema,
  grammarFocus: z.string().min(1),
  lexicalFocus: z.string().min(1).optional(),
  estimatedMinutes: z.number().int().min(1).max(90),
  xpReward: z.number().int().min(0),
  keywords: z.array(z.string().min(1)).min(1),
  skillTags: z.array(SkillTagSchema).min(1),
  // v2 enrichments
  objectives: z.array(z.string().min(1)).optional(),
  prerequisites: z.array(z.string().min(1)).optional(),
  culturalNote: z.string().min(1).optional(),
});

export const LessonSchema = LessonMetaSchema.extend({
  steps: z.array(LessonStepSchema).min(1),
});

export type Lesson = z.infer<typeof LessonSchema>;
export type LessonMeta = z.infer<typeof LessonMetaSchema>;
export type LessonStep = z.infer<typeof LessonStepSchema>;
export type SrsCardSeed = z.infer<typeof SrsCardSeedSchema>;
export type GlossaryEntry = z.infer<typeof GlossaryEntrySchema>;
export type GrammarExample = z.infer<typeof GrammarExampleSchema>;
export type MatchPair = z.infer<typeof MatchPairSchema>;
export type DialogueLine = z.infer<typeof DialogueLineSchema>;
export type MultiClozeBlank = z.infer<typeof MultiClozeBlankSchema>;
