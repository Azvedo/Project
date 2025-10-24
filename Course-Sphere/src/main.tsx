import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import ptBR from 'antd/locale/pt_BR'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider locale={ptBR} theme={{ token: { colorPrimary: '#3498DB' } }}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
