
import PostForm from "@/components/forms/PostForm";

const CreatePost = () => {
  return (
    <div className="flex flex-1 items-center justify-center w-full">
      <div className="w-full max-w-lg mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
        </div>
        
        <PostForm />
      </div>
    </div>
  );
};

export default CreatePost;