import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Sword, 
  Shield, 
  Sparkles, 
  Plus, 
  Play, 
  Dice6, 
  User, 
  LogOut,
  Crown,
  Scroll,
  Wand2
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import CharacterSheet from './CharacterSheet'
import '../App.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [characters, setCharacters] = useState([])
  const [gameSessions, setGameSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCharacterId, setSelectedCharacterId] = useState(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      // Carregar personagens
      const charactersResponse = await fetch('/api/characters/', {
        credentials: 'include'
      })
      if (charactersResponse.ok) {
        const charactersData = await charactersResponse.json()
        setCharacters(charactersData.characters)
      }

      // Carregar sessões de jogo
      const sessionsResponse = await fetch('/api/game/sessions', {
        credentials: 'include'
      })
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json()
        setGameSessions(sessionsData.sessions)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const getRaceIcon = (race) => {
    const icons = {
      human: '👤',
      elf: '🧝',
      dwarf: '🧔',
      halfling: '🧙',
      orc: '👹'
    }
    return icons[race] || '⚔️'
  }

  const getClassIcon = (characterClass) => {
    const icons = {
      warrior: '⚔️',
      mage: '🔮',
      rogue: '🗡️',
      cleric: '✨',
      ranger: '🏹'
    }
    return icons[characterClass] || '⚔️'
  }

  if (loading) {
    return (
      <div className="min-h-screen isekai-gradient-bg flex items-center justify-center">
        <div className="magic-card p-8 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-center">Carregando seu reino...</p>
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
              <h1 className="text-2xl font-bold isekai-title">
                RPG Imersivo
              </h1>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                <Crown className="w-3 h-3 mr-1" />
                {user?.username}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Link to="/dice">
                <Button variant="outline" size="sm" className="spell-button">
                  <Dice6 className="w-4 h-4 mr-2" />
                  Dados
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Boas-vindas */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold medieval-title mb-2">
            Bem-vindo de volta, {user?.username}!
          </h2>
          <p className="text-muted-foreground">
            Sua jornada épica continua. Escolha sua próxima aventura.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personagens */}
          <div className="lg:col-span-2">
            <Card className="magic-card border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Sword className="w-5 h-5" />
                      Seus Heróis
                    </CardTitle>
                    <CardDescription>
                      Gerencie seus personagens e suas aventuras
                    </CardDescription>
                  </div>
                  <Link to="/character/create">
                    <Button className="spell-button">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Herói
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {characters.length === 0 ? (
                  <div className="text-center py-8">
                    <Wand2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Você ainda não criou nenhum personagem
                    </p>
                    <Link to="/character/create">
                      <Button className="spell-button">
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeiro Personagem
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {characters.map((character) => (
                      <Card key={character.id} className="bg-card/50 border-border/30">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg flex items-center gap-2">
                                <span className="text-xl">
                                  {getRaceIcon(character.race)}
                                </span>
                                {character.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Nível {character.level} {character.race} {character.character_class}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {getClassIcon(character.character_class)} {character.character_class}
                            </Badge>
                          </div>
                          
                          {/* Barras de status */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="w-8">HP:</span>
                              <div className="flex-1 stat-bar h-2">
                                <div 
                                  className="hp-bar h-full rounded transition-all"
                                  style={{ 
                                    width: `${(character.health?.current_hp / character.health?.max_hp) * 100}%` 
                                  }}
                                />
                              </div>
                              <span className="text-muted-foreground">
                                {character.health?.current_hp}/{character.health?.max_hp}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-xs">
                              <span className="w-8">MP:</span>
                              <div className="flex-1 stat-bar h-2">
                                <div 
                                  className="mp-bar h-full rounded transition-all"
                                  style={{ 
                                    width: `${(character.health?.current_mp / character.health?.max_mp) * 100}%` 
                                  }}
                                />
                              </div>
                              <span className="text-muted-foreground">
                                {character.health?.current_mp}/{character.health?.max_mp}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => setSelectedCharacterId(character.id)}
                            >
                              <User className="w-3 h-3 mr-1" />
                              Ver
                            </Button>
                            <Button size="sm" className="flex-1 spell-button">
                              <Play className="w-3 h-3 mr-1" />
                              Jogar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sessões de Jogo e Ações Rápidas */}
          <div className="space-y-6">
            {/* Sessões Recentes */}
            <Card className="magic-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-secondary">
                  <Scroll className="w-5 h-5" />
                  Aventuras Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gameSessions.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      Nenhuma aventura iniciada
                    </p>
                    <Button size="sm" className="spell-button" disabled={characters.length === 0}>
                      <Plus className="w-3 h-3 mr-1" />
                      Nova Aventura
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {gameSessions.slice(0, 3).map((session) => (
                      <div key={session.id} className="p-3 rounded bg-card/30 border border-border/30">
                        <h4 className="font-medium text-sm">{session.session_name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {session.world_setting} • {session.difficulty_level}
                        </p>
                        <Button size="sm" className="w-full spell-button">
                          <Play className="w-3 h-3 mr-1" />
                          Continuar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card className="magic-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent">
                  <Sparkles className="w-5 h-5" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/character/create" className="block">
                  <Button className="w-full spell-button" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Personagem
                  </Button>
                </Link>
                
                <Link to="/dice" className="block">
                  <Button className="w-full spell-button" variant="outline">
                    <Dice6 className="w-4 h-4 mr-2" />
                    Rolador de Dados
                  </Button>
                </Link>
                
                <Button 
                  className="w-full spell-button" 
                  variant="outline"
                  disabled={characters.length === 0}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Nova Aventura
                </Button>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card className="magic-card border-0">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Suas Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Personagens:</span>
                  <Badge variant="outline">{characters.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Aventuras:</span>
                  <Badge variant="outline">{gameSessions.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Nível Médio:</span>
                  <Badge variant="outline">
                    {characters.length > 0 
                      ? Math.round(characters.reduce((sum, char) => sum + char.level, 0) / characters.length)
                      : 0
                    }
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal da Ficha de Personagem */}
      {selectedCharacterId && (
        <CharacterSheet 
          characterId={selectedCharacterId}
          onClose={() => setSelectedCharacterId(null)}
        />
      )}
    </div>
  )
}

