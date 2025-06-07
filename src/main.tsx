import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import Login from './modules/login/Login.tsx'
import Homepage from './modules/homepage/Homepage.tsx'
import Profiles from './modules/profiles/Profiles.tsx'
import Instrutores from './modules/instrutores/Instrutores.tsx'
import Tag from './modules/tag/Tag.tsx'
import { AuthProvider } from './commons/AuthContext'
import Register from './modules/register/Register.tsx'
import PromotionRelegation from './modules/promotion-relegation/PromotionRelegation.tsx'

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login/>,
    },
    {
        path: '/register',
        element: <Register/>,
    },
    {
        path: '/',
        element: (
            <AuthProvider>
                <Homepage/>
            </AuthProvider>
        ),
    },
    {
        path: '/profile/:username',
        element: (
            <AuthProvider>
                <Profiles/>
            </AuthProvider>
        ),
    },
    {
        path: '/instrutores',
        element: (
            <AuthProvider>
                <Instrutores/>
            </AuthProvider>
        ),
    },
    {
        path: '/tags',
        element: (
            <AuthProvider>
                <Tag/>
            </AuthProvider>
        ),
    },
    {
        path: '/promocoes-rebaixamentos',
        element: (
            <AuthProvider>
                <PromotionRelegation/>
            </AuthProvider>
        ),
    }
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
)