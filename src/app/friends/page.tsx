"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { UserCard } from "@/components/users/user-card"
import { User } from "@/types/users"
import { Search } from "lucide-react"
import { mockUsers } from "@/lib/mock-users"

export default function FriendsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setUsers(mockUsers)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddFriend = async (userId: string) => {
    // TODO: Implement friend request functionality
    console.log("Add friend:", userId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Friends</h1>
        <p className="text-muted-foreground mt-1">
          Connect with other users and track their progress
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery ? "No users found matching your search" : "No users found"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onAddFriend={handleAddFriend}
            />
          ))}
        </div>
      )}
    </div>
  )
} 