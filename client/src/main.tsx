import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from '@/App'
import { GameProvider } from '@/context/GameContext'
import { PreferencesProvider } from '@/context/PreferencesContext'
import { ToastProvider } from '@/context/ToastContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PreferencesProvider>
        <ToastProvider>
          <GameProvider>
            <App />
          </GameProvider>
        </ToastProvider>
      </PreferencesProvider>
    </BrowserRouter>
  </StrictMode>,
)
