import { getHabboProfile } from '../commons/habboProfile.js'
import { withAuth } from '../security.js'

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { nick, code } = req.body

    if (typeof nick !== 'string' || !nick.trim() || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ error: 'Nick e código são obrigatórios' })
    }

    const profile = await getHabboProfile(nick)
    
    if (profile.motto !== code) {
      return res.status(400).json({ error: 'O código não confere com a sua missão. Atualize e tente novamente.' })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Erro no confirmCode:', error)
    return res.status(500).json({ error: error.message || 'Erro ao verificar perfil' })
  }
}
export default withAuth(handler)