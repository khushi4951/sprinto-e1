"use client";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-brand-900/30 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#080b12] border border-[#1e2433] rounded-3xl p-12 sm:p-16 relative overflow-hidden">
          {/* Decorative dots */}
          <div className="absolute top-4 right-4 w-24 h-24 opacity-20"
            style={{ background: "radial-gradient(circle, #818cf8 1px, transparent 1px)", backgroundSize: "8px 8px" }} />
          <div className="absolute bottom-4 left-4 w-24 h-24 opacity-20"
            style={{ background: "radial-gradient(circle, #818cf8 1px, transparent 1px)", backgroundSize: "8px 8px" }} />

          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-400/20 text-brand-300 px-3 py-1 rounded-full text-xs font-semibold mb-6">
            <Zap size={12} className="text-brand-400" />
            Free forever for small teams
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Ready to ship{" "}
            <span className="text-gradient">faster?</span>
          </h2>
          <p className="text-surface-200 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of engineering teams who've ditched clunky tools for Sprinto.
            No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-brand-500 to-violet-500 text-white font-semibold px-8 py-4 rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-200 glow-brand text-base"
            >
              Get started — it's free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200 text-base"
            >
              Already have an account?
            </Link>
          </div>

          <p className="text-xs text-surface-300 mt-6">
            No credit card · Unlimited projects · Free forever for teams up to 5
          </p>
        </div>
      </div>
    </section>
  );
}
