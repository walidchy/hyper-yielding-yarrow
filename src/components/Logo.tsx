
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

  // Instead of using useSidebar, we now accept collapsed as a prop
  // which allows the component to be used anywhere
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Main SVG logo */}
      <svg
        className={cn(sizeMap[size], 'w-auto')}
        viewBox="0 0 155 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="OGEC logo"
      >
        {/* Colored background rings */}
        <ellipse cx="120" cy="72" rx="29" ry="11" fill="#33C3F0" />
        <ellipse cx="120" cy="63" rx="20" ry="7" fill="#6E59A5" opacity="0.13" />
        {/* The sun/symbol */}
        <circle cx="120" cy="55" r="16" fill="#F9E174" />
        {/* Human figure */}
        <circle cx="120" cy="37" r="8" fill="#FF9242" />
        <rect x="114" y="45" width="12" height="22" rx="6" fill="#FF9242" />
        {/* Dashed details */}
        <path
          d="M 97 62 Q 102 50 120 48 Q 138 50 143 62"
          stroke="#6772a4"
          strokeDasharray="4 3"
          strokeWidth="2"
          fill="none"
          opacity=".45"
        />
        {/* Modern ground lines under the platform */}
        <rect x="104" y="82" width="32" height="3" rx="1.5" fill="#8E9196" opacity="0.17" />
        <rect x="115" y="86" width="10" height="2" rx="1" fill="#8E9196" opacity="0.10" />
        {/* Invisible box for spacing */}
        <rect x="0" y="0" width="155" height="90" fill="none" />
      </svg>

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
