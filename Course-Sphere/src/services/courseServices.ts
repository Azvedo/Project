import api from "./api"

interface InstructorRef { id: string; username?: string; email?: string }

function addCourse(courseData: { title: string; description: string; startDate: string; endDate: string; instructors?: InstructorRef[] }) {
    return api.post('/course', courseData)
}

function updateCourse(courseId: string, courseData: { title?: string; description?: string; startDate?: string; endDate?: string ; instructors?: InstructorRef[] | null }) {
    return api.put(`/course/${courseId}`, courseData)
}

function deleteCourse(courseId: string) {
    return api.delete(`/course/${courseId}`)
}

function getCourses() {
    return api.get(`/course/`)
}

function getCourseById(courseId: string) {
    return api.get(`/course/${courseId}`)
}

function getCourseInstructors(courseId: string) {
    return api.get(`/course/${courseId}/instructors`)
}


export { addCourse, updateCourse, deleteCourse, getCourses, getCourseById, getCourseInstructors }
