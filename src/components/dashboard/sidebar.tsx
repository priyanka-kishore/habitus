"use client"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"

type SidebarProps = React.HTMLAttributes<HTMLDivElement>

export function Sidebar({ className }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false) // to set CSS for open/close behavior
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined) // to time the behavior

  /**
   * Expands left sidebar menu on hover
   */
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(true)
    }, 50)
  }

  /**
   * Collapses left sidebar menu on hover
   */
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false)
    }, 0)
  }

  /**
   * useEffect: allows syncing of a component with external systems / to manage side effects in components
   * - examples of side effects: data fetching, subscriptions, DOM manipulations, event listening, resource clean up
   * 
   * Clears the timeout used for the sidebar's hover behavior to prevent memory leaks
   */
  useEffect(() => { // 1st arg main func = clears the timeout used for sidebar's hover
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, []) // 2nd arg dependency arr = only runs once when cmpt mounts (first rendered)

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col border-r bg-background transition-all duration-300",
        isExpanded ? "w-64" : "w-16",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex h-14 items-center border-b px-4">
        {isExpanded ? (
          <span className="font-semibold">Habitus</span>
        ) : (
          <Image
            src="/favicon.ico"
            alt="Habitus"
            width={24}
            height={24}
            className="mx-auto"
          />
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          {/* Dashboard menu item */}
          <Link
            href="/"
            className={cn(
              "flex items-center gap-4 px-4 py-2 rounded-md hover:bg-accent transition-colors font-medium",
              isExpanded ? "justify-start" : "justify-center"
            )}
          >
            { isExpanded ? (
              <span>Dashboard</span>
            ) : (
              <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-layout-grid"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            ) }
            {/* {isExpanded && } */}
          </Link>
          {/* Add your sidebar items here */}
        </div>
      </ScrollArea>
    </div>
  )
} 