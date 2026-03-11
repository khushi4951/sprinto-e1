"use client";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Priya Mehta",
    role: "Engineering Lead @ Finflow",
    avatar: "PM",
    color: "#818cf8",
    quote: "We switched from Jira 6 months ago and haven't looked back. Sprinto's UI is just... chef's kiss.",
    stars: 5,
  },
  {
    name: "Jake Torres",
    role: "CTO @ Buildspace",
    avatar: "JT",
    color: "#34d399",
    quote: "Sprint planning used to take 2 hours. With Sprinto, we're done in 20 minutes. The drag-and-drop board is insanely smooth.",
    stars: 5,
  },
  {
    name: "Alex Chen",
    role: "Senior Dev @ NexaCloud",
    avatar: "AC",
    color: "#f59e0b",
    quote: "Finally a project tool that doesn't feel like it was designed in 2008. The dark mode is perfect for late-night sprints.",
    stars: 5,
  },
  {
    name: "Sam Rivera",
    role: "Product Manager @ Arcana",
    avatar: "SR",
    color: "#f87171",
    quote: "Our devs actually enjoy updating their tickets now. That alone is worth 5 stars.",
    stars: 5,
  },
  {
    name: "Mia Kowalski",
    role: "Scrum Master @ Devtide",
    avatar: "MK",
    color: "#a78bfa",
    quote: "The backlog management and sprint velocity charts are everything I needed. Reporting has never been easier.",
    stars: 5,
  },
  {
    name: "Omar Shaikh",
    role: "Full Stack Dev @ Phasion",
    avatar: "OS",
    color: "#38bdf8",
    quote: "Set up in under 10 minutes, GitHub integration worked out of the box. Exceptional experience.",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-400/20 text-brand-300 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <Star size={12} className="fill-brand-400 text-brand-400" />
            Testimonials
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Loved by engineering{" "}
            <span className="text-gradient">teams worldwide</span>
          </h2>
          <p className="text-surface-200 text-lg max-w-xl mx-auto">
            Don't take our word for it — here's what teams are saying.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {TESTIMONIALS.map(({ name, role, avatar, color, quote, stars }) => (
            <div
              key={name}
              className="break-inside-avoid bg-[#080b12] border border-[#1e2433] rounded-2xl p-6 hover:border-[#334155] transition-all duration-300"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-surface-100 leading-relaxed mb-4">"{quote}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}
                >
                  {avatar}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{name}</div>
                  <div className="text-xs text-surface-300">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
