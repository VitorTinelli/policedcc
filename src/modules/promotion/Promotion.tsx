import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { apiCall } from '../../commons/ApiHelper'
import { useAuth } from '../../commons/AuthContext'
import './Promotion.css'
import Header from '../header/Header'
import Footer from '../footer/Footer'

type PromotionFormInputs = {
  afetado: string
  motivo: string
  permissao?: string
}

function Promotion() {
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')
  const { session } = useAuth()

  const promotionForm = useForm<PromotionFormInputs>()

  const onPromotionSubmit = async (data: PromotionFormInputs) => {
    setSubmitMessage('')
    setSubmitError('')

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
    }
  }

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
                                required: 'Nick do militar é obrigatório' 
                            })}
                            placeholder="Digite o nick do militar"
                        />
                        {promotionForm.formState.errors.afetado && (
                            <p className="error-text">
                                {promotionForm.formState.errors.afetado.message}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="motivoPromocao">Motivo:</label>
                        <textarea
                            id="motivoPromocao"
                            {...promotionForm.register('motivo', { 
                                required: 'Motivo é obrigatório' 
                            })}
                            placeholder="Descreva o motivo da promoção"
                            rows={4}
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
                        />
                    </div>

                    <button type="submit" className="promotion-submit-btn">
                        Registrar Promoção
                    </button>
                </form>

                {submitMessage && <p className="success-message">{submitMessage}</p>}
                {submitError && <p className="error-message">{submitError}</p>}
            </div>
        </div>
        <Footer />
    </>
  )
}

export default Promotion