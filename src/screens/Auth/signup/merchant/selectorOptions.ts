import { EIndustryDisplayNames } from '@/enums';

export const industryOptions = Object.entries(EIndustryDisplayNames).map(([key, value]) => ({
  value: key,
  label: value,
}));
