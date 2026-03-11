"use client";
import BoardView from "@/components/board/BoardView";

export default function BoardPage({ params }) {
  return <BoardView projectId={params.id} />;
}
