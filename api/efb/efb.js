import supabase from '../supabase.js'
import { withAuth } from '../security.js'

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { courseName, courseStudent, courseDate, courseTime, instructorEmail } = req.body

  if (typeof courseName !== 'string' || !courseName.trim() ||
      typeof courseStudent !== 'string' || !courseStudent.trim() ||
      typeof courseDate !== 'string' || !courseDate.trim() ||
      typeof courseTime !== 'string' || !courseTime.trim() ||
      typeof instructorEmail !== 'string' || !instructorEmail.trim()) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
  }

  try {
    const { data: instructorData, error: instructorError } = await supabase
      .from('militares')
      .select('id')
      .eq('email', instructorEmail)
      .single()

    if (instructorError || !instructorData) {
      console.error('Erro ao buscar instrutor:', instructorError)
      return res.status(404).json({ error: 'Instrutor não encontrado' })
    }

    const instructorId = instructorData.id

    if (courseName === 'CFS') {
      const { data: existingStudent, error: checkError } = await supabase
        .from('militares')
        .select('id')
        .eq('nick', courseStudent)
        .single()

      if (!checkError && existingStudent) {
        const { data: existingCourse, error: courseCheckError } = await supabase
          .from('cursos')
          .select('id')
          .eq('curso', courseName)
          .eq('militar', existingStudent.id)
          .single()

        if (!courseCheckError && existingCourse) {
          return res.status(400).json({ error: 'O aluno já possui este curso aplicado' })
        }
      } else {
        const { error: insertError } = await supabase
          .from('militares')
          .insert([
            {
              nick: courseStudent,
              email: '',
              patente: 'Soldado',
              status: 'aguardando'
            }
          ])

        if (insertError) {
          console.error('Erro ao criar militar:', insertError)
          return res.status(500).json({ error: 'Erro ao criar militar' })
        }
      }
    }

    const { data: studentData, error: studentError } = await supabase
      .from('militares')
      .select('id')
      .eq('nick', courseStudent)
      .single()

    if (studentError || !studentData) {
      console.error('Erro ao buscar aluno:', studentError)
      return res.status(404).json({ error: 'Usuário não foi encontrado. Verifique o nome do aluno' })
    }

    const studentId = studentData.id

    const { data: existingCourse, error: courseCheckError } = await supabase
      .from('cursos')
      .select('id')
      .eq('curso', courseName)
      .eq('militar', studentId)
      .single()

    if (!courseCheckError && existingCourse) {
      return res.status(400).json({ error: 'O aluno já possui este curso aplicado' })
    }

    const { error: insertCourseError } = await supabase
      .from('cursos')
      .insert([
        {
          curso: courseName,
          aplicador: instructorId,
          militar: studentId,
          dataAplicação: courseDate,
          horaAplicação: courseTime
        }
      ])

    if (insertCourseError) {
      console.error('Erro ao inserir curso:', insertCourseError)
      return res.status(500).json({ error: 'Erro ao inserir dados do curso' })
    }

    return res.status(200).json({ success: true, message: 'Curso aplicado com sucesso' })

  } catch (error) {
    console.error('Erro interno:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

export default withAuth(handler)