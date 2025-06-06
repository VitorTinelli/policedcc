import { withAuth } from '../security.js'
import supabase from '../supabase.js'

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { nick, email, password } = req.body

    if (typeof email !== 'string' || !email.trim() || 
        typeof password !== 'string' || !password ||
        typeof nick !== 'string' || !nick.trim()) {
      return res.status(400).json({ error: 'Email, senha e nick são obrigatórios' })
    }

    const { error: authError } = await supabase.auth.signUp({ email, password })
    
    if (authError) {
      console.error('Erro na criação do usuário:', authError)
      return res.status(400).json({ error: authError.message })
    }

    const { error: updateError } = await supabase
      .from('militares')
      .update({ email,
        status: 'ativo'
      })
      .eq('nick', nick)

    if (updateError) {
      console.error('Erro ao atualizar perfil:', updateError)
      return res.status(500).json({ error: updateError.message })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Erro no register:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export default withAuth(handler)