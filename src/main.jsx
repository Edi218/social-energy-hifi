import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Profile from './pages/Profile.jsx'

// Bootstrap styles & JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const router = createBrowserRouter([
  { path: '/', element: <App />,
    children: [
      { index: true, element: <Profile /> },
      { path: 'profile', element: <Profile /> },
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)