import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routeNames';
import { Button } from '@/components/ui/button';
import PlusIcon from '@/assets/plus.svg?react';

export const CreateProgramButton = () => {
  const navigate = useNavigate();
  const handleCreateProgram = () => {
    navigate(ROUTES.CREATE_PROGRAM);
  };
  return (
    <Button
      onClick={handleCreateProgram}
      className="flex items-center justify-center gap-2"
    >
      <PlusIcon color={'#fff'} />
      Create New Program
    </Button>
  );
};
