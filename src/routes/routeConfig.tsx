import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PublicRoute from '@/components/auth/PublicRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Root from '../pages/Root';
import Profile from '../pages/profile/Profile';
import Customers from '../pages/Customers';
import Login from '../pages/login/Login';
import SignupUser from '../pages/signup/user/SignupUser';
import NotFound from '../pages/NotFound';
import SignupMerchant from '../pages/signup/merchant/SignupMerchant';
import SignupChooseRole from '../pages/signup/choose-role/SignupChooseRole';
import ConfirmEmail from '../pages/confirm-email/ConfirmEmail';
import SetPassword from '../pages/set-password/SetPassword';
import { ROUTES } from './routeNames';
import ChangePassword from '../pages/change-password/ChangePassword';
import ForgotPassword from '../pages/forgot-password/ForgotPassword';
import SignupMerchantSuccess from '../pages/signup/signup-merchant-success/SignupMerchantSuccess';
import Programs from '../pages/programs/Programs';
import Business from '../pages/business/Business';
import Balance from '../pages/balance/Balance';
import Request from '../pages/request/Request';
import Discover from '../pages/discover/Discover';
import Expenses from '../pages/expenses/Expenses';
import Favourites from '../pages/favourites/Favourites';
import Wallet from '../pages/wallet/Wallet';
import { ERole } from '../enums';

export type ProtectedRouteConfig = RouteObject & { allowedRoles?: ERole[] };

export const publicRoutes: RouteObject[] = [
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.SIGNUP_CHOOSE_ROLE,
    element: <SignupChooseRole />,
  },
  {
    path: ROUTES.SIGNUP_MERCHANT,
    element: <SignupMerchant />,
  },
  {
    path: ROUTES.SIGNUP_USER,
    element: <SignupUser />,
  },
  {
    path: ROUTES.CONFIRM_EMAIL,
    element: <ConfirmEmail />,
  },
  {
    path: ROUTES.SET_PASSWORD,
    element: <SetPassword />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: ROUTES.SIGNUP_MERCHANT_SUCCESS,
    element: <SignupMerchantSuccess />,
  },
];

export const protectedRoutes: ProtectedRouteConfig[] = [
  {
    path: ROUTES.PROFILE,
    element: <Profile />,
  },
  {
    path: ROUTES.CHANGE_PASSWORD,
    element: <ChangePassword />,
  },
  {
    path: ROUTES.PROGRAMS,
    element: <Programs />,
  },
  {
    path: ROUTES.BUSINESS,
    element: <Business />,
  },
  {
    path: ROUTES.CUSTOMERS,
    element: <Customers />,
  },
  {
    path: ROUTES.BALANCE,
    element: <Balance />,
  },
  {
    path: ROUTES.REQUEST,
    element: <Request />,
  },
  {
    path: ROUTES.DISCOVER,
    element: <Discover />,
  },
  {
    path: ROUTES.EXPENSES,
    element: <Expenses />,
  },
  {
    path: ROUTES.FAVOURITES,
    element: <Favourites />,
  },
  {
    path: ROUTES.WALLET,
    element: <Wallet />,
  },
];

export const createProtectedRoutes = (
  routes: ProtectedRouteConfig[]
): RouteObject[] => {
  return routes.map(route => ({
    path: route.path,
    element: (
      <ProtectedRoute>
        <DashboardLayout>{route.element}</DashboardLayout>
      </ProtectedRoute>
    ),
  }));
};

export const createPublicRoutes = (routes: RouteObject[]): RouteObject[] => {
  return routes.map(route => ({
    ...route,
    element: <PublicRoute>{route.element}</PublicRoute>,
  }));
};
export const specialRoutes: RouteObject[] = [
  {
    path: ROUTES.ROOT,
    element: <Root />,
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFound />,
  },
];
