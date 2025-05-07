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
  const { ref, inView } = useInView();

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

      const enriched = mergeProfiles(postsData, profiles);
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
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img src="/assets/icons/search.svg" alt="search" width={24} height={24} />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search md:w-420"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {/* Popular Section */}
      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img src="/assets/icons/filter.svg" alt="filter" width={20} height={20} />
        </div>
      </div>





      {/* Posts or Search Results */}
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults isSearchFetching={false} searchedPosts={searchedPosts} />
        ) : shouldShowPosts ? (
          <p className="text-light-4">End Of Posts</p>
        ) : (
          <GridPostList posts={posts} />
        )}
      </div>

      {/* Infinite Scroll Trigger */}
      {!shouldShowSearchResults && posts.length > 0 && <div ref={ref} className="mt-10" />}
    </div>
  );
};

export default Explore;
