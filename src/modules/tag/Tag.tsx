import React, { useState, useCallback, useMemo } from 'react';
import './Tag.css';
import { apiCall } from '../../commons/ApiHelper';
import { useAuth } from '../../commons/AuthContext';
import Header from '../header/Header'
import Footer from '../footer/Footer';

function Tag() {
    const [tag, setTag] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { session } = useAuth();

    const handleTagChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.toUpperCase(); // Converter para maiúsculas automaticamente
        if (value.length > 3) value = value.slice(0, 3);
        setTag(value);
        
        // Limpar mensagens ao modificar o input
        if (error) setError('');
        if (success) setSuccess('');
    }, [error, success]);

    const isValidTag = useMemo(() => {
        return tag.length === 3 && /^[A-Z]{3}$/.test(tag);
    }, [tag]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (!isValidTag) {
            setError('A TAG deve conter exatamente 3 letras maiúsculas.');
            return;
        }
        
        if (!session?.access_token) {
            setError('Sessão inválida. Faça login novamente.');
            return;
        }
        
        setIsSubmitting(true);
        
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
        } finally {
            setIsSubmitting(false);
        }
    }, [tag, isValidTag, session?.access_token]);

    return (
        <>
            <Header />
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
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSubmitting || !isValidTag}
                        style={{
                            opacity: isSubmitting || !isValidTag ? 0.6 : 1,
                            cursor: isSubmitting || !isValidTag ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isSubmitting ? 'Enviando...' : 'Criar TAG'}
                    </button>
                    {error && <p className="tag-error">{error}</p>}
                    {success && <p style={{ color: '#0a7508', textAlign: 'center', marginTop: '1rem' }}>{success}</p>}
                </form>
            </div>
            <Footer />
        </>
    );
}

export default Tag;