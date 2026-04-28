import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { TRPCProvider } from '@/providers/trpc'
import { LangProvider } from '@/lib/lang'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <TRPCProvider>
        <LangProvider>
          <App />
        </LangProvider>
      </TRPCProvider>
    </HashRouter>
  </StrictMode>,
)
