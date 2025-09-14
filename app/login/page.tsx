"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase-context";
import { handleGoogleRedirectResult } from "@/lib/auth";
import AuthScreen from "@/components/auth-screen";

const FullPageLoader = () => (
  <div className="min-h-screen liquid-gradient flex items-center justify-center text-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p>Connecting...</p>
    </div>
  </div>
);

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    setIsClient(true);
  }, []);

  useEffect(() => {
    // We wrap the redirect handler in the isClient check to ensure it only runs client-side.
    if (isClient) {
      handleGoogleRedirectResult()
        .then((user) => {
          if (user) {
            router.push("/map");
          }
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [router, isClient]);

  useEffect(() => {
    if (user) {
      router.push("/map");
    }
  }, [user, router]);

  // On the server, and during the initial client render, isClient will be false,
  // guaranteeing that both server and client render the same <FullPageLoader />.
  if (!isClient || loading || user) {
    return <FullPageLoader />;
  }

  // The actual page content is only rendered on the client after mounting.
  return (
    <div className="min-h-screen liquid-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthScreen onLogin={() => router.push("/map")} />
        {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
