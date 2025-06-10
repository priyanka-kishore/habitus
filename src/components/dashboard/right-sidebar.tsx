"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Activity, Calendar, BarChart3, ChevronLeft, ChevronRight, GripVertical, TrendingUp, Users } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

type RightSidebarProps = React.HTMLAttributes<HTMLDivElement>

// Stable data for the heatmap
const heatmapData = [
  [1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1],
  [0, 1, 1, 0, 1, 0, 1],
  [1, 1, 0, 1, 1, 1, 0],
  [1, 0, 1, 1, 0, 1, 1],
]

// Sample friend activities
const friendActivities = [
  { name: "Alice", action: "completed a goal", time: "2m ago", goal: "Morning Meditation" },
  { name: "Bob", action: "started a new goal", time: "15m ago", goal: "Daily Reading" },
  { name: "Charlie", action: "reached a milestone", time: "1h ago", goal: "Fitness Challenge" },
  { name: "Diana", action: "completed a goal", time: "2h ago", goal: "Water Intake" },
  { name: "Ethan", action: "started a new goal", time: "3h ago", goal: "Coding Practice" },
  { name: "Fiona", action: "reached a milestone", time: "4h ago", goal: "Language Learning" },
  { name: "George", action: "completed a goal", time: "5h ago", goal: "Healthy Eating" },
  { name: "Hannah", action: "started a new goal", time: "6h ago", goal: "Daily Writing" },
]

export function RightSidebar({ className }: RightSidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [width, setWidth] = useState(400) // Match MIN_WIDTH
  const [isDragging, setIsDragging] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const MIN_WIDTH = 400 // Minimum width in pixels to accommodate friend activity cards

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const newWidth = Math.max(MIN_WIDTH, window.innerWidth - e.clientX)
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed right-4 top-4 z-50 rounded-md border bg-background shadow-sm hover:bg-accent"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "relative flex h-screen flex-col border-l bg-background",
          !isDragging && "transition-all duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
          className
        )}
        style={{ width: isOpen ? width : 0 }}
      >
        <div className="flex h-14 items-center justify-between border-b px-6 py-4">
          <span className="font-semibold">Activity & Metrics</span>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-8 p-6">
            {/* User Metrics Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <h3 className="font-medium">Your Metrics</h3>
              </div>
              <div className="rounded-lg border p-5">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Goals Completed</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                    <p className="text-2xl font-bold">5 days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly Progress</p>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div className="h-2 w-3/4 rounded-full bg-primary"></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold">85%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <h3 className="font-medium">Performance</h3>
              </div>
              <div className="rounded-lg border p-5">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Best Streak</p>
                    <p className="text-2xl font-bold">14 days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Goals</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Goals</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">92%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Heatmap Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <h3 className="font-medium">Activity Heatmap</h3>
              </div>
              <div className="rounded-lg border p-5">
                <div className="mx-auto w-80">
                  <div className="grid grid-cols-7 gap-1">
                    {heatmapData.flat().map((value, i) => (
                      <div
                        key={i}
                        className={cn(
                          "aspect-square rounded-sm",
                          value === 1 ? "bg-primary/20" : "bg-secondary"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Friend Activity Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <h3 className="font-medium">Friend Activity</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {friendActivities.map((activity, i) => (
                  <div key={i} className="min-w-[240px] rounded-lg border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{activity.name}</span>{" "}
                          {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.goal}</p>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <h3 className="font-medium">Community Stats</h3>
              </div>
              <div className="rounded-lg border p-5">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Friends</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Group Goals</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Community Rank</p>
                    <p className="text-2xl font-bold">#3</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Points</p>
                    <p className="text-2xl font-bold">1,234</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Draggable Divider */}
        <div
          className={cn(
            "absolute left-0 top-0 flex h-full w-4 cursor-ew-resize items-center justify-center hover:bg-primary/10",
            isDragging && "bg-primary/20"
          )}
          onMouseDown={handleMouseDown}
        >
          <div className="flex h-12 w-1 items-center justify-center rounded-full bg-border hover:bg-primary">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </>
  )
} 