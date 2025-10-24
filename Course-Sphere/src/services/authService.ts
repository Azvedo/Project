import api from './api' // axios instance

export async function login(email: string, password: string) {
  const res = await api.post('/Auth/login', { email, password })
  return res.data
}

export async function signup(payload: {name: string, email: string, password: string}) {
  const body = { username: payload.name, email: payload.email, password: payload.password }
  const res = await api.post('/Auth/signup', body)
  return res.data
}
export async function createInstructor(payload: {name: string, email: string, password: string}) {
  const body = { username: payload.name, email: payload.email, password: payload.password }
  const res = await api.post('/Auth/signup', body)
  const data = res.data
  if (data && typeof data === 'object') {
    const d: any = data
    const user = d.user ?? d.data?.user ?? (d.id ? d : null)
    if (user) return user
  }
  return data
}

export async function logout() {
  await api.post('/auth/logout')
}

export async function getCurrentUser() {
  const res = await api.get('/auth/me')
  return res.data
}
