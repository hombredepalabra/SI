import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import DeleteModal from '../components/DeleteModal'
import { recordsApi } from '../services/api'

export default function OperatorPanel() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null })
  const [editingRecord, setEditingRecord] = useState(null)

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

  const handleUpdate = async (id, data) => {
    try {
      await recordsApi.update(id, data)
      toast.success('Registro actualizado')
      loadRecords()
      setEditingRecord(null)
    } catch (error) {
      toast.error('Error al actualizar el registro')
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
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map(record => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {editingRecord === record.id ? (
                        <input
                          type="text"
                          defaultValue={record.titulo}
                          onBlur={(e) => handleUpdate(record.id, { ...record, titulo: e.target.value })}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      ) : (
                        record.titulo
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {editingRecord === record.id ? (
                        <input
                          type="text"
                          defaultValue={record.descripcion}
                          onBlur={(e) => handleUpdate(record.id, { ...record, descripcion: e.target.value })}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      ) : (
                        record.descripcion
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingRecord === record.id ? (
                        <select
                          defaultValue={record.estado}
                          onChange={(e) => handleUpdate(record.id, { ...record, estado: e.target.value })}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                          <option value="activo">Activo</option>
                          <option value="inactivo">Inactivo</option>
                          <option value="pendiente">Pendiente</option>
                        </select>
                      ) : (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${record.estado === 'activo' ? 'bg-green-100 text-green-800' : 
                            record.estado === 'inactivo' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {record.estado}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingRecord(editingRecord === record.id ? null : record.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        {editingRecord === record.id ? 'Guardar' : 'Editar'}
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
