import { NavLink } from 'react-router-dom'

const Item = ({to, children}) => (
  <NavLink to={to} className={({isActive}) =>
    `block px-5 py-2 rounded-lg font-medium ${isActive ? 'bg-slate-200 text-slate-900' : 'text-slate-600 hover:bg-slate-100'}`
  }>{children}</NavLink>
)

export default function Sidebar(){
  return (
    <aside className="bg-white border-r border-slate-200 p-4">
      <div className="text-xs uppercase tracking-wide text-slate-400 px-3 mb-2">Menu</div>
      <nav className="space-y-1">
        <Item to="/">Dashboard</Item>
        <Item to="/projects">Projetos</Item>
        <Item to="/team">Equipe</Item>
        <Item to="/settings">Configurações</Item>
      </nav>
    </aside>
  )
}
