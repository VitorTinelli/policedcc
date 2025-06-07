import supabase from '../supabase.js'
import { withAuth } from '../security.js'

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { tag, token } = req.body

  if (typeof tag !== 'string' || tag.length !== 3) {
    return res.status(400).json({ error: 'A TAG deve conter exatamente 3 letras.' })
  }
  if (typeof token !== 'string' || !token.trim()) {
    return res.status(400).json({ error: 'Token é obrigatório.' })
  }

  try {
    // Verifica sessão e obtém o email do usuário
    const { data: sessionData, error: sessionError } = await supabase.auth.getUser(token)
    if (sessionError || !sessionData.user) {
      return res.status(401).json({ error: 'Sessão inválida.' })
    }
    const userEmail = sessionData.user.email
    if (!userEmail) {
      return res.status(400).json({ error: 'Usuário sem e-mail.' })
    }

    // Busca UUID do militar associada ao email da sessão
    const { data: militar, error: militarError } = await supabase
      .from('militares')
      .select('id')
      .eq('email', userEmail)
      .single()
    if (militarError || !militar) {
      return res.status(404).json({ error: 'Militar não encontrado.' })
    }

    // Verifica se já existe pedido de tag aguardando ou aceito
    const { data: existingTag, error: tagError } = await supabase
      .from('tags')
      .select('id, status')
      .eq('owner_id', militar.id)
      .in('status', ['aguardando', 'aceita'])
      .maybeSingle()
    if (tagError) {
      return res.status(500).json({ error: tagError.message })
    }
    if (existingTag) {
      return res.status(400).json({ error: 'Você já possui uma TAG aguardando aprovação ou já aceita.' })
    }

    // Insere pedido de tag com status 'aguardando'
    const { error: insertError } = await supabase
      .from('tags')
      .insert([
        {
          owner_id: militar.id,
          asked_tag: tag,
          status: 'aguardando'
        }
      ])
    if (insertError) {
      return res.status(500).json({ error: 'Erro ao registrar pedido de TAG.' })
    }
    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Erro no requestTag:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export default withAuth(handler)
