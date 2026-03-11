import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ProjectTabs from "@/components/layout/ProjectTabs";

export default async function ProjectLayout({ children, params }) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex h-screen bg-[#060810] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <ProjectTabs projectId={params.id} />
        <main className="flex-1 overflow-hidden p-6">{children}</main>
      </div>
    </div>
  );
}
