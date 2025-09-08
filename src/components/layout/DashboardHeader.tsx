import { Button } from "@/components/ui/button";
import { Bell, ChevronDown, Menu, LogOut, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const pageTitles: Record<string, string> = {
  "/": "Rewards Analytics",
  "/qr-codes": "My Business QR Code",
  "/balances": "Balances",
  "/rewards-program": "Rewards Program",
  "/profile": "My Business Profile",
  "/customers": "Customer Analytics",
  "/scan": "Scan Customer QR",
  "/rewards-analytics": "Rewards Analytics",
  "/offers": "Send Offers",
  "/payment": "Request Payment",
};

export const DashboardHeader = () => {
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || "Dashboard";
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card/80 backdrop-blur-sm px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <Button variant="ghost" size="sm" className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1">
          <h1 className="text-xl font-semibold text-foreground self-center">
            {currentTitle}
          </h1>
        </div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {currentTitle === "Rewards Analytics" && (
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-card hover:bg-muted border-border hidden sm:flex"
            >
              Custom dates
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-x-3 cursor-pointer hover:opacity-80">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {user?.businessName?.charAt(0) || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground hidden sm:inline">{user?.businessName || 'Merchant'}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};