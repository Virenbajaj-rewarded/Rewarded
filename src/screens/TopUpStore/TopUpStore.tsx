import { View, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { Typography, TextField, PrimaryButton } from '@/components';
import IconByVariant from '@/components/atoms/IconByVariant';
import SafeScreen from '@/components/templates/SafeScreen';
import { formatCurrency } from '@/utils';
import { styles } from './TopUpStore.styles';
import { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { useTopUpStore } from './useTopUpStore';
import { FormikProvider } from 'formik';

export default function TopUpStore({ route, navigation }: RootScreenProps<Paths.TOP_UP_STORE>) {
  const storeName = route.params.storeName;

  const { formik, creditPointLoading, creditPointSuccess, handleGoBack, balance } = useTopUpStore({
    navigation,
    route,
  });
  const { values, errors, touched, handleChange, handleBlur } = formik;

  if (creditPointLoading) {
    return (
      <SafeScreen>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="small" color="#639CF8" />
        </View>
      </SafeScreen>
    );
  }

  if (creditPointSuccess) {
    return (
      <SafeScreen>
        <View style={styles.stateContainer}>
          <IconByVariant path="circle-success" width={80} height={80} />

          <View style={styles.textContainer}>
            <Typography fontVariant="medium" fontSize={24} color="#FFFFFF" textAlign="center">
              Top Up Successful
            </Typography>

            <Typography fontVariant="regular" fontSize={14} color="#BFBFBF" textAlign="center">
              CAD {formik.values.points} added to {storeName}&apos;s store.
            </Typography>
          </View>

          <PrimaryButton
            label="Back to Store"
            onPress={handleGoBack}
            style={styles.backButton}
            textStyle={styles.backButtonText}
          />
        </View>
      </SafeScreen>
    );
  }

  return (
    <FormikProvider value={formik}>
      <SafeScreen>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.contentContainer}>
              <Typography fontVariant="medium" fontSize={20} color="#FFFFFF">
                Enter top up amount
              </Typography>
              <View style={styles.programBalanceContainer}>
                <IconByVariant path="wallet" width={12} height={12} color="#639CF8" />
                <Typography fontVariant="regular" fontSize={14} color="#639CF8">
                  {formatCurrency(balance || 0)}
                </Typography>
              </View>

              <TextField
                value={values.points}
                onChangeText={handleChange('points')}
                onBlur={handleBlur('points')}
                keyboardType="number-pad"
                error={touched.points && errors.points ? errors.points : undefined}
                style={styles.pointsInput}
              />
            </View>
            <View style={styles.buttonContainer}>
              <PrimaryButton
                label={creditPointLoading ? 'Topping up...' : 'Top Up'}
                onPress={() => formik.handleSubmit()}
                disabled={!formik.isValid || !formik.dirty || creditPointLoading}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeScreen>
    </FormikProvider>
  );
}
