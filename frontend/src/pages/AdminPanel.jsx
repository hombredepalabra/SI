import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import DeleteModal from '../components/DeleteModal'
import { recordsApi } from '../services/api'

export default function AdminPanel() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null })
  const [editingRecord, setEditingRecord] = useState(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    estado: 'activo'
  })

  useEffect(() => {
    loadRecords()
  }, [])

  const loadRecords = async () => {
    try {
      const response = await recordsApi.getAll()
      setRecords(response.data)
    } catch (error) {
      toast.error('Error al cargar registros')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingRecord) {
        await recordsApi.update(editingRecord.id, formData)
        toast.success('Registro actualizado')
      } else {
        await recordsApi.create(formData)
        toast.success('Registro creado')
      }
      setEditingRecord(null)
      setFormData({ titulo: '', descripcion: '', categoria: '', estado: 'activo' })
      loadRecords()
    } catch (error) {
      toast.error('Error al guardar el registro')
    }
  }

  const handleDelete = async (id) => {
    try {
      await recordsApi.delete(id)
      toast.success('Registro eliminado')
      loadRecords()
      setDeleteModal({ show: false, id: null })
    } catch (error) {
      toast.error('Error al eliminar el registro')
    }
  }

  const startEdit = (record) => {
    setEditingRecord(record)
    setFormData({
      titulo: record.titulo,
      descripcion: record.descripcion,
      categoria: record.categoria,
      estado: record.estado
    })
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
          {/* Formulario */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">
              {editingRecord ? 'Editar Registro' : 'Nuevo Registro'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Título</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={e => setFormData({...formData, titulo: e.target.value})}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Categoría</label>
                  <input
                    type="text"
                    value={formData.categoria}
                    onChange={e => setFormData({...formData, categoria: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={e => setFormData({...formData, descripcion: e.target.value})}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <select
                  value={formData.estado}
                  onChange={e => setFormData({...formData, estado: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="pendiente">Pendiente</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                {editingRecord && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRecord(null)
                      setFormData({ titulo: '', descripcion: '', categoria: '', estado: 'activo' })
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  {editingRecord ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>

          {/* Tabla */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map(record => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => startEdit(record)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setDeleteModal({ show: true, id: record.id })}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null })}
        onConfirm={() => handleDelete(deleteModal.id)}
        title="Eliminar registro"
        message="¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer."
      />
    </div>
  )
}
