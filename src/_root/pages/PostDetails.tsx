

import { useEffect, useState } from "react";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/UserContext"; // Use your custom UserContext
import { multiFormatDateString } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase/SupabaseClient"; // Ensure Supabase client is imported

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useUserContext(); // Get the authenticated user
  const [post, setPost] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [isPending, setIsPending] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const navigate = useNavigate();

  // Fetch post and creator data on component mount
  // useEffect(() => {
  //   const fetchPostData = async () => {
  //     setIsPending(true);
  //     setError(null); // Reset error state before new fetch
      
  //     try {
  //       // Fetch post data
  //       const { data: postData, error: postError } = await supabase
  //         .from("posts")
  //         .select("*")
  //         .eq("id", id)
  //         .single();
        
  //       if (postError) {
  //         throw postError;
  //       }
        
  //       console.log("Post data from post details is:", postData);
  //       setPost(postData);
        
  //       // Skip trying to fetch creator data since the users table doesn't exist
        
  //     } catch (error) {
  //       setError("Error fetching post data.");
  //       console.error("Error fetching post data:", error);
  //     } finally {
  //       setIsPending(false);
  //     }
  //   };
    
  //   fetchPostData();
  // }, [id, supabase]);


  useEffect(() => {
    const fetchPostData = async () => {
      setIsPending(true);
      setError(null); // Reset error state before new fetch
      
      try {
        // Fetch post data
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();
        
        if (postError) {
          throw postError;
        }
        
        setPost(postData);
        
        // Check if users table exists before trying to fetch creator data
        const { error: tableCheckError } = await supabase
          .from("profiles")
          .select("postData.creator")
          .limit(1);
        
        // If users table exists, fetch creator data
        if (!tableCheckError) {
          const { data: creatorData, error: creatorError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", postData.creator) // Use creator instead of creator_id
            .single();
          
          if (!creatorError) {
            setCreator(creatorData);
          }
        }
        
      } catch (error) {
        setError("Error fetching post data.");
        console.error("Error fetching post data:", error);
      } finally {
        setIsPending(false);
      }
    };
    
    fetchPostData();
  }, [id, supabase]);




  // Handle post deletion
 
 
  const handleDeletePost = async () => {
    if (!post) return;

    const { error } = await supabase.from("posts").delete().eq("id", post.id);

    if (error) {
      console.error("Error deleting post:", error);
      setError("Error deleting post.");
    } else {
      navigate(-1); // Go back to the previous page after deletion
    }
  };

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : error ? (
        <p className="text-center text-red-500">{error}</p> // Show error message if data fetch fails
      ) : (
        <div className="post_details-card">
          <img src={post?.image_url} alt="post" className="post_details-img" />
          <div className="post_details-info">
            <div className="flex-between w-full">
              {/* Link to profile page of the creator */}
              <Link to={`/profile/${creator?.id}`} className="flex items-center gap-3">
                <img
                  src={creator?.image_url || "/assets/icons/profile-picture.svg"}
                  alt="creator"
                  className="rounded-full w-9 h-9 lg:h-12 lg:w-12"
                />
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {creator?.name || "Unknown User"}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">{multiFormatDateString(post?.created_at)}</p>
                    {post?.location && <p className="mb-0.5">•</p>}
                    <p className="subtle-semibold lg:small-regular">{post?.location}</p>
                  </div>
                </div>
              </Link>

              {/* Edit and delete buttons */}
              <div className="flex-center">
                <Link to={`/update-post/${post?.id}`} className={`${user.id !== creator?.id && "hidden"}`}>
                  <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${user.id !== creator?.id && "hidden"}`}
                >
                  <img src="/assets/icons/delete.svg" alt="delete" width={24} height={24} />
                </Button>
              </div>
            </div>
            <hr className="border w-full border-dark-4/80" />
            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags?.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            {/* Display PostStats */}
            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
