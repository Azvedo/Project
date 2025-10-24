import React, { useState } from 'react'
import api from '../../services/api'


const InstructorModal: React.FC<{ courseId: string; fetchData: () => void }> = ({ courseId, fetchData }) => {
  const [open, setOpen] = useState(false)
  const [course, setCourse] = useState<any | null>(null)
  const [instructors, setInstructors] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loadingInstructors, setLoadingInstructors] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCourse = async () => {
    setError(null)
    setLoadingInstructors(true)
    try {
      const res = await api.get(`/course/${courseId}`)
      const course = res.data
      setCourse(course)
      setInstructors(course.instructors ?? [])
    } catch {
      setError('Falha ao buscar instrutores do curso')
    } finally {
      setLoadingInstructors(false)
    }
  }

  const fetchSuggestions = async () => {
    setError(null)
    setLoadingSuggestions(true)
    try {
      const res = await fetch('https://randomuser.me/api/?results=5')
      const data = await res.json()
      const mapped = data.results.map((u: any) => ({
        id: u.login.uuid,
        username: `${u.name.first} ${u.name.last}`,
        email: u.email,
      }))
      setSuggestions(mapped)
    } catch {
      setError('Falha ao buscar sugestões')
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const updateCourseInstructors = async (newInstructors: any[]) => {
    if (!course) return
    try {
      // manter os outros campos do curso
      const payload = {
        title: course.title,
        description: course.description,
        startDate: course.startDate,
        endDate: course.endDate,
        instructors: newInstructors,
      }
      await api.put(`/course/${courseId}`, payload)
      setInstructors(newInstructors)
      setCourse({ ...course, instructors: newInstructors })
      setError(null)
      return true
    } catch {
      setError('Erro ao atualizar instrutores')
      return false
    }
  }

  const addInstructor = async (ins: any) => {
    setError(null)
    // evitar duplicados
    if (instructors.some(i => i.id === ins.id)) {
      setError('Instrutor já adicionado')
      return
    }
    const newInstructors = [...instructors, { id: ins.id, username: ins.username, email: ins.email }]
    const ok = await updateCourseInstructors(newInstructors)
    if (ok) {
      // opcional: remover da lista de sugestões
      setSuggestions(prev => prev.filter(s => s.id !== ins.id))
    }
    fetchData()
  }

  const removeInstructor = async (id: string) => {
    setError(null)
    const newInstructors = instructors.filter(i => i.id !== id)
    await updateCourseInstructors(newInstructors)
    fetchData()
  }

  const handleOpen = () => {
    setOpen(true)
    fetchCourse()         
    fetchSuggestions()   
  }

  return (
    <div>
      <button onClick={handleOpen} className="px-3 py-1 bg-blue-500 text-white rounded">Gerenciar Instrutores</button>
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded p-4 w-full max-w-2xl">
            <h4 className="font-semibold mb-2">Gerenciar Instrutores</h4>
            {error && <div className="text-red-600 mb-2">{error}</div>}

            <div className="mb-4">
              <h5 className="font-medium mb-2">Instrutores do curso</h5>
              {loadingInstructors ? (
                <div>Carregando instrutores...</div>
              ) : (
                <div className="space-y-2">
                  {instructors.length === 0 && <div className="text-sm text-gray-500">Nenhum instrutor cadastrado.</div>}
                  {instructors.map(i => (
                    <div key={i.id} className="flex items-center justify-between border p-2 rounded">
                      <div>
                        <div className="font-medium">{i.username}</div>
                        <div className="text-xs text-gray-500">{i.email}</div>
                      </div>
                      <button
                        onClick={() => removeInstructor(i.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
                        disabled={loadingInstructors}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h5 className="font-medium mb-2">Sugestões para adicionar</h5>
              {loadingSuggestions ? (
                <div>Carregando sugestões...</div>
              ) : (
                <div className="space-y-2">
                  {suggestions.length === 0 && <div className="text-sm text-gray-500">Sem sugestões no momento.</div>}
                  {suggestions.map(s => (
                    <div key={s.id} className="flex items-center justify-between border p-2 rounded">
                      <div>
                        <div className="font-medium">{s.username}</div>
                        <div className="text-xs text-gray-500">{s.email}</div>
                      </div>
                      <button
                        onClick={() => addInstructor(s)}
                        className="px-2 py-1 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
                        disabled={loadingInstructors}
                      >
                        Adicionar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-3">
              <button onClick={() => setOpen(false)} className="px-5 py-1 border rounded cursor-pointer hover:bg-gray-100">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InstructorModal
