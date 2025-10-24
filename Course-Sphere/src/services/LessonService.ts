import api from "./api";

function addLesson(courseId: string, lessonData: { title: string; status:string, publishDate: string; videoUrl?: string, creatorId?: string }) {
    return api.post('/lesson', { ...lessonData, courseId });
}

function updateLesson(lessonId: string, lessonData: { title: string; status:string, publishDate: string; videoUrl?: string, creatorId?: string }) {
    return api.put(`/lesson/${lessonId}`, lessonData);
}

function deleteLesson(lessonId: string) {
    return api.delete(`/lesson/${lessonId}`);
}

export { addLesson, updateLesson, deleteLesson };
