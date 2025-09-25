import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sync = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) await hydrate(session.user);
    };
    sync();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) hydrate(session.user);
      else setUser(null);
    });
    return () => sub?.subscription?.unsubscribe();
  }, []);

  const hydrate = async (authUser) => {
    const { data } = await supabase
      .from('profiles')
      .select('id,email,full_name,role,permissions')
      .eq('id', authUser.id).single();
    setUser({
      id: data?.id ?? authUser.id,
      email: data?.email ?? authUser.email,
      name: data?.full_name ?? '',
      role: data?.role ?? 'cliente',
      permissions: data?.permissions ?? [],
    });
  };

  const hasPermission = (perm) =>
    (user?.permissions || []).includes(perm) || user?.role === 'admin';

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const register = async ({ email, password, full_name, role='cliente' }) => {
    const { error } = await supabase.auth.signUp({
      email, password, options: { data: { full_name, role } }
    });
    if (error) throw error;
  };

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: import.meta.env.VITE_RESET_REDIRECT_URL
    });
    if (error) throw error;
  };

  const logout = async () => { await supabase.auth.signOut(); };

  return (
    <AuthContext.Provider value={{ user, hasPermission, login, register, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
