import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } else if (days > 0) {
    return `${days}d ago`;
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return 'Just now';
  }
}

export function getAvatarColor(letter: string): string {
  const colors = [
    '#dc2626',
    '#ea580c',
    '#d97706',
    '#65a30d',
    '#16a34a',
    '#059669',
    '#0d9488',
    '#0891b2',
    '#0284c7',
    '#2563eb',
    '#4f46e5',
    '#7c3aed',
    '#9333ea',
    '#c026d3',
    '#db2777',
    '#e11d48',
  ];
  const index = letter.toUpperCase().charCodeAt(0) % colors.length;
  return colors[index];
}
