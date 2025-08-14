import { ReactNode, useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveLayout({ children, className }: ResponsiveLayoutProps) {
  const isMobile = useIsMobile();
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerHeight < window.innerWidth);
    };

    checkOrientation();
    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);

    return () => {
      window.removeEventListener('orientationchange', checkOrientation);
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  return (
    <div 
      className={cn(
        'min-h-screen w-full',
        isMobile && 'safe-area-inset',
        isMobile && isLandscape && 'landscape-optimization',
        className
      )}
      style={{
        paddingBottom: isMobile && !isLandscape ? 'env(safe-area-inset-bottom, 20px)' : undefined,
      }}
    >
      {children}
    </div>
  );
}

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function MobileHeader({ title, subtitle, actions, className }: MobileHeaderProps) {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <div className={cn(
      'sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b',
      'px-4 py-3 safe-area-inset',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold truncate">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground truncate">{subtitle}</p>}
        </div>
        {actions && <div className="ml-4 flex items-center space-x-2">{actions}</div>}
      </div>
    </div>
  );
}

interface TabletLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
  className?: string;
}

export function TabletLayout({ sidebar, content, className }: TabletLayoutProps) {
  return (
    <div className={cn('tablet:flex tablet:h-screen', className)}>
      <aside className="tablet:w-80 tablet:border-r tablet:overflow-y-auto">
        {sidebar}
      </aside>
      <main className="tablet:flex-1 tablet:overflow-y-auto">
        {content}
      </main>
    </div>
  );
}

interface DesktopLayoutProps {
  sidebar?: ReactNode;
  header: ReactNode;
  content: ReactNode;
  className?: string;
}

export function DesktopLayout({ sidebar, header, content, className }: DesktopLayoutProps) {
  return (
    <div className={cn('desktop:flex desktop:h-screen', className)}>
      {sidebar && (
        <aside className="desktop:w-64 desktop:border-r desktop:overflow-y-auto desktop:bg-sidebar">
          {sidebar}
        </aside>
      )}
      <div className="desktop:flex-1 desktop:flex desktop:flex-col">
        <header className="desktop:border-b desktop:bg-background">
          {header}
        </header>
        <main className="desktop:flex-1 desktop:overflow-y-auto">
          {content}
        </main>
      </div>
    </div>
  );
}

// Utility components for responsive behavior
export function MobileOnly({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('md:hidden', className)}>{children}</div>;
}

export function TabletOnly({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('hidden md:block lg:hidden', className)}>{children}</div>;
}

export function DesktopOnly({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('hidden lg:block', className)}>{children}</div>;
}

export function MobileAndTablet({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('lg:hidden', className)}>{children}</div>;
}

export function TabletAndDesktop({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('hidden md:block', className)}>{children}</div>;
}