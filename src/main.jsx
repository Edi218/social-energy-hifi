import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import FriendsList from './pages/Friendslist.jsx'

// Bootstrap styles & JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import "bootstrap-icons/font/bootstrap-icons.css";
import './app.css'

const router = createBrowserRouter([
  { path: '/', element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'profile', element: <Profile /> },
      { path: 'friends', element: <FriendsList /> }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)