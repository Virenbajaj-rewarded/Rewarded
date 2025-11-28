import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddressAutocomplete } from '@/components/ui/address-autocomplete';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { EIndustry, EIndustryDisplayNames } from '@/enums';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ERole } from '@/enums';
import { useSignupMerchant } from './useSignupMerchant';
import { FormikProvider } from 'formik';
import { ROUTES } from '@/routes';
import ArrowLeftIcon from '@/assets/arrow-left.svg?react';
import { Stepper } from '@/components/ui/stepper';

const steps = [
  { id: 'personal', label: 'Personal Info' },
  { id: 'business', label: 'Business Details' },
];

const SignupMerchant = () => {
  const {
    formik,
    isLoading,
    currentStep,
    handleNext,
    handleStepClick,
    isStep1Valid,
  } = useSignupMerchant();
  return (
    <FormikProvider value={formik}>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-7">
          <CardHeader className="text-center p-0 mb-7">
            <div className="flex items-center gap-2 mb-4">
              <Link to={`${ROUTES.CHOOSE_ROLE}?role=${ERole.MERCHANT}`}>
                <ArrowLeftIcon width={24} height={24} />
              </Link>
              <CardTitle className="text-3xl font-bold">
                Create Your Account
              </CardTitle>
            </div>

            <CardDescription className="text-[14px] text-[#BFBFBF] text-left">
              Enter your details to start. We’ll verify your information, then
              you can complete your business setup.{' '}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 w-full">
            <Stepper
              steps={steps}
              currentStep={currentStep}
              className="mb-8"
              onStepClick={handleStepClick}
              disabledSteps={currentStep === 1 && !isStep1Valid ? [2] : []}
            />

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {currentStep === 1 && (
                <>
                  <div className="space-y-2">
                    <Input
                      label="Full Name"
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                      error={formik.touched.fullName && formik.errors.fullName}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      label="Email"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                      error={formik.touched.email && formik.errors.email}
                    />
                  </div>

                  <div className="space-y-2">
                    <Input
                      label="Phone Number"
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                      error={
                        formik.touched.phoneNumber && formik.errors.phoneNumber
                      }
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleNext}
                    className="w-full"
                    disabled={!isStep1Valid}
                  >
                    Next
                  </Button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <Input
                      label="Business Name"
                      id="businessName"
                      name="businessName"
                      placeholder="Enter your business name"
                      value={formik.values.businessName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required
                      error={
                        formik.touched.businessName &&
                        formik.errors.businessName
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Select
                      label="Industry"
                      required
                      value={formik.values.industry}
                      onValueChange={value => {
                        formik.setFieldValue('industry', value);
                        formik.setFieldTouched('industry', true, false);
                      }}
                      error={formik.touched.industry && formik.errors.industry}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(EIndustry).map(industry => (
                          <SelectItem key={industry} value={industry}>
                            {EIndustryDisplayNames[industry]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <AddressAutocomplete
                      required
                      label="Business Address"
                      placeholder="Enter your business address"
                      value={formik.values.location?.address ?? ''}
                      onChange={value => {
                        formik.setFieldValue('location.address', value);
                      }}
                      onAddressSelect={address => {
                        formik.setFieldValue(
                          'location.address',
                          address.address
                        );
                        formik.setFieldValue('location.latitude', address.lat);
                        formik.setFieldValue('location.longitude', address.lng);
                        formik.setFieldTouched('location.address', true);
                      }}
                      error={
                        formik.touched.location?.address &&
                        formik.errors.location?.address
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="agreedToTerms"
                        checked={formik.values.agreedToTerms}
                        onCheckedChange={checked => {
                          formik.setFieldValue('agreedToTerms', checked);
                          formik.setFieldTouched('agreedToTerms', true, false);
                        }}
                        className="mt-1"
                      />
                      <Label
                        htmlFor="agreedToTerms"
                        className="text-sm font-normal leading-relaxed cursor-pointer"
                      >
                        By signing up, you agree to our{' '}
                        <Link
                          to="/terms-and-conditions"
                          className="text-primary hover:text-primary/80 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Terms and Conditions
                        </Link>
                        . Please read the full Terms and Conditions before
                        completing registration.
                      </Label>
                    </div>
                    {formik.touched.agreedToTerms &&
                      formik.errors.agreedToTerms && (
                        <p className="text-sm text-[#F5222D]">
                          {formik.errors.agreedToTerms}
                        </p>
                      )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!formik.isValid || !formik.dirty}
                  >
                    {isLoading ? 'Loading...' : 'Next'}
                  </Button>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </FormikProvider>
  );
};

export default SignupMerchant;
