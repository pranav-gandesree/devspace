// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Button } from '@/components/ui/button';
// import { supabase } from '@/lib/supabase/SupabaseClient';
// import { useToast } from '@/components/ui/use-toast';

// interface ProfileData {
//   id: string;
//   name?: string;
//   bio?: string;
//   avatar_url?: string;
//   location?: string;
//   website?: string;
// }

// const UpdateProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [profile, setProfile] = useState<ProfileData>({
//     id: '',
//     name: '',
//     bio: '',
//     avatar_url: '',
//     location: '',
//     website: '',
//   });

//   // Fetch profile data when component mounts
//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!id) return;

//       try {
//         setLoading(true);
//         const { data, error } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('id', id)
//           .single();

//         if (error) throw error;
        
//         // Update the profile state with fetched data
//         setProfile(data || {
//           id: id,
//           name: '',
          
//           bio: '',
//           avatar_url: '',
//           location: '',
//           website: '',
//         });
//       } catch (error: any) {
//         toast({
//           title: 'Error',
//           description: error.message || 'Failed to fetch profile',
//           variant: 'destructive',
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [id, toast]);

//   // Handle form input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setProfile((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle avatar upload
//   const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files || !e.target.files[0]) return;
    
//     const file = e.target.files[0];
//     const fileExt = file.name.split('.').pop();
//     const filePath = `avatars/${id}-${Date.now()}.${fileExt}`;
    
//     try {
//       setUploading(true);
      
//       // Upload the file to storage
//       const { error: uploadError } = await supabase.storage
//         .from('avatars')
//         .upload(filePath, file);
        
//       if (uploadError) throw uploadError;
      
//       // Get the public URL
//       const { data } = supabase.storage
//         .from('avatars')
//         .getPublicUrl(filePath);
        
//       // Update the avatar_url in the profile state
//       setProfile((prev) => ({ ...prev, avatar_url: data.publicUrl }));
//     } catch (error: any) {
//       toast({
//         title: 'Upload Failed',
//         description: error.message || 'An error occurred during upload',
//         variant: 'destructive',
//       });
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Save the updated profile
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     try {
//       setLoading(true);
      
//       // Update the profile in the database
//       const { error } = await supabase
//         .from('profiles')
//         .update({
//           name: profile.name,
        
//           bio: profile.bio,
//           avatar_url: profile.avatar_url,
//           location: profile.location,
//           website: profile.website,
//         })
//         .eq('id', id);
        
//       if (error) throw error;
      
//       toast({
//         title: 'Success',
//         description: 'Profile updated successfully',
//       });
      
//       // Navigate back to the profile page
//       navigate(`/profile/${id}`);
//     } catch (error: any) {
//       toast({
//         title: 'Update Failed',
//         description: error.message || 'Failed to update profile',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !profile.id) {
//     return <div className="flex items-center justify-center h-full">Loading...</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-8 ml-0 md:ml-64">
//       <h1 className="text-3xl font-bold mb-6">Update Profile</h1>
      
//       <form onSubmit={handleSubmit} className="space-y-6">

//         {/* Name */}
//         <div>
//           <label htmlFor="name" className="block mb-2 text-sm font-medium">Name</label>
//           <Input
//             id="name"
//             name="name"
//             value={profile.name || ''}
//             onChange={handleChange}
//             placeholder="Your name"
//             className="bg-gray-900 border-gray-700 text-white"
//           />
//         </div>

        

//         {/* Bio */}
//         <div>
//           <label htmlFor="bio" className="block mb-2 text-sm font-medium">Bio</label>
//           <Textarea
//             id="bio"
//             name="bio"
//             value={profile.bio || ''}
//             onChange={handleChange}
//             placeholder="Write a short bio about yourself"
//             className="bg-gray-900 border-gray-700 text-white min-h-[100px]"
//           />
//         </div>

//         {/* Location */}
//         <div>
//           <label htmlFor="location" className="block mb-2 text-sm font-medium">Location</label>
//           <Input
//             id="location"
//             name="location"
//             value={profile.location || ''}
//             onChange={handleChange}
//             placeholder="Your location"
//             className="bg-gray-900 border-gray-700 text-white"
//           />
//         </div>

//         {/* Website */}
//         <div>
//           <label htmlFor="website" className="block mb-2 text-sm font-medium">Website</label>
//           <Input
//             id="website"
//             name="website"
//             value={profile.website || ''}
//             onChange={handleChange}
//             placeholder="Your website URL"
//             className="bg-gray-900 border-gray-700 text-white"
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end space-x-4 pt-4">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => navigate(`/profile/${id}`)}
//             className="border-gray-700 text-white hover:bg-gray-800"
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             disabled={loading || uploading}
//             className="bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             {loading || uploading ? 'Saving...' : 'Save Changes'}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateProfile;





































import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/SupabaseClient';
import { useToast } from '@/components/ui/use-toast';

interface ProfileData {
  id: string;
  name?: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  website?: string;
}

const UpdateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    id: '',
    name: '',
    bio: '',
    avatar_url: '',
    location: '',
    website: '',
  });

  // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        // Update the profile state with fetched data
        setProfile(data || {
          id: id,
          name: '',
          bio: '',
          avatar_url: '',
          location: '',
          website: '',
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch profile',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, toast]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${id}-${Date.now()}.${fileExt}`;
    
    try {
      setUploading(true);
      
      // Upload the file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update the avatar_url in the profile state
      setProfile((prev) => ({ ...prev, avatar_url: data.publicUrl }));
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.message || 'An error occurred during upload',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  // Save the updated profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Update the profile in the database
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          location: profile.location,
          website: profile.website,
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      
      // Navigate back to the profile page
      navigate(`/profile/${id}`);
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.id) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-950 pt-8 px-10 ml-0 md:ml-64 w-full">
      <div className="w-full max-w-lg bg-gray-900 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">Update Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">Name</label>
            <Input
              id="name"
              name="name"
              value={profile.name || ''}
              onChange={handleChange}
              placeholder="Your name"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block mb-2 text-sm font-medium text-white">Bio</label>
            <Textarea
              id="bio"
              name="bio"
              value={profile.bio || ''}
              onChange={handleChange}
              placeholder="Write a short bio about yourself"
              className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block mb-2 text-sm font-medium text-white">Location</label>
            <Input
              id="location"
              name="location"
              value={profile.location || ''}
              onChange={handleChange}
              placeholder="Your location"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block mb-2 text-sm font-medium text-white">Website</label>
            <Input
              id="website"
              name="website"
              value={profile.website || ''}
              onChange={handleChange}
              placeholder="Your website URL"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

         
          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/profile/${id}`)}
              className="border-gray-600 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading || uploading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;