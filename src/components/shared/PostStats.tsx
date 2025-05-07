
type PostStatsProps = {
  post: {
    id: string;
    image_url: string;
    creator: {
      id: string;
      name: string;
      imageUrl: string;
    };
    // Add other stats-related fields like likes, comments, etc., if needed
  };
  userId: string;
};

const PostStats = ({ post }: PostStatsProps) => {
  // Your logic to show like counts, buttons, etc.
  return (
    <div>
      
      <p className="text-xs text-white">
  Post by {post.creator?.name || "Unknown"}
</p>

    </div>
  );
};

export default PostStats;
