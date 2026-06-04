'use client';

import Image from 'next/image';
import { useState } from 'react';

interface UserAvatarProps {
  photoURL: string | null;
  displayName: string | null;
  email: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ photoURL, displayName, email, size = 'md' }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const initials = (displayName || email || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (imageError || !photoURL) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm`}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={photoURL}
      alt={displayName || 'User'}
      onError={() => setImageError(true)}
      className={`${sizeClasses[size]} rounded-full object-cover border border-white/10`}
    />
  );
}
