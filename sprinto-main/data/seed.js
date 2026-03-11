// Seed data for development / demo
export const SEED_PROJECTS = [
  { id: "p1", name: "Platform Redesign", key: "PDR", color: "#818cf8", description: "Complete overhaul of the core platform UI/UX", createdAt: "2025-01-10", ownerId: "u1" },
  { id: "p2", name: "Mobile App v2",     key: "MAV", color: "#34d399", description: "Next generation mobile application", createdAt: "2025-02-01", ownerId: "u1" },
  { id: "p3", name: "API Gateway",       key: "APG", color: "#f59e0b", description: "Centralized API management layer", createdAt: "2025-02-20", ownerId: "u1" },
];

export const SEED_SPRINTS = [
  { id: "s1", projectId: "p1", name: "Sprint 1 – Foundation",  status: "ACTIVE",    startDate: "2025-03-01", endDate: "2025-03-14", goal: "Set up base architecture" },
  { id: "s2", projectId: "p1", name: "Sprint 2 – Components",  status: "PLANNED",   startDate: "2025-03-15", endDate: "2025-03-28", goal: "Build design system" },
  { id: "s3", projectId: "p2", name: "Sprint 1 – MVP",         status: "ACTIVE",    startDate: "2025-03-01", endDate: "2025-03-21", goal: "Ship core features" },
  { id: "s4", projectId: "p3", name: "Sprint 1 – Auth Layer",  status: "COMPLETED", startDate: "2025-02-01", endDate: "2025-02-15", goal: "Auth + rate limiting" },
];

export const SEED_ISSUES = [
  { id: "i1",  projectId: "p1", sprintId: "s1", title: "Design token system",         type: "EPIC",  priority: "HIGH",   status: "DONE",        assigneeId: "u1", reporterId: "u1", description: "Set up CSS variables and design tokens", createdAt: "2025-03-01", labels: ["design","infra"] },
  { id: "i2",  projectId: "p1", sprintId: "s1", title: "Navigation component",         type: "TASK",  priority: "MEDIUM", status: "IN_PROGRESS", assigneeId: "u1", reporterId: "u1", description: "Build responsive nav with dropdowns", createdAt: "2025-03-02", labels: ["frontend"] },
  { id: "i3",  projectId: "p1", sprintId: "s1", title: "Auth flow broken on Safari",   type: "BUG",   priority: "URGENT", status: "TODO",        assigneeId: null, reporterId: "u1", description: "Safari 16+ has cookie issues with clerk", createdAt: "2025-03-03", labels: ["bug","auth"] },
  { id: "i4",  projectId: "p1", sprintId: "s1", title: "Dashboard analytics widget",   type: "STORY", priority: "LOW",    status: "IN_REVIEW",   assigneeId: "u1", reporterId: "u1", description: "Charts for user activity", createdAt: "2025-03-04", labels: ["analytics"] },
  { id: "i5",  projectId: "p1", sprintId: "s2", title: "Button component library",     type: "TASK",  priority: "MEDIUM", status: "TODO",        assigneeId: null, reporterId: "u1", description: "All button variants with stories", createdAt: "2025-03-05", labels: ["components"] },
  { id: "i6",  projectId: "p2", sprintId: "s3", title: "User onboarding screens",      type: "EPIC",  priority: "HIGH",   status: "IN_PROGRESS", assigneeId: "u1", reporterId: "u1", description: "5-step onboarding flow", createdAt: "2025-03-01", labels: ["ux"] },
  { id: "i7",  projectId: "p2", sprintId: "s3", title: "Push notification service",    type: "STORY", priority: "MEDIUM", status: "TODO",        assigneeId: null, reporterId: "u1", description: "FCM integration", createdAt: "2025-03-02", labels: ["backend"] },
  { id: "i8",  projectId: "p3", sprintId: "s4", title: "JWT middleware",               type: "TASK",  priority: "HIGH",   status: "DONE",        assigneeId: "u1", reporterId: "u1", description: "Verify and decode JWTs on every request", createdAt: "2025-02-01", labels: ["auth","backend"] },
  { id: "i9",  projectId: "p3", sprintId: "s4", title: "Rate limiting per API key",    type: "STORY", priority: "HIGH",   status: "DONE",        assigneeId: "u1", reporterId: "u1", description: "Redis-based rate limiting", createdAt: "2025-02-03", labels: ["infra"] },
  { id: "i10", projectId: "p1", sprintId: "s1", title: "Dark mode implementation",     type: "TASK",  priority: "LOW",    status: "IN_PROGRESS", assigneeId: "u1", reporterId: "u1", description: "System preference + manual toggle", createdAt: "2025-03-06", labels: ["frontend"] },
];

export const SEED_MEMBERS = [
  { id: "u1", name: "Alex Rivera",  initials: "AR", role: "Admin",     email: "alex@sprinto.dev",  color: "#818cf8" },
  { id: "u2", name: "Sam Chen",     initials: "SC", role: "Developer", email: "sam@sprinto.dev",   color: "#34d399" },
  { id: "u3", name: "Priya Mehta",  initials: "PM", role: "Designer",  email: "priya@sprinto.dev", color: "#f59e0b" },
  { id: "u4", name: "Jake Torres",  initials: "JT", role: "QA",        email: "jake@sprinto.dev",  color: "#f87171" },
];
