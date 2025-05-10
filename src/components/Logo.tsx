import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  collapsed?: boolean;
}
export const Logo: React.FC<LogoProps> = ({
  className,
  size = 'md',
  collapsed = false
}) => {
  const {
    theme
  } = useTheme();
  const {
    language
  } = useLanguage();
  const isDarkMode = theme === 'dark';
  const isRTL = language === 'ar';

  // Size adjustments
  const sizeMap = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-20'
  };

  // Logo colors
  const logoColor = isDarkMode ? 'text-sky-400' : 'text-[#1a6c8f]';

  // Order of letters based on language direction - fixed for Arabic
  const letters = ['C', 'E', 'G', 'O'];
  return <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('relative flex items-center', sizeMap[size])}>
        <div className={cn('flex items-center gap-2', logoColor)}>
          <div className="font-bold tracking-tight" style={{
          fontFamily: "'Montserrat', 'Cairo', sans-serif"
        }}>
            <div className={cn('flex', 'items-center')}>
              {/* First letter is always shown */}
              <div className={cn('border-4 rounded-md aspect-square flex items-center justify-center', size === 'sm' ? 'w-6 text-base' : size === 'md' ? 'w-10 text-xl' : 'w-12 text-2xl', logoColor, 'border-current')}>
                {letters[0]}
              </div>
              
              {/* Show remaining letters only when not collapsed */}
              {!collapsed && <>
                  <div className={cn('mx-1 border-4 rounded-md aspect-square flex items-center justify-center', size === 'sm' ? 'w-6 text-base' : size === 'md' ? 'w-10 text-xl' : 'w-12 text-2xl', logoColor, 'border-current')}>
                    {letters[1]}
                  </div>
                  <div className={cn('mx-1 border-4 rounded-md aspect-square flex items-center justify-center', size === 'sm' ? 'w-6 text-base' : size === 'md' ? 'w-10 text-xl' : 'w-12 text-2xl', logoColor, 'border-current')}>
                    {letters[2]}
                  </div>
                  <div className={cn('mx-1 border-4 rounded-md aspect-square flex items-center justify-center', size === 'sm' ? 'w-6 text-base' : size === 'md' ? 'w-10 text-xl' : 'w-12 text-2xl', logoColor, 'border-current')}>
                    {letters[3]}
                  </div>
                </>}
            </div>
          </div>
        </div>
      </div>

      {/* Brand text - only show when not collapsed */}
      {!collapsed && size !== 'sm' && isRTL}
      
      {/* Non-Arabic brand text */}
      {!collapsed && size !== 'sm' && !isRTL && <div className={cn('hidden lg:flex lg:flex-col')}>
          
        </div>}
    </div>;
};