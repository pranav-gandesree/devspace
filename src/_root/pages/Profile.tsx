// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import {
//   User,
//   MessageCircle,
//   Heart,
//   BookOpen,
//   Calendar,
//   MapPin,
//   Link as LinkIcon,
// } from 'lucide-react';
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL || '',
//   import.meta.env.VITE_SUPABASE_ANON_KEY || ''
// );

// interface UserData {
//   id: string;
//   name?: string;
//   full_name?: string;
//   username: string;
//   bio?: string;
//   avatar_url?: string;
//   location?: string;
//   website?: string;
//   created_at?: string;
//   followers?: number;
//   following?: number;
// }

// interface Post {
//   id: string;
//   user_id: string;
//   content: string;
//   image_url?: string;
//   created_at: string;
//   comment_count?: number;
//   like_count?: number;
//   save_count?: number;
// }

// const Profile = () => {
//   const { userId } = useParams<{ userId: string }>();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!userId) return;

//     let isMounted = true;

//     const fetchUserData = async () => {
//       try {
//         setLoading(true);

//         const { data: userData, error: userError } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('id', userId)
//           .single();

//         console.log("User data from profile is:", userData);
//         if (userError) throw userError;

//         const { data: postsData, error: postsError } = await supabase
//           .from('posts')
//           .select('*')
//           .eq('creator', userId)
//           .order('created_at', { ascending: false });

//         console.log("Posts data from profile is:", postsData);
//         if (postsError) throw postsError;

//         if (isMounted) {
//           setUserData(userData);
//           setPosts(postsData);
//           setLoading(false);
//         }
//       } catch (err: any) {
//         if (isMounted) {
//           setError(err.message || 'Failed to load profile');
//           setLoading(false);
//         }
//       }
//     };

//     fetchUserData();

//     return () => {
//       isMounted = false;
//     };
//   }, [userId]);

//   if (loading) {
//     return <div className="text-center mt-10 text-xl font-semibold">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center mt-10 text-red-500 text-xl">{error}</div>;
//   }

//   if (!userData) return null;

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       {/* Profile Header */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//         <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500"></div>
//         <div className="p-6 relative">
//           <div className="absolute -top-12 left-6">
//             <div className="w-24 h-24 rounded-full bg-white p-1">
//               {userData.avatar_url ? (
//                 <img
//                   src={userData.avatar_url}
//                   alt="Profile"
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
//                   <User size={40} className="text-gray-400" />
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="mt-12">
//             <h1 className="text-2xl font-bold">{userData.full_name || userData.name}</h1>
//             <p className="text-gray-500">@{userData.username}</p>
//             {userData.bio && <p className="mt-4 text-gray-700">{userData.bio}</p>}

//             <div className="mt-4 flex flex-wrap gap-4">
//               {userData.location && (
//                 <div className="flex items-center text-gray-600">
//                   <MapPin size={16} className="mr-1" />
//                   <span>{userData.location}</span>
//                 </div>
//               )}

//               {userData.website && (
//                 <div className="flex items-center text-blue-500">
//                   <LinkIcon size={16} className="mr-1" />
//                   <a
//                     href={userData.website}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     {userData.website.replace(/(^\w+:|^)\/\//, '')}
//                   </a>
//                 </div>
//               )}

//               {userData.created_at && (
//                 <div className="flex items-center text-gray-600">
//                   <Calendar size={16} className="mr-1" />
//                   <span>
//                     Joined{' '}
//                     {new Date(userData.created_at).toLocaleDateString('en-US', {
//                       month: 'long',
//                       year: 'numeric',
//                     })}
//                   </span>
//                 </div>
//               )}
//             </div>

//             <div className="mt-6 flex gap-4">
//               <div className="text-gray-700">
//                 <span className="font-bold">{userData.following || 0}</span>{' '}
//                 Following
//               </div>
//               <div className="text-gray-700">
//                 <span className="font-bold">{userData.followers || 0}</span>{' '}
//                 Followers
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Posts */}
//       <div className="space-y-6">
//         {posts.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">No posts yet</div>
//         ) : (
//           posts.map((post) => (
//             <div
//               key={post.id}
//               className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
//             >
//               <div className="flex items-start">
//                 <div className="mr-3">
//                   {userData.avatar_url ? (
//                     <img
//                       src={userData.avatar_url}
//                       alt="Avatar"
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                       <User size={20} className="text-gray-400" />
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex-1">
//                   <div className="flex items-center">
//                     <span className="font-semibold">{userData.name}</span>
//                     <span className="ml-2 text-gray-500">@{userData.username}</span>
//                     <span className="mx-1 text-gray-500">·</span>
//                     <span className="text-gray-500 text-sm">
//                       {new Date(post.created_at).toLocaleDateString('en-US', {
//                         month: 'short',
//                         day: 'numeric',
//                         year: 'numeric',
//                       })}
//                     </span>
//                   </div>

//                   <div className="mt-2">
//                     <p className="text-gray-800">{post.content}</p>
//                     {post.image_url && (
//                       <div className="mt-3">
//                         <img
//                           src={post.image_url}
//                           alt="Post"
//                           className="rounded-lg max-h-96 object-cover"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <div className="mt-4 flex items-center gap-6 text-gray-500">
//                     <div className="flex items-center hover:text-blue-500 cursor-pointer">
//                       <MessageCircle size={18} className="mr-1" />
//                       <span>{post.comment_count || 0}</span>
//                     </div>
//                     <div className="flex items-center hover:text-red-500 cursor-pointer">
//                       <Heart size={18} className="mr-1" />
//                       <span>{post.like_count || 0}</span>
//                     </div>
//                     <div className="flex items-center hover:text-green-500 cursor-pointer">
//                       <BookOpen size={18} className="mr-1" />
//                       <span>{post.save_count || 0}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;











import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  User,
  MessageCircle,
  Heart,
  BookOpen,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Home,
  Compass,
  Users,
  Bookmark,
  PenTool,
  LogOut
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
  user_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  comment_count?: number;
  like_count?: number;
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
    <div className="flex min-h-screen bg-black text-white">


      {/* Main Content */}
      <div className="flex-1">
        {/* Profile Header */}
        <div className="py-6 px-8 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center text-black text-2xl font-bold mr-4">
              AB
            </div>
            <div>
            <h1 className="text-2xl font-bold">{userData.name}</h1>
             
            </div>
          </div>
          <button className="px-3 py-2 border border-gray-700 rounded-md text-sm hover:bg-gray-800">
            Edit Profile
          </button>
        </div>

        {/* Stats */}
        <div className="px-8 py-4 flex space-x-6">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">5</span>
            <span className="text-gray-400">Posts</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">20</span>
            <span className="text-gray-400">Followers</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold">20</span>
            <span className="text-gray-400">Following</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 px-8">
          <div className="flex">
            <button 
              className={`py-3 px-4 ${activeTab === 'posts' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              <div className="flex items-center">
                <MessageCircle size={18} className="mr-2" />
                <span>Posts</span>
              </div>
            </button>
            <button 
              className={`py-3 px-4 ${activeTab === 'liked' ? 'border-b-2 border-blue-500' : ''}`}
              onClick={() => setActiveTab('liked')}
            >
              <div className="flex items-center">
                <Heart size={18} className="mr-2" />
                <span>Liked Posts</span>
              </div>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="p-8">
          <div className="grid grid-cols-3 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="relative rounded-lg overflow-hidden group">
                <img 
                  src={post.image_url} 
                  alt="Post" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-2 left-2 flex items-center space-x-3">
                  <div className="flex items-center text-white">
                    <Heart size={16} className="mr-1 fill-red-500 text-red-500" />
                    <span className="text-sm">{post.like_count}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <BookOpen size={16} className="mr-1" />
                    <span className="text-sm">{post.save_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;