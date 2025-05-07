import { useEffect, useState } from "react";
import Loader from "@/components/shared/Loader";
import { PostCard } from "@/components/shared";
import { supabase } from "@/lib/supabase/SupabaseClient";
import { useUserContext } from "@/context/UserContext";

const Home = () => {
  const { user } = useUserContext();
  const [posts, setPosts] = useState<any[]>([]);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);

  const fetchPosts = async () => {
    setIsPostLoading(true);
    try {
      // Join posts with profiles on the creator field
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:creator (
            id,
            name,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });
      if (postsError) throw postsError;
      const postsWithCreators = postsData.map((post) => ({
        ...post,
        creator: {
          id: post.profiles.id,
          name: post.profiles.name,
          imageUrl: post.profiles.avatar_url,
        },
      }));
      setPosts(postsWithCreators);
    } catch (error: any) {
      console.log("Error fetching posts:", error.message);
      setError(error.message);
    } finally {
      setIsPostLoading(false);
    }
  };

  const fetchSavedPosts = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('saved_posts')
      .select('post_id')
      .eq('user_id', user.id);
    if (!error && data) {
      setSavedPostIds(data.map((item: any) => item.post_id));
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchSavedPosts();
    // eslint-disable-next-line
  }, [user?.id]);

  const handleToggleSave = async (postId: string) => {
    if (!user?.id) return;
    if (!savedPostIds.includes(postId)) {
      // Save post
      await supabase.from('saved_posts').insert({
        user_id: user.id,
        post_id: postId,
        saved_at: new Date().toISOString(),
      });
      setSavedPostIds((prev) => [...prev, postId]);
    } else {
      // Unsave post
      await supabase.from('saved_posts').delete().eq('user_id', user.id).eq('post_id', postId);
      setSavedPostIds((prev) => prev.filter((id) => id !== postId));
    }
  };

  if (error) {
    return <div className="text-red-500">Error loading posts: {error}</div>;
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts.map((post) => (
                <PostCard
                  post={post}
                  key={post.id}
                  isSaved={savedPostIds.includes(post.id)}
                  onToggleSave={() => handleToggleSave(post.id)}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
