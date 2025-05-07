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
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string) => (
              <li key={tag} className="text-light-3">#{tag}</li>
            ))}
          </ul>
        </div>
        <img
          src={post.image_url || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      <div className="flex gap-4 items-center px-4 py-2">
        {/* Love (heart) icon - static */}
        <img src="/assets/icons/like.svg" alt="love" width={24} height={24} style={{ cursor: 'pointer' }} />
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
