import supabase from '../supabase.js'
import { withAuth } from '../security.js'

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { token } = req.body

  if (typeof token !== 'string' || !token.trim()) {
    res.status(400).json({
      success: false,
      error: 'Token é obrigatório'
    })
    return
  }

  try {
    const { data, error } = await supabase.auth.getUser(token)
    
    if (error) {
      console.error('Erro ao verificar sessão:', error)
      res.status(401).json({
        success: false,
        error: `Erro ao verificar sessão: ${error.message}`,
        session: null
      })
      return
    }

    if (!data.user) {
      res.status(401).json({
        success: false,
        error: 'Usuário não encontrado',
        session: null
      })
      return
    }

    res.status(200).json({
      success: true,
      session: {
        user: data.user,
        access_token: token
      }
    })
  } catch (err) {
    console.error('Erro interno:', err)
    res.status(500).json({
      success: false,
      error: `Erro inesperado: ${err.message}`,
      session: null
    })
  }
}

export default withAuth(handler)