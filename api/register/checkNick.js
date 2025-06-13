import supabase from '../supabase.js'
import { withAuth } from '../security.js'

/**
 * Gera um código no formato DDMxxxx-xx-xxxxBR
 * @returns {string} Código gerado
 */
function generateDDMCode() {
  const part1 = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  const part2 = Math.floor(Math.random() * 100).toString().padStart(2, '0')
  const part3 = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  
  return `DDM${part1}-${part2}-${part3}BR`
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { nick } = req.body

    if (typeof nick !== 'string' || !nick.trim()) {
      return res.status(400).json({ error: 'Nickname é obrigatório' })
    }

    const { data: user, error: fetchError } = await supabase
      .from('militares')
      .select('status')
      .eq('nick', nick)
      .single()

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message })
    }

    if (user?.status === 'ativo') {
      return res.status(400).json({ error: 'already_registered' })
    }    if (!user || user.status === 'inativo') {
      return res.status(400).json({ error: 'Conta Inativa ou não encontrada' })
    }

    const code = generateDDMCode()

    return res.status(200).json({ code })
  } catch (error) {
    console.error('Erro no checkNick:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export default withAuth(handler)