import { Button } from "@/components/ui/button";
import { Bell, ChevronDown, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

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
          <div className="flex items-center gap-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-full" />
            <span className="text-sm font-medium text-foreground hidden sm:inline">Merchant</span>
          </div>
        </div>
      </div>
    </div>
  );
};