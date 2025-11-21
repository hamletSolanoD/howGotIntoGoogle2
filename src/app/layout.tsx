'use client';

import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import "~/styles/globals.css";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname?.startsWith("/auth");

  useEffect(() => {
    if (status === "unauthenticated" && !isAuthPage) {
      router.push("/auth/signin");
    }
  }, [status, router, isAuthPage]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050710] flex items-center justify-center">
        <div className="text-2xl font-bold text-purple-400 animate-pulse">
          Cargando...
        </div>
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
          <TRPCReactProvider>
            <AuthGuard>{children}</AuthGuard>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}