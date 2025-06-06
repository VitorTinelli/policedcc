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
    <div className="container">
      <div className="login-wrapper">
        <h1>SGD/DCC</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="username">Nickname:</label>
            <input
              id="username"
              {...register('username', { required: 'Nickname é obrigatório' })}
              className="input"
              placeholder="Digite seu nickname"
            />
            {errors.username && <p className="error-text">{errors.username.message}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Senha é obrigatória' })}
              className="input"
              placeholder="Digite sua senha"
            />
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>
          <div className="form-buttons">
            <button type="button" className="submit-button" onClick={() => navigate('/register')}>
              Registrar
            </button>
            <button type="submit" className="submit-button">
              Entrar
            </button>
          </div>
        </form>
        <div className="forgot-password">
          <a href="#">Esqueci minha senha</a>
          {loginError && <p className="error-message">{loginError}</p>}
        </div>
      </div>
    </div>
  )
}

export default Login