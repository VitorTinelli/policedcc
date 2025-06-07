import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { apiCall } from '../../commons/ApiHelper'
import './PromotionRelegation.css'
import Header from '../header/Header'
import Footer from '../footer/Footer'

type PromotionFormInputs = {
  militarPromovido: string
  motivo: string
  permissao: string
}

type RelegationFormInputs = {
  militarRebaixado: string
  motivo: string
  provas: string
}

function PromotionRelegation() {
  const [isPromotion, setIsPromotion] = useState(true)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitError, setSubmitError] = useState('')

  const promotionForm = useForm<PromotionFormInputs>()
  const relegationForm = useForm<RelegationFormInputs>()

  const onPromotionSubmit = async (data: PromotionFormInputs) => {
    setSubmitMessage('')
    setSubmitError('')

    try {
      const res = await apiCall('/api/promotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          militarPromovido: data.militarPromovido,
          motivo: data.motivo,
          permissao: data.permissao,
          tipo: 'promocao'
        })
      })

      if (!res.ok) {
        const result = await res.json()
        setSubmitError(result.error || 'Falha ao processar promoção')
        return
      }

      setSubmitMessage('Promoção registrada com sucesso!')
      promotionForm.reset()
    } catch (error) {
      setSubmitError('Erro de conexão. Tente novamente.')
      console.error('Erro ao processar promoção:', error)
    }
  }

  const onRelegationSubmit = async (data: RelegationFormInputs) => {
    setSubmitMessage('')
    setSubmitError('')

    try {
      const res = await apiCall('/api/relegation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          militarRebaixado: data.militarRebaixado,
          motivo: data.motivo,
          provas: data.provas,
          tipo: 'rebaixamento'
        })
      })

      if (!res.ok) {
        const result = await res.json()
        setSubmitError(result.error || 'Falha ao processar rebaixamento')
        return
      }

      setSubmitMessage('Rebaixamento registrado com sucesso!')
      relegationForm.reset()
    } catch (error) {
      setSubmitError('Erro de conexão. Tente novamente.')
      console.error('Erro ao processar rebaixamento:', error)
    }
  }

  const handleToggle = (isPromotionSelected: boolean) => {
    setIsPromotion(isPromotionSelected)
    setSubmitMessage('')
    setSubmitError('')
    // Reset forms quando alternar
    promotionForm.reset()
    relegationForm.reset()
  }

  return (
    <>
        <Header />
        <div className="container">
            <div className="promotion-relegation-wrapper">
                <h1>Promoções e Rebaixamentos</h1>
                
                <div className="toggle-container">
                    <div className="toggle-slider">
                        <button
                            className={`toggle-button ${isPromotion ? 'active' : ''}`}
                            onClick={() => handleToggle(true)}
                        >
                            Promoção
                        </button>
                        <button
                            className={`toggle-button ${!isPromotion ? 'active' : ''}`}
                            onClick={() => handleToggle(false)}
                        >
                            Rebaixamento
                        </button>
                    </div>
                </div>

                {isPromotion && (
                <form onSubmit={promotionForm.handleSubmit(onPromotionSubmit)}>
                    <div className="form-group">
                    <label htmlFor="militarPromovido">Militar Promovido:</label>
                    <input
                        id="militarPromovido"
                        {...promotionForm.register('militarPromovido', { 
                        required: 'Nome do militar é obrigatório' 
                        })}
                        placeholder="Digite o nome do militar"
                    />
                    {promotionForm.formState.errors.militarPromovido && (
                        <p className="error-text">
                        {promotionForm.formState.errors.militarPromovido.message}
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
                    <label htmlFor="permissao">Permissão:</label>
                    <input
                        id="permissao"
                        {...promotionForm.register('permissao', { 
                        required: 'Permissão é obrigatória' 
                        })}
                        placeholder="Caso necessário, nick do militar que deu a permissão"
                    />
                    {promotionForm.formState.errors.permissao && (
                        <p className="error-text">
                        {promotionForm.formState.errors.permissao.message}
                        </p>
                    )}
                    </div>

                    <button type="submit" className="promotion-submit-btn">
                        Registrar Promoção
                    </button>
                </form>
                )}

                {!isPromotion && (
                <form onSubmit={relegationForm.handleSubmit(onRelegationSubmit)}>
                    <div className="form-group">
                    <label htmlFor="militarRebaixado">Militar Rebaixado:</label>
                    <input
                        id="militarRebaixado"
                        {...relegationForm.register('militarRebaixado', { 
                        required: 'Nome do militar é obrigatório' 
                        })}
                        placeholder="Digite o nome do militar"
                    />
                    {relegationForm.formState.errors.militarRebaixado && (
                        <p className="error-text">
                        {relegationForm.formState.errors.militarRebaixado.message}
                        </p>
                    )}
                    </div>

                    <div className="form-group">
                    <label htmlFor="motivoRebaixamento">Motivo:</label>
                    <textarea
                        id="motivoRebaixamento"
                        {...relegationForm.register('motivo', { 
                        required: 'Motivo é obrigatório' 
                        })}
                        placeholder="Descreva o motivo do rebaixamento"
                        rows={4}
                    />
                    {relegationForm.formState.errors.motivo && (
                        <p className="error-text">
                        {relegationForm.formState.errors.motivo.message}
                        </p>
                    )}
                    </div>

                    <div className="form-group">
                    <label htmlFor="provas">Provas:</label>
                    <input
                        id="provas"
                        {...relegationForm.register('provas', { 
                        required: 'Provas são obrigatórias' 
                        })}
                        placeholder="Link das provas"
                    />
                    {relegationForm.formState.errors.provas && (
                        <p className="error-text">
                        {relegationForm.formState.errors.provas.message}
                        </p>
                    )}
                    </div>

                    <button type="submit" className="relegation-submit-btn">
                        Registrar Rebaixamento
                    </button>
                </form>
                )}

                {submitMessage && <p className="success-message">{submitMessage}</p>}
                {submitError && <p className="error-message">{submitError}</p>}
            </div>
        </div>
        <Footer />
    </>
  )
}

export default PromotionRelegation