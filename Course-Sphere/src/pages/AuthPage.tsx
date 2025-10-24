import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaGoogleScholar } from 'react-icons/fa6';

const AuthPage: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  type LocationState = { from?: { pathname?: string } }
  const state = location.state as LocationState | null
  const from = state?.from?.pathname ?? '/'

  function validatePassword(pw: string) {
    const errors: string[] = []
    if (pw.length < 6) errors.push('Pelo menos 6 caracteres')
   
    const valid = errors.length === 0
    return { valid, errors }
  }

  function validateEmail(em: string) {
    const errors: string[] = []
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(em)) errors.push('Formato de email inválido')
    const valid = errors.length === 0
    return { valid, errors }
  }

  const { valid: pwValid, errors: pwErrors } = validatePassword(password)
  const { valid: emailValid, errors: emailErrors } = validateEmail(email)
  const canSubmitSignup = pwValid && emailValid && name.trim() !== '' && (password === confirmPassword)

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // basic validation before calling API
      const emailOk = validateEmail(email).valid
      const pwOk = validatePassword(password).valid
      if (!emailOk) return alert('Formato de email inválido')
      if (!pwOk) return alert('Senha deve ter pelo menos 6 caracteres')
      await auth.login(email, password)
      navigate(from === '/' ? '/dashboard' : from, { replace: true })
    } finally {
      setLoading(false)
    }
  }

  const submitSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await auth.signup({ name, email, password })
      navigate(from, { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center bg-linear-to-r from-[#3498DB]/10'>
      <div className="flex items-center gap-2 mb-8 flex-col">
        <div className='flex items-center gap-4'>
         <div className='bg-[#3498D8] p-2 rounded-2xl shadow'>
          <FaGoogleScholar className="text-3xl" color="white" />
        </div>
        <h4 className="text-xl text-[#3498DB] font-bold">Course Sphere</h4>
        </div>
        <div>
          <p className='text-[#2C3E50]'>Plataforma colaborativa de cursos online</p>
        </div>       
      </div>
      <div className="w-full max-w-md mx-auto bg-white shadow rounded-xl p-8 text-black">
        <h1 className="text-2xl font-semibold mb-1">Bem-vindo de volta</h1>
        <p className="text-sm text-gray-600 mb-6">Entre na sua conta ou crie uma nova</p>

        <div className="flex bg-gray-100 rounded-full p-1 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 text-center py-2 rounded-full transition ${isLogin ? 'bg-white shadow text-black' : 'text-gray-600'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 text-center py-2 rounded-full transition ${!isLogin ? 'bg-white shadow text-black' : 'text-gray-600'}`}
          >
            Cadastro
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={submitLogin} className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-700">Email</span>
              <input placeholder="seu@email.com" className="w-full mt-1 p-3 border rounded-lg" required value={email} onChange={e => setEmail(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">Senha</span>
              <input type="password" placeholder="••••••••" className="w-full mt-1 p-3 border rounded-lg" required value={password} onChange={e => setPassword(e.target.value)} />
            </label>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                Lembrar-me
              </label>
              <a className="text-[#3498DB] hover:underline" href="#">Esqueceu a senha?</a>
            </div>

            <div>
              <button className="w-full px-4 py-3 bg-[#3498DB] hover:bg-[#2980B9] text-white rounded-lg font-semibold" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={submitSignup} className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-700">Nome</span>
              <input placeholder="Seu nome" className="w-full mt-1 p-3 border rounded-lg" value={name} onChange={e => setName(e.target.value)} />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">Email</span>
              <input
              id="signup-email"
              aria-invalid={emailErrors.length > 0}
              aria-describedby={emailErrors.length > 0 ? 'signup-email-error' : undefined}
              placeholder="seu@email.com"
              className={`w-full mt-1 p-3 border rounded-lg ${emailErrors.length ? 'border-red-600' : 'border-gray-300'}`}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              />
            </label>
            {emailErrors.length > 0 && (
              <div id="signup-email-error" className="text-sm text-red-600 mt-1">
              {emailErrors[0]}
              </div>
            )}

            <label className="block mt-3">
              <span className="text-sm text-gray-700">Senha</span>
              <input
              id="signup-password"
              aria-invalid={pwErrors.length > 0}
              aria-describedby={pwErrors.length > 0 ? 'signup-password-error' : undefined}
              type="password"
              placeholder="••••••••"
              className={`w-full mt-1 p-3 border rounded-lg ${pwErrors.length ? 'border-red-600' : 'border-gray-300'}`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              />
            </label>
            {pwErrors.length > 0 && (
              <div id="signup-password-error" className="text-sm text-red-600 mt-1">
              {pwErrors[0]}
              </div>
            )}

            <label className="block mt-3">
              <span className="text-sm text-gray-700">Confirmar Senha</span>
              <input
              type="password"
              placeholder="••••••••"
              className={`w-full mt-1 p-3 border rounded-lg ${confirmPassword && password !== confirmPassword ? 'border-red-600' : 'border-gray-300'}`}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              />
            </label>

            {confirmPassword && password !== confirmPassword && (
              <div role="alert" className="text-red-600 text-sm mt-1">As senhas não coincidem</div>
            )}

            <div className="mt-4">
              <button className="w-full px-4 py-3 bg-[#3498DB] hover:bg-[#2980B9] text-white rounded-lg font-semibold" disabled={loading || !canSubmitSignup}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default AuthPage
