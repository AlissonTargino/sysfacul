import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout";

function AppContent({ Component, pageProps }: AppProps) {
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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}