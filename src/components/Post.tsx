import { useContext } from "react";
import type { Post } from "../pages/Home";
import { SessionContext } from "../SessionProvider";

export function Post(props: { posts: Post[] , onDeletePost: (postId: string) => void}) {
  const { posts,onDeletePost } = props;
  const {currentUser} = useContext(SessionContext)|| {currentUser: null};  // Provide a default value to avoid null context

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
      <div className="space-y-4">
        {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <p className="text-gray-800 mb-2">{post.content}</p>
                  <div className="text-sm text-gray-500">
                    <span>User Name: {post.user_metadata?.name}</span>
                    <span className="ml-4">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    <span>User ID: {post.user_id}</span>
                    <span>Current User ID: {currentUser?.id}</span>
                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="ml-4 bg-orange-400 text-white px-3 rounded hover:bg-orange-500 hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-orange-400"
                      disabled={post.user_id !== currentUser?.id}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No posts yet. Be the first to post!
              </p>
            )}
          </div>
        </div>
  )
}