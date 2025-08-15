import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  User, 
  Sword, 
  Shield, 
  Heart, 
  Zap, 
  Coins, 
  Package, 
  Users, 
  MapPin,
  Star,
  Trash2,
  ShoppingCart,
  Plus
} from 'lucide-react'
import '../App.css'

export default function CharacterSheet({ characterId, onClose }) {
  const [character, setCharacter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('stats')
  const [shopItems, setShopItems] = useState([])
  const [shopLoading, setShopLoading] = useState(false)

  useEffect(() => {
    if (characterId) {
      loadCharacter()
    }
  }, [characterId])

  const loadCharacter = async () => {
    try {
      const response = await fetch(`/api/characters/${characterId}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setCharacter(data.character)
      }
    } catch (error) {
      console.error('Erro ao carregar personagem:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateShop = async (shopType = 'general') => {
    setShopLoading(true)
    try {
      const response = await fetch('/api/shop/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          character_id: characterId,
          shop_type: shopType
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setShopItems(data.shop.items)
      }
    } catch (error) {
      console.error('Erro ao gerar loja:', error)
    } finally {
      setShopLoading(false)
    }
  }

  const buyItem = async (item) => {
    try {
      const response = await fetch('/api/shop/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          character_id: characterId,
          item: item,
          quantity: 1
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setCharacter(data.character)
        alert(data.message)
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error('Erro ao comprar item:', error)
    }
  }

  const sellItem = async (item) => {
    try {
      const response = await fetch('/api/shop/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          character_id: characterId,
          item_id: item.id,
          quantity: 1
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setCharacter(data.character)
        alert(data.message)
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error('Erro ao vender item:', error)
    }
  }

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'bg-gray-500',
      uncommon: 'bg-green-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-orange-500'
    }
    return colors[rarity] || colors.common
  }

  const getRelationshipColor = (relationship) => {
    const colors = {
      friendly: 'text-green-400',
      neutral: 'text-yellow-400',
      hostile: 'text-red-400'
    }
    return colors[relationship] || colors.neutral
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="magic-card p-8 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-center">Carregando ficha...</p>
        </div>
      </div>
    )
  }

  if (!character) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="magic-card w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-lg">
        {/* Header */}
        <div className="p-6 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold isekai-title">{character.name}</h2>
              <p className="text-muted-foreground">
                Nível {character.level} {character.race} {character.character_class}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-accent">
                <Coins className="w-5 h-5" />
                <span className="font-bold">{character.gold}</span>
              </div>
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="stats">Atributos</TabsTrigger>
              <TabsTrigger value="inventory">Inventário</TabsTrigger>
              <TabsTrigger value="npcs">Personagens</TabsTrigger>
              <TabsTrigger value="shop">Loja</TabsTrigger>
              <TabsTrigger value="notes">Notas</TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Aba de Atributos */}
            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Atributos Principais */}
                <Card className="magic-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Atributos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(character.attributes).map(([attr, value]) => (
                      <div key={attr} className="flex justify-between items-center">
                        <span className="capitalize">{attr}:</span>
                        <Badge variant="outline">{value}</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Status de Vida */}
                <Card className="magic-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Pontos de Vida</span>
                        <span>{character.health.current_hp}/{character.health.max_hp}</span>
                      </div>
                      <div className="stat-bar h-3">
                        <div 
                          className="hp-bar h-full rounded transition-all"
                          style={{ width: `${(character.health.current_hp / character.health.max_hp) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Pontos de Mana</span>
                        <span>{character.health.current_mp}/{character.health.max_mp}</span>
                      </div>
                      <div className="stat-bar h-3">
                        <div 
                          className="mp-bar h-full rounded transition-all"
                          style={{ width: `${(character.health.current_mp / character.health.max_mp) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">Localização:</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{character.current_location}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Vantagens e Desvantagens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="magic-card border-0">
                  <CardHeader>
                    <CardTitle className="text-green-400">Vantagens</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {character.advantages.length > 0 ? (
                      <div className="space-y-2">
                        {character.advantages.map((advantage, index) => (
                          <Badge key={index} className="bg-green-500/20 text-green-400">
                            {advantage}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Nenhuma vantagem</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="magic-card border-0">
                  <CardHeader>
                    <CardTitle className="text-red-400">Desvantagens</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {character.disadvantages.length > 0 ? (
                      <div className="space-y-2">
                        {character.disadvantages.map((disadvantage, index) => (
                          <Badge key={index} className="bg-red-500/20 text-red-400">
                            {disadvantage}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">Nenhuma desvantagem</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Aba de Inventário */}
            <TabsContent value="inventory" className="space-y-6">
              <Card className="magic-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Bolsa do Aventureiro
                  </CardTitle>
                  <CardDescription>
                    Seus itens e equipamentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {character.inventory.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {character.inventory.map((item) => (
                        <div key={item.id} className="p-4 rounded border border-border/30 bg-card/30">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge className={`${getRarityColor(item.rarity)} text-white text-xs`}>
                              {item.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span>Qtd: {item.quantity}</span>
                              {item.value && (
                                <span className="ml-2 text-accent">{item.value}g</span>
                              )}
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => sellItem(item)}
                              className="text-xs"
                            >
                              Vender
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Inventário vazio</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba de NPCs Conhecidos */}
            <TabsContent value="npcs" className="space-y-6">
              <Card className="magic-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Personagens Conhecidos
                  </CardTitle>
                  <CardDescription>
                    NPCs que você encontrou em suas aventuras
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {character.known_npcs.length > 0 ? (
                    <div className="space-y-4">
                      {character.known_npcs.map((npc) => (
                        <div key={npc.id} className="p-4 rounded border border-border/30 bg-card/30">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{npc.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {npc.race} {npc.occupation}
                              </p>
                            </div>
                            <Badge className={getRelationshipColor(npc.relationship)}>
                              {npc.relationship}
                            </Badge>
                          </div>
                          <div className="text-sm space-y-1">
                            <p><span className="text-muted-foreground">Encontrado em:</span> {npc.location_met}</p>
                            {npc.notes && (
                              <p><span className="text-muted-foreground">Notas:</span> {npc.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Nenhum personagem conhecido ainda</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba da Loja */}
            <TabsContent value="shop" className="space-y-6">
              <Card className="magic-card border-0">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Loja Local - {character.current_location}
                      </CardTitle>
                      <CardDescription>
                        Itens gerados pela IA baseados na sua localização
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => generateShop('general')} 
                        disabled={shopLoading}
                        className="spell-button"
                      >
                        {shopLoading ? 'Gerando...' : 'Gerar Loja'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {shopItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {shopItems.map((item, index) => (
                        <div key={index} className="p-4 rounded border border-border/30 bg-card/30">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge className={`${getRarityColor(item.rarity)} text-white text-xs`}>
                              {item.rarity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-accent font-medium">
                              {item.price}g
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => buyItem(item)}
                              disabled={character.gold < item.price}
                              className="spell-button text-xs"
                            >
                              Comprar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">Nenhuma loja gerada ainda</p>
                      <Button onClick={() => generateShop('general')} className="spell-button">
                        Gerar Primeira Loja
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba de Notas */}
            <TabsContent value="notes" className="space-y-6">
              <Card className="magic-card border-0">
                <CardHeader>
                  <CardTitle>Biografia e Notas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Biografia:</label>
                    <Textarea 
                      value={character.background} 
                      readOnly
                      className="enchanted-input min-h-[100px]"
                      placeholder="História do personagem..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Notas:</label>
                    <Textarea 
                      value={character.notes} 
                      readOnly
                      className="enchanted-input min-h-[100px]"
                      placeholder="Anotações pessoais..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

