import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import EnergyLevelSelection from './pages/EnergyLevelSelection.jsx'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import FriendsList from './pages/Friendslist.jsx'
import Calendar from './pages/Calendar.jsx'

// Bootstrap styles
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import './app.css'

const router = createBrowserRouter([
  { path: '/', element: <EnergyLevelSelection /> },
  { 
    path: '/home', 
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'profile', element: <Profile /> },
      { path: 'friends', element: <FriendsList /> },
      { path: 'calendar', element: <Calendar /> }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)