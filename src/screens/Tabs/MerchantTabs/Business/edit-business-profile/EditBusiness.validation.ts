import * as Yup from 'yup';
import { EIndustry } from '@/enums';

export const businessValidationSchema = Yup.object().shape({
  businessName: Yup.string().min(2, 'At least 2 characters').required('Name is required'),
  storeType: Yup.string()
    .oneOf(Object.values(EIndustry), 'Industry is required')
    .nullable()
    .test('required', 'Industry is required', value => value !== null),
  description: Yup.string().optional(),
  businessEmail: Yup.string().email('Invalid email format').required('Email is required'),
  businessPhoneNumber: Yup.string()
    .matches(/^\+?\d{8,}$/, 'Phone number must contain only numbers and optionally start with +')
    .required('Phone number is required'),
  location: Yup.object()
    .shape({
      address: Yup.string().min(2, 'At least 2 characters').required('Address is required'),
      latitude: Yup.number()
        .required('Latitude is required')
        .test('not-zero', 'Latitude is required', function (value) {
          const { address } = this.parent;
          if (address && address.length >= 2) {
            return value !== 0;
          }
          return true;
        }),
      longitude: Yup.number()
        .required('Longitude is required')
        .test('not-zero', 'Longitude is required', function (value) {
          const { address } = this.parent;
          if (address && address.length >= 2) {
            return value !== 0;
          }
          return true;
        }),
    })
    .required('Address is required'),
  tgUsername: Yup.string()
    .optional()
    .test('starts-with-at', 'Username must start with @', function (value) {
      if (!value) return true;
      return value.startsWith('@');
    }),
  whatsppUsername: Yup.string().optional(),
});
