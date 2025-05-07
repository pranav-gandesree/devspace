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
  const [isSearchFetching, setIsSearchFetching] = useState(false);
  const [page, setPage] = useState(1);
  const [categories] = useState<string[]>([
    "All", "Nature", "Travel", "Food", "Technology", "Art", "Fashion"
  ]);
  const [activeCategory, setActiveCategory] = useState("All");
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
  const fetchPosts = async (page: number, category: string = "All") => {
    try {
      let query = supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      
      // Apply category filter if not "All"
      if (category !== "All") {
        query = query.ilike("tags", `%${category.toLowerCase()}%`);
      }
      
      // Apply pagination
      const { data: postsData, error: postsError } = await query
        .range((page - 1) * 9, page * 9 - 1);

      if (postsError) throw postsError;

      const creatorIds = [...new Set(postsData.map((p) => p.creator))];
      
      if (creatorIds.length === 0) {
        setPosts(prev => page === 1 ? [] : prev);
        return;
      }
      
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", creatorIds);

      if (profilesError) throw profilesError;

      const enrichedPosts = mergeProfiles(postsData, profiles);
      
      if (page === 1) {
        setPosts(enrichedPosts);
      } else {
        setPosts((prev) => [...prev, ...enrichedPosts]);
      }
    } catch (err: any) {
      console.error("Error fetching posts:", err.message);
    }
  };

  // Search posts and fetch creators
  const fetchSearchedPosts = async (query: string) => {
    if (!query.trim()) {
      setSearchedPosts([]);
      return;
    }

    try {
      setIsSearchFetching(true);
      
      // Search by caption or tags using ilike for case-insensitive search
      const { data: captionResults, error: captionError } = await supabase
        .from("posts")
        .select("*")
        .ilike("caption", `%${query}%`)
        .order("created_at", { ascending: false });

      if (captionError) throw captionError;

      // Search by tags
      const { data: tagResults, error: tagError } = await supabase
        .from("posts")
        .select("*")
        .ilike("tags", `%${query}%`)
        .order("created_at", { ascending: false });

      if (tagError) throw tagError;

      // Combine results and remove duplicates
      const combinedResults = [...captionResults];
      
      // Add tag results that aren't already in caption results
      tagResults.forEach(tagPost => {
        if (!combinedResults.some(post => post.id === tagPost.id)) {
          combinedResults.push(tagPost);
        }
      });

      if (combinedResults.length === 0) {
        setSearchedPosts([]);
        setIsSearchFetching(false);
        return;
      }

      const creatorIds = [...new Set(combinedResults.map((p) => p.creator))];
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", creatorIds);

      if (profilesError) throw profilesError;

      const enriched = mergeProfiles(combinedResults, profiles);
      setSearchedPosts(enriched);
    } catch (err: any) {
      console.error("Error fetching search results:", err.message);
    } finally {
      setIsSearchFetching(false);
    }
  };

  // Load initial posts
  useEffect(() => {
    fetchPosts(1, activeCategory);
  }, [activeCategory]);

  // Search when query changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSearchedPosts(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Infinity scroll
  useEffect(() => {
    if (inView && !searchValue) {
      setPage((prevPage) => prevPage + 1);
      fetchPosts(page + 1, activeCategory);
    }
  }, [inView, searchValue]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setPage(1);
  };

  const shouldShowSearchResults = searchValue !== "";
  const isEmpty = !shouldShowSearchResults && posts.length === 0;

  return (
    <div className="explore-container ml-0 md:ml-64">
      <div className="max-w-4xl mx-auto px-2 md:px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Explore</h2>
          
          {/* Improved Search Bar */}
          <div className="relative mb-8">
            <div className="flex gap-2 px-4 py-2 w-full rounded-lg bg-gray-900 border border-gray-800 focus-within:border-gray-600 transition-all">
              <img src="/assets/icons/search.svg" alt="search" width={24} height={24} className="opacity-70" />
              <Input
                type="text"
                placeholder="Search posts by caption or tags..."
                className="explore-search bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-400 w-full"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              {searchValue && (
                <button 
                  onClick={() => setSearchValue("")}
                  className="opacity-70 hover:opacity-100"
                >
                  <img src="/assets/icons/close.svg" alt="clear" width={20} height={20} />
                </button>
              )}
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide no-scrollbar mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results or Posts */}
        {shouldShowSearchResults ? (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {isSearchFetching ? "Searching..." : `Results for "${searchValue}"`}
            </h3>
            <SearchResults 
              isSearchFetching={isSearchFetching} 
              searchedPosts={searchedPosts} 
            />
            {!isSearchFetching && searchedPosts.length === 0 && (
              <div className="text-center py-12 bg-gray-900 rounded-lg">
                <p className="text-gray-400">No results found</p>
              </div>
            )}
          </div>
        ) : isEmpty ? (
          <div className="text-center py-20 bg-gray-900 rounded-lg">
            <img 
              src="/assets/icons/empty.svg" 
              alt="No posts" 
              className="w-20 h-20 mx-auto mb-4 opacity-50" 
            />
            <p className="text-gray-400">No posts found in this category</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <GridPostList posts={posts} />
            </div>
            
           
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
