import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../SessionProvider";
import { Navigate } from "react-router-dom";
import { SideMenu } from "../components/SideMenu";
import { postRepository } from "../repositories/post";

// Define the Post type
type Post = {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
};

export default function Home() {
  //React hooks
  const { currentUser } = useContext(SessionContext) || {
    currentUser: null,
    setCurrentUser: () => {},
  };
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  // Fetch posts when component loads
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const recentPosts = await postRepository.getAll();
        setPosts(recentPosts as Post[]); // ✅ Type assertion
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
    console.log("Posts:", posts);
  }, []);

  //Navigate to sign-in page if not logged in
  if (currentUser === null) return <Navigate to="/signin" />;

  //Handle posting content
  const post = async () => {
    if (!currentUser) {
      console.error("No current user found.");
      return;
    }
    try {
      // Assuming postRepository.create is an async function that takes content and userId
      await postRepository.create(content, currentUser.id);
      console.log("Post created successfully");
      setContent(""); // Clear the textarea after successful post
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#34D399] p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">SNS APP</h1>
          <button className="text-white hover:text-red-600">Logout</button>
        </div>
      </header>
      <div className="container mx-auto mt-6 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <textarea
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 mb-4 border-2 border-gray-200 rounded-md"
                placeholder="What's on your mind?"
                value={content}
              />
              <button
                onClick={post}
                className="bg-[#34D399] text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!content.trim()}
              >
                Post
              </button>
            </div>
            <div className="mt-4"></div>
          </div>
          <SideMenu />
        </div>

        {/* Recent Posts */}
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
                    <span>User Name: {post.user_id}</span>
                    <span className="ml-4">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
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
      </div>
    </div>
  );
}
