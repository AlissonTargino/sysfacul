"use client"

import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Layout from "@/components/layout"

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular verificação de autenticação
    const token = localStorage.getItem("auth-token")
    if (token) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && router.pathname !== "/login") {
        router.push("/login")
      } else if (isAuthenticated && router.pathname === "/login") {
        router.push("/dashboard")
      }
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Páginas que não precisam do layout principal
  const publicPages = ["/login"]
  const isPublicPage = publicPages.includes(router.pathname)

  if (isPublicPage) {
    return <Component {...pageProps} />
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
