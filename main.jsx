import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { HashRouter } from 'react-router-dom'
import { AuthProvider } from './store/auth.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './pages/ScrollToTop.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <AuthProvider>
      <HashRouter>
        <ScrollToTop />
        <App />
      </HashRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition:Bounce
      />
    </AuthProvider>
  </>,
)
