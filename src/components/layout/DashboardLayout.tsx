import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { SidebarProvider, useSidebar } from '@/contexts';
import { DashboardHeader } from './DashboardHeader';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardContent = ({ children }: { children?: ReactNode }) => {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={cn(
        'transition-all duration-300',
        isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      )}
    >
      <DashboardHeader />
      <main className="p-6">{children || <Outlet />}</main>
    </div>
  );
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-dark">
        <Sidebar />
        <DashboardContent>{children}</DashboardContent>
      </div>
    </SidebarProvider>
  );
};
