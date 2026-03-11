import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-[#05060a] via-[#070a14] to-[#0a0f1f]">

      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />

      {/* Glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-violet-500/10 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-3 mb-6 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition">
              <Zap size={18} className="text-white fill-white" />
            </div>

            <span className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-violet-400">
              Sprinto
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back
          </h1>

          <p className="text-surface-400 text-sm">
            Sign in to continue to your workspace
          </p>
        </div>

        {/* Clerk Sign In */}
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",

              card:
                "backdrop-blur-xl bg-[#0a0d14]/80 border border-[#1e2433] shadow-2xl rounded-2xl p-6",

              headerTitle:
                "text-white font-bold text-lg",

              headerSubtitle:
                "text-surface-400 text-sm",

              formButtonPrimary:
                "bg-gradient-to-r from-brand-500 to-violet-500 hover:opacity-90 transition-all shadow-lg shadow-brand-500/25",

              formFieldInput:
                "bg-[#0a0d14] border-[#1e2433] text-white focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 rounded-lg",

              formFieldLabel:
                "text-surface-200 text-sm",

              footerActionLink:
                "text-brand-400 hover:text-brand-300",

              dividerLine:
                "bg-[#1e2433]",

              dividerText:
                "text-surface-500 text-xs",

              socialButtonsBlockButton:
                "border-[#1e2433] bg-[#0a0d14] text-white hover:bg-[#111827] transition rounded-lg",

              socialButtonsBlockButtonText:
                "text-white",

              identityPreviewText:
                "text-surface-200",

              formResendCodeLink:
                "text-brand-400",

              alertText:
                "text-red-400",
            },
          }}
        />
      </div>
    </div>
  );
}