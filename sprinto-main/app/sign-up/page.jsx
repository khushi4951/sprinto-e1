import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#060810] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center glow-sm">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className="text-xl font-display font-bold text-gradient">Sprinto</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Create your workspace</h1>
          <p className="text-surface-300 text-sm">Free forever for teams up to 5 members</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-[#080b12] border border-[#1e2433] shadow-2xl rounded-2xl",
              headerTitle: "text-white font-bold",
              headerSubtitle: "text-surface-300",
              formButtonPrimary: "bg-gradient-to-r from-brand-500 to-violet-500 hover:opacity-90 transition-opacity",
              formFieldInput: "bg-[#0a0d14] border-[#1e2433] text-white focus:border-brand-500/50 rounded-lg",
              formFieldLabel: "text-surface-200 text-sm",
              footerActionLink: "text-brand-400 hover:text-brand-300",
              dividerLine: "bg-[#1e2433]",
              dividerText: "text-surface-400 text-xs",
              socialButtonsBlockButton: "border-[#1e2433] bg-[#0a0d14] text-white hover:bg-[#111827] transition-colors",
              socialButtonsBlockButtonText: "text-white",
              alertText: "text-red-400",
            },
          }}
        />
      </div>
    </div>
  );
}
