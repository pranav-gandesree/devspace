import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  MessageCircle,
  Heart,

} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface UserData {
  id: string;
  name?: string;
  full_name?: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  website?: string;
  created_at?: string;
  followers?: number;
  following?: number;
}

interface Post {
  id: string;
  creator: string;
  caption: string;
  image_url?: string;
  created_at: string;
  save_count?: number;
}

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const fetchUserData = async () => {
      try {
        setLoading(true);

        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) throw userError;

        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .eq('creator', userId)
          .order('created_at', { ascending: false });

          console.log("post data from proifle ew",postsData);

        if (postsError) throw postsError;

        if (isMounted) {
          setUserData(userData);
          setPosts(postsData);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load profile');
          setLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (loading) {
    return <div className="text-center mt-10 text-xl font-semibold text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500 text-xl">{error}</div>;
  }

  if (!userData) return null;

  // Mock post data to match the screenshot

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 ml-64">
        {/* Profile Header */}
        <div className="py-8 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-orange-400 flex items-center justify-center text-black text-3xl font-bold">
              {userData.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
              <p className="text-gray-400">{userData.bio || 'No bio yet'}</p>
            </div>
          </div>
          <button className="px-6 py-2 border border-gray-700 rounded-md text-sm hover:bg-gray-800 transition-colors">
            Edit Profile
          </button>
        </div>

        {/* Stats */}
        <div className="py-6 flex space-x-12 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-xl">{posts.length}</span>
            <span className="text-gray-400">Posts</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-xl">{userData.followers || 0}</span>
            <span className="text-gray-400">Followers</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-xl">{userData.following || 0}</span>
            <span className="text-gray-400">Following</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800">
          <div className="flex justify-center space-x-8">
            <button 
              className={`py-4 px-6 ${activeTab === 'posts' ? 'border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('posts')}
            >
              <div className="flex items-center">
                <MessageCircle size={20} className="mr-2" />
                <span>Posts</span>
              </div>
            </button>
            <button 
              className={`py-4 px-6 ${activeTab === 'liked' ? 'border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('liked')}
            >
              <div className="flex items-center">
                <Heart size={20} className="mr-2" />
                <span>Liked Posts</span>
              </div>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                {post.image_url && (
                  <>
                    <div className="relative aspect-square">
                      <img 
                        src={post.image_url} 
                        alt="Post" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-gray-200 text-lg mb-4 line-clamp-2">{post.caption}</p>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <Heart size={16} />
                          <span>{post.save_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;