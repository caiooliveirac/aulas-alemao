import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import LessonSession from "./sessionClient";
import { getLessonById } from "@/content/loadLessons";

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = await getLessonById(id);
  if (!lesson) return notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <header className="mb-5 flex items-center justify-between animate-fade-up">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">Lição</p>
          <h1 className="mt-0.5 text-xl font-bold tracking-tight">{lesson.title}</h1>
        </div>
        <Link href="/">
          <Button variant="ghost" size="sm">✕ Sair</Button>
        </Link>
      </header>
      <LessonSession lesson={lesson} />
    </div>
  );
}
