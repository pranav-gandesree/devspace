import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { useToast } from "../ui/use-toast";
import Loader from "../shared/Loader";
import { useUserContext } from "@/context/UserContext";
import { supabase } from "@/lib/supabase/SupabaseClient";

// Supabase Post CRUD functions
const createPost = async (postData: any) => {
  const { caption, location, file, tags, userId } = postData;
  
  try {
    // 1. First upload the image to Supabase storage
    const imageFile = file[0];
    if (!imageFile) throw new Error("No image file provided");
    
    // Generate unique image ID
    const imageId = uuidv4();
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${imageId}.${fileExt}`;
    
    // Note: Uploading directly to root of bucket - no subfolder
    const filePath = fileName;
    
    console.log("Uploading file:", {
      fileName,
      fileType: imageFile.type,
      fileSize: imageFile.size
    });
    
    // Upload the file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('media') // Your bucket name
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      console.error("Upload error details:", uploadError);
      throw uploadError;
    }
    
    console.log("Upload successful:", uploadData);
    
    // 2. Get the public URL for the uploaded image
    const { data: { publicUrl } } = supabase
      .storage
      .from('media')
      .getPublicUrl(filePath);
      
    // 3. Parse tags from comma-separated string to array
    const tagArray = tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '');
    
    // 4. Insert the post data into the posts table
    const { data, error } = await supabase
      .from("posts")
      .insert([{
        id: uuidv4(), // Generate UUID for the post
        creator: userId,
        caption,
        image_url: publicUrl,
        image_id: imageId,
        location,
        tags: tagArray,
        created_at: new Date().toISOString()
      }])
      .select();
      
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
};

const updatePost = async (postData: any) => {
  const { caption, location, file, tags, postId, imageId: existingImageId, imageUrl: existingImageUrl } = postData;
  
  try {
    let imageUrl = existingImageUrl;
    let newImageId = existingImageId;
    
    // If a new file is provided, update the image
    if (file && file.length > 0) {
      // Generate unique image ID
      newImageId = uuidv4();
      const imageFile = file[0];
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${newImageId}.${fileExt}`;
      const filePath = fileName;
      
      // Upload the new file to the correct bucket
      const { error: uploadError } = await supabase
        .storage
        .from('media')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) throw uploadError;
      
      // Get the new public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('media')
        .getPublicUrl(filePath);
        
      imageUrl = publicUrl;
      
      // Delete the old image if it exists
      if (existingImageId) {
        const oldFilePath = existingImageUrl.split('/').pop();
        if (oldFilePath) {
          await supabase
            .storage
            .from('media')
            .remove([oldFilePath]);
        }
      }
    }
    
    // Parse tags from comma-separated string to array
    const tagArray = tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag !== '');
    
    // Update the post in the database
    const { data, error } = await supabase
      .from("posts")
      .update({
        caption,
        image_url: imageUrl,
        image_id: newImageId,
        location,
        tags: tagArray
      })
      .eq("id", postId)
      .select();
      
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  }
};

const PostForm = ({ post, action }: any) => {
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Loading states
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  // Define your form
  const form = useForm({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags.join(",") : "",
    },
  });

  // Submit handler
  async function onSubmit(values: any) {
    if (post && action === "Update") {
      setIsLoadingUpdate(true);
      
      const updatedPost = await updatePost({
        ...values,
        postId: post.id,
        imageId: post?.image_id,
        imageUrl: post?.image_url,
      });
      
      setIsLoadingUpdate(false);

      if (!updatedPost) {
        toast({
          title: "Failed to update post",
          description: "Please try again later",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Post updated successfully",
      });
      
      return navigate(`/posts/${post.id}`);
    }

    setIsLoadingCreate(true);

    const newPost = await createPost({
      ...values,
      userId: user.id,
    });

    setIsLoadingCreate(false);
    
    if (!newPost) {
      toast({
        title: "Failed to create post",
        description: "Please try again later",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Post created successfully",
    });
    
    navigate("/");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  placeholder="Write Your Caption Here ...."
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.image_url}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Where Are You?"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma ' , ')
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Code, DevLife, Web3"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {isLoadingCreate || isLoadingUpdate ? (
              <div className="flex-center gap-5">
                <Loader />
              </div>
            ) : (
              <div className="flex-center gap-5">{action} Post</div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;