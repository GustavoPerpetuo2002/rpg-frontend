import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Sword, Shield, Sparkles, Mail, User, Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import '../App.css'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)

    const result = await register(formData.username, formData.email, formData.password)
    
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
            Crie Sua Lenda
          </p>
          <div className="flex justify-center items-center gap-2 mt-4 text-accent">
            <Sword className="w-5 h-5" />
            <Shield className="w-5 h-5" />
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Card de registro */}
        <Card className="magic-card border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Juntar-se à Aventura
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Crie sua conta e comece sua jornada épica
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
                <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome de Usuário
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="enchanted-input"
                  placeholder="Escolha seu nome de aventureiro"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="enchanted-input"
                  placeholder="Digite seu email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="enchanted-input"
                  placeholder="Crie uma senha segura"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirmar Senha
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="enchanted-input"
                  placeholder="Confirme sua senha"
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
                    Criando Conta...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Começar Aventura
                  </div>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Fazer Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Informações sobre o jogo */}
        <div className="mt-8">
          <div className="magic-card p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-accent text-center">
              ⚔️ O que te espera
            </h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-start gap-3 p-2 rounded bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-primary">NPCs Inteligentes</div>
                  <div className="text-muted-foreground">Personagens com vontades próprias que evoluem independentemente</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-2 rounded bg-secondary/10">
                <Sword className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-secondary">Criação Completa</div>
                  <div className="text-muted-foreground">Sistema detalhado de raças, classes, vantagens e desvantagens</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-2 rounded bg-accent/10">
                <Shield className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-accent">Progressão Salva</div>
                  <div className="text-muted-foreground">Nunca perca seu progresso com sistema de save automático</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

