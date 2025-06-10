import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * cn = class names
 * @description Combines and merges CSS class names to prevent conflicting/redundant Tailwind CSS rules
 * 
 * @param inputs CSS class names
 * @function clsx joins all arguments into a single string of class names (omits falsy values)
 * @function twMerge merges a string of class names according to Tailwind CSS rules
 * @returns string of class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
