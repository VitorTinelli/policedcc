import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../commons/AuthContext'
import { apiCall } from '../../commons/ApiHelper'
import { HabboProfilePicture } from '../../commons/HabboProfilePicture'
import Footer from '../footer/Footer'
import Header from '../header/Header'
import './Homepage.css'

interface MilitarData {
  id: string
  nick: string
  patente: string
  cargo?: string
  tag?: string
  email?: string
  status: string
  created_at: string
  missaoFormatada: string
}

interface ProfileData {
  militar: MilitarData
  historico: any[]
}

function Homepage() {
    const { session } = useAuth()
    const [profileData, setProfileData] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const userEmail = useMemo(() => session?.user?.email, [session?.user?.email])

    const fetchProfile = useCallback(async () => {
        if (!userEmail) {
            setError('Sessão inválida')
            setLoading(false)
            return
        }

        const cacheKey = `profile_${userEmail}`
        const cachedData = localStorage.getItem(cacheKey)
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`)
        
        if (cachedData && cacheTimestamp) {
            const isValid = Date.now() - parseInt(cacheTimestamp) < 5 * 60 * 1000
            if (isValid) {
                setProfileData(JSON.parse(cachedData))
                setLoading(false)
                return
            }
        }

        try {
            setLoading(true)
            setError('')

            const profileResponse = await apiCall(`/api/profiles/getMilitarProfile?email=${encodeURIComponent(userEmail)}`)
            
            if (!profileResponse.ok) {
                const militarResponse = await apiCall('/api/supabase', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: 'SELECT * FROM militares WHERE email = $1',
                        params: [userEmail]
                    })
                })

                if (militarResponse.ok) {
                    const militarData = await militarResponse.json()
                    if (militarData.data && militarData.data.length > 0) {
                        const militar = militarData.data[0]
                        // Buscar perfil completo usando o nick
                        const fullProfileResponse = await apiCall(`/api/profiles/getMilitarProfile?nick=${encodeURIComponent(militar.nick)}`)
                        
                        if (fullProfileResponse.ok) {
                            const fullProfileData = await fullProfileResponse.json()
                            const profileData = fullProfileData.data
                            
                            // Salvar no cache
                            localStorage.setItem(cacheKey, JSON.stringify(profileData))
                            localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString())
                            
                            setProfileData(profileData)
                            setLoading(false)
                            return
                        }
                    }
                }
                
                setError('Perfil não encontrado. Contate o administrador.')
                setLoading(false)
                return
            }

            const profileDataResponse = await profileResponse.json()
            const profileData = profileDataResponse.data
            
            // Salvar no cache
            localStorage.setItem(cacheKey, JSON.stringify(profileData))
            localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString())
            
            setProfileData(profileData)
        } catch (err) {
            console.error('Erro ao buscar perfil:', err)
            setError('Erro de conexão. Não foi possível carregar o perfil.')
        } finally {
            setLoading(false)
        }
    }, [userEmail])

    useEffect(() => {
        fetchProfile()
    }, [fetchProfile])

    const getRecentHistory = useMemo(() => {
        if (!profileData?.historico) return []
        return profileData.historico.slice(0, 3)
    }, [profileData?.historico])

    return (
        <>
            <Header/>
            <div className="homepage-container">
                <div className="homepage-content">
                    <section className="welcome-section">
                        {loading ? (
                            <div className="profile-loading">Carregando perfil...</div>
                        ) : error ? (
                            <div className="profile-error">
                                <p>{error}</p>
                                <p>Email: {session?.user?.email}</p>
                            </div>
                        ) : profileData ? (
                            <div className="profile-summary">
                                <div className="profile-card">
                                    <div className="profile-avatar">
                                        <HabboProfilePicture username={profileData.militar.nick} size="l" direction='2' />
                                    </div>
                                    <div className="profile-info">
                                        <h2>{profileData.militar.nick}</h2>
                                        <div className="profile-rank">{profileData.militar.patente || 'Soldado'}</div>
                                        {profileData.militar.cargo && (
                                            <div className="profile-position">{profileData.militar.cargo}</div>
                                        )}
                                        {profileData.militar.tag && (
                                            <div className="profile-tag">[{profileData.militar.tag}]</div>
                                        )}
                                    </div>
                                    <Link to={`/profile/${profileData.militar.nick}`} className="view-full-profile">
                                        Ver Perfil Completo
                                    </Link>
                                </div>

                                {getRecentHistory.length > 0 && (
                                    <div className="recent-activity">
                                        <h3>Atividade Recente</h3>
                                        <div className="activity-list">
                                            {getRecentHistory.map((item: any) => (
                                                <div key={item.id} className={`activity-item ${item.tipo}`}>
                                                    <span className="activity-icon">{item.icone}</span>
                                                    <div className="activity-details">
                                                        <div className="activity-title">{item.titulo}</div>
                                                        <div className="activity-date">{item.dataFormatada}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </section>

                    {/* Seção de Links Rápidos */}
                    <section className="quick-links-section">
                        <h2>Acesso Rápido</h2>
                        
                        <div className="links-grid">
                            {/* Requerimentos */}
                            <div className="link-category">
                                <h3>📋 Requerimentos</h3>
                                <div className="category-links">
                                    <Link to="/tags" className="quick-link">
                                        <div className="link-icon">🏷️</div>
                                        <div className="link-content">
                                            <div className="link-title">Solicitar TAG</div>
                                            <div className="link-description">Solicite uma TAG personalizada</div>
                                        </div>
                                    </Link>
                                    <Link to="/promocoes" className="quick-link">
                                        <div className="link-icon">⭐</div>
                                        <div className="link-content">
                                            <div className="link-title">Promoções</div>
                                            <div className="link-description">Promover militares</div>
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Escola de Formação Básica */}
                            <div className="link-category">
                                <h3>🎓 Escola de Formação Básica</h3>
                                <div className="category-links">
                                    <Link to="/efb" className="quick-link">
                                        <div className="link-icon">📚</div>
                                        <div className="link-content">
                                            <div className="link-title">Aplicar Cursos</div>
                                            <div className="link-description">Registrar cursos para militares</div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default Homepage