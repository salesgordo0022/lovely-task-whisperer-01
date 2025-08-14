import { useIsMobile } from '@/hooks/use-mobile';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileOptimizedProps {
  children: ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

export function MobileOptimized({ 
  children, 
  className,
  mobileClassName,
  tabletClassName,
  desktopClassName 
}: MobileOptimizedProps) {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={cn(
        className,
        isMobile && mobileClassName,
        !isMobile && 'md:block hidden',
        tabletClassName && 'md:' + tabletClassName,
        desktopClassName && 'lg:' + desktopClassName
      )}
    >
      {children}
    </div>
  );
}

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveContainer({ children, className }: ResponsiveContainerProps) {
  return (
    <div className={cn(
      'w-full max-w-7xl mx-auto',
      'px-4 sm:px-6 lg:px-8',
      'py-3 sm:py-4 lg:py-6',
      className
    )}>
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export function ResponsiveGrid({ 
  children, 
  className,
  cols = { mobile: 1, tablet: 2, desktop: 3 }
}: ResponsiveGridProps) {
  return (
    <div className={cn(
      'grid gap-3 sm:gap-4 lg:gap-6',
      `grid-cols-${cols.mobile}`,
      `sm:grid-cols-${cols.tablet}`,
      `lg:grid-cols-${cols.desktop}`,
      className
    )}>
      {children}
    </div>
  );
}

interface TouchFriendlyProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function TouchFriendly({ children, className, interactive = false }: TouchFriendlyProps) {
  return (
    <div className={cn(
      'touch-target',
      interactive && 'cursor-pointer active:scale-95 transition-transform duration-100',
      className
    )}>
      {children}
    </div>
  );
}

// Hook for responsive breakpoints
export function useResponsiveBreakpoint() {
  const isMobile = useIsMobile();
  
  return {
    isMobile,
    isTablet: !isMobile && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
  };
}