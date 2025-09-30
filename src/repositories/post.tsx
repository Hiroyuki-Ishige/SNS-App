import { supabase } from "../lib/supabase";

export const postRepository = {
  // Define methods for postRepository as needed
  async create(content: string, userId: string) {
    const { data, error } = await supabase
      .from("posts")
      .insert([{ content, user_id: userId }])
      .select();
    if (error) {
      throw new Error(error.message);
    }
    // Example method to create a post
    return {
      ...data[0],
    };
  },

  async getAll() {
    const { data, error } = await supabase
      .from("posts")
      .select("id, content, user_id, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },
};
