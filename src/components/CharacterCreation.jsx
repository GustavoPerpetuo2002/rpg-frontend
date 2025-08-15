import React, { useState, useEffect } from 'react';

const CharacterCreation = ({ onBack }) => {
  const [character, setCharacter] = useState({
    name: '',
    race: '',
    character_class: '',
    background: '',
    attribute_points: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0
    },
    advantages: [],
    disadvantages: []
  });

  const [referenceData, setReferenceData] = useState({
    races: {},
    classes: {},
    advantages: [],
    disadvantages: []
  });

  const [pointsRemaining, setPointsRemaining] = useState(27);
  const [advantagePoints, setAdvantagePoints] = useState(0);
  const [showRaceDropdown, setShowRaceDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  useEffect(() => {
    fetchReferenceData();
  }, []);

  useEffect(() => {
    // Calcular pontos restantes
    const usedPoints = Object.values(character.attribute_points).reduce((sum, points) => sum + points, 0);
    setPointsRemaining(27 - usedPoints);

    // Calcular pontos de vantagem disponíveis
    const advantageCost = character.advantages.reduce((sum, advId) => {
      const advantage = referenceData.advantages.find(adv => adv.id === advId);
      return sum + (advantage ? advantage.cost : 0);
    }, 0);

    const disadvantagePoints = character.disadvantages.reduce((sum, disadvId) => {
      const disadvantage = referenceData.disadvantages.find(disadv => disadv.id === disadvId);
      return sum + (disadvantage ? disadvantage.points : 0);
    }, 0);

    setAdvantagePoints(disadvantagePoints - advantageCost);
  }, [character.attribute_points, character.advantages, character.disadvantages, referenceData]);

  const fetchReferenceData = async () => {
    try {
      const response = await fetch('/api/characters/reference-data');
      if (response.ok) {
        const data = await response.json();
        setReferenceData(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de referência:', error);
    }
  };

  const handleAttributeChange = (attribute, delta) => {
    const currentValue = character.attribute_points[attribute];
    const newValue = currentValue + delta;
    
    if (newValue >= 0 && newValue <= 8) {
      const totalUsed = Object.values(character.attribute_points).reduce((sum, points) => sum + points, 0);
      
      if (delta > 0 && totalUsed >= 27) return;
      if (delta < 0 && newValue < 0) return;

      setCharacter(prev => ({
        ...prev,
        attribute_points: {
          ...prev.attribute_points,
          [attribute]: newValue
        }
      }));
    }
  };

  const toggleAdvantage = (advantageId) => {
    setCharacter(prev => {
      const advantages = prev.advantages.includes(advantageId)
        ? prev.advantages.filter(id => id !== advantageId)
        : [...prev.advantages, advantageId];
      
      return { ...prev, advantages };
    });
  };

  const toggleDisadvantage = (disadvantageId) => {
    setCharacter(prev => {
      const disadvantages = prev.disadvantages.includes(disadvantageId)
        ? prev.disadvantages.filter(id => id !== disadvantageId)
        : [...prev.disadvantages, disadvantageId];
      
      return { ...prev, disadvantages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (pointsRemaining !== 0) {
      alert('Você deve distribuir todos os pontos de atributo!');
      return;
    }

    if (advantagePoints < 0) {
      alert('Você não tem pontos suficientes para as vantagens selecionadas!');
      return;
    }

    try {
      const response = await fetch('/api/characters/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(character),
      });

      if (response.ok) {
        alert('Personagem criado com sucesso!');
        onBack();
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao criar personagem:', error);
      alert('Erro ao criar personagem');
    }
  };

  const getAttributeTotal = (attribute) => {
    const base = 10;
    const points = character.attribute_points[attribute];
    let racial = 0;
    
    if (character.race && referenceData.races[character.race]) {
      const raceData = referenceData.races[character.race];
      racial = raceData.bonuses[attribute] || 0;
      if (raceData.penalties && raceData.penalties[attribute]) {
        racial += raceData.penalties[attribute];
      }
    }
    
    return base + points + racial;
  };

  const selectedRace = character.race ? referenceData.races[character.race] : null;
  const selectedClass = character.character_class ? referenceData.classes[character.character_class] : null;

  return (
    <div className="character-creation">
      <button onClick={onBack} className="back-button">
        ← Voltar
      </button>

      <div className="creation-header">
        <h1>Criar Personagem</h1>
        <p>Forje sua lenda no mundo mágico</p>
      </div>

      <form onSubmit={handleSubmit} className="character-form">
        {/* Informações Básicas */}
        <div className="form-section">
          <h2>Informações Básicas</h2>
          
          <div className="form-group">
            <label>Nome do Personagem</label>
            <input
              type="text"
              value={character.name}
              onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Digite o nome do seu herói"
              required
            />
          </div>

          <div className="form-group">
            <label>Raça</label>
            <div className="dropdown">
              <button
                type="button"
                className="dropdown-button"
                onClick={() => setShowRaceDropdown(!showRaceDropdown)}
              >
                {character.race ? referenceData.races[character.race]?.name : 'Escolha uma raça'}
              </button>
              {showRaceDropdown && (
                <div className="dropdown-menu">
                  {Object.entries(referenceData.races).map(([id, race]) => (
                    <div
                      key={id}
                      className="dropdown-item"
                      onClick={() => {
                        setCharacter(prev => ({ ...prev, race: id }));
                        setShowRaceDropdown(false);
                      }}
                    >
                      <strong>{race.name}</strong>
                      <p>{race.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Classe</label>
            <div className="dropdown">
              <button
                type="button"
                className="dropdown-button"
                onClick={() => setShowClassDropdown(!showClassDropdown)}
              >
                {character.character_class ? referenceData.classes[character.character_class]?.name : 'Escolha uma classe'}
              </button>
              {showClassDropdown && (
                <div className="dropdown-menu">
                  {Object.entries(referenceData.classes).map(([id, charClass]) => (
                    <div
                      key={id}
                      className="dropdown-item"
                      onClick={() => {
                        setCharacter(prev => ({ ...prev, character_class: id }));
                        setShowClassDropdown(false);
                      }}
                    >
                      <strong>{charClass.name}</strong>
                      <p>{charClass.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>História Pessoal</label>
            <textarea
              value={character.background}
              onChange={(e) => setCharacter(prev => ({ ...prev, background: e.target.value }))}
              placeholder="Conte a história do seu personagem..."
              rows={4}
            />
          </div>
        </div>

        {/* Vantagens e Desvantagens Raciais */}
        {selectedRace && (
          <div className="form-section racial-section">
            <h2>🏰 Características Raciais - {selectedRace.name}</h2>
            <p className="racial-description">{selectedRace.description}</p>
            
            {selectedRace.racial_advantages && (
              <div className="racial-traits">
                <h3>⚔️ Vantagens Raciais</h3>
                <div className="racial-traits-grid">
                  {selectedRace.racial_advantages.map((advantage, index) => (
                    <div key={index} className="racial-trait advantage">
                      <h4>✨ {advantage.name}</h4>
                      <p>{advantage.description}</p>
                      <span className="trait-badge advantage-badge">Vantagem Racial</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedRace.racial_disadvantages && (
              <div className="racial-traits">
                <h3>⚠️ Desvantagens Raciais</h3>
                <div className="racial-traits-grid">
                  {selectedRace.racial_disadvantages.map((disadvantage, index) => (
                    <div key={index} className="racial-trait disadvantage">
                      <h4>💀 {disadvantage.name}</h4>
                      <p>{disadvantage.description}</p>
                      <span className="trait-badge disadvantage-badge">Desvantagem Racial</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modificadores de Atributos */}
            <div className="racial-bonuses">
              <h3>📊 Modificadores de Atributos</h3>
              <div className="bonuses-grid">
                {Object.entries(selectedRace.bonuses || {}).map(([attr, bonus]) => (
                  <div key={attr} className="bonus-item">
                    <span className="attr-name">{attr}</span>
                    <span className={`bonus-value ${bonus > 0 ? 'positive' : 'negative'}`}>
                      {bonus > 0 ? '+' : ''}{bonus}
                    </span>
                  </div>
                ))}
                {selectedRace.penalties && Object.entries(selectedRace.penalties).map(([attr, penalty]) => (
                  <div key={attr} className="bonus-item">
                    <span className="attr-name">{attr}</span>
                    <span className="bonus-value negative">
                      {penalty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Atributos */}
        <div className="form-section">
          <h2>Atributos</h2>
          <p>Pontos: {pointsRemaining}</p>
          
          <div className="attributes-grid">
            {Object.entries(character.attribute_points).map(([attribute, points]) => (
              <div key={attribute} className="attribute-row">
                <label>{attribute}:</label>
                <div className="attribute-controls">
                  <button
                    type="button"
                    onClick={() => handleAttributeChange(attribute, -1)}
                    disabled={points <= 0}
                  >
                    -
                  </button>
                  <span className="attribute-value">
                    {getAttributeTotal(attribute)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAttributeChange(attribute, 1)}
                    disabled={pointsRemaining <= 0 || points >= 8}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vantagens */}
        <div className="form-section">
          <h2>Vantagens</h2>
          <p>Habilidades especiais que custam pontos</p>
          <p>Pontos disponíveis: {advantagePoints}</p>
          
          <div className="traits-grid">
            {referenceData.advantages.map((advantage) => (
              <div
                key={advantage.id}
                className={`trait-card ${character.advantages.includes(advantage.id) ? 'selected' : ''}`}
                onClick={() => toggleAdvantage(advantage.id)}
              >
                <h4>{advantage.name}</h4>
                <p>{advantage.description}</p>
                <span className="cost">{advantage.cost}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Desvantagens */}
        <div className="form-section">
          <h2>Desvantagens</h2>
          <p>Limitações que concedem pontos extras</p>
          
          <div className="traits-grid">
            {referenceData.disadvantages.map((disadvantage) => (
              <div
                key={disadvantage.id}
                className={`trait-card disadvantage ${character.disadvantages.includes(disadvantage.id) ? 'selected' : ''}`}
                onClick={() => toggleDisadvantage(disadvantage.id)}
              >
                <h4>{disadvantage.name}</h4>
                <p>{disadvantage.description}</p>
                <span className="points">+{disadvantage.points}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onBack}>
            Cancelar
          </button>
          <button type="submit" disabled={pointsRemaining !== 0 || advantagePoints < 0}>
            Criar Personagem
          </button>
        </div>
      </form>
    </div>
  );
};

export default CharacterCreation;

