import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import {
  Typography,
  TextField,
  PrimaryButton,
  CircularRadioGroup,
  PercentageSlider,
  PaymentMethodModal,
} from '@/components';
import { FormikProps } from 'formik';
import { ICreateProgramPayload, IEditProgramPayload } from '@/services/program/program.types';
import { IProgram } from '@/interfaces';

import { styles } from './ProgramForm.styles';
import { FormikProvider } from 'formik';
import SafeScreen from '@/components/templates/SafeScreen';
import {
  EProgramStrategy,
  EProgramStrategyDisplayNames,
  EOfferType,
  EOfferTypeDisplayNames,
  EPaymentMethod,
} from '@/enums';
import ActivateProgramModal from '../ActivateProgramModal/ActivateProgramModal';

interface ProgramFormProps {
  formik: FormikProps<ICreateProgramPayload> | FormikProps<IEditProgramPayload>;
  handleGoBack: () => void;
  handlePayProgram: (selectedPaymentMethod: EPaymentMethod) => Promise<IProgram | undefined>;
  activateProgram: (id: string) => Promise<IProgram>;
  loading: boolean;
  initialBudget?: number;
}

export default function ProgramForm({
  formik,
  loading,
  handleGoBack,
  handlePayProgram,
  activateProgram,
  initialBudget,
}: ProgramFormProps) {
  const [isPaymentMethodModalVisible, setIsPaymentMethodModalVisible] = useState(false);
  const [isActivateModalVisible, setIsActivateModalVisible] = useState(false);
  const [programToActivate, setProgramToActivate] = useState<IProgram | null>(null);

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

  const showPaymentMethodModal = () => setIsPaymentMethodModalVisible(true);
  const hidePaymentMethodModal = () => setIsPaymentMethodModalVisible(false);

  const handlePaymentMethodSubmit = async (selectedPaymentMethod: EPaymentMethod) => {
    hidePaymentMethodModal();
    const program = await handlePayProgram(selectedPaymentMethod);
    if (program) {
      setProgramToActivate(program);
      setIsActivateModalVisible(true);
    }
  };

  const handleActivateProgram = async () => {
    if (programToActivate?.id) {
      try {
        await activateProgram(programToActivate.id);
        setIsActivateModalVisible(false);
        setProgramToActivate(null);
        handleGoBack();
      } catch (error) {
        setIsActivateModalVisible(false);
        handleGoBack();
        console.error(error);
      }
    }
  };

  const handleSaveAsDraft = () => {
    setIsActivateModalVisible(false);
    setProgramToActivate(null);
    handleGoBack();
  };

  const {
    name,
    strategy,
    offerType,
    budget,
    maxDailyBudget,
    percentBack,
    spendThreshold,
    rewardPercent,
  } = values;

  const handleStrategyChange = (value: string) => {
    formik.setFieldValue('strategy', value);

    if (value === EProgramStrategy.PERCENT_BACK) {
      formik.setFieldValue('spendThreshold', '');
      formik.setFieldValue('rewardPercent', '');
      formik.setFieldTouched('spendThreshold', false);
      formik.setFieldTouched('rewardPercent', false);
    } else if (value === EProgramStrategy.SPEND_TO_EARN) {
      formik.setFieldValue('percentBack', '');
      formik.setFieldTouched('percentBack', false);
    }
  };

  const handleOfferTypeChange = (value: string) => {
    formik.setFieldValue('offerType', value);

    const currentStrategy = formik.values.strategy;

    if (currentStrategy === EProgramStrategy.PERCENT_BACK) {
      formik.setFieldValue('percentBack', '');
      formik.setFieldTouched('percentBack', false);
    } else if (currentStrategy === EProgramStrategy.SPEND_TO_EARN) {
      formik.setFieldValue('spendThreshold', '');
      formik.setFieldValue('rewardPercent', '');
      formik.setFieldTouched('spendThreshold', false);
      formik.setFieldTouched('rewardPercent', false);
    }
  };

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
          required
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
            required
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
            required
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
            required
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
            required
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
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            keyboardDismissMode="on-drag"
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
          >
            <View style={styles.cardContainer}>
              <Typography fontVariant="medium" fontSize={24} color="#FFFFFF">
                General
              </Typography>
              <TextField
                required
                label="Offer Name"
                value={name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                placeholder="Enter program name"
                error={touched.name && errors.name ? errors.name : undefined}
              />

              <CircularRadioGroup
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
                  required
                  keyboardType="numeric"
                  label="Budget"
                  value={budget?.toString()}
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
                required
                keyboardType="numeric"
                label="Max Daily Budget"
                value={maxDailyBudget?.toString()}
                onChangeText={handleChange('maxDailyBudget')}
                onBlur={handleBlur('maxDailyBudget')}
                placeholder="Enter Max Daily Budget"
                mask="CAD"
                error={
                  touched.maxDailyBudget && errors.maxDailyBudget
                    ? errors.maxDailyBudget
                    : undefined
                }
              />
            </View>
            <View style={styles.cardContainer}>
              <Typography fontVariant="medium" fontSize={24} color="#FFFFFF">
                Offer Type
              </Typography>
              <CircularRadioGroup
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
            <PrimaryButton
              label="Pay"
              disabled={!isValid || !dirty || Number(initialBudget) === Number(values.budget)}
              onPress={showPaymentMethodModal}
            />
            <PrimaryButton
              label={loading ? 'Saving...' : 'Save as Draft'}
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
        </KeyboardAvoidingView>
      </SafeScreen>
      <PaymentMethodModal
        visible={isPaymentMethodModalVisible}
        onClose={hidePaymentMethodModal}
        onCancel={hidePaymentMethodModal}
        onSubmit={handlePaymentMethodSubmit}
      />
      {programToActivate && (
        <ActivateProgramModal
          visible={isActivateModalVisible}
          program={programToActivate}
          onClose={handleSaveAsDraft}
          onCancel={handleSaveAsDraft}
          onSubmit={handleActivateProgram}
        />
      )}
    </FormikProvider>
  );
}
