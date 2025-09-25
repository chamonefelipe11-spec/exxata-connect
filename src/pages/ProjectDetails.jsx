import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useProjects } from '@/contexts/ProjectsContext'

export default function ProjectDetails(){
  const { projectId } = useParams()
  const { getProjectById, updateProject, addProjectFile, getProjectFiles, deleteProjectFile } = useProjects()
  const project = getProjectById(projectId)
  const [files, setFiles] = useState([])

  useEffect(()=>{ (async()=>{
    const data = await getProjectFiles(projectId)
    setFiles(data)
  })() },[projectId])

  if(!project) return <div>Projeto não encontrado.</div>

  const onUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    await addProjectFile(projectId, file, 'exxata')
    const data = await getProjectFiles(projectId)
    setFiles(data)
    e.target.value = ''
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">{project.name}</h2>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="exx-card">
          <div className="font-semibold mb-2">Informações</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-slate-500">Cliente:</span> {project.client}</div>
            <div><span className="text-slate-500">Status:</span> {project.status}</div>
          </div>
        </div>
        <div className="exx-card">
          <div className="font-semibold mb-2">Upload de documentos</div>
          <input type="file" onChange={onUpload} />
          <div className="text-xs text-slate-500 mt-2">Tipos aceitos: pdf, docx, xlsx, zip, rar, imagens. Até 25 MB.</div>
        </div>
      </div>

      <div className="exx-card">
        <div className="font-semibold mb-3">Arquivos</div>
        <div className="space-y-2">
          {(files||[]).map(f=>(
            <div key={f.id} className="flex items-center justify-between">
              <a href={f.url} target="_blank" className="link">{f.name}</a>
              <button onClick={()=>{ deleteProjectFile(projectId, f.id).then(async()=> setFiles(await getProjectFiles(projectId)))}} className="text-sm text-red-600">Excluir</button>
            </div>
          ))}
          {files?.length===0 && <div className="text-slate-500 text-sm">Nenhum arquivo.</div>}
        </div>
      </div>
    </>
  )
}
