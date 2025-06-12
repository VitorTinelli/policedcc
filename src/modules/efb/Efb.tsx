import { useState } from 'react'
import { useAuth } from '../../commons/AuthContext'
import Header from '../header/Header'
import Footer from '../footer/Footer'
import './Efb.css'
import { apiCall } from '../../commons/ApiHelper'

function Efb() {
    const [courseName, setCourseName] = useState('')
    const [courseStudent, setCourseStudent] = useState('')
    const [courseDate, setCourseDate] = useState('')
    const [courseTime, setCourseTime] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { session } = useAuth()
    const email = session!.user.email

    async function sendCourseData() {
        setError('')
        setIsLoading(true)
        
        try {
            if (!courseName || !courseStudent || !courseDate || !courseTime) {
                setError('Todos os campos são obrigatórios.')
                return
            }

            const response = await apiCall('/api/instrutores/instrutores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseName,
                    courseStudent,
                    courseDate,
                    courseTime,
                    instructorEmail: email
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error)
                return
            }

            setCourseName('')
            setCourseStudent('')
            setCourseDate('')
            setCourseTime('')
            alert('Curso aplicado com sucesso!')
        } catch (error) {
            console.error('Erro ao enviar dados:', error)
            setError('Erro ao inserir dados do curso. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Header />
            <main className='course-container'>
                <form className='course-form'>
                    <div className="form-group">
                        <label htmlFor="courseName">Curso Aplicado: </label>
                        <select 
                            id="courseName" 
                            name="courseName" 
                            onChange={(e) => setCourseName(e.target.value)} 
                            value={courseName}
                            disabled={isLoading}
                        >
                            <option value="">Selecione um curso</option>
                            <option value="CPO">CPO  - Capacitação para Oficialato</option>
                            <option value="CPS">CPS  - Capacitação de Promoção para Subtenente</option>
                            <option value="CFL">CFL  - Capacitação de Funções de Liderança</option>
                            <option value="CFB">CFB  - Capacitação de Funções do Batalhão</option>
                            <option value="CbFS">CbFS - Capacitação Básica do Fórum e Segurança</option>
                            <option value="CAC">CAC  - Capacitação Avançada de Comandos</option>
                            <option value="CFS">CFS  - Capacitação de Formação de Soldados</option>
                        </select>
                    </div>
                    
                    <div className='form-group'>
                        <label htmlFor="courseStudent">Aluno: </label>
                        <input 
                            type="text" 
                            id="courseStudent" 
                            name="courseStudent" 
                            placeholder="Digite o nick do aluno" 
                            onChange={(e) => setCourseStudent(e.target.value)} 
                            value={courseStudent}
                            disabled={isLoading}
                        />
                    </div>
                    <label htmlFor="courseDate">Data e hora da aplicação: </label>
                    <div className="form-group">
                        <input 
                            type="date"
                            id="courseDate" 
                            name="courseDate"
                            onChange={(e) => setCourseDate(e.target.value)} 
                            value={courseDate}
                            disabled={isLoading}
                        />
                        <input 
                            type="time" 
                            id="courseTime" 
                            name="courseTime" 
                            onChange={(e) => setCourseTime(e.target.value)} 
                            value={courseTime}
                            disabled={isLoading}
                        />
                    </div>   
                    <div className="form-group">
                        <button 
                            type="button" 
                            onClick={sendCourseData}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Enviando...' : 'Postar'}
                        </button>
                    </div>

                    {error && <p className="error-message">{error}</p>}
                 
                </form>
            </main>
            <Footer />
        </>
    )
}

export default Efb