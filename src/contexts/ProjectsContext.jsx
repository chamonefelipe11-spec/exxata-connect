import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';

const ProjectsContext = createContext();
export const useProjects = () => useContext(ProjectsContext);

export function ProjectsProvider({ children }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!user) { setProjects([]); return; }
    (async () => {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!error) setProjects(data || []);
    })();
  }, [user?.id]);

  const userCanSeeProject = (p) => !!p;
  const getProjectById = (id) => projects.find(p => String(p.id) === String(id));

  const createProject = async (payload) => {
    const { data, error } = await supabase.from('projects')
      .insert([{ ...payload, created_by: user.id }]).select().single();
    if (error) throw error;
    await supabase.from('project_members')
      .insert([{ project_id: data.id, user_id: user.id, project_role: 'manager' }]);
    setProjects(p => [data, ...p]);
    return data;
  };

  const updateProject = async (id, patch) => {
    const { data, error } = await supabase.from('projects').update(patch).eq('id', id).select().single();
    if (error) throw error;
    setProjects(p => p.map(x => x.id === id ? data : x));
  };

  const deleteProject = async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    setProjects(p => p.filter(x => x.id !== id));
  };

  // Files
  const addProjectFile = async (projectId, file, source) => {
    const path = `projects/${projectId}/${Date.now()}_${file.name}`;
    const { error: upErr } = await supabase.storage.from('project-files').upload(path, file, { upsert: false });
    if (upErr) throw upErr;
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    await supabase.from('files').insert([{
      project_id: projectId, source, name: file.name, ext, size: file.size,
      uploaded_by: user.id, author: { id: user.id, name: user.name }, storage_path: path
    }]);
  };
  const deleteProjectFile = async (_pid, fileId) => {
    const { data } = await supabase.from('files').select('storage_path').eq('id', fileId).single();
    if (data?.storage_path) await supabase.storage.from('project-files').remove([data.storage_path]);
    await supabase.from('files').delete().eq('id', fileId);
  };
  const getProjectFiles = async (projectId, source) => {
    let q = supabase.from('files').select('*').eq('project_id', projectId).order('uploaded_at', { ascending: false });
    if (source) q = q.eq('source', source);
    const { data } = await q;
    const withUrls = await Promise.all((data || []).map(async f => {
      const { data: s } = await supabase.storage.from('project-files').createSignedUrl(f.storage_path, 60 * 30);
      return { ...f, url: s?.signedUrl };
    }));
    return withUrls;
  };

  // Activities
  const nextSeq = async (projectId) => {
    const { data } = await supabase.from('activities').select('seq').eq('project_id', projectId);
    const max = Math.max(0, ...(data || []).map(r => Number(r.seq || 0)));
    return max + 1;
  };
  const addProjectActivity = async (projectId, payload) => {
    const seq = await nextSeq(projectId);
    await supabase.from('activities').insert([{ project_id: projectId, seq, ...payload }]);
  };
  const updateProjectActivity = async (_pid, id, patch) => {
    await supabase.from('activities').update(patch).eq('id', id);
  };
  const deleteProjectActivity = async (_pid, id) => {
    await supabase.from('activities').delete().eq('id', id);
  };
  const duplicateProjectActivity = async (pid, id) => {
    const { data } = await supabase.from('activities').select('*').eq('id', id).single();
    if (!data) return;
    const { id: _omit, created_at, ...rest } = data;
    const seq = await nextSeq(pid);
    await supabase.from('activities').insert([{ ...rest, id: undefined, seq }]);
  };

  // Indicators
  const addProjectIndicator = async (projectId, indicator) => {
    await supabase.from('indicators').insert([{ project_id: projectId, ...indicator }]);
  };
  const updateProjectIndicator = async (_pid, id, patch) => {
    await supabase.from('indicators').update(patch).eq('id', id);
  };
  const deleteProjectIndicator = async (_pid, id) => {
    await supabase.from('indicators').delete().eq('id', id);
  };
  const duplicateProjectIndicator = async (_pid, id) => {
    const { data } = await supabase.from('indicators').select('*').eq('id', id).single();
    if (data) {
      const { id: _i, ...rest } = data;
      await supabase.from('indicators').insert([{ ...rest, title: `${rest.title} (cópia)` }]);
    }
  };
  const reorderProjectIndicators = async (pid, fromIndex, toIndex) => {
    const { data } = await supabase.from('indicators').select('id, sort_order').eq('project_id', pid).order('sort_order');
    if (!data) return;
    const arr = [...data];
    const [moved] = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, moved);
    await Promise.all(arr.map((it, idx) => supabase.from('indicators').update({ sort_order: idx }).eq('id', it.id)));
  };

  const value = useMemo(() => ({
    projects, userCanSeeProject, getProjectById,
    createProject, updateProject, deleteProject,
    addProjectFile, deleteProjectFile, getProjectFiles,
    addProjectActivity, updateProjectActivity, deleteProjectActivity, duplicateProjectActivity,
    addProjectIndicator, updateProjectIndicator, deleteProjectIndicator, duplicateProjectIndicator, reorderProjectIndicators
  }), [projects, user?.id]);

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}
