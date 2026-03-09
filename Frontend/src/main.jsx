import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.scss'

import { AuthProvider } from './context/AuthContext.jsx'
import { MoodProvider } from './context/MoodContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <MoodProvider>
          <App />
        </MoodProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)


