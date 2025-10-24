import React, { useState } from 'react'
import { addLesson } from '../../services/LessonService';
import { useAuth } from '../../contexts/AuthContext';
import type { Lesson } from '../../types';
import { notification } from 'antd';

interface LessonModalProps {
  courseId: string;
  onClose: () => void;
  lesson?: Lesson;
  fetchData?: () => void;
}

const LessonModal: React.FC<LessonModalProps> = ({ courseId, onClose, lesson, fetchData }) => {
  const [title, setTitle] = useState(lesson?.title ?? '')
  const [status, setStatus] = useState(lesson?.status ?? 'draft')
  const [publishDate, setPublishDate] = useState(lesson ? new Date(lesson.publishDate).toISOString().slice(0,10) : '')
  const [videoUrl, setVideoUrl] = useState(lesson?.video_URL ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  const validate = () => {
    if (!title.trim()) return 'Título obrigatório'
    if (!status) return 'Status obrigatório'
    if (!publishDate) return 'Data de publicação obrigatória'
    const [y, m, d] = publishDate.split('-').map(Number)
    const pub = new Date(y, m - 1, d)
    if (isNaN(pub.getTime())) return 'Data de publicação inválida'
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (pub <= today) return 'A data de publicação deve ser uma data futura'
    if (!videoUrl) return 'URL do vídeo é obrigatória'
    return null
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (v) return setError(v)
    setLoading(true)
    try {
      const body = {
        title,
        status,
        publishDate: new Date(publishDate).toISOString(),
        video_URL: videoUrl,
        creatorId: user?.id,
        courseId
      }
      await addLesson(courseId, body)
      notification.success({ message: 'Aula criada com sucesso' })
      if (fetchData) fetchData()
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao salvar aula')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h4 className="text-lg font-semibold">{lesson ? 'Editar Aula' : 'Nova Aula'}</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Fechar</button>
        </div>

        <div className="p-6">
          {error && <div className="text-red-600 mb-4">{error}</div>}

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-700">Título</span>
              <input
                placeholder="Título da aula"
                className="w-full mt-1 p-3 border rounded-lg"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Status</span>
              <select
                className="w-full mt-1 p-3 border rounded-lg"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Data de publicação</span>
              <input
                type="date"
                className="w-full mt-1 p-3 border rounded-lg"
                value={publishDate}
                onChange={e => setPublishDate(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">URL do vídeo</span>
              <input
                placeholder="https://..."
                className="w-full mt-1 p-3 border rounded-lg"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
              />
            </label>

            <div className="flex items-center justify-end mt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#3498DB] hover:bg-[#2980B9] text-white rounded-lg font-semibold"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LessonModal
