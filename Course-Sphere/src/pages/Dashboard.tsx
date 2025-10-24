import { useEffect, useState } from 'react'
import api from '../services/api'
import CourseCard from '../components/CourseCard'
import CourseModal from '../components/Modals/CourseModal'
import { useAuth } from '../contexts/AuthContext'
import type { Course } from '../types'

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.get('/Course').then(res => {
      if (!mounted) return
      setCourses(res.data || [])
    }).catch(() => {
      // handle errors silently for now
    }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const openCreate = () => setShowModal(true)
  const onCreated = (course: Course) => {
    setCourses(prev => [course, ...prev])
    setShowModal(false)
  }

  // filter courses where user is creator or instructor
  const myId = user?.id
  console.log("myId", myId)
  console.log("courses", courses)
  const visible = courses.filter(c => c.creatorId === myId || (c.instructors || []).some((ins: any) => (ins as any)?.id === myId))

  return (
    <main className="p-6 text-black">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-[#3498DB] text-white rounded">Novo Curso</button>
      </div>

      {loading ? <p>Carregando...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.length === 0 && <p className="text-gray-600">Você não possui cursos ainda.</p>}
          {visible.map(c => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}

      {showModal && <CourseModal onClose={() => setShowModal(false)} onCreated={onCreated} />}
    </main>
  )
}
