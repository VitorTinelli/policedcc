import supabase from '../supabase.js'
import { withAuth } from '../security.js'

const hierarchyOrder = [
  'Soldado',
  'Cabo', 
  'Sargento',
  'Subtenente',
  'Aspirante a Oficial',
  'Tenente',
  'Capitão',
  'Coronel',
  'Major',
  'General',
  'Marechal',
  'Comandante',
  'Comandante-geral',
  'Comandante Supremo'
]

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { 
    afetado, 
    motivo, 
    email,
    permissao
  } = req.body

  if (typeof afetado !== 'string' || !afetado.trim() ||
      typeof motivo !== 'string' || !motivo.trim() ||
      typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'Campos obrigatórios: afetado, motivo e email' })
  }

  console.log('Dados recebidos:', { afetado, motivo, email, permissao })

  try {
    const { data: promotorData, error: promotorError } = await supabase
      .from('militares')
      .select('id, patente, tag')
      .eq('email', email)
      .single()

    if (promotorError || !promotorData) {
      console.error('Erro ao buscar promotor:', promotorError)
      return res.status(404).json({ error: 'Promotor não encontrado' })
    }

    const promotorId = promotorData.id
    const promotorTag = promotorData.tag

    const { data: afetadoData, error: afetadoError } = await supabase
      .from('militares')
      .select('id, patente, email')
      .eq('nick', afetado)
      .single()

    if (afetadoError || !afetadoData) {
      console.error('Erro ao buscar militar afetado:', afetadoError)
      return res.status(404).json({ error: 'Militar não encontrado. Verifique o nickname' })
    }

    const patenteAtual = afetadoData.patente
    const afetadoId = afetadoData.id
    const afetadoEmail = afetadoData.email

    if (!hierarchyOrder.includes(patenteAtual)) {
      return res.status(400).json({ error: 'Patente atual do militar é inválida' })
    }

    const currentIndex = hierarchyOrder.indexOf(patenteAtual)
    if (currentIndex === hierarchyOrder.length - 1) {
      return res.status(400).json({ error: 'O militar já está na patente máxima e não pode ser promovido' })
    }
    
    const novaPatente = hierarchyOrder[currentIndex + 1]

    const { data: existingPromotion, error: checkError } = await supabase
      .from('promocoes-punicoes')
      .select('id')
      .eq('afetado', afetadoId)
      .eq('status', 'aguardando')
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Erro ao verificar promoções pendentes:', checkError)
      return res.status(500).json({ error: 'Erro ao verificar promoções existentes' })
    }

    if (existingPromotion) {
      return res.status(400).json({ error: 'Este militar já possui uma promoção aguardando aprovação' })
    }

    console.log('Dados para inserção:', {
      promotor: promotorId,
      afetado: afetadoId,
      'nova-patente': novaPatente,
      'patente-atual': patenteAtual,
      permissao: permissao || null,
      motivo: motivo,
      tipo: 'promocao',
      status: 'aguardando',
      tag: promotorTag
    })

    const insertData = {
      promotor: promotorId,
      afetado: afetadoId,
      'nova-patente': novaPatente,
      'patente-atual': patenteAtual,
      permissao: permissao || null,
      motivo: motivo,
      tipo: 'promocao',
      status: 'aguardando',
      tag: promotorTag
    }

    const { error: insertError } = await supabase
      .from('promocoes-punicoes')
      .insert([insertData])

    if (insertError) {
      console.error('Erro ao inserir promoção:', insertError)
      console.error('Detalhes do erro:', JSON.stringify(insertError, null, 2))
      return res.status(500).json({ error: 'Erro ao processar promoção', details: insertError.message })
    }

    console.log('Promoção inserida com sucesso')

    return res.status(200).json({ 
      success: true, 
      message: 'Promoção registrada com sucesso',
      data: {
        afetado: afetado,
        afetadoId: afetadoId,
        patenteAtual: patenteAtual,
        novaPatente: novaPatente,
        tipo: 'promocao'
      }
    })

  } catch (error) {
    console.error('Erro interno:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export default withAuth(handler)