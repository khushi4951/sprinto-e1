import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import DashboardClient from "@/components/board/DashboardClient";

export default async function DashboardPage() {
  const { userId } = auth();

  // In production, load from DB. We use mock data for demo.
  return <DashboardClient />;
}
