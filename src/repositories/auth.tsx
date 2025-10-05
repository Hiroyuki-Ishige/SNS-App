import { supabase } from "../lib/supabase";

export const authRepository = {
  async signup(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error != null) throw Error(error.message);
    return {
      ...data.user,
      userName: data.user?.user_metadata?.name ?? null,
      error: null,
    };
  },

  async signin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error != null) throw Error(error.message);
    return {
      ...data.user,
      userName: data.user?.user_metadata?.name ?? null,
      error: null,
    };
  },

  async signout() {
    const { error } = await supabase.auth.signOut();
    if (error != null) throw Error(error.message);
    return { success: true };
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getSession();
    if (error != null) throw Error(error.message);
    if (data.session == null) return null;
    return {
      ...data.session.user,
      userName: data.session.user?.user_metadata?.name ?? null,
      
    };
  },
}
