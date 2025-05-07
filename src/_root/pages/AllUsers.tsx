import React, { useEffect, useState } from 'react'
import { supabase } from "@/lib/supabase/SupabaseClient"
import { User } from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  avatar_url: string | null
  created_at: string
}

const AllUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        setUsers(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

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
    <div className="container mx-auto p-4">
      <h1 className="h1-bold mb-8">All Users</h1>
      
      <div className="bg-dark-2 rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 gap-4 p-4 border-b border-dark-4">
          <div className="font-semibold">User</div>
          <div className="font-semibold">Name</div>
          <div className="font-semibold">Joined</div>
          <div className="font-semibold">Actions</div>
        </div>

        {users.map((user) => (
          <div key={user.id} className="grid grid-cols-4 gap-4 p-4 border-b border-dark-4 hover:bg-dark-3">
            <div className="flex items-center gap-3">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-dark-4 flex items-center justify-center">
                  <User className="w-5 h-5 text-light-3" />
                </div>
              )}
            </div>
            <div className="flex items-center">
              <span className="text-light-1">{user.name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center text-light-3">
              {new Date(user.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <a
                href={`/profile/${user.id}`}
                className="text-primary-500 hover:text-primary-600 transition-colors"
              >
                View Profile
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllUsers
