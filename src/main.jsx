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
  {
    path: '/',
    element: <App />,               // 👈 App is now the layout for ALL routes
    children: [
      { index: true, element: <EnergyLevelSelection /> }, // '/' shows energy page

      {
        path: 'home',
        children: [
          { index: true, element: <Home /> },              // '/home'
          { path: 'profile', element: <Profile /> },       // '/home/profile'
          { path: 'friends', element: <FriendsList /> },   // '/home/friends'
          { path: 'calendar', element: <Calendar /> },     // '/home/calendar'
        ],
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)