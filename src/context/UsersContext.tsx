import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/SupabaseClient";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

interface IUsersContext {
  users: UserProfile[];
  filteredUsers: UserProfile[];
  loading: boolean;
  error: string | null;
  searchUsers: (query: string) => void;
  refreshUsers: () => Promise<void>;
}

const UsersContext = createContext<IUsersContext | undefined>(undefined);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setUsers(data || []);
      setFilteredUsers(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const searchUsers = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query.toLowerCase()) ||
        user.email?.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredUsers(filtered);
  };

  const refreshUsers = async () => {
    await fetchUsers();
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        filteredUsers,
        loading,
        error,
        searchUsers,
        refreshUsers
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useUsersContext = (): IUsersContext => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsersContext must be used within a UsersProvider");
  }
  return context;
}; 