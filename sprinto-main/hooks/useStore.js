import { create } from "zustand";
import {
  SEED_PROJECTS, SEED_SPRINTS, SEED_ISSUES, SEED_MEMBERS
} from "@/data/seed";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export const useStore = create((set, get) => ({
  projects: SEED_PROJECTS,
  sprints:  SEED_SPRINTS,
  issues:   SEED_ISSUES,
  members:  SEED_MEMBERS,
  currentUser: SEED_MEMBERS[0],

  // Projects
  addProject: (project) =>
    set((s) => ({ projects: [...s.projects, { id: "p" + uid(), ...project }] })),

  // Issues
  addIssue: (issue) =>
    set((s) => ({ issues: [...s.issues, { id: "i" + uid(), createdAt: new Date().toISOString(), labels: [], ...issue }] })),

  updateIssue: (id, updates) =>
    set((s) => ({ issues: s.issues.map((i) => (i.id === id ? { ...i, ...updates } : i)) })),

  deleteIssue: (id) =>
    set((s) => ({ issues: s.issues.filter((i) => i.id !== id) })),

  moveIssue: (id, status) =>
    set((s) => ({ issues: s.issues.map((i) => (i.id === id ? { ...i, status } : i)) })),

  // Sprints
  addSprint: (sprint) =>
    set((s) => ({ sprints: [...s.sprints, { id: "s" + uid(), ...sprint }] })),

  updateSprint: (id, updates) =>
    set((s) => ({ sprints: s.sprints.map((sp) => (sp.id === id ? { ...sp, ...updates } : sp)) })),
}));
