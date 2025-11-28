import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useChooseRole } from './useChooseRole';
import { Button } from '@/components/ui/button';
import UserIcon from '@/assets/user.svg?react';
import MerchantIcon from '@/assets/merchant.svg?react';

const ChooseRole = () => {
  const { role, handleRoleChange, handleNextClick } = useChooseRole();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414] p-4">
      <Card className="w-full max-w-md p-[40px]">
        <div className="flex items-center mb-4">
          <CardTitle className="text-[30px] text-white">
            Choose Your Role
          </CardTitle>
        </div>
        <CardDescription className="text-[14px] text-[#BFBFBF]">
          Set up your rewards program & payment system today
        </CardDescription>
        <RadioGroup
          value={role}
          onValueChange={handleRoleChange}
          className="mt-7"
        >
          <div className="flex flex-col items-center justify-center gap-[16px]">
            <label htmlFor="user" className="w-full cursor-pointer">
              <Card className="bg-[#1F1F1F] w-full h-[140px] p-[24px] hover:bg-[#2A2A2A] transition-colors">
                <div className="flex items-center  gap-[8px] mb-3">
                  <RadioGroupItem value="USER" id="user" />
                  <UserIcon width={24} height={24} />
                  <CardTitle className="text-[24px] text-white">User</CardTitle>
                </div>

                <CardDescription className="text-[14px] text-[#F0F0F0]">
                  Get your rewards program & pay with them at your favourite
                  stores
                </CardDescription>
              </Card>
            </label>
            <label htmlFor="merchant" className="w-full cursor-pointer">
              <Card className="bg-[#1F1F1F] w-full h-[140px] p-[24px] hover:bg-[#2A2A2A] transition-colors">
                <div className="flex items-center  gap-[8px] mb-3">
                  <RadioGroupItem value="MERCHANT" id="merchant" />
                  <MerchantIcon width={24} height={24} />
                  <CardTitle className="text-[24px] text-white">
                    Merchant
                  </CardTitle>
                </div>
                <CardDescription className="text-[14px] text-[#F0F0F0]">
                  Set up your rewards program & payment system today
                </CardDescription>
              </Card>
            </label>
          </div>
        </RadioGroup>
        <Button onClick={handleNextClick} className="w-full mt-10">
          Next
        </Button>
      </Card>
    </div>
  );
};

export default ChooseRole;
