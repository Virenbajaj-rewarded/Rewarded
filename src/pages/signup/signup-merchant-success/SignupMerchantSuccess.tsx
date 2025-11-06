import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import WarningIcon from '@/assets/warning.svg?react';
import { useLocation } from 'react-router-dom';

const SignupMerchantSuccess = () => {
  const location = useLocation();
  const email = location.state?.email;
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-[40px]">
        <CardHeader className="text-center p-0 flex flex-col items-center gap-[24px]">
          <WarningIcon width={80} height={80} />
          <CardTitle className="text-[24px] text-white">
            Complete Your Business Setup
          </CardTitle>

          <CardDescription className="text-[14px] text-[#BFBFBF] text-center">
            Verification may take up to 24 hours. Once complete, we’ll send a
            link to <span className="text-white">{email}</span> to finalize your
            business setup. If verification fails, you’ll receive an email with
            instructions to try again.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SignupMerchantSuccess;
