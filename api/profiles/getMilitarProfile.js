import supabase from '../supabase.js'
import { withAuth } from '../security.js'

async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { nick, email } = req.query

  if ((!nick || typeof nick !== 'string' || !nick.trim()) && 
      (!email || typeof email !== 'string' || !email.trim())) {
    return res.status(400).json({ error: 'Nick ou email é obrigatório' })
  }

  try {
    let militar, militarError

    if (email) {
      // Busca por email
      const result = await supabase
        .from('militares')
        .select('*')
        .eq('email', email)
        .single()
      militar = result.data
      militarError = result.error
    } else {
      // Busca por nick
      const result = await supabase
        .from('militares')
        .select('*')
        .eq('nick', nick)
        .single()
      militar = result.data
      militarError = result.error
    }

    if (militarError) {
      console.error('Erro ao buscar militar:', militarError)
      return res.status(404).json({ error: 'Militar não encontrado' })
    }

    if (!militar) {
      return res.status(404).json({ error: 'Militar não encontrado' })
    }

    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select(`
        *,
        aplicador:militares!cursos_aplicador_fkey(nick, patente)
      `)
      .eq('militar', militar.id)
      .order('created_at', { ascending: false })

    if (cursosError) {
      console.error('Erro ao buscar cursos:', cursosError)
    }    
    const { data: promocoesPunicoes, error: promocoesError } = await supabase
      .from('promocoes-punicoes')
      .select(`
        *,
        promotor:militares!promocoes-punicoes_promotor_fkey(nick, patente, tag)
      `)
      .eq('afetado', militar.id)
      .order('created_at', { ascending: false })

    if (promocoesError) {
      console.error('Erro ao buscar promoções/punições:', promocoesError)
    }

    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select('*')
      .eq('owner_id', militar.id)
      .order('created_at', { ascending: false })

    if (tagsError) {
      console.error('Erro ao buscar tags:', tagsError)
    }

    const historico = []

    if (cursos && cursos.length > 0) {
      cursos.forEach(curso => {
        historico.push({
          id: curso.id,
          tipo: 'curso',
          titulo: curso.curso,
          aplicador: curso.aplicador?.nick || 'Desconhecido',
          aplicadorPatente: curso.aplicador?.patente || '',
          data: new Date(`${curso.dataAplicação}T${curso.horaAplicação}`),
          dataFormatada: new Date(`${curso.dataAplicação}T${curso.horaAplicação}`).toLocaleString('pt-BR'),
          icone: '📚'
        })
      })
    }

    if (promocoesPunicoes && promocoesPunicoes.length > 0) {      promocoesPunicoes.forEach(promocao => {        
        let icone = '⭐'
        let titulo = ''
        
        if (promocao.tipo === 'promocao') {
          icone = promocao.status === 'aceita' ? '⭐' : promocao.status === 'rejeitada' ? '❌' : '⏳'
          titulo = `Promoção para ${promocao['nova-patente']}`
        } else {
          icone = promocao.status === 'aceita' ? '⚠️' : promocao.status === 'rejeitada' ? '❌' : '⏳'
          titulo = `Punição: ${promocao.motivo}`
        }

        historico.push({
          id: promocao.id,
          tipo: promocao.tipo,
          titulo: titulo,
          aplicador: promocao.promotor?.nick || 'Desconhecido',
          aplicadorPatente: promocao.promotor?.patente || '',
          aplicadorTag: promocao.promotor?.tag || '',
          data: new Date(promocao.created_at),
          dataFormatada: new Date(promocao.created_at).toLocaleString('pt-BR'),
          status: promocao.status,
          icone: icone,          
          motivo: promocao.motivo,
          patenteAtual: promocao['patente-atual'],
          novaPatente: promocao['nova-patente']
        })
      })
    }    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        let icone = '🏷️'

        historico.push({
          id: tag.id,
          tipo: 'tag',
          titulo: `Criação de TAG: [${tag.asked_tag}]`,
          aplicador: 'Sistema',
          aplicadorPatente: '',
          data: new Date(tag.created_at),
          dataFormatada: new Date(tag.created_at).toLocaleString('pt-BR'),
          status: tag.status,
          icone: icone
        })
      })
    }

    historico.sort((a, b) => b.data.getTime() - a.data.getTime())    
    const missao = `[DCC] ${militar.patente || 'Soldado'}${militar.cargo ? `/${militar.cargo}` : ''} [${militar['tag-promotor'] || militar.tag || 'DDM'}]`

    return res.status(200).json({
      success: true,
      data: {
        militar: {
          ...militar,
          missaoFormatada: missao
        },
        historico
      }
    })

  } catch (error) {
    console.error('Erro interno:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export default withAuth(handler)
