


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// Components
import Login from './components/Login.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'

import EngineerRoute from './components/EngineerRoute.jsx'

// Pages
import Home from './pages/Home.jsx'
import Formations from './pages/Formations.jsx'
import Departments from './pages/Deparments.jsx'
import UserManagement from './pages/UserManagement.jsx'
import EventsGallery from './pages/EventsGallery.jsx'
import ReglementInterieur from './pages/ReglementInterieur.jsx'
import Profile from './pages/Profile.jsx'

// 1. الاستيراد الجديد ديال المكون الديناميكي (تأكد من المسار واش حطيتيه فـ pages ولا components)
import FormationViewer from './pages/FormationViewer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Pages Principales */}
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/formations" element={<PrivateRoute><Formations /></PrivateRoute>} />
        <Route path="/departments" element={<PrivateRoute><Departments /></PrivateRoute>} />
        <Route path="/events" element={<PrivateRoute><EventsGallery /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/reglement-interieur" element={<PrivateRoute><ReglementInterieur /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/user-management" element={<AdminRoute><UserManagement /></AdminRoute>} />

        {/* 2. السطر السحري اللي كيعوض 5 ديال الروابط دقة وحدة */}
        <Route path="/formation/:id" element={<PrivateRoute><FormationViewer /></PrivateRoute>} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
)