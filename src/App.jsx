import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext.jsx'
import { ProjectsProvider } from '@/contexts/ProjectsContext.jsx'
import { UsersProvider } from '@/contexts/UsersContext.jsx'
import Header from '@/components/Header.jsx'
import Sidebar from '@/components/Sidebar.jsx'
import Login from '@/pages/Login.jsx'
import Dashboard from '@/pages/Dashboard.jsx'
import Projects from '@/pages/Projects.jsx'
import ProjectDetails from '@/pages/ProjectDetails.jsx'
import Team from '@/pages/Team.jsx'
import Settings from '@/pages/Settings.jsx'

function Protected({ children }) {
  const { user } = useAuth()
  const loc = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <UsersProvider>
        <ProjectsProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <Protected>
                <Layout />
              </Protected>
            }>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:projectId" element={<ProjectDetails />} />
              <Route path="team" element={<Team />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ProjectsProvider>
      </UsersProvider>
    </AuthProvider>
  )
}

import { Outlet } from 'react-router-dom'
function Layout() {
  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
