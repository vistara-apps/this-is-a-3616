import React from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'

const Layout = ({ children }) => {
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'

  return (
    <div className="min-h-screen bg-bg">
      {!isDashboard && <Navbar />}
      <main className={isDashboard ? '' : 'pt-16'}>
        {children}
      </main>
    </div>
  )
}

export default Layout