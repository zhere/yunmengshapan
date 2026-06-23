import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#00D4FF', borderRadius: 4 } }}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
