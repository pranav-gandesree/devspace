import { useEffect, useState } from 'react';
import { useUserContext } from '@/context/UserContext';
import { IPost } from '@/types';
import PostCard from '@/components/shared/PostCard';

const Saved = () => {
  const { user } = useUserContext();
  const [savedPosts, setSavedPosts] = useState<IPost[]>([]);
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!user?.id) return;
      setLoading(true);
      const { supabase } = await import('@/lib/supabase/SupabaseClient');
      // Fetch saved posts for the user, join with posts
      const { data, error } = await supabase
        .from('saved_posts')
        .select('id, post_id, posts:post_id(*)')
        .eq('user_id', user.id);
      if (error) {
        setLoading(false);
        return;
      }
      // Extract posts and ids from the join
      const posts = (data || []).map((item: any) => item.posts).filter(Boolean);
      const postIds = (data || []).map((item: any) => item.post_id);
      setSavedPosts(posts);
      setSavedPostIds(postIds);
      setLoading(false);
    };
    fetchSavedPosts();
  }, [user?.id]);

  const handleToggleSave = async (postId: string) => {
    if (!user?.id) return;
    const { supabase } = await import('@/lib/supabase/SupabaseClient');
    // Unsave: remove from saved_posts
    await supabase.from('saved_posts').delete().eq('user_id', user.id).eq('post_id', postId);
    setSavedPosts((prev) => prev.filter((p) => p.id !== postId));
    setSavedPostIds((prev) => prev.filter((id) => id !== postId));
  };

  if (loading) return (
    <div className="flex-center w-full h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-2 md:px-4 ml-0 md:ml-64">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Saved Posts</h1>
        
        {savedPosts.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-lg">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-semibold mb-2">No Saved Posts Yet</h2>
            <p className="text-gray-400">Posts you save will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isSaved={savedPostIds.includes(post.id)}
                onToggleSave={() => handleToggleSave(post.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Saved
