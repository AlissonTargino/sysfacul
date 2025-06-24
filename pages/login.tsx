
import { useState } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/context/AuthContext"
import { apiUsuarios } from "@/lib/api"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) 

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null) 

    try {
      const response = await apiUsuarios.post('/auth/login', {
        email,
        password,
      });
  
      login(response.data.token);

    } catch (err: any) {
    
      const errorMessage = err.response?.data?.error || 'Não foi possível fazer login. Verifique suas credenciais.';
      setError(errorMessage);
      setIsLoading(false);
    }
 
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-2xl font-bold text-slate-900">SysFacul</h1>
          </div>
          <CardTitle className="text-2xl text-center">Bem-vindo de volta</CardTitle>
          <p className="text-sm text-slate-600 text-center">Faça login para acessar o sistema</p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Exibe a mensagem de erro, se houver */}
            {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}