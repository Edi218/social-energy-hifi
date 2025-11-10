import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-vh-100 bg-dark text-light">
      <nav className="navbar navbar-expand navbar-dark bg-black border-bottom border-secondary">
        <div className="container-fluid">
          <span className="navbar-brand">Social Energy</span>
          <div className="navbar-nav">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/profile" className="nav-link">Profile</NavLink>
          </div>
        </div>
      </nav>
      <main className="container py-4">
        <Outlet />
      </main>
      <footer className="text-center text-secondary small py-3 border-top border-secondary">
        HCI Milestone 3–4 · React + Bootstrap
      </footer>
    </div>
  )
}