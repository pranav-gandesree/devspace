import { useEffect, useState } from 'react'
import { supabase } from "@/lib/supabase/SupabaseClient"
import { User, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { debounce } from 'lodash'

interface UserProfile {
  id: string
  name: string
  email: string
  avatar_url: string | null
  created_at: string
}

const AllUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        setUsers(data || [])
        setFilteredUsers(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleSearch = debounce((query: string) => {
    const filtered = users.filter(user => 
      user.name?.toLowerCase().includes(query.toLowerCase()) ||
      user.email?.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, 300)

  useEffect(() => {
    handleSearch(searchQuery)
  }, [searchQuery])

  if (loading) {
    return (
      <div className="flex-center w-full h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-center w-full h-full">
        <p className="text-red-500">Error loading users: {error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 ml-64">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">All Users</h1>
        
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="flex gap-1 px-4 w-full rounded-lg bg-gray-900">
              <Search className="w-5 h-5 opacity-50 mt-3" />
              <Input
                type="text"
                placeholder="Search users by name or email..."
                className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-gray-400 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-800">
            <div className="font-semibold">User</div>
            <div className="font-semibold">Name</div>
            <div className="font-semibold">Joined</div>
            <div className="font-semibold">Actions</div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-800 hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-white">{user.name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center text-gray-400">
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <a
                    href={`/profile/${user.id}`}
                    className="text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AllUsers
