import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { apiCall } from '../../commons/ApiHelper'
import './Login.css'

type LoginFormInputs = {
  username: string
  password: string
}

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>()
  const [loginError, setLoginError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (data: LoginFormInputs) => {
    setLoginError('')

    try {
      const res = await apiCall('/api/login/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          password: data.password
        })
      })
      const result = await res.json()

      if (!res.ok) {
        setLoginError(result.error || 'Falha no login')
        return
      }

      localStorage.setItem('access_token', result.session.access_token)
      
      navigate('/', { replace: true })
    } catch (error) {
      setLoginError('Erro de conexão. Tente novamente.')
      console.error('Erro no login:', error)
    }
  }

  return (
    <div className="login-page-container">
      <div className="login-page-wrapper">
        <h1 className="login-page-title">SGD/DDM</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="login-form-group">
            <label htmlFor="username" className="login-form-label">Nickname:</label>
            <input
              id="username"
              {...register('username', { required: 'Nickname é obrigatório' })}
              className="login-input-field"
              placeholder="Digite seu nickname"
            />
            {errors.username && <p className="login-error-text">{errors.username.message}</p>}
          </div>
          <div className="login-form-group">
            <label htmlFor="password" className="login-form-label">Senha:</label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Senha é obrigatória' })}
              className="login-input-field"
              placeholder="Digite sua senha"
            />
            {errors.password && <p className="login-error-text">{errors.password.message}</p>}
          </div>
          <div className="login-form-buttons">
            <button type="button" className="login-submit-button" onClick={() => navigate('/register')}>
              Registrar
            </button>
            <button type="submit" className="login-submit-button">
              Entrar
            </button>
          </div>
        </form>
        <div className="login-forgot-password">
          <a href="#">Esqueci minha senha</a>
          {loginError && <p className="login-error-message">{loginError}</p>}
        </div>
      </div>
    </div>
  )
}

export default Login