import ReviewClient from "./reviewClient";
import { requireAuth } from "@/lib/auth";

export const metadata = {
  title: "DeutschBrücke · Revisão",
};

export default async function ReviewPage() {
  await requireAuth();
  return <ReviewClient />;
}
