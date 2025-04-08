
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    // Close sidebar when switching to desktop
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Force body to be fixed height on mobile to prevent scrolling issues
  useEffect(() => {
    if (isMobile) {
      document.body.style.height = '100%';
      document.body.style.overflow = sidebarOpen ? 'hidden' : 'auto';
    } else {
      document.body.style.height = '';
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.height = '';
      document.body.style.overflow = '';
    };
  }, [isMobile, sidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {isMobile ? (
        <>
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-[80%] max-w-[280px] border-r">
              <Sidebar />
            </SheetContent>
          </Sheet>
          
          <div className="flex flex-col flex-1 w-full overflow-hidden">
            <Header>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
            </Header>
            <main className="flex-1 overflow-auto p-3 md:p-4">
              {children}
            </main>
          </div>
        </>
      ) : (
        <>
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
