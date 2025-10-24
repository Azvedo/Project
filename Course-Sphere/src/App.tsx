import {Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import Dashboard from './pages/Dashboard'
import CourseDetails from './pages/CourseDetails'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <section >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/course/:id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
          </Routes>
        </section>
      </div>
    </AuthProvider>
  )
}

export default App
