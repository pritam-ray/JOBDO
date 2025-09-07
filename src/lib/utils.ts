import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const gradients = {
  primary: "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700",
  secondary: "bg-gradient-to-r from-emerald-500 to-teal-600",
  accent: "bg-gradient-to-r from-orange-500 to-pink-600",
  dark: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
  light: "bg-gradient-to-br from-white to-gray-50",
  success: "bg-gradient-to-r from-green-500 to-emerald-600",
  warning: "bg-gradient-to-r from-yellow-500 to-orange-500",
  danger: "bg-gradient-to-r from-red-500 to-pink-600"
}

export const shadows = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg shadow-black/10",
  xl: "shadow-xl shadow-black/15",
  "2xl": "shadow-2xl shadow-black/20",
  glow: "shadow-2xl shadow-blue-500/25",
  colored: "shadow-xl shadow-purple-500/20"
}
