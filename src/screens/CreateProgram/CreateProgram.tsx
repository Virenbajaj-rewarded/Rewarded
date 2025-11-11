import { View, ScrollView } from 'react-native';
import {
  Typography,
  TextField,
  PrimaryButton,
  HorizontalRadioGroup,
  PercentageSlider,
} from '@/components';
import { Paths } from '@/navigation/paths';
import { RootScreenProps } from '@/navigation/types';
import { useCreateProgram } from './useCreateProgram';
import { styles } from './CreateProgram.styles';
import { FormikProvider } from 'formik';
import SafeScreen from '@/components/templates/SafeScreen';
import {
  EProgramStrategy,
  EProgramStrategyDisplayNames,
  EOfferType,
  EOfferTypeDisplayNames,
} from '@/enums';

export default function CreateProgram({ navigation }: RootScreenProps<Paths.CREATE_PROGRAM>) {
  const { formik, handleStrategyChange, handleOfferTypeChange, handleGoBack } = useCreateProgram({
    navigation,
  });
  const {
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    values,
    isValid,
    dirty,
    handleSubmit,
  } = formik;
  const {
    name,
    strategy,
    offerType,
    budget,
    capPerTransaction,
    percentBack,
    spendThreshold,
    rewardPercent,
  } = values;

  const renderOfferTypeFields = () => {
    if (strategy === EProgramStrategy.PERCENT_BACK && offerType === EOfferType.POINTS_CASHBACK) {
      return (
        <PercentageSlider
          value={Number(percentBack) || 0}
          onValueChange={value => setFieldValue('percentBack', value.toString())}
        />
      );
    }

    if (
      strategy === EProgramStrategy.PERCENT_BACK &&
      offerType === EOfferType.FIXED_AMOUNT_POINTS
    ) {
      return (
        <TextField
          keyboardType="numeric"
          label="Amount of CAD Points"
          value={percentBack?.toString() || ''}
          onChangeText={handleChange('percentBack')}
          onBlur={handleBlur('percentBack')}
          placeholder="Enter percentage"
          error={touched.percentBack && errors.percentBack ? errors.percentBack : undefined}
        />
      );
    }

    if (strategy === EProgramStrategy.SPEND_TO_EARN && offerType === EOfferType.POINTS_CASHBACK) {
      return (
        <>
          <TextField
            keyboardType="numeric"
            label="Amount to Spend"
            value={spendThreshold?.toString() || ''}
            onChangeText={handleChange('spendThreshold')}
            onBlur={handleBlur('spendThreshold')}
            placeholder="Enter amount"
            mask="CAD"
            error={
              touched.spendThreshold && errors.spendThreshold ? errors.spendThreshold : undefined
            }
          />
          <TextField
            keyboardType="numeric"
            label="% of Cashback"
            value={rewardPercent?.toString() || ''}
            onChangeText={handleChange('rewardPercent')}
            onBlur={handleBlur('rewardPercent')}
            placeholder="Enter percentage"
            error={touched.rewardPercent && errors.rewardPercent ? errors.rewardPercent : undefined}
          />
        </>
      );
    }

    if (
      strategy === EProgramStrategy.SPEND_TO_EARN &&
      offerType === EOfferType.FIXED_AMOUNT_POINTS
    ) {
      return (
        <>
          <TextField
            keyboardType="numeric"
            label="Amount to Spend"
            value={spendThreshold?.toString() || ''}
            onChangeText={handleChange('spendThreshold')}
            onBlur={handleBlur('spendThreshold')}
            placeholder="Enter amount"
            mask="CAD"
            error={
              touched.spendThreshold && errors.spendThreshold ? errors.spendThreshold : undefined
            }
          />
          <TextField
            keyboardType="numeric"
            label="Amount of CAD Points"
            value={rewardPercent?.toString() || ''}
            onChangeText={handleChange('rewardPercent')}
            onBlur={handleBlur('rewardPercent')}
            placeholder="Enter amount of points"
            error={touched.rewardPercent && errors.rewardPercent ? errors.rewardPercent : undefined}
          />
        </>
      );
    }

    return null;
  };

  return (
    <FormikProvider value={formik}>
      <SafeScreen style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <View style={styles.cardContainer}>
            <Typography fontVariant="medium" fontSize={24} color="#FFFFFF">
              General
            </Typography>
            <TextField
              label="Offer Name"
              value={name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              placeholder="Enter program name"
              error={touched.name && errors.name ? errors.name : undefined}
            />

            <HorizontalRadioGroup
              value={strategy}
              onValueChange={handleStrategyChange}
              options={[
                {
                  value: EProgramStrategy.PERCENT_BACK,
                  label: EProgramStrategyDisplayNames.PERCENT_BACK,
                },
                {
                  value: EProgramStrategy.SPEND_TO_EARN,
                  label: EProgramStrategyDisplayNames.SPEND_TO_EARN,
                },
              ]}
              color="#3c83f6"
              uncheckedColor="#FFFFFF"
            />
            <View style={styles.budgetContainer}>
              <TextField
                keyboardType="numeric"
                label="Budget"
                value={budget.toString()}
                onChangeText={handleChange('budget')}
                onBlur={handleBlur('budget')}
                placeholder="Enter Budget"
                mask="CAD"
                error={touched.budget && errors.budget ? errors.budget : undefined}
              />
              <Typography fontVariant="regular" fontSize={14} color="#BFBFBF">
                Set a budget higher than 0
              </Typography>
            </View>
            <TextField
              keyboardType="numeric"
              label="Cap per Transaction"
              value={capPerTransaction.toString()}
              onChangeText={handleChange('capPerTransaction')}
              onBlur={handleBlur('capPerTransaction')}
              placeholder="Enter Cap"
              mask="CAD"
              error={
                touched.capPerTransaction && errors.capPerTransaction
                  ? errors.capPerTransaction
                  : undefined
              }
            />
          </View>
          <View style={styles.cardContainer}>
            <Typography fontVariant="medium" fontSize={24} color="#FFFFFF">
              Offer Type
            </Typography>
            <HorizontalRadioGroup
              value={offerType}
              onValueChange={handleOfferTypeChange}
              options={[
                {
                  value: EOfferType.POINTS_CASHBACK,
                  label: EOfferTypeDisplayNames.POINTS_CASHBACK,
                },
                {
                  value: EOfferType.FIXED_AMOUNT_POINTS,
                  label: EOfferTypeDisplayNames.FIXED_AMOUNT_POINTS,
                },
              ]}
              color="#3c83f6"
              uncheckedColor="#FFFFFF"
            />
            {renderOfferTypeFields()}
          </View>
          <PrimaryButton label="Pay" disabled={!isValid || !dirty} onPress={() => {}} />
          <PrimaryButton
            label="Save as Draft"
            disabled={!isValid || !dirty}
            style={styles.draftButton}
            textStyle={styles.draftButtonText}
            onPress={handleSubmit}
          />
          <PrimaryButton
            label="Cancel"
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
            onPress={handleGoBack}
          />
        </ScrollView>
      </SafeScreen>
    </FormikProvider>
  );
}
