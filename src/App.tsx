import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QRCodes from "./pages/QRCodes";
import Balances from "./pages/Balances";
import RewardsProgram from "./pages/RewardsProgram";
import Profile from "./pages/Profile";
import Customers from "./pages/Customers";
import Scan from "./pages/Scan";
import RewardsAnalytics from "./pages/RewardsAnalytics";
import Offers from "./pages/Offers";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/qr-codes" element={<QRCodes />} />
          <Route path="/balances" element={<Balances />} />
          <Route path="/rewards-program" element={<RewardsProgram />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/rewards-analytics" element={<RewardsAnalytics />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/payment" element={<Payment />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
