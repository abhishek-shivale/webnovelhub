import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const MEDIA_BASE_URL = "https://api.webnovelhub.online";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
