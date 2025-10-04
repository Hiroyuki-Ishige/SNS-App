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

  async getPost(page: number, limit: number) {
    page = isNaN(page) || page < 1 ? 1 : page;
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const { data, error } = await supabase
      .from("posts_view")
      .select("id, content, user_id, created_at, user_metadata")
      .range(start, end)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  async getAllPost() {
    const { data, error } = await supabase
      .from("posts_view")
      .select("id, content, user_id, created_at, user_metadata")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  async delete(postId: string) {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      throw new Error(error.message);
    }
  },
};
