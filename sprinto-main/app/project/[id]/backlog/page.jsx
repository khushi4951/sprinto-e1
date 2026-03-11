"use client";
import BacklogView from "@/components/board/BacklogView";

export default function BacklogPage({ params }) {
  return <BacklogView projectId={params.id} />;
}
