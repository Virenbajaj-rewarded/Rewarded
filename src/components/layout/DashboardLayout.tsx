import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardHeader } from './DashboardHeader';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <Sidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
