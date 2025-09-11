import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  CreditCard,
  Gift,
  QrCode,
  Settings,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';

const navigation = [
  { name: 'Analytics', href: '/', icon: BarChart3 },
  { name: 'My Business QR Code', href: '/qr-codes', icon: QrCode },
  { name: 'My Business Profile', href: '/profile', icon: Settings },
  { name: 'Customer Analytics', href: '/customers', icon: Users },
  { name: 'Scan Customer QR', href: '/scan', icon: QrCode },
  { name: 'Balances', href: '/balances', icon: Wallet },
  { name: 'Rewards Program', href: '/rewards-program', icon: Gift },
  { name: 'Rewards Analytics', href: '/rewards-analytics', icon: TrendingUp },
  { name: 'Send Offers', href: '/offers', icon: Gift },
  { name: 'Request Payment', href: '/payment', icon: CreditCard },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card border-r border-border px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-primary-foreground rounded-full" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Rewarded</h1>
              <p className="text-xs text-muted-foreground">MERCHANT</p>
            </div>
          </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map(item => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-all duration-200'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive
                              ? 'text-primary-foreground'
                              : 'text-muted-foreground group-hover:text-foreground',
                            'h-5 w-5 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
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
  );
};
