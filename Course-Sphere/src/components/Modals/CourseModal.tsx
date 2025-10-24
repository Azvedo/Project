import React, { useState, useEffect, useCallback } from 'react'
import { addCourse } from '../../services/courseServices'
import { createInstructor } from '../../services/authService'
import { notification } from 'antd'
import type { Course } from '../../types'

// Interface para o instrutor (baseado nos dados da API)
interface Instructor {
  id: string
  username: string
  email: string
}

interface CourseProps {
  title?: string
  description?: string
  startDate?: string
  endDate?: string
  // backend may send either array of ids or array of Instructor objects
  instructors?: string[] | Instructor[]
}

interface CourseModalProps {
  onClose: () => void
  onCreated: (data: Course) => void
  course?: CourseProps
  fetchData?: () => void
}

const CourseModal: React.FC<CourseModalProps> = ({ onClose, onCreated, course, fetchData }) => {
  const [title, setTitle] = useState(course?.title ?? '')
  const [description, setDescription] = useState(course?.description ?? '')
  const [startDate, setStartDate] = useState(
    course?.startDate ? new Date(course.startDate).toISOString().slice(0, 10) : ''
  )
  const [endDate, setEndDate] = useState(
    course?.endDate ? new Date(course.endDate).toISOString().slice(0, 10) : ''
  )

  // Novos states para instrutores
  const [instructorSearch, setInstructorSearch] = useState('')
  const [selectedInstructors, setSelectedInstructors] = useState<Instructor[]>(() => {
    const ins = course?.instructors
    if (!ins) return []
    // if array of strings (ids), map to minimal Instructor objects
    if (Array.isArray(ins) && typeof ins[0] === 'string') {
      return (ins as string[]).map((id) => ({ id, username: id, email: '' }))
    }
    return ins as Instructor[]
  })
  const [suggestions, setSuggestions] = useState<Instructor[]>([])

  const [loading, setLoading] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validate = () => {
    if (!title.trim()) return 'Nome é obrigatório'
    if (!startDate || !endDate) return 'Datas são obrigatórias'
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (end <= start) return 'Data de término deve ser posterior à de início'
    return null
  }

  // Busca de sugestões de instrutores
  type RandomUser = { login: { uuid: string }; name: { first: string; last: string }; email: string }

  const fetchSuggestions = useCallback(async () => {
    if (instructorSearch.trim().length < 2) {
      setSuggestions([])
      return
    }
    setLoadingSuggestions(true)
    try {
      const res = await fetch(`https://randomuser.me/api/?results=5&seed=${instructorSearch}`) // Use seed para simular busca
      const data = await res.json()
      const mapped: Instructor[] = (data.results as RandomUser[]).map((u) => ({
        id: u.login.uuid,
        username: `${u.name.first} ${u.name.last}`,
        email: u.email,
      }))
      setSuggestions(mapped.filter((s) => !selectedInstructors.find((sel) => sel.id === s.id)))
    } catch (e: unknown) {
      console.error('fetchSuggestions error', e)
      notification.error({ message: 'Falha ao buscar sugestões de instrutores' })
    } finally {
      setLoadingSuggestions(false)
    }
  }, [instructorSearch, selectedInstructors])


  useEffect(() => {
    const handler = setTimeout(() => {
      fetchSuggestions()
    }, 500)

    return () => {
      clearTimeout(handler)
    }
  }, [instructorSearch, fetchSuggestions])

  const handleSelectInstructor = async (instructor: Instructor) => {
    if (selectedInstructors.find(i => i.email === instructor.email)) return

    setLoadingSuggestions(true)
    try {
      const created = await createInstructor({ name: instructor.username, email: instructor.email, password: 'senha123' })

      const c: any = created
      const backendUser = c.user ?? c.data?.user ?? c
      const id = backendUser?.id ?? backendUser?._id ?? backendUser?.userId ?? null
      const username = backendUser?.username ?? backendUser?.name ?? instructor.username
      const email = backendUser?.email ?? instructor.email

      if (!id) {
        throw new Error('Backend did not return user id')
      }

      setSelectedInstructors(prev => [...prev, { id: String(id), username, email }])
      notification.success({ message: `Instrutor ${username} cadastrado/adicionado.` })
    } catch (err: unknown) {
  
      const maybe = (err as any)?.response?.data ?? (err as any)
      if (maybe && typeof maybe === 'object') {
        const existing = maybe.user ?? maybe.data?.user ?? maybe
        const id = existing?.id ?? existing?._id ?? existing?.userId
        if (id) {
          setSelectedInstructors(prev => [...prev, { id: String(id), username: existing.username ?? instructor.username, email: existing.email ?? instructor.email }])
          notification.success({ message: `Instrutor ${instructor.username} adicionado (usuário já existia).` })
          setInstructorSearch('')
          setSuggestions([])
          setLoadingSuggestions(false)
          return
        }
      }

      console.error('Erro ao criar/obter instrutor', err)
      notification.error({ message: `Erro ao cadastrar ${instructor.username}. Usuário pode já existir.` })
    } finally {
      setLoadingSuggestions(false)
      setInstructorSearch('')
      setSuggestions([])
    }
  }


  const handleRemoveInstructor = (instructorId: string) => {
    setSelectedInstructors(selectedInstructors.filter(i => i.id !== instructorId))
  }


  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const isValid = validate()
    if (isValid) return setError(isValid)
    setLoading(true)
    try {
      const body = {
        title,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        instructors: selectedInstructors,
      }
      
      if (fetchData) fetchData()
      notification.success({ message: 'Curso criado com sucesso' }) // Movido para cá
      const res = await addCourse(body)
      onCreated(res.data)
      
    } catch (err: unknown) {
      console.error('addCourse error', err)
      notification.error({ message: 'Erro ao criar curso' })
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-black max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Criar Curso</h3>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="title" className="text-sm font-medium text-gray-800 mb-1">Nome</label>
            <input
              id="title"
              className="w-full p-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3498DB]"
              placeholder="Nome do Curso"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="text-sm font-medium text-gray-800 mb-1">Descrição</label>
            <textarea
              id="description"
              className="w-full p-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3498DB] min-h-24"
              placeholder="Descrição"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col">
              <label htmlFor="startDate" className="text-sm font-medium text-gray-800 mb-1">Data de Início</label>
              <input
                id="startDate"
                type="date"
                className="w-full p-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3498DB]"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label htmlFor="endDate" className="text-sm font-medium text-gray-800 mb-1">Data de Término</label>
              <input
                id="endDate"
                type="date"
                className="w-full p-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3498DB]"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>

          
          <div className="flex flex-col relative">
            <label htmlFor="instructors" className="text-sm font-medium text-gray-800 mb-1">Instrutores</label>

            <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-200 rounded-md bg-gray-50 min-h-10">
              {selectedInstructors.length === 0 && <span className="text-gray-400 text-sm italic">Nenhum instrutor selecionado</span>}
              {selectedInstructors.map(instructor => (
                <div key={instructor.id} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {instructor.username}
                  <button
                    type="button"
                    onClick={() => handleRemoveInstructor(instructor.id)}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            {/* Input de busca */}
            <input
              id="instructors"
              type="text"
              className="w-full p-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3498DB]"
              placeholder="Buscar instrutor por nome ou email..."
              value={instructorSearch}
              onChange={e => setInstructorSearch(e.target.value)}
            />

            {/* Dropdown de Sugestões */}
            {(loadingSuggestions || suggestions.length > 0) && (
              <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-b-md shadow-lg max-h-48 overflow-y-auto -mt-px">
                {loadingSuggestions && <div className="p-2 text-gray-500">Buscando...</div>}
                {!loadingSuggestions && suggestions.map(suggestion => (
                  <div
                    key={suggestion.id}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                    onClick={() => handleSelectInstructor(suggestion)}
                  >
                    <p className="font-medium text-gray-800">{suggestion.username}</p>
                    <p className="text-sm text-gray-600">{suggestion.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#3498DB] text-white rounded-md shadow-sm hover:bg-[#2980B9] disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#3498DB] focus:ring-offset-2"
            >
              {loading ? 'Criando...' : 'Criar Curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CourseModal

