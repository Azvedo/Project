import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import InstructorModal from '../components/Modals/InstructorModal'
import LessonModal from '../components/Modals/LessonModal'
import EditCourseModal from '../components/Modals/EditCourseModal'
import { useAuth } from '../contexts/AuthContext'
import LessonCard from '../components/LessonCard'

export default function CourseDetails() {
  const { id } = useParams()
  const [course, setCourse] = useState<any | null>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 6
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [showEditCourse, setShowEditCourse] = useState(false)
  const { user } = useAuth()


  const fetchData = async () => {
    if (!id) return
    if (!id) return
    setLoading(true)
    Promise.all([api.get(`/course/${id}`), api.get(`/lesson/course/${id}`)])
      .then(([cRes, lRes]) => {
        setCourse(cRes.data)
        setLessons(lRes.data || [])
      }).catch(() => { })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [id])


  const deleteCourse = async (courseId: string) => {
    try {
      await api.delete(`/course/${courseId}`)
      setCourse(null)
    } catch (err) {
      console.error('Erro ao deletar curso', err)
    }
  }

  const filtered = lessons.filter(l => l.title.toLowerCase().includes(query.toLowerCase()) && (statusFilter ? l.status === statusFilter : true))
  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize)

  console.log("course", course)
  console.log("user?.id", user?.id)
  console.log("creatorid", course?.creatorId)
  const isCreator = course && user && (course.creatorId === user.id)
  const isInstructor = course && user && (course.instructors || []).some((ins: any) => (ins as any)?.id === user.id)

  return (
    <main className=" text-black  min-h-screen">
      {loading && <p>Carregando...</p>}
      {course && (
        <div>
          <div className="flex flex-col text-[#1f2937] items-center justify-between mb-4">
            <div className='shadow w-full items-center p-4 mb-4 rounded bg-[#3498DB]/30 flex md:flex-col md:justify-center'>
              <h1 className="text-2xl font-bold pb-2">{course.title}</h1>
              <p className="text-sm text-gray-600">{course.description}</p>
              <div className="text-xs text-gray-500">{new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}</div>
            </div>
            <div className="flex gap-2">
              {isCreator && <button onClick={() => setShowEditCourse(true)} className="px-3 py-1 bg-yellow-400 rounded">Editar</button>}
              {isCreator && <button onClick={async () => { await deleteCourse(course.id) }} className="px-3 py-1 bg-red-400 rounded">Excluir</button>}
              {isCreator && <InstructorModal courseId={course.id} fetchData={fetchData}/>}
              {(isInstructor || isCreator) && <button onClick={() => setShowLessonModal(true)} className="px-3 py-1 bg-green-400 rounded">Nova Aula</button>}
            </div>
          </div>

          <section className="mb-6 w-full p-4 shadow border border-[#3498DB]/20">
            <div className='items-center justify-center flex flex-col w-full mb-6 '>
              <h1 className="text-2xl font-bold mb-4 text-[#1f2937]">Instrutores</h1>
              <div className="flex gap-4 overflow-x-auto pb-2 justify-start items-start w-full">
                {(course.instructors || []).map((ins: any) => (
                  <div key={ins.id} className="flex flex-col items-center shadow p-8 rounded bg-white min-w-[150px]">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-lg font-semibold">
                      {ins.username ? ins.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className='items-center justify-center flex flex-col w-full'>
                      <h1 className="text-2xl text-[#1f2937] font-bold mb-2">{ins.username}</h1>
                      <div className="text-sm text-gray-500">{ins.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='items-center justify-center flex flex-col w-full border-t border-[#3498DB]/20 pt-4'>
              <h1 className="text-2xl text-[#1f2937] font-bold mb-2">Aulas</h1>
                <div className="flex gap-3 mb-6 w-full max-w-3xl bg-gray-50 p-2 rounded-lg border border-gray-200 shadow-sm items-center">
                <input
                  placeholder="Buscar por título"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="flex-1 p-3 text-lg rounded-md bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="p-3 rounded-md bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                >
                  <option value="">Todos</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                </div>
            </div>

            {pageItems.length === 0 ? (
              <p className="text-gray-600">Nenhuma aula encontrada.</p>
            ) : (
            <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {pageItems.map(l => (
                <LessonCard key={l.id} lessonId={l.id} title={l.title} video_url={l.video_URL} status={l.status} publishDate={l.publishDate} fetchData={fetchData} />
              ))}
            </div>

            <div className="mt-4 flex justify-end w-full">
              <div className="bg-white p-2 rounded shadow flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  aria-label="Anterior"
                  className={`px-3 py-1 border rounded ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  ←
                </button>
                <div className="text-sm">Página {page} / {pages}</div>
                <button
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  disabled={page >= pages}
                  aria-label="Próximo"
                  className={`px-3 py-1 border rounded ${page >= pages ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  →
                </button>
              </div>
            </div>
          </>
            )}
          </section>
          </div>
      )}
      {showLessonModal && <LessonModal fetchData={fetchData} onClose={() => { setShowLessonModal(false) }} courseId={course?.id} />}
      {showEditCourse && <EditCourseModal fetchData={fetchData} courseId={course?.id} onClose={() => setShowEditCourse(false)} />}
      
    </main>
  )
}

