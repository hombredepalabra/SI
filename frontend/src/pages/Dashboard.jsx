import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      switch (user.rol) {
        case 'admin':
          navigate('/admin')
          break
        case 'operador':
          navigate('/operador')
          break
        case 'usuario':
          navigate('/usuario')
          break
        case 'auditor':
          navigate('/auditor')
          break
        default:
          break
      }
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  )
}
