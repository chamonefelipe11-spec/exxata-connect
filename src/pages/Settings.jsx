import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { useState, useEffect } from 'react'

export default function Settings(){
  const { user, logout } = useAuth()
  const [form, setForm] = useState({ full_name:'', company:'', role:'cliente', tz:'America/Sao_Paulo', lang:'pt-BR' })

  useEffect(()=>{ (async()=>{
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) setForm(f=>({ ...f, full_name: data.full_name||'', company: data.company||'', role: data.role||'cliente' }))
  })() },[user?.id])

  const save = async () => {
    await supabase.from('profiles').update({ full_name: form.full_name, company: form.company, role: form.role }).eq('id', user.id)
    alert('Salvo!')
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Configurações</h2>
      <div className="exx-card max-w-3xl">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-600">Nome</label>
            <input className="w-full rounded-lg border-slate-200" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}/>
          </div>
          <div>
            <label className="text-sm text-slate-600">E-mail</label>
            <input className="w-full rounded-lg border-slate-200" value={user.email} disabled/>
          </div>
          <div>
            <label className="text-sm text-slate-600">Empresa</label>
            <input className="w-full rounded-lg border-slate-200" value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/>
          </div>
          <div>
            <label className="text-sm text-slate-600">Função</label>
            <select className="w-full rounded-lg border-slate-200" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
              <option value="admin">Admin</option>
              <option value="consultor">Consultor</option>
              <option value="cliente">Cliente</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button className="btn-primary" onClick={save}>Salvar</button>
          <button className="px-4 py-2 rounded-lg border" onClick={logout}>Sair</button>
        </div>
      </div>
    </>
  )
}
