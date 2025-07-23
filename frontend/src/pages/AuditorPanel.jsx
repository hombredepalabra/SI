import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { auditApi } from '../services/api'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AuditorPanel() {
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    loadAudits()
    loadStats()
  }, [])

  const loadAudits = async () => {
    try {
      const response = await auditApi.getAll()
      setAudits(response.data)
    } catch (error) {
      toast.error('Error al cargar registros de auditoría')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await auditApi.getStats()
      setStats(response.data)
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    }
  }

  const handleLikertChange = async (id, value) => {
    try {
      await auditApi.updateLikert(id, value)
      toast.success('Calificación actualizada')
      loadAudits()
    } catch (error) {
      toast.error('Error al actualizar calificación')
    }
  }

  const getStatsChartData = () => {
    if (!stats) return null

    return {
      labels: stats.map(s => s.accion),
      datasets: [{
        data: stats.map(s => s.total),
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)'
        ],
        borderWidth: 1
      }]
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Gráficos */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Acciones por Tipo</h3>
                <div className="h-64">
                  <Pie data={getStatsChartData()} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Estadísticas de Acciones</h3>
                <div className="h-64">
                  <Bar 
                    data={getStatsChartData()} 
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { stepSize: 1 }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tabla de Auditoría */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Registros de Auditoría
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tabla</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likert</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {audits.map(audit => (
                    <tr key={audit.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {audit.User?.nombre || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${audit.accion === 'crear' ? 'bg-green-100 text-green-800' :
                            audit.accion === 'editar' ? 'bg-yellow-100 text-yellow-800' :
                            audit.accion === 'eliminar' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'}`}>
                          {audit.accion}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{audit.tabla}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(audit.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{audit.ip}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          value={audit.likert || ''}
                          onChange={(e) => handleLikertChange(audit.id, e.target.value)}
                          className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="">-</option>
                          {[1, 2, 3, 4, 5].map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
