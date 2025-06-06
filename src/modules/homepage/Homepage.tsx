import { useAuth } from '../../commons/AuthContext'
import Footer from '../footer/Footer'
import Header from '../header/Header'

function Homepage() {
    const { session } = useAuth()
    const email = session!.user.email

    return (
    <>
        <Header/>
        <div className="homepage">
            <h1>Hello {email}</h1>
        </div>
        <Footer/>
    </>
    )
}

export default Homepage