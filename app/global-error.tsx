"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0B101B] text-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            !
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-50 mb-2">
            Something went wrong
          </h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Our team has been notified. Please try refreshing or reloading the page.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => reset()}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium px-5 h-10 shadow-sm"
            >
              Try again
            </Button>
            <Button
              onClick={() => (window.location.href = "/map")}
              variant="outline"
              className="border-white/10 text-slate-400 hover:bg-slate-800/50 rounded-xl text-sm font-medium px-5 h-10"
            >
              Return to Map
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
