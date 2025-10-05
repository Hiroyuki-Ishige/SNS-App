import { useContext, useEffect, useState } from "react";
import { SessionContext } from "../SessionProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { SideMenu } from "../components/SideMenu";
import { postRepository } from "../repositories/post";
import { Post } from "../components/Post";
import Pagenation from "../components/Pagenation";
import { authRepository } from "../repositories/auth";

// Define the Post type
export type Post = {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  user_metadata?: { name: string };
};

const postsPerPage = 5; // Number of posts per page

export default function Home() {
  //React hooks
  const { currentUser, setCurrentUser } = useContext(SessionContext) || {
    currentUser: null,
    setCurrentUser: () => {},
  };
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Fetch posts when component loads
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const recentPosts = await postRepository.getPost(
          currentPage,
          postsPerPage
        );
        setPosts(recentPosts as Post[]); // ✅ Type assertion
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
    totalPagesCalc();
  }, []);

  console.log("Fetched Posts at mount:", posts);

  //Navigate to sign-in page if not logged in
  if (currentUser === null) return <Navigate to="/signin" />;

  //Handle Signout
  const handleSignout = async () => {
    try {
      await authRepository.signout();
      setCurrentUser(null); // Clear current user in context
      navigate("/signin"); // Redirect to sign-in page
    } catch (error) {
      console.error("Signout error:", error);
    }
  };

  //Calculate total pages
  const totalPagesCalc = async () => {
    const totalPosts = async () => {
      try {
        const allPosts = await postRepository.getAllPost();
        return allPosts.length;
      } catch (error) {
        console.error("Error fetching all posts:", error);
        return 0;
      }
    };
    const totalPages = Math.ceil((await totalPosts()) / postsPerPage);
    setTotalPages(totalPages);
    console.log("Total Pages calculated:", totalPages);
    return totalPages;
  };

  //Handle posting content
  const post = async () => {
    if (!currentUser) {
      console.error("No current user found.");
      return;
    }
    try {
      await postRepository.create(content, currentUser.id);
      console.log("Post created successfully");
      setContent(""); // Clear the textarea after successful post

      // ✅ Refresh posts list after creating a new post
      const updatedPosts = await postRepository.getPost(
        currentPage,
        postsPerPage
      );

      setPosts(updatedPosts as Post[]);
      console.log("Posts refreshed after new post");
      totalPagesCalc(); // Update total pages after new post
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  //Handle delete post
  const deletePost = async (postId: string) => {
    if (!currentUser) {
      return;
    }
    try {
      await postRepository.delete(postId);

      // Refresh posts list after deleting a post
      const updatedPosts = await postRepository.getPost(
        currentPage,
        postsPerPage
      );
      setPosts(updatedPosts as Post[]);
      totalPagesCalc(); // Update total pages after deleting a post
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  //handle page change
  const nextPage = async () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    const updatedPosts = await postRepository.getPost(newPage, postsPerPage);
    setPosts(updatedPosts as Post[]);
  };
  const prevPage = async () => {
    if (currentPage === 1) return; // Prevent going to page 0 or negative
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    const updatedPosts = await postRepository.getPost(newPage, postsPerPage);
    setPosts(updatedPosts as Post[]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-[#34D399] p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">SNS APP</h1>
          <button
            onClick={handleSignout}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-200"
          >
            Logout
          </button>
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
        <Post posts={posts} onDeletePost={deletePost} />
        <div className="flex justify-center mt-4 px-4">
          <Pagenation
            onNext={nextPage}
            onPrev={prevPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
}
