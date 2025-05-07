import { Link } from "react-router-dom";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/UserContext";
// import PostStats from "./PostStats";
import { IPost } from "@/types";
import React from "react";

type PostCardProps = {
  post: IPost;
  isSaved?: boolean;
  onToggleSave?: () => void;
};

const PostCard = ({ post, isSaved = false, onToggleSave }: PostCardProps) => {
  const { user } = useUserContext();
  const [localSaved, setLocalSaved] = React.useState(isSaved);
  const [isLiked, setIsLiked] = React.useState(false);

  React.useEffect(() => {
    setLocalSaved(isSaved);
  }, [isSaved]);

  if (!post.creator) return null;

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onToggleSave) {
      onToggleSave();
      return;
    }
    if (!user?.id) return;
    const { supabase } = await import('@/lib/supabase/SupabaseClient');
    if (!localSaved) {
      // Save post
      await supabase.from('saved_posts').insert({
        user_id: user.id,
        post_id: post.id,
        saved_at: new Date().toISOString(),
      });
      setLocalSaved(true);
    } else {
      // Unsave post
      await supabase.from('saved_posts').delete().eq('user_id', user.id).eq('post_id', post.id);
      setLocalSaved(false);
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // This just handles the frontend toggle without backend updates
    setIsLiked(!isLiked);
  };

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.id}`}>
            <img
              src={post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="creator"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">{post.creator.name}</p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.created_at)}
              </p>
              {post.location && <p className="mb-0.5">•</p>}
              <p className="subtle-semibold lg:small-regular">{post.location}</p>
            </div>
          </div>
        </div>
        {user?.id === post.creator.id && (
          <Link to={`/update-post/${post.id}`}>
            <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
          </Link>
        )}
      </div>

      <Link to={`/posts/${post.id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>

          <div className="flex flex-wrap gap-1 mt-2">
            {(() => {
              let tagsArray: string[] = [];
              if (Array.isArray(post.tags)) {
                tagsArray = post.tags as string[];
              } else if (typeof post.tags === "string") {
                tagsArray = (post.tags as string).split(',').map(tag => tag.trim());
              }
              
              // Clean up tags that might be in array string format like "['tag1']"
              return tagsArray.map((tag: string) => {
                // Remove any array notation, quotes, brackets
                const cleanTag = tag.toString().replace(/[\[\]'"]/g, '');
                return cleanTag ? (
                  <span key={cleanTag} className="text-light-3">#{cleanTag}</span>
                ) : null;
              });
            })()}
          </div>
        </div>
        <img
          src={post.image_url || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      <div className="flex gap-4 items-center px-4 py-2">
        {/* Like (heart) icon - toggleable */}
        <div onClick={handleLikeClick} style={{ cursor: 'pointer' }}>
          {isLiked ? (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="#e11d48" 
              stroke="#e11d48" 
              strokeWidth="1" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          )}
        </div>
        
        {/* Bookmark (save) icon */}
        <img
          src={localSaved ? "/assets/icons/saved.svg" : "/assets/icons/bookmark.svg"}
          alt={localSaved ? "saved" : "save"}
          width={24}
          height={24}
          style={{ cursor: 'pointer', filter: localSaved ? 'drop-shadow(0 0 2px #6366f1)' : 'none' }}
          onClick={handleSaveClick}
        />
      </div>

      {/* {user?.id && <PostStats post={post} userId={user.id} />} */}
    </div>
  );
};

export default PostCard;
