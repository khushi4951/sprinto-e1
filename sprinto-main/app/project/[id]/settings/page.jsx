"use client";
import SettingsView from "@/components/board/SettingsView";

export default function SettingsPage({ params }) {
  return <SettingsView projectId={params.id} />;
}
