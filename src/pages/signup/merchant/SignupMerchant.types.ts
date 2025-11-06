import { ILocation } from '@/interfaces';
import { EIndustry } from '@/enums';
import { ERole } from '@/enums';

export interface IMerchantSignupFormValues {
  fullName: string;
  email: string;
  businessName: string;
  phoneNumber: string;
  location: ILocation;
  industry: EIndustry | null;
}
