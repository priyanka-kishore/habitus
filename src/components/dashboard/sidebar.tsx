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
          <Link
            href="/"
            className={cn(
              "flex items-center gap-4 px-4 py-2 rounded-md hover:bg-accent transition-colors font-medium",
              isExpanded ? "justify-start" : "justify-center"
            )}
          >
            {isExpanded ? (
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
            )}
            {/* {isExpanded && } */}
          </Link>
          <Link
            href="/goals"
            className={cn(
              "flex items-center gap-4 px-4 py-2 rounded-md hover:bg-accent transition-colors font-medium",
              isExpanded ? "justify-start" : "justify-center"
            )}
          >{isExpanded ? (
            <span>Goals</span>
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
              <circle r="10" cx="12" cy="12" />
              <circle r="6" cx="12" cy="12" />
              <circle r="2" cx="12" cy="12" />
            </svg>
          )}</Link>
          <Link
            href="/metrics"
            className={cn(
              "flex items-center gap-4 px-4 py-2 rounded-md hover:bg-accent transition-colors font-medium",
              isExpanded ? "justify-start" : "justify-center"
            )}
          >{isExpanded ? (
            <span>Metrics</span>
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
              <line x1="8" y1="16" x2="8" y2="11" />
              <line x1="12" y1="16" x2="12" y2="8" />
              <line x1="16" y1="16" x2="16" y2="13" />
              <rect x="3" y="3" width="18" height="18" rx="2" fill="none" />
            </svg>
          )}</Link>
          <Link
            href="/friends"
            className={cn(
              "flex items-center gap-4 px-4 py-2 rounded-md hover:bg-accent transition-colors font-medium",
              isExpanded ? "justify-start" : "justify-center"
            )}
          >{isExpanded ? (
            <span>Friends</span>
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
              {/* <circle cx="12" cy="8" r="4" />
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /> */}
              <circle cx="7" cy="10" r="2" />
              <circle cx="17" cy="10" r="2" />
              <circle cx="12" cy="7" r="3" />
              <path d="M5 20v-1a4 4 0 0 1 4-4" />
              <path d="M19 20v-1a4 4 0 0 0-4-4" />
              <path d="M8 20v-2a4 4 0 0 1 8 0v2" />
            </svg>
          )}</Link>
          <Link
            href="/discover"
            className={cn(
              "flex items-center gap-4 px-4 py-2 rounded-md hover:bg-accent transition-colors font-medium",
              isExpanded ? "justify-start" : "justify-center"
            )}
          >{isExpanded ? (
            <span>Discover</span>
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
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          )}</Link>
        </div>
      </ScrollArea>
      <div className="flex h-14 items-center border-t px-4">
        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-4 w-full rounded-md hover:bg-accent transition-colors font-medium",
            isExpanded ? "justify-start" : "justify-center"
          )}
        >
          {isExpanded ? (
            <span>Profile</span>
          ) : (
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-user"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
            </svg>
          )}
        </Link>
      </div>
    </div>
  )
} 