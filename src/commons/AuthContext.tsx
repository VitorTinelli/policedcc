import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { Navigate } from 'react-router-dom'
import { apiCall } from './ApiHelper'

interface AuthContextType {
    session: any | null
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    loading: true,
})

async function verifySession(): Promise<any | null> {
    try {
        const token = localStorage.getItem('access_token')
        if (!token) {
            return null
        }

        // Cache da verificação de sessão por 2 minutos
        const sessionCacheKey = 'session_cache'
        const sessionTimestampKey = 'session_cache_timestamp'
        const cachedSession = localStorage.getItem(sessionCacheKey)
        const cacheTimestamp = localStorage.getItem(sessionTimestampKey)
        
        if (cachedSession && cacheTimestamp) {
            const isValid = Date.now() - parseInt(cacheTimestamp) < 2 * 60 * 1000
            if (isValid) {
                return JSON.parse(cachedSession)
            }
        }

        const response = await apiCall('/api/auth/verifySession', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
        })

        const data = await response.json()

        if (!data.success) {
            console.error(`Erro ao verificar sessão: ${data.error}`)
            localStorage.removeItem('access_token')
            localStorage.removeItem(sessionCacheKey)
            localStorage.removeItem(sessionTimestampKey)
            return null
        }

        // Salvar sessão no cache
        localStorage.setItem(sessionCacheKey, JSON.stringify(data.session))
        localStorage.setItem(sessionTimestampKey, Date.now().toString())

        return data.session
    } catch (err: any) {
        console.error(`Erro inesperado: ${err.message}`)
        return null
    }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true
        
        async function checkSession() {
            const currentSession = await verifySession()
            if (isMounted) {
                setSession(currentSession)
                setLoading(false)
            }
        }
        
        checkSession()
        
        return () => {
            isMounted = false
        }
    }, [])

    const contextValue = useMemo(() => ({
        session,
        loading
    }), [session, loading])

    if (loading) {
        return <div>Carregando...</div>
    }

    if (!session) {
        return <Navigate to="/login" replace />
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)