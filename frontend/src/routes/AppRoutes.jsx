import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Register from '../components/Register'
import Login from '../components/Login'
import Profile from '../components/Profile'
import CreateProject from '../components/Project/CreateProject.jsx'
import Project from '../components/Project/Project.jsx'
import ProtectedRoutes from '../components/ProtectedRoutes.jsx'
import AuthProvider from '../context/AuthProvider.jsx'
import Team from '../components/Team/Team.jsx'
import TeamProvider from '../context/TeamProvider.jsx'
import Navbar from '../components/Navbar.jsx'

const AppRoutes = () => {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <TeamProvider>
            {<Navbar />}
            <Routes>
              <Route path='/' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route element={<ProtectedRoutes />}>
                <Route path='/profile' element={<Profile />} />
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
