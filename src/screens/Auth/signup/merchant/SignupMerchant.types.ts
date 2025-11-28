import { ILocation } from '@/interfaces';
import { EIndustry } from '@/enums';

export interface IMerchantSignupFormValues {
  fullName: string;
  email: string;
  businessName: string;
  phoneNumber: string;
  location: ILocation;
  industry: EIndustry | null;
  agreedToTerms: boolean;
}
