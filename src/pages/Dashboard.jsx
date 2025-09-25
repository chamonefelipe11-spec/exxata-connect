import { useAuth } from '@/contexts/AuthContext'

export default function Dashboard(){
  const { user } = useAuth()
  return (
    <>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="exx-card"><div className="text-slate-500">Bem-vindo(a)</div><div className="text-xl font-bold">{user?.email}</div></div>
        <div className="exx-card">Projetos ativos: —</div>
        <div className="exx-card">Documentos: —</div>
      </div>
    </>
  )
}
