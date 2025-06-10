import { useState, useEffect } from 'react'
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

function Profiles() {
  const { username } = useParams<{ username: string }>()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) {
        setError('Username não fornecido')
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

        setProfileData(data.data)
      } catch (err) {
        console.error('Erro ao buscar perfil:', err)
        setError('Erro de conexão. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username])
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'aprovado': return '✅'
      case 'rejeitado': return '❌'
      case 'aguardando': return '⏳'
      default: return ''
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'aprovado': return 'Aprovado'
      case 'rejeitado': return 'Rejeitado'
      case 'aguardando': return 'Aguardando'
      default: return ''
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="profiles-container">
          <div className="loading">Carregando perfil...</div>
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
          <div className="error-message">{error}</div>
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
          <div className="error-message">Perfil não encontrado</div>
        </div>
        <Footer />
      </>
    )
  }

  const { militar, historico } = profileData

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
                <div className="profile-rank">{militar.patente || 'Soldado'}</div>
                {militar.cargo && (
                  <div className="profile-position">{militar.cargo}</div>
                )}
                {militar.tag && (
                  <div className="profile-tag">[{militar.tag}]</div>
                )}
              </div>
            </div>
            
            <div className="profile-mission">
              <h3>Missão:</h3>
              <div className="mission-text">{militar.missaoFormatada}</div>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">Status:</span>
                <span className={`stat-value status-${militar.status}`}>
                  {militar.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Membro desde:</span>
                <span className="stat-value">
                  {new Date(militar.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Container direito - Histórico */}
          <div className="profile-history-container">
            <h2>Histórico</h2>
            
            {historico.length === 0 ? (
              <div className="no-history">Nenhum registro encontrado</div>
            ) : (
              <div className="history-list">
                {historico.map((item) => (
                  <div key={item.id} className={`history-item ${item.tipo}`}>
                    <div className="history-icon">
                      <span className="item-icon">{item.icone}</span>
                      {item.status && (
                        <span className="status-icon" title={getStatusText(item.status)}>
                          {getStatusIcon(item.status)}
                        </span>
                      )}
                    </div>
                    
                    <div className="history-content">
                      <div className="history-title">{item.titulo}</div>
                      
                      <div className="history-meta">
                        <span className="history-applicator">
                          Por: {item.aplicador}
                          {item.aplicadorPatente && ` (${item.aplicadorPatente})`}
                          {item.aplicadorTag && ` [${item.aplicadorTag}]`}
                        </span>
                        <span className="history-date">{item.dataFormatada}</span>
                      </div>                      
                      {item.status && item.status !== 'aprovado' && (
                        <div className={`history-status status-${item.status}`}>
                          Status: {getStatusText(item.status)}
                        </div>
                      )}

                      {item.motivo && (
                        <div className="history-reason">
                          <strong>Motivo:</strong> {item.motivo}
                        </div>
                      )}

                      {(item.tipo === 'promocao' || item.tipo === 'punicao') && item.patenteAtual && item.novaPatente && (
                        <div className="history-promotion-details">
                          <span className="rank-change">
                            {item.patenteAtual} → {item.novaPatente}
                          </span>
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
}

export default Profiles
