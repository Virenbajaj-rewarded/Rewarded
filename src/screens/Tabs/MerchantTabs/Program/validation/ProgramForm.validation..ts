import * as Yup from 'yup';

const normalizeDecimal = (value: string): string => value.replace(',', '.');

export const programFormValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  strategy: Yup.string().required('Strategy is required'),
  maxDailyBudget: Yup.string()
    .required('Max daily budget is required')
    .matches(/^\d+([.,]\d+)?$/, 'Only numbers are allowed')
    .test('not-exceed-budget', 'Max daily budget cant be higher than budget', function (value) {
      const { budget } = this.parent;
      if (!value || !budget) return true;
      return parseFloat(normalizeDecimal(value)) <= parseFloat(normalizeDecimal(budget));
    }),
  budget: Yup.string()
    .required('Budget is required')
    .matches(/^\d+([.,]\d+)?$/, 'Only numbers are allowed'),
  offerType: Yup.string().required('Offer type is required'),
  percentBack: Yup.string().when('strategy', {
    is: (strategy: string) => strategy === 'PERCENT_BACK',
    then: schema =>
      schema
        .test('required', function (value) {
          const { offerType } = this.parent;
          if (!value) {
            return this.createError({
              message:
                offerType === 'POINTS_CASHBACK' ? 'Percentage is required' : 'Amount is required',
            });
          }
          return true;
        })
        .matches(/^\d+([.,]\d+)?$/, 'Only numbers are allowed')
        .test('min-value', 'Must be greater than 0', value => {
          if (!value) return false;
          return parseFloat(normalizeDecimal(value)) > 0;
        })
        .test('max-value', 'Must be 100 or less', function (value) {
          const { offerType } = this.parent;
          if (!value) return false;
          // Only apply max-value constraint for POINTS_CASHBACK
          if (offerType === 'POINTS_CASHBACK') {
            return parseFloat(normalizeDecimal(value)) <= 100;
          }
          return true;
        }),
    otherwise: schema => schema.notRequired(),
  }),
  spendThreshold: Yup.string().when('strategy', {
    is: (strategy: string) => strategy === 'SPEND_TO_EARN',
    then: schema =>
      schema
        .required('Amount to spend is required')
        .matches(/^\d+([.,]\d+)?$/, 'Only numbers are allowed')
        .test('min-value', 'Must be greater than 0', value => {
          if (!value) return false;
          return parseFloat(normalizeDecimal(value)) > 0;
        }),
    otherwise: schema => schema.notRequired(),
  }),
  rewardPercent: Yup.string().when('strategy', {
    is: (strategy: string) => strategy === 'SPEND_TO_EARN',
    then: schema =>
      schema
        .required('Reward amount is required')
        .matches(/^\d+([.,]\d+)?$/, 'Only numbers are allowed')
        .test('min-value', 'Must be greater than 0', value => {
          if (!value) return false;
          return parseFloat(normalizeDecimal(value)) > 0;
        }),
    otherwise: schema => schema.notRequired(),
  }),
});
