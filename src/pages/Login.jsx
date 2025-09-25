import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function Login(){
  const { login, register, resetPassword } = useAuth()
  const [mode, setMode] = useState('login') // login | register | reset
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()

  const goHome = () => nav(loc.state?.from?.pathname || '/')

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (mode==='login') await login(email, password)
      if (mode==='register') await register({ email, password, full_name: name })
      if (mode==='reset') await resetPassword(email)
      if (mode!=='reset') goHome()
    } catch(err) {
      alert(err.message || 'Erro')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="exx-card w-[520px] max-w-[92vw]">
        <h1 className="exx-title">Exxata <span className="accent">Connect</span></h1>
        <p className="exx-subtitle">Acesse sua conta</p>
        <form onSubmit={onSubmit} className="space-y-3">
          {mode==='register' && (
            <div>
              <label className="text-sm text-slate-600">Nome</label>
              <input className="w-full rounded-lg border-slate-200" value={name} onChange={e=>setName(e.target.value)} />
            </div>
          )}
          <div>
            <label className="text-sm text-slate-600">E-mail</label>
            <input type="email" required className="w-full rounded-lg border-slate-200" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          {mode!=='reset' && (
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-600">Senha</label>
                <button type="button" onClick={()=>setMode('reset')} className="link text-sm">Esqueceu a senha?</button>
              </div>
              <input type="password" required className="w-full rounded-lg border-slate-200" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
          )}
          <button disabled={loading} className="btn-primary w-full">
            {mode==='login' && 'Entrar'}
            {mode==='register' && 'Criar conta'}
            {mode==='reset' && 'Enviar link de redefinição'}
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          {mode==='login' && <button onClick={()=>setMode('register')} className="link">Não tem conta? Cadastre-se</button>}
          {mode!=='login' && <button onClick={()=>setMode('login')} className="link">Voltar ao login</button>}
        </div>
      </div>
    </div>
  )
}
