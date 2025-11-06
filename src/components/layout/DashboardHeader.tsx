import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom/';
import { useUser } from '@/services/user/useUser';
import { ROUTES } from '@/routes/routeNames';
import { useSidebar } from '@/contexts';

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const { useFetchProfileQuery } = useUser();
  const { data: user } = useFetchProfileQuery();
  const { setIsMobileOpen } = useSidebar();

  const handleProfileClick = () => {
    navigate(ROUTES.PROFILE);
  };

  const handleMenuClick = () => {
    setIsMobileOpen(true);
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-[#1F1F1F] backdrop-blur-sm px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        className="lg:hidden p-2 [&_svg]:size-5"
        onClick={handleMenuClick}
        aria-label="Open sidebar"
      >
        <Menu />
      </Button>

      <div
        className="flex items-center justify-end w-full gap-x-3 cursor-pointer hover:opacity-80"
        onClick={handleProfileClick}
      >
        <span className="text-sm font-medium text-foreground  sm:inline">
          Hi, {user?.fullName}
        </span>
      </div>
    </div>
  );
};
