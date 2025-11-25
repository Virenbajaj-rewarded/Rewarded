import * as Yup from 'yup';

export const programFormValidationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  strategy: Yup.string().required('Strategy is required'),
  maxDailyBudget: Yup.string()
    .required('Max daily budget is required')
    .matches(/^\d+(\.\d+)?$/, 'Only numbers are allowed')
    .test(
      'not-exceed-budget',
      'Max daily budget cant be higher than budget',
      function (value) {
        const { budget } = this.parent;
        if (!value || !budget) return true;
        return parseFloat(value) <= parseFloat(budget);
      }
    ),
  budget: Yup.string()
    .required('Budget is required')
    .matches(/^\d+(\.\d+)?$/, 'Only numbers are allowed'),
  offerType: Yup.string().required('Offer type is required'),
  percentBack: Yup.string().when('strategy', {
    is: (strategy: string) => strategy === 'PERCENT_BACK',
    then: schema =>
      schema
        .required('Percentage is required')
        .matches(/^\d+(\.\d+)?$/, 'Only numbers are allowed')
        .test('min-value', 'Must be greater than 0', value => {
          if (!value) return false;
          return parseFloat(value) > 0;
        })
        .test('max-value', 'Must be 100 or less', value => {
          if (!value) return false;
          return parseFloat(value) <= 100;
        }),
    otherwise: schema => schema.notRequired(),
  }),
  spendThreshold: Yup.string().when('strategy', {
    is: (strategy: string) => strategy === 'SPEND_TO_EARN',
    then: schema =>
      schema
        .required('Amount to spend is required')
        .matches(/^\d+(\.\d+)?$/, 'Only numbers are allowed')
        .test('min-value', 'Must be greater than 0', value => {
          if (!value) return false;
          return parseFloat(value) > 0;
        }),
    otherwise: schema => schema.notRequired(),
  }),
  rewardPercent: Yup.string().when('strategy', {
    is: (strategy: string) => strategy === 'SPEND_TO_EARN',
    then: schema =>
      schema
        .required('Reward amount is required')
        .matches(/^\d+(\.\d+)?$/, 'Only numbers are allowed')
        .test('min-value', 'Must be greater than 0', value => {
          if (!value) return false;
          return parseFloat(value) > 0;
        }),
    otherwise: schema => schema.notRequired(),
  }),
});
