import { useState, useEffect } from "react";
import GridPostList from "@/components/shared/GridPostList";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/SupabaseClient";
import { useInView } from "react-intersection-observer";

const Explore = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchedPosts, setSearchedPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const { inView } = useInView();

  // Helper: merge profile info into posts
  const mergeProfiles = (postsData: any[], profiles: any[]) => {
    const profileMap = new Map(profiles.map((p) => [p.id, p]));
    return postsData.map((post) => ({
      ...post,
      creator: {
        id: post.creator,
        name: profileMap.get(post.creator)?.name || "Unknown",
        imageUrl: profileMap.get(post.creator)?.avatar_url || null,
      },
    }));
  };

  // Fetch posts with creators
  const fetchPosts = async (page: number) => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .range((page - 1) * 10, page * 10 - 1);

      if (postsError) throw postsError;

      const creatorIds = [...new Set(postsData.map((p) => p.creator))];
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", creatorIds);

      if (profilesError) throw profilesError;

      const enrichedPosts = mergeProfiles(postsData, profiles);
      setPosts((prev) => [...prev, ...enrichedPosts]);
    } catch (err: any) {
      console.error("Error fetching posts:", err.message);
    }
  };

  // Search posts and fetch creators
  const fetchSearchedPosts = async (query: string) => {
    if (!query) {
      setSearchedPosts([]);
      return;
    }

    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .ilike("caption", `%${query}%`)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      const creatorIds = [...new Set(postsData.map((p) => p.creator))];
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", creatorIds);

      if (profilesError) throw profilesError;

      const enriched = mergeProfiles(postsData, profiles)
   
      
      setSearchedPosts(enriched);
    } catch (err: any) {
      console.error("Error fetching search results:", err.message);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  useEffect(() => {
    fetchSearchedPosts(searchValue);
  }, [searchValue]);

  useEffect(() => {
    if (inView) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView]);

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = !shouldShowSearchResults && posts.length === 0;

  return (
    <div className="explore-container ml-0 md:ml-64">
      <div className="max-w-4xl mx-auto px-2 md:px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Explore</h2>
          <div className="relative">
            <div className="flex gap-1 px-4 w-full rounded-lg bg-gray-900">
              <img src="/assets/icons/search.svg" alt="search" width={24} height={24} className="opacity-50" />
              <Input
                type="text"
                placeholder="Search posts..."
                className="explore-search bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-400"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Popular Section */}
        <div className="flex-between w-full mb-8">
          <h3 className="text-2xl font-semibold">Popular Today</h3>
          <div className="flex-center gap-3 bg-gray-900 rounded-xl px-4 py-2 cursor-pointer hover:bg-gray-800 transition-colors">
            <p className="text-sm font-medium">All</p>
            <img src="/assets/icons/filter.svg" alt="filter" width={20} height={20} className="opacity-50" />
          </div>
        </div>

        {/* Posts or Search Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shouldShowSearchResults ? (
            <SearchResults isSearchFetching={false} searchedPosts={searchedPosts} />
          ) : shouldShowPosts ? (
            <div className="col-span-2 text-center py-12 bg-gray-900 rounded-lg">
              <p className="text-gray-400">No posts found</p>
            </div>
          ) : (
            <GridPostList posts={posts} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
