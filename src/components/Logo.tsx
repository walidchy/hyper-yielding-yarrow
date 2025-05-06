
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

  // Logo colors
  const logoColor = isDarkMode ? 'text-sky-400' : 'text-[#1a6c8f]';
  
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('relative flex items-center', sizeMap[size])}>
        <div className={cn('flex items-center gap-2', logoColor)}>
          {/* OGEC Text */}
          <div className="font-bold tracking-tight" style={{ fontFamily: "'Montserrat', 'Cairo', sans-serif" }}>
            {/* When collapsed, show only 'O' */}
            <div className="flex items-center">
              <div className={cn('border-4 rounded-md aspect-square flex items-center justify-center', 
                size === 'sm' ? 'w-6 text-base' : size === 'md' ? 'w-10 text-xl' : 'w-12 text-2xl',
                logoColor, 'border-current')}>
                O
              </div>
              
              {/* Show GEC only when not collapsed */}
              {!collapsed && (
                <>
                  <div className={cn('ml-1 border-4 rounded-md aspect-square flex items-center justify-center', 
                    size === 'sm' ? 'w-6 text-base' : size === 'md' ? 'w-10 text-xl' : 'w-12 text-2xl',
                    logoColor, 'border-current')}>
                    G
                  </div>
                  <div className={cn('ml-1 border-4 rounded-md aspect-square flex items-center justify-center', 
                    size === 'sm' ? 'w-6 text-base' : size === 'md' ? 'w-10 text-xl' : 'w-12 text-2xl',
                    logoColor, 'border-current')}>
                    E
                  </div>
                  <div className={cn('ml-1 border-4 rounded-md aspect-square flex items-center justify-center', 
                    size === 'sm' ? 'w-6 text-base' : size === 'md' ? 'w-10 text-xl' : 'w-12 text-2xl',
                    logoColor, 'border-current')}>
                    C
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Brand text - only show when not collapsed */}
      {!collapsed && size !== 'sm' && (
        <div className={cn('hidden lg:flex lg:flex-col')}>
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
        </div>
      )}
    </div>
  );
};
