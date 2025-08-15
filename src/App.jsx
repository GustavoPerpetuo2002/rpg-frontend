import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Componentes
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import CharacterCreation from './components/CharacterCreation'
import GameInterface from './components/GameInterface'
import DiceRoller from './components/DiceRoller'

// Context para autenticação
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Componente para rotas protegidas
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen isekai-gradient-bg flex items-center justify-center">
        <div className="magic-card p-8 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-center">Carregando...</p>
        </div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" />
}

// Componente para rotas públicas (redireciona se já logado)
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen isekai-gradient-bg flex items-center justify-center">
        <div className="magic-card p-8 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-center">Carregando...</p>
        </div>
      </div>
    )
  }
  
  return user ? <Navigate to="/dashboard" /> : children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen isekai-gradient-bg magic-particles">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            
            {/* Rotas protegidas */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/character/create" element={
              <ProtectedRoute>
                <CharacterCreation />
              </ProtectedRoute>
            } />
            <Route path="/game/:sessionId" element={
              <ProtectedRoute>
                <GameInterface />
              </ProtectedRoute>
            } />
            <Route path="/dice" element={
              <ProtectedRoute>
                <DiceRoller />
              </ProtectedRoute>
            } />
            
            {/* Rota padrão */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
