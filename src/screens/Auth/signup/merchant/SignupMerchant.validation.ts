import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { EIndustry } from '@/enums';

export const merchantSignupSchema = toFormikValidationSchema(
  z.object({
    fullName: z.string().min(2, { message: 'At least 2 characters' }),
    email: z.string().email({ message: 'Invalid email format' }),
    businessName: z.string().min(2, { message: 'At least 2 characters' }),
    phoneNumber: z.string().min(8, { message: 'Phone number is required' }),
    location: z
      .object({
        address: z.string().min(2, { message: 'At least 2 characters' }),
        latitude: z.number().min(0, { message: 'Latitude is required' }),
        longitude: z.number().min(0, { message: 'Longitude is required' }),
      })
      .optional(),
    industry: z.nativeEnum(EIndustry),
  })
);
