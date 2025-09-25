import { useState, useEffect } from 'react'
import { useProjects } from '@/contexts/ProjectsContext'
import { useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function Team(){
  const [params] = useSearchParams()
  const projectId = params.get('project') || ''
  const [members, setMembers] = useState([])
  const [all, setAll] = useState([])

  useEffect(()=>{ (async()=>{
    const { data: users } = await supabase.from('profiles').select('id, full_name, email, role').order('full_name')
    setAll(users||[])
    if (projectId) {
      const { data } = await supabase.from('project_members').select('user_id, project_role, profiles(full_name,email,role)').eq('project_id', projectId)
      setMembers(data||[])
    }
  })() },[projectId])

  const add = async (uid) => {
    await supabase.from('project_members').insert([{ project_id: projectId, user_id: uid, project_role: 'member' }])
    const { data } = await supabase.from('project_members').select('user_id, project_role, profiles(full_name,email,role)').eq('project_id', projectId)
    setMembers(data||[])
  }

  const remove = async (uid) => {
    await supabase.from('project_members').delete().eq('project_id', projectId).eq('user_id', uid)
    setMembers(members.filter(m=>m.user_id!==uid))
  }

  if (!projectId) return <div className="exx-card">Abra um projeto e use o botão “Equipe” passando ?project=&lt;id&gt;.</div>

  return (
    <>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Equipe</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="exx-card">
          <div className="font-semibold mb-2">Membros</div>
          {(members||[]).map(m=>(
            <div key={m.user_id} className="flex items-center justify-between py-1">
              <div>{m.profiles?.full_name || m.profiles?.email} <span className="text-slate-500 text-sm">({m.profiles?.role})</span></div>
              <button onClick={()=>remove(m.user_id)} className="text-sm text-red-600">Remover</button>
            </div>
          ))}
          {members?.length===0 && <div className="text-slate-500 text-sm">Sem membros.</div>}
        </div>
        <div className="exx-card">
          <div className="font-semibold mb-2">Adicionar usuário</div>
          {(all||[]).map(u=>(
            <div key={u.id} className="flex items-center justify-between py-1">
              <div>{u.full_name || u.email} <span className="text-slate-500 text-sm">({u.role})</span></div>
              <button onClick={()=>add(u.id)} className="text-sm text-blue-600">Adicionar</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
