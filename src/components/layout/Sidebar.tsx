import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from '@/contexts';
import { ERole } from '../../enums';
import MenuFoldIcon from '@/assets/menu-fold.svg?react';
import { sidebarRoutes } from './sidebarRoutes';

export const Sidebar = () => {
  const location = useLocation();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } =
    useSidebar();

  const userRole = localStorage.getItem('userRole') as ERole | null;

  const sidebarRoutesBasedOnRole = sidebarRoutes.filter(
    item => item.role === userRole
  );

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  const handleSidebarCollapse = () => {
    setIsCollapsed(!isCollapsed);
    closeMobileMenu();
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          'fixed inset-y-0 z-50 flex flex-col transition-all duration-300',
          isMobileOpen ? 'left-0' : '-left-full',
          'w-64',
          'lg:left-0',
          isCollapsed ? 'lg:w-20' : 'lg:w-64'
        )}
      >
        <div
          className={cn(
            'flex grow flex-col gap-y-5 overflow-y-auto bg-[#1F1F1F] border-r border-border pb-4 transition-all duration-300',
            isCollapsed ? 'px-2' : 'px-2'
          )}
        >
          <div className="flex h-16 shrink-0 items-center justify-start">
            <button
              onClick={handleSidebarCollapse}
              className="flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <MenuFoldIcon className="h-5 w-5 text-foreground" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {sidebarRoutesBasedOnRole.map(item => {
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          onClick={closeMobileMenu}
                          className={cn(
                            isActive
                              ? 'bg-[#0C1A31] text-[#3C83F6] border-r-[3px] border-[#3C83F6]'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                            'group flex gap-x-3 p-4 text-sm leading-6 font-medium transition-all duration-200',
                            isCollapsed && 'lg:justify-center',
                            'items-center'
                          )}
                          title={isCollapsed ? item.name : ''}
                        >
                          <item.icon
                            className={cn(
                              isActive
                                ? 'text-[#3C83F6]'
                                : 'text-muted-foreground group-hover:text-foreground',
                              'h-5 w-5 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          <span
                            className={cn('block', isCollapsed && 'lg:hidden')}
                          >
                            {item.name}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};
