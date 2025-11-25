import { Navigate } from 'react-router-dom';
import { useAuth } from '@/services/auth/useAuth';
import { useUser } from '@/services/user/useUser';
import { ROUTES } from '@/routes/routeNames';
import { ERole } from '@/enums';

const Root = () => {
  const { isAuthenticated } = useAuth();
  const { useFetchProfileQuery } = useUser();
  const { data: user, isLoading } = useFetchProfileQuery();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isLoading || !user) {
    return null;
  }

  const redirectPath =
    user.role === ERole.MERCHANT ? ROUTES.PROGRAMS_ACTIVE : ROUTES.DISCOVER;

  return <Navigate to={redirectPath} replace />;
};

export default Root;
