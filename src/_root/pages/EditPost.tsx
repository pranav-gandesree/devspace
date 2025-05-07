import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { supabase } from "@/lib/supabase/SupabaseClient";

const EditPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-center w-full h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start">
          <img
            src="/assets/icons/edit.svg"
            alt="edit"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        <PostForm post={post} action="Update" />
      </div>
    </div>
  );
};

export default EditPost;
