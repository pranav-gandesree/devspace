import { useUserContext } from "@/context/UserContext";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { IUser } from "@/types";

type GridPostListProps = {
  posts?: {
    id: string;
    image_url: string;
    creator: IUser;
  }[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

  return (
    <ul className="grid-container">
      {posts?.map((post) => (
          
        <li key={post.id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.id}`} className="grid-post_link">
            <img
              src={post.image_url}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && post.creator && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt={post.creator.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}
            {showStats && user?.id && 
            
            <PostStats
  post={{
    id: post.id, 
    image_url: post.image_url,
    creator: {
      id: post.creator.id,
      name: post.creator.name,
      imageUrl: post.creator.imageUrl,
    },
  }}
  userId={user.id}
/>

            
            
            
            }
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
