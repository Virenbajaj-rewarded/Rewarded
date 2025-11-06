import { ILocation } from './ILocation';
import { EIndustry } from '@/enums';

export interface IMerchant {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  businessName: string;
  location: ILocation;
  industry: EIndustry | null;
}
