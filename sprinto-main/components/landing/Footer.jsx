import Link from "next/link";
import { Zap, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const links = {
    Product: ["Features", "Pricing", "Changelog", "Roadmap"],
    Company: ["About", "Blog", "Careers", "Press"],
    Resources: ["Docs", "API Reference", "Community", "Status"],
    Legal: ["Privacy", "Terms", "Security", "Cookies"],
  };

  return (
    <footer className="border-t border-[#111827] bg-[#080b12] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center">
                <Zap size={14} className="text-white fill-white" />
              </div>
              <span className="text-base font-display font-bold text-gradient">Sprinto</span>
            </Link>
            <p className="text-xs text-surface-300 leading-relaxed mb-4 max-w-xs">
              Project management for teams that move fast. Beautiful, powerful, and open.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <div key={i} className="w-8 h-8 rounded-lg bg-[#0a0d14] border border-[#1e2433] flex items-center justify-center text-surface-300 hover:text-white hover:border-[#334155] transition-all cursor-pointer">
                  <Icon size={14} />
                </div>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-xs text-surface-300 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#111827] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-surface-400">© 2025 Sprinto. All rights reserved.</p>
          <p className="text-xs text-surface-400">Made with ❤️ for engineering teams</p>
        </div>
      </div>
    </footer>
  );
}
