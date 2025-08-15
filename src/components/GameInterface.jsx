import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowLeft,
  Send,
  Dice6,
  User,
  Users,
  MapPin,
  Heart,
  Zap,
  Coins,
  Package,
  Settings,
  MessageSquare,
  Sparkles,
  Crown
} from 'lucide-react'
import '../App.css'

export default function GameInterface() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)
  
  const [gameSession, setGameSession] = useState(null)
  const [character, setCharacter] = useState(null)
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [npcs, setNpcs] = useState([])

  useEffect(() => {
    loadGameSession()
  }, [sessionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadGameSession = async () => {
    try {
      const response = await fetch(`/api/game/sessions/${sessionId}`, {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setGameSession(data.session)
        setCharacter(data.character)
        setMessages(data.messages || [])
        setNpcs(data.npcs || [])
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Erro ao carregar sessão:', error)
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const sendAction = async () => {
    if (!userInput.trim() || sending) return

    setSending(true)
    const action = userInput.trim()
    setUserInput('')

    // Adicionar ação do jogador às mensagens
    const playerMessage = {
      id: Date.now(),
      type: 'player',
      content: action,
      timestamp: new Date().toLocaleTimeString()
    }
    setMessages(prev => [...prev, playerMessage])

    try {
      const response = await fetch(`/api/game/sessions/${sessionId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Adicionar resposta da IA
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.response,
          timestamp: new Date().toLocaleTimeString()
        }
        setMessages(prev => [...prev, aiMessage])

        // Atualizar estado do jogo se necessário
        if (data.character) setCharacter(data.character)
        if (data.npcs) setNpcs(data.npcs)
      }
    } catch (error) {
      console.error('Erro ao enviar ação:', error)
    } finally {
      setSending(false)
    }
  }

  const rollDice = async (notation) => {
    try {
      const response = await fetch('/api/dice/roll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notation, description: 'Rolagem no jogo' })
      })

      if (response.ok) {
        const result = await response.json()
        const diceMessage = {
          id: Date.now(),
          type: 'dice',
          content: `🎲 ${notation}: ${result.total} (${result.details.map(d => d.value).join(', ')})`,
          timestamp: new Date().toLocaleTimeString()
        }
        setMessages(prev => [...prev, diceMessage])
      }
    } catch (error) {
      console.error('Erro ao rolar dados:', error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendAction()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen isekai-gradient-bg flex items-center justify-center">
        <div className="magic-card p-8 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-center">Carregando aventura...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen isekai-gradient-bg magic-particles">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="spell-button"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Sair
              </Button>
              <div>
                <h1 className="text-xl font-bold isekai-title">{gameSession?.session_name}</h1>
                <p className="text-sm text-muted-foreground">{gameSession?.world_setting}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-primary/30">
                <Crown className="w-3 h-3 mr-1" />
                {character?.name}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Painel do Personagem */}
          <div className="space-y-4">
            <Card className="magic-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {character?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span>Vida</span>
                    <span>{character?.health?.current_hp}/{character?.health?.max_hp}</span>
                  </div>
                  <div className="stat-bar h-2">
                    <div 
                      className="hp-bar h-full rounded"
                      style={{ width: `${(character?.health?.current_hp / character?.health?.max_hp) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span>Mana</span>
                    <span>{character?.health?.current_mp}/{character?.health?.max_mp}</span>
                  </div>
                  <div className="stat-bar h-2">
                    <div 
                      className="mp-bar h-full rounded"
                      style={{ width: `${(character?.health?.current_mp / character?.health?.max_mp) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Coins className="w-3 h-3 text-accent" />
                  <span>{character?.gold} moedas</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="w-3 h-3 text-secondary" />
                  <span className="text-muted-foreground">{character?.current_location}</span>
                </div>
              </CardContent>
            </Card>

            {/* NPCs Presentes */}
            <Card className="magic-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  NPCs Presentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {npcs.length > 0 ? (
                  <div className="space-y-2">
                    {npcs.slice(0, 5).map((npc) => (
                      <div key={npc.id} className="text-xs p-2 rounded bg-card/30">
                        <div className="font-medium">{npc.name}</div>
                        <div className="text-muted-foreground">{npc.occupation}</div>
                        <div className="text-xs text-muted-foreground mt-1">{npc.current_activity}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Ninguém por perto</p>
                )}
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card className="magic-card border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs"
                  onClick={() => rollDice('1d20')}
                >
                  <Dice6 className="w-3 h-3 mr-1" />
                  d20
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs"
                  onClick={() => rollDice('1d6')}
                >
                  <Dice6 className="w-3 h-3 mr-1" />
                  d6
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs"
                  onClick={() => setUserInput('Olhar ao redor')}
                >
                  👁️ Observar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs"
                  onClick={() => setUserInput('Falar com ')}
                >
                  💬 Conversar
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Chat Principal */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="magic-card border-0 flex-1 flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Aventura em Andamento
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Área de Mensagens */}
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Sua aventura está prestes a começar...
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Digite uma ação para iniciar!
                        </p>
                      </div>
                    )}
                    
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'player' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'player' 
                            ? 'bg-primary/20 text-primary' 
                            : message.type === 'dice'
                            ? 'bg-accent/20 text-accent'
                            : 'bg-card/50 text-foreground'
                        }`}>
                          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                          <div className="text-xs opacity-70 mt-1">{message.timestamp}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input de Ação */}
                <div className="mt-4 flex gap-2">
                  <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua ação... (Enter para enviar, Shift+Enter para nova linha)"
                    className="enchanted-input resize-none"
                    rows={2}
                  />
                  <Button 
                    onClick={sendAction}
                    disabled={!userInput.trim() || sending}
                    className="spell-button self-end"
                  >
                    {sending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Sugestões de Ação */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    'Examinar o ambiente',
                    'Procurar por pistas',
                    'Conversar com alguém',
                    'Usar uma habilidade'
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setUserInput(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

