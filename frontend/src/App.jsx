import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import OperatorPanel from './pages/OperatorPanel'
import UserPanel from './pages/UserPanel'
import AuditorPanel from './pages/AuditorPanel'

function App() {
  const { user } = useAuth()

  const getDefaultRoute = (role) => {
    switch (role) {
      case 'admin': return '/admin'
      case 'operador': return '/operador'
      case 'usuario': return '/usuario'
      case 'auditor': return '/auditor'
      default: return '/login'
    }
  }

  return (
    <Routes>
      <Route path="/login" element={
        !user ? <Login /> : <Navigate to={getDefaultRoute(user.rol)} />
      } />
      
      <Route path="/" element={
        user ? <Dashboard /> : <Navigate to="/login" />
      } />

      <Route path="/admin" element={
        <PrivateRoute roles={['admin']}>
          <AdminPanel />
        </PrivateRoute>
      } />

      <Route path="/operador" element={
        <PrivateRoute roles={['operador']}>
          <OperatorPanel />
        </PrivateRoute>
      } />

      <Route path="/usuario" element={
        <PrivateRoute roles={['usuario']}>
          <UserPanel />
        </PrivateRoute>
      } />

      <Route path="/auditor" element={
        <PrivateRoute roles={['auditor']}>
          <AuditorPanel />
        </PrivateRoute>
      } />
    </Routes>
  )
}

export default App
