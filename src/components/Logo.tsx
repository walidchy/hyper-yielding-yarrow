
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Size adjustments
  const sizeMap = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-20',
  };
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Use a different logo/styling based on theme */}
      <div className={cn('relative', sizeMap[size], 'aspect-square flex items-center justify-center')}>
        <img 
          src="/lovable-uploads/4aad8150-dcf8-4a8f-9717-264ce1f2a687.png" 
          alt="OGEC Logo"
          className={cn(
            'w-auto h-full transition-all duration-300',
            isDarkMode ? 'brightness-[1.15] contrast-[1.1] drop-shadow-[0_0_3px_rgba(255,255,255,0.5)]' : ''
          )}
        />
      </div>

      {/* Brand text - only show when not collapsed */}
      {!collapsed && (
        <div className={cn('flex flex-col')}>
          <span
            className={cn(
              'font-extrabold tracking-tight',
              size === 'sm' ? 'text-base' : size === 'md' ? 'text-2xl' : 'text-3xl',
              isDarkMode ? 'text-white' : 'text-[#22223B]',
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
              isDarkMode ? 'text-[#f5f2ff]' : 'text-[#221B44]',
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
