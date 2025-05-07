// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { v4 as uuidv4 } from 'uuid';

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import FileUploader from "../shared/FileUploader";
// import { PostValidation } from "@/lib/validation";
// import { useToast } from "../ui/use-toast";
// import Loader from "../shared/Loader";
// import { useUserContext } from "@/context/UserContext";
// import { supabase } from "@/lib/supabase/SupabaseClient";

// // Supabase Post CRUD functions
// const createPost = async (postData: any) => {
//   const { caption, location, file, tags, userId } = postData;
//   try {
//     const imageFile = file[0];
//     if (!imageFile) throw new Error("No image file provided");

//     // generate IDs & file names
//     const imageId = uuidv4();
//     const ext = imageFile.name.split('.').pop();
//     const fileName = `${imageId}.${ext}`;

//     // upload
//     const { data: uploadData, error: uploadError } = await supabase
//       .storage.from('media')
//       .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });

//     if (uploadError) throw uploadError;

//     // public URL
//     const { data: { publicUrl } } = supabase
//       .storage.from('media')
//       .getPublicUrl(fileName);

//     // tags → array
//     const tagArray = tags
//       .split(',')
//       .map((t: string) => t.trim())
//       .filter((t: string | any[]) => t.length);

//     // insert post
//     const { data, error } = await supabase
//       .from("posts")
//       .insert([{
//         id: uuidv4(),
//         creator: userId,
//         caption,
//         image_url: publicUrl,
//         image_id: imageId,
//         location,
//         tags: tagArray,
//         created_at: new Date().toISOString()
//       }]).select();

//     if (error) throw error;
//     return data![0];
//   } catch (err) {
//     console.error("Error creating post:", err);
//     return null;
//   }
// };

// const updatePost = async (postData: any) => {
//   const {
//     caption,
//     location,
//     file,
//     tags,
//     postId,
//     imageId: oldImageId,
//     imageUrl: oldImageUrl
//   } = postData;
//   try {
//     let imageUrl = oldImageUrl;
//     let imageId = oldImageId;

//     // if new file, upload and delete old
//     if (file?.length) {
//       const newId = uuidv4();
//       const imageFile = file[0];
//       const ext = imageFile.name.split('.').pop();
//       const fileName = `${newId}.${ext}`;

//       const { error: uploadError } = await supabase
//         .storage.from('media')
//         .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });
//       if (uploadError) throw uploadError;

//       const { data: { publicUrl } } = supabase
//         .storage.from('media')
//         .getPublicUrl(fileName);
//       imageUrl = publicUrl;
//       imageId = newId;

//       // remove old
//       const oldKey = oldImageUrl.split('/').pop();
//       if (oldKey) {
//         await supabase.storage.from('media').remove([oldKey]);
//       }
//     }

//     const tagArray = tags
//       .split(',')
//       .map((t: string) => t.trim())
//       .filter((t: string | any[]) => t.length);

//     const { data, error } = await supabase
//       .from("posts")
//       .update({
//         caption,
//         image_url: imageUrl,
//         image_id: imageId,
//         location,
//         tags: tagArray
//       })
//       .eq("id", postId)
//       .select();

//     if (error) throw error;
//     return data![0];
//   } catch (err) {
//     console.error("Error updating post:", err);
//     return null;
//   }
// };

// const PostForm = ({ post, action }: any) => {
//   const { user } = useUserContext();
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const [isLoadingCreate, setIsLoadingCreate] = useState(false);
//   const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(PostValidation),
//     defaultValues: {
//       caption: post?.caption || "",
//       file: [],
//       location: post?.location || "",
//       tags: post?.tags?.join(",") || "",
//     },
//   });

//   const onSubmit = form.handleSubmit(async (values) => {
//     if (post && action === "Update") {
//       setIsLoadingUpdate(true);
//       const updated = await updatePost({
//         ...values,
//         postId: post.id,
//         imageId: post.image_id,
//         imageUrl: post.image_url,
//       });
//       setIsLoadingUpdate(false);
//       if (!updated) return toast({ title: "Failed to update post", variant: "destructive" });
//       toast({ title: "Post updated successfully" });
//       return navigate(`/posts/${post.id}`);
//     }

//     setIsLoadingCreate(true);
//     const created = await createPost({ ...values, userId: user.id });
//     setIsLoadingCreate(false);
//     if (!created) return toast({ title: "Failed to create post", variant: "destructive" });
//     toast({ title: "Post created successfully" });
//     navigate("/");
//   });

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={onSubmit}
//         className="flex flex-col gap-6 w-full max-w-md mx-auto py-8 overflow-auto"
//       >
//         {/* Caption */}
//         <FormField
//           control={form.control}
//           name="caption"
//           render={({ field }) => (
//             <FormItem className="w-full">
//               <FormLabel>Caption</FormLabel>
//               <FormControl>
//                 <Textarea
//                   {...field}
//                   rows={2}
//                   className="min-h-[3rem] w-full bg-neutral-700 border border-neutral-500 text-white placeholder:text-neutral-300 rounded-md px-3 py-2"
//                   placeholder="Write your caption here…"
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Image upload box */}
//         <FormField
//           control={form.control}
//           name="file"
//           render={({ field }) => (
//             <FormItem className="w-full">
//               <FormLabel>Add Photos</FormLabel>
//               <FormControl>
//                 <div className="w-full min-h-[10rem] max-h-[16rem] flex items-center justify-center bg-neutral-900 rounded-md border border-neutral-700 overflow-y-auto">
//                   <FileUploader
//                     fieldChange={field.onChange}
//                     mediaUrl={post?.image_url}
//                   />
//                 </div>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Location */}
//         <FormField
//           control={form.control}
//           name="location"
//           render={({ field }) => (
//             <FormItem className="w-full">
//               <FormLabel>Location</FormLabel>
//               <FormControl>
//                 <Input {...field} placeholder="Where are you?" className="w-full" />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Tags */}
//         <FormField
//           control={form.control}
//           name="tags"
//           render={({ field }) => (
//             <FormItem className="w-full">
//               <FormLabel>Tags (comma-separated)</FormLabel>
//               <FormControl>
//                 <Input {...field} placeholder="e.g. Code, DevLife, Web3" className="w-full" />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         {/* Action buttons */}
//         <div className="flex justify-end gap-4 pt-4">
//           <Button
//             variant="secondary"
//             type="button"
//             onClick={() => navigate(-1)}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             disabled={isLoadingCreate || isLoadingUpdate}
//             className="bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             {isLoadingCreate || isLoadingUpdate ? <Loader /> : `${action === "Update" ? "Update" : "Create"} Post`}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// };

// export default PostForm;







































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
import { Textarea } from "@/components/ui/textarea";
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
    const imageFile = file[0];
    if (!imageFile) throw new Error("No image file provided");

    const imageId = uuidv4();
    const ext = imageFile.name.split('.').pop();
    const fileName = `${imageId}.${ext}`;

    const { data: uploadData, error: uploadError } = await supabase
      .storage.from('media')
      .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase
      .storage.from('media')
      .getPublicUrl(fileName);

    const tagArray = tags
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string | any[]) => t.length);

    const { data, error } = await supabase
      .from("posts")
      .insert([{
        id: uuidv4(),
        creator: userId,
        caption,
        image_url: publicUrl,
        image_id: imageId,
        location,
        tags: tagArray,
        created_at: new Date().toISOString()
      }]).select();

    if (error) throw error;
    return data![0];
  } catch (err) {
    console.error("Error creating post:", err);
    return null;
  }
};

const updatePost = async (postData: any) => {
  const {
    caption,
    location,
    file,
    tags,
    postId,
    imageId: oldImageId,
    imageUrl: oldImageUrl
  } = postData;
  try {
    let imageUrl = oldImageUrl;
    let imageId = oldImageId;

    if (file?.length) {
      const newId = uuidv4();
      const imageFile = file[0];
      const ext = imageFile.name.split('.').pop();
      const fileName = `${newId}.${ext}`;

      const { error: uploadError } = await supabase
        .storage.from('media')
        .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase
        .storage.from('media')
        .getPublicUrl(fileName);
      imageUrl = publicUrl;
      imageId = newId;

      const oldKey = oldImageUrl.split('/').pop();
      if (oldKey) {
        await supabase.storage.from('media').remove([oldKey]);
      }
    }

    const tagArray = tags
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string | any[]) => t.length);

    const { data, error } = await supabase
      .from("posts")
      .update({
        caption,
        image_url: imageUrl,
        image_id: imageId,
        location,
        tags: tagArray
      })
      .eq("id", postId)
      .select();

    if (error) throw error;
    return data![0];
  } catch (err) {
    console.error("Error updating post:", err);
    return null;
  }
};

const PostForm = ({ post, action }: any) => {
  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  const form = useForm({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post?.caption || "",
      file: [],
      location: post?.location || "",
      tags: post?.tags?.join(",") || "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (post && action === "Update") {
      setIsLoadingUpdate(true);
      const updated = await updatePost({
        ...values,
        postId: post.id,
        imageId: post.image_id,
        imageUrl: post.image_url,
      });
      setIsLoadingUpdate(false);
      if (!updated) return toast({ title: "Failed to update post", variant: "destructive" });
      toast({ title: "Post updated successfully" });
      return navigate(`/posts/${post.id}`);
    }

    setIsLoadingCreate(true);
    const created = await createPost({ ...values, userId: user.id });
    setIsLoadingCreate(false);
    if (!created) return toast({ title: "Failed to create post", variant: "destructive" });
    toast({ title: "Post created successfully" });
    navigate("/");
  });

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-6 w-full max-w-md mx-auto py-8 overflow-auto"
      >
        {/* Caption */}
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  className="w-full bg-neutral-800 text-white rounded-md border border-neutral-600 px-3 py-2"
                  placeholder="Write your caption here…"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Add Photos</FormLabel>
              <FormControl>
                <div className="w-full min-h-[10rem] max-h-[16rem] flex items-center justify-center bg-neutral-900 rounded-md border border-neutral-700 overflow-y-auto">
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={post?.image_url}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Where are you?" className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Tags (comma-separated)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Code, DevLife, Web3" className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="secondary" type="button" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoadingCreate || isLoadingUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoadingCreate || isLoadingUpdate ? <Loader /> : `${action === "Update" ? "Update" : "Create"} Post`}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
