"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, X, Zap } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = ["Features", "Topics", "Testimonials"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080b12]/90 backdrop-blur-xl border-b border-white/5 shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center glow-sm group-hover:glow-brand transition-all duration-300">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <span className="text-lg font-display font-bold text-gradient">Sprinto</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="text-sm font-medium text-surface-200 hover:text-white transition-colors duration-200"
              >
                {l}
              </a>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-surface-100 hover:text-white transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-semibold bg-gradient-to-r from-brand-500 to-violet-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 glow-sm"
              >
                Get started free
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="text-sm font-semibold bg-gradient-to-r from-brand-500 to-violet-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-surface-200 hover:text-white p-2"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#080b12]/95 backdrop-blur-xl border-t border-white/5 px-4 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-surface-200 hover:text-white py-2"
            >
              {l}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <SignedOut>
              <Link href="/sign-in" className="text-sm font-semibold text-center text-surface-100 py-2 border border-white/10 rounded-lg">
                Sign in
              </Link>
              <Link href="/sign-up" className="text-sm font-semibold text-center bg-gradient-to-r from-brand-500 to-violet-500 text-white py-2 rounded-lg">
                Get started free
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-sm font-semibold text-center bg-gradient-to-r from-brand-500 to-violet-500 text-white py-2 rounded-lg">
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
}
