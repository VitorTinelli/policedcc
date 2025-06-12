import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import { AuthProvider } from './commons/AuthContext'
import ErrorBoundary from './commons/ErrorBoundary'

// Lazy loading dos componentes
const Login = lazy(() => import('./modules/login/Login.tsx'))
const Homepage = lazy(() => import('./modules/homepage/Homepage.tsx'))
const Profiles = lazy(() => import('./modules/profiles/Profiles.tsx'))
const Efb = lazy(() => import('./modules/efb/Efb.tsx'))
const Tag = lazy(() => import('./modules/tag/Tag.tsx'))
const Register = lazy(() => import('./modules/register/Register.tsx'))
const Promotion = lazy(() => import('./modules/promotion/Promotion.tsx'))

// Componente de loading
const LoadingFallback = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '16px'
    }}>
        Carregando...
    </div>
)

// Wrapper para rotas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
            {children}
        </Suspense>
    </AuthProvider>
)

const router = createBrowserRouter([
    {
        path: '/login',
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <Login/>
            </Suspense>
        ),
    },
    {
        path: '/register',
        element: (
            <Suspense fallback={<LoadingFallback />}>
                <Register/>
            </Suspense>
        ),
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Homepage/>
            </ProtectedRoute>
        ),
    },
    {
        path: '/profile/:username',
        element: (
            <ProtectedRoute>
                <Profiles/>
            </ProtectedRoute>
        ),
    },
    {
        path: '/efb',
        element: (
            <ProtectedRoute>
                <Efb/>
            </ProtectedRoute>
        ),
    },
    {
        path: '/tags',
        element: (
            <ProtectedRoute>
                <Tag/>
            </ProtectedRoute>
        ),
    },
    {
        path: '/promocoes',
        element: (
            <ProtectedRoute>
                <Promotion/>
            </ProtectedRoute>
        ),
    }
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <RouterProvider router={router} />
        </ErrorBoundary>
    </StrictMode>,
)