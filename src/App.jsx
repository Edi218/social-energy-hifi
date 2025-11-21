import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'

export default function App() {
  return (
    <div className="app-shell">
      <div className="phone-frame d-flex flex-column">
        <nav className="navbar navbar-expand navbar-dark bg-black border-bottom border-secondary">
          <div className="container-fluid px-3">
            {/*<span className="navbar-brand">Social Energy</span>*/}
            <div className="navbar-nav ms-auto">
              <NavLink to="/" className="nav-link">Home</NavLink>
              <NavLink to="/profile" className="nav-link">Profile</NavLink>
            </div>
          </div>
        </nav>

        <main className="flex-grow-1 px-3 py-3">
          <Outlet />
        </main>

        <footer className="text-center text-secondary small py-2 border-top border-secondary">
          HCI group 14
        </footer>
      </div>
    </div>
  )
}