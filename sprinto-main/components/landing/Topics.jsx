"use client";
import { BookOpen, Server, Package, Globe, Layers, Shield, ChevronRight } from "lucide-react";

const TOPICS = [
  {
    icon: BookOpen,
    week: "Week 1",
    title: "Course Handout & Client-Server Architecture",
    desc: "Deep dive into the CHO, understanding how servers handle HTTP requests, and the fundamentals of client-server communication.",
    tags: ["CHO", "Client-Server", "HTTP"],
    color: "#818cf8",
  },
  {
    icon: Server,
    week: "Week 2",
    title: "Node.js Environment & File System",
    desc: "Installing Node.js, configuring the dev environment, file handling with the fs module, and understanding module dependencies.",
    tags: ["Node.js", "fs module", "Modules"],
    color: "#34d399",
  },
  {
    icon: Package,
    week: "Week 3",
    title: "Node.js Deep Dive & NPM",
    desc: "Advantages and trade-offs of Node.js vs other languages. Handling requests with HTTP module, NPM ecosystem, and importing modules.",
    tags: ["NPM", "HTTP module", "Non-blocking I/O"],
    color: "#f59e0b",
  },
  {
    icon: Globe,
    week: "Week 4",
    title: "Express.js Frameworks & Routing",
    desc: "Introduction to Express.js, serving static files, routing methods, route paths, route parameters, and response methods.",
    tags: ["Express.js", "Routing", "Static Files"],
    color: "#f87171",
  },
  {
    icon: Layers,
    week: "Week 5",
    title: "Middleware & Request Lifecycle",
    desc: "Understanding middleware lifecycle, application-level, router-level, error-handling, and third-party middleware. Body parser deep dive.",
    tags: ["Middleware", "Body Parser", "Request Flow"],
    color: "#a78bfa",
  },
  {
    icon: Shield,
    week: "Week 6",
    title: "Blocking vs Non-Blocking & Exceptions",
    desc: "Synchronous vs asynchronous code, handling static pages with file streams, exception handling, and production-ready patterns.",
    tags: ["Async/Await", "Error Handling", "File Streams"],
    color: "#38bdf8",
  },
];

export default function Topics() {
  return (
    <section id="topics" className="py-24 relative">
      <div className="absolute inset-0 bg-[#080b12]/50" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <BookOpen size={12} />
            Evaluation Topics
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Backend Development{" "}
            <span className="text-gradient-gold">Curriculum</span>
          </h2>
          <p className="text-surface-200 text-lg max-w-2xl mx-auto">
            Core topics for your first evaluation — from Node.js fundamentals to Express.js middleware architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TOPICS.map(({ icon: Icon, week, title, desc, tags, color }, i) => (
            <div
              key={week}
              className="group relative bg-[#080b12] border border-[#1e2433] rounded-2xl p-6 hover:border-[#334155] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
            >
              {/* Accent line */}
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full transition-all duration-300 group-hover:opacity-100 opacity-60"
                style={{ background: color }}
              />

              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: color + "15", border: `1px solid ${color}25` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold" style={{ color }}>{week}</span>
                    <ChevronRight size={12} className="text-surface-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">{title}</h3>
                  <p className="text-xs text-surface-200 leading-relaxed mb-3">{desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-md font-semibold"
                        style={{ background: color + "12", color, border: `1px solid ${color}20` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick reference cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Client-Server Model", body: "Client sends HTTP request → Server processes → Response returned. Node.js handles this with its event loop and non-blocking I/O model." },
            { title: "Express Middleware Chain", body: "req → middleware1() → middleware2() → route handler → res.send(). Each middleware calls next() to pass control forward." },
            { title: "Blocking vs Non-Blocking", body: "Blocking code halts execution until complete. Non-blocking uses callbacks/promises to continue execution while waiting for I/O." },
          ].map(({ title, body }) => (
            <div key={title} className="bg-[#080b12] border border-[#1e2433] rounded-xl p-5">
              <h4 className="text-sm font-bold text-brand-300 mb-2">{title}</h4>
              <p className="text-xs text-surface-200 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
