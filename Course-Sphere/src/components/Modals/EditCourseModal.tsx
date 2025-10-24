import type React from "react";
import { updateCourse } from "../../services/courseServices";
import { useState } from "react";

interface EditCourseModalProps {
    courseId: string;
    onClose: () => void;
    fetchData?: () => void;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({ courseId, onClose, fetchData }) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload: Record<string, unknown> = {};
            if (title.trim()) payload.title = title;
            if (description.trim()) payload.description = description;
            if (startDate) payload.startDate = new Date(startDate).toISOString();
            if (endDate) payload.endDate = new Date(endDate).toISOString();

            // If no fields were changed, just close the modal
            if (Object.keys(payload).length === 0) {
                onClose();
                return;
            }

            await updateCourse(courseId, payload);
            if (fetchData) fetchData();
            onClose();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-black max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Editar Curso</h3>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="title" className="text-sm font-medium text-gray-800 mb-1">Nome</label>
            <input
              id="title"
              className="w-full p-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3498DB] placeholder-gray-900/10 "
              placeholder="Nome do Curso"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="text-sm font-medium text-gray-800 mb-1 ">Descrição</label>
            <textarea
              id="description"
              className="w-full p-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3498DB] min-h-24 placeholder-gray-900/10"
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
                className="w-full p-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3498DB] placeholder-gray-900/10"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label htmlFor="endDate" className="text-sm font-medium text-gray-800 mb-1">Data de Término</label>
              <input
                id="endDate"
                type="date"
                className="w-full p-2 border border-gray-300 rounded shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3498DB] placeholder-gray-900/10"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between gap-3 pt-4">
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
              {loading ? 'Editando...' : 'Editar Curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default EditCourseModal;
