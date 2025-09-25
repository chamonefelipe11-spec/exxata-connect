import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProjects } from '@/contexts/ProjectsContext'

export default function Projects(){
  const { projects, createProject, deleteProject } = useProjects()
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ name:'', client:'', status:'ativo' })

  const submit = async (e) => {
    e.preventDefault()
    await createProject(form)
    setForm({ name:'', client:'', status:'ativo' })
    setShowNew(false)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Projetos</h2>
        <button className="btn-primary" onClick={()=>setShowNew(true)}>Novo Projeto</button>
      </div>

      {showNew && (
        <div className="exx-card mb-4">
          <form onSubmit={submit} className="grid md:grid-cols-3 gap-3">
            <input placeholder="Nome" className="rounded-lg border-slate-200" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required />
            <input placeholder="Cliente" className="rounded-lg border-slate-200" value={form.client} onChange={e=>setForm(f=>({...f,client:e.target.value}))} required />
            <select className="rounded-lg border-slate-200" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
              <option value="ativo">Ativo</option>
              <option value="pausado">Pausado</option>
              <option value="concluido">Concluído</option>
            </select>
            <div className="col-span-full flex gap-2">
              <button className="btn-primary">Criar</button>
              <button type="button" className="px-4 py-2 rounded-lg border" onClick={()=>setShowNew(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(projects||[]).map(p=>(
          <div key={p.id} className="exx-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-lg">{p.name}</div>
                <div className="text-slate-500 text-sm">Cliente: {p.client} • Status: {p.status}</div>
              </div>
              <button onClick={()=>deleteProject(p.id)} className="text-sm text-red-600">Excluir</button>
            </div>
            <div className="mt-3">
              <Link to={`/projects/${p.id}`} className="link">Abrir detalhes</Link>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
