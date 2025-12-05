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
import ChooseRole from '../pages/choose-role/ChooseRole';
import ConfirmEmail from '../pages/confirm-email/ConfirmEmail';
import SetPassword from '../pages/set-password/SetPassword';
import { ROUTES } from './routeNames';
import ChangePassword from '../pages/change-password/ChangePassword';
import ForgotPassword from '../pages/forgot-password/request-forgot-password/ForgotPassword';
import ConfirmForgotPassword from '../pages/forgot-password/confirm-forgot-password/ConfirmForgotPassword';
import SetNewPassword from '../pages/forgot-password/set-new-password/SetNewPassword';
import SignupMerchantSuccess from '../pages/signup/signup-merchant-success/SignupMerchantSuccess';
import ActivePrograms from '../pages/programs/pages/active-programs/ActivePrograms';
import DraftPrograms from '../pages/programs/pages/draft-programs/DraftPrograms';
import StoppedPrograms from '../pages/programs/pages/stopped-programs/StoppedPrograms';
import CreateProgram from '../pages/programs/pages/create-program/CreateProgram';
import EditProgram from '../pages/programs/pages/edit-program/EditProgram';
import Business from '../pages/business/business-profile/Business';
import EditBusiness from '../pages/business/edit-business-profile/EditBusiness';
import Balance from '../pages/balance/Balance';
import Request from '../pages/request/Request';
import Discover from '../pages/discover/Discover';
import Expenses from '../pages/expenses/Expenses';
import MyStores from '../pages/my-stores/MyStores';
import Wallet from '../pages/wallet/Wallet';
import { StoreProfile } from '../pages/store-profile/StoreProfile';
import { ERole } from '../enums';

export type ProtectedRouteConfig = RouteObject & { allowedRoles?: ERole[] };

export const publicRoutes: RouteObject[] = [
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.CHOOSE_ROLE,
    element: <ChooseRole />,
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
    path: ROUTES.CONFIRM_FORGOT_PASSWORD,
    element: <ConfirmForgotPassword />,
  },
  {
    path: ROUTES.SET_NEW_PASSWORD,
    element: <SetNewPassword />,
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
    path: ROUTES.PROGRAMS_ACTIVE,
    element: <ActivePrograms />,
  },
  {
    path: ROUTES.PROGRAMS_DRAFTS,
    element: <DraftPrograms />,
  },
  {
    path: ROUTES.PROGRAMS_STOPPED,
    element: <StoppedPrograms />,
  },
  {
    path: ROUTES.CREATE_PROGRAM,
    element: <CreateProgram />,
  },
  {
    path: ROUTES.EDIT_PROGRAM,
    element: <EditProgram />,
  },
  {
    path: ROUTES.BUSINESS,
    element: <Business />,
  },
  {
    path: ROUTES.EDIT_BUSINESS_PROFILE,
    element: <EditBusiness />,
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
    path: ROUTES.MY_STORES,
    element: <MyStores />,
  },
  {
    path: ROUTES.STORE_PROFILE,
    element: <StoreProfile />,
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
