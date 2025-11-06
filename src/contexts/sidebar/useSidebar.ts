import { useContext } from 'react';
import { SidebarContext } from './SidebarContextValue';

export const useSidebar = () => useContext(SidebarContext);
