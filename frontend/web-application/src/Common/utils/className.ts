import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const className = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))
