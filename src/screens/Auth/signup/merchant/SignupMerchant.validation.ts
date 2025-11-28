import * as Yup from 'yup';
import { EIndustry } from '@/enums';

export const merchantSignupSchema = Yup.object().shape({
  fullName: Yup.string().min(2, 'At least 2 characters').required('Full name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  businessName: Yup.string().min(2, 'At least 2 characters').required('Business name is required'),
  phoneNumber: Yup.string()
    .matches(/^\+?\d{8,}$/, 'Phone number must contain only numbers and optionally start with +')
    .required('Phone number is required'),
  location: Yup.object()
    .shape({
      address: Yup.string().min(2, 'At least 2 characters'),
      latitude: Yup.number().min(0, 'Latitude is required'),
      longitude: Yup.number().min(0, 'Longitude is required'),
    })
    .optional(),
  industry: Yup.string()
    .oneOf(Object.values(EIndustry), 'Industry is required')
    .required('Industry is required'),
  agreedToTerms: Yup.boolean()
    .test('is-true', 'You must agree to the terms and conditions', value => value === true)
    .required('You must agree to the terms and conditions'),
});
