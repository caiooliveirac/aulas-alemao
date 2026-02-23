import { z } from "zod";

export const LevelSchema = z.enum(["A2", "B1", "B1+", "B2"]);

export const SkillTagSchema = z.enum([
  "reading",
  "vocab",
  "grammar",
  "listening",
  "speaking",
  "writing",
  "srs",
]);

export const GlossaryEntrySchema = z.object({
  term: z.string().min(1),
  de: z.string().min(1),
  pt: z.string().min(1),
});

export const SrsCardSeedSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
  kind: z.enum(["cloze", "reorder", "guided_write"]),
  tags: z.array(z.string().min(1)).optional(),
});

export const ReadingChunkSchema = z.object({
  text: z.string().min(1),
  glossary: z.array(GlossaryEntrySchema).optional(),
});

export const ReadingStepSchema = z.object({
  type: z.literal("reading"),
  instruction: z.string().min(1).optional(),
  chunks: z.array(ReadingChunkSchema).min(1),
  xp: z.number().int().min(0).optional(),
});

export const ComprehensionStepSchema = z.object({
  type: z.literal("comprehension"),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctIndex: z.number().int().min(0),
  explanation: z.string().min(1).optional(),
  xpCorrect: z.number().int().min(0).optional(),
  xpWrong: z.number().int().min(0).optional(),
}).superRefine((val, ctx) => {
  if (val.correctIndex >= val.options.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["correctIndex"],
      message: `correctIndex (${val.correctIndex}) precisa ser < options.length (${val.options.length})`,
    });
  }
});

export const ClozeStepSchema = z.object({
  type: z.literal("cloze"),
  instruction: z.string().min(1),
  sentence: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correct: z.string().min(1),
  explanation: z.string().min(1).optional(),
  srs: SrsCardSeedSchema.optional(),
  xpCorrect: z.number().int().min(0).optional(),
  xpWrong: z.number().int().min(0).optional(),
}).superRefine((val, ctx) => {
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

export const ReorderStepSchema = z.object({
  type: z.literal("reorder"),
  instruction: z.string().min(1),
  words: z.array(z.string().min(1)).min(2),
  correct: z.string().min(1),
  hint: z.string().min(1).optional(),
  srs: SrsCardSeedSchema.optional(),
  xpCorrect: z.number().int().min(0).optional(),
  xpWrong: z.number().int().min(0).optional(),
}).superRefine((val, ctx) => {
  const unique = new Set(val.words);
  if (unique.size !== val.words.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["words"],
      message: "words não deve conter itens duplicados",
    });
  }
});

export const GuidedWriteStepSchema = z.object({
  type: z.literal("guided_write"),
  instruction: z.string().min(1),
  starters: z.array(z.string().min(1)).min(1),
  keywords: z.array(z.string().min(1)).min(1),
  exampleAnswer: z.string().min(1),
  srs: SrsCardSeedSchema.optional(),
  xp: z.number().int().min(0).optional(),
});

export const LessonStepSchema = z.discriminatedUnion("type", [
  ReadingStepSchema,
  ComprehensionStepSchema,
  ClozeStepSchema,
  ReorderStepSchema,
  GuidedWriteStepSchema,
]);

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
});

export const LessonSchema = LessonMetaSchema.extend({
  steps: z.array(LessonStepSchema).min(1),
});

export type Lesson = z.infer<typeof LessonSchema>;
export type LessonMeta = z.infer<typeof LessonMetaSchema>;
export type LessonStep = z.infer<typeof LessonStepSchema>;
export type SrsCardSeed = z.infer<typeof SrsCardSeedSchema>;
export type GlossaryEntry = z.infer<typeof GlossaryEntrySchema>;
