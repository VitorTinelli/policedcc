import supabase from '../supabase.js'
import { withAuth } from '../security.js'

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { username, password } = req.body
  if (typeof username !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'username e password são obrigatórios' })
    return
  }

  try {
    const { data: perfil, error: perfilError } = await supabase
      .from('militares')
      .select('email')
      .eq('nick', username)
      .single()

    if (perfilError || !perfil?.email) {
      console.error('Usuário não encontrado:', perfilError)
      res.status(404).json({ error: 'Conta não encontrada ou nickname inválido' })
      return
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: perfil.email,
      password,
    })

    if (authError || !authData.session) {
      console.error('Falha ao autenticar:', authError)
      res.status(401).json({ error: authError?.message || 'Falha na autenticação' })
      return
    }

    res.status(200).json({
      user: authData.user,
      session: authData.session,
    })
  } catch (error) {
    console.error('Erro interno no login:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export default withAuth(handler)