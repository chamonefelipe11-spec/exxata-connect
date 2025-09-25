import { useAuth } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function Header(){
  const { user, logout } = useAuth()
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <img src="/logo.png" alt="Exxata" className="h-7" />
        <span className="font-extrabold text-exxata-blue">Exxata <span className="text-exxata-red">Connect</span></span>
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-slate-600">{user?.email}</span>
        <button onClick={logout} className="text-sm btn-primary bg-slate-800">Sair</button>
      </div>
    </header>
  )
}
