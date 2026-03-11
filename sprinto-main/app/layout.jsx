import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "Sprinto – Project Management Reimagined",
  description:
    "Fast, beautiful project tracking for engineering teams. Sprints, boards, and backlogs that actually spark joy.",
  keywords:
    "project management, jira alternative, sprint planning, kanban board",
  openGraph: {
    title: "Sprinto – Project Management Reimagined",
    description: "Fast, beautiful project tracking for engineering teams.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
