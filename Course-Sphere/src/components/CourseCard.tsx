import React from 'react'
import { Link } from 'react-router-dom'
import type { Course } from '../types'

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <article className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2"><Link to={`/course/${course.id}`} className="hover:underline">{course.title}</Link></h3>
      <p className="text-sm text-gray-600 mb-3 truncate">{course.description}</p>
      <div className="text-xs text-gray-500">Inicio: {new Date(course.startDate).toLocaleDateString()}</div>
      <div className="text-xs text-gray-500">Fim: {new Date(course.endDate).toLocaleDateString()}</div>
    </article>
  )
}

export default CourseCard
