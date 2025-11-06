import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ERole } from '@/enums';
import { ROUTES } from '@/routes';

export const useSignupChooseRole = () => {
  const [role, setRole] = useState<ERole>(ERole.USER);
  const navigate = useNavigate();

  const handleRoleChange = (role: ERole) => {
    setRole(role);
  };

  const handleNextClick = () => {
    if (role === ERole.USER) {
      navigate(ROUTES.SIGNUP_USER);
    } else {
      navigate(ROUTES.SIGNUP_MERCHANT);
    }
  };

  return { role, handleRoleChange, handleNextClick };
};
