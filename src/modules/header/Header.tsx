import './Header.css'
import { useState, useCallback, memo } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const Header = memo(() => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const navigateToProfile = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim() !== '') {
            navigate(`/profile/${search}`);
        }
    }, [search, navigate]);

    const handleLogout = useCallback(() => {
        // Limpar todos os caches relacionados à sessão
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('session') || key.includes('profile') || key === 'access_token')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        navigate('/login');
    }, [navigate]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }, []);

    return (
        <>
            <header>
                <Link to="/" className="header-logo">
                    <div className="header-content">
                        <img src="/ddmLogo.png" alt="Logo" />
                        <h1>Departamento de Desenvolvimento Militar</h1>
                    </div>
                </Link>
                
                <div className="header-actions">
                    <form onSubmit={navigateToProfile} className="search-form">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <button type="submit" title="Buscar perfil">
                            🔍
                        </button>
                    </form>
                    
                    <button 
                        className="logout-btn"
                        onClick={handleLogout}
                        title="Sair"
                    >
                        🚪
                    </button>
                </div>
            </header>
        </>
    );
});

export default Header;