"use client"

import { User } from "@/types/users"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { UserPlus } from "lucide-react"

interface UserCardProps {
  user: User
  onAddFriend?: (userId: string) => void
}

export function UserCard({ user, onAddFriend }: UserCardProps) {
  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-secondary">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.full_name}
              fill
              sizes="48px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-2xl font-semibold text-muted-foreground">
              {user.full_name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{user.full_name}</h3>
          <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
        </div>
      </div>
      
      {user.bio && (
        <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
      )}
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div>
          <span className="font-medium text-foreground">{user.goals_count}</span> goals
        </div>
        <div>
          <span className="font-medium text-foreground">{user.friends_count}</span> friends
        </div>
      </div>

      {onAddFriend && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => onAddFriend(user.id)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Friend
        </Button>
      )}
    </div>
  )
} 