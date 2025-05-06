
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type AnimationType = 'fade-in' | 'slide-in' | 'slide-in-bottom' | 'slide-in-right' | 'scale-in';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  threshold?: number;
  duration?: number;
  once?: boolean;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  animation = 'fade-in',
  delay = 0,
  threshold = 0.1,
  duration = 500,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [threshold, once]);

  return (
    <div
      ref={sectionRef}
      className={cn(className)}
      style={{
        opacity: 0,
        transform: 
          animation === 'slide-in' ? 'translateX(-20px)' : 
          animation === 'slide-in-bottom' ? 'translateY(20px)' : 
          animation === 'slide-in-right' ? 'translateX(20px)' : 
          animation === 'scale-in' ? 'scale(0.95)' : 
          'none',
        transition: `opacity ${duration}ms, transform ${duration}ms`,
        transitionDelay: `${delay}ms`,
        ...(isVisible && {
          opacity: 1,
          transform: 'none',
        }),
      }}
    >
      {children}
    </div>
  );
};

interface AnimatedListProps {
  items: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  animation?: AnimationType;
  staggerDelay?: number;
  baseDelay?: number;
  threshold?: number;
  duration?: number;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  items,
  className,
  itemClassName,
  animation = 'fade-in',
  staggerDelay = 150,
  baseDelay = 0,
  threshold = 0.1,
  duration = 500,
}) => {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <AnimatedSection
          key={index}
          className={itemClassName}
          animation={animation}
          delay={baseDelay + index * staggerDelay}
          threshold={threshold}
          duration={duration}
        >
          {item}
        </AnimatedSection>
      ))}
    </div>
  );
};
