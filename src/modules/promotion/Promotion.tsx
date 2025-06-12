import { useState, useCallback, useMemo, memo } from 'react'
import { useForm } from 'react-hook-form'
import { apiCall } from '../../commons/ApiHelper'
import { useAuth } from '../../commons/AuthContext'
import { useDebounce } from '../../commons/ApiCache'
import './Promotion.css'
import Header from '../header/Header'
import Footer from '../footer/Footer'

type PromotionFormInputs = {
  afetado: string
  motivo: string
  permissao?: string
}

const Promotion = memo(() => {
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { session } = useAuth()

  const promotionForm = useForm<PromotionFormInputs>()
  const { watch } = promotionForm

  // Debounce do input para evitar validações excessivas
  const watchedAfetado = watch('afetado', '')
  const debouncedAfetado = useDebounce(watchedAfetado, 300)

  // Validar se o nome é válido (memoizado)
  const isValidName = useMemo(() => {
    return debouncedAfetado.length >= 3 && /^[a-zA-Z0-9\-._]+$/.test(debouncedAfetado)
  }, [debouncedAfetado])

  const onPromotionSubmit = useCallback(async (data: PromotionFormInputs) => {
    setSubmitMessage('')
    setSubmitError('')
    setIsSubmitting(true)

    try {
      const res = await apiCall('/api/promotion/handlePromotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          afetado: data.afetado,
          motivo: data.motivo,
          permissao: data.permissao || null,
          email: session?.user?.email
        })
      })

      if (!res.ok) {
        const result = await res.json()
        setSubmitError(result.error || 'Falha ao processar promoção')
        return
      }

      const result = await res.json()
      setSubmitMessage(`Promoção registrada com sucesso! ${result.data.afetado} será promovido de ${result.data.patenteAtual} para ${result.data.novaPatente}`)
      promotionForm.reset()
    } catch (error) {
      setSubmitError('Erro de conexão. Tente novamente.')
      console.error('Erro ao processar promoção:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [session?.user?.email, promotionForm])

  return (
    <>
        <Header />
        <div className="container">
            <div className="promotion-wrapper">
                <h1>Promoções</h1>
                
                <form onSubmit={promotionForm.handleSubmit(onPromotionSubmit)}>
                    <div className="form-group">
                        <label htmlFor="afetado">Nick do Militar:</label>
                        <input
                            id="afetado"
                            {...promotionForm.register('afetado', { 
                                required: 'Nick do militar é obrigatório',
                                minLength: {
                                    value: 3,
                                    message: 'Nick deve ter pelo menos 3 caracteres'
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9\-._]+$/,
                                    message: 'Nick contém caracteres inválidos'
                                }
                            })}
                            placeholder="Digite o nick do militar"
                            disabled={isSubmitting}
                            style={{
                                borderColor: isValidName ? '#28a745' : watchedAfetado && !isValidName ? '#dc3545' : '#ddd'
                            }}
                        />
                        {promotionForm.formState.errors.afetado && (
                            <p className="error-text">
                                {promotionForm.formState.errors.afetado.message}
                            </p>
                        )}
                        {watchedAfetado && isValidName && (
                            <p className="success-text">✓ Nick válido</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="motivoPromocao">Motivo:</label>
                        <textarea
                            id="motivoPromocao"
                            {...promotionForm.register('motivo', { 
                                required: 'Motivo é obrigatório',
                                minLength: {
                                    value: 10,
                                    message: 'Motivo deve ter pelo menos 10 caracteres'
                                }
                            })}
                            placeholder="Descreva o motivo da promoção"
                            rows={4}
                            disabled={isSubmitting}
                        />
                        {promotionForm.formState.errors.motivo && (
                            <p className="error-text">
                                {promotionForm.formState.errors.motivo.message}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="permissao">Permissão (Opcional):</label>
                        <input
                            id="permissao"
                            {...promotionForm.register('permissao')}
                            placeholder="Caso necessário, informações sobre permissão"
                            disabled={isSubmitting}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="promotion-submit-btn"
                        disabled={isSubmitting || !isValidName}
                        style={{
                            opacity: isSubmitting || !isValidName ? 0.6 : 1,
                            cursor: isSubmitting || !isValidName ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isSubmitting ? 'Processando...' : 'Registrar Promoção'}
                    </button>
                </form>

                {submitMessage && <p className="success-message">{submitMessage}</p>}
                {submitError && <p className="error-message">{submitError}</p>}
            </div>
        </div>
        <Footer />
    </>
  )
})

export default Promotion