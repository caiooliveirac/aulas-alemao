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
    <div className="mx-auto max-w-md px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-sm opacity-70">Lição</div>
          <div className="text-lg font-semibold">{lesson.title}</div>
        </div>
        <Link href="/">
          <Button variant="secondary">Sair</Button>
        </Link>
      </header>
      <LessonSession lesson={lesson} />
    </div>
  );
}
