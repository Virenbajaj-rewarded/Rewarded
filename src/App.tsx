import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Index from './pages/Index';
import QRCodes from './pages/QRCodes';
import Balances from './pages/Balances';
import RewardsProgram from './pages/RewardsProgram';
import Profile from './pages/Profile';
import Customers from './pages/Customers';
import Scan from './pages/Scan';
import RewardsAnalytics from './pages/RewardsAnalytics';
import Offers from './pages/Offers';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/qr-codes"
              element={
                <ProtectedRoute>
                  <QRCodes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/balances"
              element={
                <ProtectedRoute>
                  <Balances />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rewards-program"
              element={
                <ProtectedRoute>
                  <RewardsProgram />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scan"
              element={
                <ProtectedRoute>
                  <Scan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rewards-analytics"
              element={
                <ProtectedRoute>
                  <RewardsAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offers"
              element={
                <ProtectedRoute>
                  <Offers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
