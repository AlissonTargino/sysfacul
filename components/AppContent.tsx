// components/AppContent.tsx
'use client'
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";

export function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && router.pathname !== "/login") {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (router.pathname === "/login") {
    return <Component {...pageProps} />;
  }

  return isAuthenticated ? (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  ) : null;
}