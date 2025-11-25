import type { ComponentType, SVGProps } from 'react';
import { ERole } from '../../enums';

import ProgramsIcon from '@/assets/menu.svg?react';
import CustomersIcon from '@/assets/customers.svg?react';
import BusinessIcon from '@/assets/business.svg?react';
import BalanceIcon from '@/assets/balance.svg?react';
import RequestIcon from '@/assets/request.svg?react';
import DiscoverIcon from '@/assets/search.svg?react';
import WalletIcon from '@/assets/wallet.svg?react';
import FavouritesIcon from '@/assets/heart.svg?react';
import { ROUTES } from '@/routes/routeNames';

export type SidebarRoute = {
  name: string;
  href?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  role: ERole;
  children?: Array<{
    name: string;
    href: string;
    role?: ERole;
  }>;
};

export const sidebarRoutes: SidebarRoute[] = [
  {
    name: 'Program',
    icon: ProgramsIcon,
    role: ERole.MERCHANT,
    children: [
      {
        name: 'Active',
        href: ROUTES.PROGRAMS_ACTIVE,
      },
      {
        name: 'Drafts',
        href: ROUTES.PROGRAMS_DRAFTS,
      },
      {
        name: 'Stopped',
        href: ROUTES.PROGRAMS_STOPPED,
      },
    ],
  },
  {
    name: 'Customers',
    href: ROUTES.CUSTOMERS,
    icon: CustomersIcon,
    role: ERole.MERCHANT,
  },
  {
    name: 'Business',
    href: ROUTES.BUSINESS,
    icon: BusinessIcon,
    role: ERole.MERCHANT,
  },
  {
    name: 'Balance',
    href: ROUTES.BALANCE,
    icon: BalanceIcon,
    role: ERole.MERCHANT,
  },
  {
    name: 'Request',
    href: ROUTES.REQUEST,
    icon: RequestIcon,
    role: ERole.MERCHANT,
  },
  {
    name: 'Discover',
    href: ROUTES.DISCOVER,
    icon: DiscoverIcon,
    role: ERole.USER,
  },
  {
    name: 'Expenses',
    href: ROUTES.EXPENSES,
    icon: ProgramsIcon,
    role: ERole.USER,
  },
  {
    name: 'Favourites',
    href: ROUTES.FAVOURITES,
    icon: FavouritesIcon,
    role: ERole.USER,
  },
  { name: 'Wallet', href: ROUTES.WALLET, icon: WalletIcon, role: ERole.USER },
];
