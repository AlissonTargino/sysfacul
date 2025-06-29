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
    // Se a verificação de autenticação ainda está em andamento, não faz nada.
    if (isLoading) {
      return;
    }

    // CASO 1: Usuário está autenticado
    if (isAuthenticated) {
      // Se ele está na página raiz ("/"), redireciona para o dashboard.
      if (router.pathname === "/") {
        router.push("/dashboard");
      }
    } 
    // CASO 2: Usuário NÃO está autenticado
    else {
      // Se ele não estiver na página de login, redireciona para lá.
      if (router.pathname !== "/login") {
        router.push("/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);


  // Mostra um spinner enquanto carrega ou enquanto redireciona da página raiz.
  // Isso evita que a "tela quebrada" apareça rapidamente antes do redirecionamento.
  if (isLoading || (isAuthenticated && router.pathname === "/")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }
  
  // Se a rota for a de login, renderiza o componente sem o Layout principal.
  if (router.pathname === "/login") {
    return <Component {...pageProps} />;
  }

  // Se estiver autenticado, renderiza a página solicitada dentro do Layout.
  // O `null` é retornado brevemente enquanto o `useEffect` redireciona o usuário não autenticado.
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