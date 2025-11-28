import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ERole } from '@/enums';
import { ROUTES } from '@/routes';

export const useChooseRole = () => {
  const [role, setRole] = useState<ERole>(ERole.USER);
  const navigate = useNavigate();

  const handleRoleChange = (role: ERole) => {
    setRole(role);
  };

  const handleNextClick = () => {
    navigate(`${ROUTES.LOGIN}?role=${role}`);
  };

  return { role, handleRoleChange, handleNextClick };
};
