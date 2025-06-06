import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiCall } from '../../commons/ApiHelper'
import './Register.css'

function Register() {
  const [step, setStep] = useState<'nick' | 'credentials'>('nick')
  const [nick, setNick] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleNickSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!nick.trim()) {
    setError('Nickname é obrigatório')
    return
  }

  setLoading(true)
  setError('')

  try {
    const response = await apiCall('/api/register/checkNick', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nick }),
    })

    const data = await response.json()

    if (!response.ok) {
      if (data.error === 'already_registered') {
        alert('Você já está registrado. Retornando para tela de login.')
        navigate('/login', { replace: true })
        return
      }
      setError(data.error)
      return
    }

    setCode(data.code)
  } catch (err) {
    setError('Erro ao verificar nickname')
  } finally {
    setLoading(false)
  }
}

const handleConfirm = async () => {
  setLoading(true)
  setError('')

  try {
    const response = await apiCall('/api/register/confirmCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nick, code }),
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error)
      return
    }

    setStep('credentials')
  } catch (err) {
    setError('Erro ao confirmar código')
  } finally {
    setLoading(false)
  }
}

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  
  if (!email.trim() || !password) {
    setError('Email e senha são obrigatórios')
    return
  }

  setLoading(true)

  try {
    const response = await apiCall('/api/register/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nick, email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      setError(data.error)
      return
    }

    navigate('/', { replace: true })
  } catch (err) {
    setError('Erro ao registrar usuário')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="register-container">
      {step === 'nick' && (
        <form onSubmit={handleNickSubmit}>
          <h2>Etapa 1: Verifique seu Habbo</h2>
          <label>Nickname Habbo:</label>
          <input
            value={nick}
            onChange={e => setNick(e.target.value)}
            placeholder="Digite seu nickname"
            disabled={loading}
          />
          {!code
            ? <button type="submit" disabled={loading}>
                {loading ? 'Verificando...' : 'Gerar Código'}
              </button>
            : (
              <>
                <p>Defina este código como sua missão no Habbo:</p>
                <strong>{code}</strong>
                <button type="button" onClick={handleConfirm} disabled={loading}>
                  {loading ? 'Confirmando...' : 'Confirmar'}
                </button>
              </>
            )
          }
          {error && <p className="error-text">{error}</p>}
        </form>
      )}

      {step === 'credentials' && (
        <form onSubmit={handleRegister}>
          <h2>Etapa 2: Crie suas credenciais</h2>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Digite seu email"
            disabled={loading}
          />
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
          {error && <p className="error-text">{error}</p>}
        </form>
      )}
    </div>
  )
}

export default Register