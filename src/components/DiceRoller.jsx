import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Dice1, 
  Dice2, 
  Dice3, 
  Dice4, 
  Dice5, 
  Dice6, 
  ArrowLeft,
  RotateCcw,
  Plus,
  History,
  Sparkles
} from 'lucide-react'
import '../App.css'

export default function DiceRoller() {
  const navigate = useNavigate()
  const [presets, setPresets] = useState({})
  const [customRoll, setCustomRoll] = useState({ dice: 1, sides: 20, modifier: 0 })
  const [rollHistory, setRollHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  useEffect(() => {
    loadPresets()
  }, [])

  const loadPresets = async () => {
    try {
      const response = await fetch('/api/dice/presets', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setPresets(data.presets)
      }
    } catch (error) {
      console.error('Erro ao carregar presets:', error)
    }
  }

  const rollDice = async (notation, description = '') => {
    setLoading(true)
    try {
      const response = await fetch('/api/dice/roll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notation, description })
      })

      if (response.ok) {
        const result = await response.json()
        setLastResult(result)
        
        // Adicionar ao histórico
        const historyEntry = {
          id: Date.now(),
          notation,
          description,
          result: result.total,
          details: result.details,
          timestamp: new Date().toLocaleTimeString()
        }
        setRollHistory(prev => [historyEntry, ...prev.slice(0, 9)]) // Manter apenas 10 últimos
      }
    } catch (error) {
      console.error('Erro ao rolar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const rollCustom = () => {
    const notation = `${customRoll.dice}d${customRoll.sides}${customRoll.modifier !== 0 ? (customRoll.modifier > 0 ? `+${customRoll.modifier}` : customRoll.modifier) : ''}`
    rollDice(notation, 'Rolagem Personalizada')
  }

  const getDiceIcon = (value) => {
    const icons = {
      1: Dice1,
      2: Dice2,
      3: Dice3,
      4: Dice4,
      5: Dice5,
      6: Dice6
    }
    const Icon = icons[value] || Dice6
    return <Icon className="w-6 h-6" />
  }

  const getResultColor = (result, max) => {
    const percentage = result / max
    if (percentage >= 0.9) return 'text-yellow-400' // Crítico
    if (percentage >= 0.7) return 'text-green-400'  // Bom
    if (percentage >= 0.3) return 'text-blue-400'   // Normal
    return 'text-red-400' // Ruim
  }

  return (
    <div className="min-h-screen isekai-gradient-bg magic-particles p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="spell-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold isekai-title magic-glow">Rolador de Dados Mágico</h1>
            <p className="text-muted-foreground">Que a sorte dos deuses esteja com você</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resultado Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Último Resultado */}
            {lastResult && (
              <Card className="magic-card border-0 magic-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Último Resultado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`text-6xl font-bold mb-4 ${getResultColor(lastResult.total, lastResult.max_possible)}`}>
                      {lastResult.total}
                    </div>
                    <div className="text-lg text-muted-foreground mb-4">
                      {lastResult.notation}
                      {lastResult.description && ` - ${lastResult.description}`}
                    </div>
                    
                    {/* Detalhes dos dados */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {lastResult.details.map((detail, index) => (
                        <div key={index} className="flex items-center gap-1 p-2 rounded bg-card/30">
                          {getDiceIcon(detail.value)}
                          <span className={getResultColor(detail.value, detail.sides)}>
                            {detail.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Rolagem: {lastResult.details.map(d => d.value).join(' + ')}
                      {lastResult.modifier !== 0 && ` ${lastResult.modifier > 0 ? '+' : ''}${lastResult.modifier}`}
                      {' = '}{lastResult.total}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rolagem Personalizada */}
            <Card className="magic-card border-0">
              <CardHeader>
                <CardTitle>Rolagem Personalizada</CardTitle>
                <CardDescription>
                  Configure sua própria rolagem de dados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="dice">Quantidade</Label>
                    <Input
                      id="dice"
                      type="number"
                      min="1"
                      max="20"
                      value={customRoll.dice}
                      onChange={(e) => setCustomRoll(prev => ({ ...prev, dice: parseInt(e.target.value) || 1 }))}
                      className="enchanted-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sides">Lados</Label>
                    <Select 
                      value={customRoll.sides.toString()} 
                      onValueChange={(value) => setCustomRoll(prev => ({ ...prev, sides: parseInt(value) }))}
                    >
                      <SelectTrigger className="enchanted-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">d4</SelectItem>
                        <SelectItem value="6">d6</SelectItem>
                        <SelectItem value="8">d8</SelectItem>
                        <SelectItem value="10">d10</SelectItem>
                        <SelectItem value="12">d12</SelectItem>
                        <SelectItem value="20">d20</SelectItem>
                        <SelectItem value="100">d100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="modifier">Modificador</Label>
                    <Input
                      id="modifier"
                      type="number"
                      min="-20"
                      max="20"
                      value={customRoll.modifier}
                      onChange={(e) => setCustomRoll(prev => ({ ...prev, modifier: parseInt(e.target.value) || 0 }))}
                      className="enchanted-input"
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-medium mb-4">
                    {customRoll.dice}d{customRoll.sides}
                    {customRoll.modifier !== 0 && (customRoll.modifier > 0 ? `+${customRoll.modifier}` : customRoll.modifier)}
                  </div>
                  <Button 
                    onClick={rollCustom} 
                    disabled={loading}
                    className="spell-button"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Dice6 className="w-4 h-4 mr-2" />
                    )}
                    Rolar Dados
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Presets de Dados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(presets).map(([category, categoryPresets]) => (
                <Card key={category} className="magic-card border-0">
                  <CardHeader>
                    <CardTitle className="capitalize">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categoryPresets.map((preset, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start spell-button"
                        onClick={() => rollDice(preset.notation, preset.name)}
                        disabled={loading}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <Dice6 className="w-4 h-4" />
                          <div className="text-left flex-1">
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-xs text-muted-foreground">{preset.notation}</div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Histórico */}
          <div>
            <Card className="magic-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Histórico
                </CardTitle>
                <CardDescription>
                  Últimas 10 rolagens
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rollHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Dice6 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-sm">
                      Nenhuma rolagem ainda
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rollHistory.map((entry) => (
                      <div key={entry.id} className="p-3 rounded bg-card/30 border border-border/30">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-sm">{entry.description}</span>
                          <Badge variant="outline" className={getResultColor(entry.result, entry.details.reduce((sum, d) => sum + d.sides, 0))}>
                            {entry.result}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entry.notation} • {entry.timestamp}
                        </div>
                        <div className="flex gap-1 mt-2">
                          {entry.details.map((detail, index) => (
                            <div key={index} className="flex items-center gap-1">
                              {getDiceIcon(detail.value)}
                              <span className="text-xs">{detail.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {rollHistory.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => setRollHistory([])}
                  >
                    <RotateCcw className="w-3 h-3 mr-2" />
                    Limpar Histórico
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card className="magic-card border-0 mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Dicas Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <div>• <strong>d20:</strong> Teste padrão de habilidade</div>
                <div>• <strong>3d6:</strong> Geração de atributos</div>
                <div>• <strong>1d8+3:</strong> Dano de espada longa</div>
                <div>• <strong>2d10:</strong> Dano crítico</div>
                <div>• <strong>1d100:</strong> Tabelas percentuais</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

