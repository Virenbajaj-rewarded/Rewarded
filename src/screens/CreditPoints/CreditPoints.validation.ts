import * as Yup from 'yup';

export const creditPointsValidationSchema = Yup.object().shape({
  amountCents: Yup.number().required('Amount is required'),
  points: Yup.number()
    .required('Points are required')
    .test('points-amount-check', 'Points cannot exceed amount', function (value) {
      if (!value) return true;
      const { amountCents } = this.parent;
      if (!amountCents) return true;
      return value <= amountCents;
    }),
  comment: Yup.string().optional(),
});
