
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  collapsed?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  size = 'md',
  collapsed = false,
}) => {
  // Size adjustments
  const sizeMap = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-20',
  };
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Updated to use the official OGEC logo */}
      <img 
        src="/lovable-uploads/4aad8150-dcf8-4a8f-9717-264ce1f2a687.png" 
        alt="OGEC Logo"
        className={cn(sizeMap[size], 'w-auto')}
      />

      {/* Brand text - only show when not collapsed */}
      {!collapsed && (
        <div className={cn('flex flex-col')}>
          <span
            className={cn(
              'font-extrabold tracking-tight',
              size === 'sm' ? 'text-base' : size === 'md' ? 'text-2xl' : 'text-3xl',
              'text-[#22223B] dark:text-white',
              'leading-6'
            )}
            style={{ fontFamily: "'Montserrat', 'Cairo', sans-serif" }}
          >
            OGEC
          </span>
          <span
            className={cn(
              'font-bold',
              size === 'sm' ? 'text-xs' : size === 'md' ? 'text-base' : 'text-lg',
              'text-[#221B44] dark:text-[#dedaff]',
              'leading-tight'
            )}
            dir="rtl"
            style={{ fontFamily: "'Cairo', 'Montserrat', sans-serif", letterSpacing: 0 }}
          >
            فرع فم الواد
          </span>
        </div>
      )}
    </div>
  );
};
