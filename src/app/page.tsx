import DashboardClient from "./DashboardClient";
import { getLessonsMeta } from "@/content/loadLessons";
import { getTopics } from "@/content/loadTopics";
import { requireAuth } from "@/lib/auth";

export const metadata = {
  title: "DeutschBrücke",
  description: "B1 → B2 com microtarefas e SRS",
};

export default async function Home() {
  await requireAuth();
  const lessons = await getLessonsMeta();
  const topics = await getTopics();
  return <DashboardClient lessons={lessons} topics={topics} />;
}
