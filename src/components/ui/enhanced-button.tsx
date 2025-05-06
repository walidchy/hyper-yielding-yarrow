
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends ButtonProps {
  animated?: boolean;
  gradient?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  hoverEffect?: 'scale' | 'glow' | 'slide' | 'none';
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  className,
  children,
  animated = false,
  gradient = false,
  icon,
  iconPosition = 'left',
  hoverEffect = 'none',
  ...props
}) => {
  const getHoverClass = () => {
    switch (hoverEffect) {
      case 'scale':
        return 'hover:scale-105';
      case 'glow':
        return 'hover:shadow-glow';
      case 'slide':
        return 'hover:-translate-y-1';
      default:
        return '';
    }
  };

  return (
    <Button
      className={cn(
        'transition-all duration-300 relative overflow-hidden',
        animated && 'btn-animated',
        gradient && 'bg-gradient-to-r from-primary to-accent after:bg-gradient-to-r after:from-accent after:to-primary',
        getHoverClass(),
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2 transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="ml-2 transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>
      )}
    </Button>
  );
};
