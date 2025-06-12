import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { useParams } from 'react-router-dom'
import { apiCall } from '../../commons/ApiHelper'
import { HabboProfilePicture } from '../../commons/HabboProfilePicture'

import Header from '../header/Header'
import Footer from '../footer/Footer'
import './Profiles.css'

interface MilitarData {
  id: string
  nick: string
  patente: string
  cargo?: string
  tag?: string
  'tag-promotor'?: string
  email?: string
  status: string
  created_at: string
  missaoFormatada: string
}

interface HistoricoItem {
  id: string
  tipo: 'curso' | 'promocao' | 'punicao' | 'tag'
  titulo: string
  aplicador: string
  aplicadorPatente?: string
  aplicadorTag?: string
  dataFormatada: string
  icone: string
  status?: string
  motivo?: string
  patenteAtual?: string
  novaPatente?: string
}

interface ProfileData {
  militar: MilitarData
  historico: HistoricoItem[]
}

const Profiles = memo(function Profiles() {
  const { username } = useParams<{ username: string }>()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Cache utilities
  const getCachedData = useCallback((key: string) => {
    const cached = localStorage.getItem(key)
    const timestamp = localStorage.getItem(`${key}_timestamp`)
    
    if (cached && timestamp) {
      const isValid = Date.now() - parseInt(timestamp) < 10 * 60 * 1000 // 10 minutes
      if (isValid) {
        return JSON.parse(cached)
      }
    }
    return null
  }, [])

  const setCachedData = useCallback((key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data))
    localStorage.setItem(`${key}_timestamp`, Date.now().toString())
  }, [])

  const fetchProfile = useCallback(async () => {
    if (!username) {
      setError('Username não fornecido')
      setLoading(false)
      return
    }

    const cacheKey = `profile_${username}`
    
    // Tentar buscar do cache primeiro
    const cachedData = getCachedData(cacheKey)
    if (cachedData) {
      setProfileData(cachedData)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await apiCall(`/api/profiles/getMilitarProfile?nick=${encodeURIComponent(username)}`, {
        method: 'GET'
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao carregar perfil')
        return
      }

      const profileData = data.data
      
      // Salvar no cache (10 minutos)
      setCachedData(cacheKey, profileData)
      setProfileData(profileData)
    } catch (err) {
      console.error('Erro ao buscar perfil:', err)
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [username, getCachedData, setCachedData])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleRefresh = useCallback(() => {
    const cacheKey = `profile_${username}`
    // Limpar cache antes de recarregar
    localStorage.removeItem(cacheKey)
    localStorage.removeItem(`${cacheKey}_timestamp`)
    fetchProfile()
  }, [fetchProfile, username])

  const sortedHistory = useMemo(() => {
    if (!profileData?.historico) return []
    return [...profileData.historico].sort((a, b) => 
      new Date(b.dataFormatada).getTime() - new Date(a.dataFormatada).getTime()
    )
  }, [profileData?.historico])

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'aprovado': 
      case 'aceita': return '✅'
      case 'reprovado': 
      case 'rejeitada': return '❌'
      case 'aguardando': return '⏳'
      default: return '📝'
    }
  }, [])

  const getStatusText = useCallback((status: string) => {
    switch (status) {
      case 'aprovado': 
      case 'aceita': return 'Aprovado'
      case 'reprovado': 
      case 'rejeitada': return 'Rejeitado'
      case 'aguardando': return 'Aguardando'
      default: return 'Indefinido'
    }
  }, [])

  if (loading) {
    return (
      <>
        <Header />
        <div className="profiles-container">
          <div className="loading-message">
            Carregando perfil...
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="profiles-container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={handleRefresh} className="retry-button">
              Tentar novamente
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!profileData) {
    return (
      <>
        <Header />
        <div className="profiles-container">
          <div className="error-message">
            Perfil não encontrado
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const { militar } = profileData

  return (
    <>
      <Header />
      <div className="profiles-container">
        <div className="profile-content">
          {/* Container esquerdo - Informações do militar */}
          <div className="profile-info-container">
            <div className="profile-header">
              <div className="profile-avatar">
                <HabboProfilePicture username={militar.nick} size="l" direction='2' />
              </div>
              <div className="profile-details">
                <h1 className="profile-name">{militar.nick}</h1>
                <div className="profile-rank">{militar.patente}</div>
                {militar.cargo && (
                  <div className="profile-position">{militar.cargo}</div>
                )}
                {militar.tag && (
                  <div className="profile-tag">[{militar.tag}]</div>
                )}
              </div>
            </div>

            <div className="profile-mission">
              <h3>Missão</h3>
              <div className="mission-text">{militar.missaoFormatada}</div>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">Status:</span>
                <span className={`stat-value status-${militar.status}`}>
                  {militar.status}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Alistado em:</span>
                <span className="stat-value">
                  {new Date(militar.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Container direito - Histórico */}
          <div className="profile-history-container">
            <h2>Histórico</h2>
            
            {sortedHistory.length === 0 ? (
              <div className="no-history">
                <p>Nenhuma atividade registrada</p>
              </div>
            ) : (
              <div className="history-list">
                {sortedHistory.map((item) => (
                  <div key={item.id} className={`history-item ${item.tipo}`}>
                    <div className="history-icon">
                      <div className="item-icon">{item.icone}</div>
                      {item.status && (
                        <div className="status-icon">
                          {getStatusIcon(item.status)}
                        </div>
                      )}
                    </div>
                    
                    <div className="history-content">
                      <div className="history-meta">
                        <div className="history-applicator">
                          Por: {item.aplicador}
                          {item.aplicadorPatente && ` (${item.aplicadorPatente})`}
                          {item.aplicadorTag && ` [${item.aplicadorTag}]`}
                        </div>
                        <div className="history-date">{item.dataFormatada}</div>
                      </div>
                      
                      <h3 className="history-title">{item.titulo}</h3>
                      
                      {item.status && (
                        <div className={`history-status status-${item.status}`}>
                          {getStatusText(item.status)}
                        </div>
                      )}
                      
                      {item.motivo && (
                        <div className="history-reason">
                          Motivo: {item.motivo}
                        </div>
                      )}
                      
                      {item.patenteAtual && item.novaPatente && (
                        <div className="history-promotion-details">
                          <div className="rank-change">
                            {item.patenteAtual} → {item.novaPatente}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
})

export default Profiles
