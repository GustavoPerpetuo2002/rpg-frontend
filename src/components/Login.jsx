import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Sword, Shield, Sparkles } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import '../App.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)
    
    if (!result.success) {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen isekai-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Título principal */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold isekai-title mb-2 magic-glow">
            RPG Imersivo
          </h1>
          <p className="text-lg medieval-title">
            Aventuras Mágicas Infinitas
          </p>
          <div className="flex justify-center items-center gap-2 mt-4 text-accent">
            <Sword className="w-5 h-5" />
            <Shield className="w-5 h-5" />
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Card de login */}
        <Card className="magic-card border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Entrar no Reino
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Acesse sua conta para continuar sua jornada épica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-destructive bg-destructive/10">
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Nome de Usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="enchanted-input"
                  placeholder="Digite seu nome de usuário"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="enchanted-input"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full spell-button"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sword className="w-4 h-4" />
                    Entrar na Aventura
                  </div>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Novo aventureiro?{' '}
                <Link 
                  to="/register" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Criar Conta
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <div className="mt-8 text-center">
          <div className="magic-card p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-accent">
              🎲 Características do Jogo
            </h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>NPCs com IA que evoluem independentemente</span>
              </div>
              <div className="flex items-center gap-2">
                <Sword className="w-4 h-4 text-secondary" />
                <span>Sistema completo de criação de personagens</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span>Rolador de dados integrado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

