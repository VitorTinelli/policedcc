import React, { useState } from 'react';
import './Tag.css';
import { apiCall } from '../../commons/ApiHelper';
import { useAuth } from '../../commons/AuthContext';

function Tag() {
    const [tag, setTag] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { session } = useAuth();

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (value.length > 3) value = value.slice(0, 3);
        setTag(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (tag.length !== 3) {
            setError('A TAG deve conter exatamente 3 letras.');
            return;
        }
        if (!session || !session.access_token) {
            setError('Sessão inválida. Faça login novamente.');
            return;
        }
        try {
            const response = await apiCall('/api/tag/requestTag', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tag, token: session.access_token })
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Erro ao solicitar TAG.');
                return;
            }
            setSuccess('Pedido de TAG enviado com sucesso! Aguarde aprovação.');
            setTag('');
        } catch (err) {
            setError('Erro de conexão. Tente novamente.');
        }
    };

    return (
        <div className="tag-container">
            <form className="tag-form" onSubmit={handleSubmit}>
                <h2>Criação de TAG</h2>
                <div className="tag-fields-row">
                    <div className="tag-field">
                        <label htmlFor="tag">TAG desejada</label>
                        <input
                            id="tag"
                            type="text"
                            value={tag}
                            onChange={handleTagChange}
                            placeholder="ABC"
                            maxLength={3}
                            minLength={3}
                            autoComplete="off"
                        />
                    </div>
                </div>
                <button type="submit">Criar TAG</button>
                {error && <p className="tag-error">{error}</p>}
                {success && <p style={{ color: '#0a7508', textAlign: 'center', marginTop: '1rem' }}>{success}</p>}
            </form>
        </div>
    );
}

export default Tag;