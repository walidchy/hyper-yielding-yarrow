
import React from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'white';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
  text
}) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const colorMap = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    white: 'text-white'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Loader 
        className={cn(
          'animate-spin', 
          sizeMap[size], 
          colorMap[color]
        )} 
      />
      {text && (
        <p className={cn('mt-2 text-sm', colorMap[color])}>
          {text}
        </p>
      )}
    </div>
  );
};

export const PageLoader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center h-[50vh] w-full">
      <div className="text-center">
        <div className="relative">
          <LoadingSpinner size="lg" />
          <div className="absolute inset-0 animate-pulse-border rounded-full" />
        </div>
        <p className="mt-4 text-muted-foreground animate-fade-in">{text}</p>
      </div>
    </div>
  );
};
