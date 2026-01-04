import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from '../components/pages/auth/Register.jsx'
import Login from '../components/pages/auth/Login.jsx'
import CreateProject from '../components/Project/CreateProject.jsx'
import Project from '../components/Project/Project.jsx'
import ProtectedRoutes from '../components/common/ProtectedRoutes.jsx'
import AuthProvider from '../context/AuthProvider.jsx'
import Team from '../components/Team/Team.jsx'
import TeamProvider from '../context/TeamProvider.jsx'
import Navbar from '../components/common/Navbar.jsx'
import Hero from '../components/pages/LandingPage/Hero.jsx'

const AppRoutes = () => {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <TeamProvider>
              {<Navbar />}
              <Routes>

                <Route path='/login' element={<Login />} />
                <Route path='/' element={<Hero />} />
                <Route path='/register' element={<Register />} />
                <Route element={<ProtectedRoutes />}>
                  <Route path='/team' element={<Team />} />
                  <Route path='/team/:teamId' element={<CreateProject />} />
                  <Route path='/project/:projectId' element={<Project />} />
                </Route>

              </Routes>
          </TeamProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default AppRoutes
