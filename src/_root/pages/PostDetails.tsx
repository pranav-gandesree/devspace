
// import { useEffect, useState } from "react";
// import Loader from "@/components/shared/Loader";
// import PostStats from "@/components/shared/PostStats";
// import { Button } from "@/components/ui/button";
// import { useUserContext } from "@/context/UserContext";
// import { multiFormatDateString } from "@/lib/utils";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { supabase } from "@/lib/supabase/SupabaseClient";

// const PostDetails = () => {
//   const { id } = useParams();
//   const { user } = useUserContext();
//   const [post, setPost] = useState<any>(null);
//   const [isPending, setIsPending] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPostData = async () => {
//       setIsPending(true);
//       setError(null);
      
//       try {
//         // Fetch post data
//         const { data: postData, error: postError } = await supabase
//           .from("posts")
//           .select("*")
//           .eq("id", id)
//           .single();
        
//         if (postError) {
//           throw postError;
//         }
//         console.log("Post data from post details is:", postData);
//         setPost(postData);
        
//       } catch (error) {
//         setError("Error fetching post data.");
//         console.error("Error fetching post data:", error);
//       } finally {
//         setIsPending(false);
//       }
//     };
    
//     fetchPostData();
//   }, [id]);

//   const handleDeletePost = async () => {
//     if (!post) return;

//     const { error } = await supabase.from("posts").delete().eq("id", post.id);

//     if (error) {
//       console.error("Error deleting post:", error);
//       setError("Error deleting post.");
//     } else {
//       navigate(-1); 
//     }
//   };

//   return (
//     <div className="post_details-container">
//       {isPending ? (
//         <Loader />
//       ) : error ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : (
//         <div className="post_details-card">
//           <img src={post?.image_url} alt="post" className="post_details-img" />
//           <div className="post_details-info">
//             <div className="flex-between w-full">
//               {/* Creator info without fetching from profiles table */}
//               <div className="flex items-center gap-3">
//                 <img
//                   src="/assets/icons/profile-picture.svg"
//                   alt="creator"
//                   className="rounded-full w-9 h-9 lg:h-12 lg:w-12"
//                 />
//                 <div className="flex flex-col">
//                   <p className="base-medium lg:body-bold text-light-1">
//                     {post?.creator_name || "User " + post?.creator?.substring(0, 8)}
//                   </p>
//                   <div className="flex-center gap-2 text-light-3">
//                     <p className="subtle-semibold lg:small-regular">{multiFormatDateString(post?.created_at)}</p>
//                     {post?.location && <p className="mb-0.5">•</p>}
//                     <p className="subtle-semibold lg:small-regular">{post?.location}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Edit and delete buttons */}
//               <div className="flex-center">
//                 <Link to={`/update-post/${post?.id}`} className={`${user.id !== post?.creator && "hidden"}`}>
//                   <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
//                 </Link>
//                 <Button
//                   onClick={handleDeletePost}
//                   variant="ghost"
//                   className={`ghost_details-delete_btn ${user.id !== post?.creator && "hidden"}`}
//                 >
//                   <img src="/assets/icons/delete.svg" alt="delete" width={24} height={24} />
//                 </Button>
//               </div>
//             </div>
//             <hr className="border w-full border-dark-4/80" />
//             <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
//               <p>{post?.caption}</p>
//               <ul className="flex gap-1 mt-2">
//                 {post?.tags?.map((tag: string) => (
//                   <li key={tag} className="text-light-3">
//                     #{tag}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             {/* Display PostStats */}
//             <div className="w-full">
//               <PostStats post={post} userId={user.id} />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PostDetails;




























// import { useEffect, useState } from "react";
// import Loader from "@/components/shared/Loader";
// import PostStats from "@/components/shared/PostStats";
// import { Button } from "@/components/ui/button";
// import { useUserContext } from "@/context/UserContext";
// import { multiFormatDateString } from "@/lib/utils";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { supabase } from "@/lib/supabase/SupabaseClient";

// const PostDetails = () => {
//   const { id } = useParams();
//   const { user } = useUserContext();
//   const [post, setPost] = useState<any>(null);
//   const [creator, setCreator] = useState<any>(null);
//   const [isPending, setIsPending] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPostData = async () => {
//       setIsPending(true);
//       setError(null);
      
//       try {
//         // Fetch post data
//         const { data: postData, error: postError } = await supabase
//           .from("posts")
//           .select("*")
//           .eq("id", id)
//           .single();
        
//         if (postError) {
//           throw postError;
//         }
//         console.log("Post data from post details is:", postData);
//         setPost(postData);
        
//         // Now fetch the creator's profile data
//         if (postData?.creator) {
//           const { data: creatorData, error: creatorError } = await supabase
//             .from("profiles")
//             .select("id, name, image_url")
//             .eq("id", postData.creator)
//             .single();
          
//           if (creatorError) {
//             console.error("Error fetching creator data:", creatorError);
//             // Don't throw error here, just log it and continue
//           } else {
//             setCreator(creatorData);
//           }
//         }
        
//       } catch (error) {
//         setError("Error fetching post data.");
//         console.error("Error fetching post data:", error);
//       } finally {
//         setIsPending(false);
//       }
//     };
    
//     fetchPostData();
//   }, [id]);

//   const handleDeletePost = async () => {
//     if (!post) return;

//     const { error } = await supabase.from("posts").delete().eq("id", post.id);

//     if (error) {
//       console.error("Error deleting post:", error);
//       setError("Error deleting post.");
//     } else {
//       navigate(-1); // Go back to the previous page after deletion
//     }
//   };

//   return (
//     <div className="post_details-container">
//       {isPending ? (
//         <Loader />
//       ) : error ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : (
//         <div className="post_details-card">
//           <img src={post?.image_url} alt="post" className="post_details-img" />
//           <div className="post_details-info">
//             <div className="flex-between w-full">
//               {/* Link to profile page of the creator */}
//               <Link to={`/profile/${post?.creator}`} className="flex items-center gap-3">
//                 <img
//                   src={creator?.image_url || "/assets/icons/profile-picture.svg"}
//                   alt="creator"
//                   className="rounded-full w-9 h-9 lg:h-12 lg:w-12"
//                 />
//                 <div className="flex flex-col">
//                   <p className="base-medium lg:body-bold text-light-1">
//                     {creator?.name || "User " + post?.creator?.substring(0, 8)}
//                   </p>
//                   <div className="flex-center gap-2 text-light-3">
//                     <p className="subtle-semibold lg:small-regular">{multiFormatDateString(post?.created_at)}</p>
//                     {post?.location && <p className="mb-0.5">•</p>}
//                     <p className="subtle-semibold lg:small-regular">{post?.location}</p>
//                   </div>
//                 </div>
//               </Link>

//               {/* Edit and delete buttons */}
//               <div className="flex-center">
//                 <Link to={`/update-post/${post?.id}`} className={`${user?.id !== post?.creator && "hidden"}`}>
//                   <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
//                 </Link>
//                 <Button
//                   onClick={handleDeletePost}
//                   variant="ghost"
//                   className={`ghost_details-delete_btn ${user?.id !== post?.creator && "hidden"}`}
//                 >
//                   <img src="/assets/icons/delete.svg" alt="delete" width={24} height={24} />
//                 </Button>
//               </div>
//             </div>
//             <hr className="border w-full border-dark-4/80" />
//             <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
//               <p>{post?.caption}</p>
//               <ul className="flex gap-1 mt-2">
//                 {post?.tags?.map((tag: string) => (
//                   <li key={tag} className="text-light-3">
//                     #{tag}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             {/* Display PostStats */}
//             <div className="w-full">
//               <PostStats post={post} userId={user.id} />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PostDetails;





















import { useEffect, useState } from "react";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/UserContext";
import { multiFormatDateString } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase/SupabaseClient";

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const [post, setPost] = useState<any>(null);
  const [creator, setCreator] = useState<any>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostData = async () => {
      setIsPending(true);
      setError(null);
      
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
        
        // Now fetch the creator's profile data
        if (postData?.creator) {
          const { data: creatorData, error: creatorError } = await supabase
            .from("profiles")
            .select("*")  // Select all columns to avoid missing column errors
            .eq("id", postData.creator)
            .single();
          
          if (creatorError) {
            console.error("Error fetching creator data:", creatorError);
            // Don't throw error here, just log it and continue
          } else {
            console.log("Creator data fetched successfully:", creatorData);
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
  }, [id]);

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
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="post_details-card">
          <img src={post?.image_url} alt="post" className="post_details-img" />
          <div className="post_details-info">
            <div className="flex-between w-full">
              {/* Link to profile page of the creator */}
              <Link to={`/profile/${post?.creator}`} className="flex items-center gap-3">
                <img
                  src={creator?.avatar_url || "/assets/icons/profile-picture.svg"}
                  alt="creator"
                  className="rounded-full w-9 h-9 lg:h-12 lg:w-12"
                />
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {creator?.name || creator?.username || creator?.full_name || "User " + post?.creator?.substring(0, 8)}
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
                <Link to={`/update-post/${post?.id}`} className={`${user?.id !== post?.creator && "hidden"}`}>
                  <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${user?.id !== post?.creator && "hidden"}`}
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
            {/* <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;