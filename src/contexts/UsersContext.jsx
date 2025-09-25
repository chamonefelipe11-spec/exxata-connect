import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const UsersContext = createContext();
export const useUsers = () => useContext(UsersContext);

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('profiles').select('id, full_name, email, role').order('full_name');
      setUsers((data || []).map(u => ({
        id: u.id, name: u.full_name || u.email, email: u.email, role: u.role, status: 'Ativo'
      })));
    })();
  }, []);

  const addUser = async ({ email, name, role='consultor' }) => ({ id: crypto.randomUUID(), email, name, role });
  const updateUser = async (id, patch) => {
    await supabase.from('profiles').update({ full_name: patch.name, role: patch.role }).eq('id', id);
  };
  const deleteUser = async (_id) => {};
  const getUserById = (id) => users.find(u => u.id === id);
  const getUserByEmail = (email) => users.find(u => u.email === email);

  return (
    <UsersContext.Provider value={{ users, addUser, updateUser, deleteUser, getUserById, getUserByEmail }}>
      {children}
    </UsersContext.Provider>
  );
}
