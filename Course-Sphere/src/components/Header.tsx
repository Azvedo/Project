import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaGoogleScholar } from 'react-icons/fa6';
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    if (location.pathname === '/login' || location.pathname === '/signup') {
        return null; // Don't render header on login or signup pages
    }

    return (
        <header className="py-4 text-black flex items-center justify-around border-b border-gray-400">
            <div className="flex items-center gap-2">
                <FaGoogleScholar className="text-3xl" color="#3498DB"/>
                <h4 className="text-xl text-[#3498DB] font-bold">Course Sphere</h4>
            </div>
            <div className="flex items-center gap-8">
                <nav className="flex gap-8 text-[#2C3E50]">
                    <Link to="/" className="mr-4 animated-underline text-sm font-medium hover:text-[#3498DB]">Home</Link>
                    <Link to="/dashboard" className="mr-4 animated-underline text-sm font-medium hover:text-[#3498DB]">Dashboard</Link>
                </nav>
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-[#2C3E50]">Olá, <strong>{user.name}</strong></span>
                        <button onClick={() => { logout(); navigate('/') }} className="text-[#3498DB] px-4 py-1 font-semibold rounded transition hover:bg-[#3498DB] hover:cursor-pointer hover:text-white">Logout</button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <button onClick={() => navigate('/login')} className=" bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-md transition hover:bg-[#3498DB] hover:cursor-pointer">Sign In</button>
                    </div>
                )}
            </div>
        </header>
    );
}
