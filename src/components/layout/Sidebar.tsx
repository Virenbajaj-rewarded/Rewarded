import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useSidebar } from '@/contexts';
import { ERole } from '../../enums';
import MenuFoldIcon from '@/assets/menu-fold.svg?react';
import { sidebarRoutes, type SidebarRoute } from './sidebarRoutes';

export const Sidebar = () => {
  const location = useLocation();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } =
    useSidebar();

  const userRole = localStorage.getItem('userRole') as ERole | null;

  const sidebarRoutesBasedOnRole = useMemo(() => {
    return sidebarRoutes
      .filter(item => item.role === userRole)
      .map(item => ({
        ...item,
        children: item.children?.filter(
          child => !child.role || child.role === userRole
        ),
      }));
  }, [userRole]);

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const isPathActive = (href?: string) => {
    if (!href) return false;
    return (
      location.pathname === href || location.pathname.startsWith(`${href}/`)
    );
  };

  const toggleMenu = (menu: SidebarRoute) => {
    setOpenMenus(prev => {
      const current = prev[menu.name];
      const nextValue = current === undefined ? false : !current;
      return {
        ...prev,
        [menu.name]: nextValue,
      };
    });
  };

  const handleMenuToggle = (
    event: MouseEvent<HTMLButtonElement>,
    menu: SidebarRoute
  ) => {
    event.preventDefault();
    event.stopPropagation();
    toggleMenu(menu);
  };

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
                    const hasChildren = (item.children?.length ?? 0) > 0;
                    const parentHasActiveChild = item.children?.some(child =>
                      isPathActive(child.href)
                    );
                    const isActive =
                      isPathActive(item.href) || parentHasActiveChild;
                    const storedState = openMenus[item.name];
                    const isMenuOpen = hasChildren
                      ? storedState !== undefined
                        ? storedState
                        : true
                      : false;
                    return (
                      <li key={item.name}>
                        <div>
                          {hasChildren ? (
                            <div
                              className={cn(
                                isActive
                                  ? 'bg-[#0C1A31] text-[#3C83F6] border-r-[3px] border-[#3C83F6]'
                                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                'group flex items-center gap-x-3 p-4 text-sm leading-6 font-medium transition-all duration-200',
                                isCollapsed && 'lg:justify-center'
                              )}
                              title={isCollapsed ? item.name : ''}
                            >
                              <Link
                                to={item.children?.[0]?.href ?? '#'}
                                onClick={closeMobileMenu}
                                className={cn(
                                  'flex flex-1 items-center gap-x-3 text-inherit',
                                  isCollapsed && 'lg:justify-center'
                                )}
                              >
                                {item.icon && (
                                  <item.icon
                                    className={cn(
                                      isActive
                                        ? 'text-[#3C83F6]'
                                        : 'text-muted-foreground group-hover:text-foreground',
                                      'h-5 w-5 shrink-0'
                                    )}
                                    aria-hidden="true"
                                  />
                                )}
                                <span
                                  className={cn(
                                    'block flex-1 text-left',
                                    isCollapsed && 'lg:hidden'
                                  )}
                                >
                                  {item.name}
                                </span>
                              </Link>
                              <button
                                type="button"
                                onClick={event => handleMenuToggle(event, item)}
                                className={cn(
                                  'ml-2 flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground',
                                  isCollapsed ? 'lg:ml-0' : 'lg:ml-2',
                                  isActive && 'text-[#3C83F6]'
                                )}
                                aria-label={
                                  isMenuOpen
                                    ? 'Collapse submenu'
                                    : 'Expand submenu'
                                }
                              >
                                <ChevronDown
                                  color={'#fff'}
                                  className={cn(
                                    'h-4 w-4 transition-transform',
                                    isMenuOpen && 'rotate-180'
                                  )}
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          ) : (
                            <Link
                              to={item.href ?? '#'}
                              onClick={closeMobileMenu}
                              className={cn(
                                isActive
                                  ? 'bg-[#0C1A31] text-[#3C83F6] border-r-[3px] border-[#3C83F6]'
                                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                'group flex gap-x-3 p-4 text-sm leading-6 font-medium transition-all duration-200 items-center',
                                isCollapsed && 'lg:justify-center'
                              )}
                              title={isCollapsed ? item.name : ''}
                            >
                              {item.icon && (
                                <item.icon
                                  className={cn(
                                    isActive
                                      ? 'text-[#3C83F6]'
                                      : 'text-muted-foreground group-hover:text-foreground',
                                    'h-5 w-5 shrink-0'
                                  )}
                                  aria-hidden="true"
                                />
                              )}
                              <span
                                className={cn(
                                  'block',
                                  isCollapsed && 'lg:hidden'
                                )}
                              >
                                {item.name}
                              </span>
                            </Link>
                          )}
                        </div>
                        {hasChildren && isMenuOpen && (
                          <ul role="list" className="mt-1 space-y-1">
                            {item.children?.map(child => {
                              const childIsActive = isPathActive(child.href);
                              return (
                                <li key={child.name}>
                                  <Link
                                    to={child.href}
                                    onClick={closeMobileMenu}
                                    className={cn(
                                      childIsActive
                                        ? 'bg-[#0C1A31] text-[#3C83F6] border-r-[3px] border-[#3C83F6]'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                      'group flex items-center p-3 text-sm leading-6 font-medium transition-all duration-200',
                                      isCollapsed && 'lg:justify-center'
                                    )}
                                    title={isCollapsed ? child.name : ''}
                                  >
                                    <span
                                      className={cn(
                                        'block w-full pl-4',
                                        isCollapsed
                                          ? 'lg:pl-0 lg:text-xs lg:font-medium lg:text-center'
                                          : 'lg:pl-6'
                                      )}
                                    >
                                      {child.name}
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
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
