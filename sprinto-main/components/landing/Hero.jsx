"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Play, Sparkles, GitBranch, Zap, Shield } from "lucide-react";

const FLOATING_CARDS = [
  { title: "Auth flow on Safari", tag: "🐛 Bug", priority: "Urgent", color: "#f87171", x: "-left-4 md:-left-8", y: "top-20", delay: "0s" },
  { title: "Design token system", tag: "⚡ Epic", priority: "High", color: "#f59e0b", x: "-right-4 md:-right-8", y: "top-12", delay: "1s" },
  { title: "Push notifications", tag: "📖 Story", priority: "Medium", color: "#facc15", x: "-right-4 md:-right-8", y: "bottom-20", delay: "2s" },
];

function FloatingCard({ title, tag, priority, color, x, y, delay }) {
  return (
    <div
      className={`absolute ${x} ${y} hidden lg:block`}
      style={{ animation: `float 6s ease-in-out infinite`, animationDelay: delay }}
    >
      <div className="bg-[#0a0d14] border border-[#1e2433] rounded-xl p-3 w-52 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-surface-200">{tag}</span>
        </div>
        <p className="text-xs text-white font-medium mb-2">{title}</p>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ color, background: color + "20", border: `1px solid ${color}33` }}
        >
          {priority}
        </span>
      </div>
    </div>
  );
}

function MockBoard() {
  const cols = [
    { label: "To Do",       color: "#64748b", issues: ["Auth redesign", "Token refresh"] },
    { label: "In Progress", color: "#818cf8", issues: ["Nav component", "Dark mode"] },
    { label: "In Review",   color: "#f59e0b", issues: ["Analytics widget"] },
    { label: "Done",        color: "#34d399", issues: ["Design tokens", "DB schema"] },
  ];
  return (
    <div className="flex gap-3 overflow-hidden h-52">
      {cols.map((col) => (
        <div key={col.label} className="flex-1 min-w-0 bg-[#080b12] border border-[#111827] rounded-xl p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ background: col.color, boxShadow: `0 0 6px ${col.color}` }} />
            <span className="text-xs font-bold" style={{ color: col.color }}>{col.label}</span>
          </div>
          <div className="space-y-2">
            {col.issues.map((iss) => (
              <div key={iss} className="bg-[#0a0d14] border border-[#1a2035] rounded-lg p-2">
                <p className="text-xs text-surface-100 font-medium truncate">{iss}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const [typed, setTyped] = useState("");
  const words = ["Faster", "Smarter", "Beautiful"];
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    let i = 0;
    const word = words[wordIdx];
    const interval = setInterval(() => {
      setTyped(word.slice(0, i + 1));
      i++;
      if (i === word.length) {
        clearInterval(interval);
        setTimeout(() => {
          setWordIdx((w) => (w + 1) % words.length);
          setTyped("");
        }, 1800);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [wordIdx]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      <div className="absolute inset-0 bg-gradient-radial from-brand-900/30 via-transparent to-transparent" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-violet-600/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-400/20 text-brand-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 animate-fade-up">
          <Sparkles size={14} className="text-brand-400" />
          The modern Jira alternative
          <ArrowRight size={14} />
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 animate-fade-up delay-100">
          Ship Projects{" "}
          <br className="hidden sm:block" />
          <span className="text-gradient relative">
            {typed}
            <span className="animate-pulse">|</span>
          </span>
        </h1>

        {/* Sub */}
        <p className="text-lg sm:text-xl text-surface-200 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-200">
          Sprinto brings sprint planning, kanban boards, and backlog management
          into one beautifully crafted workspace. Built for engineering teams who
          care about speed and aesthetics.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-up delay-300">
          <Link
            href="/sign-up"
            className="group flex items-center gap-2 bg-gradient-to-r from-brand-500 to-violet-500 text-white font-semibold px-8 py-4 rounded-xl glow-brand hover:opacity-90 hover:scale-105 transition-all duration-200 text-base"
          >
            Start for free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#features"
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200 text-base backdrop-blur-sm"
          >
            <Play size={16} className="text-brand-400" />
            See how it works
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-16 animate-fade-up delay-400">
          {[
            { val: "10k+", label: "Active teams" },
            { val: "2M+", label: "Issues tracked" },
            { val: "99.9%", label: "Uptime SLA" },
            { val: "< 200ms", label: "Avg response" },
          ].map(({ val, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-display font-bold text-gradient">{val}</div>
              <div className="text-xs text-surface-300 font-medium mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Mock Board */}
        <div className="relative max-w-4xl mx-auto animate-fade-up delay-500">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 to-violet-500/20 rounded-2xl blur-xl" />
          <div className="relative bg-[#080b12] border border-[#1e2433] rounded-2xl p-4 shadow-2xl">
            {/* Fake window bar */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#111827]">
              <div className="w-3 h-3 rounded-full bg-[#f87171]" />
              <div className="w-3 h-3 rounded-full bg-[#facc15]" />
              <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
              <div className="ml-4 flex-1 bg-[#0a0d14] rounded-md h-5 max-w-xs" />
              <div className="ml-auto flex items-center gap-2">
                <Zap size={12} className="text-brand-400" />
                <span className="text-xs text-surface-300 font-semibold">Sprinto</span>
              </div>
            </div>
            <MockBoard />
          </div>
          {FLOATING_CARDS.map((card, i) => (
            <FloatingCard key={i} {...card} />
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 animate-fade-up delay-500">
          {[
            { icon: Shield, text: "SOC 2 Compliant" },
            { icon: GitBranch, text: "GitHub Integration" },
            { icon: Zap, text: "Real-time Sync" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-surface-300 text-sm">
              <Icon size={14} className="text-brand-400" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
