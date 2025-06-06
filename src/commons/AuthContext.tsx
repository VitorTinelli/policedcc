import React, { createContext, useContext, useEffect, useState } from 'react'
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
            return null
        }

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
        async function checkSession() {
            const currentSession = await verifySession()
            setSession(currentSession)
            setLoading(false)
        }
        checkSession()
    }, [])

    if (loading) {
        return <div>Carregando...</div>
    }

    if (!session) {
        return <Navigate to="/login" replace />
    }

    return (
        <AuthContext.Provider value={{ session, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)