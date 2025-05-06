import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
  hoverEffect?: boolean;
  children: React.ReactNode;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  className,
  gradient = false,
  hoverEffect = false,
  children,
  ...props
}) => {
  return (
    <Card 
      className={cn(
        'transition-all duration-300 overflow-hidden bg-card/50 backdrop-blur-sm',
        'border border-border/50',
        gradient && 'bg-gradient-to-br from-card to-secondary/30',
        hoverEffect && 'hover:-translate-y-1 hover:shadow-lg hover:bg-card/80',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};

interface EnhancedCardHeaderProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  gradient?: boolean;
  children?: React.ReactNode;
}

export const EnhancedCardHeader: React.FC<EnhancedCardHeaderProps> = ({
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  gradient = false,
  children,
}) => {
  return (
    <CardHeader className={cn('', className)}>
      {children ? (
        children
      ) : (
        <>
          {title && (
            <CardTitle className={cn(
              'transition-all duration-300',
              gradient && 'text-gradient',
              titleClassName
            )}>
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription className={cn('mt-1.5', descriptionClassName)}>
              {description}
            </CardDescription>
          )}
        </>
      )}
    </CardHeader>
  );
};

interface EnhancedCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animate?: boolean;
}

export const EnhancedCardContent: React.FC<EnhancedCardContentProps> = ({
  className,
  children,
  animate = false,
  ...props
}) => {
  return (
    <CardContent 
      className={cn(
        'relative',
        animate && 'animate-fade-in',
        className
      )}
      {...props}
    >
      {children}
    </CardContent>
  );
};

interface EnhancedCardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export const EnhancedCardFooter: React.FC<EnhancedCardFooterProps> = ({
  className,
  children,
}) => {
  return (
    <CardFooter className={cn('', className)}>
      {children}
    </CardFooter>
  );
};
