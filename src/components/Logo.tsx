
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
            {/* OGEC Letters with custom styling */}
            <div className="flex items-center">
              <div className={cn('border-4 rounded-md aspect-square flex items-center justify-center', 
                size === 'sm' ? 'w-6 text-base' : size === 'md' ? 'w-10 text-xl' : 'w-12 text-2xl',
                logoColor, 'border-current')}>
                O
              </div>
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
            </div>

            {/* Arabic Text */}
            <div className={cn('mt-1 text-right',
              size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base',
              logoColor
            )}>
              فرع فم الواد
            </div>
          </div>

          {/* Person in Circle Icon */}
          {!collapsed && (
            <div className={cn(
              'relative',
              size === 'sm' ? 'w-8' : size === 'md' ? 'w-14' : 'w-16',
              'aspect-square'
            )}>
              <div className={cn('absolute inset-0 rounded-full border-2', logoColor, 'border-current')} />
              <div className={cn(
                'absolute',
                size === 'sm' ? 'w-4 h-3 top-1 left-2' : size === 'md' ? 'w-8 h-5 top-2 left-3' : 'w-10 h-7 top-2 left-3', 
                'border-2 rounded-full border-current', logoColor
              )} />
              <div className={cn(
                'absolute',
                size === 'sm' ? 'w-1.5 h-1.5 top-0.5 left-3.25' : size === 'md' ? 'w-2.5 h-2.5 top-1 left-6' : 'w-3 h-3 top-1 left-6.5',
                'rounded-full bg-current', logoColor
              )} />
              <div className={cn(
                'absolute',
                size === 'sm' ? 'w-0.5 h-3 top-2 left-3.75' : size === 'md' ? 'w-1 h-6 top-4 left-6.5' : 'w-1.5 h-8 top-4 left-7',
                'bg-current', logoColor
              )} />
              <div className={cn(
                'absolute',
                size === 'sm' ? 'w-2 h-0.5 top-3 left-3' : size === 'md' ? 'w-4 h-1 top-6 left-5' : 'w-5 h-1 top-7 left-5',
                'bg-current', logoColor
              )} />
              <div className={cn(
                'absolute',
                size === 'sm' ? 'w-2 h-0.5 top-3.5 left-3' : size === 'md' ? 'w-4 h-1 top-7.5 left-5' : 'w-5 h-1 top-9 left-5',
                'bg-current', logoColor
              )} />
            </div>
          )}
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
