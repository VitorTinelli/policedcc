import './Header.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const navigateToProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim() !== '') {
            navigate(`/profile/${search}`);
        }
    };

    return (
        <>
            <header>
                <div className="header-content">
                    <img src="/ddmLogo.png" alt="Logo" />
                    <h1>Departamento de Desenvolvimento Militar</h1>
                </div>
                <form onSubmit={navigateToProfile}>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
            </header>
        </>
    );
}

export default Header;