export interface User { id: string; username?: string; name?: string; email?: string }
export interface Course { id: string; title: string; description?: string; startDate: string; endDate: string; creatorId: string; instructors?: User[] }
export interface Lesson { id?: string; title: string; status: string; publishDate: string; video_URL: string; courseId?: string; creatorId?: string }
