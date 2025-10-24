import type React from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { deleteLesson } from "../services/LessonService";

interface LessonCardProps {
    lessonId: string;
    title: string;
    video_url: string;
    status: string;
    publishDate: string;
    fetchData?: () => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lessonId, title, video_url, status, publishDate, fetchData }) => {

    const handleDeleteLesson = async () => {
        try{
            await deleteLesson(lessonId);
            fetchData?.();
        }catch (error) {
            console.error("Erro ao deletar aula", error);
        }
    }



    return (
        <div className="bg-white p-6 rounded shadow flex flex-col gap-3 w-full" >
            <img src={video_url ? `https://img.youtube.com/vi/${extractYouTubeId(video_url)}/0.jpg` : 'https://via.placeholder.com/120x70'} alt="thumb" className="p-2 object-cover rounded-xl" />
            <div className='flex flex-col items-start justify-start px-2'> 
                <div className="font-semibold">{title}</div>
                <div className="text-sm text-gray-500">Status: {status}</div>
                <div className="text-sm text-gray-500">Data: {new Date(publishDate).toLocaleDateString()}</div>
                <div className="mt-2 flex gap-4 w-full justify-between items-center">
                    <button className="px-4 py-2 bg-[#3498DB]/50 cursor-pointer hover:bg-[#2980B9] text-white rounded-lg font-semibold">Assistir Aula</button>
                    <div className="flex justify-center items-center gap-2">
                        <button onClick={handleDeleteLesson} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"><MdDelete /></button>
                        <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold"><FaEdit /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonCard;

function extractYouTubeId(url: string) {
  try {
    const m = url.match(/[?&]v=([^&]+)/)
    if (m) return m[1]
    const s = url.split('/').pop()
    return s || ''
  } catch { return '' }
}
