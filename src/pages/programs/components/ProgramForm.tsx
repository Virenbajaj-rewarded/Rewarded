import { FormikProvider, FormikProps } from 'formik';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IProgram } from '@/interfaces';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  EProgramStrategy,
  EProgramStrategyDisplayNames,
  EOfferType,
  EOfferTypeDisplayNames,
  EPaymentMethod,
  EPaymentMethodDisplayNames,
} from '@/enums';
import {
  ICreateProgramPayload,
  IEditProgramPayload,
} from '@/services/program/program.types';
import ArrowLeftIcon from '@/assets/arrow-left.svg?react';
import { useNavigate } from 'react-router-dom';
import { Gem, DollarSign, Zap } from 'lucide-react';

interface ProgramFormProps {
  formik: FormikProps<ICreateProgramPayload | IEditProgramPayload>;
  title: string;
  handlePayProgram: (
    selectedPaymentMethod: EPaymentMethod
  ) => Promise<IProgram | undefined>;
  activateProgram: (id: string) => Promise<IProgram>;
  showPayButton?: boolean;
  loading?: boolean;
  initialBudget?: number;
}

export const ProgramForm = ({
  formik,
  title,
  handlePayProgram,
  activateProgram,
  showPayButton = true,
  loading = false,
  initialBudget,
}: ProgramFormProps) => {
  const [isPaymentMethodModalVisible, setIsPaymentMethodModalVisible] =
    useState(false);
  const [isActivateModalVisible, setIsActivateModalVisible] = useState(false);
  const [programToActivate, setProgramToActivate] = useState<IProgram | null>(
    null
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<EPaymentMethod>(EPaymentMethod.POINT_BALANCE);

  const paymentMethodOptions = [
    {
      value: EPaymentMethod.POINT_BALANCE,
      label: EPaymentMethodDisplayNames[EPaymentMethod.POINT_BALANCE],
    },
    {
      value: EPaymentMethod.VISA_MASTERCARD,
      label: EPaymentMethodDisplayNames[EPaymentMethod.VISA_MASTERCARD],
    },
    {
      value: EPaymentMethod.USDC,
      label: EPaymentMethodDisplayNames[EPaymentMethod.USDC],
    },
  ];

  const showPaymentMethodModal = () => setIsPaymentMethodModalVisible(true);
  const hidePaymentMethodModal = () => setIsPaymentMethodModalVisible(false);

  const handlePaymentMethodSubmit = async (
    selectedPaymentMethod: EPaymentMethod
  ) => {
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
        console.error(error);
      }
    }
  };

  const handleSaveAsDraft = () => {
    setIsActivateModalVisible(false);
    setProgramToActivate(null);
    handleGoBack();
  };

  const navigate = useNavigate();
  const {
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    values,
    isValid,
    dirty,
    submitForm,
  } = formik;

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

  const handleGoBack = () => {
    navigate(-1);
  };

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

  const getProgramSummary = () => {
    if (!programToActivate) return null;

    const strategyDisplayName =
      EProgramStrategyDisplayNames[programToActivate.strategy];

    let strategyText: string = strategyDisplayName;
    if (programToActivate.strategy === EProgramStrategy.PERCENT_BACK) {
      if (programToActivate.offerType === EOfferType.POINTS_CASHBACK) {
        strategyText = `Instant Cashback ${programToActivate.percentBack}%`;
      } else {
        strategyText = `${programToActivate.percentBack} Points`;
      }
    } else if (programToActivate.strategy === EProgramStrategy.SPEND_TO_EARN) {
      if (programToActivate.offerType === EOfferType.POINTS_CASHBACK) {
        strategyText = `Instant Cashback ${programToActivate.rewardPercent}%`;
      } else {
        strategyText = `${programToActivate.rewardPercent} Points`;
      }
    }

    return {
      name: programToActivate.name,
      budget: `$${programToActivate.budget?.toFixed(2) || '0.00'}`,
      strategy: strategyText,
    };
  };

  const renderOfferTypeFields = () => {
    if (
      strategy === EProgramStrategy.PERCENT_BACK &&
      offerType === EOfferType.POINTS_CASHBACK
    ) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Slider
              value={[Number(percentBack) || 0]}
              onValueChange={value =>
                setFieldValue('percentBack', value[0].toString())
              }
              max={100}
              step={1}
              className="flex-1"
              hideThumb
            />
            <span className="text-white text-sm min-w-[40px]">
              {Number(percentBack) || 0}%
            </span>
          </div>
        </div>
      );
    }

    if (
      strategy === EProgramStrategy.PERCENT_BACK &&
      offerType === EOfferType.FIXED_AMOUNT_POINTS
    ) {
      return (
        <Input
          required
          label="Amount of CAD Points"
          value={percentBack?.toString() || ''}
          onChange={handleChange('percentBack')}
          onBlur={handleBlur('percentBack')}
          placeholder="Enter amount"
          error={
            touched.percentBack && errors.percentBack
              ? errors.percentBack
              : undefined
          }
        />
      );
    }

    if (
      strategy === EProgramStrategy.SPEND_TO_EARN &&
      offerType === EOfferType.POINTS_CASHBACK
    ) {
      return (
        <div className="space-y-6">
          <Input
            required
            leftMask="CAD"
            label="Amount to Spend"
            value={spendThreshold?.toString() || ''}
            onChange={handleChange('spendThreshold')}
            onBlur={handleBlur('spendThreshold')}
            placeholder="Enter amount"
            error={
              touched.spendThreshold && errors.spendThreshold
                ? errors.spendThreshold
                : undefined
            }
          />

          <Input
            required
            label="% of Cashback"
            value={rewardPercent?.toString() || ''}
            onChange={handleChange('rewardPercent')}
            onBlur={handleBlur('rewardPercent')}
            placeholder="Enter percentage"
            error={
              touched.rewardPercent && errors.rewardPercent
                ? errors.rewardPercent
                : undefined
            }
          />
        </div>
      );
    }

    if (
      strategy === EProgramStrategy.SPEND_TO_EARN &&
      offerType === EOfferType.FIXED_AMOUNT_POINTS
    ) {
      return (
        <div className="space-y-6">
          <Input
            required
            leftMask="CAD"
            label="Amount to Spend"
            value={spendThreshold?.toString() || ''}
            onChange={handleChange('spendThreshold')}
            onBlur={handleBlur('spendThreshold')}
            placeholder="Enter amount"
            error={
              touched.spendThreshold && errors.spendThreshold
                ? errors.spendThreshold
                : undefined
            }
          />

          <Input
            required
            label="Amount of CAD Points"
            value={rewardPercent?.toString() || ''}
            onChange={handleChange('rewardPercent')}
            onBlur={handleBlur('rewardPercent')}
            placeholder="Enter amount of points"
            error={
              touched.rewardPercent && errors.rewardPercent
                ? errors.rewardPercent
                : undefined
            }
          />
        </div>
      );
    }

    return null;
  };

  return (
    <FormikProvider value={formik}>
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="flex h-8 w-8 items-center justify-center transition-colors"
            aria-label="Go back"
          >
            <ArrowLeftIcon width={20} height={20} />
          </button>
          <h1 className="text-3xl font-medium text-foreground">{title}</h1>
        </div>

        <Card className="p-4 md:p-8">
          <CardHeader className="flex flex-row items-center justify-between p-0 mb-5">
            <CardTitle className="text-2xl text-white">General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-0">
            <Input
              required
              label="Offer Name"
              value={name}
              onChange={handleChange('name')}
              onBlur={handleBlur('name')}
              placeholder="Enter program name"
              error={touched.name && errors.name ? errors.name : undefined}
            />

            <div className="space-y-2">
              <RadioGroup
                value={strategy}
                onValueChange={handleStrategyChange}
                className="flex flex-row gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={EProgramStrategy.PERCENT_BACK}
                    id="percent-back"
                  />
                  <Label
                    htmlFor="percent-back"
                    className="font-normal cursor-pointer"
                  >
                    {EProgramStrategyDisplayNames.PERCENT_BACK}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={EProgramStrategy.SPEND_TO_EARN}
                    id="spend-to-earn"
                  />
                  <Label
                    htmlFor="spend-to-earn"
                    className="font-normal cursor-pointer"
                  >
                    {EProgramStrategyDisplayNames.SPEND_TO_EARN}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Input
                  required
                  leftMask="CAD"
                  label="Budget"
                  value={budget?.toString()}
                  onChange={handleChange('budget')}
                  onBlur={handleBlur('budget')}
                  placeholder="Enter Budget"
                  error={
                    touched.budget && errors.budget ? errors.budget : undefined
                  }
                />
                <p className="text-sm text-[#BFBFBF] mt-1">
                  Set a budget higher than 0
                </p>
              </div>
              <div className="relative">
                <Input
                  required
                  leftMask="CAD"
                  label="Max Daily Budget"
                  value={maxDailyBudget?.toString()}
                  onChange={handleChange('maxDailyBudget')}
                  onBlur={handleBlur('maxDailyBudget')}
                  placeholder="Enter Max Daily Budget"
                  error={
                    touched.maxDailyBudget && errors.maxDailyBudget
                      ? errors.maxDailyBudget
                      : undefined
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 md:p-8">
          <CardHeader className="p-0 mb-5">
            <CardTitle className="text-2xl text-white">Offer Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-0">
            <div className="space-y-2">
              <Label>Offer Type</Label>
              <RadioGroup
                value={offerType}
                onValueChange={handleOfferTypeChange}
                className="flex flex-row gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={EOfferType.POINTS_CASHBACK}
                    id="points-cashback"
                  />
                  <Label
                    htmlFor="points-cashback"
                    className="font-normal cursor-pointer"
                  >
                    {EOfferTypeDisplayNames.POINTS_CASHBACK}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={EOfferType.FIXED_AMOUNT_POINTS}
                    id="fixed-amount-points"
                  />
                  <Label
                    htmlFor="fixed-amount-points"
                    className="font-normal cursor-pointer"
                  >
                    {EOfferTypeDisplayNames.FIXED_AMOUNT_POINTS}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {renderOfferTypeFields()}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={submitForm}
              disabled={!isValid || !dirty || loading}
              className="flex-1 bg-[#0C1A31] border-none text-[#639CF8]"
            >
              {loading ? 'Saving...' : 'Save as Draft'}
            </Button>
            {showPayButton && (
              <Button
                onClick={showPaymentMethodModal}
                disabled={
                  !isValid || !dirty || Number(budget) === Number(initialBudget)
                }
                className="flex-1"
              >
                Pay
              </Button>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGoBack}
              className="text-sm text-[#3C83F6] hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Payment Method Modal */}
      <Dialog
        open={isPaymentMethodModalVisible}
        onOpenChange={setIsPaymentMethodModalVisible}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Payment Method</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <RadioGroup
              value={selectedPaymentMethod}
              onValueChange={value =>
                setSelectedPaymentMethod(value as EPaymentMethod)
              }
              className="space-y-3"
            >
              {paymentMethodOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="font-normal cursor-pointer text-white"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button
              onClick={() => handlePaymentMethodSubmit(selectedPaymentMethod)}
              className="w-full"
              disabled={!selectedPaymentMethod}
            >
              Pay
            </Button>
            <Button
              variant="ghost"
              onClick={hidePaymentMethodModal}
              className="w-full text-[#3C83F6]"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activate Program Modal */}
      <Dialog
        open={isActivateModalVisible}
        onOpenChange={setIsActivateModalVisible}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activate Program?</DialogTitle>
            <DialogDescription className="text-[#BFBFBF]">
              Once the program is activated it can't be changed. If you want to
              activate this program later save this program as a draft.
            </DialogDescription>
          </DialogHeader>
          {programToActivate && (
            <div className="space-y-3 py-4">
              <div className="flex items-center gap-3 text-white">
                <Gem className="h-5 w-5 text-[#639CF8]" />
                <span>{getProgramSummary()?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <DollarSign className="h-5 w-5 text-[#639CF8]" />
                <span>{getProgramSummary()?.budget}</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Zap className="h-5 w-5 text-[#639CF8]" />
                <span>{getProgramSummary()?.strategy}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleActivateProgram} className="w-full">
              Activate Program
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveAsDraft}
              className="w-full bg-[#0C1A31] border-none text-[#639CF8]"
            >
              Save as Draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormikProvider>
  );
};
