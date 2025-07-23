import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { recordsApi } from '../services/api'

export default function UserPanel() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    pendientes: 0
  })
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    estado: 'activo'
  })
  const [filters, setFilters] = useState({
    estado: '',
    categoria: '',
    search: ''
  })

  useEffect(() => {
    loadRecords()
  }, [])

  const getFilteredRecords = () => {
    return records.filter(record => {
      const matchEstado = !filters.estado || record.estado === filters.estado
      const matchCategoria = !filters.categoria || record.categoria.toLowerCase().includes(filters.categoria.toLowerCase())
      const matchSearch = !filters.search || 
        record.titulo.toLowerCase().includes(filters.search.toLowerCase()) ||
        record.descripcion.toLowerCase().includes(filters.search.toLowerCase())
      return matchEstado && matchCategoria && matchSearch
    })
  }

  const handleEdit = (record) => {
    setFormData(record)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este registro?')) {
      try {
        await recordsApi.delete(id)
        toast.success('Registro eliminado exitosamente')
        loadRecords()
      } catch (error) {
        toast.error('Error al eliminar el registro')
      }
    }
  }

  const loadRecords = async () => {
    try {
      const response = await recordsApi.getAll()
      setRecords(response.data)
      // Calcular estadísticas
      const stats = response.data.reduce((acc, record) => ({
        total: acc.total + 1,
        activos: acc.activos + (record.estado === 'activo' ? 1 : 0),
        inactivos: acc.inactivos + (record.estado === 'inactivo' ? 1 : 0),
        pendientes: acc.pendientes + (record.estado === 'pendiente' ? 1 : 0)
      }), { total: 0, activos: 0, inactivos: 0, pendientes: 0 })
      setStats(stats)
    } catch (error) {
      toast.error('Error al cargar registros')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formData.id) {
        await recordsApi.update(formData.id, formData)
        toast.success('Registro actualizado exitosamente')
      } else {
        await recordsApi.create(formData)
        toast.success('Registro creado exitosamente')
      }
      setFormData({
        titulo: '',
        descripcion: '',
        categoria: '',
        estado: 'activo'
      })
      setShowForm(false)
      loadRecords()
    } catch (error) {
      toast.error(formData.id ? 'Error al actualizar el registro' : 'Error al crear el registro')
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
          {/* Panel de estadísticas */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-gray-400">📄</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Registros</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-green-400">📈</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Activos</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.activos}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-400">⏰</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pendientes</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.pendientes}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-red-400">📉</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Inactivos</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.inactivos}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botón para mostrar/ocultar formulario */}
          <div className="mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showForm ? 'Ocultar Formulario' : 'Nuevo Registro'}
            </button>
          </div>

          {/* Formulario de creación/edición */}
          {showForm && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">
                {formData.id ? 'Editar Registro' : 'Nuevo Registro'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Categoría</label>
                    <input
                      type="text"
                      value={formData.categoria}
                      onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="pendiente">Pendiente</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    {formData.id ? 'Actualizar' : 'Crear'} Registro
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tabla de registros */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Lista de Registros
                </h3>
                <div className="flex space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={filters.search}
                      onChange={e => setFilters({...filters, search: e.target.value})}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <span className="text-gray-400 absolute right-3 top-2">🔍</span>
                  </div>
                  <select
                    value={filters.estado}
                    onChange={e => setFilters({...filters, estado: e.target.value})}
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="pendiente">Pendiente</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredRecords().map(record => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.titulo}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{record.descripcion}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.categoria}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${record.estado === 'activo' ? 'bg-green-100 text-green-800' : 
                            record.estado === 'inactivo' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {record.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {getFilteredRecords().length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No se encontraron registros
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}