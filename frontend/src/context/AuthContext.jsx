import React, { createContext, useContext, useEffect, useState } from 'react';

/* ── Demo credentials (client-side only, no backend needed) ── */
const DEMO_EMAIL = 'demo@padel.co.za';
const DEMO_PASSWORD = 'Demo1234!';
const DEMO_USER = {
  id: 'demo-user-001',
  email: DEMO_EMAIL,
  created_at: new Date().toISOString(),
};
const DEMO_PROFILE = {
  id: 'demo-user-001',
  first_name: 'Demo',
  last_name: 'Player',
  email: DEMO_EMAIL,
  phone: '+27 82 000 0000',
};

/* Lazy import supabase so it doesn't crash if paused */
let supabaseClient = null;
const getSupabase = async () => {
  if (supabaseClient) return supabaseClient;
  try {
    const { supabase } = await import('../lib/supabase');
    supabaseClient = supabase;
    return supabaseClient;
  } catch {
    return null;
  }
};

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  /* ── Bootstrap ── */
  useEffect(() => {
    /* Check for persisted demo session */
    const savedDemo = sessionStorage.getItem('padel_demo_session');
    if (savedDemo) {
      setUser(DEMO_USER);
      setProfile(DEMO_PROFILE);
      setIsDemoUser(true);
      setLoading(false);
      return;
    }

    let unsubscribe = () => {};

    getSupabase().then((sb) => {
      if (!sb) { setLoading(false); return; }

      sb.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) fetchProfile(sb, session.user.id);
        setLoading(false);
      }).catch(() => setLoading(false));

      const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) fetchProfile(sb, session.user.id);
        else setProfile(null);
      });
      unsubscribe = () => subscription.unsubscribe();
    });

    return () => unsubscribe();
  }, []);

  const fetchProfile = async (sb, userId) => {
    try {
      const { data } = await sb.from('profiles').select('*').eq('id', userId).single();
      setProfile(data ?? null);
    } catch { /* silently ignore */ }
  };

  /* ── Sign In ── */
  const signIn = async ({ email, password }) => {
    /* Demo mode bypass */
    if (email.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      setUser(DEMO_USER);
      setProfile(DEMO_PROFILE);
      setIsDemoUser(true);
      sessionStorage.setItem('padel_demo_session', '1');
      return { user: DEMO_USER };
    }

    const sb = await getSupabase();
    if (!sb) throw new Error('Authentication service is currently offline. Use demo credentials to explore the site.');

    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  /* ── Sign Up ── */
  const signUp = async ({ email, password, firstName, lastName, phone }) => {
    const sb = await getSupabase();
    if (!sb) throw new Error('Registration is temporarily offline. Use demo credentials: demo@padel.co.za / Demo1234!');

    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName, phone } },
    });
    if (error) throw error;
    return data;
  };

  /* ── Sign Out ── */
  const signOut = async () => {
    if (isDemoUser) {
      sessionStorage.removeItem('padel_demo_session');
      setUser(null);
      setProfile(null);
      setIsDemoUser(false);
      return;
    }
    const sb = await getSupabase();
    if (sb) await sb.auth.signOut();
    setProfile(null);
  };

  /* ── Update Profile ── */
  const updateProfile = async (updates) => {
    if (isDemoUser) {
      setProfile(prev => ({ ...prev, ...updates }));
      return;
    }
    if (!user) return;
    const sb = await getSupabase();
    if (!sb) return;
    const { error } = await sb.from('profiles').update(updates).eq('id', user.id);
    if (error) throw error;
    setProfile(prev => ({ ...prev, ...updates }));
  };

  /* ── Reset Password ── */
  const resetPassword = async (email) => {
    const sb = await getSupabase();
    if (!sb) throw new Error('Service temporarily offline.');
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/padel-app/#/reset-password`,
    });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      isDemoUser,
      isLoggedIn: !!user,
      signUp,
      signIn,
      signOut,
      updateProfile,
      resetPassword,
      refetchProfile: async () => {
        if (user && !isDemoUser) {
          const sb = await getSupabase();
          if (sb) fetchProfile(sb, user.id);
        }
      },
    }}>
      {children}
    </AuthContext.Provider>
  );
};
